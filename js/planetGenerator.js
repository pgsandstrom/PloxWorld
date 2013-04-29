(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.generatePlanets = function () {
//        return [
//            {name: 'Earth', x: 200, y: 150},
//            {name: 'Mars', x: 250, y: 250}
//        ];

        var plox = [ploxworld.makePlanet("Earth", 200, 250),
            ploxworld.makePlanet("Mars", 50, 350),
            ploxworld.makePlanet("X", 150, 350)
        ];
        return plox;

    };
})();