'use strict';
angular.module('FileSync')
    .factory('CommentService', function (SocketIOService) {
        var comments = {};

        SocketIOService.onNewComment(function (filename, comment) {
            // initialize property if doesn't exist
            if (!comments.hasOwnProperty(filename)) {
                comments[filename] = [];
            }
            
            comments[filename].unshift(comment);
        });

        return {
            comments: comments,
            addComment: SocketIOService.addComment
        };
});