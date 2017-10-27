'use strict';

angular.module('COMCSAApp')
.factory('Loading', function ($timeout, $rootScope, dialogs) {
	var Loading = function(){
		this.dialog = null;
	}

	Loading.show = function(){
		this.dialog = dialogs.wait('Wait', 'Favor espere. Cargando...', 50);
	};
	Loading.hide = function(){
		$timeout(function(){
			$rootScope.$broadcast('dialogs.wait.complete');
		}, 200);
	};
	return Loading;
});
