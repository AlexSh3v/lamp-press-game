class Monster {
  constructor(img, boxCollision) {
    this.image = img
    this.boxCollision = boxCollision
    this.x = -1000
    this.y = -1000
    this.homeX = -1000
    this.homeY = -1000
    this.isDefeated = false;
    this.scared = false
    this.startScaredMs = 0
    this.durationScaredMs = 1000

    this.fasterStepK = 1
    this.stepK = 10
    this.shakeK = 25
    // this.boxCollision = new BoxCollision(0,0,0.125,0.075)
  }

  setScared() {
    this.scared = true
    this.startScaredMs = millis
  }

  randomizeSpawn() {
    let rx, ry;
    const minDelta = 0.4
    const maxDelta = 1.2
    const edge = 0.3
    switch (randint(1, 4)) {
      case 1: // North Attack
        rx = randint(-CANVAS_WIDTH * minDelta, CANVAS_WIDTH * maxDelta)
        ry = randint(-CANVAS_HEIGHT * minDelta, -CANVAS_HEIGHT * edge)
        break;
      case 2: // East Attack
        rx = randint(CANVAS_WIDTH * (1 + edge), maxDelta * CANVAS_WIDTH)
        ry = randint(-CANVAS_HEIGHT * minDelta, CANVAS_HEIGHT * maxDelta)
        break;
      case 3: // South Attack
        rx = randint(-CANVAS_WIDTH * minDelta, CANVAS_WIDTH * maxDelta)
        ry = randint(CANVAS_HEIGHT * (1 + edge), CANVAS_HEIGHT * maxDelta)
        break;
      case 4: // West Attack
        rx = randint(-CANVAS_HEIGHT * maxDelta, -CANVAS_HEIGHT * edge)
        ry = randint(-CANVAS_HEIGHT * minDelta, CANVAS_HEIGHT * maxDelta)
        break;
      default:
        break;
    }
    // 1 -- 400w
    // x -- 600w
    console.log(`[Randomized] x=${rx}, y=${ry}`)
    this.setXY(rx, ry)
  }

  isVisible() {
    let inX = 0 <= this.x && this.x <= CANVAS_WIDTH
    let inY = 0 <= this.y && this.y <= CANVAS_HEIGHT
    return inX && inY
  }

  setXY(newX, newY) {
    this.x = newX
    this.y = newY
    this.homeX = newX
    this.homeY = newY
  }

  goBack(doShake = false, faster = true) {
    this.moveTo(this.homeX, this.homeY, doShake, faster)
  }

  inRadius(centerX, centerY, radius) {
    return Math.sqrt(Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2)) <= radius
  }

  moveTo(destinationX, destinationY, doShake = true, faster = false) {
    const dx = destinationX - this.x;
    const dy = destinationY - this.y;

    const a = Math.atan(dy / dx);

    const distance = Math.sqrt(dx * dx + dy * dy);

    const vx = dx / distance;
    const vy = dy / distance;

    const step = (faster ? deltaTime / this.fasterStepK : deltaTime / this.stepK)

    const stepX = vx * step;
    const stepY = vy * step;

    // Shake it up, tonight! Shake it up, all night! 
    var shakeX, shakeY;

    if (doShake) {
      // YOU THINK COSs AMD SINs ARE USELESS!?
      shakeX = deltaTime / this.shakeK * randint(2, 3) * cos(randbool() ? a - pi / 2 : a + pi / 2)
      shakeY = deltaTime / this.shakeK * randint(2, 3) * sin(randbool() ? a - pi / 2 : a + pi / 2)
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

  draw() {
    this.boxCollision.set(this.x, this.y)
    image(this.image, this.x, this.y, 0.125 * CANVAS_WIDTH, 0.075 * CANVAS_HEIGHT)
  }
}


class WeaklyEyes extends Monster {
  constructor() {
    super(weakEyesImage, weakEyesBoxCollision.copy())
    this.fasterStepK = 1
    this.stepK = 10
    this.shakeK = 30
  }
}
