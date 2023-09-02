class Mob {
  constructor(img, rx, ry, rwidth, rheight, drawingVector) {
    // Understanding cornerVector:
    // (0, 0)       (-1, 0)
    //  * --------- *
    //  |           |
    //  |           |
    //  * --------- *
    // (0, -1)      (-1, -1)
    // 
    // Default: 0, -1
    // 
    // Q: Why negatives? 
    // A: Because drawing starting from top left corner.
    //    Therefore, corner is the relative vector to the drawing point.

    this.image = img
    this.whenDarkImag = undefined
    this.rx = rx
    this.ry = ry
    this.rwidth = rwidth
    this.rheight = rheight
    this._boxCollision = new BoxCollision(
      this.rx, this.ry, 
      this.rw, this.rh, 
    )
    if (drawingVector === undefined)
      this.drawingVector = createVector(0, -1)
    else 
      this.drawingVector = drawingVector

  }


  get x() { return this.rx * CANVAS_WIDTH }
  set x(v) { this.rx = v/CANVAS_WIDTH }
  get y() { return this.ry * CANVAS_WIDTH }
  set y(v) { this.ry = v/CANVAS_HEIGHT }
  get width() { return this.rwidth * CANVAS_WIDTH }
  set width(v) { this.rwidth = v/CANVAS_WIDTH }
  get height() { return this.rheight * CANVAS_HEIGHT }
  set height(v) { this.rheight =  v/CANVAS_HEIGHT }

  get boxCollision() {
    this._boxCollision.set(
      this.x, this.y-this.height,
      this.width, this.height
    )
    return this._boxCollision
  }

  static ico(img) {
    // represent UI icon
    return new Mob(img, 0, 0, 25, 25)
  }

  static dico(imgWhenLight, imgWhenDark) {
    // represent dynamic UI icon
    let m = Mob.ico(imgWhenLight)
    m.whenDarkImag = imgWhenDark
    return m
  }

  setXY(x, yy) {
    this.y = yy
    this.x = x; 
  }

  draw() {
    push()
    let img = this.image
    if (this.whenDarkImag !== undefined && !isLight)
      img = this.whenDarkImag
    image(
      img, 
      this.x + this.drawingVector.x*this.width, 
      this.y + this.drawingVector.y*this.height, 
      this.width, 
      this.height
    )
    pop()
  }

}


class BasicLamp extends Mob {
  constructor() {
    let img = lampWhiteImage
    let rx = 0.5
    let ry = relDeskY + relDeskHeight
    let rwidth = 810 * 0.4 / 600
    let rheight = 766 * 0.4 / 600
    let drawingVector = createVector(-.5, -1)
    super(img, rx, ry, rwidth, rheight, drawingVector)
  }
}

class SolarPanel extends Mob {
  constructor() {
    let img = solarPanelWhiteImage
    let rx = 0.2
    let ry = relDeskY + 0.5*relDeskHeight
    let rwidth = 172 * 0.6 / 600
    let rheight = 177 * 0.6 / 600
    let drawingVector = createVector(0, -1)
    super(img, rx, ry, rwidth, rheight, drawingVector)
  }
}