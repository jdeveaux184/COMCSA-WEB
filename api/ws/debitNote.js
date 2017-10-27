var q = require('q'),
  DebitNote = require('../dto/debitNote'),
  util = require('../dto/util');


module.exports = function (prefix, app) {

  app.get(prefix, function (req, res) {
    var debitNote = new DebitNote(app.db, 1);
    debitNote.test().then(util.success(res), util.error(res));
  });

  //Insert
	app.post(prefix, function (req, res) {
		var debitNote = new DebitNote(app.db, 1);
		debitNote.insert(req.body.obj, req.user).then(util.success(res), util.error(res));
	});


  app.post(prefix + '/createPaymentRequest', function (req, res) {
    var debitNote = new DebitNote(app.db, 1);
    console.log(debitNote.createPaymentRequest)
    debitNote.createPaymentRequest(req.body.obj, req.user).then(util.success(res), util.error(res));
  });

  require('./document')(prefix, app, DebitNote);
};