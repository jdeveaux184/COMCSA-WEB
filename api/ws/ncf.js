'use strict';

var q = require('q'),
	Ncf = require('../dto/ncf'),
	util = require('../dto/util');


module.exports = function (prefix, app, enterpriseId) {

	//Delete
	app.delete(prefix + '/:id', function (req, res) {
		var ncf = new Ncf(app.db, req.user.account.enterpriseId);
		ncf.delete(parseInt(req.params.id)).then(util.success(res), util.error(res));
	});

	app.post(prefix, function (req, res) {
		var ncf = new Ncf(app.db, req.user.account.enterpriseId);
		ncf.insert(req.body.obj).then(util.success(res), util.error(res));
	});

	app.post(prefix + '/loadFromExcel', function (req, res) {
		var ncf = new Ncf(app.db, req.user.account.enterpriseId);
		ncf.loadFromExcel(req.body.ncfs).then(util.success(res), util.error(res));
	});

  app.post(prefix + '/getNcf', function (req, res) {
    var ncf = new Ncf(app.db, req.user.account.enterpriseId);
    ncf.getNcf(req.body.ncfType).then(util.success(res), util.error(res));
  });

  app.post(prefix + '/useNcf', function (req, res) {
    var ncf = new Ncf(app.db, req.user.account.enterpriseId);
    ncf.useNcf(req.body.ncfType).then(util.success(res), util.error(res));
  });

	require('./crud')(prefix, app, Ncf);
};
