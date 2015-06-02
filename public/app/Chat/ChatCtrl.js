'use strict';

angular.module('FileSync')
  .controller('ChatCtrl', function ($scope, SocketIOService, ChatHistoryService, ChatService) {
    this.messages = ChatHistoryService.messages;
    this.deleteMessage = ChatHistoryService.deleteMessage;
    this.message = '';

    SocketIOService.onChatMessage(function (userid, message) {
      $scope.$apply();
      $scope.$emit('reload');
    }.bind(this));

    this.sendMessage = function (message) {
      ChatService.sendMessage(message);
      this.message = '';
    }.bind(this);

    this.sendSound = function (sound) {
      ChatService.sendSound(sound);
    }.bind(this);

  });