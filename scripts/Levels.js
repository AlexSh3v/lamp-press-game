// Kinda Abstract Class
class Level {
  constructor(number, incK, decK, monsters) {
    this.N = number
    this.incK = incK
    this.decK = decK
    this.monsters = monsters
  }
  onMonsters(callback) {
    let stop = this.getCurrentMonsterActivity(solarPanelChargeBar.value) // FIXME: it should be as field in this class!
    let v
    for (let i = 0; i < stop; i++) {
      let monster = this.monsters[i]
      v = callback(monster)
      if (v === undefined)
        continue
      if (v == "break")
        break
    }
  }
  getCurrentMonsterActivity(v) {
    // Shows how to use monsters array
    // v: percentage of solar panel status bar 
    // return val: length of monsters array to use from start
    throw new Error("implement this method!")
  }
}


class Level1 extends Level {
  constructor() {
    super(1, 150, 3000, [
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(),
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 25)
      return 2
    if (v < 50)
      return 3
    if (v < 80)
      return 4
    return 5
  }
}
