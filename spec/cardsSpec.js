const allResources = ["sheep", "wheat", "stone", "clay", "wood"];
const startDeck = {
	"knight": 14,
	"victoryCard": 5,
	"roadBuilding": 2,
	"yearOfPlenty": 2,
	"monopoly": 5
}

var textMap = ["yearOfPlenty", "monopoly", "victoryCard", "roadBuilding", "knight"];

describe("buildItem", () => {
	var body, startVal;
	var sheep, clay, stone, wood, wheat, settlements, cities, vp;
	var elementsToMake = {
		"settlements": 1,
		"cities": 1,
		"vp": 0,
		"output": "",
		"victoryCard": 0,
		"road": "off",
		"army": "off"
	}

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
	var elementsToMake = {
		"output": "",
		"victoryCard": 0,
		"road": "off",
		"army": "off",
		"settlements": 0,
		"cities": 0,
		"vp": 0
	}

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
		"road": "off",
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
	var elementsToMake = {
		"knight": 1,
		"knightsPlayed": 1,
		"army": "off",
		"output": "",
		"victoryCard": 0,
		"road": "off",
		"army": "off",
		"settlements": 0,
		"cities": 0,
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
	var elementsToMake = {
		"settlements": 0,
		"cities": 0,
		"vp": 0,
		"output": "",
		"victoryCard": 0,
		"road": "off",
		"army": "off"
	}

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