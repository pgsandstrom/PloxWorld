function Controller($scope) {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};


    //scope variables:
    $scope.tics = 0;
    $scope.planets = undefined;
    $scope.persons = undefined;
    $scope.ships = undefined;
    $scope.tradeRoutes = undefined;
    $scope.totPop = 0;
    $scope.selectedPlanet = undefined;

    $scope.startGame = function () {
        $scope.tics = 0;
        $scope.planets = ploxworld.generatePlanets();
        $scope.persons = ploxworld.generatePersons();
        $scope.ships = ploxworld.ships;
        $scope.tradeRoutes = ploxworld.traderoutes;
        $scope.totPop = 0;

        //forward the time some, so the world is a bit populated:
        for (var i = 0; i < 50; i++) {
            ploxworld.tic();
        }
    };

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
            empireName.text(empire.objectName);
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
                    relationSquare.css("background", empire.empireRelations[otherEmpire.objectName].getColor());
                }
                empireRow.append(relationSquare);
            });
            root.append(empireRow);
        });

        container.append(root);
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

    //must  be keydown to prevent window from scrolling on space etc.
    $(document).keydown(function (event) {
        //code to ignore buttons, if I would like that:
        if (event.target.tagName === 'BUTTON' && (event.which === 32 || event.which === 13)) { // space and enter
            return;
        }
//        console.log("keyup: " + event.which);

        switch (event.which) {
            case 27: // esc
                ploxworld.closeDialog();
                event.preventDefault();
                break;
            case 32:// space
                $scope.$apply(function () {
                    ploxworld.tic();
                });
                event.preventDefault();
                break;

        }
    });

    $("#selected-planet").hide();

    $scope.startGame();

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