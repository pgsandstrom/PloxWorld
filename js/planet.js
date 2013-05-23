(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var PREFERED_MIN_STORAGE = 65; //planets wants to have storage that lasts this many turns
    var MIN_SUPPLY_FOR_EXPORT = 50;
    var POP_INCREASE = 1.001;
    var POP_DECREASE_AT_STARVATION = 1 / (POP_INCREASE * POP_INCREASE);

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
                    return planet.planetDistanceCost[a.name] - planet.planetDistanceCost[b.name];
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
        console.log("calculateTradeRoutes");
        _.each(ploxworld.planets, function (planet) {
            planet.resetProduction();
        });

        ploxworld.resetTraderoutes();

        ploxworld.calculateSupplyRoutes();

//        _.each(ploxworld.planets, function (planet) {
//            planet.calculateTradeRoutes();
//        });

        ploxworld.draw();
    };

    ploxworld.calculateSupplyRoutes = function () {
        var planetSupplyList = ploxworld.planetList;
        planetSupplyList.sort(function closest(a, b) {
            //TODO prefer planets that are bad at other stuff
            return b.supplyMultiplier - a.supplyMultiplier;
        });


        for (var i = 0; i < planetSupplyList.length; i++) {
            var planet = planetSupplyList[i];
//            console.log("supply multiplier: " + planet.supplyMultiplier);
            var supplyForExport = 0;
            var popToSupply;
            if (planet.supplyNeed > 0) {
                popToSupply = Math.ceil(planet.supplyNeed / planet.supplyMultiplier);
                var supplyCreated = popToSupply * planet.supplyMultiplier;
                supplyForExport += supplyCreated - planet.supplyNeed;
                planet.supplyNeed = 0;
                planet.freePop -= popToSupply;
                planet.supplyWork += popToSupply;
            }
            var index = planetSupplyList.length - 1;
            while (true) {
                var planetExportTo = planetSupplyList[index];
                index--;

                if (planet === planetExportTo) {
                    //this means that we have visited all less effective planets, so we end the loop.
//                    console.log("cant export to own planet");
                    break;
                }

                if (planetExportTo.supplyNeed === 0) {
                    continue;
                }

                //check if we can create a trade route:
                if (!planet.safeWayTo[planetExportTo.name]) {
                    continue;
                }

                //must be friends to trade:
                if (planet.empire !== planetExportTo.empire && planet.empire.getRelation(planetExportTo.empire).state < ploxworld.RELATION_STATE_FRIENDLY) {
                    continue;
                }

                //calculate the data:
                var popToSupplyNeeded = Math.ceil((planetExportTo.supplyNeed - supplyForExport) / planet.supplyMultiplier);
                popToSupply = Math.min(planet.freePop, popToSupplyNeeded);
                supplyForExport += popToSupply * planet.supplyMultiplier;
                var actualExport = Math.min(supplyForExport, planetExportTo.supplyNeed);

                //perform the changes:
                planetExportTo.supplyNeed -= actualExport;
                supplyForExport -= actualExport;
                planet.freePop -= popToSupply;
                planet.supplyWork += popToSupply;
                var tradeRoute = new ploxworld.TradeRoute(planet, planetExportTo, ploxworld.RESOURCE_SUPPLY, actualExport);
                planet.export.push(tradeRoute);  //TODO wtf this is only exports... save all traderoutes? In that case, clera them in resetProduction()
                planetExportTo.import.push(tradeRoute);  //TODO wtf this is only exports... save all traderoutes? In that case, clera them in resetProduction()

                if (planet.freePop === 0 && supplyForExport === 0) {
                    break;
                }
            }
        }
    };

    //object:
    ploxworld.Planet = function Planet(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;

        this.planetDistance = {};   //name -> distance  (calculated once)
        this.planetDistanceCost = {};   //name -> distanceCost  (calculated once)
        this.closestNonEnemy = [];    //closest non-enemy planet. Used for navigating traders
        this.safeWayTo = {};    //name -> planet. The next stop to reach a planet   //TODO use set instead?
        this.export = [];
        this.import = [];

        this.empire = undefined;

        this.maxPop = 2 + Math.random() * 40 | 0;
        this.pop = 1 + Math.random() * 10 | 0;  //pop can be a float
        if (this.pop > this.maxPop) {
            this.pop = this.maxPop;
        }

//        this.freePop;

        this.supply = this.pop * PREFERED_MIN_STORAGE;
        this.supplyMultiplier = 1 + Math.random() * 5 | 0;
//        this.supplyWork;

        this.productionMultiplier = 1 + Math.random() * 5 | 0;
//        this.supplyWork;

        this.material = 50 + Math.random() * 50 | 0;
        this.supplyMultiplier = 1 + Math.random() * 5 | 0;
//        this.materialWork;

        this.scienceMultiplier = 1 + Math.random() * 5 | 0;
//        this.scienceWork;

        this.crystal = 50 + Math.random() * 50 | 0;
        this.crystalMultiplier = 1 + Math.random() * 5 | 0;
//        this.crystalWork;
    };

    var Planet = ploxworld.Planet;

    Planet.prototype.getEaten = function () {
        return this.pop | 0;
    };

    Planet.prototype.tic = function () {

        this.supply += this.supplyWork * this.supplyMultiplier;

        var eaten = this.getEaten();
        if (eaten < this.supply) {
            //XXX make this more dynamic or something:
            this.supply = this.supply - eaten;
            if (this.supply > 0) {
                if (this.pop < this.maxPop) {
                    this.pop = this.pop * POP_INCREASE;
                    if (this.pop > this.maxPop) {
                        this.pop = this.maxPop;
                    }
                }
            }
        } else {
            //starvation!
            console.log("starvation at " + this.name);
            //TODO just reorganize if not blockaded
            this.pop = Math.max(this.pop * POP_DECREASE_AT_STARVATION, 1);
        }

    };

    Planet.prototype.getDistance = function (x, y) {
        var xDiff = Math.abs(x - this.x);
        var yDiff = Math.abs(y - this.y);
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    };

    Planet.prototype.setOwner = function (person) {
        this.owner = person;
    };

    Planet.prototype.setEmpire = function (empire) {
        this.empire = empire;
    };

    Planet.prototype.getColor = function () {
        return this.empire.color;
    };

    Planet.prototype.setPlanetDistance = function (planet, distance) {
        this.planetDistance[planet.name] = distance;
    };

    Planet.prototype.setPlanetDistanceCost = function (planet, distanceCost) {
//        console.log(this.name + " distanceCost to " + planet.name + " is " + distanceCost);
        this.planetDistanceCost[planet.name] = distanceCost;
    };

    Planet.prototype.resetProduction = function () {
        this.freePop = this.pop | 0;
        this.supplyNeed = this.getEaten();
        //maybe we wanna store some supply:
        if (this.supply < this.getEaten() * PREFERED_MIN_STORAGE) {
            this.supplyNeed++;
        }
        this.supplyWork = 0;
        this.supplyWork = 0;
        this.materialWork = 0;  //TODO storing material and crystal, how does that work?
        this.scienceWork = 0;
        this.crystalWork = 0;

        this.export.length = 0;
        this.import.length = 0;
    };

    Planet.prototype.calculateTradeRoutes = function () {
        //XXX a planet should still export even when insufficient food, if it is not important enough... or maybe not?
        //XXX a planet should maybe export food to their own nation first... or maybe not?
        //XXX possible optimization, figure it out

        //negative supplyNeed means they can export
        if (this.supplyNeed < 0 && this.supply > MIN_SUPPLY_FOR_EXPORT) {
            for (var i = 0; i < ploxworld.supplyNeedList.length; i++) {

                //abort if we have no more resources to export
                if (this.supplyNeed >= 0) {
                    break;
                }
                var planet = ploxworld.supplyNeedList[i];

                //if relations are not good enough, ignore:
                if (this.empire !== planet.empire && this.empire.getRelation(planet.empire).state < ploxworld.RELATION_STATE_FRIENDLY) {
//                    console.log("not friends, no trade!");
                    continue;
                }

                //does the planet need resources, and can we get to it?
                if (planet.supplyNeed > 0 && this.safeWayTo[planet.name]) {
                    var exportNumber = Math.min(planet.supplyNeed, -this.supplyNeed);
                    var tradeRoute = new ploxworld.TradeRoute(this, planet, ploxworld.RESOURCE_SUPPLY, exportNumber);
                    this.tradeRoutes.push(tradeRoute);
                    this.supplyNeed += exportNumber;
                    planet.supplyNeed -= exportNumber;
                }
            }
        }
    };

})();