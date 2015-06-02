'use strict';

angular.module('FileSync')
  .controller('ChatCtrl', function ($scope, SocketIOService, ChatHistoryService, ChatService) {
    this.messages = ChatHistoryService.messages;
    this.sendMessage = ChatService.sendMessage;
    this.deleteMessage = ChatHistoryService.deleteMessage;
    this.message = '';

    SocketIOService.onChatMessage(function (userid, message) {
      $scope.$apply();
      $scope.$emit('reload');
    }.bind(this));


    SocketIOService.onChatWizz(function (message) {
      // on new chat message from another user
      var conteneur = document.getElementById('messageChatConteneur');
      conteneur.className = "wizz";
      var player = document.querySelector('#audioPlayer');
      player.play();

      setTimeout(function () {
        conteneur.className = "";
      }, 1000);
      //this.messages.push({"id":userid, "msg": message});
      //$scope.$apply();
    }.bind(this));

    this.wizz = function () {
      SocketIOService.broadcastChatWizz();
    }.bind(this);
  });
