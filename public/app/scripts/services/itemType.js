'use strict';

angular.module('COMCSAApp')
.factory('ItemType', function (Base, $location) {

	// Variable que se utiliza para comprobar si un objeto tiene una propiedad
	// var hasProp = Object.prototype.hasOwnProperty;

	// Nombre de la clase
	var ItemType;

	function ItemType(propValues) {
		ItemType.super.constructor.apply(this, arguments);
		this.baseApiPath = "/api/itemType";
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
	extend(ItemType, Base);

	// Funcion que retorna las propiedades de una cuenta
	ItemType.properties = function () {
		var at = {};
		return at;
	};
	
	ItemType.prototype.getTotalPrice = function(){
		return this.price * (this.quantity || 1);
	};

	ItemType.prototype.goTo = function () {
		$location.path('/itemType/' + this._id);
	};
	return ItemType;
});
