(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    //support methods:
    ploxworld.getRandomPlanet = function () {
        return ploxworld.planets[Math.floor(Math.random() * ploxworld.planets.length)];
    };

    /**
     * calculates the "closestAllied" for all planets, call when allied stuff changes
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
                return planet.planetDistance[a.objectName] - planet.planetDistance[b.objectName];
            });

            console.log(planet.objectName + " closest allies: ");
            $.each(planet.closestAllied, function (index, closesAllied) {
                console.log(closesAllied.objectName);
            });
        });


    };

    //object:
    ploxworld.Planet = function Planet(objectName, x, y) {
        this.objectName = objectName;
        this.x = x;
        this.y = y;
        this.pop = 100;
        this.planetDistance = {};   //planetName -> distance
        this.closestAllied = [];    //closest allied planets, to evaluate where trade goes
    };

    var Planet = ploxworld.Planet;

    Planet.prototype.tic = function () {
        console.log("tic: " + this.pop);
        this.pop = this.pop * 1.0001;
    };

    Planet.prototype.setPlanetDistance = function (planet, distance) {
//        console.log(this.objectName + " distance to " + planet.objectName + " is " + distance);
        this.planetDistance[planet.objectName] = distance;
//        console.log("result: " + this.planetDistance[planet.objectName]);
    };

})();