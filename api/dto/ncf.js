'use strict';

var q = require('q'),
	Crud = require('./crud')

function Ncf(db, enterpriseId) {

	this.crud = new Crud(db, 'NCF', enterpriseId);
	this.crudItem = new Crud(db, 'ITEM', enterpriseId);

	this.schema = {
		"id": "/Ncf",
		"type": "object",
		"properties": {
			"enterpriseId": {
				"type": "number",
				"required": true
			},
			"ncf": {
				"type": "string",
				"required": false
			},
			"used": {
				"type": "boolean",
				"required": false
			},
			"name": {
				"type": "string",
				"required": false
			},
			"ncfType": {
				"type": "number",
				"required": false
			}
		}
	};

}

//
Ncf.prototype.delete = function (id) {
	var deferred = q.defer(),
		itemId = parseInt(id),
		crud = this.crud;

	this.crudItem.search({
		'_id': itemId
	}).then(function (data) {
		if (data.data.length > 0) {
			deferred.reject({
				result: 'Not ok',
				error: 'Existen items con este item type'
			});
		} else {
			crud.delete(itemId).then(function (obj) {
				deferred.resolve(obj);
			});
		}
	});
	return deferred.promise;
};

Ncf.prototype.insertRaw = function (newItem) {
	var deferred = q.defer();
	var _this = this;
	_this.crud.insert(newItem)
	.then(function(res){
		deferred.resolve(res.data);
	}, function(err){
		console.log(err);
		deferred.reject(err);
	});
	return deferred.promise;
};

Ncf.prototype.insert = function (newItem) {
  var deferred = q.defer();
  var that = this;

  var number = '';
  if (newItem.from > 9999999){
    number = newItem.from;
  }
  else if (newItem.from > 999999){
    number = '0'+newItem.from;
  }
  else if (newItem.from > 99999){
    number = '00'+newItem.from;
  }
  else if (newItem.from > 9999){
    number = '000'+newItem.from;
  }
  else if (newItem.from > 999){
    number = '0000'+newItem.from;
  }
  else if (newItem.from > 99){
    number = '00000'+newItem.from;
  }
  else if (newItem.from > 9){
    number = '000000'+newItem.from;
  }
  else{
    number = '0000000'+newItem.from;
  }

  var ncf = {
    used: false,
    from: newItem.from,
    to: newItem.to,
    ncfType: newItem.ncfType,
    count: newItem.from,
    ncf: newItem.ncfType.sequence + number
  }

  console.log(ncf);
  return that.crud.insert(ncf);
};

// Receives an array of ncfs and insert them if don't exist.
Ncf.prototype.loadFromExcel = function (ncfList) {
	var deferred = q.defer(),
		query = {'$or': []},
		// Funcion que retorna la respuesta
		returnResponse,
		// Funcion se llama cuando se inserta correctamente
		success,
		// Funcion se llama cuando se no inserta correctamente
		error,
		// Lista de ncfs que serán insertados
		ncfs = [],
		// Retornar solo el campo ncf para hacer la comparación entre los que se desean insertar y los que sstán ya insertados.
		conf = {
			fields: {
				'ncf': true
			}
		},
		inserted = 0,
		notInserted = 0,
		existing = 0,
		that = this,
		// Variable para iterar en los for-in loops de esta función.
		x;

	returnResponse = function () {
		var message = '';
		if (ncfList.length === (inserted + notInserted + existing)) {
			message = 'NCF cargados: ' + inserted + '. NCF no cargados: ' + (notInserted + existing);
			deferred.resolve({
				result: 'Ok',
				message: message,
				data: []
			});
		}
	};

	success = function (res) {
		inserted += 1;
		returnResponse();
	};

	error = function (res) {
		notInserted += 1;
		returnResponse();
	};

	// Make an array of the ncfs to find them in the db.
	for (x in ncfList) {
		query.$or.push({
			ncf: ncfList[x].ncf
		});
	}
	this.crud.customSearch(query, conf).then(function (res) {
		var exists = false;
		ncfList.forEach(function (elemX) {
			exists = false;
			res.data.forEach(function (elemY) {
				if (elemX.ncf === elemY.ncf) {
					exists = true;
					existing += 1;
				}
			});
			if (!exists) {
				ncfs.push(elemX);
			}
		});
		return ncfs;
	}).then(function (res) {
		if (ncfs.length !== 0) {
			for (x in ncfs) {
				that.crud.insert(ncfs[x]).then(success, error);
			}
		} else {
			returnResponse();
		}
	});
	return deferred.promise;
};

//
Ncf.prototype.getNcf = function (ncfType) {
	var deferred = q.defer();

  if (!ncfType){
    deferred.reject({
      error: "Debe de seleccionar un tipo de NCF"
    })
  }
  else{
  	var query = {
  		used: false,
      "ncfType._id": ncfType._id
  	};
  	var conf = {
  		sort: {'_id': -1},
  		limit: 1
  	};

    this.crud.customSearch(query, conf)
    .then(function (data){
      var remainder = 0;

      if (data.data[0]){
        remainder = data.data[0].to - data.data[0].count;
      }

      deferred.resolve({data: data.data, remainder: remainder});
    }, function (err){
      deferred.reject(err);
    });
  }

	return deferred.promise;
};

Ncf.prototype.useNcf = function (ncfType) {
  var deferred = q.defer();
  var that = this;

  if (!ncfType){
    deferred.reject({
      error: "Debe de seleccionar un tipo de NCF"
    })
  }
  else{
    var query = {
      used: false,
      "ncfType._id": ncfType._id
    };
    var conf = {
      sort: {'_id': -1},
      limit: 1
    };

    this.crud.customSearch(query, conf)
    .then(function (data){

      if (data.data.length == 0){
        deferred.reject({
          error: "No existen NCF disponible"
        });
      }
      else{
        var query = {
          _id: data.data[0]._id
        }
        var remainder = 0;
        remainder = data.data[0].to - data.data[0].count;

        var newItem = JSON.parse(JSON.stringify(data.data[0]));

        data.data[0].used = true;
        var ncf = data.data;
        that.crud.update(query, data.data[0])
        .then(function (data){
          newItem.count += 1;
          newItem.from += 1;
          return that.insert(newItem);
        })
        .then(function (data){
          deferred.resolve({data: ncf, remainder: remainder});
        })

      }
    }, function (err){
      deferred.reject(err);
    });
  }

  return deferred.promise;
};

module.exports = Ncf;
