function Person($scope) {

    "use strict";

//    $scope.persons = [
//        {name: 'Per', x: 3, y: 5},
//        {name: 'Jakob', x: 2, y: 6}
//    ];

    $scope.movePerson = function () {
        console.log("movePerson");
//        angular.forEach($scope.planets, function (planet) {
//            planet.x = planet.x+1;
//        });
    };

    $scope.persons = ploxworld.generateWorld();

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