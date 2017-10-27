'use strict';

var q = require('q');
var util = require('./util');
var Crud = require('./crud');

function List(db) {
	//Listados
	this.phoneType = [{
		_id: 1,
		description: 'Casa'
	},{
		_id: 2,
		description: 'Celular'
	},{
		_id: 3,
		description: 'Trabajo'
	},{
		_id: 4,
		description: 'Otro'
	}
	];
	this.status = [
		{
			_id: 1,
			description: 'Pendiente'
		},{
			_id: 3,
			description: 'Pagada Parcialmente'
		},{
			_id: 4,
			description: 'Pagada'
		},{
			_id: 5,
			description: 'Cancelada'
		}
	];
	this.search = [{
			code: 'User',
			description: 'Customer'
		},{
			code: 'Company',
			description: 'Company'
		},{
			code: 'Branch',
			description: 'Branch'
		}
	];
	this.paymentChoice = [{
			code: 'cash',
			description: 'Efectivo'
		},{
			code: 'creditCard',
			description: 'Tarjeta de Crédito'
		},{
			code: 'transfer',
			description: 'Transferencia'
		},{
			code: 'deposit',
			description: 'Depósito Bancario'
		}
	];
	this.debitNoteType = [{
			code: 'userError',
			description: 'Error en Pago'
		},{
			code: 'refund',
			description: 'Devolución'
		}
	];
	this.creditNoteType = [{
			code: 'adjustment',
			description: 'Ajuste'
		},{
			code: 'cancelation',
			description: 'Cancelación'
		}
	];
	this.submenu = [
		{
			_id: 1,
			description: 'Suplidores',
			icon: 'fa-credit'
		},{
			_id: 2,
			description: 'Cliente',
			icon: 'fa-money'
		},{
			_id: 3,
			description: 'Configuración',
			icon: 'fa-settings'
		},{
			_id: 4,
			description: 'Reportes',
			icon: 'fa-chart'
		}
	];
};

List.prototype.getList = function(list){
	var d = q.defer();
	d.resolve(this[list] || []);
	return d.promise;
};
//Export
module.exports = List;