'use strict';
angular.module('FileSync')
	.factory('ChatColorService', function () {
		function syntaxColor(message, regEx, color) {
	    	return message.replace(regEx, function (match) {
	    			return '<span class="'+color+'">'+match+'</span>';
	    	});
	    };

	    return {
	    	colorChat: function(message) {
	    		//Modifie les "if", "while", "for" et "do" en rouge gras
	    		var regEx = /(if)|(while)|(for)|(do)/g;
	    		var color = 'red';
	    		message = syntaxColor(message, regEx, color);

	    		//Modifie les types en gras bleu
	    		var regEx = /(int)|(char)|(float)|(double)|(var)|(string)|(function)/g;
	    		color = 'blue';
	    		message = syntaxColor(message, regEx, color);

	    		var regEx = /(\'[a-zA-Z0-9]*\')/g;
	    		color = 'yellow';
	    		message = syntaxColor(message, regEx, color);

	    		var regEx = /(return)|(true)|(false)/g;
	    		color = 'green';
	    		message = syntaxColor(message, regEx, color);

	    		return message;
	    	}
	    }
	});