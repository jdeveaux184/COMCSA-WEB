'use strict';

var Crud = require('./crud');

function ItemType(db, userLogged) {
	this.crud = new Crud(db, 'ITEMTYPE', userLogged);

	//DB Table Schema
	this.schema = {
		id : '/ItemType',
		type : 'object',
		properties : {
			code : {
				type : 'int',
				required : false
			},
			description : {
				type : 'string',
				required : true
			}
		}
	};
	this.crud.schema = this.schema;
	//this.crud.uniqueFields = [ 'code' ];
}

//Export
module.exports = ItemType;
