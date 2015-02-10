Phaser = require('Phaser');
var metronome = require('./metronome');

console.log('yo');

window.addEventListener("load", function(){ metronome.play()});

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var target = new Phaser.Point();
var springTop;
var springBall;
var isMoving = false;
var dropTop = 120;
var throttleMoving = false;
var nextMoveTime = -1;
var moveDelay = 100;


var ptrMotionState;
var oldSign = 1;
var oldTime = 0;
window.timeThresh = 200;
window.dddyThresh = .01;

function preload() {
  game.load.image('mushroom', '/images/mushroom2.png');
  game.load.spritesheet('chain','/images/chain.png',16,26);
}

function create() {
  game.input.recordPointerHistory = true;
  game.input.recordLimit = 100;
  game.input.recordRate = 20;

  game.input.addMoveCallback(onMove);

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
    triggerSpring();
  }, this);
  game.input.onUp.add(function() {
    isMoving = false;
  }, this);

  game.physics.p2.gravity.y = 0;

  springBall.body.onBeginContact.add(function blockHit (body, shapeA, shapeB, equation) {
    if (body === sprite1.body) {
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

function render() {
}

function onMove(pointer) {

  if (! isMoving) {
    return;
  }

  var dt = game.time.now - oldTime;
  if (dt < timeThresh) {
    return;
  }
  oldTime = game.time.now;

  ptrMotionState = getPointerMotionState(pointer);
  if (ptrMotionState) {
    //sprite1.height = 50 * ptrMotionState.ddy;
    var newSign;
    //newSign = (ptrMotionState.ddy < 0) ? -1 : 1;
    if (Math.abs(ptrMotionState.dddy) > dddyThresh) {
      newSign = (ptrMotionState.dddy < 0) ? -1 : 1;
    } else {
      newSign = oldSign;
    }
    if (oldSign != newSign) {
      //sprite2.height *= -1;
      //metronome.playNote();
      triggerSpring();
    }
    oldSign = newSign;
  }
}

function getPointerMotionState(pointer, lookbackTime) {
  lookbackTime = lookbackTime || window.lookbackTime || 100;

  var motionState = {};

  var lookbackPoints = Math.floor(lookbackTime/game.input.recordRate);
  var alignedLookbackTime = lookbackPoints * game.input.recordRate;
  var lookbackIdx = pointer._history.length - 1 - lookbackPoints;
  var startIdx = Math.max(0, lookbackIdx);
  var start = pointer._history[startIdx];
  var end = pointer._history[pointer._history.length - 1];

  if (! start || ! end){
    return;
  }

  motionState.dx = end.x - start.x;
  motionState.dy = end.y - start.y;

  motionState.ddx = motionState.dx/alignedLookbackTime;
  motionState.ddy = motionState.dy/alignedLookbackTime;

  motionState.dddx = 0;
  motionState.dddy = 0;

  for (var i=startIdx; i < pointer._history.length - 1; i++) {
    var a = pointer._history[i];
    var b = pointer._history[i+1];
    motionState.dddx += (b.x - a.x)/(Math.pow(game.input.recordRate,2));
    motionState.dddy += (b.y - a.y)/(Math.pow(game.input.recordRate,2));
  }

  return motionState;

}

function triggerSpring() {
  if (nextMoveTime > game.time.now) {
    return;
  }
  nextMoveTime = game.time.now + moveDelay;

  springBall.body.force.y = .5*1e5;
}
