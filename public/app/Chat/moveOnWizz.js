'use strict';

angular
  .module('FileSync')
  .directive('moveOnWizz', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$on('wizz', function () {
          console.log("wizz");
           //element[0].addClass("wizz");
           element[0].className="wizz";
           var player = document.querySelector('#audioPlayer');
           player.play();

            setTimeout(function () {
            	element[0].className="";
              //element[0].removeClass( "wizz" );
            }, 1000);

        });
      }
    };
  });
