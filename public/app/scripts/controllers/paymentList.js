'use strict';

angular.module('COMCSAApp')
.controller('PaymentListCtrl', function ($scope, $rootScope, $location, Payment) {
	$scope.payment = Payment;

	$scope.fields = [{
			title : 'Compañía',
			name : 'company.entity.name',
			type : 'text'
		},{
			title : 'Proyecto',
			name : 'branch.name',
			type : 'text'
		},{
			title : 'Fecha',
			name : 'date',
			type : 'date'
		}, {
			title : 'Código',
			name : 'code',
			type : 'text'
		}, 
		{
			title : 'Cliente',
			name : 'client.name',
			type : 'text'
		}, {
			title : 'Forma de Pago',
			name : 'paymentChoice.description',
			type : 'text'
		}, {
			title : 'Monto',
			name : 'amount',
			type : 'currency'
		}
	];

	$scope.search = [
		'_id',
		'code',
		'date',
		'client.name',
		'branch.name',
		'company.entity.name',
		'paymentChoice.description',
		'amount',
	];
	$scope.filterDate = 'createdDate';

	$scope.excelFields = [{
			title : 'Compañía',
			name : 'company.entity.name',
			type : 'text'
		},{
			title : 'Proyecto',
			name : 'branch.name',
			type : 'text'
		},{
			title : 'Fecha',
			name : 'date',
			type : 'date'
		}, {
			title : 'Código',
			name : 'code',
			type : 'text'
		}, {
			title : 'Cliente',
			name : 'client.name',
			type : 'text'
		},  {
			title : 'Forma de Pago',
			name : 'paymentChoice.description',
			type : 'text'
		},  {
			title : 'Monto',
			name : 'amount',
			type : 'currency'
		}
	];

	$scope.filter = {
		'documentType.description': 'Recibo De Pago',
		paymentType: 'ClientPayment'
	}

	if ($rootScope.companyData && $rootScope.companyData._id != -1) {
		$scope.filter['company._id'] = $rootScope.companyData._id;
	}

	if ($rootScope.branchData && $rootScope.branchData._id != -1) {
		$scope.filter['branch._id'] =  $rootScope.branchData._id;
	}
	
	$scope.createNew = function () {
		$location.path('payment');
	};
});
