class Monster {
  constructor(x, y, speed) {
    this.x = 0
    this.y = 0
    this.homeX = 0
    this.homeY = 0
    this.setXY(x, y);
    this.speed = speed;
    this.isDefeated = false;
  }

  randomizeSpawn() {
    let rx, ry;
    const minDelta = 1
    const maxDelta = 2
    const edge = 0.3 
    switch (randint(1, 4)) {
      case 1: // North Attack
        rx = randint(-CANVAS_WIDTH*minDelta, CANVAS_WIDTH*maxDelta)
        ry = randint(-CANVAS_HEIGHT*minDelta, -CANVAS_HEIGHT*edge)
        break;
      case 2: // East Attack
        rx = randint(CANVAS_WIDTH*(1+edge), maxDelta*CANVAS_WIDTH)
        ry = randint(-CANVAS_HEIGHT*minDelta, CANVAS_HEIGHT*maxDelta)
        break;
      case 3: // South Attack
        rx = randint(-CANVAS_WIDTH*minDelta, CANVAS_WIDTH*maxDelta)
        ry = randint(CANVAS_HEIGHT*(1+edge), CANVAS_HEIGHT*maxDelta)
        break;
      case 4: // West Attack
        rx = randint(-CANVAS_HEIGHT*maxDelta, -CANVAS_HEIGHT*edge)
        ry = randint(-CANVAS_HEIGHT*minDelta, CANVAS_HEIGHT*maxDelta)
        break;
      default:
        break;
    }
    // 1 -- 400w
    // x -- 600w
    let mnVel = Math.ceil(CANVAS_WIDTH/400)
    this.speed = randint(mnVel, mnVel+1)
    console.log(`[Randomized] x=${rx}, y=${ry}, speed=${this.speed}`)
    this.setXY(rx, ry)
  }

  setXY(newX, newY) {
    this.x = newX
    this.y = newY
    this.homeX = newX
    this.homeY = newY
  }

  goBack() {
    this.moveTo(this.homeX, this.homeY, false, true)
  }

  inRadius(centerX, centerY, radius) {
    return Math.sqrt(Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2)) <= radius
  }

  moveTo(destinationX, destinationY, doShake=true, faster=false) {
    const dx = destinationX - this.x;
    const dy = destinationY - this.y;

    const a = Math.atan(dy/dx);

    const distance = Math.sqrt(dx*dx + dy*dy);

    const vx = dx / distance;
    const vy = dy / distance;

    const step = (faster ? CANVAS_WIDTH/50 : this.speed);

    const stepX = vx * step;
    const stepY = vy * step;

    // Shake it up, tonight! Shake it up, all night! 
    var shakeX, shakeY;

    if (doShake) { 
        // YOU THINK COS AMD SIN ARE USELESS!?
        shakeX = randint(2, 3)*cos(randbool() ? a-pi/2 : a+pi/2) 
        shakeY = randint(2, 3)*sin(randbool() ? a-pi/2 : a+pi/2)
    } else { 
        shakeX = 0
        shakeY = 0
    }

    this.x += stepX + shakeX;
    this.y += stepY + shakeY;

    // evilY = evilY - randint(1,3) + 1.1*sin(randfloat(0, 3.14));
    // evilX = evilX + randint(1,2) - 1.1*cos(randfloat(-1.57, 1.57));

    // console.log(`Monster moved to (${this.x}, ${this.y})`);
  }
}