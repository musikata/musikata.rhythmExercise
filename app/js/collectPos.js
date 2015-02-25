Phaser = require('Phaser');
metronome = require('./metronome');

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update });

function preload() {
}

window.data = [];

function create() {
}

function update() {
  var ptr = game.input.activePointer;
  if (ptr.isDown) {
    data.push({
      t: game.time.time,
      y: ptr.y,
      yDown: ptr.positionDown.y,
      timeDown: ptr.timeDown,
    });
  }
}
