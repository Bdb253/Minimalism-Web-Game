//start chrome --allow-file-access-from-files
var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0x0a0b10});
gameport.appendChild(renderer.view);

var score = 0;
var stage = new PIXI.Container();

//robot body
var robotTexture = PIXI.Texture.from("robot_body.png");
var robot = new PIXI.Sprite(robotTexture);
robot.anchor.x = 0.5;
robot.anchor.y = 0.5;
robot.position.x = 200;
robot.position.y = 350;

//robot arms
var armTexture = PIXI.Texture.from("robot_arm.png");
var larm = new PIXI.Sprite(armTexture);
larm.anchor.x = 0.5;
larm.anchor.y = 1;
larm.position.x = -15;
larm.position.y = 8;
larm.zIndex = 1;

var rarm = new PIXI.Sprite(armTexture);
rarm.anchor.x = 0.5;
rarm.anchor.y = 1;
rarm.position.x = 15;
rarm.position.y = 8;
rarm.zIndex = 1;

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

function animate()
{
	requestAnimationFrame(animate);
	
	//rotate robot to face mouse

	for(var b=bullets.length-1;b>=0;b--){

	  bullets[b].position.y += -1 * bulletSpeed;
	}
	renderer.render(stage);

	//TODO:
	//better game loop
	//need to remove bullets from scene after they are out of bounds
	//need to add hit box to bullets
	//improve movement controls
	//random lights to fake movement
	//random targets
	//increment score for target destroyed
	//life or time system
}

animate();
document.addEventListener('keydown', keydownEventHandler);