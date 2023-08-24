
const pi = 3.14159265359;
var level = 1;
var isLight = true;
var CANVAS_WIDTH  = 600;
var CANVAS_HEIGHT = 600;

let lampWhite;
let lampDark;
let eyes;
let healthBar = new StatusBar(250, 20)
let chargeBar = new StatusBar(250, 40)
let monsters = [];
let evilX = 150;
let evilY = 450;
let speed = 4;
let performedClicks = 0;
let freezeClicks = false;
let freezingTime = 0;


let mySound;
let panner;
function preload() {
   lampWhite = loadImage('assets/pics/lamp_white.jpg');
   lampDark = loadImage('assets/pics/lamp_dark.jpg');
   eyes = loadImage('assets/pics/evil_eyes.png');
   mySound = loadSound('assets/mus/tu.mp3');
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
    imageMode(CENTER);
    healthBar.color = [232, 0, 0] // #e80000
    mySound.setVolume(1.0); // Set sound volume   
    panner = new p5.Panner3D(); // Create a new Panner3D object   
    panner.process(mySound); // Connect the sound to the panner   
    panner.set(0, 0, 0); // Set initial position of the sound (at the center of the canvas) 
}

function draw() {

    freezingTime += deltaTime;

    if (frameCount % 1000 == 0)
        level++;
    // if (frameCount % 300 == 0)
        // mySound.play(); // Start playing the sound      
    let posX = map(mouseX, 0, width, -1, 1); // Map mouse x position to range -1 to 1   
    let posY = map(mouseY, 0, height, -1, 1); // Map mouse y position to range -1 to 1   
    panner.set(posX, posY, -1); // Set position of the sound using panner.set() function 

    background((isLight) ? 255 : 0);
    fill((isLight) ? 0 : 255);
    // Lamp
    image((isLight) ? lampWhite : lampDark, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, CANVAS_WIDTH/2, CANVAS_HEIGHT/2,);
    // Desk
    rect(0, CANVAS_HEIGHT*0.6875, CANVAS_WIDTH, CANVAS_WIDTH*0.025);

    // Monsters
    monsters.forEach(m => {
        if (!isLight) {
            m.moveTo(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        } else {
            m.goBack();
        }
        if (m.inRadius(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 0.125*CANVAS_WIDTH))
            healthBar.discharge()
        image(eyes, m.x, m.y, 0.125*CANVAS_WIDTH, 0.075*CANVAS_HEIGHT)
    });

    // UI:
    if (isLight) {
        if (freezeClicks)
            chargeBar.color = [18, 117, 0] // #127500
        else chargeBar.color = [85, 232, 0] // #55e800
        chargeBar.discharge()
    } else {
        chargeBar.charge()
    }

    chargeBar.draw()
    healthBar.draw()

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
    
    if ((0 <= mouseX && mouseX <= CANVAS_WIDTH) && (0 <= mouseY && mouseY <= CANVAS_HEIGHT)) 
        switchMode()

}

function keyPressed() {
    if (keyCode == 32) {// Space
        switchMode()
    }
}

function windowResized() {
    // TODO: resize dynamically
//   resizeCanvas(windowWidth, windowHeight);
}
