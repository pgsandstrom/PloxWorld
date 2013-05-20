(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.traderoutes = [];

    //this is used only for visualization of the trade routes:
    // planet1name + "_" + planet2name -> TradeRoutePart
    ploxworld.traderouteParts = {};

    //support methods:
    ploxworld.resetTraderoutes = function () {
        ploxworld.traderoutes.length = 0;
        ploxworld.traderouteParts = {};
    };

    //object:
    ploxworld.TradeRoute = function TradeRoute(fromPlanet, toPlanet, resource, amount) {
        this.fromPlanet = fromPlanet;
        this.toPlanet = toPlanet;
        this.resource = resource;
        this.amount = amount;
        this.pending = 0; //the amount of resources that should already have been sent
        ploxworld.traderoutes.push(this);
        addRouteParts(this);
//        console.log("new traderoute from " + fromPlanet.objectName + " to " + toPlanet.objectName);
    };

    var TradeRoute = ploxworld.TradeRoute;

    TradeRoute.prototype.tic = function () {
        this.pending += this.amount;
        if (this.pending > 5) {
            new ploxworld.TradeShip(this.fromPlanet, this.toPlanet, {resource: ploxworld.makeResource(this.resource, 5)});
            this.pending -= 5;
        }
    };

    function addRouteParts(tradeRoute) {

        var originalPlanet = tradeRoute.fromPlanet;
        var fromPlanet = originalPlanet;
        var toPlanet = tradeRoute.toPlanet;

//        console.log("trade route parts from " + originalPlanet.objectName + " to " + toPlanet.objectName);

        // iterate step by step adding TradeRoutePart:s until we reach the target planet:
        while (true) {
            var nextPlanet = fromPlanet.safeWayTo[toPlanet.objectName];

//            console.log("step from " + fromPlanet.objectName + " to " + nextPlanet.objectName);

            var key;
            //make sure they always come in the same alphabetical order:
            if (fromPlanet.objectName.localeCompare(nextPlanet.objectName) > 0) {
                key = nextPlanet.objectName + "_" + fromPlanet.objectName;
            } else {
                key = fromPlanet.objectName + "_" + nextPlanet.objectName;
            }

//            console.log("new trade route part from " + fromPlanet.objectName + " to " + nextPlanet.objectName);
            var tradeRoutePart = ploxworld.traderouteParts[key];
            if (!tradeRoutePart) {
                tradeRoutePart = new TradeRoutePart(fromPlanet, nextPlanet, tradeRoute.amount);
                ploxworld.traderouteParts[key] = tradeRoutePart;
            } else {
                tradeRoutePart.increase(tradeRoute.amount);
            }

            if (nextPlanet === toPlanet) {
                break;
            }

            fromPlanet = nextPlanet;
        }
    }

    /**
     * represents trade traffic between two nodes. "count" is the number merchandise moved each turn.
     * @param fromPlanet
     * @param toPlanet
     * @param amount The number of merchandise moved through this part
     * @constructor
     */
    ploxworld.TradeRoutePart = function TradeRoutePart(fromPlanet, toPlanet, amount) {
        this.fromPlanet = fromPlanet;
        this.toPlanet = toPlanet;
        this.amount = amount;
    };

    var TradeRoutePart = ploxworld.TradeRoutePart;

    TradeRoutePart.prototype.increase = function (number) {
        this.amount += number;
    };

})();