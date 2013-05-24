(function () {
    "use strict";

    ploxworld.calculateSupplyRoutes = function () {
        var planetSupplyList = ploxworld.planetList; // no cloning, for optimization :)
        planetSupplyList.sort(function closest(a, b) {
            //TODO prefer planets that are bad at other stuff?
            return b.supplyMultiplier - a.supplyMultiplier;
        });


        for (var i = 0; i < planetSupplyList.length; i++) {
            var planet = planetSupplyList[i];
//            console.log("supply multiplier: " + planet.supplyMultiplier);
            var supplyForExport = 0;
            var popToSupply;
            if (planet.supplyNeed > 0) {
                popToSupply = Math.ceil(planet.supplyNeed / planet.supplyMultiplier);
                var supplyCreated = popToSupply * planet.supplyMultiplier;
                supplyForExport += supplyCreated - planet.supplyNeed;
                planet.supplyNeed = 0;
                planet.freePop -= popToSupply;
                planet.supplyWork += popToSupply;
            }
            var index = planetSupplyList.length - 1;
            while (true) {
                var planetExportTo = planetSupplyList[index];
                index--;

                if (planet === planetExportTo) {
                    //this means that we have visited all less effective planets, so we end the loop.
//                    console.log("cant export to own planet");
                    break;
                }

                if (planetExportTo.supplyNeed === 0) {
                    continue;
                }

                //check if we can create a trade route:
                if (!planet.safeWayTo[planetExportTo.name]) {
                    continue;
                }

                //must be friends to trade:
                if (planet.empire !== planetExportTo.empire && planet.empire.getRelation(planetExportTo.empire).state < ploxworld.RELATION_STATE_FRIENDLY) {
                    continue;
                }

                //calculate the data:
                var popToSupplyNeeded = Math.ceil((planetExportTo.supplyNeed - supplyForExport) / planet.supplyMultiplier);
                popToSupply = Math.min(planet.freePop, popToSupplyNeeded);
                supplyForExport += popToSupply * planet.supplyMultiplier;
                var actualExport = Math.min(supplyForExport, planetExportTo.supplyNeed);

                //perform the changes:
                planetExportTo.supplyNeed -= actualExport;
                supplyForExport -= actualExport;
                planet.freePop -= popToSupply;
                planet.supplyWork += popToSupply;
                var tradeRoute = new ploxworld.TradeRoute(planet, planetExportTo, ploxworld.RESOURCE_SUPPLY, actualExport);
                planet.export.push(tradeRoute);
                planetExportTo.import.push(tradeRoute);

                //TODO remove planetExportTo if it requires nothing more. If we remove, then we must clone first!

                // one weakness in that we remove from the array and does not iterate everything: if planet x is only
                // allied to planet y and planet y imports, then planet y won't export to planet x

                if (planet.freePop === 0 && supplyForExport === 0) {
                    break;
                }
            }
        }
    };

    ploxworld.calculateProductionScienceRoutes = function () {
        var planetProductionList = ploxworld.planetList; // no cloning, for optimization :)
        planetProductionList.sort(function closest(a, b) {
            //TODO prefer planets that are bad at other stuff?
            return b.productionMultiplier - a.productionMultiplier;
        });
        var planetMaterialList = ploxworld.planetList.slice(0);
        planetMaterialList.sort(function closest(a, b) {
            //TODO prefer planets that are bad at other stuff?
            return b.materialMultiplier - a.materialMultiplier;
        });

        var planetScienceList = ploxworld.planetList.slice(0);
        planetScienceList.sort(function closest(a, b) {
            //TODO prefer planets that already have a lot of science
            return b.scienceMultiplier - a.scienceMultiplier;
        });
        var planetCrystalList = ploxworld.planetList.slice(0);
        planetCrystalList.sort(function closest(a, b) {
            //TODO prefer planets that are bad at other stuff?
            return b.crystalMultiplier - a.crystalMultiplier;
        });

        //TODO take turn or something?
        var calculatePlanetProduction = calculateRoutes(ploxworld.RESOURCE_PRODUCTION, ploxworld.RESOURCE_MATERIAL, planetProductionList, planetMaterialList);
        var calculatePlanetScience = calculateRoutes(ploxworld.RESOURCE_SCIENCE, ploxworld.RESOURCE_CRYSTAL, planetScienceList, planetCrystalList);

        var continueProduction = true;
        var continueScience = true;
        while (continueProduction || continueScience) {
            if (continueProduction) {
                continueProduction = calculatePlanetProduction();
            }
            if (continueScience) {
                continueScience = calculatePlanetScience();
            }
        }

    };

    var calculateRoutes = function (thingy, requiredThingy, thingyPlanetList, requiredThingyPlanetList) {

        //XXX: Make two separate methods for production and science, this trickery with variable names sucks

        var thingyIndex = 0;
        return function () {
//            console.log("step for " + thingy + " and " + requiredThingy);
            var planet = thingyPlanetList[thingyIndex];
            thingyIndex++;
            var requiredThingyIndex = 0;
            while (true) {
                if (planet.freePop === 0) {
                    break;
                }

                var planetImportFrom = requiredThingyPlanetList[requiredThingyIndex];
                requiredThingyIndex++;

                if (!planetImportFrom) {
                    break;
                }

                if (planet === planetImportFrom) {
                    //TODO
                    console.log("lol solve it internally");
                    continue;
                }

                if (planetImportFrom.freePop === 0) {
                    //XXX could it be a good idea to move those planets from the list to avoid needless iterations?
                    continue;
                }

                //check if we can create a trade route:
                if (!planet.safeWayTo[planetImportFrom.name]) {
                    continue;
                }

                //must be friends to trade:
                if (planet.empire !== planetImportFrom.empire && planet.empire.getRelation(planetImportFrom.empire).state < ploxworld.RELATION_STATE_FRIENDLY) {
                    continue;
                }

                //calculate the data:
                var maxProduced = planet[thingy + "Multiplier"] * planet.freePop;
                var maxImported = planetImportFrom[requiredThingy + "Multiplier"] * planetImportFrom.freePop + planetImportFrom[requiredThingy + "ForExport"];
                var actualProduced = Math.min(maxProduced, maxImported);

                //XXX
                if (actualProduced < 0) {
                    console.log("wtf negative produced. actualProduced: " + actualProduced);
                    console.log("maxProduced: " + maxProduced);
                    console.log("maxImported: " + maxImported);
                    console.log("planetImportFrom.freePop: " + planetImportFrom.freePop);
                }

                //move workers:
                var thingyWorkers = Math.ceil(actualProduced / planet[thingy + "Multiplier"]);
                planet.freePop -= thingyWorkers;
                planet[thingy + "Work"] += thingyWorkers;
                var requiredThingExtraNeeded = actualProduced - planetImportFrom[requiredThingy + "ForExport"];
                var requiredThingyWorkers = Math.ceil(requiredThingExtraNeeded / planetImportFrom[requiredThingy + "Multiplier"]);
                planetImportFrom.freePop -= requiredThingyWorkers;
                planetImportFrom[requiredThingy + "Work"] += requiredThingyWorkers;

                planetImportFrom[requiredThingy + "ForExport"] += requiredThingyWorkers * planetImportFrom[requiredThingy + "Multiplier"];
                planetImportFrom[requiredThingy + "ForExport"] -= actualProduced;

                //create trade route:
                var tradeRoute = new ploxworld.TradeRoute(planetImportFrom, planet, requiredThingy, actualProduced);
                planet.import.push(tradeRoute);
                planetImportFrom.export.push(tradeRoute);

            }
            //return if we are done:
            return thingyPlanetList.length !== thingyIndex;
        };
    };


})();