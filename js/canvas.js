(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var NUMBER_TRADEROUTES_FOR_GREEN_LINE = 14;

    var canvasTrade = $("#canvas-trade")[0];
    var contextTrade = canvasTrade.getContext('2d');

    var canvasTravel = $("#canvas-travel")[0];
    var contextTravel = canvasTravel.getContext('2d');

    ploxworld.drawTraderoutes = function () {

        contextTrade.clearRect(0, 0, canvasTrade.width, canvasTrade.height);

        for (var tradeRoutePartKey in ploxworld.traderouteParts) {
            var tradeRoutePart = ploxworld.traderouteParts[tradeRoutePartKey];

            // a bit messy code because I needed '0' to evaluate to '00' etc.
            var percentageOfColor = Math.min(tradeRoutePart.amount / NUMBER_TRADEROUTES_FOR_GREEN_LINE, 1);
            var hexNumber = (255 * percentageOfColor) | 0;
            var redColor = 255 - hexNumber;
            redColor = redColor ? redColor.toString(16) : '00';
            var greenColor = hexNumber;
            greenColor = greenColor ? greenColor.toString(16) : '00';
            var color = '#' + redColor + greenColor + '00';

            contextTrade.beginPath();
            contextTrade.moveTo(tradeRoutePart.fromPlanet.x, tradeRoutePart.fromPlanet.y);
            contextTrade.lineTo(tradeRoutePart.toPlanet.x, tradeRoutePart.toPlanet.y);
            contextTrade.strokeStyle = color;
            contextTrade.stroke();
        }

    };

    ploxworld.drawTravel = function (person, toPlanet) {
        contextTravel.clearRect(0, 0, canvasTravel.width, canvasTravel.height);

        if (person.ship.position.positionType !== ploxworld.POSITION_TYPE_PLANET) {
            return;
        }

        var fromPlanet = person.ship.position.planet;

        //TODO always render the circle
        contextTravel.beginPath();
        contextTravel.arc(person.ship.position.x, person.ship.position.y, person.ship.distance, 0, 2 * Math.PI, false);
//        contextTravel.fillStyle = 'green';
//        contextTravel.fill();
        contextTravel.lineWidth = 1;
        contextTravel.strokeStyle = '#FFFFFF';
        contextTravel.stroke();
        contextTravel.lineWidth = 3;

        var atPlanet = fromPlanet;
        var nextPlanet = atPlanet.getPath(toPlanet, person.ship.distance, undefined);
        contextTravel.beginPath();
        while (nextPlanet) {
            contextTravel.moveTo(atPlanet.x, atPlanet.y);
            contextTravel.lineTo(nextPlanet.x, nextPlanet.y);
            contextTravel.strokeStyle = '#0000FF';

            atPlanet = nextPlanet;
            nextPlanet = atPlanet.getPath(toPlanet, person.ship.distance, undefined);
        }
        contextTravel.stroke();


    };

})();