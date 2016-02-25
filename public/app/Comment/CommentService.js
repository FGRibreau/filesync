'use strict';
angular.module('FileSync')
    .factory('CommentService', function (SocketIOService) {
        var comments = {};

        SocketIOService.onNewComment(function (filename, comment, username, createdAt) {
            // initialize property if doesn't exist
            if (!comments.hasOwnProperty(filename)) {
                comments[filename] = [];
            }
            
            comments[filename].unshift({
                content: comment,
                username: username,
                createdAt: createdAt,
            });
        });

        return {
            comments: comments,
            addComment: SocketIOService.addComment
        };
});