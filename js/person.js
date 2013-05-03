(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};


    /**
     *
     * @param objectName
     * @param planet if undefined, a random planet is assigned
     * @returns {{objectName: *, planet: *, tic: Function}}
     */
    ploxworld.makePerson = function (objectName, planet) {
//        console.log("objectName: " + objectName);
//        console.log("x: " + x);

        if (planet === undefined) {
            planet = ploxworld.getRandomPlanet();
        }


        var person = {
            objectName: objectName,
            planet: planet,

            tic: function () {
//                console.log("tic: " + planet.pop);

//                planet.pop = planet.pop * 1.0001;
            }
        };

        return person;


    };

})();