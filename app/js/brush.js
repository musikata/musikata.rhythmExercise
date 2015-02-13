Phaser = require('Phaser');
var metronome = require('./metronome');

console.log('yo');

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
  game.stage.backgroundColor = '#DDDDDD';

  game.load.image('brush', '/images/brush.png');
  game.load.image('scroll', '/images/scroll.png');
}


function create() {

  // Initialize physics.
	game.physics.startSystem(Phaser.Physics.P2JS);

  game.teacherSprites = addScrollAndBrush({x: 100});
  game.playerSprites = addScrollAndBrush({x: 300});

  game.input.onDown.add(onDown);
}

function update() {
}

function render() {
}

function addScrollAndBrush(opts) {
  opts = opts || {};

  var x = opts.x;
  var springY = opts.springY || 50;
  var scrollY = 300;
  var springLen = opts.springLen || 50;
  var springK = opts.springK || 10;
  var damping = opts.damping || 1;

  // Setup spring node.
  var springNode = game.add.sprite(x, springY);
  game.physics.p2.enable(springNode, true, true);
  springNode.body.static = true;

  // Setup brush
  var brush = game.add.sprite(x, springY, 'brush');
	game.physics.p2.enable(brush);

  // Setup scroll.
  var scroll = game.add.sprite(x, scrollY, 'scroll');
	game.physics.p2.enable(scroll);

  // Setup brush physics.
  var springNodeAnchor = [0,0];
  var brushAnchor = [0, -1 * brush.height/2.0];
  var spring = game.physics.p2.createSpring(springNode, brush, springLen, springK, damping, null, null, springNodeAnchor, brushAnchor);
  var pConstraint = game.physics.p2.createPrismaticConstraint(springNode, brush, true, springNodeAnchor, brushAnchor,[0,1]);
  pConstraint.upperLimitEnabled = true;
  pConstraint.upperLimit = -0.1;

  // Setup scroll physics.
  scroll.body.kinematic = true;

  // Handle brush-scroll collision.
  scroll.body.onBeginContact.add(onScrollContact);

  return {
    brush: brush,
    scroll: scroll
  };
}

function onScrollContact() {
  console.log('osc');
  metronome.playNote();
}

function onDown() {
  var playerBrush = game.playerSprites.brush;
  playerBrush.body.force.y = 1e5;
}

