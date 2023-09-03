// Kinda Abstract Class
class Level {
  constructor(number, incK, decK, monsters) {
    this.N = number
    this.incK = incK
    this.decK = decK
    this.monsters = monsters
    this.lastActivity = 0
  }
  onMonsters(callback) {
    this.lastActivity = Math.max(
      this.getCurrentMonsterActivity(solarPanelChargeBar.value),
      this.lastActivity
    )
    let stop = this.lastActivity 
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
  getClearLocation(monster) {
    let coord = monster.getInitialLocation()
    let tries = 0
    while (!this.canMonsterBeSpawnHere(monster, coord[0], coord[1])) {
      coord = monster.getInitialLocation()
      tries++
    }

    if (tries > 0)
      console.log(`[Spawn] tries=${tries}`);

    return coord
  }
  canMonsterBeSpawnHere(monster, rx, ry) {
    let tempColl = monster.boxCollision.copy()
    tempColl.set(
      rx * CANVAS_WIDTH, ry * CANVAS_HEIGHT,
      monster.width, monster.height
    )
    let canSpawn = true
    this.onMonsters(otherMonster => {
      if (areRectanglesIntercept(tempColl, otherMonster.boxCollision)) {
        canSpawn = false
        return 'break'
      }
    })
    return canSpawn
  }
  getCurrentMonsterActivity(v) {
    // Shows how to use monsters array
    // v: percentage of solar panel status bar 
    // return val: length of monsters array to use from start
    throw new Error("implement this method!")
  }
}

class Level0 extends Level {
  constructor() {
    super(0, 150, 3000, [
      new PanzerEyes(),
      new WingsEyes(),
      new WeaklyEyes(),
    ])
  }
  getCurrentMonsterActivity(v) {
    return 3
  }
}

class Level1 extends Level {
  constructor() {
    super(1, 150, 3000, [
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 25)
      return 2
    if (v < 50)
      return 3
    if (v < 80)
      return 4
    return 6
  }
}

class Level2 extends Level {
  constructor() {
    super(2, 150, 3000, [
      new WeaklyEyes(), new WeaklyEyes(),
      new WingsEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes()
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
    return 6
  }
}

class Level3 extends Level {
  constructor() {
    super(3, 150, 3000, [
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WingsEyes(), new WingsEyes(),
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(),
    ])
  }
  getCurrentMonsterActivity(v) {
    // --- 25 --- 35 --- --- --- 75 ---- 100
    // 11     2                12      1
    if (v < 10)
      return 3
    if (v < 30)
      return 4
    if (v < 60)
      return 6
    return 9
  }
}
class Level4 extends Level {
  constructor() {
    super(4, 175, 3000, [
      new WeaklyEyes(), new WeaklyEyes(), 
      new PanzerEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new PanzerEyes(), 
      new WingsEyes(), 
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 2
    if (v < 50)
      return 4
    if (v < 75)
      return 6
    return 7
  }
}

class Level5 extends Level {
  constructor() {
    super(5, 200, 3000, [
      new WeaklyEyes(), new WeaklyEyes(),
      new PanzerEyes(), new PanzerEyes(), 
      new PanzerEyes(), new PanzerEyes(), 
      new WingsEyes(), 
      new WeaklyEyes(), new WeaklyEyes(),
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 2
    if (v < 50)
      return 4
    if (v < 70)
      return 7
    return 9
  }
}
class Level6 extends Level {
  constructor() {
    super(6, 225, 3000, [
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WingsEyes(), 
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 4
    if (v < 50)
      return 6
    if (v < 70)
      return 12
    return 13
  }
}
class Level7 extends Level {
  constructor() {
    super(7, 225, 3000, [
      new WingsEyes(), new WingsEyes(), 
      new WingsEyes(), new WingsEyes(), 
      new WingsEyes(), new WingsEyes(), 
      new WingsEyes(), 
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 1
    if (v < 50)
      return 2
    if (v < 75)
      return 3
    if (v < 85)
      return 4
    return 7
  }
}

class Level8 extends Level {
  constructor() {
    super(8, 300, 3000, [
      new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(),
      new WeaklyEyes(), new WeaklyEyes(),
      new WingsEyes(), new WingsEyes(), 
      new WingsEyes(), new WingsEyes(), 
      PanzerEyes.summon().withArmor40(), PanzerEyes.summon().withArmor40()
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 4
    if (v < 60)
      return 6
    if (v < 80)
      return 10
    return 12
  }
}

class Level9 extends Level {
  constructor() {
    super(9, 300, 3000, [
      new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), 
      PanzerEyes.summon().withArmor40(), PanzerEyes.summon().withArmor40(),
      PanzerEyes.summon().withArmor40(), PanzerEyes.summon().withArmor40(),
      WingsEyes.withExtraSpeed()
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 6
    if (v < 40)
      return 10
    if (v < 60)
      return 14
    return 15
  }
}

class Level10 extends Level {
  constructor() {
    super(10, 300, 3000, [
      new WingsEyes(), new WingsEyes(), 
      new WingsEyes(), 
      PanzerEyes.summon(), PanzerEyes.summon(), 
      PanzerEyes.summon(), PanzerEyes.summon(), 
      PanzerEyes.summon(), PanzerEyes.summon(), 
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 2
    if (v < 40)
      return 3
    if (v < 60)
      return 5
    return 9
  }
}

class Level11 extends Level {
  constructor() {
    super(11, 300, 3000, [
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(), 
      new WeaklyEyes(), new WeaklyEyes(), new WeaklyEyes(), 
      PanzerEyes.summon().bigger()
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 7
    if (v < 40)
      return 14
    if (v < 60)
      return 21
    return 22
  }
}

class Level12 extends Level {
  constructor() {
    super(12, 300, 3000, [
      PanzerEyes.summon(), PanzerEyes.summon(), PanzerEyes.summon(),
      PanzerEyes.summon(), PanzerEyes.summon(), PanzerEyes.summon(),
      PanzerEyes.summon(), PanzerEyes.summon(), PanzerEyes.summon(),

      PanzerEyes.summon().bigger(),
    ])
  }
  getCurrentMonsterActivity(v) {
    if (v < 30)
      return 3
    if (v < 50)
      return 6
    if (v < 60)
      return 9
    return 10
  }
}