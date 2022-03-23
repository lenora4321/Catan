var width = window.innerWidth * .95;
var height = window.innerHeight * .95;
var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");
var currentColor = "blue";

//hex sizes
var a = 50; //hex side length
var b = Math.sqrt(3) * a / 2; //hex triangle side length
var c = a / 2; //hex triangle height

//numbers, tile types, colors
var nums = [8,8,8,6,6,6,9,9,5,5,4,4,3,3,2,12,10,10,11];
var tiles = [0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,0,1,2,3,4];
var colors = ["#eb5834", "#5e5e5e", "#ebd426", "#2cab0f", "#753f05"];
var circleNums = [];

//corners
var allCorners = [];
var settlements = [];
var colorCoords = [[20, 20, 'red'], [20, 50, 'blue'], [20, 80, 'green'], [20, 110, 'orange']];
var roadSlots = [];

//draw the canvas
function draw() {
    ctx.canvas.width  = width * .9;
    ctx.canvas.height = height;
}

//draw one hex, return its center and color
function drawHex(x, y, color) {
    ctx.fillStyle = colors[color];
    //ctx.strokeStyle = '#3d3d3d';
    var data = [x, y + a, colors[color]];
    //ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(x, y);
    roadSlots.push([x + b /2, y + c /2]);
    x += b;
    y += c;
    ctx.lineTo(x, y);
    roadSlots.push([x, y + a /2]);
    y += a;
    ctx.stroke();
    ctx.lineTo(x, y);
    roadSlots.push([x - b /2, y + c /2]);
    x -= b;
    y += c;
    ctx.stroke();
    ctx.lineTo(x, y);
    ctx.stroke();
    roadSlots.push([x - b /2, y - c /2]);
    x -= b;
    y -= c;
    ctx.lineTo(x, y);
    ctx.stroke();
    roadSlots.push([x, y - a /2]);
    y -= a;
    ctx.lineTo(x, y);
    ctx.stroke();
    roadSlots.push([x + b /2, y - c /2]);
    x += b;
    y -= c;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    //ctx.lineWidth = 1;
    return data;
}

//draw a number of hexes and store centers and data
function drawBoard(startX, startY) {
    var x = startX;
    var y = startY;
    var centers = [];
    for (var j = 0; j < 3; j++){
        centers[j] = drawHex(x, y, getTile());
        x += b * 2;
    }
    y = startY + a + c;
    x = startX - b;
    for (var j = 0; j < 4; j++){
        centers[j + 3] = drawHex(x, y, getTile());
        x += b * 2;
    }
    y = startY + (a + c) * 2;
    x = startX - b * 2;
    for (var j = 0; j < 5; j++){
        centers[j + 7] = drawHex(x, y, getTile());
        x += b * 2;
    }
    y = startY + (a + c) * 3;
    x = startX - b;
    for (var j = 0; j < 4; j++){
        centers[j + 12] = drawHex(x, y, getTile());
        x += b * 2;
    }
    y = startY + (a + c) * 4;
    x = startX;
    for (var j = 0; j < 3; j++){
        centers[j + 16] = drawHex(x, y, getTile());
        x += b * 2;
    }
    return centers;
}

//draw circles in each center, assign numbers
function circleCenters(centers){
    ctx.font = "25px Arial";
    centers.forEach(element => {
        drawCircle(element[0], element[1], 20, "#c2b5a7");
        var nextNum = getNum();
        var d = 3;
        if (nextNum > 9){
            d = 1.5;
        }
        ctx.fillStyle = 'black';
        ctx.fillText(nextNum, element[0] - c/d, element[1] + c/3);
        circleNums.push(nextNum);
        var corners = findCorners(element[0], element[1]);
        corners.forEach(element => {
            if (newCorner(element, allCorners)){
                allCorners.push(element);
            }
        });
    });
}

//record six points, add to list if new
function findCorners(x, y){
    var corners = [];
    corners.push([x, y + a]);
    corners.push([x - b, y + c]);
    corners.push([x - b, y - c]);
    corners.push([x, y - a]);
    corners.push([x + b, y - c]);
    corners.push([x + b, y + c]);
    return corners;
}

//test if a corner is already recorded
function newCorner(corner, arr){
    arr.forEach(element => {
        if (element[0] == corner[0] && element[1] == corner[1]){
            return false;
        }
    });
    return true;
}

//select a number remaining numbers
function getNum(){
    var rand = Math.floor(Math.random() * nums.length);
    num = nums[rand];
    nums.splice(rand, 1);
    return num;
}

//get a tile type from remaining types
function getTile(){
    var rand = Math.floor(Math.random() * tiles.length);
    tile = tiles[rand];
    tiles.splice(rand, 1);
    return tile;
}

//move the robber
function getClickPosition(e) {
    var x = e.clientX;
    var y = e.clientY;
    var r = 20
    for (var i = 0; i < centers.length; i++){
        element = centers[i];
        if (Math.sqrt((x-element[0])*(x-element[0]) + (y-element[1])*(y-element[1])) < r){
            refilCirlces();
            drawCircle(element[0], element[1], 20, 'red');
        }
    }
    r = 10
    for (var i = 0; i < allCorners.length; i++){
        element = allCorners[i];
        if (Math.sqrt((x-element[0]-r)*(x-element[0]-r) + (y-element[1]-r)*(y-element[1]-r)) < r){
            drawCircle(element[0], element[1], 10, currentColor);
            //placeSettlement(element[0], element[1]);
        }
    }

    colorCoords.forEach(element => {
        if (Math.sqrt((x-element[0]-r)*(x-element[0]-r) + (y-element[1]-r)*(y-element[1]-r)) < r){
            currentColor = element[2];
            document.getElementById("color").style.backgroundColor = element[2];
        }
    });

    r = 10;
    for (var i = 0; i < allCorners.length; i++){
        element = allCorners[i];
        if (Math.sqrt((x-element[0]-r)*(x-element[0]-r) + (y-element[1]-r)*(y-element[1]-r)) < r){
            if (settlements.includes(element, 0)){
                drawCircle(element[0], element[1], 10, currentColor, true);
                console.log("yee");
            } else {
                drawCircle(element[0], element[1], 10, currentColor);
                settlements.push(element);
            }
        }
    }

    r = 10;
    for (var i = 0; i < roadSlots.length; i++){
        element = roadSlots[i];
        if (Math.sqrt((x-element[0]-r)*(x-element[0]-r) + (y-element[1]-r)*(y-element[1]-r)) < r){
            drawSquare(element[0], element[1], 10, currentColor);
        }
    }
}

//circle where the valid corners are initially
function circleCorners(){
    allCorners.forEach(element => {
        //drawCircle(element[0], element[1], 10, 'purple');
    });
}

//draw a circle and fill with color
function drawCircle(x, y, r, color, isCity=false){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    if (isCity){
        ctx.strokeStyle = 'darkgray';
        ctx.lineWidth = 5;
    }
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
}

//draw a triangle and fill with color
function drawSquare(x, y, length, color){
    ctx.beginPath();
    ctx.rect(x - length / 2, y - length / 2, length, length);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

//uncolor all circles for new robber
function refilCirlces(){
    ctx.font = "25px Arial";
    for (var i = 0; i < centers.length; i++){
        var element = centers[i];
        ctx.beginPath();
        drawCircle(element[0], element[1], 20, '#c2b5a7');
        var nextNum = circleNums[i];
        var d = 3;
        if (nextNum > 9){
            d = 1.5;
        }
        ctx.fillStyle = 'black';
        ctx.fillText(nextNum, element[0] - c/d, element[1] + c/3);
        circleNums.push(nextNum);
    }
}
/*
function placeSettlement(x, y, color = 'blue'){
    //test if there is already a settlement there
    var proceed = true;
    settlements.forEach(element => {
        if (element[0] == x && element[1] == y){
            proceed = false;
        }
    });

    if (proceed){
        var corners = findCorners(x, y);
        corners.forEach(element => {
            if (!openAdjacent(element, settlements)){
                return false;
                //not working here
            }
        });
    }

    if (proceed){
        console.log("go");
        settlements.push([x, y]);
        drawCircle(element[0], element[1], 10, color);
    } else {
        console.log("stopped");
    }
}


function openAdjacent(corner, arr){
    var x = corner[0];
    var y = corner[1];
    arr.forEach(element => {
        if (Math.sqrt((x-element[0])*(x-element[0]) + (y-element[1])*(y-element[1])) < 10){
            console.log("here");
            return false;
        }
    });
    return true;
}
*/

function drawColors(){
    drawCircle(20, 20, 10, 'red');
    drawCircle(20, 50, 10, 'blue');
    drawCircle(20, 80, 10, 'green');
    drawCircle(20, 110, 10, 'orange');
    drawCircle(20, 200, 10, 'purple');
    drawCircle(20, 230, 10, 'purple', true);
    drawSquare(20, 260, 10, 'purple');
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    ctx.fillText("Settlement", 40, 205);
    ctx.fillText("City", 40, 235);
    ctx.fillText("Road", 40, 265);
    ctx.fillText("Click an existing settlement to turn it into a city", 20, height - 20);
}

function buildDevelopmentCard(){
}

draw();
var centers = drawBoard(300, 50);
circleCenters(centers);
circleCorners();
canvas.addEventListener("click", getClickPosition, false);
drawColors();
