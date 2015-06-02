'use strict';
angular.module('FileSync')
	.controller('ChatCtrl', ['ChatService', 'SocketIOService', '$scope', function (ChatService, SocketIOService, $scope) {
	    this.messages = ChatService.messages;
	    this.message = '';

	    SocketIOService.onChatMessage(function () {
	      	$scope.$apply();
	      	$scope.$emit('reload');
	    });

	    this.sendMessage = function (message) {
	      ChatService.sendMessage(message);
	      this.message = '';
	    }.bind(this);

	    this.removeMessage = function (index) {
	    	ChatService.removeMessage(index);
	    }.bind(this);

	  }]
);
