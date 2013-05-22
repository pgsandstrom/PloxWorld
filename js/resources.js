(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //resources:
    ploxworld.RESOURCE_SUPPLY = "supply";


    ploxworld.makeResource = function (type, amount) {
        return ploxworld.RESOURCE_MAPPER[type](amount);
    };

    ploxworld.makeSupply = function (amount) {
        return new Supply(amount);
    };

    ploxworld.Supply = function Supply(amount) {
//        console.log("supply created");
        this.amount = amount;
    };

    var Supply = ploxworld.Supply;

    Supply.prototype.addTo = function (planet) {
//        console.log("offloading to " + planet.name);
        planet.supply += this.amount;
        this.amount = 0;
    };


    ploxworld.RESOURCE_MAPPER = {
        "supply": ploxworld.makeSupply
    };

})();