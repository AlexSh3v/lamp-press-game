class Monster {
  constructor(img, boxCollision) {
    this.image = img
    this.boxCollision = boxCollision
    this.rx = -100
    this.ry = -100
    this.rHomeX = -100
    this.rHomeY = -100
    this.isDefeated = false;
    this.scared = false
    this.startScaredMs = 0
    this.durationScaredMs = 1000
    
    this.damageDelayMs = 2000
    this.damagePerHit = 1
    this._damagedDelayStartedMs = 0

    this.widthFactor = 200
    this.heightFactor = 100
    this.imageScaleFactor = 0.25 //  0.5 = 50%

    // FIXME: make movement relative to size of canvas also!!
    this.fasterStepK = 1
    this.stepK = 10
    this.shakeK = 25
    // this.boxCollision = new BoxCollision(0,0,0.125,0.075)
  }

  get x() { return this.rx * CANVAS_WIDTH }
  set x(v) { this.rx = v/CANVAS_WIDTH }
  get y() { return this.ry * CANVAS_WIDTH }
  set y(v) { this.ry = v/CANVAS_HEIGHT }
  get homeX() { return this.rHomeX * CANVAS_WIDTH }
  set homeX(v) { this.rHomeX = v/CANVAS_WIDTH }
  get homeY() { return this.rHomeY * CANVAS_HEIGHT }
  set homeY(v) { this.rHomeY = v/CANVAS_HEIGHT }

  get width() { return this.widthFactor * CANVAS_WIDTH }
  get height() { return this.heightFactor * CANVAS_HEIGHT }

  isReadyToHit() {
    let flag = false
    if (this._damagedDelayStartedMs == 0 || millis - this._damagedDelayStartedMs > this.damageDelayMs) {
      flag = true
      this._damagedDelayStartedMs = millis
      console.log(`Monster is ready to hit you at ${millis} ms!`);
    } 
    return flag
  }

  setScared() {
    this.scared = true
    this.startScaredMs = millis
  }
    
  getInitialLocation() {
    let rx,ry
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
    return [rx, ry]
  }

  spawnAt(rx, ry) {
    this.setXY(rx, ry)
    this.scared = false
    this.startScaredMs = 0
    this.setXY(rx, ry)
    console.log(`[New Spawn] x=${Math.round(this.x)}, y=${Math.round(this.y)}`)
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
      shakeX = deltaTime / this.shakeK * (deltaTime/randint(15, 20)) * cos(randbool() ? a - PI / 2 : a + PI / 2)
      shakeY = deltaTime / this.shakeK * (deltaTime/randint(15, 20)) * sin(randbool() ? a - PI / 2 : a + PI / 2)
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
    this.boxCollision.set(this.x, this.y, this.width, this.height)
    image(this.image, this.x, this.y, this.width, this.height)
    // image(this.image, this.x, this.y, 0.125 * CANVAS_WIDTH, 0.075 * CANVAS_HEIGHT)
  }
}


class WeaklyEyes extends Monster {
  constructor() {
    super(weakEyesImage, weakEyesBoxCollision.copy())
    this.fasterStepK = 1
    this.stepK = 10
    this.shakeK = 10
    this.widthFactor = 0.106 
    this.heightFactor = 0.065
    this.damageDelayMs = 2000
    this.damagePerHit = 1
  }

  getInitialLocation() {
    let rx = randint(-0.1*CANVAS_WIDTH - this.width, 1.1*CANVAS_WIDTH) 
    let ry = randint(-0.4*CANVAS_HEIGHT - this.height, -0.1*CANVAS_HEIGHT - this.height)
    return [rx, ry]
  }
}

class WingsEyes extends Monster {
  constructor() {
    super(wingsEyesImage, wingsEyesBoxCollision.copy())
    this.fasterStepK = 1
    this.stepK = 4  
    this.shakeK = 10
    this.widthFactor  = 256 * 0.3 / 600
    this.heightFactor = 108 * 0.3 / 600
    this.damageDelayMs = 500
    this.damagePerHit = 1
  }

  getInitialLocation() {
    let rx,ry
    switch (randint(2, 3)) {
      case 2: // East Attack
        rx = randint(1.1*CANVAS_WIDTH, 1.5*CANVAS_WIDTH)
        ry = randint(-0.1*CANVAS_HEIGHT - this.height, 0.3*CANVAS_HEIGHT)
        break;
      case 3: // South Attack
        rx = randint(-0.8*CANVAS_WIDTH - this.width, -0.1*CANVAS_WIDTH - this.width)
        ry = randint(-0.1*CANVAS_HEIGHT - this.height, 0.3*CANVAS_HEIGHT)
        break;
    }
    return [rx, ry]
  }
}

class PanzerEyes extends Monster {
  constructor() {
    super(panzerEyesImage, panzerEyesBoxCollision.copy())
    this.fasterStepK = 1.5
    this.stepK = 15
    this.shakeK = 10
    this.beforeScare = 0 
    this.widthFactor  = 256 * 0.3 / 600
    this.heightFactor = 225 * 0.3 / 600
    this.damageDelayMs = 3000
    this.damagePerHit = 10
  }
  getInitialLocation() {
    let rx = randint(-0.1*CANVAS_WIDTH - this.width, 1.1*CANVAS_WIDTH) 
    let ry = randint(-0.7*CANVAS_HEIGHT - this.height, -0.1*CANVAS_HEIGHT - this.height)
    return [rx, ry]
  }
  setScared() {
    if (++this.beforeScare < 3)
      return
    super.setScared()
  }
  spawnAt(rx, ry) {
    this.beforeScare = 0 
    return super.spawnAt(rx, ry)
  }
}