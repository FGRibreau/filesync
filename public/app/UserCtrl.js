'use strict';
angular.module('FileSync')
  .controller('UserCtrl', ['$scope', 'SocketIOService', '_', function ($scope, SocketIOService, _) {
    this.name = prompt("Entrez votre nom :");
    this.users = [];


    SocketIOService.addMe(this.name);

    SocketIOService.onUserListUpdated(function(users){
    console.log('users', users);
      this.users = users;
      console.log(_.pluck(this.users, 'name'));
      $scope.$apply();
    }.bind(this));

    SocketIOService.onVisibilityStatesChanged(function(users){
    console.log('users', users);
      this.users = users;
      console.log(_.pluck(this.users, 'visibility'));
      $scope.$apply();  
    }.bind(this));
  }
  ]);