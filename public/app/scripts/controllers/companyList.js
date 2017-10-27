'use strict';


angular.module('COMCSAApp')
.controller('CompanyListCtrl', function ($scope, $location, Company) {
	$scope.wsCompanies = Company;
	$scope.fields = [
		{
			title: 'Nombre', 
			name: 'entity.name', 
			type: 'text'
		}
	];
	$scope.search = [
		'_id',
		'entity.name',
		'entity.url'
	];

	$scope.createNew = function () {
		$location.path('company');
	};
});
