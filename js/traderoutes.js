(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.traderoutes = [];

    //support methods:
    //none lol

    //object:
    ploxworld.TradeRoute = function TradeRoute(fromPlanet, toPlanet, resource, amount) {
        this.fromPlanet = fromPlanet;
        this.toPlanet = toPlanet;
        this.resource = resource;
        this.amount = amount;
    };

    var TradeRoute = ploxworld.TradeRoute;

    TradeRoute.prototype.getEaten = function () {
        return Math.floor(this.pop / 100);
    };

})();