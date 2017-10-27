'use strict';

angular.module('COMCSAApp')
.controller('ClientListCtrl', function ($scope, $location, Client) {
	$scope.wsClient = Client;
	$scope.client = new Client();

	$scope.fields = [
		{
			title : 'Tipo Cliente',
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
		$location.path('client');
	};
});
