(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //resources:
    var RESOURCE_SUPPLY = "supply";

    var MIN_SUPPLY_FOR_EXPORT = 50;
    var POP_DECREASE_AT_STARVATION = 0.01;

    //all planets ordered after supply need:
    var supplyNeedList = [];

    //support methods:
    ploxworld.getRandomPlanet = function () {
        var randomPlanet = ploxworld.planetList[Math.floor(Math.random() * ploxworld.planetList.length)];
        return randomPlanet;
    };

    /**
     * calculates the "closestNonEnemy" for all planets, call when allied stuff changes. This also calls calculateTradeRoutes()
     */
    ploxworld.calculateTradeMap = function () {
        console.log("calculateTradeMap");

        for (var planetKey in ploxworld.planets) {
            if (ploxworld.planets.hasOwnProperty(planetKey)) {
                var planet = ploxworld.planets[planetKey];

                planet.closestNonEnemy.length = 0;
                for (var otherPlanetKey in ploxworld.planets) {
                    var otherPlanet = ploxworld.planets[otherPlanetKey];
                    if (planet !== otherPlanet &&
                        (planet.empire === otherPlanet.empire || planet.empire.getRelation(otherPlanet.empire).state >= ploxworld.RELATION_STATE_NEUTRAL)) {
                        //add to allied list:
                        planet.closestNonEnemy.push(otherPlanet);
                    }
                }
                planet.closestNonEnemy.sort(function closest(a, b) {
                    return planet.planetDistanceCost[a.objectName] - planet.planetDistanceCost[b.objectName];
                });

            }
        }
        _.each(ploxworld.planets, function (planet) {
            //calculate how to get to allies:
            ploxworld.findPathAllied(planet);
        });


        ploxworld.calculateTradeRoutes();
    };

    /**
     * Calculates the actual trade routes. First calculates needs and stuff
     */
    ploxworld.calculateTradeRoutes = function () {
        _.each(ploxworld.planets, function (planet) {
            planet.calculateNeeds();
        });

        calculateNeedLists();

        ploxworld.resetTraderoutes();

        _.each(ploxworld.planets, function (planet) {
            planet.calculateTradeRoutes();
        });

        ploxworld.draw();
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
        this.closestNonEnemy = [];    //closest non-enemy planet. Used for navigating traders
        this.safeWayTo = {};    //name -> planet. The next stop to reach a planet
        this.tradeRoutes = [];

        this.empire = undefined;
        this.importance = 1;

        this.maxPop = 500 + Math.random() * 2000 | 0;
        this.pop = 100 + Math.random() * 500 | 0;

        this.supply = 50 + Math.random() * 50 | 0;
        this.supplyProd = 1 + Math.random() * 5 | 0;
        this.supplyNeed = 0;   //negative value means they overproduce
        this.supplyNeedImportance = 0;  //the value used to prioritize supply distribution
    };

    var Planet = ploxworld.Planet;

    Planet.prototype.getEaten = function () {
        return Math.floor(this.pop / 100);
    };

    Planet.prototype.tic = function () {

        this.supply += this.supplyProd;

        var eaten = this.getEaten();
        if (eaten < this.supply) {
            //XXX make this more dynamic or something:
            this.supply = this.supply - eaten;
            if (this.supply > 0) {
                this.supply--;
                if (this.pop < this.maxPop) {
                    this.pop++;
                }
            }
        } else {
            //starvation!
            var popDecrease = Math.max(this.pop * POP_DECREASE_AT_STARVATION, 1);
            this.pop = (Math.max(this.pop - popDecrease, 1)) | 0;
        }

    };

    Planet.prototype.getDistance = function (x, y) {
        var xDiff = Math.abs(x - this.x);
        var yDiff = Math.abs(y - this.y);
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    };

    Planet.prototype.setEmpire = function (empire) {
        this.empire = empire;
    };

    Planet.prototype.getColor = function () {
        return this.empire.color;
    };

    Planet.prototype.setPlanetDistanceCost = function (planet, distance) {
//        console.log(this.objectName + " distance to " + planet.objectName + " is " + distance);
        this.planetDistanceCost[planet.objectName] = distance;
//        console.log("result: " + this.planetDistanceCost[planet.objectName]);
    };

    Planet.prototype.calculateNeeds = function () {
        this.supplyNeed = this.getEaten() - this.supplyProd;
        if (this.supplyNeed === 0) {
            this.supplyNeedImportance = 0;
        } else {
            var supplyLast = Math.ceil(this.supply / this.getEaten());
            this.supplyNeedImportance = Math.max(200 - supplyLast, 0) * this.importance;
        }
    };

    Planet.prototype.calculateTradeRoutes = function () {
        //TODO a planet should still export even when insufficient food, if it is not important enough
        //XXX a planet should maybe export food to their own nation first?
        //XXX possible optimization, figure it out

        //negative supplyNeed means they can export
        if (this.supplyNeed < 0 && this.supply > MIN_SUPPLY_FOR_EXPORT) {
            for (var i = 0; i < supplyNeedList.length; i++) {
                if (this.supplyNeed >= 0) {
                    break;
                }
                var planet = supplyNeedList[i];

                //if relations are not good enough, ignore:
                if (this.empire !== planet.empire && this.empire.getRelation(planet.empire).state < ploxworld.RELATION_STATE_FRIENDLY) {
                    console.log("not friends, no trade!");
                    continue;
                }

                if (planet.supplyNeed > 0 && this.safeWayTo[planet.objectName]) {
                    var exportNumber = Math.min(planet.supplyNeed, -this.supplyNeed);
                    var tradeRoute = new ploxworld.TradeRoute(this, planet, RESOURCE_SUPPLY, exportNumber);
                    this.tradeRoutes.push(tradeRoute);
                    this.supplyNeed += exportNumber;
                    planet.supplyNeed -= exportNumber;
                }
            }
        }
    };

})();