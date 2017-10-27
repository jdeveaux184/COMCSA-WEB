'use strict';

/**
 * @ngdoc function
 * @name MobileCRMApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the MobileCRMApp
 */
angular.module('COMCSAApp')
.controller('DebitNoteCtrl', function ($scope, $rootScope, $location, $window, toaster, Payment, $q, debitNote, Invoice, dialogs, Company, companies, branches, debitNoteTypeList) {
	$scope.payment = debitNote;
	$scope.payment.invoices = $scope.payment.invoices || [];
	$scope.payment.paymentType = "ClientDebitNote";
	$scope.readOnly = $rootScope.userData.role._id != 1;
	$scope.debitNoteTypeList = debitNoteTypeList;
	$scope.listCompany = companies.data;
	$scope.listBranches = branches.data;
	$scope.payment.company = $rootScope.companyData || {};
	$scope.payment.branch = $rootScope.branchData || {};
	console.log($scope.listCompany, $scope.listBranches, $scope.payment.company, $scope.payment.branch)


	$scope.wsClass = Payment;
	$scope.wsFields = [{
			field : 'code',
			label : 'Recibo de Pago',
			type : 'text',
			show : true
		},{
			field : 'date',
			label : 'Fecha',
			type : 'date',
			show : true
		},{
			field : 'client.name',
			label : 'Cliente',
			type : 'text',
			show : true
		}, {
			field : 'amount',
			label : 'Total Pagado',
			type : 'currency',
			show: true
		}
	];

	$scope.filter = {
		'paymentType':'ClientPayment'
	};

	

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

	
	$scope.saveCompany = function () {
		$scope.payment.client = $scope.payment.payment.client;
		$scope.payment.save()
		.then(function (data) {
			new Company().filter({ _id: $scope.payment.company._id })
			.then(function (result) {
				var emails = _.map(result.data, function(obj){
					return obj.accountPayableEmail;
				});
				emails.push($scope.payment.client.account.email);
				// $scope.invoice.sendTo(emails, true);
				toaster.success('La Nota de Debito fue Guardada');
				$location.path('debitNoteList')
			})
		},
		function (error) {
			console.log(error);
			toaster.error('La Nota de Debito no pudo ser guardada o enviada, por favor si le falta algún campo requerido o está duplicado');
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


});
