function Controller($scope) {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var tics = 0;

    //init stuff:
    $scope.planets = ploxworld.generatePlanets();
    $scope.persons = ploxworld.generatePersons();
    $scope.ships = ploxworld.ships;
    $scope.tradeRoutes = ploxworld.traderoutes;

    $scope.selectedPlanet = ploxworld.getRandomPlanet();
//    console.log("selectedPlanet: " + $scope.selectedPlanet.objectName);

    $scope.movePlanet = function () {
        angular.forEach($scope.planets, function (planet) {
            planet.x = planet.x + 1;
        });
    };

    $scope.tic = ploxworld.tic = function () {

        tics++;

        angular.forEach($scope.ships, function (ship) {
            ship.tic();
        });

        angular.forEach($scope.persons, function (person) {
            person.tic();
        });

        angular.forEach($scope.tradeRoutes, function (tradeRoute) {
            tradeRoute.tic();
        });

        angular.forEach($scope.planets, function (planet) {
            planet.tic();
        });

        //XXX maybe do this an even 20 turns after alliance change instead, to avoid redundancy?
        if(tics % 20 === 0) {
           ploxworld.calculateTradeRoutes();
        }
    };

    $scope.calculateTradeMap = function () {
        ploxworld.calculateTradeMap();
    };

    $scope.addTodo = function () {
        $scope.todos.push({text: $scope.todoText, done: false});
        $scope.todoText = '';
    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (todo) {
            if (!todo.done) {
                $scope.todos.push(todo);
            }

        });
    };

    $scope.showPlanet = function (planet) {
        console.log("show planet: " + planet.objectName);
        $scope.selectedPlanet = planet;
        ploxworld.showDialog("selected-planet");
    };

    $("#selected-planet").hide();

    //forward the time some, so the world is a bit populated:
    for(var i=0;i<50;i++) {
        ploxworld.tic();
    }

    //some failed jquery code, FUCK that shit:

//    $("#test").click(function () {
////        var planetName = this.getAttribute("planet-name");
////        $scope.selectedPlanet = ploxworld.planets[planetName];
//        $scope.selectedPlanet = ploxworld.getRandomPlanet();
////        console.log("clicked name: " + planetName);
//        console.log("selected planet: " + $scope.selectedPlanet.objectName);
//        $("#selected-planet").show();
//    });
//
//    $("#map").on('click', '.planet', function () {
//        var planetName = this.getAttribute("planet-name");
//        $scope.selectedPlanet = ploxworld.planets[planetName];
//        console.log("clicked name: " + planetName);
//        console.log("selected planet: " + $scope.selectedPlanet.objectName);
////        $("#selected-planet").show();
//    });
//
}