'use strict';

var app = angular
.module('COMCSAApp', [
		'ngAnimate',
		'ngAria',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'toaster',
		'ui.bootstrap',
		'dialogs.main',
		'validation',
		'validation.rule',
		'ui.select',
		'ngFileUpload',
		'hmTouchEvents'
	])
.config(function ($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl : 'views/login.html',
		controller : 'LoginCtrl',
		resolve: {
			changePassword: function(){
				return false;
			}
		}
	})
	.when('/userList', {
		templateUrl : 'views/userList.html',
		controller : 'UserListCtrl',
		resolve: {
			roles : function (Role) {
				return new Role().find({});
			}
		}
	})
	.when('/clientList', {
		templateUrl : 'views/clientList.html',
		controller : 'ClientListCtrl'
	})
	.when('/providerList', {
		templateUrl : 'views/providerList.html',
		controller : 'ProviderListCtrl'
	})
	.when('/roleList', {
		templateUrl : 'views/roleList.html',
		controller : 'RoleListCtrl'
	})
	.when('/optionList', {
		templateUrl : 'views/optionList.html',
		controller : 'OptionListCtrl'
	})
	.when('/option/:id?', {
		templateUrl : 'views/option.html',
		controller : 'OptionCtrl',
		resolve : {
			option : function (Option, $route) {
				if ($route.current.params.id) {
					return new Option().findById(parseInt($route.current.params.id));
				} else {
					return new Option();
				}
			}
		}
	})
	.when('/roleOptionsList', {
		templateUrl : 'views/roleOptionsList.html',
		controller : 'RoleOptionListCtrl',
		resolve: {
			roles : function (Role) {
				return new Role().find({});
			},
			options : function (Option) {
				return new Option().find({});
			}
		}
	})
	.when('/taxList', {
		templateUrl : 'views/taxList.html',
		controller : 'TaxListCtrl'
	})
	.when('/user/:id?', {
		templateUrl : 'views/user.html',
		controller : 'UserCtrl',
		resolve : {
			countries : function (Country) {
				return new Country().find({});
			},
			roles : function (Role) {
				return new Role().find({});
			},
			companies : function (Company) {
				return new Company().find({});
			},
			user : function (User, $route) {
				if ($route.current.params.id) {
					return new User().findById(parseInt($route.current.params.id));
				} else {
					return new User();
				}
			}
		}
	})
	.when('/client/:id?', {
		templateUrl : 'views/client.html',
		controller : 'ClientCtrl',
		resolve : {
			client : function (Client, $route) {
				if ($route.current.params.id) {
					return new Client().findById(parseInt($route.current.params.id));
				} else {
					return new Client();
				}
			},
			invoices : function (Invoice, $route) {
				if ($route.current.params.id) {
					return new Invoice().find({"client._id":$route.current.params.id});
				} else {
					return new Invoice();
				}
			}
		}
	})
	.when('/provider/:id?', {
		templateUrl : 'views/provider.html',
		controller : 'ProviderCtrl',
		resolve : {
			provider : function (Provider, $route) {
				if ($route.current.params.id) {
					return new Provider().findById(parseInt($route.current.params.id));
				} else {
					return new Provider();
				}
			},
			providerInvoices : function (ProviderInvoice, $route) {
				if ($route.current.params.id) {
					return new ProviderInvoice().find({"provider._id":$route.current.params.id});
				} else {
					return new ProviderInvoice();
				}
			}

		}
	})
	.when('/changepassword/:token', {
		templateUrl : 'views/login.html',
		controller : 'LoginCtrl',
		resolve: {
			changePassword: function(){
				return true;
			}
		}
	})
	.when('/item/:id?', {
		templateUrl : 'views/item.html',
		controller : 'ItemCtrl',
		resolve : {
			item : function (Item, $route) {
				if ($route.current.params.id) {
					return new Item().findById(parseInt($route.current.params.id));
				} else {
					return new Item();
				}
			},
			companies : function (Company) {
				return new Company().filter({ });
			},
			itemTypes : function (ItemType) {
					return new ItemType().filter({});
			}
		}
	})
	.when('/itemList', {
		templateUrl : 'views/itemList.html',
		controller : 'ItemListCtrl'
	})
	.when('/itemType/:id?', {
		templateUrl : 'views/itemType.html',
		controller : 'ItemTypeCtrl',
		resolve : {
			itemType : function (ItemType, $route) {
				if ($route.current.params.id) {
					return new ItemType().findById(parseInt($route.current.params.id));
				} else {
					return new ItemType();
				}
			},
			companies : function (Company) {
				return new Company().filter({ });
			}
		}
	})
	.when('/itemTypeList', {
		templateUrl : 'views/itemTypeList.html',
		controller : 'ItemTypeListCtrl'
	})
	.when('/itemCollection/:id?', {
		templateUrl : 'views/itemCollection.html',
		controller : 'ItemCollectionCtrl',
		resolve : {
			itemCollection : function (ItemCollection, $route) {
				if ($route.current.params.id) {
					return new ItemCollection().findById(parseInt($route.current.params.id));
				} else {
					return new ItemCollection();
				}
			},
			items: function(Item){
				return new Item().find();
			}
		}
	})
	// .when('/itemCollectionList', {
	// 	templateUrl : 'views/itemCollectionList.html',
	// 	controller : 'ItemCollectionListCtrl'
	// })
	.when('/invoiceList', {
		templateUrl : 'views/invoiceList.html',
		controller : 'InvoiceListCtrl'
	})
	.when('/invoice/:id?', {
		templateUrl : 'views/invoice.html',
		controller : 'InvoiceCtrl',
		resolve:{
			statusList: function(List){
				return List.get('status');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			invoice : function (Invoice, $route) {
				if ($route.current.params.id) {
					return new Invoice().findById(parseInt($route.current.params.id));
				} else {
					return new Invoice();
				}
			}
		}
	})
	.when('/paymentList', {
		templateUrl : 'views/paymentList.html',
		controller : 'PaymentListCtrl'
	})
	.when('/payment/:id?', {
		templateUrl : 'views/payment.html',
		controller : 'PaymentCtrl',
		resolve:{
			statusList: function(List){
				return List.get('status');
			},
			paymentChoiceList: function(List){
				return List.get('paymentChoice');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			payment : function (Payment, $route) {
				if ($route.current.params.id) {
					return new Payment().findById(parseInt($route.current.params.id));
				} else {
					return new Payment();
				}
			}
		}
	})
	.when('/providerPaymentList', {
		templateUrl : 'views/providerPaymentList.html',
		controller : 'ProviderPaymentListCtrl'
	})
	.when('/providerPayment/:id?', {
		templateUrl : 'views/providerPayment.html',
		controller : 'ProviderPaymentCtrl',
		resolve:{
			statusList: function(List){
				return List.get('status');
			},
			paymentChoiceList: function(List){
				return List.get('paymentChoice');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			providerPayment : function (Payment, $route) {
				if ($route.current.params.id) {
					return new Payment().findById(parseInt($route.current.params.id));
				} else {
					return new Payment();
				}
			}
		}
	})
	.when('/debitNoteList', {
		templateUrl : 'views/debitNoteList.html',
		controller : 'DebitNoteListCtrl'
	})
	.when('/debitNote/:id?', {
		templateUrl : 'views/debitNote.html',
		controller : 'DebitNoteCtrl',
		resolve:{
			debitNoteTypeList: function(List){
				return List.get('debitNoteType');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			debitNote : function (DebitNote, $route) {
				if ($route.current.params.id) {
					return new DebitNote().findById(parseInt($route.current.params.id));
				} else {
					return new DebitNote();
				}
			}
		}
	})
	.when('/providerDebitNoteList', {
		templateUrl : 'views/providerDebitNoteList.html',
		controller : 'ProviderDebitNoteListCtrl'
	})
	.when('/providerDebitNote/:id?', {
		templateUrl : 'views/providerDebitNote.html',
		controller : 'ProviderDebitNoteCtrl',
		resolve:{
			debitNoteTypeList: function(List){
				return List.get('debitNoteType');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			providerDebitNote : function (DebitNote, $route) {
				if ($route.current.params.id) {
					return new DebitNote().findById(parseInt($route.current.params.id));
				} else {
					return new DebitNote();
				}
			}
		}
	})
	.when('/providerPaymentList', {
		templateUrl : 'views/providerPaymentList.html',
		controller : 'ProviderPaymentListCtrl'
	})
	.when('/providerPayment/:id?', {
		templateUrl : 'views/providerPayment.html',
		controller : 'ProviderPaymentCtrl',
		resolve:{
			statusList: function(List){
				return List.get('status');
			},
			paymentChoiceList: function(List){
				return List.get('paymentChoice');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			providerPayment : function (Payment, $route) {
				if ($route.current.params.id) {
					return new Payment().findById(parseInt($route.current.params.id));
				} else {
					return new Payment();
				}
			}
		}
	})
	.when('/creditNoteList', {
		templateUrl : 'views/creditNoteList.html',
		controller : 'CreditNoteListCtrl'
	})
	.when('/creditNote/:id?', {
		templateUrl : 'views/creditNote.html',
		controller : 'CreditNoteCtrl',
		resolve:{
			creditNoteTypeList: function(List){
				return List.get('creditNoteType');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			creditNote : function (CreditNote, $route) {
				if ($route.current.params.id) {
					return new CreditNote().findById(parseInt($route.current.params.id));
				} else {
					return new CreditNote();
				}
			}
		}
	})
	.when('/providerCreditNoteList', {
		templateUrl : 'views/providerCreditNoteList.html',
		controller : 'ProviderCreditNoteListCtrl'
	})
	.when('/providerCreditNote/:id?', {
		templateUrl : 'views/providerCreditNote.html',
		controller : 'ProviderCreditNoteCtrl',
		resolve:{
			creditNoteTypeList: function(List){
				return List.get('creditNoteType');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			providerCreditNote : function (CreditNote, $route) {
				if ($route.current.params.id) {
					return new CreditNote().findById(parseInt($route.current.params.id));
				} else {
					return new CreditNote();
				}
			}
		}
	})
	.when('/providerInvoiceList', {
		templateUrl : 'views/providerInvoiceList.html',
		controller : 'ProviderInvoiceListCtrl'
	})
	.when('/providerInvoice/:id?', {
		templateUrl : 'views/providerInvoice.html',
		controller : 'ProviderInvoiceCtrl',
		resolve:{
			statusList: function(List){
				return List.get('status');
			},
			companies: function(Company){
				return new Company().filter({});
			},
			branches: function(Branch){
				return new Branch().filter({});
			},
			providerinvoice : function (ProviderInvoice, $route) {
				if ($route.current.params.id) {
					return new ProviderInvoice().findById(parseInt($route.current.params.id));
				} else {
					return new ProviderInvoice();
				}
			}
		}
	})
	.when('/reportInvoice', {
		templateUrl : 'views/reportInvoice.html',
		controller : 'ReportInvoiceCtrl',
		resolve:{
			clients : function (User) {
				return new User().filter({ 'role._id': { $ne: 1} });
			},
			countries : function (Country) {
				return new Country().find();
			},
			statusList: function(List){
				return List.get('status');
			},
			items: function(Item){
				return new Item().filter({});
			},
			companyList: function(Company){
				return new Company().filter({});
			}
		}
	})
	// .when('/reportExpenses', {
	// 	templateUrl : 'views/reportExpenses.html',
	// 	controller : 'ReportExpensesCtrl',
	// 	resolve:{
	// 		clients : function (User) {
	// 			return new User().filter({ 'role._id': { $ne: 1} });
	// 		},
	// 		countries : function (Country) {
	// 			return new Country().find();
	// 		},
	// 		statusList: function(List){
	// 			return List.get('status');
	// 		},
	// 		items: function(Item){
	// 			return new Item().filter({});
	// 		},
	// 		companyList: function(Company){
	// 			return new Company().filter({});
	// 		}
	// 	}
	// })
	.when('/companyList', {
		templateUrl : 'views/companyList.html',
		controller : 'CompanyListCtrl'
	})
	.when('/company/:id?', {
		templateUrl : 'views/company.html',
		controller : 'CompanyCtrl',
		resolve : {
			company : function (Company, $route) {
				if ($route.current.params.id) {
					return new Company().findById(parseInt($route.current.params.id));
				} else {
					return new Company();
				}
			}
		}
	})
	.when('/branchList', {
		templateUrl : 'views/branchList.html',
		controller : 'BranchListCtrl'
	})
	.when('/branch/:id?', {
		templateUrl : 'views/branch.html',
		controller : 'BranchCtrl',
		resolve : {
			branch : function (Branch, $route) {
				if ($route.current.params.id) {
					return new Branch().findById(parseInt($route.current.params.id));
				} else {
					return new Branch();
				}
			},
			companies : function (Company) {
				return new Company().find();
			}
		}
	})
	.when('/606', {
		templateUrl : 'views/606.html',
		controller : '606Ctrl',
		resolve : {
			//Buscos los pagos realizados este mes
			ProviderInvoices : function (ProviderInvoice) {
				var b = new ProviderInvoice();
				var year = new Date().getFullYear();
				var month = new Date().getMonth();
				var totalDays = new Date(year, month + 1, 0).getDate();
				var query = {
					fromDate : new Date(year, month, 1, 0, 0, 0),
					toDate : new Date(year, month, totalDays, 23, 59, 59)
				};
				return b.filter(query);
			},
			Listas : function () {
				//Lista de año
				var year = new Date().getFullYear().toString();
				var yearList = [];
				for (var i = year; i > 1900; i--) {
					yearList.push(i.toString());
				}
				//Lista de meses
				var monthList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
				return {
					yearList : yearList,
					monthList : monthList
				}
			}
		}
	})
	.when('/607', {
		templateUrl : 'views/607.html',
		controller : '607Ctrl',
		resolve : {
			//Buscos los pagos realizados este mes
			Invoices : function (Invoice) {
				var b = new Invoice();
				var year = new Date().getFullYear();
				var month = new Date().getMonth();
				var totalDays = new Date(year, month + 1, 0).getDate();
				var query = {
					fromDate : new Date(year, month, 1, 0, 0, 0),
					toDate : new Date(year, month, totalDays, 23, 59, 59)
				};
				return b.filter(query);
			},
			Listas : function () {
				//Lista de año
				var year = new Date().getFullYear().toString();
				var yearList = [];
				for (var i = year; i > 1900; i--) {
					yearList.push(i.toString());
				}
				//Lista de meses
				var monthList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
				return {
					yearList : yearList,
					monthList : monthList
				}
			}
		}
	})
	.when('/608', {
		templateUrl : 'views/608.html',
		controller : '608Ctrl',
		resolve : {
			//Buscos los pagos realizados este mes
			CreditNotes : function (CreditNote) {
				var b = new CreditNote();
				var year = new Date().getFullYear();
				var month = new Date().getMonth();
				var totalDays = new Date(year, month + 1, 0).getDate();
				var query = {
					fromDate : new Date(year, month, 1, 0, 0, 0),
					toDate : new Date(year, month, totalDays, 23, 59, 59),
					'documentType.description' : 'Nota de Crédito'
				};
				return b.filter(query);
			},
			Listas : function () {
				//Lista de año
				var year = new Date().getFullYear().toString();
				var yearList = [];
				for (var i = year; i > 1900; i--) {
					yearList.push(i.toString());
				}
				//Lista de meses
				var monthList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
				return {
					yearList : yearList,
					monthList : monthList
				}
			}
		}
	})
	.when('/invoiceReport', {
		templateUrl : 'views/invoiceReport.html',
		controller : 'InvoiceReportCtrl',
		resolve: {
			clients : function (Client) {
				return new Client().filter({});
			},
			statusList: function(List){
				return List.get('status');
			},
			items: function(Item){
				return new Item().filter({});
			},
			companyList: function(Company){
				return new Company().filter({});
			}
		}
	})
	.when('/providerInvoiceReport', {
		templateUrl : 'views/providerInvoiceReport.html',
		controller : 'ProviderInvoiceReportCtrl',
		resolve: {
			providers : function (Provider) {
				return new Provider().filter({});
			},
			statusList: function(List){
				return List.get('status');
			},
			items: function(Item){
				return new Item().filter({});
			},
			companyList: function(Company){
				return new Company().filter({});
			}
		}
	})
	.when('/noaccess', {
		templateUrl : 'views/noaccess.html'
	})
	.otherwise({
		redirectTo : '/'
	});
});
