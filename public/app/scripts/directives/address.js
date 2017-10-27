angular.module('COMCSAApp')
.directive('addressModel', function () {
  return {
    templateUrl: 'views/directives/address.html',
    restrict: 'E',
    scope:{
			ngModel: '=',
			originPoint: '='
		},
		controller: function ($scope, Country, State, City, $timeout) {
			$scope.ngModel = $scope.ngModel || {};
			var Address = function(address){
				this.address1 = address.address1 || '';
				this.address2 = address.address2 || '';
				this.city = address.city || {};
				this.state = address.state || {};
				this.country = address.country || {};
				this.zipcode = address.zipcode || '';
				this.latitude = address.latitude || 0;
				this.longitude = address.longitude || 0;
				this.distanceFrom =  address.distanceFrom || 0;
			};
			// var originPoint = {
			// 	latitude: 28.39788010000001,
			// 	longitude: -81.33288979999998
			// };

			console.log($scope.ngModel)

			var originPoint = {};
			
			console.log(originPoint)

			var placeSearch, autocomplete;

			$scope.geolocate = function() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						var geolocation = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
						var circle = new google.maps.Circle({
							center: geolocation,
							radius: position.coords.accuracy
						});
						autocomplete.setBounds(circle.getBounds());
					});
				}
			};
			$scope.validate = function(){
				return $scope.ngModel && ($scope.ngModel.address1 != '') && ($scope.ngModel.city && $scope.ngModel.city.id != '') && ($scope.ngModel.state && $scope.ngModel.state.id != '') && ($scope.ngModel.country && $scope.ngModel.country.id != '') && !!($scope.ngModel.zipcode != '');
			}

			function initAutocomplete() {
				autocomplete = new google.maps.places.Autocomplete(
				(document.getElementById('address1')), {types: ['geocode']});
				autocomplete.addListener('place_changed', fillInAddress);
			}

			function fillInAddress() {
				// Get the place details from the autocomplete object.
				originPoint = $scope.originPoint && $scope.originPoint.latitude != 0 && $scope.originPoint.longitude != 0 ? $scope.originPoint : {
																																latitude: 28.39788010000001,
																																longitude: -81.33288979999998
																															};

				var place = autocomplete.getPlace();
			 	var data = {
			 		streetNumber: '',
			 		route: '',
			 		city:{
			 			id: '',
			 			description: ''
			 		},
			 		county:{
			 			id: '',
			 			description: ''
			 		},
			 		state:{
			 			id: '',
			 			description: ''
			 		},
			 		country: {
			 			id: '',
			 			description: ''
			 		},
			 		zipcode: {
			 			postal: '',
			 			subpostal: ''
			 		}
			 	};
			 	if(place.address_components){
				 	for(var i = 0; i < place.address_components.length; i++){
				 		//Getting all data
				 		if(place.address_components[i].types.indexOf('street_number') != -1){
				 			data.streetNumber = place.address_components[i].long_name
				 		}
				 		else if(place.address_components[i].types.indexOf('route') != -1){
				 			data.route = place.address_components[i].long_name
				 		}
				 		else if(place.address_components[i].types.indexOf('locality') != -1){
				 			data.city.id = place.address_components[i].short_name
				 			data.city.description = place.address_components[i].long_name
				 		}
				 		else if(place.address_components[i].types.indexOf('administrative_area_level_2') != -1){
				 			data.county.id = place.address_components[i].short_name
				 			data.county.description = place.address_components[i].long_name
				 		}
				 		else if(place.address_components[i].types.indexOf('administrative_area_level_1') != -1){
				 			data.state.id = place.address_components[i].short_name
				 			data.state.description = place.address_components[i].long_name
				 		}
				 		else if(place.address_components[i].types.indexOf('country') != -1){
				 			data.country.id = place.address_components[i].short_name
				 			data.country.description = place.address_components[i].long_name
				 		}
				 		else if(place.address_components[i].types.indexOf('postal_code') != -1){
				 			data.zipcode.postal = place.address_components[i].long_name
				 		}
				 		else if(place.address_components[i].types.indexOf('postal_code_suffix') != -1){
				 			data.zipcode.subpostal = place.address_components[i].long_name
				 		}
				 	}
				 }
				 else {
 				 	var data = {
				 		streetNumber: '',
				 		route: place.name,
				 		city:{
				 			id: 0,
				 			description: 'N/A'
				 		},
				 		county:{
				 			id: 0,
				 			description: 'N/A'
				 		},
				 		state:{
				 			id: 0,
				 			description: 'N/A'
				 		},
				 		country: {
				 			id: 0,
				 			description: 'N/A'
				 		},
				 		zipcode: {
				 			postal: 'N/A',
				 			subpostal: 'N/A'
				 		}
				 	};
				 }
			 	$scope.ngModel.address1 = data.streetNumber + ' ' + data.route;
				$scope.ngModel.address2 = '';
				$scope.ngModel.city = data.city;
				$scope.ngModel.city.stateId = data.state.id;
				$scope.ngModel.county = data.county;
				$scope.ngModel.state = data.state;
				$scope.ngModel.state.country = data.country.id;
				$scope.ngModel.country = data.country;
				$scope.ngModel.zipcode = data.zipcode.postal;
				$scope.ngModel.latitude = place.geometry ? place.geometry.location.lat() : 0;
				$scope.ngModel.longitude = place.geometry ? place.geometry.location.lng() : 0;
				console.log(originPoint)
				$scope.ngModel.distanceFrom = place.geometry ? getDistance($scope.ngModel, originPoint) : 0;
				$scope.$apply();
			}
			$timeout(function(){
				$scope.ngModel = new Address($scope.ngModel);
				initAutocomplete();
			});
			
			var rad = function(x) {
				return x * Math.PI / 180;
			};

			var getDistance = function(p1, p2) {
				var p1 = new google.maps.LatLng(p1.latitude, p1.longitude);
				var p2 = new google.maps.LatLng(p2.latitude, p2.longitude);
				var distance = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
				return parseFloat((distance * 0.00062137).toFixed(2));
			};
			$scope.reset = function(){
				$scope.ngModel = new Address({});
			};

    }
  };
});