(function () {
	"use strict";
	var ploxworld = window.ploxworld = window.ploxworld || {};

	ploxworld.tradeWindow = ploxworld.tradeWindow || {};

	ploxworld.tradeWindow.openTrade = function ($scope, $modal, $log) {

		var playerCurrentPlanet = $scope.player.getPlanet();

		if (playerCurrentPlanet === undefined) {
			$log.error("playerCurrentPlanet was null, aborting");
			return;
		}

		//TODO is this in their own scope?
		var modalInstance = $modal.open({
			templateUrl: 'tradeWindow.html',
			controller: TradeWindowCtrl,
			backdrop: 'static',
			windowClass: 'hello',
			resolve: {
				planetCopy: function () {
					return $.extend({}, playerCurrentPlanet);
				},
				planetReal: function () {
					return $.extend({}, playerCurrentPlanet);
				},
				personCopy: function () {
					return $.extend({}, $scope.player);
				},
				personReal: function () {
					return $scope.player;
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$log.info('2 Modal dismissed with ok');
		}, function () {
			$log.info('2 Modal dismissed with cancel');
		});
	};

	var TradeWindowCtrl = function ($scope, $modalInstance, planetCopy, planetReal, personCopy, personReal) {

		$scope.planetCopy = planetCopy;
		$scope.planetReal = planetReal;
		$scope.personCopy = personCopy;
		$scope.personReal = personReal;
		$scope.resourceNameList = ploxworld.RESOURCE_LIST;

		$scope.ok = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		$scope.buy = function (resource) {

		};

		$scope.sell = function (resource) {

		};
	};

})();