// https://nodejs.org/api/events.html
var EventEmitter = require('events').EventEmitter;
var em = new EventEmitter();

em.on2('changed', function(value){
  console.log('ok', value);
});

em.emit('plop', 'sodk', 'dfdf', 'sddfdf');

em.emit('changed', true);
