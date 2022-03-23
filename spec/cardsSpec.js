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
	var sheep, clay, stone, wood, wheat;

	beforeEach(function(){
		startVal = 5;
		body = document.getElementsByTagName("body")[0];
		for (var i = 0; i < allResources.length; i++) {
			var element = document.createElement("div");
			element.id = allResources[i];
			element.value = startVal;
			body.appendChild(element);
		}
		sheep = document.getElementById("sheep");
		stone = document.getElementById("stone");
		wheat = document.getElementById("wheat");
		wood = document.getElementById("wood");
		clay = document.getElementById("clay");
	});
	
    it("does devCard correctly", () => {
		var devCard = buildItem("devCard", true).sort();
		expect(devCard).toEqual(["sheep", "stone", "wheat"]);
		expect(sheep.value).toBe(startVal - 1);
		expect(stone.value).toBe(startVal - 1);
		expect(wheat.value).toBe(startVal - 1);
		expect(wood.value).toBe(startVal);
		expect(clay.value).toBe(startVal);
	});
	
	it("does settlement correctly", () => {
		var settlement = buildItem("settlement", true).sort();
		expect(settlement).toEqual(["clay", "sheep", "wheat",  "wood"]);
		expect(sheep.value).toBe(startVal - 1);
		expect(stone.value).toBe(startVal);
		expect(wheat.value).toBe(startVal - 1);
		expect(wood.value).toBe(startVal - 1);
		expect(clay.value).toBe(startVal - 1);
	});
	
	it("does road correctly", () => {
		var road = buildItem("road", true).sort();
		expect(road).toEqual(["clay", "wood"]);
		expect(sheep.value).toBe(startVal);
		expect(stone.value).toBe(startVal);
		expect(wheat.value).toBe(startVal);
		expect(wood.value).toBe(startVal - 1);
		expect(clay.value).toBe(startVal - 1);
	});
	
	it("does city correctly", () => {
		var city = buildItem("city", true).sort();
		expect(city).toEqual(["stone", "stone", "stone", "wheat", "wheat"]);
		expect(sheep.value).toBe(startVal);
		expect(stone.value).toBe(startVal - 3);
		expect(wheat.value).toBe(startVal - 2);
		expect(wood.value).toBe(startVal);
		expect(clay.value).toBe(startVal);
	});
	
	it("does boat correctly", () => {
		var boat = buildItem("boat", true).sort();
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
		expect(boat.toLowerCase()).toBe("not enough resources.");	
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
		
		expect(devCard.toLowerCase()).toBe("cannot draw when empty.");
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
	});
});


describe("didWin", () => {
	var body, victoryPoints;

	beforeEach(function(){
		body = document.getElementsByTagName("body")[0];
		var element = document.createElement("div");
		element.id = "victoryPoints";
		element.value = 0;
		body.appendChild(element);
		victoryPoints = document.getElementById("victoryPoints");
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
		body.removeChild(victoryPoints);
	});
});

