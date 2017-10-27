'use strict';

angular.module('COMCSAApp')
.factory('Document', function (Base, Item, $rootScope, $location, $q,$http, toaster, dialogs, Loading) {

	// Variable que se utiliza para comprobar si un objeto tiene una propiedad
	// var hasProp = Object.prototype.hasOwnProperty;

	// Nombre de la clase
	var Document;
	var a;
	function Document(propValues) {
		a = document.createElement("a");
			document.body.appendChild(a);
		Document.super.constructor.apply(this, arguments);
		this.baseApiPath = "/api/document";
		this.client = this.client || {};
		this.transactionId = this.transactionId || '';
		this.comment = this.comment || '';
		this.status = this.status || { _id: 1, description: 'Pendiente' };
		this.totalPaid = this.totalPaid || '';
		this.date = this.date || new Date();
	
	}
	var extend = function (child, parent) {
		var key;
		for (key in parent) {
			if (hasProp.call(parent, key)) {
				child[key] = parent[key];
			}
		}

		function Ctor() {
			this.constructor = child;
		}
		Ctor.prototype = parent.prototype;
		child.prototype = new Ctor();
		child.super = parent.prototype;
		return child;
	};
	// Extender de la clase Base
	extend(Document, Base);

	// Funcion que retorna las propiedades de una cuenta
	Document.properties = function () {
		var at = {};
		return at;
	};
	
	
	Document.prototype.goTo = function () {
		if (this.paymentType == "ProviderPayment") {
			$location.path('/providerPayment/' + this._id);
		} else {
			$location.path('/payment/' + this._id);
			
		}
	};

	Document.prototype.download = function(){
		var d = $q.defer();
		var _this = this;
		toaster.warning('Generando el documento');
		
		$http({
			url: this.baseApiPath + '/download',
			method: "POST",
			data: { id: _this._id }, //this is your json data string
			headers: {
			'Content-type': 'application/json'
			},
			responseType: 'arraybuffer'
		})
		.success(function (data, status, headers, config) {
			var json = JSON.stringify(data);
			var blob = new Blob([data], {
				type: "application/pdf"
			});
			var url = window.URL.createObjectURL(blob);
			
			a.href = url;
			a.download = "P" + _this.transactionId + '.pdf';
			a.click();
			window.URL.revokeObjectURL(url);
			d.resolve(url);
	    })
	    .error(function (data, status, headers, config) {
	    	toaster.error('Hubo un error exportando el archivo, favor tratar nuevamente')
	        d.reject(data);
	    });
	    return d.promise;
	};
	Document.prototype.send = function(emails){
		var d = $q.defer();
		var _this = this;
		var email = _this.client ? _this.client.account.email : null;

		var dialog = dialogs.create('views/emails.html', 'EmailsCtrl', { email: email });
		dialog.result.then(function (emails) {
			toaster.warning('Enviando el Correo');
			$http.post(_this.baseApiPath + '/send', { id: _this._id, emails: emails })
			.success(function (data) {
				toaster.success('El pago fue enviado!.');
		    })
		    .error(function (data, status, headers, config) {
		    	toaster.error('Hubo un error enviando el correo, favor tratar nuevamente')
		        d.reject(data);
		    });
		});
		return d.promise;
	};
	Document.prototype.sendTo = function(emails, sendToAllAdmin){
		var d = $q.defer();
		var _this = this;
		toaster.warning('Enviando el Correo');
		$http.post(_this.baseApiPath + '/send', { id: _this._id, emails: emails, sendToAllAdmin: sendToAllAdmin })
		.success(function (data) {
			toaster.success('El Pago fue Enviado!.');
			$location.path('invoiceList');
	    })
	    .error(function (data, status, headers, config) {
	    	toaster.error('Hubo un error enviando el correo, favor tratar nuevamente')
	        d.reject(data);
	    });
		return d.promise;
	};



	Document.prototype.getReport = function(query, queryDescription){
		var d = $q.defer();
		var _this = this;
		$http({
			url: this.baseApiPath + '/report',
			method: "POST",
			data: { query: query, queryDescription: queryDescription },
			headers: {
			'Content-type': 'application/json'
			},
			responseType: 'arraybuffer'
		})
		.success(function (data, status, headers, config) {
			var json = JSON.stringify(data);
			var blob = new Blob([data], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			});
			var url = window.URL.createObjectURL(blob);
			
			a.href = url;

			var reportName = ((queryDescription.status ? queryDescription.status + ' ' :'') 
							+(queryDescription.expenses ? 'Gastos ' :'')
							+(queryDescription.company ? queryDescription.company + ' ' : '')
							+(queryDescription.branch ? queryDescription.branch  + ' ' : '')).toUpperCase()
							+formatDate(new Date) 
							+'.xlsx';

			a.download = reportName;
			a.click();
			window.URL.revokeObjectURL(url);
			d.resolve(url);
	    })
	    .error(function (data, status, headers, config) {
	    	toaster.error('Hubo un error exportando el archivo, favor tratar nuevamente')
	        d.reject(data);
	    });
	    return d.promise;
	};

	Document.prototype.find = function (query) {
		var deferred = $q.defer();
		var _this = this;
		$http({
			url: this.baseApiPath+'/getProviderDocuments',
			method: "POST",
			data: { query: query},
			headers: {
			'Content-type': 'application/json'
			},
			responseType: 'JSON'
		})
		.success(function (data, status, headers, config) {
			var response = {}
			data = data;

			// //Create a new object of the current class (or an array of them) and return it (or them)
			// if (Array.isArray(data)) {
			// 	response.data = data.map(function (obj) {
			// 			return new _this(obj);
			// 		});
			// 	//Add "delete" method to results object to quickly delete objects and remove them from the results array
			// 	response.delete  = function (object) {
			// 		object.delete ().then(function () {
			// 			return response.data.splice(response.data.indexOf(object), 1);
			// 		});
			// 	};
			// } else {
			// 	response = new _this(data);
			// }
			return deferred.resolve(data);
		}).error(function (data, status, headers, config) {
			return deferred.reject(data);
		});
		return deferred.promise;
	};

	function formatDate(date) {

	  var day = date.getDate();
	  var month = date.getMonth();
	  var year = date.getFullYear();

	  return day + "-" + month + "-" + year;
	}

	return Document;
});
