'use strict';
angular.module('FileSync')
  .directive('totem', function (TotemCtrl) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$on('reload', function (response) {
          if (response != null){
            if (response.isMe){
              element.classList.add('active');
            } else {
              element.classList.remove('active');
            }
          }
        });
      }
    };
  });