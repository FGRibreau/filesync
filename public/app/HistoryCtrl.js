'use strict';
angular.module('FileSync').controller('HistoryCtrl', ['HistoryService','VisibilityService',
  function (HistoryService, VisibilityService) {
    this.edits = HistoryService.edits;
    this.visibility = VisibilityService;

    this.remove = function (edit) {
      HistoryService.remove(edit);
    };

    this.merge = function (edit) {
      console.log(this.mergePath);
      if (this.mergePath===undefined){
        alert("vous devez saisir le chemin pour merger");
      }
      else{
      HistoryService.merge(edit,this.mergePath);
    }
    };
  }
]);
