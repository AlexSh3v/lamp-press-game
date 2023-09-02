
const pi = 3.14159265359;
var level
var isGameOver = false
var isLight = true;
var isPaused = false;
var multiCursor;
var CANVAS_SIZE = 600;
var CANVAS_WIDTH = CANVAS_SIZE;
var CANVAS_HEIGHT = CANVAS_SIZE;
var damageRangeCircle;
var touchRangeCircle; 


// game mobs & images
let DEBUG = false
let cursorWhite, cursorBlack, cursorDeadEye;
let perkCursorsWhite, perkCursorsBlack;
let lamp;
let lampWhiteImage;
let lampDarkImage;
let pauseButton;
let onLightChangeCallbacks = []

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

let fingerprintBlackImage, fingerprintWhiteImage;

let millis = 0;
let gameOverStartMs = 0;

let eyesImage;

let barGroup;
let healthBar;
let heatBar;
let solarPanelChargeBar;
let multicursorBar;

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
  // mySound = loadSound('assets/mus/tu.mp3');
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
  cursorWhite = loadImage('assets/pics/cursor_white.png')
  cursorBlack = loadImage('assets/pics/cursor_black.png')
  cursorDeadEye = loadImage('assets/pics/cursor_dead_eye.png')
  perkCursorsWhite = loadImage('assets/pics/perk_cursors_white.png')
  perkCursorsBlack = loadImage('assets/pics/perk_cursors_black.png')
  // fingerprintBlackImage = loadImage('assets/pics/fingerprint_black.png' )
  // fingerprintWhiteImage = loadImage('assets/pics/fingerprint_white.png')
}

function adaptForScreen(callback) {
  CANVAS_SIZE = Math.min(windowWidth, 600)
  CANVAS_WIDTH = CANVAS_SIZE
  CANVAS_HEIGHT = CANVAS_SIZE
  console.log(`CANVAS: ${CANVAS_SIZE}x${CANVAS_SIZE}`);
  callback(CANVAS_WIDTH, CANVAS_HEIGHT)
} 

function isMobileDevice() {
  return /Mobi/i.test(navigator.userAgent);
}

function setup() {
  onLightChangeCallbacks.push((theme) => {
    // cursor(isLight? 'assets/pics/fingerprint_black.png' : 'assets/pics/fingerprint_white.png', 32*441/827, 32*512/827)
    cursor(isLight? 'assets/pics/cursor_black.png' : 'assets/pics/cursor_white.png')
  })
  damageRangeCircle = new Circle(0.5, 0.65, 0.01)
  touchRangeCircle = new Circle(0,0,0.02)
  
  adaptForScreen((w, h) => { createCanvas(w, h) })

  frameRate(60);
  pixelDensity(2)
  multiCursor = new Multicursor()
  level = new Level1();
  healthBar = new StatusBar()
  healthBar.color = [232, 0, 0] // #e80000
  heatBar = new StatusBar()
  heatBar.value = 0
  heatBar.threshold = 50
  solarPanelChargeBar = new StatusBar()
  solarPanelChargeBar.color = [0, 102, 255] // #0066ff
  solarPanelChargeBar.value = 0
  multicursorBar = new StatusBar()
  multicursorBar.threshold = 25
  multicursorBar.value = 0
  multicursorBar.boxCollision = new BoxCollision()
  multicursorBar.boxCollision.onClick = () => {
    if (multicursorBar.value > multicursorBar.threshold || multiCursor.isActivated)
      multiCursor.isActivated = !multiCursor.isActivated
  } 
  barGroup = new BarGroup(
    0.03, 0.95,
    [healthBar, heatBar, solarPanelChargeBar, multicursorBar],
    [
      Mob.dico(heartBlackImage, heartWhiteImage), 
      Mob.dico(thermometorBlack, thermometorWhite), 
      Mob.dico(solarPanelBlackImage, solarPanelWhiteImage),
      Mob.dico(perkCursorsBlack, perkCursorsWhite)
    ]
  )

  // mySound.setVolume(1.0); // Set sound volume   
  // panner = new p5.Panner3D(); // Create a new Panner3D object   
  // panner.process(mySound); // Connect the sound to the panner   
  // panner.set(0, 0, 0); // Set initial position of the sound (at the center of the canvas) 

  lamp = new Mob(lampWhiteImage, 0.25, 0.6975, 0.5, 0.5)
  pauseButton = new Mob(batteryImage, 0.05, 0.1, 0.1, 0.1)
  solarPanel = new Mob(solarPanelWhiteImage, 0.2, 0.6975, 0.2, 0.2)

  setupOnClicks()

  level.onMonsters((monster) => monster.randomizeSpawn())

  textSize(16)

  callOnLightChangeCallbacks(true)
}

function setupOnClicks() {
  lampHitLightBoxCollision.onClick = () => { switchMode() }
}

function drawGameOver() {
  if (solarPanelChargeBar.value == 100) {
    background(0,0,0, 200)
    push()
    fill(255)
    textSize(38)
    textAlign(CENTER)
    text(`Ты победил Уровень ${level.N}!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5)
    pop()
    if(isGameOver) {
      push()
      noFill();
      stroke(255);
      strokeWeight(5);
      let v = map(millis-gameOverStartMs, 0, 3000, -PI/2, 3*PI/2, true)
      arc(
        CANVAS_WIDTH*0.5, CANVAS_HEIGHT*0.6, 
        0.1*CANVAS_WIDTH, 0.1*CANVAS_HEIGHT, -PI/2, v, OPEN
      )
      pop()
      if (millis - gameOverStartMs < 3000) {
        return false
      }
      push()
      textSize(18)
      fill(255)
      textAlign(CENTER)
      text(`Нажми, чтобы начать следующий уровень!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.75)
      pop()
      return false
    }
    isGameOver = true
    gameOverStartMs = millis
    return false
  }

  if (healthBar.value == 0) {
    background(0,0,0, 150)
    push()
    fill(255)
    textSize(48)
    textAlign(CENTER)
    text(`Ты проиграл!)`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5)
    pop()
    if(isGameOver) {
      push()
      noFill();
      stroke(255);
      strokeWeight(5);
      let v = map(millis-gameOverStartMs, 0, 3000, -PI/2, 3*PI/2, true)
      arc(
        CANVAS_WIDTH*0.5, CANVAS_HEIGHT*0.6, 
        0.1*CANVAS_WIDTH, 0.1*CANVAS_HEIGHT, -PI/2, v, OPEN
      )
      pop()
      if (millis - gameOverStartMs < 3000) {
        return false
      }
      push()
      textSize(18)
      textAlign(CENTER)
      text(`Нажми, чтобы начать заново!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.75)
      pop()
      return false
    }
    isGameOver = true
    gameOverStartMs = millis
    return false
  }

  return true
}

function drawGame() {
  // if (frameCount % 300 == 0)
  // mySound.play(); // Start playing the sound      
  // let posX = map(mouseX, 0, width, -1, 1); // Map mouse x position to range -1 to 1   
  // let posY = map(mouseY, 0, height, -1, 1); // Map mouse y position to range -1 to 1   
  // panner.set(posX, posY, -1); // Set position of the sound using panner.set() function 

  // Background screen
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
  level.onMonsters((monster) => { monster.draw() });
}

function drawGameUI() {
  // Status bar: health, heat, energy ...
  barGroup.draw()
  // Draw fps & level
  fill(isLight ? 0 : 255)
  textSize(16)
  text(`Level ${level.N}`, CANVAS_WIDTH * 0.85, CANVAS_HEIGHT * .05)
  text(`${Math.round(frameRate())} FPS`, 10, 20)
  // Draw buttons
  // pauseButton.draw()
}

function drawMainUI() {
  // Simple circle around 
  // push()
  // if (isLight)
  //   fill(0, 50)
  // else
  //   fill(255, 50)
  // noStroke()
  // circle(mouseX, mouseY, 50)
  // pop()
  if (multiCursor.isActivated) {
    multiCursor.draw()
  }
  
  // TODO: use image instead of cursor
  // image(
  //   isLight ? fingerprintBlackImage ? fingerprintWhiteImage,
  // )

}

function updatePositions() {
    // Movement of monsters
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
          monster.moveTo(lamp.x+0.4*lamp.width, lamp.y - 0.2*lamp.height);
        }
      } else {
        monster.goBack();
      }
      if (damageRangeCircle.hasInterception(monster.boxCollision)) {
        if (monster.isReadyToHit())
          healthBar.decrease(monster.damagePerHit)
      }
    });

  // Actions on `Multicursor` ability
  if (multiCursor.isActivated) {
    multicursorBar.decreasePerFrame()
    if (multicursorBar.value == 0)
      multiCursor.isActivated = false
  }
  if (!multiCursor.isActivated && multicursorBar.value <= multicursorBar.threshold)  
    multicursorBar.color = [75,75,75] // #4b4b4b
  else
    multicursorBar.color = isLight? [0,0,0] : [255,255,255] // #fff

  // Delay of 3sec before player can use light again
  // TODO: extract freeze duration!
  if (freezeClicks && freezingTime >= 5000) {
    freezeClicks = false;
    freezingTime = 0;
    console.log(`FREEZE cause by Clicks is over!`);
  }    
  
  // Bars
  if (isLight) {
    solarPanelChargeBar.k = level.incK
    solarPanelChargeBar.increasePerFrame()
    if (heatBar.isReachedMaximum) {
      switchMode(true)
      heatBar.color = [75,75,75] // #0a4200
    } else {
      heatBar.color = isLight? [0,0,0] : [255,255,255] // #55e800
    }
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
}

function draw() {
  millis += deltaTime;
  freezingTime += deltaTime;

  drawGame()
  drawGameUI()
  drawGameOver()
  if (!isGameOver && !isPaused) {
    updatePositions()
  }

  if (DEBUG)
    debug()

  drawMainUI()
}

function debug() {
  push()
  noFill()
  stroke(isLight?0:255)
  strokeWeight(5)
  circle(mouseX, mouseY, multiCursor.radius*2)
  fill(255,0,0,50)
  circle(
    damageRangeCircle.x, 
    damageRangeCircle.y, 
    damageRangeCircle.radius*2
  )
  if (isMobileDevice())
    circle(
      touchRangeCircle.x,
      touchRangeCircle.y,
      touchRangeCircle.radius*2
    )
  pop()
  lampHitLightBoxCollision.draw()
  multicursorBar.boxCollision.draw()
  level.onMonsters((monster) => {
    monster.boxCollision.draw([255, 0, 0])
  });
  pauseButton.boxCollision.draw()
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
    callOnLightChangeCallbacks(false)
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
      callOnLightChangeCallbacks(false)
      console.log(`FREEZE FUCKING NOW!`)
      return;
    } else if (freezingTime > 5000) {
      freezingTime = 0;
      performedClicks = 0;
    }
  }

  isLight = !isLight
  callOnLightChangeCallbacks(isLight)

  if (isLight) {
    level.onMonsters((monster) => {
      monster.scared = true
    })
  } else {
    level.onMonsters((monster) => {
      monster.randomizeSpawn()
    })
  } 
}

function mousePressed() {
  if (isGameOver || isPaused) 
    return
  touchRangeCircle.x = mouseX
  touchRangeCircle.y = mouseY
  level.onMonsters((monster) => {
    let isInterceptingMulticursor = (
      multiCursor.isActivated &&
      hasInterception(multiCursor, monster.boxCollision)
    )
    let isTouched = (
      isMobileDevice() &&
      hasInterception(touchRangeCircle, monster.boxCollision)
    )
    if (isInterceptingMulticursor || monster.boxCollision.hasCollision(mouseX, mouseY) || isTouched) {
      console.log("MONSTER GO AWAY !!");
      monster.boxCollision.onClick()
      monster.setScared()
      if (monster.scared) {
        multicursorBar.increase()
        monster.isDefeated = true
      }
      if (isInterceptingMulticursor)
        return
      return 'break'
    }
  });
}

function mouseClicked() {
  if (isGameOver && millis - gameOverStartMs > 3000) {
    if (solarPanelChargeBar.value == 100)
      switch (level.N) {
        case 1: level = new Level2()
          break;
        case 2: level = new Level3()
          break;
        case 3: level = new Level4()
          break;
        case 4: level = new Level5()
          break;
        case 5: level = new Level6()
          break;
        case 6: level = new Level7()
          break;
        case 7: //level = new Level7()
          break;
        default: level = new Level1()
          break;
      }
    else level = new Level1()

    isLight = true
    callOnLightChangeCallbacks(true)
    performedClicks = 0
    freezeClicks = false
    isGameOver = false
    healthBar.value = 100
    heatBar.value = 0
    solarPanelChargeBar.value = 0
    return;
  }

  if (isGameOver) 
    return;

  if (pauseButton.boxCollision.hasCollision(mouseX, mouseY)) {
    // isPaused = true
    // return;
  }


  if (multicursorBar.boxCollision.hasCollision(mouseX, mouseY))
    multicursorBar.boxCollision.onClick()

  // FIXME: check 2 rect interceptions
  let isClickable = true 
  level.onMonsters(monster => {
    if (monster.boxCollision.hasCollision(lampHitLightBoxCollision.x, lampHitLightBoxCollision.y)) {
      console.log(`111111111111111111111111111!!!`);
      isClickable = false
      return 'break'
    }
  })
  if (isClickable && lampHitLightBoxCollision.hasCollision(mouseX, mouseY))
    lampHitLightBoxCollision.onClick()

}

function keyPressed() {
  if (keyCode == 32) {// Space
    switchMode()
  }
  if (key == "D") DEBUG = !DEBUG
  if (key == "]") {
    solarPanelChargeBar.value = 100
    isGameOver = true
  }
  if (key == "[") {
    solarPanelChargeBar.value = 100
    level.N = level.N - 1
    isGameOver = true
  }
}

function windowResized() {
  adaptForScreen((w, h) => { resizeCanvas(w, h) })
}

function callOnLightChangeCallbacks(v) {
  isLight = v
  onLightChangeCallbacks.forEach(callback => { callback(v) });
}