(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //resources:
    var RESOURCE_SUPPLY = "supply";

    var MIN_SUPPLY_FOR_EXPORT = 50;
    var POP_DECREASE_AT_STARVATION = 0.99;

    var supplyNeedList = [];

    //support methods:
    ploxworld.getRandomPlanet = function () {
        var randomPlanet = ploxworld.planetList[Math.floor(Math.random() * ploxworld.planetList.length)];
        return randomPlanet;
    };

    /**
     * calculates the "closestAllied" for all planets, call when allied stuff changes. Also calls calculateTradeRoutes()
     */
    ploxworld.calculateTradeMap = function () {
        console.log("calculateTradeMap");

        $.each(ploxworld.planets, function (index, planet) {
            planet.closestAllied.length = 0;
            $.each(ploxworld.planets, function (index, otherPlanet) {
                //TODO check that the planet is allied
                if (planet !== otherPlanet) {
                    planet.closestAllied.push(otherPlanet);
                }
            });
            planet.closestAllied.sort(function closest(a, b) {
                return planet.planetDistanceCost[a.objectName] - planet.planetDistanceCost[b.objectName];
            });

//            console.log(planet.objectName + " closest allies: ");
//            $.each(planet.closestAllied, function (index, closesAllied) {
//                console.log(closesAllied.objectName);
//            });
        });

        ploxworld.calculateTradeRoutes();
    };

    /**
     * Calculates the actual trade routes. First calculates needs and stuff
     */
    ploxworld.calculateTradeRoutes = function () {
        $.each(ploxworld.planets, function (index, planet) {
            planet.calculateNeeds();
        });

        calculateNeedLists();

        ploxworld.traderoutes.length = 0;
        $.each(ploxworld.planets, function (index, planet) {
            planet.calculateTradeRoutes();
        });
    };

    function calculateNeedLists() {
        if (supplyNeedList.length === 0) {
            supplyNeedList = ploxworld.planetList.slice();
        }
        supplyNeedList.sort(function closest(a, b) {
            return b.supplyNeedImportance - a.supplyNeedImportance;
        });
    }

    //object:
    ploxworld.Planet = function Planet(objectName, x, y) {
        this.objectName = objectName;
        this.x = x;
        this.y = y;

        this.planetDistanceCost = {};   //name -> distanceCost  (calculated once)
        this.closestAllied = [];    //closest allied planets
        this.safeWayTo = {};    //name -> planet. The next stop to reach a planet   //TODO build this
        this.tradeRoutes = [];

        this.importance = 1;

        this.maxPop = 500 + Math.random() * 2000 | 0;
        this.pop = 100 + Math.random() * 500 | 0;

        this.supply = 50 + Math.random() * 50 | 0;
        this.supplyProd = 1 + Math.random() * 5 | 0;
        this.supplyNeed = -1;
        this.supplyNeedImportance = -1;
    };

    var Planet = ploxworld.Planet;

    Planet.prototype.getEaten = function () {
        return Math.floor(this.pop / 100);
    };

    Planet.prototype.tic = function () {

        this.supply += this.supplyProd;

        var eaten = this.getEaten();
        if (eaten < this.supply) {
            //TODO make this more dynamic or something:
            this.supply = this.supply - eaten;
            if (this.supply > 0) {
                this.supply--;
                this.pop++;
            }
        } else {
            //starvation!
            var popDecrease = Math.max(this.pop * POP_DECREASE_AT_STARVATION, 1);
            this.pop = Math.max(this.pop - popDecrease, 1);
        }

    };

    Planet.prototype.setPlanetDistanceCost = function (planet, distance) {
//        console.log(this.objectName + " distance to " + planet.objectName + " is " + distance);
        this.planetDistanceCost[planet.objectName] = distance;
//        console.log("result: " + this.planetDistanceCost[planet.objectName]);
    };

    Planet.prototype.calculateNeeds = function () {
        this.supplyNeed = Math.max(this.getEaten() - this.supplyProd, 0);
        if (this.supplyNeed === 0) {
            this.supplyNeedImportance = 0;
        } else {
            var supplyLast = Math.ceil(this.supply / this.getEaten());
            this.supplyNeedImportance = Math.max(200 - supplyLast, 0) * this.importance;
        }
    };

    Planet.prototype.calculateTradeRoutes = function () {
        //TODO possible optimization, return when a faction cant export a resource anymore or something? Or set a variable...
        if (this.supplyNeed === 0 && this.supply > MIN_SUPPLY_FOR_EXPORT) {
            var supplyExport = this.supplyProd - this.getEaten();
            for (var i = 0; i < supplyNeedList.length; i++) {
                if (supplyExport === 0) {
                    break;
                }
                var planet = supplyNeedList[i];
                if (planet.supplyNeed > 0) {
                    var exportNumber = Math.min(planet.supplyNeed, supplyExport);
                    var tradeRoute = new ploxworld.TradeRoute(this, planet, RESOURCE_SUPPLY, exportNumber);
                    this.tradeRoutes.push(tradeRoute);
                    supplyExport -= exportNumber;
                    planet.supplyNeed -= exportNumber;
                }
            }
        }
    };

})();