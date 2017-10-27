'use strict';

var q = require('q'),
	util = require('./util'),
	docType = require('./configData'),
	Documents = require('./document'),
	math = require('sinful-math'),
	bigNumber = require('bignumber'),
	Crud = require('./crud'),
	PaymentReceipt = require('./payment'),
	Ncf = require('./ncf.js');

function DebitNote(db, enterpriseId) {

	this.documentType = docType.documentType.debitNote;
	Documents.apply(this, Array.prototype.slice.call(arguments));
	this.enterpriseId = enterpriseId;
	this.schema.id = '/DebitNote';

	this.crudAccount = new Crud(db, 'ACCOUNT', enterpriseId);
	this.payReceipt = new PaymentReceipt();

}

DebitNote.prototype = new Documents();

DebitNote.prototype.test = function (){
	var deferred = q.defer();
	deferred.resolve('This works')

	return deferred.promise;
}

DebitNote.prototype.insert = function(newNote, user) {
	var deferred = q.defer();
	var that = this;
	var cancellationAccount;
	var id;
	var invoice;
	var ncf = new Ncf(this.db, this.enterpriseId);

	newNote.documentType = this.documentType;

		// Obtener la secuencia anual
	util.getYearlySequence(this.db, 'DebitNote').then(function (data) {
		var def = q.defer();
		newNote.code = data;
		//Tomar la cuenta de cancelacion del usuario logueado
		cancellationAccount = user.cancellationAccount;
		//Insertar en la base de datos
		// if (newNote.NCF.ncfType._id){
		// 	// var deferred = q.defer();
		// 	var params = {
		// 		filter: {'$and':[{'used':false},{'ncfType._id':newNote.NCF.ncfType._id}]},
		// 		limit: 1,
		// 		skip: 0,
		// 		sort: ['ncf'],
		// 		search: '',
		// 		fields: [],
		// 		startDate: '',
		// 		endDate: ''
		// 	};

		// 	ncf.crud.paginatedSearch(params).then(function (data){
		// 		// console.log(data);
		// 		newNote.NCF = data.data[0];
		// 		def.resolve(newNote);
		// 	}, function (err){
		// 		def.reject(err);
		// 	})
		// }else{

			def.resolve(newNote);
		// }

		return def.promise;
	}, function (error) {
		deferred.reject(assignError('No se pudo obtener la secuencia anual', error));
	}).then(function (data){
		console.log(data)
		that.crud.insert(newNote, that.schema).then(function (res) {
			deferred.resolve(res);
			//Actualizar los invoices
			that.updateInvoices(res.data).then(function (obj){ 
				console.log('el obj', obj)
				newNote = obj;
				//Actualizar la nota de debito
				that.crud.update({
					'_id': obj._id
				}, newNote).then(function (data) {
					console.log('Actualice y termine ya')
				}, function (err) {
					console.log('No actualice, revisa ->', err)
				});
			}, function (err) {
				console.log('No se pudieron actualizar los invoices')
			})

			if (newNote.NCF.ncf){
				ncf.crud.update({
					ncf: newNote.NCF.ncf
				}, {
					used: true
				});
			}
		}, function (error) {
			deferred.reject(assignError('No se pudo insertar la nota de debito', error));
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

//Update the invoices after the debit note is applied
DebitNote.prototype.updateInvoices = function(newNote) {
	var deferred = q.defer();
	var id;
	var invoice;
	var that = this;
	console.log('hi', newNote.detail)
	for (var i in newNote.detail) {
		//Si es devolucion
		if (newNote.type == 'Devolución') {
			if (newNote.detail[i].amount == newNote.detail[i].invoice.amount) {
				newNote.detail[i].invoice.status = docType.invoiceStatus.pending;
				// newNote.detail[i].invoice.paymentReceipts.length = 0;	
			} else {
				newNote.detail[i].invoice.status = docType.invoiceStatus.partiallyPaid;
			};
		}
		//Si es Pago mal Aplicado 
		else{
			newNote.detail[i].paymentReceipts.push({
				'id': newNote._id,
				'amount': new bigNumber(newNote.amount.toString()).times(new bigNumber(newNote.detail[i].accountConvertionRate.toString())).toNumber()
			});
			if (newNote.detail[i].amount == newNote.detail[i].noteAmount) {
				console.log('in')
				newNote.detail[i].status = docType.invoiceStatus.paid;
				// newNote.detail[i].invoice.paymentReceipts.length = 0;	
			} else {
				newNote.detail[i].status = docType.invoiceStatus.partiallyPaid;
			};
		};

		delete newNote.detail[i].noteAmount;

	};

	newNote.detail.forEach(function (elem, index) {
		console.log('id e invoice -> ', elem)
		id = elem.invoice ? elem.invoice._id : elem._id;
		invoice = elem.invoice ? elem.invoice : elem;
		that.crud.update({
			'_id': id
		}, invoice).then(function (obj) {
			console.log('Actualize los invoices');
			deferred.resolve(newNote);
		}, function (error) {
			console.log('No pude actualizar los invoices');
		});
	});

	return deferred.promise;

};

DebitNote.prototype.createPaymentRequest = function(newNote, user) {
	var deferred = q.defer();
	var that = this;

	//PaymentRequest to be inserted
	var paymentRequest = {
		'documentType': docType.documentType.paymentRequest,
		'owner': newNote.client,
		'entryDate': newNote.entryDate,
		'detail': newNote.detail,
		'account': newNote.account,
		'currency': newNote.currency,
		'doubleConvertionRate': newNote.accountConvertionRate,
		'convertionRate': newNote.convertionRate,
		'ownerConvertionRate': newNote.ownerConvertionRate,
		'accountConvertionRate': newNote.accountConvertionRate,
		'amount': newNote.amount,
		'status': 'Pendiente',
		'paymentType': 'Cheque',
		'cancellationAccount': user.cancellationAccount
	};

	//Get the code for the paymentRequest
	util.getYearlySequence(this.db, this.enterpriseId, 'PaymentRequest').then(function (data) {
		paymentRequest.code = data;
		console.log('aaaaaa', data)
		//Insert the paymentRequest
		that.crud.insert(paymentRequest).then(function (obj) {
			// console.log('Inserte el paymentRequest', obj);
			deferred.resolve(obj);
		}).fail(function (err) {
			console.log('Ocurrio un error en la insercion del paymentRequest', err);
			deferred.reject({
				message: 'Ocurrio un error en la insercion del paymentRequest',
				error: err
			});
		});


	}, function (error) {
		console.log('Ocurrio un error');
		deferred.reject(error);
	});


	return  deferred.promise;

};


module.exports = DebitNote;