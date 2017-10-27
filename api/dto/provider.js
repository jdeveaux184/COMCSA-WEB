'use strict';

var Crud = require('./crud');

var q = require('q');

function Provider(db, userLogged) {
	this.crud = new Crud(db, 'PROVIDER', userLogged);
	this.crudDocument = new Crud(db, 'DOCUMENT', 1)

	//DB Table Schema
	this.schema = {
		id : '/Provider',
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

Provider.prototype.getProviderDocuments = function (provider) {
	var deferred = q.defer();
	this.crudDocument.find({'provider._id': provider})
	.then(function(result) {
		deferred.resolve(result);
	})
	.catch (function (err) {
			deferred.reject({
				result : 'not ok',
				errors : err
			});
		});

	return deferred.promise;
};

//Export
module.exports = Provider;
