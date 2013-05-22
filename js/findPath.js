(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var MAX_DISTANCE_FOR_AI_TRADE = 400;

    var partRoutes = [];
    var reachedPlanets;

    ploxworld.findPathAllied = function (planet) {
        //XXX optimize by adding routes not only to the original planet u know etc

        planet.safeWayTo = {};
        partRoutes.length = 0;
        reachedPlanets = {};

        reachedPlanets[planet.name] = planet;

        //add the first part-routes, originating from the planet itself:
        addNewPartRoutes(planet, undefined);

        while (partRoutes.length) {
            var partRoute = partRoutes.splice(0, 1)[0];
            if (!reachedPlanets[partRoute.atPlanet.name]) {
                //new planet reached
                var reachedPlanet = partRoute.atPlanet;
                planet.safeWayTo[reachedPlanet.name] = partRoute.route[0];
                reachedPlanets[reachedPlanet.name] = reachedPlanet;
                addNewPartRoutes(reachedPlanet, partRoute);
            }
        }
    };

    function addNewPartRoutes(planet, earlierPartRoute) {
        for (var i = 0; i < planet.closestNonEnemy.length; i++) {
            var alliedPlanet = planet.closestNonEnemy[i];
            if (reachedPlanets[alliedPlanet.name]) {
//                console.log("planet " + alliedPlanet.name + " already reached from " + planet.name);
                continue;
            }
            var newDistanceCost = planet.planetDistanceCost[alliedPlanet.name];
            if (newDistanceCost < MAX_DISTANCE_FOR_AI_TRADE) {
                var earlierPath = earlierPartRoute ? earlierPartRoute.route : [];
                var distanceCost = earlierPartRoute ? earlierPartRoute.travelDistance : 0;
                partRoutes.push(new PartRoute(earlierPath, alliedPlanet, distanceCost + newDistanceCost));
            } else {
//                console.log("too long between " + planet.name + " and " + alliedPlanet.name + ", breaking");
                break;
            }
        }
        sortPartRoutes();
    }

    function sortPartRoutes() {
        partRoutes.sort(function closest(a, b) {
            return a.travelDistance - b.travelDistance;
        });
    }

    ploxworld.PartRoute = function PartRoute(route, atPlanet, travelDistance) {
        this.route = route;
        this.route.push(atPlanet);
        this.atPlanet = atPlanet;
        this.travelDistance = travelDistance;
    };

    var PartRoute = ploxworld.PartRoute;

//    PartRoute.prototype.temp = function () {
//        return Math.floor(this.pop / 100);
//    };

})();

