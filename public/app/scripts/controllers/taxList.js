'use strict';

angular.module('COMCSAApp')
.controller('TaxListCtrl', function ($scope, $location, Tax) {
	$scope.wsTax = Tax;
	$scope.fields = [
		{title: 'Descripción', name: 'description', required: true, type: 'text'},
		{title: 'Porcenaje', name: 'percentage', required: true, type: 'number'},
		{title: 'Tipo', name: 'type', required: false, type: 'text'},
	];

});
