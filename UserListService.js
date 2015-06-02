'use strict';
var _ = require('lodash');

module.exports = {
  /**
   * [update description]
   * @param  {SocketIO.socket} socket         [description]
   * @param  {Object} userAttributes e.g.  {name: 'plop'}
   */
  update: function (socket, userAttributes) {
    socket.user = _.extend(socket.user || {}, userAttributes);
  },

  /**
   * @param  {Array[SocketIO.socket]} sockets
   * @return {Array}
   */
  getAll: function (sockets) {
    return _.chain(sockets).values().pluck('user').value();
  }
};