'use strict';

angular.module('COMCSAApp')
.controller('OptionCtrl', function ($scope, $rootScope, $location, toaster, option) {
	$scope.option = option;

	$scope.subMenuList = [
		{_id: 1, description: 'Suplidores'},
		{_id: 2, description: 'Clientes'},
		{_id: 3, description: 'Configuración'},
		{_id: 4, description: 'Reportes'},
	]

	if($rootScope.userData.role._id != 1){
		$location.path('/noaccess');
	}
	
	$scope.save = function () {
		$scope.option.save()
		.then(function (data) {
			toaster.success('La Opcion fue guardada');
			$location.path('optionList')
		},
			function (error) {
			console.log(error);
			toaster.error(error.message);
		});
	};

});
