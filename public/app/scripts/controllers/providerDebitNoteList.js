'use strict';

angular.module('COMCSAApp')
.controller('ProviderDebitNoteListCtrl', function ($scope, $rootScope, $location, DebitNote) {
	$scope.providerDebitNote = DebitNote;

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
			title : 'Suplidor',
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
		'date',
		'payment.client.name',
		'branch.name',
		'company.entity.name',
		'paymentChoice.description',
		'amount',
		'paymentType'
	];
	$scope.filterDate = 'createdDate';

	$scope.excelFields = [{
			title : 'Compañía',
			name : 'company.name',
			type : 'text'
		},{
			title : 'Proyecto',
			name : 'branch.entity.name',
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
			title : 'Suplidor',
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
		paymentType: 'ProviderDebitNote'
	}

	if ($rootScope.companyData && $rootScope.companyData._id != -1) {
		$scope.filter['company._id'] = $rootScope.companyData._id;
	}

	if ($rootScope.branchData && $rootScope.branchData._id != -1) {
		$scope.filter['branch._id'] =  $rootScope.branchData._id;
	}

	$scope.createNew = function () {
		$location.path('providerDebitNote');
	};
});
