'use strict';

angular.module('uberLocationApp')
  .controller('MainCtrl', function ($scope, $http, $resource) {
    var LocationResource = $resource('api/locations');

    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
    google.maps.visualRefresh = true;

    $scope.map = {
    center: {
      latitude: 49.25,
      longitude: -123.1
    },
    zoom: 12,
    dragging: false,
    bounds: {},
    options: {
      streetViewControl: false,
      panControl: false,
      maxZoom: 20,
      minZoom: 3
    },
    control: {}
      };

    $scope.createLocationParam = {};

    $scope.locationCreate = function(form) {
      console.log($scope.createLocationParam);
      var newLocation = new LocationResource($scope.createLocationParam);

      newLocation.$save();
    };

    $scope.existingLocations = LocationResource.query();
    
    $scope.existingLocations.$promise.then(function(result) {
      console.log(result);
      $scope.existingLocations = result;
    });
  });
