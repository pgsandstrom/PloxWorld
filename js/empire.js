(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.RELATION_STATE_WAR = -1;
    ploxworld.RELATION_STATE_NEUTRAL = 0;
    ploxworld.RELATION_STATE_FRIENDLY = 1;    // will trade
    ploxworld.RELATION_STATE_ALLIANCE = 2;    // share wars

    /**
     * If owner is not set, it needs to be set later, or the game will flip out
     * @param name
     * @param color
     * @param owner
     * @returns {ploxworld.Empire}
     */
    ploxworld.makeEmpire = function (name, color, owner) {
        var empire = new Empire(name, color);
        if(owner) {
            empire.setOwner(owner);
        }
        return empire;
    };

    ploxworld.Empire = function Empire(name, color) {
        this.name = name;
        this.color = color;
        this.planetList = [];
        this.empireRelations = {};
    };

    var Empire = ploxworld.Empire;

    Empire.prototype.addPlanet = function(planet) {
        this.planetList.push(planet);
    };

    Empire.prototype.removePlanet = function(planet) {
        this.planetList.removeObject(planet);
    };

    Empire.prototype.setOwner = function (person, randomizeRelations) {
        var me = this;
        console.log("empire owner: " + person.name);
        this.owner = person;

        //calculate the new relations:
        ploxworld.empireList.forEach(function (empire) {

            if(!empire.owner || empire.owner === me.owner) {
                return;
            }

            var relation = empire.owner.getRelation(me.owner);
            var empireRelation;
            if (!relation) {
                relation = person.createRelation(empire.owner, randomizeRelations);
            }
            empireRelation = new EmpireRelation(relation.value);
            me.addRelation(empire, empireRelation);
            empire.addRelation(me, empireRelation);
        });
    };

    Empire.prototype.addRelation = function (toEmpire, relation) {
        this.empireRelations[toEmpire.name] = relation;
    };

    Empire.prototype.getRelation = function (toEmpire) {
        return this.empireRelations[toEmpire.name];
    };

    Empire.prototype.getColor = function () {
        return this.color;
    };

    /**
     * Diplomatic state between empires
     * @param value The relation value between the rulers
     * @constructor
     */
    ploxworld.EmpireRelation = function EmpireRelation(value) {
        if (value < -50) {
            this.state = ploxworld.RELATION_STATE_WAR;
        } else if (value > 50) {
            this.state = ploxworld.RELATION_STATE_ALLIANCE;
        } else if (value > 40) {
            this.state = ploxworld.RELATION_STATE_FRIENDLY;
        } else {
            this.state = ploxworld.RELATION_STATE_NEUTRAL;
        }
    };

    var EmpireRelation = ploxworld.EmpireRelation;

    EmpireRelation.prototype.getColor = function () {
        switch (this.state) {
            case ploxworld.RELATION_STATE_WAR:
                return "red";
            case ploxworld.RELATION_STATE_NEUTRAL:
                return "gray";
            case ploxworld.RELATION_STATE_FRIENDLY:
                return "green";
            case ploxworld.RELATION_STATE_ALLIANCE:
                return "blue";
        }
    };
})();