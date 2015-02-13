Phaser = require('Phaser');
var metronome = require('./metronome');

console.log('yo');

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var brush;
var springNode;

// Collision groups.
var cg = {};

function preload() {
  game.stage.backgroundColor = '#DDDDDD';

  game.load.image('brush', '/images/brush.png');
  game.load.image('scroll', '/images/scroll.png');
}


function create() {

  // Initialize physics.
	game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.updateBoundsCollisionGroup();

  // Set up collision group for brush.
  cg.brush = game.physics.p2.createCollisionGroup();

  // Setup spring node.
  springNode = game.add.sprite(200, 45);
  game.physics.p2.enable(springNode, true, true);
  springNode.body.setRectangle(10,10);
  springNode.body.static = true;
  springNode.body.setCollisionGroup(cg.brush);

  // Setup brush
  brush = game.add.sprite(200, 100, 'brush');
  brush.name = 'brush';
	game.physics.p2.enable(brush);
  brush.body.setCollisionGroup(cg.brush);

  // Setup brush physics.
  var spring = game.physics.p2.createSpring(springNode, brush, 50, 10, 1, null, null, [0,5],[0,0]);
  var pConstraint = game.physics.p2.createPrismaticConstraint(springNode, brush, true,[0,5],[0,-50],[0,1]);
  pConstraint.upperLimitEnabled = true;
  pConstraint.upperLimit = -0.1;

  // Setup scroll collision group.
  cg.scroll = game.physics.p2.createCollisionGroup();

  // Setup scroll.
  scroll = game.add.sprite(200, 300, 'scroll');
  scroll.name = 'scroll';
	game.physics.p2.enable(scroll);
  scroll.body.setCollisionGroup(cg.scroll);

  // Setup scroll physics.
  scroll.body.kinematic = true;

  // Handle brush-scroll collision.
  scroll.body.collides(cg.brush);
  //brush.body.collides(cg.scroll, hitScroll, this);
  brush.body.collides(cg.scroll);
  scroll.body.onBeginContact.add(onScrollContact);

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

function hitScroll(bodyA, bodyB) {
  console.log('hs', bodyA.data.id, bodyB.data.id);
}

function onScrollContact() {
  console.log('osc');
}

