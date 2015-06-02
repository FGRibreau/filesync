'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
var _ = require('lodash');

var logger = require('winston');
var config = require('./config')(logger);
var UserListService = require('./UserListService');

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
      // if the user is not admin
      // skip this
      return socket.emit('error:auth', 'Unauthorized :)');
    }

    // save it
    // historyPersistence.persist(filePath, timestamp, content, function (err) {
    // if (err) {
    // console.error(err);
    // return socket.emit('file:changed:error', err);
    // }

    // forward the event to everyone
    sio.emit.apply(sio, ['file:changed'].concat(_.toArray(arguments)));
    // });

  });

  // socket.on('history:getHistory', historyPersistence.getHistory);

  socket.visibility = 'visible';

  socket.on('user-visibility:changed', function (state) {
    UserListService.update(socket, {
      visibility: state
    });

    sio.emit('user:list', UserListService.getAll(sio.sockets.sockets));
  });

  socket.on('user:add', function(name){
    UserListService.update(socket, {
      name: name
    });
    sio.emit('user:list:updated', getUsers());
  })
});


function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}

function getUsers(){
   return _.chain(sio.sockets.sockets).values().pluck('user').compact().value();
}