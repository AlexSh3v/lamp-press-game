
class BoxCollision {
  constructor(rx, ry, rw, rh) {
    this.rx = rx
    this.ry = ry
    this.rw = rw
    this.rh = rh
    this.onClick = () => { }
  }

  copy() {
    return new BoxCollision(this.rx, this.ry, this.rw, this.rh)
  }

  hasCollision(x, y) {
    return (this.x <= x && x <= this.x + this.width)
      && (this.y <= y && y <= this.y + this.height)
  }

  set(x, y, w, h) {
    this.rx = x / CANVAS_WIDTH
    this.ry = y / CANVAS_WIDTH
    if (w !== undefined)
      this.rw = w / CANVAS_WIDTH
    if (h !== undefined)
      this.rh = h / CANVAS_HEIGHT
  }

  get x() {
    return this.rx * CANVAS_WIDTH
  }
  get y() {
    return this.ry * CANVAS_HEIGHT
  }
  get width() {
    return this.rw * CANVAS_WIDTH
  }
  get height() {
    return this.rh * CANVAS_HEIGHT
  }
  draw(color) {
    push()
    if (color === undefined) stroke(0, 255, 0)
    else stroke(color[0], color[1], color[2])
    strokeWeight(5)
    noFill()
    rect(this.x, this.y, this.width, this.height)
    pop()
  }
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

class Circle {
  constructor(rx,ry,rr) {
    this.rx = rx
    this.ry = ry
    this.rr = rr
  }
  get x() { return this.rx*CANVAS_WIDTH }
  get y() { return this.ry*CANVAS_HEIGHT }
  get radius() { return this.rr*CANVAS_SIZE }

  hasInterception(rectangle) { 
    return hasInterception(this, rectangle)
  }
}

function hasInterception(circle, rectangle) {
    const circleDistanceX = Math.abs(circle.x - (rectangle.x + rectangle.width / 2));
    const circleDistanceY = Math.abs(circle.y - (rectangle.y + rectangle.height / 2));

    if (circleDistanceX > (rectangle.width / 2 + circle.radius)) return false;
    if (circleDistanceY > (rectangle.height / 2 + circle.radius)) return false;

    if (circleDistanceX <= (rectangle.width / 2)) return true;
    if (circleDistanceY <= (rectangle.height / 2)) return true;

    const cornerDistanceSq =
      (circleDistanceX - rectangle.width / 2) ** 2 +
      (circleDistanceY - rectangle.height / 2) ** 2;

    return cornerDistanceSq <= (circle.radius ** 2);
  }