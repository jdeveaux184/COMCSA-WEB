'use strict';

angular.module('COMCSAApp')
.controller('RoleListCtrl', function ($scope, Role) {
	$scope.wsRole = Role;
	$scope.fields = [
		{title: 'Description', name: 'description', required: true, type: 'text'}
	];
});
