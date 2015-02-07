Phaser = require('Phaser');
metronome = require('./metronome');

console.log('yo');

//window.addEventListener("load", function(){ metronome.play()});

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('mushroom', '/images/mushroom2.png');

}

var sprite1;
var sprite2;
var speeds = [];

function create() {

    game.input.recordPointerHistory = true;
    game.input.recordRate = 5;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';


    m1 = game.add.sprite(200, 150, 'mushroom');
    m1.name = 'm1';

    m2 = game.add.sprite(200, 250, 'mushroom');
    m2.name = 'm2';

    window.g = game;
    window.m1 = m1;
    window.m2 = m2;

    game.physics.enable(m1);
    game.physics.enable(m2);
    m1.body.bounce.set(1);
    //m1.body.gravity.set(0, 180);

    m2.body.immovable = true;

    m1.inputEnabled = true;
    m1.input.enableDrag(true);
    m1.body.collideWorldBounds = true;

    m1.events.onDragStart.add(function() {
      console.log('start');
      m1.body.moves = false;
    });

    m1.events.onDragStop.add(function() {
      console.log('stop');
      m1.body.moves = true;
      m1.body.velocity.y = 150;
    });

}

function update() {

    game.physics.arcade.collide(m1, m2, collisionHandler, null, this);

  /*
    if (game.input.activePointer.isDown) {
      console.log("speed: ", game.input.speed);
    }
    */

}

function collisionHandler (obj1, obj2) {
  metronome.playNote();
}

function render() {

    game.debug.body(m1);
    game.debug.body(m2);

}
