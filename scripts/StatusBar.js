class StatusBar {
    constructor(x, y) {
        this.value = 100
        this.startX = x
        this.startY = y
        this.width = 100
        this.height = 20
        this.color = [85, 232, 0]// #55e800
        this.startTimeMs = 0;
        this.isCharging = false;
    }

    increase() {
        //   deltaTime
        // [ ] 20ms [ ]   60fps
        // [ ] 60ms [ ]   30fps
        
        if (!this.isCharging) {
            this.startTimeMs = millis
            this.isCharging = true
        }

        if (millis - this.startTimeMs < 1500)
            return;

        this.value = Math.min(100, this.value+1)
        this.startTimeMs = millis
    }

    decrease() {
        
        if (this.isCharging) {
            this.startTimeMs = millis
            this.isCharging = false
        }

        if (millis - this.startTimeMs < 500)
            return;

        this.value = Math.max(0, this.value-1)
        this.startTimeMs = millis
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
        rect(this.startX, this.startY, this.width*this.get_percentage(), this.height)
        pop()
    }

}