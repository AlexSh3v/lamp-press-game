
class BarGroup {
  constructor(rStartX, rStartY, arrOfBars, arrOfIcos) {

    if (arrOfBars.length != arrOfIcos.length)
      console.error("arrOfBars and arrOfIcons are not the same length!");

    this.rStartX = rStartX
    this.rStartY = rStartY
    this.bars = arrOfBars
    this.icos = arrOfIcos
    this.rGapX = 0.05
    this.gapY = 5
    this.rIcoSize = 0.058
    this.arcSizeK = 1.6
    this.boxCollision = undefined
  }

  get startX() { return this.rStartX * CANVAS_WIDTH }
  get startY() { return this.rStartY * CANVAS_HEIGHT }

  get gapX() { return this.rGapX * CANVAS_WIDTH }
  get icoSize() { return this.rIcoSize * CANVAS_SIZE }

  draw() {
    push()
    let x = this.startX;
    let y = this.startY;
    let icoMob, bar;
    for (let i = 0; i < this.bars.length; i++) {
      icoMob = this.icos[i]
      bar = this.bars[i]

      icoMob.width = this.icoSize
      icoMob.height = this.icoSize
      icoMob.setXY(x, y)
      icoMob.draw()

      // Draw Arc around ico
      noFill();
      stroke(bar.color[0], bar.color[1], bar.color[2]);
      // stroke(isLight? 0 : 255);
      // if (bar.isReachedMaximum)
      //   stroke(11);
      strokeWeight(5);
      let v = map(bar.value, 0, 100, -PI/2, 3*PI/2)
      arc(
        icoMob.x+icoMob.width/2, icoMob.y-icoMob.height/2, 
        icoMob.width*this.arcSizeK, icoMob.height*this.arcSizeK, -PI/2, v, OPEN
      )
      if (bar.boxCollision !== undefined) {
        let w = icoMob.width
        let h = icoMob.height
        bar.boxCollision.set(
          icoMob.x-w/2, icoMob.y-h-h/2, 
          w*2,h*2
        )
      }

      x += this.icoSize + this.gapX
    }
    pop()
  }
}

class StatusBar {
  constructor(x, y) {

    if (x === undefined || y === undefined) {
      x = 0
      y = 0
    }

    this.value = 100
    this.startX = x
    this.startY = y
    this.width = 100
    this.height = 20
    this.color = [85, 232, 0]// #55e800
    this.startTimeMs = 0;
    this.isIncreasing = false;
    this.lastValue = 0;
    this.isReachedMaximum = false
    this.threshold = 0

    // k for constant decreasing/increasing per frame
    // the bigger the value k the slower increse
    this.k = 200

    this.onClick = undefined
  }

  increase() {
    //   deltaTime
    // [ ] 20ms [ ]   60fps
    // [ ] 60ms [ ]   30fps

    if (!this.isIncreasing) {
      this.startTimeMs = millis
      this.isIncreasing = true
    }

    if (millis - this.startTimeMs < 1500)
      return;

    this.value = Math.min(100, this.value + 1)
    this.startTimeMs = millis
  }

  setXY(x, y) {
    this.startX = x
    this.startY = y
  }

  decrease() {

    if (this.isIncreasing) {
      this.startTimeMs = millis
      this.isIncreasing = false
    }

    if (millis - this.startTimeMs < 500)
      return;

    this.value = Math.max(0, this.value - 1)
    this.startTimeMs = millis
  }

  increasePerFrame() {
    // increase value depending on time between frames
    // it does not care about fps -- all the same
    this.value = Math.min(100, this.value + deltaTime / this.k)
    if (this.value == 100 && this.threshold != 0) {
      this.isReachedMaximum = true
    }
  }
  decreasePerFrame() {
    // decrease value depending on time between frames
    // it does not care about fps -- all the same
    this.value = Math.max(0, this.value - deltaTime / this.k)

    if (this.isReachedMaximum && this.value < this.threshold) {
      this.isReachedMaximum = false
    }
  }

  get_percentage() {
    return this.value / 100
  }

  draw() {
    push()
    fill(0)
    stroke(isLight ? 0 : 255)
    strokeWeight(2)
    rect(this.startX, this.startY, this.width, this.height)
    fill(this.color[0], this.color[1], this.color[2])
    let w = map(this.value, 0, 100, 0, this.width)
    rect(this.startX, this.startY, w, this.height)
    pop()
  }

}