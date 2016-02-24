'use strict';
angular.module('FileSync').controller('CommentCtrl', ['$scope', 'CommentService', function ($scope, CommentService) {
    this.comments = CommentService.comments;
    this.comment = "";
    $scope.commentBoxOpened = false;
    
    this.actionCommentBox = function() {
        $scope.commentBoxOpened = !$scope.commentBoxOpened;
    };
    
    this.addComment = function(filename) {
        CommentService.addComment(filename, this.comment);
        this.comment = "";
    }
  }
]);