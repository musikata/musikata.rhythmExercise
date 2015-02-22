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
window.targets = {};
window.base = 1.5;
window.maxDelta = 75;
window.maxSize = 200;
window.center = 200;

window.addEventListener("load", function() {
  console.log('yo');
  window.game = new Phaser.Game(gridConfig.width, gridConfig.height, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
});

function preload() {
  game.stage.backgroundColor = '#DDDDDD';
  game.load.image('mushroom', '/images/mushroom2.png');
}


function create() {
	game.physics.startSystem(Phaser.Physics.P2JS);
  shroom = game.add.sprite(center, center, 'mushroom');
  shroom.height = shroom.width = 25;

  game.input.addMoveCallback(updatePtrData);
  game.input.addMoveCallback(updateSpeedometer);
}
function update() {
  /*
  var ptr = game.input.activePointer;
  if (ptr.isDown) {
    updateSpeedometer(ptr);
  }
  */
  //updateSpeedometer(game.input);
}

var mkMaxSamples= 5;
var mkPtrData = {};
function updatePtrData(ptr) {
  console.log('upd');
  if (! mkPtrData[ptr.id]) {
    mkPtrData[ptr.id] = {
      id: ptr.id,
      samples: []
    };
  }
  var ptrData = mkPtrData[ptr.id];
  var sample = {
    // HERE! FIX TIME!
    t: game.physics.p2.time,
    position: {x: ptr.x, y: ptr.y}
  };

  ptrData.samples.push(sample);
  if (ptrData.samples.length > mkMaxSamples) {
    ptrData.samples.shift();
  }
}

function getPtrVelocities(ptrData) {
  var yVelocities = [];
  var xVelocities = [];
  for (var i=0; i < ptrData.samples.length -1; i++) {
    var sample1 = ptrData.samples[i];
    var sample2 = ptrData.samples[i+1];
    var dt = sample2.t - sample1.t;
    var dx = sample2.position.x - sample1.position.x;
    var dy = sample2.position.y - sample1.position.y;
    xVelocities.push(dx/dt);
    yVelocities.push(dy/dt);
  }
  return {
    x: xVelocities,
    y: yVelocities
  };
}

function getSmoothedPtrYVelocity(ptrData) {
  var velocities = getPtrVelocities(ptrData);
  console.log(JSON.stringify(velocities));
  var smoothedYVelocities = smoothArray(velocities.y, 10);
  return smoothedYVelocities[smoothedYVelocities.length];
}

function updateSpeedometer(ptr) {

  var maxDelta = 20;

  var ptrData = mkPtrData[ptr.id];
  if (! ptrData) {
    return;
  }
  var delta = getSmoothedPtrYVelocity(ptrData);

  var normalizedDelta = Math.min(1, Math.abs(delta)/maxDelta);

  //var scale = (Math.pow(base, normalizedDelta) - 1)/(base - 1);
  var scale = Math.pow(normalizedDelta, 2);
  //var size = sign * scale * maxSize;
  var size = scale * maxSize;

  shroom.height = size;
}

// values: an array of numbers.
// smoothing: the strength of the smoothing filter; 1=no change, larger values smoothes more
function smoothArray(values, smoothing ){
  var _values = values.slice(0);
  var value = _values[0]; // start with the first input
  for (var i=1, len=_values.length; i<len; ++i){
    var currentValue = _values[i];
    value += (currentValue - value) / smoothing;
    _values[i] = value;
  }
  return _values;
}


function render() {
}
