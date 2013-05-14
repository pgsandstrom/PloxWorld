(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var WORLD_SIZE_X = 960;
    var WORLD_SIZE_Y = 600;
    var BORDER = 20;
    var PLANETS_MIN_DISTANCE = 40;
    var PLANET_COUNT = 25;

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

        ploxworld.planets = {};
        ploxworld.planetList = [];


//        var planet = new ploxworld.Planet(takeFreeName(), 200, 250);
//        ploxworld.planets[planet.objectName] = planet;
//        ploxworld.planetList.push(planet);
//
//        planet = new ploxworld.Planet(takeFreeName(), 50, 350);
//        ploxworld.planets[planet.objectName] = planet;
//        ploxworld.planetList.push(planet);
//
//        planet = new ploxworld.Planet(takeFreeName(), 150, 350);
//        ploxworld.planets[planet.objectName] = planet;
//        ploxworld.planetList.push(planet);
//
//        planet = new ploxworld.Planet(takeFreeName(), 305, 100);
//        ploxworld.planets[planet.objectName] = planet;
//        ploxworld.planetList.push(planet);

        var planetCount = PLANET_COUNT;
        while (planetCount) {
            var x;
            var y;
            do {
                x = (Math.random() * (WORLD_SIZE_X - BORDER * 3)) + BORDER; //*3 to prevent name from sticking out on the right
                y = (Math.random() * (WORLD_SIZE_Y - BORDER * 2)) + BORDER;
            } while (!validPosition(x, y));

            var planet = new ploxworld.Planet(takeFreeName(), x, y);
            ploxworld.planets[planet.objectName] = planet;
            ploxworld.planetList.push(planet);
            planetCount--;
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
//                console.log(planet1.objectName + " to " + planet2.objectName + " distance: " + realDistance);
//                console.log(planet1.objectName + " to " + planet2.objectName + " cost: " + costDistance);
                planet1.setPlanetDistanceCost(planet2, costDistance);
                planet2.setPlanetDistanceCost(planet1, costDistance);
            }
        }


//        for (i2 = 0; i2 < ploxworld.planets.length; i2++) {
//            var planet = ploxworld.planets[i2];
//            console.log("iterating " + planet.objectName);
//            for (var otherPlanetName in  planet.planetDistanceCost) {
//                console.log(planet.objectName + " to " + otherPlanetName + " is " + planet.planetDistanceCost[otherPlanetName]);
//            }
//        }

        //calculate initial trade map:
        ploxworld.calculateTradeMap();

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