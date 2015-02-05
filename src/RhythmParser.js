function RhythmParser() {
}

RhythmParser.prototype = {
  /**
   * Convert beat events to timeEvents.
   **/
  toTimeEvents: function(opts) {
    var timeEvents = [];
    var startTime = opts.startTime || 0;
    var spb = 60.0/opts.bpm; //secondPerBeat

    opts.beatEvents.forEach(function(beatEvent, idx) {
      var beatTime = startTime + (beatEvent * spb);
      timeEvents.push(beatTime);
    });

    return timeEvents;
  }
};
