Phaser = require('Phaser');

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
}

var sprites = {};
var texture;
var spriteSize = 32;
var yMid = 300;
var xMax = 800;
var xCounter = 0;
var oldDelta = 0;
window.rate = 5e0;
window.scale = 4;
window.smoothing = 10;
window.maxDelta = 0;
window.deltaMax = 30;

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

  for (var s in sprites) {
      sprites[s].anchor.set(0,.5);
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
  oldDelta = filteredDelta;

  if (Math.abs(filteredDelta) > maxDelta) {
    maxDelta = Math.abs(filteredDelta);
  }

  var sign = filteredDelta < 0 ? -1 : 1;
  var delta = sign * Math.min(1, Math.abs(filteredDelta/deltaMax));

  var offsets = {
    linear: scale * Math.abs(delta),
    square: scale * Math.pow(Math.abs(delta), 2),
    exp: scale * (1 - Math.pow(Math.E, Math.abs(delta))),
    sqrt: scale * Math.pow(Math.abs(delta), .5),
  };

  for (var s in sprites) {
    sprites[s].height = spriteSize * offsets[s];
  }


}
