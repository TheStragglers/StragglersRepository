var _canvas = document.querySelector("canvas");
var _stage = document.getElementById("stage");
var surface = _canvas.getContext("2d");

const ROWS = 8;
const COLS = 12;
const SIZE = 100;
const BULLETSPEED = 30;

const asteroidSpeed = 7;//new 
const enemySpeed = 5;//new

_canvas.width = COLS*SIZE;
_canvas.height = ROWS*SIZE;

//---------------------------------------------
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var enterPressed = false;

var canFire = true;


var player = {speed:12,fireRate:300,power:10, x:_canvas.width/2, y:_canvas.height/2, img:new Image(),hp:100};
player.img.src = "../img/Ship.png";

var gunBot ={speed:player.speed, hp:45, x:player.x-10, y:player.y-35,img:new Image()};
gunBot.img.src = "../img/gunBot.png";

var secondGunBot ={speed:player.speed, hp:45, x:player.x-10, y:player.y-35,img:new Image()};
secondGunBot.img.src = "../img/gunBot.png";

var hpBar = {img:new Image(),x:5,y:5};
hpBar.img.src = "../img/hpBar.png";

var powerBar = {img:new Image(),x:995,y:5};
powerBar.img.src = "../img/powerBar.png";


var asteroidArray =  [];//new

var enemyArray = [];//new

var asteroidArray = []; //asteroid array
console.log()
var asteroidImg = new Image();
asteroidImg.src = "../img/asteroid.png";
var enemyArray = [];
console.log()
var enemyImg = new Image();
enemyImg.src = "../img/enemy.png";

var gunBotBulletArray =[];

var secondGunBotBulletArray =[];

var bulletArray = [];

var doubleBulletArray = [];

var tripleBulletArray = [];
var secondTripleBulletArray = [];

var flameArray = [];

var bulletImg = new Image();
bulletImg.src = "../img/Bullet.png";

var flameBulletImg = new Image();
flameBulletImg.src = "../img/hpBar.png";

//powerups
var gunBotPowerUp ={x:null,y:null,img:new Image,on:false};//Just a placeholder to check collision
gunBotPowerUp.img.src = "../img/gunBot.png";

var secondGunBotPowerUp ={x:null,y:null,img:new Image,on:false};//Just a placeholder to check collision
secondGunBotPowerUp.img.src = "../img/gunBot.png";

var doubleShotPowerUp = {x:500, y:500,img:new Image,on:false};
doubleShotPowerUp.img.src = "../img/PowerUpDoubleShot.png";

var tripleShotPowerUp = {x:null, y:null,img:new Image,on:false};
tripleShotPowerUp.img.src = "../img/fireRateUpgrade.png";

var flamePowerUp ={x:null,y:null,img:new Image,on:false};//Just a placeholder to check collision
flamePowerUp.img.src = "../img/Bullet.png";

var speedUpgrade = {x:null, y:null,img:new Image,on:false};
speedUpgrade.img.src = "../img/speedUpgrade.png";

var powerUpgrade = {x:null, y:null,img:new Image,on:false};
powerUpgrade.img.src = "../img/powerUpgrade.png";

var fireRateUpgrade = {x:null, y:null,img:new Image,on:false};
fireRateUpgrade.img.src = "../img/fireRateUpgrade.png";




var playerAnimtaion =["../img/Ship1.png","../img/Ship2.png","../img/Ship3.png","../img/Ship4.png"]


//var powerUpArray = [];//Later add the powerUps in this array for collision

//powerUpArray.push(gunBotPowerUp);
//powerUpArray.push(doubleShotPowerUp);
//powerUpArray.push(speedUpgrade);
//powerUpArray.push(powerUpgrade);

//powerUpArray.push(fireRateUpgrade);
//powerUpArray.push(secondGunBotPowerUp);

//console.log(powerUpArray);
console.log(player.hp,player.speed,player.fireRate,player.power);

var interval;

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);


setInterval(spawnAsteroid, 3000);
setInterval(spawnAsteroid, 5000);
setInterval(spawnEnemy, 3000);
setInterval(spawnEnemy, 5000);

interval = setInterval(startScreen, 33.34);

var seconds = 0;
var frPreSec = 0;

//---------------

var startScreen = true; 
function startScreen(){
	console.log("Entering start state.");
	_stage.style.backgroundColor = "black";
	surface.fillStyle = "white";
    surface.font = "30px Arial";
    surface.fillText("Press Space to start",450,25);
}

function pauseScreen(){
	console.log("Entering paused state.");
	_stage.style.backgroundColor = "blue";
	surface.fillStyle = "white";
    surface.font = "30px Arial";
    surface.fillText("PAUSED",1100/2,25);
}


function update()//Main Game Loop!
{
	
	_stage.style.backgroundColor = "black";
	frPreSec++; 
	if(frPreSec == 30){
        seconds++;
		frPreSec = 0; 

	}
	animation(); 
    movePlayer();
    moveBullets();
    moveTripleShot();
    moveFlameBullets();
    render();
    checkCollision();
	upgrades();
    timer(seconds);
    playerStats();
	moveAsteroid();
	moveEnemy();
	
	


}
var states = 0; 
function animation(){
	states++; 
	player.img.src = playerAnimtaion[states]; 
	if(states == 3){
		states = 0; 
	}
}

function timer(count){
    surface.fillStyle = "white";
    surface.font = "30px Arial";
    surface.fillText(count,1200/2,25);
	
}

function playerStats(){
    surface.fillStyle = "white";
    surface.font = "20px Arial";
    surface.fillText("Player Speed: " + player.speed + " Player Power: " + player.power + " Player FireRate " + player.fireRate + " Player HP:" + player.hp,2,798);
}


//--------------
function render()
{
    surface.clearRect(0, 0, _canvas.width, _canvas.height);
    surface.drawImage(player.img,player.x,player.y);
    surface.drawImage(hpBar.img,hpBar.x,hpBar.y);
    surface.drawImage(powerBar.img,powerBar.x,powerBar.y);

    flameRender();
	BulletRender();
	gunBotRender();
	secondGunBotRender(); 
	doubleBulletRender();
	for(var d = 0; d < asteroidArray.length; d++ ) {
		surface.drawImage(asteroidArray[d].img, asteroidArray[d].x, asteroidArray[d].y);
	}
	for(var e = 0; e < enemyArray.length; e++ ) {
		surface.drawImage(enemyArray[e].img, enemyArray[e].x, enemyArray[e].y);
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
			if (enterPressed == true){
				if(canFire==true) {
					canFire = false;
					setTimeout(resetFire,player.fireRate);
					fireBullet();
					fireGunBotBullet();
					fireSecondGunBotBullet();
					fireDoubleBullets();
					fireTripleShot();
                    fireflames();
					
				}
				
				break;
			}
			break;
        case 49:
            if(doubleShotPowerUp.on == false){
                doubleShotPowerUp.on = true;
            }else{
                doubleShotPowerUp.on =false;
            }
            break;
        case 50:
            if(gunBotPowerUp.on == false){
                gunBotPowerUp.on = true;
            }else{
                gunBotPowerUp.on =false;
            }
            break;
        case 51:
            if(secondGunBotPowerUp.on == false){
                secondGunBotPowerUp.on = true;
            }else{
                secondGunBotPowerUp.on =false;
            }
            break;
        case 52:
            if(tripleShotPowerUp.on==false){
                tripleShotPowerUp.on = true;
            }else{
                tripleShotPowerUp.on = false;
            }
            break;
        case 53:
            if(flamePowerUp.on==false){
                flamePowerUp.on = true;
            }else{
                flamePowerUp.on = false;
            }
            break;
	}
}
function resetFire(){
    canFire = true;
}

var start = false; 
var pause = false; 

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
			if(startScreen == true){
				startScreen = false; 
				clearInterval(interval);
				surface.clearRect(0, 0, _canvas.width, _canvas.height);
				interval = setInterval(update, 33.34);
			}
			
			
            break;
			case 27:
			clearInterval(interval);
			surface.clearRect(0, 0, _canvas.width, _canvas.height);
			interval = setInterval(pauseScreen, 33.34);
			pause = true; 
			if(start == true){
				clearInterval(interval);
				surface.clearRect(0, 0, _canvas.width, _canvas.height);
				interval = setInterval(update, 33.34);
				start = false; 
				pause = false; 
				break; 
			}
			
			start = true; 
			
			break; 
    }
}
var hp = 1; 
function checkCollision() {

     
	 //laser collision with enemies
    for (var l = 0; l < bulletArray.length; l++) {
        for (var m = 0; m < asteroidArray.length; m++){

            if (!( bulletArray[l].y+10 > asteroidArray[m].y + 100 
			|| bulletArray[l].y + 64 < asteroidArray[m].y + 30
            || bulletArray[l].x > asteroidArray[m].x + 64 
			|| bulletArray[l].x + 64 < asteroidArray[m].x + 14 ))
			{
		

                bulletArray.splice(l,1);
				asteroidArray.splice(m,1);

            }
        }
    }

	 for (var l = 0; l < bulletArray.length; l++) {
			for (var m = 0; m < enemyArray.length; m++){

				if (!( bulletArray[l].y+10 > enemyArray[m].y + 100 
				|| bulletArray[l].y + 64 < enemyArray[m].y + 30
				|| bulletArray[l].x > enemyArray[m].x + 64 
				|| bulletArray[l].x + 64 < enemyArray[m].x + 14 ))
				{

				enemyArray[m].hp -= player.power; 
					bulletArray.splice(l,1);
					if(enemyArray[m].hp <= 0){
						enemyArray.splice(m,1);
					}
				}
			}
		}
		


		for (var i = 0; i < enemyArray.length; i++)
	{
		if (!(player.x+30 > enemyArray[i].x+SIZE-30 || // p.left > a.right
			  player.x+SIZE-30 < enemyArray[i].x+30 || // p.right < a.left
			  player.y+30 > enemyArray[i].y+SIZE || // p.top > a.bottom
			  player.y+SIZE-30 < enemyArray[i].y+30))  // p.bottom < a.top
		{

			enemyArray.splice(i,1);
			player.hp-=25; 
			hp = hp +1;  
			changeHp(hp); 
		}
	}
	
	if(player.hp <= 0){
		clearInterval(interval);
		console.log("You lose");
	}
		
	for (var i = 0; i < asteroidArray.length; i++)
	{
		if (!(player.x+30 > asteroidArray[i].x+SIZE-30 || // p.left > a.right
			  player.x+SIZE-30 < asteroidArray[i].x+30 || // p.right < a.left
			  player.y+30 > asteroidArray[i].y+SIZE || // p.top > a.bottom
			  player.y+SIZE-30 < asteroidArray[i].y+30))  // p.bottom < a.top
		{
			asteroidArray.splice(i,1);
			player.hp-=25; 
			hp = hp +1;  
		}
	}
	if(player.hp <= 0){
		clearInterval(interval);
		console.log("You lose");
	}
}

function changeHp(){
	if(hp == 2){
		hpBar.img.src = "../img/hpBar2.png";
	}
	else if(hp == 3){
		hpBar.img.src = "../img/hpBar3.png";
	}
	else if(hp == 4){
		hpBar.img.src = "../img/hpBar4.png";
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

function moveBullets(){
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
    moveTripleShot();

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
		bullet.y = gunBot.y+5;
		bullet.img = bulletImg;
		bulletArray.push(bullet);
	}
}


//----------------------------------------------------------


//--------------------------------------------------------- Double Shot Upgrade Functions

function fireDoubleBullets(){
	if(doubleShotPowerUp.on == true){
		var doubleBullet = {};
		doubleBullet.x = player.x+36;
		doubleBullet.y = player.y+30;
		doubleBullet.img = bulletImg;
		bulletArray.push(doubleBullet);
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
    secondGunBot.y = player.y +60; 
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
		bullet.y = secondGunBot.y+10;
		bullet.img = bulletImg;
        bulletArray.push(bullet);
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

function fireTripleShot(){
    if(tripleShotPowerUp.on == true){
        var tripleBullet = {};
        tripleBullet.x = player.x+36;
        tripleBullet.y = player.y+20;
        tripleBullet.img = bulletImg;
        tripleBulletArray.push(tripleBullet);

        var tripleBullet2 = {};
        tripleBullet2.x = player.x+36;
        tripleBullet2.y = player.y+20;
        tripleBullet2.img = bulletImg;
        secondTripleBulletArray.push(tripleBullet2);

    }

}

function moveTripleShot(){
    for (var i = 0; i < tripleBulletArray.length; i++) {

        tripleBulletArray[i].x +=15;
        tripleBulletArray[i].y -=2;

        secondTripleBulletArray[i].x +=15;
        secondTripleBulletArray[i].y +=2;

        surface.drawImage(tripleBulletArray[i].img, tripleBulletArray[i].x, tripleBulletArray[i].y);
        surface.drawImage(secondTripleBulletArray[i].img, secondTripleBulletArray[i].x, secondTripleBulletArray[i].y);

        if(tripleBulletArray[i] > COLS*SIZE+10){
            tripleBulletArray.splice(i,1);
        }
        if(secondTripleBulletArray[i] > COLS*SIZE+10){
            secondTripleBulletArray.splice(i,1);
        }
    }
}


function fireflames() {
    if (flamePowerUp.on == true) {
        var flame = {};
        flame.x = player.x + 36;
        flame.y = player.y + 20;
        flame.img = flameBulletImg;
        flameArray.push(flame);

    }
}

function moveFlameBullets(){
    for (var i = 0; i<flameArray.length; i++){
        flameArray[i].x +=BULLETSPEED;

        surface.drawImage(flameArray[i].img, flameArray[i].x, flameArray[i].y);
        if(flameArray[i].x > player.x+100){
            flameArray.splice(i,1);
        }

    }
}


function flameRender(){
for(var i = 0; i<flameArray.length;i++){
	surface.drawImage(flameArray[i].img,flameArray[i].x,flameArray[i].y) 
}
 
  
}

function spawnAsteroid(){
	var randNum = Math.floor(Math.random()*570);
	
	var asteroid = {};
	asteroid.x = 1464;
	asteroid.y = randNum;
	asteroid.img = asteroidImg;
	asteroidArray.push(asteroid);
}

function spawnEnemy(){
	var randNum = Math.floor(Math.random()*570);
	
	var enemy = {};
	enemy.x = 1464;
	enemy.y = randNum;
	enemy.img = enemyImg;
	enemy.hp = 30;  
	enemyArray.push(enemy);
}

function moveAsteroid(){
	for (var a =0; a<asteroidArray.length; a++){
		asteroidArray[a].x -= asteroidSpeed;
	}
}
	
function moveEnemy(){
	for (var a =0; a<enemyArray.length; a++){
		enemyArray[a].x -= enemySpeed;
		}
	}

