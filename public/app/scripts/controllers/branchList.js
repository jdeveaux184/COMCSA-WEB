'use strict';

angular.module('COMCSAApp')
.controller('BranchListCtrl', function ($scope, $location, Branch) {
	$scope.wsBranches = Branch;
	$scope.fields = [
		{
			title: 'Compañía', 
			name: 'company.entity.name', 
			type: 'text'
		},
		{
			title: 'Nombre Proyecto', 
			name: 'name', 
			type: 'text'
		},
		{
			title: 'Gerente Proyecto', 
			name: 'operationsManager.name', 
			type: 'text'
		},
		{
			title: 'Coordinador', 
			name: 'officeCoordinator.name', 
			type: 'text'
		},
		{
			title: 'Ingeniero', 
			name: 'branchManager.name', 
			type: 'text'
		},
		{
			title: 'Maestro Constructor', 
			name: 'officeManager.name', 
			type: 'text'
		},
		{
			title: 'Contable', 
			name: 'dispatcher.name', 
			type: 'text'
		}
	];
	$scope.search = [
		'_id',
		'company.entity.name',
		'name',
		'operationsManager',
		'officeCoordinator',
		'branchManager',
		'officeManager',
		'dispatcher',
		'CSCoordinatorString'
	];

	$scope.createNew = function () {
		$location.path('branch');
	};
});
