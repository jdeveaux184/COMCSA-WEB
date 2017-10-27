'use strict';

angular.module('COMCSAApp')
.controller('InvoiceCtrl', function ($scope, $rootScope, $location, toaster, $q, $window, Client, invoice, statusList, Item, dialogs, Invoice, Company, companies,branches) {
	$scope.invoice = invoice;
	$scope.items = [];
	$scope.readOnly = $rootScope.userData.role._id != 1;
	$scope.listStatus = statusList;
	$scope.listCompany = companies.data;
	$scope.listBranches = branches.data;
	$scope.invoice.company = $rootScope.companyData || {};
	$scope.invoice.branch = $rootScope.branchData || {};
	$scope.printInvoice = false;
	$scope.taxAmount = 0;
	$scope.taxes = []

	$scope.wsClass = Client;
	$scope.wsFields = [{
			field : 'type.description',
			label : 'Tipo Cliente',
			type : 'text',
			show : true
		},{
			field : 'id',
			label : 'ID',
			type : 'text',
			show : true
		},{
			field : 'idType.description',
			label : 'Tipo Identificación',
			type : 'text',
			show : true
		},{
			field : 'name',
			label : 'Nombre',
			type : 'text',
			show : true
		}, {
			field : 'email',
			label : 'Correo',
			type : 'text',
			show: true
		}
	];

	$scope.filterC = {
	};

	$scope.wsClassItem = Item;
	$scope.wsFilterItem =  $rootScope.userData.role._id != 1 ? { 'companies._id': $rootScope.userData.company._id }: { };
	$scope.wsFieldsItem = [{
			label : 'Codigo',
			field : 'code',
			type : 'text',
			show: true
		},{
			label : 'Descripción',
			field : 'description',
			type : 'text',
			show: true
		},{
			label : 'Tipo',
			field : 'itemType.description',
			type : 'text',
			show: true
		},{
			label : 'Unidad de Medida',
			field : 'unitOfMeasure',
			type : 'text',
			show: true
		}, {
			label : 'Precio',
			field : 'price',
			type : 'currency',
			show: true
		}
	];

	$scope.setInvoice = function(doc){
		$scope.invoice = new Invoice(doc);
		$scope.invoice.date = new Date();
		delete $scope.invoice._id;
		$scope.clientChanged(doc.client);
	};

	$scope.clientChanged = function(client){
		if(client && client.company)
			$scope.wsFilterItem =  $rootScope.userData.role._id != 1 ? { 'companies._id': $rootScope.userData.company._id } : { 'companies._id': client.company._id };
		// if(!$scope.invoice._id && (!$scope.invoice.invoiceNumber || $scope.invoice.invoiceNumber == 'No asignado')){
		// 	var company = new Company(client.company);
		// 	company.peek()
		// 	.then(function(sequence){
		// 		$scope.invoice.invoiceNumber = sequence;
		// 	});
		// }
	};
	$scope.addItem = function () {
		$scope.invoice.items.unshift(new Item())
	};
	$scope.removeItem = function (index) {
		$scope.invoice.items.splice(index, 1);
	};
	$scope.setItem = function(item, index) {
		$scope.invoice.items[index] = new Item(item);
	};

	$scope.changed = function(field){
		if($scope.invoice._id && $rootScope.userData.role._id != 1){
			var isHere = false;
			$scope.invoice.fieldsChanged = $scope.invoice.fieldsChanged || [];
			for(var i = 0; i < $scope.invoice.fieldsChanged.length; i++){
				if($scope.invoice.fieldsChanged[i] == field){
					isHere = true;
					break;
				}
			}
			if(!isHere){
				$scope.invoice.fieldsChanged.push(field);
			}
		} 
	};
	$scope.isChanged = function(field){
		if($scope.invoice._id && $rootScope.userData.role._id == 1){
			var isHere = false;
			$scope.invoice.fieldsChanged = $scope.invoice.fieldsChanged || [];
			for(var i = 0; i < $scope.invoice.fieldsChanged.length; i++){
				if($scope.invoice.fieldsChanged[i] == field){
					isHere = true;
					break;
				}
			}
			return isHere ? 'changed' : '';
		}
		return '';
	};
	$scope.isDisabled = function(){
		return $rootScope.userData.role._id != 1 && $scope.invoice.status._id == 3;
	};


	$scope.saveCompany = function () {
		delete $scope.invoice.client.account.password;
		delete $scope.invoice.transactions;

		$scope.invoice.save()
		.then(function (data) {
			toaster.success('La factura fue guardada');
			$location.path('InvoiceList')
		},
		function (error) {
			console.log(error);
			toaster.error('La factura no pudo ser guardada o enviada, por favor si le falta algún campo requerido o está duplicado');
		});
	};
	$scope.saveSend = function () {
		delete $scope.invoice.client.account.password;
		$scope.invoice.save()
		.then(function (data) {
			toaster.success('La Factura fue Guardada');
			// $scope.invoice.send();
		},
		function (error) {
			console.log(error);
			toaster.error('La factura no pudo ser guardada o enviada, por favor si le falta algún campo requerido o está duplicado');
		});
	};


	$scope.export = function(){
		// $scope.invoice.download();
		$scope.printInvoice = 'print';
		$window.print()
	};

	// $scope.send = function(){
	// 	$scope.invoice.send();
	// };

	$scope.showTransactions = function(){
		$scope.printInvoice = 'hidden-print';
		var dialog = dialogs.create('views/transactions.html', 'ClientTransactionsCtrl', {invoice: $scope.invoice, transactions: $scope.invoice.transactions});
		dialog.result
		.then(function (res) {
			if (res.transactions) {
				$scope.invoice.transactions = angular.copy(res.transactions);
				$scope.save();
			}
			$scope.printInvoice = 'print';
		});
	};

	$scope.showTaxes = function(){
		$scope.printInvoice = 'hidden-print';
		var dialog = dialogs.create('views/pickTaxes.html', 'TaxesCtrl', {type: 'SUPLIDOR', invoice: $scope.invoice});
		dialog.result
		.then(function (res) {
				$scope.invoice.taxAmount = angular.copy(res.totalTaxes);
				$scope.invoice.taxes = angular.copy(res.taxes);
				$scope.invoice.totalWithTaxes = $scope.invoice.taxAmount + $scope.invoice.total;
			$scope.printInvoice = 'print';
		});
	};

	$scope.showExpenses = function(){
		var dialog = dialogs.create('views/expenses.html', 'ExpensesCtrl', {expenses: $scope.invoice.expenses, 
																			expensesComplete:$scope.invoice.expensesComplete,
																			technician:$scope.invoice.technician});
		dialog.result
		.then(function (res) {
			$scope.invoice.expenses = angular.copy(res.expenses);
			$scope.invoice.expensesComplete = angular.copy(res.expensesComplete);
			$scope.invoice.technician = angular.copy(res.technician);
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
			$scope.invoice.photos = $scope.invoice.photos || [];
			$scope.invoice.photos = $scope.invoice.photos.concat(urls)
		})
	};

	$scope.showPicture = function(index){
		$scope.invoice.showPicture(index);
	};

	$scope.removePhoto = function(index){
		$scope.invoice.photos.splice(index, 1);
	};

	if ($scope.invoice.code) {
	 	$scope.invoice.getTransactions($scope.invoice.client, $scope.invoice)
		.then(function(result) {
			$scope.invoice.totalTransactions = result.totalMovimientos;
		});
		
	}
});
