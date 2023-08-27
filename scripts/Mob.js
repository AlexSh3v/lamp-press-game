class Mob {
  constructor(img, rx, ry, rwidth, rheight) {
    // x, y coord will represent bottom left point
    // its going to be much easier because we gonna 
    // draw from the desk
    this.image = img
    this.whenDarkImag = undefined
    this.rx = rx
    this.ry = ry
    this.rwidth = rwidth
    this.rheight = rheight
  }


  get x() { return this.rx * CANVAS_WIDTH }
  set x(v) { this.rx = v/CANVAS_WIDTH }
  get y() { return this.ry * CANVAS_WIDTH }
  set y(v) { this.ry = v/CANVAS_HEIGHT }
  get width() { return this.rwidth * CANVAS_WIDTH }
  set width(v) { this.rwidth = v/CANVAS_WIDTH }
  get height() { return this.rheight * CANVAS_HEIGHT }
  set height(v) { this.rheight =  v/CANVAS_HEIGHT }

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
    // Drawing from bottom left point
    push()
    let img = this.image
    if (this.whenDarkImag !== undefined && !isLight)
      img = this.whenDarkImag
    image(img, this.x, this.y - this.height, this.width, this.height)
    pop()
  }

}