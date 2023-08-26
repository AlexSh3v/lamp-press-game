
const pi = 3.14159265359;
var level = 1;
var isLight = true;
var CANVAS_SIZE = 500;
var CANVAS_WIDTH  = CANVAS_SIZE;
var CANVAS_HEIGHT = CANVAS_SIZE;


// game mobs & images
let DEBUG = true
let lamp;
let lampWhiteImage;
let lampDarkImage;

let solarPanel;
let solarPanelWhiteImage;
let solarPanelBlackImage;

let heartImage;
let heatImage;
let batteryImage;
let battery2Image;

let millis = 0;

let eyesImage;

let barGroup;
let healthBar; 
let heatBar;
let solarPanelChargeBar;

let monsters = [];
let evilX = 150;
let evilY = 450;
let speed = 4;
let performedClicks = 0;
let freezeClicks = false;
let freezingTime = 0;

// Box collisions
let lampHitLightBoxCollision = new BoxCollision(.45, .615, 0.1, 0.063)

let mySound;
let panner;
function preload() {
   lampWhiteImage = loadImage('assets/pics/white_lamp.png');
   lampDarkImage = loadImage('assets/pics/black_lamp.png');
   solarPanelWhiteImage = loadImage('assets/pics/solar_panel_white.png')
   solarPanelBlackImage = loadImage('assets/pics/solar_panel_black.png')
   eyesImage = loadImage('assets/pics/evil_eyes.png');
   mySound = loadSound('assets/mus/tu.mp3');
   heartImage = loadImage('assets/pics/heart.png')
   batteryImage = loadImage('assets/pics/battery.png')
   battery2Image = loadImage('assets/pics/battery2.png')
   // TODO: add heat image
   heatImage = undefined
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

    healthBar = new StatusBar()
    healthBar.color = [232, 0, 0] // #e80000
    heatBar = new StatusBar()
    heatBar.value = 0
    heatBar.threshold = 50
    heatBar.k = 50
    solarPanelChargeBar = new StatusBar()
    solarPanelChargeBar.color = [0, 102, 255] // #0066ff
    barGroup = new BarGroup(
        0.01*CANVAS_WIDTH, 0.05*CANVAS_HEIGHT, 
        [healthBar, heatBar, solarPanelChargeBar], 
        [Mob.ico(heartImage), Mob.ico(battery2Image), Mob.dico(solarPanelBlackImage, solarPanelWhiteImage)]
    )

    solarPanelChargeBar = new StatusBar()

    mySound.setVolume(1.0); // Set sound volume   
    panner = new p5.Panner3D(); // Create a new Panner3D object   
    panner.process(mySound); // Connect the sound to the panner   
    panner.set(0, 0, 0); // Set initial position of the sound (at the center of the canvas) 

    let lampX = CANVAS_WIDTH/2 - CANVAS_WIDTH/4
    let deskY = CANVAS_HEIGHT*0.6975
    console.log(`Desky = ${deskY}`)
    lamp = new Mob(lampWhiteImage, lampX, deskY, CANVAS_WIDTH/2, CANVAS_HEIGHT/2)
    solarPanel = new Mob(solarPanelWhiteImage, lampX-CANVAS_WIDTH/10, deskY, CANVAS_WIDTH/5, CANVAS_HEIGHT/5)

    setupOnClicks()
}

function setupOnClicks() {
    lampHitLightBoxCollision.onClick = () => { switchMode() }
}

function draw() {
    millis += deltaTime;

    freezingTime += deltaTime;

    if (frameCount % 1000 == 0)
        level++;
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
    rect(0, CANVAS_HEIGHT*0.6875, CANVAS_WIDTH, CANVAS_WIDTH*0.025);

    // Monsters
    monsters.forEach(m => {
        if (!isLight) {
            if (m.scared && millis - m.startScaredMs < m.durationScaredMs) {
                m.goBack(true, true)
            } else {
                m.scared = false
                m.moveTo(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
            }
        } else {
            m.goBack();
        }
        if (m.inRadius(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 0.125*CANVAS_WIDTH))
            healthBar.decreasePerFrame()
        m.draw()
    });

    // UI:
    if (isLight) {
        if (heatBar.isReachedMaximum) {
            isLight = false
            heatBar.color = [10, 66, 0] // #0a4200
        }
        else heatBar.color = [85, 232, 0] // #55e800
        heatBar.increasePerFrame()
    } else {
        if (!heatBar.isReachedMaximum) 
            heatBar.color = [85, 232, 0] // #55e800
        if (freezeClicks)
            heatBar.color = [10, 66, 0] // #0a4200
        heatBar.decreasePerFrame()
    }

    barGroup.draw()
    // heatBar.draw()
    // healthBar.draw()


    if (DEBUG) 
        debug()
}

function debug() {
    lampHitLightBoxCollision.draw()
    monsters.forEach(monster => {
        monster.boxCollision.draw([255, 0, 0])
    });
}

function isCanvasClearOfEnemies() {
    for (let i = 0; i < monsters.length; i++){
        let monster = monsters[i]
        let inX = 0 <= monster.x && monster.x <= CANVAS_WIDTH
        let inY = 0 <= monster.y && monster.y <= CANVAS_HEIGHT
        if (inX && inY) {
            console.log(`monster! in: index=${i} x=${monster.x} y=${monster.y} ${monster}`)
            return false
        }
    }
    return true
}

function switchMode() {

    if (heatBar.isReachedMaximum) {
        console.log(`FREEZE cause by heat!`);
        return 
    }

    // Delay of 3sec before player can use light again
    if (freezeClicks && freezingTime >= 3000) {
        freezeClicks = false;
        freezingTime = 0;
        console.log(`FREEZE over!`);
    }

    // Player performed to much clicks so freeze him on few frames
    // and make light off
    if (freezeClicks) {
        isLight = false;
        console.log(`NAH! FREEZING!!!`);
        return 
    }

    // Disable clicks when enemies in the area when light is on
    if (isLight && !isCanvasClearOfEnemies()) {
        console.log(`ENEMIES IN SIGHT!`);
        return;
    }

    performedClicks++;
    // console.log(`CLICKS=${performedClicks} FREEZETIME=${freezingTime/1000}sec`)
    if (!freezeClicks && performedClicks >= 5 && freezingTime < 5000) {
        freezeClicks = true;
        freezingTime = 0;
        performedClicks = 0;
        isLight = false;
        console.log(`FREEZE!`)
        return;
    } else if (freezingTime > 5000) {
        freezingTime = 0;
        performedClicks = 0;
    }

    isLight = !isLight
    
    if (!isLight) {

        if (2*level > monsters.length) {
            for (let n = monsters.length; n < 2*level; n++) {
                let m = new Monster(0,0,0)
                m.boxCollision.onClick = () => {
                    m.scared = true
                    m.startScaredMs = millis
                }
                m.randomizeSpawn()
                monsters.push(m)
            }
        } else if (2*level < monsters.length) {
            for (let n = monsters.length; n > 2*level; n--) {
                monsters.pop() // FIXME: check -> work?
            }
        } else {
            monsters.forEach(m => {
                m.randomizeSpawn()
            });
        }

    }
}

function mouseClicked() {
    
    let triggered = false
    monsters.forEach(m => {
        if (m.boxCollision.hasCollision(mouseX, mouseY)) {
            console.log("MONSTER BACK!");
            m.boxCollision.onClick()
            triggered = true
        }
    });

    if (!triggered && lampHitLightBoxCollision.hasCollision(mouseX, mouseY)) 
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
