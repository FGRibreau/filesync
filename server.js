'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var _ = require('lodash');

var logger = require('winston');
var config = require('./config')(logger);

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
  socket.on('file:changed', function () {
    if (!socket.conn.request.isAdmin) {
      // if the user is not admin
      // skip this
      return socket.emit('error:auth', 'Unauthorized :)');
    }

    // forward the event to everyone
    sio.emit.apply(sio, ['file:changed'].concat(_.toArray(arguments)));
  });

  socket.visibility = 'visible';

  socket.on('user-visibility:changed', function (state) {
    socket.visibility = state;
    sio.emit('users:visibility-states', getVisibilityCounts());
  });
  
  socket.on('user-merge', function (edit,filepath) {
	  fs.writeFileSync(filepath, edit.content,'utf8');
	  console.log('merge réussi sur'+ filepath);
  });
  
});

function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}
