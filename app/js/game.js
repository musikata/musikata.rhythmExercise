Phaser = require('Phaser');
metronome = require('./metronome');

console.log('yo');

window.addEventListener("load", function(){ metronome.play()});

var sprite1;
var sprite2;
var cursors;

var game = new Phaser.Game(400, 400, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var target = new Phaser.Point();
var lastElement;
var midElement;
var firstElement;
var isMoving = false;

function preload() {

    game.load.image('mushroom', '/images/mushroom2.png');
    game.load.spritesheet('chain','/images/chain.png',16,26);

}

function create() {

	//	Enable p2 physics
	game.physics.startSystem(Phaser.Physics.P2JS);

    createRope();

    //  Add 2 sprites which we'll join with a spring
  sprite1 = game.add.sprite(200, 200, 'mushroom');

	game.physics.p2.enable(sprite1);
  sprite1.body.kinematic = true;
  //sprite1.body.static= true;
  sprite1.body.data.gravityScale = 0;

  /*
	sprite2 = game.add.sprite(200, 200, 'mushroom');
	game.physics.p2.enable(sprite2);
  game.physics.p2.gravity.y = 300;
  game.physics.p2.restitution = 0.8;

  //var constraint = game.physics.p2.createDistanceConstraint(sprite1, sprite2, 200);

    var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', sprite2.body);
    var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game.physics.p2.setWorldMaterial(worldMaterial, false, true, true, true);

    //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
    //  those 2 materials collide it uses the following settings.
    //  A single material can be used by as many different sprites as you like.
    var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);

    contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
    contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    contactMaterial.surfaceVelocity = 0;  
    */

    game.input.onDown.add(function() {
      isMoving = true;
      accelerateToObject(lastElement,target,1000);
    }, this);
    game.input.onUp.add(function() {
      isMoving = false;
    }, this);
    game.input.addMoveCallback(move, this);

    game.physics.p2.gravity.y = 0;
}

function createRope(){
    if (lastElement){return;}
    var length=12;
    var xAnchor=200;
    var yAnchor=80;
    var height = 20;  //height for the physics body - your image height is 8px
    var width = 16;   //this is the width for the physics body.. if to small the rectangles will get scrambled together
    var maxForce =10000;  //the force that holds the rectangles together
    var midIdx = 4;
    for(var i=0; i<=length; i++){
        var x = xAnchor;                 // all rects are on the same x position
        var y = yAnchor+(i*height);               // every new rect is positioned below the last

        if (i%length == length-1){
          newElement= game.add.sprite(x, y, 'chain',0); 
        }
        else if (i == length || i == midIdx){
          newElement= game.add.sprite(x, y, 'mushroom'); 
          if (i == midIdx){
            midElement = newElement;
          }
        }
        else if (i == 0 ){
          newElement= game.add.sprite(x, y, 'chain',0);
          firstElement = newElement; 
        }
        else {
          newElement = game.add.sprite(x, y, 'chain',1); 
        }
       
        game.physics.p2.enable(newElement,false);      // enable physicsbody
        newElement.body.setRectangle(width,height);    //set custom rectangle 
        newElement.body.mass =  .1;
        newElement.body.data.gravityScale=0;
        if (i == 0){ newElement.body.kinematic = true;}
        if(lastElement){game.physics.p2.createRevoluteConstraint(newElement, [0,-10], lastElement, [0,10], maxForce);}
        lastElement = newElement;
    }; 
 firstElement.bringToTop();


 midElement.body.onBeginContact.add(function blockHit (body, shapeA, shapeB, equation) {
  if (body === sprite1.body) {
    console.log("whammo");
    metronome.playNote();
  }
 }, this);
}

function update() {
}


function accelerateToObject(obj1, obj2, speed) {
  if (typeof speed === 'undefined') { speed = 60; }
  var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
  obj1.body.force.x = Math.cos(angle) * speed;
  obj1.body.force.y = Math.sin(angle) * speed;
}

function move(pointer, x, y) {
  if (isMoving){
    target.setTo(x, y);
    accelerateToObject(lastElement,target,2000);
  }
}


function render() {

}
