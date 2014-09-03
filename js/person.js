(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.resetPersonNamePool = function () {
        ploxworld.maleNames = ['Jakob Lind', 'Mikael Emilsson', 'Per Sandström', 'Jacob Rask', 'Hoyt Tyrrell', 'Avery Koerner', 'Maxwell Avison', 'Britt Wakeman', 'Porter Jackstadt', 'Damien Severt', 'Nolan Alers', 'Harlan Ducote', 'Thaddeus Sanghvi', 'Gavin Gulsvig', 'Craige Lera', 'Carly Jones', 'Jery Rownez', 'Richua Brobarn', 'Phawne Breson', 'Billie Mitchy', 'Gary Flewill', 'Roldy Rezal', 'Randy Theson', 'Edwam Thallee', 'Malcolm McCree', 'Silas Lloyd', 'Thaddeus Clark', 'Gabriel Law', 'Morris McNevin', 'Nelson Clarke', 'Harland Anderson', 'Bailey Cox', 'Rufus Hunter', 'Woodrow Wilson', 'Edison Gammon', 'Chet Zephyr', 'Scotty Vanlaere', 'Walton Sharpey', 'Darius Chalet', 'Damien Holtz', 'Broderick Zahra', 'Edison Cayne', 'Darius Paulsen', 'Rory Alder', 'Vyna Ecken', 'Tarsi Javand', 'Iakaf Berand', 'Kesi Andar', 'Rharo Tillie', 'Rix Avar', 'Vyna Melne', 'Nej Hamne', 'Hoan Horne', 'Eucer Yougher', 'Jackenn Lopet', 'Juanio Coopow', 'Tephy Griffin', 'Denne Aller', 'Ronio Lore', 'Shawne Gerson', 'Dave Brobarn', 'Jamy Reeders', 'Randy Perra'];
        ploxworld.femaleNames = ['Anna Gillner', 'Kimby Bennes', 'Annies Kere', 'Dianie Leray', 'Dithy Dera', 'Terea Liamson', 'Mara Nelson', 'Kara Scarte', 'Stinie Ampbes', 'Kathy Belley', 'Jeana Pere', 'Lille Carte', 'Joana Ampbes', 'Arthah Jonez', 'Erlyn Campbak', 'Jeana Perray', 'Irgis Jackson', 'Chelle Hellee', 'Janie Helly', 'Licia Pete', 'Verly', 'Henders', 'Dorie Wisand', 'Jane Hillee', 'Margel Hezal', '', 'ana Wisimm', 'Margin Morray', 'Kathly Wooder', 'Louise Willey', 'Mely Garce', 'Margin Coopark', 'Athen Derson', 'Diana Helly', 'Donne Woodiaz', 'Coley Warders', 'Kathy Tayly', 'Loria Parkell', 'Enen Clexand', 'Betty Parker', 'Lora Sterson', 'Mela Milley', 'Elin Carte', 'Amira Severt', 'Lael Yueh', 'Collene Breton', 'Charlena Harcrow', 'Laree Holbach', 'Tandra Castiglione', 'Lilliam Erikson', 'Robena Mika', 'Jinny Nakada', 'Maris Zahra', 'Sandra Cherniky', 'Kara Baseva', 'Anabi Gorskovsky', 'Dara Khepora', 'Bruna Beline', 'Idani Garina', 'Nessa Gerschiko', 'Vilma Renky', 'Yeksaga Boveli', 'Alyale Rinova'];
    };

    var takeMaleName = function () {
        return ploxworld.maleNames.takeRandom();
    };

    var takeFemaleName = function () {
        return ploxworld.femaleNames.takeRandom();
    };

    var Relation = function (person1, person2, value) {
        this.person1 = person1;
        this.person2 = person2;
        if (!value) {
            //TODO används min seed-random?
            value = _.random(-100, 100);
        }
        this.value = value;
    };

    Relation.prototype.getOther = function (me) {
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

        this.decision = undefined;
        this.shipOrder = undefined;

        this.name = name;
        this.isMale = isMale;
        this.relations = new Map(); // person -> Relation

        this.ship = ship;
        this.ship.setOwner(this);

        this.credit = 0;

        ploxworld.personsAll.add(this);
    };

    var Person = ploxworld.Person;

    Person.prototype.addCredits = function (credits) {
        //XXX temp
        if (!$.isNumeric(credits)) {
            console.log("error credits: " + credits);
            throw new Error();
        }
        this.credit += credits;
    };

    Person.prototype.removeCredits = function (credits) {
        //TODO kan vi ta bort denn?
        //XXX temp
        if (!$.isNumeric(credits)) {
            console.log("error credits: " + credits);
            throw new Error();
        }
        this.credit -= credits;
    };

    Person.prototype.remove = function () {
        var me = this;

        //remove relations:
        _.forEach(this.relations, function (relation) {
            //XXX test this
            relation.getOther(me).removeRelation(me);
        });

        ploxworld.persons.remove(this);
        ploxworld.personsAll.remove(this);
        if (this.isMale) {
            ploxworld.maleNames.push(this.name);
        } else {
            ploxworld.femaleNames.push(this.name);
        }
    };

    Person.prototype.createRelation = function (person, randomizeRelations) {
        if (this.relations.get(person)) {
            throw new Error("wtf relation already existed");
        }
        if (this === person) {
            throw new Error("wtf relation to myself?");
        }

        var relation;
        if (randomizeRelations) {
            relation = new Relation(this, person);
        } else {
            relation = new Relation(this, person, 0);
        }

        this.addRelation(relation);
        person.addRelation(relation);

        return relation;
    };

    Person.prototype.addRelation = function (relation) {
        this.relations.add(relation.getOther(this), relation);
    };

    Person.prototype.getRelation = function (person) {
        this.relations.get(person);
    };

    Person.prototype.removeRelation = function (person) {
        this.relations.remove(person);
    };

    Person.prototype.isAtPlanet = function () {
        return this.ship.position.positionType === ploxworld.POSITION_TYPE_PLANET;
    };

    Person.prototype.getPlanet = function () {
        return this.ship.getPlanet();
    };

    /**
     *
     * @param name
     * @param planet
     * @returns {TradePerson}
     */
    ploxworld.makeTradePerson = function (atPlanet, toPlanet, cargo) {

        var ship = ploxworld.makeShipTrade(atPlanet, cargo);

        return new TradePerson(undefined, undefined, ship, atPlanet, toPlanet);
    };

    var TradePerson = function TradePerson(name, isMale, ship, atPlanet, toPlanet) {
        this.fromPlanet = atPlanet;
        this.toPlanet = toPlanet;
        Person.call(this, name, isMale, ship);
        this.decision = tradePersonDecision;
    };

    extend(Person, TradePerson);

    TradePerson.prototype.remove = function () {
        this.fromPlanet.addCredits(this.credit);
        this.credit = 0;
        Person.prototype.remove.call(this);
    };

    TradePerson.prototype.tic = function () {
        //we never make new decisions
        this.decision.tic(this);
    };

    var tradePersonDecision = {
        tic: function (person) {
            var ship = person.ship;
            var position = ship.position;
            //is at planet, make decision!
            if (position.positionType === ploxworld.POSITION_TYPE_PLANET) {
                if (position.planet === person.toPlanet) {
                    person.sellCargo(false);
                    ploxworld.ships.remove(ship);
                    person.remove();
                } else {
                    //travel to next planet:
//                var nextPlanet = position.planet.safeWayTo[person.toPlanet.name];
                    var nextPlanet = position.planet.getPath(person.toPlanet, ship.distance, person.fromPlanet.empire);
                    if (nextPlanet !== undefined) {
//                    person.decision = decisionTravelTo(person, nextPlanet);
                        person.shipOrder = shipOrderTravelTo(person, nextPlanet);
                    } else {
                        console.log("omg no way to travel");
                        person.toPlanet = person.fromPlanet;
                        nextPlanet = position.planet.getPath(person.toPlanet, ship.distance, person.fromPlanet.empire);
                        if (nextPlanet !== undefined) {
                            console.log("returning home");
//                        person.decision = decisionTravelTo(person, nextPlanet);
                            person.shipOrder = shipOrderTravelTo(person, nextPlanet);
                        } else {
                            console.log("forever lost, offloading");
                            person.sellCargo(true);
                            ploxworld.ships.remove(ship);
                            person.remove();
                        }
                    }
                }
            }
        }
    };

    /**
     *
     * @param forced If the ship was forced to offload, maybe because it cannot reach the goal (thus is paid less).
     */
    TradePerson.prototype.sellCargo = function (forced) {
        var me = this;
        var credits = 0;

        _.forEach(this.ship.cargo, function (resource) {
            credits += ploxworld.getPriceReal(resource.type, me.fromPlanet) * resource.amount;
        });

        if (forced) {
            credits = ( credits / 2) | 0;
        }
        this.ship.position.planet.removeCredits(credits);
        this.addCredits(credits);

        this.ship.offloadAll();
    };

    /**
     *
     * @param name Randomized if undefined
     * @param isMale Randomized if undefined
     * @param planet Randomized if undefined
     * @returns {AiPerson}
     */
    ploxworld.makeAiPerson = function (name, isMale, planet) {

        if (planet === undefined) {
            planet = ploxworld.getRandomPlanet();
        }

        var ship = ploxworld.makeShip(planet, undefined, ploxworld.SHIP_SPRITE_AI);

        return new AiPerson(false, name, isMale, ship);
    };

    ploxworld.makePlayerPerson = function (name, isMale, planet) {
        var ship = ploxworld.makeShip(planet, undefined, ploxworld.SHIP_SPRITE_PLAYER);
        return new AiPerson(true, name, isMale, ship);
    };

    var AiPerson = function AiPerson(playerControlled, name, isMale, ship) {
        //TODO maybe not call it "aiPerson"?

        this.playerControlled = playerControlled;
        this.planet = undefined; //which planet he owns
        this.empire = undefined; //which empire he owns

        Person.call(this, name, isMale, ship);

        ploxworld.persons.add(this);
    };

    extend(Person, AiPerson);

    AiPerson.prototype.setPlanet = function (planet) {
        this.planet = planet;
    };

    AiPerson.prototype.setEmpire = function (empire) {
        this.empire = empire;
    };

    AiPerson.prototype.tic = function () {
        if (this.playerControlled) {
            //TODO just use whatever was set by the user :)

            if (!this.shipOrder) {
                this.shipOrder = shipOrderWait();
            }

            if (this.decision) {
                this.decision.tic();
            }
        } else {
            if (!this.decision) {
                //TODO make a real decision, call decision the last thing u do in this method, and dont set shipOrder here
                if (!this.shipOrder) {
                    this.shipOrder = shipOrderWait();
                }
            }
        }
//        this.decision.tic();
    };

    AiPerson.prototype.travelTo = function (planet) {
        this.decision = decisionTravelTo(this, planet);
    };

    //the persons decision:
    var decisionTravelTo = function decisionTravelTo(person, toPlanet) {
        return {
            tic: function () {
                var ship = person.ship;
                if (ship.position.positionType !== ploxworld.POSITION_TYPE_PLANET) {
                    return;
                }

                if (ship.position.planet === toPlanet) {
                    //omg we have arrived, clear decision!
                    person.decision = undefined;
                    return;
                }

                var nextPlanet = ship.position.planet.getPath(toPlanet, ship.distance, undefined);
                person.shipOrder = shipOrderTravelTo(person, nextPlanet);
            },

            toString: function () {
                return "Journeying to " + toPlanet.name;
            }
        };
    };

    //the ships order:
    var shipOrderWait = function shipOrderWait() {
        return {
            tic: function (ship) {
            },

            toString: function () {
                return "Waiting";
            }
        };
    };

    var shipOrderTravelTo = function shipOrderTravelTo(person, toPlanet) {
//        console.log("shipOrderTravelTo: " + toPlanet.name);
        return {
            tic: function (ship) {
//            console.log("travel to " + toPlanet.name + " with " + ship);
                ship.position = new ploxworld.Position(ploxworld.POSITION_TYPE_TRAVELING, ship.position.planet, toPlanet);
                if (ship.travel()) {
                    //TODO move shipOrder to ship.js?
                    person.shipOrder = undefined;
//                console.log("we have arrived!");
                    person.decision.tic();
                }

            },

            toString: function () {
                return "Traveling to " + toPlanet.name;
            }
        };
    };

})();