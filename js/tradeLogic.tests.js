describe('tradeLogic', function () {

	var person, planet, resource, amount, penaltyPercent;

	beforeEach(function () {
		planet = new ploxworld.Planet("min planet", 5, 5);
		person = ploxworld.persons.makePlayerPerson("per", true, planet);
		resource = ploxworld.RESOURCE_MATERIAL;
		amount = 5;
		penaltyPercent = 1;
	});

	// tests start here
	describe('transfer', function () {
		it('testa transfer', function () {
			var error;
			try {
				ploxworld.tradeLogic.transaction(person, planet, resource, amount, penaltyPercent);
			} catch (e) {
				error = e;
			}
			expect(error).toEqual("hej");
		});
	});

});