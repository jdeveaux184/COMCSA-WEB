'use strict';

angular.module('COMCSAApp')
.controller('CompanyCtrl', function ($scope, $rootScope, $location, toaster, company) {
	$scope.company = company;
	if($rootScope.userData.role._id != 1){
		$location.path('/noaccess');
	}
	
	$scope.save = function () {
		$scope.company.save()
		.then(function (data) {
			toaster.success('The company was registered successfully');
			$location.path('companyList')
		},
			function (error) {
			console.log(error);
			toaster.error(error.message);
		});
	};

});
