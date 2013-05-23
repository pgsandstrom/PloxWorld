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
        if (!fromPlanet) {
            throw new Error("fromPlanet was false");
        }
        if (!toPlanet) {
            throw new Error("fromPlanet was false");
        }
        this.fromPlanet = fromPlanet;
        this.toPlanet = toPlanet;
        this.resource = resource;
        this.amount = amount;
        this.pending = 0; //the amount of resources that should already have been sent
        ploxworld.traderoutes.push(this);
        addRouteParts(this);
//        console.log("new traderoute from " + fromPlanet.name + " to " + toPlanet.name);
    };

    var TradeRoute = ploxworld.TradeRoute;

    TradeRoute.prototype.tic = function () {
        this.pending += this.amount;
        if (this.pending > 15) {
//            new ploxworld.TradeShip(this.fromPlanet, this.toPlanet, {resource: ploxworld.makeResource(this.resource, 5)});
            ploxworld.makeTradePerson(this.fromPlanet, this.toPlanet, {resource: ploxworld.makeResource(this.resource, this.pending)});
            this.fromPlanet[this.resource] -= this.pending;
            this.pending = 0;
        }
    };

    function addRouteParts(tradeRoute) {

        var originalPlanet = tradeRoute.fromPlanet;
        var fromPlanet = originalPlanet;
        var toPlanet = tradeRoute.toPlanet;

//        console.log("trade route parts from " + originalPlanet.name + " to " + toPlanet.name);

        // iterate step by step adding TradeRoutePart:s until we reach the target planet:
        while (true) {
            var nextPlanet = fromPlanet.safeWayTo[toPlanet.name];

//            console.log("step from " + fromPlanet.name + " to " + nextPlanet.name);

            var key;
            //make sure they always come in the same alphabetical order:
            if (fromPlanet.name.localeCompare(nextPlanet.name) > 0) {
                key = nextPlanet.name + "_" + fromPlanet.name;
            } else {
                key = fromPlanet.name + "_" + nextPlanet.name;
            }

//            console.log("new trade route part from " + fromPlanet.name + " to " + nextPlanet.name);
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