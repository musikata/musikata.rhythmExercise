Phaser = require('Phaser');
metronome = require('./metronome');

var gridConfig = {
  numCols: 12,
  numRows: 8,
  width: 450,
  height: 300,
}
gridConfig.cellWidth = gridConfig.width/gridConfig.numCols;
gridConfig.cellHeight = gridConfig.height/gridConfig.numRows;

var layoutConfig = {
  gutterWidth: gridConfig.cellWidth * 2,
  gutterBorderWidth: 2,
  swipeAreaHeight: gridConfig.cellHeight * 6,
  numGutters: 1
};
layoutConfig.clickAreaHeight = gridConfig.height - layoutConfig.swipeAreaHeight;
layoutConfig.mainAreaHeight = gridConfig.height;
layoutConfig.mainAreaWidth = gridConfig.width - (layoutConfig.gutterWidth * layoutConfig.numGutters);
if (layoutConfig.numGutters == 1) {
  layoutConfig.mainAreaLeft = 0;
}

var ptrBody;
var shroom;

window.addEventListener("load", function() {
  window.game = new Phaser.Game(gridConfig.width, gridConfig.height, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
});

function preload() {
  game.stage.backgroundColor = '#DDDDDD';
  game.load.image('mushroom', '/images/mushroom2.png');
}


function create() {
  createLayout();
	game.physics.startSystem(Phaser.Physics.P2JS);

  ptrBody = game.add.sprite(0,0, 'mushroom');
  game.physics.enable(ptrBody, Phaser.Physics.P2JS);
  ptrBody.body.static = true;

  /*
  shroom = game.add.sprite(0,0, 'mushroom');
  game.physics.enable(shroom, Phaser.Physics.P2JS);
  shroom.body.kinematic = true;
  shroom.body.fixedRotation = true;

  */

}

function createLayout() {
  // Draw gutters.
  renderGutter({
    left: gridConfig.width - layoutConfig.gutterWidth
  });
  // Draw main area.
}

function renderGutter(opts) {
  createSwipeArea({
    x: 0,
    y: 0,
    height: layoutConfig.swipeAreaHeight,
    width: layoutConfig.gutterWidth,
    borderWidth: layoutConfig.gutterBorderWidth
  });

  createClickArea({
    x: 0,
    y: layoutConfig.swipeAreaHeight,
    height: layoutConfig.clickAreaHeight,
    width: layoutConfig.gutterWidth,
    borderWidth: layoutConfig.gutterBorderWidth
  });
}

function createSwipeArea(opts) {
  var g = game.add.graphics(opts.x, opts.y);
  var borderWidth = opts.borderWidth;
  g.lineStyle(borderWidth, 0xccccccc, 1);
  g.beginFill(0xffffff);
  g.drawRect(borderWidth/2, borderWidth/2, opts.width, opts.height);
  g.endFill(0xff3300);
}

function createClickArea(opts) {
  var g = game.add.graphics(opts.x, opts.y);
  var borderWidth = opts.borderWidth;
  g.lineStyle(borderWidth, 0xccccccc, 1);
  g.beginFill(0xffffff);
  g.drawRect(borderWidth/2, borderWidth/2, opts.width, opts.height);
  g.endFill(0xff3300);
}

var playingCounter = 0;
function update() {
  var ptr = game.input.activePointer;

  ptrBody.body.x = ptr.x;
  ptrBody.body.y = ptr.y;

  var minSpeed = 0;
  var maxSpeed = 25;
  var minSize = 75;
  var maxSize = 150;
  var speed = Math.abs(game.input.speed.y);
  var scale = Math.min(1, (speed - minSpeed)/(maxSpeed - minSpeed));
  scale = scale * scale;
  var size = minSize + (scale * (maxSize - minSize));
  ptrBody.width = ptrBody.height = size;
  if (scale == 1 && playingCounter <= 0) {
    metronome.playNote();
    playingCounter = 5;
  }
  playingCounter--;

}

function render() {
}
