'use strict';

angular.module('COMCSAApp')
.controller('TaxesCtrl', function ($scope, data, $uibModalInstance, toaster, $window, Tax) {
	var tax = new Tax();
	$scope.invoice = data.invoice;
	
	tax.filter({'type' : data.type}).then(function (result) {
		$scope.taxes = $scope.invoice.taxes ? $scope.invoice.taxes : angular.copy(result.data || []);
		$scope.getTotal();
	
	});
	$scope.close = function(){
		$uibModalInstance.dismiss(data.transactions);
	};
	$scope.apply = function(){
		var result = {
			totalTaxes: $scope.totalTaxes,
			taxes: $scope.taxes
		}

		$uibModalInstance.close(result)
	};


	$scope.getTotal = function () {
		$scope.totalTaxes=0;
		for (var i=0;i<$scope.taxes.length;i++) {
			if ($scope.taxes[i].picked) {
				$scope.taxes[i].amount = $scope.taxes[i].percentage*$scope.invoice.total/100;
				$scope.totalTaxes += $scope.taxes[i].amount;
			}  else {
				delete $scope.taxes[i].amount;
			}
		}

	}

	
});
