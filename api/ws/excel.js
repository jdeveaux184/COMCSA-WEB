'use strict';

var q = require('q'),
	Excel = require('../dto/excel'),
	util = require('../dto/util');
var xlsx = require('node-xlsx');
var fs = require('fs');


module.exports = function (prefix, app, enterpriseId) {

  app.post(prefix + '/writeFileSync', function (req, res) {
    var excel = new Excel(app.db, 1);
    var buffer = xlsx.build(
      req.body.obj.data
    ); // returns a buffer
    var path = req.body.obj.name+'.xlsx';
    fs.writeFileSync('./public\\app\\'+path, buffer)
    res.json({path:path});
  });

};

