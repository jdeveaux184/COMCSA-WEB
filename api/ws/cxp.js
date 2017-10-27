'use strict';

var general = require('../dto/util');
var CXP = require('../dto/cxp');

module.exports = function (prefix, app, mail, dirname) {
	app.put(prefix, function (req, res) {
		var cxp = new CXP(app.db, req.user);
		cxp.update(req.body.query, req.body.obj, req.user)
		.then(general.success(res), general.error(res));
	});

	app.post(prefix, function (req, res) {
		var cxp = new CXP(app.db, req.user, dirname);
		cxp.insert(req.body.obj, req.user)
		.then(general.success(res), general.error(res));
	});

	app.post(prefix + '/report', function (req, res) {
		var cxp = new CXP(app.db, req.user, dirname);
		cxp.getReport(req.body.query, req.body.queryDescription, res);
	});

	app.post(prefix + '/status', function (req, res) {
		var cxp = new CXP(app.db, req.user, dirname);
		cxp.changeStatus(req.body.id, req.user)
		.then(general.success(res), general.error(res));
	});

	require('./crud')(prefix, app, CXP);
}
