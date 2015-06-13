'use strict';

angular.module('FileSync')
  .factory('ChatService', function (SocketIOService) {
    return {
      sendMessage: function (message) {
        SocketIOService.broadcastChatMessage(message);
      }
    };
  });
