const POSSIBLES = ["sheep", "wheat", "stone", "clay", "wood"];
const ITEM_RECIPES = {
	devCard: ["sheep", "stone", "wheat"],
	settlement: ["sheep", "clay", "wood", "wheat"],
	road: ["clay", "wood"],
	city: ["wheat", "wheat", "stone", "stone", "stone"],
	boat: ["sheep", "wood"]
}

var deck = {
	"knight": 14,
	"victoryCard": 5,
	"roadBuilding": 2,
	"yearOfPlenty": 2,
	"monopoly": 5
}

function buildItem(item, isTest = false) { 
    if (ITEM_RECIPES[item] == null) {
		return "Error, invalid item '" + item + "'.";
	}
	
	for (var i = 0; i < POSSIBLES.length; i++) {
		numberNeeded = 0;
		for (var j = 0; j < ITEM_RECIPES[item].length; j++) {
			if (POSSIBLES[i] == ITEM_RECIPES[item][j]) {
				numberNeeded++;
			}
		}
		if (document.getElementById(POSSIBLES[i]).value < numberNeeded) {
			if (!isTest) {
				window.alert("Not enough resources.");
			}
			return "Not enough resources."
		}
	}
	
	for (var i = 0; i < ITEM_RECIPES[item].length; i++) {
		document.getElementById(ITEM_RECIPES[item][i]).value--;
	}
	
	if (item == "devCard") {
		drawDevCard();
	}
	
	return ITEM_RECIPES[item];
}

function drawDevCard(givenDeck = null) {
	if (givenDeck == null) {
		givenDeck = deck;
	}
	
	var deckSize = 0;
	for (var value of Object.values(givenDeck)) {
		deckSize += value;
	}
	
	if (deckSize <= 0) {
		return "Cannot draw when empty."
	}
	
	var randomNumber = Math.floor(Math.random() * deckSize);
	
	var totalSoFar = 0;
	for (var key of Object.keys(givenDeck)) {
		totalSoFar += givenDeck[key];
		if (randomNumber <= totalSoFar) {
			givenDeck[key]--;
			deck = givenDeck;
			console.log(key);
			console.log(document.getElementById(key));
			document.getElementById(key).value++;
			return { name: key, deck: deck };
		}			
	}
}

function stealRandomCard(){
    var resources = [];

	for (var i = 0; i < POSSIBLES.length; i++) {
		for (var j = 0; j < document.getElementById(POSSIBLES[i]).value; j++) {
			resources.push(POSSIBLES[i]);
		}
	}

    var output = "You have no cards to steal.";
	var broke = true;
	
    if (resources.length > 0){
        output = resources[Math.floor(Math.random() * resources.length)];
		broke = false;
    }
	
    document.getElementById("stolen").innerHTML = output;
	
	if (!broke) {
		document.getElementById(output).value--;
	}
}

function displayZeros() {
	var inputs = document.getElementsByTagName("input");
	
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].type == "number") {
			inputs[i].value = 0;
		}
	}
	
	document.getElementById("vp").innerHTML = 0;
}

function calcVP(value, id) {
	var vpElement = document.getElementById("vp");
	
	if (document.getElementById(id).value == "off") {
		vpElement.innerHTML = parseInt(vpElement.innerHTML) + value;
		document.getElementById(id).value = "on";
	} else {
		vpElement.innerHTML = parseInt(vpElement.innerHTML) - value;
		document.getElementById(id).value = "off";
	}
	calcVPNum();
}

function calcVPNum() {
	var runningTotal = parseInt(document.getElementById("victoryCard").value);
	
	if (document.getElementById("road").value == "on") { runningTotal += 2; }
	if (document.getElementById("army").value == "on") { runningTotal += 2; }

	document.getElementById("vp").innerHTML = runningTotal;
}