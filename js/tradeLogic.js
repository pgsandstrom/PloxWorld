(function () {
    "use strict";
    var ploxworld = window.ploxworld = window.ploxworld || {};
    ploxworld.tradeLogic = ploxworld.tradeLogic || {};

    /**
     * Positive count means transfer from person to planet.
     * @param person
     * @param planet
     * @param resource
     * @param count
     * @param penaltyPercent
     */
    ploxworld.tradeLogic.transaction = function (person, planet, resource, amount, penaltyPercent) {
        penaltyPercent = penaltyPercent || 1;

        var priceReal = ploxworld.getPriceReal(resource.type, planet);

        var credits = priceReal * amount * penaltyPercent;

        if(amount > 0) {
            if(person.ship.cargo[resource.type].amount < amount) {
                throw "not enough in person cargo";
            }
        } else {
            if(planet[resource.type] < amount) {
                throw "not enough in planet storage";
            }
            if(person.credits < credits) {
                throw "person cant afford to buy";
            }
        }

        planet.addCredits(credits);
        person.addCredits(credits);


    };


})();