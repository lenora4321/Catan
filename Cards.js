const POSSIBLES = ["sheep", "wheat", "stone", "clay", "wood"];

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
}

function calcVPNum() {
	var runningTotal = parseInt(document.getElementById("vc").value);
	
	if (document.getElementById("road").value == "on") { runningTotal += 2; }
	if (document.getElementById("army").value == "on") { runningTotal += 2; }

	document.getElementById("vp").innerHTML = runningTotal;
}