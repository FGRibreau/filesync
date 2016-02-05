'use strict';
angular
  .module('FileSync')
  .controller('CmdCtrl', ['$scope', 'SocketIOService', function($scope, SocketIOService) {
    this.cmds = [];

    function onCmdtyped(cmd) {
      console.log(cmd);
      this.cmds.push(cmd);
      $scope.$apply();
    }

    SocketIOService.onCmdtyped(onCmdtyped.bind(this));
  }]);
