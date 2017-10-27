'use strict';

angular.module('COMCSAApp')
.factory('Client', function (Base, $http, $q, $window, $rootScope, $location, dialogs, toaster) {

	// Variable que se utiliza para comprobar si un objeto tiene una propiedad
	// var hasProp = Object.prototype.hasOwnProperty;

	// Nombre de la clase
	var Client;

	function Client(propValues) {
		Client.super.constructor.apply(this, arguments);
		this.baseApiPath = "/api/client";
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
	extend(Client, Base);

	// Funcion que retorna las propiedades de una cuenta
	Client.properties = function () {
		var at = {};
		return at;
	};



	Client.prototype.goTo = function () {
		$location.path('/client/' + this._id);
	};
	return Client;
});
