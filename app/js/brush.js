Phaser = require('Phaser');
var metronome = require('./metronome');
var postal = require('postal');

console.log('yo');


window.addEventListener("load", function() {
  window.game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
});

var beatEvents = [0, 1, 2, 3];
var beatLength = .05;
var bpm = 60;
var spb = 60/bpm;
var audioEvents = {};
var audioEventWindow = spb/2.0;

window.beatEventsToAudioEvents = function() {
  var audioNow = audioCtx.currentTime;
  beatEvents.forEach(function(beatEvent) {
    var id;
    var tag;
    var start = audioNow + (spb * beatEvent);
    var end = start + beatLength;

    // Start event.
    tag = 'beat.start';
    id = tag + ':' + start;
    audioEvents[id] = {
      id: id,
      tags: [tag],
      time: start,
    };

    // End event.
    tag = 'beat.end';
    id = tag + ':' + end;
    audioEvents[id] = {
      id: id,
      tags: [tag],
      time: end,
    };
  });
}

// Process collection of audio events.
function processAudioEvents() {
  var audioNow = audioCtx.currentTime;

  for (var id in audioEvents) {
    var evt = audioEvents[id];
    var dt = evt.time - audioNow;
    if (Math.abs(dt) < audioEventWindow){
      processAudioEvent(evt, audioNow, dt);
    } else if (dt < (-1 * audioEventWindow)) {
      console.log("removing ", id);
      processAudioEvent(evt, audioNow, dt, true);
      delete audioEvents[id];
    }
  };
}

// Process a single audio event.
function processAudioEvent(evt, audioNow, dt, removing) {
  evt.tags.forEach(function(tag) {
    if (removing) {
      tag += '.removing';
    }
    postal.publish({
      channel: 'audio',
      topic: tag,
      data: {
        audioNow: audioNow,
        dt: dt,
        evt: evt
      }
    });
  });
}

function preload() {
  game.stage.backgroundColor = '#DDDDDD';

  game.load.image('brush', '/images/brush.png');
  game.load.image('scroll', '/images/scroll.png');
}


function create() {

  // Initialize physics.
	game.physics.startSystem(Phaser.Physics.P2JS);

  game.teacherSprites = addScrollAndBrush({x: 100});
  game.playerSprites = addScrollAndBrush({x: 300, hasSpring: true});

  game.input.onDown.add(onDown);

  // Update teacher brush on audio events.
  var brushStartY = game.teacherSprites.brush.body.y;
  var brushEndY = game.teacherSprites.scroll.body.y - game.teacherSprites.brush.height/2;
  var brushYRange = brushEndY - brushStartY;
  var brushSub = postal.subscribe({
    channel: "audio",
    topic: "beat.start",
    callback: function(data, envelope) {
      // Parameterize t in terms of audioEventWindow (-1 to 1)
      var t = data.dt/audioEventWindow;

      // Update brush pos based on parameterized t.
      //var yOffset = brushYRange * Math.cos(Math.PI/2 * Math.abs(t));
      var yOffset = brushYRange * (Math.pow(1-Math.abs(t),2));
      game.teacherSprites.brush.body.y = brushStartY + yOffset;
    }
  });

  var brushSubRemoving = postal.subscribe({
    channel: "audio",
    topic: "beat.start.removing",
    callback: function(data, envelope) {
      game.teacherSprites.brush.body.y = brushStartY;
    }
  });

  // Setup audio events.
  beatEventsToAudioEvents();
}

function update() {
  processAudioEvents();
  game.teacherSprites.brush.body.force.y = 0;
  game.teacherSprites.brush.body.velocity.y = 0;
}

function render() {
}

function addScrollAndBrush(opts) {
  opts = opts || {};

  var x = opts.x;
  var springY = opts.springY || 150;
  var scrollY = opts.scrollY || 300;
  var springLen = opts.springLen || 50;
  var springK = opts.springK || 10;
  var damping = opts.damping || 1;
  var hasSpring = opts.hasSpring || false;

  // Setup brush
  var brush = game.add.sprite(x, springY, 'brush');
	game.physics.p2.enable(brush);
  brush.body.y += brush.height/2;
  brush.body.fixedRotation = true;

  // Setup scroll.
  var scroll = game.add.sprite(x, scrollY, 'scroll');
	game.physics.p2.enable(scroll);

  // Setup brush spring.
  var springNode = game.add.sprite(x, springY);
  springNode.width = springNode.height = 1;
  game.physics.p2.enable(springNode, true, true);
  springNode.body.static = true;

  var springNodeAnchor = [0,0];
  var brushAnchor = [0, -1 * brush.height/2.0];

  var pConstraint = game.physics.p2.createPrismaticConstraint(springNode, brush, true, springNodeAnchor, brushAnchor,[0,1]);
  pConstraint.upperLimitEnabled = true;
  pConstraint.upperLimit = -0.1;

  if (hasSpring) {
    var spring = game.physics.p2.createSpring(springNode, brush, springLen, springK, damping, null, null, springNodeAnchor, brushAnchor);
  }

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
  //metronome.playNote();
}

function onDown() {
/*
  var playerBrush = game.playerSprites.brush;
  playerBrush.body.force.y = 1e5;
  */
beatEventsToAudioEvents();
}

