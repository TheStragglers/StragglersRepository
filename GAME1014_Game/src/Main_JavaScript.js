var _stage = document.getElementById("stage");
var _canvas = document.querySelector("canvas");
var surface = _canvas.getContext("2d");

const ROWS = 8;
const COLS = 12;
const SIZE = 100;
const BULLETSPEED = 30;

_canvas.width = COLS*SIZE;
_canvas.height = ROWS*SIZE;

//---------------------------------------------
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var enterPressed = false;
//lets store all images under one variable to help minimize our code.
var images = new function(){
 this.player = new Image();
    this.player.src = "../img/Ship.png";
this.bulletImg = new Image();
this.bulletImg.src = "../img/Bullet.png";
}
var player = {speed:10, x:_canvas.width/2, y:_canvas.height/2,};


var bulletArray = [];




var interval;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

interval = setInterval(update, 33.34);
function update()//Main Game Loop!
{
    movePlayer();
    moveBullet();
    render();
}

function render()
{
    surface.clearRect(0, 0, _canvas.width, _canvas.height);

    surface.drawImage(images.player,player.x,player.y);

    for(var i = 0; i<bulletArray.length; i++) {
        surface.drawImage(bulletArray[i].img, bulletArray[i].x, bulletArray[i].y);
    }

}

function onKeyDown(event)
{
    switch(event.keyCode)
    {
        case 37:
            if (leftPressed == false)
                leftPressed = true;
            break;
        case 39:
            if (rightPressed == false)
                rightPressed = true;
            break;
        case 38:
            if (upPressed == false)
                upPressed = true;
            break;
        case 40:
            if (downPressed == false)
                downPressed = true;
            break;
        case 32:
            if(enterPressed == false)
                enterPressed = true;
            fireBullet();
            break;
    }
}

function onKeyUp(event)
{
    switch(event.keyCode)
    {
        case 37:
            leftPressed = false;
            break;
        case 39:
            rightPressed = false;
            break;
        case 38:
            upPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
        case 32:
            enterPressed = false;
            break;
    }
}
function movePlayer()
{
    if ( leftPressed == true && player.x > 0 )
        player.x -= player.speed;
    if ( rightPressed == true && player.x < 1200 - SIZE )
        player.x += player.speed;
    if ( upPressed == true && player.y > 0)
        player.y -= player.speed;
    if ( downPressed == true && player.y < 800 - SIZE)
        player.y += player.speed;
}

function fireBullet(){
    var bullet = {};
    bullet.x = player.x;
    bullet.y = player.y;
    bullet.img = images.bulletImg;
    bulletArray.push(bullet);
}

function moveBullet(){
    for (var i = 0; i<bulletArray.length; i++){
        bulletArray[i].x +=BULLETSPEED;
    }
}

