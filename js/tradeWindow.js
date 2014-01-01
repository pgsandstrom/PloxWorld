(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.tradeWindow = ploxworld.tradeWindow || {};

    ploxworld.tradeWindow.openTrade = function ($scope, $modal, $log) {

        var playerCurrentPlanet = $scope.player.getPlanet();

        if(playerCurrentPlanet === undefined) {
            $log.error("playerCurrentPlanet was null, aborting");
            return;
        }

        var modalInstance = $modal.open({
            templateUrl: 'tradeWindow.html',
            controller: TradeWindowCtrl,
            windowClass: 'hello',
            resolve: {
                planet: function () {
                    return playerCurrentPlanet;
                },
                person: function () {
                    return $scope.player;
                },
                resourceList: function() {
                    return ploxworld.RESOURCE_LIST;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $log.info('2 Modal dismissed at: ' + new Date());
//            $scope.selected = selectedItem;
        }, function () {
            $log.info('1 Modal dismissed at: ' + new Date());
        });
    };

    var TradeWindowCtrl = function ($scope, $modalInstance, planet, person, resourceList) {

        $scope.planet = planet;
        $scope.person = person;
        $scope.resourceList = resourceList;
//        $scope.selected = {
//            item: $scope.items[0]
//        };

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

})();