(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    window.ploxworld.generatePlanets = function () {
        return [
            {name: 'Earth', x: 300, y: 50},
            {name: 'Mars', x: 20, y: 400}
        ];
    };
})();