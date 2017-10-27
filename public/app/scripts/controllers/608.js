'use strict';

var app = angular.module('COMCSAApp');

app.controller('608Ctrl', function ($scope, $rootScope, CreditNotes, Listas, CreditNote, $http, $timeout, toaster) {
	var year = new Date().getFullYear().toString();
	var month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString();
	var user = $rootScope.userData;
	//Lista de valores añoy mes
	$scope.yearList = Listas.yearList;
	$scope.monthList = Listas.monthList;
	//Período actual
	$scope.period = {
		year : year,
		month : month
	};
	$scope.totalAmount = 0;
	$scope.taxAmount = 0;
	$scope.changed = false;
	var getDate = function(date){
		var year = new Date(date).getFullYear().toString();
		var month = new Date(date).getMonth() + 1 < 10 ? '0' + (new Date(date).getMonth() + 1).toString() : (new Date(date).getMonth() + 1).toString();
		var day = new Date(date).getDate() < 10 ? '0' + new Date(date).getDate().toString() : new Date(date).getDate().toString();
		return year + month + day;
	};

	//Convierte los pagos a los datos del reporte 606
	var convertTo = function (invoices) {
		var data = [];
		for (var i = 0; i < invoices.length; i++) {
			var invoice = invoices[i];
			var document = {
				invoiceId: invoice._id,
				NCF : invoice.ncf,
				date : getDate(invoice.date),
        type : invoice.tipo
			};
			data.push(document);
		}
		$scope.data = Object.keys(data).map(function(k) { return data[k]; });
		$scope.changed = false;
		toaster.pop('success', '', 'Se han cargado los datos.');
	};
	$scope.filterBy = function (period) {
		var b = new CreditNote();
		var year = parseInt(period.year);
		var month = parseInt(period.month) - 1;
		var totalDays = new Date(year, month + 1, 0).getDate();
		var query = {
			fromDate : new Date(year, month, 1, 0, 0, 0),
			toDate : new Date(year, month, totalDays, 23, 59, 59),
			'documentType.description' : 'Nota de Crédito'
		};
		console.log(query)
		b.filter(query)
		.then(function (creditNotes) {
			convertTo(creditNotes.data);
		},
			function (err) {
			toaster.pop('error', '', 'Error al traer los datos');
		});
	};
	$scope.exportTo = function(dataSource){
		var myTableArray = [];
		//Header
		myTableArray.push(['Reporte 608']); //linea 1
		myTableArray.push(['Datos']); //Linea 2
		myTableArray.push([]);
		//Datos del propietario
		myTableArray.push(['RNC o Cédula', $rootScope.userData.entity.entityType == 'Compañía' ? $rootScope.userData.entity.RNC : $rootScope.userData.entity.identificationCode ]);
		myTableArray.push(['Periodo', $scope.period.year + $scope.period.month]);
		myTableArray.push(['Cantidad Registros', dataSource.length]);
		myTableArray.push([]);
		//Detalles
		myTableArray.push(['Líneas', 'Número de Comprobante Fiscal' , 'Fecha de Comprobante', 'Tipo de Anulación']);
		for(var i = 0; i < dataSource.length; i++){
			myTableArray.push([ i + 1, dataSource[i].NCF, dataSource[i].entryDate, dataSource[i].type]);
		}
		//Saving
		$http.post('/api/excel/writeFileSync', { obj: {
			name: '608',
			data: [{
				name: 'Reporte 608',
				data: myTableArray
			}]
		}
		})
		.success(function(obj){
			var path = obj.path;
			$scope.path = path;
			$timeout(function(){
				document.getElementById('downloadReport').click();
			});
	    })
		.error(function(obj){

		});
	};
	//Consigo la data y cargo
	convertTo(CreditNotes.data);
});
