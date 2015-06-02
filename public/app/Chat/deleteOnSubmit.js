'use strict';

angular
  .module('FileSync')
  .directive('deleteOnSubmit', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$on('submit', function () {
          element[0].value = "";
        });
      }
    };
  });
