(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //resources:
    ploxworld.RESOURCE_SUPPLY = "supply";
    ploxworld.RESOURCE_PRODUCTION = "production";
    ploxworld.RESOURCE_MATERIAL = "material";
    ploxworld.RESOURCE_SCIENCE = "science";
    ploxworld.RESOURCE_CRYSTAL = "crystal";

    ploxworld.RESOURCE_LIST = [ploxworld.RESOURCE_SUPPLY, ploxworld.RESOURCE_PRODUCTION, ploxworld.RESOURCE_MATERIAL, ploxworld.RESOURCE_SCIENCE, ploxworld.RESOURCE_CRYSTAL];

    ploxworld.BASE_PRICE = {};
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_SUPPLY] = 100;
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_MATERIAL] = 150;
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_CRYSTAL] = 150;
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_PRODUCTION] = 350;
    ploxworld.BASE_PRICE[ploxworld.RESOURCE_SCIENCE] = 350;

    ploxworld.workerPrices = {};


    ploxworld.getPriceBase = function (resourceType) {
        var price = ploxworld.BASE_PRICE[resourceType];
        return price;
    };

    /**
     * Here is our primite algorithm for calculating the price of merchandise depending on the average efficiency of the product
     * @param resourceType
     * @param planetProducedAt
     * @returns {number}
     */
    ploxworld.getPriceReal = function (resourceType, planetProducedAt) {
        var price = ploxworld.workerPrices[resourceType];
        var actualPrice = ((ploxworld.BASE_PRICE[resourceType]) + (price / planetProducedAt[resourceType + "Multiplier"])) / 2;
//        console.log("getPriceReal: " + actualPrice);
        //currently we have to do this, since production and trade routes are calculated at the same time...
        if (isNaN(actualPrice)) {
            return 0;
        }
        return actualPrice;
    };

    ploxworld.calculatePrices = function () {
        console.log("calculatePrices");
        //XXX Currently only calculates universal averages, could maybe be smarter and go for own+allies prices or something

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
//            if (planet.supplyWork > 0) {
//                console.log("omg supply worker: " + planet.supplyMultiplier);
//            }

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
        workerPrices[ploxworld.RESOURCE_MATERIAL] = (materialProduced / materialWorker) * ploxworld.BASE_PRICE[ploxworld.RESOURCE_MATERIAL];
        workerPrices[ploxworld.RESOURCE_PRODUCTION] = (productionProduced / productionWorker) * ploxworld.BASE_PRICE[ploxworld.RESOURCE_PRODUCTION];
        workerPrices[ploxworld.RESOURCE_CRYSTAL] = (crystalProduced / crystalWorker) * ploxworld.BASE_PRICE[ploxworld.RESOURCE_CRYSTAL];
        workerPrices[ploxworld.RESOURCE_SCIENCE] = (scienceProduced / scienceWorker) * ploxworld.BASE_PRICE[ploxworld.RESOURCE_SCIENCE];

//        console.log("final supply worker price: " + workerPrices[ploxworld.RESOURCE_SUPPLY]);
//        console.log("final material worker price: " + workerPrices[ploxworld.RESOURCE_MATERIAL]);
//        console.log("final production worker price: " + workerPrices[ploxworld.RESOURCE_PRODUCTION]);
//        console.log("final crystal worker price: " + workerPrices[ploxworld.RESOURCE_CRYSTAL]);
//        console.log("final science worker price: " + workerPrices[ploxworld.RESOURCE_SCIENCE]);
    };

    ploxworld.makeResource = function (type, amount) {
        return new Resource(type, amount);
    };

    var Resource = function Resource(type, amount) {
        this.type = type;
        this.amount = amount;
    };

    Resource.prototype.addTo = function (planet) {
//        console.log("offloading supply to " + planet.name);
        planet[this.type] += this.amount;
        this.amount = 0;
    };

})();