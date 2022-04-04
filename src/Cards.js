const POSSIBLES = ["sheep", "wheat", "stone", "clay", "wood"];
const ITEM_RECIPES = {
	devCard: ["sheep", "stone", "wheat"],
	settlement: ["sheep", "clay", "wood", "wheat"],
	road: ["clay", "wood"],
	city: ["wheat", "wheat", "stone", "stone", "stone"],
	boat: ["sheep", "wood"]
}

const TEXT_MAP = {
	devCard: "Development card",
	settlement: "Settlement",
	city: "City",
	road: "Road",
	boat: "Boat"
}

var deck = {
	"knight": 14,
	"victoryCard": 5,
	"roadBuilding": 2,
	"yearOfPlenty": 2,
	"monopoly": 5
}

// returns { message: string, recipe: array }
function buildItem(item, isTest = false) { 
	var retObj = {
		message: "",
		recipe: null
	}
	var recipe = null;
    if (ITEM_RECIPES[item] == null) {
		retObj.message = "Error, invalid item '" + item + "'.";
	} else {
		var notEnough = false;
		for (var i = 0; i < POSSIBLES.length; i++) {
			numberNeeded = 0;
			for (var j = 0; j < ITEM_RECIPES[item].length; j++) {
				if (POSSIBLES[i] == ITEM_RECIPES[item][j]) {
					numberNeeded++;
				}
			}
			if (document.getElementById(POSSIBLES[i]).value < numberNeeded) {
				retObj.message = "Not enough resources.";
				notEnough = true;
			}
		}
		
		if (notEnough) {
		} else {
			if (item == "settlement") {
				var settlementMessage = buildSettlement().message.toLowerCase();
				if (settlementMessage != "settlement placed.") {
					retObj.message = settlementMessage;
				}
			} else if (item == "city") {
				var cityMessage = buildCity().message.toLowerCase();
				if (cityMessage != "city placed.") {
					retObj.message = cityMessage;
				}
			} 
			
			if (retObj.message == "") {
				for (var i = 0; i < ITEM_RECIPES[item].length; i++) {
					document.getElementById(ITEM_RECIPES[item][i]).value--;
				}
				
				if (item == "devCard" && !isTest) {
					drawDevCard();
				}
				
				retObj.message = TEXT_MAP[item] + " built.";
				retObj.recipe = ITEM_RECIPES[item];
			}
		}
	}
	log(retObj.message);
	return retObj;
}

// returns { message: string, name: string, deck: object }
function drawDevCard(givenDeck = null) {
	var retObj = {
		message: "",
		name: "",
		deck: null
	}
	if (givenDeck == null) {
		givenDeck = deck;
	}
	
	var deckSize = 0;
	for (var value of Object.values(givenDeck)) {
		deckSize += value;
	}
	
	if (deckSize <= 0) {
		retObj.message = "Cannot draw when empty.";
	} else {
		var randomNumber = Math.floor(Math.random() * deckSize);
		
		var totalSoFar = 0;
		for (var key of Object.keys(givenDeck)) {
			totalSoFar += givenDeck[key];
			if (randomNumber <= totalSoFar) {
				givenDeck[key]--;
				deck = givenDeck;
				document.getElementById(key).value++;
				retObj.name = key;
				retObj.deck = deck;
				break;
			}			
		}
		retObj.message = "Drew dev card.";
	}
	log(retObj.message);
	return retObj;
}

// returns { message: string, stolen: string }
function stealRandomCard(){
    var resources = [];
	var retObj = {
		message: "",
		stolen: "",
	}

	for (var i = 0; i < POSSIBLES.length; i++) {
		for (var j = 0; j < document.getElementById(POSSIBLES[i]).value; j++) {
			resources.push(POSSIBLES[i]);
		}
	}

	if (resources.length > 0) {
        retObj.stolen = resources[Math.floor(Math.random() * resources.length)];
		retObj.message = "One " + retObj.stolen + " was stolen.";
		document.getElementById(retObj.stolen).value--;
    } else {
		retObj.message = "You have no cards to steal.";
	}
    
	log(retObj.message);
	return retObj;
}

// returns null
function displayZeros() {
	var inputs = document.getElementsByTagName("input");
	
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].type == "number") {
			inputs[i].value = 0;
		}
	}
	
	document.getElementById("vp").innerHTML = 0;
}

// returns { message: string }
function calcVP(id) {
	var retObj = {
		message: "",
	}
	var nameMap = {
		army: "Largest army",
		road: "Longest road"
	}
	if (id == "army" && parseInt(document.getElementById("knightsPlayed").value) < 3) {
		retObj.message = nameMap[id] + " requires at least 3 knights.";
		document.getElementById(id).checked = false;
	//} else if (id == "longestRoad") // TODO && parseInt(document.getElementById("roadsBuilt").value) < 5) {
	//	retObj.message = nameMap[id] + " requires at least 5 roads.";
	} else {
		if (document.getElementById(id).value == "off") {
			document.getElementById(id).value = "on";
			retObj.message = nameMap[id] + " activated.";
		} else {
			document.getElementById(id).value = "off";
			retObj.message = nameMap[id] + " deactivated.";
			
		}
	}
	log(retObj.message);
	return retObj;
}

// returns null
function calcVPNum() {
	var runningTotal = parseInt(document.getElementById("victoryCard").value);
	
	if (isNaN(runningTotal)) { runningTotal = 0; }	
	if (document.getElementById("longestRoad").value == "on") { runningTotal += 2; }
	if (document.getElementById("army").value == "on") { runningTotal += 2; }
	
	runningTotal += parseInt(document.getElementById("settlements").value);
	runningTotal += parseInt(document.getElementById("cities").value) * 2;

	document.getElementById("vp").value = runningTotal;
}

// returns { message: string }
function useKnight(isTest = false, isLargest = false) {
	var retObj = {
		message: ""
	}
	var availableKnights = document.getElementById("knight");
	
	if (parseInt(availableKnights.value) <= 0) {
		retObj.message = "No knights to play.";
	} else {
		var knightsPlayed = document.getElementById("knightsPlayed");
		var largestArmy = document.getElementById("army");
		
		knightsPlayed.value = parseInt(knightsPlayed.value) + 1;
		availableKnights.value = parseInt(availableKnights.value) - 1;
		retObj.message = "Knight played.";
		
		if (parseInt(knightsPlayed.value) >= 3) {
			if (largestArmy.value == "off") {
				if (isTest) {
					if (isLargest) {
						largestArmy.value = "on";
						largestArmy.checked = true;
					}
				} else {
					setTimeout(() => {
						if(window.confirm("You have played " + knightsPlayed.value + " knights.\nDo you now have largest army?")) {
						calcVP('army');
						largestArmy.checked = true;
					}
					}, 300);
					
				}
				retObj.message = "Largest army prompted.";
			}
		}
	}
		
	log(retObj.message);
	return retObj;
}

// returns { message: string }
function buildSettlement() {
	var settlements = document.getElementById("settlements");
	var retObj = {
		message: ""
	}
	if (parseInt(settlements.value) >= 5) {
		retObj.message = "Max settlements reached.";
	} else {
		settlements.value = parseInt(settlements.value) + 1;
		retObj.message = "Settlement placed.";
		calcVPNum();
	}
	log(retObj.message);
	return retObj;
}

// returns { message: string }
function buildCity() {
	var retObj = {
		message: ""
	}
	var settlements = document.getElementById("settlements");
	var cities = document.getElementById("cities");

	if (parseInt(settlements.value) <= 0) {
		retObj.message = "No settlements to replace.";
	} else if (parseInt(cities.value) >= 4) {
		retObj.message = "Max cities reached.";
	} else {
		settlements.value = parseInt(settlements.value) - 1;
		cities.value = parseInt(cities.value) + 1;
		retObj.message = "City placed.";
	}
	
	log(retObj.message);
	return retObj;
}

function log(content) {
	calcVPNum();
	if (content != "") {
		//console.log(content);
		var output = document.getElementById("output");
		output.innerHTML = content;
		output.classList.remove("normal");
		setTimeout(() => {output.classList.add("normal");}, 1000);
	} else {
		console.log("Recieved empty log string.");
	}
}

function inc(id) {
	document.getElementById(id).value = parseInt(document.getElementById(id).value) + 1;
}

function dec(id) {
	if (parseInt(document.getElementById(id).value) > 0) {
		document.getElementById(id).value = parseInt(document.getElementById(id).value) - 1;
	}
}

// returns { message: string }
function playMonopoly() {
	var retObj = {
		message: ""
	}
	
	var monopolyCards = document.getElementById("monopoly");
	if (parseInt(monopolyCards.value) > 0) {
		var body = document.getElementsByTagName("body")[0];
		var outerBox = insertElement(body, "div", { id: "outerBox", "class": "outerBox" });
		var promptScreen = insertElement(outerBox, "div", { id: "promptScreen", "class": "popup" });
		var title = insertElement(promptScreen, "div", { id: "promptTitle" });
		title.innerHTML = "Please select the resource you wish to steal from other players.";
		var parentEl = insertElement(promptScreen, "select", { id: "resourceOptions" });
		for (var i = 0; i < POSSIBLES.length; i++) {
			var params = { 
				value: POSSIBLES[i]
			}
			if (POSSIBLES[i] == "sheep") {
				params["selected"] = "selected";
			}
			var el = insertElement(parentEl, "option", params);
			el.innerHTML = POSSIBLES[i];
		}
		var submitButton = insertElement(promptScreen, "button", { "onclick": "submitMonopolyResource()" });
		submitButton.innerHTML = "submit";
	} else {
		retObj.message = "No monopoly cards to play.";
	}
	
	log(retObj.message);
	return retObj;	
}

// returns { message: string, resource: string }
function submitMonopolyResource() {
	var retObj = {
		message: "",
		resource: null
	}
	
	var options = document.getElementById("resourceOptions");
	for (var i = 0; i < options.children.length; i++) {

		if (options[i].selected) {
			retObj.message = options[i].value + " selected for monopoly."
			retObj.resource = options[i].value;
		}
	}
	document.getElementsByTagName("body")[0].removeChild(document.getElementById("outerBox"));
	
	promptMonopolyNumberStolen(retObj.resource);
	return retObj;
}
	
// returns { message: string }
function promptMonopolyNumberStolen(resource) {
	var retObj = {
		message: "Prompt screen displayed.",
		resource: resource
	}
	var body = document.getElementsByTagName("body")[0];
	var outerBox = insertElement(body, "div", { id: "outerBox", "class": "outerBox" });
	var promptScreen = insertElement(outerBox, "div", { id: "promptScreen", "class": "popup" });	
	var title = insertElement(promptScreen, "div", { id: "promptTitle" });
	title.innerHTML = "Please enter the number of " + resource + " received from other players.";
	insertElement(promptScreen, "input", { type: "number", id: "numberStolenVal" });
	insertElement(promptScreen, "input", { type: "hidden", id: "resourceStolen", value: resource });
	var submitButton = insertElement(promptScreen, "button", { "onclick": "submitMonopolyNumberStolen()" });
	submitButton.innerHTML = "submit";
	
	return retObj;
}

// returns { message: string, number: int }
function submitMonopolyNumberStolen() {
	var retObj = {
		message: "",
		number: null
	}
	var numberStolen = parseInt(document.getElementById("numberStolenVal").value);
	if (parseInt(numberStolen) < 0) {
		retObj.message = "Cannot steal negative resources.";
	} else {
		var resource = document.getElementById("resourceStolen").value;
		retObj.message = "Monopoly number acquired is " + parseInt(numberStolen.value) + ".";
		retObj.number = parseInt(numberStolen);
		document.getElementsByTagName("body")[0].removeChild(document.getElementById("outerBox"));
		document.getElementById("monopoly").value = parseInt(document.getElementById("monopoly").value) - 1;
		
		var resourceElement = document.getElementById(resource);
		resourceElement.value = parseInt(resourceElement.value) + numberStolen;
		retObj.message = "Monopoly card played.";
	}
	
	log(retObj.message);
	return retObj;	
}

function insertElement(parentEl, type, params) {
	var el = document.createElement(type);
	for (var key in params) {
		el.setAttribute(key, params[key]);		
	}
	parentEl.appendChild(el);
	return el;
}

// returns { message: string }
function playYearOfPlenty() {
	var retObj = {
		message: ""
	}
	
	var yearOfPlentyCards = document.getElementById("yearOfPlenty");
	if (parseInt(yearOfPlentyCards.value) > 0) {
		var body = document.getElementsByTagName("body")[0];
		var outerBox = insertElement(body, "div", { id: "outerBox", "class": "outerBox" });
		var promptScreen = insertElement(outerBox, "div", { id: "promptScreen", "class": "popup" });
		var title = insertElement(promptScreen, "div", { id: "promptTitle" });
		title.innerHTML = "Please the two resources you would like to receive.";
		var selections = ["first", "second"];
		for (var i = 0; i < selections.length; i++) {
			var parentEl = insertElement(promptScreen, "select", { id: selections[i] });
			for (var j = 0; j < POSSIBLES.length; j++) {
				var params = { 
					value: POSSIBLES[j]
				}
				if (POSSIBLES[j] == "sheep") {
					params["selected"] = "selected";
				}
				var el = insertElement(parentEl, "option", params);
				el.innerHTML = POSSIBLES[j];
			}
		}
		
		var submitButton = insertElement(promptScreen, "button", { "onclick": "submitPlentyResources()" });
		submitButton.innerHTML = "submit";
	} else {
		retObj.message = "No year of plenty cards to play.";
	}
	
	log(retObj.message);
	return retObj;
}

// returns { message: string, selections: [string] }
function submitPlentyResources() {
	var retObj = {
		message: "",
		selections: []
	}
	var yearOfPlentyCards = document.getElementById("yearOfPlenty");

	var selectionIds = ["first", "second"];
	for (var i = 0; i < selectionIds.length; i++) {
		var parentEl = document.getElementById(selectionIds[i]);
		for (var j = 0; j < parentEl.children.length; j++) {
			if (parentEl[j].selected ) {
				retObj.selections[i] = parentEl[j].value;
			}
		}
	}
	
	retObj.message = "Year of plenty card played.";
	document.getElementsByTagName("body")[0].removeChild(document.getElementById("outerBox"));
	
	yearOfPlentyCards.value = parseInt(yearOfPlentyCards.value) - 1;
	for (var i = 0; i < retObj.selections.length; i++) {
		document.getElementById(retObj.selections[i]).value = parseInt(document.getElementById(retObj.selections[i]).value) + 1;
	}
	
	log(retObj.message);
	return retObj;
}