'use strict';

angular.module('COMCSAApp')
.controller('ProviderListCtrl', function ($scope, $location, Provider) {
	$scope.wsProvider = Provider;
	$scope.provider = new Provider();

	$scope.fields = [
		{
			title : 'Tipo Suplidor',
			name : 'type.description',
			type : 'text'
		},
		{
			title : 'ID',
			name : 'id',
			type : 'text'
		},
		{
			title : 'Tipo Identificacion',
			name : 'idType.description',
			type : 'text'
		},
		{
			title : 'Nombre',
			name : 'name',
			type : 'text'
		}, {
			title : 'Correo',
			name : 'email',
			type : 'text'
		}
	];

	$scope.search = [
		'id',
		'idType.description',
		'name',
		'email',
		'type.description'
	];

	$scope.createNew = function () {
		$location.path('provider');
	};
});
