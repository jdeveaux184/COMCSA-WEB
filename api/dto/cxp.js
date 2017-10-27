'use strict';

var q = require('q');
var Crud = require('./crud');
var Address = require('./address');
var Company = require('./company');
var Item = require('./item');
var _ = require('underscore');
var util = require('./util');
var excel = require('../excel');
var moment = require('moment');
var User = require('./user');
var pdf = require('../pdf');
var fs = require('fs');
var config = require('./configData');

function ProviderInvoice(db, userLogged, dirname) {
	this.crud = new Crud(db, 'DOCUMENT', userLogged);
	this.crudCompany = new Crud(db, 'COMPANY', userLogged);
	this.company = new Company(db, userLogged);
	this.crudBranch = new Crud(db, 'BRANCH', userLogged);
	this.user = new User(db, '', userLogged);
	this.dirname = dirname;
	this.db = db;
	this.documentType = config.documentType.providerInvoice;
	//DB Table Schema
	this.schema = {
		id : '/ProviderInvoice'
	};
	this.crud.schema = this.schema;
	this.crud.uniqueFields = ['code'];
}

ProviderInvoice.prototype.insert = function (invoice, username, mail) {
	var d = q.defer();
	var _this = this;
	var total = 0;
	invoice.documentType = _this.documentType;
	invoice.provider = invoice.client;
	invoice.amount = invoice.total;
	//sumo el total
	for (var i = 0; i < invoice.items.length; i++) {
		total += invoice.items[i].quantity * invoice.items[i].price;
	}
	invoice.total = total;
	//Consigo el sequencial de invoice
	var promise = util.getYearlySequence(this.db, 'ProviderInvoice')//util.getYearlySequence(_this.crud.db, 'Invoice');
	
	promise
	.then(function (sequence) {
		invoice.code = sequence;
		return _this.crud.insert(invoice, invoice.invoiceNumber == 'Pending Invoice');
	})
	//inserto
	.then(function (obj) {
		//_this.sendInvoice(obj.data._id, username, mail);
		var setObj = { invoiceNumber: invoice.invoiceNumber };
		if(invoice.pono)
			setObj.pono = invoice.pono;

		d.resolve(obj);
	})
	.catch (function (err) {
		console.log(err)
		d.reject({
			result : 'Not ok',
			errors : err
		});
	});
	return d.promise;
};

ProviderInvoice.prototype.update = function (query, invoice, user, mail) {
	var d = q.defer();
	var _this = this;
	var total = 0;
	//sumo el total
	for (var i = 0; i < invoice.items.length; i++) {
		total += invoice.items[i].quantity * invoice.items[i].price;
	}
	invoice.total = total;
	_this.crud.update(query, invoice, invoice.invoiceNumber == 'Pending Invoice')
	.then(function (obj) {
		var setObj = { invoiceNumber: invoice.invoiceNumber };
		
		if(invoice.pono)
			setObj.pono = invoice.pono;
		if(invoice.unitno)
			setObj.unitno = invoice.unitno;
		if(invoice.items.length>0)
			setObj.items = invoice.items;
		if(invoice.total)
			setObj.total = invoice.total;
		
		
		d.resolve(obj);
	})
	.catch (function (err) {
		console.log(err)
		d.reject({
			result : 'Not ok',
			errors : err
		});
	});
	return d.promise;
};

ProviderInvoice.prototype.getReport = function(query, queryDescription, res){
	
	this.createReport(query, queryDescription)
	.then(function(obj){
		fs.readFile(obj.path, function (err,data){
			res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.send(data);
		});
	});
};

ProviderInvoice.prototype.createReport = function(query, queryDescription){
	var d = q.defer();
	var _this = this;
	_this.crud.find(query)
	.then(function (result) {
		return excel.createReport(result.data, 'Factura', query, queryDescription);
	})
	.then(function (data) {
		d.resolve(data);
	})
	.catch (function (err) {
		d.reject({
			result : 'Not ok',
			errors : err
		});
	});
	return d.promise;
};

ProviderInvoice.prototype.createInvoice = function(id){
	var d = q.defer();
	var invoice = {};
	var company = {};
	var _this = this;
	var query = {
		_id: id
	};
	_this.crud.find(query)
	.then(function (result) {
		invoice = result.data[0];
		return _this.crudCompany.find({ _id: invoice.company._id });
	})
	.then(function (result) {
		company = result.data[0];
		return pdf.createInvoice(invoice, company);
	})
	.then(function (data) {
		d.resolve(data);
	})
	.catch (function (err) {
		d.reject({
			result : 'Not ok',
			errors : err
		});
	});
	return d.promise;
};

ProviderInvoice.prototype.getInvoice = function(id, res){
	this.createInvoice(id)
	.then(function(obj){
		fs.readFile(obj.path, function (err,data){
			res.contentType("application/pdf");
			res.send(data);
		});
	});
};

ProviderInvoice.prototype.changeStatus = function(id){
	var d = q.defer();
	var _this = this;
	_this.crud.find({ _id: Number(id) })
	.then(function (result) {
		var obj = result.data[0];
		if(obj.status._id == 3){
			obj.status = {
				_id: 4,
				description: 'Paid'
			};
		}
		else{
			obj.status = {
				_id: 3,
				description: 'Completed'
			};
		}

		// return _this.crud.update({_id: Number(id)}, obj);
		return _this.crud.update({_id: Number(id)}, obj).then(function(result) {
			d.resolve(obj.status);
		});

	})
	.then(function (result) {
		d.resolve(true);
	})
	.catch (function (err) {
		d.reject({
			result : 'Not ok',
			errors : err
		});
	});
	return d.promise;
};

module.exports = ProviderInvoice;
