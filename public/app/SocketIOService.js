'use strict';
angular.module('FileSync')
	.factory('SocketIOService', ['io', '_', '$timeout', function (io, _, $timeout) {
		var socket = io('http://127.0.0.1:3000',
						{resource: '/?access_token='});
		var _onFileChanged = _.noop;
		var _onVisibilityStatesChanged = _.noop;

		socket.on('connect', function () {
			console.log('connected'); // @todo display it on screen using a notifier
		});

		socket.on('file:changed', function (filename, timestamp, content) {
			$timeout(function () {
				_onFileChanged(filename, timestamp, content);
			});
		});

		socket.on('users:visibility-states', function (states) {
			$timeout(function () {
				_onVisibilityStatesChanged(states);
			});
		});

		socket.on('error:auth', function (err) {
			// @todo yeurk
			alert(err);
		});

		return {
			onFileChanged: function (f) {
				_onFileChanged = f;
			},

			onVisibilityStatesChanged: function (f) {
				_onVisibilityStatesChanged = f;
			},

			amIAdmin: function (f) {
				socket.emit('amIAdmin', f);
			},

			userChangedState: function (state) {
				socket.emit('user-visibility:changed', state);
			},

			broadcastSentAnswer: function (answer) {
				socket.emit('user-answer:sent', answer);
			},

			onAnswerSent: function (f) {
				socket.on('user-answer:sent', f);
			},

			broadcastAddedQuestion: function (question) {
				socket.emit('admin-question:added', question);				
			},

			broadcastAddedPossibleAnswer: function (possibleAnswer) {
				socket.emit('admin-possibleAnswer:added', possibleAnswer);				
			},

			broadcastTrueAnswer: function (trueAnswer) {
				socket.emit('admin-trueAnswer:added', trueAnswer);				
			},

			onQuestionAdded: function (f) {
				socket.on('admin-question:added', f);
			},

			onPossibleAnswerAdded: function (f) {
				socket.on('admin-possibleAnswer:added', f);
			},

			onTrueAnswerAdded: function (f) {
				socket.on('admin-trueAnswer:added', f);
			},

			getPlayers: function (f) {
				socket.emit('players:got', f);
			},

			onGetPlayers : function (f) {
				socket.on('players:got', f);
			},

			endQuestion: function (f) {
				socket.emit('question:ended', f);
			},

			onQuestionEnded : function (f) {
				socket.on('question:ended', f);
			}				

		};
	}]);