var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running,stopMonkey;
var banana, bananaImage, bananaGroup;
var obstacles, obstacleImage, obstacleGroup;
var ground, groundImage, invisibleGround;
var survivalTime;

function preload() { 


 monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png")

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  groundImage = loadImage("ground.jpg");
  stopMonkey = loadAnimation("sprite_0.png")
  swoosh = loadSound("SwooshSound.mp3");
  gOverMusic = loadSound("gameover.wav");

}

function setup() {
  createCanvas(480, 280)

  ground = createSprite(20, 160, 400, 20);
  ground.addImage("ground", groundImage);
  ground.scale = 2.5;
  ground.x = ground.width / 2;
  
  invisibleGround = createSprite(20,260,400,10);
  invisibleGround.visible = false;

  monkey = createSprite(30, 250, 20, 20);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("stop", stopMonkey)
  monkey.scale = 0.1;
  
  monkey.setCollider("rectangle",0,0,540,540);
    
  //create Groups
  bananaGroup = createGroup();
  obstacleGroup = createGroup();
  
  score = 0;
  
}


function draw() {
  background(100, 150, 20);
  
  if (gameState === PLAY) {
      ground.velocityX = -4;

      if (ground.x < 0) {
        ground.x = ground.width / 2;
      }

      if(keyDown("space") && monkey.y>= 210){
        monkey.velocityY=-15;
      }
      // add gravity
      monkey.velocityY = monkey.velocityY + 0.75;
      monkey.collide(invisibleGround);

      bananaFunction ();
      obstacleFunction();
    
     if(monkey.isTouching(bananaGroup)) {
       swoosh.play();
       bananaGroup.collide(monkey, destroyFunction);
       // high speed bananas to score more
       if (banana.velocityX < -7) {
         score = score +2;
       } else 
         score = score +1;
       }
    if(monkey.isTouching(obstacleGroup)) {
        gameState = END;
        gOverMusic.play();
    }
    survivalTime = Math.ceil(frameCount/frameRate());
  }
  drawSprites();
  
 //Display survival Time, score
    
  textSize(18);
  fill("black");
  text("Survival Time: "+ survivalTime, 20,30);
  text("Score: "+ score, 380,30);
  
  if (gameState === END) {
      ground.velocityX = 0;
      bananaGroup.destroyEach();
      obstacleGroup.destroyEach(); 
      monkey.changeAnimation("stop",stopMonkey) ;
      monkey.velocityX = 0;
      monkey.velocityY=0;
      
      fill("green");
      textSize(30);
      text("Game Over",160,125);
      textSize(20);
      text("Press 'R' if you want to play again", 85, 230)
      if (score >= 80) {
        text("You have played Very Well!!" , 130, 180);
      }
    //reset Game
      if(keyDown("r") || keyDown("R")) {
        gameState = PLAY;
        frameCount = 0;
        score = 0;
        survivalTime = 0;
        monkey.changeAnimation("running",monkey_running) ;
      }
  }
}

function bananaFunction() {
  if (frameCount % 50 === 0){
    banana = createSprite(500,random(120,50), 15, 15);
    banana.addImage(bananaImage);
    banana.scale = 0.08;
    banana.velocityX = -(random(5, 9) + score/10);
    bananaGroup.add(banana);
    banana.lifeTime = 100; 
    banana.setCollider("rectangle",0,0,300,200);
  }
}

function obstacleFunction(){
   if (frameCount % 180 === 0){
    obstacle = createSprite(500,230, 15, 15);
    obstacle.addImage(obstacleImage);
    obstacle.scale = random(0.1,0.22);
    obstacle.velocityX = -(7 + score/10);
    obstacleGroup.add(obstacle);
    obstacle.lifeTime = 100;
    obstacle.setCollider("circle",0,0,150);
   }
}

function destroyFunction(banana, monkey) {
    banana.destroy();
  }

