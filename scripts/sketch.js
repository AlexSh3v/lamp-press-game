var level
var isGameOver = false
var isLight = true;
var isPaused = false;
var isLampClickedWhenMonsterNearby = false
var multiCursor;
var CANVAS_SIZE = 600;
var CANVAS_WIDTH = CANVAS_SIZE;
var CANVAS_HEIGHT = CANVAS_SIZE;
var damageRangeCircle;
var touchRangeCircle; 

var relDeskY = 0.82
var relDeskHeight = 0.02

const DARK_RED = [232, 0, 0] // #e80000

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
let FREEZE_DURATION_MS = 10000
let UNDER_FREEZE_LIMIT_MS = 15000
let CLICKS_TO_FREEZE = 3

// Box collisions
let lampHitLightBoxCollision
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
  thermometorWhite = loadImage('assets/ui/thermometer_white.png')
  thermometorBlack = loadImage('assets/ui/thermometer_black.png')
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
  
  adaptForScreen((w, h) => { createCanvas(w, h) })

  frameRate(60);
  pixelDensity(2)
  multiCursor = new Multicursor()
  level = new Level1();
  healthBar = new StatusBar()
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
    0.05, 0.95,
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

  lamp = new BasicLamp()
  pauseButton = new Mob(batteryImage, 0.05, 0.1, 0.1, 0.1)
  solarPanel = new SolarPanel()

  lampHitLightBoxCollision = new BoxCollision(lamp.rx - 0.1/2, lamp.ry - 0.05 - 0.063/2, 0.1, 0.063)
  damageRangeCircle = new Circle(lamp.rx, lamp.ry - 0.05, 0.01)
  touchRangeCircle = new Circle(0,0,0.02)

  setupOnClicks()

  level.onMonsters((monster) => {
    spawnIt(monster)
  })

  dynamicFont(16)

  callOnLightChangeCallbacks(true)
}

function setupOnClicks() {
  lampHitLightBoxCollision.onClick = () => { switchMode() }
}

function drawGameOver() {
  if (solarPanelChargeBar.value == 100) {
    background(0,0,0, 150)
    push()
    fill(255)
    dynamicFont(38)
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
      dynamicFont(18)
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
    dynamicFont(48)
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
      dynamicFont(18)
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
  rect(0, CANVAS_HEIGHT * relDeskY, CANVAS_WIDTH, CANVAS_HEIGHT * relDeskHeight);
  // Monsters 
  level.onMonsters((monster) => { monster.draw() });
}

function drawGameUI() {
  // Status bar: health, heat, energy ...
  if (heatBar.value >= 90) 
    healthBar.color = DARK_RED
  barGroup.draw()
  // Draw fps & level
  fill(isLight ? 0 : 255)
  dynamicFont(22)
  textAlign(RIGHT)
  text(`Level ${level.N}`, CANVAS_WIDTH * 0.97, CANVAS_HEIGHT * .93)
  if (DEBUG) {
    textAlign(LEFT)
    text(`${Math.round(frameRate())} FPS`, CANVAS_WIDTH * 0.01, CANVAS_HEIGHT * 0.05)
  }
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
    let isHitting = false
    level.onMonsters((monster) => {
      if (!isLight) {
        if (monster.scared && millis - monster.startScaredMs < monster.durationScaredMs) {
          monster.goBack(true, true)
        } else {
          if (monster.scared && !monster.isVisible()) {
            return spawnIt(monster)
          }
          monster.scared = false
          monster.moveTo(
            damageRangeCircle.x - monster.width/2, 
            damageRangeCircle.y - monster.height/2
          );
        }
      } else {
        monster.goBack();
      }
      if (damageRangeCircle.hasInterception(monster.boxCollision)) {
        if (monster.isReadyToHit()) {
          healthBar.decrease(monster.damagePerHit)
          isHitting = true
        }
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

  // Disable freezing when time is over
  if (freezeClicks && freezingTime >= FREEZE_DURATION_MS) {
    freezeClicks = false;
    freezingTime = 0;
    console.log(`FREEZE cause by clicks is OVER!`);
  }    
  
  // Bars
  if (isLight) {
    solarPanelChargeBar.k = level.incK
    solarPanelChargeBar.increasePerFrame()
    if (heatBar.isReachedMaximum) {
      switchMode(true)
      heatBar.color = [75,75,75] // #0a4200
    } else {
      // TODO: move to utils.js 
      start_color = [0,0,0]  // RGB value for white (#000)
      end_color = [235, 109, 0]  // RGB value for the final color (#e36b02)
      
      // Calculate the color values based on the linear interpolation formula
      let v = map(heatBar.value, 80, 100, 0, 100, true)
      r = int(start_color[0] - ((start_color[0] - end_color[0]) * v / 100))
      g = int(start_color[1] - ((start_color[1] - end_color[1]) * v / 100))
      b = int(start_color[2] - ((start_color[2] - end_color[2]) * v / 100))
      
      // Convert the RGB color values to hexadecimal format
      heatBar.color = [r,g,b]
    }
    heatBar.k = 50
    heatBar.increasePerFrame()
  } else {
    solarPanelChargeBar.k = level.decK
    solarPanelChargeBar.decreasePerFrame()
    if (!heatBar.isReachedMaximum && !freezeClicks) {
      start_color = [255, 255, 255]  // RGB value for white (#ffffff)
      end_color = [255, 120, 3]  // RGB value for the final color (##ff7803)
      
      // Calculate the color values based on the linear interpolation formula
      let v = map(heatBar.value, 80, 100, 0, 100, true)
      r = int(start_color[0] - ((start_color[0] - end_color[0]) * v / 100))
      g = int(start_color[1] - ((start_color[1] - end_color[1]) * v / 100))
      b = int(start_color[2] - ((start_color[2] - end_color[2]) * v / 100))
      
      // Convert the RGB color values to hexadecimal format
      heatBar.color = [r,g,b]
    }
    else if (freezeClicks)
      heatBar.color = [75,75,75] // #0a4200
    heatBar.k = 300
    heatBar.decreasePerFrame()
  }
  if (isHitting)
    healthBar.color = DARK_RED
  else 
    healthBar.color = isLight? [0,0,0] : [255,255,255]
  solarPanelChargeBar.color = isLight? [0,0,0] : [255,255,255]

  if (heatBar.value >= 90) {
    healthBar.k = 500
    healthBar.decreasePerFrame()
  }
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
    if (monster.isVisible() && !(monster instanceof PanzerEyes)) {
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
    if (isLight)
      performedClicks++;
    if (!freezeClicks && performedClicks >= CLICKS_TO_FREEZE && freezingTime < UNDER_FREEZE_LIMIT_MS) {
      freezeClicks = true;
      freezingTime = 0;
      performedClicks = 0;
      isLight = false;
      callOnLightChangeCallbacks(false)
      console.log(`FREEZE FUCKING NOW!`)
      return;
    } else if (freezingTime > UNDER_FREEZE_LIMIT_MS) {
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
      if (monster instanceof PanzerEyes && monster.isVisible() && !monster.isDefeated)
        monster.unscare()
      else
        spawnIt(monster)
    })
  } 
}

function mousePressed() {
  if (isGameOver || isPaused) 
    return
  touchRangeCircle.x = mouseX
  touchRangeCircle.y = mouseY
  isLampClickedWhenMonsterNearby = false
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

      if (lampHitLightBoxCollision.hasCollision(mouseX, mouseY)) {
        isLampClickedWhenMonsterNearby = true
      }

      console.log("MONSTER GO AWAY !!");
      monster.boxCollision.onClick()
      monster.setScared()
      if (monster.scared) {
        multicursorBar.increase()
        monster.setDefeat()
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
        case 7: level = new Level8()
          break;
        case 8: level = new Level9()
          break;
        case 9: level = new Level10()
          break;
        case 10: level = new Level11()
          break;
        case 11: level = new Level12()
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

  let isClickable = true 
  level.onMonsters(monster => {
    if (areRectanglesIntercept(lampHitLightBoxCollision, monster.boxCollision)) {
      console.log(`Lamp is unclickable`);
      isClickable = false
      return 'break'
    }
  })
  if (isClickable && lampHitLightBoxCollision.hasCollision(mouseX, mouseY) && !isLampClickedWhenMonsterNearby) {
    lampHitLightBoxCollision.onClick()
    isLampClickedWhenMonsterNearby = false
  }

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

function spawnIt(monster) {
  const coord = level.getClearLocation(monster)
  monster.spawnAt(coord[0], coord[1])
}