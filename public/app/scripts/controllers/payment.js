'use strict';

/**
 * @ngdoc function
 * @name MobileCRMApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the MobileCRMApp
 */
angular.module('COMCSAApp')
.controller('PaymentCtrl', function ($scope, $rootScope, $location, toaster, Client, $q, payment, paymentChoiceList, Invoice, dialogs, Company, companies, branches) {
	$scope.payment = payment;
	$scope.payment.invoices = $scope.payment.invoices || [];
	$scope.payment.paymentType = "ClientPayment";
	$scope.readOnly = $rootScope.userData.role._id != 1;
	$scope.paymentChoiceList = paymentChoiceList;
	$scope.listCompany = companies.data;
	$scope.listBranches = branches.data;
	$scope.payment.company = $rootScope.companyData || {};
	$scope.payment.branch = $rootScope.branchData || {};
	console.log($scope.listCompany, $scope.listBranches, $scope.payment.company, $scope.payment.branch)


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

	$scope.wsClassInvoice = Invoice;
	
	console.log($scope.wsFilterInvoice)
	$scope.wsFieldsInvoice = [{
			label : 'Factura #',
			field : 'invoiceNumber',
			type : 'text',
			show: true
		},{
			label : 'NCF',
			field : 'ncf',
			type : 'text',
			show: true
		},{
			label: 'Fecha',
			field: 'date',
			type: 'date',
			show: true
		},
		{
			label : 'Cliente',
			field : 'client.name',
			type : 'text',
			show: true
		}, {
			label : 'Monto Total',
			field : 'total',
			type : 'currency',
			show: true
		}
	];

	$scope.setInvoice = function(doc){
		$scope.payment = new Invoice(doc);
		$scope.payment.date = new Date();
		delete $scope.payment._id;
	};
	$scope.addItem = function () {
		$scope.payment.invoices.unshift(new Invoice())
	};
	$scope.removeItem = function (index) {
		$scope.payment.invoices.splice(index, 1);
	};
	$scope.setItem = function(item, index) {
		$scope.payment.invoices[index] = new Invoice(item);
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

	
	$scope.save = function () {
		delete $scope.payment.client.account.password;
		$scope.payment.save()
		.then(function (data) {
			toaster.success('El pago fue Guardado');
			$location.path('paymentList')
		},
			function (error) {
			console.log(error);
			toaster.error('El Pago no pudo ser guardada o enviada, por favor si le falta algún campo requerido o está duplicado');
		});
	};
	$scope.saveBranch = function () {
		delete $scope.payment.client.account.password;
		$scope.payment.save()
		.then(function (data) {
			toaster.success('El pago fue Guardado');
			$location.path('paymentList');

			new User().filter({ 'branch._id': $scope.payment.client.branch._id })
			.then(function (result) {
				// var emails = _.map(result.data, function(obj){
				// 	return obj.account.email;
				// });
				// $scope.invoice.sendTo(emails);
				
			})
		},
		function (error) {
			console.log(error);
			toaster.error('El pago no pudo ser guardado, por favor si le falta algún campo requerido o está duplicado');
		});
	};
	$scope.saveCompany = function () {
		delete $scope.payment.client.account.password;
		$scope.payment.save()
		.then(function (data) {
			new Company().filter({ _id: $scope.payment.company._id })
			.then(function (result) {
				var emails = _.map(result.data, function(obj){
					return obj.accountPayableEmail;
				});
				emails.push($scope.payment.client.account.email);
				// $scope.invoice.sendTo(emails, true);
				toaster.success('El pago fue Guardado');
				$location.path('paymentList')
			})
		},
		function (error) {
			console.log(error);
			toaster.error('La factura no pudo ser guardada o enviada, por favor si le falta algún campo requerido o está duplicado');
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
				$location.path('/providerInvoiceList')
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
		$scope.wsFilterInvoice['company._id'] = $scope.payment.company._id;
		$scope.wsFilterInvoice.provider = {$exists:false}
		console.log($scope.wsFilterInvoice)
	}
});
