class Mob {
    constructor(img, x, y, width, height) {
        // x, y coord will represent bottom left point
        // its going to be much easier because we gonna 
        // draw from the desk
        this.image = img
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    draw() {
        push()
        image(this.image, this.x, this.y-this.height, this.width, this.height)
        pop()
    }

}