var config = {
	development : {
		APP_PORT : process.env.PORT || 8083,
		//DB_URL: 'localhost:27017/heroku_cqkmxzc1',
		DB_URL: 'localhost:27017/comcsaerp',
		SERVER_URL: 'http://localhost:8080',
		MAIL_USR: 'm@g.com',
		MAIL_PASS: '*comcsa123',
		PUBLIC_PATH: 'public/app'
	},
	production : {
		APP_PORT : process.env.PORT || 80,
		DB_URL: 'ingmontas:ingmontas2017!@ds235775.mlab.com:35775/heroku_85gjzcdt',
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
