'use strict';

angular.module('COMCSAApp')
.factory('Tax', function (Base, $location) {

	// Variable que se utiliza para comprobar si un objeto tiene una propiedad
	// var hasProp = Object.prototype.hasOwnProperty;

	// Nombre de la clase
	var Tax;

	function Tax(propValues) {
		Tax.super.constructor.apply(this, arguments);
		this.baseApiPath = "/api/Tax";
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
	extend(Tax, Base);

	// Funcion que retorna las propiedades de una cuenta
	Tax.properties = function () {
		var at = {};
		return at;
	};

	Tax.prototype.goTo = function () {
		$location.path('/tax/' + this._id);
	};

	return Tax;

});
