'use strict';

angular.module('FileSync')
  .factory('ChatService', function (SocketIOService) {
    return {
      sendMessage: function (message) {
        SocketIOService.broadcastChatMessage(message);
      },
      sendSound: function (sound) {
        SocketIOService.broadcastChatMessage("Son : " + sound);
        var audioElm = document.getElementById('audio' + sound); 
        audioElm.src = document.getElementById('audioFile' + sound).value;
        audioElm.play();
      }
    };
  });
