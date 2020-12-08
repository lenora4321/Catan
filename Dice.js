//all API related code goes in here
function apiCall(numDice, type){
    var searchString = "";
    for (var i = 0; i < numDice; i++) {
        searchString += "/d" + type;
    }

    var fetchURL = 'http://roll.diceapi.com/json' + searchString;
    
    return fetch(fetchURL)
        .then(response => response.json())
        .then(data => {
            return data;
        }
    );
}

function rollDice() {
    var one = document.getElementById("diceOne");
    var two = document.getElementById("diceTwo");
    var result = document.getElementById("result");

    var diceRolled = apiCall(2, 6);
    diceRolled.then(data => {
        console.log(data.success);
        if (data.success){
            var num1 = parseInt(data.dice[0].value);
            var num2 = parseInt(data.dice[1].value);

            one.innerHTML = "<img src='icons/" + num1 + ".png' />";
            two.innerHTML = "<img src='icons/" + num2 + ".png' />";

            result.innerHTML = num1 + num2;
        } else {
            result.innerHTML = "Error with API call";
        }
        console.log(data);
    });
}

rollDice();