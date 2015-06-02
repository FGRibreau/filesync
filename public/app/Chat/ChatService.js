'use strict';
angular.module('FileSync')
	.factory('ChatService', ['SocketIOService', 'ChatColorService', '$sce', function (SocketIOService, ChatColorService, $sce) {
		var messages = [];

	    SocketIOService.onChatMessage(function (userid, message) {
	      messages.push({user: userid, html: $sce.trustAsHtml(message)});
	    });

	    return {
	    	messages : messages,
	    	sendMessage : function (message) {
	    		message = ChatColorService.colorChat(message);
	    		SocketIOService.broadcastChatMessage(message);
	    	},
	    	removeMessage : function (index) {
	    		this.messages.splice(index, 1);
	    	}
	    };
	}]
); 