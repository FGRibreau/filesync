'use strict';

angular.module('FileSync')
  .controller('ChatCtrl', function ($scope, SocketIOService, ChatHistoryService, ChatService, WizzService) {
    this.messages = ChatHistoryService.messages;
    this.sendMessage = ChatService.sendMessage;
    this.deleteMessage = ChatHistoryService.deleteMessage;
    this.message = '';
    this.wizz = WizzService.sendWizz;

    SocketIOService.onChatMessage(function (userid, message) {
      $scope.$apply();
      $scope.$emit('reload');
      $scope.$emit('submit');
    }.bind(this));


    SocketIOService.onChatWizz(function () {
      $scope.$apply();
      $scope.$emit('wizz');
    }.bind(this));

    
  });
