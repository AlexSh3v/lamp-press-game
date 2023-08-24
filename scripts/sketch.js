
const pi = 3.14159265359;
var level = 1;
var isLight = true;
var CANVAS_WIDTH  = 600;
var CANVAS_HEIGHT = 600;

let lampWhite;
let lampDark;
let eyes;
let monster = new Monster(randint(-100, 500), 450, 2)
let healthBar = new StatusBar(250, 20)
let chargeBar = new StatusBar(250, 40)
let monsters = [];
let evilX = 150;
let evilY = 450;
let speed = 4;


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

    // if (!isLight) {
    //     // Legendary code!
    //     // evilY = evilY - randint(1,3) + 1.1*sin(randfloat(0, 3.14)); 
    //     // evilX = evilX + randint(1,2) - 1.1*cos(randfloat(-1.57, 1.57));
    //     monster.moveTo(CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    // } else {
    //     monster.goBack();
    // }
    // if (monster.inRadius(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 0.125*CANVAS_WIDTH))
    //     healthBar.discharge()
    // image(eyes, monster.x, monster.y, 0.125*CANVAS_WIDTH, 0.075*CANVAS_HEIGHT)


    // UI:
    if (isLight) {
        chargeBar.discharge()
    } else {
        chargeBar.charge()
    }

    chargeBar.draw()
    healthBar.draw()

}

function switchMode() {
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

        monster.randomizeSpawn()
        // monster.setXY(randint(-100, 500), -20)
        // monster.speed = 10
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
