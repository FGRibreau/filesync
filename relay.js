'use strict';
var io = require('socket.io-client');
var gaze = require('gaze');
var fs = require('fs');
var path = require('path');
var logger = require('winston');
var config = require('./config')(logger);

var directory = path.resolve(__dirname, process.argv[2]);

if (!directory) {
  console.error("Usage: node server.js /path/to/directory");
  process.exit(1);
}
console.log('listening on %s', directory);

var SOCKET_IO_URL = config.server.exposed_endpoint + '/?access_token=' + config.auth.token;
console.log('connecting on %s', SOCKET_IO_URL);
var sio = io(SOCKET_IO_URL, {
  transports: ['websocket', 'polling'],
  multiplex: false
});

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
  //(function loop() {
   // this.emit('changed', path.resolve(__dirname, 'public/app/app.js'));
   // setTimeout(loop.bind(this), 10000);
  //}.bind(this))();
});
