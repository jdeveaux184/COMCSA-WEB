'use strict';

var ItemType = require('../dto/itemType');

module.exports = function (prefix, app) {
	require('./crud')(prefix, app, ItemType);
}
