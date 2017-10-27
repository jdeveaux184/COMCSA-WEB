'use strict';

angular.module('COMCSAApp')
.controller('OptionListCtrl', function ($scope, $location, Option) {
	$scope.wsOption = Option;
	$scope.fields = [
		{title: 'Descripción', name: 'description', required: true, type: 'text'},
		{title: 'URL', name: 'url', required: true, type: 'text'},
		{title: 'Submenú', name: 'submenu.description', required: false, type: 'text'},
	];

	$scope.createNew = function () {
		$location.path('/option')
	}
});
