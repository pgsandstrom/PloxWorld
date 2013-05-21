(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.resetPersonNamePool = function () {
        ploxworld.maleNames = ['Jakob Lind', 'Mikael Emilsson', 'Per Sandström', 'Jacob Rask', 'Hoyt Tyrrell', 'Avery Koerner', 'Maxwell Avison', 'Britt Wakeman', 'Porter Jackstadt', 'Damien Severt', 'Nolan Alers', 'Harlan Ducote', 'Thaddeus Sanghvi', 'Gavin Gulsvig', 'Craige Lera', 'Carly Jones', 'Jery Rownez', 'Richua Brobarn', 'Phawne Breson', 'Billie Mitchy', 'Gary Flewill', 'Roldy Rezal', 'Randy Theson', 'Edwam Thallee', 'Malcolm McCree', 'Silas Lloyd', 'Thaddeus Clark', 'Gabriel Law', 'Morris McNevin', 'Nelson Clarke', 'Harland Anderson', 'Bailey Cox', 'Rufus Hunter', 'Woodrow Wilson', 'Edison Gammon', 'Chet Zephyr', 'Scotty Vanlaere', 'Walton Sharpey', 'Darius Chalet', 'Damien Holtz', 'Broderick Zahra', 'Edison Cayne', 'Darius Paulsen', 'Rory Alder', 'Vyna Ecken', 'Tarsi Javand', 'Iakaf Berand', 'Kesi Andar', 'Rharo Tillie', 'Rix Avar', 'Vyna Melne', 'Nej Hamne', 'Hoan Horne', 'Eucer Yougher', 'Jackenn Lopet', 'Juanio Coopow', 'Tephy Griffin', 'Denne Aller', 'Ronio Lore', 'Shawne Gerson', 'Dave Brobarn', 'Jamy Reeders', 'Randy Perra'];
        ploxworld.femaleNames = ['Anna Gillner', 'Kimby Bennes', 'Annies Kere', 'Dianie Leray', 'Dithy Dera', 'Terea Liamson', 'Mara Nelson', 'Kara Scarte', 'Stinie Ampbes', 'Kathy Belley', 'Jeana Pere', 'Lille Carte', 'Joana Ampbes', 'Arthah Jonez', 'Erlyn Campbak', 'Jeana Perray', 'Irgis Jackson', 'Chelle Hellee', 'Janie Helly', 'Licia Pete', 'Verly', 'Henders', 'Dorie Wisand', 'Jane Hillee', 'Margel Hezal', '', 'ana Wisimm', 'Margin Morray', 'Kathly Wooder', 'Louise Willey', 'Mely Garce', 'Margin Coopark', 'Athen Derson', 'Diana Helly', 'Donne Woodiaz', 'Coley Warders', 'Kathy Tayly', 'Loria Parkell', 'Enen Clexand', 'Betty Parker', 'Lora Sterson', 'Mela Milley', 'Elin Carte', 'Amira Severt', 'Lael Yueh', 'Collene Breton', 'Charlena Harcrow', 'Laree Holbach', 'Tandra Castiglione', 'Lilliam Erikson', 'Robena Mika', 'Jinny Nakada', 'Maris Zahra', 'Sandra Cherniky', 'Kara Baseva', 'Anabi Gorskovsky', 'Dara Khepora', 'Bruna Beline', 'Idani Garina', 'Nessa Gerschiko', 'Vilma Renky', 'Yeksaga Boveli', 'Alyale Rinova'];
    };

    var takeMaleName = function () {
        var index = Math.floor(Math.random() * ploxworld.maleNames.length);
        var name = ploxworld.maleNames[index];
        ploxworld.maleNames.remove(index);
        return name;
    };

    var takeFemaleName = function () {
        var index = Math.floor(Math.random() * ploxworld.femaleNames.length);
        var name = ploxworld.femaleNames[index];
        ploxworld.femaleNames.remove(index);
        return name;
    };

    var relation = function (person1, person2, value) {
        this.person1 = person1;
        this.person2 = person2;
        this.value = value;
    };

    relation.prototype.getOther = function (me) {
        if (this.person1 === me) {
            return this.person2;
        } else {
            return this.person1;
        }
    };

    /**
     *
     * @param name The name is the unique identifier of the person
     * @param isMale
     * @param ship
     * @constructor
     */
    ploxworld.Person = function Person(name, isMale, ship) {

        if (isMale === undefined) {
            isMale = !!Math.round(Math.random());
        }

        if (name === undefined) {
            if (isMale) {
                name = takeMaleName();
            } else {
                name = takeFemaleName();
            }
        }

        this.objectName = name;
        this.isMale = isMale;
        this.relations = new Set();
//        this.decision = ;

        this.ship = ship;
        this.ship.setOwner(this);

        ploxworld.persons.add(this);
    };

    var Person = ploxworld.Person;

    Person.prototype.remove = function () {
        var me = this;

        //remove relations:
        _.forEach(this.relations, function (relation) {
            //XXX test this
            relation.getOther(me).removeRelation(relation);
        });

        ploxworld.persons.remove(this);
        if (this.isMale) {
            ploxworld.maleNames.push(this.objectName);
        } else {
            ploxworld.femaleNames.push(this.objectName);
        }
    };

    Person.prototype.removeRelation = function (relation) {
        this.relations.remove(relation);
    };

    /**
     *
     * @param name
     * @param planet
     * @returns {ploxworld.TradePerson}
     */
    ploxworld.makeTradePerson = function (atPlanet, toPlanet, cargo) {

        var ship = ploxworld.makeShip(atPlanet, cargo);

        return new TradePerson(undefined, undefined, ship, atPlanet, toPlanet);
    };

    ploxworld.TradePerson = function TradePerson(name, isMale, ship, atPlanet, toPlanet) {
        //call makeTradePerson instead of this constructor

        this.fromPlanet = atPlanet;
        this.toPlanet = toPlanet;
        Person.call(this, name, isMale, ship);
    };

    var TradePerson = ploxworld.TradePerson;

    extend(Person, TradePerson);

    TradePerson.prototype.tic = function () {
//        console.log("tradeperson tic");
        var ship = this.ship;
        var position = ship.position;
        //is at planet, make decision!
        if (position.positionType === ploxworld.POSITION_TYPE_PLANET) {
            if (position.planet === this.toPlanet) {
                ship.offload();
                ploxworld.ships.remove(ship);
                this.remove();
            } else {
                //travel to next planet:
                var nextPlanet = position.planet.safeWayTo[this.toPlanet.objectName];
                if (nextPlanet !== undefined) {
                    this.decision = decisionTravelTo(nextPlanet);
                } else {
                    console.log("omg no way to travel");
                    this.toPlanet = this.fromPlanet;
                    nextPlanet = this.position.planet.safeWayTo[this.toPlanet.objectName];
                    if (nextPlanet !== undefined) {
                        console.log("returning home");
                        this.decision = decisionTravelTo(nextPlanet);
                    } else {
                        console.log("forever lost, offloading");
                        ship.offload();
                        ploxworld.ships.remove(ship);
                        this.remove();
                    }
                }
            }
        }
    };

    /**
     * Any undefined parameter is randomized
     * @param name
     * @param isMale
     * @param planet
     * @returns {ploxworld.AiPerson}
     */
    ploxworld.makeAiPerson = function (name, isMale, planet) {

        if (planet === undefined) {
            planet = ploxworld.getRandomPlanet();
        }

        var ship = ploxworld.makeShip(planet);

        return new AiPerson(name, isMale, ship);
    };

    ploxworld.AiPerson = function AiPerson(name, isMale, ship) {
        //call makeAiPerson instead of this constructor

        Person.call(this, name, isMale, ship);
    };

    var AiPerson = ploxworld.AiPerson;

    extend(Person, AiPerson);

    AiPerson.prototype.tic = function() {
        //TODO
        this.decision = decisionWait();
    };

    //the decisions that persons can make, that the ship executes:

    var decisionWait = function () {
        return function (ship) {
//            console.log("wait");
        };
    };

    var decisionTravelTo = function (toPlanet) {
        return function (ship) {
//            console.log("travel to " + toPlanet.objectName);
            ship.position = new ploxworld.Position(ploxworld.POSITION_TYPE_TRAVELING, ship.position.planet, toPlanet);
            ship.travel();
        };
    };

})();