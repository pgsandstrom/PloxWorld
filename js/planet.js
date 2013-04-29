(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};


    ploxworld.makePlanet = function (objectName, x, y) {
//        console.log("objectName: " + objectName);
//        console.log("x: " + x);

        var planet = {
            objectName: objectName,
            x: x,
            y: y,
            pop: 100,

            tic: function () {
                console.log("tic: " + planet.pop);

                planet.pop = planet.pop * 1.0001;
            }
        };

        return planet;


    };

})();