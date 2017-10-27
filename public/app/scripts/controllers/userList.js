'use strict';

angular.module('COMCSAApp')
.controller('UserListCtrl', function ($scope, $location, User, RoleOptions, roles) {
	$scope.wsUser = User;
	$scope.user = new User();
	$scope.roles = roles.data;

	$scope.fields = [{
			title : 'Compañía',
			name : 'company.entity.name',
			type : 'text'
		},{
			title : 'Proyecto',
			name : 'branch.name',
			type : 'text'
		},{
			title : 'Gerente',
			name : 'isRegionalManager',
			type : 'checkbox'
		},{
			title : 'Nombre',
			name : 'entity.fullName',
			type : 'text'
		}, {
			title : 'Correo',
			name : 'account.email',
			type : 'text'
		}, {
			title : 'Rol',
			name : 'role.description',
			type : 'text'
		}
	];

	$scope.search = [
		'_id',
		'entity',
		'entity.fullName',
		'account.email',
		'role.description',
		'company.entity.name',
		'branch.name',
		'isRegionalManager'
	];

	$scope.filter1 = {
		'role._id':1
	}

	$scope.filter2 = {
		'role._id':3
	}

	$scope.filter3 = {
		'role._id':4
	}

	$scope.filter4 = {
		'role._id':5
	}

	$scope.createNew = function () {
		$location.path('user');
	};

	$scope.selectTab = function(role){
		$scope.selectedId = role._id.toString();
		$scope.selectedTab = role.description;

		// if(!$scope.roleOptions[$scope.selectedId]){
		// 	$scope.roleOptions[$scope.selectedId] = [];
		// }
		// roleOptions.filter({ roleId: role._id })
		// .then(function(result){
		// 	$scope.roleOptions[$scope.selectedId] = result.data || [];
		// });
	};

	$scope.selectTab(angular.copy($scope.roles[0]));
});
