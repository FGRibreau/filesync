'use strict';
angular.module('FileSync')
    .controller('TotemCtrl',  function ($scope, SocketIOService, TotemService) {
    this.totemService = TotemService;

    SocketIOService.onTotemOwnerChanged(function(response){
        console.log("Am I the totem owner? : " + response.isMe);
        $scope.$apply();
        $scope.$emit('reload');
    }.bind(this));

    this.changeTotemOwner = function() {
      SocketIOService.changeTotemOwner();
    }.bind(this);
  }
);
