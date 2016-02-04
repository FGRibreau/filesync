'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
var _ = require('lodash');

var logger = require('winston');
var config = require('./config')(logger);

app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(config.server.port,  function() {
  logger.info('Server listening on %s', config.server.port);
});


var sio = io(server);

sio.set('authorization', function(handshakeData, accept) {
  // @todo use something else than a private `query`
  handshakeData.isAdmin = handshakeData._query.access_token === config.auth.token;
  accept(null, true);
});

function Viewers(sio) {
  var data = [];

  function notifyChanges() {
    sio.emit('viewers:updated', data);
  }

  return {
    add: function add(nickname) {
      data.push(nickname);
      notifyChanges();
    },
    remove: function remove(nickname) {
      var idx = data.indexOf(nickname);
      if (idx > -1) {
        data.splice(idx, 1);
      }
      notifyChanges();
      console.log('-->', data);
    }
  };
}

var viewers = Viewers(sio);

function FileHistory(options) {
  var maxSize = options.maxSize || 10;
  /**
   * filename: [basename, updatedAt, content]
   * @type {Object}
   */

  var history = {};

  this.length = function() {
    return Object.keys(history);
  };

  this.add = function(basename, updatedAt, content) {
    history[basename] = [basename, updatedAt, content];

    if (this.length >= maxSize) {
      var keyToRemove = _.chain(history)
        .sortBy(1) // sort by updatedAt
        .first() // get the oldest entry in history
        .first() // get "basename"
        .value();

      console.log(keyToRemove);
      delete history[keyToRemove];
    }

    console.log(history);
  };

  this.forEach = function(f) {
    _.values(history).forEach(f);
  };

}

var history = new FileHistory({
  maxSize: 10
});

function notifyFileChanged(basename, updatedAt, content) {
  // forward the event to everyone
  sio.emit('file:changed', basename, updatedAt, content);
}

// @todo extract in its own
sio.on('connection', function(socket) {

  socket.on('message', function(message){
    sio.emit('message', message);
  });

  // console.log('nouvelle connexion', socket.id);
  socket.on('viewer:new', function(nickname) {
    socket.nickname = nickname;
    viewers.add(nickname);
    console.log('new viewer with nickname %s', nickname, viewers);
  });

  // nouveau
  // var i = 0;
  // setInterval(function(){
  //   socket.emit('message', 'hello world ' + (i++));
  // }, 1000);
  // /nouveau

  socket.on('fg', function(a, b){
    console.log(a, b);
  })

  socket.on('disconnect', function() {
    viewers.remove(socket.nickname);
    console.log('viewer disconnected %s\nremaining:', socket.nickname, viewers);
  });

  socket.on('file:changed', function(basename, updatedAt, content) {
    if (!socket.conn.request.isAdmin) {
      // if the user is not admin
      // skip this
      return socket.emit('error:auth', 'Unauthorized :)');
    }

    history.add(basename, updatedAt, content);
    notifyFileChanged(basename, updatedAt, content);
  });

  // replay history to the newly connected user
  history.forEach(notifyFileChanged);

  socket.visibility = 'visible';

  socket.on('user-visibility:changed', function(state) {
    socket.visibility = state;
    sio.emit('users:visibility-states', getVisibilityCounts());
  });
});

function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}
