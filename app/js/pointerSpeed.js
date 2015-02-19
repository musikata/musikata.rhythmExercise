Phaser = require('Phaser');
metronome = require('./metronome');

var gridConfig = {
  numCols: 12,
  numRows: 8,
  width: 400,
  height: 400,
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
	game.physics.startSystem(Phaser.Physics.P2JS);

  /*
  ptrBody = game.add.sprite(0,0, 'mushroom');
  game.physics.enable(ptrBody, Phaser.Physics.P2JS);
  ptrBody.body.static = true;
  */

  shroom = game.add.sprite(200,200, 'mushroom');
  shroom.height = shroom.width = 25;

}
function update() {
  var ptr = game.input.activePointer;
  if (ptr.isDown) {
    updateSpeedometer(ptr);
  }
}

window.base = 1.5;
window.maxDelta = 75;
function updateSpeedometer(ptr) {
  var delta = ptr.position.y - ptr.positionDown.y;
  var sign = delta < 0 ? -1 : 1;
  var maxSize = 200;
  var normalizedDelta = Math.min(1, Math.abs(delta)/maxDelta);
  var scale = (Math.pow(base, normalizedDelta) - 1)/(base - 1);
  //var scale = Math.pow(normalizedDelta, 2);
  var size = sign * scale * maxSize;

  shroom.height = size;
}


function render() {
}
