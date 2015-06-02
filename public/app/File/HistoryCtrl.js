'use strict';
angular.module('FileSync').controller('HistoryCtrl', ['HistoryService', 'VisibilityService',
  function (HistoryService, VisibilityService) {
    this.edits = HistoryService.edits;
    this.visibility = VisibilityService;

    this.remove = function (edit) {
      HistoryService.remove(edit);
    };
  }
]);
