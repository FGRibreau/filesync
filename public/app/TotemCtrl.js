'use strict';
angular.module('FileSync').controller('TotemCtrl', ['SocketIOService',
  function (SocketIOService) {
    this.isAdmin = SocketIOService.amIAdmin(function(amIAdmin){
    	amIAdmin;
	});

    var isAdmin = 'blabla';
    this.changeTotemOwner = function() {
      SocketIOService.changeTotemOwner();
    };
  }
]);
