function stealRandomCard(){
    var resources = [];

    var sheep = document.getElementById("sheep").value;
    var stone = document.getElementById("stone").value;
    var clay = document.getElementById("clay").value;
    var wheat = document.getElementById("wheat").value;
    var wood = document.getElementById("wood").value;
    console.log(sheep);

    for (var i = 0; i < sheep; i++){
        resources.push("sheep");
    }

    for (var i = 0; i < stone; i++){
        resources.push("stone");
    }

    for (var i = 0; i < clay; i++){
        resources.push("clay");
    }

    for (var i = 0; i < wood; i++){
        resources.push("wood");
    }

    for (var i = 0; i < wheat; i++){
        resources.push("wheat");
    }
    console.log(resources);

    var output = "You have no cards to steal."
    if (resources.length > 0){
        output = resources[Math.floor(Math.random() * resources.length)];
    }
    document.getElementById("stolen").innerHTML = output;
}
