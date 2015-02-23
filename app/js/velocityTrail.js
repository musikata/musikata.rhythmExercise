Phaser = require('Phaser');

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
}

var sprite;
var texture;
var spriteSize = 4;
var yMid = 300;
var xMax = 800;
var xCounter = 0;

function create() {

  //	Here we'll create a renderTexture the same size as our game
  texture = game.add.renderTexture(800, 600, 'mousetrail');

  var bmd = game.add.bitmapData(spriteSize, spriteSize);
  bmd.context.fillStyle = '#FF0000';
  bmd.context.fillRect(0, 0, spriteSize, spriteSize);
  sprite = game.make.sprite(0, 0, bmd);

  sprite.anchor.set(0.5);

  game.add.sprite(0, 0, texture);

}

function update() {
  if (xCounter >= xMax) {
    texture.clear();
    xCounter = 0;
  }
  xCounter += spriteSize;
  if (game.input.activePointer.position.isZero()) {
    return;
  }

  var delta = game.input.speed.y;
  var y = yMid + delta;

  texture.render(sprite, {x:xCounter, y:y}, false);

}
