'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
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

  socket.on('amIAdmin', function(f){
    f(socket.conn.request.isAdmin);
  });

  socket.on('players:got', function(f){
    f(Object.keys(sio.engine.clients));
  });

  socket.on('question:ended', function(){
    sio.emit('question:ended');
  });

  socket.on('user-answer:sent', function(answer){
    sio.emit('user-answer:sent', answer, socket.id);
  });

  socket.on('admin-question:added', function(question){
    sio.emit('admin-question:added', question);
  });

  socket.on('admin-possibleAnswer:added', function(possibleAnswer){
    sio.emit('admin-possibleAnswer:added', possibleAnswer);
  });

  socket.on('admin-trueAnswer:added', function(trueAnswer){
    sio.emit('admin-trueAnswer:added', trueAnswer);
  });
  
  socket.on('user-visibility:changed', function (state) {
    socket.visibility = state;
    sio.emit('users:visibility-states', getVisibilityCounts());
  });
});

function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}
