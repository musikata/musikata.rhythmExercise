Phaser = require('Phaser');
var metronome = require('./metronome');

console.log('yo');

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var ptrMotionState;
var oldSign = 1;
var oldTime = 0;
window.timeThresh = 200;
window.dddyThresh = .01;

function preload() {
  game.load.image('mushroom', '/images/mushroom2.png');
}

function create() {
  game.input.recordPointerHistory = true;
  game.input.recordLimit = 100;
  game.input.recordRate = 20;

  sprite1 = game.add.sprite(200, 300, 'mushroom');
  sprite2 = game.add.sprite(100, 300, 'mushroom');

  game.input.addMoveCallback(onMove);
}

function update() {
}

function render() {
}

function onMove(pointer) {
  var dt = game.time.now - oldTime;
  oldTime = game.time.now;
  if (dt > timeThresh) {
    oldSign = 0;
  }

  ptrMotionState = getPointerMotionState(pointer);
  if (ptrMotionState) {
    sprite1.height = 50 * ptrMotionState.ddy;
    var newSign;
    //newSign = (ptrMotionState.ddy < 0) ? -1 : 1;
    if (Math.abs(ptrMotionState.dddy) > dddyThresh) {
      newSign = (ptrMotionState.dddy < 0) ? -1 : 1;
    } else {
      newSign = oldSign;
    }
    if (oldSign != newSign) {
      sprite2.height *= -1;
      metronome.playNote();
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
