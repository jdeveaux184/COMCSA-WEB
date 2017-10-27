'use strict';

angular.module('COMCSAApp')
.controller('ItemTypeCtrl', function ($scope, itemType, companies, $location, $q, toaster, dialogs) {
	$scope.itemType = itemType;

	$scope.save = function(){
		$scope.itemType.save()
		.then(function(){
			toaster.success('La Categoría fue Guardada');
			$location.path('itemTypeList');
		})
		.catch(function(error){
			toaster.error(error.message);
		});
	};

	$scope.remove = function(){
		var dlg = dialogs.confirm('Warning','Estás seguro que deseas eliminar?');
		dlg.result.then(function(btn){
			$scope.itemType.remove()
			.then(function(){
				toaster.success('La Categoría fue Borrada');
				$location.path('/itemList');
			})
			.catch(function(error){
				toaster.error(error.message);
			});
		});
	};

});
