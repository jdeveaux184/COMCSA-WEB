'use strict';

var Provider = require('../dto/provider');
var util = require('../dto/util');


module.exports = function (prefix, app, Documents) {
	
	app.post(prefix + '/getProviderDocuments', function (req, res) {
		var provider = new Provider (app.db, 1);

		// var sort = {
		// 	_id: -1
		// };
		console.log(req.body)
		provider.getProviderDocuments(req.body)
		.then((util.success(res), util.error(res) ));
	});

	

	require('./crud')(prefix, app, Provider);
}
