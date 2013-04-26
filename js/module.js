var myAppModule = angular.module('module', []);

myAppModule.filter('greet', function () {
    "use strict";

    return function (name) {
        return 'Hello, ' + name + '!';
    };
});


myAppModule.directive('objectOnMap', function ($document) {
    "use strict";

    return function (scope, element, attr) {
        element.css({
            position: 'relative',
            border: '1px solid red',
            backgroundColor: 'lightgrey',
            cursor: 'pointer',
            top: scope.object.y + 'px',
            left: scope.object.x + 'px'
        });
    };
});