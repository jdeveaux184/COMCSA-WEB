'use strict';

/**
 * @ngdoc function
 * @name MobileCRMApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the MobileCRMApp
 */
angular.module('COMCSAApp')
.controller('ProviderPaymentCtrl', function ($scope, $rootScope, $location, $window, toaster, Provider, $q, providerPayment, paymentChoiceList, ProviderInvoice, dialogs, Company, companies, branches) {
	$scope.payment = providerPayment;
	$scope.payment.invoices = $scope.payment.invoices || [];
	
	$scope.readOnly = $rootScope.userData.role._id != 1;
	$scope.paymentChoiceList = paymentChoiceList;
	$scope.listCompany = companies.data;
	$scope.listBranches = branches.data;
	$scope.payment.company = $rootScope.companyData || {};
	$scope.payment.branch = $rootScope.branchData || {};
	console.log($scope.listCompany, $scope.listBranches, $scope.payment.company, $scope.payment.branch)


	$scope.wsClass = Provider;
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

	$scope.wsClassInvoice = ProviderInvoice;
	
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
		$scope.payment = new ProviderInvoice(doc);
		$scope.payment.date = new Date();
		delete $scope.payment._id;
	};
	$scope.addItem = function () {
		$scope.payment.invoices.unshift(new ProviderInvoice())
	};
	$scope.removeItem = function (index) {
		$scope.payment.invoices.splice(index, 1);
	};
	$scope.setItem = function(item, index) {
		$scope.payment.invoices[index] = new ProviderInvoice(item);
	};

	$scope.isDisabled = function(){
		return $rootScope.userData.role._id != 1 && $scope.payment.status._id == 3;
	};

	$scope.saveCompany = function () {
		$scope.payment.provider = $scope.payment.client;
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
				$location.path('providerPaymentList')
			})
		},
		function (error) {
			console.log(error);
			toaster.error('El Pago no pudo ser guardado, por favor si le falta algún campo requerido o está duplicado');
		});
	};

	$scope.export = function(){
		$window.print();
	};

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
		$scope.wsFilterInvoice =  {
			'client._id': client._id,
			'company._id' : $scope.payment.company._id,
			'branch._id' : $scope.payment.branch._id,
			'documentType.description' : 'Cuenta por Pagar'
		};
		console.log('12')

		$scope.payment.paymentType = "ProviderPayment";
	}

	if ($scope.payment.invoices.length == 0) {

		$scope.addItem();
	}
});
