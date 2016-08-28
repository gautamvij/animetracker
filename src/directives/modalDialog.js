
animetracker.directive('modalDialog', [function() {
  'use strict';
  return {
    restrict: 'E',
    scope: {
      show: '=',
      adddata: '=',
      removedata: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show.data.toShow = false;
        for(var p in scope.show.dataLink)
          if(scope.show.dataLink.hasOwnProperty(p))
            scope.show.dataLink[p] = '';
      };
    },
    templateUrl: './directives/modalPop.html' 
  };
}]);