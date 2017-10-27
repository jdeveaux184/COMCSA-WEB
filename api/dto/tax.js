'use strict';

var Crud = require('./crud');
var q = require('q');

function Option(db, userLogged) {
	this.crud = new Crud(db, 'TAX', userLogged);

	//DB Table Schema
	this.schema = {
		id : '/Option',
		type : 'object',
		properties : {
			description : {
				type : 'string',
				required : true
			},
			percentage : {
				type : 'number',
				required : true
			},
			type : {
				type: 'string',
				required: false
			}
		}
	};
	this.crud.schema = this.schema;
	// this.crud.uniqueFields = [ 'url' ];
}


//Export
module.exports = Option;
