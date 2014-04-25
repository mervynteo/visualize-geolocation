'use strict';

angular.module('uberLocationApp')
  .directive('googleMapDirective', function () {
    return {
      templateUrl: '../../views/partials/googlemap.html',
      restrict: 'E'
    };
  });
