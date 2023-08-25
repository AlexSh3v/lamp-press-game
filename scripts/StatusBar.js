
class BarGroup {
    constructor(startX, startY, arrOfBars, arrOfIcos) {

        if (arrOfBars.length != arrOfIcos.length)
            console.error("arrOfBars and arrOfIcons are not the same length!");

        this.startX = startX  
        this.startY = startY  
        this.bars = arrOfBars
        this.icos = arrOfIcos
        this.gapX = 5
        this.gapY = 5
    }

    draw() {
        push()
        let x = this.startX;
        let y = this.startY;
        let icoMob, bar;
        for (let i = 0; i < this.bars.length; i++) {
            icoMob = this.icos[i]
            bar = this.bars[i]
            icoMob.width = bar.height
            icoMob.height = bar.height
            icoMob.setXY(x, y)
            icoMob.draw()
            bar.setXY(x+icoMob.width + this.gapX, y-icoMob.height)
            bar.draw()
            y += max(icoMob.height, bar.height) + this.gapY
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

    setXY(x, y) {
        this.startX = x
        this.startY = y
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