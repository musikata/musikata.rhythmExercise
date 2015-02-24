Phaser = require('Phaser');
metronome = require('./metronome');

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
}

var sprites = {};
var bgSprites = {};
var texture;
var spriteSize = 32;
var yMid = 300;
var xMax = 800;
var xCounter = 0;
var oldDelta = 0;
var oldAccel = 0;
window.accelThresh = 1;
window.reachedAccelThresh = false;
window.rate = 5e0;
window.scale = 4;
window.smoothing = 10;
window.deltaMax = 15;
window.deltaThresh = .8;
var isPlaying = false;

function create() {

  //	Here we'll create a renderTexture the same size as our game
  texture = game.add.renderTexture(800, 600, 'mousetrail');

  var bmd = game.add.bitmapData(spriteSize, spriteSize);
  bmd.context.fillStyle = '#FF0000';
  bmd.context.fillRect(0, 0, spriteSize, spriteSize);
  sprites.linear = game.add.sprite(100, yMid, bmd);
  sprites.square = game.add.sprite(200, yMid, bmd);
  sprites.exp = game.add.sprite(300, yMid, bmd);
  sprites.sqrt = game.add.sprite(400, yMid, bmd);

  var bgBmd = game.add.bitmapData(spriteSize, spriteSize);
  bgBmd.context.fillStyle = '#0000FF';
  bgBmd.context.fillRect(0, 0, spriteSize, spriteSize);

  for (var s in sprites) {
      var sprite = sprites[s];
      sprite.anchor.set(.5,.5);
      var bgSprite = game.add.sprite(sprite.x, sprite.y, bgBmd);
      bgSprite.height *= scale;
      bgSprite.anchor.set(.5,.5);
      bgSprites[s] = bgSprite;
      sprite.bringToTop();
  }
}

function update() {
  /*
  if (xCounter >= xMax) {
    texture.clear();
    xCounter = 0;
  }
  */
  xCounter += 1;
  var normalizedX = xCounter/xMax;
  //var delta = Math.sin(rate * normalizedX * 2*Math.PI);
  var rawDelta = game.input.speed.y;

  var filteredDelta = oldDelta + (rawDelta - oldDelta)/smoothing;

  var rawAccel = filteredDelta - oldDelta;
  var filteredAccel = oldAccel + (rawAccel - oldAccel)/smoothing;
  
  oldDelta = filteredDelta;

  var accelSignChanged = (
    (oldAccel <= 0 && filteredAccel > 0) ||
    (oldAccel > 0 && filteredAccel <= 0));

  oldAccel = filteredAccel;
  if (Math.abs(filteredAccel) > accelThresh) {
    reachedAccelThresh = true;
  }

  var accelIsTriggered = (accelSignChanged && reachedAccelThresh);

  var sign = filteredDelta < 0 ? -1 : 1;
  var delta = sign * Math.min(1, Math.abs(filteredDelta/deltaMax));
  //var delta = filteredAccel;
  
  var deltas = {
    linear: Math.abs(delta),
    square: Math.pow(Math.abs(delta), 2),
    exp: (1 - Math.pow(Math.E, Math.abs(delta)))/(1 - Math.E),
    sqrt: Math.pow(Math.abs(delta), .5),
  };

  for (var s in ['linear']) {
    var sprite = sprites[s];
    sprite.height = scale * spriteSize * deltas[s];
    sprite.width = spriteSize * deltas[s];
  }

  if (isPlaying) {
    if (Math.abs(delta) < (deltaThresh *.8)) {
      isPlaying = false;
    }
  }
  else if (Math.abs(delta) >= deltaThresh ) {
    metronome.playNote();
    isPlaying = true;
  }

  /*
  if (accelIsTriggered) {
    metronome.playNote();
    reachedAccelThresh = false;
  }
  */

}
