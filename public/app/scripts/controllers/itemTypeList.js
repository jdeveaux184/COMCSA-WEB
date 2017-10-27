'use strict';

angular.module('COMCSAApp')
.controller('ItemTypeListCtrl', function ($scope, $rootScope, $location, ItemType) {
	$scope.itemType = ItemType;
	$scope.fields = [{
			title : 'Código',
			name : 'code',
			type : 'text'
		},{
			title : 'Descripcion',
			name : 'description',
			type : 'text'
		}
	];

	$scope.search = [
		'_id',
		'code',
		'description',
	];
	// $scope.filterDate = 'code';

  $scope.excelFields = [{
			title : 'Código',
			name : 'code',
			type : 'text'
		},{
			title : 'Descripción',
			name : 'description',
			type : 'text'
		}
  ];

  $scope.sort = {
  		'code' : 1
  }

	$scope.filter = {};
	
	$scope.createNew = function () {
		$location.path('itemType');
	};
});
