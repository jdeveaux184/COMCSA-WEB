var q= require('q')
,Payment = require('../dto/payment')
,util = require('../dto/util');


module.exports = function(prefix,app){

	app.post(prefix, function (req, res) {
		// console.log('Req --> ', req.user)
		var payment = new Payment(app.db, 1);
		payment.insert(req.body.obj, req.user).then(util.success(res), util.error(res));
	});

  require('./document')(prefix,app,Payment);
}