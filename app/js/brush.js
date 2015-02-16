Phaser = require('Phaser');
var metronome = require('./metronome');
var postal = require('postal');

console.log('yo');


window.addEventListener("load", function() {
  window.game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
});

var totalBeats = 4;
var defaultNotes = [0, 1, 2, 2.5, 3];
var noteEvents = [];
var bpm = 60;
var spb = 60/bpm;
var defaultNoteLen = 1/32;
var audioEvents = {};
var audioEventWindow = spb/2.0;
var audioDelay = 1;
var isBouncing = false;
var bounceHeight = 30;
var bounceParameters = {};



window.notesToAudioEvents = function(notes) {

  // Format note as object if provided as number.
  for (var i=0; i < notes.length; i++) {
    var note = notes[i];
    if (typeof(note) == 'number') {
      note = notes[i] = {start: note}
    }

    // Set note end if not provided.
    if (! note.end) {
      note.end = note.start + defaultNoteLen;
    }
  }

  notesToNoteEvents(notes);
  noteEventsToAudioEvents();
}

window.noteEventsToAudioEvents = function() {
  var audioNow = audioCtx.currentTime + audioDelay;

  noteEvents.forEach(function(noteEvent) {
    var audioT = audioNow + (spb * noteEvent.t);

    var evtData = {noteEvent: noteEvent};

    var isNoteEvent = noteEvent.tags && (
      (noteEvent.tags.indexOf('note.start') > -1) ||
      (noteEvent.tags.indexOf('note.end') > -1));
    if (isNoteEvent) {
      //TODO:  schedule audio here.
    }

    var isBounceEvent = noteEvent.tags && (
      noteEvent.tags.indexOf('bounce.start') > -1);
    if (isBounceEvent) {
      var bounceParameters = {
        start: audioNow + (spb * noteEvent.bounce.start),
        end: audioNow + (spb * noteEvent.bounce.end)
      };
      bounceParameters.radius = (bounceParameters.end - bounceParameters.start)/2.0;
      bounceParameters.middle = bounceParameters.start + bounceParameters.radius;
      evtData.bounceParameters = bounceParameters;
    }

    if (! audioEvents[audioT]) {
      audioEvents[audioT] = [];
    }
    audioEvents[audioT].push({
      tags: noteEvent.tags,
      t: audioT,
      data: evtData
    });
  });
}

window.notesToNoteEvents = function(notes) {
  if (notes.length < 1) {
    return;
  }

  noteEvents = [];
  var firstNote = notes[0];
  var lastNote = notes[notes.length - 1];

  // Start bouncing at beat 0.
  noteEvents.push({
    tags: ['bouncing.toggle'],
    t: 0
  });

  // Initial bounce.
  var firstBounceStart = lastNote.end - totalBeats;
  noteEvents.push({
    tags: ['bounce.start'],
    t: firstBounceStart,
    bounce: {
      start: firstBounceStart,
      end: firstNote.start
    }
  });

  // Notes.
  for (var i=0; i < notes.length-1; i++) {
    var currentNote = notes[i];
    var nextNote = notes[i+1];

    noteEvents.push({
      tags: ['note.start'],
      t: currentNote.start,
    });

    noteEvents.push({
      tags: ['note.end'],
      t: currentNote.end
    });

    noteEvents.push({
      tags: ['bounce.start'],
      t: currentNote.end,
      bounce: {
        start: currentNote.end,
        end: nextNote.start
      }
    });
  }
  
  // Ending bounce.
  noteEvents.push({
    tags: ['bounce.start'],
    t: lastNote.end,
    bounce: {
      start: lastNote.end,
      end: firstNote.start + totalBeats
    }
  });

  // Stop bouncing.
  noteEvents.push({
    tags: ['bouncing.toggle'],
    t: totalBeats
  });
}

// Process collection of audio events.
// This is run on every update loop.
function processAudioEvents() {
  if (audioEvents.length < 1 ){
    return;
  }

  var audioNow = audioCtx.currentTime;

  for (var audioT in audioEvents) {
    var isActive = (audioT <= audioNow);
    if (isActive) {
      var evts = audioEvents[audioT];
      evts.forEach(function(evt) {
        processAudioEvent(evt, audioNow);
      });
      console.log("removing ", audioT);
      delete audioEvents[audioT];
    };
  }
}

function processAudioEvent(evt, audioNow) {
  console.log('processing: ', evt);
  evt.tags.forEach(function(tag) {
    postal.publish({
      channel: 'audio',
      topic: tag,
      data: {
        audioNow: audioNow,
        evtData: evt.data
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
  var bouncingSub = postal.subscribe({
    channel: "audio",
    topic: "bouncing.toggle",
    callback: function(data, envelope) {
      console.log('on bouncing.toggle');
      isBouncing = ! isBouncing;
    }
  });

  var bounceSub = postal.subscribe({
    channel: "audio",
    topic: "bounce.start",
    callback: function(data, envelope) {
      console.log('on bouncing.start');
      bounceParameters = data.evtData.bounceParameters;
      bounceParameters.height = bounceHeight * (2*bounceParameters.radius)/spb;
    }
  });

  // Setup audio events.
  notesToAudioEvents(defaultNotes);
  console.log('ae: ', audioEvents);
}

function update() {
  processAudioEvents();

  // Update teacher brush if bouncing.
  if (isBouncing) {
    var audioT = audioCtx.currentTime;

    // Parameterize time in terms of current bounce parameters.
    var t = (audioT - bounceParameters.middle)/bounceParameters.radius;
    t = Math.max(-1, t);
    t = Math.min(1, t);

    // Update brush pos based on parameterized t.
    var yOffset = bounceParameters.height * (1 - Math.pow(t,2));
    if (yOffset && t) {
      var scrollTop = game.teacherSprites.scroll.body.y - game.teacherSprites.scroll.height/2;
      game.teacherSprites.brush.body.y = scrollTop - yOffset - game.teacherSprites.brush.height/2;
    }
  }

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
  notesToAudioEvents(defaultNotes);
}

