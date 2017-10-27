'use strict';

angular.module('COMCSAApp')
.controller('ItemListCtrl', function ($scope, $rootScope, $location, Item) {
	$scope.item = Item;
	$scope.fields = [{
			title : 'Código',
			name : 'code',
			type : 'text'
		},{
			title : 'Descripcion',
			name : 'description',
			type : 'text'
		},{
			title : 'Categoría',
			name : 'itemType',
			type : 'text'
		},{
			title : 'Unidad de Medida',
			name : 'unitOfMeasure',
			type : 'text'
		}, {
			title : 'Precio',
			name : 'price',
			type : 'currency'
		}
	];

	$scope.search = [
		'_id',
		'code',
		'description',
		'part',
		'unitOfMeasure',
		'price',
		'itemType.description'
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
		},{
			title : 'Categoría',
			name : 'itemType',
			type : 'text'
		},{
			title : 'Unidad de Medida',
			name : 'unitOfMeasure',
			type : 'text'
		}, {
			title : 'Precio',
			name : 'price',
			type : 'currency'
		}
  ];

  $scope.sort = {
  		'code' : 1
  }

	$scope.filter = {};
	
	$scope.createNew = function () {
		$location.path('item');
	};
});
