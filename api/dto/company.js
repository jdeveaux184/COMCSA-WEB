'use strict';

var Crud = require('./crud');
var User = require('./user');
var q = require('q')

function Company(db, userLogged) {
	this.user = new User(db, '', userLogged);
	this.crud = new Crud(db, 'COMPANY', userLogged);

	//DB Table Schema
	this.schema = {
		id : '/Company',
		type : 'object',
		properties : {
			
		}
	};
	this.crud.schema = this.schema;
	this.crud.uniqueFields = [ 'entity.name' ];
}
function pad(number, mask) {
	var dif = mask - number.length;
	dif = dif > 0 ? dif : mask + Math.abs(dif);
	var s = '';
	for(var i = 0; i < dif; i++){ s+= '0'; }
    return s + number;
}
Company.prototype.getSequence = function(id, peek){
	var d = q.defer();
	var _this = this;
	_this.crud.find({ _id: Number(id) })
	.then(function (company) {
		company = company.data[0];
		if(!company || !company.seqCode){
			d.resolve('Pendiente Factura');
		}
		else{
			var seqNumber = Number(company.seqNumber);
			if(!company.seqNumber){
				seqNumber = Number(company.seqStart || 0);
			}
			var sequence = company.seqCode + pad(seqNumber.toString(), company.seqMask);

			if(!peek){
				//actualizo company
				company.seqNumber = seqNumber + 1;

				_this.crud.update({ _id: Number(id) }, company, true)
					.then(function(){
						d.resolve(sequence);
					}, function(err){
						console.log(err)
						d.resolve(sequence);
					});
			} else {
				d.resolve(sequence);
			}

		}
	})
	.catch (function (err) {
		console.log(err)
		d.reject({
			result : 'Not ok',
			errors : err
		});
	});
	return d.promise; 
}

Company.prototype.setSequence = function (id) {

	var d = q.defer();
	var _this = this;

	var otherCompany;

	_this.crud.find({ _id: Number(id) })
	.then(function (company) {
		var companyData = company.data[0];
		companyData.seqNumber = companyData.seqNumber + 1;

					_this.crud.update({ _id: Number(id)}, companyData, true)
						.then(function(){
							console.log(otherCompany)
							if (otherCompany) {
								_this.crud.find({ _id: Number(otherCompany) })
								.then(function(oCompany) {
									var otherCompanyData = oCompany.data[0];
									otherCompanyData.seqNumber = otherCompanyData.seqNumber + 1;
									
									_this.crud.update({_id:Number(otherCompany)}, otherCompanyData,true )
									.then(function() {
										d.resolve(sequence);
									})
								})
							} else {
								d.resolve(sequence)
							}
							
						}, function(err){
							console.log(err)
							d.resolve(sequence);
						});
	})
}

//Export
module.exports = Company;
