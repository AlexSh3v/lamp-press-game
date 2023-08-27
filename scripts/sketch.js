
const pi = 3.14159265359;
var level
var isLight = true;
var CANVAS_SIZE = 600;
var CANVAS_WIDTH = CANVAS_SIZE;
var CANVAS_HEIGHT = CANVAS_SIZE;


// game mobs & images
let DEBUG = false
let lamp;
let lampWhiteImage;
let lampDarkImage;

let solarPanel;
let solarPanelWhiteImage;
let solarPanelBlackImage;

let heartBlackImage;
let thermometorWhite;
let batteryImage;
let battery2Image;

let weakEyesImage
let wingsEyesImage
let panzerEyesImage
let batteryEyesImage

let millis = 0;

let eyesImage;

let barGroup;
let healthBar;
let heatBar;
let solarPanelChargeBar;

let performedClicks = 0;
let freezeClicks = false;
let freezingTime = 0;

// Box collisions
let lampHitLightBoxCollision = new BoxCollision(.45, .615, 0.1, 0.063)
let weakEyesBoxCollision = new BoxCollision(0, 0, 0.125, 0.075)
let wingsEyesBoxCollision = new BoxCollision(0, 0, 0.125, 0.075)
let panzerEyesBoxCollision = new BoxCollision(0, 0, 0.125, 0.075)
let batteryEyesBoxCollision = new BoxCollision(0, 0, 0.125, 0.075)

let mySound;
let panner;
function preload() {
  lampWhiteImage = loadImage('assets/pics/white_lamp.png');
  lampDarkImage = loadImage('assets/pics/black_lamp.png');
  solarPanelWhiteImage = loadImage('assets/pics/solar_panel_white.png')
  solarPanelBlackImage = loadImage('assets/pics/solar_panel_black.png')
  eyesImage = loadImage('assets/pics/evil_eyes.png');
  mySound = loadSound('assets/mus/tu.mp3');
  heartBlackImage = loadImage('assets/pics/heart_black.png')
  heartWhiteImage = loadImage('assets/pics/heart_white.png')
  batteryImage = loadImage('assets/pics/battery.png')
  battery2Image = loadImage('assets/pics/battery2.png')
  weakEyesImage = loadImage('assets/pics/evil_eyes.png')
  wingsEyesImage = loadImage('assets/pics/eyes_wings.png')
  panzerEyesImage = loadImage('assets/pics/eyes_panzer.png')
  batteryEyesImage = loadImage('assets/pics/eyes_battery.png')
  thermometorWhite = loadImage('assets/pics/thermometer_white.png')
  thermometorBlack = loadImage('assets/pics/thermometer_black.png')
}

function randint(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randfloat(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function randbool() {
  return randint(0, 1) == 1;
}


function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(60);
  pixelDensity(2)
  level = new Level1();
  healthBar = new StatusBar()
  healthBar.color = [232, 0, 0] // #e80000
  heatBar = new StatusBar()
  heatBar.value = 0
  heatBar.threshold = 50
  solarPanelChargeBar = new StatusBar()
  solarPanelChargeBar.color = [0, 102, 255] // #0066ff
  solarPanelChargeBar.value = 0
  barGroup = new BarGroup(
    0.03 * CANVAS_WIDTH, 0.95 * CANVAS_HEIGHT,
    [healthBar, heatBar, solarPanelChargeBar],
    [Mob.dico(heartBlackImage, heartWhiteImage), Mob.dico(thermometorBlack, thermometorWhite), Mob.dico(solarPanelBlackImage, solarPanelWhiteImage)]
  )
  barGroup.icoSize = 35
  barGroup.gapX = 30 

  mySound.setVolume(1.0); // Set sound volume   
  panner = new p5.Panner3D(); // Create a new Panner3D object   
  panner.process(mySound); // Connect the sound to the panner   
  panner.set(0, 0, 0); // Set initial position of the sound (at the center of the canvas) 

  let lampX = CANVAS_WIDTH / 2 - CANVAS_WIDTH / 4
  let deskY = CANVAS_HEIGHT * 0.6975
  lamp = new Mob(lampWhiteImage, lampX, deskY, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
  solarPanel = new Mob(solarPanelWhiteImage, lampX - CANVAS_WIDTH / 10, deskY, CANVAS_WIDTH / 5, CANVAS_HEIGHT / 5)

  setupOnClicks()

  level.onMonsters((monster) => monster.randomizeSpawn())

  textSize(16)
}

function setupOnClicks() {
  lampHitLightBoxCollision.onClick = () => { switchMode() }
}

function draw() {
  millis += deltaTime;

  freezingTime += deltaTime;

  // if (frameCount % 300 == 0)
  // mySound.play(); // Start playing the sound      
  let posX = map(mouseX, 0, width, -1, 1); // Map mouse x position to range -1 to 1   
  let posY = map(mouseY, 0, height, -1, 1); // Map mouse y position to range -1 to 1   
  panner.set(posX, posY, -1); // Set position of the sound using panner.set() function 

  background((isLight) ? 255 : 0);
  // Lamp
  lamp.image = (isLight) ? lampDarkImage : lampWhiteImage
  lamp.draw()
  // Solar Panel
  solarPanel.image = (isLight) ? solarPanelBlackImage : solarPanelWhiteImage
  solarPanel.draw()
  // Desk
  fill((isLight) ? 0 : 255);
  rect(0, CANVAS_HEIGHT * 0.6875, CANVAS_WIDTH, CANVAS_WIDTH * 0.025);

  // Monsters
  level.onMonsters((monster) => {
    if (!isLight) {
      if (monster.scared && millis - monster.startScaredMs < monster.durationScaredMs) {
        monster.goBack(true, true)
      } else {
        if (monster.scared && !monster.isVisible()) {
          console.log(`[MONSTER] respawning after scarying away ${monster.x} ${monster.y}`)
          return monster.randomizeSpawn()
        }
        monster.scared = false
        monster.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      }
    } else {
      monster.goBack();
    }
    if (monster.inRadius(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0.125 * CANVAS_WIDTH))
      healthBar.decreasePerFrame()
    monster.draw()
  });

  // Delay of 3sec before player can use light again
  // TODO: extract freeze duration!
  if (freezeClicks && freezingTime >= 5000) {
    freezeClicks = false;
    freezingTime = 0;
    console.log(`FREEZE cause by Clicks is over!`);
  }

  // UI:
  if (isLight) {
    solarPanelChargeBar.k = level.incK
    solarPanelChargeBar.increasePerFrame()

    if (heatBar.isReachedMaximum) {
      switchMode(true)
      heatBar.color = [75,75,75] // #0a4200
    }
    else 
      heatBar.color = isLight? [0,0,0] : [255,255,255] // #55e800
    heatBar.k = 50
    heatBar.increasePerFrame()
  } else {
    solarPanelChargeBar.k = level.decK
    solarPanelChargeBar.decreasePerFrame()
    if (!heatBar.isReachedMaximum && !freezeClicks)
      heatBar.color = isLight? [0,0,0] :  [255,255,255] // #55e800
    else if (freezeClicks)
      heatBar.color = [75,75,75] // #0a4200
    heatBar.k = 300
    heatBar.decreasePerFrame()
  }

  healthBar.color = isLight? [0,0,0] : [255,255,255]
  solarPanelChargeBar.color = isLight? [0,0,0] : [255,255,255]

  barGroup.draw()
  // heatBar.draw()
  // healthBar.draw()

  fill(isLight ? 0 : 255)
  text(`Level ${level.N}`, CANVAS_WIDTH * 0.85, CANVAS_HEIGHT * .05)


  if (DEBUG)
    debug()
}

function debug() {
  lampHitLightBoxCollision.draw()
  level.onMonsters((monster) => {
    monster.boxCollision.draw([255, 0, 0])
  });
}

function isCanvasClearOfEnemies() {
  let isClear = true
  level.onMonsters((monster) => {
    if (monster.isVisible()) {
      isClear = false
      return 'break'
    }
  })
  if (isClear)
    console.log(`Canvas Clear!`)
  else
    console.log(`Not Clear! Monster in sight!`)
  return isClear
}

function switchMode(force = false) {

  if (heatBar.isReachedMaximum && !force) {
    console.log(`FREEZE cause by Heat!`);
    return
  }

  // Player performed to much clicks so freeze him on few frames
  // and make light off
  if (freezeClicks && !force) {
    isLight = false;
    console.log(`NAH! FREEZING DUE TO CLICKS!!!`);
    return
  }

  // Disable clicks when enemies in the area when light is on
  if (isLight && !isCanvasClearOfEnemies() && !force) {
    console.log(`CANNOT! ENEMIES IN SIGHT!`);
    return;
  }

  if (!force) {
    performedClicks++;
    // TODO: extract `5` & `5000` from here!
    if (!freezeClicks && performedClicks >= 5 && freezingTime < 5000) {
      freezeClicks = true;
      freezingTime = 0;
      performedClicks = 0;
      isLight = false;
      console.log(`FREEZE FUCKING NOW!`)
      return;
    } else if (freezingTime > 5000) {
      freezingTime = 0;
      performedClicks = 0;
    }
  }

  isLight = !isLight

  if (isLight) {
    level.onMonsters((monster) => {
      monster.scared = true
    })
  } else {
    level.onMonsters((monster) => {
      if (randbool())
        monster.randomizeSpawn()
    })
  } 
}

function mousePressed() {
  level.onMonsters((monster) => {
    if (monster.boxCollision.hasCollision(mouseX, mouseY)) {
      console.log("MONSTER GO AWAY !!");
      monster.boxCollision.onClick()
      monster.isDefeated = true
      monster.setScared()
      return 'break'
    }
  });
}

function mouseClicked() {
  if (lampHitLightBoxCollision.hasCollision(mouseX, mouseY))
    lampHitLightBoxCollision.onClick()

}

function keyPressed() {
  if (keyCode == 32) {// Space
    switchMode()
  }
  if (key == "D") DEBUG = !DEBUG
}

function windowResized() {
  // TODO: resize dynamically
  //   resizeCanvas(windowWidth, windowHeight);
}
