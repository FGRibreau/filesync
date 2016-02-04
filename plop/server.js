function Gaze() {
  this.a = 1;
}


Gaze.prototype.watched = function() {
  console.log(this.a);
};

var gaze = new Gaze();
gaze.watched();

var gaze = require('gaze');

gaze('/tmp/**.js', function(err, watcher) {
  if (err) {
    throw err;
  }

  // Get all watched files
  this.watched(function(err, watched) {
    console.log(watched);
  });

  // On changed/added/deleted
  this.on('all', function(event, filepath) {
    console.log(filepath + ' was ' + event);
  });

  // this.emit('all', 'destroyedForever', '/');

  // var EE = require('events').EventEmitter;
  // eventEmitter.on('click', functiona(wasClicked){console.log('was clicked:', wasClicked);});
  // eventEmitter.emit('click2', true);
});

// var http = require('http');
// gaze('./**', function(err, watcher) {
//   if (err) {
//     throw err;
//   }
//
//   // Get all watched files
//   this.watched(function(err, watched) {
//     console.log(watched);
//   });
//
// });
