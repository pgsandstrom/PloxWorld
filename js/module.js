var myAppModule = angular.module('module', []);

myAppModule.filter('greet', function() {
    "use strict";

    return function(name) {
        return 'Hello, ' + name + '!';
    };
});