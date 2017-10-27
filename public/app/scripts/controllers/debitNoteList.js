'use strict';

angular.module('COMCSAApp')
.controller('DebitNoteListCtrl', function ($scope, $rootScope, $location, DebitNote) {
	$scope.debitNote = DebitNote;

	$scope.fields = [{
			title : 'No. Documento',
			name : 'code',
			type : 'text'
		}, {
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
			title : 'Recibo de Pago',
			name : 'payment.code',
			type : 'text'
		}, 
		{
			title : 'Cliente',
			name : 'payment.client.name',
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
		'payment.code',
		'date',
		'payment.client.name',
		'branch.name',
		'company.entity.name',
		'amount',
		'paymentType'
	];
	$scope.filterDate = 'createdDate';

	$scope.excelFields = [{
			title : 'No. Documento',
			name : 'code',
			type : 'text'
		}, {
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
			title : 'Recibo de Pago',
			name : 'payment.code',
			type : 'text'
		}, 
		{
			title : 'Cliente',
			name : 'payment.client.name',
			type : 'text'
		}, {
			title : 'Monto',
			name : 'amount',
			type : 'currency'
		}
	];

	$scope.filter = {
		'documentType.description': 'Nota de Débito',
		paymentType: 'ClientDebitNote'
	}

	if ($rootScope.companyData && $rootScope.companyData._id != -1) {
		$scope.filter['company._id'] = $rootScope.companyData._id;
	}

	if ($rootScope.branchData && $rootScope.branchData._id != -1) {
		$scope.filter['branch._id'] =  $rootScope.branchData._id;
	}


	$scope.createNew = function () {
		$location.path('debitNote');
	};
});
