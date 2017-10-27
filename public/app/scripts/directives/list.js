angular.module('COMCSAApp')
	.directive('list', function () {
		return {
			templateUrl: 'views/directives/lists.html',
			restrict: 'E',
			scope: {
				clase: '=clase',
				fields: '=fields',
				excelTitle: '=excelTitle',
				excelFields: '=excelFields',
				showId: '=showId',
				searchFields: '=searchFields',
				filterDate: '=filterDate',
				dblClickFn: '=dblClick',
				filterField: '=',
				searchBar: '=',
				noAuth: '=',
				advanced: '=',
				sortList: '=',
				sortField: '=?'
			},
			controller: function ($scope, $rootScope, $timeout, dialogs, toaster, Loading, $window) {
				$scope.list = [];
				$scope.currentElement = {};
				$scope.objeto = new $scope.clase();
				$scope.qty = 0;
				$scope.currentPage = 1;
				$scope.maxPage = 0;
				$scope.sortField = $scope.sortField ? $scope.sortField : { 'createdDate': -1 }
				$scope.orderBy = {
					// sort : {
					// 	'createdDate' : -1
					// },
					sort: $scope.sortField,
					reverse: false,
					field: '_id'
				};
				var today = new Date();
				$scope.filterDateOptions = {
					fromDate: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
					toDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
					enabled: true
				};

				var listBk = [],
					searchByFields = ['_id'],
					x,
					message = '',
					filtro = $scope.filterField ? $scope.filterField : {}
				//filtroOrBackup = $scope.filterField && $scope.filterField.$and ? $scope.filterField.$and : [];
				var params = {};
				$scope.limitOptionList = [Number(10),Number(20),Number(30),Number(40),Number(50),Number(100)];
				$scope.params = {
					filter: filtro,
					limit: 10,
					skip: 0,
					sort: $scope.orderBy.sort,
					search: '',
					searchView: '',
					fields: $scope.searchFields,
					noAuth: $scope.noAuth,
					advanced: $scope.advanced,
					title: $scope.excelTitle,
					excelFields: $scope.excelFields || $scope.fields,
					fieldFilter: {}
				};

				if ($scope.sortList == "-1") {
					$scope.params.sort = {
						_id: -1
					};
				} else if ($scope.sortList == "1") {
					$scope.params.sort = {
						_id: 1
					};
				};


				if ($scope.filterDate && $scope.filterDateOptions.enabled) {
					var dateRange = {};
					dateRange.start = $scope.filterDateOptions.fromDate;
					dateRange.end = $scope.filterDateOptions.toDate;
					dateRange.fields = [];
					dateRange.fields.push($scope.filterDate);

					$scope.params.dateRange = dateRange;
				}

				$scope.loaded = false;
				searchByFields = $scope.searchFields;
				angular.forEach($scope.fields, function (field, key) {
					field.sortable = (field.sortable == undefined) ? true : field.sortable;
					if (field.type === 'select') {
						if (field.config) {
							field.options = field.options.map(function (option) {
								return {
									value: ((field.config.value === 'Object') ? option : option[field.config.value]),
									label: option[field.config.label]
								};
							});
						} else {
							field.options = field.options.map(function (option) {
								return {
									value: option,
									label: option
								};
							});
						}
					}
				});

				var parseValue = function (value) {
					var result = value;
					if (typeof value == 'object' && !(value instanceof Date)) {
						result = [];
						for (var i in value) {
							result.push(value[i]);
						}
						result = result.join(',');
					}
					return result;
				};

				// Toma un objeto y una ruta. Devuelve el valor encontrado en esa ruta.
				$scope.inception = function (obj, path) {
					var result = path.split('.').reduce(function (prev, actual) {
						return prev[actual] || '';
					}, obj);
					return parseValue(result) || '';
				};

				$scope.getFieldLabel = function (value, options, routeInDb) {
					var i;
					for (i in options) {
						if (options[i].value == value)
							return options[i].label;
					}
					return 'No disponible';
				};

				var getFieldValues = function (value, options) {
					var i,
						result = [],
						found = false,
						regex = new RegExp(value, 'i');

					if (value.length) {
						for (i in options) {
							if (regex.test(options[i].label)) {
								result.push(options[i].value);
							}
						}
					}
					return result;
				};

				$scope.resolve = function (path, obj, aFunction, def) {

					var def = def || '';

					if (path && obj) {
						var a = [obj || self].concat(path.split('.')).reduce(function (prev, curr) {
							return prev[curr];
						});

						if (aFunction) {
							a = a[aFunction]();
							return a;
						} else if (!aFunction) { }
						return a;
					} else if (typeof aFunction == 'function') {
						return aFunction(obj);
					} else if (aFunction) {
						return obj[aFunction]();
					} else {
						return def;
					}

				}

				//Obtener los registros de la tabla paginados.
				$scope.getPaginatedSearch = function (pParams) {
					Loading.show();
					delete pParams.dateRange;
					if ($scope.filterDate && $scope.filterDateOptions.enabled) {
						pParams.dateRange = {};
						pParams.dateRange.start = $scope.filterDateOptions.fromDate;
						pParams.dateRange.end = $scope.filterDateOptions.toDate;
						pParams.dateRange.fields = [];
						pParams.dateRange.fields.push($scope.filterDate);
					}

					$scope.objeto.paginatedSearch(pParams).then(function (result) {
						if (result.data.length == 0) {
							//toaster.pop('error', 'Information', 'Couldn\'t load the items');
						}
						$scope.list = angular.copy(result.data);

						listBk = angular.copy(result.data);
						$scope.loaded = true;
						Loading.hide();
					}, function (error) {
						//toaster.pop('error', 'Information', 'Couldn\'t load the items');
						if (error == 'error') {
							$scope.list = [];
							listBk = [];
							$scope.loaded = true;
							Loading.hide();
						}
						console.log(error, 'error');
					});
				};

				//Download Excel
				$scope.downloadExcel = function (pParams) {
					var _params = angular.copy(pParams);

					//Leave out all the function fields
					if (!_params.title) {
						_params.title = $scope.excelTitle;
					}
					_params.excelFields = _.filter(_params.excelFields, function (field) {
						return (field.function == undefined)
					})
					console.warn(_params.excelFields);
					$scope.objeto.excel(_params)
						.then(function (result) {
							toaster.pop('success', 'Information', 'Archivo Descargado');
						}, function (error) {
							//toaster.pop('error', 'Information', 'Couldn\'t load the items');
						});
				};

				// Ir a la pagina anterior
				$scope.prevPage = function () {
					if ($scope.currentPage > 1) {
						$scope.currentPage--;
						$scope.params.skip = (($scope.currentPage - 1) * $scope.params.limit);
						$scope.getPaginatedSearch($scope.params);
					}
				};
				// Ir a la pagina siguiente
				$scope.nextPage = function () {
					if ($scope.currentPage < $scope.maxPage) {
						$scope.currentPage++;
						$scope.params.skip += $scope.list.length;
						$scope.getPaginatedSearch($scope.params);
					}
				};

				// Ir al final de la pagina
				$scope.finPage = function () {
					if ($scope.currentPage < $scope.maxPage) {
						$scope.currentPage = $scope.maxPage;
						$scope.params.skip = ($scope.maxPage * $scope.list.length) - $scope.list.length;
						$scope.getPaginatedSearch($scope.params);
					}
				};
				// Ir al principio de la pagina
				$scope.firstPage = function () {
					if ($scope.currentPage <= $scope.maxPage) {
						$scope.currentPage = 1;
						$scope.params.skip = 10;
						$scope.getPaginatedSearch($scope.params);
					}
				};

				// Activar o desactivar el boton de ir atras
				$scope.prevPageDisabled = function () {
					return $scope.currentPage === 1 ? "disabled" : "";
				};
				// Activar o desactivar el boton de ir adelante
				$scope.nextPageDisabled = function () {
					return $scope.currentPage === $scope.maxPage ? "disabled" : "";
				};
				// Funcion para buscar un elemento especifico
				$scope.search = function () {
					$scope.params.limit = Number($scope.params.limit)
					$scope.objeto.paginatedCount($scope.params).then(function (res) {
						res = res.count;
						$scope.currentPage = 1;
						$scope.maxPage = res < $scope.params.limit ? 1 : Math.ceil(res / $scope.params.limit);
					});
					$scope.params.skip = 0;
					$scope.getPaginatedSearch($scope.params);
				};

				// Funcion para filtrar de forma ascendente o descendente por los campos mostrados en pantalla.
				$scope.filter = function (field) {
					$scope.orderBy.sort = {};
					if ($scope.orderBy.field === field) {
						$scope.orderBy.reverse = !$scope.orderBy.reverse;
						$scope.orderBy.sort[field] = $scope.orderBy.reverse ? -1 : 1;
					} else {
						$scope.orderBy.field = field;
						$scope.orderBy.sort[field] = 1;
						$scope.orderBy.reverse = false;
					}
					$scope.params.sort = $scope.orderBy.sort;
					$scope.getPaginatedSearch($scope.params);
				};

				$scope.matching = function (value) {
					return (value === parseInt(value));
				};

				$scope.dblClick = function (elem, event) {
					if ((event.pointerType == 'touch' && event.type == 'tap') || event.type == 'dblclick') {
						$window.sessionStorage.params = JSON.stringify($scope.params);
						if ($scope.dblClickFn) {
							$scope.dblClickFn(elem);
						} else {
							elem.goTo(elem._id);
						}
					}
				};

				$scope.setOrderClass = function (field) {

					if ($scope.orderBy.field === field.name) {
						if ($scope.orderBy.reverse) {
							return {
								'sorting_asc': true
							};
						} else {
							return {
								'sorting_desc': true
							};
						}
					} else {
						return {
							'sorting': true
						};
					}
				};

				//Ejecutar busqueda cuando se cambie algun parametro en filter
				$scope.$watch(function () {
					return JSON.stringify($scope.filterField);
				}, function (data) {
					$scope.getPaginatedSearch($scope.params);
				})

				// Buscar los tipos de cuentas
				$scope.objeto.paginatedCount($scope.params).then(function (res) {
					$scope.count = res.count;
					$scope.count = angular.copy(res.count)
					$scope.maxPage = res.count < $scope.params.limit ? 1 : Math.ceil(res.count / $scope.params.limit);
					var page = ($scope.params.skip + $scope.params.limit) / $scope.params.limit;
					$scope.currentPage = page < 1 ? 1 : page;
					$scope.getPaginatedSearch($scope.params);
				});

				// Extraer los campos pasados por parametros (fields)
				for (x in $scope.fields) {
					if ($scope.fields[x].routeInDb) {
						var levels = $scope.fields[x].routeInDb.split('.');
						var b,
							c = $scope.fields[x].routeInDb;

						for (var i in levels.length) {
							c = b[levels[i]];
						}
					}
				}
			}
		};
	});
