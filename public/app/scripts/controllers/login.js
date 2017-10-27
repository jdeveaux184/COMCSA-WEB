'use strict';

angular.module('COMCSAApp')
.controller('LoginCtrl', function ($scope, $rootScope, $location, User, changePassword) {
	$rootScope.userData = new User();
	$scope.login = function () {
		$rootScope.userData.login()
		.then(function (data) {
			for(var i = 0; i < $rootScope.roleOptions.length; i++){
				if($rootScope.roleOptions[i].sort != 0){
					$location.path($rootScope.roleOptions[i].option.url);
					break;
				}
			}

			if ($rootScope.roleOptions.length === 0) {
				$location.path('/providerInvoicesList')
			}
		}, function (err) {});
	};
	$scope.forgetPassword = function(){
		$rootScope.userData.forgetPassword();
	};

	if(changePassword){
		$rootScope.userData.changePassword();
	}
});
