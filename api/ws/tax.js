'use strict';

var Tax = require('../dto/tax');
var util = require('../dto/util');

module.exports = function (prefix, app) {

	//Update
	app.put(prefix, function (req, res) {
		var tax = new Tax(app.db, req.user);
		tax.update(req.body.query, req.body.obj).then(util.success(res), util.error(res));
	});
	require('./crud')(prefix, app, Tax);
}
