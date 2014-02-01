(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.traderoutes = [];

    //this is used only for visualization of the trade routes:
    // planet1name + "_" + planet2name -> TradeRoutePart
    ploxworld.traderouteParts = {};

    //support methods:
    ploxworld.resetTraderoutes = function () {

        //send what they are holding before deleting them:
        _.forEach(ploxworld.traderoutes, function (traderoute) {
            traderoute.sendShipment(traderoute.pending);
        });

        ploxworld.traderoutes.length = 0;
        ploxworld.traderouteParts = {};
    };

    ploxworld.makeTradeRoute = function (fromPlanet, toPlanet, resourceType, amount) {
        var tradeRoute = new TradeRoute(fromPlanet, toPlanet, resourceType, amount);
        ploxworld.traderoutes.push(tradeRoute);
//        console.log("trade from " + fromPlanet.name + " to " + toPlanet.name);
        addRouteParts(tradeRoute);
        fromPlanet.export.push(tradeRoute);
        toPlanet.import.push(tradeRoute);

        var price = ploxworld.getPriceReal(resourceType, fromPlanet);
        if (fromPlanet[resourceType + "Worth"] < price) {
            fromPlanet[resourceType + "Worth"] = price;
        }
        if (toPlanet[resourceType + "Worth"] < price) {
            toPlanet[resourceType + "Worth"] = price;
        }
    };

    var TradeRoute = function TradeRoute(fromPlanet, toPlanet, resourceType, amount) {
        if (!fromPlanet) {
            throw new Error("fromPlanet was false");
        }
        if (!toPlanet) {
            throw new Error("fromPlanet was false");
        }
        this.fromPlanet = fromPlanet;
        this.toPlanet = toPlanet;
        //TODO: resourceType byt namn till resourceName
        this.resourceType = resourceType;
        //TODO byt ut amount mot count
        this.amount = amount;
        this.pending = 0; //the amount of resources that should already have been sent
    };

    TradeRoute.prototype.tic = function () {
        this.pending += this.amount;

        var amountSent = Math.min(this.fromPlanet[this.resourceType], this.pending);
        if (amountSent !== this.pending) {
            console.log(this.fromPlanet.name + " could not deliver " + this.resourceType);
        }

        //send a tradeship something like every second to third turn
        if (amountSent > 0 && (this.pending > this.fromPlanet.pop * 6 || this.pending >= this.amount * 3)) {
            this.sendShipment(amountSent);
        }
    };

    TradeRoute.prototype.sendShipment = function (amountSent) {
        ploxworld.makeTradePerson(this.fromPlanet, this.toPlanet, {resourceType: ploxworld.makeResource(this.resourceType, amountSent)});
        this.fromPlanet[this.resourceType] -= amountSent;
        this.pending -= amountSent;
    };

    function addRouteParts(tradeRoute) {

        var originalPlanet = tradeRoute.fromPlanet;
        var fromPlanet = originalPlanet;
        var toPlanet = tradeRoute.toPlanet;

//        console.log("trade route parts from " + originalPlanet.name + " to " + toPlanet.name);

        // iterate step by step adding TradeRoutePart:s until we reach the target planet:
        while (true) {
            var nextPlanet = fromPlanet.getPath(toPlanet, ploxworld.TRADE_SHIP_DISTANCE, originalPlanet.empire);

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