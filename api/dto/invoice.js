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
var config = require('./configData')

function Invoice(db, userLogged, dirname) {
	this.crud = new Crud(db, 'DOCUMENT', userLogged);
	this.crudCompany = new Crud(db, 'COMPANY', userLogged);
	this.company = new Company(db, userLogged);
	this.crudBranch = new Crud(db, 'BRANCH', userLogged);
	this.user = new User(db, '', userLogged);
	this.dirname = dirname;
	this.db = db;
	this.documentType = config.documentType.invoice;
	//DB Table Schema
	this.schema = {
		id : '/Invoice',
		type : 'object',
		properties : {
			client : {
				type : 'object',
				required : true
			},
			date : {
				type : 'date',
				required : true
			},
			invoiceNumber : {
				type : 'string',
				required : true
			},
			items : {
				type : 'array',
				required : true,
				items : new Item().schema
			},
			comment : {
				type : 'string',
				required : false
			},
			status : {
				type : 'object',
				required : true
			},
			total : {
				type : 'int',
				required : true
			}
		}
	};
	this.crud.schema = this.schema;
	// this.crud.uniqueFields = ['invoiceNumber'];
}

Invoice.prototype.insert = function (invoice, username, mail) {
	var d = q.defer();
	var _this = this;
	var total = 0;
	invoice.documentType = this.documentType;
	//sumo el total
	for (var i = 0; i < invoice.items.length; i++) {
		total += invoice.items[i].quantity * invoice.items[i].price;
	}
	invoice.total = total;
	//Consigo el sequencial de invoice
	var promise = util.getYearlySequence(this.db, 'Invoice')//util.getYearlySequence(_this.crud.db, 'Invoice');
	
	promise
	.then(function (sequence) {
		invoice.invoiceNumber = sequence;
		invoice.code = sequence;
		return _this.crud.insert(invoice, invoice.invoiceNumber == 'Pending Invoice');
	})
	//inserto
	.then(function (obj) {
		//_this.sendInvoice(obj.data._id, username, mail);
		var setObj = { invoiceNumber: invoice.invoiceNumber };

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

Invoice.prototype.update = function (query, invoice, user, mail) {
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

Invoice.prototype.sendInvoice = function(id, username, mail, emails, sendToAllAdmin){
	var d = q.defer();
	var _this = this;
	var invoice = {};
	var url = '';
	var urlPdf = '';
	var fileName = '';
	var fileNamePdf = '';
	var cc = [];
	var company = {};
	var branch = {};
	_this.crud.find({ _id: id })
	.then(function(invoiceS){
		invoice = invoiceS.data[0];		
		return _this.crudCompany.find({ _id: invoice.client.company._id });
	})
	//busco compañia
	.then(function(companyS){
		company = companyS.data[0];
		return invoice.branch && invoice.branch._id  ? _this.crudBranch.find({ _id: invoice.branch._id }) : q.when({ data:[{ name: 'None'}] });
	})
	//busco branch
	.then(function(branchS){
		branch = branchS.data[0];
		return _this.user.getAdminUsers(sendToAllAdmin ? true : (invoice.pono ? true : false));
	})
	.then(function(users){
		emails = emails.concat([ invoice.client.account.email ]);
		for(var i = 0; i < users.data.length; i++){
			cc.push(users.data[i].account.email);
		}
		emails = _.uniq(emails);
		cc = _.uniq(cc);
		fileNamePdf = invoice.invoiceNumber + '.pdf';
		urlPdf = _this.dirname + '/api/invoices/' + fileNamePdf; 
		return pdf.createInvoice(invoice, company, branch);
	})
	// .then(function(){
	// 	return mail.sendInvoice(invoice, emails, cc, urlPdf, fileNamePdf);
	// })
	.then(function(){
		d.resolve(true);
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

Invoice.prototype.sendInvoiceUpdate = function(id, username, mail){
	var d = q.defer();
	var _this = this;
	var invoice = {};
	var emails = [];
	_this.crud.find({ _id: id })
	.then(function(invoiceS){
		invoice = invoiceS.data[0];
		return _this.user.getAdminUsers();
	})
	.then(function(users){
		emails = [ ];
		for(var i = 0; i < users.data.length; i++){
			emails.push(users.data[i].account.email);
		}
		return _this.createInvoice(id, username);
	})
	.then(function(){
		fileNamePdf = invoice.invoiceNumber + '.pdf';
		urlPdf = _this.dirname + '/api/invoices/' + fileNamePdf; 
		return pdf.createInvoice(invoice, company, branch);
	})
	// .then(function(){
	// 	return mail.sendInvoice(invoice, emails, cc, urlPdf, fileNamePdf);
	// })
	.then(function(){
		d.resolve(true);
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

Invoice.prototype.savePhotos = function(invoice){
	var d = q.defer();
	var dirname = this.dirname + '/public/app/images/uploads';
	var invoiceDir = dirname + '/' + invoice._id;
	if(invoice.photos && invoice.photos.length > 0){
		var urlPhotos = [];
		for(var i = 0; i < invoice.photos.length; i++){
			var photo = invoice.photos[i];
			//chequeo que existe la carpeta del service order, si no la creo
			if(!fs.existsSync(invoiceDir)){
				fs.mkdirSync(invoiceDir);
			}
			//chequeo que existe la foto, si no la creo y cambio el url de la foto por el relative path
			var fileDir = serviceOrderDir + '/' + photo.name;
			if(!fs.existsSync(fileDir)){
				var data = photo.url.replace(new RegExp('data:' + photo.type + ';base64,'), '');
				urlPhotos.push({
					id: i,
					url: '/images/uploads/' + serviceOrder._id + '/' + photo.name
				})
				fs.writeFileSync(fileDir, data, 'base64');
			}
		}
		for(var i = 0; i < urlPhotos.length; i++){
			for(var j = 0; j < invoice.photos.length; j++){
				if(urlPhotos[i].id == j){
					invoice.photos[j].url = urlPhotos[i].url.toString();
					break;
				}
			}
		}
		d.resolve(invoice.photos);
	}
	else {
		d.resolve([]);
	}
	return d.promise;
};

Invoice.prototype.getReport = function(query, queryDescription, res){
	
	this.createReport(query, queryDescription)
	.then(function(obj){
		fs.readFile(obj.path, function (err,data){
			res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			res.send(data);
		});
	});
};

Invoice.prototype.createReport = function(query, queryDescription){
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

Invoice.prototype.createInvoice = function(id){
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

Invoice.prototype.getInvoice = function(id, res){
	this.createInvoice(id)
	.then(function(obj){
		fs.readFile(obj.path, function (err,data){
			res.contentType("application/pdf");
			res.send(data);
		});
	});
};



Invoice.prototype.changeStatus = function(id){
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

module.exports = Invoice;
