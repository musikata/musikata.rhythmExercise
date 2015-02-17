Phaser = require('Phaser');


var brush;

window.addEventListener("load", function() {
  window.game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
});

function preload() {
  game.stage.backgroundColor = '#DDDDDD';

  game.load.image('brush', '/images/brush.png');
}



function create() {
  // Initialize physics.
	game.physics.startSystem(Phaser.Physics.P2JS);

  var x = 200;
  var brushY = 150;

  // Setup brush
  brush = game.add.sprite(x, brushY, 'brush');
	game.physics.p2.enable(brush);
  brush.body.y += brush.height/2;

  // Setup brush node.
  var brushNode = game.add.sprite(x, brushY-1);
  brushNode.width = brushNode.height = 1;
  game.physics.p2.enable(brushNode, true, true);
  brushNode.body.static = true;

  // Setup revolution constraint
  var brushAnchor = [0, -1 * brush.height/2.0];
  var brushNodeAnchor = [0, brushNode.height/2.0];
  var revolute = game.physics.p2.createRevoluteConstraint(brush, brushAnchor, brushNode, brushNodeAnchor);
  window.r = revolute;
  revolute.setLimits(-Math.PI/2, Math.PI/2);

  game.input.onDown.add(onDown);
}


function update() {
}

function render() {
}

function onDown() {
  brush.body.force.x = 1e5;
}

