Phaser = require('Phaser');
metronome = require('./metronome');

console.log('yo');

window.addEventListener("load", function(){ metronome.play()});

var sprite1;
var sprite2;
var cursors;

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var target = new Phaser.Point();
var springTop;
var springBall;
var isMoving = false;
var dropTop = 120;
var throttleMoving = false;
var nextMoveTime = -1;
var moveDelay = 100;

function preload() {

    game.load.image('mushroom', '/images/mushroom2.png');
    game.load.spritesheet('chain','/images/chain.png',16,26);

}

function create() {

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

  //  Add 2 sprites which we'll join with a spring
  sprite1 = game.add.sprite(200, 300, 'mushroom');

	game.physics.p2.enable(sprite1);
  sprite1.body.kinematic = true;

  springTop = game.add.sprite(200, 40, 'chain', 1);
  springBall = game.add.sprite(200, dropTop, 'mushroom');
	game.physics.p2.enable([springTop, springBall]);
  //  The parameters are: createSpring(sprite1, sprite2, restLength, stiffness, damping, worldA, worldB, localA, localB)
  game.physics.p2.createSpring(springTop, springBall, 120, 25, 1);
  springTop.body.kinematic = true;
  springBall.body.data.fixedRotation = true;

  game.input.onDown.add(function() {
    isMoving = true;
    accelerateToObject(springBall,target);
  }, this);
  game.input.onUp.add(function() {
    isMoving = false;
  }, this);
  game.input.addMoveCallback(move, this);

  game.physics.p2.gravity.y = 0;

  springBall.body.onBeginContact.add(function blockHit (body, shapeA, shapeB, equation) {
    if (body === sprite1.body) {
      console.log("whammo");
      metronome.playNote();
      springBall.body.y -= 50;
      springBall.body.force.y = 0;
      springBall.body.velocity.y = 0;
      throttleMoving = true;
    }
  }, this);
}

function update() {
  springBall.body.x = 200;
}


function accelerateToObject(obj1, obj2, speed) {
  if (typeof speed === 'undefined') { speed = .5*1e5; }
  var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
  //obj1.body.force.x = Math.cos(angle) * speed;
  //obj1.body.force.y = Math.sin(angle) * speed;
  obj1.body.force.y = speed;
}

function move(pointer, x, y) {
  if (isMoving){
    if (nextMoveTime > game.time.now) {
      return;
    }
    nextMoveTime = game.time.now + moveDelay;

    target.setTo(x, y);
    accelerateToObject(springBall,target);
  }
}


function render() {

}
