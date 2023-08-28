class Multicursor {
  constructor() {
    this.isActivated = false
    this.rRadius = .18
    this.a = 0
  }

  get x() {return mouseX}
  get y() {return mouseY}
  get radius() { return this.rRadius * CANVAS_SIZE }

  draw() {
    if (!this.isActivated)
      return;
    
    let c = isLight? cursorWhite : cursorBlack
    let parts = 10
    let w = 25
    let h = 25
    push()
    // tint(255,50)
    translate(mouseX, mouseY)
    for(let a = 0; a <= 2*PI; a += 2*PI/parts) {
      // YALL 3D!!!
      // let x = this.radius*cos(a+this.a)
      // let y = this.radius*sin(a)
      let x = this.radius*cos(a+this.a)
      let y = this.radius*sin(a+this.a)
      image(c, x, y, w, h)
      image(c, x*.5, y*.5, w, h)
      image(c, x*.75, y*.75, w, h)
      // console.log(`FAKECURS: ${x} ${y} `);
    }
    pop()
    this.a += 2*PI/720
  }
}