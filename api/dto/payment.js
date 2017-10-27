'use strict';
var q = require('q'),
util = require('./util'),
DocType = require('./configData'),
Documents = require('./document'),
math = require('sinful-math'),
_ = require('lodash'),
Crud = require('./crud.js')
;

function PaymentReceipt() {
  this.documentType = DocType.documentType.paymentReceipt;

  Documents.apply(this, Array.prototype.slice.call(arguments));

  this.schema.id = '/Payment';
  this.schema.properties.client = {
    "type" : "object",
    "required" : true
  };
  this.schema.properties.paymentType = {
    "type" : "string",
    "required" : true
  };
  this.schema.properties.invoices = {
    "type" : "array",
    "required" : true
  };
  this.schema.properties.retentions = {
    "type" : "array",
    "required" : false  
  };
  this.schema.properties.retentionAmount = {
    "type" : "number",
    "required" : false
  };
}

PaymentReceipt.prototype = new Documents();

//2) Funcion para asignar los errores.
var assignError = function (message, error) {
  console.log('Error',error);
  var responseError = {
    error : {
      res : 'Not ok'
    }
  };
  responseError.error.message = message;
  responseError.error.error = error.toString();
  return responseError;
};

//3) Funcion para insertar un nuevo recibo de pago
PaymentReceipt.prototype.insert = function (newObject, user) {
  var deferred = q.defer();
  var that = this;
  newObject.documentType = this.documentType;
  util.getYearlySequence(that.db, 'Payment').then(function (data) {
    newObject.code = data;
    newObject.amount = 0;
    for(var i = 0 ; i < newObject.invoices.length;i++){
      var amount = newObject.invoices[i].totalPaid
       // newObject.totalPaid = new bigNumber(newObject.totalPaid.toString()).plus( new bigNumber(amount.toString())).toNumber();
       newObject.amount = newObject.amount + amount;
      // newObject.taxAmount = new bigNumber(newObject.amount.toString()).plus(new bigNumber(newObject.invoices[i].invoice.taxAmount.toString())).toNumber();
    }
    return that.crud.insert(newObject, that.schema)
  })
  .then(function (data) {
    return that.updateInvoices(data.data._id, data.data);
  })
  .then(function (res) {
    deferred.resolve(res);
  })
  .fail(function (error) {
    deferred.reject(assignError('No se pudo insertar', error));
  });
  return deferred.promise;
};


//4) Funcion para eliminar un recibo de pago
PaymentReceipt.prototype.delete  = function (id) {
  var deferred = q.defer();
  deferred.reject(assignError('No se puede eliminar recibos!', {}));
  return deferred.promise;
};

//5) Funcion para actualizar un recibo de pago
PaymentReceipt.prototype.update = function (id, obj) {
  var deferred = q.defer();
  deferred.reject(assignError('No se puede actualizar recibos!', {}));
  return deferred.promise;
};

//7) Funcion que actualiza las facturas
PaymentReceipt.prototype.updateInvoices = function (id, pObject) {
  var deferred = q.defer(),
  object = pObject, // Este es el recibo de pago
  query = { // Query para la funcion de actualizar del crud
    '_id' : id
  },
  totalPaid, // Total pagado en un recibo de pago
  payment, // Este es el nuevo pago que se realizo (id and amount)
  status,
  promises = [],
  updateInvoice,
  that = this;
  updateInvoice = function (id, payment, status) {
    var deferredUpd = q.defer(),
    qry = {
      '_id' : id
    },
    obj = {
      '$addToSet' : {
        'paymentReceipts' : payment
      }
    };
    obj.$set = {
      'status' : status
    };
    that.db.get(that.crud.table).update(qry, obj, function (err, data) {
      if (err) {
        deferredUpd.reject(err);
      } else {
        deferredUpd.resolve(data);
      }
    });
    return deferredUpd.promise;
  };
  for (var x in object.invoices) {
    totalPaid = 0;
    payment = {};
    status = '';
    for (var y in object.invoices[x].paymentReceipts) {
      totalPaid = totalPaid + object.invoices[x].paymentReceipts[y].amount;
    }
    payment.id = id; 
    payment.date = object.date;
    payment.code = object.code; 
    payment.amount = object.amount;
    if (payment.amount + totalPaid >= object.invoices[x].amount + object.invoices[x].taxAmount) {
      status = DocType.invoiceStatus.paid;
    } else {
      status = DocType.invoiceStatus.partiallyPaid;
    }
    promises.push(updateInvoice(object.invoices[x]._id, payment, status));
  }
  q.all(promises).then(function (results) {
    deferred.resolve({
      res : 'Ok',
      data : results
    });
  });

  return deferred.promise;
};

//Export
module.exports = PaymentReceipt;
