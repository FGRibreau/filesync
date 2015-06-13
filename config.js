'use strict';
module.exports = function (logger) {
  var env = require('common-env/withLogger')(logger);

  return env.getOrElseAll({
    auth: {
      token: 'please-define-one'
    },
    server: {
      exposed_endpoint: 'http://127.0.0.1:3000',
      port: 3000
    },
    relay: {

    }
  });
};
