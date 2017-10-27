'use strict';

angular.module('COMCSAApp')
.controller('RoleOptionListCtrl', function ($scope, $q, roles, options, RoleOptions, toaster) {
	$scope.roles = roles.data;
	$scope.options = options.data;
	var roleOptions = new RoleOptions();
	$scope.roleOptions = {};
	
	$scope.selectTab = function(role){
		$scope.selectedId = role._id.toString();
		$scope.selectedTab = role.description;
		if(!$scope.roleOptions[$scope.selectedId]){
			$scope.roleOptions[$scope.selectedId] = [];
		}
		roleOptions.filter({ roleId: role._id })
		.then(function(result){
			$scope.roleOptions[$scope.selectedId] = result.data || [];
		});
	};
	
	$scope.addOption = function(){
		var roleOptions = new RoleOptions({
			roleId: Number($scope.selectedId),
			read: true,
			write: true,
			update: true, 
			delete: true,
			sort: 0
		});
		$scope.roleOptions[$scope.selectedId].push(roleOptions);
	};
	$scope.removeOption = function(index){
		$scope.roleOptions[$scope.selectedId][index]
		.remove()
		.then(function(data){
			$scope.roleOptions[$scope.selectedId].splice(index, 1);
			toaster.success('La opcion fue borrada');
		})
		.catch(function(error){
			toaster.error(error.message);
		});
	};
	
	$scope.save = function(){
		var promises = [];
		for(var i = 0; i < $scope.roleOptions[$scope.selectedId].length; i++){
			console.log($scope.roleOptions[$scope.selectedId][i]);
			promises.push($scope.roleOptions[$scope.selectedId][i].save());
		}
		$q.all(promises)
		.then(function(){
			toaster.success('La opcion fue Guardada');
		})
		.catch(function(error){
			toaster.error(error.message);
		});
	};
	$scope.selectTab(angular.copy($scope.roles[0]));
});
