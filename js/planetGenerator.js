(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    window.ploxworld.generatePlanets = function () {
        return [
            {name: 'Earth', x: 200, y: 150},
            {name: 'Mars', x: 250, y: 250}
        ];
    };
})();