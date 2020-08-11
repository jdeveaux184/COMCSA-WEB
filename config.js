var config = {
	development : {
		APP_PORT : process.env.PORT || 8083,
		DB_URL: 'mongodb+srv://general:general2020@heroku-85gjzcdt.ppts0.mongodb.net/heroku_85gjzcdt?retryWrites=true&w=majority',
		DB_USER: 'ingmontas',
		DB_PASS: 'ingmontas2017!',
		// SERVER_URL: 'http://localhost:8083',
		MAIL_USR: 'm@g.com',
		MAIL_PASS: '*comcsa123',
		PUBLIC_PATH: 'public/app'
	},
	production : {
		APP_PORT : process.env.PORT || 80,
		DB_URL: 'mongodb+srv://general:general2020@heroku-85gjzcdt.ppts0.mongodb.net/heroku_85gjzcdt?retryWrites=true&w=majority',
		DB_USER: 'ingmontas',
		DB_PASS: 'ingmontas2017!',
		SERVER_URL: 'https://ingmontas.herokuapp.com',
		MAIL_USR: 'jdeveaux18423434@hotmail.com',
		MAIL_PASS: '*comcsa123',
		PUBLIC_PATH: 'public/app'
	}
};

var mode;
function getEnv() {
	var mde = mode || 'development';
	return config[mde];
}
function init(app) {
	mode = app.get('env');
	return config[mode];
}
exports.getEnv = getEnv;
exports.init = init;
