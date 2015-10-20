(function () {
	"use strict";
	var ploxworld = window.ploxworld = window.ploxworld || {};

	//FIXME temp
	var PERSON_COUNT = 0;

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