(function(self) {

  let constants
  let enemies
  let util

  if (self) {
    constants = self.sotnRando.constants
    enemies = self.sotnRando.enemies
    util = self.sotnRando.util
  } else {
    constants = require('./constants')
    enemies = require('./enemies')
    util = require('./util')
  }

  const TYPE = constants.TYPE
  const typeNames = constants.typeNames
  const ZONE = constants.ZONE
  const zones = constants.zones
  const zoneNames = constants.zoneNames
  const tileIdOffset = constants.tileIdOffset
  const equipIdOffset = constants.equipIdOffset
  const equipmentInvIdOffset = constants.equipmentInvIdOffset
  const GLOBAL_DROP = constants.GLOBAL_DROP
  const globalDropsCount = constants.globalDropsCount
  const enemiesDrops = enemies.enemiesDrops

  const shuffled = util.shuffled

  // The base address of Alucard's equipped item list.
  const equipBaseAddress = 0x11a0d0

  function itemFromId(id, filter, list) {
    return (list || items).filter(function(item) {
      return item.id === id && (!filter || filter(item))
    })[0]
  }

  function typeFilter(types) {
    return function(item) {
      return types.indexOf(item.type) !== -1
    }
  }

  const heartFilter = typeFilter([TYPE.HEART])
  const goldFilter = typeFilter([TYPE.GOLD])
  const subweaponFilter = typeFilter([TYPE.SUBWEAPON])
  const powerupFilter = typeFilter([TYPE.POWERUP])
  const weaponFilter = typeFilter([TYPE.WEAPON1, TYPE.WEAPON2])
  const shieldFilter = typeFilter([TYPE.SHIELD])
  const helmetFilter = typeFilter([TYPE.HELMET])
  const armorFilter = typeFilter([TYPE.ARMOR])
  const cloakFilter = typeFilter([TYPE.CLOAK])
  const accessoryFilter = typeFilter([TYPE.ACCESSORY])
  const equipmentFilter = typeFilter([
    TYPE.WEAPON1,
    TYPE.WEAPON2,
    TYPE.SHIELD,
    TYPE.HELMET,
    TYPE.ARMOR,
    TYPE.CLOAK,
    TYPE.ACCESSORY,
  ])

  function foodFilter(item) {
    return item.food
  }

  function usableFilter(item) {
    return typeFilter([TYPE.USABLE])(item) && !foodFilter(item)
  }

  function salableFilter(item) {
    return item.salable
  }

  function nonsalableFilter(item) {
    return accessoryFilter(item) && !salableFilter(item)
  }

  function typeReduce(types, item) {
    if (!types[item.type]) {
      types[item.type] = []
    }
    types[item.type].push(item)
    return types
  }

  function blacklist(item) {
    return function(tile) {
      if (item.blacklist) {
        for (let i = 0; i < item.blacklist.length; i++) {
          if ('index' in tile) {
            for (let j = 0; j < tile.zones.length; j++) {
              const zone = zones[tile.zones[j]]
              const offset = zone.items + 0x2 * tile.index
              const address = util.romOffset(zone, offset)
              if (item.blacklist[i] === address) {
                return false
              }
            }
          }
          if ('address' in tile) {
            if (tile.addresses.indexOf(item.blacklist[i]) !== -1) {
              return false
            }
          }
        }
      }
      return true
    }
  }

  function takeTile(list, filter) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (filter && !filter(item)) {
        continue
      }
      list.splice(i, 1)
      return item
    }
  }

  function takePermaTile(tiles, filter) {
    return takeTile(tiles, function(tile) {
      return filter(tile) && !tile.despawn
    })
  }

  function pushTile() {
    const tiles = Array.prototype.slice.call(arguments)
    this.tiles = this.tiles || []
    Array.prototype.push.apply(this.tiles, tiles)
  }

  function tileCountReduce(count, item) {
    if (item.tiles) {
      return count + item.tiles.length
    }
    return count
  }

  function eachTileItem(all, pool, filter, each) {
    let count = all.filter(filter).reduce(tileCountReduce, 0)
    pool = pool.filter(filter)
    while (count--) {
      each(pool)
    }
  }

  function cloneTilesMap(tileFilter) {
    return function(item) {
      return Object.assign({}, item, {
        tiles: (item.tiles || []).filter(tileFilter)
      })
    }
  }

  function randItem(rng, array) {
    return array[Math.floor(rng() * array.length)]
  }

  function flattened() {
    const flattened = []
    for (let i = 0; i < arguments.length; i++) {
      const nonNull = arguments[i].filter(function(types) {
        return !!types
      })
      const flatTypes = Array.prototype.concat.apply([], nonNull)
      Array.prototype.push.apply(flattened, flatTypes)
    }
    return flattened
  }

  function collectTiles(items, filter) {
    return flattened(items.map(function(item) {
      return item.tiles || []
    })).filter(function(tile) {
      if (filter) {
        return filter(tile)
      }
      return true
    })
  }

  function writeTiles(data) {
    return function(item) {
      item.tiles.forEach(function(tile) {
        util.assert(tile, 'invalid tile')
        const value = util.tileValue(item, tile)
        if ('index' in tile) {
          tile.zones.forEach(function(zoneId) {
            const zone = zones[zoneId]
            const offset = zone.items + 0x02 * tile.index
            const address = util.romOffset(zone, offset)
            data.writeShort(address, value)
          })
        }
        if (util.candleTileFilter(tile)) {
          tile.entities.forEach(function(entity, index) {
            const zone = zones[tile.zones[index >>> 1]]
            const address = util.romOffset(zone, entity + 0x08)
            data.writeShort(address, value)
          })
        }
        if ('addresses' in tile) {
          tile.addresses.forEach(function(address) {
            let offset = 0
            if (tile.shop) {
              offset = 2
              data.writeChar(address, util.shopItemType(item))
            }
            data.writeShort(address + offset, value)
          })
        }
      })
    }
  }

  function getNewName(newNames, item, itemNameRandoMode) {
    const newName =  newNames.filter(function(newName) {
      return newName.id === item.id
    })[0]
    if (newName && itemNameRandoMode == false) {
      return newName.name
    }
    return item.name
  }

  function randomizeStartingEquipment(
    data,
    rng,
    items,
    blocked,
    newNames,
    info,
    planned,
    options,
  ) {
    const pool = items.filter(function(item) {
      if (item.name === 'Sword Familiar') {
        return false
      }
      return util.nonProgressionFilter(item)
    })
    // Select starting equipment.
    planned = planned || {}
    let weapon, shield, helmet, armor, cloak, other
    if ('r' in planned) {
      weapon = util.itemFromName(randItem(rng, planned.r))
    } else {
      weapon = randItem(rng, pool.filter(typeFilter([TYPE.WEAPON1])).filter(
        function(item) {
          return !blocked
            || !blocked.r
            || blocked.r.indexOf(item.name) === -1
        }
      ))
    }
    if ('l' in planned) {
      shield = util.itemFromName(randItem(rng, planned.l))
    } else if (!planned.r || planned.r.type !== TYPE.WEAPON2) {
      shield = randItem(rng, pool.filter(shieldFilter).filter(
        function(item) {
          return !blocked
            || !blocked.l
            || blocked.l.indexOf(item.name) === -1
        }
      ))
    }
    if ('b' in planned) {
      armor = util.itemFromName(randItem(rng, planned.b))
    } else {
      armor = randItem(rng, pool.filter(armorFilter).filter(
        function(item) {
          return !blocked
            || !blocked.b
            || blocked.b.indexOf(item.name) === -1
        }
      ))
    }
    if ('h' in planned) {
      helmet = util.itemFromName(randItem(rng, planned.h))
    } else {
      helmet = randItem(rng, pool.filter(helmetFilter).filter(
        function(item) {
          return !blocked
            || !blocked.h
            || blocked.h.indexOf(item.name) === -1
        }
      ))
    }
    if ('c' in planned) {
      cloak = util.itemFromName(randItem(rng, planned.c))
    } else {
      cloak = randItem(rng, pool.filter(cloakFilter).filter(
        function(item) {
          return !blocked
            || !blocked.c
            || blocked.c.indexOf(item.name) === -1
        }
      ))
    }
    if ('o' in planned) {
      other = util.itemFromName(randItem(rng, planned.o))
    } else {
      other = randItem(rng, pool.filter(accessoryFilter).filter(
        function(item) {
          return !blocked
            || !blocked.o
            || blocked.o.indexOf(item.name) === -1
        }
      ))
    }
    // Their values when equipped.
    const weaponEquipVal = weapon ? weapon.id : 0
    const shieldEquipVal = shield ? shield.id : 0
    const helmetEquipVal = helmet ? helmet.id + equipIdOffset : 0
    const armorEquipVal = armor ? armor.id + equipIdOffset : 0
    const cloakEquipVal = cloak ? cloak.id + equipIdOffset : 0
    const otherEquipVal = other ? other.id  + equipIdOffset : 0
    // Their inventory locations.
    const weaponInvOffset = weapon ? weapon.id + equipmentInvIdOffset : 0
    const shieldInvOffset = shield ? shield.id + equipmentInvIdOffset : 0
    const helmetInvOffset = helmet ? helmet.id + equipmentInvIdOffset : 0
    const armorInvOffset = armor ? armor.id + equipmentInvIdOffset : 0
    const cloakInvOffset = cloak ? cloak.id + equipmentInvIdOffset : 0
    const otherInvOffset = other ? other.id + equipmentInvIdOffset : 0
    // Equip the items.
    data.writeShort(equipBaseAddress +  0, weaponEquipVal)
    data.writeShort(equipBaseAddress + 12, shieldEquipVal)
    if (helmet) {
      data.writeShort(equipBaseAddress + 24, helmetEquipVal)
    } else {
      data.writeWord(equipBaseAddress + 32, 0)
    }
    data.writeShort(equipBaseAddress + 36, armorEquipVal)
    if (cloak) {
      data.writeShort(equipBaseAddress + 48, cloakEquipVal)
    } else {
      data.writeWord(equipBaseAddress + 56, 0)
    }
    if (other) {
      data.writeShort(equipBaseAddress + 60, otherEquipVal)
    } else {
      data.writeWord(equipBaseAddress + 68, 0)
    }
    // Death removes these values if equipped.
    data.writeShort(0x1195f8, weaponEquipVal)
    data.writeShort(0x119658, shieldEquipVal)
    data.writeShort(0x1196b8, helmetEquipVal)
    data.writeShort(0x1196f4, armorEquipVal)
    data.writeShort(0x119730, cloakEquipVal)
    data.writeShort(0x119774, otherEquipVal)
    // Death decrements these inventory values if not equiped.
    data.writeShort(0x119634, weaponInvOffset)
    data.writeShort(0x119648, weaponInvOffset)
    data.writeShort(0x119694, shieldInvOffset)
    data.writeShort(0x1196a8, shieldInvOffset)
    data.writeShort(0x1196d0, helmetInvOffset)
    data.writeShort(0x1196e4, helmetInvOffset)
    data.writeShort(0x11970c, armorInvOffset)
    data.writeShort(0x119720, armorInvOffset)
    data.writeShort(0x119750, cloakInvOffset)
    data.writeShort(0x119764, cloakInvOffset)
    data.writeShort(0x1197b0, otherInvOffset)
    data.writeShort(0x1197c4, otherInvOffset)
    // Death cutscene draws these items.
    data.writeShort(0x04b6844c, weapon ? weapon.id : 0)
    data.writeShort(0x04b6844e, shield ? shield.id : 0)
    data.writeShort(0x04b68452, helmet ? helmet.id : 0)
    data.writeShort(0x04b68450, armor ? armor.id : 0)
    data.writeShort(0x04b68454, cloak ? cloak.id : 0)
    data.writeShort(0x04b68456, other ? other.id : 0)
    // Replace Axe Lord Armor.
    let axeLordArmor
    if ('a' in planned) {
      axeLordArmor = util.itemFromName(randItem(rng, planned.a))
    } else {
      axeLordArmor = randItem(rng, pool.filter(armorFilter).filter(
        function(item) {
          return !blocked
            || !blocked.a
            || blocked.a.indexOf(item.name) === -1
        }
      ))
    }
    const axeLordEquipVal = axeLordArmor ? axeLordArmor.id + equipIdOffset : 0
    data.writeChar(0x11a230, axeLordEquipVal)
    // Replace Lapis Lazuli.
    let luckItem
    if ('x' in planned) {
      luckItem = util.itemFromName(randItem(rng, planned.x))
    } else {
      luckItem = randItem(rng, pool.filter(accessoryFilter).filter(
        function(item) {
          return !blocked
            || !blocked.x
            || blocked.x.indexOf(item.name) === -1
        }
      )).id
    }
    if (luckItem) {
      const luckItemEquipVal = luckItem ? luckItem.id : 0
      data.writeChar(0x11a198, luckItemEquipVal + equipIdOffset)
    } else {
      data.writeWord(0x11a1d8, 0)
    }
    // Update info.
    info[2]['Starting equipment'] = [
      weapon ? getNewName(newNames, weapon, options.itemNameRandoMode) : 'Empty hand',
      shield ? getNewName(newNames, shield, options.itemNameRandoMode) : 'Empty hand',
      helmet ? getNewName(newNames, helmet, options.itemNameRandoMode) : '----',
      armor ? getNewName(newNames, armor, options.itemNameRandoMode) : '----',
      cloak ? getNewName(newNames, cloak, options.itemNameRandoMode) : '----',
      other ? getNewName(newNames, other, options.itemNameRandoMode) : '----',
    ]
  }

  function getItemTileIndex(item, tile) {
    const zoneTiles = collectTiles([item], function(t) {
      if (t.zones) {
        for (let i = 0; i < t.zones.length; i++) {
          if (tile.zones[i] !== t.zones[i]) {
            return false
          }
        }
        return true
      }
    })
    for (let i = 0; i < zoneTiles.length; i++) {
      if (zoneTiles[i] === tile) {
        return i
      }
    }
  }

  function isBlocked(items, blocked, tiles, replacement) {
    if (blocked) {
      for (let i = 0; i < tiles.length; i++) {
        const item = items.filter(function(item) {
          return item.tiles && item.tiles.some(function(t) {
            return t === tiles[i]
          })
        })[0]
        const index = getItemTileIndex(item, tiles[i])
        for (let j = 0; j < tiles[i].zones.length; j++) {
          const zoneBlocked = []
          if (blocked[zoneNames[tiles[i].zones[j]]]) {
            zoneBlocked.push(blocked[zoneNames[tiles[i].zones[j]]])
          }
          if (blocked['*']) {
            zoneBlocked.push(blocked['*'])
          }
          for (let k = 0; k < zoneBlocked.length; k++) {
            const itemNames = Object.getOwnPropertyNames(zoneBlocked[k])
            for (let l = 0; l < itemNames.length; l++) {
              if (itemNames[l] === '*'
                  || (itemNames[l] === item.name
                      && index in zoneBlocked[k][itemNames[l]])) {
                if (replacement) {
                  const indexes = zoneBlocked[k][itemNames[l]]
                  if (itemNames[l] === '*'
                      && indexes['0'].indexOf(replacement.name) !== -1) {
                    return true
                  }
                  if (index in indexes) {
                    return indexes[index].indexOf(replacement.name) !== -1
                  }
                }
                return items.indexOf(null) !== -1
              }
            }
          }
        }
      }
    }
  }

  function randomizeCandles(rng, items, blocked, pool) {
    // There are statues and pots in the hidden room of Final Stage stage that
    // drop equipment and usable items. Note that these are unique in the game
    // in that they are handled by the candle code, but their sprites are
    // permanent tile containers, not candles.
    // Additionally, there are 4 candles (2 in each library) that drop Uncurse.
    const zones = {
      st0: [ZONE.ST0],
      lib: [ZONE.LIB, ZONE.RLIB],
    }
    const specialZones = {}
    const specialItems = []
    Object.getOwnPropertyNames(zones).forEach(function(name) {
      specialZones[name] = items.filter(function(item) {
        return !typeFilter([TYPE.HEART, TYPE.GOLD, TYPE.SUBWEAPON])(item)
          && item.tiles && item.tiles.some(function(tile) {
            return util.candleTileFilter(tile)
              && zones[name].indexOf(tile.zones[0]) !== -1
          })
      })
      const ids = specialZones[name].map(function(item) {
        return item.id
      })
      Array.prototype.push.apply(specialItems, ids)
    })
    // Randomize these special cases by replacing them with the same item type.
    const itemTypes = shuffled(rng, pool).reduce(typeReduce, [])
    Object.getOwnPropertyNames(zones).forEach(function(name) {
      specialZones[name].forEach(function(item) {
        const tiles = collectTiles([item], util.candleTileFilter)
        let replacement
        do {
          if (!itemTypes[item.type]) {
            throw new Error('No item to place')
          }
          replacement = itemTypes[item.type].pop()
        } while (foodFilter(replacement)
                 || isBlocked(items, blocked, tiles, replacement))
        pushTile.apply(replacement, tiles)
      })
    })
    // Guarantee a Stopwatch in Alchemy Lab, Marble Gallery, Outer Wall,
    // Colosseum, or Royal Chapel.
    const stopwach = util.itemFromName('Stopwatch', pool)
    const stopwatchZone = shuffled(rng, [
      ZONE.ARE,
      ZONE.DAI,
      ZONE.NO0,
      ZONE.NO1,
      ZONE.NZ0,
    ]).pop()
    const stopwatchTiles = collectTiles(items, function(tile) {
      return util.candleTileFilter(tile)
        && tile.zones.indexOf(stopwatchZone) >= 0
    })
    const stopwatchTile = shuffled(rng, stopwatchTiles).pop()
    pushTile.call(stopwach, stopwatchTile)
    // Randomize the rest of the candles, except for Final Stage, which
    // doesn't have map tiles for all subweapons, so it must be ignored.
    const tileFilter = function(tile) {
      return util.candleTileFilter(tile)
        && tile.zones[0] !== ZONE.ST0
        && tile !== stopwatchTile
    }
    const candleItems = items.filter(function(item) {
      return (specialItems.indexOf(item.id) === -1
              || typeFilter([TYPE.HEART, TYPE.GOLD, TYPE.SUBWEAPON])(item))
        && (item.tiles || []).some(tileFilter)
    })
    const candleTileCounts = candleItems.map(function(items) {
      return items.tiles.filter(tileFilter).length
    })
    const candleTiles = shuffled(rng, collectTiles(candleItems, tileFilter))
    let index = 0
    while (candleTiles.length) {
      const tile = candleTiles.pop()
      let blockCount = 0
      let item
      while (true) {
        item = candleItems[index]
        if (isBlocked(items, blocked, [tile], item)) {
          blockCount++
          if (blockCount >= candleItems.length) {
            item = itemFromId(0, undefined, pool)
            break
          }
        } else if (candleTileCounts[index]) {
          break
        }
        index = (index + 1) % candleItems.length
      }
      item = itemFromId(item.id, typeFilter([item.type]), pool)
      candleTileCounts[index]--
      pushTile.call(item, tile)
      index = (index + 1) % candleItems.length
    }
  }

  function randomizePrologueRewards(
    rng,
    items,
    blocked,
    pool,
    addon,
    planned,
  ) {
    const rewardItemFilter = util.itemTileFilter(util.rewardTileFilter)
    const rewardItems = items.filter(rewardItemFilter)
    rewardItems.sort(function(a, b) {
      if (a < b) {
        return -1
      } else if (a > b) {
        return 1
      }
      return 0
    })
    const rewardTiles = collectTiles(items, util.rewardTileFilter)
    const usableItems = shuffled(rng, pool.filter(usableFilter))
    function pushPoolItemTile(replacement, tile) {
      switch (replacement.type) {
      case TYPE.HELMET:
      case TYPE.ARMOR:
      case TYPE.CLOAK:
      case TYPE.ACCESSORY:
        if (replament.id >= tileIdOffset) {
          throw new Error('Cannot reward ' + replacement.name)
        }
        break
      }
      pushTile.call(replacement, tile)
    }
    ['h', 'n', 'p'].map(function(item) {
      if (planned && item in planned) {
        const plannedItem = util.itemFromName(randItem(rng, planned[item]))
        if (plannedItem) {
          let poolItem = (addon || []).concat(pool).filter(function(poolItem) {
            if (poolItem.id === plannedItem.id
                && poolItem.type === plannedItem.type) {
              return poolItem
            }
          })[0]
          if (!poolItem) {
            poolItem = Object.assign({}, plannedItem)
            delete poolItem.tiles
            addon.push(poolItem)
          }
          pushPoolItemTile(poolItem, rewardTiles.shift())
        } else {
          const poolItem = { id: 0 }
          addon.push(poolItem)
          pushPoolItemTile(poolItem, rewardTiles.shift())
        }
      } else {
        const tile = rewardTiles.shift()
        let replacement
        let index = 0
        while (index < usableItems.length) {
          replacement = usableItems[index]
          if (!blocked
              || !blocked[item]
              || blocked[item].indexOf(replacement.name) === -1) {
            break
          }
          index++
        }
        usableItems.splice(index, 1)
        pushPoolItemTile(replacement, tile)
      }
    })
  }

  function randomizeSubweaponTanks(rng, items, blocked, pool) {
    // Get subweapon tank tiles.
    const tankTiles = flattened(items.filter(function(item) {
      return item.tiles && item.tiles.some(function(tile) {
        return tile.tank
      })
    }).map(function(item) {
      return item.tiles.filter(function(tile) {
        return tile.tank
      })
    }))
    // Separate tank tiles by zone.
    const tankZones = {}
    tankTiles.forEach(function(tile) {
      tankZones[tile.zones[0]] = tankZones[tile.zones[0]] || []
      tankZones[tile.zones[0]].push(tile)
    })
    // Randomize tank items.
    Object.getOwnPropertyNames(tankZones).forEach(function(zone) {
      const subweapons = shuffled(rng, pool.filter(subweaponFilter))
      let index = 0
      while (tankZones[zone].length) {
        const tile = tankZones[zone].pop()
        let replacement
        while (true) {
          replacement = subweapons[index]
          index = (index + 1) % subweapons.length
          if (!isBlocked(items, blocked, [tile], replacement)) {
            break
          }
        }
        pushTile.call(replacement, tile)
      }
    })
  }

  function turkeyMode(items, pool) {
    pool.push({
      name: 'Turkey',
      type: TYPE.SUBWEAPON,
      id: 13,
      tiles: collectTiles(items, function(tile) {
        return tile.tank
      }),
    })
  }

  function randomizeShopItems(rng, items, blocked, pool) {
    // Get shop items by type.
    const shopTypes = items.filter(function(item) {
      return item.tiles && item.tiles.some(function(tile) {
        return tile.shop
      })
    }).map(function(item) {
      return {
        type: item.type,
        tiles: item.tiles.filter(function(tile) {
          return tile.shop
        })
      }
    }).reduce(typeReduce, [])
    // Assign random shop addresses.
    const shuffledTypes = shuffled(rng, pool.filter(function(item) {
      return !foodFilter(item) && !salableFilter(item)
    })).reduce(typeReduce, [])
    shopTypes.forEach(function(shopItems, type) {
      let index = 0
      {
        (shopItems || []).map(function(item) {
          return item.tiles
        }).forEach(function(tiles) {
          let replacement
          while (true) {
            replacement = shuffledTypes[type][index]
            index = (index + 1) % shuffledTypes[type].length
            if (!isBlocked(items, blocked, tiles, replacement)) {
              break
            }
          }
          pushTile.apply(replacement, tiles)
        })
      }
    })
  }

  function randomizeMapItems(rng, items, blocked, pool, planned, addon) {
    // Shuffle items.
    const shuffledItems = shuffled(rng, pool)
    // Get all map tiles.
    const mapItems = items.filter(function(item) {
      return util.nonProgressionFilter(item)
        && util.itemTileFilter(util.mapTileFilter)(item)
    })
    const tileItems = mapItems.map(cloneTilesMap(util.mapTileFilter))
    // Shuffle all map tiles.
    const shuffledTiles = shuffled(rng, collectTiles(tileItems))
    // Equipment is unique and placed in non-despawn tiles.
    const equipment = [
      weaponFilter,
      shieldFilter,
      helmetFilter,
      armorFilter,
      cloakFilter,
      nonsalableFilter,
    ]
    equipment.forEach(function(filter) {
      let index = 0
      eachTileItem(tileItems, shuffledItems, filter, function(eq) {
        let replacement
        let tile
        while (true) {
          replacement = eq[index]
          index = (index + 1) % eq.length
          const tiles = shuffledTiles.slice()
          let tileCount = 0
          let blockCount = 0
          do {
            tile = takePermaTile(tiles, blacklist(replacement))
            if (tile) {
              tileCount++
              if (isBlocked(items, blocked, [tile], replacement)) {
                blockCount++
              } else {
                break
              }
            }
          } while (tile)
          if (tile || blockCount === tileCount) {
            break
          }
        }
        if (!tile) {
          replacement = itemFromId(0, undefined, pool)
          tile = takePermaTile(shuffledTiles.slice(), blacklist(replacement))
        }
        util.assert.notEqual(tile, undefined)
        shuffledTiles.splice(shuffledTiles.indexOf(tile), 1)
        pushTile.call(replacement, tile)
      })
    })
    // Powerups are in multiple non-despawn tiles.
    let index = 0
    eachTileItem(tileItems, shuffledItems, powerupFilter, function(powerups) {
      let replacement
      let tile
      while (true) {
        replacement = powerups[index]
        index = (index + 1) % powerups.length
        const tiles = shuffledTiles.slice()
        let tileCount = 0
        let blockCount = 0
        do {
          tile = takePermaTile(tiles, blacklist(replacement))
          if (tile) {
            tileCount++
            if (isBlocked(items, blocked, [tile], replacement)) {
              blockCount++
            } else {
              break
            }
          }
        } while (tile)
        if (tile || blockCount === tileCount) {
          break
        }
      }
      if (!tile) {
        replacement = itemFromId(0, undefined, pool)
        tile = takePermaTile(shuffledTiles.slice(), blacklist(replacement))
      }
      util.assert.notEqual(tile, undefined)
      shuffledTiles.splice(shuffledTiles.indexOf(tile), 1)
      pushTile.call(replacement, tile)
    })
    // Distribute jewels with same id frequency as vanilla.
    const salableItems = mapItems.filter(salableFilter)
    salableItems.forEach(function(salableItem) {
      let index = 0
      eachTileItem(tileItems, shuffledItems, function(item) {
        return item.id === salableItem.id
      }, function(jewels) {
        let replacement
        let tile
        while (true) {
          replacement = jewels[index]
          index = (index + 1) % jewels.length
          const tiles = shuffledTiles.slice()
          let tileCount = 0
          let blockCount = 0
          do {
            tile = takePermaTile(tiles, blacklist(replacement))
            if (tile) {
              tileCount++
              if (isBlocked(items, blocked, [tile], replacement)) {
                blockCount++
              } else {
                break
              }
            }
          } while (tile)
          if (tile || blockCount === tileCount) {
            break
          }
        }
        if (!tile) {
          replacement = itemFromId(0, undefined, pool)
          tile = takePermaTile(shuffledTiles.slice(), blacklist(replacement))
        }
        util.assert.notEqual(tile, undefined)
        shuffledTiles.splice(shuffledTiles.indexOf(tile), 1)
        pushTile.call(replacement, tile)
      })
    })
    // Usable items can occupy multiple (possibly despawn) tiles.
    const usable = [ usableFilter, foodFilter ]
    let required = 0
    usable.forEach(function(filter) {
      let index = 0
      eachTileItem(tileItems, shuffledItems, filter, function(usables) {
        let replacement
        let tile
        while (true) {
          replacement = usables[index]
          index = (index + 1) % usables.length
          const tiles = shuffledTiles.slice()
          let tileCount = 0
          let blockCount = 0
          do {
            tile = takeTile(tiles, blacklist(replacement))
            if (tile) {
              tileCount++
              if (isBlocked(items, blocked, [tile], replacement)) {
                blockCount++
              } else {
                break
              }
            }
          } while (tile)
          if (tile || blockCount === tileCount) {
            break
          }
        }
        if (!tile) {
          replacement = itemFromId(0, undefined, pool)
          tile = takeTile(shuffledTiles.slice(), blacklist(replacement))
        }
        util.assert.notEqual(tile, undefined)
        shuffledTiles.splice(shuffledTiles.indexOf(tile), 1)
        pushTile.call(replacement, tile)
      })
    })
    util.assert.equal(shuffledTiles.length, 0)
    // Handle planned placements.
    if (typeof(planned) === 'object') {
      Object.getOwnPropertyNames(planned).filter(function(zone) {
        return zone !== 'blocked'
      }).forEach(function(zone) {
        const zoneItems = planned[zone]
        Object.getOwnPropertyNames(zoneItems).forEach(function(itemName) {
          const itemZoneNames = []
          if (zone === '*') {
            Array.prototype.push.apply(itemZoneNames, zoneNames)
          } else {
            itemZoneNames.push(zone)
          }
          const itemZones = itemZoneNames.map(function(zoneName) {
            return constants.ZONE[zoneName]
          })
          // Collect target items.
          const targets = items.filter(function(item) {
            return (itemName === '*' || item.name === itemName)
              && util.nonProgressionFilter(item)
              && util.tilesFilter(item)
          })
          // Replace tiles.
          const map = zoneItems[itemName]
          Object.getOwnPropertyNames(map).forEach(function(index) {
            index = parseInt(index)
            const replaceName = randItem(rng, map[index])
            let poolItem = util.itemFromName(replaceName, pool)
            if (!poolItem) {
              const item = util.itemFromName(replaceName)
              poolItem = Object.assign({}, item)
              delete poolItem.tiles
              addon.push(poolItem)
            }
            poolItem.tiles = poolItem.tiles || []
            targets.forEach(function(target) {
              const tiles = collectTiles([target], function(tile) {
                return 'zones' in tile
                  && itemZones.indexOf(tile.zones[0]) !== -1
                  && !util.rewardTileFilter(tile)
                  && !util.dropTileFilter(tile)
              }).filter(function(tile, tileIndex) {
                return itemName === '*' || tileIndex === index
              })
              // Remove tiles that may have been previously randomized.
              pool.forEach(function(item) {
                if (item.tiles) {
                  tiles.forEach(function(tile) {
                    const index = item.tiles.indexOf(tile)
                    if (index !== -1) {
                      item.tiles.splice(index, 1)
                    }
                  })
                }
              })
              // Push tiles to planned item.
              pushTile.apply(poolItem, tiles)
            })
          })
        })
      })
    }
  }

  function randomizeEnemyDrops(rng, items, blocked, pool, addon, planned) {
    // Replace the axe subweapon drop with a random subweapon.
    const subweaponTiles = collectTiles(items.filter(function(item) {
      return util.itemTileFilter(util.dropTileFilter)(item)
        && subweaponFilter(item)
    }), util.dropTileFilter)
    const subweapons = shuffled(rng, pool.filter(subweaponFilter))
    let subweapon
    {
      let index = 0
      do {
        subweapon = subweapons[index++]
      } while (blocked
               && blocked['Axe Knight']
               && blocked['Axe Knight'].indexOf(subweapon.name) !== -1)
    }
    while (subweaponTiles.length) {
      pushTile.call(subweapon, takeTile(subweaponTiles))
    }
    // Collect counts of equipment types dropped by more than one enemy.
    const dupTypes = {}
    items.forEach(function(item) {
      if (equipmentFilter(item) && !salableFilter(item) && item.tiles) {
        const enemiesDrops = item.tiles.filter(function(tile) {
          return 'enemy' in tile && tile.enemy !== GLOBAL_DROP
        }).map(function(tile) {
          return tile.enemy
        })
        if (enemiesDrops.length > 1) {
          dupTypes[item.type] = dupTypes[item.type] || []
          dupTypes[item.type].push(enemiesDrops.length - 1)
        }
      }
    })
    // Duplicate equipment as necessary.
    const dupped = []
    const types = pool.reduce(typeReduce, [])
    types[TYPE.ACCESSORY] = types[TYPE.ACCESSORY] || []
    types[TYPE.ACCESSORY] = types[TYPE.ACCESSORY].filter(nonsalableFilter)
    Object.getOwnPropertyNames(dupTypes).forEach(function(type) {
      type = parseInt(type)
      types[type] = types[type] || []
      const items = shuffled(rng, types[type])
      dupTypes[type].forEach(function(count) {
        const item = items.shift()
        dupped.push(item)
        Array.prototype.push.apply(pool, Array(count).fill(item))
      })
    })
    // Shuffle items.
    const shuffledItems = shuffled(rng, pool)
    // Get all drop items.
    const dropItems = items.filter(function(item) {
      return util.itemTileFilter(util.dropTileFilter)(item)
        && !subweaponFilter(item)
        && util.itemTileFilter(function(tile) {
          return !tile.librarian && tile.enemy !== GLOBAL_DROP
        })(item)
    })
    const tileItems = dropItems.map(cloneTilesMap(function(tile) {
      return util.dropTileFilter(tile)
        && !tile.librarian
        && tile.enemy !== GLOBAL_DROP
    }))
    // Create filter that ensures enemies don't drop the same item twice.
    const drops = {}
    const uniqueDrops = function(item) {
      return function(tile) {
        if (blacklist(item)(tile)
            && (!tile.enemy in drops || drops[tile.enemy] !== item.id)) {
          drops[tile.enemy] = item.id
          return true
        }
      }
    }
    const isBlocked = function(enemy, replacement) {
      if (blocked) {
        const names = [enemy.name, '*']
        for (let key of names) {
          if (blocked[key]
              && blocked[key].indexOf(replacement.name) !== -1) {
            return true
          }
        }
      }
    }
    // Shuffle all drop tiles.
    const shuffledTiles = shuffled(rng, collectTiles(tileItems))
    // Distribute gold with same id frequency as vanilla.
    const goldItems = dropItems.filter(goldFilter)
    goldItems.forEach(function(goldItem) {
      let index = 0
      eachTileItem(tileItems, shuffledItems, function(item) {
        return goldFilter(item) && item.id === goldItem.id
      }, function(gold) {
        gold = shuffled(rng, gold)
        let replacement
        let tile
        while (true) {
          replacement = gold[index]
          index = (index + 1) % gold.length
          const tiles = shuffledTiles.slice()
          let enemy
          let tileCount = 0
          let blockCount = 0
          do {
            tile = takeTile(tiles, uniqueDrops(replacement))
            if (tile) {
              enemy = enemiesDrops.filter(function(enemy) {
                return enemy.id === tile.enemy
              })
              tileCount++
              if (isBlocked(enemy, replacement)) {
                blockCount++
              } else {
                break
              }
            }
          } while (tile)
          if (tile || blockCount === tileCount) {
            break
          }
        }
        if (!tile) {
          replacement = itemFromId(0, undefined, pool)
          tile = takeTile(shuffledTiles.slice(), uniqueDrops(replacement))
        }
        util.assert.notEqual(tile, undefined)
        shuffledTiles.splice(shuffledTiles.indexOf(tile), 1)
        pushTile.call(replacement, tile)
      })
    })
    // Distribute jewels with same id frequency as vanilla.
    const salableItems = dropItems.filter(salableFilter)
    salableItems.forEach(function(salableItem) {
      let index = 0
      eachTileItem(tileItems, shuffledItems, function(item) {
        return item.id === salableItem.id
      }, function(jewels) {
        jewels = shuffled(rng, jewels)
        let replacement
        let tile
        while (true) {
          replacement = jewels[index]
          index = (index + 1) % jewels.length
          const tiles = shuffledTiles.slice()
          let enemy
          let tileCount = 0
          let blockCount = 0
          do {
            tile = takeTile(tiles, uniqueDrops(replacement))
            if (tile) {
              enemy = enemiesDrops.filter(function(enemy) {
                return enemy.id === tile.enemy
              })
              tileCount++
              if (isBlocked(enemy, replacement)) {
                blockCount++
              } else {
                break
              }
            }
          } while (tile)
          if (tile || blockCount === tileCount) {
            break
          }
        }
        if (!tile) {
          replacement = itemFromId(0, undefined, pool)
          tile = takeTile(shuffledTiles.slice(), uniqueDrops(replacement))
        }
        util.assert.notEqual(tile, undefined)
        shuffledTiles.splice(shuffledTiles.indexOf(tile), 1)
        pushTile.call(replacement, tile)
      })
    })
    // Distribute equipment with same type frequency as vanilla.
    const equipment = [
      weaponFilter,
      shieldFilter,
      helmetFilter,
      armorFilter,
      cloakFilter,
      nonsalableFilter,
    ]
    equipment.forEach(function(filter) {
      let index = 0
      eachTileItem(tileItems, shuffledItems, filter, function(eq) {
        eq = shuffled(rng, eq)
        let replacement
        let tile
        while (true) {
          replacement = eq[index]
          index = (index + 1) % eq.length
          const tiles = shuffledTiles.slice()
          let enemy
          let tileCount = 0
          let blockCount = 0
          do {
            tile = takeTile(tiles, uniqueDrops(replacement))
            if (tile) {
              enemy = enemiesDrops.filter(function(enemy) {
                return enemy.id === tile.enemy
              })
              tileCount++
              if (isBlocked(enemy, replacement)) {
                blockCount++
              } else {
                break
              }
            }
          } while (tile)
          if (tile || blockCount === tileCount) {
            break
          }
        }
        if (!tile) {
          replacement = itemFromId(0, undefined, pool)
          tile = takeTile(shuffledTiles.slice(), uniqueDrops(replacement))
        }
        util.assert.notEqual(tile, undefined)
        shuffledTiles.splice(shuffledTiles.indexOf(tile), 1)
        pushTile.call(replacement, tile)
      })
    })
    // Distribute usable items randomly.
    const usable = [ usableFilter, foodFilter ]
    usable.forEach(function(filter) {
      let index = 0
      eachTileItem(tileItems, shuffledItems, filter, function(usables) {
        usables = shuffled(rng, usables)
        let replacement
        let tile
        while (true) {
          replacement = usables[index]
          index = (index + 1) % usables.length
          const tiles = shuffledTiles.slice()
          let enemy
          let tileCount = 0
          let blockCount = 0
          do {
            tile = takeTile(tiles, uniqueDrops(replacement))
            if (tile) {
              enemy = enemiesDrops.filter(function(enemy) {
                return enemy.id === tile.enemy
              })
              tileCount++
              if (isBlocked(enemy, replacement)) {
                blockCount++
              } else {
                break
              }
            }
          } while (tile)
          if (tile || blockCount === tileCount) {
            break
          }
        }
        if (!tile) {
          replacement = itemFromId(0, undefined, pool)
          tile = takeTile(shuffledTiles.slice(), uniqueDrops(replacement))
        }
        util.assert.notEqual(tile, undefined)
        shuffledTiles.splice(shuffledTiles.indexOf(tile), 1)
        pushTile.call(replacement, tile)
      })
    })
    util.assert.equal(shuffledTiles.length, 0)
    // Replace the librarian's drops.
    const libTiles = collectTiles(items, function(tile) {
      return tile.librarian
    })
    const eq = shuffled(rng, pool.filter(equipmentFilter))
    while (libTiles.length) {
      let replacement
      let tile
      let index = 0
      do {
        replacement = eq[index]
        index = (index + 1) % eq.length
        const tiles = libTiles.slice()
        let tileCount = 0
        let blockCount = 0
        do {
          tile = takeTile(tiles, blacklist(replacement))
          if (tile) {
            tileCount++
            if (isBlocked({name: 'Librarian'}, replacement)) {
              blockCount++
            } else {
              break
            }
          }
        } while (tile)
        if (tile || blockCount === tileCount) {
          break
        }
      } while (tile)
      if (!tile) {
        replacement = itemFromId(0, undefined, pool)
        tile = takeTile(shuffledTiles.slice(), blacklist(replacement))
      }
      libTiles.splice(libTiles.indexOf(tile), 1)
      util.assert.notEqual(tile, null)
      pushTile.call(replacement, tile)
    }
    // Place planned drops.
    if (planned) {
      Object.getOwnPropertyNames(planned).forEach(function(key) {
        // Get enemies being targeted.
        let targets
        if (key === '*') {
          targets = enemiesDrops.concat([{librarian: true}])
        } else if (key === GLOBAL_DROP) {
          targets = [{id: GLOBAL_DROP}]
        } else if (key.toLowerCase() === 'librarian') {
          targets = [{librarian: true}]
        } else {
          targets = [util.enemyFromIdString(key)]
        }
        targets.forEach(function(target) {
          const matches = items.filter(util.itemTileFilter(function(tile) {
            if (target.librarian) {
              return tile.librarian
            }
            return target.id === tile.enemy
          }))
          // Get drop tiles for targeted enemies.
          let tiles
          if (matches.length > 0) {
            tiles = matches.reduce(function(tiles, item) {
              const enemyTiles = item.tiles.filter(function(tile) {
                if (target.librarian) {
                  return tile.librarian
                }
                return !tile.noOffset && target.id === tile.enemy
              })
              Array.prototype.push.apply(tiles, enemyTiles)
              return tiles
            }, []).sort(function(a, b) {
              if ('addresses' in a) {
                a = a.addresses[0]
              } else if ('index' in a) {
                const zone = zones[a.zones[0]]
                const offset = zone.items + 0x02 * a.index
                a = util.romOffset(zone, offset)
              }
              if ('addresses' in b) {
                b = b.addresses[0]
              } else if ('index' in b) {
                const zone = zones[b.zones[0]]
                const offset = zone.items + 0x02 * b.index
                b = util.romOffset(zone, offset)
              }
              return a - b
            })
          } else {
            // If the targeted enemy doesn't have drops, create tiles for them.
            tiles = target.dropAddresses.map(function(address) {
              return {
                addresses: [address],
                enemy: target.id,
              }
            })
          }
          // Remove collected tiles from the pool.
          tiles.forEach(function(tile) {
            pool.forEach(function(item) {
              if (item.tiles) {
                const index = item.tiles.indexOf(tile)
                if (index !== -1) {
                  item.tiles.splice(index, 1)
                }
              }
            })
          })
          // Replace tiles with items.
          let drops = planned[key]
          let count
          if (key === GLOBAL_DROP) {
            count = globalDropsCount
          } else if (target.librarian) {
            count = 3
          } else {
            count = target.dropAddresses.length
          }
          if (drops) {
            drops = drops.slice(0, count)
          } else {
            drops = Array(count).fill(null)
          }
          drops.forEach(function(itemName, index) {
            const item = util.itemFromName(itemName || 'Heart')
            let target = pool.filter(function(drop) {
              return drop.id === item.id && drop.type === item.type
            })[0]
            if (!target) {
              target = Object.assign({}, util.itemFromName(item))
              delete target.tiles
              addon.push(target)
            }
            pushTile.call(target, tiles[index])
          })
        })
      })
    }
    // The required Short Sword and Red Rust drops were ignored.
    // Push those tiles onto whatever item they ended up being replaced with.
    const pushReplacement = function(name) {
      const tiles = util.itemFromName(name).tiles
      const noOffsetTile = tiles.filter(function(tile) {
        return tile.noOffset
      })[0]
      const offsetTile = tiles.filter(function(tile) {
        return !tile.noOffset
      })[0]
      const replacement = (addon || []).concat(pool).filter(function(item) {
        return item.tiles && item.tiles.some(function(tile) {
          if (tile === undefined) {
            if (name === 'Short sword') {
              addresses = [ 0x0b6b3c ]
            }
            else if (name === 'Red Rust') {
              addresses = [ 0x0b6b3a ]
            }
            return addresses
              && addresses[0] === offsetTile.addresses[0]
          }
          return tile.addresses
            && tile.addresses[0] === offsetTile.addresses[0]
        })
      })[0]
      pool.forEach(function(item) {
        if (item.tiles) {
          let index = -1
          item.tiles.forEach(function(tile, tileIndex) {
            if (tile === undefined) {
              index = tileIndex
            }
            else if (tile.addresses
                && tile.addresses[0] === noOffsetTile.addresses[0]) {
              index = tileIndex
            }
          })
          if (index !== -1) {
            item.tiles.splice(index, 1)
          }
        }
      })
      if (replacement) {
        pushTile.call(replacement, noOffsetTile)
      }
    }
    pushReplacement('Short sword')
    pushReplacement('Red Rust')
    // Remove duplicated items.
    dupped.forEach(function(dupped) {
      let count
      do {
        count = pool.filter(function(item) { return item === dupped }).length
        const index = pool.indexOf(dupped)
        if (index !== -1) {
          pool.splice(index, 1)
        }
      } while (--count > 1)
    })
  }

  // function darken(color) {
  //   const r = Math.floor(((color >>> 10) & 0x1f) * .75)
  //   const g = Math.floor(((color >>> 5) & 0x1f) * .75)
  //   const b = Math.floor((color & 0x1f) * .75)
  //   return 0x80000000 | (r << 10) | (g << 10) | b
  // }

  function ConvertRGBToSotN(r, g, b) {                                          // Code by Wecoc, converted by eldri7ch
    return (Math.floor(r / 8) + (Math.floor(g / 8) << 5) + (Math.floor(b / 8) << 10)) + 32768
  }

  function randomizeCapeColors(data, rng) {                                     // Code provided by Wecoc; doppelganger addresses by MottZilla; code converted by eldri7ch
    let liningAddress
    let outerAddress
    let outBrightColorRed
    let outDarkColorRed
    let outBrightColorGreen
    let outDarkColorGreen
    let outBrightColorBlue
    let outDarkColorBlue
    let inBrightColorRed
    let inDarkColorRed
    let inBrightColorGreen
    let inDarkColorGreen
    let inBrightColorBlue
    let inDarkColorBlue
    let outBrightColor
    let outDarkColor
    let inBrightColor
    let inDarkColor
    let i = 0

    while (i < 10) {
      // genrate dark colors and light colors for both linings
      // start by randomizing individual RGB values
      outBrightColorRed = Math.floor(rng() * 92) + 8
      outDarkColorRed = Math.max(outBrightColorRed - 8, 8)
      outBrightColorGreen = Math.floor(rng() *  92) + 8
      outDarkColorGreen = Math.max(outBrightColorGreen - 8, 8)
      outBrightColorBlue = Math.floor(rng() *  92) + 8
      outDarkColorBlue = Math.max(outBrightColorBlue - 8, 8)
      inBrightColorRed = Math.floor(rng() * 92) + 8
      inDarkColorRed = Math.max(inBrightColorRed - 8, 8)
      inBrightColorGreen = Math.floor(rng() *  92) + 8
      inDarkColorGreen = Math.max(inBrightColorGreen - 8, 8)
      inBrightColorBlue = Math.floor(rng() *  92) + 8
      inDarkColorBlue = Math.max(inBrightColorBlue - 8, 8)
      //aggregate the randomized RGB into a single 2-byte write
      outBrightColor = ConvertRGBToSotN(outBrightColorRed, outBrightColorGreen, outBrightColorBlue)
      outDarkColor = ConvertRGBToSotN(outDarkColorRed, outDarkColorGreen, outDarkColorBlue)
      inBrightColor = ConvertRGBToSotN(inBrightColorRed, inBrightColorGreen, inBrightColorBlue)
      inDarkColor = ConvertRGBToSotN(inDarkColorRed, inDarkColorGreen, inDarkColorBlue)
      //identify the addresses to write new colors to
      switch (i) {
        case 0: // Cloth Cape
          liningAddress = 0x0afb84
          outerAddress = 0x0afb88
          break
        case 1: // Reverse Cloak A
          liningAddress = 0x0afb7c
          outerAddress = 0x0afb80
          break
        case 2: // Reverse Cloak B
          liningAddress = 0x0afbb8
          outerAddress = 0x0afbbc
          break
        case 3: // Elven Cloak
          liningAddress = 0x0afb94
          outerAddress = 0x0afb98
          break
        case 4: // Crystal Cloak
          liningAddress = 0x0afba4
          outerAddress = 0x0afba8
          break
        case 5: // Royal Cloak
          liningAddress = 0x0afb8c
          outerAddress = 0x0afb90
          break
        case 6: // Blood Cloak
          liningAddress = 0x0afb9c
          outerAddress = 0x0afba0
          break
        case 7: // Twilight Cloak
          liningAddress = 0x0afa44
          outerAddress = 0x0afbac
          break
        case 8: // Doppelganger 10
          liningAddress = 0x627984c
          outerAddress = 0x6279850
          break
        case 9: // Doppelganger 40
          liningAddress = 0x6894054
          outerAddress = 0x6894058
          break
      }
      //write the inner lining
      data.writeShort(liningAddress + 0x00, inBrightColor)
      data.writeShort(liningAddress + 0x02, inDarkColor)
      //write the outer lining, but crystal cloak should be crystal cloak.
      if (i === 4) {
        data.writeShort(outerAddress + 0x00, 0x0000)
        data.writeShort(outerAddress + 0x02, outDarkColor)
      } else {
        data.writeShort(outerAddress + 0x00, outBrightColor)
        data.writeShort(outerAddress + 0x02, outDarkColor)
      }
      //advance the cape being randomized
      i++
    }
  }

  function randomizeDraculaCape(data, rng){
    const draculaCapePaletteCount = 8
    let colorDC = Math.floor(rng() * draculaCapePaletteCount)
    offset = 0
    const palettesDraculaCape = [
      [0x9c21, 0xbc42, 0xd0a1],  //Blue
      [0x8d03, 0x8a23, 0x82e7],  //Green
      [0x8008, 0x8011, 0x801C],  //Default Red
      [0x9448, 0xd492, 0xd93b],  //Pink
      [0x8d2d, 0x9a36, 0x9bbd],  //Yellow
      [0xa129, 0xb231, 0xdb39],  //Gray
      [0x9422, 0xa826, 0xb867],  //Purple
      [0x8000, 0x8821, 0x8c63],  //Black
    ]
    offset = 0x535D4EA
    if(colorDC >= draculaCapePaletteCount){
      colorDC = 0;
    }
    for (let i = 0; i < 3; i++) {
      offset = data.writeShort(offset,palettesDraculaCape[colorDC][i])
    }
  }

  function randomizeHydroStormColor(data, rng){
    const color1 = Math.floor(rng() * 0x100)
    const color2 = Math.floor(rng() * 0x100)
    const color3 = Math.floor(rng() * 0x100)
    const color4 = Math.floor(rng() * 0x100)
    const color5 = Math.floor(rng() * 0x100)
    data.writeChar(0x3A19544, color1)
    data.writeChar(0x3A19550, color2)
    data.writeChar(0x3A19558, color3)
    data.writeChar(0x3A19560, color4)
    data.writeChar(0x3A19568, color5)
  }

  function randomizeGravBootColors(data, rng) {
    // Base game has 2 bytes that it can set for a0 and a1
    // set at 0x8011e1ac and 0x8011e1b0
    const color1 = Math.floor(rng() * 0x100)
    data.writeChar(0x13C814, color1)
    const color2 = Math.floor(rng() * 0x100)
    data.writeChar(0x13C818, color2)
    const primWriteAddressStart = 0x13C82A
    //Iterate through 12 values (r,g,and b for 4 prim corners)
    for (var i = 0; i < 12; i++) {
      // Select one color. 0x60 means 0, 0x64 is color1, 0x65 is color2.
      const selectionIndex = Math.floor(rng() * 3)
      const selectionByte = [0x60, 0x64, 0x65][selectionIndex]
      // Go to the proper byte within the sb instruction and change which register writes
      const targetAddress = primWriteAddressStart + i * 4
      data.writeChar(targetAddress, selectionByte)
    }
  }

  // Wing smash uses a palette pulled from the GPU.
  // By default, this is palette #0x8102 (see EntityWingSmashTrail in decomp)
  // Keep the 0x8100, but change the lower byte to pick a random palette.
  // This write is to 8011e438 at runtime.
  function randomizeWingSmashColor(data,rng) {
    // Index 0 in most cluts is transparent. In some it is not. In these non-transparent cluts, we won't
    // get a recolored wing smash outline and will instead get an ugly rectangle, since all the pixels
    // that are supposed to be transparent won't be. These CLUTS were identified by python script as having
    // a non-transparent index 0. If we get one of them, we will re-roll the palette.

    // Dev note: The bad palettes were not "removed" by that Python script. This has been revised to use a 
    // combination of the two methods. -eldri7ch
    const good_cluts = [0, 1, 3, 4, 5, 6, 7, 9, 13, 28, 40, 80, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 
      99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 118, 129, 130, 131, 132, 133, 134,
       135, 136, 151, 152, 154, 156, 160, 163, 168, 174, 241, 242, 243, 245, 249, 254]
    var newPalette
    var newOutline
    
    newPalette = Math.floor(rng() * 0x100)
    newOutline = Math.floor(rng() * 0x10000)

    if (good_cluts.includes(newPalette)) {
      data.writeChar(0x13caa0, newPalette)    // define new palette if it's a good palette
    } else {
      data.writeShort(0xef990, newOutline)    // otherwise use a new color for the outline
    }
  }

  function randomizeRichterColor(data, rng){
    const RichterPaletteCount = 6
    let colorR = Math.floor(rng() * RichterPaletteCount)
    let offset = 0
    const RichterOffset = [         //Offsets for the pause UI during Prologue.
      0x38BE9EA,0x38BEA0A,0x38BEA2A,0x38BEA4A,0x38BEA6A,0x38BEAAA,0x38BEACA,0x38BEAEA,0x38BEB0A,0x38BEB2A,0x38BEB4A,0x38BEB6A
    ]
    const palettesRichter = [
      [0x0000,0x8000,0xb185,0xc210,0xd294,0xf39c,0xfd80,0xb000,0x80ac,0x9556,0xb21c,0xc29c,0xd33c,0x8194,0xfc00,0x801f], //Blue
      [0x0000,0x8000,0xb185,0xc210,0xd294,0xf39c,0xaa80,0x8080,0x80ac,0x9556,0xb21c,0xc29c,0xd33c,0x8194,0x8180,0xfc1f], //Green
      [0x0000,0x8000,0xa906,0xbd8d,0xdab6,0xffff,0x801e,0x8009,0x80cd,0x9956,0xbe7f,0xcedf,0xdb7f,0x81f2,0x8013,0x83e0], //Red
      [0x0000,0x8000,0xa906,0xbd8d,0xdab6,0xffff,0xa4e9,0x9402,0x80cd,0x9956,0xbe7f,0xcedf,0xdb7f,0x81f2,0x94a2,0xff80], //Black
      [0x0000,0x8000,0xB185,0xC210,0xD294,0xF39C,0xFD97,0xB007,0xB04C,0x9556,0xB21C,0xC29C,0xD33C,0x8194,0xFC10,0x801F], //Purple (MottZilla)
      [0x0000,0x8000,0xb185,0xc210,0xd294,0xf39c,0xc104,0x9821,0x8067,0x8ced,0x9d72,0xa9b1,0xa5f6,0x910d,0xc084,0x819f]  //the_swarm
    ];
    if(colorR >= RichterPaletteCount){
      colorR = 0;
    }
    offset = 0x38BED78                                                                                                   //Richter's main palette.
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    offset = 0x38BEED8                                                                                                   //Richter's alternate palettes when using item crash.
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    offset = 0x436BA9C                                                                                                   //Richter's palette for ending cutscene.
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    offset = 0x562266C                                                                                                   //Richter's palette for saving Richter cutscene.
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    offset = 0x63CD658                                                                                                   //Richter's palette for his Boss Fight.
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    offset = 0x63CD7B8                                                                                                   //Richter's alternate paletts when using item crashes during Boss Fight. 
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesRichter[colorR][i])
    }
    offset = 0x6113772                                                                                                   //Richter's Colosseum cutscene. 
    offset = data.writeShort(offset,palettesRichter[colorR][14])
    offset = data.writeShort(offset,palettesRichter[colorR][7])
    offset = data.writeShort(offset,palettesRichter[colorR][6])
    offset = 0x38BE9EA                                                                                                   //Richter's pause UI. 
    for (let i = 0; i < 12; i++) {
      offset = data.writeShort(RichterOffset[i],palettesRichter[colorR][14])
    }
    offset = 0x38BEA1A                                                                                                   //Richter's Health Bar. 
    offset = data.writeShort(offset,palettesRichter[colorR][6])
    offset = data.writeShort(offset,palettesRichter[colorR][14])
    offset = data.writeShort(offset,palettesRichter[colorR][7])
    
  }

  function randomizeMariaColor(data, rng){
    const MariaPaletteCount = 6
    let colorM = Math.floor(rng() * MariaPaletteCount)
    let offset = 0
    const palettesMaria = [
      [0x0000,0x84c9,0x8d53,0xa1f9,0xb6fc,0x8180,0x8280,0xab2a,0x9218,0x931f,0x9463,0x9ce7,0xb148,0xca2e,0xe2f6,0xef7b], // Default
      [0x0000,0x84c9,0x8d53,0xa1f9,0xb6fc,0xb0a0,0xd120,0xe62a,0x9218,0x931f,0x9463,0x9ce7,0xb148,0xca2e,0xe2f6,0xef7b], // Blue
      [0x0000,0xb04c,0x8d53,0xb1f9,0xcafd,0xb4f3,0xbd9a,0xd1de,0x9218,0x931f,0xa488,0x9ce7,0xb1a7,0xca2e,0xe2f6,0xef7b], // Pink
      [0x0000,0xb50a,0x8d53,0xa1f9,0xb6fc,0xde04,0xd6e3,0xeb49,0x9218,0x931f,0xb486,0xb50a,0xbd69,0xd26d,0xe2f6,0xef7b], // Light blue
      [0x0000,0x84c9,0x950f,0xa1f9,0xb6fc,0x9c64,0x98c8,0xa906,0x9218,0x931f,0x9463,0x9ce7,0xa906,0xb9ac,0xd6b2,0xef7b], // Black
      [0x0000,0xb04c,0x8d53,0xa9b8,0xc29c,0xbc49,0xd06f,0xf8b1,0x9218,0x931f,0x9463,0x9ce7,0xb1a7,0xca2e,0xe2f6,0xef7b], // Purple
    ];
    if(colorM >= MariaPaletteCount){
      colorM = 0;
    }
    offset = 0x436BA7C                                                                                                   //Ending Cutscene
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesMaria[colorM][i])
    }
    offset = 0x45638F4                                                                                                   //Holy Glasses Cutscene
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesMaria[colorM][i])
    }
    offset = 0x4690EE4                                                                                                   //Silver Ring Cutscene
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesMaria[colorM][i])
    }
    offset = 0x54CA704                                                                                                   //Alchemy Labs Cutscene
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesMaria[colorM][i])
    }
    offset = 0x562220C                                                                                                   //Save Richter Cutscene
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesMaria[colorM][i])
    }
    offset = 0x631620C                                                                                                   //Hippogriff Cutscene
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesMaria[colorM][i])
    }
    offset = 0x650E768                                                                                                   //Clock Room Cutscene
    for (let i = 0; i < 16; i++) {
      offset = data.writeShort(offset,palettesMaria[colorM][i])
    }
  }

  function randomizeMenuBgColor(data, rng){
    let redVal
    let greenVal
    let blueVal
    let baseWrite = 0x34020000                                                    // for this, register 2 is used
    let redWrite
    let greenWrite
    let blueWrite
    let offset = 0x000fa948
    const colorArray = ["r1","g1","b1"]
    let colorShuffled = shuffled(rng, colorArray)                                     // Shuffle the colors to randomize which becomes primary, secondary, tertiary
    
    let primary = colorShuffled.pop()                                           // Choose a primary color for the Menu
    let secondary = colorShuffled.pop()                                         // Secondary color will be sometimes present but not too much
    let tertiary = colorShuffled.pop()                                          // This color will never appear

    switch (primary) {                                                          // The primary has a max value of 15 (0x0f)
      case "r1":
        redVal = Math.floor(rng() * 0x09)
        redWrite = util.numToHex(baseWrite + redVal)
        break
      case "g1":
        greenVal = Math.floor(rng() * 0x09)
        greenWrite = util.numToHex(baseWrite + greenVal)
        break
      case "b1":
        blueVal = Math.floor(rng() * 0x09)
        blueWrite = util.numToHex(baseWrite + blueVal)
        break
    }
    switch (secondary) {                                                        // the Secondary has a max value of 08
      case "r1":
        redVal = Math.floor(rng() * 0x06)
        redWrite = util.numToHex(baseWrite + redVal)
        break
      case "g1":
        greenVal = Math.floor(rng() * 0x06)
        greenWrite = util.numToHex(baseWrite + greenVal)
        break
      case "b1":
        blueVal = Math.floor(rng() * 0x06)
        blueWrite = util.numToHex(baseWrite + blueVal)
        break
    }
    switch (tertiary) {                                                         // never represented. This makes for less grey menus
      case "r1":
        redWrite = baseWrite
        break
      case "g1":
        greenWrite = baseWrite
        break
      case "b1":
        blueWrite = baseWrite
        break
    }
    
    // this copde literally replaces the ASM that the game normally uses to set the menu color
    // This code was compiled with a repeated function that wasn't needed so we can use the space
    offset = data.writeWord(offset, 0x3C108003)                                 
    offset = data.writeWord(offset, 0x3610CAC0)                                 // populate r16 with the address 0x8003cac0 (used again later in and out of our code)                       
    offset = data.writeWord(offset, redWrite)
    offset = data.writeWord(offset, 0xAE020000)                                 // Write the red color to 0x8003cac0
    offset = data.writeWord(offset, greenWrite)
    offset = data.writeWord(offset, 0xAE020004)                                 // green to 0x8003cac4
    offset = data.writeWord(offset, blueWrite)
    offset = data.writeWord(offset, 0xAE020008)                                 // blue to 0x8003cac8
    data.writeWord(offset, 0x34020001)                                          // r2 needed to be set to 1 after this.
  }
  
  function randomizeItems(rng, items, newNames, options) {
    const data = new util.checked()
    const info = util.newInfo()
    const addon = []
    let pool
    if (options.startingEquipment) {
      // Randomize starting equipment.
      let planned
      if (typeof(options.startingEquipment) === 'object') {
        planned = options.startingEquipment
      }
      randomizeStartingEquipment(
        data,
        rng,
        items,
        options.startingEquipment.blocked,
        newNames,
        info,
        planned,
        options,
      )
    }
    while (true) {
      try {
        // Get pool of randomizable items.
        pool = items.filter(function(item) {
          if (item.name === 'Sword Familiar') {
            return false
          }
          if (!util.nonProgressionFilter(item)) {
            return false
          }
          if (foodFilter(item)) {
            return true
          }
          if (options.itemLocations
              && (util.itemTileFilter(util.mapTileFilter)(item)
                  || util.itemTileFilter(util.shopTileFilter)(item)
                  || util.itemTileFilter(util.candleTileFilter)(item)
                  || util.itemTileFilter(util.tankTileFilter)(item))) {
            return true
          }
          if (options.enemyDrops
              && util.itemTileFilter(util.dropTileFilter)(item)
              && util.itemTileFilter(function(tile) {
                return tile.enemy !== GLOBAL_DROP
              })) {
            return true
          }
          if (options.startingEquipment
              && equipmentFilter(item)) {
            return true
          }
          if (options.prologueRewards
              && util.itemTileFilter(util.rewardTileFilter)(item)) {
            return true
          } 
        }).map(function(item) {
          item = Object.assign({}, item)
          delete item.tiles
          return item
        })
        // Randomizations.
        if (options.itemLocations) {
          // Randomize candles.
          randomizeCandles(rng, items, options.itemLocations.blocked, pool)
          // Randomize tank items.
          if (!options.turkeyMode) {
            randomizeSubweaponTanks(
              rng,
              items,
              options.itemLocations.blocked,
              pool,
            )
          }
          // Randomize shop items.
          randomizeShopItems(rng, items, options.itemLocations.blocked, pool)
          // Randomize map items.
          randomizeMapItems(
            rng,
            items,
            options.itemLocations.blocked,
            pool,
            options.itemLocations,
            addon,
          )
        }
        if (options.enemyDrops) {
          // Randomize enemy drops.
          let planned
          if (typeof(options.enemyDrops) === 'object') {
            planned = Object.assign({}, options.enemyDrops)
            delete planned.blocked
          }
          randomizeEnemyDrops(
            rng,
            items,
            options.enemyDrops.blocked,
            pool,
            addon,
            planned,
          )
        }
        if (options.prologueRewards) {
          // Randomize prologue rewards.
          let planned
          if (typeof(options.prologueRewards) === 'object') {
            planned = options.prologueRewards
          }
          randomizePrologueRewards(
            rng,
            items,
            options.prologueRewards.blocked,
            pool,
            addon,
            planned,
          )
        }
        // Turkey mode.
        if (options.turkeyMode) {
          turkeyMode(items, pool)
        }
        // Color Palette Rando mode.
        if (options.colorrandoMode) {
          randomizeCapeColors(data, rng)
          randomizeGravBootColors(data,rng)
          randomizeHydroStormColor(data, rng)
          randomizeWingSmashColor(data,rng)
          randomizeRichterColor(data,rng)
          randomizeDraculaCape(data,rng)
          randomizeMariaColor(data,rng)
          randomizeMenuBgColor(data, rng)
        }
        // Write items to ROM.
        if (options.itemLocations
            || options.enemyDrops
            || options.prologueRewards) {
          const itemsToWrite = (addon.concat(pool)).filter(util.tilesFilter)
          itemsToWrite.forEach(writeTiles(data))
        }
      } catch (err) {
        if (err.name === 'AssertionError') {
          continue
        }
        throw err
      }
      break
    }
    return {
      data: data,
      info: info,
    }
  }

  const exports = randomizeItems
  if (self) {
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      randomizeItems: exports,
    })
  } else {
    module.exports = exports
  }
})(typeof(self) !== 'undefined' ? self : null)
