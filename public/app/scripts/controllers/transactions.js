'use strict';

angular.module('COMCSAApp')
.controller('TransactionsCtrl', function ($scope, data, $uibModalInstance, toaster, $window, ProviderInvoice) {
	var providerInvoice = new ProviderInvoice();
	console.log(1)
	providerInvoice.getTransactions(data.invoice.client, data.invoice).then(function (result) {
		console.log(result)
		$scope.transactions = angular.copy(result.transactions || []);
		$scope.selectTab(1);
		$scope.getTotal();
	
	});
	$scope.totalFactura = angular.copy(data.invoice.total || 0);
	$scope.totalMovimientos = 0;
	$scope.invoice = data.invoice;
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
		$scope.getTotal();
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
		$scope.total = data.invoice.total;

		for (var i=0;i<$scope.transactions.length;i++) {
			if ($scope.transactions[i].type === "Nota de Débito") {
				$scope.total += $scope.transactions[i].amount;
				$scope.totalMovimientos += $scope.transactions[i].amount;
				console.log($scope.total)
			} else {
				$scope.total -= $scope.transactions[i].amount;
				$scope.totalMovimientos -= $scope.transactions[i].amount;
				console.log($scope.total)
			}
		}

	}

	
});
