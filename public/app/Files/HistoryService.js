'use strict';
angular.module('FileSync')
  .factory('HistoryService', function (SocketIOService, _) {
    var edits = [];

    SocketIOService.onFileChanged(function (filename, timestamp, content) {
      edits.unshift({
        filename: filename,
        timestamp: timestamp,
        content: content
      });
    });

    return {
      edits: edits,
      remove: function (edit) {
        _.remove(edits, edit);
      }
    };
  });
