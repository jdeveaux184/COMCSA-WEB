angular.module('COMCSAApp')
.directive('backButton', function () {
  return {
    template: '<button class="btn btn-default noBorder" ng-click="goBack()"><i class="fa fa-reply"></i></button>',
    restrict: 'E',
    controller: function ($scope, $window) {
		$scope.goBack = function () {
			console.log('back');
			$window.history.back();
		};
    }
  };
});