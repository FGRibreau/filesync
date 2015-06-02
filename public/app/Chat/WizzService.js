'use strict';

angular.module('FileSync')
  .factory('WizzService', function (SocketIOService) {
    return {
      sendWizz: function () {
        SocketIOService.broadcastChatWizz();
      }
    };
  });
