/*
  The controler allow to send image and message in a chat
*/

'use strict';
angular.module('FileSync').controller('ChatCtrl', function ($scope, SocketIOService, ChatService, $sce) {
    this.messages = ChatService.messages;
    this.inputValue = '';

    SocketIOService.onChatMessageReceived(function (author, message) {
      this.messages.push({
      	content: message,
      	timestamp: ChatService.getFomatedTimestamp(),
      	author: author // TODO: Bind the user name to the socket id
      });

      $scope.$apply();
    }.bind(this));

    this.sendMessage = function () {
      ChatService.sendMessage(this.inputValue);
      this.inputValue = '';
    };

    this.deleteMessage = function (index) {
      ChatService.deleteMessage(index);
    };

    this.formatMessage = function(message){
      return ChatService.formatMessage(message, $sce);
    }
 });