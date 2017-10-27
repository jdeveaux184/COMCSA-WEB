'use strict';

angular.module('COMCSAApp')
.controller('ProviderCreditNoteCtrl', function ($scope, $rootScope, $location, toaster, ProviderInvoice, $q, providerCreditNote, creditNoteTypeList, Invoice, dialogs, Company, companies, branches) {
	$scope.payment = providerCreditNote;
	$scope.payment.invoices = $scope.payment.invoices || [];
	$scope.payment.paymentType = "ProviderCreditNote";
	$scope.readOnly = $rootScope.userData.role._id != 1;
	$scope.creditNoteTypeList = creditNoteTypeList;
	$scope.listCompany = companies.data;
	$scope.listBranches = branches.data;
	$scope.payment.company = $rootScope.companyData || {};
	$scope.payment.branch = $rootScope.branchData || {};
	console.log($scope.listCompany, $scope.listBranches, $scope.payment.company, $scope.payment.branch)


	$scope.wsClass = ProviderInvoice;
	$scope.wsFields = [{
			field : 'date',
			label : 'Fecha',
			type : 'date',
			show : true
		},{
			field : 'invoiceNumber',
			label : 'Factura #',
			type : 'text',
			show : true
		},{
			field : 'ncf',
			label : 'NCF',
			type : 'text',
			show : true
		},{
			field : 'client.name',
			label : 'Cliente',
			type : 'text',
			show : true
		}, {
			field : 'total',
			label : 'Total Factura',
			type : 'currency',
			show: true
		}
	];

	$scope.filterC = {

	};

	$scope.changed = function(field){
		if($scope.payment._id && $rootScope.userData.role._id != 1){
			var isHere = false;
			$scope.payment.fieldsChanged = $scope.payment.fieldsChanged || [];
			for(var i = 0; i < $scope.payment.fieldsChanged.length; i++){
				if($scope.payment.fieldsChanged[i] == field){
					isHere = true;
					break;
				}
			}
			if(!isHere){
				$scope.payment.fieldsChanged.push(field);
			}
		} 
	};
	$scope.isChanged = function(field){
		if($scope.payment._id && $rootScope.userData.role._id == 1){
			var isHere = false;
			$scope.payment.fieldsChanged = $scope.payment.fieldsChanged || [];
			for(var i = 0; i < $scope.payment.fieldsChanged.length; i++){
				if($scope.payment.fieldsChanged[i] == field){
					isHere = true;
					break;
				}
			}
			return isHere ? 'changed' : '';
		}
		return '';
	};
	$scope.isDisabled = function(){
		return $rootScope.userData.role._id != 1 && $scope.payment.status._id == 3;
	};

	
	$scope.saveCompany = function () {
		$scope.payment.provider = $scope.payment.invoice.client;
		$scope.payment.entryDate = $scope.payment.date;
		$scope.payment.originalAmount = $scope.payment.invoice.total;
		$scope.payment.documentType = "ProviderCreditNote";
		$scope.payment.save()
		.then(function (data) {
			new Company().filter({ _id: $scope.payment.company._id })
			.then(function (result) {

				toaster.success('La Nota de Crédito fue Guardada');
				$location.path('providerCreditNoteList')
			})
		},
		function (error) {
			console.log(error);
			toaster.error('La Nota de Crédito no pudo ser guardada o enviada, por favor si le falta algún campo requerido o está duplicado');
		});
	};
	$scope.saveSend = function () {
		delete $scope.payment.client.account.password;
		$scope.payment.save()
		.then(function (data) {
			toaster.success('La Factura fue Guardada');
			// $scope.invoice.send();
		},
		function (error) {
			console.log(error);
			toaster.error('La factura no pudo ser guardada o enviada, por favor si le falta algún campo requerido o está duplicado');
		});
	};


	$scope.delete = function(){
		var dlg = dialogs.confirm('Warning','Are you sure you want to delete?');
		dlg.result.then(function(btn){
			$scope.payment.remove()
			.then(function(){
				toaster.success('La factura fue borrada');
				$location.path('providerCreditNoteList')
			});
		});
	};
	$scope.export = function(){
		$scope.payment.download();
	};

	// $scope.send = function(){
	// 	$scope.invoice.send();
	// };

	$scope.showTransactions = function(){
		var dialog = dialogs.create('views/transactions.html', 'TransactionsCtrl', {invoice: $scope.payment, transactions: $scope.payment.transactions});
		dialog.result
		.then(function (res) {
			if (res.transactions) {
				$scope.payment.transactions = angular.copy(res.transactions);
				$scope.save();
			}
		});
	};

	$scope.uploadFiles = function(files){
		$scope.files = angular.copy(files)
		function getBase64(file) {
			var d = $q.defer();
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {
				d.resolve({ 
					url: reader.result,
					name: file.name,
					type: file.type,
					isNew: true
				});
			};
			reader.onerror = function (error) {
				d.reject(error);
			};
			return d.promise;
		}
		var promises = [];
		for(var i = 0; i < files.length; i++){
			promises.push(getBase64(files[i]))
		}
		$q.all(promises)
		.then(function(urls){
			$scope.payment.photos = $scope.payment.photos || [];
			$scope.payment.photos = $scope.payment.photos.concat(urls)
		})
	};

	$scope.showPicture = function(index){
		$scope.payment.showPicture(index);
	};

	$scope.removePhoto = function(index){
		$scope.payment.photos.splice(index, 1);
	};

	$scope.clientChanged = function (client) {
		$scope.wsFilterInvoice =  { 'client._id': client._id};
		if ($rootScope.userData.role._id != 1) {
			$scope.wsFilterInvoice['companies._id'] = $rootScope.userData.company._id;
		}
	}
});
