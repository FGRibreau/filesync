'use strict';
angular.module('FileSync')
  .factory('HistoryService', function (SocketIOService, _, NotificationService) {
    var edits = [];

    SocketIOService.onFileChanged(function (filename, timestamp, content) {
      edits.unshift({
        filename: filename,
        timestamp: timestamp,
        content: content
      });
      NotificationService.notifyModif(filename,timestamp);
    });

    return {
      edits: edits,
      remove: function (edit) {
        _.remove(edits, edit);
      }
    };
  });

