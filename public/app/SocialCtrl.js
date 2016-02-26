'use strict';
angular
  .module('FileSync')
  .controller('SocialCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.viewers = [];
    this.message = "";
    this.messages = [];

    function onViewersUpdated(viewers) {
      this.viewers = viewers;
      $scope.$apply();
    }
    
    SocketIOService.onViewersUpdated(onViewersUpdated.bind(this));
  }]);
