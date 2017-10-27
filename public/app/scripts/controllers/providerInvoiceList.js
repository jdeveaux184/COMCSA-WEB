'use strict';

angular.module('COMCSAApp')
.controller('ProviderInvoiceListCtrl', function ($scope, $rootScope, $location, ProviderInvoice) {
	$scope.providerInvoice = ProviderInvoice;

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
			title : 'NCF',
			name : 'ncf',
			type : 'text'
		}, {
			title : 'Factura #',
			name : 'invoiceNumber',
			type : 'number'
		}, {
			title : 'Proveedor',
			name : 'client.name',
			type : 'text'
		}, {
			title : 'Estatus',
			name : 'status.description',
			type : 'text'
		}, {
			title : 'SubTotal',
			name : 'total',
			type : 'currency'
		}, {
			title : 'Total',
			name : 'totalWithTaxes',
			type : 'currency'
		}
	];
	// if($rootScope.userData.role._id == 1){
	// 	$scope.fields.push({
	// 		title : 'Total Amount',
	// 		name : 'total',
	// 		type : 'currency'
	// 	});
	// }
	$scope.search = [
		'_id',
		'date',
		'invoiceNumber',
		'client.name',
		'branch.name',
		'ncf',
		'company.entity.name',
		'status.description',
		'total',
		'totalWithTaxes'
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
			title : 'NCF',
			name : 'ncf',
			type : 'text'
		}, {
			title : 'Factura #',
			name : 'invoiceNumber',
			type : 'number'
		}, {
			title : 'Proveedor',
			name : 'client.name',
			type : 'text'
		}, {
			title : 'Estatus',
			name : 'status.description',
			type : 'text'
		}, {
			title : 'Subtotal',
			name : 'total',
			type : 'currency'
		}, {
			title : 'Total',
			name : 'totalWithTaxes',
			type : 'currency'
		}
	];
	console.log($rootScope.companyData)
	//$scope.filter = $rootScope.userData.role._id == 1 ? { } : $rootScope.userData.branch && $rootScope.userData.branch._id ?  { 'branch._id': $rootScope.branchData._id } : { 'client._id': $rootScope.userData._id };
		
	$scope.filter = {
		'documentType.description': 'Cuenta por Pagar'
	}

	if ($rootScope.companyData && $rootScope.companyData._id != -1) {
		$scope.filter['company._id'] = $rootScope.companyData._id;
	}

	if ($rootScope.branchData && $rootScope.branchData._id != -1) {
		$scope.filter['branch._id'] =  $rootScope.branchData._id;
	}

	$scope.createNew = function () {
		$location.path('providerInvoice');
	};
});
