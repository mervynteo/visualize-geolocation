'use strict';

angular.module('uberLocationApp')
  .controller('MainCtrl', function ($scope, $http, $resource) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

	$scope.locationParam = {};
	
	$scope.locationCreate = function(form) {
		console.log($scope.locationParam);
		var LocationResource = $resource('api/locations');
		var newLocation = new LocationResource($scope.locationParam);

		newLocation.$save();
		// try using angular resource to submit to rest endpoint here
	};
  });
