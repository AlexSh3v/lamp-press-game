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

class Level2 extends Level {
  constructor() {
    super(2, 150, 3000, [
      new WeaklyEyes(), new WeaklyEyes(),
      new WingsEyes(), new WeaklyEyes(), 
      new WeaklyEyes()
    ])
  }
  getCurrentMonsterActivity(v) {
    // --- 25 --- 35 --- --- --- 75 ---- 100
    // 11     2                12      1
    if (v < 20)
      return 2
    if (v < 35)
      return 3
    if (v < 75)
      return 4
    return 5
  }
}

class Level3 extends Level {
  constructor() {
    super(3, 150, 3000, [
      new WeaklyEyes(), new WingsEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WingsEyes(), new PanzerEyes(),
    ])
  }
  getCurrentMonsterActivity(v) {
    // --- 25 --- 35 --- --- --- 75 ---- 100
    // 11     2                12      1
    if (v < 10)
      return 1
    if (v < 15)
      return 2
    if (v < 40)
      return 4
    if (v < 60) 
      return 5
    return 6
  }
}
