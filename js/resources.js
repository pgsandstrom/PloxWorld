(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //resources:
    ploxworld.RESOURCE_SUPPLY = "supply";
    ploxworld.RESOURCE_PRODUCTION = "production";
    ploxworld.RESOURCE_MATERIAL = "material";
    ploxworld.RESOURCE_SCIENCE = "science";
    ploxworld.RESOURCE_CRYSTAL = "crystal";

    //TODO fix empire-specific prices by checking how effectively stuff is created within the empire
    ploxworld.price = {};
    ploxworld[ploxworld.RESOURCE_SUPPLY] = 100;
    ploxworld[ploxworld.RESOURCE_MATERIAL] = 150;
    ploxworld[ploxworld.RESOURCE_CRYSTAL] = 150;
    ploxworld[ploxworld.RESOURCE_PRODUCTION] = 250;
    ploxworld[ploxworld.RESOURCE_SCIENCE] = 250;


    ploxworld.makeResource = function (type, amount) {
//        console.log("makeResource: " + type);
        return new Resource(type, amount);
    };

    ploxworld.Resource = function Resource(type, amount) {
        this.type = type;
        this.amount = amount;
    };

    var Resource = ploxworld.Resource;

    Resource.prototype.addTo = function (planet) {
//        console.log("offloading supply to " + planet.name);
        planet[this.type] += this.amount;
        this.amount = 0;
    };

    Resource.prototype.getPrice = function () {
        return ploxworld.price[this.type];
    };


})();