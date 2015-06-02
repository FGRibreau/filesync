'use strict';
angular.module('FileSync').directive("fileread", 
    [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    }
}])
.controller('DiffCtrl', ['HistoryService', 
  function (HistoryService) {

  	this.localFile= "";
  	this.diff = "";

    this.computeDiff = function (edit) {
        HistoryService.computeDiff(edit, this.localFile);
    };
  }
]);
