'use strict';

angular.module('COMCSAApp')
.controller('ClientCtrl', function ($scope, $rootScope, $window, $location, toaster, dialogs, client, $timeout, invoices) {
	$scope.client = client;
	$scope.invoices = invoices.data;
	$scope.typeList = [
		{
			_id: 1,
			description: "Persona"
		},
		{
			_id: 2,
			description: "Compania"
		}
	];

	$scope.idTypeList = [
		{
			_id: 1,
			description: "RNC"
		},
		{
			_id: 2,
			description: "Cedula"
		}
	];

	if($rootScope.userData.role._id != 1 && user._id != $rootScope.userData._id){
		$location.path('/noaccess');
	}
	
	$scope.save = function () {
		if (!$scope.client._id) {
			$scope.client.save()
			.then(function (data) {
				toaster.success('El Cliente fue Creado');
				$location.path('clientList')
			},
				function (error) {
				console.log(error);
				toaster.error(error.message);
			});
		} else {
			$scope.user.update()
			.then(function (data) {
				toaster.success('El Cliente fue Actualizado');
				//$location.path('userList');
			},
				function (error) {
				console.log(error);
				toaster.error(error.message);
			});
		}
	};

	$scope.delete = function(){
		var dlg = dialogs.confirm('Warning','Seguro desea eliminar el cliente?');
		dlg.result.then(function(btn){
			$scope.client.remove()
			.then(function(){
				toaster.success('El Cliente fue Eliminado');
				$location.path('/clientList')
			});
		});
	};

	$scope.showBalance = function(){
		var dialog = dialogs.create('views/clientBalance.html', 'clientBalanceCtrl', {client: $scope.client, invoices: $scope.invoices});
		dialog.result
		.then(function (res) {
			if (res.transactions) {
				$scope.invoice.transactions = angular.copy(res.transactions);
				$scope.save();
			}
		});
	};

});
