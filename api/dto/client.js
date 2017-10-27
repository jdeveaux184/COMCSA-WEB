'use strict';

var Crud = require('./crud');

function Client(db, userLogged) {
	this.crud = new Crud(db, 'CLIENT', userLogged);

	//DB Table Schema
	this.schema = {
		id : '/Client',
		type : 'object',
		properties : {
			id : {
				type : 'string',
				required : true
			},
			idType : {
				type : 'object',
				required : true
			},
			type : {
				type : 'object',
				required : true
			},
			name : {
				type : 'string',
				required : true
			},
			email : {
				type : 'string',
				required : false
			},
			phone : {
				type : 'object',
				required : false
			}
		}
	};
	this.crud.schema = this.schema;
	this.crud.uniqueFields = [ ['email', 'idType', 'id'] ];
}

//Export
module.exports = Client;
