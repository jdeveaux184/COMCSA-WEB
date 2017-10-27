'use strict';
angular.module('COMCSAApp')
.controller('selectBranchModalCtrl', function ($scope, $rootScope, $q, toaster, dialogs, $uibModalInstance, data) {
  $scope.branches = data.branches;
  $scope.companies = data.companies;
  $scope.selectedBranch = false;
  $scope.branches.push({_id:-1, name: 'Todos'});
  $scope.companies.push({_id:-1, entity: {name: 'Todos'}});
  $scope.selectedCompany = {_id:-1, entity: {name: 'Todos'}};
  $scope.selectedBranch = {_id:-1, name: 'Todos'};
  
  $scope.save = function () {
    var deferred = $q.defer();
    var result = {
    	companyData : $scope.selectedCompany,
    	branchData: $scope.selectedBranch
    }
    $uibModalInstance.close(result);
  }

});