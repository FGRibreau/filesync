'use strict';
angular.module('FileSync')
  .factory('HistoryService', function (SocketIOService, _) {
    var edits = [];

    SocketIOService.onFileChanged(function (filename, timestamp, content) {
      edits.unshift({
        filename: filename,
        timestamp: timestamp,
        content: content,
        diffs: []
      });
    });

    return {
      edits: edits,
      remove: function (edit) {
        _.remove(edits, edit);
      }, 
      computeDiff: function (edit, local) {
        var index = edits.indexOf(edit);
        var baseLines =  difflib.stringAsLines(edit.content);
        var localLines = difflib.stringAsLines(local);
        var diffs = new difflib.SequenceMatcher(localLines, baseLines).get_opcodes();
        
        edits[index].diffs = diffs
        .filter(function (diff) {
          return diff[0] != "equal";
        })
        .map(function(diff) {
            if(diff[0] === "delete") {
              return {
                baseClass: "",
                localClass: "danger",
                baseContent: "",
                localContent: localLines.slice(diff[1], diff[2]).join("\n")
              }
            }
            else if(diff[0] === "insert") {
              return {
                baseClass: "success",
                localClass: "",
                baseContent: baseLines.slice(diff[3], diff[4]).join("\n"),
                localContent: ""
              }
            }
            else if(diff[0] === "replace") {
              return {
                baseClass: "info",
                localClass: "info",
                baseContent: baseLines.slice(diff[1], diff[2]).join("\n"),
                localContent: localLines.slice(diff[3], diff[4]).join("\n")
              }
            }
        });
      }
    };
  });
