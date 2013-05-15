(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.RELATION_STATE_WAR = -1;
    ploxworld.RELATION_STATE_NEUTRAL = 0;
    ploxworld.RELATION_STATE_FRIENDLY = 1;    // will trade
    ploxworld.RELATION_STATE_ALLIANCE = 2;    // share wars


    ploxworld.makeEmpire = function (name, color) {
        return new Empire(name, color);
    };

    ploxworld.Empire = function Empire(name, color) {
        //TODO just use name instead?
        var me = this;
        this.objectName = name;
        this.color = color;
        this.empireRelations = {};

        ploxworld.empireList.forEach(function (empire) {
            var empireRelation = new EmpireRelation();

            me.addRelation(empire, empireRelation);
            empire.addRelation(me, empireRelation);
        });
    };

    var Empire = ploxworld.Empire;

    Empire.prototype.addRelation = function (toEmpire, relation) {
        this.empireRelations[toEmpire.objectName] = relation;
    };

    //relations between empires:
    ploxworld.EmpireRelation = function EmpireRelation() {
        this.value = (Math.random() * 200 - 100) | 0;
        if (this.value < -50) {
            this.state = ploxworld.RELATION_STATE_WAR;
        } else if (this.value > 50) {
            this.state = ploxworld.RELATION_STATE_ALLIANCE;
        } else if (this.value > 40) {
            this.state = ploxworld.RELATION_STATE_FRIENDLY;
        } else {
            this.state = ploxworld.RELATION_STATE_NEUTRAL;
        }
    };

    var EmpireRelation = ploxworld.EmpireRelation;

//    EmpireRelation.prototype.test = function () {
//    };
})();