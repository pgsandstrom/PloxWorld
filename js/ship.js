(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    ploxworld.POSITION_TYPE_PLANET = 1;
    ploxworld.POSITION_TYPE_TRAVELING = 2;

    /**
     *
     * @param positionType One of the POSITION_TYPE_ constants
     * @param planet The current planet, or planet traveling from
     * @param toPlanet The planet traveling towards
     * @constructor
     */
    ploxworld.Position = function Position(positionType, planet, toPlanet) {
//        console.log("position created!");
        this.positionType = positionType;
        this.planet = planet;
        this.toPlanet = toPlanet;
        this.x = planet.x;
        this.y = planet.y;
        if (toPlanet) {
            this.distanceLeft = planet.planetDistance[toPlanet.objectName];
        }
    };

    var Position = ploxworld.Position;

    Position.prototype.travel = function (speed) {
        this.distanceLeft -= speed;

        if (this.distanceLeft <= 0) {
            return true;
        } else {

            //calculate position:
            var xDiff = this.planet.x - this.toPlanet.x;
            var yDiff = this.planet.y - this.toPlanet.y;
            var distance = this.planet.planetDistance[this.toPlanet.objectName];
            var ratio = this.distanceLeft / distance;
            this.x = this.toPlanet.x + xDiff * ratio;
            this.y = this.toPlanet.y + yDiff * ratio;

            return false;
        }
    };

    //super class:
    ploxworld.Ship = function Ship(position, cargo) {
//        console.log("ship constructor");
        this.speed = 30;
        this.health = 5;
        this.attack = 2;
        this.aim = 3;
        this.position = position;
        this.cargo = cargo;

        //this feels kind of haxxy...
        ploxworld.ships.add(this);
    };

    var Ship = ploxworld.Ship;

    Ship.prototype.offload = function() {
        var me = this;
        _.forEach(this.cargo, function (value, key) {
            value.addTo(me.position.planet);
        });
    };

    // define the TradeShip class
    ploxworld.TradeShip = function TradeShip(fromPlanet, toPlanet, cargo) {
//        console.log("tradeship constructor");
        // Call the parent constructor
        var position = new Position(ploxworld.POSITION_TYPE_PLANET, fromPlanet);
        Ship.call(this, position, cargo);

        this.fromPlanet = fromPlanet;
        this.toPlanet = toPlanet;
    };

    var TradeShip = ploxworld.TradeShip;

    //this is the lame way of extending:
//    TradeShip.prototype = new Ship();
//    TradeShip.prototype.constructor = TradeShip;

    //inherit in our cool and awesome way:
    extend(Ship, TradeShip);

    TradeShip.prototype.tic = function () {
//        console.log("ship tic!");
        if (this.position.positionType === ploxworld.POSITION_TYPE_TRAVELING) {
            if (this.position.travel(this.speed)) {
                //arrived!
                this.position = new Position(ploxworld.POSITION_TYPE_PLANET, this.position.toPlanet);
            }
        } else {
            //is at planet, make decision!
            if (this.position.planet === this.toPlanet) {
                this.offload();
                ploxworld.ships.remove(this);
            } else {
                //travel to next planet:
                var nextPlanet = this.position.planet.safeWayTo[this.toPlanet.objectName];
                if (nextPlanet !== undefined) {
                    this.position = new Position(ploxworld.POSITION_TYPE_TRAVELING, this.position.planet, nextPlanet);
                    this.tic(); //this should lead to a "travel tic"
                } else {
                    console.log("omg no way to travel");
                    this.toPlanet = this.fromPlanet;
                    nextPlanet = this.position.planet.safeWayTo[this.toPlanet.objectName];
                    if (nextPlanet !== undefined) {
                        console.log("returning home");
                        this.position = new Position(ploxworld.POSITION_TYPE_TRAVELING, this.position.planet, nextPlanet);
                    } else {
                        console.log("forever lost, offloading");
                        this.offload();
                        ploxworld.ships.remove(this);
                    }
                }
            }
        }
    };

})();