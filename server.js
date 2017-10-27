'use strict';
var d = require('domain').create();

d.on('error', function (er) {
	var error = {
		fecha : new Date(),
		mensaje : er.message,
		stack : er.stack
	};
	var fs = require('fs');
	var urlfs = __dirname + "/log/log-" + new Date().getFullYear() + "-" + (parseInt(new Date().getMonth()) + 1) + "-" + new Date().getDate() + ".txt";
	var txtError = "Fecha: " + error.fecha + ", Mensaje: " + error.mensaje + ", Stack: " + error.stack + "\n";
	fs.appendFile(urlfs, txtError, function (err) {
		if (err) {
			console.log(err);
		}
	});
	console.log('-----ERROR-----');
	console.log(er.stack);
	console.log('---------------');
});

d.run(function () {
	var express = require('express');
	var auth = require('express-jwt');
	var http = require('http');
	var validator = require('express-validator');
	var path = require('path');
	var bodyParser = require('body-parser');
	var configuration = require('./config');

	//Configuracion del server
	var app = express();
	var prefix = '/api';
	var secret = 'ElMundoDeberiaGirarPorSiempre2016!';
	app.use('/api', auth({
			secret : secret
		}));
	app.use(bodyParser.json({
			limit : '100mb'
		}));
	app.use(bodyParser.urlencoded({
			extended : true
		}));
	app.use(validator());
	//Inicializacion config y Mail
	var config = configuration.init(app);
	// mail.init(config);
	app.use('/', express.static(path.join(__dirname, config.PUBLIC_PATH)));
	//Configuracion db
	app.db = require('monk')(config.DB_URL);
	//WebAPI
	require('./api/ws/list')('/api/list', app);
	require('./api/ws/user')('/api/user', app, secret, config);
	require('./api/ws/client')('/api/client', app);
	require('./api/ws/provider')('/api/provider', app);
	require('./api/ws/role')('/api/role', app);
	require('./api/ws/option')('/api/option', app);
	require('./api/ws/roleOptions')('/api/roleOptions', app);
	require('./api/ws/invoice')('/api/invoice', app, null/*mail*/, __dirname);
	require('./api/ws/cxp')('/api/providerInvoice', app, null/*mail*/, __dirname);
	require('./api/ws/payment')('/api/payment', app, null/*mail*/, __dirname);
	require('./api/ws/creditNote')('/api/creditNote', app, null/*mail*/, __dirname);
	require('./api/ws/debitNote')('/api/debitNote', app, null/*mail*/, __dirname);
	require('./api/ws/document')('/api/document', app,1);
	require('./api/ws/item')('/api/item', app);
	require('./api/ws/itemType')('/api/itemType', app);
	require('./api/ws/country')('/api/country', app);
	require('./api/ws/state')('/api/state', app);
	require('./api/ws/city')('/api/city', app);
	require('./api/ws/excel')('/api/excel', app);
	require('./api/ws/tax')('/api/tax', app);
	// require('./api/ws/itemCollection')('/api/itemCollection', app);
	require('./api/ws/company')('/api/company', app);
	require('./api/ws/branch')('/api/branch', app);
	//Inicializando Server
	http.createServer(app).listen(config.APP_PORT, function () {
		console.log("\n[*] Server Listening on port %d", config.APP_PORT);
	});
});
