'use strict';

angular.module('COMCSAApp')
.controller('InvoiceListCtrl', function ($scope, $rootScope, $location, Invoice) {
	$scope.invoice = Invoice;

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
			title : 'Cliente',
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
			title : 'Cliente',
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

	$scope.filter = {
		'documentType.description': 'Factura'
	}

	if ($rootScope.companyData && $rootScope.companyData._id != -1) {
		$scope.filter['company._id'] = $rootScope.companyData._id;
	}

	if ($rootScope.branchData && $rootScope.branchData._id != -1) {
		$scope.filter['branch._id'] =  $rootScope.branchData._id;
	}
	
	$scope.createNew = function () {
		$location.path('invoice');
	};
});
