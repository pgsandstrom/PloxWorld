(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};
    var make = ploxworld.make = ploxworld.make || {};

    make.planet = function(name, x, y){

        var planet = function planet() {

        };

        return planet;
    };

    window.ploxworld.planet.make = function () {
        return [
            {name: 'Earth', x: 200, y: 150},
            {name: 'Mars', x: 250, y: 250}
        ];
    };
})();