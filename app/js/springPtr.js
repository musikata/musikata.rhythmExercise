Phaser = require('Phaser');

window.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

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
var springHandle;
window.ptrForce = 1e1;

window.mode = 'sqrt';

function create() {

  game.physics.startSystem(Phaser.Physics.P2JS);


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


  var handleCollisionGroup = game.physics.p2.createCollisionGroup();
  var springCollisionGroup = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();

  // Create spring handle.
  var springX = 700;
  springHandle = game.add.sprite(springX, yMid, bgBmd);
  springHandle.height = springHandle.width = 5;
  game.physics.p2.enable(springHandle);
  springHandle.body.fixedRotation = true;
  springHandle.body.setCollisionGroup(handleCollisionGroup);

  // Create spring.
  var springBase = game.add.sprite(springX, yMid + 8, bmd);
  springBase.height = springBase.width = 1;
  game.physics.p2.enable(springBase);
  springBase.body.setCollisionGroup(springCollisionGroup);
  springBase.body.static = true;
  var pConstraint = game.physics.p2.createPrismaticConstraint(springHandle, springBase, true, [0,0], [0,0], [0,1]);
  var spring = game.physics.p2.createSpring(springHandle, springBase, 1, 5, 1);

  //game.input.addMoveCallback(onMove);
}

function update() {
  var ptr = game.input.activePointer;
  springHandle.body.force.y = ptrForce * (ptr.y - springHandle.body.y);
}

function onMove(ptr) {
  springHandle.body.force.y = ptrForce * (ptr.y - springHandle.body.y);
}
