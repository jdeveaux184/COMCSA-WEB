'use strict';

angular.module('COMCSAApp')
.controller('providerBalanceCtrl', function ($scope, data, $uibModalInstance, toaster, $window, Provider, Document) {
	$scope.invoices = data.providerInvoices || data.invoices;
	$scope.client = data.client;
	$scope.provider = data.provider;
	$scope.types = [{_id:1,description:"Pago de Factura"},{_id:2,description:"Nota de Crédito"},{_id:3, description:"Nota de Débito"}]
	$scope.total = 0;
	$scope.totalMovimientos = 0;
	var query = data.provider ? {'provider._id':data.provider._id} : {'client._id': data.client._id};
	$scope.providerDocuments = new Document().find(query)
	.then(function (result) {
		console.log(result)
		$scope.transactions = result.data || [];
		$scope.getTotal();
		
	})
	$scope.close = function(){
		$uibModalInstance.dismiss(data.transactions);
	};
	$scope.assign = function(){
		var result = {
			transactions: $scope.transactions
		}

		$uibModalInstance.close(result)
	};
	$scope.add = function(transaction){
		$scope.transactions.push(transaction);
		$scope.movement = {};
		$scope.selectTab(1);
		toaster.success('El documento fue aplicado con éxito');	
	};
	$scope.remove = function(index){
		$scope.transactions.splice(index, 1);
	};

	$scope.print = function () {
		$window.print();
	}

	$scope.selectTab = function(tab){
		
		$scope.selectedTab = tab;

	};

	$scope.getTotal = function () {

		for (var i=0;i<$scope.transactions.length;i++) {
			if ($scope.transactions[i].documentType.description != "Nota de Débito" && $scope.transactions[i].documentType.description != "Cuenta por Pagar") {
				$scope.transactions[i].amount = Number($scope.transactions[i].amount*-1);
			}
				$scope.total = Number($scope.total) + Number($scope.transactions[i].amount);
				$scope.totalMovimientos = Number($scope.totalMovimientos) + Number($scope.transactions[i].amount);
				console.log($scope.total, $scope.totalMovimientos)
		}

	}

	$scope.selectTab(1);
	
});
