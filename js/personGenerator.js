(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var PERSON_COUNT = 50;

    ploxworld.generatePersons = function () {

        var personCount = PERSON_COUNT;
        while (personCount) {
            var person = ploxworld.makeAiPerson();
            ploxworld.persons[person.name] = person;
            personCount--;
        }


        return ploxworld.persons;
    };

})();