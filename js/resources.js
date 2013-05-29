(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //resources:
    ploxworld.RESOURCE_SUPPLY = "supply";
    ploxworld.RESOURCE_PRODUCTION = "production";
    ploxworld.RESOURCE_MATERIAL = "material";
    ploxworld.RESOURCE_SCIENCE = "science";
    ploxworld.RESOURCE_CRYSTAL = "crystal";

    ploxworld.BASE_PRICE = {};
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_SUPPLY] = 100;
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_MATERIAL] = 150;
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_CRYSTAL] = 150;
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_PRODUCTION] = 350;
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_SCIENCE] = 350;

    ploxworld.workerPrices = {};

    ploxworld.calculatePrices = function () {
        //Currently only calculates universal averages, could maybe be smarter
        //TODO finish this


        var supplyWorker = 0;
        var supplyProduced = 0;

        var materialWorker = 0;
        var materialProduced = 0;

        var productionWorker = 0;
        var productionProduced = 0;

        var crystalWorker = 0;
        var crystalProduced = 0;

        var scienceWorker = 0;
        var scienceProduced = 0;
        _.forEach(ploxworld.planetList, function (planet) {
            supplyWorker += planet.supplyWork;
            supplyProduced += planet.supplyWork * planet.supplyMultiplier;
            if (planet.supplyWork > 0) {
                console.log("omg supply worker: " + planet.supplyMultiplier);
            }

            materialWorker += planet.materialWork;
            materialProduced += planet.materialWork * planet.materialMultiplier;
//            if (planet.materialWork > 0) {
//                console.log("omg material worker: " + planet.materialMultiplier);
//            }

            productionWorker += planet.productionWork;
            productionProduced += planet.productionWork * planet.productionMultiplier;

            crystalWorker += planet.crystalWork;
            crystalProduced += planet.crystalWork * planet.crystalMultiplier;

            scienceWorker += planet.scienceWork;
            scienceProduced += planet.scienceWork * planet.scienceMultiplier;
//            if (planet.scienceWork > 0) {
//                console.log("omg science worker: " + planet.scienceMultiplier);
//            }
        });

        var workerPrices = ploxworld.workerPrices = {};

        workerPrices[ploxworld.RESOURCE_SUPPLY] = (supplyProduced / supplyWorker) * ploxworld.BASE_PRICE[ploxworld.RESOURCE_SUPPLY];


        console.log("final resource worker price: " + workerPrices[ploxworld.RESOURCE_SUPPLY]);
//        _.forEach(ploxworld.empireList, function (empire) {
//        });
    };

    ploxworld.makeResource = function (type, amount) {
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
        var price = ploxworld.BASE_PRICE[this.type];
        return price;
    };


})();