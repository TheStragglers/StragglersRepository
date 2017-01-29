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

var canFire = true;


var player = {speed:12,fireRate:300,power:10, x:_canvas.width/2, y:_canvas.height/2, img:new Image()};
player.img.src = "Ship.png";

var gunBot ={speed:player.speed, hp:45, x:player.x-10, y:player.y-35,img:new Image()};
gunBot.img.src = "Ship.png";

var secondGunBot ={speed:player.speed, hp:45, x:player.x-10, y:player.y-35,img:new Image()};
secondGunBot.img.src = "Ship.png";



var gunBotBulletArray =[];

var secondGunBotBulletArray =[];

var bulletArray = [];

var doubleBulletArray = []; 

var bulletImg = new Image();
bulletImg.src = "Bullet.png";



//powerups
var gunBotPowerUp ={x:1000,y:20,img:new Image,on:false};//Just a placeholder to check collision
gunBotPowerUp.img.src = "gunBotPowerUp.png";

var secondGunBotPowerUp ={x:500,y:180,img:new Image,on:false};//Just a placeholder to check collision
secondGunBotPowerUp.img.src = "gunBotPowerUp.png";

var doubleShotPowerUp = {x:1000, y:180,img:new Image,on:false};
doubleShotPowerUp.img.src = "PowerUpDoubleShot.png";

var speedUpgrade = {x:1000, y:340,img:new Image,on:false};
speedUpgrade.img.src = "speedUpgrade.png";

var powerUpgrade = {x:1000, y:500,img:new Image,on:false};
powerUpgrade.img.src = "powerUpgrade.png";

var dpsMeter = {x:1000, y:660,img:new Image,on:false};
dpsMeter.img.src = "dpsMeter.png";

var fireRateUpgrade = {x:500, y:20,img:new Image,on:false};
fireRateUpgrade.img.src = "fireRateUpgrade.png";

var powerUpArray = [];//Later add the powerUps in this array for collision

powerUpArray.push(gunBotPowerUp);
powerUpArray.push(doubleShotPowerUp);
powerUpArray.push(speedUpgrade);
powerUpArray.push(powerUpgrade); 
powerUpArray.push(dpsMeter); 
powerUpArray.push(fireRateUpgrade);
powerUpArray.push(secondGunBotPowerUp);

console.log(powerUpArray); 



var interval;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

interval = setInterval(update, 33.34);
var seconds = 0;
var frPreSec = 0;  
//---------------
function update()//Main Game Loop!
{
	frPreSec++; 
	if(frPreSec == 30){
		seconds++; 
		dps(seconds); 
		frPreSec = 0; 
		if(seconds >= 10){//temp 
		seconds = 0; 
		}
	}
	
    movePlayer();
    moveBullets(); 
    render();
    checkCollision();
	upgrades(); 
  
}
//--------------

function render()
{
    surface.clearRect(0, 0, _canvas.width, _canvas.height);
    surface.drawImage(player.img,player.x,player.y);
	
	
	//-- temp for testing 
    surface.drawImage(gunBotPowerUp.img,gunBotPowerUp.x,gunBotPowerUp.y);//Just a placeholder to check collision
	
    surface.drawImage(secondGunBotPowerUp.img,secondGunBotPowerUp.x,secondGunBotPowerUp.y)
	
    surface.drawImage(doubleShotPowerUp.img,doubleShotPowerUp.x,doubleShotPowerUp.y);
	surface.drawImage(speedUpgrade.img,speedUpgrade.x,speedUpgrade.y);
	surface.drawImage(powerUpgrade.img,powerUpgrade.x,powerUpgrade.y);
	surface.drawImage(fireRateUpgrade.img,fireRateUpgrade.x,fireRateUpgrade.y);
	surface.drawImage(dpsMeter.img,dpsMeter.x,dpsMeter.y);
	//-------
	
	BulletRender();
	gunBotRender();
	secondGunBotRender(); 
	doubleBulletRender();

}
function moveBullets()
{
	moveBullet();
	moveGunBotBullet();
	moveSecondGunBotBullet();
	moveDoubleBullet();
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
			if (enterPressed == true){
				if(canFire==true) {
					canFire = false;
					setTimeout(resetFire,player.fireRate);
					fireBullet();
					fireGunBotBullet();
					fireSecondGunBotBullet();
					fireDoubleBullets(); 
				}
				
				break;
			}
	}
}
function resetFire(){
    canFire = true;
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

function checkCollision() {
	for (var i = 0; i < powerUpArray.length; i++)
	{
		if (!(player.x+30 > powerUpArray[i].x+SIZE-30 || // p.left > a.right
			  player.x+SIZE-30 < powerUpArray[i].x+30 || // p.right < a.left
			  player.y+30 > powerUpArray[i].y+SIZE || // p.top > a.bottom
			  player.y+SIZE-30 < powerUpArray[i].y+30))  // p.bottom < a.top
		{
		
			clearInterval(interval);
		}
	}
	
     //laser collision with enemies
    for (var l = 0; l < bulletArray.length; l++) {
        for (var m = 0; m < powerUpArray.length; m++){

            if (!( bulletArray[l].y+10 > powerUpArray[m].y + 100 
			|| bulletArray[l].y + 64 < powerUpArray[m].y + 30
            || bulletArray[l].x > powerUpArray[m].x + 64 
			|| bulletArray[l].x + 64 < powerUpArray[m].x + 14 ))
			{

                bulletArray.splice(l,1);
                powerUpArray[m].on = true;

            }
        }
    }
	
	for (var l = 0; l < doubleBulletArray.length; l++) {
        for (var m = 0; m < powerUpArray.length; m++){

            if (!( doubleBulletArray[l].y+10 > powerUpArray[m].y + 100 
			|| doubleBulletArray[l].y + 64 < powerUpArray[m].y + 30
            || doubleBulletArray[l].x > powerUpArray[m].x + 64 
			|| doubleBulletArray[l].x + 64 < powerUpArray[m].x + 14 ))
			{

                doubleBulletArray.splice(l,1);
                powerUpArray[m].on = true;

            }
        }
    }
	
}
//------------------------------------------------------- player functions 
function movePlayer()
{
    if ( leftPressed == true && player.x > 0 )
        player.x -= player.speed;
    if ( rightPressed == true && player.x < 1200 - SIZE )
        player.x += player.speed;
    if ( upPressed == true && player.y > 0)
        player.y -= player.speed;
    if ( downPressed == true && player.y < 830 - SIZE)
        player.y += player.speed;
}

function fireBullet(){
    var bullet = {};
    bullet.x = player.x+36;
    bullet.y = player.y+20;
	if(doubleShotPowerUp.on == true){
		bullet.y = player.y +10; 
	}
    bullet.img = bulletImg;
    bulletArray.push(bullet);
}

function moveBullet(){
    for (var i = 0; i<bulletArray.length; i++){
        bulletArray[i].x +=BULLETSPEED;
        if(bulletArray[i] > COLS*SIZE+10){
            bulletArray.splice(i,1);
        }
    }
}

function BulletRender(){
	for(var i = 0; i<bulletArray.length; i++) {
        surface.drawImage(bulletArray[i].img, bulletArray[i].x, bulletArray[i].y);
    }
}
//-----------------------------------------------------------

//--------------------------------------------------------- GunBot Upgrade Functions
function gunBotRender(){
    if(gunBotPowerUp.on == true){
        surface.drawImage(gunBot.img,gunBot.x,gunBot.y);
    }
    gunBot.x = player.x -10;
    gunBot.y = player.y -35;

    if(gunBotPowerUp.on == true) {
        for (var i = 0; i < gunBotBulletArray.length; i++) {
            surface.drawImage(gunBotBulletArray[i].img, gunBotBulletArray[i].x, gunBotBulletArray[i].y);
        }
    }
}

function fireGunBotBullet(){
    if(gunBotPowerUp.on == true){
		var bullet = {};
		bullet.x = gunBot.x+36;
		bullet.y = gunBot.y+20;
		bullet.img = bulletImg;
		gunBotBulletArray.push(bullet);
	}
}

function moveGunBotBullet(){
    for (var i = 0; i<gunBotBulletArray.length; i++){
        gunBotBulletArray[i].x +=BULLETSPEED;
        if(gunBotBulletArray[i] > COLS*SIZE+10){
            gunBotBulletArray.splice(i,1);
        }
    }
}
//----------------------------------------------------------


//--------------------------------------------------------- Double Shot Upgrade Functions
function moveDoubleBullet(){
    for (var i = 0; i<doubleBulletArray.length; i++){
        doubleBulletArray[i].x +=BULLETSPEED;
        if(doubleBulletArray[i] > COLS*SIZE+10){
            doubleBulletArray.splice(i,1);
        }
    }
}
function fireDoubleBullets(){
	if(doubleShotPowerUp.on == true){
		var doubleBullet = {};
		doubleBullet.x = player.x+36;
		doubleBullet.y = player.y+30;
		doubleBullet.img = bulletImg;
		doubleBulletArray.push(doubleBullet);
	}
}

function doubleBulletRender(){

    if(doubleShotPowerUp.on == true) {
        for (var i = 0; i < doubleBulletArray.length; i++) {
            surface.drawImage(doubleBulletArray[i].img, doubleBulletArray[i].x, doubleBulletArray[i].y);
        }
    }
}
//---------------------------------------------------------

//--------------------------------------------------------- second gun bot 
function secondGunBotRender(){
    if(secondGunBotPowerUp.on == true){
        surface.drawImage(secondGunBot.img,secondGunBot.x,secondGunBot.y);
    }
    secondGunBot.y = player.y +35;
    secondGunBot.x = player.x -10;

    if(secondGunBotPowerUp.on == true) {
        for (var i = 0; i < secondGunBotBulletArray.length; i++) {
            surface.drawImage(secondGunBotBulletArray[i].img, secondGunBotBulletArray[i].x, secondGunBotBulletArray[i].y);
        }
    }
}

function fireSecondGunBotBullet(){
    if(secondGunBotPowerUp.on == true){
		var bullet = {};
		bullet.x = secondGunBot.x+36;
		bullet.y = secondGunBot.y+20;
		bullet.img = bulletImg;
		secondGunBotBulletArray.push(bullet);
	}
}

function moveSecondGunBotBullet(){
    for (var i = 0; i<secondGunBotBulletArray.length; i++){
        secondGunBotBulletArray[i].x +=BULLETSPEED;
        if(secondGunBotBulletArray[i] > COLS*SIZE+10){
            secondGunBotBulletArray.splice(i,1);
        }
    }
}


//---------------------------------------------------------

function upgrades(){
	
	if(speedUpgrade.on == true){
		speedUpgrade.on = false; 
		player.speed +=1; 
	}
	if(powerUpgrade.on == true){
		powerUpgrade.on = false; 
		player.power +=4; 
	}
	if(fireRateUpgrade.on == true){
		fireRateUpgrade.on = false; 
		player.fireRate -=10; 
	}
	
	
}



var count = 0; 
var dpsCounter = 0; 
var track = 0; 

function dps(seconds){
	if(dpsMeter.on == true){ 
		dpsCounter += player.power;
		
		if(doubleShotPowerUp.on == true){
			dpsCounter+=player.power;
		}
		
		dpsMeter.on = false; 
	}
	console.log(seconds); 
	if(seconds == 9){
		track = dpsCounter;
		document.getElementById("dpsMeter").innerHTML = "DPS:" + track;
		seconds = 0; 
		dpsCounter = 0; 
	}
	
	
	
}