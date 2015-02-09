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


    m2 = game.add.sprite(200, 250, 'mushroom');
    m2.name = 'm2';

    window.g = game;
    window.m2 = m2;

    game.physics.enable(m2);
    //m1.body.gravity.set(0, 180);

    m2.body.immovable = true;

    /*
    m1 = game.add.sprite(200, 150, 'mushroom');
    m1.name = 'm1';
    game.physics.enable(m1);
    window.m1 = m1;
    m1.body.bounce.set(1);

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
    */

}

var bullets = [];
nextShotAt = 0;
shotDelay = 100;
function fire() {
  if (nextShotAt > game.time.now) {
    return;
  }

  nextShotAt = game.time.now + shotDelay;

   var bullet = game.add.sprite(200, 150, 'mushroom');
   game.physics.enable(bullet, Phaser.Physics.ARCADE);
   bullet.body.gravity.set(0, 180);
   bullet.body.bounce.set(1);
   //bullet.body.velocity.y = -500;
   bullets.push(bullet);
}

function update() {

    for (var i = 0; i < bullets.length; i++) {
      game.physics.arcade.collide(bullets[i], m2, collisionHandler, null, this);
    }
    //game.physics.arcade.collide(m1, m2, collisionHandler, null, this);

    if (game.input.keyboard.isDown(Phaser.Keyboard.Z) ||
        game.input.activePointer.isDown) {
      fire();
    }


  /*
    if (game.input.activePointer.isDown) {
      console.log("speed: ", game.input.speed);
    }
    */

}

function collisionHandler (obj1, obj2) {
  metronome.playNote();
  obj1.body.velocity.x = 75;
}

function render() {

}
