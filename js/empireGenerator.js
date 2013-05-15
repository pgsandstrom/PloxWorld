(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var EMPIRE_COUNT = 4;

    ploxworld.empires = {};
    ploxworld.empireList = [];

    ploxworld.generateEmpires = function () {

        var names = ['Zela clan','UPL','The Allegiance','Unified Sectors'];

        var takeFreeName = function () {
            var index = Math.floor(Math.random() * names.length);
            var name = names[index];
            names.remove(index);
            return name;
        };

        ploxworld.empires = {};
        ploxworld.empireList = [];

        var empireCount = EMPIRE_COUNT;
        while (empireCount) {
            var empire = ploxworld.makeEmpire(takeFreeName());
            ploxworld.empireList.push(empire);
            ploxworld.empires[empire.objectName] = empire;
            empireCount--;
        }

        return ploxworld.empires;
    };

})();