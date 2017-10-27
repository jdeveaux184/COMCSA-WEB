'use strict';

var q = require('q'),
	util = require('./util'),
	docType = require('./configData'),
	Documents = require('./document'),
	math = require('sinful-math'),
	bigNumber = require('bignumber'),
	Crud = require('../dto/crud'),
	Ncf = require('./ncf.js');


function CreditNote(enterpriseId) {

	this.documentType = docType.documentType.creditNote;
	Documents.apply(this, Array.prototype.slice.call(arguments));


	this.schema.id = '/CreditNote';
	this.crudDocument = new Crud(this.crud.db, 'DOCUMENT', enterpriseId);

	var detailSchema = {
		"type": "object",
		"properties": {
			"item": {
				"type": "object"
			},
			"memo": {
				"type": "string"
			},
			"convertionRate": {
				"type": "double"
			},
			"amount": {
				"type": "number"
			}
		}
	};

	this.schema.properties.vendor = {
		"type": "object",
		"required": false
	};
	this.schema.properties.client = {
		"type": "object",
		"required": false
	};
	this.schema.properties.entryDate = {
		"type": "date",
		"required": true
	};
	this.schema.properties.NCF = {
		"type": "object",
		"required": false
	};
	this.schema.properties.memo = {
		"type": "string"
	};
	this.schema.properties.amount = {
		"type": "double",
		"required": true
	};
	this.schema.properties.detail = {
		"type": "array",
		"items": detailSchema
	};
	this.schema.properties.originalAmount = {
		"type": "double",
		"required": true
	};

}

function updateInvoice(object){
	var doc = object.invoice? object.invoice : object.bill;

	if (object.tipoDePago == 'Total'){
		doc.status = 'Saldada';
	}
	else{
		doc.status = 'Pagada Parcialmente';
	}


	if (object.invoice){
		object.invoice = doc;

		if (!object.invoice.paymentReceipts)
			object.invoice.paymentReceipts = [];

		object.invoice.paymentReceipts.push({id: object._id,
					amount: object.amount})
	}

	if (object.bill){
		object.bill = doc;

		if (!object.bill.paymentsId)
			object.bill.paymentsId = [];

		object.bill.paymentsId.push({id: object._id,
					amount: object.amount})
	}

	return object;
}

CreditNote.prototype = new Documents();

CreditNote.prototype.test = function () {
	var deferred = q.defer();
	deferred.resolve('This works');

	return deferred.promise;
};

CreditNote.prototype.insert = function (newObject) {
	var deferred = q.defer(),
		that = this,
		crdNote = null,
		ncf = new Ncf(this.db, this.enterpriseId);
	util.getYearlySequence(this.crud.db, 'CreditNote').then(function (data) {

		var def = q.defer();
		newObject.code = data;
		newObject.documentType = that.documentType;

		// if (newObject.NCF.ncfType._id){
  //     return ncf.useNcf(newObject.NCF.ncfType);
  //   } else {
      return;
    // }
  })
  .then(function (data) {
    if (data)
      newObject.NCF = data.data[0];
		that.crud.insert(newObject, that.schema).then(function (obj) {

			crdNote = obj.data;

			// crdNote = updateInvoice(crdNote);

			// var doc = (crdNote.invoice)? crdNote.invoice : crdNote.bill;
			// that.crudDocument.update({"_id" : doc._id}, doc);


			return obj.data;
		}).then(function (res) {
			deferred.resolve({data:crdNote});
		}).fail(function (err) {
			if (crdNote) {
				deferred.resolve(crdNote);
			} else {
				deferred.reject(err);
			}
		});
	});

	return deferred.promise;
};

var assignError = function (message, error) {
	var responseError = {
		error: {
			res: 'Not ok'
		}
	};
	responseError.error.message = message;
	responseError.error.error = error;
	return responseError;
};


module.exports = CreditNote;
