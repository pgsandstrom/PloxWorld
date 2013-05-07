(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.getRandomPlanet = function () {
        return ploxworld.planets[Math.floor(Math.random() * ploxworld.planets.length)];
    };

    ploxworld.makePlanet = function (objectName, x, y) {
//        console.log("objectName: " + objectName);
//        console.log("x: " + x);

        var planet = function planet() {
            planet.objectName = objectName;
            planet.x = x;
            planet.y = y;
            planet.pop = 100;

            //supply
            //supplyProd

            planet.planetDistance = {};

            planet.tic = function () {
                console.log("tic: " + planet.pop);

                planet.pop = planet.pop * 1.0001;
            };


            planet.setPlanetDistance = function (planet, distance) {
                //TODO can I remove "planet."?
                planet.planetDistance[planet] = distance;
            };

            return planet;
        }();

        return planet;
    };

})();