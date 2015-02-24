Phaser = require('Phaser');
metronome = require('./metronome');

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
}

var sprite;
var texture;
var spriteSize = 4;
var yMid = 300;
var xMax = 800;
var xCounter = 0;
var oldDelta = 0;
var oldAccel = 0;
window.accelThresh = 1;
window.reachedAccelThresh = false;
window.smoothing = 10;
window.diffThreshold = 1e2

function create() {

  //	Here we'll create a renderTexture the same size as our game
  texture = game.add.renderTexture(800, 600, 'mousetrail');

  var redBmd = game.add.bitmapData(spriteSize, spriteSize);
  redBmd.context.fillStyle = '#FF0000';
  redBmd.context.fillRect(0, 0, spriteSize, spriteSize);
  redSprite = game.make.sprite(0, 0, redBmd);
  redSprite.anchor.set(0.5);

  var blueBmd = game.add.bitmapData(spriteSize, spriteSize);
  blueBmd.context.fillStyle = '#0000FF';
  blueBmd.context.fillRect(0, 0, spriteSize, spriteSize);
  blueSprite = game.make.sprite(0, 0, blueBmd);
  blueSprite.anchor.set(0.5);

  var greenBmd = game.add.bitmapData(spriteSize, spriteSize);
  greenBmd.context.fillStyle = '#00FF00';
  greenBmd.context.fillRect(0, 0, spriteSize, spriteSize);
  greenSprite = game.make.sprite(0, 0, greenBmd);
  greenSprite.anchor.set(0.5);

  game.add.sprite(0, 0, texture);

}

function update() {
  if (xCounter >= xMax) {
    texture.clear();
    xCounter = 0;
  }
  xCounter += spriteSize;

  var rawDelta = game.input.speed.y;
  if (Math.abs(rawDelta - oldDelta) > diffThreshold) {
    return;
  }

  var filteredDelta = oldDelta + (rawDelta - oldDelta)/smoothing;

  var rawAccel = filteredDelta - oldDelta;
  var filteredAccel = oldAccel + (rawAccel - oldAccel)/smoothing;

  oldDelta = filteredDelta;

  var accelSignChanged = (
    (oldAccel <= 0 && filteredAccel > 0) ||
    (oldAccel > 0 && filteredAccel <= 0));

  oldAccel = filteredAccel;
  if (Math.abs(filteredAccel) > accelThresh) {
    console.log(filteredAccel);
    reachedAccelThresh = true;
  }

  var sign = filteredDelta < 0 ? -1 : 1;

  var velocityY = yMid + filteredDelta;
  var accelY = yMid + 100 + filteredAccel;

  var velocitySprite = redSprite;

  var accelIsTriggered = (accelSignChanged && reachedAccelThresh);

  var accelSprite = accelIsTriggered ? blueSprite : greenSprite;

  texture.render(velocitySprite, {x:xCounter, y:velocityY}, false);
  texture.render(accelSprite, {x:xCounter, y:accelY}, false);

  if (accelIsTriggered) {
    metronome.playNote();
    reachedAccelThresh = false;
  }

}
