//start chrome --allow-file-access-from-files
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0x0a0b10});
gameport.appendChild(renderer.view);

var score = 0;
let ticker = PIXI.Ticker.shared;

var stage = new PIXI.Container();
stage.sortableChildren = true;

//robot body
var robotTexture = PIXI.Texture.from("robot_body.png");
var robot = new PIXI.Sprite(robotTexture);
robot.anchor.x = 0.5;
robot.anchor.y = 0.5;
robot.position.x = 200;
robot.position.y = 350;
robot.zIndex = 5;

//robot arms
var armTexture = PIXI.Texture.from("robot_arm.png");
var larm = new PIXI.Sprite(armTexture);
larm.anchor.x = 0.5;
larm.anchor.y = 1;
larm.position.x = -15;
larm.position.y = 8;
larm.zIndex = 10;

var rarm = new PIXI.Sprite(armTexture);
rarm.anchor.x = 0.5;
rarm.anchor.y = 1;
rarm.position.x = 15;
rarm.position.y = 8;
rarm.zIndex = 10;

robot.addChild(larm)
robot.addChild(rarm)

//set scale of robot sprite
robot.scale.x = 1.5;
robot.scale.y = 1.5;
stage.addChild(robot);

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

//comets
comets = [];
cometSpeed = 3;
cometSpawnTime = 0;
cometTimeToSpawn = 6500;
var cometTexture = new PIXI.Texture.from("comet.png");

//score counter
const scoreStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: '#ffffff',
});

scoreText = new PIXI.Text(score);
scoreText.x = 300;
scoreText.y = 10;
scoreText.zIndex = 100
scoreText.style = scoreStyle;
stage.addChild(scoreText);

//gameOver text
const gameOverStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 60,
    fontWeight: 'bold',
    fill: '#FF0000',
});

gameOverText = new PIXI.Text("GAME OVER");
gameOverText.x = 20;
gameOverText.y = 175;
gameOverText.zIndex = 100
gameOverText.style = gameOverStyle;

//restart text
const restartStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 45,
    fontWeight: 'bold',
    fill: '#FF0000',
});

restartText = new PIXI.Text("Restart?");
restartText.x = 125;
restartText.y = 250;
restartText.zIndex = 100
restartText.style = restartStyle;
restartText.interactive = true;
restartText.click = function(e)
{
	location.reload();
};

//robot movement
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
}
document.addEventListener('keydown', keydownEventHandler);

ticker.autoStart = false;
ticker.stop();
gameOver = false;

requestAnimationFrame(animate);
function animate(time) {

	ticker.update(time);

	//spawn moving stars in the background to simulate movement
	var star = new PIXI.Sprite(starTexture);
	star.scale.x = 0.5;
	star.scale.y = 0.5;
	star.position.y = -100;
	star.position.x = Math.floor(Math.random()* 400);
	//star.parentGroup = bgGroup;
	stage.addChildAt(star, stage.children.length-1);
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

	//spawn ateroids and comets randomly increasing over time
	var asteroid = new PIXI.Sprite(asteroidTexture);
	var scale = Math.random() * (1.5 - .25) + .25; 
	asteroid.scale.x = scale;
	asteroid.scale.y = scale;
	asteroid.position.y = -100;
	asteroid.position.x = Math.floor(Math.random()* (390 - 10)) + 10;
	asteroid.zIndex = 10;

	if (time >= asteroidSpawnTime && gameOver == false)
	{
		stage.addChild(asteroid);
		asteroids.push(asteroid);
		asteroidSpawnTime += asteroidTimetoSpawn;
	}

	for(var a=asteroids.length-1;a>=0;a--)
	{
		asteroids[a].position.y += 1 * asteroidSpeed;
		
		if(asteroids[a].position.y >= 450 && gameOver == false)
		{
			stage.removeChild(asteroids[a]);
			asteroids.splice(a, 1);
			score +=1;
			scoreText.text = score;
		}

		var asteroidBounds = asteroids[a].getBounds();
		var robotBounds = robot.getBounds();

		if((asteroidBounds.x + asteroidBounds.width/2) + asteroidBounds.width > (robotBounds.x + robotBounds.width/2) &&
			 (asteroidBounds.x + asteroidBounds.width/2) < (robotBounds.x+ robotBounds.width/2) + robotTexture.width &&
			  (asteroidBounds.y +asteroidBounds.height/2) + asteroidBounds.height > (robotBounds.y + robotBounds.height/2) &&
			   (asteroidBounds.y+asteroidBounds.height/2) < (robotBounds.y + robotBounds.height/2) + robotBounds.height)
		{
			console.log("HIT!!!!!!");
			stage.addChild(gameOverText);
			stage.addChild(restartText);
			gameOver = true;
		}
	}

	//comets
	if(score >= 10)
	{
		//cometSpawnTime = time;
		var comet = new PIXI.Sprite(cometTexture);
		var scale = Math.random() * (2 - 1.25) + 1.25;
		comet.scale.x = scale;
		comet.scale.y = scale;
		comet.position.y = -100;
		comet.position.x = Math.floor(Math.random()* 400);
		comet.zIndex = 10;

		if (time >= cometSpawnTime && gameOver == false)
		{
			stage.addChild(comet);
			comets.push(comet);
			cometSpawnTime += cometTimeToSpawn;
		}

		for(var c=comets.length-1;c>=0;c--)
		{
			comets[c].position.y += 1 * cometSpeed;

			var cometBounds = comets[c].getBounds();
			var robotBounds = robot.getBounds();

			if((cometBounds.x + cometBounds.width/2) + cometBounds.width > (robotBounds.x + robotBounds.width/2) &&
			 	(cometBounds.x + cometBounds.width/2) < (robotBounds.x+ robotBounds.width/2) + robotTexture.width &&
			  	(cometBounds.y + cometBounds.height/2) + cometBounds.height > (robotBounds.y + robotBounds.height/2) &&
			   	(cometBounds.y + cometBounds.height/2) < (robotBounds.y + robotBounds.height/2) + robotBounds.height)
			{
				console.log("HIT!!!!!!");
				stage.addChild(gameOverText);
				stage.addChild(restartText);
				gameOver = true;
			}
		
			if(comets[c].position.y >= 450 && gameOver == false)
			{
				stage.removeChild(comets[c]);
				comets.splice(c, 1);
				//score();
				score +=5;
				scoreText.text = score;
			}
		}		
	}
	renderer.render(stage);
	requestAnimationFrame(animate);
}