let cam;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var lives = 3;

var car, car_running, car_collided;
var ground, groundImage, font;

var score;

var treeGroup, treeImage;
var obastacleGroup, obstacle2, obstacle3;

function preload(){
  car_running = loadAnimation("goodcar.jpeg");
  car_collided = loadAnimation("boom.png");
  
  groundImage = loadImage("road.jpg");
  
  obstacle1 = loadImage("carone.png");
  obstacle2 = loadImage("cartwo.png");

  font = loadFont("Questrial-Regular.ttf")
}

function setup() {
  createCanvas(1800,1000,WEBGL);
  
  car = createSprite(10,150,10,10);
  car.addAnimation("running", car_running);
  car.addAnimation("collided", car_collided);

  car.scale = 0.2;
  
  ground = createSprite(100,100,700,100);
  ground.addImage("ground",groundImage);

  ground.scale = 5;
  
  obstaclesGroup = createGroup();

  cam = createCamera();
}

function draw() {
  
  background("white");

  car.setCollider("rectangle",0,0,100,100);
  
  if(gameState === PLAY){
    ground.depth = car.depth - 500;
    car.depth = car.depth + 1;
    
    car.velocityX = 5;
    // //scoring
    score = Math.round(frameCount/5);

    console.log(score);

  if (frameCount % 60 === 0) {
    ground.x = car.x;
 }
    
    //jump when the space key is pressed
    if(keyDown("w") && car.y > 0) {
        car.y = car.y - 5;
    }

    if(keyDown("s") && car.y < 400) {
        car.y = car.y + 5;
    }
    
    car.changeAnimation("running", car_running);
    
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(car)){
      lives = lives - 1;
      obstaclesGroup.destroyEach();
      car.changeAnimation("collided", car_collided);
    }

    if(lives === 0){
      gameState = END
    }

    console.log(lives);

    cam.move(5,0,0);
  }
   else if (gameState === END) {
     
     //change the car animation
      car.changeAnimation("collided", car_collided);
     
      ground.velocityX = 0;
      car.velocityY = 0;
      car.velocityX = 0;
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    //cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     //cloudsGroup.setVelocityXEach(0);    
   }
  drawSprites();

  textSize(50);
  textFont(font);
  fill("black");
  text("Lives: " + lives,car.x-80,-250);

  text("Score: " + score,car.x-900,-250);
}

function reset(){
  gameState = PLAY;
  
  obstaclesGroup.destroyEach();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(car.x+550,Math.round(random(10,400)),100,40);
   obstacle.velocityX = -(6*score/10);
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}