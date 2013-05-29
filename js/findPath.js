(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.MAX_DISTANCE_FOR_AI_TRADE = 250;  //XXX move this

    var partRoutes = [];
    var reachedPlanets;

    /**
     *
     * @param planet The planet from where to travel
     * @param maxDistance Max distance each jump can be
     * @param saveIn The object to save the result in
     * @param withKey Object key in which to save the result
     * @param empire The empire the path is tied to (wont travel through it's enemies etc) (can be undefined)
     */
    ploxworld.findPath = function (planet, maxDistance, saveIn, withKey, empire) {
        console.log("findPath started");
        //XXX optimize by adding routes not only to the original planet u know etc

        saveIn[withKey] = {};
        var saveHere = saveIn[withKey];
        partRoutes.length = 0;
        reachedPlanets = {};

        reachedPlanets[planet.name] = planet;

        //add the first part-routes, originating from the planet itself:
        addNewPartRoutes(planet, undefined, maxDistance);

        while (partRoutes.length) {
            var partRoute = partRoutes.splice(0, 1)[0];
            if (!reachedPlanets[partRoute.atPlanet.name]) {
                if (!empire || (empire === partRoute.atPlanet.empire || empire.getRelation(partRoute.atPlanet.empire).state >= ploxworld.RELATION_STATE_NEUTRAL)) {
                    //new planet reached
                    var reachedPlanet = partRoute.atPlanet;
                    saveHere[reachedPlanet.name] = partRoute.route[0];
                    reachedPlanets[reachedPlanet.name] = reachedPlanet;
                    addNewPartRoutes(reachedPlanet, partRoute, maxDistance, empire);
                }
            }
        }
    };

    function addNewPartRoutes(reachedPlanet, earlierPartRoute, maxDistance, empire) {
        for (var i = 0; i < reachedPlanet.planetDistanceList.length; i++) {
            var newPlanet = reachedPlanet.planetDistanceList[i];
            if (reachedPlanets[newPlanet.name]) {
//                console.log("planet " + newPlanet.name + " already reached from " + planet.name);
                continue;
            }

            if (empire && (empire !== newPlanet.empire && empire.getRelation(newPlanet.empire).state < ploxworld.RELATION_STATE_NEUTRAL)) {
                continue;
            }

            var newDistance = reachedPlanet.planetDistance[newPlanet.name];
            if (newDistance < maxDistance) {
                var earlierPath = earlierPartRoute ? earlierPartRoute.route : [];
                var earlierDistance = earlierPartRoute ? earlierPartRoute.travelDistance : 0;
                partRoutes.push(new PartRoute(earlierPath, newPlanet, earlierDistance + newDistance));
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

})();

