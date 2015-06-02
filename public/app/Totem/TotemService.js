'use strict';

angular.module('FileSync')
  .factory('TotemService', function (SocketIOService) {
  	var totemService = { amIAdmin: false };
    
    SocketIOService.amIAdmin(
    	function(_amIAdmin) {
       		totemService.amIAdmin = _amIAdmin;
    	}
    );

    return totemService; 
  });