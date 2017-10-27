var q = require('q'),
  //Document = require('../controllers/documents'),
  Crud = require('../dto/crud'),
  util = require('../dto/util');
  Documents = require('../dto/document');


module.exports = function (prefix, app) {
  
  //Insert
  app.post(prefix, function (req, res) {
    var documents = new Documents(app.db, 1);
    documents.insert(req.body.obj).then(util.success(res), util.error(res));
  });
  //Reverse
  app.post(prefix + '/reverse', function (req, res) {
    var doc = new Documents(app.db, 1);
    doc.reverse(req.body.docId).then(util.success(res), util.error(res));
  });
  //Previous
  app.post(prefix + '/previous', function (req, res) {
    var docs = new Documents(app.db, 1);
    docs.getPrevious(req.body.obj, req.body.docType).then(util.success(res), util.error(res));
  });
  //Next
  app.post(prefix + '/next', function (req, res) {
    var doc = new Documents(app.db, 1);
    doc.getNext(req.body.obj, req.body.docType).then(util.success(res), util.error(res));
  });
  //Find
  app.get(prefix, function (req, res) {
    var doc = new Documents(app.db, 1);
    console.log(req.body)
    doc.search(req.body).then(util.success(res), util.error(res));
  });
  //Find by Params
  app.post(prefix + '/filter', function (req, res) {
    var doc = new Documents(app.db, 1);
    doc.search(req.body).then(util.success(res), util.error(res));
  });
   //Count
  app.post(prefix + '/count', function (req, res) {
    var doc = new Documents(app.db, 1);
    doc.count(req.body).then(util.success(res), util.error(res));
  });
  //Paginated Search
  app.post(prefix + '/paginated', function (req, res) {
    var doc = new Documents(app.db, 1);
    doc.paginatedSearch(req.body).then(util.success(res), util.error(res));
  });
  //Paginated Search
  app.post(prefix + '/paginated/count', function (req, res) {
    var doc = new Documents(app.db, 1);
    doc.paginatedCount(req.body).then(util.success(res), util.error(res));
  });
  //Sum
  app.post(prefix + '/sum', function (req, res) {
    var doc = new Documents(app.db, 1);
    doc.sum(req.body.obj).then(util.success(res), util.error(res));
  });

  app.post(prefix + '/getProviderDocuments', function (req, res) {
    var doc = new Documents (app.db, 1);
    console.log("1", req.body.query)
    doc.search(req.body.query).then(util.success(res), util.error(res));
  });
  require('./crud')(prefix, app, Documents);
};