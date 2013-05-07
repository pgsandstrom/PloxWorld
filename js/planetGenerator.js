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

        ploxworld.planets = [ploxworld.makePlanet(takeFreeName(), 200, 250),
            ploxworld.makePlanet(takeFreeName(), 50, 350),
            ploxworld.makePlanet(takeFreeName(), 150, 350),
            ploxworld.makePlanet(takeFreeName(), 300, 100)
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
//                console.log(i + " to " + j + " distance: " + realDistance);
//                console.log(i + " to " + j + " cost: " + costDistance);
                planet1.setPlanetDistance(planet2, costDistance);
                planet2.setPlanetDistance(planet1, costDistance);
            }
        }

        return ploxworld.planets;
    };
})();