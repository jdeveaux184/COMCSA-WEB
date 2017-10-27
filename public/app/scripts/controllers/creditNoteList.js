'use strict';

/**
 * @ngdoc function
 * @name MobileCRMApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the MobileCRMApp
 */
angular.module('COMCSAApp')
.controller('CreditNoteListCtrl', function ($scope, $rootScope, $location, CreditNote) {
	$scope.creditNote = CreditNote;

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
			name : 'invoice.client.name',
			type : 'text'
		},{
			title : 'NCF',
			name : 'ncf',
			type : 'text'
		},{
			title : 'Factura Original',
			name : 'invoice.ncf',
			type : 'text'
		}, {
			title : 'Monto Original',
			name : 'originalAmount',
			type : 'currency'
		}, {
			title : 'Monto Acreditado',
			name : 'amount',
			type : 'currency'
		}
	];

	$scope.search = [
		'_id',
		'code',
		'date',
		'invoice.client.name',
		'branch.name',
		'company.entity.name',
		'paymentType',
		'invoice.ncf',
		'originalAmount',
		'amount',
		'ncf'
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
		}, 
		{
			title : 'Cliente',
			name : 'invoice.client.name',
			type : 'text'
		},{
			title : 'NCF',
			name : 'ncf',
			type : 'text'
		},{
			title : 'Factura Original',
			name : 'invoice.ncf',
			type : 'text'
		}, {
			title : 'Monto Original',
			name : 'originalAmount',
			type : 'currency'
		}, {
			title : 'Monto Acreditado',
			name : 'amount',
			type : 'currency'
		}
	];

	$scope.filter = {
		'documentType.description': 'Nota de Crédito',
		paymentType: 'ClientCreditNote'
	}

	if ($rootScope.companyData && $rootScope.companyData._id != -1) {
		$scope.filter['company._id'] = $rootScope.companyData._id;
	}

	if ($rootScope.branchData && $rootScope.branchData._id != -1) {
		$scope.filter['branch._id'] =  $rootScope.branchData._id;
	}
	
	$scope.createNew = function () {
		$location.path('creditNote');
	};
});
