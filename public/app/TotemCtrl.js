'use strict';
angular.module('FileSync').controller('TotemCtrl', ['SocketIOService',
  function (SocketIOService) {
    var TotemControl = this;

    // debug 001
    TotemControl.isAdmin = 'Value before';

    this.isAdmin = SocketIOService.amIAdmin(function(amIAdmin){
    	return amIAdmin;
    });

    // debug 002
    this.isAdmin = 'Value after';
    this.changeTotemOwner = function() {
      SocketIOService.changeTotemOwner();
    };
  }
]);
