class Mob {
  constructor(img, x, y, width, height) {
    // x, y coord will represent bottom left point
    // its going to be much easier because we gonna 
    // draw from the desk
    this.image = img
    this.whenDarkImag = undefined
    this.x = x
    this.y = y
    this.width = width
    this.height = height
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

  setXY(x, y) {
    this.x = x
    this.y = y
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