'use strict';

angular.module('uberLocationApp')
  .controller('MainCtrl', function ($scope, $http, $resource, $log) {
    var ResourceLocation = $resource('api/locations');
    var ResourceLocationId = $resource('api/locations/:id', {
      id: '@id'
    },{
      update: {
        method:'PUT',
        params: {}
      }
    });

    $scope.locationCreate = {
      params: {},
      status: {}
    };

    $scope.existingLocations = {};

    google.maps.visualRefresh = true;

    $scope.map = {
      center: {
        latitude: 37.7649,
        longitude: -122.4255
      },
      zoom: 13,
      dragging: false,
      bounds: {},
      options: {
        streetViewControl: false,
        panControl: false,
        maxZoom: 20,
        minZoom: 3,
        zoomControlOptions: {
          position: google.maps.ControlPosition.LEFT_CENTER
        }
      },
      control: {},
      clickedMarker: {
        latitude: null,
        longitude: null
      },
      dynamicMarkers: [
        {
          latitude: 49.26175546590094,
          longitude: -123.04447174072266,
          showWindow: false
        }
      ],
      events: {
        click: function (mapModel, eventName, originalEventArgs) {
          // 'this' is the directive's scope

          var e = originalEventArgs[0];

          /*
          * necessary to store current clicked coords outside of locationCreate.params model
          *   because upon naming our new location (in input text), it would cause a refresh on the model 
          * From UX perspective, the bouncing marker on current clicked position bounces each time
          *   text is edited in input box
          */
          $scope.map.clickedMarker.latitude = e.latLng.lat();
          $scope.map.clickedMarker.longitude = e.latLng.lng();

          $scope.locationCreate.params.latitude = e.latLng.lat();
          $scope.locationCreate.params.longitude = e.latLng.lng();

          //reverse geocode into google to grab human readable address
          var RevGeocodeResource = $resource('https://maps.googleapis.com/maps/api/geocode/json?latlng='
            + $scope.locationCreate.params.latitude
            +','
            + $scope.locationCreate.params.longitude
            + '&sensor=false');

          $scope.locationCreate.params.address = RevGeocodeResource.get();
          $scope.locationCreate.params.address.$promise.then(function(result) {
            console.log(result.results[0].formatted_address);
            $scope.locationCreate.params.address = result.results[0].formatted_address;
          });

          $scope.$apply();

          // we clear status to rid of any green or red alert boxes.
          clearObject($scope.locationCreate.status);
        }
      }
    };

    $scope.locationCreate.submit = function() {
      if (!$scope.locationCreate.params.address) {
        //display warning in red
        console.log('Need to click on map to select address first');
        $scope.locationCreate.status.needAddress = true;
        return;
      }

      ResourceLocation.save($scope.locationCreate.params, function(createdLocation) {
        // createdLocation param is server response newly created location (most importantly with _id)
        console.log('Post success');

        // clense clicked marker coords so we no longer have indicating marker on where user clicked.
        $scope.map.clickedMarker.latitude = null;
        $scope.map.clickedMarker.longitude = null;

        //inject it into model so user sees it right away
        $scope.existingLocations.push(createdLocation);
        //TODO: make scroll effect so user sees newly created location?
      }, function() {
        console.log('Post error');
        // TODO: tell user there was error. TODO: way to generalize this for all resource requests?
      });

      // upon submit: clear all fields & have a area that says Saved!
      $scope.locationCreate.params = {};
      $scope.locationCreate.status.saveSuccess = true; // need to reset after more clicks
      // maybe after save, scroll down to google picture of created location?
    };
    // ------ END: $scope.locationCreate.submit() ---------

    $scope.locationDelete = function(event, location) {
      //maybe add a blocking dialog to confirm deletion.

      // http://jsfiddle.net/ricardohbin/5z5Qz/

      var locId = location._id;
      var locationObj;

      ResourceLocationId.remove({id: location._id}, function() {
        console.log('DELETE success');

        // Using ID, delete the location from our model
        for (locationObj in $scope.existingLocations) {
          // check is necessary as we may loop through non location objects.
          if ($scope.existingLocations[locationObj] && '_id' in $scope.existingLocations[locationObj]) {
            if ($scope.existingLocations[locationObj]._id === locId) {
              $scope.existingLocations = _.without($scope.existingLocations, $scope.existingLocations[locationObj]);
            }
          }
        }

        // Update our map markers to reflect deleted location.
        $scope.map.dynamicMarkers = $scope.existingLocations; // already has a reference to $scope.existing locations, but for some reason this line is necessary

        //add smooth transitions later
      }, function() {
        console.log('DELETE error');
      });
    };

    $scope.locationNameEdit = function(event, location) {
      var elInput = event.toElement.parentElement.firstElementChild;

      //placed on model. so we can utilize isolated scope
      location.hasLocationNameEditClicked = true;
      elInput.removeAttribute('readonly');

      // upon keypress enter or clicking a new save glyph, perform rest call.
      // keypress: ould use directive-->emit event to update. 
      // http://stackoverflow.com/questions/17470790/how-to-use-a-keypress-event-in-angularjs
    };

    $scope.locationNameEditSubmit = function(event, location) {
      var elInput = event.toElement.parentElement.firstElementChild;

      console.log(location.assignedName);
      ResourceLocationId.update({id: location._id}, {updatedName: location.assignedName}, function() {
        console.log('UPDATE success');
        location.hasLocationNameEditClicked = false;
        elInput.setAttribute('readonly', 'readonly');
      }, function() {
        console.log('UPDATE failed');
      });
    };

    /////////// on page load, query DB to get existing locations.

    ResourceLocation.query().$promise.then(function(result) {
      var currentItr;
      var i;

      console.log('GET Success');
      
      // this inits the edit/submit glyph
      for (i in result) {
        currentItr = result[i];
        currentItr.hasLocationNameEditClicked = false; // works as we take reference to object
      }

      $scope.existingLocations = clone(result); // existingLocations is our main model
      $scope.map.dynamicMarkers = $scope.existingLocations;
      console.log($scope.map.dynamicMarkers);
    }, function() {
      console.log('GET failed');
    });

    ///////////// helper functions

    function clearObject(statusObj) {
      console.log('status cleared');
      for (var prop in statusObj) {
        if (statusObj.hasOwnProperty(prop)) {
          delete statusObj[prop];
        }
      }
    }

    function clone(obj) {
      if (null == obj || 'object' != typeof obj) {
        return obj;
      }
      var copy = obj.constructor();

      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = obj[attr];
        }
      }

      return copy;
    }
  });
