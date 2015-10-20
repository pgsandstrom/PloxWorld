var myApp = angular.module('ploxworld', ['ui.bootstrap']);

myApp.run(function ($rootScope, $templateCache) {
	$rootScope.$on('$viewContentLoaded', function () {
		console.log("cleaning cache");
		$templateCache.removeAll();
	});
});

function Controller($scope, $modal, $log, $templateCache) {
	"use strict";
	var ploxworld = window.ploxworld = window.ploxworld || {};

	$scope.clearCache = function () {
		$templateCache.removeAll();
	};

	$scope.startGame = function () {

		//TODO make it so ships aren't animated to new positions when pressing "new game"

		ploxworld.resetPersonNamePool();
		ploxworld.persons = new Set();  // Only important persons (not traders etc)
		ploxworld.personsAll = new Set();   // All persons

		$scope.tics = 0;
		$scope.planets = ploxworld.generatePlanets();
		$scope.player = ploxworld.makePlayerPerson("Player", true);
		$scope.persons = ploxworld.generatePersons();
		$scope.personsAll = ploxworld.personsAll;
		$scope.empires = ploxworld.generateEmpires();
		ploxworld.calculateTradeMap();

		$scope.ships = ploxworld.ships;
		$scope.tradeRoutes = ploxworld.traderoutes;
		$scope.totPop = 0;

		//forward the time some, so the world is a bit populated:
		for (var i = 0; i < 0; i++) {
			ploxworld.tic();
		}
	};

	$scope.movePlanet = function () {
		angular.forEach($scope.planets, function (planet) {
			planet.x = planet.x + 1;
		});
	};

	$scope.travelTo = function (planet) {
		console.log("controller travelto");
		$scope.player.travelTo(planet);
	};

	$scope.tic = ploxworld.tic = function () {
		$scope.tics++;

		//XXX first ask player about command?

		//each person makes decision, like where to travel etc
		angular.forEach($scope.personsAll, function (person) {
			person.tic();
		});

		//all the ships move
		angular.forEach($scope.ships, function (ship) {
			ship.tic();
		});

		//trade routes create ships
		angular.forEach($scope.tradeRoutes, function (tradeRoute) {
			tradeRoute.tic();
		});

		//planet calculates their new status
		$scope.totPop = 0;
		angular.forEach($scope.planets, function (planet) {
			planet.tic();
			$scope.totPop += planet.pop;
		});

		//XXX maybe do this an even 20 turns after alliance change instead, to avoid redundancy?
		if ($scope.tics % 20 === 0) {
			ploxworld.calculateTradeRoutes();
		}
	};

	$scope.calculateTradeMap = function () {
		ploxworld.calculateTradeMap();
	};

	$scope.renderRelationMap = ploxworld.renderRelationMap = function () {
		//XXX should this really be here in the controller?
		console.log("renderRelationMap");

		var container = $("#empire-relations");

		container.empty();

		var root = $(document.createElement('div'));
		var empireList = ploxworld.empireList;

		var empireNames = $(document.createElement('div'));
		empireNames.addClass("float-left");

		//the empty square:
		var empireName = $(document.createElement('div'));
		empireName.addClass("relation-name");
		empireNames.append(empireName);

		//empire names
		_.forEach(empireList, function (empire) {
			var empireName = $(document.createElement('div'));
			empireName.addClass("relation-name");
			empireName.css("background", empire.color);
			empireName.text(empire.name);
			empireNames.append(empireName);
		});
		root.append(empireNames);

		//the relations:
		_.forEach(empireList, function (empire) {
			var empireRow = $(document.createElement('div'));
			empireRow.addClass("float-left");
			var empireColorSquare = $(document.createElement('div'));
			empireColorSquare.addClass("relation-square");
			empireColorSquare.css("background", empire.color);
			empireRow.append(empireColorSquare);
			_.forEach(empireList, function (otherEmpire) {
				var relationSquare = $(document.createElement('div'));
				relationSquare.addClass("relation-square");
				if (empire === otherEmpire) {
					relationSquare.css("background", "black");
				} else {
					relationSquare.css("background", empire.empireRelations[otherEmpire.name].getColor());
				}
				empireRow.append(relationSquare);
			});
			root.append(empireRow);
		});

		container.append(root);
	};

	$scope.hoverPlanet = function (planet) {
		ploxworld.drawTravel($scope.player, planet);
	};

	$scope.showPlanetDropdown = function (planet) {
//        console.log("showPlanetDropdown");
		if (planet) {
			$scope.selectedPlanet = planet;
		}

		setTimeout(function () {
			$('.dropdown-toggle').dropdown('toggle');
		}, 1);
	};

	$scope.hidePlanetDropdown = function () {
//        console.log("hidePlanetDropdown");
		setTimeout(function () {
			$('.dropdown-toggle').dropdown('toggle');
		}, 1);
	};

	var isPlanetDropdownShowing = function () {
		return $('.dropdown-menu').is(":visible");
	};

	var planetDropdownShortcuts = function (event) {
		console.log("planetDropdownShortcuts");
		switch (event.which) {
			case 49: // 1
			case 50: // 2

				//kind of hacky, find the list item and click it...
				//TODO find "1. " in the list instead :)
				var dropdown = $("#planet-dropdown-menu");
				var children = dropdown.children();
				var child = children[event.which - 49];
				child.children[0].click();

				event.preventDefault();

				//a ugly fudging hack to prevent bootstrap dropdown from having focus and thus stealing the escape keyboard press
				setTimeout(function () {
					$("#tab-overview-persons-link").focus();
				}, 1);
				break;
		}
	};

	$scope.showPlanet = function (planet) {
		if (planet) {
			$scope.selectedPlanet = planet;
		}
		$("#tab-overview-planets a").tab('show');
	};

	$scope.showEmpire = function (empire) {
		if (empire) {
			$scope.selectedEmpire = empire;
		}
		$("#tab-overview-empires a").tab('show');
	};

	$scope.showPerson = function (person) {
		if (person) {
			$scope.selectedPerson = person;
		}
		$("#tab-overview-persons a").tab('show');
	};

	$scope.hideTabs = function () {
		$("#tab-overview-hide a").tab('show');
	};

	$scope.items = ['item1', 'item2', 'item3'];

	$scope.openTrade = function () {
		ploxworld.tradeWindow.openTrade($scope, $modal, $log);
	};

	$scope.isPlayerAtPlanet = function () {
		return $scope.player.isAtPlanet();
	};

	//must be keydown to prevent window from scrolling on space etc.
	$(document).keydown(function (event) {
		//code to ignore buttons, if I would like that:
		if (event.target.tagName === 'BUTTON' && (event.which === 32 || event.which === 13)) { // space and enter
			return;
		}

		if (isPlanetDropdownShowing()) {
			planetDropdownShortcuts(event);
			return;
		}

		switch (event.which) {
			case 27: // esc
				$scope.hideTabs();
				event.preventDefault();
				break;
			case 32: // space
				$scope.$apply(function () {
					ploxworld.tic();
				});
				event.preventDefault();
				break;
			case 49: // 1
				$scope.showPerson();
				break;
			case 50: // 2
				$scope.showPlanet();
				break;
			case 51: // 3
				$scope.showEmpire();
				break;
		}
	});

	$scope.startGame();
}