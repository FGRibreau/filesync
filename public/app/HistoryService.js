'use strict';
angular.module('FileSync')
  .factory('HistoryService', function (SocketIOService, _) {
    var edits = [];

    SocketIOService.onFileChanged(function (filename, timestamp, content, filepath) {
      edits.unshift({
        filename: filename,
        timestamp: timestamp,
        content: content,
		filepath: filepath
      });
    });

    return {
      edits: edits,
      remove: function (edit) {
        _.remove(edits, edit);
      },

      merge: function(edit){
		SocketIOService.merge(edit);
		console.log(edit.filepath);
      }
    };
  });
