'use strict';

angular.module('COMCSAApp')
.controller('ItemCtrl', function ($scope, item, companies, $location, $q, toaster, dialogs, itemTypes) {
	$scope.item = item;
	$scope.itemTypes = itemTypes.data;

	$scope.save = function(){
		$scope.item.save()
		.then(function(){
			toaster.success('El Producto fue Guardado');
			$location.path('itemList');
		})
		.catch(function(error){
			toaster.error(error.message);
		});
	};

	$scope.remove = function(){
		var dlg = dialogs.confirm('Warning','Está seguro que desea eliminar?');
		dlg.result.then(function(btn){
			$scope.item.remove()
			.then(function(){
				toaster.success('El Producto fue Borrado');
				$location.path('/itemList');
			})
			.catch(function(error){
				toaster.error(error.message);
			});
		});
	};

	$scope.assignCompanies = function(){
		var itemCompanies = $scope.item.companies || [];
		var dialog = dialogs.create('views/assignCompanies.html', 'AssignCompaniesCtrl', { companyList: companies.data, companies: itemCompanies });
		dialog.result.then(function (res) {
			$scope.item.companies = res.companies;
		});
	};
});
