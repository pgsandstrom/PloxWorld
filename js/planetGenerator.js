(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.WORLD_SIZE_X = 960;
    ploxworld.WORLD_SIZE_Y = 600;
    var BORDER = 20;
    var PLANETS_MIN_DISTANCE = 40;
    var PLANET_COUNT = 25;

    //XXX rename to "generate universe" or something
    ploxworld.generatePlanets = function () {

        var seed = Math.random() * 2000000 | 0;
        console.log("seed: " + seed);
//        seed = 85984;
        Math.seedrandom(seed);

        var names = ['Mercurius', 'Venus', 'Tellus', 'Mars', 'Jupiter', 'Saturnus', 'Neptunus', 'Uranus', 'Pluto', 'X',
            'Xero', 'Ygdra', 'Jakop', 'Crea', 'Ando', 'Estal', 'Zzyr', 'Sol', 'Tyl', 'Mega',
            'Terra', 'Eve', 'Ada', 'Omega', 'Orion'];

        var takeFreeName = function () {
            var index = Math.floor(Math.random() * names.length);
            var name = names[index];
            names.remove(index);
            return name;
        };

        //instanciate the global variables here, so we know they are reset when starting a new round!
        ploxworld.planets = {};
        ploxworld.planetList = [];

        //all planets ordered after supply need:
        ploxworld.supplyNeedList = [];
        ploxworld.ships = new Set();

        var planetCount = PLANET_COUNT;
        while (planetCount) {
            var x;
            var y;
            do {
                x = (Math.random() * (ploxworld.WORLD_SIZE_X - BORDER * 3)) + BORDER; //*3 to prevent name from sticking out on the right
                y = (Math.random() * (ploxworld.WORLD_SIZE_Y - BORDER * 2)) + BORDER;
            } while (!validPosition(x, y));

            var planet = new ploxworld.Planet(takeFreeName(), x, y);
            ploxworld.planets[planet.name] = planet;
            ploxworld.planetList.push(planet);
            planetCount--;

            //assign leader:
            var leader = ploxworld.makeAiPerson(undefined, undefined, planet);
            leader.setPlanet(planet);
            planet.setOwner(leader);
        }

        //calculate cost of travel
        for (var i = 0; i < ploxworld.planetList.length; i++) {
            var planet1 = ploxworld.planetList[i];
            for (var j = i + 1; j < ploxworld.planetList.length; j++) {
                var planet2 = ploxworld.planetList[j];
                var xDiff = Math.abs(planet1.x - planet2.x);
                var yDiff = Math.abs(planet1.y - planet2.y);
                var realDistance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
                var costDistance = Math.pow(realDistance, 1.1);
//                console.log(planet1.name + " to " + planet2.name + " distance: " + realDistance);
//                console.log(planet1.name + " to " + planet2.name + " cost: " + costDistance);
                planet1.setPlanetDistanceCost(planet2, costDistance);
                planet1.setPlanetDistance(planet2, costDistance);
                planet2.setPlanetDistanceCost(planet1, costDistance);
                planet2.setPlanetDistance(planet1, costDistance);
            }
        }

//        for (i2 = 0; i2 < ploxworld.planets.length; i2++) {
//            var planet = ploxworld.planets[i2];
//            console.log("iterating " + planet.name);
//            for (var otherPlanetName in  planet.planetDistanceCost) {
//                console.log(planet.name + " to " + otherPlanetName + " is " + planet.planetDistanceCost[otherPlanetName]);
//            }
//        }

        return ploxworld.planets;
    };

    function validPosition(x, y) {
        for (var i2 = 0; i2 < ploxworld.planetList.length; i2++) {
//            console.log("distance: " + ploxworld.planetList[i2].getDistance(x, y));
            if (ploxworld.planetList[i2].getDistance(x, y) < PLANETS_MIN_DISTANCE) {
//                console.log("lol to close");
                return false;
            }
        }
        return true;
    }
})();