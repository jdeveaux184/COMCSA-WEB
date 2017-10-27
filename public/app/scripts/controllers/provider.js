'use strict';

angular.module('COMCSAApp')
.controller('ProviderCtrl', function ($scope, $rootScope, $window, $location, toaster, dialogs, provider, $timeout, providerInvoices) {
	$scope.provider = provider;
	$scope.providerInvoices = providerInvoices.data;
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
		if (!$scope.provider._id) {
			$scope.provider.save()
			.then(function (data) {
				toaster.success('El Suplidor fue Creado');
				$location.path('providerList')
			},
				function (error) {
				console.log(error);
				toaster.error(error.message);
			});
		} else {
			$scope.user.update()
			.then(function (data) {
				toaster.success('El Suplidor fue Actualizado');
				//$location.path('userList');
			},
				function (error) {
				console.log(error);
				toaster.error(error.message);
			});
		}
	};

	$scope.delete = function(){
		var dlg = dialogs.confirm('Warning','Seguro desea eliminar el Suplidor?');
		dlg.result.then(function(btn){
			$scope.provider.remove()
			.then(function(){
				toaster.success('El Suplidor fue Eliminado');
				$location.path('/providerList')
			});
		});
	};

	$scope.showBalance = function(){
		var dialog = dialogs.create('views/providerBalance.html', 'providerBalanceCtrl', {provider: $scope.provider, providerInvoices: $scope.providerInvoices});
		dialog.result
		.then(function (res) {
			if (res.transactions) {
				$scope.invoice.transactions = angular.copy(res.transactions);
				$scope.save();
			}
		});
	};

});
