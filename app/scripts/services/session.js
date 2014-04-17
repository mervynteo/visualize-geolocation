'use strict';

angular.module('uberLocationApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
