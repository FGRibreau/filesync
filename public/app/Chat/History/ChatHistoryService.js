'use strict';

angular.module('FileSync')
  .factory('ChatHistoryService', function (SocketIOService, _) {
    var chatHistory = {
      messages: [],
      deleteMessage: function (index) {
        this.messages.splice(index, 1);
      }
    };

    SocketIOService.onChatMessage(function (userid, message) {
      // on new chat message from another user
      chatHistory.messages.push({
        "id": userid,
        "msg": message
      });
    });

    return chatHistory;
  });
