(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.generatePersons = function () {

        ploxworld.persons = [ploxworld.makePerson("Bengt"),
            ploxworld.makePerson("Mars"),
            ploxworld.makePerson("X")
        ];
        return ploxworld.persons;
    };
})();