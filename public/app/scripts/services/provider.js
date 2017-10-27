'use strict';

angular.module('COMCSAApp')
.factory('Provider', function (Base, $http, $q, $window, $rootScope, $location, dialogs, toaster) {

	// Variable que se utiliza para comprobar si un objeto tiene una propiedad
	// var hasProp = Object.prototype.hasOwnProperty;

	// Nombre de la clase
	var Provider;

	function Provider(propValues) {
		Provider.super.constructor.apply(this, arguments);
		this.baseApiPath = "/api/provider";
		this.account = this.account || {};
		this.addresses = this.addresses || [];
		this.phones = this.phones || [];
		this.role = this.role || null;
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
	extend(Provider, Base);

	// Funcion que retorna las propiedades de una cuenta
	Provider.properties = function () {
		var at = {};
		return at;
	};



	Provider.prototype.goTo = function () {
		$location.path('/provider/' + this._id);
	};

	Provider.prototype.getProviderDocuments = function (query) {
		var d = $q.defer();
		var _this = this;
		$http({
			url: _this.baseApiPath + '/getProviderDocuments',
			method: "POST",
			data: { query: query},
			headers: {
			'Content-type': 'application/json'
			},
			responseType: 'arraybuffer'
		})
		.success(function (data, status, headers, config) {
			d.resolve(result)
			
		})
		.error(function (data, status, headers, config) {
			d.reject(data);
		});
		return d.promise;
	};

	return Provider;
});
