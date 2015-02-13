Phaser = require('Phaser');
var metronome = require('./metronome');

console.log('yo');

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var brush;
var springNode;

// Collision groups.
var cg = {};

function preload() {
  game.load.image('brush', '/images/brush.png');

  game.stage.backgroundColor = '#DDDDDD';
}


function create() {

	game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.gravity.y = 100;

  cg.brush = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();

  springNode = game.add.sprite(200, 45);
  game.physics.p2.enable(springNode, true, true);
  springNode.body.setRectangle(10,10);
  springNode.body.static = true;
  springNode.body.setCollisionGroup(cg.brush);

  brush = game.add.sprite(200, 100, 'brush');
	game.physics.p2.enable(brush);
  brush.body.setCollisionGroup(cg.brush);

  var spring = game.physics.p2.createSpring(springNode, brush, 50, 10, 1, null, null, [0,5],[0,0]);

  var pConstraint = game.physics.p2.createPrismaticConstraint(springNode, brush, true,[0,5],[0,-50],[0,1]);
  pConstraint.upperLimitEnabled = true;
  pConstraint.upperLimit = -0.1;

  game.input.onDown.add(onDown);
}

function update() {
}


function onDown(){
  console.log('onDown');
  brush.body.force.y = 1e5;
}

function render() {
}

