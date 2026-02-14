(function(self) {

  let constants
  let errors
  let extension
  let presets
  let relics
  let util
  let cores
  if (self) {
    constants = self.sotnRando.constants
    errors = self.sotnRando.errors
    extension = self.sotnRando.extension
    presets = self.sotnRando.presets
    relics = self.sotnRando.relics
    util = self.sotnRando.util
  } else {
    constants = require('./constants')
    errors = require('./errors')
    extension = require('./extension')
    presets = require('../build/presets')
    relics = require('./relics')
    util = require('./util')
  }

  function items() {
    if (self) {
      return self.sotnRando.items
    }
    return require('./items')
  }

  function getRandomZoneItem(rng, zones, pool, placed) {
    // Collect ids of items that can be replaced for location extension.
    const extensionIds = pool.filter(function(location) {
      return 'extension' in location
    }).map(function(location) {
      return location.itemId
    })
    // Collect item tiles in the zones.
    const zoneTiles = zones.reduce(function(all, zone) {
      const tiles = items().reduce(function(all, item) {
        if (util.nonProgressionFilter(item)
            && extensionIds.indexOf(item.id) === -1) {
          const tiles = (item.tiles || []).filter(function(tile) {
            return util.mapTileFilter(tile)
              && tile.zones.indexOf(zone) !== -1
              && 'index' in tile // Should always be the case
          })
          Array.prototype.push.apply(all, tiles.map(function(tile) {
            return {
              zone: zone,
              item: item,
              tile: tile,
            }
          }))
        }
        return all
      }, [])
      Array.prototype.push.apply(all, tiles)
      return all
    }, [])
    // Unless a wildcard item name was used, don't return items that were
    // placed by the options.
    Object.getOwnPropertyNames(placed).map(
      function(zoneName) {
        const tiles = zoneTiles.filter(function(tile) {
          return constants.zoneNames[tile.zone] === zoneName
        })
        const itemNames = Object.getOwnPropertyNames(placed[zoneName])
        return itemNames.map(function(itemName) {
          const itemTiles = tiles.filter(function(tile) {
            return itemNames.indexOf(tile.item.name) !== -1
          })
          if (itemTiles.length) {
            return Object.getOwnPropertyNames(placed[zoneName][itemName]).map(
              function(index) {
                return itemTiles[parseInt(index)]
              }
            )
          }
          return []
        })
      }
    ).forEach(function(zone) {
      zone.forEach(function(item) {
        item.forEach(function(tile) {
          zoneTiles.splice(zoneTiles.indexOf(tile), 1)
        })
      })
    })
    // Pick a random item to replace.
    return zoneTiles[randIdx(rng, zoneTiles)]
  }

  function writeEntity(data, entity, opts) {
    entity.entities.forEach(function(addr, index) {
      const zone = constants.zones[entity.zones[index >>> 1]]
      if ('x' in opts) {
        data.writeShort(util.romOffset(zone, addr + 0x00), opts.x)
      }
      if ('y' in opts) {
        data.writeShort(util.romOffset(zone, addr + 0x02), opts.y)
      }
      if ('id' in opts) {
        data.writeShort(util.romOffset(zone, addr + 0x04), opts.id)
      }
      if ('slots' in opts) {
        data.writeShort(util.romOffset(zone, addr + 0x06), opts.slots[index])
      }
      if ('state' in opts) {
        data.writeShort(util.romOffset(zone, addr + 0x08), opts.state)
      }
    })
  }

  function writeTileId(data, zones, index, itemId) {
    zones.forEach(function(zone) {
      zone = constants.zones[zone]
      const addr = util.romOffset(zone, zone.items + 0x02 * index)
      data.writeShort(addr, itemId + constants.tileIdOffset)
    })
  }

  function writeIds(data, ids, itemId) {
    ids.forEach(function(id) {
      let value = itemId
      if (itemId && id.tileId) {
        value += constants.tileIdOffset
      }
      id.addresses.forEach(function(address) {
        data.writeShort(address, value)
      })
    })
  }

  function writeInstructions(data, instructions) {
    instructions.forEach(function(instruction) {
      instruction.addresses.forEach(function(address) {
        data.writeWord(address, instruction.instruction)
      })
    })
  }

  function writeMapping(
    data,
    rng,
    mapping,
    placedItems,
    replaced,
    thrustSword,
    newNames,
    removeItems,
  ) {
    const erased = {
      id: 0xffff,
      slots: [ 0x0000, 0x0000 ],
    }
    // Count number of relics per zone.
    const relicCounts = relics.reduce(function(counts, relic) {
      if ('entity' in relic) {
        relic.entity.zones.forEach(function(zone) {
          counts[zone] = (counts[zone] || 0) + 1
        })
      }
      return counts
    }, {})
    // Remove placeholders.
    mapping = Object.getOwnPropertyNames(mapping).reduce(
      function(culled, ability) {
        if (ability[0] != '(' && ability[ability.length - 1] != ')') {
          culled[ability] = mapping[ability]
        }
        return culled
      },
      {},
    )
    // Erase any vanilla location that did not receive a relic.
    const placed = Object.getOwnPropertyNames(mapping).map(function(key) {
      return mapping[key].ability
    })
    const zoneRemovedItems = {}
    const abilities = relics.map(function(relic) {
      return relic.ability
    })
    const locations = getLocations()
    locations.filter(function(location) {
      return abilities.indexOf(location.ability) !== -1
    }).forEach(function(location) {
      if (placed.indexOf(location.ability) === -1) {
        // Erase entities.
        if ('entity' in location
            && (!('erase' in location.entity) || location.entity.erase)) {
          writeEntity(data, location.entity, erased)
        }
        // Erase tile.
        if ('tile' in location) {
          writeEntity(data, location.tile, erased)
        }
        // Erase instructions.
        if ('erase' in location) {
          // Write erase instructions.
          if ('instructions' in location.erase) {
            writeInstructions(data, location.erase.instructions)
          }
        }
      }
    })
    // Write new relic locations.
    Object.getOwnPropertyNames(mapping).forEach(function(key) {
      // Get the relic being placed.
      let relic = util.relicFromAbility(key)
      // The item data if this relic is actually a progression item.
      let item
      if (key in (replaced || {})) {
        item = util.itemFromName(replaced[key])
      } else if (relic.ability === constants.RELIC.THRUST_SWORD) {
        const newName = newNames.filter(function(item) {
          return item.id === thrustSword.id
        }).pop()
        if (newName) {
          item = Object.assign({}, thrustSword, {
            name: newName.name,
          })
        } else {
          item = thrustSword
        }
      } else if ('itemId' in relic) {
        let itemId = relic.itemId
        if (Array.isArray(itemId)) {
          itemId = itemId[randIdx(rng, itemId)]
        }
        const tileId = itemId + constants.tileIdOffset
        item = util.itemFromTileId(items(), tileId)
      }
      // Get the location to place the relic in.
      const location = locations.filter(function(location) {
        return location.id === mapping[key].id
      })[0]
      if ('itemId' in location) {
        if (item) {
          // Replacing item location with item.
          if ('replaceWithItem' in location) {
            location.replaceWithItem(data, location, item)
          } else {
            if ('tile' in location) {
              const tile = location.tile
              writeTileId(data, tile.zones, tile.index, item.id)
              const tileIndex = location.item.tiles.indexOf(tile)
              if (tileIndex !== -1) {
                location.item.tiles.splice(tileIndex, 1)
              }
            }
            if ('ids' in location) {
              writeIds(data, location.ids, item.id)
            }
          }
        } else {
          // Replacing item location with relic.
          if ('replaceWithRelic' in location) {
            location.replaceWithRelic(data, location, relic)
          } else {
            // Get item entity.
            const asRelic = location.asRelic || {}
            writeEntity(data, location.tile, Object.assign({
              id: 0x000b,
              state: relic.relicId,
            }, asRelic))
          }
          // Remove replaced item's tile from randomization pool.
          if ('tileIndex' in location) {
            const tile = location.tile
            const tileIndex = location.item.tiles.indexOf(tile)
            if (tileIndex !== -1) {
              location.item.tiles.splice(tileIndex, 1)
            }
          }
        }
      } else if (item) {
        // Replacing relic location with item.
        let index
        if (!('consumesItem' in location) || location.consumesItem) {
          // There are a limited number of item tiles. Replacing a relic
          // with an item can only consume an existing item in its zone.
          let zones
          if ('entity' in location) {
            zones = location.entity.zones
          } else if ('ids' in location) {
            zones = location.ids.map(function(id) {
              return id.zone
            })
          }
          const tileItem = getRandomZoneItem(
            rng,
            zones,
            locations,
            placedItems,
          )
          index = tileItem.tile.index
          // Remove the tile from the replaced item's tile collection.
          const tileIndex = tileItem.item.tiles.indexOf(tileItem.tile)
          if (tileIndex !== -1) {
            tileItem.item.tiles.splice(tileIndex, 1)
          }
          // Erase the replaced item's entity.
          writeEntity(data, tileItem.tile, erased)
          // Write id in item table.
          writeTileId(data, zones, index, item.id)
          tileItem.tile.zones.forEach(function(zone) {
            zoneRemovedItems[zone] = zoneRemovedItems[zone] || 0
            zoneRemovedItems[zone]++
          })
        }
        if ('replaceWithItem' in location) {
          location.replaceWithItem(data, location, item, index)
        } else {
          if ('entity' in location) {
            writeTileId(data, location.entity.zones, index, item.id)
            const asItem = location.asItem || {}
            writeEntity(data, location.entity, Object.assign({
              id: 0x000c,
              state: index,
            }, asItem))
          }
        }
      } else {
        // Replacing relic location with relic.
        if ('replaceWithRelic' in location) {
          location.replaceWithRelic(data, location, relic)
        } else {
          if ('entity' in location
              && (!('replaceWithRelic' in location.entity)
                  || location.entity.replaceWithRelic)) {
            writeEntity(data, location.entity, {state: relic.relicId})
          }
          if ('reward' in location) {
            const zone = constants.zones[location.reward.zone]
            const index = location.reward.index
            const addr = util.romOffset(zone, zone.rewards + 0x02 * index)
            data.writeShort(addr, relic.relicId)
          }
          if ('ids' in location) {
            writeIds(data, location.ids, relic.relicId)
          }
        }
      }
    })
    // If a zone has an item removed, it leaks information that a progression
    // item has been randomized to relic a location in that zone. To prevent
    // this leak, remove at most as many items from the zone as there are
    // vanilla relics in that zone.
    if (removeItems) {
      constants.zones.filter(function(zone) {
        return [
          constants.ZONE.ST0,
          constants.ZONE.NP3,
          constants.ZONE.BO3,
        ].indexOf(zone.id) === -1
      }).forEach(function(zone) {
        const zones = [zone.id]
        switch (zones[0]) {
        case constants.ZONE.NO3:
          zones.push(constants.ZONE.NP3)
          break
        case constants.ZONE.NO4:
          zones.push(constants.ZONE.BO3)
          break
        }
        if ('items' in zone && zone.id in relicCounts) {
          const rand = Math.floor(rng() * (1 + relicCounts[zone.id]))
          const removed = zoneRemovedItems[zone.id] || 0
          for (let i = 0; i < rand - removed; i++) {
            const tileItem = getRandomZoneItem(
              rng,
              zones,
              locations,
              placedItems,
            )
            const index = tileItem.tile.index
            // Remove the tile from the item's tile collection.
            const tileIndex = tileItem.item.tiles.indexOf(tileItem.tile)
            util.assert(tileIndex !== -1)
            tileItem.item.tiles.splice(tileIndex, 1)
            // Erase the item's entity.
            writeEntity(data, tileItem.tile, erased)
          }
        }
      })
    }
  }

  function randIdx(rng, array) {
    return Math.floor(rng() * array.length)
  }

  /** Helper function to see if a set is strictly a subset of another. */
  function isSubset(firstSet, secondSet) {
    return Array.from(firstSet).reduce(function(allPresent, element) {
      return allPresent && secondSet.has(element)
    }, true)
  }

  /**
   * Helper function to take a list of locks and replace all instances
   * of a single ability with new locks
   *
   * @param {Array} locks - A list of locks to update
   * @param {String} abilityToReplace - The ability to replace requirements of
   * @param {Array} locksToAdd - A list of lock sets to replace the original
   *   ability requirement with
   */
  function replaceLocks(locks, abilityToReplace, locksToAdd) {
    const newLocks = []
    locks.forEach(function(lock) {
      if (!lock.has(abilityToReplace)) {
        // Any locks that didn't require the relic can stay the same
        newLocks.push(lock)
      } else {
        // Otherwise, remove the old relic as a requirement and instead
        // add all the locks to that relic
        locksToAdd.forEach(function(transferLock) {
          let newLock = new Set(lock)
          newLock.delete(abilityToReplace)
          transferLock.forEach(function(requirement) {
            newLock.add(requirement)
          })
          newLocks.push(newLock)
        })
      }
    })
    return newLocks
  }

  function pickRelicLocations(rng, pool, locations, mapping) {
    if (!pool.relics.length) {
      return mapping
    }
    mapping = mapping || {}
    for (let i = 0; i < pool.relics.length; i++) {
      const remainingRelics = pool.relics.slice()
      const relic = remainingRelics.splice(i, 1)[0]
      // Find a location not locked by the current relic.
      const locationsAvailable = pool.locations.filter(function(location) {
        return location.locks.some(function(lock) {
          return !lock.has(relic.ability)
        })
      })
      if (locationsAvailable.length) {
        // Get random location.
        const shuffled = util.shuffled(rng, locationsAvailable)
        let location
        while (shuffled.length) {
          location = shuffled.pop()
          if (pool.blocked
              && pool.blocked[location.id]
              && pool.blocked[location.id].indexOf(relic.ability) !== -1) {
            location = undefined
          } else {
            break
          }
        }
        if (location) {
          // After placing the relic in this location, anything previously
          // locked by the relic is now locked by the requirements of the new
          // location.
          const newLocations = pool.locations.filter(function(newLocation) {
            return newLocation !== location
          }).map(function(newLocation) {
            newLocation = Object.assign({}, newLocation)
            const newLocks = replaceLocks(
              newLocation.locks,
              relic.ability,
              location.locks,
            ).filter(function(lock) {
              return !lock.has(relic.ability)
            })
            // Filter out locks that are supersets of other locks.
            newLocks.sort(function(a, b) { return a.size - b.size })
            for (let i = 0; i < newLocks.length - 1; i++) {
              const lock = newLocks[i]
              let j = i + 1
              while (j < newLocks.length) {
                // If lock i is a subset of lock j, remove j from the list.
                if (isSubset(lock, newLocks[j])) {
                  newLocks.splice(j, 1)
                } else {
                  j++
                }
              }
            }
            newLocation.locks = newLocks
            return newLocation
          })
          // Add selection to mapping.
          const newMapping = Object.assign({}, mapping)
          newMapping[relic.ability] = location
          // Pick from remaining pool.
          return pickRelicLocations(rng, {
            locations: newLocations,
            relics: remainingRelics,
            blocked: pool.blocked,
          }, locations, newMapping)
        }
      }
    }
    throw new errors.SoftlockError()
  }

  function patchAlchemyLabCutscene(data) {
    // Entering the room between jewel door and red door in alchemy lab
    // triggers a cutscene with Maria. The game will softlock if the player
    // enters alchemy lab through the red door in chapel before fighting
    // hippogryph. This can only happen if the player has access to olrox
    // quarters without soul of bat, which isn't possible in the vanilla
    // game without a speedrun trick. In a randomized relic run, however,
    // it is possible to have early movement options that trigger this
    // softlock for unwitting players. To be safe, disable the cutscene
    // from ever taking place.
    // The flag that gets set after the maria cutscene is @ 0x03be71.
    // The instruction that checks that flag is:
    // 0x54f0f44:    bne r2, r0, 0x1b8a58    144002da
    // Change the instruction so it always branches:
    // 0x54f0f44:    beq r0, r0, 0x1b8a58    100002da
    data.writeShort(0x054f0f44 + 2, 0x1000)
  }

  function patchClockRoomCutscene(data) {
    // Entering the clock room for the first time triggers a cutscene with
    // Maria. The cutscene takes place in a separately loaded room that
    // does not connect to the rest of the castle through the statue doors
    // or the vertical climb to gravity boots. If the player has early
    // movement options, they may attempt to leave the room through one of
    // these top exits but find themselves blocked, with the only option
    // being to reload the room through the left or right exit first. To
    // make it more convenient and less confusing, disable the cutscene
    // from ever taking place.
    // We moved the room into the void where she will spend all of eternity.
    data.writeChar(0x0aea9c, 0x40)
  }

  function patchRelicsMenu(data) {
    // New patch by MottZilla to add JP Familiars back to the relic menu.
    data.writeChar(0x10E568, 0x40)
    data.writeChar(0x116088, 0x1E)
    data.writeChar(0x1160A8, 0x00)
    data.writeChar(0xAEF4A, 0xC3)
    data.writeChar(0xAEF5A, 0xAC)
    
    /* Old Relics Menu Patch by Wild Mouse. Makes JP Familiars take the place of normal Faerie and Demon.
    // If relic locations are extended, the relic pool is padded out with the
    // familiars disabled in the NTSC-U release. To make them usable, they will
    // override their remaining counterparts in the menu if they have been
    // collected.
    // First, the menu code must be patched to reveal the state of the new
    // familiars.
    const romAddress = 0x158d18
    const ramAddress = 0x136c80
    const size = 4 * 0x20
    let offset
    // Patch menu code that draws the relic label.
    data.writeWord(0x10e5b0, 0x08000000 + ((ramAddress + 0 * size) >> 2))
    offset = romAddress + 0 * size
    offset = data.writeWord(offset, 0x24090014) // addiu t1, r0, 0x0014
    offset = data.writeWord(offset, 0x12290004) // beq s1, t1, pc + 0x14
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24090015) // addiu t1, r0, 0x0015
    offset = data.writeWord(offset, 0x16290015) // bne s1, t1, pc + 0x58
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x92830003) // lbu v1, 0x0003 (s4)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30690001) // andi t1, v1, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x1520000f) // bne t1, r0, pc + 0x40
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x28690003) // slti t1, v1, 0x0003
    offset = data.writeWord(offset, 0x15200003) // bne t1, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x0803d7e0) // j 0x800f5f80
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x92830000) // lbu v1, 0x0000 (s4)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30690001) // andi t1, v1, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x11200002) // beq t1, r0, pc + 0x0c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24030001) // addiu v1, r0, 0x0001
    offset = data.writeWord(offset, 0x0803d7e0) // j 0x800f5f80
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x92830000) // lbu v1, 0x0000 (s4)
    offset = data.writeWord(offset, 0x0803d7e0) // j 0x800f5f80
    offset = data.writeWord(offset, 0x00000000) // nop
    // Patch the menu code that toggles the on/off state of the familiar.
    data.writeWord(0x10e7d8, 0x08000000 + ((ramAddress + 1 * size) >> 2))
    offset = romAddress + 1 * size
    offset = data.writeWord(offset, 0x24090014) // addiu t1, r0, 0x0014
    offset = data.writeWord(offset, 0x12290004) // beq s1, t1, pc + 0x14
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24090015) // addiu t1, r0, 0x0015
    offset = data.writeWord(offset, 0x16290015) // bne s1, t1, pc + 0x58
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x92820003) // lbu v0, 0x0003 (s4)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30490001) // andi t1, v0, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x1520000f) // bne t1, r0, pc + 0x40
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x2c490003) // slti t1, v0, 0x0003
    offset = data.writeWord(offset, 0x15200003) // bne t1, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x0803d81e) // j 0x800f6078
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x92820000) // lbu v0, 0x0000 (s4)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30490001) // andi t1, v0, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x11200002) // beq t1, r0, pc + 0x0c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24020001) // addiu v0, r0, 0x0001
    offset = data.writeWord(offset, 0x0803d81e) // j 0x800f6078
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x92820000) // lbu v0, 0x0000 (s4)
    offset = data.writeWord(offset, 0x0803d81e) // j 0x800f6078
    offset = data.writeWord(offset, 0x00000000) // nop
    // Patch the menu code that draws the relic icon.
    data.writeWord(0x11625c, 0x08000000 + ((ramAddress + 2 * size) >> 2))
    offset = romAddress + 2 * size
    offset = data.writeWord(offset, 0x24090014) // addiu t1, r0, 0x0014
    offset = data.writeWord(offset, 0x12290004) // beq s1, t1, pc + 0x14
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24090015) // addiu t1, r0, 0x0015
    offset = data.writeWord(offset, 0x16290015) // bne s1, t1, pc + 0x58
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227967) // lbu v0, 0x7967 (at)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30490001) // andi t1, v0, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x1520000f) // bne t1, r0, pc + 0x40
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x2c490003) // slti t1, v0, 0x0003
    offset = data.writeWord(offset, 0x15200003) // bne t1, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x0803f2e3) // j 0x800fcb8c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227964) // lbu v0, 0x7964 (at)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30490001) // andi t1, v0, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x11200002) // beq t1, r0, pc + 0x0c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24020001) // addiu v0, r0, 0x0001
    offset = data.writeWord(offset, 0x0803f2e3) // j 0x800fcb8c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227964) // lbu v0, 0x7964 (at)
    offset = data.writeWord(offset, 0x0803f2e3) // j 0x800fcb8c
    offset = data.writeWord(offset, 0x00000000) // nop
    // Patch the code that loads relic description when loading the menu.
    data.writeWord(0x115fe8, 0x08000000 + ((ramAddress + 3 * size) >> 2))
    offset = romAddress + 3 * size
    offset = data.writeWord(offset, 0x24090014) // addiu t1, r0, 0x0014
    offset = data.writeWord(offset, 0x12090004) // beq s0, t1, pc + 0x14
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24090015) // addiu t1, r0, 0x0015
    offset = data.writeWord(offset, 0x16090016) // bne s0, t1, pc + 0x58
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227967) // lbu v0, 0x7967 (at)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30490001) // andi t1, v0, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x15200010) // bne t1, r0, pc + 0x44
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x26100003) // addiu s0, s0, 0x0003
    offset = data.writeWord(offset, 0x2c490003) // slti t1, v0, 0x0003
    offset = data.writeWord(offset, 0x15200003) // bne t1, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x0803f246) // j 0x800fc918
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227964) // lbu v0, 0x7964 (at)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30490001) // andi t1, v0, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x11200002) // beq t1, r0, pc + 0x0c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24020001) // addiu v0, r0, 0x0001
    offset = data.writeWord(offset, 0x0803f246) // j 0x800fc918
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227964) // lbu v0, 0x7964 (at)
    offset = data.writeWord(offset, 0x0803f246) // j 0x800fc918
    offset = data.writeWord(offset, 0x00000000) // nop
    // Patch the code that loads relic description when changing selection.
    data.writeWord(0x116220, 0x08000000 + ((ramAddress + 4 * size) >> 2))
    offset = romAddress + 4 * size
    offset = data.writeWord(offset, 0x24090014) // addiu t1, r0, 0x0014
    offset = data.writeWord(offset, 0x12090004) // beq s1, t1, pc + 0x14
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24090015) // addiu t1, r0, 0x0015
    offset = data.writeWord(offset, 0x16090016) // bne s1, t1, pc + 0x58
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227967) // lbu v0, 0x7967 (at)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30490001) // andi t1, v0, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x15200010) // bne t1, r0, pc + 0x44
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x26100003) // addiu s0, s0, 0x0003
    offset = data.writeWord(offset, 0x2c490003) // slti t1, v0, 0x0003
    offset = data.writeWord(offset, 0x15200003) // bne t1, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x0803f2d4) // j 0x800fcb48
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227964) // lbu v0, 0x7964 (at)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30490001) // andi t1, v0, 0x0001
    offset = data.writeWord(offset, 0x29290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x11200002) // beq t1, r0, pc + 0x0c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24020001) // addiu v0, r0, 0x0001
    offset = data.writeWord(offset, 0x0803f2d4) // j 0x800fcb48
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x90227964) // lbu v0, 0x7964 (at)
    offset = data.writeWord(offset, 0x0803f2d4) // j 0x800fcb48
    offset = data.writeWord(offset, 0x00000000) // nop
    // Patch the code that enables/disables a familiar.
    data.writeWord(0x1160cc, 0x08000000 + ((ramAddress + 5 * size) >> 2))
    offset = romAddress + 5 * size
    offset = data.writeWord(offset, 0x90227964) // lbu v0, 0x7964 (at)
    offset = data.writeWord(offset, 0x24090014) // addiu t1, r0, 0x0014
    offset = data.writeWord(offset, 0x12090004) // beq s0, t1, pc + 0x14
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x24090015) // addiu t1, r0, 0x0015
    offset = data.writeWord(offset, 0x1609000c) // bne s0, t1, pc + 0x34
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x28490003) // slti t1, v0, 0x0003
    offset = data.writeWord(offset, 0x11200009) // beq t1, r0, pc + 0x28
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x902a7967) // lbu t2, 0x7967 (at)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x31490001) // andi t1, t2, 0x0001
    offset = data.writeWord(offset, 0x2d290001) // slti t1, t1, 0x0001
    offset = data.writeWord(offset, 0x15200003) // bne t1, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x25420000) // addiu v0, t2, 0x0000
    offset = data.writeWord(offset, 0x26100003) // addiu s0, s0, 0x0003
    offset = data.writeWord(offset, 0x0803f27f) // j 0x800fc9fc
    offset = data.writeWord(offset, 0x00000000) // nop
    */
  }

  function patchPixieSong(data) {
    const romAddress = 0x158fe8
    const ramAddress = 0x136f50
    let offset
    data.writeWord(0x0fe010, 0x08000000 + (ramAddress >> 2))
    offset = romAddress
    offset = data.writeWord(offset, 0x27bdffe8) // addiu sp, sp, 0xffe8
    offset = data.writeWord(offset, 0x3c1f8013) // lui ra, 0x8013
    offset = data.writeWord(offset, 0x37ff6f68) // ori ra, ra, 0x6f68
    offset = data.writeWord(offset, 0xafbf0010) // sw ra, 0x0010 (sp)
    offset = data.writeWord(offset, 0x00400008) // jr v0
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x8fbf0010) // lw ra, 0x0010 (sp)
    offset = data.writeWord(offset, 0x27bd0018) // addiu sp, sp, 0x0018
    offset = data.writeWord(offset, 0x3c088009) // lui t0, 0x8009
    offset = data.writeWord(offset, 0x8109797b) // lb t1, 0x797b (t0)
    offset = data.writeWord(offset, 0x340a0003) // ori t2, r0, 0x0003
    offset = data.writeWord(offset, 0x152a001c) // bne t1, t2, pc + 0x74
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x3c088007) // lui t0, 0x8007
    offset = data.writeWord(offset, 0x9109342e) // lbu t1, 0x342e (t0)
    offset = data.writeWord(offset, 0x340a00df) // ori t2, r0, 0x00df
    offset = data.writeWord(offset, 0x152a0017) // bne t1, t2, pc + 0x60
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x3c088007) // lui t0, 0x8007
    offset = data.writeWord(offset, 0x81093714) // lb t1, 0x3714 (t0)
    offset = data.writeWord(offset, 0x340a0034) // ori t2, r0, 0x0034
    offset = data.writeWord(offset, 0x152a0012) // bne t1, t2, pc + 0x4c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x3c088014) // lui t0, 0x8014
    offset = data.writeWord(offset, 0x85098458) // lh t1, 0x8458 (t0)
    offset = data.writeWord(offset, 0x340a003f) // ori t2, r0, 0x003f
    offset = data.writeWord(offset, 0x112a000d) // beq t1, t2, pc + 0x38
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0xa50a9064) // sh t2, 0x9064 (t0)
    offset = data.writeWord(offset, 0x340a0001) // ori t2, r0, 0x0001
    offset = data.writeWord(offset, 0xa50a96f4) // sh t2, 0x96f4 (t0)
    offset = data.writeWord(offset, 0x340a0004) // ori t2, r0, 0x0004
    offset = data.writeWord(offset, 0xa50a9868) // sh t2, 0x9868 (t0)
    offset = data.writeWord(offset, 0x3c08800e) // lui t0, 0x800e
    offset = data.writeWord(offset, 0x3c0a8013) // lui t2, 0x8013
    offset = data.writeWord(offset, 0x354a2f9c) // ori t2, t2, 0x2f9c
    offset = data.writeWord(offset, 0xad0a2034) // sw t2, 0x2034 (t0)
    offset = data.writeWord(offset, 0x3c0a8013) // lui t2, 0x8013
    offset = data.writeWord(offset, 0x354a5404) // ori t2, t2, 0x5404
    offset = data.writeWord(offset, 0xad0a2364) // sw t2, 0x2364 (t0)    
    offset = data.writeWord(offset, 0x03e00008) // jr ra
    offset = data.writeWord(offset, 0x00000000) // nop
  }

  function graph(mapping) {
    const graph = Object.getOwnPropertyNames(mapping).map(function(key) {
      return {
        item: key,
        locks: (mapping[key].locks || []).filter(function(lock) {
          return lock.size > 0
        }).map(function(lock) {
          return Array.from(lock)
        }),
      }
    })
    // Build lock graph.
    graph.forEach(function(node) {
      node.locks = node.locks.map(function(lock) {
        return lock.map(function(item) {
          return graph.filter(function(node) {
            return node.item === item
          }).pop()
        })
      })
      // Clean locks.
      if (!node.locks.length) {
        delete node.locks
      }
    })
    return graph
  }

  function solve(graph, requirements) {
    return requirements.map(function(lock) {
      return Array.from(lock).reduce(function(abilities, ability) {
        const node = graph.filter(function(node) {
          return node.item === ability
        }).pop()
        if (node) {
          abilities.push(node)
        }
        return abilities
      }, [])
    })
  }

  function lockDepth(visited) {
    const cache = {}
    return function(min, lock) {
      if (lock.some(function(node) { return visited.has(node) })) {
        return min
      }
      const curr = lock.reduce(function(max, node) {
        if (node.item in cache) {
          return Math.max(cache[node.item], max)
        }
        let curr = 1
        if (node.locks) {
          visited.add(node)
          curr += node.locks.reduce(lockDepth(visited), 0)
          visited.delete(node)
        }
        cache[node.item] = curr
        return Math.max(curr, max)
      }, 0)
      if (min === 0) {
        return curr
      }
      return Math.min(curr, min)
    }
  }

  function complexity(solutions) {
    return solutions.reduce(lockDepth(new WeakSet()), 0)
  }

  function nonCircular(visited, path) {
    const cache = {}
    let count = 0
    return function(lock, index, length) {
      if (lock.some(function(node) { return visited.has(node) })) {
        return false
      }
      let result = true
      const nodes = {}
      for (let i = 0; i < lock.length; i++) {
        const node = lock[i]
        if (node.locks) {
          if (node.item in cache) {
            nodes[i] = {
              index: 0,
              locks: cache[node.item].locks,
              nodes: cache[node.item].nodes,
            }
          } else {
            visited.add(node)
            nodes[i] = {index: 0}
            nodes[i].locks = node.locks.filter(nonCircular(
              visited,
              nodes[i],
            ))
            visited.delete(node)
            cache[node.item] = {
              locks: nodes[i].locks,
              nodes: nodes[i].nodes,
            }
          }
          if (!nodes[i].locks.length) {
            result = false
            break
          }
        }
      }
      if (result) {
        if (path.index === count) {
          path.nodes = nodes
        }
        count++
      }
      return result
    }
  }

  function buildPath(visited, path, chain, advance) {
    const lock = path.locks[path.index]
    for (let i = 0; i < lock.length; i++) {
      const node = lock[i]
      if (node.locks) {
        path.nodes = path.nodes || {}
        path.nodes[i] = path.nodes[i] || {index: 0}
        let locks = path.nodes[i].locks
        if (!locks) {
          visited.add(node)
          locks = node.locks.filter(nonCircular(
            visited,
            path.nodes[i],
          ))
          visited.delete(node)
          path.nodes[i].locks = locks
        }
        if (locks.length) {
          visited.add(node)
          advance = buildPath(
            visited,
            path.nodes[i],
            chain,
            advance
          )
          visited.delete(node)
        }
      }
    }
    for (let node of lock) {
      chain.add(node.item)
    }
    if (advance) {
      if (path.locks.length > 1) {
        path.nodes = {}
        path.index = (path.index + 1) % path.locks.length
        if (path.index === 0) {
          return true
        }
      } else {
        return true
      }
    }
    return false
  }

  function canEscape(graph, ability, requirements) {
    const set = new Set()
    set.add(ability)
    const solutions = solve(graph, [set])
    if (!solutions.length || !solutions[0].length) {
      return false
    }
    const root = solutions[0][0]
    const path = {index: 0}
    if (root.locks) {
      path.locks = root.locks.filter(nonCircular(new Set([root]), path))
      if (!path.locks.length) {
        return false
      }
    }
    requirements = requirements.map(function(requirement) {
      return Array.from(requirement)
    })
    const chain = new Set()
    if (root.item.length === 1) {
      chain.add(root.item)
    }
    const visited = new WeakSet([root])
    let count = 0
    let advance
    while (!advance && requirements.length) {
      if (++count > (1 << 11)) {
        return false
      }
      const newChain = new Set(chain)
      if (path.locks) {
        advance = buildPath(visited, path, newChain, true)
      }
      let i = 0
      while (i < requirements.length) {
        if (!requirements[i].every(function(item) {
          return newChain.has(item)
        })) {
          requirements.splice(i, 1)
        } else {
          i++
        }
      }
    }
    return requirements.length > 0
  }

  function isValidSolution(goal) {
    return goal.every(function (node) {
      return util.hasNonCircularPath(node, new WeakSet([node]))
    })
  }

  function randomize(
    rng,
    placed,
    blocked,
    relics,
    locations,
    goal,
    target,
  ) {
    // Get new locations pool.
    const pool = {
      relics: util.shuffled(rng, relics),
      locations: locations.slice(),
      blocked: blocked,
    }
    while (pool.locations.length > relics.length) {
      pool.locations.splice(randIdx(rng, pool.locations), 1)
    }
    // Place relics.
    let mapping
    if (typeof(placed) === 'object') {
      const placedLocations = Object.getOwnPropertyNames(placed)
      const placedRelics = []
      const picked = {}
      placedLocations.forEach(function(location) {
        let relic
        const rand = util.shuffled(rng, placed[location])
        let isEmpty
        do {
          relic = rand.pop()
          if (!relic) {
            isEmpty = true
            break
          }
        } while (placedRelics.indexOf(relic) !== -1)
        if (!isEmpty && placedRelics.indexOf(relic) !== -1) {
          throw new errors.SoftlockError()
        }
        picked[location] = relic
        placedRelics.push(relic)
      })
      mapping = {}
      placedLocations.forEach(function(location) {
        if (picked[location]) {
          mapping[picked[location]] = locations.filter(function(loc) {
            return loc.id === location
          })[0]
        }
      })
      pool.relics = pool.relics.filter(function(relic) {
        return placedRelics.indexOf(relic.ability) === -1
      })
      pool.locations = pool.locations.filter(function(location) {
        return placedLocations.indexOf(location.id) === -1
      })
    }
    // Pick random relic locations.
    let result = mapping
    if (pool.locations.length) {
      result = pickRelicLocations(rng, pool, locations, mapping)
    }
    // Restore original location locks in mapping.
    mapping = {}
    Object.getOwnPropertyNames(result).forEach(function(ability) {
      mapping[ability] = locations.filter(function(location) {
        return location.id === result[ability].id
      }).pop()
    })
    // Make an inverse mapping of location => ability.
    const inv = Object.getOwnPropertyNames(mapping).reduce(
      function(inv, ability) {
        inv[result[ability].id] = ability
        return inv
      },
      {}
    )
    // Add placeholders for locations that are not in logic.
    locations.forEach(function(location) {
      if (!(location.id in inv)) {
        mapping['(' + location.id + ')'] = location
      }
    })
    // Build node graph.
    const graphed = graph(mapping)
    let solutions
    let depth
    if (target !== undefined) {
      // Solve for completion goals.
      solutions = solve(graphed, goal).filter(isValidSolution)
      if (!solutions.length) {
        throw new errors.SoftlockError()
      }
      depth = complexity(solutions)
      // If the complexity target is not met, fail.
      if ((!Number.isNaN(target.min) && depth < target.min)
          || ('max' in target && depth > target.max)) {
        throw new errors.ComplexityError()
      }
    }
    // Collect locations with escape requirements.
    const escape = []
    Object.getOwnPropertyNames(mapping).forEach(function(ability) {
      const location = mapping[ability]
      if (location.escapes.length) {
        escape.push(ability)
      }
    })
    // Ensure escape requirements are satisfied.
    escape.forEach(function(ability) {
      const location = mapping[ability]
      if (!canEscape(graphed, ability, location.escapes.slice())) {
        throw new errors.SoftlockError()
      }
    })
    return {
      mapping: mapping,
      solutions: solutions,
      depth: depth,
    }
  }

  function getLocations() {
    const locations = relics.filter(function(location) {
      return !location.extension
        && location.ability !== constants.RELIC.THRUST_SWORD
    }).concat(extension)
    return locations.map(function(location) {
      let id
      if ('ability' in location) {
        id = location.ability
      } else if ('name' in location) {
        id = location.name
      }
      if ('itemId' in location) {
        const itemId = location.itemId + constants.tileIdOffset
        const item = util.itemFromTileId(items(), itemId)
        location.item = item
        if ('tileIndex' in location) {
          location.tile = item.tiles[location.tileIndex]
        }
      }
      return Object.assign({id: id}, location)
    })
  }

  function locksFromLocations(locations) {
    const map = {}
    Object.getOwnPropertyNames(locations).filter(function(location) {
      return [
        'extension',
        'leakPrevention',
        'thrustSwordAbility',
        'placed',
        'replaced',
        'blocked',
        'goalItems',
      ].indexOf(location) === -1
    }).forEach(function(location) {
      map[location] = locations[location].filter(function(lock) {
        return lock[0] !== '+'
      })
    })
    return map
  }

  function escapesFromLocations(locations) {
    const map = {}
    Object.getOwnPropertyNames(locations).filter(function(location) {
      return [
        'extension',
        'leakPrevention',
        'thrustSwordAbility',
        'placed',
        'replaced',
        'blocked',
        'goalItems',
      ].indexOf(location) === -1
    }).forEach(function(location) {
      map[location] = locations[location].filter(function(lock) {
        return lock[0] === '+'
      }).map(function(lock) {
        return lock.slice(1)
      })
    })
    return map
  }

  function randomizeRelics(rng, options, newNames) {
    if (!options.relicLocations) {
      return {}
    }
    // Initialize location locks.
    let relicLocations
    if (typeof(options.relicLocations) === 'object') {
      relicLocations = options.relicLocations
    } else {
      relicLocations = util.presetFromName('safe').options().relicLocations
    }
    // If only an extension is specified, inherit safe logic.
    if (relicLocations.extension) {
      let hasLocks = false
      let extension = relicLocations.extension
      Object.getOwnPropertyNames(relicLocations).forEach(function(name) {
        if (name !== 'extension' && !(/^[0-9]+(-[0-9]+)?$/).test(name)) {
          hasLocks = true
        }
      })
      if (!hasLocks) {
        relicLocations = Object.assign(
          {},
          util.presetFromName('safe').options().relicLocations,
          relicLocations,
        )
      }
    }
    // Get the goal and complexity target.
    const locksMap = locksFromLocations(relicLocations)
    const escapesMap = escapesFromLocations(relicLocations)
    let target
    let goal
    Object.getOwnPropertyNames(locksMap).forEach(function(name) {
      if ((/^[0-9]+(-[0-9]+)?$/).test(name)) {
        const parts = name.split('-')
        target = {
          min: parseInt(parts[0]),
        }
        if (parts.length === 2) {
          target.max = parseInt(parts[1])
        }
        goal = locksMap[name].map(function(lock) {
          return new Set(lock)
        })
        delete locksMap[name]
      }
    })
    // Create relics and locations collections.
    let locations = getLocations()
    const extensions = []
    switch (options.relicLocations.extension) {
    case constants.EXTENSION.EXTENDED: // This is a smaller distribution than Equipment but includes all Scenic checks + GuardedPlus + some Equipment - eldri7ch
      extensions.push(constants.EXTENSION.EXTENDED)
      extensions.push(constants.EXTENSION.GUARDEDPLUS)
      extensions.push(constants.EXTENSION.GUARDED) 
      break
    case constants.EXTENSION.SCENIC:
      extensions.push(constants.EXTENSION.SCENIC)
    case constants.EXTENSION.EQUIPMENT:
      extensions.push(constants.EXTENSION.EQUIPMENT)
    case constants.EXTENSION.GUARDEDPLUS:
      extensions.push(constants.EXTENSION.GUARDEDPLUS)
    case constants.EXTENSION.GUARDED:
      extensions.push(constants.EXTENSION.GUARDED)
    }
    locations = locations.filter(function(location) {
      return !location.extension
        || extensions.indexOf(location.extension) !== -1
    })
    let enabledRelics = relics.filter(function(relic) {
      if (!options.relicLocations.thrustSwordAbility
          && relic.ability === constants.RELIC.THRUST_SWORD) {
        return false
      }
      return !relic.extension
        || extensions.indexOf(relic.extension) !== -1
    })
    // Get random thrust sword.
    let thrustSword
    enabledRelics = enabledRelics.map(function(relic) {
      if (relic.ability === constants.RELIC.THRUST_SWORD) {
        const thrustSwords = items().filter(function(item) {
          return item.thrustSword
        })
        thrustSword = thrustSwords[randIdx(rng, thrustSwords)] // this selects a thrust sword at random to be part of the relic pool - eldri7ch
        const name = (newNames.filter(function(item) {
          return item.id === thrustSword.id
        }).pop() || thrustSword).name
        return Object.assign({}, relic, { // this is what exports the thrust sword ID to be placed in the relic pool - eldri7ch
          itemId: thrustSword.id,
          name: name,
        })
      }
      return relic
    })
    // Replace relics with items.
    // IF YOU ARE GETTING A WEIRD LETTER CODE AND IT RETURNS THIS SECTION, REPLACE YOUR ITEM NAMES WITH THE NAMES FROM ITEMS.JS - eldri7ch
    if (relicLocations.replaced) {
      Object.getOwnPropertyNames(relicLocations.replaced).forEach(
        function(ability, index) {
          const item = util.itemFromName(relicLocations.replaced[ability])
          if (!item) {
            throw new Error([ability, index].join(' '))
          }
          enabledRelics = enabledRelics.map(function(relic) {
            if (relic.ability === ability) {
              relic = Object.assign({}, relic, {
                name: item.name,
                itemId: item.id,
              })
              delete relic.relicId
              if (relic.item) {
                relic.item = Object.assign({}, item, {
                  name: item.name,
                  itemId: item.id,
                  type: item.type,
                })
              }
            }
            return relic
          })
        }
      )
    }
    // Create fake relics for goal items so they are placed at relic
    // locations using the same placement algorithm.
    const combinedReplaced = Object.assign(
      {},
      relicLocations.replaced || {},
    )
    const goalItems = relicLocations.goalItems || []
    goalItems.forEach(function(gi) {
      const item = util.itemFromName(gi.item)
      if (!item) {
        throw new Error('Unknown goal item: ' + gi.item)
      }
      const ability = 'gi_' + (gi.alias || gi.item)
      enabledRelics.push({
        ability: ability,
        name: item.name,
        itemId: item.id,
      })
      combinedReplaced[ability] = gi.item
    })
    // Verify there are enough locations for all relics and goal items.
    if (enabledRelics.length > locations.length) {
      throw new Error(
        'Not enough relic locations for goal items. Need '
        + enabledRelics.length + ' locations but only '
        + locations.length + ' available.'
      )
    }
    // Initialize location locks.
    locations.forEach(function(location) {
      const id = location.id
      if (locksMap[id]) {
        location.locks = locksMap[id].map(function(lock) {
          return new Set(lock)
        })
      }
      if (escapesMap[id]) {
        location.escapes = escapesMap[id].map(function(lock) {
          return new Set(lock)
        })
      }
      if (!location.locks || !location.locks.length) {
        location.locks = [new Set()]
      }
      location.escapes = location.escapes || []
    })
    // Attempt to place all relics.
    const result = randomize(
      rng,
      relicLocations.placed,
      relicLocations.blocked,
      enabledRelics,
      locations,
      goal,
      target,
    )
    // Write spoilers.
    const info = util.newInfo()
    if (!options.tournamentMode) {
      const spoilers = []
      enabledRelics.forEach(function(relic) {
        let relicName = relic.name
        if (relic.itemId) {
          const item = newNames.filter(function(item) {
            return item.id === relic.itemId
          }).pop()
          if (item) {
            relicName = item.name
          }
        }
        const location = result.mapping[relic.ability]
        if (location) {
          spoilers.push(relicName + ' at ' + location.name)
        }
      })
      info[3]['Relic locations'] = spoilers
      if (result.solutions) {
        info[4]['Solutions'] = util.renderSolutions(
          result.solutions,
          enabledRelics,
          newNames,
          thrustSword,
        )
        info[4]['Complexity'] = result.depth
      }
    }
    let trackbyte

    trackbyte = target.min

    switch (relicLocations.extension){
      case 'guarded':
        trackbyte = trackbyte + 0x10
        break
      case 'guardedplus':
        trackbyte = trackbyte + 0x20
        break
      case 'extended':
        trackbyte = trackbyte + 0x30
        break
      case 'equipment':
        trackbyte = trackbyte + 0x40
        break
      case 'scenic':
        trackbyte = trackbyte + 0x50
        break
      default:
    }

    // console.log("Tracking Byte: " + trackbyte)
    return {
      mapping: result.mapping,
      solutions: result.solutions,
      locations: locations,
      relics: enabledRelics,
      replaced: combinedReplaced,
      thrustSword: thrustSword,
      info: info,
      trackbyte: trackbyte,
    }
  }

  function writeRelics(rng, options, result, newNames) {
    const data = new util.checked()
    if (options.relicLocations) {
      let placedItems = options.itemLocations
      if (typeof(placedItems) !== 'object') {
        placedItems = {}
      }
      let replaced
      let leakPrevention = true
      if (typeof(options.relicLocations) === 'object') {
        // Use combined replaced map from result (includes goal items)
        // falling back to the original options replaced map.
        replaced = result.replaced || options.relicLocations.replaced
        leakPrevention = !('leakPrevention' in options.relicLocations)
          || options.relicLocations.leakPrevention
      }
      // Write data to ROM.
      writeMapping(
        data,
        rng,
        result.mapping,
        placedItems,
        replaced,
        result.thrustSword,
        newNames,
        leakPrevention,
      )
      // Patch out cutscenes.
      patchAlchemyLabCutscene(data)
      patchClockRoomCutscene(data)
      // Apply extension specific patches.
      switch (options.relicLocations.extension) {
      case constants.EXTENSION.EXTENDED:
      case constants.EXTENSION.SCENIC:
      case constants.EXTENSION.EQUIPMENT:
      case constants.EXTENSION.GUARDEDPLUS:
      case constants.EXTENSION.GUARDED:
        // Patch relics menu.
        patchRelicsMenu(data)
        patchPixieSong(data)
      }
    }
    return {
      data: data,
      items: items(),
    }
  }

  const exports = {
    randomizeRelics: randomizeRelics,
    writeRelics: writeRelics,
  }
  if (self) {
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      randomizeRelics: exports,
    })
  } else {
    module.exports = exports
  }
})(typeof(self) !== 'undefined' ? self : null)
