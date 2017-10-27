'use strict';

angular.module('COMCSAApp')
.factory('Item', function (Base, $location) {

	// Variable que se utiliza para comprobar si un objeto tiene una propiedad
	// var hasProp = Object.prototype.hasOwnProperty;

	// Nombre de la clase
	var Item;

	function Item(propValues) {
		Item.super.constructor.apply(this, arguments);
		this.baseApiPath = "/api/item";
		this.price = this.price || 0;
		this.quantity = this.quantity || 1;
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
	extend(Item, Base);

	// Funcion que retorna las propiedades de una cuenta
	Item.properties = function () {
		var at = {};
		return at;
	};
	
	Item.prototype.getTotalPrice = function(){
		return this.price * (this.quantity || 1);
	};

	Item.prototype.goTo = function () {
		$location.path('/item/' + this._id);
	};
	return Item;

});
