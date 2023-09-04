class Multicursor {
  constructor() {
    this._isActivated = false
    this.rRadius = .18
    this.tempRadius = 0.01
    this.a = 0
    this.speed = 720

    this.startAnimationMs = -1
    this.animationDurationMs = 900
  }

  safeDisable() {
    this._isactivated = false
  }

  get isActivated() { return this._isActivated }
  set isActivated(v) {
    this.startAnimationMs = millis
    this._isActivated = v
  }

  get x() {return mouseX}
  get y() {return mouseY}
  get radius() { return this.rRadius * CANVAS_SIZE }

  draw() {

    if (this.startAnimationMs == -1)
      return 

    if (!this.isActivated && millis-this.startAnimationMs > this.animationDurationMs) 
      return;
    
    let c = isLight? cursorWhite : cursorBlack
    let parts = 10
    let w = 25
    let h = 25

    // FIXME: bad OOP design
    if (multicursorBar.value >= 40)
      this.speed = map(multicursorBar.value, 100, 40, 2, 100)
    else
      this.speed = map(multicursorBar.value, 40, 0, 100, 1080, true) 

    let r 
    if (this.isActivated)
      r = map(millis-this.startAnimationMs, 0, this.animationDurationMs, 0, this.radius, true)
    else
      r = map(millis-this.startAnimationMs, 0, this.animationDurationMs, this.radius, 0, true)

    console.log(`SPEED!: ${this.speed}`);
    push()
    // tint(255,50)
    translate(mouseX, mouseY)
    for(let a = 0; a <= 2*PI; a += 2*PI/parts) {
      // YALL 3D!!!
      // let x = this.radius*cos(a+this.a)
      // let y = this.radius*sin(a)
      let x = r*cos(a+this.a)
      let y = r*sin(a+this.a)
      image(c, x, y, w, h)
      image(c, x*.5, y*.5, w, h)
      image(c, x*.75, y*.75, w, h)
      // console.log(`FAKECURS: ${x} ${y} `);
    }
    pop()
    this.a += 2*PI/this.speed
  }
}


class DeadEye {
  constructor() {
    this._isActivated = false
    this.threshold = 25
    this.value = 0
    this.boxCollision = new BoxCollision()

    // Effect values
    this.startEffectMs = -1
    this.durationEffectMs = 400
    this.mode = 0
    this.effectValue = 0
  }

  safeDisable() {
    this._isactivated = false
  }

  get isActivated() { return this._isActivated }
  set isActivated(v) {
    this.startEffectMs = millis
    if (!v) {
      this.mode = -1
      this.reservedEffectValue = this.effectValue
    } else {
      this.mode = 0 
    }
    this._isActivated = v
  }

  drawEffect() {

    if (!this.isActivated && millis-this.startEffectMs > this.durationEffectMs || this.startEffectMs == -1)
      return

    push() 
    if (this.mode == 0) {
      this.effectValue = map(millis-this.startEffectMs, 0, this.durationEffectMs, 0, 150, true)
      if (this.effectValue == 150) {
        this.mode = 1
        this.startEffectMs = millis
      }
    } else if (this.mode == 1) {
      this.effectValue = map(millis-this.startEffectMs, 0, this.durationEffectMs*4, 150, 175, true)
      if (this.effectValue == 175) {
        this.mode = 2
        this.startEffectMs = millis
      }
    } else if (this.mode == 2) {
      this.effectValue = map(millis-this.startEffectMs, 0, this.durationEffectMs*4, 175, 150, true)
      if (this.effectValue == 150) {
        this.mode = 1
        this.startEffectMs = millis
      }
    } else { // this.mode == -1
      this.effectValue = map(millis-this.startEffectMs, 0, this.durationEffectMs, this.reservedEffectValue, 0, true)
    }
    // let color = getDynamicColorArray(v, [0, 0, 0], )
    console.log(`EFFECT!: mode=${this.mode} effectval=${this.effectValue}`);
    background(220, 110, 20, this.effectValue)
    pop()
  }
}