(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.traderoutes = [];
    ploxworld.traderouteParts = [];

    //support methods:
    ploxworld.resetTraderoutes = function() {
        ploxworld.traderoutes.length = 0;
    };

    //object:
    ploxworld.TradeRoute = function TradeRoute(fromPlanet, toPlanet, resource, amount) {
        this.fromPlanet = fromPlanet;
        this.toPlanet = toPlanet;
        this.resource = resource;
        this.amount = amount;
        ploxworld.traderoutes.push(this);
        console.log("new traderoute from " + fromPlanet.objectName + " to " + toPlanet.objectName);
    };

    var TradeRoute = ploxworld.TradeRoute;

    TradeRoute.prototype.temp = function () {
        return Math.floor(this.pop / 100);
    };


    //Trade route part a line between two planets with a "load", only used for sweet graphix!
    //TODO fix

})();