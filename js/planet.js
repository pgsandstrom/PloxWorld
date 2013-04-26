function Planet($scope) {

    "use strict";

    $scope.planets = [
        {name: 'earth', x: 3, y: 5, persons:["lol", "lol2"]},
        {name: 'mars', x: 2, y: 6,persons:[]}
    ];

    $scope.movePlanet = function () {
        angular.forEach($scope.planets, function (planet) {
            planet.x = planet.x+1;
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