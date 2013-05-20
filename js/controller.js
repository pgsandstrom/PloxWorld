function Controller($scope) {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};


    //init stuff:
    $scope.tics = 0;
    $scope.planets = ploxworld.generatePlanets();
    $scope.persons = ploxworld.generatePersons();
    $scope.ships = ploxworld.ships;
    $scope.tradeRoutes = ploxworld.traderoutes;

    //info stuff:
    $scope.totPop = 0;

    $scope.selectedPlanet = ploxworld.getRandomPlanet();
//    console.log("selectedPlanet: " + $scope.selectedPlanet.objectName);

    $scope.movePlanet = function () {
        angular.forEach($scope.planets, function (planet) {
            planet.x = planet.x + 1;
        });
    };

    $scope.tic = ploxworld.tic = function () {
        $scope.tics++;

        angular.forEach($scope.ships, function (ship) {
            ship.tic();
        });

        angular.forEach($scope.persons, function (person) {
            person.tic();
        });

        angular.forEach($scope.tradeRoutes, function (tradeRoute) {
            tradeRoute.tic();
        });

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

    $(document).keyup(function (event) {
        //code to ignore buttons, if I would like that:
        if (event.target.tagName === 'BUTTON' && (event.which === 32 || event.which === 13)) { // space and enter
            return;
        }
//        console.log("keyup: " + event.which);

        switch (event.which) {
            case 27: // esc
                ploxworld.closeDialog();
                break;
            case 32:// space
                $scope.$apply(function () {
                    ploxworld.tic();
                });
                break;

        }
    });

    $("#selected-planet").hide();

    //forward the time some, so the world is a bit populated:
    for (var i = 0; i < 50; i++) {
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

//    $("#tab-empires a").tab('show');
}