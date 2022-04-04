const allResources = ["sheep", "wheat", "stone", "clay", "wood"];
const startDeck = {
	"knight": 14,
	"victoryCard": 5,
	"roadBuilding": 2,
	"yearOfPlenty": 2,
	"monopoly": 5
}
const elementsToMake = {
	"sheep": 1,
	"output": "",
	"victoryCard": 0,
	"longestRoad": "off",
	"army": "off",
	"settlements": 1,
	"cities": 1,
	"vp": 3,
	"monopoly": 1,
	"clay": 1,
	"wheat": 1,
	"wood": 1,
	"stone": 1,
	"knight": 1,
	"knightsPlayed": 1,
	"yearOfPlenty": 1
}

var textMap = ["yearOfPlenty", "monopoly", "victoryCard", "roadBuilding", "knight"];

describe("buildItem", () => {
	var body, startVal, sheep, clay, stone, wood, wheat, settlements, cities, vp;

	beforeEach(function(){
		startVal = 5;
		var element;
		body = document.getElementsByTagName("body")[0];
		for (var i = 0; i < allResources.length; i++) {
			element = document.createElement("div");
			element.id = allResources[i];
			element.value = startVal;
			body.appendChild(element);
		}
		
		for (var key in elementsToMake) {
			element = document.createElement("div");
			element.id = key;
			element.value = elementsToMake[key];
			body.appendChild(element);
		}

		sheep = document.getElementById("sheep");
		stone = document.getElementById("stone");
		wheat = document.getElementById("wheat");
		wood = document.getElementById("wood");
		clay = document.getElementById("clay");
		settlements = document.getElementById("settlements");
		vp = document.getElementById("vp");
		cities = document.getElementById("cities");
	});
	
    it("does devCard correctly", () => {
		var devCard = buildItem("devCard", true).recipe.sort();
		expect(devCard).toEqual(["sheep", "stone", "wheat"]);
		expect(sheep.value).toBe(startVal - 1);
		expect(stone.value).toBe(startVal - 1);
		expect(wheat.value).toBe(startVal - 1);
		expect(wood.value).toBe(startVal);
		expect(clay.value).toBe(startVal);
	});
	
	it("does settlement correctly", () => {
		var settlement = buildItem("settlement", true).recipe.sort();
		expect(settlement).toEqual(["clay", "sheep", "wheat",  "wood"]);
		expect(sheep.value).toBe(startVal - 1);
		expect(stone.value).toBe(startVal);
		expect(wheat.value).toBe(startVal - 1);
		expect(wood.value).toBe(startVal - 1);
		expect(clay.value).toBe(startVal - 1);
	});
	
	it("does road correctly", () => {
		var road = buildItem("road", true).recipe.sort();
		expect(road).toEqual(["clay", "wood"]);
		expect(sheep.value).toBe(startVal);
		expect(stone.value).toBe(startVal);
		expect(wheat.value).toBe(startVal);
		expect(wood.value).toBe(startVal - 1);
		expect(clay.value).toBe(startVal - 1);
	});
	
	it("does city correctly", () => {
		var city = buildItem("city", true).recipe.sort();
		expect(city).toEqual(["stone", "stone", "stone", "wheat", "wheat"]);
		expect(sheep.value).toBe(startVal);
		expect(stone.value).toBe(startVal - 3);
		expect(wheat.value).toBe(startVal - 2);
		expect(wood.value).toBe(startVal);
		expect(clay.value).toBe(startVal);
	});
	
	it("does boat correctly", () => {
		var boat = buildItem("boat", true).recipe.sort();
		expect(boat).toEqual(["sheep", "wood"]);	
		expect(sheep.value).toBe(startVal - 1);
		expect(stone.value).toBe(startVal);
		expect(wheat.value).toBe(startVal);
		expect(wood.value).toBe(startVal - 1);
		expect(clay.value).toBe(startVal);
	});
	
	it("cannot build if lacking resources", () => {
		var insufficientVal = 0;
		sheep.value = insufficientVal;
		stone.value = insufficientVal;
		wheat.value = insufficientVal;
		wood.value = insufficientVal;
		clay.value = insufficientVal;
		
		var boat = buildItem("boat", true);
		expect(boat.message.toLowerCase()).toBe("not enough resources.");	
		expect(sheep.value).toBe(insufficientVal);
		expect(stone.value).toBe(insufficientVal);
		expect(wheat.value).toBe(insufficientVal);
		expect(wood.value).toBe(insufficientVal);
		expect(clay.value).toBe(insufficientVal);
	});
	
	afterEach(function(){
		body.removeChild(sheep);
		body.removeChild(stone);
		body.removeChild(wheat);
		body.removeChild(wood);
		body.removeChild(clay);
		for (var key in elementsToMake) {
			body.removeChild(document.getElementById(key));
		}
	});
});

describe("drawDevCard", () => {
	var deck, body;
	
	beforeEach(function(){
		body = document.getElementsByTagName("body")[0];
		deck = {
			"knight": 14,
			"victoryCard": 5,
			"roadBuilding": 2,
			"yearOfPlenty": 2,
			"monopoly": 5
		}
		
		for (var i = 0; i < textMap.length; i++) {
			var element = document.createElement("div");
			element.id = textMap[i];
			element.value = 0;
			body.appendChild(element);
		}
		
		for (var key in elementsToMake) {
			element = document.createElement("div");
			element.id = key;
			element.value = elementsToMake[key];
			body.appendChild(element);
		}
	});
	
    it("is valid option", () => {
		var devCard = drawDevCard(deck);
		expect(devCard.name).toMatch(/(knight|victoryCard|roadBuilding|yearOfPlenty|monopoly)/);
	});
	
	it("removes correct card", () => {
		var devCard = drawDevCard(deck);
		expect(devCard.deck[devCard.name]).toBe(startDeck[devCard.name] - 1);
	});
	
	it("decreases deck size", () => {
		var startDeckSize = 0;
		for (var value of Object.values(deck)) {
			startDeckSize += value;
		}
		
		var devCard = drawDevCard(deck);

		var endDeckSize = 0;
		for (var value of Object.values(devCard.deck)) {
			endDeckSize += value;
		}
		expect(endDeckSize).toBe(startDeckSize - 1);
	});
	
	it("cannot draw when empty", () => {
		deck = {};
		var devCard = drawDevCard(deck);
		
		expect(devCard.message.toLowerCase()).toBe("cannot draw when empty.");
	});
	
	it("increases corresponding field", () => {
		var devCard = drawDevCard(deck);
		for (var i = 0; i < textMap.length; i++) {
			if (textMap[i] == devCard.name) {
				expect(document.getElementById(textMap[i]).value).toBe(1);
			} else {
				expect(document.getElementById(textMap[i]).value).toBe(0);
			}
		}
	});
	
	afterEach(function(){
		for (var i = 0; i < textMap.length; i++) {
			body.removeChild(document.getElementById(textMap[i]));
		}
		for (var key in elementsToMake) {
			body.removeChild(document.getElementById(key));
		}
	});
});

/*
describe("didWin", () => {
	var body, victoryPoints, output;
	
	var elementsToMake = {
		"vp": 0,
		"output": "",
		"victoryCard": 0,
		"longestRoad": "off",
		"army": "off",
		"settlements": 0,
		"cities" 0,
		"vp": 0
	}

	beforeEach(function(){
		body = document.getElementsByTagName("body")[0];
		
		for (var key in elementsToMake) {
			element = document.createElement("div");
			element.id = key;
			element.value = elementsToMake[key];
			body.appendChild(element);
		}
		
		victoryPoints = document.getElementById("vp");
	});
	
    it("takes ten to win", () => {
		victoryPoints.value = 9;
		var gameWon = didWin();
		expect(gameWon).toBe(false);
		
		victoryPoints.value = 2;
		var gameWon = didWin();
		expect(gameWon).toBe(false);
		
		victoryPoints.value = 10;
		var gameWon = didWin();
		expect(gameWon).toBe(true);
		
		victoryPoints.value = 11;
		var gameWon = didWin();
		expect(gameWon).toBe(true);
	});
	
	afterEach(function(){
		for (var key in elementsToMake) {
			body.removeChild(document.getElementById(key));
		}
	});
});
*/

describe("knightsPlayed", () => {
	var body, victoryPoints, knights, knightsPlayed, largestArmy;
	
	beforeEach(function(){
		body = document.getElementsByTagName("body")[0];
		
		console.log(elementsToMake);
		for (var key in elementsToMake) {
			element = document.createElement("div");
			element.id = key;
			element.value = elementsToMake[key];
			body.appendChild(element);
		}
		
		largestArmy = document.getElementById("army");
		knights = document.getElementById("knight");
		knightsPlayed = document.getElementById("knightsPlayed");	
	});
	
    it("subtracts knights from inventory", () => {
		var beforeValue = parseInt(knights.value);
		useKnight(true);
		expect(parseInt(knights.value)).toBe(beforeValue - 1);
	});
	
	it("adds knights to played knights total", () => {
		var beforeValue = parseInt(knightsPlayed.value);
		useKnight(true);
		expect(parseInt(knightsPlayed.value)).toBe(beforeValue + 1);
	});
	
	it("offers largest army when 3 knights played", () => {
		knights.value = 2;
		knightsPlayed.value = 1;
		
		used = useKnight(true);
		expect(used.message.toLowerCase()).toEqual("knight played.");
		expect(parseInt(knightsPlayed.value)).toBeLessThan(3);
				
		used = useKnight(true);
		expect(used.message.toLowerCase()).toEqual("largest army prompted.");
		expect(parseInt(knightsPlayed.value)).toBeGreaterThanOrEqual(3);
	});
	
	it("sets largest army when offered and confirmed", () => {
		knights.value = 2;
		knightsPlayed.value = 2;
		
		used = useKnight(true, true);
		expect(used.message.toLowerCase()).toEqual("largest army prompted.");
		expect(army.value.toLowerCase()).toEqual("on");
	});
	
	it("does not set largest army when offered and denied", () => {
		knights.value = 2;
		knightsPlayed.value = 2;
		
		used = useKnight(true, false);
		expect(used.message.toLowerCase()).toEqual("largest army prompted.");
		expect(army.value.toLowerCase()).toEqual("off");
	});
	
	it("when largest army owned, no longer prompts", () => {
		knights.value = 2;
		knightsPlayed.value = 2;
		
		var used = useKnight(true, true);
		expect(used.message.toLowerCase()).toEqual("largest army prompted.");
		
		used = useKnight(true);
		expect(used.message.toLowerCase()).toEqual("knight played.");
	});
	
	it("when largest army not owned, continues to prompt", () => {
		knights.value = 2;
		knightsPlayed.value = 2;
		
		var used = useKnight(true, false);
		expect(used.message.toLowerCase()).toEqual("largest army prompted.");
		
		used = useKnight(true);
		expect(used.message.toLowerCase()).toEqual("largest army prompted.");
	});
	
	it("cannot play knight when out of knights", () => {
		knights.value = 0;
		var beforeKnights = parseInt(knights.value);
		var beforeKnightsPlayed = parseInt(knightsPlayed.value);
		
		var used = useKnight(true);
		expect(used.message.toLowerCase()).toEqual("no knights to play.");
		expect(parseInt(knightsPlayed.value)).toBe(beforeKnightsPlayed);
		expect(parseInt(knights.value)).toBe(beforeKnights);
	});
	
	afterEach(function(){
		for (var key in elementsToMake) {
			body.removeChild(document.getElementById(key));
		}	
	});
});

describe("buildSettlement and buildCity", () => {
	var body, settlements, cities, victoryPoints;

	beforeEach(function(){
		body = document.getElementsByTagName("body")[0];
		
		for (var key in elementsToMake) {
			element = document.createElement("div");
			element.id = key;
			element.value = elementsToMake[key];
			body.appendChild(element);
		}
		
		victoryPoints = document.getElementById("vp")
		cities = document.getElementById("cities");
		settlements = document.getElementById("settlements");
	});
	
    it("adds a settlement when settlement built", () => {
		var sBeforeVal = parseInt(settlements.value);
		var cBeforeVal = parseInt(cities.value);
		
		var response = buildSettlement();
		expect(response.message.toLowerCase()).toEqual("settlement placed.");
		expect(parseInt(settlements.value)).toBe(sBeforeVal + 1);
		expect(parseInt(cities.value)).toBe(cBeforeVal);
	});
	
	it("adds a city when city built, subtracts settlement", () => {
		settlements.value = 1;
		
		var sBeforeVal = parseInt(settlements.value);
		var cBeforeVal = parseInt(cities.value);
		
		var response = buildCity();
		expect(response.message.toLowerCase()).toEqual("city placed.");
		expect(parseInt(settlements.value)).toBe(sBeforeVal - 1);
		expect(parseInt(cities.value)).toBe(cBeforeVal + 1);
	});
	
	it("cannot build city when no settlements to replace", () => {
		settlements.value = 0;
		
		var sBeforeVal = parseInt(settlements.value);
		var cBeforeVal = parseInt(cities.value);
		
		var response = buildCity();
		expect(response.message.toLowerCase()).toEqual("no settlements to replace.");
		expect(parseInt(settlements.value)).toBe(sBeforeVal);
		expect(parseInt(cities.value)).toBe(cBeforeVal);
	});
	
	it("cannot build settlement when out of settlements", () => {	
		settlements.value = 5;
	
		var sBeforeVal = parseInt(settlements.value);
		var cBeforeVal = parseInt(cities.value);
		
		var response = buildSettlement();
		expect(response.message.toLowerCase()).toEqual("max settlements reached.");
		expect(parseInt(settlements.value)).toBe(sBeforeVal);
		expect(parseInt(cities.value)).toBe(cBeforeVal);
	});
	
	it("cannot build city when out of cities", () => {	
		settlements.value = 1;
		cities.value = 4;

		var sBeforeVal = parseInt(settlements.value);
		var cBeforeVal = parseInt(cities.value);
		
		var response = buildCity();
		expect(response.message.toLowerCase()).toEqual("max cities reached.");
		expect(parseInt(settlements.value)).toBe(sBeforeVal);
		expect(parseInt(cities.value)).toBe(cBeforeVal);
	});
	
	it("it adds VP when settlement built", () => {	
		settlements.value = 3;
		calcVPNum();
	
		var before = parseInt(victoryPoints.value);
		
		var response = buildSettlement();
		expect(response.message.toLowerCase()).toEqual("settlement placed.");
		expect(parseInt(victoryPoints.value)).toBe(before + 1);
		
		var response = buildSettlement();
		expect(response.message.toLowerCase()).toEqual("settlement placed.");
		expect(parseInt(victoryPoints.value)).toBe(before + 2);
		
		var response = buildSettlement();
		expect(response.message.toLowerCase()).toEqual("max settlements reached.");
		expect(parseInt(victoryPoints.value)).toBe(before + 2);
	});
	
	it("it adds VP when settlement built", () => {	
		settlements.value = 3;
		cities.value = 2;
		
		calcVPNum();
		var before = parseInt(victoryPoints.value);
		
		var response = buildCity();
		expect(response.message.toLowerCase()).toEqual("city placed.");
		expect(parseInt(victoryPoints.value)).toBe(before + 1);
		
		var response = buildCity();
		expect(response.message.toLowerCase()).toEqual("city placed.");
		expect(parseInt(victoryPoints.value)).toBe(before + 2);
		
		var response = buildCity();
		expect(response.message.toLowerCase()).toEqual("max cities reached.");
		expect(parseInt(victoryPoints.value)).toBe(before + 2);
	});
		
	
	afterEach(function(){
		for (var key in elementsToMake) {
			body.removeChild(document.getElementById(key));
		}
	});
});

describe("playMonopoly", () => {
	var body, monopolyCards, sheep, clay, stone, wood, wheat;

	beforeEach(function(){
		var element;
		body = document.getElementsByTagName("body")[0];

		for (var key in elementsToMake) {
			element = document.createElement("div");
			element.id = key;
			element.value = elementsToMake[key];
			body.appendChild(element);
		}

		sheep = document.getElementById("sheep");
		stone = document.getElementById("stone");
		wheat = document.getElementById("wheat");
		wood = document.getElementById("wood");
		clay = document.getElementById("clay");
		monopolyCards = document.getElementById("monopoly");
		if (document.getElementById("promptScreen") != null) {
			body.removeChild(document.getElementById("promptScreen"));
		}
	});
	
	it("removes a monopoly from inventory", () => {
		var beforeValue = parseInt(monopolyCards.value);
		
		var selectPromptSpy = spyOn(window, 'promptResourceChoice').and.callThrough();
		var selectSpy = spyOn(window, 'getResourceOptionsSelection').and.returnValue({ resource: "sheep" });
		var numberPromptSpy = spyOn(window, 'promptNumberStolen').and.callThrough();
		var numberSpy = spyOn(window, 'submitNumberStolen').and.returnValue({ number: 5 });
		
		playMonopoly(true);
		expect(parseInt(monopolyCards.value)).toBe(beforeValue - 1);
	});
	
	it("calls all associated methods", () => {
		var selectPromptSpy = spyOn(window, 'promptResourceChoice').and.callThrough();
		var selectSpy = spyOn(window, 'getResourceOptionsSelection').and.returnValue({ resource: "sheep" });
		var numberPromptSpy = spyOn(window, 'promptNumberStolen').and.callThrough();
		var numberSpy = spyOn(window, 'submitNumberStolen').and.returnValue({ number: 5 });
		
		playMonopoly();
		
		expect(selectPromptSpy).toHaveBeenCalled();
		expect(selectSpy).toHaveBeenCalled();
		expect(numberPromptSpy).toHaveBeenCalled();
		expect(numberSpy).toHaveBeenCalled();
	});
	
	it("logs and increases proper val", () => {
		var beforeVal = parseInt(sheep.value);
		var stealVal = 5;
		
		var selectPromptSpy = spyOn(window, 'promptResourceChoice').and.callThrough();
		var selectSpy = spyOn(window, 'getResourceOptionsSelection').and.returnValue({ resource: "sheep" });
		var numberPromptSpy = spyOn(window, 'promptNumberStolen').and.callThrough();
		var numberSpy = spyOn(window, 'submitNumberStolen').and.returnValue({ number: 5 });
		
		var response = playMonopoly();
		
		expect(response.message.toLowerCase()).toEqual("monopoly card played.");
		expect(parseInt(sheep.value)).toBe(beforeVal + stealVal);
	});
	
	it("cannot be played when none in inventory", () => {
		var selectPromptSpy = spyOn(window, 'promptResourceChoice').and.callThrough();
		var selectSpy = spyOn(window, 'getResourceOptionsSelection').and.returnValue({ resource: "sheep" });
		var numberPromptSpy = spyOn(window, 'promptNumberStolen').and.callThrough();
		var numberSpy = spyOn(window, 'submitNumberStolen').and.returnValue({ number: 5 });
		
		document.getElementById("monopoly").value = 0;
		
		var response = playMonopoly();
		expect(response.message.toLowerCase()).toEqual("no monopoly cards to play.");
		
		expect(selectPromptSpy).not.toHaveBeenCalled();
		expect(selectSpy).not.toHaveBeenCalled();
		expect(numberPromptSpy).not.toHaveBeenCalled();
		expect(numberSpy).not.toHaveBeenCalled();
	});
	
	it("prompt screen appears and has correct options", () => {
		var promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).toEqual(null);
		promptResourceChoice();
		promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).not.toEqual(null);
		
		for (var i = 0; i < allResources.length; i++) {
			var foundElement = document.getElementById(allResources[i] + "Option");
			expect(foundElement).not.toEqual(null);
			expect(foundElement.tagName.toLowerCase()).toEqual("input");
			expect(foundElement.type.toLowerCase()).toEqual("radio");
			expect(foundElement.name).toEqual("resourceOptions");
			
			if (allResources[i] == "sheep") {
				expect(foundElement.checked).toBe(true); // sheep is default
			}
		}
		expect(promptScreen.children.length).toBe(allResources.length + 1);
	});
	
	it("prompt screen selection defaults to sheep, removes prompt screen", () => {
		promptResourceChoice();
		var response = getResourceOptionsSelection(); // asks for sheep by default
		
		var promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).toEqual(null);
		expect(response.resource).toEqual("sheep");
	});
	
	it("number stolen screen pre-fills with selected val", () => {
		var promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).toEqual(null);
		promptNumberStolen("sheep");
		promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).not.toEqual(null);
		expect(document.getElementById("promptTitle").innerHTML).toMatch(/.*sheep.*/);
		
		
	});
	
	it("submit number stolen gets correct value", () => {
		promptNumberStolen("sheep");
		var promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).not.toEqual(null);
		document.getElementById("numberStolenVal").value = 3;
		var number = submitNumberStolen().number;
		expect(number).toBe(3);
		promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).toEqual(null);
	});
	
	it("number stolen cannot be negative", () => {
		var beforeVal = parseInt(sheep.value);
		promptNumberStolen("sheep");
		var promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).not.toEqual(null);
		document.getElementById("numberStolenVal").value = -1;
		var response = submitNumberStolen();
		expect(sheep.value).toBe(beforeVal);
		expect(promptScreen).not.toEqual(null);
		expect(response.message.toLowerCase()).toEqual("cannot steal negative resources.");
	});
	
	afterEach(function(){
		for (var key in elementsToMake) {
			body.removeChild(document.getElementById(key));
		}	
		if (document.getElementById("promptScreen") != null) {
			body.removeChild(document.getElementById("promptScreen"));
		}
	});
});

describe("playYearOfPlenty", () => {
	var body, yearOfPlentyCards, sheep, clay, stone, wood, wheat;

	beforeEach(function(){
		var element;
		body = document.getElementsByTagName("body")[0];

		for (var key in elementsToMake) {
			element = document.createElement("div");
			element.id = key;
			element.value = elementsToMake[key];
			body.appendChild(element);
		}

		sheep = document.getElementById("sheep");
		stone = document.getElementById("stone");
		wheat = document.getElementById("wheat");
		wood = document.getElementById("wood");
		clay = document.getElementById("clay");
		yearOfPlentyCards = document.getElementById("yearOfPlenty");
	});
	
	it("removes a year of plenty from inventory", () => {
		var beforeValue = parseInt(yearOfPlentyCards.value);
		playYearOfPlenty();
		expect(parseInt(yearOfPlentyCards.value)).toBe(beforeValue - 1);
	});
	
	it("calls all associated methods", () => {
		var promptSpy = spyOn(window, 'promptPlentyResources').and.callThrough();
		var submitSpy = spyOn(window, 'submitPlentyResources').and.returnValue(["sheep", "stone"]);
		
		var response = playYearOfPlenty();
		
		expect(prompSpy).toHaveBeenCalled();
		expect(submitSpy).toHaveBeenCalled();
	});
	
	it("logs and increases proper val", () => {
		var selections = ["sheep", "stone"];
		var promptSpy = spyOn(window, 'promptPlentyResources').and.callThrough();
		var submitSpy = spyOn(window, 'submitPlentyResources').and.returnValue(selections);
		
		var response = playYearOfPlenty();
		
		expect(response.resources).toEqual(selections);
		expect(response.message).toEqual("year of plenty played.");
		
		for (var i = 0; i < allResources.length; i++) {
			if (selections.includes(allResources[i])) {
				expect(document.getElementById(allResources[i])).toBe(elementsToMake[allResources[i]] + 1);
			} else {
				expect(document.getElementById(allResources[i])).toBe(elementsToMake[allResources[i]]);
			}
		}
	});
	
	it("cannot be played when none in inventory", () => {
		var selections = ["sheep", "stone"];
		var promptSpy = spyOn(window, 'promptPlentyResources').and.callThrough();
		var submitSpy = spyOn(window, 'submitPlentyResources').and.returnValue(selections);
		
		var response = playYearOfPlenty();
		
		expect(response.message).toEqual("no year of plenty cards to play.");
		expect(prompSpy).not.toHaveBeenCalled();
		expect(submitSpy).not.toHaveBeenCalled();
		
		for (var i = 0; i < allResources.length; i++) {
			expect(document.getElementById(allResources[i])).toBe(elementsToMake[allResources[i]]);
		}
	});
	
	it("prompt screen appears and has correct options", () => {
		var promptScreen = document.getElementById("promptScreen");
		expect(promptScreen).toEqual(null);
		promptPlentyResources();
		promptScreen = document.getElementById("promptScreen");
		exepct(promptScreen).not.toEqual(null);
		
		for (var i = 0; i < allResources.length; i++) {
			var first = document.getElementById("first");
			expect(first).not.toEqual(null);
			expect(first.tagName).toEqual("select");
			
			for (var j = 0; j < first.children; j++) {
				expect(allResources.includes(first[j].value)).toBe(true);
				expect(foundElement.children[j].tagName).toEqual("option");
				if (first[j].value == "sheep") {
					expect(first[j].selected).toEqual("selected"); // sheep is default
				}	
			}	

			var second = document.getElementById("second");
			expect(second).not.toEqual(null);
			expect(second.tagName).toEqual("select");
			
			for (var j = 0; j < second.children; j++) {
				expect(allResources.includes(second[j].value)).toBe(true);
				expect(foundElement.children[j].tagName).toEqual("option");
				if (second[j].value == "sheep") {
					expect(second[j].selected).toEqual("selected"); // sheep is default
				}	
			}	

			expect(first.children.length).toBe(allResources.length);
			expect(second.children.length).toBe(allResources.length);						
		}
	});
	
	it("prompt screen selection defaults to sheep, removes prompt screen", () => {
		promptPlentyResources();
		var response = submitPlentyResources(); // asks for sheep by default
		
		var promptScreen = document.getElementById("promptScreen");
		exepct(promptScreen).toEqual(null);
		expect(response.resources).toEqual(["sheep", "sheep"]);
	});
	
	afterEach(function(){
		for (var key in elementsToMake) {
			body.removeChild(document.getElementById(key));
		}	
	});
});
