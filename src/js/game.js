(function() {

  var game = new Phaser.Game(400, 400, Phaser.CANVAS, 'Rain Rhythm', { preload: preload, create: create , update: update});

  function preload() {
  }

  function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.gravity.y = 100;

    var cloud = game.add.bitmapData(200, 200);

    var cloudGradient = cloud.context.createLinearGradient(0,0,0,200);
    cloudGradient.addColorStop(0,"white");
    cloudGradient.addColorStop(1,"#0a68b0");
    cloud.context.fillStyle = cloudGradient;
    cloud.context.fillRect(0,0,200,200);

    var raindropBmd = game.add.bitmapData(10,10);
    raindropBmd.ctx.beginPath();
    raindropBmd.ctx.rect(0,0,10,10);
    raindropBmd.ctx.fillStyle = '#ffffff';
    raindropBmd.ctx.fill();

    cloudSprite = game.add.sprite(0, 0, cloud);
    raindropSprite = game.add.sprite(10, 215, raindropBmd);

    // Enable physics on those sprites
    game.physics.enable( [raindropSprite], Phaser.Physics.ARCADE);

    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);

  }

  function update() {
    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      console.log('yo');
    }
  }

})();
