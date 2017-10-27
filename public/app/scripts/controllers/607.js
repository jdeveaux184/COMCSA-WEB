'use strict';

var app = angular.module('COMCSAApp');

app.controller('607Ctrl', function ($scope, $rootScope, Invoices, Listas, Invoice, $http, $timeout, toaster) {
  var year = new Date().getFullYear().toString();
  var month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString();
  var user = $rootScope.userData;
  console.log(user);
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
  var getIdentification = function(client){
    var idType = 'Favor Digitar';
    var idCode;
    if (client.entity){
      idCode = client.entity.entityType == 'Persona' ? client.entity.firstName + ' ' + client.entity.lastName : client.entity.name;
      if(client.entity.entityType == 'Persona'){
        if(client.entity.identificationCode == '' || !client.entity.identificationCode){
          idType = 3;
          idCode = '';
        }
        else if(client.entity.identificationCode.length == 13){ //Cedula
          idType = 2;
          var withoutHyphen = client.entity.identificationCode.split('-');
          idCode = '';
          for(var k in withoutHyphen)
            idCode += withoutHyphen[k];
        }
      }
      else {
        if(client.entity.RNC == '' || !client.entity.RNC){
          idType = 3;
          idCode = '';
        }
        else if(client.entity.RNC.length == 9){ //RNC
          idType = 1;
          var withoutHyphen = client.entity.RNC.split(' ');
          idCode = '';
          for(var k in withoutHyphen)
            idCode += withoutHyphen[k];
        }
      }
    }
    return { type: idType, code: idCode };
  };
  //Convierte los pagos a los datos del reporte 606
  var convertTo = function (invoices) {
    var data = [];
    var amount = 0;
    var tax = 0;
    for (var i = 0; i < invoices.length; i++) {
      var invoice = invoices[i];
      var ident = getIdentification(invoice.client);
      var document = {
        invoiceId: invoice._id,
        id : invoice.client.id,
        idType : invoice.client.idType,
        NCF : invoice.ncf,
        date : getDate(invoice.date),
        payDate: getDate(invoice.dueDate),
        tax : invoice.taxAmount || 0,
        amount : invoice.amount || 0
      };
      data.push(document);
      amount += Number(document.tax) + Number(document.amount);
      tax += Number(document.tax);
    }
    $scope.totalAmount = amount;
    $scope.taxAmount = tax;
    $scope.data = Object.keys(data).map(function(k) { return data[k] });
    $scope.changed = false;
    toaster.pop('success', '', 'Se han cargado los datos.');
  };
  $scope.filterBy = function (period) {
    var b = new Invoice();
    var year = parseInt(period.year);
    var month = parseInt(period.month) - 1;
    var totalDays = new Date(year, month + 1, 0).getDate();
    var query = {
      fromDate : new Date(year, month, 1, 0, 0, 0),
      toDate : new Date(year, month, totalDays, 23, 59, 59)
    };
    console.log(query);
    b.filter(query)
    .then(function (invoices) {
      convertTo(invoices.data);
    },
      function (err) {
      toaster.pop('error', '', 'Error al traer los datos');
    });
  };
  $scope.exportTo = function(dataSource, totalAmount, taxAmount){
    var myTableArray = [];
    //Header
    myTableArray.push(['Reporte 607']); //linea 1
    myTableArray.push(['Datos']); //Linea 2
    myTableArray.push([]);
    //Datos del propietario
    myTableArray.push(['RNC o Cédula', getIdentification(user).code ]);
    myTableArray.push(['Periodo', $scope.period.year + $scope.period.month]);
    myTableArray.push(['Cantidad Registros', dataSource.length || 0, '', 'Valor Calculado', 'ITBIS Calculado']);
    myTableArray.push(['Total Monto Facturado', totalAmount, '', totalAmount, taxAmount ]);
    myTableArray.push([]);
    //Detalles
    myTableArray.push(['Líneas', 'RNC o Cédula' , 'Tipo Identificación', 'NCF', 'NCF Modificado', 'Fecha Comprobante', 'ITBIS Facturado', 'Monto Facturado']);
    for(var i = 0; i < dataSource.length; i++){
      myTableArray.push([ i + 1, dataSource[i].id, dataSource[i].idType, dataSource[i].ncf, '', dataSource[i].date, dataSource[i].tax, dataSource[i].amount]);
    }
    //Saving

    $http.post('/api/excel/writeFileSync', { obj: {
      name: '607',
      data: [{
        name: 'Reporte 607',
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
  convertTo(Invoices.data);
});
