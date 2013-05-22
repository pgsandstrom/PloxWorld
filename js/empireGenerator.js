(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var EMPIRE_COUNT = 4;
    var MIN_START_PLANETS = 3;

//    ploxworld.empires = {};
//    ploxworld.empireList = [];

    ploxworld.generateEmpires = function () {

        var names = ['Zeva clan', 'UPL', 'The Allegiance', 'Unified Sectors'];
        var colors = ['#FC8706', '#FCD805', '#05F6FC', '#0B05FC', '#818181', '#FFFFFF'];

        var getIdentity = function () {
            var index = Math.floor(Math.random() * names.length);
            var name = names[index];
            names.remove(index);
            var color = colors[index];
            colors.remove(index);
            return {"name": name, "color": color};
        };

        //global variables:
        ploxworld.empires = {};
        ploxworld.empireList = [];

        var empireCount = EMPIRE_COUNT;
        while (empireCount) {
            var identity = getIdentity();
            var empire = ploxworld.makeEmpire(identity.name, identity.color);
            ploxworld.empireList.push(empire);
            ploxworld.empires[empire.objectName] = empire;
            empireCount--;
        }

        //gives planets to empires until it is sufficiently even
        while (true) {
            var empirePlanetCountMap = {};
            _.each(ploxworld.empires, function (empire) {
                empire.planets = new Set();
                empire.x = (Math.random() * (ploxworld.WORLD_SIZE_X - 200)) + 100;
                empire.y = (Math.random() * (ploxworld.WORLD_SIZE_Y - 200)) + 100;
                empirePlanetCountMap[empire.objectName] = 0;
            });

            _.each(ploxworld.planets, function (planet) {
                var closestEmpire;
                var empireDistance;
                _.each(ploxworld.empires, function (empire) {
                    if (closestEmpire === undefined) {
                        closestEmpire = empire;
                        empireDistance = planet.getDistance(empire.x, empire.y);
                        empirePlanetCountMap[empire.objectName]++;
                        planet.setEmpire(empire);
                        empire.planets.add(planet);
                    } else {
                        var newDistance = planet.getDistance(empire.x, empire.y);
                        if (newDistance < empireDistance) {
                            closestEmpire.planets.remove(planet);
                            empirePlanetCountMap[closestEmpire.objectName]--;
                            empirePlanetCountMap[empire.objectName]++;
                            closestEmpire = empire;
                            empireDistance = newDistance;
                            planet.setEmpire(empire);
                            empire.planets.add(planet);
                        }
                    }
                });
            });

            var valid = true;
            for (var empireName in empirePlanetCountMap) {
                if (empirePlanetCountMap.hasOwnProperty(empireName)) {
                    var empirePlanetCount = empirePlanetCountMap[empireName];
                    if (empirePlanetCount < MIN_START_PLANETS) {
                        console.log("redoing universe: " + empirePlanetCount);
                        valid = false;
                        break;
                    }
                }
            }

            if (valid) {
                //assign leaders to the empires:
                _.each(ploxworld.empires, function (empire) {
                    var planet = empire.planets.getRandom();
                    empire.setOwner(planet.owner, true);
                    planet.owner.setEmpire(empire);
                });

                break;
            }
        }

        //render the empires relationships:
        ploxworld.renderRelationMap();

        //For testing
//        var fromPlanet = ploxworld.planets["Tellus"];
//        var toPlanet = ploxworld.planets["Mars"];
//        new ploxworld.TradeShip(fromPlanet, toPlanet, {});

        return ploxworld.empires;
    };

})();