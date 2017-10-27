'use strict';
var q = require('q'),
  Excel = require('./excel'),
  Crud = require('./crud');
  var logger = require('tracer').console();

function Documents(db, enterpriseId) {
  this.crud = new Crud(db, 'DOCUMENT', enterpriseId);
  this.db = db;
  this.enterpriseId = enterpriseId;

  var documentType_schema = {
    "id": "/docType",
    "type": "object",
    "required": true,
    "properties": {
      "documentTypeId": {
        "type": "number"
      },
      "description": {
        "type": "string"
      }
    }
  };

  var detailSchema = {
    "id": "/detailSchema",
    "type": "object",
    "properties": {
      "account": {
        "type": "object"
      },
      "origin": {
        "type": "string"
      },
      "amount": {
        "type": "double"
      },
      "memo": {
        "type": "string"
      }
    }
  };

  this.schema = {
    "id": "/Document",
    "type": "object",
    "properties": {
      "documentType": documentType_schema,
      "adjustingEntry": {
        "type": "boolean"
      },
      "date": {
        "type": "date"
      },
      "details": {
        "type": "array",
        "items": detailSchema
      },
      "convertionRate": {
        "type": "double",
        "required": false
      },
      "ownerConvertionRate": {
        "type": "double",
        "required": false
      },
      "accountConvertionRate": {
        "type": "double",
        "required": false
      }


      //"user": {"type": "object", "required": true} 
    }
  };

  this.crud.schema = this.schema;
}

//1) Funcion para asignar los errores.
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
//2) Insert
Documents.prototype.insert = function (newDocument, user) {
  var deferred = q.defer();
  console.log(newDocument)

  //logger.log('Inserting', newDocument);
  newDocument.date = new Date();
  newDocument.documentType = this.documentType;

  this.crud.insert(newDocument, this.schema, user).then(function (obj) {
    //logger.log("success", obj);
    deferred.resolve(obj);
  }, function (err) {
    deferred.reject({
      result: 'Not ok',
      errors: err
    });
  });

  return deferred.promise;
};
//3) Reverse
Documents.prototype.reverse = function (docId, user) {
  // body...
  var deferred = q.defer(),
    _crud = this.crud,
    query = '{"_id": ' + docId + '}',
    reverseDoc = {};

  _crud.search(query).then(function (obj) {

    reverseDoc = obj.data[0];
    var i;
    for (i in reverseDoc.details) {
      if (i.origin === 'Debito') {
        i.origin = 'Credito';
      } else if (i.origin === 'Credito') {
        i.origin = 'Debito';
      }
    }

    _crud.insert(i, this.schema, user).then(function (obj) {}, function (err) {
      //logger.log("It was all messed up", err);
    });

  }, function (err) {
    deferred.reject({
      result: 'Not ok',
      errors: err
    });

  });
  return deferred.promise;
};
//4) Returns the next document
Documents.prototype.getNext = function (date, docTypeId) {
  var deferred = q.defer(),
    query = {},
    conf = {
      sort: [['createdDate', 1]],
      limit: 1
    };

  if (date) {
    query = {
      'createdDate': {
        $gt: new Date(date)
      },
      'documentType._id': docTypeId
    };
  } else {
    query = {
      'createdDate': {
        $lt: new Date()
      },
      'documentType._id': docTypeId
    };
  }
  this.db.get(this.crud.table).findOne(query, conf, function (err, data) {
    if (err) {
      deferred.reject(assignError('No se pudo obtener los datos', err));
      throw err;
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};
//5) Returns the previous document
Documents.prototype.getPrevious = function (date, docTypeId) {
  var deferred = q.defer(),
    query = {},
    conf = {
      sort: [['createdDate', -1]],
      limit: 1
    };

  if (date) {
    query = {
      'createdDate': {
        $lt: new Date(date)
      },
      'documentType._id': docTypeId
    };

  } else {
    query = {
      'createdDate': {
        $lt: new Date()
      },
      'documentType._id': docTypeId
    };
  }

  this.db.get(this.crud.table).findOne(query, conf, function (err, data) {
    if (err) {
      deferred.reject(assignError('No se pudo obtener los datos', err));
      throw err;
    } else {
      deferred.resolve(data);
    }
  });
  return deferred.promise;
};

//6) Search
Documents.prototype.search = function (query, sort) {
  var deferred = q.defer();
  query = typeof query === 'string' ? JSON.parse(query) : query;
  sort = (typeof sort == 'object') ? sort : {};

  if (this.documentType) {
    query['documentType._id'] = this.documentType._id;
    
  }
  console.log(query)

  this.crud.find(query, sort).then(function (res) {
    console.log(res)
    deferred.resolve(res);
  }, function (error) {
    deferred.reject(assignError('Error al obtener los registros', error));
  });
  return deferred.promise;
};
//7) Custom Search
Documents.prototype.customSearch = function (query, conf) {
  var deferred = q.defer();
  query = typeof query === 'string' ? JSON.parse(query) : query;
  conf = typeof conf === 'string' ? JSON.parse(conf) : conf;
  query['documentType._id'] = this.documentType._id;
  this.crud.customSearch(query, conf).then(function (res) {
    deferred.resolve(res);
  }, function (error) {
    deferred.reject(assignError('Error al obtener los reistros', error));
  });
  return deferred.promise;
};
//8) Count
Documents.prototype.count = function (query) {
  var deferred = q.defer();
  query = typeof query === 'string' ? JSON.parse(query) : query;
  query['documentType._id'] = this.documentType._id;
  this.crud.count(query).then(function (res) {
    deferred.resolve(res);
  }, function (error) {
    deferred.reject(assignError('Error al obtener los reistros', error));
  });
  return deferred.promise;
};
//8) Paginated Search
Documents.prototype.paginatedSearch = function (query) {
  var deferred = q.defer();

  // logger.log('\n\n ***** Documents -> ', this.documentType._id, ' -> Paginated Search ');
  //query = typeof query === 'string' ? JSON.parse(query) : query;
  query.filter = (query.filter) ? query.filter : {};
//  logger.log("| Esto es query.filter -", query.filter, "- -- typeof ", typeof query.filter);
  query.filter = typeof query.filter === 'string' ? JSON.parse(query.filter) : query.filter;
  query.filter = query.filter || {};

  if (this.documentType) {
    query.filter['documentType._id'] = this.documentType._id;
    
  }
//logger.log(query)
  this.crud.paginatedSearch(query).then(function (res) {
    // logger.log('Search')
    deferred.resolve(res);
  }, function (error) {
    // logger.log('Error')
    deferred.reject(assignError('Error al obtener los reistros', error));
  });
  return deferred.promise;
};
//9) Paginated Count
Documents.prototype.paginatedCount = function (query) {
  var deferred = q.defer();
  //query = typeof query === 'string' ? JSON.parse(query) : query;
    query.filter = (query.filter) ? query.filter : {};
  query.filter = typeof query.filter === 'string' ? JSON.parse(query.filter) : query.filter;
  query.filter = query.filter || {};

  // query.filter['documentType._id'] = this.documentType._id; 

  this.crud.paginatedCount(query).then(function (res) {
    deferred.resolve(res);
  }, function (error) {
    deferred.reject(assignError('Error al obtener los reistros', error));
  });
  return deferred.promise;
};

Documents.prototype.excel = function (query,username,res) {
  delete query.limit
  delete query.skip

  this.paginatedSearch(query)
  .then(function (data) {
    try {
      // logger.log('Data',data.data)

      var excel = new Excel(query.title,query.excelFields);
      excel.addHeader();
      excel.addData(data.data);
      excel.addFooter(username);
      excel.download(res);

    } catch(e){
      logger.log('Error Excel',e)
      util.error(res)(e);
    }    
  })
  .fail(util.error(res)); 
}

Documents.prototype.buscarPorId = function (id) {
  var deferred = q.defer();
  this.crud.buscarPorId({
    _id: Number(id)
  }).then(function (res) {
    deferred.resolve(res);
  }, function (error) {
    deferred.reject(assignError('Error al obtener los reistros', error));
  });
  return deferred.promise;
}

module.exports = Documents;