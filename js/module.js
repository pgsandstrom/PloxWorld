var myAppModule = angular.module('module', []);

myAppModule.filter('greet', function () {
    "use strict";

    return function (name) {
        return 'Hello, ' + name + '!';
    };
});


//myAppModule.directive('objectOnMap', function factory ($document) {
//    "use strict";
//
//    return function (scope, element, attr) {
//        console.log("move bla");
//        element.css({
//            top: scope.object.y + 'px',
//            left: scope.object.x + 'px'
//        });
//
//        // watch the expression, and update the UI on change.
//        scope.$watch(attr, function (value) {
//            console.log("something");
//        });
//    };
//});