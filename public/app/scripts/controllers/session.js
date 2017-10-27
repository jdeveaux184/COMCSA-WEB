'use strict';

angular.module('COMCSAApp')
.controller('SessionCtrl', function ($scope, $rootScope, $location, $timeout, $window, $route, User, Branch, Company, dialogs) {

	$rootScope.roleOptions = [];
	if (!$window.sessionStorage.token || !$window.sessionStorage.user) {
		$rootScope.isAuthenticated = false;
		$rootScope.userData = {};
	} else {
		$rootScope.isAuthenticated = true;
		$rootScope.userData = new User(JSON.parse($window.sessionStorage.user));
		$rootScope.roleOptions = JSON.parse($window.sessionStorage.roleOptions);
		// $rootScope.roleOptions = JSON.parse($window.sessionStorage.roleOptions);
		// $rootScope.provideRoleOptions = JSON.parse($window.sessionStorage.provideRoleOptions);
		// $rootScope.clientRoleOptions = JSON.parse($window.sessionStorage.clientRoleOptions);
		// $rootScope.configRoleOptions = JSON.parse($window.sessionStorage.configRoleOptions);

		if ($window.sessionStorage.companyData) {
			$rootScope.branchData = JSON.parse($window.sessionStorage.branchData);
		}
		if ($window.sessionStorage.branchData) {
			$rootScope.companyData = JSON.parse($window.sessionStorage.companyData);
		}
		
		var user = new User();
		user.getActualUser()
		.then(function (obj) {
			$rootScope.userData = obj;
			$window.sessionStorage.user = JSON.stringify(obj);
			return $rootScope.userData.getRoleOptions();
		})
		.then(function(data){
			$rootScope.roleOptions = data;
			$window.sessionStorage.roleOptions = JSON.stringify(data);
			return $rootScope.userData.getRoleOptions(1);
		})
		.then(function(data){
			$rootScope.providerRoleOptions = data;
			$window.sessionStorage.providerRoleOptions = JSON.stringify(data);
			return $rootScope.userData.getRoleOptions(2);
		})
		.then(function(data){
			$rootScope.clientRoleOptions = data;
			$window.sessionStorage.clientRoleOptions = JSON.stringify(data);
			return $rootScope.userData.getRoleOptions(3);
		})
		.then(function(data){
			$rootScope.configRoleOptions = data;
			$window.sessionStorage.configRoleOptions = JSON.stringify(data);
			return $rootScope.userData.getRoleOptions(4);
		})
		.then(function(data){
			$rootScope.reportRoleOptions = data;
			$window.sessionStorage.reportRoleOptions = JSON.stringify(data);
		})
		.catch(function (error) {
			$location.path('/login');
		});
	}

	$rootScope.openCompanyModal = function (changeFlag) {
			new Company().find()
				.then(function (result) {
					$rootScope.companiesData = result.data;
					new Branch().find()
						.then(function (result) {
							$rootScope.branchesData = result.data;
							var data = {
					            branches: $rootScope.branchesData,
					            companies: $rootScope.companiesData
					        };

					        if (!$rootScope.companyData || changeFlag) {
						        var dialog = dialogs.create('views/modals/selectCompany.html', 'selectBranchModalCtrl', data, {
						            keyboard: true,
						            backdrop: 'static'
						        });

						        dialog.result.then(function(result) {
						        	console.log(result)
						            $rootScope.branchData = result.branchData;
						            $rootScope.companyData = result.companyData;
						            $window.sessionStorage.companyData = JSON.stringify(result.companyData);
						            $window.sessionStorage.branchData = JSON.stringify(result.branchData);
						            $route.reload();
						            // $location.reload();
						        }, function(err) {
						            // toaster.pop('error', 'Información', 'Ha ocurrido un error al crear la tarea');
						        })
						    }

						})
				});
	}

	$rootScope.$on("$routeChangeStart", function () {
		if($rootScope.userData && $rootScope.userData.getAccessOfView){
			var validView = $rootScope.userData.getAccessOfView();
			$timeout(function(){
				if(!validView.read){
					$location.path('/noaccess');
				}
				angular.element('input').prop('disabled', !validView.update);
				angular.element('select').prop('disabled', !validView.update);
				angular.element('textarea').prop('disabled', !validView.update);
				angular.element('.update').prop('disabled', !validView.update);
				angular.element('.new').prop('disabled', !validView.write);
				angular.element('.delete').prop('disabled', !validView.delete);
			});
		}
		if ((!$window.sessionStorage.token|| !$window.sessionStorage.user) && ($location.path() != '/login' && $location.path() != '/register' && $location.path().substr(0, 15) != "/changepassword" && $location.path().substr(0, 14) != "/confirm/email")) {
			$location.path('/login');
		}

		$scope.openCompanyModal();
	});
});
