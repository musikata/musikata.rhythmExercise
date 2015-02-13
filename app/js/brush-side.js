Phaser = require('Phaser');
var metronome = require('./metronome');

console.log('yo');

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var brush;
var springNode;

function preload() {
  game.load.image('brush', '/images/brush-wide.png');
  game.load.image('mushroom', '/images/mushroom2.png');
  game.stage.backgroundColor = '#FFFFFF';
}

function create() {
	game.physics.startSystem(Phaser.Physics.P2JS);
  //game.physics.p2.gravity.y = -100;

  brush = game.add.sprite(5, 100, 'brush');
	game.physics.p2.enable(brush);
  //brush.body.fixedRotation = true;

  springNode = game.add.sprite(brush.body.x - 1, brush.body.y, 'mushroom');
  springNode.width = springNode.height = 5;
  game.physics.p2.enable(springNode);
  springNode.body.kinematic = true;
  var spring = game.physics.p2.createSpring(brush, springNode, 20, 10, 1, null, null, [0, 5]);

  game.input.onDown.add(onDown);
}

function update() {
  brush.body.velocity.x = 50;
  springNode.body.x = brush.body.x - 1;

  if (brush.body.x > 295){
    brush.body.x = 5;
  }

  if (brush.body.y < 100) {
    brush.body.y = 100;
  }
}

function onDown(){
  console.log('onDown');
  brush.body.force.y = 1e5;
}

function render() {
}
