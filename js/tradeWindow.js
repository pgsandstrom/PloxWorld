(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.tradeWindow = ploxworld.tradeWindow || {};

    ploxworld.tradeWindow.openTrade = function ($scope, $modal, $log) {
        var modalInstance = $modal.open({
            templateUrl: 'tradeWindow.html',
            controller: TradeWindowCtrl,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $log.info('2 Modal dismissed at: ' + new Date());
            $scope.selected = selectedItem;
        }, function () {
            $log.info('1 Modal dismissed at: ' + new Date());
        });
    };

    var TradeWindowCtrl = function ($scope, $modalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function () {
            $modalInstance.close($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

})();