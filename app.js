// const config = {
//     type: Phaser.AUTO, // Which renderer to use
//     width: 800, // Canvas width in pixels
//     height: 600, // Canvas height in pixels
//     parent: "game-container", // ID of the DOM element to add the canvas to
//     scene: {
//       preload: preload,
//       create: create,
//       update: update
//     }
//   };
  
//   const game = new Phaser.Game(config);
  
//   function preload() {
//     // Runs once, loads up assets like images and audio
//   }
  
//   function create() {
//     // Runs once, after all assets in preload are loaded
//   }
  
//   function update(time, delta) {
//     // Runs once per frame for the duration of the scene
//   }

//config
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    scene: {
        preload,
        create,
        update
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y:0} //top down game so, no gravity
        }
    }
}

const game = new Phaser.Game(config);
let pelusa
let i = 0
const imgs = {
    back: "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/images/escheresque_dark.png",
    world: 'assets/marioWorld.png'
}
let controls
let cursors
let player

function preload(){
    // this.load.image("back", imgs.back)
    // this.load.image("mario-tiles", imgs.world)
    this.load.image('tiles', 'assets/world2.png')
    this.load.tilemapTiledJSON('map', 'https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/tuxemon-town.json')
    this.load.atlas("atlas", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png", "https://www.mikewesthad.com/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json")


}

function create(){

    //player

    player = this.physics.add.sprite(400, 350, "atlas", "misa-front")

    //

    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

    //parameters
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0)
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0)
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0)
    aboveLayer.setDepth(10)

    worldLayer.setCollisionByProperty({ collides: true });
    

     // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
  const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");


  //player
  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);

    this.physics.add.collider(player, worldLayer)

    const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1
  });

    //testing
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // worldLayer.renderDebug(debugGraphics, {
    //     tileColor: null, // Color of non-colliding tiles
    //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    //   });

    // const level = [
    //     [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
    //     [  0,   1,   2,   3,   0,   0,   0,   1,   2,   3,   0 ],
    //     [  0,   5,   6,   7,   0,   0,   0,   5,   6,   7,   0 ],
    //     [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
    //     [  0,   0,   0,  14,  13,  14,   0,   10,   0,   0,   0 ],
    //     [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ],
    //     [  0,   0,   0,   0,   0,  0,   0,   0,   0,   0,   0 ],
    //     [  0,   0,  14,  14,  14,  14,  14,   0,   0,   0,  15 ],
    //     [  0,   0,   0,   0,   0,   0,   0,   0,   0,  15,  15 ],
    //     [ 35,  36,  37,   0,   0,   0,   0,   0,  15,  15,  15 ],
    //     [ 39,  39,  39,  39,  39,  39,  39,  39,  39,  39,  39 ]
    // ]
    // const map = this.make.tilemap({data: level, tileWidth: 16, tileHeight:16})
    // const tiles = map.addTilesetImage('mario-tiles')
    // map.createStaticLayer(0, tiles, 0, 0) //layer index, tileset, x, y



    //camera system
    //const camera = this.cameras.main;

    const camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    cursors = this.input.keyboard.createCursorKeys()
    controls = new Phaser.Cameras.Controls.FixedKeyControl({
        camera,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    })
    camera.setBounds(0,0,map.widthInPixels,map.heightInPixels)

}

function update(time, delta){

    const speed = 175;
    const prevVelocity = player.body.velocity.clone();
    
    //move camera
    controls.update(delta)

    //player
    player.body.setVelocity(0)
     // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

    //normalizing
    player.body.velocity.normalize().scale(speed)
    //player.anims.play("misa-left-walk", true);
    //animations
    if (cursors.left.isDown) {
        player.anims.play("misa-left-walk", true);
      } else if (cursors.right.isDown) {
        player.anims.play("misa-right-walk", true);
      } else if (cursors.up.isDown) {
        player.anims.play("misa-back-walk", true);
      } else if (cursors.down.isDown) {
        player.anims.play("misa-front-walk", true);
      } else {
        player.anims.stop();
      }

          // If we were moving, pick and idle frame to use
    // if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    // else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    // else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    // else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");

}

