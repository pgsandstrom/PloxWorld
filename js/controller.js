function Controller($scope) {

    "use strict";

    //init stuff:
    $scope.planets = ploxworld.generatePlanets();
    $scope.persons = ploxworld.generatePersons();

    $scope.movePlanet = function () {
        angular.forEach($scope.planets, function (planet) {
            planet.x = planet.x + 1;
        });
    };

    $scope.tic = function () {
        angular.forEach($scope.planets, function (planet) {
            planet.tic();
        });

        angular.forEach($scope.persons, function (person) {
            person.tic();
        });
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
}