'use strict';

var client = require('../dto/client');

module.exports = function (prefix, app) {
	require('./crud')(prefix, app, client);
}
