(function () {
	"use strict";
	var ploxworld = window.ploxworld = window.ploxworld || {};

	ploxworld.TRADE_SHIP_DISTANCE = 250;

	ploxworld.SHIP_SPRITE_TRADE = "ship_trade";
	ploxworld.SHIP_SPRITE_AI = "ship_ai";
	ploxworld.SHIP_SPRITE_PLAYER = "ship_player";

	ploxworld.POSITION_TYPE_PLANET = 1;
	ploxworld.POSITION_TYPE_TRAVELING = 2;

	/**
	 * The position of a ship
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
			this.distanceLeft = planet.planetDistance[toPlanet.name];
		}
	};

	var Position = ploxworld.Position;

	/**
	 *
	 * @param speed
	 * @returns {boolean} True if we arrived at our target
	 */
	Position.prototype.travel = function (speed) {
		this.distanceLeft -= speed;

		if (this.distanceLeft <= 0) {
			return true;
		} else {

			//calculate position:
			var xDiff = this.planet.x - this.toPlanet.x;
			var yDiff = this.planet.y - this.toPlanet.y;
			var distance = this.planet.planetDistance[this.toPlanet.name];
			var ratio = this.distanceLeft / distance;
			this.x = this.toPlanet.x + xDiff * ratio;
			this.y = this.toPlanet.y + yDiff * ratio;

			return false;
		}
	};

	Position.prototype.getPlanet = function () {
		if (this.positionType === ploxworld.POSITION_TYPE_PLANET) {
			return this.planet;
		} else {
			return undefined;
		}
	};

	ploxworld.makeShip = function (planet, cargo, sprite) {
		if (planet === undefined) {
			planet = ploxworld.getRandomPlanet();
		}
		if (cargo === undefined) {
			cargo = {};
		}

		return new Ship(planet, cargo, sprite, 200);
	};

	ploxworld.makeShipTrade = function (planet, cargo) {
		if (planet === undefined) {
			planet = ploxworld.getRandomPlanet();
		}
		if (cargo === undefined) {
			cargo = {};
		}

		return new Ship(planet, cargo, ploxworld.SHIP_SPRITE_TRADE, ploxworld.TRADE_SHIP_DISTANCE);
	};

	var Ship = function Ship(planet, cargo, sprite, distance) {
		//call makeShip instead of this constructor
		this.speed = 30;
		this.distance = distance;
		this.health = 5;
		this.attack = 2;
		this.aim = 3;
		this.position = new Position(ploxworld.POSITION_TYPE_PLANET, planet, undefined);
		this.cargo = cargo; //resourceName -> resource-object
		this.imageName = sprite;

		//this feels kind of haxxy...
		ploxworld.ships.add(this);
	};

	Ship.prototype.getCargoCount = function (resourceName) {
		if (this.cargo[resourceName] !== undefined) {
			return this.cargo[resourceName].amount;
		} else {
			return 0;
		}
	};

	Ship.prototype.getImageName = function () {
		return this.imageName;
	};

	Ship.prototype.setOwner = function (owner) {
		this.owner = owner;
	};

	Ship.prototype.offloadAll = function () {
		if (this.position.positionType !== ploxworld.POSITION_TYPE_PLANET) {
			throw new Error("offloadAll when not at planet");
		}

		var me = this;
		_.forEach(this.cargo, function (resource) {
			resource.addTo(me.position.planet);
		});
		this.cargo = {};
	};

	Ship.prototype.tic = function () {
		if (this.position.positionType === ploxworld.POSITION_TYPE_TRAVELING) {
			if (this.travel()) {
				//our traveling is done, remove the order.
				this.owner.shipOrder = undefined;
			}
		} else {
			this.owner.shipOrder.tic(this);
		}
	};

	/**
	 *
	 * @returns {boolean} True if we arrived at our target
	 */
	Ship.prototype.travel = function () {
		if (this.position.travel(this.speed)) {
			//arrived!
//            console.log("ship travel arrived");
			this.position = new Position(ploxworld.POSITION_TYPE_PLANET, this.position.toPlanet);
			return true;
		}
		return false;
	};

	Ship.prototype.getPlanet = function () {
		return this.position.getPlanet();
	}

})();