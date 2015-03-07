'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var _ = require('lodash');
var gaze = require('gaze');
var directory = path.resolve(__dirname, process.argv[2]);

if (!directory) {
  console.error("Usage: node server.js /path/to/directory");
  process.exit(1);
}

console.log('listening on %s', directory);
app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port)
});

var sio = io(server);

gaze(directory + '/**/*.js', function (err, watcher) {
  if (err) {
    throw err;
  }

  // Get all watched files
  this.watched(function (err, watched) {
    console.log(watched);
  });

  // On file changed
  this.on('changed', function (filepath) {
    sio.emit('file:changed',
      path.basename(filepath), +new Date(),
      fs.readFileSync(filepath, 'utf-8') // @todo use async mode
    );
  });

  // On file added
  this.on('added', function (filepath) {
    console.log(filepath + ' was added');
  });

  // On file deleted
  this.on('deleted', function (filepath) {
    console.log(filepath + ' was deleted');
  });

  // On changed/added/deleted
  this.on('all', function (event, filepath) {
    console.log(filepath + ' was ' + event);
  });

  // Get watched files with relative paths
  this.relative(function (err, files) {
    console.log(files);
  });

  // debug
  // (function loop() {
  //   this.emit('changed', '/Users/fg/Desktop/filesync/public/app/app.js');
  //   setTimeout(loop.bind(this), 10000);
  // }.bind(this))();
});

// @todo extract in its own
sio.on('connection', function (socket) {
  socket.visibility = 'visible';

  socket.on('user-visibility:changed', function (state) {
    socket.visibility = state;
    sio.emit('users:visibility-states', getVisibilityCounts());
  });

  socket.on('insert-into-database', function (user, f) {
    f(null, user);
  });
});

function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}
