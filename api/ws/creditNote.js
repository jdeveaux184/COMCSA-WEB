var q = require('q'),
  CreditNote = require('../dto/creditNote'),
  util = require('../dto/util');


module.exports = function (prefix, app) {

  app.get(prefix, function (req, res) {
    var creditNote = new CreditNote(app.db, req.user.account.enterpriseId);
    creditNote.test().then(util.success(res), util.error(res));
  });

 //Insert
	app.post(prefix, function (req, res) {
		var creditNote = new CreditNote(app.db, 1);
		creditNote.insert(req.body.obj, req.user).then(util.success(res), util.error(res));
	});


  app.post(prefix + '/createPaymentRequest', function (req, res) {
    var creditNote = new CreditNote(app.db, 1);
    console.log(creditNote.createPaymentRequest)
    creditNote.createPaymentRequest(req.body.obj, req.user).then(util.success(res), util.error(res));
  });

  require('./document')(prefix, app, CreditNote);
};