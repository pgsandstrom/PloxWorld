(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //resources:
    ploxworld.RESOURCE_SUPPLY = "supply";
    ploxworld.RESOURCE_PRODUCTION = "production";
    ploxworld.RESOURCE_MATERIAL = "material";
    ploxworld.RESOURCE_SCIENCE = "science";
    ploxworld.RESOURCE_CRYSTAL = "crystal";

    ploxworld.price = {
        "supply": 100,
        "production": 150,
        "material": 150,
        "science": 250,
        "crystal": 250
    };


    ploxworld.makeResource = function (type, amount) {
//        console.log("makeResource: " + type);
        return ploxworld.RESOURCE_MAPPER[type](amount);
    };

    ploxworld.makeSupply = function (amount) {
        return new Supply(amount);
    };

    ploxworld.Supply = function Supply(amount) {
        this.amount = amount;
    };

    var Supply = ploxworld.Supply;

    Supply.prototype.addTo = function (planet) {
//        console.log("offloading supply to " + planet.name);
        planet.supply += this.amount;
        this.amount = 0;
    };

    ploxworld.makeMaterial = function (amount) {
//        console.log("make material");
        return new Material(amount);
    };

    ploxworld.Material = function Material(amount) {
        this.amount = amount;
    };

    var Material = ploxworld.Material;

    Material.prototype.addTo = function (planet) {
//        console.log("offloading material to " + planet.name);
        planet.Material += this.amount;
        this.amount = 0;
    };

    ploxworld.makeCrystal = function (amount) {
        //        console.log("make crystal");
        return new Crystal(amount);
    };

    ploxworld.Crystal = function Crystal(amount) {
        this.amount = amount;
    };

    var Crystal = ploxworld.Crystal;

    Crystal.prototype.addTo = function (planet) {
//        console.log("offloading crystal to " + planet.name);
        planet.Crystal += this.amount;
        this.amount = 0;
    };

    ploxworld.RESOURCE_MAPPER = {
        "supply": ploxworld.makeSupply,
        "material": ploxworld.makeMaterial,
        "crystal": ploxworld.makeCrystal
    };

})();