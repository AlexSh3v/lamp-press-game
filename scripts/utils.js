
class BoxCollision {
    constructor(rx,ry,rw,rh) {
        this.rx = rx
        this.ry = ry
        this.rw = rw
        this.rh = rh
        this.onClick = () => {}
    }

    hasCollision(x,y) {
        return (this.x() <= x && x <= this.x()+this.width())
            && (this.y() <= y && y <= this.y()+this.height())
    }

    set(x,y,w,h) {
        this.rx = x/CANVAS_WIDTH
        this.ry = y/CANVAS_WIDTH
        if (w !== undefined)
            this.rw = w/CANVAS_WIDTH
        if (h !== undefined)
            this.rh = h/CANVAS_HEIGHT
    }

    x() {
        return this.rx * CANVAS_WIDTH
    }
    y() {
        return this.ry * CANVAS_HEIGHT
    }
    width() {
        return this.rw * CANVAS_WIDTH
    }
    height() {
        return this.rh * CANVAS_HEIGHT
    }
    draw(color) {
        push()
        if (color === undefined) stroke(0,255,0)
        else stroke(color[0],color[1],color[2])
        strokeWeight(5)
        noFill()
        rect(this.x(), this.y(), this.width(), this.height())
        pop()
    }
}