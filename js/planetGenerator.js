(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.generatePlanets = function () {

        var names = ['Mercurius', 'Venus', 'Tellus', 'Mars', 'Jupiter', 'Saturnus', 'Neptunus', 'Uranus', 'Pluto', 'X'];

        var takeFreeName = function () {
            var index = Math.floor(Math.random() * names.length);
            var name = names[index];
            names.remove(index);
            return name;
        };

        ploxworld.planets = [new ploxworld.Planet(takeFreeName(), 200, 250),
            new ploxworld.Planet(takeFreeName(), 50, 350),
            new ploxworld.Planet(takeFreeName(), 150, 350),
            new ploxworld.Planet(takeFreeName(), 305, 100)
        ];

        //calculate cost of travel
        for (var i = 0; i < ploxworld.planets.length; i++) {
            var planet1 = ploxworld.planets[i];
            for (var j = i + 1; j < ploxworld.planets.length; j++) {
                var planet2 = ploxworld.planets[j];
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


//        for (i = 0; i < ploxworld.planets.length; i++) {
//            var planet = ploxworld.planets[i];
//            console.log("iterating " + planet.objectName);
//            for (var otherPlanetName in  planet.planetDistanceCost) {
//                console.log(planet.objectName + " to " + otherPlanetName + " is " + planet.planetDistanceCost[otherPlanetName]);
//            }
//        }

        //calculate initial trade map:
        ploxworld.calculateTradeMap();

        return ploxworld.planets;
    };
})();