//start chrome --allow-file-access-from-files
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0x0a0b10});
gameport.appendChild(renderer.view);

var score = 0;
var stage = new PIXI.Container();
let ticker = PIXI.Ticker.shared;

//robot body
var robotTexture = PIXI.Texture.from("robot_body.png");
var robot = new PIXI.Sprite(robotTexture);
robot.anchor.x = 0.5;
robot.anchor.y = 0.5;
robot.position.x = 200;
robot.position.y = 350;
robot.zIndex = 100;

//robot arms
var armTexture = PIXI.Texture.from("robot_arm.png");
var larm = new PIXI.Sprite(armTexture);
larm.anchor.x = 0.5;
larm.anchor.y = 1;
larm.position.x = -15;
larm.position.y = 8;
larm.zIndex = 101;

var rarm = new PIXI.Sprite(armTexture);
rarm.anchor.x = 0.5;
rarm.anchor.y = 1;
rarm.position.x = 15;
rarm.position.y = 8;
rarm.zIndex = 101;

robot.addChild(larm)
robot.addChild(rarm)

//set scale of robot sprite
robot.scale.x = 1.5;
robot.scale.y = 1.5;
stage.addChild(robot);

//projectile
var projTexture = PIXI.Texture.from("robot_projectile.png")

var bullets = [];  
var bulletSpeed = 5;

function shoot(startPosition){  
  var lbullet = new PIXI.Sprite(projTexture);
  lbullet.position.x = startPosition.x - 50;
  lbullet.position.y = startPosition.y -10;

  var rbullet = new PIXI.Sprite(projTexture);
  rbullet.position.x = startPosition.x - 5;
  rbullet.position.y = startPosition.y - 10;

  stage.addChild(lbullet);
  stage.addChild(rbullet);
  bullets.push(lbullet);
  bullets.push(rbullet);
}

//stars
stars = [];
starSpeed = 4;
var starTexture = new PIXI.Texture.from("star.png");

//asteroids
asteroids = [];
asteroidSpeed = 1;
asteroidSpawnTime = 5000;
asteroidTimetoSpawn = 2500;
var asteroidTexture = new PIXI.Texture.from("asteroid.png");

//score counter
const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: '#ffffff',
});

scoreText = new PIXI.Text(score);
scoreText.x = 300;
scoreText.y = 10;
scoreText.zIndex = 100
scoreText.style = style;
stage.addChild(scoreText);

function score()
{
	score +=1;
	scoreText.text = score;
}

function keydownEventHandler(e)
{
	//w key
	if(e.keyCode == 87)
	{
		robot.position.y -= 10;
	}
	//s key
	if(e.keyCode == 83)
	{
		robot.position.y += 10;
	}
	//a key
	if(e.keyCode == 65)
	{
		robot.position.x -= 10;
	}
	//d key
	if(e.keyCode == 68)
	{
		robot.position.x += 10;
	}
	//space bar
	if(e.keyCode == 32)
	{
		shoot({
			x: robot.position.x+Math.cos(robot.rotation)*20,
			y: robot.position.y+Math.sin(robot.rotation)*20
	  	});
	}
}
document.addEventListener('keydown', keydownEventHandler);

ticker.autoStart = false;
ticker.stop();
requestAnimationFrame(animate);
function animate(time) {
	
	ticker.update(time);
	console.log(time);
	//spawn moving stars in the background to simulate movement
	var star = new PIXI.Sprite(starTexture);
	star.scale.x = 0.5;
	star.scale.y = 0.5;
	star.position.y = -100;
	star.position.x = Math.floor(Math.random()* 400);
	star.zIndex = 0;
	stage.addChild(star);
	stars.push(star);

	for(var s=stars.length-1;s>=0;s--)
	{
		stars[s].position.y += 1 * starSpeed;
		
		if(stars[s].position.y >= 500)
		{
			stage.removeChild(stars[s]);
			stars.splice(s, 1);
		}
	}

	//handle bullets
	for(var b=bullets.length-1;b>=0;b--)
	{
		bullets[b].position.y += -1 * bulletSpeed;
		
		if(bullets[b].position.y <= -100)
		{
			stage.removeChild(bullets[b]);
			bullets.splice(b, 1);

		}
	}

	//spawn ateroids and comets randomly increasing over time
	var asteroid = new PIXI.Sprite(asteroidTexture);
	var scale = Math.random() * (1.5 - .25) + .25; 
	asteroid.scale.x = scale;
	asteroid.scale.y = scale;
	asteroid.position.y = -100;
	asteroid.position.x = Math.floor(Math.random()* 400);

	if (time >= asteroidSpawnTime)
	{
		stage.addChild(asteroid);
		asteroids.push(asteroid);
		asteroidSpawnTime += asteroidTimetoSpawn;
	}

	for(var a=asteroids.length-1;a>=0;a--)
	{
		asteroids[a].position.y += 1 * asteroidSpeed;
		
		if(asteroids[a].position.y >= 500)
		{
			stage.removeChild(asteroids[a]);
			asteroids.splice(a, 1);
			//score();
			score +=1;
			scoreText.text = score;
		}
	}


	//TODO:
	//better game loop
	//need to add hit box to bullets
	//improve movement controls
	//life or time system
	
	renderer.render(stage);
	requestAnimationFrame(animate);
}

