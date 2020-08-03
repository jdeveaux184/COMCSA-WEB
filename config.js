var config = {
	development : {
		APP_PORT : process.env.PORT || 8083,
		DB_URL: 'ingmontas:ingmontas2017!@heroku-85gjzcdt-shard-00-00.ppts0.mongodb.net:27017,heroku-85gjzcdt-shard-00-01.ppts0.mongodb.net:27017,heroku-85gjzcdt-shard-00-02.ppts0.mongodb.net:27017/heroku-85gjzcdt?ssl=true&replicaSet=atlas-13y36k-shard-0&authSource=admin&retryWrites=true&w=majority',
		DB_USER: 'ingmontas',
		DB_PASS: 'ingmontas2017!',
		// SERVER_URL: 'http://localhost:8083',
		MAIL_USR: 'm@g.com',
		MAIL_PASS: '*comcsa123',
		PUBLIC_PATH: 'public/app'
	},
	production : {
		APP_PORT : process.env.PORT || 80,
		DB_URL: 'ingmontas:ingmontas2017!@heroku-85gjzcdt-shard-00-00.ppts0.mongodb.net:27017,heroku-85gjzcdt-shard-00-01.ppts0.mongodb.net:27017,heroku-85gjzcdt-shard-00-02.ppts0.mongodb.net:27017/heroku-85gjzcdt?ssl=true&replicaSet=atlas-13y36k-shard-0&authSource=admin&retryWrites=true&w=majority',
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
