'use strict';
angular
  .module('FileSync')
  .controller('SocialCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.viewers = [];
    this.plop = '';
    this.messages = []; // chat messages
    this.message = ''; // current message to send

    SocketIOService.onChatMessage(function(message){
      this.messages.push(message);
      $scope.$apply();
    }.bind(this));

    this.sendMessage = function() {
      SocketIOService.sendChatMessage(this.message);
    };

    function onViewersUpdated(viewers) {
      this.viewers = viewers;
      $scope.$apply();
    }

    SocketIOService.onViewersUpdated(onViewersUpdated.bind(this));
  }]);
