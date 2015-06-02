'use strict';
angular.module('FileSync')
  .controller('ChatCtrl', function ($scope, SocketIOService) {
    this.messages = ['Bienvenue sur le chat'];
    this.message = '';

    SocketIOService.onChatMessage(function (userid, message) {
      // on new chat message from another user
      this.messages.push("------------------------------");
      this.messages.push(" - " + message);
      $scope.$apply();
    }.bind(this));

    this.sendMessage = function () {
      SocketIOService.broadcastChatMessage(this.message);
      this.message = '';
    }.bind(this);

    this.sendSound = function (message){
      SocketIOService.broadcastChatMessage('Son : ' + message);
      var audioElm = document.getElementById('audio' + message); 
      audioElm.src = document.getElementById('audioFile' + message).value;
      audioElm.play();
    }
  });