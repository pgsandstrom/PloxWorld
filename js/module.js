var myAppModule = angular.module('module', []);

myAppModule.filter('greet', function () {
    "use strict";

    return function (name) {
        return 'Hello, ' + name + '!';
    };
});

//var fadeToggleDirective = function () {
//    "use strict";
//    return {
//        link: function (scope, element, attrs) {
//            scope.$watch(attrs.uiFadeToggle, function (val, oldVal) {
//                    if (val === oldVal) {
//                        return; // Skip inital call
//                    }
//                    console.log("plox det happened: " + val + ", " + oldVal);
//                    console.log("plox: " + element.style);
//
//                    $(element).css({"top": val });
//                }
//            )
//            ;
//        }
//    };
//};
//
//myAppModule.directive('uiFadeToggle', fadeToggleDirective);

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