describe("RhythmParser", function() {
  it("Converts beatEvents into timeEvents", function() {
    var rhythmParser = new RhythmParser();
    var beatEvents = [0,.25, .5, .75];
    var actualTimeEvents;
    var expectedTimeEvents;

    actualTimeEvents = rhythmParser.toTimeEvents({beatEvents: beatEvents, bpm: 60});
    expectedTimeEvents = [0, .25, .5, .75];
    expect(actualTimeEvents).toEqual(expectedTimeEvents);

    actualTimeEvents = rhythmParser.toTimeEvents({beatEvents: beatEvents, bpm: 120});
    expectedTimeEvents = [0, .125, .25, .375];
    expect(actualTimeEvents).toEqual(expectedTimeEvents);

  });
});
