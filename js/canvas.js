(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};

    var NUMBER_TRADEROUTES_FOR_GREEN_LINE = 4;

    var canvas = $("#canvas")[0];
    var context = canvas.getContext('2d');

    ploxworld.draw = function () {

        context.clearRect(0, 0, canvas.width, canvas.height);

//        context.moveTo(50, 50);
//        context.lineTo(250, 300);
//
//        context.moveTo(50, 80);
//        context.lineTo(250, 300);

        for (var tradeRoutePartKey in ploxworld.traderouteParts) {
            var tradeRoutePart = ploxworld.traderouteParts[tradeRoutePartKey];
            
            var percentageOfColor = Math.min(tradeRoutePart.amount / NUMBER_TRADEROUTES_FOR_GREEN_LINE, 1);
            var hexNumber = (255 * percentageOfColor) | 0;
            var color = '#' + (255 - hexNumber).toString(16) + (hexNumber).toString(16) + '00';

            context.beginPath();
            context.moveTo(tradeRoutePart.fromPlanet.x, tradeRoutePart.fromPlanet.y);
            context.lineTo(tradeRoutePart.toPlanet.x, tradeRoutePart.toPlanet.y);
            context.strokeStyle = color;
            context.stroke();
//            console.log("color: " + context.strokeStyle);
        }


    };

})();