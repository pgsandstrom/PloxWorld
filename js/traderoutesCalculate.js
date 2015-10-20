(function () {
	"use strict";

	ploxworld.calculateCommodityRoutes = function () {
		var planetCommodityList = ploxworld.planetList; // no cloning, for optimization :)
		planetCommodityList.sort(function closest(a, b) {
			//XXX prefer planets that are bad at other stuff?
			return b.commodityMultiplier - a.commodityMultiplier;
		});


		for (var i = 0; i < planetCommodityList.length; i++) {
			var planet = planetCommodityList[i];
//            console.log("commodity multiplier: " + planet.commodityMultiplier);
			var commodityForExport = 0;
			var popToCommodity;
			if (planet.commodityNeed > 0) {
				popToCommodity = Math.ceil(planet.commodityNeed / planet.commodityMultiplier);
				var commodityCreated = popToCommodity * planet.commodityMultiplier;
				commodityForExport += commodityCreated - planet.commodityNeed;
				planet.commodityNeed = 0;
				planet.freePop -= popToCommodity;
				planet.commodityWork += popToCommodity;
			}
			var index = planetCommodityList.length - 1;
			while (true) {
				var planetExportTo = planetCommodityList[index];
				index--;

				if (planet === planetExportTo) {
					//this means that we have visited all less effective planets, so we end the loop.
//                    console.log("cant export to own planet");
					break;
				}

				if (planetExportTo.commodityNeed === 0) {
					continue;
				}

				//check if we can create a trade route:
//                if (!planet.safeWayTo[planetExportTo.name]) {
				if (!planet.getPath(planetExportTo, ploxworld.TRADE_SHIP_DISTANCE, planet.empire)) {
					continue;
				}

				//must be friends to trade:
				if (planet.empire !== planetExportTo.empire && planet.empire.getRelation(planetExportTo.empire).state < ploxworld.RELATION_STATE_FRIENDLY) {
					continue;
				}

				//calculate the data:
				var popToCommodityNeeded = Math.ceil((planetExportTo.commodityNeed - commodityForExport) / planet.commodityMultiplier);
				popToCommodity = Math.min(planet.freePop, popToCommodityNeeded);
				commodityForExport += popToCommodity * planet.commodityMultiplier;
				var actualExport = Math.min(commodityForExport, planetExportTo.commodityNeed);

				//perform the changes:
				planetExportTo.commodityNeed -= actualExport;
				commodityForExport -= actualExport;
				planet.freePop -= popToCommodity;
				planet.commodityWork += popToCommodity;
				ploxworld.makeTradeRoute(planet, planetExportTo, ploxworld.RESOURCE_COMMODITY, actualExport);

				//XXX remove planetExportTo if it requires nothing more. If we remove, then we must clone first!
				// One weakness in that we remove from the array and does not iterate everything: if planet x is only
				// allied to planet y and planet y imports, then planet y won't export to planet x

				if (planet.freePop === 0 && commodityForExport === 0) {
					break;
				}
			}
		}
	};

	ploxworld.calculateProductionScienceRoutes = function () {
		var planetProductionList = ploxworld.planetList.slice(0);
		planetProductionList.sort(function closest(a, b) {
			//XXX prefer planets that are bad at other stuff?
			return b.productionMultiplier - a.productionMultiplier;
		});
		var planetMaterialList = ploxworld.planetList.slice(0);
		planetMaterialList.sort(function closest(a, b) {
			//XXX prefer planets that are bad at other stuff?
			return b.materialMultiplier - a.materialMultiplier;
		});

		var planetScienceList = ploxworld.planetList.slice(0);
		planetScienceList.sort(function closest(a, b) {
			//XXX prefer planets that are bad at other stuff?
			return b.scienceMultiplier - a.scienceMultiplier;
		});
		var planetCrystalList = ploxworld.planetList.slice(0);
		planetCrystalList.sort(function closest(a, b) {
			//XXX prefer planets that are bad at other stuff?
			return b.crystalMultiplier - a.crystalMultiplier;
		});

		var calculatePlanetProduction = calculateRoutes(ploxworld.RESOURCE_PRODUCTION, ploxworld.RESOURCE_MATERIAL, planetProductionList, planetMaterialList);
		var calculatePlanetScience = calculateRoutes(ploxworld.RESOURCE_SCIENCE, ploxworld.RESOURCE_CRYSTAL, planetScienceList, planetCrystalList);

		//TODO currently takes turn, make it so AI can prioritize or whatever
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

		//Warning: Silly trickery with variable names ahead!

		//TODO we need to make sure planets stop producing requiredThingy if they are storing enough of it...

		var thingyIndex = 0;
		return function () {
//            console.log("step for " + thingy + " and " + requiredThingy);
			var planet = thingyPlanetList[thingyIndex];
			thingyIndex++;
			var requiredThingyIndex = 0;
			var extraImportRequested = 0;
			var extraImportDone = false;
			while (true) {
				if (planet.freePop === 0 && extraImportRequested === 0) {
					break;
				}

				var planetImportFrom = requiredThingyPlanetList[requiredThingyIndex];
				requiredThingyIndex++;

				if (!planetImportFrom) {
					break;
				}

				if (planet === planetImportFrom) {
					solveInternally(planet, thingy, requiredThingy);
					break;
				}

				if (planetImportFrom.freePop === 0) {
					//XXX could it be a good idea to move those planets from the list to avoid needless iterations?
					continue;
				}

				//check if we can create a trade route:
				if (!planetImportFrom.getPath(planet, ploxworld.TRADE_SHIP_DISTANCE, planetImportFrom.empire)) {
					continue;
				}

				//must be friends to trade:
				if (planet.empire !== planetImportFrom.empire && planet.empire.getRelation(planetImportFrom.empire).state < ploxworld.RELATION_STATE_FRIENDLY) {
					continue;
				}

				//calculate the data:
				var maxProduced = planet[thingy + "Multiplier"] * planet.freePop;
				//build up a storage of requiredThingy:
				if (!extraImportDone && maxProduced * ploxworld.PREFERED_MIN_STORAGE > planet[requiredThingy]) {
					//XXX does this logic work? Sometimes planets seem to import waaay more than they should...
					extraImportRequested = Math.ceil(planet.pop / 4);
//                    console.log("Lets build up " + requiredThingy + " at " + planet.name + " with " + extraImportRequested);
					extraImportDone = true;
				}
				var maxImported = planetImportFrom[requiredThingy + "Multiplier"] * planetImportFrom.freePop + planetImportFrom[requiredThingy + "ForExport"];
				var actualProduced = Math.min(maxProduced, maxImported);

				//XXX temp
				if (actualProduced < 0) {
					console.log("wtf negative produced at " + planet.name + ". actualProduced: " + actualProduced);
					console.log("maxProduced: " + maxProduced);
					console.log("maxImported: " + maxImported);
					console.log("planetImportFrom.freePop: " + planetImportFrom.freePop);
					console.log("planet.freePop: " + planet.freePop);
				}

				//move workers:
				var thingyWorkers = Math.floor(actualProduced / planet[thingy + "Multiplier"]);
				planet.freePop -= thingyWorkers;
				planet[thingy + "Work"] += thingyWorkers;

				var imported = actualProduced;
				if (extraImportRequested > 0 && maxImported > actualProduced) {
					var importIncrease = Math.min(extraImportRequested, maxImported - actualProduced);
					extraImportRequested -= importIncrease;
//                    console.log("importIncrease: " + importIncrease);
					imported += importIncrease;
				}

				var requiredThingExtraNeeded = imported - planetImportFrom[requiredThingy + "ForExport"];
				var requiredThingyWorkers = Math.ceil(requiredThingExtraNeeded / planetImportFrom[requiredThingy + "Multiplier"]);
				planetImportFrom.freePop -= requiredThingyWorkers;
				planetImportFrom[requiredThingy + "Work"] += requiredThingyWorkers;

				planetImportFrom[requiredThingy + "ForExport"] += requiredThingyWorkers * planetImportFrom[requiredThingy + "Multiplier"];
				planetImportFrom[requiredThingy + "ForExport"] -= imported;

				//create trade route:
				ploxworld.makeTradeRoute(planetImportFrom, planet, requiredThingy, imported);
			}
			//return if we are done:
			return thingyPlanetList.length !== thingyIndex;
		};
	};

	var solveInternally = function (planet, thingy, requiredThingy) {
		var freePop = planet.freePop;
		var thingyMultiplier = planet[thingy + "Multiplier"];
		var requiredThingyMultiplier = planet[requiredThingy + "Multiplier"];

		//used: (p-x) * a = x * b
		// to   x = ap / (a+b)
		var popForThingy = (requiredThingyMultiplier * freePop) / (requiredThingyMultiplier + thingyMultiplier);
		popForThingy = Math.floor(popForThingy);
		var popForRequiredThingy = freePop - popForThingy;

		var producedThing = popForThingy * thingyMultiplier;
		var producedRequiredThingy = popForRequiredThingy * requiredThingyMultiplier;

		//make sure we have stuff stored:
		if (producedThing === producedRequiredThingy && popForThingy * thingyMultiplier * ploxworld.PREFERED_MIN_STORAGE > planet[requiredThingy] && popForThingy > 0) {
			//XXX here we assume that everything is solved internally, but maybe we have already requested extra goods from another planet.
			//that is not game breaking though...
			popForThingy--;
			popForRequiredThingy++;
		}

		planet[thingy + "Work"] += popForThingy;
		planet[requiredThingy + "Work"] += popForRequiredThingy;

//        console.log("internal solution freePop: " + freePop);
//        console.log("internal solution: " + popForThingy + " for " + thingy + " at " + thingyMultiplier);
//        console.log("internal solution: " + popForRequiredThingy + " for " + requiredThingy + " at " + requiredThingyMultiplier);

		planet.freePop = 0;
	};


})();