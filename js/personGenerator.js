(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var PERSON_COUNT = 25;

    ploxworld.generatePersons = function () {

        var names = ['Bengt'];

        var takeFreeName = function () {
            var index = Math.floor(Math.random() * names.length);
            var name = names[index];
            names.remove(index);
            return name;
        };

        //global variables:
        ploxworld.persons = {};
        ploxworld.personList = [];

        var personCount = PERSON_COUNT;
        while (personCount) {
            var person = ploxworld.makePerson(takeFreeName());
            ploxworld.personList.push(person);
            ploxworld.persons[person.objectName] = person;
            personCount--;
        }

        return ploxworld.persons;
    };

})();