'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
var _ = require('lodash');

var logger = require('winston');
var config = require('./server/config')(logger);

// History Persistence
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('dbHistoryPersistence.db');
var historyPersistence = require('./server/HistoryPersistenceCtrl');

// Database initialization
db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS historyDiff (filePath TEXT, timestamp DATETIME, content TEXT)");

/*
  // DEBUT TEST
  db.run("DELETE FROM historyDiff");
  var stmt = db.prepare("INSERT INTO historyDiff (filePath, timestamp, content) VALUES (?, ?, ?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i, new Date(), "test");
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, filePath, timestamp, content FROM historyDiff", function(err, row) {
      console.log(row.id + ": " + row.filePath + ", " + row.timestamp + ", " + row.content);
  });
  // FIN TEST
*/

});

app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(config.server.port, function () {
  logger.info('Server listening on %s', config.server.port);
});

var sio = io(server);

sio.set('authorization', function (handshakeData, accept) {
  // @todo use something else than a private `query`
  handshakeData.isAdmin = handshakeData._query.access_token === config.auth.token;
  accept(null, true);
});

// @todo extract in its own
sio.on('connection', function (socket) {
  socket.on('file:changed', function (filePath, timestamp, content) {
    if (!socket.conn.request.isAdmin) {
      // if the user is not admin, skip this
      return socket.emit('error:auth', 'Unauthorized :)');
    }
    // Save the diff for history persistence
    historyPersistence.persist(filePath, timestamp, content, function (err) {
      if (err) {
        console.error(err);
        return socket.emit('file:changed:error', err);
      }
      // forward the event to everyone
      sio.emit.apply(sio, ['file:changed'].concat(_.toArray(arguments)));
    });
  });

  socket.visibility = 'visible';

  socket.on('user-visibility:changed', function (state) {
    socket.visibility = state;
    sio.emit('users:visibility-states', getVisibilityCounts());
  });

});

function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}
