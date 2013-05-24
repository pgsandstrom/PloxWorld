(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.PREFERED_MIN_STORAGE = 75; //planets wants to have storage that lasts this many turns
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
        ploxworld.calculateProductionScienceRoutes();

        ploxworld.draw();
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

        this.credit = this.pop * _.random(50, 500);

        this.supply = this.pop * ploxworld.PREFERED_MIN_STORAGE;
        this.supplyMultiplier = _.random(1, 5);
//        this.supplyWork;

        this.production = 50 + Math.random() * 50 | 0;
        this.productionMultiplier = _.random(1, 5);
//        this.productionWork;

        this.material = 50 + Math.random() * 50 | 0;
        this.materialMultiplier = _.random(1, 5);
//        this.materialWork;

        this.science = 50 + Math.random() * 50 | 0;
        this.scienceMultiplier = _.random(1, 5);
//        this.scienceWork;

        this.crystal = 50 + Math.random() * 50 | 0;
        this.crystalMultiplier = _.random(1, 5);
//        this.crystalWork;
    };

    var Planet = ploxworld.Planet;

    Planet.prototype.getEaten = function () {
        return this.pop | 0;
    };

    Planet.prototype.addCredits = function (credits) {
        //XXX temp
        if(!$.isNumeric(credits)) {
            console.log("error credits: "+credits);
            throw new Error();
        }
        this.credit += credits;
    };

    Planet.prototype.tic = function () {

        //money:
        this.addCredits(this.pop * 20);

        //resources:
        this.material += this.materialWork * this.materialMultiplier;
        this.crystal += this.crystalWork * this.crystalMultiplier;

        var potentialProduction = this.productionWork * this.productionMultiplier;
        if (potentialProduction > this.material) {
            console.log("omg production starvation at " + this.name);
        }
        var newProduction = Math.min(potentialProduction, this.material);
        this.production += newProduction;
        this.material -= newProduction;

        var potentialScience = this.scienceWork * this.scienceMultiplier;
        if (potentialScience > this.crystal) {
            console.log("omg science starvation at " + this.name);
        }
        var newScience = Math.min(potentialScience, this.crystal);
        this.science += newScience;
        this.crystal -= newScience;

        //eating:
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
        //maybe we wanna store some supply: //XXX calculate need where we calculate need for other products
        if (this.supply < this.getEaten() * ploxworld.PREFERED_MIN_STORAGE) {
            this.supplyNeed += Math.ceil(this.pop / 5);
        }
        this.supplyWork = 0;
        this.supplyWork = 0;
        this.productionWork = 0;
        this.materialWork = 0;
        this.scienceWork = 0;
        this.crystalWork = 0;

        //temp variables used when calculating traderoutes:
        this.materialForExport = 0;
        this.crystalForExport = 0;

        this.export.length = 0;
        this.import.length = 0;
    };

})();