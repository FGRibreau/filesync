'use strict';

angular
  .module('FileSync')
  .directive('alwaysScrollToBottom', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$on('reload', function () {
          element[0].scrollTop = element[0].scrollHeight;
        });
      }
    };
  });
