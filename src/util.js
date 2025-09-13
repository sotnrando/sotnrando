(function(self) {

  let constants
  let enemies
  let errors
  let extension
  let items
  let equipment
  let spells
  let subWeapons
  let relics
  let fs
  let crypto
  let goals

  if (self) {
    constants = self.sotnRando.constants
    enemies = self.sotnRando.enemies
    errors = self.sotnRando.errors
    extension = self.sotnRando.extension
    items = self.sotnRando.items
    equipment = self.sotnRando.equipment
    spells = self.sotnRando.spells
    subWeapons = self.sotnRando.subWeapons
    relics = self.sotnRando.relics
    crypto = self.crypto
    goals = self.goals
  } else {
    constants = require('./constants')
    enemies = require('./enemies')
    errors = require('./errors')
    extension = require('./extension')
    items = require('./items')
    equipment = require('./equipment')
    spells = require('./spells')
    subWeapons = require('./subweapons')
    relics = require('./relics')
    crypto = require('crypto').webcrypto
    fs = require('fs')
  }

  function sha256(input) {
    return crypto.subtle.digest('SHA-256', input).then(function(buf) {
      return bufToHex(new Uint8Array(buf))
    })
  }

  function assert(value, message) {
    if (!value) {
      message = message || 'Assertion failed: ' + value
      throw new errors.AssertionError(message)
    }
  }

  assert.equal = function equal(actual, expected, message) {
    if (actual !== expected) {
      message = message || 'Assertion failed: ' + actual + ' === ' + expected
      throw new errors.AssertionError(message)
    }
  }

  assert.notEqual = function equal(actual, expected, message) {
    if (actual === expected) {
      message = message || 'Assertion failed: ' + actual + ' !== ' + expected
      throw new errors.AssertionError(message)
    }
  }

  assert.oneOf = function equal(actual, expected, message) {
    if (expected.indexOf(actual) === -1) {
      message = message || 'Assertion failed: ' + actual + ' one of '
        + expected.join(', ')
      throw new errors.AssertionError(message)
    }
  }

  function roomCount(zone) {
    let layout = zone.readUInt32LE(0x10) - 0x80180000
    let rooms = 0
    while (zone[layout] !== 0x40) {
      rooms++
      layout += 8
    }
    return rooms
  }

  function shopItemType(item) {
    switch (item.type) {
    case constants.TYPE.HELMET:
      return 0x01
    case constants.TYPE.ARMOR:
      return 0x02
    case constants.TYPE.CLOAK:
      return 0x03
    case constants.TYPE.ACCESSORY:
      return 0x04
    }
    return 0x00
  }

  function shopTileFilter(tile) {
    return tile.shop
  }

  function dropTileFilter(tile) {
    return 'enemy' in tile || tile.librarian
  }

  function rewardTileFilter(tile) {
    return tile.reward
  }

  function candleTileFilter(tile) {
    return 'candle' in tile
  }

  function tankTileFilter(tile) {
    return tile.tank
  }

  function mapTileFilter(tile) {
    return !shopTileFilter(tile)
      && !tankTileFilter(tile)
      && !rewardTileFilter(tile)
      && !candleTileFilter(tile)
      && !dropTileFilter(tile)
  }

  function nonProgressionFilter(item) {
    return !item.progression
  }

  function tilesFilter(item) {
    return Array.isArray(item.tiles)
  }

  function itemTileFilter(tileFilter) {
    return function(item) {
      return item.tiles && item.tiles.some(tileFilter)
    }
  }

  function tileIdOffsetFilter(item) {
    return [
      constants.TYPE.WEAPON1,
      constants.TYPE.WEAPON2,
      constants.TYPE.SHIELD,
      constants.TYPE.HELMET,
      constants.TYPE.ARMOR,
      constants.TYPE.CLOAK,
      constants.TYPE.ACCESSORY,
      constants.TYPE.USABLE,
    ].indexOf(item.type) !== -1
  }

  function itemFromName(name, from) {
    from = from || items
    return from.filter(function(item) {
      return item.name === name
    })[0]
  }

  function convertToHexString(input) {
    const hexMapping = {
        '00': ' ', '01': '!', '02': '"', '03': '#',
        '04': '$', '05': '%', '06': '&', '07': "'",
        '08': '(', '09': ')', '0b': '+', '0c': ',',
        '0d': '-', '0e': '.', '0f': '/', '10': '0',
        '11': '1', '12': '2', '13': '3', '14': '4',
        '15': '5', '16': '6', '17': '7', '18': '8',
        '19': '9', '1a': ':', '1d': '=', '1f': '?',
        '21': 'A', '41': 'a', '22': 'B', '42': 'b',
        '23': 'C', '43': 'c', '24': 'D', '44': 'd',
        '25': 'E', '45': 'e', '26': 'F', '46': 'f',
        '27': 'G', '47': 'g', '28': 'H', '48': 'h',
        '29': 'I', '49': 'i', '2a': 'J', '4a': 'j',
        '2b': 'K', '4b': 'k', '2c': 'L', '4c': 'l',
        '2d': 'M', '4d': 'm', '2e': 'N', '4e': 'n',
        '2f': 'O', '4f': 'o', '30': 'P', '50': 'p',
        '31': 'Q', '51': 'q', '32': 'R', '52': 'r',
        '33': 'S', '53': 's', '34': 'T', '54': 't',
        '35': 'U', '55': 'u', '36': 'V', '56': 'v',
        '37': 'W', '57': 'w', '38': 'X', '58': 'x',
        '39': 'Y', '59': 'y', '3a': 'Z', '5a': 'z',
        '3b': '[', '3d': ']', '3f': '_', '5e': '~',
        '62': '┌', '63': '┘', '65': '•', 'e0': '←',
        'e1': '↖', 'e2': '↑', 'e3': '↗', 'e4': '→',
        'e5': '↘', 'e6': '↓', 'e7': '↙', 'f0': 'é', // é is the sword icon
        'f1': 'â', 'f2': 'ä', // â is the shield icon; ä is the armor icon
        'f6': 'à', 'f7': 'å', // à is the ring icon; å is the potion icon
        'ff': 'ÿ' // This is the label end character
    };

    let result = '';
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const hexKey = Object.keys(hexMapping).find(key => hexMapping[key] === char);
        if (hexKey) {
            result += hexKey;
        } else {
            result += char; // Keeps characters that aren't in the mapping unchanged
        }
    }

    return '0x' + result;
  }

  function isEven(n) {
    n = Number(n);
    return n === 0 || !!(n && !(n%2));
  }

  function findRequiredNumbers(total, numbers) {
    // This returns the numbers that compose a value. For example, if the total is 12 and the possible numbers are 1, 2, 4 and 8, it will return [8, 4]
    // Sort the numbers in descending order
    numbers.sort((a, b) => b - a);

    // Initialize an array to store the result
    let result = [];

    // Iterate through the sorted numbers
    for (let number of numbers) {
        if (total >= number) {
            // If the current number can be subtracted from the total, add it to the result
            result.push(number);
            total -= number;
        }
    }

    // Return the list of required numbers
    return result;
  }

  function itemFromTileId(items, id) {
    return items.filter(function(item) {
      if (id > constants.tileIdOffset) {
        return item.id === (id - constants.tileIdOffset)
          && tileIdOffsetFilter(item)
      }
      return item.id === id
    })[0]
  }

  function itemSlots(item) {
    switch (item.type) {
    case constants.TYPE.WEAPON1:
    case constants.TYPE.WEAPON2:
    case constants.TYPE.SHIELD:
    case constants.TYPE.USABLE:
      return [
        constants.slots[constants.SLOT.LEFT_HAND],
        constants.slots[constants.SLOT.RIGHT_HAND],
      ]
    case constants.TYPE.HELMET:
      return [ constants.slots[constants.SLOT.HEAD] ]
    case constants.TYPE.ARMOR:
      return [ constants.slots[constants.SLOT.BODY] ]
    case constants.TYPE.CLOAK:
      return [ constants.slots[constants.SLOT.CLOAK] ]
    case constants.TYPE.ACCESSORY:
      return [
        constants.slots[constants.SLOT.OTHER],
        constants.slots[constants.SLOT.OTHER2],
      ]
      break
    }
  }

  function tileValue(item, tile) {
    if (!tile) {
      tile = {}
    }
    if (tile.noOffset) {
      return item.id
    }
    let id = ((tile.candle || 0x00) << 8) | item.id
    if (tile.shop) {
      // Apply offset for some item types in the shop menu.
      switch (item.type) {
      case constants.TYPE.HELMET:
      case constants.TYPE.ARMOR:
      case constants.TYPE.CLOAK:
      case constants.TYPE.ACCESSORY:
        id += constants.equipIdOffset
        break
      }
    } else if (tile.candle && item.id >= constants.tileIdOffset) {
      id += constants.tileIdOffset
    } else {
      // Apply tile offset for some tile items.
      switch (item.type) {
      case constants.TYPE.POWERUP:
      case constants.TYPE.HEART:
      case constants.TYPE.GOLD:
      case constants.TYPE.SUBWEAPON:
        break
      default:
        id += constants.tileIdOffset
        break
      }
    }
    return id
  }

  function replaceBossRelicWithItem(opts) {
    const boss = constants.zones[opts.boss]
    return function(data, relic, item, index) {
      let offset
      const id = item.id
      const zone = constants.zones[relic.entity.zones[0]]
      const slots = itemSlots(item)
      // Patch item table.
      offset = romOffset(zone, zone.items + 0x02 * index)
      data.writeShort(offset, id + constants.tileIdOffset)
      // Patch entities table.
      relic.entity.entities.forEach(function(addr) {
        if ('asItem' in relic) {
          if ('x' in relic.asItem) {
            offset = romOffset(zone, addr + 0x00)
            data.writeShort(offset, relic.asItem.x)
          }
          if ('y' in relic.asItem) {
            offset = romOffset(zone, addr + 0x02)
            data.writeShort(offset, relic.asItem.y)
          }
        }
        offset = romOffset(zone, addr + 0x04)
        data.writeShort(offset, 0x000c)
        offset = romOffset(zone, addr + 0x08)
        data.writeShort(offset, index)
      })
      // Patch instructions that load a relic.
      data.writeWord(
        relic.erase.instructions[0].addresses[0],
        relic.erase.instructions[0].instruction,
      )
      // Patch boss reward.
      data.writeShort(
        romOffset(boss, boss.rewards),
        id + constants.tileIdOffset,
      )
      // Entry point.
      offset = romOffset(zone, opts.entry)
      //                                          // j inj
      offset = data.writeWord(offset, 0x08060000 + (opts.inj >> 2))
      offset = data.writeWord(offset, 0x00041400) // sll v0, a0, 10
      // Zero tile function if item is equipped.
      offset = romOffset(zone, opts.inj)
      //                                          // ori t1, r0, id
      offset = data.writeWord(
        offset,
        0x34090000 + id + constants.equipIdOffset
      )
      slots.forEach(function(slot, index) {
        //                                          // lui t0, 0x8009
        offset = data.writeWord(offset, 0x3c080000 + (slot >>> 16))
        //                                          // lbu t0, slot (t0)
        offset = data.writeWord(offset, 0x91080000 + (slot & 0xffff))
        offset = data.writeWord(offset, 0x00000000) // nop
        const next = 5 + 5 * (slots.length - index - 1)
        //                                          // beq t0, t1, pc + next
        offset = data.writeWord(offset, 0x11090000 + next)
        offset = data.writeWord(offset, 0x00000000) // nop
      })
      // Inventory check.
      offset = data.writeWord(offset, 0x3c088009) // lui t0, 0x8009
      //                                          // lbu t0, 0x798a + id (v0)
      offset = data.writeWord(
        offset,
        0x91080000 + id + constants.equipmentInvIdOffset,
      )
      offset = data.writeWord(offset, 0x00000000) // nop
      offset = data.writeWord(offset, 0x11000004) // beq t0, r0, pc + 0x14
      offset = data.writeWord(offset, 0x3409000f) // ori t1, r0, 0x000f
      offset = data.writeWord(offset, 0x3c088018) // lui t0, 0x8018
      relic.entity.entities.forEach(function(addr) {
        //                                        // sh t1, entity + 4 (t0)
        offset = data.writeWord(offset, 0xa5090000 + addr + 0x04)
      })
      // Return.
      offset = data.writeWord(offset, 0x03e00008) // jr ra
      offset = data.writeWord(offset, 0x00000000) // nop
    }
  }

  function getRooms(zone) {
    // Get room count.
    const rooms = roomCount(zone)
    const layouts = zone.readUInt32LE(0x20) - 0x80180000
    const room = zone.readUInt32LE(0x10) - 0x80180000
    const ids = []
    for (let i = 0; i < rooms; i++) {
      const gfxId = zone[room + 0x8 * i + 0x5]
      if (gfxId == 0xff) {
        // Parsing the tiles layout data doesn't work for loading zone like
        // the other rooms, so they must be skipped.
        ids.push(undefined)
        continue
      }
      ids.push(zone[room + 0x8 * i + 0x4])
    }
    return ids.map(function(id) {
      if (id !== undefined) {
        // Get pointer to layout data.
        const offset = zone.readUInt32LE(layouts + 0x8 * id) - 0x80180000
        // Parse the layout data.
        const tiles  = zone.readUInt32LE(offset) - 0x80180000
        const defs   = zone.readUInt32LE(offset + 0x4) - 0x80180000
        const dims   = zone.readUInt32LE(offset + 0x8) & 0xffffff
        const endy   = dims >> 18
        const endx   = (dims >> 12) & 0x3f
        const starty = (dims >> 6) & 0x3f
        const startx = dims & 0x3f
        const width  = endx - startx + 1
        const height = endy - starty + 1
        const roomFlags = zone[offset + 0xa]
        const drawFlags = zone.readUInt16LE(offset + 0xd)
        return {
          offset: offset,
          id: id,
          tiles: tiles,
          defs: defs,
          x: startx,
          y: starty,
          width: width,
          height: height,
          roomFlags: roomFlags,
          drawFlags: drawFlags,
        }
      }
    })
  }

  function tileData(zone) {
    return getRooms(zone).map(function(room) {
      if (room !== undefined) {
        const map = Array(16 * room.height)
        for (let y = 0; y < 16 * room.height; y++) {
          map[y] = Array(16 * room.width)
          for (let x = 0; x < 16 * room.width; x++) {
            const index = zone.readUInt16LE(
              room.tiles + 0x2 * (16 * room.width * y + x)
            )
            if (index) {
              map[y][x] = zone.readUInt32LE(room.defs + 0x20 * index)
            } else {
              map[y][x] = 0
            }
          }
        }
        return map
      }
    })
  }

  function entityData(zone) {
    // Get rooms.
    const rooms = getRooms(zone)
    // Get entity layout IDs.
    const room = zone.readUInt32LE(0x10) - 0x80180000
    const ids = []
    for (let i = 0; i < rooms.length; i++) {
      ids.push(zone[room + 0x4 + 0x8 * i + 0x3])
    }
    // Get pointers to sorted tile layout structures.
    const enter = zone.readUInt32LE(0x0c) - 0x80180000
    const offsets = [
      zone.readUInt16LE(enter + 0x1c),
      zone.readUInt16LE(enter + 0x28),
    ]
    // Get sorted lists.
    const entities = Array(rooms.length).fill(null).map(function() {
      return {}
    })
    offsets.forEach(function(offset) {
      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i]
        if (!room) {
          continue
        }
        const ptr = zone.readUInt32LE(offset + 4 * ids[i]) - 0x80180000
        let entitiy
        let count = 0
        while (true) {
          const p = ptr + 10 * count++
          entity = zone.slice(p, p + 10)
          const key = bufToHex(entity)
          const header = entity.readUInt32LE()
          if (header == 0xffffffff) {
            break
          } else if (header == 0xfffefffe) {
            continue
          }
          entities[i][key] = entities[i][key] || []
          entities[i][key].push(p)
        }
      }
    })
    return entities.map(function(room) {
      return Object.getOwnPropertyNames(room).map(function(key) {
        const bytes = key.match(/[0-9a-f]{2}/g).map(function(byte) {
          return parseInt(byte, 16)
        })
        return {
          data: Buffer.from(bytes),
          addresses: room[key],
        }
      })
    })
  }

  function romOffset(zone, address) {
    return zone.pos + address + Math.floor(address / 0x800) * 0x130
  }

  function bufToHex(buf) {
    return Array.from(buf).map(function(byte) {
      const hex = byte.toString(16)
      return ('0'.slice(0, hex.length % 2) + hex)
    }).join('')
  }

  function numToHex(num, width) {
    let sign = 1
    if (num < 0) {
      sign = -1
      num *= -1
    }
    if (width === undefined) {
      width = 2 * Math.ceil(num.toString(16).length / 2)
    }
    const zeros = Array(width).fill('0').join('')
    const hex = (zeros + num.toString(16)).slice(-width)
    return (sign < 0 ? '-' : '') + '0x' + hex
  }

  function checked(file, writes) {
    if (file) {
      this.file = file
    }
    this.writes = writes || {}
  }

  function checkAddressRange(address) {
    if (address < 0xffff || address > 0xffffffff || Number.isNaN(address)) {
      throw Error('bad address: ' + numToHex(address))
    }
  }

  function replaceTextAtIndex(oldStr, newStr, index) {
    oldStr.substring(0,index) + newStr + oldStr.substring(index + newStr.length)
  }

  function enemyNumStatRand(randomFloat,statAmt) {                              // a function to return a new value for a stat based on the stat's original value
    let tempAmt                                                                 // temp holding space for the number to be converted
    let newAmt                                                                  // this will ultimately be our output
    tempAmt = Math.round(randomFloat * statAmt)                                 // set the temp to the new value for the stat
    newAmt = numToHex(tempAmt,4)                                                // convert the new stat amount to hex width 4 to avoid giving large HP enemies 15k+ HP
    return newAmt                                                               // return the resulting hex for implementation
  }

  function itemPriceStatRand(rng,priceAmt) {                                    // a function to return a new value for a stat based on the stat's original value
    let randomFloat                                                             // set aside for floating decimal
    let tempAmt                                                                 // temp holding space for the number to be converted
    let newAmt                                                                  // this will ultimately be our output
    randomFloat = ((Math.floor(rng() * 100) +50)/ 100)                          // select a random % between 50% and 150%
    tempAmt = Math.round(randomFloat * priceAmt)                                // set the temp to the new value for the price
    newAmt = numToHex(tempAmt,8)                                                // convert the new stat amount to hex width 8 to match the current format
    return newAmt                                                               // return the resulting hex for implementation
  }

  function shuffle(rng,array) {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const randomIndex = Math.floor(rng() * (i + 1));                          // random based on rng from seed
  
      // Swap the elements at i and randomIndex
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  }

  function halfChanceElementRando(rng) {
    let newType
    // We want nothing 50% of the time, and a random type all other times
    if(rng() >= 0.5) return 0x0000;
    
    let typeList = [
      0x0020, // hit
      0x0040, // cut
      0x0080, // poison
      0x8000, // Fire
      0x2000, // Ice
      0x1000, // Holy
      0x4000, // Lightning
      0x0100, // Curse
      0x0200, // Stone
      0x0800  // Dark
    ]
    newType = typeList[Math.floor(rng() * Math.floor(typeList.length - 1))]
    return newType
  }

  function thirdChanceElementRando(rng) {
    let newType
    // We want nothing 33% of the time, and a random type all other times
    if(rng() >= 0.33) return 0x0000;
    
    let typeList = [
      0x0020, // hit
      0x0040, // cut
      0x0080, // poison
      0x8000, // Fire
      0x2000, // Ice
      0x1000, // Holy
      0x4000, // Lightning
      0x0100, // Curse
      0x0200, // Stone
      0x0800  // Dark
    ]
    newType = typeList[Math.floor(rng() * Math.floor(typeList.length - 1))]
    return newType
  }

  function quarterChanceElementRando(rng) {
    let newType
    // We want nothing 50% of the time, and a random type all other times
    if(rng() >= 0.25) return 0x0000;
    
    let typeList = [
      0x0020, // hit
      0x0040, // cut
      0x0080, // poison
      0x8000, // Fire
      0x2000, // Ice
      0x1000, // Holy
      0x4000, // Lightning
      0x0100, // Curse
      0x0200, // Stone
      0x0800  // Dark
    ]
    newType = typeList[Math.floor(rng() * Math.floor(typeList.length - 1))]
    return newType
  }

  function weaponElemRando(rng) {
    let newType
    let typeList = [
      0x0020, // hit
      0x0040, // cut
      0x0080, // poison
      0x8000, // Fire
      0x2000, // Ice
      0x1000, // Holy
      0x4000, // Lightning
      0x0100, // Curse
      0x0200, // Stone
      0x0800  // Dark
    ]
    newType = typeList[Math.floor(rng() * Math.floor(typeList.length - 1))]
    return newType
  }

  function enemyWeakTypeStatRand(rng) {
    let newType
    let typeList = [
      0x0020, // hit
      0x0040, // cut
      0x0080, // poison
      0x8000, // Fire
      0x2000, // Ice
      0x1000, // Holy
      0x4000, // Lightning
      0x0100, // Curse
      0x0200, // Stone
      0x0800  // Dark
    ]
    newType = typeList[Math.floor(rng() * Math.floor(typeList.length - 1))]
    return newType
  }

  function enemyAtkTypeStatRand(rng) {
    let newType
    let typeList = [
      // 0x0000, // No hitbox - Do not combine
      // 0x1000, // Hit 1/6 - Do not combine within the 0xn000 tier. These do not combine with each other. Do not combine with the 0x0n00 tier.
      // 0x2000, // hit - Do not combine within the 0xn000 tier. These do not combine with each other.
      // 0x4000, // cut - Do not combine within the 0xn000 tier. These do not combine with each other.
      // 0x5000, // cut 1/6 - Do not combine within the 0xn000 tier. These do not combine with each other. Do not combine with the 0x0n00 tier.
      // 0x6000, // weak cut - Do not combine
      // 0x8000, // Poison - Do not combine within the 0xn000 tier. These do not combine with each other.
      // 0x0001, // Curse
      // 0x0002, // Stone
      // 0x0004, // Water
      // 0x0008, // Dark
      // 0x0010, // Holy
      // 0x0020, // Ice
      // 0x0040, // Lightning
      // 0x0080, // Fire
      // 0x0200, // Weak Hit - do not combine within the 0x0n00 tier. These do not combine with each other.
      // 0x0400, // Big Toss - do not combine within the 0x0n00 tier. These do not combine with each other.
      // 0x0600, // guard - do not combine.
      // 0x0700, // Cat - do not combine within the 0x0n00 tier. These do not combine with each other.
      0x0000, // No hitbox
      0x0000, // No hitbox
      0x0000, // No hitbox
      0x0006, // guard
      0x0006, // guard
      0x0006, // guard
      0x0021, // Normal Hit
      0x0021, // Normal Hit
      0x0021, // Normal Hit
      0x0121, // Hit Curse
      0x0221, // Hit Stone
      0x0321, // Hit Stone Curse
      0x0421, // Hit Water
      0x0421, // Hit Water
      0x0421, // Hit Water
      0x0521, // Hit Water Curse
      0x0621, // Hit Water Stone
      0x0821, // Hit Dark
      0x0821, // Hit Dark
      0x0821, // Hit Dark
      0x0921, // Hit Dark Curse
      0x0a21, // Hit Dark Stone
      0x0c21, // Hit Dark Water
      0x0c21, // Hit Dark Water
      0x0c21, // Hit Dark Water
      0x1021, // Hit Holy
      0x1021, // Hit Holy
      0x1021, // Hit Holy
      0x1021, // Hit Holy
      0x1021, // Hit Holy
      0x1121, // Hit Holy Curse
      0x1221, // Hit Holy Stone
      0x1421, // Hit Holy Water
      0x1421, // Hit Holy Water
      0x1421, // Hit Holy Water
      0x1821, // Hit Holy Dark
      0x1821, // Hit Holy Dark
      0x1821, // Hit Holy Dark
      0x2021, // Hit Ice
      0x2021, // Hit Ice
      0x2021, // Hit Ice
      0x2121, // Hit Ice Curse
      0x2221, // Hit Ice Stone
      0x2421, // Hit Ice Water
      0x2821, // Hit Ice Dark
      0x2821, // Hit Ice Dark
      0x2821, // Hit Ice Dark
      0x3021, // Hit Holy Ice
      0x3021, // Hit Holy Ice
      0x3021, // Hit Holy Ice
      0x4021, // Hit Lightning
      0x4021, // Hit Lightning
      0x4021, // Hit Lightning
      0x4121, // Hit Lightning Curse
      0x4221, // Hit Lightning Stone
      0x4421, // Hit Lightning Water
      0x4421, // Hit Lightning Water
      0x4421, // Hit Lightning Water
      0x4821, // Hit Lightning Dark
      0x4821, // Hit Lightning Dark
      0x4821, // Hit Lightning Dark
      0x5021, // Hit Holy Lightning
      0x5021, // Hit Holy Lightning
      0x5021, // Hit Holy Lightning
      0x6021, // Hit Ice Lightning
      0x6021, // Hit Ice Lightning
      0x6021, // Hit Ice Lightning
      0x8021, // Hit Fire
      0x8021, // Hit Fire
      0x8021, // Hit Fire
      0x8121, // Hit Fire Curse
      0x8221, // Hit Fire Stone
      0x8421, // Hit Fire Water
      0x8421, // Hit Fire Water
      0x8421, // Hit Fire Water
      0x8821, // Hit Fire Dark
      0x8821, // Hit Fire Dark
      0x8821, // Hit Fire Dark
      0x9021, // Hit Holy Fire
      0x9021, // Hit Holy Fire
      0x9021, // Hit Holy Fire
      0xA021, // Hit Ice Fire
      0xA021, // Hit Ice Fire
      0xA021, // Hit Ice Fire
      0xC021, // Hit Lightning Fire
      0xC021, // Hit Lightning Fire
      0xC021, // Hit Lightning Fire
      0x0124, // Hit Curse
      0x0224, // Hit Stone
      0x0324, // Hit Stone Curse
      0x0424, // Hit Water
      0x0424, // Hit Water
      0x0424, // Hit Water
      0x0524, // Hit Water Curse
      0x0624, // Hit Water Stone
      0x0824, // Hit Dark
      0x0824, // Hit Dark
      0x0824, // Hit Dark
      0x0924, // Hit Dark Curse
      0x0a24, // Hit Dark Stone
      0x0c24, // Hit Dark Water
      0x0c24, // Hit Dark Water
      0x0c24, // Hit Dark Water
      0x1024, // Hit Holy
      0x1024, // Hit Holy
      0x1024, // Hit Holy
      0x1024, // Hit Holy
      0x1024, // Hit Holy
      0x1124, // Hit Holy Curse
      0x1224, // Hit Holy Stone
      0x1424, // Hit Holy Water
      0x1424, // Hit Holy Water
      0x1424, // Hit Holy Water
      0x1824, // Hit Holy Dark
      0x1824, // Hit Holy Dark
      0x1824, // Hit Holy Dark
      0x2024, // Hit Ice
      0x2024, // Hit Ice
      0x2024, // Hit Ice
      0x2124, // Hit Ice Curse
      0x2224, // Hit Ice Stone
      0x2424, // Hit Ice Water
      0x2824, // Hit Ice Dark
      0x2824, // Hit Ice Dark
      0x2824, // Hit Ice Dark
      0x3024, // Hit Holy Ice
      0x3024, // Hit Holy Ice
      0x3024, // Hit Holy Ice
      0x4024, // Hit Lightning
      0x4024, // Hit Lightning
      0x4024, // Hit Lightning
      0x4124, // Hit Lightning Curse
      0x4224, // Hit Lightning Stone
      0x4424, // Hit Lightning Water
      0x4424, // Hit Lightning Water
      0x4424, // Hit Lightning Water
      0x4824, // Hit Lightning Dark
      0x4824, // Hit Lightning Dark
      0x4824, // Hit Lightning Dark
      0x5024, // Hit Holy Lightning
      0x5024, // Hit Holy Lightning
      0x5024, // Hit Holy Lightning
      0x6024, // Hit Ice Lightning
      0x6024, // Hit Ice Lightning
      0x6024, // Hit Ice Lightning
      0x8024, // Hit Fire
      0x8024, // Hit Fire
      0x8024, // Hit Fire
      0x8124, // Hit Fire Curse
      0x8224, // Hit Fire Stone
      0x8424, // Hit Fire Water
      0x8424, // Hit Fire Water
      0x8424, // Hit Fire Water
      0x8824, // Hit Fire Dark
      0x8824, // Hit Fire Dark
      0x8824, // Hit Fire Dark
      0x9024, // Hit Holy Fire
      0x9024, // Hit Holy Fire
      0x9024, // Hit Holy Fire
      0xA024, // Hit Ice Fire
      0xA024, // Hit Ice Fire
      0xA024, // Hit Ice Fire
      0xC024, // Hit Lightning Fire
      0xC024, // Hit Lightning Fire
      0xC024, // Hit Lightning Fire
      0x0041, // Normal Cut
      0x0041, // Normal Cut
      0x0041, // Normal Cut
      0x0141, // Cut Curse
      0x0241, // Cut Stone
      0x0341, // Cut Stone Curse
      0x0441, // Cut Water
      0x0441, // Cut Water
      0x0441, // Cut Water
      0x0541, // Cut Water Curse
      0x0641, // Cut Water Stone
      0x0841, // Cut Dark
      0x0841, // Cut Dark
      0x0841, // Cut Dark
      0x0941, // Cut Dark Curse
      0x0a41, // Cut Dark Stone
      0x0c41, // Cut Dark Water
      0x0c41, // Cut Dark Water
      0x0c41, // Cut Dark Water
      0x1041, // Cut Holy
      0x1041, // Cut Holy
      0x1041, // Cut Holy
      0x1141, // Cut Holy Curse
      0x1241, // Cut Holy Stone
      0x1441, // Cut Holy Water
      0x1441, // Cut Holy Water
      0x1441, // Cut Holy Water
      0x1841, // Cut Holy Dark
      0x1841, // Cut Holy Dark
      0x1841, // Cut Holy Dark
      0x2041, // Cut Ice
      0x2041, // Cut Ice
      0x2041, // Cut Ice
      0x2141, // Cut Ice Curse
      0x2241, // Cut Ice Stone
      0x2441, // Cut Ice Water
      0x2441, // Cut Ice Water
      0x2441, // Cut Ice Water
      0x2841, // Cut Ice Dark
      0x2841, // Cut Ice Dark
      0x2841, // Cut Ice Dark
      0x3041, // Cut Holy Ice
      0x3041, // Cut Holy Ice
      0x3041, // Cut Holy Ice
      0x4041, // Cut Lightning
      0x4041, // Cut Lightning
      0x4041, // Cut Lightning
      0x4141, // Cut Lightning Curse
      0x4241, // Cut Lightning Stone
      0x4441, // Cut Lightning Water
      0x4441, // Cut Lightning Water
      0x4441, // Cut Lightning Water
      0x4841, // Cut Lightning Dark
      0x4841, // Cut Lightning Dark
      0x4841, // Cut Lightning Dark
      0x5041, // Cut Holy Lightning
      0x5041, // Cut Holy Lightning
      0x5041, // Cut Holy Lightning
      0x6041, // Cut Ice Lightning
      0x6041, // Cut Ice Lightning
      0x6041, // Cut Ice Lightning
      0x8041, // Cut Fire
      0x8041, // Cut Fire
      0x8041, // Cut Fire
      0x8141, // Cut Fire Curse
      0x8241, // Cut Fire Stone
      0x8441, // Cut Fire Water
      0x8441, // Cut Fire Water
      0x8441, // Cut Fire Water
      0x8841, // Cut Fire Dark
      0x8841, // Cut Fire Dark
      0x8841, // Cut Fire Dark
      0x9041, // Cut Holy Fire
      0x9041, // Cut Holy Fire
      0x9041, // Cut Holy Fire
      0xA041, // Cut Ice Fire
      0xA041, // Cut Ice Fire
      0xA041, // Cut Ice Fire
      0xC041, // Cut Lightning Fire
      0xC041, // Cut Lightning Fire
      0xC041, // Cut Lightning Fire
      0x0044, // Normal Cut
      0x0044, // Normal Cut
      0x0044, // Normal Cut
      0x0144, // Cut Curse
      0x0244, // Cut Stone
      0x0344, // Cut Stone Curse
      0x0444, // Cut Water
      0x0444, // Cut Water
      0x0444, // Cut Water
      0x0544, // Cut Water Curse
      0x0644, // Cut Water Stone
      0x0844, // Cut Dark
      0x0844, // Cut Dark
      0x0844, // Cut Dark
      0x0944, // Cut Dark Curse
      0x0a44, // Cut Dark Stone
      0x0c44, // Cut Dark Water
      0x0c44, // Cut Dark Water
      0x0c44, // Cut Dark Water
      0x1044, // Cut Holy
      0x1044, // Cut Holy
      0x1044, // Cut Holy
      0x1144, // Cut Holy Curse
      0x1244, // Cut Holy Stone
      0x1444, // Cut Holy Water
      0x1444, // Cut Holy Water
      0x1444, // Cut Holy Water
      0x1844, // Cut Holy Dark
      0x1844, // Cut Holy Dark
      0x1844, // Cut Holy Dark
      0x2044, // Cut Ice
      0x2044, // Cut Ice
      0x2044, // Cut Ice
      0x2144, // Cut Ice Curse
      0x2244, // Cut Ice Stone
      0x2444, // Cut Ice Water
      0x2444, // Cut Ice Water
      0x2444, // Cut Ice Water
      0x2844, // Cut Ice Dark
      0x2844, // Cut Ice Dark
      0x2844, // Cut Ice Dark
      0x3044, // Cut Holy Ice
      0x3044, // Cut Holy Ice
      0x3044, // Cut Holy Ice
      0x4044, // Cut Lightning
      0x4044, // Cut Lightning
      0x4044, // Cut Lightning
      0x4144, // Cut Lightning Curse
      0x4244, // Cut Lightning Stone
      0x4444, // Cut Lightning Water
      0x4444, // Cut Lightning Water
      0x4444, // Cut Lightning Water
      0x4844, // Cut Lightning Dark
      0x4844, // Cut Lightning Dark
      0x4844, // Cut Lightning Dark
      0x5044, // Cut Holy Lightning
      0x5044, // Cut Holy Lightning
      0x5044, // Cut Holy Lightning
      0x6044, // Cut Ice Lightning
      0x6044, // Cut Ice Lightning
      0x6044, // Cut Ice Lightning
      0x8044, // Cut Fire
      0x8044, // Cut Fire
      0x8044, // Cut Fire
      0x8144, // Cut Fire Curse
      0x8244, // Cut Fire Stone
      0x8444, // Cut Fire Water
      0x8444, // Cut Fire Water
      0x8444, // Cut Fire Water
      0x8844, // Cut Fire Dark
      0x8844, // Cut Fire Dark
      0x8844, // Cut Fire Dark
      0x9044, // Cut Holy Fire
      0x9044, // Cut Holy Fire
      0x9044, // Cut Holy Fire
      0xA044, // Cut Ice Fire
      0xA044, // Cut Ice Fire
      0xA044, // Cut Ice Fire
      0xC044, // Cut Lightning Fire
      0xC044, // Cut Lightning Fire
      0xC044, // Cut Lightning Fire
      0x0080, // Normal Poison
      0x0080, // Normal Poison
      0x0080, // Normal Poison
      0x0180, // Poison Curse
      0x0280, // Poison Stone
      0x0480, // Poison Water
      0x0480, // Poison Water
      0x0480, // Poison Water
      0x0880, // Poison Dark
      0x0880, // Poison Dark
      0x0880, // Poison Dark
      0x1080, // Poison Holy
      0x1080, // Poison Holy
      0x1080, // Poison Holy
      0x2080, // Poison Ice
      0x2080, // Poison Ice
      0x2080, // Poison Ice
      0x4080, // Poison Lightning
      0x4080, // Poison Lightning
      0x4080, // Poison Lightning
      0x8080, // Poison Fire
      0x8080, // Poison Fire
      0x8080, // Poison Fire
      0x0084, // Poison Big Toss
      0x0084, // Poison Big Toss
      0x0084, // Poison Big Toss
      0x0184, // Poison Big Toss Curse
      0x0284, // Poison Big Toss Stone
      0x0484, // Poison Big Toss Water
      0x0484, // Poison Big Toss Water
      0x0484, // Poison Big Toss Water
      0x0884, // Poison Big Toss Dark
      0x0884, // Poison Big Toss Dark
      0x0884, // Poison Big Toss Dark
      0x1084, // Poison Big Toss Holy
      0x1084, // Poison Big Toss Holy
      0x1084, // Poison Big Toss Holy
      0x2084, // Poison Big Toss Ice
      0x2084, // Poison Big Toss Ice
      0x2084, // Poison Big Toss Ice
      0x4084, // Poison Big Toss Lightning
      0x4084, // Poison Big Toss Lightning
      0x4084, // Poison Big Toss Lightning
      0x8084, // Poison Big Toss Fire
      0x8084, // Poison Big Toss Fire
      0x8084, // Poison Big Toss Fire
      0x0007, // Cat
      0x0007, // Cat
      0x0007, // Cat
      0x0107, // Cat Curse
      0x0207, // Cat Stone
      0x0407, // Cat Water
      0x0407, // Cat Water
      0x0407, // Cat Water
      0x0807, // Cat Dark
      0x0807, // Cat Dark
      0x0807, // Cat Dark
      0x1007, // Cat Holy
      0x1007, // Cat Holy
      0x1007, // Cat Holy
      0x2007, // Cat Ice
      0x2007, // Cat Ice
      0x2007, // Cat Ice
      0x4007, // Cat Lightning
      0x4007, // Cat Lightning
      0x4007, // Cat Lightning
      0x8007, // Cat Fire
      0x8007, // Cat Fire
      0x8007, // Cat Fire
      0x0011, // Normal Hit 1/6
      0x0011, // Normal Hit 1/6
      0x0011, // Normal Hit 1/6
      0x0411, // Hit 1/6 Water
      0x0411, // Hit 1/6 Water
      0x0411, // Hit 1/6 Water
      0x0811, // Hit 1/6 Dark
      0x0811, // Hit 1/6 Dark
      0x0811, // Hit 1/6 Dark
      0x0c11, // Hit 1/6 Dark Water
      0x0c11, // Hit 1/6 Dark Water
      0x0c11, // Hit 1/6 Dark Water
      0x1011, // Hit 1/6 Holy
      0x1011, // Hit 1/6 Holy
      0x1011, // Hit 1/6 Holy
      0x1411, // Hit 1/6 Holy Water
      0x1411, // Hit 1/6 Holy Water
      0x1411, // Hit 1/6 Holy Water
      0x1811, // Hit 1/6 Holy Dark
      0x1811, // Hit 1/6 Holy Dark
      0x1811, // Hit 1/6 Holy Dark
      0x2011, // Hit 1/6 Ice
      0x2011, // Hit 1/6 Ice
      0x2011, // Hit 1/6 Ice
      0x2411, // Hit 1/6 Ice Water
      0x2411, // Hit 1/6 Ice Water
      0x2411, // Hit 1/6 Ice Water
      0x2811, // Hit 1/6 Ice Dark
      0x2811, // Hit 1/6 Ice Dark
      0x2811, // Hit 1/6 Ice Dark
      0x3011, // Hit 1/6 Holy Ice
      0x3011, // Hit 1/6 Holy Ice
      0x3011, // Hit 1/6 Holy Ice
      0x4011, // Hit 1/6 Lightning
      0x4011, // Hit 1/6 Lightning
      0x4011, // Hit 1/6 Lightning
      0x4411, // Hit 1/6 Lightning Water
      0x4411, // Hit 1/6 Lightning Water
      0x4411, // Hit 1/6 Lightning Water
      0x4811, // Hit 1/6 Lightning Dark
      0x4811, // Hit 1/6 Lightning Dark
      0x4811, // Hit 1/6 Lightning Dark
      0x5011, // Hit 1/6 Holy Lightning
      0x5011, // Hit 1/6 Holy Lightning
      0x5011, // Hit 1/6 Holy Lightning
      0x6011, // Hit 1/6 Ice Lightning
      0x6011, // Hit 1/6 Ice Lightning
      0x6011, // Hit 1/6 Ice Lightning
      0x8011, // Hit 1/6 Fire
      0x8011, // Hit 1/6 Fire
      0x8011, // Hit 1/6 Fire
      0x8411, // Hit 1/6 Fire Water
      0x8411, // Hit 1/6 Fire Water
      0x8411, // Hit 1/6 Fire Water
      0x8811, // Hit 1/6 Fire Dark
      0x8811, // Hit 1/6 Fire Dark
      0x8811, // Hit 1/6 Fire Dark
      0x9011, // Hit 1/6 Holy Fire
      0x9011, // Hit 1/6 Holy Fire
      0x9011, // Hit 1/6 Holy Fire
      0xA011, // Hit 1/6 Ice Fire
      0xA011, // Hit 1/6 Ice Fire
      0xA011, // Hit 1/6 Ice Fire
      0xC011, // Hit 1/6 Lightning Fire
      0xC011, // Hit 1/6 Lightning Fire
      0xC011, // Hit 1/6 Lightning Fire
      0x0051, // Normal Cut 1/6
      0x0051, // Normal Cut 1/6
      0x0051, // Normal Cut 1/6
      0x0451, // Cut 1/6 Water
      0x0451, // Cut 1/6 Water
      0x0451, // Cut 1/6 Water
      0x0851, // Cut 1/6 Dark
      0x0851, // Cut 1/6 Dark
      0x0851, // Cut 1/6 Dark
      0x0c51, // Cut 1/6 Dark Water
      0x0c51, // Cut 1/6 Dark Water
      0x0c51, // Cut 1/6 Dark Water
      0x1051, // Cut 1/6 Holy
      0x1051, // Cut 1/6 Holy
      0x1051, // Cut 1/6 Holy
      0x1451, // Cut 1/6 Holy Water
      0x1451, // Cut 1/6 Holy Water
      0x1451, // Cut 1/6 Holy Water
      0x1851, // Cut 1/6 Holy Dark
      0x1851, // Cut 1/6 Holy Dark
      0x1851, // Cut 1/6 Holy Dark
      0x2051, // Cut 1/6 Ice
      0x2051, // Cut 1/6 Ice
      0x2051, // Cut 1/6 Ice
      0x2451, // Cut 1/6 Ice Water
      0x2451, // Cut 1/6 Ice Water
      0x2451, // Cut 1/6 Ice Water
      0x2851, // Cut 1/6 Ice Dark
      0x2851, // Cut 1/6 Ice Dark
      0x2851, // Cut 1/6 Ice Dark
      0x3051, // Cut 1/6 Holy Ice
      0x3051, // Cut 1/6 Holy Ice
      0x3051, // Cut 1/6 Holy Ice
      0x4051, // Cut 1/6 Lightning
      0x4051, // Cut 1/6 Lightning
      0x4051, // Cut 1/6 Lightning
      0x4451, // Cut 1/6 Lightning Water
      0x4451, // Cut 1/6 Lightning Water
      0x4451, // Cut 1/6 Lightning Water
      0x4851, // Cut 1/6 Lightning Dark
      0x4851, // Cut 1/6 Lightning Dark
      0x4851, // Cut 1/6 Lightning Dark
      0x5051, // Cut 1/6 Holy Lightning
      0x5051, // Cut 1/6 Holy Lightning
      0x5051, // Cut 1/6 Holy Lightning
      0x6051, // Cut 1/6 Ice Lightning
      0x6051, // Cut 1/6 Ice Lightning
      0x6051, // Cut 1/6 Ice Lightning
      0x8051, // Cut 1/6 Fire
      0x8051, // Cut 1/6 Fire
      0x8051, // Cut 1/6 Fire
      0x8451, // Cut 1/6 Fire Water
      0x8451, // Cut 1/6 Fire Water
      0x8451, // Cut 1/6 Fire Water
      0x8851, // Cut 1/6 Fire Dark
      0x8851, // Cut 1/6 Fire Dark
      0x8851, // Cut 1/6 Fire Dark
      0x9051, // Cut 1/6 Holy Fire
      0x9051, // Cut 1/6 Holy Fire
      0x9051, // Cut 1/6 Holy Fire
      0xA051, // Cut 1/6 Ice Fire
      0xA051, // Cut 1/6 Ice Fire
      0xA051, // Cut 1/6 Ice Fire
      0xC051, // Cut 1/6 Lightning Fire
      0xC051, // Cut 1/6 Lightning Fire
      0xC051, // Cut 1/6 Lightning Fire
    ]
    newType = typeList[Math.floor(rng() * Math.floor(typeList.length - 1))]
    return newType
  }

  function getStatType(typeObj, value){
    let valuesForDamage = findRequiredNumbers(value, Object.keys(typeObj))
    valuesForDamage.sort((a, b) => a - b);  // Sort them ascending
    let valueType = ""
    for(value of valuesForDamage){
        valueType += typeObj[value]
    }
    return valueType
}

function hexValueToDamageString(hexValue) {
    // Hit types can't be combined
    let hitTypes = {
        0: "",     // No Hit Box
        1: "",     // Hit 16%
        2: "",     // Hit
        4: "",     // Cut
        5: "",     // Cut 16%
        6: "",     // Cut Weak
        8: "30"      // Poison
    }

    // Hit effects can't be combined
    let hitEffects = {
        0: "",         // No Hit Box
        1: "",         // Ignore normal attack styles
        2: "",       // Hit Weak
        4: "",       // Big Toss
        6: "",       // Guard
        7: "23"        // Cat
    }

    // Damage Types CAN be combined
    let damageTypes = {
        0: "",         // None
        1: "28",        // Holy
        2: "29",        // Ice
        4: "2c",        // Lightning
        8: "26"         // Fire
    }

    // Special Types CAN be combined
    let specialTypes = {
        0: "",          // None
        1: "35",         // Curse
        2: "33",         // Stone
        4: "37",         // Water
        8: "24"          // Dark
    }

    let hitTypeValue = (hexValue >> 4) & 0xF;
    let hitType = hitTypes[hitTypeValue]

    let hitEffectValue = hexValue & 0xF
    let hitEffect = hitEffects[hitEffectValue]

    let damageTypeValue = (hexValue >> 12) & 0xF;
    let damageType = getStatType(damageTypes, damageTypeValue);

    let specialTypeValue = (hexValue >> 8) & 0xF;
    let specialType = getStatType(specialTypes, specialTypeValue)

    return `${hitType}${hitEffect}${damageType}${specialType}`
  }

  function hexValueToDefenceString(hexValue) {
    // Hit types can't be combined
    let hitTypes = {
        0: "3f",     // No Resistance
        1: "",     // Hit 16%
        2: "03",     // Hit
        4: "0f",     // Cut
        5: "",     // Cut 16%
        6: "",     // Cut Weak
        8: "30"      // Poison
    }

    // Hit effects can't be combined
    let hitEffects = {
        0: "",         // No Hit Box
        1: "",         // Ignore normal attack styles
        2: "",       // Hit Weak
        4: "",       // Big Toss
        6: "",       // Guard
        7: "23"        // Cat
    }

    // Damage Types CAN be combined
    let damageTypes = {
        0: "",         // None
        1: "28",        // Holy
        2: "29",        // Ice
        4: "2c",        // Lightning
        8: "26"         // Fire
    }

    // Special Types CAN be combined
    let specialTypes = {
        0: "",          // None
        1: "35",         // Curse
        2: "33",         // Stone
        4: "37",         // Water
        8: "24"          // Dark
    }

    let hitTypeValue = (hexValue >> 4) & 0xF;
    let hitType = hitTypes[hitTypeValue]

    let hitEffectValue = hexValue & 0xF
    let hitEffect = hitEffects[hitEffectValue]

    let damageTypeValue = (hexValue >> 12) & 0xF;
    let damageType = getStatType(damageTypes, damageTypeValue);

    let specialTypeValue = (hexValue >> 8) & 0xF;
    let specialType = getStatType(specialTypes, specialTypeValue)

    return `${hitType}${hitEffect}${damageType}${specialType}`
  }

  checked.prototype.writeChar = function writeChar(address, val) {
    checkAddressRange(address)
    if (this.file) {
      if (typeof(this.file) === 'object') {
        this.file[address] = val & 0xff
      } else {
        const buf = Buffer.from([val & 0xff])
        fs.writeSync(this.file, buf, 0, 1, address)
      }
    }
    this.writes[address] = {
      len: 1,
      val: val & 0xff,
    }
    address = address + 1					// Step adddress. 
    if (Math.floor(address % 2352) > 2071) {			// Then check if new address is beyond User Data section.
      address = ( Math.floor(address / 2352) * 2352) + 2376	// If beyond user data section then return the beginning of the next sector's user data section. - MottZilla
    }
    return address
  }

  checked.prototype.writeShort = function writeShort(address, val) {
    checkAddressRange(address)
    const bytes = [
      val & 0xff,
      (val >>> 8) & 0xff,
    ]
    if (this.file) {
      if (typeof(this.file) === 'object') {
        for (let i = 0; i < 2; i++) {
          this.file[address + i] = bytes[i]
        }
      } else {
        const buf = Buffer.from(bytes)
        fs.writeSync(this.file, buf, 0, 2, address)
      }
    }
    for (let i = address; i < address + 2; i++) {
      delete this.writes[i]
    }
    this.writes[address] = {
      len: 2,
      val: val & 0xffff,
    }
    address = address + 2					// Step adddress. 
    if (Math.floor(address % 2352) > 2071) {			// Then check if new address is beyond User Data section.
      address = ( Math.floor(address / 2352) * 2352) + 2376	// If beyond user data section then return the beginning of the next sector's user data section. - MottZilla
    }
    return address
  }

  checked.prototype.writeWord = function writeShort(address, val) {
    checkAddressRange(address)
    const bytes = [
      val & 0xff,
      (val >>> 8) & 0xff,
      (val >>> 16) & 0xff,
      (val >>> 24) & 0xff,
    ]
    if (this.file) {
      if (typeof(this.file) === 'object') {
        for (let i = 0; i < 4; i++) {
          this.file[address + i] = bytes[i]
        }
      } else {
        const buf = Buffer.from(bytes)
        fs.writeSync(this.file, buf, 0, 4, address)
      }
    }
    for (let i = address; i < address + 4; i++) {
      delete this.writes[i]
    }
    this.writes[address] = {
      len: 4,
      val: val & 0xffffffff,
    }
    address = address + 4					// Step adddress. 
    if (Math.floor(address % 2352) > 2071) {			// Then check if new address is beyond User Data section.
      address = ( Math.floor(address / 2352) * 2352) + 2376	// If beyond user data section then return the beginning of the next sector's user data section. - MottZilla
    }
    return address
  }

  checked.prototype.writeLong = function writeLong(address, val) {
    checkAddressRange(address)
    const bytes = [
      val & 0xff,
      (val >>> 8) & 0xff,
      (val >>> 16) & 0xff,
      (val >>> 24) & 0xff,
      (val >>> 32) & 0xff,
      (val >>> 40) & 0xff,
      (val >>> 48) & 0xff,
      (val >>> 56) & 0xff,
    ]
    if (this.file) {
      if (typeof(this.file) === 'object') {
        for (let i = 0; i < 8; i++) {
          this.file[address + i] = bytes[i]
        }
      } else {
        const buf = Buffer.from(bytes)
        fs.writeSync(this.file, buf, 0, 8, address)
      }
    }
    for (let i = address; i < address + 8; i++) {
      delete this.writes[i]
    }
    this.writes[address] = {
      len: 8,
      val: val,
    }
    address = address + 8					// Step adddress. 
    if (Math.floor(address % 2352) > 2071) {			// Then check if new address is beyond User Data section.
      address = ( Math.floor(address / 2352) * 2352) + 2376	// If beyond user data section then return the beginning of the next sector's user data section. - MottZilla
    }
    return address
  }

  checked.prototype.writeString = function writeString(address, val) {
    checkAddressRange(address)
    if (this.file) {
      if (typeof(this.file) === 'object') {
        for (let i = 0; i < val.length; i++) {
          this.file[address + i] = val[i]
        }
      } else {
        const buf = Buffer.from(val)
        fs.writeSync(this.file, buf, 0, buf.length, address)
      }
    }
    for (let i = address; i < address + val.length; i++) {
      delete this.writes[i]
    }
    this.writes[address] = {
      len: val.length,
      val: val,
    }
    return address + val.length
  }

  checked.prototype.apply = function apply(checked) {
    const self = this
    Object.getOwnPropertyNames(checked.writes).forEach(function(address) {
      if (Array.isArray(checked.writes[address].val)) {
        self.writeString(parseInt(address), checked.writes[address].val)
      } else {
        switch (checked.writes[address].len) {
        case 1:
          self.writeChar(parseInt(address), checked.writes[address].val)
          break
        case 2:
          self.writeShort(parseInt(address), checked.writes[address].val)
          break
        case 4:
          self.writeWord(parseInt(address), checked.writes[address].val)
          break
        case 8:
          self.writeLong(parseInt(address), checked.writes[address].val)
          break
        }
      }
    })
  }

  checked.prototype.toPatch = function toPatch(seed, preset, tournament) {
    const writes = this.writes
    let size = 60 // Header
    const addresses = Object.getOwnPropertyNames(writes)
    addresses.forEach(function(address) {
      size += 9 + writes[address].len
    })
    const patch = new Uint8Array(size)
    const magic = "PPF30"
    let c = 0
    for (let i = 0; i < magic.length; i++) {
      patch[c++] = magic.charCodeAt(i)
    }
    patch[c++] = 0x02
    let description = ['SotN randomized: ', seed]
    if (preset || tournament) {
      const info = []
      if (preset) {
        info.push(preset)
      }
      if (tournament) {
        info.push('tournament')
      }
      description.push(' (', info.join(' '), ')')
    }
    description = description.join('').slice(0, 50)
    description += Array(50 - description.length).fill(' ').join('')
    for (let i = 0; i < description.length; i++) {
      patch[c++] = description.charCodeAt(i)
    }
    patch[c++] = 0x00
    patch[c++] = 0x00
    patch[c++] = 0x00
    patch[c++] = 0x00
    addresses.forEach(function(key) {
      address = parseInt(key)
      for (let i = 0; i < 8; i++) {
        patch[c++] = address & 0xff
        address >>>= 8
      }
      patch[c++] = writes[key].len
      let val = writes[key].val
      for (let i = 0; i < writes[key].len; i++) {
        if (Array.isArray(val)) {
          patch[c++] = val[i] & 0xff
        } else {
          patch[c++] = val & 0xff
          val >>>= 8
        }
      }
    })
    return patch
  }

  checked.prototype.sum = function sum() {
    const state = JSON.stringify(this.writes).split('').map(function(b) {
      return b.charCodeAt()
    })
    return sha256(new Uint8Array(state)).then(function(hex) {
      let zeros = 0
      while (hex.length > 3 && hex[zeros] === '0') {
        zeros++
      }
      return parseInt(hex.slice(zeros, zeros + 3), 16)
    })
  }

  function optionsFromString(randomize) {
    const options = {}
    let i = 0
    while (i < randomize.length) {
      let c = randomize[i++]
      let negate = false
      if (c === '~') {
        if (randomize.length === i) {
          throw new Error('Expected randomization argument to negate')
        }
        negate = true
        c = randomize[i++]
      }
      switch (c) {
      case 'p': { // start preset selection from args/options - eldri7ch
        // Check for an argument.
        if (negate) {
          throw new Error('Cannot negate preset option')
        }
        if (randomize[i] !== ':') {
          throw new Error('Expected argument')
        }
        let arg
        let start
        // Parse the arg name.
        start = ++i
        while (i < randomize.length && randomize[i] !== ',') {
          i++
        }
        arg = randomize.slice(start, i)
        if (!arg.length) {
          throw new Error('Expected argument')
        }
        options.preset = arg
        if (randomize[i] === ',') {
          i++
        }
        break
      } // end preset selection from args/options - eldri7ch
      case 'd': { // start drops selection from args/options - eldri7ch
        if (negate) {
          options.enemyDrops = false
          break
        }
        let enemyDrops = options.enemyDrops || true
        // Check for an argument.
        if (randomize[i] === ':') {
          i++
          let args = 0
          while (i < randomize.length && randomize[i] !== ',') {
            let arg
            let start
            // Parse the arg name.
            start = i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            const block = arg[0] === '-'
            if (block) {
              arg = arg.slice(1)
            }
            if (!arg.length) {
              throw new Error('Expected argument')
            }
            const dashIndex = arg.lastIndexOf('-')
            let level
            if (dashIndex !== -1) {
              level = parseInt(arg.slice(dashIndex + 1))
              arg = arg.slice(0, dashIndex)
            }
            let enemyName
            if (arg === '*' || arg === constants.GLOBAL_DROP) {
              enemyName = arg
            } else {
              let enemy
              let matches
              if (arg.toLowerCase() === 'librarian') {
                enemy = {name: 'Librarian'}
                matches = []
              } else {
                const enemiesDrops = enemies.enemiesDrops
                matches = enemiesDrops.filter(function(enemy) {
                  let name = enemy.name.replace(/[^a-zA-Z0-9]/g, '')
                  name = name.toLowerCase()
                  return name === arg.toLowerCase()
                })
                if (matches.length > 1 && typeof(level) !== 'undefined') {
                  enemy = matches.filter(function(enemy) {
                    return enemy.level === level
                  })[0]
                } else {
                  enemy = matches[0]
                }
              }
              if (!enemy) {
                throw new Error('Unknown enemy: ' + arg)
              }
              enemyName = enemy.name.replace(/[^a-zA-Z0-9]/g, '')
              if (matches.length > 1 && matches[0] !== enemy) {
                enemyName += '-' + enemy.level
              }
            }
            if (typeof(enemyDrops) !== 'object') {
              enemyDrops = {}
            }
            if (randomize[i] === ':') {
              start = ++i
              while (i < randomize.length
                     && [',', ':'].indexOf(randomize[i]) === -1) {
                i++
              }
              arg = randomize.slice(start, i)
              if (block) {
                enemyDrops.blocked = enemyDrops.blocked || {}
                enemyDrops.blocked[enemyName] = arg.split('-').map(
                  function(arg)  {
                    const item = items.filter(function(item) {
                      let name = item.name.replace(/[^a-zA-Z0-9]/g, '')
                      name = name.toLowerCase()
                      return name === arg.toLowerCase()
                    })[0]
                    if (!item) {
                      throw new Error('Unknown item: ' + arg)
                    }
                    return item.name
                  }
                )
              } else {
                enemyDrops[enemyName] = []
                arg.split('-').forEach(function(arg, index)  {
                  if (enemyName !== constants.GLOBAL_DROP && index > 1) {
                    throw new Error('Too many drops for enemy: ' + enemy.name)
                  }
                  if (arg) {
                    const item = items.filter(function(item) {
                      let name = item.name.replace(/[^a-zA-Z0-9]/g, '')
                      name = name.toLowerCase()
                      return name === arg.toLowerCase()
                    })[0]
                    if (!item) {
                      throw new Error('Unknown item: ' + arg)
                    }
                    const itemName = item.name
                    enemyDrops[enemyName].push(itemName)
                  } else {
                    enemyDrops[enemyName].push('')
                  }
                })
              }
            }
            if (randomize[i] === ':') {
              i++
            }
            args++
          }
          if (randomize[i] === ',') {
            i++
          }
          if (!args) {
            throw new Error('Expected arguments')
          }
        } else if (typeof(enemyDrops) === 'undefined') {
          // Otherwise it's just turning on drop randomization.
          enemyDrops = true
        }
        if (typeof(enemyDrops) === 'object'
            && Object.getOwnPropertyNames(enemyDrops).length === 0) {
          enemyDrops = true
        }
        options.enemyDrops = enemyDrops
        break
      } // end drops selection from args/options - eldri7ch
      case 'e': { // start equipment selection from args/options - eldri7ch
        if (negate) {
          options.startingEquipment = false
          break
        }
        let startingEquipment = options.startingEquipment || true
        // Check for an argument.
        if (randomize[i] === ':') {
          i++
          let args = 0
          while (i < randomize.length && randomize[i] !== ',') {
            let arg
            let start
            // Parse the arg name.
            start = i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            const block = arg[0] === '-'
            if (block) {
              arg = arg.slice(1)
            }
            if (!arg.length) {
              throw new Error('Expected argument')
            }
            if (['r', 'l', 'h', 'b', 'c', 'o', 'a', 'x'].indexOf(arg) === -1) {
              throw new Error('Unknown equipment slot: ' + arg)
            }
            const slot = arg
            if (randomize[i] !== ':') {
              throw new Error('Expected argument')
            }
            start = ++i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            const itemNames = arg.split('-').map(function(name) {
              const item = items.filter(function(item) {
                let name = item.name.replace(/[^a-zA-Z0-9]/g, '')
                name = name.toLowerCase()
                return name === arg.toLowerCase()
              })[0]
              if (!item) {
                throw new Error('Unknown item: ' + arg)
              }
              let types
              switch (slot) {
              case 'r':
                types = [
                  constants.TYPE.WEAPON1,
                  constants.TYPE.WEAPON2,
                  constants.TYPE.SHIELD,
                  constants.TYPE.USABLE,
                ]
                if (types.indexOf(item.type) === -1) {
                  throw new Error('Cannot equip ' + item.name
                                  + ' in right hand')
                }
                if (startingEquipment.l
                    && item.type === constants.TYPE.WEAPON2) {
                  throw new Error('Cannot equip ' + item.name
                                  + ' and a two handed weapon')
                }
                break
              case 'l':
                types = [
                  constants.TYPE.WEAPON1,
                  constants.TYPE.SHIELD,
                  constants.TYPE.USABLE,
                ]
                if (types.indexOf(item.type) === -1) {
                  throw new Error('Cannot equip ' + item.name
                                  + ' in left hand')
                }
                if (startingEquipment.r
                    && startingEquipment.r.type === constants.TYPE.WEAPON2) {
                  throw new Error('Cannot equip ' + item.name
                                  + ' and a two handed weapon')
                }
                break
              case 'h':
                if (item.type !== constants.TYPE.HELMET) {
                  throw new Error('Cannot equip ' + item.name + ' on head')
                }
                break
              case 'b':
                if (item.type !== constants.TYPE.ARMOR) {
                  throw new Error('Cannot equip ' + item.name + ' on body')
                }
                break
              case 'c':
                if (item.type !== constants.TYPE.CLOAK) {
                  throw new Error('Cannot equip ' + item.name + ' as cloak')
                }
                break
              case 'o':
                if (item.type !== constants.TYPE.ACCESSORY) {
                  throw new Error('Cannot equip ' + item.name + ' as other')
                }
                break
              case 'a':
                if (item.type !== constants.TYPE.ARMOR) {
                  throw new Error('Cannot give ' + item.name + ' as armor')
                }
                break
              case 'x':
                if (item.type !== constants.TYPE.ACCESSORY) {
                  throw new Error('Cannot equip ' + item.name + ' as other')
                }
                break
              }
              return item.name
            })
            if (typeof(startingEquipment) !== 'object') {
              startingEquipment = {}
            }
            if (block) {
              startingEquipment.blocked = startingEquipment.blocked || {}
              startingEquipment.blocked[slot] = itemNames
            } else {
              startingEquipment[slot] = itemNames
            }
            if (randomize[i] === ':') {
              i++
            }
            args++
          }
          if (randomize[i] === ',') {
            i++
          }
          if (!args) {
            throw new Error('Expected argument')
          }
        } else if (typeof(startingEquipment) === 'undefined') {
          // Otherwise it's just turning on equipment randomization.
          startingEquipment = true
        }
        if (typeof(startingEquipment) === 'object'
            && Object.getOwnPropertyNames(startingEquipment).length === 0) {
          startingEquipment = true
        }
        options.startingEquipment = startingEquipment
        break
      } // end equipment selection from args/options - eldri7ch
      case 'i': { // start item location selection from args/options - eldri7ch
        if (negate) {
          options.itemLocations = false
          break
        }
        let itemLocations = options.itemLocations || true
        // Check for an argument.
        if (randomize[i] === ':') {
          i++
          let args = 0
          while (i < randomize.length && randomize[i] !== ',') {
            let arg
            let start
            // Parse the arg name.
            start = i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            const block = arg[0] === '-'
            if (block) {
              arg = arg.slice(1)
            }
            if (!arg.length) {
              throw new Error('Expected argument')
            }
            if (typeof(itemLocations) !== 'object') {
              itemLocations = {}
            }
            if (arg !== '*' && !(arg in constants.ZONE)) {
              throw new Error('Unknown zone: ' + arg)
            }
            const zone = arg
            if (randomize[i] !== ':') {
              throw new Error('Expected argument')
            }
            start = ++i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            if (!arg.length) {
              throw new Error('Expected argument')
            }
            let itemName
            let index
            if (arg === '*') {
              itemName = arg
              index = 0
            } else {
              const dashIndex = arg.lastIndexOf('-')
              if (dashIndex === -1) {
                index = 0
              } else {
                index = parseInt(arg.slice(dashIndex + 1)) - 1
                if (index < 0) {
                  throw new Error('Unknown item number: '
                                  + arg.slice(dashIndex + 1))
                }
                arg = arg.slice(0, dashIndex)
              }
              const item = items.filter(function(item) {
                let name = item.name.replace(/[^a-zA-Z0-9]/g, '')
                name = name.toLowerCase()
                return name === arg.toLowerCase()
              })[0]
              if (!item) {
                throw new Error('Unknown item: ' + arg)
              }
              itemName = item.name
              const tile = item.tiles && item.tiles.filter(function(tile) {
                if (typeof(tile.zones) !== 'undefined') {
                  return tile.zones.indexOf(constants.ZONE[zone]) !== -1
                }
              })[index]
              if (!tile) {
                throw new Error('Item not found in zone: ' + arg)
              }
            }
            if (randomize[i] !== ':') {
              throw new Error('Expected argument')
            }
            start = ++i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            if (!arg.length) {
              throw new Error('Expected argument')
            }
            const replace = arg.split('-').map(function(arg) {
              const item = items.filter(function(item) {
                let name = item.name.replace(/[^a-zA-Z0-9]/g, '')
                name = name.toLowerCase()
                return name === arg.toLowerCase()
              })[0]
              if (!item) {
                throw new Error('Unknown item: ' + arg)
              }
              return item
            })
            let locations = itemLocations
            if (block) {
              itemLocations.blocked = itemLocations.blocked || {}
              locations = itemLocations.blocked
            }
            locations[zone] = locations[zone] || {}
            const map = locations[zone][itemName] || {}
            map[index] = replace.map(function(item) {
              return item.name
            })
            locations[zone][itemName] = map
            if (randomize[i] === ':') {
              i++
            }
          }
          args++
          if (randomize[i] === ',') {
            i++
          }
          if (!args) {
            throw new Error('Expected argument')
          }
        } else if (typeof(itemLocations) === 'undefined') {
          // Otherwise it's just turning on item randomization.
          itemLocations = true
        }
        if (typeof(itemLocations) === 'object'
            && Object.getOwnPropertyNames(itemLocations).length === 0) {
          itemLocations = true
        }
        options.itemLocations = itemLocations
        break
      } // end item location selection from args/options - eldri7ch
      case 'b': { // start prologue rewards selection from args/options - eldri7ch
        if (negate) {
          options.prologueRewards = false
          break
        }
        let prologueRewards = options.prologueRewards || true
        // Check for an argument
        if (randomize[i] === ':') {
          i++
          let args = 0
          while (i < randomize.length && randomize[i] !== ',') {
            let arg
            let start
            // Parse the arg name.
            start = i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            const block = arg[0] === '-'
            if (block) {
              arg = arg.slice(1)
            }
            if (!arg.length) {
              throw new Error('Expected argument')
            }
            const item = arg
            if (['h', 'n', 'p'].indexOf(item) === -1) {
              throw new Error('Unknown reward: ' + arg)
            }
            if (randomize[i] !== ':') {
              throw new Error('Expected argument')
            }
            start = ++i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            const replaceNames = arg.split('-').map(function(arg) {
              const replace = items.filter(function(item) {
                let name = item.name.replace(/[^a-zA-Z0-9]/g, '')
                name = name.toLowerCase()
                return name === arg.toLowerCase()
              })[0]
              if (!replace) {
                throw new Error('Unknown item: ' + arg)
              }
              return replace.name
            })
            if (typeof(prologueRewards) !== 'object') {
              prologueRewards = {}
            }
            if (block) {
              prologueRewards.blocked = prologueRewards.block || {}
              prologueRewards.blocked[item] = replaceNames
            } else {
              prologueRewards[item] = replaceNames
            }
            if (randomize[i] === ':') {
              i++
            }
            args++
          }
          if (randomize[i] === ',') {
            i++
          }
          if (!args) {
            throw new Error('Expected argument')
          }
        } else if (typeof(prologueRewards) === 'undefined') {
          // Otherwise it's just turning on reward randomization.
          prologueRewards = true
        }
        if (typeof(prologueRewards) === 'object'
            && Object.getOwnPropertyNames(prologueRewards).length === 0) {
          prologueRewards = true
        }
        options.prologueRewards = prologueRewards
        break
      } // end prologue rewards selection from args/options - eldri7ch
      case 'r': { // start relic locations selection from args/options - eldri7ch
        if (negate) {
          options.relicLocations = false
          break
        }
        let relicLocations = options.relicLocations || true
        // Check for an argument.
        if (randomize[i] === ':') {
          i++
          let args = 0
          while (i < randomize.length && randomize[i] !== ',') {
            // If there's an argument it's either a location lock, a location
            // extension, or a complexity target.
            const relicNames = Object.getOwnPropertyNames(constants.RELIC)
            let arg
            let start
            // Parse the arg name.
            start = i
            while (i < randomize.length
                   && [',', ':'].indexOf(randomize[i]) === -1) {
              i++
            }
            arg = randomize.slice(start, i)
            if (!arg.length) {
              throw new Error('Expected argument')
            }
            const locations = relics.map(function(relic) {
              return relic.ability
            }).concat(extension.map(function(location) {
              return location.name
            }))
            let ext
            let leakPrevention
            let thrustSwordAbility
            let location
            let placing
            let replacing
            let blocking
            if (/^[0-9]+(-[0-9]+)?$/.test(arg)) {
              location = arg
            } else if (arg === 'x') {
              ext = true
            } else if (arg === 'r') {
              leakPrevention = true
            } else if (arg === '~r') {
              leakPrevention = false
            } else if (arg === constants.RELIC.THRUST_SWORD) {
              thrustSwordAbility = true
            } else if (arg === '~' + constants.RELIC.THRUST_SWORD) {
              thrustSwordAbility = false
            } else {
              if (arg.startsWith('@')) {
                placing = true
                arg = arg.slice(1)
              } else if (arg.startsWith('=')) {
                replacing = true
                arg = arg.slice(1)
              } else if (arg.startsWith('-')) {
                blocking = true
                arg = arg.slice(1)
              }
              location = locations.filter(function(name) {
                if (name.length > 1) {
                  const loc = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                  return loc === arg.toLowerCase()
                }
                return name === arg
              }).pop()
              if (!location) {
                throw new Error('Invalid relic location: ' + arg)
              }
            }
            if (typeof(relicLocations) !== 'object') {
              relicLocations = {}
            }
            if (typeof(thrustSwordAbility) !== 'undefined') {
              relicLocations.thrustSwordAbility = thrustSwordAbility
            } else if (typeof(leakPrevention) !== 'undefined') {
              relicLocations.leakPrevention = leakPrevention
            } else if (randomize[i] === ':') {
              start = ++i
              while (i < randomize.length
                     && [',', ':'].indexOf(randomize[i]) === -1) {
                i++
              }
              arg = randomize.slice(start, i)
              if (ext) {
                const keys = Object.getOwnPropertyNames(constants.EXTENSION)
                const extensions = keys.map(function(key) {
                  return constants.EXTENSION[key]
                })
                if (extensions.indexOf(arg) === -1) {
                  throw new Error('Invalid relic locations extension: ' + arg)
                }
                relicLocations.extension = arg
              } else if (placing) {
                const relics = arg.split('')
                const invalid = relics.filter(function(c) {
                  if (c === '0') {
                    return false
                  }
                  return !relicNames.some(function(relic) {
                    return constants.RELIC[relic] === c
                  })
                })
                if (invalid.length) {
                  throw new Error('Invalid relic: ' + invalid[0])
                }
                relicLocations.placed = relicLocations.placed || {}
                relicLocations.placed[location] = relics.map(function(c) {
                  if (c === '0') {
                    return null
                  }
                  return c
                })
              } else if (replacing) {
                const relic = location
                const item = items.filter(function(item) {
                  let name = item.name.replace(/[^a-zA-Z0-9]/g, '')
                  name = name.toLowerCase()
                  return name === arg.toLowerCase()
                })[0]
                if (!item) {
                  throw new Error('Unknown item: ' + arg)
                }
                relicLocations.replaced = relicLocations.replaced || {}
                relicLocations.replaced[relic] = item.name
              } else if (blocking) {
                const relics = arg.split('')
                const invalid = relics.filter(function(c) {
                  if (c === '0') {
                    return false
                  }
                  return !relicNames.some(function(relic) {
                    return constants.RELIC[relic] === c
                  })
                })
                if (invalid.length) {
                  throw new Error('Invalid relic: ' + invalid[0])
                }
                relicLocations.blocked = relicLocations.blocked || {}
                relicLocations.blocked[location] = relics.map(function(c) {
                  if (c === '0') {
                    return null
                  }
                  return c
                })
              } else {
                const invalid = arg.split('').filter(function(c) {
                  if (c === '-' || c === '+') {
                    return false
                  }
                  return !relicNames.some(function(relic) {
                    return constants.RELIC[relic] === c
                  })
                })
                if (invalid.length) {
                  throw new Error('Invalid relic: ' + invalid[0])
                }
                const parts = arg.split('+')
                if (parts.length > 2) {
                  throw new Error('Invalid lock: ' + location + ':' + arg)
                }
                parts.forEach(function(part, index) {
                  let locks = part.split('-')
                  if (placing && locks.length > 1) {
                    throw new Error('Invalid placement: @' + location + ':'
                                    + arg)
                  }
                  const emptyLocks = locks.filter(function(lock) {
                    return lock.length === 0
                  })
                  locks = locks.filter(function(lock) {
                    return lock.length > 0
                  })
                  if (emptyLocks.length > 1) {
                    throw new Error('Invalid lock: ' + location + ':' + arg)
                  }
                  if (index > 0) {
                    locks = locks.map(function(lock) { return '+' + lock })
                  }
                  relicLocations[location] = relicLocations[location] || []
                  Array.prototype.push.apply(relicLocations[location], locks)
                })
              }
            } else {
              throw new Error('Expected argument')
            }
            if (randomize[i] === ':') {
              i++
            }
            args++
          }
          if (randomize[i] === ',') {
            i++
          }
          if (!args) {
            throw new Error('Expected argument')
          }
        } else if (typeof(relicLocations) === 'undefined') {
          // Otherwise it's just turning on relic randomization.
          relicLocations = true
        }
        if (typeof(relicLocations) === 'object'
            && Object.getOwnPropertyNames(relicLocations).length === 0) {
          relicLocations = true
        }
        options.relicLocations = relicLocations
        break
      } // end relic locations selection from args/options - eldri7ch
      case 's': { // start stats selection from args/options - eldri7ch
        if (negate) {
          options.stats = false
          break
        }
        options.stats = true
        break;
      } // end stats selection from args/options - eldri7ch
      case 'm': { // start music selection from args/options - eldri7ch
        if (negate) {
          options.music = false
          break
        }
        options.music = true
        break
      } // end music selection from args/options - eldri7ch
      case 'k': { // start turkey mode selection from args/options - eldri7ch
        if (negate) {
          options.turkeyMode = false
          break
        }
        options.turkeyMode = true
        break
      } // end turkey mode selection from args/options - eldri7ch
      case 'w': { // start writes selection from args/options - eldri7ch
        if (negate) {
          break
        }
        let writes = []
        if (randomize[i] !== ':') {
          throw new Error('Expected argument')
        }
        i++
        let args = 0
        while (i < randomize.length && randomize[i] !== ',') {
          let address
          let value
          let start
          // Parse the address.
          start = i
          while (i < randomize.length
                 && [',', ':'].indexOf(randomize[i]) === -1) {
            i++
          }
          address = randomize.slice(start, i)
          if (!address.length) {
            throw new Error('Expected address')
          }
          address = parseInt(address)
          if (checkAddressRange(address)) {
            throw new Error('Invalid address: ' + address)
          }
          if (randomize[i] !== ':') {
            throw new Error('Expected value')
          }
          start = ++i
          while (i < randomize.length
                 && [',', ':'].indexOf(randomize[i]) === -1) {
            i++
          }
          value = randomize.slice(start, i)
          if (!value.length) {
            throw new Error('Expected value')
          }
          let isRandom = value.startsWith('n')
          let isInt = value.startsWith('0x')
          let hex
          if (isInt) {
            if (value.length <= 2) {
              throw new Error('Invalid value: ' + value)
            }
            hex = value.slice(2)
          } else {
            hex = value
          }
          if (!isRandom && (hex.length % 2 || !hex.match(/^[a-fA-F0-9]+$/))) {
            throw new Error('Invalid value: ' + value)
          }
          let type
          if (isInt || isRandom) {
            let length
            if (isRandom) {
              switch (value) {
              case 'rc': length = 1
              case 'r1': length = 1
              case 'r3': length = 1
              case 'r10': length = 1
              case 'r99': length = 1
              case 'rhc': length = 1
              case 'rs': length = 2
              case 'rw': length = 4
              case 'rr': length = 4
              case 'rl': length = 8
              default:
                throw new Error('Invalid value: ' + value)
              }
            } else {
              value = parseInt(value)
              length = hex.length
            }
            switch (length) {
            case 2:
              writes.push({
                type: 'char',
                address: address,
                value: value,
              })
              break
            case 4:
              writes.push({
                type: 'short',
                address: address,
                value: value,
              })
              break
            case 8:
              writes.push({
                type: 'word',
                address: address,
                value: value,
              })
              break
            case 16:
              writes.push({
                type: 'long',
                address: address,
                value: value,
              })
              break
            default:
              throw new Error('Invalid value: ' + value)
            }
          } else {
            const hexBytes = value.split(/([a-fA-F0-9]{2})/g)
            value = hexBytes.reduce(function(bytes, byteValue) {
              if (byteValue.length) {
                bytes.push(parseInt(byteValue, 16))
              }
              return bytes
            }, [])
            writes.push({
              type: 'string',
              address: address,
              value: value,
            })
          }
          if (randomize[i] === ':') {
            i++
          }
          args++
        }
        if (randomize[i] === ',') {
          i++
        }
        if (!args) {
          throw new Error('Expected argument')
        }
        options.writes = writes
        break
      } // end writes selection from args/options - eldri7ch
      case 't': { // start tournament mode selection from args/options - eldri7ch
        if (negate) {
          options.tournamentMode = false
          break
        }
        options.tournamentMode = true
        break
      } // end tournament mode selection from args/options - eldri7ch
      default:
        throw new Error('Invalid randomization: ' + c) // kick out the remainder of options - eldri7ch
      }
    }
    if (!Object.getOwnPropertyNames(options).length) { // error out if all randomization negated - eldri7ch
      throw new Error('No randomizations')
    }
    return options
  }

  function presets() {
    try {
      if (self) {
        return self.sotnRando.presets
      } else {
        return require('../build/presets')
      }
    } catch (err) {
      return []
    }
  }

  function presetFromName(name) {
    const all = presets()
    return all.filter(function(preset) {
      return 'id' in preset && preset.id === name
    }).pop()
  }

  function optionsToString(options, disableRecurse) {
    options = Object.assign({}, options)
    delete options.checkVanilla
    delete options.verbose
    Object.getOwnPropertyNames(options).forEach(function(opt) {
      if (options[opt] === false) {
        delete options[opt]
      }
    })
    const safe = presetFromName('safe')
    // Handle the edge case where there is a preset, but the remaining
    // options are the same as the preset options.
    if ('preset' in options
        && Object.getOwnPropertyNames(options).length > 1) {
      // If relicLocations is strictly true, replace it with the safe preset
      // location locks.
      const copy = Object.assign({}, options)
      delete copy.preset
      if (copy.relicLocations === true) {
        copy.relicLocations = clone(safe.options().relicLocations)
      }
      // Now compare the remaining options to the preset options.
      const preset = presetFromName(options.preset)
      if (optionsToString(copy) === optionsToString(preset.options())) {
        // If they match, the options become the preset by itself.
        options = {preset: preset.id}
      }
    }
    let randomize = []
    while (Object.getOwnPropertyNames(options).length) {
      if ('tournamentMode' in options) { // stunts spoilers, changes seed randomization, opens statue in clock room and $0 relic in shop - eldri7ch
        if (options.tournamentMode) {
          randomize.push('t')
        }
        delete options.tournamentMode
      } else if ('colorrandoMode' in options) { // randomizes cape, grav boots, and hydro storm colors - eldri7ch
        if (options.colorrandoMode) {
          randomize.push('l')
        }
        delete options.colorrandoMode
      } else if ('magicmaxMode' in options) { // replaces Heart Vessel with Magic Vessel - eldri7ch
        if (options.magicmaxMode) {
          randomize.push('x')
        }
        delete options.magicmaxMode
      } else if ('antiFreezeMode' in options) { // Removes screen freezes from level-up and acquisitions - eldrich
        if (options.antiFreezeMode) {
          randomize.push('z')
        }
        delete options.antiFreezeMode
      } else if ('mypurseMode' in options) { // Removes Death from entrance - eldri7ch
        if (options.mypurseMode) {
          randomize.push('y')
        }
        delete options.mypurseMode
      } else if ('iwsMode' in options) { // Allows for infinite wing smash on first input - eldri7ch
        if (options.iwsMode) {
          randomize.push('b')
        }
        delete options.iwsMode
      } else if ('fastwarpMode' in options) { // quickensd the teleporter warp animations - eldri7ch
        if (options.fastwarpMode) {
          randomize.push('9')
        }
        delete options.fastwarpMode
      } else if ('itemNameRandoMode' in options) { // randomize item names with item stat rando - MottZilla
        if (options.itemNameRandoMode) {
          randomize.push('in')
        }
        delete options.itemNameRandoMode
      } else if ('noprologueMode' in options) { // Removes prologue - eldri7ch
        if (options.noprologueMode) {
          randomize.push('R')
        }
        delete options.noprologueMode
      } else if ('unlockedMode' in options) { // Opens shortcuts - eldri7ch
        if (options.unlockedMode) {
          randomize.push('U')
        }
        delete options.unlockedMode
      } else if ('surpriseMode' in options) { // Hides relics behind the same sprite - eldri7ch
        if (options.surpriseMode) {
          randomize.push('S')
        }
        delete options.surpriseMode
      } else if ('enemyStatRandoMode' in options) { // randomize enemy stats - eldri7ch
        if (options.enemyStatRandoMode) {
          randomize.push('E')
        }
        delete options.enemyStatRandoMode
      } else if ('shopPriceRandoMode' in options) { // randomize shop prices - eldri7ch
        if (options.shopPriceRandoMode) {
          randomize.push('sh')
        }
        delete options.shopPriceRandoMode
      } else if ('startRoomRandoMode' in options) { // randomize starting room - eldri7ch
        if (options.startRoomRandoMode) {
          randomize.push('ori')
        }
        delete options.startRoomRandoMode
      } else if ('startRoomRando2ndMode' in options) { // randomize starting room 2nd castle - MottZilla
        if (options.startRoomRando2ndMode) {
          randomize.push('ori2')
        }
        delete options.startRoomRando2ndMode
      } else if ('dominoMode' in options) { // guaranteed drops - eldri7ch
        if (options.dominoMode) {
          randomize.push('gd')
        }
        delete options.dominoMode
      } else if ('rlbcMode' in options) { // reverse library cards - eldri7ch
        if (options.rlbcMode) {
          randomize.push('rl')
        }
        delete options.rlbcMode
      } else if ('immunityPotionMode' in options) { // immuntiy potions - eldri7ch
        if (options.immunityPotionMode) {
          randomize.push('ip')
        }
        delete options.immunityPotionMode
      } else if ('godspeedMode' in options) { // godspeed shoes - eldri7ch
        if (options.godspeedMode) {
          randomize.push('gss')
        }
        delete options.godspeedMode
      } else if ('libraryShortcut' in options) { // library shortcut - eldri7ch
        if (options.libraryShortcut) {
          randomize.push('ls')
        }
        delete options.libraryShortcut
      } else if ('elemChaosMode' in options) { // elemental chaos - eldri7ch
        if (options.elemChaosMode) {
          randomize.push('ec')
        }
        delete options.elemChaosMode
      } else if ('simpleInputMode' in options) { // simple input - eldri7ch
        if (options.simpleInputMode) {
          randomize.push('si')
        }
        delete options.simpleInputMode
      } else if ('devStashMode' in options) { // dev's stash - eldri7ch
        if (options.devStashMode) {
          randomize.push('dev')
        }
        delete options.devStashMode
      } else if ('seasonalPhrasesMode' in options) { // seasonal phrases - eldri7ch
        if (options.seasonalPhrasesMode) {
          randomize.push('sp')
        }
        delete options.seasonalPhrasesMode
      } else if ('mapcolorTheme' in options) { // switch map color
        randomize.push('m:' + options.mapcolorTheme)
        delete options.mapcolorTheme
      } else if ('newGoalsSet' in options) { // Change the goals
        randomize.push('g:' + options.newGoalsSet)
        delete options.newGoalsSet
      } else if ('bossMusicSeparation' in options) { // boss Music Separation- eldri7ch
        if (options.bossMusicSeparation) {
          randomize.push('bm')
        }
        delete options.bossMusicSeparation
      } else if ('alucardPaletteSet' in options) { // alucard's palette - crazy4blades
        randomize.push('ap:' + options.alucardPaletteSet)
        delete options.alucardPaletteSet
      }else if ('alucardLinerSet' in options) { // alucard's Liner - Crazy4blades
        randomize.push('al:' + options.alucardLinerSet)
        delete options.alucardLinerSet
      } else if ('excludesongs' in options) { // Exclude songs - eldri7ch
        randomize.push('eds:' + options.excludesongs)
        delete options.excludesongs
      } else if ('preset' in options) {
        randomize.push('p:' + options.preset)
        delete options.preset
      } else if ('enemyDrops' in options) {
        if (options.enemyDrops) {
          let opt = 'd'
          if (typeof(options.enemyDrops) === 'object') {
            const drops = options.enemyDrops
            if (drops.blocked) {
              Object.getOwnPropertyNames(drops.blocked).forEach(
                function(enemyName) {
                  if (enemyName === '*') {
                    opt += ':-*'
                  } else {
                    opt += ':-' + enemyName.replace(/[^a-zA-Z0-9\-]/g, '')
                  }
                  opt += ':'
                  opt += drops.blocked[enemyName].map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              )
            }
            Object.getOwnPropertyNames(drops).filter(function(enemyName) {
              return enemyName !== 'blocked'
            }).forEach(function(enemyName) {
              if (enemyName === '*') {
                opt += ':*'
              } else {
                opt += ':' + enemyName.replace(/[^a-zA-Z0-9\-]/g, '')
              }
              if (drops[enemyName].length) {
                opt += ':'
                opt += drops[enemyName].map(function(dropName) {
                  if (dropName) {
                    return dropName.replace(/[^a-zA-Z0-9]/g, '')
                  }
                }).join('-')
              }
            })
          }
          randomize.push(opt)
        }
        delete options.enemyDrops
      } else if ('startingEquipment' in options) {
        if (options.startingEquipment) {
          let opt = 'e'
          const eq = options.startingEquipment
          if (typeof(eq) === 'object') {
            if (eq.blocked) {
              if ('r' in eq.blocked) {
                opt += ':-r:'
                if (eq.blocked.r) {
                  opt += eq.blocked.r.map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              }
              if ('l' in eq.blocked) {
                opt += ':-l:'
                if (eq.blocked.l) {
                  opt += eq.blocked.l.map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              }
              if ('h' in eq.blocked) {
                opt += ':-h:'
                if (eq.blocked.h) {
                  opt += eq.blocked.h.map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              }
              if ('b' in eq.blocked) {
                opt += ':-b:'
                if (eq.blocked.b) {
                  opt += eq.blocked.b.map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              }
              if ('c' in eq.blocked) {
                opt += ':-c:'
                if (eq.blocked.c) {
                  opt += eq.blocked.c.map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              }
              if ('o' in eq.blocked) {
                opt += ':-o:'
                if (eq.blocked.o) {
                  opt += eq.blocked.o.map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              }
              if ('a' in eq.blocked) {
                opt += ':-a:'
                if (eq.blocked.a) {
                  opt += eq.blocked.a.map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              }
              if ('x' in eq.blocked) {
                opt += ':-x:'
                if (eq.blocked.x) {
                  opt += eq.blocked.x.map(function(name) {
                    return name.replace(/[^a-zA-Z0-9]/g, '')
                  }).join('-')
                }
              }
            }
            if ('r' in eq) {
              opt += ':r:'
              opt += eq.r.map(function(name) {
                if (name) {
                  return name.replace(/[^a-zA-Z0-9]/g, '')
                }
                return ''
              }).join('-')
            }
            if ('l' in eq) {
              opt += ':l:'
              opt += eq.l.map(function(name) {
                if (name) {
                  return name.replace(/[^a-zA-Z0-9]/g, '')
                }
                return ''
              }).join('-')
            }
            if ('h' in eq) {
              opt += ':h:'
              opt += eq.h.map(function(name) {
                if (name) {
                  return name.replace(/[^a-zA-Z0-9]/g, '')
                }
                return ''
              }).join('-')
            }
            if ('b' in eq) {
              opt += ':b:'
              opt += eq.b.map(function(name) {
                if (name) {
                  return name.replace(/[^a-zA-Z0-9]/g, '')
                }
                return ''
              }).join('-')
            }
            if ('c' in eq) {
              opt += ':c:'
              opt += eq.c.map(function(name) {
                if (name) {
                  return name.replace(/[^a-zA-Z0-9]/g, '')
                }
                return ''
              }).join('-')
            }
            if ('o' in eq) {
              opt += ':o:'
              opt += eq.o.map(function(name) {
                if (name) {
                  return name.replace(/[^a-zA-Z0-9]/g, '')
                }
                return ''
              }).join('-')
            }
            if ('a' in eq) {
              opt += ':a:'
              opt += eq.a.map(function(name) {
                if (name) {
                  return name.replace(/[^a-zA-Z0-9]/g, '')
                }
                return ''
              }).join('-')
            }
            if ('x' in eq) {
              opt += ':x:'
              opt += eq.x.map(function(name) {
                if (name) {
                  return name.replace(/[^a-zA-Z0-9]/g, '')
                }
                return ''
              }).join('-')
            }
          }
          randomize.push(opt)
        }
        delete options.startingEquipment
      } else if ('itemLocations' in options) {
        if (options.itemLocations) {
          let opt = 'i'
          if (typeof(options.itemLocations) === 'object') {
            if (options.itemLocations.blocked) {
              const zoneNames = Object.getOwnPropertyNames(constants.ZONE)
              const zones = ['*'].concat(zoneNames)
              zones.forEach(function(zone) {
                if (zone in options.itemLocations.blocked) {
                  const items = options.itemLocations.blocked[zone]
                  Object.getOwnPropertyNames(items).forEach(
                    function(itemName) {
                      const map = items[itemName]
                      if (itemName !== '*') {
                        itemName = itemName.replace(/[^a-zA-Z0-9]/g, '')
                      }
                      const indexes = Object.getOwnPropertyNames(map)
                      indexes.forEach(function(index) {
                        index = parseInt(index)
                        const replaceNames = map[index]
                        opt += ':-' + zone
                          + ':' + itemName
                          + (index > 0 ? '-' + (index + 1) : '')
                          + ':' + replaceNames.map(function(name) {
                            return name.replace(/[^a-zA-Z0-9]/g, '')
                          }).join('-')
                      })
                    }
                  )
                }
              })
            }
            const zoneNames = Object.getOwnPropertyNames(constants.ZONE)
            const zones = ['*'].concat(zoneNames)
            zones.forEach(function(zone) {
              if (zone in options.itemLocations) {
                const items = options.itemLocations[zone]
                Object.getOwnPropertyNames(items).forEach(function(itemName) {
                  const map = items[itemName]
                  if (itemName !== '*') {
                    itemName = itemName.replace(/[^a-zA-Z0-9]/g, '')
                  }
                  const indexes = Object.getOwnPropertyNames(map)
                  indexes.forEach(function(index) {
                    index = parseInt(index)
                    const replaceNames = map[index]
                    opt += ':' + zone
                      + ':' + itemName
                      + (index > 0 ? '-' + (index + 1) : '')
                      + ':' + replaceNames.map(function(name) {
                        return name.replace(/[^a-zA-Z0-9]/g, '')
                      }).join('-')
                  })
                })
              }
            })
          }
          randomize.push(opt)
        }
        delete options.itemLocations
      } else if ('prologueRewards' in options) {
        if (options.prologueRewards) {
          let opt = 'b'
          if (typeof(options.prologueRewards) === 'object') {
            const rewards = ['h', 'n', 'p']
            if (options.prologueRewards.blocked) {
              rewards.forEach(function(reward) {
                if (reward in options.prologueRewards.blocked) {
                  opt += ':-' + reward
                  options.prologueRewards.blocked[reward].forEach(
                    function(itemName) {
                      opt += ':'
                      if (itemName) {
                        opt += itemName.replace(/[^a-zA-Z0-9]/g, '')
                      }
                    }
                  )
                }
              })
            }
            rewards.forEach(function(reward) {
              if (reward in options.prologueRewards) {
                opt += ':' + reward
                options.prologueRewards[reward].forEach(function(itemName) {
                  opt += ':'
                  if (itemName) {
                    opt += itemName.replace(/[^a-zA-Z0-9]/g, '')
                  }
                })
              }
            })
          }
          randomize.push(opt)
        }
        delete options.prologueRewards
      } else if ('relicLocations' in options) {
        if (options.relicLocations) {
          let opt = 'r'
          if (typeof(options.relicLocations) === 'object') {
            const locks = []
            const keys = Object.getOwnPropertyNames(options.relicLocations)
            for (let i = 0; i < keys.length; i++) {
              if (/^[0-9]+(-[0-9]+)?$/.test(keys[i])) {
                let lock = keys[i]
                lock += ':' + options.relicLocations[keys[i]].join('-')
                locks.push(lock)
                break
              }
            }
            if (options.relicLocations.extension) {
              locks.push('x:' + options.relicLocations.extension)
            }
            if ('leakPrevention' in options.relicLocations
                && !options.relicLocations.leakPrevention) {
              locks.push('~r')
            }
            if (options.relicLocations.thrustSwordAbility) {
              locks.push(constants.RELIC.THRUST_SWORD)
            }
            const locations = relics.concat(extension)
            const self = this
            locations.filter(function(location) {
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
                break
              default:
                return !('extension' in location)
              }
              return !('extension' in location)
                || extensions.indexOf(location.extension) !== -1
            }).map(function(location) {
              if (typeof(location.ability) === 'string') {
                return location.ability
              }
              return location.name
            }).forEach(function(location) {
              if (options.relicLocations[location]) {
                let lock = location.replace(/[^a-zA-Z0-9]/g, '')
                lock += ':' + options.relicLocations[location].filter(
                  function(lock) {
                    return lock[0] !== '+'
                  }
                ).join('-')
                const escapes = options.relicLocations[location].filter(
                  function(lock) {
                    return lock[0] === '+'
                  }
                ).map(function(lock) {
                  return lock.slice(1)
                })
                if (escapes.length) {
                  lock += '+' + escapes.join('-')
                }
                locks.push(lock)
              }
            })
            if (options.relicLocations.placed) {
              const placed = options.relicLocations.placed
              Object.getOwnPropertyNames(placed).forEach(function(location) {
                const relics = placed[location].map(function(relic) {
                  if (relic === null) {
                    return '0'
                  }
                  return relic
                })
                locks.push('@' + location + ':' + relics.join(''))
              })
            }
            if (options.relicLocations.replaced) {
              const replaced = options.relicLocations.replaced
              Object.getOwnPropertyNames(replaced).forEach(function(relic) {
                locks.push('=' + relic + ':' + replaced[relic])
              })
            }
            if (options.relicLocations.blocked) {
              const blocked = options.relicLocations.blocked
              Object.getOwnPropertyNames(blocked).forEach(function(location) {
                const relics = blocked[location].map(function(relic) {
                  if (relic === null) {
                    return '0'
                  }
                  return relic
                })
                locks.push('-' + location + ':' + relics.join(''))
              })
            }
            if (locks.length) {
              opt += ':' + locks.join(':')
            }
          }
          randomize.push(opt)
        }
        delete options.relicLocations
      } else if ('stats' in options) {
        if (options.stats) {
          randomize.push('s')
        }
        delete options.stats
      } else if ('music' in options) {
        if (options.music) {
          randomize.push('m')
        }
        delete options.music
      } else if ('turkeyMode' in options) {
        if (options.turkeyMode) {
          randomize.push('k')
        }
        delete options.turkeyMode
      } else if ('writes' in options) {
        if (options.writes) {
          let opt = 'w'
          options.writes.forEach(function(write) {
            opt += ':' + numToHex(write.address) + ':'
            let valueCheck
            valueCheck = String(write.value)
            switch (write.type) {
            case 'char':
              if (write.value === 'random') {
                opt += 'rc'
              } else if (write.value === 'random1') {
                opt += 'r1'
              } else if (write.value === 'random3') {
                opt += 'r3'
              } else if (write.value === 'random10') {
                opt += 'r10'
              } else if (write.value === 'random99') {
                opt += 'r99'
              } else if (valueCheck.includes('randomHexChar')) {
                opt += 'rhc'
              } else {
                opt += numToHex(write.value, 2)
              }
              break
            case 'short':
              if (write.value === 'random') {
                opt += 'rs'
              } else if (write.value === 'randomRelic') {
                opt += 'rr'
              } else {
                opt += numToHex(write.value, 4)
              }
              break
            case 'word':
              if (write.value === 'random') {
                opt += 'rw'
              } else {
                opt += numToHex(write.value, 8)
              }
              break
            case 'long':
              if (write.value === 'random') {
                opt += 'rl'
              } else {
                opt += numToHex(write.value, 16)
              }
              break
            case 'string':
              opt += bufToHex(write.value)
              break
            }
          })
          randomize.push(opt)
        }
        delete options.writes
      } else {
        const unknown = Object.getOwnPropertyNames(options).pop()
        throw new Error('Unknown options: ' + unknown)
      }
    }
    if (!randomize.length) {
      throw new Error('No randomizations')
    }
    randomize = randomize.reduce(function(str, opt, index) {
      if (opt.length > 1 && index < randomize.length - 1) {
        opt += ','
      }
      return str + opt
    }, '')
    // Handle the edge case where the options are the same as a preset.
    if (!disableRecurse) {
      const preset = presets().filter(function(preset) {
        if (preset instanceof Preset) {
          const options = preset.options()
          if (preset === safe) {
            options.relicLocations = true
          }
          return optionsToString(options, true) === randomize
        }
      }).pop()
      if (preset) {
        randomize = 'p:' + preset.id
      }
    }
    return randomize
  }

  function optionsToUrl(version, options, checksum, seed, baseUrl) {
    options = optionsToString(options)
    const args = []
    const releaseBaseUrl = constants.optionsUrls[constants.defaultOptions]
    if (version.match(/-/)) {
      baseUrl = constants.devBaseUrl
      if (options !== constants.defaultOptions) {
        args.push(options)
      }
    } else if (!baseUrl || baseUrl === releaseBaseUrl) {
      if (options in constants.optionsUrls) {
        baseUrl = constants.optionsUrls[options]
      } else {
        baseUrl = releaseBaseUrl
        args.push(options)
      }
    } else {
      args.push(options)
    }
    if (typeof(checksum) === 'number') {
      args.push(checksum.toString(16))
    } else if (checksum !== undefined) {
      args.push(checksum)
    }
    if (seed !== undefined) {
      args.push(encodeURIComponent(seed))
    }
    let url = baseUrl
    if (args.reduce(function(prev, next) {
      if (next !== '') {
        return true
      }
      return prev
    }, false)) {
      url += '?' + args.join(',')
    }
    return url
  }

  function optionsFromUrl(url) {
    url = new URL(url)
    const args = url.search.slice(1).split(',')
    const baseUrl = url.origin + url.pathname
    const presets = Object.getOwnPropertyNames(constants.optionsUrls)
    if (args.length < 4) {
      for (let i = 0; i < presets.length; i++) {
        if (constants.optionsUrls[presets[i]] === baseUrl) {
          if (args.length === 1) {
            args.unshift(undefined)
          }
          args.unshift(presets[i])
          break
        }
      }
    }
    let options
    let checksum
    let seed
    if (args.length > 2) {
      options = optionsFromString(args.slice(0, args.length - 2).join(','))
    } else {
      options = optionsFromString(constants.defaultOptions)
    }
    seed = decodeURIComponent(args.pop())
    checksum = parseInt(args.pop(), 16)
    return {
      options: options,
      checksum: checksum,
      seed: seed,
    }
  }

  function toGameString(text) {
    const string = []
    for (let i = 0; i < text.length; i++) {
      if (text[i] in constants.characterMap) {
        const bytes = constants.characterMap[text[i]]
        string.push(bytes[0], bytes[1])
      } else if (text[i].match(/[a-zA-Z ]/)) {
        string.push(text.charCodeAt(i))
      } 
    }
    return string
  }

  function writeMenuText(data, text, range) {
    const string = toGameString(text)
    let length = Math.min(string.length, range.length)
    if (string[length - 1] & 0x80) {
      length--
    }
    data.writeString(range.start, string.slice(0, length).concat([0x00]))
  }

  function setSeedText(data, seed, version, preset, tournament) {
    const seedRange = {
      start: 0x04389c6c,
      length: 30,
    }
    const presetRange = {
      start: 0x04389c8c,
      length: 30,
    }
    data.writeShort(0x043930c4, 0x78b4)
    data.writeShort(0x043930d4, 0x78d4)
    data.writeShort(0x0439312c, 0x78b4)
    data.writeShort(0x0439313c, 0x78d4)
    data.writeShort(0x04393484, 0x78b4)
    data.writeShort(0x04393494, 0x78d4)
    writeMenuText(data, seed, seedRange)
    writeMenuText(
      data,
      version + ' ' + (preset || '') + (tournament ? ' tournament' : ''),
      presetRange
    )
  }

  function saltSeed(version, options, seed, nonce) {
    nonce = nonce || 0
    return JSON.stringify({
      version: version,
      tournamentMode: "tournamentMode" in options,
      seed: seed,
      nonce: nonce,
    })
  }

  function restoreFile(data, file) {
    const dataLength = file.len + Math.floor(file.len / 0x800) * 0x130
    data = data.slice(file.pos, file.pos + dataLength)
    file = Buffer.alloc(file.len)
    let curr = file
    while (data.length) {
      curr.set(data.slice(0, 0x800))
      curr = curr.slice(0x800)
      data = data.slice(0x800 + 0x130)
    }
    return file
  }

  function formatObject(obj, indent, hex) {
    indent = indent || 0
    if (Array.isArray(obj)) {
      let padFirst
      let padLast
      if (obj.length > 0) {
        padFirst = typeof(obj[0]) !== 'object'
        padLast = typeof(obj[obj.length - 1]) !== 'object'
      }
      return '[' + (padFirst ? ' ' : '') + obj.map(function(el) {
        return formatObject(el, indent, hex)
      }).join(', ') + (padLast ? ' ' : '') + ']'
    }
    switch (typeof(obj)) {
    case 'string':
      return '\'' + entry[1].replace(/'/g, '\\\'') + '\''
    case 'number':
      if (hex) {
        return numToHex(obj)
      }
      return obj.toString(10)
    case 'object':
      const outer = Array(indent).fill(' ').join('')
      const inner = Array(indent + 2).fill(' ').join('')
      const lines = []
      for (entry of Object.entries(obj)) {
        let name = inner + entry[0] + ': '
        let value
        switch (entry[0]) {
        case 'ability':
          const names = Object.getOwnPropertyNames(constants.RELIC)
          value = 'RELIC.' + names.filter(function(name) {
            return constants.RELIC[name] === entry[1]
          })[0]
          break
        case 'enemy':
          if (entry[1] === constants.GLOBAL_DROP) {
            value = 'GLOBAL_DROP'
          } else {
            value = entry[1]
          }
          break
        case 'type':
          value = 'TYPE.' + constants.typeNames[entry[1]]
          break
        case 'zones':
          value = '[ ' + entry[1].map(function(zoneId) {
            return 'ZONE.' + constants.zoneNames[zoneId]
          }).join(', ') + ' ]'
          break
        case 'candle':
        case 'sprite':
        case 'special':
        case 'extra':
        case 'flags':
          value = numToHex(entry[1], 2)
          break
        case 'offset':
        case 'icon':
        case 'palette':
        case 'spell':
        case 'drawFlags':
          value = numToHex(entry[1], 4)
          break
        case 'elements':
          value = '0x' + bufToHex(entry[1])
          break
        case 'nameAddress':
        case 'descriptionAddress':
        case 'tiles':
        case 'defs':
          value = numToHex(entry[1], 8)
          break
        case 'hasSpell':
          value = entry[1].toString()
          break
        case 'handType':
          value = 'HAND_TYPE.' + constants.handTypeNames[entry[1]]
          break
        default:
          let hex
          const hexTypes = [
            'addresses',
            'blacklist',
            'entities',
            'dropAddresses',
          ]
          if (hexTypes.indexOf(entry[0]) !== -1) {
            hex = true
          }
          value = formatObject(entry[1], indent + 2, hex)
          break
        }
        lines.push(name + value + ',')
      }
      return '{\n' + lines.join('\n') + '\n' + outer + '}'
    }
    return obj.toString()
  }

  function formatInfo(info, verbosity) {
    if (!info) {
      return ''
    }
    const props = []
    for (let level = 0; level <= verbosity; level++) {
      Object.getOwnPropertyNames(info[level]).forEach(function(prop) {
        if (props.indexOf(prop) === -1) {
          props.push(prop)
        }
      })
    }
    const lines = []
    props.forEach(function(prop) {
      for (let level = 0; level <= verbosity; level++) {
        if (info[level][prop]) {
          let text = prop + ':'
          if (Array.isArray(info[level][prop])) {
            text += '\n' + info[level][prop].map(function(item) {
              return '  ' + item
            }).join('\n')
          } else {
            text += ' ' + info[level][prop]
          }
          lines.push(text)
        }
      }
    })
    return lines.join('\n')
  }

  function newInfo() {
    const MAX_VERBOSITY = 5
    return Array(MAX_VERBOSITY + 1).fill(null).map(function() {
      return {}
    })
  }

  function mergeInfo(info, newInfo) {
    if (newInfo) {
      info.forEach(function(level, index) {
        merge.call(level, newInfo[index])
      })
    }
  }

  function sanitizeResult(result) {
    if (result.mapping) {
      Object.getOwnPropertyNames(result.mapping).forEach(function(location) {
        const relic = result.mapping[location]
        result.mapping[location] = Object.assign({}, relic, {
          replaceWithItem: undefined,
          replaceWithRelic: undefined,
        })
      })
    }
    if (result.relics) {
      result.relics = result.relics.map(function(relic) {
        return Object.assign({}, relic, {
          replaceWithItem: undefined,
          replaceWithRelic: undefined,
        })
      })
    }
    if (result.locations) {
      result.locations = result.locations.map(function(location) {
        return Object.assign({}, location, {
          replaceWithItem: undefined,
          replaceWithRelic: undefined,
        })
      })
    }
  }

  function shuffled(rng, array) {
    const copy = array.slice()
    const shuffled = []
    while (copy.length) {
      const rand = Math.floor(rng() * copy.length)
      shuffled.push(copy.splice(rand, 1)[0])
    }
    return shuffled
  }

  function isRelic(entity) {
    return entity.data.readUInt16LE(4) === 0x000b
  }

  function isItem(entity) {
    return entity.data.readUInt16LE(4) === 0x000c
  }

  function isCandle(zone, entity) {
    const states = []
    switch (zone.id) {
    case constants.ZONE.ST0:
      states.push(0x20, 0x30, 0x80, 0x90)
      break
    case constants.ZONE.ARE:
      states.push(0x10)
      break
    case constants.ZONE.CAT:
      states.push(0x00, 0x10, 0x20)
      break
    case constants.ZONE.CHI:
      states.push(0x00, 0x10)
      break
    case constants.ZONE.DAI:
      states.push(0x00, 0x10)
      break
    case constants.ZONE.LIB:
      states.push(0x00)
      break
    case constants.ZONE.NO0:
      states.push(0x00, 0x10, 0x20, 0x80)
      break
    case constants.ZONE.NO1:
      states.push(0x50, 0x60)
      break
    case constants.ZONE.NO2:
      states.push(0x00, 0x10, 0x20, 0x30, 0x40, 0x60)
      break
    case constants.ZONE.NO3:
    case constants.ZONE.NP3:
      states.push(0x00)
      break
    case constants.ZONE.NO4:
      states.push(0x00, 0x50, 0x60)
      break
    case constants.ZONE.NZ0:
      states.push(0x00, 0x10, 0x20)
      break
    case constants.ZONE.NZ1:
      states.push(0x00, 0x10, 0x40, 0x50, 0x60)
      break
    case constants.ZONE.TOP:
      states.push(0x20, 0x30, 0x60)
      break
    case constants.ZONE.RARE:
      states.push(0x10)
      break
    case constants.ZONE.RCAT:
      states.push(0x00, 0x10, 0x20)
      break
    case constants.ZONE.RCHI:
      states.push(0x00, 0x10)
      break
    case constants.ZONE.RDAI:
      states.push(0x00, 0x10)
      break
    case constants.ZONE.RLIB:
      states.push(0x00)
      break
    case constants.ZONE.RNO0:
      states.push(0x00, 0x10, 0x20, 0x80)
      break
    case constants.ZONE.RNO1:
      states.push(0x50, 0x60)
      break
    case constants.ZONE.RNO2:
      states.push(0x00, 0x10, 0x20, 0x30, 0x40, 0x60)
      break
    case constants.ZONE.RNO3:
      states.push(0x00)
      break
    case constants.ZONE.RNO4:
      states.push(0x00, 0x50, 0x60)
      break
    case constants.ZONE.RNZ0:
      states.push(0x00, 0x10, 0x20)
      break
    case constants.ZONE.RNZ1:
      states.push(0x10, 0x40, 0x50, 0x60)
      break
    case constants.ZONE.RTOP:
      states.push(0x20, 0x30, 0x60)
      break
    }
    const id = entity.data.readUInt16LE(4)
    return id === 0xa001 && states.indexOf(entity.data[9] & 0xf0) !== -1
  }

  function isContainer(zone, entity) {
    const id = entity.data.readUInt16LE(4)
    const ids = []
    switch (zone.id) {
    case constants.ZONE.CAT:
      if (id == 0x002c) {
        return entity.data[8] > 0
      }
      ids.push({
        id: 0x0025,
      })
      ids.push({
        id: 0xa001,
        states: [ 0x70 ],
      })
      break
    case constants.ZONE.CHI:
      ids.push({
        id: 0x0018,
      })
      break
    case constants.ZONE.RCHI:
      ids.push({
        id: 0x0020,
      })
      break
    case constants.ZONE.DAI:
    case constants.ZONE.RDAI:
    case constants.ZONE.RNO4:
      ids.push({
        id: 0xa001,
        states: [ 0x70, 0x80 ],
      })
      break
    case constants.ZONE.RLIB:
      ids.push({
        id: 0x0029,
      })
      ids.push({
        id: 0xa001,
        states: [ 0x70, 0x90 ],
      })
      break
    case constants.ZONE.LIB:
      if (id == 0x003d) {
        return entity.data[9] === 0
      }
      ids.push({
        id: 0xa001,
        states: [ 0x70, 0x90 ],
      })
      break
    case constants.ZONE.NO1:
      ids.push({
        id: 0xa001,
        states: [ 0x70, 0x80 ],
      })
      break
    case constants.ZONE.RNO1:
      ids.push({
        id: 0xa001,
        states: [ 0x70, 0x80 ],
      })
      break
    case constants.ZONE.NO2:
    case constants.ZONE.RNO2:
      ids.push({
        id: 0xa001,
        states: [ 0x70 ],
      })
      break
    case constants.ZONE.NO4:
    case constants.ZONE.BO3:
      ids.push({
        id: 0xa001,
        states: [ 0x70 ],
      })
      break
    case constants.ZONE.NZ0:
      ids.push({
        id: 0x0034,
      }, {
        id: 0x0035,
      }, {
        id: 0x0036,
      }, {
        id: 0x0037,
      })
      break
    case constants.ZONE.TOP:
    case constants.ZONE.RTOP:
      ids.push({
        id: 0xa001,
        states: [ 0x70, 0x80, 0x90 ],
      })
      ids.push({
        id: 0x001b,
      })
      break
    case constants.ZONE.RCAT:
      ids.push({
        id: 0xa001,
        states: [ 0x70 ],
      })
      ids.push({
        id: 0x002e,
      })
      break
    case constants.ZONE.RNO3:
      ids.push({
        id: 0x0045,
      })
      break
    case constants.ZONE.RNZ0:
      ids.push({
        id: 0x0027,
      })
      ids.push({
        id: 0x0028,
      })
      ids.push({
        id: 0x0029,
      })
      ids.push({
        id: 0x002a,
      })
      ids.push({
        id: 0x002b,
      })
      break
    }
    for (let i = 0; i < ids.length; i++) {
      if (ids[i].id === id) {
        if ('states' in ids[i]
            && ids[i].states.indexOf(entity.data[9]) === -1) {
          return false
        }
        return true
      }
    }
  }

  function containedItem(data, zone, entity) {
    let index
    const entId = entity.data.readUInt16LE(4)
    const state = entity.data.readUInt16LE(8)
    switch (zone.id) {
    case constants.ZONE.RCHI:
    case constants.ZONE.CHI: {
      index = state + 3
      break
    }
    case constants.ZONE.NZ0: {
      switch (entId) {
      case 0x0034:
        switch (state) {
        case 0x0003:
          index = 6
          break
        case 0x0004:
          index = 10
          break
        default:
          index = state
          break
        }
        break
      case 0x0035:
        index = state + 3
        break
      case 0x0036:
        index = state + 7
        break
      case 0x0037:
        switch (state) {
        case 0x002:
          return {
            index: state,
            item: relicFromName('Bat Card')
          }
        case 0x0003:
          return {
            index: state,
            item: relicFromName('Skill of Wolf')
          }
        }
      }
      break
    }
    case constants.ZONE.TOP:
      if (entId === 0x001b) {
        index = 2 - state
        break
      }
    case constants.ZONE.LIB:
      if (entId === 0x003d) {
        index = state + 1
        break
      }
    case constants.ZONE.RLIB:
      if (entId === 0x0029) {
        index = state + 6
        break
      }
    case constants.ZONE.CAT: {
      if (entId === 0x0025) {
        index = 4 * state 
        break
      }
    }
    case constants.ZONE.RCAT: {
      if (entId === 0x002e) {
        index = 7 * state + 1
        break
      }
    }
    case constants.ZONE.NO1:
      if ((state >> 8) === 0x80) {
        index = 3 + (state & 0xff)
        break
      }
    case constants.ZONE.DAI:
    case constants.ZONE.LIB:
    case constants.ZONE.NO2:
    case constants.ZONE.NO4:
    case constants.ZONE.BO3:
    case constants.ZONE.RDAI:
    case constants.ZONE.RNO1:
    case constants.ZONE.RNO2:
    case constants.ZONE.RNO4:
    case constants.ZONE.RTOP:
      index = entity.data[8]
      break
    default:
      index = entity.data.readUInt16LE(8)
      break
    }
    const id = data.readUInt16LE(zone.items + 0x2 * index)
    const item = itemFromTileId(items, id)
    return {
      index: index,
      item: item,
    }
  }

  function relicFromAbility(ability) {
    return relics.filter(function(relic) {
      return relic.ability === ability
    }).pop()
  }

  function relicFromName(name) {
    return relics.filter(function(relic) {
      return relic.name === name
    }).pop()
  }

  function enemyFromIdString(idString) {
    const enemiesDrops = enemies.enemiesDrops
    const dashIndex = idString.lastIndexOf('-')
    let enemyName = idString.toLowerCase()
    let level
    if (dashIndex !== -1) {
      level = parseInt(enemyName.slice(dashIndex + 1))
      enemyName = idString.slice(0, dashIndex).toLowerCase()
    }
    return enemiesDrops.filter(function(enemy) {
      const name = enemy.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
      if (name === enemyName) {
        if (typeof(level) !== 'undefined') {
          return enemy.level === level
        }
        return true
      }
    }).pop()
  }

  function Preset(
    id,
    name,
    description,
    author,
    knowledgeCheck,
    metaExtension,
    metaComplexity,
    itemStats,
    timeFrame,
    moddedLevel,
    castleType,
    transformEarly,
    transformFocus,
    winCondition,
    weight,
    hidden,
    override,
    enemyDrops,
    startingEquipment,
    itemLocations,
    prologueRewards,
    relicLocations,
    stats,
    music,
    turkeyMode,
    colorrandoMode,
    magicmaxMode,
    antiFreezeMode,
    mypurseMode,
    iwsMode,
    fastwarpMode,
    itemNameRandoMode,
    noprologueMode,
    unlockedMode,
    surpriseMode,
    enemyStatRandoMode,
    shopPriceRandoMode,
    startRoomRandoMode,
    startRoomRando2ndMode,
    dominoMode,
    rlbcMode,
    immunityPotionMode,
    godspeedMode,
    libraryShortcut,
    elemChaosMode,
    simpleInputMode,
    devStashMode,
    seasonalPhrasesMode,
    bossMusicSeparation,
    newGoalsSet,
    debugMode,
    writes,
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.author = author
    this.weight = weight
    this.knowledgeCheck = knowledgeCheck
    this.metaExtension = metaExtension
    this.metaComplexity = metaComplexity
    this.itemStats = itemStats
    this.timeFrame = timeFrame
    this.moddedLevel = moddedLevel
    this.castleType = castleType
    this.transformEarly = transformEarly
    this.transformFocus = transformFocus
    this.winCondition = winCondition
    this.hidden = hidden
    this.override = override
    this.enemyDrops = enemyDrops
    this.startingEquipment = startingEquipment
    this.itemLocations = itemLocations
    this.prologueRewards = prologueRewards
    this.relicLocations = relicLocations
    this.stats = stats
    this.music = music
    this.turkeyMode = turkeyMode
    this.colorrandoMode = colorrandoMode
    this.magicmaxMode = magicmaxMode
    this.antiFreezeMode = antiFreezeMode
    this.mypurseMode = mypurseMode
    this.iwsMode = iwsMode
    this.fastwarpMode = fastwarpMode
    this.itemNameRandoMode = itemNameRandoMode
    this.noprologueMode = noprologueMode
    this.unlockedMode = unlockedMode
    this.surpriseMode = surpriseMode
    this.enemyStatRandoMode = enemyStatRandoMode
    this.shopPriceRandoMode = shopPriceRandoMode
    this.startRoomRandoMode = startRoomRandoMode
    this.startRoomRando2ndMode = startRoomRando2ndMode
    this.dominoMode = dominoMode
    this.rlbcMode = rlbcMode
    this.immunityPotionMode = immunityPotionMode
    this.godspeedMode = godspeedMode
    this.libraryShortcut = libraryShortcut
    this.elemChaosMode = elemChaosMode
    this.simpleInputMode = simpleInputMode
    this.devStashMode = devStashMode
    this.seasonalPhrasesMode = seasonalPhrasesMode
    this.bossMusicSeparation = bossMusicSeparation
    this.newGoalsSet = newGoalsSet
    this.debugMode = debugMode
    if (writes) {
      this.writes = writes
    }
  }

  function clone(obj) {
    if (obj === null) {
      return null
    }
    if (obj === undefined) {
      return null
    }
    if (Array.isArray(obj)) {
      return obj.slice().map(clone)
    } else if (typeof(obj) === 'object' && obj) {
      return Object.getOwnPropertyNames(obj).reduce(function(copy, prop) {
        copy[prop] = clone(obj[prop])
        return copy
      }, {})
    }
    return obj
  }

  function merge(obj, verbose) {
    const self = this
    Object.getOwnPropertyNames(obj).forEach(function(prop) {
      if (Array.isArray(obj[prop])) {
        self[prop] = clone(obj[prop])
      } else if (typeof(obj[prop]) === 'object') {
        if (Array.isArray(self[prop])) {
          self[prop] = clone(obj[prop])
        } else if (typeof(self[prop]) === 'object') {
          merge.call(self[prop], obj[prop])
        } else {
          self[prop] = clone(obj[prop])
        }
      } else {
        self[prop] = clone(obj[prop])
      }
    })
  }

  Preset.options = function options(options) {
    options = clone(options)
    if (options.preset) {
      let preset = presets().filter(function(preset) {
        return preset.id === options.preset
      }).pop()
      if (!preset && !self) {
        try {
          preset = require('../build/presets/' + options.preset)
        } catch (err) {
          if (err.code !== 'MODULE_NOT_FOUND') {
            console.error(err.stack)
            throw new Error('Error loading preset: ' + options.preset)
          }
        }
      }
      if (!preset) {
        throw new Error('Unknown preset: ' + options.preset)
      }
      delete options.preset
      const presetOptions = preset.options()
      merge.call(presetOptions, options)
      return presetOptions
    }
    return options
  }

  Preset.prototype.toString = function toString() {
    return optionsToString.bind(this, this.options())()
  }

  Preset.prototype.options = function options() {
    const options = Object.assign({}, this)
    delete options.id
    delete options.name
    delete options.description
    delete options.author
    delete options.weight
    delete options.knowledgeCheck
    delete options.metaExtension
    delete options.metaComplexity
    delete options.itemStats
    delete options.timeFrame
    delete options.moddedLevel
    delete options.castleType
    delete options.transformEarly
    delete options.transformFocus
    delete options.winCondition
    delete options.hidden
    delete options.override
    return clone(options)
  }

  // Helper class to create relic location locks.
  function PresetBuilder(metadata) {
    this.metadata = metadata
    // Aliases.
    this.zoneAliases = {}
    this.enemyAliases = {}
    this.relicAliases = {}
    this.locationAliases = {}
    this.itemAliases = {}
    // The collection of enemy drops.
    this.drops = true
    // The collection of starting equipment.
    this.equipment = true
    // The collection of item locations.
    this.items = true
    // The collection of prologue rewards.
    this.rewards = true
    // The collection of location locks.
    this.locations = true
    // The collection of escape requirements.
    this.escapes = {}
    // The relic locations extension.
    this.extension = constants.EXTENSION.GUARDED
    // Leak prevention.
    this.leakPrevention = true
    // Thrust sword ability.
    this.thrustSword = false
    // The complexity goal.
    this.target = undefined
    this.goal = undefined
    // Item stats randomization.
    this.stats = true
    // Music randomization.
    this.music = true
    // Turkey mode.
    this.turkey = true
    // Color Palette Rando mode.
    this.colorrando = false
    // Magic Max mode.
    this.magicmax = false
    // AntiFreeze mode.
    this.antifreeze = false
    // That's My Purse mode.
    this.mypurse = false
    // Infinite Wing Smash mode.
    this.iws = false
    // Fast Warp mode.
    this.fastwarp = false
    // Item Name Rando mode.
    this.itemnamerando = false
    // No Prologue mode.
    this.noprologue = false
    // Unlocked mode.
    this.unlocked = false
    // Surprise mode.
    this.surprise = false
    // enemyStatRando mode.
    this.enemyStatRando = false
    // shopPriceRando mode.
    this.shopPriceRando = false
    // startRoomRando mode.
    this.startRoomRando = false
    // startRoomRando2nd mode.
    this.startRoomRando2nd = false
    // guaranteed drops mode.
    this.domino = false
    // reverse library cards mode.
    this.rlbc = false
    // immunity potions mode.
    this.immunityPotion = false
    // godspeed mode.
    this.godspeed = false
    // library shortcut.
    this.libShort = false
    // elemental chaos.
    this.elemChaos = false
    // simple input.
    this.simpleInput = false
    // dev's stash mode.
    this.devStash = false
    // seasonal phrases mode.
    this.seasonalPhrases = false
    // boss music separation
    this.bossMusic = true
    // new goals for completion.
    this.newGoals = undefined
    // Debug mode.
    this.debug = false
    // Arbitrary writes.
    this.writes = undefined
  }

  function getZoneAlias(alias) {
    if (alias in this.zoneAliases) {
      return this.zoneAliases[alias]
    }
    return alias
  }

  function getEnemyAlias(alias) {
    if (alias in this.enemyAliases) {
      return this.enemyAliases[alias]
    }
    return alias
  }

  function getRelicAlias(alias) {
    if (alias in this.relicAliases) {
      return this.relicAliases[alias]
    }
    return alias
  }

  function getLocationAlias(alias) {
    if (alias in this.locationAliases) {
      return this.locationAliases[alias]
    }
    return alias
  }

  function getItemAlias(alias) {
    if (alias in this.itemAliases) {
      return this.itemAliases[alias]
    }
    return alias
  }

  function locationFromName(name) {
    const relic = relicFromName(name)
    if (relic) {
      return relic.ability
    }
    return name
  }

  function locksFromArray(locks) {
    const self = this
    return locks.map(function(lock) {
      // console.log(lock)
      return lock.split(/\s*\+\s*/).map(function(name) {
        return relicFromName(getRelicAlias.call(self, name)).ability
      }).join('')
    })
  }

  PresetBuilder.fromJSON = function fromJSON(json) {
    const builder = new PresetBuilder(json.metadata)
    if ('alias' in json) {
      json.alias.forEach(function(alias) {
        if ('zone' in alias) {
          builder.zoneAlias(alias.zone, alias.alias)
        }
        if ('enemy' in alias) {
          builder.enemyAlias(alias.enemy, alias.alias)
        }
        if ('relic' in alias) {
          builder.relicAlias(alias.relic, alias.alias)
        }
        if ('location' in alias) {
          builder.locationAlias(alias.relic, alias.alias)
        }
        if ('item' in alias) {
          builder.itemAlias(alias.item, alias.alias)
        }
      })
    }
    if ('inherits' in json) {
      builder.inherits(json.inherits)
    }
    if ('itemLocations' in json) {
      if (typeof(json.itemLocations) === 'boolean') {
        builder.itemLocations(json.itemLocations)
      } else if (Array.isArray(json.itemLocations)) {
        json.itemLocations.forEach(function(itemLocation) {
          let zone = getZoneAlias.call(builder, itemLocation.zone)
          if (zone !== '*') {
            zone = constants.ZONE[zone]
          }
          const args = [zone, itemLocation.item]
          if ('index' in itemLocation) {
            args.push(itemLocation.index)
          }
          args.push(itemLocation.replacement)
          builder.itemLocations.apply(builder, args)
        })
      } else {
        throw new Error('unsupported itemLocations type')
      }
    }
    if ('blockItems' in json) {
      json.blockItems.forEach(function(itemLocation) {
        let zone = getZoneAlias.call(builder, itemLocation.zone)
        if (zone !== '*') {
          zone = constants.ZONE[zone]
        }
        const args = [zone, itemLocation.item]
        if ('index' in itemLocation) {
          args.push(itemLocation.index)
        }
        args.push(itemLocation.replacement)
        builder.blockItem.apply(builder, args)
      })
    }
    if ('enemyDrops' in json) {
      if (typeof(json.enemyDrops) === 'boolean') {
        builder.enemyDrops(json.enemyDrops)
      } else if (Array.isArray(json.enemyDrops)) {
        json.enemyDrops.forEach(function(enemyDrop) {
          const args = [enemyDrop.enemy]
          if ('level' in enemyDrop) {
            args.push(enemyDrop.level)
          }
          Array.prototype.push.apply(args, enemyDrop.items)
          builder.enemyDrops.apply(builder, args)
        })
      } else {
        throw new Error('unsupported enemyDrops type')
      }
    }
    if ('blockDrops' in json) {
      json.blockDrops.forEach(function(enemyDrop) {
        const args = [enemyDrop.enemy]
        if ('level' in enemyDrop) {
          args.push(enemyDrop.level)
        }
        args.push(enemyDrop.items)
        builder.blockDrops.apply(builder, args)
      })
    }
    if ('prologueRewards' in json) {
      if (typeof(json.prologueRewards) === 'boolean') {
        builder.prologueRewards(json.prologueRewards)
      } else if (Array.isArray(json.prologueRewards)) {
        json.prologueRewards.forEach(function(prologueReward) {
          builder.prologueRewards(
            prologueReward.item,
            prologueReward.replacement,
          )
        })
      } else {
        throw new Error('unsupported prologueRewards type')
      }
    }
    if ('blockRewards' in json) {
      json.blockRewards.forEach(function(blockedReward) {
        builder.blockReward(
          blockedReward.item,
          blockedReward.replacement,
        )
      })
    }
    if ('startingEquipment' in json) {
      if (typeof(json.startingEquipment) === 'boolean') {
        builder.startingEquipment(json.startingEquipment)
      } else if (Array.isArray(json.startingEquipment)) {
        json.startingEquipment.forEach(function(startingEquipment) {
          const key = startingEquipment.slot.toUpperCase().replace(' ', '_')
          builder.startingEquipment(
            constants.SLOT[key],
            startingEquipment.item,
          )
        })
      } else {
        throw new Error('unsupported startingEquipment type')
      }
    }
    if ('blockEquipment' in json) {
      json.blockEquipment.forEach(function(blockedEquipment) {
        const key = blockedEquipment.slot.toUpperCase().replace(' ', '_')
        builder.blockEquipment(
          constants.SLOT[key],
          blockedEquipment.item,
        )
      })
    }
    if ('relicLocations' in json) {
      builder.relicLocations(json.relicLocations)
    }
    if ('preventLeaks' in json) {
      builder.preventLeaks(json.preventLeaks)
    }
    if ('thrustSwordAbility' in json) {
      builder.thrustSwordAbility(json.thrustSwordAbility)
    }
    if ('relicLocationsExtension' in json) {
      builder.relicLocationsExtension(json.relicLocationsExtension)
    }
    if ('lockLocation' in json) {
      json.lockLocation.forEach(function(lockLocation) {
        const locationName = getLocationAlias.call(
          builder,
          lockLocation.location,
        )
        const location = locationFromName(locationName)
        if ('locks' in lockLocation) {
          const locks = locksFromArray.call(builder, lockLocation.locks)
          builder.lockLocation(location, locks)
        }
        if ('block' in lockLocation) {
          let relic
          if (Array.isArray(lockLocation.block)) {
            relic = lockLocation.block.map(function(relic) {
              return relicFromName(getRelicAlias.call(builder, relic)).ability
            })
          } else {
            relic = getRelicAlias.call(builder, lockLocation.block)
            relic = relicFromName(relic).ability
          }
          builder.blockRelic(location, relic)
        }
        if ('escapeRequires' in lockLocation) {
          const escapes = locksFromArray.call(
            builder,
            lockLocation.escapeRequires,
          )
          builder.escapeRequires(location, escapes)
        }
      })
    }
    if ('placeRelic' in json) {
      json.placeRelic.forEach(function(placeRelic) {
        let relic = null
        if (Array.isArray(placeRelic.relic)) {
          relic = placeRelic.relic.map(function(relic) {
            if (relic) {
              return relicFromName(getRelicAlias.call(builder, relic)).ability
            }
            return null
          })
        } else if (placeRelic.relic) {
          relic = getRelicAlias.call(builder, placeRelic.relic)
          relic = relicFromName(relic).ability
        }
        const location = getLocationAlias.call(builder, placeRelic.location)
        builder.placeRelic(locationFromName(location), relic)
      })
    }
    if ('replaceRelic' in json) {
      json.replaceRelic.forEach(function(replaceRelic) {
        const relic = getRelicAlias.call(builder, replaceRelic.relic)
        builder.replaceRelic(
          relicFromName(relic).ability,
          replaceRelic.item,
        )
      })
    }
    if ('complexityGoal' in json) {
      if (json.complexityGoal) {
        const args = [json.complexityGoal.min]
        if ('max' in json.complexityGoal) {
          args.push(json.complexityGoal.max)
        }
        args.push(locksFromArray.call(builder, json.complexityGoal.goals))
        builder.complexityGoal.apply(builder, args)
      } else {
        builder.complexityGoal(false)
      }
    }
    if ('stats' in json) {
      builder.randomizeStats(json.stats)
    }
    if ('music' in json) {
      builder.randomizeMusic(json.music)
    }
    if ('turkeyMode' in json) {
      builder.turkeyMode(json.turkeyMode)
    }
    if ('colorrandoMode' in json) {
      builder.colorrandoMode(json.colorrandoMode)
    }
    if ('magicmaxMode' in json) {
      builder.magicmaxMode(json.magicmaxMode)
    }
    if ('antiFreezeMode' in json) {
      builder.antiFreezeMode(json.antiFreezeMode)
    }
    if ('mypurseMode' in json) {
      builder.mypurseMode(json.mypurseMode)
    }
    if ('iwsMode' in json) {
      builder.iwsMode(json.iwsMode)
    }
    if ('fastwarpMode' in json) {
      builder.fastwarpMode(json.fastwarpMode)
    }
    if ('itemNameRandoMode' in json) {
      builder.itemNameRandoMode(json.itemNameRandoMode)
    }
    if ('noprologueMode' in json) {
      builder.noprologueMode(json.noprologueMode)
    }
    if ('unlockedMode' in json) {
      builder.unlockedMode(json.unlockedMode)
    }
    if ('surpriseMode' in json) {
      builder.surpriseMode(json.surpriseMode)
    }
    if ('enemyStatRandoMode' in json) {
      builder.enemyStatRandoMode(json.enemyStatRandoMode)
    }
    if ('shopPriceRandoMode' in json) {
      builder.shopPriceRandoMode(json.shopPriceRandoMode)
    }
    if ('startRoomRandoMode' in json) {
      builder.startRoomRandoMode(json.startRoomRandoMode)
    }
    if ('startRoomRando2ndMode' in json) {
      builder.startRoomRando2ndMode(json.startRoomRando2ndMode)
    }
    if ('dominoMode' in json) {
      builder.dominoMode(json.dominoMode)
    }
    if ('rlbcMode' in json) {
      builder.rlbcMode(json.rlbcMode)
    }
    if ('immunityPotionMode' in json) {
      builder.immunityPotionMode(json.immunityPotionMode)
    }
    if ('godspeedMode' in json) {
      builder.godspeedMode(json.godspeedMode)
    }
    if ('libraryShortcut' in json) {
      builder.libraryShortcut(json.libraryShortcut)
    }
    if ('elemChaosMode' in json) {
      builder.elemChaosMode(json.elemChaosMode)
    }
    if ('simpleInputMode' in json) {
      builder.simpleInputMode(json.simpleInputMode)
    }
    if ('devStashMode' in json) {
      builder.devStashMode(json.devStashMode)
    }
    if ('seasonalPhrasesMode' in json) {
      builder.seasonalPhrasesMode(json.seasonalPhrasesMode)
    }
    if ('bossMusicSeparation' in json) {
      builder.bossMusicSeparation(json.bossMusicSeparation)
    }
    if ('newGoalsSet' in json) {
      builder.newGoalsSet(json.newGoalsSet)
    }
    if ('writes' in json) {
      let lastAddress = 0
      json.writes.forEach(function(write) {
        let address = lastAddress
        if ('address' in write) {
          address = parseInt(write.address)
        }
        if (!('enabled' in write) || write.enabled) {
          switch (write.type) {
          case 'char':
            lastAddress = builder.writeChar(address, write.value)
            break
          case 'short':
            lastAddress = builder.writeShort(address, write.value)
            break
          case 'word':
            lastAddress = builder.writeWord(address, write.value)
            break
          case 'long':
            lastAddress = builder.writeLong(address, write.value)
            break
          case 'string':
            lastAddress = builder.writeString(address, write.value)
            break
          }
        } else {
          lastAddress = address
        }
      })
    }
    return builder
  }

  PresetBuilder.prototype.zoneAlias = function zoneAlias(what, alias) {
    assert.equal(typeof(what), 'string')
    assert.equal(typeof(alias), 'string')
    this.zoneAliases[alias] = what
  }

  PresetBuilder.prototype.enemyAlias = function enemyAlias(what, alias) {
    assert.equal(typeof(what), 'string')
    assert.equal(typeof(alias), 'string')
    this.enemyAliases[alias] = what
  }

  PresetBuilder.prototype.relicAlias = function relicAlias(what, alias) {
    assert.equal(typeof(what), 'string')
    assert.equal(typeof(alias), 'string')
    this.relicAliases[alias] = what
  }

  PresetBuilder.prototype.locationAlias = function locationAlias(what, alias) {
    assert.equal(typeof(what), 'string')
    assert.equal(typeof(alias), 'string')
    this.locationAliases[alias] = what
  }

  PresetBuilder.prototype.itemAlias = function itemAlias(what, alias) {
    assert.equal(typeof(what) === 'string' || what instanceof Array)
    assert.equal(typeof(alias) === 'string')
    this.itemAliases[alias] = what
  }

  PresetBuilder.prototype.inherits = function inherits(id) {
    let preset
    if (self) {
      const presets = self.sotnRando.presets
      preset = presets.filter(function(preset) {
        return preset.id === id
      }).pop()
    } else {
      preset = require('../build/presets/' + id)
    }
    if ('enemyDrops' in preset) {
      if (typeof(preset.enemyDrops) === 'object') {
        const self = this
        self.drops = new Map()
        if ('blocked' in preset.enemyDrops) {
          self.drops.blocked = new Map()
          const ids = Object.getOwnPropertyNames(preset.enemyDrops.blocked)
          ids.forEach(function(id) {
            let enemy
            if (id === '*') {
              enemy = '*'
            } else if (id === constants.GLOBAL_DROP) {
              enemy = id
            } else {
              enemy = enemyFromIdString(id)
            }
            const dropNames = preset.enemyDrops.blocked[id]
            const drops = dropNames.map(function(name) {
              return items.filter(function(item) {
                return item.name === name
              }).pop()
            })
            self.drops.blocked.set(enemy, drops)
          })
        }
        const ids = Object.getOwnPropertyNames(preset.enemyDrops)
        ids.filter(function(id) {
          return id !== 'blocked'
        }).forEach(function(id) {
          let enemy
          if (id === '*') {
            enemy = '*'
          } else if (id === constants.GLOBAL_DROP) {
            enemy = id
          } else {
            enemy = enemyFromIdString(id)
          }
          const dropNames = preset.enemyDrops[id]
          const drops = dropNames.map(function(name) {
            return items.filter(function(item) {
              return item.name === name
            }).pop()
          })
          self.drops.set(enemy, drops)
        })
      } else {
        this.drops = preset.enemyDrops
      }
    }
    if ('startingEquipment' in preset) {
      if (typeof(preset.startingEquipment) === 'object') {
        const self = this
        self.equipment = {}
        if (preset.startingEquipment.blocked) {
          self.equipment.blocked = {}
          const slots = Object.getOwnPropertyNames(
            preset.startingEquipment.blocked
          )
          slots.forEach(function(slot) {
            self.equipment.blocked[slot] = items.filter(function(item) {
              return item.name === preset.startingEquipment.blocked[slot]
            }).pop()
          })
        }
        const slots = Object.getOwnPropertyNames(preset.startingEquipment)
        slots.filter(function(slot) {
          return slot !== 'blocked'
        }).forEach(function(slot) {
          self.equipment[slot] = preset.startingEquipment[slot].map(
            function(itemName) {
              return items.filter(function(item) {
                return item.name === itemName
              }).pop()
            }
          )
        })
      } else {
        this.equipment = preset.startingEquipment
      }
    }
    if ('prologueRewards' in preset) {
      if (typeof(preset.prologueRewards) === 'object') {
        const self = this
        self.rewards = {}
        if (preset.prologueRewards.blocked) {
          self.rewards.blocked = {}
          const rewards = Object.getOwnPropertyNames(
            preset.prologueRewards.blocked
          )
          rewards.forEach(function(reward) {
            self.rewards.blocked[reward] = items.filter(function(item) {
              return item.name === preset.prologueRewards.blocked[reward]
            }).pop()
          })
        }
        const rewards = Object.getOwnPropertyNames(preset.prologueRewards)
        rewards.filter(function(reward) {
          return reward !== 'blocked'
        }).forEach(function(reward) {
          self.rewards[reward] = items.filter(function(item) {
            return item.name === preset.prologueRewards[reward]
          }).pop()
        })
      } else {
        this.rewards = preset.prologueRewards
      }
    }
    if ('itemLocations' in preset) {
      if (typeof(preset.itemLocations) === 'object') {
        const self = this
        self.items = {}
        const zoneNames = Object.getOwnPropertyNames(preset.itemLocations)
        zoneNames.forEach(function(zoneName) {
          self.items[zoneName] = self.items[zoneName] || new Map()
          const zoneItems = preset.itemLocations[zoneName]
          const itemNames = Object.getOwnPropertyNames(zoneItems)
          itemNames.forEach(function(itemName) {
            let item
            if (itemName === '*') {
              item = '*'
            } else {
              item = items.filter(function(item) {
                return item.name === itemName
              }).pop()
            }
            const indexes = Object.getOwnPropertyNames(zoneItems[itemName])
            indexes.forEach(function(index) {
              const replace = items.filter(function(item) {
                return item.name === zoneItems[itemName][index]
              }).pop()
              const map = self.items[zoneName].get(item) || {}
              map[index] = replace
              self.items[zoneName].set(item, map)
            })
          })
        })
      } else {
        this.items = preset.itemLocations
      }
    }
    if ('relicLocations' in preset) {
      if (typeof(preset.relicLocations) === 'object') {
        const self = this
        self.locations = {}
        if ('extension' in preset.relicLocations) {
          self.extension = preset.relicLocations.extension
        } else {
          delete self.extension
        }
        if ('leakPrevention' in preset.relicLocations) {
          self.leakPrevention = preset.relicLocations.leakPrevention
        }
        if ('thrustSwordAbility' in preset.relicLocations) {
          self.thrustSword = preset.relicLocations.thrustSwordAbility
        }
        if ('placed' in preset.relicLocations) {
          self.locations.placed = clone(preset.relicLocations.placed)
        }
        if ('replaced' in preset.relicLocations) {
          self.locations.replaced = clone(preset.relicLocations.replaced)
        }
        if ('blocked' in preset.relicLocations) {
          self.locations.blocked = clone(preset.relicLocations.blocked)
        }
        const locations = Object.getOwnPropertyNames(preset.relicLocations)
        locations.filter(function(location) {
          return [
            'extension',
            'leakPrevention',
            'thrustSwordAbility',
            'placed',
            'replaced',
            'blocked',
          ].indexOf(location) === -1
        }).forEach(function(location) {
          if ((/^[0-9]+(-[0-9]+)?$/).test(location)) {
            self.goal = preset.relicLocations[location].map(function(lock) {
              return new Set(lock)
            })
            const parts = location.split('-')
            self.target = {
              min: parseInt(parts[0]),
            }
            if (parts.length === 2) {
              self.target.max = parseInt(parts[1])
            }
          } else {
            // Break the lock into access locks and escape requirements.
            const locks = self.locations[location] || []
            const escape = self.escapes[location] || []
            preset.relicLocations[location].forEach(function(lock) {
              if (lock[0] === '+') {
                escape.push(new Set(lock.slice(1)))
              } else {
                locks.push(new Set(lock))
              }
            })
            self.locations[location] = locks
            self.escapes[location] = escape
          }
        })
      } else {
        this.locations = preset.relicLocations
      }
    }
    if ('stats' in preset) {
      this.stats = preset.stats
    }
    if ('music' in preset) {
      this.music = preset.music
    }
    if ('turkeyMode' in preset) {
      this.turkey = preset.turkeyMode
    }
    if ('colorrandoMode' in preset) {
      this.colorrando = preset.colorrandoMode
    }
    if ('magicmaxMode' in preset) {
      this.magicmax = preset.magicmaxMode
    }
    if ('antiFreezeMode' in preset) {
      this.antifreeze = preset.antiFreezeMode
    }
    if ('mypurseMode' in preset) {
      this.mypurse = preset.mypurseMode
    }
    if ('iwsMode' in preset) {
      this.iws = preset.iwsMode
    }
    if ('fastwarpMode' in preset) {
      this.fastwarp = preset.fastwarpMode
    }
    if ('itemNameRandoMode' in preset) {
      this.itemnamerando = preset.itemNameRandoMode
    }
    if ('noprologueMode' in preset) {
      this.noprologue = preset.noprologueMode
    }
    if ('unlockedMode' in preset) {
      this.unlocked = preset.unlockedMode
    }
    if ('surpriseMode' in preset) {
      this.surprise = preset.surpriseMode
    }
    if ('enemyStatRandoMode' in preset) {
      this.enemyStatRando = preset.enemyStatRandoMode
    }
    if ('shopPriceRandoMode' in preset) {
      this.shopPriceRando = preset.shopPriceRandoMode
    }
    if ('startRoomRandoMode' in preset) {
      this.startRoomRando = preset.startRoomRandoMode
    }
    if ('startRoomRando2ndMode' in preset) {
      this.startRoomRando2nd = preset.startRoomRando2ndMode
    }
    if ('dominoMode' in preset) {
      this.domino = preset.dominoMode
    }
    if ('rlbcMode' in preset) {
      this.rlbc = preset.rlbcMode
    }
    if ('immunityPotionMode' in preset) {
      this.immunityPotion = preset.immunityPotionMode
    }
    if ('godspeedMode' in preset) {
      this.godspeed = preset.godspeedMode
    }
    if ('libraryShortcut' in preset) {
      this.libShort = preset.libraryShortcut
    }
    if ('elemChaosMode' in preset) {
      this.elemChaos = preset.elemChaosMode
    }
    if ('simpleInputMode' in preset) {
      this.simpleInput = preset.simpleInputMode
    }
    if ('devStashMode' in preset) {
      this.devStash = preset.devStashMode
    }
    if ('seasonalPhrasesMode' in preset) {
      this.seasonalPhrases = preset.seasonalPhrasesMode
    }
    if ('bossMusicSeparation' in preset) {
      this.bossMusic = preset.bossMusicSeparation
    }
    if ('newGoalsSet' in preset) {
      this.newGoals = preset.newGoalsSet
    }
    if ('writes' in preset) {
      this.writes = this.writes || []
      this.writes.push.apply(this.writes, preset.writes)
    }
  }

  PresetBuilder.prototype.enemyDrops =
    function enemyDrops(enemyName, level, commonDropName, rareDropName) {
      if (typeof(enemyName) === 'boolean') {
        this.drops = enemyName
      } else {
        enemyName = getEnemyAlias.call(this, enemyName)
        commonDropName = getItemAlias.call(this, commonDropName)
        rareDropName = getItemAlias.call(this, rareDropName)
        const args = Array.prototype.slice.call(arguments)
        if (typeof(this.drops) !== 'object') {
          this.drops = new Map()
        }
        let enemy
        if (enemyName === constants.GLOBAL_DROP) {
          enemy = enemyName
        } else if (enemyName === 'Librarian') {
          enemy = 'Librarian'
        } else {
          if (typeof(level) !== 'number') {
            rareDropName = commonDropName
            commonDropName = level
            level = undefined
          } else {
            args.splice(1, 1)
          }
          if (enemyName === '*') {
            enemy = '*'
          } else {
            const enemiesDrops = enemies.enemiesDrops
            enemy = enemiesDrops.filter(function(enemy) {
              if (enemy.name === enemyName) {
                if (typeof(level) !== 'undefined') {
                  return enemy.level === level
                }
                return true
              }
            }).pop()
            assert(enemy, 'Unknown enemy: ' + enemyName)
          }
        }
        const dropNames = args.slice(1)
        const drops = dropNames.map(function(dropName) {
          if (dropName) {
            const item = items.filter(function(item) {
              return item.name === dropName
            }).pop()
            assert(item, 'Unknown item: ' + dropName)
            return item
          }
        })
        this.drops.set(enemy, drops)
      }
    }

  PresetBuilder.prototype.blockDrops =
    function blockDrops(enemyName, level, drops) {
      enemyName = getEnemyAlias.call(this, enemyName)
      let enemy
      if (enemyName === constants.GLOBAL_DROP) {
        enemy = enemyName
      } else if (enemyName === 'Librarian') {
        enemy = 'Librarian'
      } else {
        if (typeof(level) !== 'number') {
          drops = level
          level = undefined
        }
        if (enemyName === '*') {
          enemy = '*'
        } else {
          const enemiesDrops = enemies.enemiesDrops
          enemy = enemiesDrops.filter(function(enemy) {
            if (enemy.name === enemyName) {
              if (typeof(level) !== 'undefined') {
                return enemy.level === level
              }
              return true
            }
          }).pop()
          assert(enemy, 'Unknown enemy: ' + enemyName)
        }
      }
      if (!Array.isArray(drops)) {
        drops = [drops]
      }
      const self = this
      drops = drops.map(function(drop) {
        return getItemAlias.call(self, drop)
      })
      drops = drops.map(function(dropName) {
        if (dropName) {
          const item = items.filter(function(item) {
            return item.name === dropName
          }).pop()
          assert(item, 'Unknown item: ' + dropName)
          return item
        }
      })
      if (typeof(this.drops) !== 'object') {
        this.drops = new Map()
      }
      this.drops.blocked = this.drops.blocked || new Map()
      this.drops.blocked.set(enemy, drops)
    }

  PresetBuilder.prototype.startingEquipment =
    function startingEquipment(slot, itemNames) {
      assert.oneOf(slot, [
        true,
        false,
        constants.SLOT.RIGHT_HAND,
        constants.SLOT.LEFT_HAND,
        constants.SLOT.HEAD,
        constants.SLOT.BODY,
        constants.SLOT.CLOAK,
        constants.SLOT.OTHER,
        constants.SLOT.AXEARMOR,
        constants.SLOT.LUCK_MODE,
      ])
      if (typeof(slot) === 'boolean') {
        this.equipment = slot
      } else {
        if (!Array.isArray(itemNames)) {
          itemNames = [itemNames]
        }
        const self = this
        itemNames = itemNames.map(function(name) {
          return getItemAlias.call(self, name)
        })
        if (typeof(this.equipment) !== 'object') {
          this.equipment = {}
        }
        this.equipment[slot] = this.equipment[slot] || []
        itemNames.forEach(function(itemName) {
          let item
          if (itemName) {
            item = items.filter(function(item) {
              return item.name === itemName
            }).pop()
            assert(item, 'Unknown item: ' + itemName)
            switch (slot) {
            case constants.SLOT.RIGHT_HAND:
              assert.oneOf(item.type, [
                constants.TYPE.WEAPON1,
                constants.TYPE.WEAPON2,
                constants.TYPE.SHIELD,
                constants.TYPE.USABLE,
              ])
              if (self.equipment[constants.SLOT.LEFT_HAND]) {
                self.equipment[constants.SLOT.LEFT_HAND].forEach(
                  function(eq) {
                    assert.notEqual(
                      eq.type,
                      constants.TYPE.WEAPON2,
                      'Cannot equipment ' + eq.name + ' and ' + item.name
                    )
                  }
                )
              }
              break
            case constants.SLOT.LEFT_HAND:
              assert.oneOf(item.type, [
                constants.TYPE.WEAPON1,
                constants.TYPE.SHIELD,
                constants.TYPE.USABLE,
              ])
              if (self.equipment[constants.SLOT.RIGHT_HAND]) {
                self.equipment[constants.SLOT.RIGHT_HAND].forEach(
                  function(eq) {
                    assert.notEqual(
                      eq.type,
                      constants.TYPE.WEAPON2,
                      'Cannot equipment ' + eq.name + ' and ' + item.name
                    )
                  }
                )
              }
              break
            case constants.SLOT.HEAD:
              assert.equal(item.type, constants.TYPE.HELMET,
                           'Cannot equip ' + item.name + ' on head')
              break
            case constants.SLOT.BODY:
              assert.equal(item.type, constants.TYPE.ARMOR,
                           'Cannot equip ' + item.name + ' on body')
              break
            case constants.SLOT.CLOAK:
              assert.equal(item.type, constants.TYPE.CLOAK,
                           'Cannot equip ' + item.name + ' as cloak')
              break
            case constants.SLOT.OTHER:
              assert.equal(item.type, constants.TYPE.ACCESSORY,
                           'Cannot equip ' + item.name + ' as other')
              break
            case constants.SLOT.AXEARMOR:
              assert.equal(item.type, constants.TYPE.ARMOR,
                           'Cannot equip ' + item.name + ' as armor')
              break
            case constants.SLOT.LUCK_MODE:
              assert.equal(item.type, constants.TYPE.ACCESSORY,
                           'Cannot equip ' + item.name + ' as other')
              break
            }
          }
          self.equipment[slot].push(item)
        })
      }
    }

  PresetBuilder.prototype.blockEquipment =
    function blockEquipment(slot, itemNames) {
      assert.oneOf(slot, [
        true,
        false,
        constants.SLOT.RIGHT_HAND,
        constants.SLOT.LEFT_HAND,
        constants.SLOT.HEAD,
        constants.SLOT.BODY,
        constants.SLOT.CLOAK,
        constants.SLOT.OTHER,
        constants.SLOT.AXEARMOR,
        constants.SLOT.LUCK_MODE,
      ])
      if (!Array.isArray(itemNames)) {
        itemNames = [itemNames]
      }
      const self = this
      itemNames = itemNames.map(function(name) {
        return getItemAlias.call(self, name)
      })
      if (typeof(this.equipment) !== 'object') {
        this.equipment = {}
      }
      this.equipment.blocked = this.equipment.blocked || {}
      this.equipment.blocked[slot] = this.equipment.blocked[slot] || []
      itemNames.forEach(function(itemName) {
        let item
        if (itemName) {
          item = items.filter(function(item) {
            return item.name === itemName
          }).pop()
          assert(item, 'Unknown item: ' + itemName)
          switch (slot) {
          case constants.SLOT.RIGHT_HAND:
            assert.oneOf(item.type, [
              constants.TYPE.WEAPON1,
              constants.TYPE.WEAPON2,
              constants.TYPE.SHIELD,
              constants.TYPE.USABLE,
            ])
            if (self.equipment[constants.SLOT.LEFT_HAND]) {
              self.equipment[constants.SLOT.LEFT_HAND].forEach(
                function(eq) {
                  assert.notEqual(
                    eq.type,
                    constants.TYPE.WEAPON2,
                    'Cannot equipment ' + eq.name + ' and ' + item.name
                  )
                }
              )
            }
            break
          case constants.SLOT.LEFT_HAND:
            assert.oneOf(item.type, [
              constants.TYPE.WEAPON1,
              constants.TYPE.SHIELD,
              constants.TYPE.USABLE,
            ])
            if (self.equipment[constants.SLOT.RIGHT_HAND]) {
              self.equipment[constants.SLOT.RIGHT_HAND].forEach(
                function(eq) {
                  assert.notEqual(
                    eq.type,
                    constants.TYPE.WEAPON2,
                    'Cannot equipment ' + eq.name + ' and ' + item.name
                  )
                }
              )
            }
            break
          case constants.SLOT.HEAD:
            assert.equal(item.type, constants.TYPE.HELMET,
                         'Cannot equip ' + item.name + ' on head')
            break
          case constants.SLOT.BODY:
            assert.equal(item.type, constants.TYPE.ARMOR,
                         'Cannot equip ' + item.name + ' on body')
            break
          case constants.SLOT.CLOAK:
            assert.equal(item.type, constants.TYPE.CLOAK,
                         'Cannot equip ' + item.name + ' as cloak')
            break
          case constants.SLOT.OTHER:
            assert.equal(item.type, constants.TYPE.ACCESSORY,
                         'Cannot equip ' + item.name + ' as other')
            break
          case constants.SLOT.AXEARMOR:
            assert.equal(item.type, constants.TYPE.ARMOR,
                         'Cannot equip ' + item.name + ' as armor')
            break
          case constants.SLOT.LUCK_MODE:
            assert.equal(item.type, constants.TYPE.ACCESSORY,
                         'Cannot equip ' + item.name + ' as other')
            break
          }
        }
        self.equipment.blocked[slot].push(item)
      })
    }

  PresetBuilder.prototype.itemLocations =
    function itemLocations(zoneId, itemName, number, replaceNames) {
      if (typeof(zoneId) === 'boolean') {
        this.items = zoneId
      } else {
        if (typeof(number) === 'string') {
          replaceNames = number
          number = 1
        }
        if (typeof(replaceNames) === 'string') {
          replaceNames = [replaceNames]
        }
        itemName = getItemAlias.call(this, itemName)
        const self = this
        replaceNames = replaceNames.map(function(name) {
          return getItemAlias.call(self, name)
        })
        assert(typeof(number) === 'number', 'Unknown item number: ' + number)
        const index = number - 1
        const zones = ['*'].concat(constants.zoneNames.map(function(zoneName) {
          return constants.ZONE[zoneName]
        }))
        assert.oneOf(zoneId, zones, 'Unknown zone: ' + zoneId)
        let zoneName
        if (zoneId === '*') {
          zoneName = '*'
        } else {
          zoneName = constants.zoneNames[zoneId]
        }
        let item
        if (itemName === '*') {
          item = '*'
        } else {
          item = items.filter(function(item) {
            return item.name === itemName
          })[0]
          assert(item, 'Unknown item: ' + itemName)
          const tiles = (item.tiles || []).filter(function(tile) {
            return 'zones' in tile && tile.zones.indexOf(zoneId) !== -1
          })
          assert(tiles[index], 'Unknown item tile: ' + itemName + ' ' + number)
        }
        if (typeof(this.items) !== 'object') {
          this.items = {}
        }
        this.items[zoneName] = this.items[zoneName] || new Map()
        const map = this.items[zoneName].get(item) || {}
        map[number - 1] = map[number - 1] || []
        const replaceFunc = function(replaceName) {
          const replace = items.filter(function(item) {
            return item.name === replaceName
          })[0]
          assert(replace, 'Unknown item: ' + replaceName)
          map[number - 1].push(replace)
        };
        replaceNames.forEach(name => {
            if(name instanceof Array) {
              name.forEach(replaceFunc)
            } else {
              replaceFunc(name)
            }
        })
        this.items[zoneName].set(item, map)
      }
    }

  // Block an item from a tile.
  PresetBuilder.prototype.blockItem =
    function blockItem(zoneId, itemName, number, replaceNames) {
      if (typeof(number) !== 'number') {
        replaceNames = number
        number = 1
      }
      if (!Array.isArray(replaceNames)) {
        replaceNames = [replaceNames]
      }
      itemName = getItemAlias.call(this, itemName)
      const self = this
      replaceNames = replaceNames.map(function(name) {
        return getItemAlias.call(self, name)
      })
      assert(typeof(number) === 'number', 'Unknown item number: ' + number)
      const index = number - 1
      const zones = ['*'].concat(constants.zoneNames.map(function(zoneName) {
        return constants.ZONE[zoneName]
      }))
      assert.oneOf(zoneId, zones, 'Unknown zone: ' + zoneId)
      let zoneName
      if (zoneId === '*') {
        zoneName = '*'
      } else {
        zoneName = constants.zoneNames[zoneId]
      }
      let item
      if (itemName === '*') {
        item = '*'
      } else {
        item = items.filter(function(item) {
          return item.name === itemName
        })[0]
        assert(item, 'Unknown item: ' + itemName)
        const tiles = (item.tiles || []).filter(function(tile) {
          return 'zones' in tile && tile.zones.indexOf(zoneId) !== -1
        })
        assert(tiles[index], 'Unknown item tile: ' + itemName + ' ' + number)
      }
      if (typeof(this.items) !== 'object') {
        this.items = {}
      }
      this.items.blocked = this.items.blocked || {}
      this.items.blocked[zoneName] = this.items.blocked[zoneName] || new Map()
      const map = this.items.blocked[zoneName].get(item) || {}
      map[number - 1] = map[number - 1] || []
      replaceNames.forEach(function(replaceName) {
        const replace = items.filter(function(item) {
          return item.name === replaceName
        })[0]
        assert(replace, 'Unknown item: ' + replaceName)
        map[number - 1].push(replace)
      })
      this.items.blocked[zoneName].set(item, map)
    }

  const rewardsMap = {
    'Heart Refresh': 'h',
    'Neutron bomb': 'n',
    'Potion': 'p',
  }

  PresetBuilder.prototype.prologueRewards =
    function prologueRewards(itemName, replaceNames) {
      if (typeof(itemName) === 'boolean') {
        this.rewards = itemName
      } else {
        itemName = getItemAlias.call(this, itemName)
        if (!Array.isArray(replaceNames)) {
          replaceNames = [replaceNames]
        }
        const self = this
        replaceNames = replaceNames.map(function(name) {
          return getItemAlias.call(self, name)
        })
        assert.oneOf(itemName, Object.getOwnPropertyNames(rewardsMap),
                     'Unknown reward item: ' + itemName)
        if (typeof(this.rewards) !== 'object') {
          this.rewards = {}
        }
        this.rewards[rewardsMap[itemName]] =
          this.rewards[rewardsMap[itemName]] || []
        replaceNames.forEach(function(replaceName) {
          const replace = items.filter(function(item) {
            return item.name === replaceName
          })[0]
          self.rewards[rewardsMap[itemName]].push(replace)
        })
      }
    }

  // Block an item from being a reward.
  PresetBuilder.prototype.blockReward =
    function blockReward(itemName, blocked) {
      assert.equal(typeof(itemName), 'string')
      if (Array.isArray(blocked)) {
        blocked.forEach(function(itemName) {
          if (itemName) {
            assert.equal(typeof(itemName), 'string')
          }
        })
      } else if (blocked) {
        assert.equal(typeof(blocked), 'string')
      }
      if (!Array.isArray(blocked)) {
        blocked = [blocked]
      }
      const self = this
      blocked = blocked.map(function(name) {
        return getItemAlias.call(self, name)
      })
      assert.oneOf(itemName, Object.getOwnPropertyNames(rewardsMap),
                   'Unknown reward item: ' + itemName)
      if (typeof(this.rewards) !== 'object') {
        this.rewards = {}
      }
      this.rewards.blocked = this.rewards.blocked || {}
      this.rewards.blocked[rewardsMap[itemName]] =
        this.rewards.blocked[rewardsMap[itemName]] || []
      blocked.forEach(function(replaceName) {
        const replace = items.filter(function(item) {
          return item.name === replaceName
        })[0]
        self.rewards.blocked[rewardsMap[itemName]].push(replace)
      })
    }

  // Lock relic location behind abilities.
  PresetBuilder.prototype.lockLocation = function lockLocation(where, what) {
    if (typeof(this.locations) !== 'object') {
      this.locations = {}
    }
    this.locations[where] = what.map(function(lock) {
      return new Set(lock)
    })
  }

  // Block a relic from appearing at a location.
  PresetBuilder.prototype.blockRelic = function blockRelic(where, what) {
    assert.equal(typeof(where), 'string')
    if (Array.isArray(what)) {
      what.forEach(function(relic) {
        if (relic) {
          assert.equal(typeof(relic), 'string')
        }
      })
    } else if (what) {
      assert.equal(typeof(what), 'string')
    }
    if (!Array.isArray(what)) {
      what = [what]
    }
    if (typeof(this.locations) !== 'object') {
      this.locations = {}
    }
    this.locations.blocked = this.locations.blocked || {}
    this.locations.blocked[where] = what
  }

  // Ensure that a location grants abilities, or that access to that location
  // is only granted by obtaining abilities.
  PresetBuilder.prototype.escapeRequires =
    function escapeRequires(where, what) {
      if (typeof(this.locations) !== 'object') {
        this.locations = {}
      }
      this.escapes[where] = what.map(function(lock) {
        return new Set(lock)
      })
    }

  // Place a relic at a location.
  PresetBuilder.prototype.placeRelic = function placeRelic(where, what) {
    assert.equal(typeof(where), 'string')
    if (Array.isArray(what)) {
      what.forEach(function(relic) {
        if (relic) {
          assert.equal(typeof(relic), 'string')
        }
      })
    } else if (what) {
      assert.equal(typeof(what), 'string')
    }
    if (!Array.isArray(what)) {
      what = [what]
    }
    if (typeof(this.locations) !== 'object') {
      this.locations = {}
    }
    this.locations.placed = this.locations.placed || {}
    this.locations.placed[where] = what
  }

  // Replace a relic with an item.
  PresetBuilder.prototype.replaceRelic = function replaceRelic(relic, item) {
    assert.equal(typeof(relic), 'string')
    assert.equal(typeof(item), 'string')
    this.locations.replaced = this.locations.replaced || {}
    this.locations.replaced[relic] = getItemAlias.call(this, item)
  }

  // Enable/disable relic location randomization.
  PresetBuilder.prototype.relicLocations = function relicLocations(enabled) {
    assert.equal(typeof(enabled), 'boolean')
    this.locations = enabled
  }

  // Enable/disable progression item leak prevention.
  PresetBuilder.prototype.preventLeaks =
    function preventLeaks(enabled) {
      assert.equal(typeof(enabled), 'boolean')
      this.leakPrevention = enabled
    }

  // Enable/disable thrust sword ability.
  PresetBuilder.prototype.thrustSwordAbility =
    function thrustSwordAbility(enabled) {
      assert.equal(typeof(enabled), 'boolean')
      this.thrustSword = enabled
    }

  // Set complexity target.
  PresetBuilder.prototype.complexityGoal =
    function goal(complexityMin, complexityMax, goal) {
      if (arguments.length === 1 && typeof(complexityMin) !== 'number') {
        delete this.goal
        delete this.target
      } else {
        assert(
          typeof(complexityMin) === 'number',
          'expected complexityMin to be a number'
        )
        if (Array.isArray(complexityMax)) {
          goal = complexityMax
          complexityMax = undefined
        } else {
          assert(
            typeof(complexityMax) === 'number',
            'expected complexityMax to be a number'
          )
        }
        assert(goal.every(function(lock) {
          return typeof(lock) === 'string'
        }), 'expected goal to be an array of strings')
        assert(Array.isArray(goal), 'expected goal to be an array of strings')
        this.goal = goal.map(function(lock) {
          return new Set(lock)
        })
        this.target = {
          min: complexityMin,
        }
        if (typeof(complexityMax) !== 'undefined') {
          this.target.max = complexityMax
        }
      }
    }

  // Enable relic locations.
  PresetBuilder.prototype.relicLocationsExtension =
    function relicLocationsExtension(extension) {
      assert.oneOf(typeof(extension), ['boolean', 'string'])
      this.extension = extension
    }

  // Enable stat randomization.
  PresetBuilder.prototype.randomizeStats = function randomizeStats(enabled) {
    this.stats = enabled
  }

  // Enable music randomization.
  PresetBuilder.prototype.randomizeMusic = function randomizeMusic(enabled) {
    this.music = enabled
  }

  // Enable turkey mode.
  PresetBuilder.prototype.turkeyMode = function turkeyMode(enabled) {
    this.turkey = enabled
  }

  // Enable Color Palette Randomization
  PresetBuilder.prototype.colorrandoMode = function colorrandoMode(enabled) {
    this.colorrando = enabled
  }

  // Enable Magic Max replacing Heart Max
  PresetBuilder.prototype.magicmaxMode = function magicmaxMode(enabled) {
    this.magicmax = enabled
  }

  // remove screen freezes from level up, relic, vessel. - eldri7ch & MottZilla
  PresetBuilder.prototype.antiFreezeMode = function antiFreezeMode(enabled) {
    this.antifreeze = enabled
  }

  // Prevent Death from stealing equipment - eldri7ch
  PresetBuilder.prototype.mypurseMode = function mypurseMode(enabled) {
    this.mypurse = enabled
  }

  // Enable Infinite Wing Smash - eldri7ch
  PresetBuilder.prototype.iwsMode = function iwsMode(enabled) {
    this.iws = enabled
  }

  // Enable Faster Warps - eldri7ch
  PresetBuilder.prototype.fastwarpMode = function fastwarpMode(enabled) {
    this.fastwarp = enabled
  }

  // Enable Item Name Rando - MottZilla
  PresetBuilder.prototype.itemNameRandoMode = function itemNameRandoMode(enabled) {
    this.itemnamerando = enabled
  }

  // Enable Prologue Skip - eldri7ch
  PresetBuilder.prototype.noprologueMode = function noprologueMode(enabled) {
    this.noprologue = enabled
  }

  // Enable Unlocked - eldri7ch
  PresetBuilder.prototype.unlockedMode = function unlockedMode(enabled) {
    this.unlocked = enabled
  }

  // Enable Surprise - eldri7ch
  PresetBuilder.prototype.surpriseMode = function surpriseMode(enabled) {
    this.surprise = enabled
  }

  // Enable Enemy Stat Rando - eldri7ch
  PresetBuilder.prototype.enemyStatRandoMode = function enemyStatRandoMode(enabled) {
    this.enemyStatRando = enabled
  }

  // Enable Shop Price Rando - eldri7ch
  PresetBuilder.prototype.shopPriceRandoMode = function shopPriceRandoMode(enabled) {
    this.shopPriceRando = enabled
  }

  // Enable Starting Room Rando - eldri7ch
  PresetBuilder.prototype.startRoomRandoMode = function startRoomRandoMode(enabled) {
    this.startRoomRando = enabled
  }

  // Enable Starting Room Rando 2nd - MottZilla
  PresetBuilder.prototype.startRoomRando2ndMode = function startRoomRando2ndMode(enabled) {
    this.startRoomRando2nd = enabled
  }

  // Enable Guaranteed Drops - eldri7ch
  PresetBuilder.prototype.dominoMode = function dominoMode(enabled) {
    this.domino = enabled
  }

  // Enable Reverse Library Cards - eldri7ch
  PresetBuilder.prototype.rlbcMode = function rlbcMode(enabled) {
    this.rlbc = enabled
  }

  // Enable Immunity Potions - eldri7ch
  PresetBuilder.prototype.immunityPotionMode = function immunityPotionMode(enabled) {
    this.immunityPotion = enabled
  }

  // Enable Godspeed Shoes - eldri7ch
  PresetBuilder.prototype.godspeedMode = function godspeedMode(enabled) {
    this.godspeed = enabled
  }

  // Enable Library Shortcut - eldri7ch
  PresetBuilder.prototype.libraryShortcut = function libraryShortcut(enabled) {
    this.libShort = enabled
  }
  
  // Enable Elemental Chaos - eldri7ch
  PresetBuilder.prototype.elemChaosMode = function elemChaosMode(enabled) {
    this.elemChaos = enabled
  }

  // Enable Simplified Inputs - eldri7ch
  PresetBuilder.prototype.simpleInputMode = function simpleInputMode(enabled) {
    this.simpleInput = enabled
  }

  // Enable Dev's Stash - eldri7ch
  PresetBuilder.prototype.devStashMode = function devStashMode(enabled) {
    this.devStash = enabled
  }

  // Enable Seasonal Phrases - eldri7ch
  PresetBuilder.prototype.seasonalPhrasesMode = function seasonalPhrasesMode(enabled) {
    this.seasonalPhrases = enabled
  }

  // Enable boss music separation - eldri7ch
  PresetBuilder.prototype.bossMusicSeparation = function bossMusicSeparation(enabled) {
    this.bossMusic = enabled
  }

  // Assign New Goals - eldri7ch
  PresetBuilder.prototype.newGoalsSet = function newGoalsSet(nGoals) {
    assert.oneOf(typeof(nGoals), ['boolean', 'string'])
    this.newGoals = nGoals
  }

  // Write a character.
  PresetBuilder.prototype.writeChar = function writeChar(address, value) {
    let valueCheck
    valueCheck = String(value)
    if (value !== 'random' && value !== 'random1' && value !== 'random3' && value !== 'random10' && value !== 'random99' && !valueCheck.includes('randomHexChar')) {
      value = parseInt(value)
    }
    this.writes = this.writes || []
    this.writes.push({
      type: 'char',
      address: address,
      value: value,
    })
    address = address + 1					// Step adddress. 
    if (Math.floor(address % 2352) > 2071) {			// Then check if new address is beyond User Data section.
      address = ( Math.floor(address / 2352) * 2352) + 2376	// If beyond user data section then return the beginning of the next sector's user data section. - MottZilla
    }
    return address
  }

  // Write a short.
  PresetBuilder.prototype.writeShort = function writeShort(address, value) {
    if (value !== 'random' && value !== 'randomRelic') {
      value = parseInt(value)
    }
    this.writes = this.writes || []
    this.writes.push({
      type: 'short',
      address: address,
      value: value,
    })
    address = address + 2					// Step adddress. 
    if (Math.floor(address % 2352) > 2071) {			// Then check if new address is beyond User Data section.
      address = ( Math.floor(address / 2352) * 2352) + 2376	// If beyond user data section then return the beginning of the next sector's user data section. - MottZilla
    }
    return address
  }

  // Write a word.
  PresetBuilder.prototype.writeWord = function writeWord(address, value) {
    if (value !== 'random') {
      value = parseInt(value)
    }
    this.writes = this.writes || []
    this.writes.push({
      type: 'word',
      address: address,
      value: value,
    })
    address = address + 4					// Step adddress. 
    if (Math.floor(address % 2352) > 2071) {			// Then check if new address is beyond User Data section.
      address = ( Math.floor(address / 2352) * 2352) + 2376	// If beyond user data section then return the beginning of the next sector's user data section. - MottZilla
    }
    return address
  }

  // Write a long.
  PresetBuilder.prototype.writeLong = function writeLong(address, value) {
    this.writes = this.writes || []
    this.writes.push({
      type: 'long',
      address: address,
      value: value,
    })
    address = address + 8					// Step adddress. 
    if (Math.floor(address % 2352) > 2071) {			// Then check if new address is beyond User Data section.
      address = ( Math.floor(address / 2352) * 2352) + 2376	// If beyond user data section then return the beginning of the next sector's user data section. - MottZilla
    }
    return address
  }

  // Write a string.
  PresetBuilder.prototype.writeString = function writeString(address, value) {
    if (typeof(value) === 'string') {
      const hexBytes = value.split(/([a-fA-F0-9]{2})/g)
      value = hexBytes.reduce(function(bytes, byteValue) {
        if (byteValue.length) {
          bytes.push(parseInt(byteValue, 16))
        }
        return bytes
      }, [])
    }
    this.writes = this.writes || []
    this.writes.push({
      type: 'string',
      address: address,
      value: value,
    })
    return address + value.length
  }

  // Create a preset from the current configuration.
  PresetBuilder.prototype.build = function build() {
    const self = this
    let drops = self.drops
    if (typeof(drops) === 'object') {
      drops = {}
      if (self.drops.blocked) {
        drops.blocked = {}
        Array.from(self.drops.blocked.keys()).forEach(function(enemy) {
          let enemyName
          if (enemy === '*') {
            enemyName = '*'
          } else if (enemy === constants.GLOBAL_DROP) {
            enemyName = enemy
          } else if (enemy === 'Librarian') {
            enemyname = enemy
          } else {
            enemyName = enemy.name
            const enemiesDrops = enemies.enemiesDrops
            const amb = enemiesDrops.filter(function(enemy) {
              return enemy.name === enemyName
            })
            enemyName = enemyName.replace(/\s+/g, '')
            if (amb.length > 1 && enemy !== amb[0]) {
              enemyName += '-' + enemy.level
            }
          }
          drops.blocked[enemyName] =
            self.drops.blocked.get(enemy).slice().map(function(item) {
              return item ? item.name : undefined
            })
        })
      }
      Array.from(self.drops.keys()).forEach(function(enemy) {
        let enemyName
        if (enemy === '*') {
          enemyName = '*'
        } else if (enemy === constants.GLOBAL_DROP) {
          enemyName = enemy
        } else {
          enemyName = enemy.name
          const enemiesDrops = enemies.enemiesDrops
          const amb = enemiesDrops.filter(function(enemy) {
            return enemy.name === enemyName
          })
          enemyName = enemyName.replace(/\s+/g, '')
          if (amb.length > 1 && enemy !== amb[0]) {
            enemyName += '-' + enemy.level
          }
        }
        drops[enemyName] = self.drops.get(enemy).slice().map(function(item) {
          return item ? item.name : undefined
        })
      })
    }
    let equipment = self.equipment
    if (typeof(equipment) === 'object') {
      equipment = {}
      if (self.equipment.blocked) {
        equipment.blocked = {}
        Object.getOwnPropertyNames(self.equipment.blocked).forEach(
          function(slot) {
            equipment.blocked[slot] = self.equipment.blocked[slot].map(
              function(item) {
                return item.name
              }
            )
          }
        )
      }
      Object.getOwnPropertyNames(self.equipment).filter(function(slot) {
        return self.equipment[slot] && slot !== 'blocked'
      }).forEach(function(slot) {
        equipment[slot] = self.equipment[slot].map(function(item) {
          if (item) {
            return item.name
          }
        })
      })
    }
    let rewards = self.rewards
    if (typeof(rewards) === 'object') {
      rewards = {}
      if (self.rewards.blocked) {
        rewards.blocked = {}
        Object.getOwnPropertyNames(self.rewards.blocked).forEach(
          function(reward) {
            rewards.blocked[reward] = self.rewards.blocked[reward].map(
              function(item) {
                return item.name
              }
            )
          }
        )
      }
      Object.getOwnPropertyNames(self.rewards).filter(function(reward) {
        return reward !== 'blocked'
      }).forEach(function(reward) {
        rewards[reward] = self.rewards[reward].map(function(item) {
          if (item) {
            return item.name
          }
        })
      })
    }
    let items = self.items
    if (typeof(items) === 'object') {
      items = {}
      if (self.items.blocked) {
        items.blocked = {}
        Object.getOwnPropertyNames(self.items.blocked).forEach(function(zone) {
          items.blocked[zone] = {}
          Array.from(self.items.blocked[zone].keys()).forEach(function(item) {
            const indexes = self.items.blocked[zone].get(item)
            let itemName
            if (item === '*') {
              itemName = '*'
            } else {
              itemName = item.name
            }
            items.blocked[zone][itemName] = {}
            Object.getOwnPropertyNames(indexes).forEach(function(index) {
              const replace = self.items.blocked[zone].get(item)[index]
              items.blocked[zone][itemName][index] = replace.map(
                function(item) {
                  return item.name
                }
              )
            })
          })
        })
      }
      Object.getOwnPropertyNames(self.items).filter(function(zone) {
        return zone !== 'blocked'
      }).forEach(function(zone) {
        items[zone] = {}
        Array.from(self.items[zone].keys()).forEach(function(item) {
          const indexes = self.items[zone].get(item)
          let itemName
          if (item === '*') {
            itemName = '*'
          } else {
            itemName = item.name
          }
          items[zone][itemName] = {}
          Object.getOwnPropertyNames(indexes).forEach(function(index) {
            const replace = self.items[zone].get(item)[index]
            items[zone][itemName][index] = replace.map(function(item) {
              return item.name
            })
          })
        })
      })
    }
    let relicLocations = self.locations
    if (typeof(relics) === 'object') {
      relicLocations = {}
      relics.concat(extension).map(function(location) {
        if (typeof(location.ability) === 'string') {
          return location.ability
        }
        return location.name
      }).forEach(function(location) {
        if (self.locations[location]) {
          const locks = self.locations[location].map(function(lock) {
            return Array.from(lock).join('')
          })
          relicLocations[location] = relicLocations[location] || []
          Array.prototype.push.apply(relicLocations[location], locks)
        }
        if (self.escapes[location]) {
          const locks = self.escapes[location].map(function(lock) {
            return '+' + Array.from(lock).join('')
          })
          relicLocations[location] = relicLocations[location] || []
          Array.prototype.push.apply(relicLocations[location], locks)
        }
      })
      if (self.locations.placed) {
        relicLocations.placed = self.locations.placed
      }
      if (self.locations.replaced) {
        relicLocations.replaced = self.locations.replaced
      }
      if (self.locations.blocked) {
        relicLocations.blocked = self.locations.blocked
      }
      if (self.goal) {
        let target = self.target.min.toString()
        if ('max' in self.target) {
          target += '-' + self.target.max.toString()
        }
        relicLocations[target] = self.goal.map(function(lock) {
          return Array.from(lock).join('')
        })
      }
      if (self.extension) {
        relicLocations.extension = self.extension
      }
      if (!self.leakPrevention) {
        relicLocations.leakPrevention = false
      }
      if (self.thrustSword) {
        relicLocations.thrustSwordAbility = true
      }
    }
    const stats = self.stats
    const music = self.music
    const turkey = self.turkey
    const colorrando = self.colorrando
    const magicmax = self.magicmax
    const antifreeze = self.antifreeze
    const mypurse = self.mypurse
    const iws = self.iws
    const fastwarp = self.fastwarp
    const itemnamerando = self.itemnamerando
    const noprologue = self.noprologue
    const unlocked = self.unlocked
    const surprise = self.surprise
    const enemyStatRando = self.enemyStatRando
    const shopPriceRando = self.shopPriceRando
    const startRoomRando = self.startRoomRando
    const startRoomRando2nd = self.startRoomRando2nd
    const domino = self.domino
    const rlbc = self.rlbc
    const immunityPotion = self.immunityPotion
    const godspeed = self.godspeed
    const libShort = self.libShort
    const elemChaos = self.elemChaos
    const simpleInput = self.simpleInput
    const devStash = self.devStash
    const seasonalPhrases = self.seasonalPhrases
    const bossMusic = self.bossMusic
    const newGoals = self.newGoals
    const debug = self.debug
    const writes = self.writes
    return new Preset(
      self.metadata.id,
      self.metadata.name,
      self.metadata.description,
      self.metadata.author,
      self.metadata.knowledgeCheck,
      self.metadata.metaExtension,
      self.metadata.metaComplexity,
      self.metadata.itemStats,
      self.metadata.timeFrame,
      self.metadata.moddedLevel,
      self.metadata.castleType,
      self.metadata.transformEarly,
      self.metadata.transformFocus,
      self.metadata.winCondition,
      self.metadata.weight || 0,
      self.metadata.hidden,
      self.metadata.override,
      drops,
      equipment,
      items,
      rewards,
      relicLocations,
      stats,
      music,
      turkey,
      colorrando,
      magicmax,
      antifreeze,
      mypurse,
      iws,
      fastwarp,
      itemnamerando,
      noprologue,
      unlocked,
      surprise,
      enemyStatRando,
      shopPriceRando,
      startRoomRando,
      startRoomRando2nd,
      domino,
      rlbc,
      immunityPotion,
      godspeed,
      libShort,
      elemChaos,
      simpleInput,
      devStash,
      seasonalPhrases,
      bossMusic,
      newGoals,
      debug,
      writes,
    )
  }

  function addEventListener(event, listener) {
    if ('addEventListener' in this) {
      this.addEventListener(event, listener)
    } else {
      this.on(event, listener)
    }
  }

  function loadWorker(worker, url) {
    if(self){
      selectedPreset = self.sotnRando.selectedPreset
    }else{
      selectedPreset = null
    }
    worker.postMessage({
      url: url,
      selectedPreset: selectedPreset
    })
  }

  function randoFuncMaster(optWrite) {                // A master function and table series to handle randomizer options that require additional code
    const data = new checked()                        // randomizer options that require additional code. 0x3711A68 is loaded from CD by separate code
    let offset
    
    // console.log('optwrite: ' + optWrite)

    offset = 0xF96D8
    offset = data.writeWord(offset, 0x0c038ba6)       // call the sector load
    data.writeWord(offset, 0x00000000)

    offset = 0xF87B0                                  // Sector Load Function
    offset = data.writeWord(offset, 0x3C01800A)
    offset = data.writeWord(offset, 0xAC208850)
    offset = data.writeWord(offset, 0x27BDFFE0)
    offset = data.writeWord(offset, 0x3C020026)
    offset = data.writeWord(offset, 0x34422905)
    offset = data.writeWord(offset, 0x34040002)
    offset = data.writeWord(offset, 0x27A50010)
    offset = data.writeWord(offset, 0x34060000)
    offset = data.writeWord(offset, 0xAFBF0018)
    offset = data.writeWord(offset, 0x0C006578)
    offset = data.writeWord(offset, 0xAFA20010)
    offset = data.writeWord(offset, 0x3404000E)
    offset = data.writeWord(offset, 0x3C058009)
    offset = data.writeWord(offset, 0x34A588B0)
    offset = data.writeWord(offset, 0x0C007020)
    offset = data.writeWord(offset, 0x34060080)
    offset = data.writeWord(offset, 0x34040000)
    offset = data.writeWord(offset, 0x0C007062)
    offset = data.writeWord(offset, 0x34050000)
    offset = data.writeWord(offset, 0x34020000)
    offset = data.writeWord(offset, 0x8FBF0018)
    offset = data.writeWord(offset, 0x27BD0020)
    offset = data.writeWord(offset, 0x03E00008)
    offset = data.writeWord(offset, 0x00000000)

    offset = 0x3711A68                                // Start the master function with jump tables

    offset = data.writeWord(offset, optWrite)         // optionWrite is a bit indicator of all options marked for reading later by ASM or tracker
	  offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x08026237)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x08026255)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x080262E7)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x080262F6)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x27BDFFE0)
    offset = data.writeWord(offset, 0xAFBF0010)
    offset = data.writeWord(offset, 0x0C03C182)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C048009)
    offset = data.writeWord(offset, 0x348488B0)
    offset = data.writeWord(offset, 0x8C860000)
    offset = data.writeWord(offset, 0x3C058000)
    offset = data.writeWord(offset, 0x34A50000)
    offset = data.writeWord(offset, 0x00C53024)
    offset = data.writeWord(offset, 0x10C00003)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x0C026274)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C048009)
    offset = data.writeWord(offset, 0x348488B0)
    offset = data.writeWord(offset, 0x8C850014)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34A60000)
    offset = data.writeWord(offset, 0x3C078000)
    offset = data.writeWord(offset, 0x34E70000)
    offset = data.writeWord(offset, 0x00C73024)
    offset = data.writeWord(offset, 0x10C00003)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00A0F809)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x8FBF0010)
    offset = data.writeWord(offset, 0x27BD0020)
    offset = data.writeWord(offset, 0x03E00008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C028004)
    offset = data.writeWord(offset, 0x9045925D)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x38A500FF)
    offset = data.writeWord(offset, 0x30A50040)
    offset = data.writeWord(offset, 0x10A00008)
    offset = data.writeWord(offset, 0x3C028007)
    offset = data.writeWord(offset, 0x9042BBFB)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x10400004)
    offset = data.writeWord(offset, 0x34180022)
    offset = data.writeWord(offset, 0x341988BE)
    offset = data.writeWord(offset, 0x18000003)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34180002)
    offset = data.writeWord(offset, 0x34197C0E)
    offset = data.writeWord(offset, 0x3C02800F)
    offset = data.writeWord(offset, 0xA0581724)
    offset = data.writeWord(offset, 0x3B180020)
    offset = data.writeWord(offset, 0xA05832A4)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C02800A)
    offset = data.writeWord(offset, 0xA4593C98)
    offset = data.writeWord(offset, 0x34040000)
    offset = data.writeWord(offset, 0x0804390B)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x27BDFFE0)
    offset = data.writeWord(offset, 0xAFBF0004)
    offset = data.writeWord(offset, 0x3C068009)
    offset = data.writeWord(offset, 0x34C689BC)
    offset = data.writeWord(offset, 0x3C078009)
    offset = data.writeWord(offset, 0x8CC40000)
    offset = data.writeWord(offset, 0x34E77490)
    offset = data.writeWord(offset, 0x94E50000)
    offset = data.writeWord(offset, 0x10800007)
    offset = data.writeWord(offset, 0x30A5A000)
    offset = data.writeWord(offset, 0x14A00039)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x0C0262BD)
    offset = data.writeWord(offset, 0x34040000)
    offset = data.writeWord(offset, 0x080262B8)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x94E40004)
    offset = data.writeWord(offset, 0x94E20004)
    offset = data.writeWord(offset, 0x3C068009)
    offset = data.writeWord(offset, 0x34C689C0)
    offset = data.writeWord(offset, 0x30848000)
    offset = data.writeWord(offset, 0x10800005)
    offset = data.writeWord(offset, 0x8CC50000)
    offset = data.writeWord(offset, 0x34040010)
    offset = data.writeWord(offset, 0x24A50001)
    offset = data.writeWord(offset, 0xACC50000)
    offset = data.writeWord(offset, 0xACC40004)
    offset = data.writeWord(offset, 0x30422000)
    offset = data.writeWord(offset, 0x10400006)
    offset = data.writeWord(offset, 0x8CC50008)
    offset = data.writeWord(offset, 0x34040010)
    offset = data.writeWord(offset, 0x24A50001)
    offset = data.writeWord(offset, 0xACC50008)
    offset = data.writeWord(offset, 0x34050010)
    offset = data.writeWord(offset, 0xACC4000C)
    offset = data.writeWord(offset, 0x8CC50004)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x10A00005)
    offset = data.writeWord(offset, 0x24A5FFFF)
    offset = data.writeWord(offset, 0xACC50004)
    offset = data.writeWord(offset, 0x14A00002)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0xACC00000)
    offset = data.writeWord(offset, 0x8CC5000C)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x10A00005)
    offset = data.writeWord(offset, 0x24A5FFFF)
    offset = data.writeWord(offset, 0xACC5000C)
    offset = data.writeWord(offset, 0x14A00002)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0xACC00008)
    offset = data.writeWord(offset, 0x8CC50000)
    offset = data.writeWord(offset, 0x8CC20008)
    offset = data.writeWord(offset, 0x34070002)
    offset = data.writeWord(offset, 0x10A70004)
    offset = data.writeWord(offset, 0x10470003)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x080262B8)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0xACC00000)
    offset = data.writeWord(offset, 0xACC00004)
    offset = data.writeWord(offset, 0xACC00008)
    offset = data.writeWord(offset, 0xACC0000C)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x0C0262BD)
    offset = data.writeWord(offset, 0x34040001)
    offset = data.writeWord(offset, 0x080262B8)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x8FBF0004)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x27BD0020)
    offset = data.writeWord(offset, 0x03E00008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C068009)
    offset = data.writeWord(offset, 0x34C689BC)
    offset = data.writeWord(offset, 0xACC40000)
    offset = data.writeWord(offset, 0x10800008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34050002)
    offset = data.writeWord(offset, 0x34044000)
    offset = data.writeWord(offset, 0x3408C000)
    offset = data.writeWord(offset, 0x3407FFFD)
    offset = data.writeWord(offset, 0x34020002)
    offset = data.writeWord(offset, 0x080262CE)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34050001)
    offset = data.writeWord(offset, 0x34048000)
    offset = data.writeWord(offset, 0x34084000)
    offset = data.writeWord(offset, 0x3407FFFE)
    offset = data.writeWord(offset, 0x34020003)
    offset = data.writeWord(offset, 0x3C068011)
    offset = data.writeWord(offset, 0xA4C52B7C)
    offset = data.writeWord(offset, 0xA4C42B84)
    offset = data.writeWord(offset, 0xA4C52D8C)
    offset = data.writeWord(offset, 0xA4C42D94)
    offset = data.writeWord(offset, 0xA4C52CDC)
    offset = data.writeWord(offset, 0xA4C42CE4)
    offset = data.writeWord(offset, 0xA4C52F84)
    offset = data.writeWord(offset, 0xA4C42F88)
    offset = data.writeWord(offset, 0xA4C82F68)
    offset = data.writeWord(offset, 0xA4C72F64)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C06800A)
    offset = data.writeWord(offset, 0x34C6E000)
    offset = data.writeWord(offset, 0xA4C20488)
    offset = data.writeWord(offset, 0xA4C20490)
    offset = data.writeWord(offset, 0xA4C20498)
    offset = data.writeWord(offset, 0xA4C204A0)
    offset = data.writeWord(offset, 0xA4C204A8)
    offset = data.writeWord(offset, 0xA4C204B0)
    offset = data.writeWord(offset, 0xA4C204B8)
    offset = data.writeWord(offset, 0xA4C204C0)
    offset = data.writeWord(offset, 0x03E00008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C028007)
    offset = data.writeWord(offset, 0x8C422EEC)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34430000)
    offset = data.writeWord(offset, 0x30630001)
    offset = data.writeWord(offset, 0x10600007)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x0C03F8EA)
    offset = data.writeWord(offset, 0x3404000C)
    offset = data.writeWord(offset, 0x10400003)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x08044185)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x0804414A)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C028009)
    offset = data.writeWord(offset, 0x94437494)
    offset = data.writeWord(offset, 0x94427490)
    offset = data.writeWord(offset, 0x34050002)
    offset = data.writeWord(offset, 0x10850013)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34050003)
    offset = data.writeWord(offset, 0x10850021)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x30420400)
    offset = data.writeWord(offset, 0x10400008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34041000)
    offset = data.writeWord(offset, 0x14640005)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x27BDFFE8)
    offset = data.writeWord(offset, 0xAFBF0010)
    offset = data.writeWord(offset, 0x08044527)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C028007)
    offset = data.writeWord(offset, 0x8C422EE8)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x080444AD)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x30420400)
    offset = data.writeWord(offset, 0x1040000A)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34044000)
    offset = data.writeWord(offset, 0x14640007)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34050002)
    offset = data.writeWord(offset, 0xAC453404)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0xAFBF0010)
    offset = data.writeWord(offset, 0x0804448E)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C028007)
    offset = data.writeWord(offset, 0x8C422EE8)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x08044409)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x30420400)
    offset = data.writeWord(offset, 0x10400008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3063A000)
    offset = data.writeWord(offset, 0x10600005)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x27BDFFE0)
    offset = data.writeWord(offset, 0xAFBF0018)
    offset = data.writeWord(offset, 0x080443E0)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C028007)
    offset = data.writeWord(offset, 0x8C422EE8)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x08044381)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
	
	// Hook Master function into gameplay loop.
	data.writeWord(0xFAA38,0x0C02622D)

    return data
  }

  function applyTournamentModePatches() {
    const data = new checked()
    // Patch shop relic cost.
    data.writeWord(0x047a3098, 0x00000000)
    // Open clock statue.
    data.writeWord(0x04951d4c, 0x3c020002)
    data.writeWord(0x04fcf264, 0x3c020002)
    return data
  }
	
  function applyMagicMaxPatches() { // Adds MP Vessel to replace Heart Vessel - eldrich
    const data = new checked()
    let offset = 0x00117b50	// Set Starting Offset
    // Patch MP Vessels function Heart Vessels - code by MottZilla & graphics drawn by eldri7ch
    offset = data.writeWord(offset, 0x3c028004)
    offset = data.writeWord(offset, 0x8c42c9a0)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x10400003)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x0803f8e7)
    offset = data.writeWord(offset, 0x34020001)
    offset = data.writeWord(offset, 0x3c058009)
    offset = data.writeWord(offset, 0x8ca47bac)
    offset = data.writeWord(offset, 0x8ca67ba8)
    offset = data.writeWord(offset, 0x24840005)
    offset = data.writeWord(offset, 0xaca47bac)
    offset = data.writeWord(offset, 0x24c60005)
    offset = data.writeWord(offset, 0xaca67ba8)
    offset = data.writeWord(offset, 0x8ca47bb4)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x24840003)
    offset = data.writeWord(offset, 0xaca47bb0)
    offset = data.writeWord(offset, 0xaca47bb4)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3c058013)
    offset = data.writeWord(offset, 0x34a57964)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x8ca40000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x24840001)
    offset = data.writeWord(offset, 0xaca40000)
    offset = data.writeWord(offset, 0x0803f8e7)
    offset = data.writeWord(offset, 0x34020000)
    // Patch GFX - MottZilla
    offset = 0x3868268
    offset = data.writeWord(offset, 0x40000000)
    offset = data.writeWord(offset, 0x3)
    offset = data.writeWord(offset, 0x40000000)
    offset = data.writeWord(offset, 0x3)
    offset = data.writeWord(offset, 0x40000000)
    offset = data.writeWord(offset, 0x3)
    offset = data.writeWord(offset, 0x40000000)
    offset = data.writeWord(offset, 0x3)
    offset += 0x20
    offset = data.writeWord(offset, 0xf7200000)
    offset = data.writeWord(offset, 0x277)
    offset = data.writeWord(offset, 0xf7200000)
    offset = data.writeWord(offset, 0x277)
    offset = data.writeWord(offset, 0xf7200000)
    offset = data.writeWord(offset, 0x277)
    offset = data.writeWord(offset, 0xf7200000)
    offset = data.writeWord(offset, 0x277)
    offset += 0x20
    offset = data.writeWord(offset, 0x97122000)
    offset = data.writeWord(offset, 0x22169)
    offset = data.writeWord(offset, 0x97122000)
    offset = data.writeWord(offset, 0x22169)
    offset = data.writeWord(offset, 0x97122000)
    offset = data.writeWord(offset, 0x22169)
    offset = data.writeWord(offset, 0x97122000)
    offset = data.writeWord(offset, 0x22169)
    offset += 0x20
    offset = data.writeWord(offset, 0x1f944300)
    offset = data.writeWord(offset, 0x344971)
    offset = data.writeWord(offset, 0x1f944300)
    offset = data.writeWord(offset, 0x344971)
    offset = data.writeWord(offset, 0x1f944300)
    offset = data.writeWord(offset, 0x344971)
    offset = data.writeWord(offset, 0x1f944300)
    offset = data.writeWord(offset, 0x344971)
    offset += 0x20
    offset = data.writeWord(offset, 0xa9432130)
    offset = data.writeWord(offset, 0x321449a)
    offset = data.writeWord(offset, 0xa9432130)
    offset = data.writeWord(offset, 0x321449a)
    offset = data.writeWord(offset, 0xa9432130)
    offset = data.writeWord(offset, 0x321449a)
    offset = data.writeWord(offset, 0xa9432130)
    offset = data.writeWord(offset, 0x321449a)
    offset += 0x20
    offset = data.writeWord(offset, 0x93319920)
    offset = data.writeWord(offset, 0x2992349)
    offset = data.writeWord(offset, 0x93319920)
    offset = data.writeWord(offset, 0x2992349)
    offset = data.writeWord(offset, 0x93319920)
    offset = data.writeWord(offset, 0x2992349)
    offset = data.writeWord(offset, 0x93319920)
    offset = data.writeWord(offset, 0x2992349)
    offset += 0x20
    offset = data.writeWord(offset, 0x3f2c7690)
    offset = data.writeWord(offset, 0x9679233)
    offset = data.writeWord(offset, 0x3f2c7690)
    offset = data.writeWord(offset, 0x9679233)
    offset = data.writeWord(offset, 0x3f2c7690)
    offset = data.writeWord(offset, 0x9679233)
    offset = data.writeWord(offset, 0x3f2c7690)
    offset = data.writeWord(offset, 0x9679233)
    offset += 0x20
    offset = data.writeWord(offset, 0xf29ccf60)
    offset = data.writeWord(offset, 0x6fab913)
    offset = data.writeWord(offset, 0xf29ccf60)
    offset = data.writeWord(offset, 0x6fab913)
    offset = data.writeWord(offset, 0xf293cf60)
    offset = data.writeWord(offset, 0x6fab913)
    offset = data.writeWord(offset, 0xf23c3f60)
    offset = data.writeWord(offset, 0x6fab913)
    offset += 0x20
    offset = data.writeWord(offset, 0x19accbf0)
    offset = data.writeWord(offset, 0xf9aaa91)
    offset = data.writeWord(offset, 0x19cfcbf0)
    offset = data.writeWord(offset, 0xf9aaa91)
    offset = data.writeWord(offset, 0x193f3bf0)
    offset = data.writeWord(offset, 0xf9aaa91)
    offset = data.writeWord(offset, 0x19cfcbf0)
    offset = data.writeWord(offset, 0xf9aaa91)
    offset += 0x20
    offset = data.writeWord(offset, 0x9accba70)
    offset = data.writeWord(offset, 0x79baaa9)
    offset = data.writeWord(offset, 0x9accba70)
    offset = data.writeWord(offset, 0x79baaa9)
    offset = data.writeWord(offset, 0x9ac3ba70)
    offset = data.writeWord(offset, 0x79baaa9)
    offset = data.writeWord(offset, 0x9a3c3a70)
    offset = data.writeWord(offset, 0x79baaa9)
    offset += 0x20
    offset = data.writeWord(offset, 0xabccaf00)
    offset = data.writeWord(offset, 0x79baaa)
    offset = data.writeWord(offset, 0xabccaf00)
    offset = data.writeWord(offset, 0x79baaa)
    offset = data.writeWord(offset, 0xabccaf00)
    offset = data.writeWord(offset, 0x79baaa)
    offset = data.writeWord(offset, 0xabccaf00)
    offset = data.writeWord(offset, 0x79baaa)
    offset += 0x20
    offset = data.writeWord(offset, 0xbbbaf000)
    offset = data.writeWord(offset, 0x79bab)
    offset = data.writeWord(offset, 0xbbbaf000)
    offset = data.writeWord(offset, 0x79bab)
    offset = data.writeWord(offset, 0xbbbaf000)
    offset = data.writeWord(offset, 0x79bab)
    offset = data.writeWord(offset, 0xbbbaf000)
    offset = data.writeWord(offset, 0x79bab)
    offset += 0x20
    offset = data.writeWord(offset, 0xaaa70000)
    offset = data.writeWord(offset, 0x79aa)
    offset = data.writeWord(offset, 0xaaa70000)
    offset = data.writeWord(offset, 0x79aa)
    offset = data.writeWord(offset, 0xaaa70000)
    offset = data.writeWord(offset, 0x79aa)
    offset = data.writeWord(offset, 0xaaa70000)
    offset = data.writeWord(offset, 0x79aa)
    offset += 0x20
    offset = data.writeWord(offset, 0xf7600000)
    offset = data.writeWord(offset, 0x67f)
    offset = data.writeWord(offset, 0xf7600000)
    offset = data.writeWord(offset, 0x67f)
    offset = data.writeWord(offset, 0xf7600000)
    offset = data.writeWord(offset, 0x67f)
    offset = data.writeWord(offset, 0xf7600000)
    offset = data.writeWord(offset, 0x67f)
    return data
  }

  function applyAntiFreezePatches() {
    const data = new checked()
    // Patch screen freeze value - eldri7ch
    data.writeChar(0x00140a2c, 0x00)	// Patch from Boss-Rush / MottZilla
    return data
  }

  function applyMyPursePatches() {
    const data = new checked()
    // Patch Death goes home - eldri7ch
    data.writeWord(0x04baea08, 0x18000006)	// Patch from Boss-Rush / MottZilla
    return data
  }

  function applyMapColor(mapcol) {	// Researched by MottZilla & eldri7ch. Function by eldri7ch
    const data = new checked()
    const addressAl = 0x03874848 //define address for alucard maps
    const addressRi = 0x038C0508 //define address for richter maps
    const addressAlBord = 0x03874864 //define address for alucard maps borders
    const addressRiBord = 0x038C0524 //define address for richter maps borders
    let colorWrite
    let bordWrite
    // Patch map colors - eldri7ch
    switch (mapcol) {
    case 'u': // Dark Blue
      colorWrite = 0xb0000000
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      break
    case 'r': // Crimson
      colorWrite = 0x80500000
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      break
    case 'n': // Brown
      colorWrite = 0x80ca0000
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      break
    case 'g': // Dark Green
      colorWrite = 0x09000000
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      break
    case 'y': // Gray
      colorWrite = 0xc20d0000
      bordWrite = 0xffff
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      data.writeShort(addressAlBord,bordWrite)
      data.writeShort(addressRiBord,bordWrite)
      break
    case 'p': // Purple
      colorWrite = 0xB0080000
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      break
    case 'k': // Pink
      colorWrite = 0xf4b40000
      bordWrite = 0xfe9e
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      data.writeShort(addressAlBord,bordWrite)
      data.writeShort(addressRiBord,bordWrite)
      break
    case 'b': // Black
      colorWrite = 0x10000000
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      break
    case 'i': // invisible
      colorWrite = 0x00000000
      data.writeWord(addressAl, colorWrite)
      data.writeWord(addressRi, colorWrite)
      break
    }
    return data
  }

  function applyNewGoals(nGoal) {	// Research and function by MottZilla & eldri7ch.
    const data = new checked()
    const jmpAddr = 0x04fcf814                                                  // define address to hook
    const funcAddress = 0x04fe4f68                                              // define address for functions (inside Black Marble Gallery Overlay)
    let offset
                                                                                // Patch new goals - eldri7ch
    switch (nGoal) {
    case 'b':                                                                   // All Bosses
      offset = jmpAddr
      data.writeWord(offset, 0x08074fbc)

      offset = funcAddress
      offset = data.writeWord(offset, 0x3C108003)
      offset = data.writeWord(offset, 0x3610CA2C)
      offset = data.writeWord(offset, 0x3C118003)
      offset = data.writeWord(offset, 0x3631CA80)
      offset = data.writeWord(offset, 0x8E120000)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x12400005)
      offset = data.writeWord(offset, 0x26100004)
      offset = data.writeWord(offset, 0x1611FFFB)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x080704E4)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x080705E4)
      offset = data.writeWord(offset, 0x00000000)

      offset = 0x04fcf7f3                                                       // Remove need for Vlads
      data.writeChar(offset, 0x34)
      break
    case 'r':                                                                   // All Relics
      offset = jmpAddr
      data.writeWord(offset, 0x08074fbc)

      offset = funcAddress
      offset = data.writeWord(offset, 0x3C108009)
      offset = data.writeWord(offset, 0x36107964)
      offset = data.writeWord(offset, 0x3C118009)
      offset = data.writeWord(offset, 0x3631797B)
      offset = data.writeWord(offset, 0x92120000)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x1240000F)
      offset = data.writeWord(offset, 0x26100001)
      offset = data.writeWord(offset, 0x1611FFFB)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x3C108009)
      offset = data.writeWord(offset, 0x3610797D)
      offset = data.writeWord(offset, 0x3C118009)
      offset = data.writeWord(offset, 0x36317982)
      offset = data.writeWord(offset, 0x92120000)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x12400005)
      offset = data.writeWord(offset, 0x26100001)
      offset = data.writeWord(offset, 0x1611FFFB)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x080704E4)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x080705E4)
      offset = data.writeWord(offset, 0x00000000)
      break
    case 'a':                                                                   // All Bosses & Relics (ABRSR)
      offset = jmpAddr
      data.writeWord(offset, 0x08074fbc)

      offset = funcAddress
      offset = data.writeWord(offset, 0x3C108003)
      offset = data.writeWord(offset, 0x3610CA2C)
      offset = data.writeWord(offset, 0x3C118003)
      offset = data.writeWord(offset, 0x3631CA80)
      offset = data.writeWord(offset, 0x8E120000)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x12400019)
      offset = data.writeWord(offset, 0x26100004)
      offset = data.writeWord(offset, 0x1611FFFB)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x3C108009)
      offset = data.writeWord(offset, 0x36107964)
      offset = data.writeWord(offset, 0x3C118009)
      offset = data.writeWord(offset, 0x3631797B)
      offset = data.writeWord(offset, 0x92120000)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x1240000F)
      offset = data.writeWord(offset, 0x26100001)
      offset = data.writeWord(offset, 0x1611FFFB)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x3C108009)
      offset = data.writeWord(offset, 0x3610797D)
      offset = data.writeWord(offset, 0x3C118009)
      offset = data.writeWord(offset, 0x36317982)
      offset = data.writeWord(offset, 0x92120000)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x12400005)
      offset = data.writeWord(offset, 0x26100001)
      offset = data.writeWord(offset, 0x1611FFFB)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x080704E4)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x080705E4)
      offset = data.writeWord(offset, 0x00000000)
      break
    case 'v':                                                                   // All Bosses All Vlads
      offset = jmpAddr
      data.writeWord(offset, 0x08074fbc)

      offset = funcAddress
      offset = data.writeWord(offset, 0x3C108003)
      offset = data.writeWord(offset, 0x3610CA2C)
      offset = data.writeWord(offset, 0x3C118003)
      offset = data.writeWord(offset, 0x3631CA80)
      offset = data.writeWord(offset, 0x8E120000)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x1240000F)
      offset = data.writeWord(offset, 0x26100004)
      offset = data.writeWord(offset, 0x1611FFFB)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x3C108009)
      offset = data.writeWord(offset, 0x3610797D)
      offset = data.writeWord(offset, 0x3C118009)
      offset = data.writeWord(offset, 0x36317982)
      offset = data.writeWord(offset, 0x92120000)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x12400005)
      offset = data.writeWord(offset, 0x26100001)
      offset = data.writeWord(offset, 0x1611FFFB)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x080704E4)
      offset = data.writeWord(offset, 0x00000000)
      offset = data.writeWord(offset, 0x080705E4)
      offset = data.writeWord(offset, 0x00000000)
      break
    }

    // insert code to help the tracker here.
    return data
  }

  function applyiwsPatches() {
    const data = new checked()
    // Patch wing smash duration - eldri7ch
    data.writeChar(0x00134074, 0x00)	// Patch from Bat-Master / MottZilla
    return data
  }

  function applyfastwarpPatches() {
    const data = new checked()
    // Patch warp animation speed - eldri7ch
    data.writeChar(0x0588be90, 0x02)	// Patch from Aperture / MottZilla
    data.writeChar(0x05a78fe4, 0x02)
    return data
  }

  function applynoprologuePatches() {
    const data = new checked()
    // Patch prologue removal; specifically setting the first room to enter as NO3 instead of ST0 - eldri7ch
    let offset

    data.writeChar(0x04392b1c, 0x41)	              // Patch from Chaos-Lite / MottZilla

    offset = 0x00119b98                             // hook address to reset time attack
    offset = data.writeWord(offset,0x0803fef0)      // place hook in relic reset
    offset = data.writeWord(offset,0x00000000)

    offset = 0x001199b8                             // start code in richter (no use in no-prologue)
    offset = data.writeWord(offset,0xa0600000)      // reset the time attack to allow bosses to spawn
    offset = data.writeWord(offset,0x2610ffff)
    offset = data.writeWord(offset,0x0601fffd)
    offset = data.writeWord(offset,0x2463ffff)
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x3c038003)
    offset = data.writeWord(offset,0x3463ca28)
    offset = data.writeWord(offset,0x3410001b)
    offset = data.writeWord(offset,0xac600000)
    offset = data.writeWord(offset,0x2610ffff)
    offset = data.writeWord(offset,0x0601fffd)
    offset = data.writeWord(offset,0x24630004)
    offset = data.writeWord(offset,0x0803ff6c)
    offset = data.writeWord(offset,0x00000000)

    return data
  }

  function applyunlockedPatches() {
    const data = new checked()
    const tileRemove = 0x00000000 //set tile overwrites to remove them
    const memorySkip = 0x34020001 //set register 2 to 01 instead of whatever RAM said
    const nopValue = 0x00000000 //nop instruction follow-up
    // Patch the reverse entrance shortcut - eldri7ch
    let offset = 0x051caaee           // remove the blocking tiles - eldri7ch
    data.writeWord(offset,tileRemove)
    offset += 0x40
    data.writeWord(offset,tileRemove)
    offset += 0x40
    data.writeWord(offset,tileRemove)
    offset += 0x40
    data.writeWord(offset,tileRemove)
    offset += 0x40
    data.writeWord(offset,tileRemove)
    offset += 0x40
    data.writeWord(offset,tileRemove)
    offset += 0x40
    data.writeWord(offset,tileRemove)
    offset += 0x40
    data.writeWord(offset,tileRemove)
    data.writeShort(0x051b03c2,0x030e) // move the entity down - eldri7ch
    data.writeShort(0x051afb80,0x030e)
    // Patch Underground Caverns - Entrance shortcut - eldri7ch
    offset = 0x05430050
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x05430518
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04ba840c
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04ba88ac
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    // Patch Marble Gallery - Entrance shortcut - eldri7ch
    offset = 0x04ba8bc4
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04ba8dd4
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04ba8e00
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04ba918c
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04ba91b4
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x05430844
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x05430a80
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x05430bd0
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x05430e3c
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x05430e64
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    // Patch Warp Room - Entrance shortcut - eldri7ch
    offset = 0x04bab2d4
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04bab534
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04bab674
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x054325dc
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x0543283c
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x0543297c
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    // Patch Olrox's Quarters - Royal Chapel shortcut - eldri7ch
    offset = 0x046c082c
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    // Patch Colosseum - Royal Chapel shortcut - eldri7ch
    offset = 0x0440100c
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    offset = 0x04401100
    offset = data.writeWord(offset,memorySkip)
    offset = data.writeWord(offset,nopValue)
    return data
  }

  function applysurprisePatches() {
    const data = new checked()
    const spritePal = 0x01020111 //set tile overwrites to remove them
    // Patch the sprites for each relic - eldri7ch; code by MottZilla
    let offset = 0x000b5550           // start with Soul of Bat - eldri7ch
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x140
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    data.writeWord(offset,spritePal)
    offset += 0x10
    return data
  }

  function applyenemyStatRandoPatches(rng,chaos) {
    const enemyStats = enemies.enemyStats
    const data = new checked()
    // Patch the enemy stats being randomized
    let offset                                                                  // enemy offset addr - eldri7ch
    let hexOffset                                                               // the offset converted to hex
    let statHp                                                                  // The starting HP amount
    let newHp                                                                   // The adjusted HP amount
    let statAtk                                                                 // The starting attack amount
    let newAtk                                                                  // The adjusted attack amount
    let statDef                                                                 // The starting defense amount
    let newDef                                                                  // The adjusted defense amount
    let disclosureCard                                                          // Tracks the disclosure card contents before they are applied to the name of the enemy
    let newAtkType                                                              // The new damage type for an attack
    let newWeakType                                                             // The new damage type for weakness stat
    let newResistType                                                           // The new damage type for resist stat
    let newImmuneType                                                           // The new damage type for Guard / Absorb stat
    let newDisclosure                                                           // this is a holding spot for re-formatting before inclusion into the main disclosure
    let newResistDisclosure                                                     // Adding new disclosure info for the weakness resist
    let childIter                                                               // The counter for iterating through child entities of an enemy
    let childrenType                                                            // Stores the type of variable returned for "children" flag
    let bossChildAtkType                                                        // Randomizing the elements of certain boss 
    let newHpMod
    let newAtkMod
    let newDefMod

    enemyStats.forEach(function(enemy) {
      statHp = enemy.hpValue                                                    // obtain the HP value from the enemy data
      statAtk = enemy.atkValue                                                  // obtain the Atk value from the enemy data
      statDef = enemy.defValue                                                  // obtain the Def value from the enemy data

      // console.log(enemy.index + ' ' + enemy.name)
      
      newHpMod = ((Math.floor(rng() * 175) +25)/ 100)                           // select a random % between 25% and 200%
      newHp = enemyNumStatRand(newHpMod,statHp)                                 // Randomly adjust by 25%-200%
      data.writeShort(enemy.hpOffset,newHp)                                     // Write the HP
      switch(enemy.index){
        case 27:                                                                // special condition for Merman
          statHp = 10                                                           // HP = 10
          newHp = enemyNumStatRand(newHpMod,statHp)                             // Randomize HP
          data.writeShort(0x0b5ce4,newHp)                                       // Assign the new HP value
          break
        case 14:                                                                // special condition for Flying Zombie
          statHp = 190                                                          // HP = 190
          newHp = enemyNumStatRand(newHpMod,statHp)                             // Randomize HP
          data.writeShort(0x0b5ab4,newHp)                                       // Assign the new HP value
          break
        case 45:                                                                // special condition for Bone ark
          statHp = 140                                                          // HP = 140
          newHp = enemyNumStatRand(newHpMod,statHp)                             // Randomize HP
          data.writeShort(0x0b60bc,newHp)                                       // Assign the new HP value
          break
        case 158:                                                               // special condition for Corpse weed
          statHp = 20                                                           // HP = 20
          newHp = enemyNumStatRand(newHpMod,statHp)                             // Randomize HP
          data.writeShort(0x0b74c4,newHp)                                       // Assign the new HP value
          break
        case 161:                                                               // special condition for venus weed
          statHp = 500                                                          // HP = 500
          newHp = enemyNumStatRand(newHpMod,statHp)                             // Randomize HP
          data.writeShort(0x0b753c,newHp)                                       // Assign the new HP value
          break
        case 392:                                                               // special condition for blue venus weed
          statHp = 550                                                          // HP = 500
          newHp = enemyNumStatRand(newHpMod,statHp)                             // Randomize HP
          data.writeShort(0x0b9e14,newHp)                                       // Assign the new HP value
          break
      }

      newAtkMod = ((Math.floor(rng() * 175) +25)/ 100)                          // select a random % between 25% and 200%
      newAtk = enemyNumStatRand(newAtkMod,statAtk)                              // Randomly adjust by 25%-200%
      data.writeShort(enemy.atkOffset,newAtk)                                   // Write the Atk
      switch (enemy.index){
        case 379:                                                               // special condition for Dracula
          statAtk = 70                                                          // Hand attack = 70
          newAtk = enemyNumStatRand(newAtkMod,statAtk)                          // Randomize Hand attack
          data.writeShort(0x0b9c0e,newAtk)                                      // Assign the new attack value
          break
        case 27:                                                                // special condition for Merman
          statAtk = 14                                                          // Hand attack = 70
          newAtk = enemyNumStatRand(newAtkMod,statAtk)                          // Randomize Hand attack
          data.writeShort(0x0b5ce6,newAtk)                                      // Assign the new attack value
          break
        case 14:                                                                // special condition for Flying Zombie
          statAtk = 37                                                          // Hand attack = 37
          newAtk = enemyNumStatRand(newAtkMod,statAtk)                          // Randomize Hand attack
          data.writeShort(0x0b5ab6,newAtk)                                      // Assign the new attack value
          break
        case 45:                                                                // special condition for Bone ark
          statAtk = 20                                                          // Hand attack = 20
          newAtk = enemyNumStatRand(newAtkMod,statAtk)                          // Randomize Hand attack
          data.writeShort(0x0b60be,newAtk)                                      // Assign the new attack value
          break
        case 158:                                                               // special condition for Corpse weed
          statAtk = 20                                                          // Hand attack = 20
          newAtk = enemyNumStatRand(newAtkMod,statAtk)                          // Randomize Hand attack
          data.writeShort(0x0b74c6,newAtk)                                      // Assign the new attack value
          break
        case 161:                                                               // special condition for venus weed
          statAtk = 28                                                          // Hand attack = 28
          newAtk = enemyNumStatRand(newAtkMod,statAtk)                          // Randomize Hand attack
          data.writeShort(0x0b753e,newAtk)                                      // Assign the new attack value
          break
        case 392:                                                               // special condition for blue venus weed
          statAtk = 45                                                          // Hand attack = 28
          newAtk = enemyNumStatRand(newAtkMod,statAtk)                          // Randomize Hand attack
          data.writeShort(0x0b9e16,newAtk)                                      // Assign the new attack value
          break
      }

      newDefMod = ((Math.floor(rng() * 175) +25)/ 100)                          // select a random % between 25% and 200%
      newDef = enemyNumStatRand(newDefMod,statDef)                              // Randomly adjust by 25%-200%
      data.writeShort(enemy.defOffset,newDef)                                   // Write the Def
      switch (enemy.index) {
        case 379:                                                               // special condition for Dracula
          statDef = 20                                                          // Hand defense = 20
          newDef = enemyNumStatRand(newDefMod,statDef)                          // Randomize Hand defense
          data.writeShort(0x0b9c12,newDef)                                      // Assign the new defense value
          break
        case 27:                                                                // special condition for Merman
          statDef = 1                                                           // Defense = 1
          newDef = enemyNumStatRand(newDefMod,statDef)                          // Randomize defense
          data.writeShort(0x0b5ce6,newDef)                                      // Assign the new defense value
          break
        case 14:                                                                // special condition for Flying Zombie
          statDef = 10                                                          // Defense = 10
          newDef = enemyNumStatRand(newDefMod,statDef)                          // Randomize defense
          data.writeShort(0x0b5aba,newDef)                                      // Assign the new defense value
          break
        case 45:                                                                // special condition for Bone ark
          statDef = 2                                                           // Defense = 2
          newDef = enemyNumStatRand(newDefMod,statDef)                          // Randomize defense
          data.writeShort(0x0b60c2,newDef)                                      // Assign the new defense value
          break
        case 158:                                                               // special condition for corpse weed
          statDef = 1                                                           // Defense = 1
          newDef = enemyNumStatRand(newDefMod,statDef)                          // Randomize defense
          data.writeShort(0x0b74ca,newDef)                                      // Assign the new defense value
          break
        case 161:                                                               // special condition for venus weed
          statDef = 1                                                           // Defense = 1
          newDef = enemyNumStatRand(newDefMod,statDef)                          // Randomize defense
          data.writeShort(0x0b7542,newDef)                                      // Assign the new defense value
          break
        case 392:                                                               // special condition for blue venus weed
          statDef = 1                                                           // Defense = 1
          newDef = enemyNumStatRand(newDefMod,statDef)                          // Randomize defense
          data.writeShort(0x0b9e1a,newDef)                                      // Assign the new defense value
          break
      }

      newAtkType = enemyAtkTypeStatRand(rng)                                    // Select a random attack type
      data.writeShort(enemy.atkTypeOffset,newAtkType)                           // Write the attack type
      switch (enemy.index) {
        case 279:                                                               // special condition for Dracula
          data.writeShort(0x0b9c10,newAtkType)                                  // Assign the new attack type
          break
        case 246:                                                               // Special case for axe knights
          data.writeShort(0x0b9f08,newAtkType)                                  // Assign the new attack type to the Green Axe Knights as well
          break
        case 146:                                                               // special condition for Dhuron
          data.writeShort(0x0b72e8,newAtkType)                                  // Assign the new attack type
          break
      }
      childrenType = typeof enemy.children
      if(childrenType !== 'undefined') {                                        // Start the process of assigning the new damage type to the child entities of an enemy
        childIter = 1                                                           // Minimum jump will be 0x28 which is 40 in dec. 1 * 40
        offset = enemy.atkTypeOffset + (childIter * 0x28)                       // now we're writing to the offset set to 0x28 * [ordinal of children] plus the base address
        while(childIter <= enemy.children){                                     // make this a while loop so that it should include the max
          if ([55,71,233,253,287,296,300,307,324,342,351,356,372,379].includes(enemy.index) || chaos === true) { // Certain bosses will have non-uniform attack elements
            bossChildAtkType = enemyAtkTypeStatRand(rng)                        // Establish a new attack type for each child
            data.writeShort(offset,bossChildAtkType)                             // make sure that new attack elements are used for all children by writing
            offset += 0x28                                                      // advance offset by 0x28
            childIter++                                                         // advance the iteration once every time this loops
          } else {                                                              // Normal enemies will have their other attacks share a type with their body
            data.writeShort(offset,newAtkType)                                   // make sure that the same attack element is used for all children by writing
            offset += 0x28                                                      // advance offset by 0x28
            childIter++                                                         // advance the iteration once every time this loops
          }
        }
      }

      newWeakType = enemyWeakTypeStatRand(rng)                                  // Select a random weakness type
      data.writeShort(enemy.weakOffset,newWeakType)                             // Write the weakness type
      switch (enemy.index) {
        case 379:                                                               // special condition for Dracula
          data.writeShort(0x0b9c16,newWeakType)                                 // Assign the new weakness type
          break
        case 27:                                                                // special condition for Merman
          data.writeShort(0x0b5cee,newWeakType)                                 // Assign the new weakness type
          break
        case 14:                                                                // special condition for Flying Zombie
          data.writeShort(0x0b5abe,newWeakType)                                 // Assign the new weakness type
          break
        case 45:                                                                // special condition for Bone ark
          data.writeShort(0x0b60c6,newWeakType)                                 // Assign the new weakness type
          break
        case 158:                                                               // special condition for Corpse weed
          data.writeShort(0x0b74ce,newWeakType)                                 // Assign the new weakness type
          break
        case 161:                                                               // special condition for venus weed
          data.writeShort(0x0b7546,newWeakType)                                 // Assign the new weakness type
          break
        case 392:                                                               // special condition for blue venus weed
          data.writeShort(0x0b9e1e,newWeakType)                                 // Assign the new weakness type
          break
      }

      newResistType = halfChanceElementRando(rng)                              // Select a random resist type
      while(newResistType === newWeakType){                                     // resist / immunity overlap removal
        newResistType = halfChanceElementRando(rng)
      }
      data.writeShort(enemy.resistOffset,newResistType)                         // Write the resist type
      switch (enemy.index) {
        case 379:                                                               // special condition for Dracula
          data.writeShort(0x0b9c18,newResistType)                               // Assign the new resist type
          break
        case 27:                                                                // special condition for Merman
          data.writeShort(0x0b5cf0,newResistType)                               // Assign the new weakness type
          break
        case 14:                                                                // special condition for Flying Zombie
          data.writeShort(0x0b5ac0,newResistType)                               // Assign the new weakness type
          break
        case 45:                                                                // special condition for Bone ark
          data.writeShort(0x0b60c8,newResistType)                                // Assign the new weakness type
          break
        case 158:                                                               // special condition for Corpse weed
          data.writeShort(0x0b74d0,newResistType)                               // Assign the new weakness type
          break
        case 161:                                                               // special condition for venus weed
          data.writeShort(0x0b7548,newResistType)                               // Assign the new weakness type
          break
        case 392:                                                               // special condition for blue venus weed
          data.writeShort(0x0b9e20,newResistType)                               // Assign the new weakness type
          break
      }

      switch (newResistType) {                                                  // create a new code for disclosure card based on weakness value
        case 0:
          newResistDisclosure = '3f'
        case 8192:
          newResistDisclosure = '03'
        case 16384:
          newResistDisclosure = '0f'
      }

      let resIndex = Math.floor(rng() * 100)                                    // select a random number between 0, 1 to choose which we use between guard, absorb
      resIndex = isEven(resIndex)
      switch (resIndex) {                                                       // start selection and execution process based on teh random selection
        case false: 
          offset = enemy.guardOffset                                            // Goto guard
          newImmuneType = halfChanceElementRando(rng)                          // Select a random guard type
          while(newImmuneType === newWeakType){                                 // weakness / immunity overlap removal
            newImmuneType = halfChanceElementRando(rng)
          }
          data.writeShort(offset,newImmuneType)                                 // Write the guard type
          switch (enemy.index) {
            case 379:                                                           // special condition for Dracula
              data.writeShort(0x0b9c1a,newImmuneType)                           // Assign the new guard type
              break
            case 27:                                                            // special condition for Merman
              data.writeShort(0x0b5cf2,newImmuneType)                           // Assign the new weakness type
              break
            case 14:                                                            // special condition for Flying zombie
              data.writeShort(0x0b5ac2,newImmuneType)                           // Assign the new weakness type
              break
            case 45:                                                            // special condition for Bone ark
              data.writeShort(0x0b60ca,newImmuneType)                           // Assign the new weakness type
              break
            case 158:                                                           // special condition for corpse weed
              data.writeShort(0x0b74d2,newImmuneType)                           // Assign the new weakness type
              break
            case 161:                                                           // special condition for venus weed
              data.writeShort(0x0b754a,newImmuneType)                           // Assign the new weakness type
              break
            case 392:                                                           // special condition for blue venus weed
              data.writeShort(0x0b9e22,newImmuneType)                           // Assign the new weakness type
              break
          }
          data.writeShort(enemy.absorbOffset,0x0000)                            // remove absorbs
          break
        case true:
          offset = enemy.absorbOffset                                           // Goto absorb
          newImmuneType = halfChanceElementRando(rng)                          // Select a random absorb type
          while(newImmuneType === newWeakType){                                 // weakness / immunity overlap removal
            newImmuneType = halfChanceElementRando(rng)
          }
          data.writeShort(offset,newImmuneType)                                 // Write the absorb type
          switch (enemy.index) {
            case 379:                                                           // special condition for Dracula
              data.writeShort(0x0b9c1c,newImmuneType)                           // Assign the new absorb type
              break
            case 27:                                                            // special condition for Merman
              data.writeShort(0x0b5cf4,newImmuneType)                           // Assign the new weakness type
              break
            case 14:                                                            // special condition for Flying zombie
              data.writeShort(0x0b5ac4,newImmuneType)                           // Assign the new weakness type
              break
            case 45:                                                            // special condition for Bone ark
              data.writeShort(0x0b60cc,newImmuneType)                           // Assign the new weakness type
              break
            case 158:                                                           // special condition for Corpse weed
              data.writeShort(0x0b74d4,newImmuneType)                           // Assign the new weakness type
              break
            case 161:                                                           // special condition for venus weed
              data.writeShort(0x0b754c,newImmuneType)                           // Assign the new weakness type
              break
            case 392:                                                           // special condition for blue venus weed
              data.writeShort(0x0b9e24,newImmuneType)                           // Assign the new weakness type
              break
          }
          data.writeShort(enemy.guardOffset,0x0000)                             // remove immunities
          break
      }

      disclosureCard = 'f0'                                                     // start the Disclosure with the attack elements by indicating a sword.
      newDisclosure = hexValueToDamageString(newAtkType)
      if (newDisclosure.startsWith('05')) {                                     // if the attack type is a 16% hit or cut, use %dam indicator
        replaceTextAtIndex(newDisclosure,'00',0)
        disclosureCard += '05'                                                  // if the % is used, space out the %
      } else if (newDisclosure.startsWith('3f')) {                              // if the attack was negated by becoming no hitbox or guard, use no-hit indicator
        replaceTextAtIndex(newDisclosure,'00',0)
        disclosureCard += '3f'                                                  // if the % is used, space out the _
      } else if (newAtk > statAtk) {                                            // Determine the direction of the arrow based on the attack stat differences
        disclosureCard += 'e2'
      } else {
        disclosureCard += 'e6'
      }
      disclosureCard += newDisclosure + 'f1'                                    // continue the Disclosure with the defense elements by indicating a shield.
      if (((newHpMod + newDefMod) / 2) > 1) {                                   // Determine the direction of the arrow based on the attack stat differences
        disclosureCard += 'e2'
      } else {
        disclosureCard += 'e6'
      }                                                  
      newDisclosure = hexValueToDefenceString(newWeakType).slice(-2)            // create a new code for disclosure card based on weakness value
      disclosureCard += newDisclosure
      newDisclosure = hexValueToDefenceString(newResistType).slice(-2)          // create a new code for disclosure card based on Resist value
      disclosureCard += newDisclosure
      switch (resIndex) {                                                       // This is already selected above between guard and absorb
        case false:                                                             // Process if Guard
          disclosureCard += 'f7'                                                // add final character to Disclosure Card 3
          newDisclosure = hexValueToDefenceString(newImmuneType).slice(-2)      // indicate that this is a guard
          disclosureCard += newDisclosure                                       // adds indicators to tell the player what guard the monster has
          break
        case true:                                                              // Process if Absorb
          disclosureCard += 'f6'                                                // add final character to Disclosure Card 3
          newDisclosure = hexValueToDefenceString(newImmuneType).slice(-2)      // indicate that this is an absorb ex: é↓#!HLâ↑I/FàS (11)
          disclosureCard += newDisclosure                                       // adds indicators to tell the player what absorb the monster has
          break
      }
      disclosureCard += 'ff'                                                    // cap the label
      while (disclosureCard.length < 24) {                                      // add zeroes to space out different names from before
        disclosureCard += '00'
      }
      if ([55,295,356,379].includes(enemy.index)) {                             // exclude enemies who cannot have new name data written
      } else {
        offset = enemy.newNameText                                              // pull enemy name location in BIN
        for (let i = 0; i < disclosureCard.length; i += 2) {                    // write 1 byte at a time
          const twoChars = '0x' + disclosureCard.slice(i, i + 2)
          offset = data.writeChar(offset,twoChars)
        }
      }
      data.writeWord(enemy.nameOffset,enemy.newNameReference)                   // Change the reference for the name to match the new address for the disclosure.
    })

    offset = 0x0f6138                                                           // move to writing normal / extra name content
    let normalNames = '0024524143554C41FF0027414C414D4F5448FF00F700214C4CFF00274F4F44002C55434BFF00' // identify what to write: "Dracula Galamoth Immune All Good Luck"

    for (let i = 0; i < normalNames.length; i += 2) {                           // write 1 byte at a time
      const twoChars = '0x' + normalNames.slice(i, i + 2)
      offset = data.writeChar(offset,twoChars)
    }

    offset = 0x0b9ca8                                                           // Fix Stone Skull reference
    data.writeWord(offset,0x800e0cf4)                                           // Shows Immune All

    offset = 0x0b5ce0                                                           // fix Merman Name reference
    data.writeWord(offset,0x800e0c5c)                                           // Make both mermen use the same name

    offset = 0x0b5ab0                                                           // fix Flying zombie Name reference
    data.writeWord(offset,0x800e0c98)                                           // Make both halves use the same name

    offset = 0x0b60b8                                                           // fix Bone ark Name reference
    data.writeWord(offset,0x800e0bfc)                                           // Make both Bone ark sections use the same name
    
    offset = 0x0b74c0                                                           // fix corpse weed Name reference
    data.writeWord(offset,0x800e092c)                                           // Make both corpse weed use the same name

    offset = 0x0b7538                                                           // fix venus weed Name reference
    data.writeWord(offset,0x800e0920)                                           // Make both venus weed use the same name

    offset = 0x0b9e10                                                           // fix blue venus weed Name reference
    data.writeWord(offset,0x800e05e4)                                           // Make both blue venus weed use the same name

    const faerieScrollForceAddresses = constants.faerieScrollForceAddresses     // summon the faerie scroll force on locations

    faerieScrollForceAddresses.forEach(function(address) {
      const forceOn = 0x34020003                                                // Faerie Scroll is forced "on"
      const forceNop = 0x00000000                                               // replace the line after with a 'nop' that negates the other half of the data move to r2
      offset = address

      offset = data.writeWord(offset,forceOn)                                   // Overwrite the first half of the movbp instr
      data.writeWord(offset,forceNop)                                           // Overwrite the second half of the movbp instr
    })

    return data
  }

  function applyElemChaosPatches(rng) {
    const data = new checked()
    const handItems = equipment.handItems
    const wearItems = equipment.wearableItems
    const specials = equipment.weaponSpecials
    const spellsArr = spells
    let offset
    let newElem                                                                 // first weapon element offset
    let weakElem
    let resistElem
    let guardElem
    let absorbElem

    handItems.forEach(function(item) {
      // console.log(item.index + ' ' + item.itemName)
      newElem = weaponElemRando(rng)                                            // assign a new element
      if (item.categoryHex === 0x09) {                                          // special circumstance where we re-roll cut and bludgeon off of shields
        while ([0x0040,0x0020].includes(newElem)) {
          newElem = weaponElemRando(rng)
        }
      }
      offset = item.elementOffset
      data.writeShort(offset,newElem)                                           // write the new elemental value
    })

    // this process will randomize wearable items weak / resist / guard / absorb. it is intended that we will have very few absorbs compared to anything else by the 
    // nature of the fact that it is the last thing rolled. Each of these has a 50% chance to be nothing each time it is rolled, so if it initially rolls something 
    // that is the same as a previous element then it has another 66%/50%/66%/75% chance to roll nothing. This also means that Alucard will invariably become weak to more things.
    
    wearItems.forEach(function(item) {                                          // start the randomization process for armor, helms, capes, and rings to have random attributes.
      // console.log(item.index + ' ' + item.itemName)
      weakElem = thirdChanceElementRando(rng)                                    // Assign a random element to potentially be weak to
      offset = item.elemWeakOffset
      data.writeShort(offset,weakElem)                                          // Commit writes

      resistElem = halfChanceElementRando(rng)                                  // initial randomization of resist
      if (resistElem !== 0x0000) {                                              // don't re-randomize if resist is nothing
        while ([weakElem].includes(resistElem)) {                               // If it's not nothing, then change what it is if it's the same as weak
          resistElem = halfChanceElementRando(rng)
        }
      }
      offset = item.elemResistOffset
      data.writeShort(offset,resistElem)                                        // Commit writes

      guardElem = thirdChanceElementRando(rng)                                  // initial randomization of guard
      if (guardElem !== 0x0000) {                                               // don't re-randomize if guard is nothing
        while ([weakElem,resistElem].includes(guardElem)) {                     // If it's not nothing, then change what it is if it's the same as anything before
          guardElem = halfChanceElementRando(rng)
        }
      }
      offset = item.elemGuardOffset
      data.writeShort(offset,guardElem)                                         // Commit writes

      absorbElem = quarterChanceElementRando(rng)                               // initial randomization of absorb
      if (absorbElem !== 0x0000) {                                              // don't re-randomize if guard is nothing
        while ([weakElem,resistElem,guardElem].includes(absorbElem)) {          // If it's not nothing, then change what it is if it's the same as anything before
          absorbElem = halfChanceElementRando(rng)
        }
      }
      offset = item.elemAbsorbOffset
      data.writeShort(offset,absorbElem)                                        // Commit writes
    })

    spellsArr.forEach(function(spell) {                                         // cycle through spells (and familiar and xform damages)
      console.log(spell.spellName)
      newElem = weaponElemRando(rng)                                            // identify new element
      offset = spell.spellElementOffset                                         // assign offset to update
      data.writeShort(offset,newElem)                                           // Commit writes
    })

    subWeapons.forEach(function(subWea) {                                       // cycle through spells (and familiar and xform damages)
      // console.log(subWea.subWeaName)
      newElem = weaponElemRando(rng)                                            // identify new element
      offset = subWea.elemOffset                                                // assign offset to update
      data.writeShort(offset,newElem)                                           // Commit writes
    })

    specials.forEach(function(special) {                                        // cycle through weapon specials (and shield spells)
      // console.log(special.itemName)
      newElem = weaponElemRando(rng)                                            // identify new element
      offset = special.elementOffset                                            // assign offset to update
      data.writeShort(offset,newElem)                                           // Commit writes
    })

    return data
  }

  function applyShopPriceRandoPatches(rng) {
    const shopItemsData = constants.shopItemsData
    const data = new checked()
    // Patch the shop prices being randomized
    let oldItemPrice
    let newItemPrice
    let itemShuffArray = []
    
    shopItemsData.forEach(function(item) {                                      // Randomize the price to be 50% - 150% of the original price
      oldItemPrice = item.itemPriceD                                            // pull the base decimal value of the price
      newItemPrice = itemPriceStatRand(rng,oldItemPrice)                        // randomize the price using a function and oputput into hex

      itemShuffArray.push(newItemPrice)                                         // store the new price in a temp array
    })

    itemShuffArray = shuffle(rng,itemShuffArray)                                // Randomly shuffle the list of prices

    shopItemsData.forEach(function(item) {                                      // cycle through the item list and pull the last shuffled price from the tmp array and write it.
      data.writeWord(item.priceAddress,itemShuffArray.pop())
    })

    return data
  }

// Written By: MottZilla
// Selects 5 Enemies as Bounty Hunter Targets, sets their drops and applies hints to the Cards.
function applyBountyHunterTargets(rng,bhmode) {
	const bountyHunterTargets = enemies.bountyHunterTargets
	const data = new checked()
	
  // console.log('Apply BH components')
	let TargetHeartId,TargetToothId,TargetRibId,TargetRingId,TargetEyeId
	let TargetHeartEnemyId,TargetToothEnemyId,TargetRibEnemyId,TargetRingEnemyId,TargetEyeEnemyId	
	let VladDropRate = 16
	let offset
	let EBase = 0xB5858
	let dindex = 6
	
	// Support Functions
	function getEnemyOffset(id)
	{
		let offset_e,offset_s
		offset_e = id * 0x28
		offset_s = Math.floor((offset_e+0x100) / 0x800) * 0x130
		return EBase + offset_e + offset_s
	}
	
	function writeTargetText(TargetOfs)
	{
		TargetOfs = data.writeWord(TargetOfs,0x47524154)	// TARG
		TargetOfs = data.writeShort(TargetOfs,0x5445)		// ET
		TargetOfs = data.writeChar(TargetOfs,0x20)			// ' '		
		return TargetOfs
	}
	
	function writeEnemyText(TargetId)
	{
		for(let i = 0; i < bountyHunterTargets[TargetId].name.length; i++)
		{	offset = data.writeChar(offset,bountyHunterTargets[TargetId].name.charCodeAt(i) )	}
		data.writeChar(offset,0)	// String Termination
	}
	
	function writeTargetData(Id,EnemyId,HintOffset,VladNumber)
	{
		offset = getEnemyOffset(EnemyId)
		data.writeShort(offset + 0x1A,0xB5 + VladNumber)
		data.writeShort(offset + 0x1E,VladDropRate)
		if(bhmode == 2) { data.writeChar(offset + 0x25,0) }
		if(HintOffset > 0)
		{
			offset = writeTargetText(HintOffset)				// Writing Hint String
			writeEnemyText(Id)									// Write Enemy Name on Card
		}
	}
	
	function changeCardNames()
	{
		offset = 0xF5581							// Set Relic Name (Heart Card)
		offset = data.writeWord(offset,0x72616548)
		offset = data.writeChar(offset,0x74)
		offset = 0xF55AC							// Set Relic Name (Tooth Card)
		offset = data.writeWord(offset,0x746F6F54)
		offset = data.writeChar(offset,0x68)
		offset = 0xF55D9							// Set Relic Name (Rib Card)
		offset = data.writeWord(offset,0x20626952)
		offset = data.writeWord(offset,0x64726143)
		offset = data.writeChar(offset,0)
		offset = 0xF5608							// Set Relic Name (Ring Card)
		offset = data.writeWord(offset,0x676E6952)
		offset = data.writeWord(offset,0x72614320)
		offset = data.writeShort(offset,0x0064)
		offset = 0xF5635							// Set Relic Name (Eye Card)
		offset = data.writeWord(offset,0x20657945)
		offset = data.writeWord(offset,0x64726143)
		offset = data.writeChar(offset,0)
	}
	
	function enemyHasVlad(enemyId)
	{
		let VladReturn = 0
		// Handle Duplicates
		if(enemyId == 246) { enemyId = 6 }	// Axe Knight
		if(enemyId == 15) { enemyId = 14 }	// Flying Zombie
		if(enemyId == 29) { enemyId = 27 }	// Merman
		if(enemyId == 136 || enemyId == 138) { enemyId = 129 }	// Spectral sword
		if(enemyId == 159) { enemyId = 158 }	// CORPSEWEED
		if(enemyId == 162) { enemyId = 161 }	// VENUS WEED
		if(enemyId == 304) { enemyId = 303 }	// Medusa head
		if(enemyId == 393) { enemyId = 392 }	// Blue Venus WEED
		if(enemyId == 46) { enemyId = 45 }		// Bone ARK
		if(enemyId == 142 || enemyId == 143) { enemyId = 141 }	// OROBOUROUS
		
		if(TargetHeartEnemyId == enemyId) { VladReturn = 1 }
		if(TargetToothEnemyId == enemyId) { VladReturn = 2 }
		if(TargetRibEnemyId == enemyId) { VladReturn = 3 }
		if(TargetRingEnemyId == enemyId) { VladReturn = 4 }
		if(TargetEyeEnemyId == enemyId) { VladReturn = 5 }
		return VladReturn
	}
	
	function selectTargets()
	{
		TargetHeartId = TargetToothId = TargetRibId = TargetRingId = TargetEyeId = 0
		while(TargetHeartId == 0)
		{	TargetHeartId = Math.floor(rng() * Math.floor(bountyHunterTargets.length))	}
		TargetHeartEnemyId = bountyHunterTargets[TargetHeartId].enemyid						// Heart of Vlad - Pick Enemy Id
		while(TargetToothId == TargetHeartId || TargetToothId == 0)	
		{	TargetToothId = Math.floor(rng() * Math.floor(bountyHunterTargets.length))	}	// Tooth of Vlad - Pick Enemy Id (Can't match Heart)
		TargetToothEnemyId = bountyHunterTargets[TargetToothId].enemyid
		while(TargetRibId == TargetHeartId || TargetRibId == TargetToothId || TargetRibId == 0)	
		{	TargetRibId = Math.floor(rng() * Math.floor(bountyHunterTargets.length))	}	// Rib of Vlad - Pick Enemy Id (Can't Match Heart, Tooth)
		TargetRibEnemyId = bountyHunterTargets[TargetRibId].enemyid		
		while(TargetRingId == TargetHeartId || TargetRingId == TargetToothId || TargetRingId == TargetRibId || TargetRingId == 0)
		{	TargetRingId = Math.floor(rng() * Math.floor(bountyHunterTargets.length))	}	// Ring of Vlad - Pick Enemy Id (Can't Match Heart, Tooth, Rib)
		TargetRingEnemyId = bountyHunterTargets[TargetRingId].enemyid
		while(TargetEyeId == TargetHeartId || TargetEyeId == TargetToothId || TargetEyeId == TargetRibId || TargetEyeId == TargetRingId || TargetEyeId == 0)	
		{	TargetEyeId = Math.floor(rng() * Math.floor(bountyHunterTargets.length))	}	// Eye of Vlad - Pick Enemy Id (Can't Match Heart, Tooth, Rib, Ring)
		TargetEyeEnemyId = bountyHunterTargets[TargetEyeId].enemyid		
	}
	
	function handleDuplicateDefs()
	{
		if(enemyHasVlad(6) > 0)	// AXE KNIGHT
		{	writeTargetData(0,246,0,enemyHasVlad(6))	}		
		if(enemyHasVlad(14) > 0)	// FLYING ZOMBIE
		{	writeTargetData(0,15,0,enemyHasVlad(14))	}	
		if(enemyHasVlad(27) > 0)	// MERMAN
		{	writeTargetData(0,29,0,enemyHasVlad(27))	}
		if(enemyHasVlad(129) > 0)	// SPECTRAL SWORD
		{
			writeTargetData(0,136,0,enemyHasVlad(129))
			writeTargetData(0,138,0,enemyHasVlad(129))
		}
		if(enemyHasVlad(158) > 0)	// CORPSEWEED
		{	writeTargetData(0,159,0,enemyHasVlad(158))	}
		if(enemyHasVlad(161) > 0)	// VENUS WEED
		{	writeTargetData(0,162,0,enemyHasVlad(161))	}
		if(enemyHasVlad(303) > 0)	// MEDUSA HEAD
		{	writeTargetData(0,304,0,enemyHasVlad(303))	}
		if(enemyHasVlad(392) > 0)	// BLUE VENUS WEED
		{	writeTargetData(0,393,0,enemyHasVlad(392))	}
		if(enemyHasVlad(45) > 0)	// BONE ARK
		{	writeTargetData(0,46,0,enemyHasVlad(45))	}
		if(enemyHasVlad(141) > 0)	// OROBOUROUS
		{
			writeTargetData(0,142,0,enemyHasVlad(141))
			writeTargetData(0,143,0,enemyHasVlad(141))
			if(bhmode < 2) { data.writeChar(0xB6ED5,0x24) }
		}		
	}
	
	function checkForDropRateBoost()
	{
		if(bhmode > 0)	// bhmode ~ 0:Normal, 1:Hitman, 2:TargetConfirmed
		{
			while(dindex < 397)				// Buff item Drops for Hitman & Target Confirmed
			{
				if(enemyHasVlad(dindex) == 0)		// Only change Item Drop Rates on Enemies without Vlads.
				{
					offset = getEnemyOffset(dindex)
					data.writeShort(offset + 0x1E,16)
					data.writeShort(offset + 0x20,32)		
				}	
				dindex = dindex + 1
			}
		}		
	}
	
	// Execution
	if(bhmode > 0)
	{
		VladDropRate = 256	// Vlad Drop Rate increased for Hitman & Target Confirmed
	}
	selectTargets()
	writeTargetData(TargetHeartId,TargetHeartEnemyId,0xF5560,1)
	writeTargetData(TargetToothId,TargetToothEnemyId,0xF558C,2)
	writeTargetData(TargetRibId,TargetRibEnemyId,0xF55B8,3)
	writeTargetData(TargetRingId,TargetRingEnemyId,0xF55E8,4)
	writeTargetData(TargetEyeId,TargetEyeEnemyId,0xF5614,5)
	changeCardNames()
	handleDuplicateDefs()
	checkForDropRateBoost()
	
	return data
}

// Written By: MottZilla
// Changes Resist Potions to grant immunity and gives i-frames like Potion, High Potion, etc.
  function applyResistToImmunePotionsPatches() {
    // console.log('potions ran')
	  const data = new checked()
	  let offset = 0x13F7D8
	  offset = data.writeWord(offset,0x0C04D1FE)	// Assembly patch
	  offset = data.writeWord(offset,0x34040668)
	  offset = data.writeWord(offset,0x8E240018)
	  offset = data.writeWord(offset,0x00000000)
	  offset = data.writeWord(offset,0x2C8F0005)
	  offset = data.writeWord(offset,0x2C8E0080)
	  offset = data.writeWord(offset,0x15E00003)
	  offset = data.writeWord(offset,0x34040001)
	  offset = data.writeWord(offset,0x0C04385A)
	  offset = data.writeWord(offset,0x34050040)
	  offset = data.writeWord(offset,0x11C00003)
	  offset = data.writeWord(offset,0x8E240018)
	  offset = data.writeWord(offset,0x0C03FC3D)
	  offset = data.writeWord(offset,0x00000000)
	  offset = data.writeWord(offset,0x08048367)
	  offset = data.writeWord(offset,0x00000000)
	  // Assembly adjustmetns
	  data.writeChar(0x10D6DC,0x2C)
	  data.writeChar(0x10D6EC,0x2C)
	  data.writeChar(0x10D708,0x2C)
	  data.writeChar(0x10D718,0x2C)
	  data.writeChar(0x10D734,0x2C)
	  data.writeChar(0x10D744,0x2C)
	  data.writeChar(0x10D760,0x2C)
	  data.writeChar(0x10D770,0x2C)
	  data.writeChar(0x10D78C,0x2C)
	  data.writeChar(0x10D79C,0x2C)
	  data.writeChar(0x10D7E4,0x2C)
	  data.writeChar(0x10D7F4,0x2C)
	  // Name Change
	  offset = 0xF204C
	  offset = data.writeWord(offset,0x554D4D29)
	  offset = data.writeShort(offset,0x454E)
	  offset = 0xF2018
	  offset = data.writeWord(offset,0x554D4D29)
	  offset = data.writeShort(offset,0x454E)
	  offset = 0xF1FE8
	  offset = data.writeWord(offset,0x554D4D29)
	  offset = data.writeShort(offset,0x454E)
	  offset = 0xF1FB8
	  offset = data.writeWord(offset,0x554D4D29)
	  offset = data.writeShort(offset,0x454E)
	  offset = 0xF1F8C
	  offset = data.writeWord(offset,0x554D4D29)
	  offset = data.writeShort(offset,0x454E)
	  offset = 0xF1F60
	  offset = data.writeWord(offset,0x554D4D29)
	  offset = data.writeShort(offset,0x454E)
	  return data
  }

  function applyStartRoomRandoPatches(rng,castleFlag) {
    const startRoomData = constants.startRoomData
    const data = new checked()
    // Patch the starting room being randomized
    let offset
    let newWrite
    let randRoomId

    randRoomId = Math.floor(rng() * Math.floor(startRoomData.length))           // Select a starting room at random

    // Debug Messages
    // if(options.startRoomRandoMode){
    //   console.log("Starting Room Rando 1st Castle on!")
    // }

    // if(options.startRoomRando2ndMode){
    //   console.log("Starting Room Rando 2nd Castle on!")
    // }

    // console.log("Last Room in Data is: id = " + startRoomData[Math.floor(0.999 * (startRoomData.length))].id + " : " + startRoomData[Math.floor(0.999 * (startRoomData.length))].comment)
    // End of Debug Messages

    if(castleFlag === 0x01)        // 1st Castle Only
    {
      while(startRoomData[randRoomId].stage >= 0x20)
      {
        randRoomId = Math.floor(rng() * Math.floor(startRoomData.length))       // Re-roll if Room is 2nd Castle but we did not choose to include it.
      }
    }

    if(castleFlag === 0x10)        // 2nd Castle Only
    {
      while(startRoomData[randRoomId].stage < 0x20)
      {
        randRoomId = Math.floor(rng() * Math.floor(startRoomData.length))       // Re-roll if Room is 1st Castle but we did not choose to include it.
      }
    }
    
    // Old debug code
    /*while(startRoomData[randRoomId].id === undefined | startRoomData[randRoomId].xyWrite === undefined
      | startRoomData[randRoomId].roomWrite === undefined | startRoomData[randRoomId].stageWrite === undefined
    ){
      randRoomId = Math.floor(rng() * Math.floor(startRoomData.length - 1))     // re-roll undefined seeds
    }*/

    // 2nd Castle Use Gravity Boots & Leap Stone until leaving patch by: MottZilla
    // Basic operation:
    // Hooks check for relic when using gravity boots/leap stone so we can add another condition
    // If Zone == 2nd Castle and Two specific Map tiles have not been visited, behave as though we have the relic.
    // The two map tiles are the Keep Teleporter and the Library Card destination tile.
    if(startRoomData[randRoomId].stage >= 0x20)
    {
      offset = 0xF0230                            // Code Block
      offset = data.writeWord(offset,0x3C028009)
      offset = data.writeWord(offset,0x8C4274A0)
      offset = data.writeWord(offset,0x00000000)
      offset = data.writeWord(offset,0x30420020)
      offset = data.writeWord(offset,0x1040000E)
      offset = data.writeWord(offset,0x00000000)
      offset = data.writeWord(offset,0x3C028007)
      offset = data.writeWord(offset,0x9042BBFB)
      offset = data.writeWord(offset,0x00000000)
      offset = data.writeWord(offset,0x14400009)
      offset = data.writeWord(offset,0x00000000)
      offset = data.writeWord(offset,0x3C028007)
      offset = data.writeWord(offset,0x9042BCC0)
      offset = data.writeWord(offset,0x00000000)
      offset = data.writeWord(offset,0x14400004)
      offset = data.writeWord(offset,0x00000000)
      offset = data.writeWord(offset,0x34020001)
      offset = data.writeWord(offset,0x03E00008)
      offset = data.writeWord(offset,0x00000000)
      offset = data.writeWord(offset,0x0803F8EA)
      offset = data.writeWord(offset,0x00000000)
  
      // Hooks
      offset = 0x12C7B0
      data.writeShort(offset,0x6E6E)
      offset = 0x12CB00
      data.writeShort(offset,0x6E6E)
      // Disable Richter Cutscene
      offset = 0x5641220
      offset = data.writeWord(offset,0x34020001)
      offset = data.writeWord(offset,0x00000000)

      // Patch Zone with Hatch Entity (required for 2nd to work)
      offset = 0x4BA934C
      offset = data.writeWord(offset,0x34040020)  // mov r4,20h
      offset = data.writeWord(offset,0x3C058009)  // mov r5,80090000h
      offset = data.writeWord(offset,0xACA474A0)  // mov [r5+74a0h],r4
	  offset = data.writeWord(offset,0xA6000026)  // movh [r16+26h],0
	  offset = data.writeWord(offset,0xAE000028)  // mov [r16+28h],0
      offset = data.writeWord(offset,0x0806E92B)  // jmp 801BA4ACh
      offset = data.writeWord(offset,0x00000000)  // nop
    }

    offset = 0x4b6ab0c
    offset = data.writeWord(offset,0x28042804)                                  // Setting up the CD room
    offset = data.writeWord(offset,0x34000015)
    offset = data.writeWord(offset,0x28052805)
    data.writeWord(offset,0x0000ff64)

    offset = 0x4b66a44
    offset = data.writeChar(offset,0x04)
    offset = data.writeChar(offset,0x4a)
    offset = data.writeChar(offset,0x00)
    offset = data.writeChar(offset,0x41)
    data.writeChar(offset,0x64)

    // console.log("randRoomId = " + randRoomId + ", Room id = " + startRoomData[randRoomId].id + " Desc:" + startRoomData[randRoomId].comment)

    offset = 0xae95c                                                            // change the destination
    newWrite = startRoomData[randRoomId].xyWrite                                // Write X,Y Position
    offset = data.writeWord(offset,newWrite)

    //console.log(numToHex(newWrite,8))

    newWrite = startRoomData[randRoomId].roomWrite                              // Write Rooms Used
    offset = data.writeWord(offset,newWrite)

    //console.log(numToHex(newWrite,8))

    newWrite = startRoomData[randRoomId].stageWrite                             // Write destination stage Used
    offset = data.writeShort(offset,newWrite)

    //console.log(numToHex(newWrite,4))

    if(startRoomData[randRoomId].stageWrite === 0x03 | startRoomData[randRoomId].stageWrite === 0x05) {
      offset = 0x45f55a2                                                        // Solve soft lock if player starts near Room 0 in Abandoned Mines
      offset = data.writeChar(offset,0x42)
      data.writeChar(offset,0x03)

      offset = 0x45f52a2                                                        // Solve soft lock if player starts near Room 0 in Abandoned Mines
      offset = data.writeChar(offset,0x42)
      data.writeChar(offset,0x03)

      offset = 0x45f5142                                                        // Solve soft lock if player starts near Room 0 in Abandoned Mines
      offset = data.writeChar(offset,0x42)
      data.writeChar(offset,0x03)

      offset = 0x45f4eec                                                        // Solve soft lock if player starts near Room 0 in Abandoned Mines
      offset = data.writeChar(offset,0x42)
      data.writeChar(offset,0x03)

      offset = 0x45f67bc                                                        // Solve soft lock if player starts near Room 3 in Abandoned Mines
      offset = data.writeChar(offset,0x67)
      offset = data.writeChar(offset,0x00)
      offset = data.writeChar(offset,0x68)
      data.writeChar(offset,0x00)

      offset = 0x45f65dc                                                        // Solve soft lock if player starts near Room 3 in Abandoned Mines
      data.writeChar(offset,0x23)
      
      offset = 0x45f655a                                                        // Solve soft lock if player starts near Room 3 in Abandoned Mines
      offset = data.writeChar(offset,0x68)
      data.writeChar(offset,0x00)

      offset = 0x45f64dc                                                        // Solve soft lock if player starts near Room 3 in Abandoned Mines
      offset = data.writeChar(offset,0x42)
      data.writeChar(offset,0x03)

      offset = 0x45f644e                                                        // Solve soft lock if player starts near Room 3 in Abandoned Mines
      offset = data.writeChar(offset,0x67)
      offset = data.writeChar(offset,0x00)
      offset = data.writeChar(offset,0x68)
      data.writeChar(offset,0x00)

      offset = 0x45f6168                                                        // Solve soft lock if player starts near Room 3 in Abandoned Mines
      offset = data.writeChar(offset,0xda)
      data.writeChar(offset,0x01)

      data.writeWord(0x45f8de2,0x03430342)                                      // Solve soft lock if player starts near Room 8 in Abandoned Mines
      data.writeShort(0x45f8a92,0x0342)
      data.writeShort(0x45f897c,0x0343)
      data.writeWord(0x45f879a,0x03430342)
    }

    if(startRoomData[randRoomId].stageWrite === 0x0b) {                         // Solve soft lock if player starts in the Keep Attic
      offset = 0x0563E4C0
      offset = data.writeWord(offset,0x34020001)
      data.writeChar(offset,0x00000000)
    }

    return data
  }

  function applyDominoPatches() {
    const data = new checked()
    let offset
    
    offset = 0x119128
    offset = data.writeWord(offset, 0x34020100) // mov r2,100h
    offset = data.writeWord(offset, 0x03E00008) // ret
    offset = data.writeWord(offset, 0x00000000) // nop

    // Alternate between Rare and Uncommon Drops based on Kill Count - MottZilla
    offset = 0x119188 				// PSX MainRam 800FF4C0h
    offset = data.writeWord(offset, 0x3C068009) // mov r6,80090000h
    offset = data.writeWord(offset, 0x34C67BF4) // or r6,7BF4h
    offset = data.writeWord(offset, 0x8CC20000) // mov r2,[r6]
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x30420001) // and r2,1h
    offset = data.writeWord(offset, 0x14400004) // jnz r2,800FF4E8h
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x34020020) // mov r2,20h
    offset = data.writeWord(offset, 0x0803FD7A) // jmp 800FF5E8h
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x34020040) // mov r2,40h
    offset = data.writeWord(offset, 0x0803FD7A) // jmp 800FF5E8h
    offset = data.writeWord(offset, 0x00000000) // nop

    return data
  }

  function applyRLBCPatches() {
    const data = new checked()
    let offset
    
    // Patch the reverse library card function
    offset = 0x12B534                                 // Hook to our new LBC function
    data.writeWord(offset, 0x0C02622F)                // No "nop" instr needed as it's already a call
    // Update description
	offset = 0xF1DE8
	offset = data.writeWord(offset,0x65766552)
	offset = data.writeWord(offset,0x62697372)
	offset = data.writeWord(offset,0x6C20656C)
	offset = data.writeWord(offset,0x61726269)
	offset = data.writeWord(offset,0x63207972)
	offset = data.writeWord(offset,0x20647261)
	offset = data.writeWord(offset,0x73756D81)
	offset = data.writeWord(offset,0x006E8165)
	// Update Name
	data.writeShort(0xF1E14,0xFFE6)    
    return data
  }

  function applyAlucardPalette(alColP){                  //Alucard Palette Randomizer - CRAZY4BLADES, palettes by eldri7ch
    const data = new checked()
    let colorAlucardBright = 1//Math.floor(rng() * 2)
    let colorAlucardSet= 0
    const palettesAlucard = [
      [0x8404, 0x8c28, 0x8c4c, 0xa552, 0xb9f3, 0xcad8, 0xf39c], // Bloody Tears
      [0x9021, 0xa043, 0xb8a6, 0xc529, 0xcded, 0xcef5, 0xf39c], // Blue Danube
      [0x8042, 0x8082, 0x80c6, 0x8d2f, 0xa9d1, 0xc6d5, 0xe39b], // Swamp Thing
      [0x9063, 0x94a5, 0xa12a, 0xb9f0, 0xd674, 0xeb5b, 0xf39c], // White Knight
      [0x8c02, 0x9c04, 0xac88, 0xbd0a, 0xcdad, 0xc655, 0xcf18], // Royal Purple
      [0x9024, 0x9867, 0xa8ac, 0xbd31, 0xcdf5, 0xeabb, 0xfb1d], // Pink Passion
      [0x8841, 0x9482, 0x9502, 0x9964, 0x9e07, 0xcef5, 0xf7bd], // Mint
      [0x8000, 0x8c42, 0x98a5, 0xa0e9, 0xa96d, 0xb9f1, 0xc655]  // Shadow Prince
    ]
    const palettesWolfCloth = [
      [0x8005,0x802a,0x8cad,0xa4f6,0x810d,0xbdf8,0x81f9,0xa31f,0x82df,0x8003,0x8023,0x8447,0x94ab,0xa112],
      [0xa465,0xb884,0xc8e6,0xd58b,0x8d21,0xe690,0x9a42,0xb6e8,0xa360,0x9802,0x9423,0xa863,0xb908,0xc147],
      [0x8063,0x80c7,0x8509,0x954e,0xa42a,0xadd4,0xc454,0xd55a,0xe85a,0x8021,0x8042,0x8064,0x8886,0xa4eb],
      [0x8c64,0xa0e8,0xad6b,0xde52,0xb4e0,0xfb9a,0xe5e0,0xfe27,0xfea0,0x8422,0x8c64,0x9484,0xb129,0xd1ef],
      [0xa465,0xb447,0xb88b,0xd94f,0x98c7,0xd9d8,0xad8e,0xca75,0xbe36,0x9802,0x9423,0xa445,0xa067,0xb0cd],
      [0x9826,0xa46c,0xb8f2,0xe1d8,0x8422,0xfaba,0x8844,0x9086,0x90cb,0x8c03,0x8c24,0x9c69,0xb50d,0xcd2f],
      [0x8c61,0x9502,0xa183,0xae4a,0xa427,0xbed6,0xc80a,0xcc8c,0xec16,0x8841,0x8841,0x90a2,0x98e4,0x9d65],
      [0x8822,0x8c43,0x98a5,0xa0e9,0x808d,0xa96d,0x80f9,0x8d9e,0x813f,0x8421,0x8822,0x8822,0x9063,0x9484]
    ]
    switch (alColP){
      case 'r':
        colorAlucardSet = 0
        break
      case 'b':
        colorAlucardSet = 1
        break
      case 'g':
        colorAlucardSet = 2
        break
      case 'w':
        colorAlucardSet = 3
        break
      case 'l':
        colorAlucardSet = 4
        break
      case 'p':
        colorAlucardSet = 5
        break
      case 'm':
        colorAlucardSet = 6
        break
      case 's':
        colorAlucardSet = 7
        break
    }
        
    // Cloth
    offset = 0xEF952
    for (let i = 0; i < 5; i++) {
      index = i + colorAlucardBright + 1
      offset = data.writeShort(offset, palettesAlucard[colorAlucardSet][index])
    }
    // Darkest color
    offset = 0xEF93E
    index = colorAlucardBright
    offset = data.writeShort(offset,palettesAlucard[colorAlucardSet][index])

    offset = 0xEF9C0
    for (let i = 0; i < 4; i++) { //0-3
      offset = data.writeShort(offset, palettesWolfCloth[colorAlucardSet][i])
    }
    offset += 0x0a
    for (let i = 4; i < 9; i++) {//4-8
      offset = data.writeShort(offset, palettesWolfCloth[colorAlucardSet][i])
    }
    offset += 0x04
    for (let i = 9; i < 13; i++) {//10-13
      offset = data.writeShort(offset, palettesWolfCloth[colorAlucardSet][i])
    }
    offset += 0x0c
    offset = data.writeShort(offset, palettesWolfCloth[colorAlucardSet][13])
    return data
  }

  function applyAlucardLiner(alColL){
    const data = new checked()
    let colorAlucardLiner = 0
    const palettesAlucardLiner = [
      [0x84ab, 0x8d2f, 0x91d6, 0x929b], // Gold Trim (Default)
      [0x8465, 0x88a8, 0x88ec, 0x9151], // Bronze Trim
      [0x94a6, 0xa54a, 0xb9ef, 0xc693], // Silver Trim
      [0x8c43, 0x98a5, 0x9cc8, 0xa54c], // Onyx Trim
      [0xa8ac, 0xad0f, 0xadb3, 0xbe16]  // Coral Trim
    ]
    const palettesWolfSkin = [
      [0x9db5,0xbebd,0xff9a,0x8888,0x98f0,0x90ec,0xa990,0xa9f6,0x8023,0x8049],
      [0x94eb,0xa56e,0xba14,0x8445,0x9089,0x8c66,0x94a8,0xa0eb,0x8023,0x8445],
      [0xc1cf,0xded6,0xff9a,0x98a5,0xb14b,0xa509,0xb9ce,0xc611,0x8421,0x98a5],
      [0xa52c,0xa98a,0x9cc7,0x8c44,0x98a8,0x9486,0x9ce7,0xa509,0x8001,0x8c44],
      [0xbdf9,0xce7d,0xdf7c,0x948a,0xb553,0xa10f,0xbdd3,0xbdf8,0x8403,0x904b]
    ]
    
    switch(alColL){
      case 'z':
        colorAlucardLiner = [0]
        break
      case "x":
        colorAlucardLiner = [1]
        break
      case 'y':
        colorAlucardLiner = [2]
        break
      case 'w':
        colorAlucardLiner = [3]
        break
      case 'v':
        colorAlucardLiner = [4]
        break
    }
    if (colorAlucardLiner > 4) {
      colorAlucardLiner = 0;
    }
    offset = 0xEF940
    for (let i = 0; i < 4; i++) {
      offset = data.writeShort(offset,palettesAlucardLiner[colorAlucardLiner][i])
    }
    offset = 0xEF9C8
    for (let i = 0; i< 5; i++) {
      offset = data.writeShort(offset,palettesWolfSkin[colorAlucardLiner][i])
    }
    offset += 0x16
    for (let i = 5; i< 10; i++) {
      offset = data.writeShort(offset,palettesWolfSkin[colorAlucardLiner][i])
    }
    return data
  }

  function applySplashText(rng,seasonAllowed) {                                               // Splash text; ASM by MottZilla, JS by 3snow_p7im, eldri7ch, and DotChris
    const month = new Date().getMonth() + 1                                     // Acquire the month the code is run
    let splashPhrases = []

    if (seasonAllowed) {                                                    // check if seasonal phrases are allowed
      switch (month) {                                                          // Establish different sets of phrases from constants.js based on the month
      case 6:                                                                   // Pride month
        splashPhrases = constants.prideSplashPhrases
        break
      default:                                                                  // Any other month
        splashPhrases = constants.splashPhrases
        break
      }
    } else {
      splashPhrases = constants.splashPhrases
    }

    const data = new checked()
    let strId
    let strText
    let strLength
    let newXPos
    let offset
    // Identify Variables
    strId= Math.floor(rng() * Math.floor(splashPhrases.length))
    strText = splashPhrases[strId]
    strLength = strText.length
    newXPos = numToHex(0x3404004b + (180-((strLength * 8) / 2)))
    // Start writing the code - code by MottZilla
    // Title Screen Display Text through Debug
    offset = 0x4398AD0
    offset = data.writeWord(offset, 0x3C04801B)
    offset = data.writeWord(offset, 0x34844880)
    offset = data.writeWord(offset, 0x0C004657)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x2404FFFF)
    offset = data.writeWord(offset, 0x0C0045BF)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x34040020)
    offset = data.writeWord(offset, 0x3C058003)
    offset = data.writeWord(offset, 0xA0A4B768)
    offset = data.writeWord(offset, 0x340400C1)                                 // y posoition for text
    offset = data.writeWord(offset, 0xA0A4B76A)
    offset = data.writeWord(offset, 0x3C028009)
    offset = data.writeWord(offset, 0x94427494)
    offset = data.writeWord(offset, 0x0806D200)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00007845)
    // Write Text Hook
    offset = 0x439895C
    offset = data.writeWord(offset, 0x0806d20e)
    offset = data.writeWord(offset, 0x00000000)
    // Write the new X pos for the text
    offset = 0x4398AF0
    data.writeWord(offset, newXPos)
    // Write the text
    let i = 0
    let strHex = []
    console.log(strText)
    // Convert each character of the text to hex code.
    // Loops through each character in the string and assigns
    // a hex code for that character to be written.
    while (i < (strLength)) {                                                   // code runs as long as the string still has characters in it
      if (i < strLength) {                                                      // run if the character is not the end of the string
        if (strText[i] == "\\") {                                               // Check for apostrophes
          strhex[i] = 0x27
        } else {                                                                // if it's not an apostrophe, write the hex code for the text
          strHex[i] = strText.charCodeAt(i)
        }
      } else {                                                                  // if it IS the end of the string, add a termination 0x00
        strHex[i] = 0x00
      }
      i++                                                                       // advance the integer in 'i'
    }
    // perform the write
    offset = 0x4398B18
    strHex[strLength + 1] = 0x00                                                // add an additional termination 0x00 in case the past one failed
    offset = data.writeString(offset, strHex)                                   // actually write the text we need
    offset = data.writeChar(offset, 0x00)                                       // I know, it seems redundant, but add an additional termination 0x00
    
    return data
  }

  function applyLibraryShortcutPatches() {
    const data = new checked()
    let offset = 0x47c22ea
    offset = data.writeWord(offset,0x02400254)
    offset = data.writeWord(offset,0x02630221)
    offset = data.writeWord(offset,0x02320233)
    offset = data.writeWord(offset,0x02320233)
    offset = data.writeWord(offset,0x02320233)
    offset = data.writeWord(offset,0x02320233)
    offset = data.writeWord(offset,0x02320233)
    data.writeWord(offset,0x02320233)
    
    offset = 0x47c23c8
    offset = data.writeWord(offset,0x022f022e)
    offset = data.writeWord(offset,0x023a022f)
    offset = data.writeWord(offset,0x023b023a)
    offset = data.writeWord(offset,0x023b023a)
    offset = data.writeWord(offset,0x023b023a)
    offset = data.writeWord(offset,0x023b023a)
    offset = data.writeWord(offset,0x023b023a)
    offset = data.writeWord(offset,0x023b023a)
    data.writeShort(offset,0x023a)
    
    offset = 0x47c24a8
    offset = data.writeWord(offset,0x00b3026e)
    offset = data.writeWord(offset,0x014100e7)
    offset = data.writeWord(offset,0x013f0141)
    offset = data.writeWord(offset,0x026e00b3)
    offset = data.writeWord(offset,0x026c026f)
    offset = data.writeWord(offset,0x026c026d)
    offset = data.writeWord(offset,0x026c026d)
    offset = data.writeWord(offset,0x026c026d)
    data.writeShort(offset,0x026d)
    
    offset = 0x47c26b6
    offset = data.writeWord(offset,0x026c0251)
    offset = data.writeWord(offset,0x00e800b4)
    offset = data.writeWord(offset,0x00ea00e9)
    offset = data.writeWord(offset,0x00b400eb)
    offset = data.writeWord(offset,0x0255026c)
    offset = data.writeWord(offset,0x025d025c)
    offset = data.writeWord(offset,0x025d025c)
    offset = data.writeWord(offset,0x025d025c)
    data.writeWord(offset,0x025d025c)
    
    offset = 0x47c2794
    offset = data.writeWord(offset,0x0251025a)
    offset = data.writeWord(offset,0x00b5026e)
    offset = data.writeWord(offset,0x00ed00ec)
    offset = data.writeWord(offset,0x00ef00ee)
    offset = data.writeWord(offset,0x026e00b5)
    offset = data.writeWord(offset,0x01fd025d)
    offset = data.writeWord(offset,0x021001f3)
    offset = data.writeWord(offset,0x01fa01f3)
    offset = data.writeWord(offset,0x01f40210)
    data.writeShort(offset,0x0204)
    
    offset = 0x47c2872
    offset = data.writeWord(offset,0x02500278)
    offset = data.writeWord(offset,0x026c0259)
    offset = data.writeWord(offset,0x00f000b6)
    offset = data.writeWord(offset,0x00f200f1)
    offset = data.writeWord(offset,0x00b600f3)
    offset = data.writeWord(offset,0x0255026c)
    offset = data.writeWord(offset,0x01f901fe)
    offset = data.writeWord(offset,0x01f3020f)
    offset = data.writeWord(offset,0x020f01f4)
    data.writeWord(offset,0x02020272)
    
    offset = 0x47c2950
    offset = data.writeWord(offset,0x020501f7)
    offset = data.writeWord(offset,0x02510250)
    offset = data.writeWord(offset,0x00b7026e)
    offset = data.writeWord(offset,0x00f500f4)
    offset = data.writeWord(offset,0x00f700f6)
    offset = data.writeWord(offset,0x026e00b7)
    offset = data.writeWord(offset,0x0200025d)
    offset = data.writeWord(offset,0x02bb01f6)
    offset = data.writeWord(offset,0x01f801f9)
    offset = data.writeWord(offset,0x01f30212)
    data.writeShort(offset,0x0278)
    
    offset = 0x47c2a2e
    offset = data.writeWord(offset,0x02720273)
    offset = data.writeWord(offset,0x025a0205)
    offset = data.writeWord(offset,0x026c0251)
    offset = data.writeWord(offset,0x00f800b8)
    offset = data.writeWord(offset,0x00fa00f9)
    offset = data.writeWord(offset,0x00b800fb)
    offset = data.writeWord(offset,0x0255026c)
    offset = data.writeWord(offset,0x020301fe)
    offset = data.writeWord(offset,0x01fa02bb)
    offset = data.writeWord(offset,0x02bb01fa)
    data.writeWord(offset,0x020101f6)
    
    offset = 0x47c2b0c
    offset = data.writeWord(offset,0x021101f7)
    offset = data.writeWord(offset,0x02bc01fa)
    offset = data.writeWord(offset,0x02510252)
    offset = data.writeWord(offset,0x00b9026e)
    offset = data.writeWord(offset,0x00fd00fc)
    offset = data.writeWord(offset,0x00ff00fe)
    offset = data.writeWord(offset,0x026e00b9)
    offset = data.writeWord(offset,0x0276025d)
    offset = data.writeWord(offset,0x02120272)
    offset = data.writeWord(offset,0x01f301f6)
    offset = data.writeWord(offset,0x02740273)
    data.writeShort(offset,0x0203)
    
    offset = 0x47c2bea
    offset = data.writeWord(offset,0x02540255)
    offset = data.writeWord(offset,0x02540255)
    offset = data.writeWord(offset,0x02460255)
    offset = data.writeWord(offset,0x026c0247)
    offset = data.writeWord(offset,0x00c300ba)
    offset = data.writeWord(offset,0x00c500c4)
    offset = data.writeWord(offset,0x00ba00c6)
    offset = data.writeWord(offset,0x0255026c)
    offset = data.writeWord(offset,0x02550254)
    offset = data.writeWord(offset,0x02550254)
    offset = data.writeWord(offset,0x02550248)
    data.writeShort(offset,0x0254)
    
    offset = 0x47c2cc8
    offset = data.writeWord(offset,0x025d025c)
    offset = data.writeWord(offset,0x025d025c)
    offset = data.writeWord(offset,0x025d025c)
    offset = data.writeWord(offset,0x024f024e)
    offset = data.writeWord(offset,0x00bb026e)
    offset = data.writeWord(offset,0x00c800c7)
    offset = data.writeWord(offset,0x00ca00c9)
    offset = data.writeWord(offset,0x026e00bb)
    offset = data.writeWord(offset,0x025c025d)
    offset = data.writeWord(offset,0x025c025d)
    offset = data.writeWord(offset,0x025c025d)
    data.writeShort(offset,0x025d)
    
    offset = 0x47c2da8
    offset = data.writeWord(offset,0x02210220)
    offset = data.writeWord(offset,0x02210221)
    offset = data.writeWord(offset,0x02210221)
    offset = data.writeWord(offset,0x02210221)
    offset = data.writeWord(offset,0x02210221)
    offset = data.writeWord(offset,0x02210221)
    offset = data.writeWord(offset,0x02210221)
    offset = data.writeWord(offset,0x021f0221)
    offset = data.writeWord(offset,0x021f021f)
    offset = data.writeWord(offset,0x01fd0237)
    offset = data.writeWord(offset,0x01fa0272)
    data.writeShort(offset,0x01f9)
    
    offset = 0x47C2E8A
    offset = data.writeWord(offset,0x02280228)
    offset = data.writeWord(offset,0x02280228)
    offset = data.writeWord(offset,0x02280228)
    data.writeShort(offset,0x0228)
        
    offset = 0x47C2FC8
    offset = data.writeWord(offset,0x02280228)
    offset = data.writeWord(offset,0x02280228)
    offset = data.writeWord(offset,0x02280228)
    offset = data.writeWord(offset,0x02280228)
    offset = data.writeWord(offset,0x02280228)
    offset = data.writeWord(offset,0x0200022A)
    data.writeShort(offset,0x01F3)

    return data
  }

  function applySimpleInputPatches() {
    const data = new checked()
    let offset
    
    offset = 0x0012ca48                                                         // Address for adding new inputs to gravity boots
    offset = data.writeWord(offset,0x08026232)                                  // instructs the game to jump to the new command detection code
    data.writeWord(offset,0x00000000)

    offset = 0x0012da34                                                         // Address for adding new inputs to soul steal
    offset = data.writeWord(offset,0x08026234)                                  // instructs the game to jump to the new command detection code
    data.writeWord(offset,0x34040001)

    offset = 0x0012d7a4                                                         // Address for adding new inputs to tetra spirit
    offset = data.writeWord(offset,0x08026234)                                  // instructs the game to jump to the new command detection code
    data.writeWord(offset,0x34040002)

    offset = 0x0012d454                                                         // Address for adding new inputs to hellfire
    offset = data.writeWord(offset,0x08026234)                                  // instructs the game to jump to the new command detection code
    data.writeWord(offset,0x34040003)

    return data
  }

  function applyDevsStashPatches() {
    // console.log('dev's stash')

    const data = new checked()
    let offset

    // Apply Four Beasts Hook
    offset = 0x10B17C
    data.writeWord(offset, 0x08026780)

    // Apply Four Beasts Spell by MottZilla and eldri7ch
    offset = 0x3713218
    offset = data.writeWord(offset, 0x0C04296F)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x27BDFFE0)
    offset = data.writeWord(offset, 0xAFBF0010)
    offset = data.writeWord(offset, 0x0C0267D5)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x0C0267E6)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C088009)
    offset = data.writeWord(offset, 0x3406FFFF)
    offset = data.writeWord(offset, 0x950F7490)
    offset = data.writeWord(offset, 0x3C0E8009)
    offset = data.writeWord(offset, 0x35CE9F3C)
    offset = data.writeWord(offset, 0x3C0D8009)
    offset = data.writeWord(offset, 0x35AD9F28)
    offset = data.writeWord(offset, 0x8DA50000)
    offset = data.writeWord(offset, 0x31EFF000)
    offset = data.writeWord(offset, 0x01C57021)
    offset = data.writeWord(offset, 0x01C57021)
    offset = data.writeWord(offset, 0x95CC0000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x11860008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x15EC0004)
    offset = data.writeWord(offset, 0x34070014)
    offset = data.writeWord(offset, 0x24A50001)
    offset = data.writeWord(offset, 0xA5A50000)
    offset = data.writeWord(offset, 0xA5A70004)
    offset = data.writeWord(offset, 0x080267C6)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C0B8009)
    offset = data.writeWord(offset, 0x356B9F34)
    offset = data.writeWord(offset, 0x340C1000)
    offset = data.writeWord(offset, 0x3C0E8009)
    offset = data.writeWord(offset, 0x35CE9F30)
    offset = data.writeWord(offset, 0x8DC40000)
    offset = data.writeWord(offset, 0x158F0008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x24840001)
    offset = data.writeWord(offset, 0xADC40000)
    offset = data.writeWord(offset, 0x3406001E)
    offset = data.writeWord(offset, 0xAD660000)
    offset = data.writeWord(offset, 0xADA60004)
    offset = data.writeWord(offset, 0x080267C6)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x2484FFD6)
    offset = data.writeWord(offset, 0x04810005)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0xADA00000)
    offset = data.writeWord(offset, 0xA5A00004)
    offset = data.writeWord(offset, 0x080267C6)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x8D640000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x1080000D)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x2484FFFF)
    offset = data.writeWord(offset, 0xAD640000)
    offset = data.writeWord(offset, 0x34064000)
    offset = data.writeWord(offset, 0x14CF000A)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x950F7494)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x31EF0010)
    offset = data.writeWord(offset, 0x11E00005)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x0C026807)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0xADA00000)
    offset = data.writeWord(offset, 0xA5A00004)
    offset = data.writeWord(offset, 0x8FBF0010)
    offset = data.writeWord(offset, 0x27BD0020)
    offset = data.writeWord(offset, 0x0803CC4F)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x30001000)
    offset = data.writeWord(offset, 0x60002000)
    offset = data.writeWord(offset, 0xC0004000)
    offset = data.writeWord(offset, 0x90008000)
    offset = data.writeWord(offset, 0xFFFF1000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C04800A)
    offset = data.writeWord(offset, 0x8C849F2C)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x10800008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x2484FFFF)
    offset = data.writeWord(offset, 0x3C0F8009)
    offset = data.writeWord(offset, 0x35EF9F2C)
    offset = data.writeWord(offset, 0xADE40000)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x080267E4)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C048009)
    offset = data.writeWord(offset, 0x34849F28)
    offset = data.writeWord(offset, 0xAC800000)
    offset = data.writeWord(offset, 0x03E00008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C04800A)
    offset = data.writeWord(offset, 0x8C849F38)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x1080000C)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3406816E)
    offset = data.writeWord(offset, 0x3C098007)
    offset = data.writeWord(offset, 0x35290000)
    offset = data.writeWord(offset, 0x2484FFFF)
    offset = data.writeWord(offset, 0x3C0F8009)
    offset = data.writeWord(offset, 0x35EF9F38)
    offset = data.writeWord(offset, 0xADE40000)
    offset = data.writeWord(offset, 0xA52633EE)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x08026805)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C098007)
    offset = data.writeWord(offset, 0x35290000)
    offset = data.writeWord(offset, 0xA5203418)
    offset = data.writeWord(offset, 0xA5203420)
    offset = data.writeWord(offset, 0x952533EE)
    offset = data.writeWord(offset, 0x3406816E)
    offset = data.writeWord(offset, 0x14A60002)
    offset = data.writeWord(offset, 0x34048100)
    offset = data.writeWord(offset, 0xA52433EE)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C048010)
    offset = data.writeWord(offset, 0x3484BEA8)
    offset = data.writeWord(offset, 0x3C05A040)
    offset = data.writeWord(offset, 0x34A50049)
    offset = data.writeWord(offset, 0xAC850000)
    offset = data.writeWord(offset, 0x03E00008)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x3C098007)
    offset = data.writeWord(offset, 0x35290000)
    offset = data.writeWord(offset, 0x3C088009)
    offset = data.writeWord(offset, 0x35087BC0)
    offset = data.writeWord(offset, 0x91263404)
    offset = data.writeWord(offset, 0x34070002)
    offset = data.writeWord(offset, 0x14C7001B)
    offset = data.writeWord(offset, 0x8D07FFF0)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x24E7FFBA)
    offset = data.writeWord(offset, 0x04E00017)
    offset = data.writeWord(offset, 0x3C0F8009)
    offset = data.writeWord(offset, 0x35EF9F38)
    offset = data.writeWord(offset, 0x340404B0)
    offset = data.writeWord(offset, 0x8D050000)
    offset = data.writeWord(offset, 0xA5E40000)
    offset = data.writeWord(offset, 0xA5253418)
    offset = data.writeWord(offset, 0x34041400)
    offset = data.writeWord(offset, 0x340504CE)
    offset = data.writeWord(offset, 0x3406816E)
    offset = data.writeWord(offset, 0xA5243420)
    offset = data.writeWord(offset, 0xA5252F1C)
    offset = data.writeWord(offset, 0xA52633EE)
    offset = data.writeWord(offset, 0xAD07FFF0)
    offset = data.writeWord(offset, 0x340400BA)
    offset = data.writeWord(offset, 0x34050020)
    offset = data.writeWord(offset, 0xA5243484)
    offset = data.writeWord(offset, 0xAD203428)
    offset = data.writeWord(offset, 0xAD20342C)
    offset = data.writeWord(offset, 0xA5253404)
    offset = data.writeWord(offset, 0xA5203406)
    offset = data.writeWord(offset, 0x3C048010)
    offset = data.writeWord(offset, 0x3484BEA8)
    offset = data.writeWord(offset, 0xAC800000)
    offset = data.writeWord(offset, 0x03E00008)
    data.writeWord(offset, 0x00000000)

    // Apply Forbidden Route Shortcut
    offset = 0x49153b8
    offset = data.writeWord(offset,0x023b023b)
    offset = data.writeWord(offset,0x0000023a)
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x02390000)
    data.writeWord(offset,0x023b023b)

    offset = 0x4915478
    offset = data.writeWord(offset,0x023c023c)
    offset = data.writeWord(offset,0x0000023d)
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x023c023c)

    offset = 0x491553e
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x003d003c)

    offset = 0x49155fe
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x0020001f)

    offset = 0x49156be
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x00240000)

    offset = 0x491577c
    offset = data.writeWord(offset,0x023b0004)
    offset = data.writeWord(offset,0x0000023a)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x00040000)

    offset = 0x491583c
    offset = data.writeWord(offset,0x023c0004)
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x00040000)

    offset = 0x49158fc
    offset = data.writeWord(offset,0x00370004)
    offset = data.writeWord(offset,0x00000041)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x00040000)

    offset = 0x49159be
    offset = data.writeWord(offset,0x00070006)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x00000000)

    offset = 0x4915a80
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x00000000)

    offset = 0x4917d38
    offset = data.writeWord(offset,0x00190019)
    offset = data.writeWord(offset,0x00190019)
    offset = data.writeWord(offset,0x00190019)
    offset = data.writeWord(offset,0x00190019)
    data.writeWord(offset,0x00190019)

    offset = 0x4917dfe
    offset = data.writeWord(offset,0x006a0012)
    offset = data.writeWord(offset,0x00490083)
    data.writeShort(offset,0x0000)

    offset = 0x4917ebe
    offset = data.writeWord(offset,0x006a0000)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x0000)

    offset = 0x4917f7e
    offset = data.writeWord(offset,0x006a0000)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x00000012)

    offset = 0x491816e
    offset = data.writeWord(offset,0x006a0000)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x00000096)

    offset = 0x491822e
    offset = data.writeWord(offset,0x00180000)
    offset = data.writeWord(offset,0x00190019)
    data.writeWord(offset,0x0000001a)

    offset = 0x49182ee
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x0000006c)

    offset = 0x49183ae
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x0000006c)

    offset = 0x491846e
    offset = data.writeWord(offset,0x00000012)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x0012006c)

    offset = 0x491852e
    offset = data.writeWord(offset,0x00950012)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x0012006c)

    offset = 0x49185ee
    offset = data.writeWord(offset,0x009c0095)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x0096006e)

    offset = 0x49186ae
    offset = data.writeWord(offset,0x00190018)
    offset = data.writeWord(offset,0x00190019)
    data.writeWord(offset,0x001a0019)

    offset = 0x491876e
    offset = data.writeWord(offset,0x0066006a)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x006c0066)

    offset = 0x491882e
    offset = data.writeWord(offset,0x0066009c)
    offset = data.writeWord(offset,0x00490083)
    data.writeWord(offset,0x006e0066)

    // Forbidden Scroll Entity Remover
    offset = 0x048fcff4
    offset = data.writeWord(offset,0x008005F0)
    offset = data.writeWord(offset,0x00320011)
    data.writeShort(offset,0x0013)

    offset = 0x048fdf30
    offset = data.writeWord(offset,0x008005F0)
    offset = data.writeWord(offset,0x00320011)
    data.writeShort(offset,0x0013)

    offset = 0x048FCFB8
    offset = data.writeWord(offset,0x018004f8)
    offset = data.writeWord(offset,0x00300011)
    data.writeShort(offset,0x0013)

    offset = 0x048fe00c
    offset = data.writeWord(offset,0x018004f8)
    offset = data.writeWord(offset,0x00300011)
    data.writeShort(offset,0x0013)

    offset = 0x048fcfc2
    offset = data.writeWord(offset,0x02a00500)
    offset = data.writeWord(offset,0x00310011)
    data.writeShort(offset,0x0013)

    offset = 0x048fe0d4
    offset = data.writeWord(offset,0x02a00500)
    offset = data.writeWord(offset,0x00310011)
    data.writeShort(offset,0x0013)

    offset = 0x048fce78
    offset = data.writeWord(offset,0x00800150)
    offset = data.writeWord(offset,0x00300011)
    data.writeShort(offset,0x0013)

    offset = 0x048fdf26
    offset = data.writeWord(offset,0x00800150)
    offset = data.writeWord(offset,0x00300011)
    data.writeShort(offset,0x0013)

    offset = 0x048fce82
    offset = data.writeWord(offset,0x01800150)
    offset = data.writeWord(offset,0x00310011)
    data.writeShort(offset,0x0013)

    offset = 0x048fdfee
    offset = data.writeWord(offset,0x01800150)
    offset = data.writeWord(offset,0x00310011)
    data.writeShort(offset,0x0013)

    offset = 0x048fce32
    offset = data.writeWord(offset,0x02800010)
    offset = data.writeWord(offset,0x00300011)
    data.writeShort(offset,0x0013)

    offset = 0x048fe034
    offset = data.writeWord(offset,0x02800010)
    offset = data.writeWord(offset,0x00300011)
    data.writeShort(offset,0x0013)

    // Max Attack Muramasa by eldri7ch
    offset = 0x10D250
    offset = data.writeWord(offset,0x3c04000e)
    data.writeWord(offset,0x34846000)

    //Sword of Dawn Scaling by MottZilla
    offset = 0x3B428F8
    offset = data.writeWord(offset,0x3C028009)
    offset = data.writeWord(offset,0x8C427BD8)
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0xA6220040)
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x34020001)
    offset = data.writeWord(offset,0x34030004)
    data.writeWord(offset,0x03E00008)

    data.writeChar(0xB39B4,0x0F)

    offset = 0x3B41654
    offset = data.writeWord(offset,0x0C05F314)
    data.writeWord(offset,0x00000000)

    offset = 0x3B4219C
    offset = data.writeWord(offset,0x0C05F314)
    data.writeWord(offset,0x00000000)

    // Entrance Trap Door Tiles and Platforms by eldri7ch
    data.writeWord(0x540F22A,0x05270526)
    data.writeShort(0x540F6DC,0x04F6)
    data.writeShort(0x540F798,0x04F6)
    data.writeShort(0x540F898,0x04F6)
    data.writeShort(0x540FADC,0x0554)
    data.writeShort(0x540FB98,0x0554)
    data.writeShort(0x540FC98,0x0554)

    // Entrance Trap Door Save Room Corrections"
    data.writeChar(0x53F8A8B,0x2F)
    
    // Entrance Trap Door Opens by MottZilla
    offset = 0x5431030
    offset = data.writeWord(offset,0x3C028009)
    offset = data.writeWord(offset,0x90427974)
    offset = data.writeWord(offset,0x34030003)
    offset = data.writeWord(offset,0x00000000)
    offset = data.writeWord(offset,0x00000000)
    data.writeWord(offset,0x1043000C)
    
    // Entrance Trap Door Entity Slot Fix by MottZilla
    data.writeChar(0x53F8EB8,0x12)
    data.writeChar(0x53F97A6,0x12)

    // Yasutsuna Hitbox Fix by MottZilla
    // RIGHT HAND
    offset = 0x3BFB314
    offset = data.writeWord(offset, 0x18000024)
    offset = data.writeWord(offset, 0x00000000)

    offset = 0x3BFB3A8
    offset = data.writeWord(offset, 0x3C178007)
    offset = data.writeWord(offset, 0x36F733D8)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x8EF60000)
    offset = data.writeWord(offset, 0x8EF50004)
    offset = data.writeWord(offset, 0x96F40014)
    offset = data.writeWord(offset, 0xAE360000)
    offset = data.writeWord(offset, 0xAE350004)
    offset = data.writeWord(offset, 0xA6340014)
    offset = data.writeWord(offset, 0x8FBF0030)
    offset = data.writeWord(offset, 0x8FB7002C)
    offset = data.writeWord(offset, 0x1800FFD1)

    //LEFT HAND
    offset = 0x3DD57F4
    offset = data.writeWord(offset, 0x18000024)
    offset = data.writeWord(offset, 0x00000000)

    offset = 0x3DD5888
    offset = data.writeWord(offset, 0x3C178007)
    offset = data.writeWord(offset, 0x36F733D8)
    offset = data.writeWord(offset, 0x00000000)
    offset = data.writeWord(offset, 0x8EF60000)
    offset = data.writeWord(offset, 0x8EF50004)
    offset = data.writeWord(offset, 0x96F40014)
    offset = data.writeWord(offset, 0xAE360000)
    offset = data.writeWord(offset, 0xAE350004)
    offset = data.writeWord(offset, 0xA6340014)
    offset = data.writeWord(offset, 0x8FBF0030)
    offset = data.writeWord(offset, 0x8FB7002C)
    offset = data.writeWord(offset, 0x1800FFD1)

    // Holy Cross Fixes
    offset = 0x000b1036
    data.writeChar(offset, 0x82)  // heals hp with orbs
    offset = 0x000b10d6
    data.writeChar(offset, 0x82)  // heals hp with orbs
    offset = 0x000b102a
    data.writeChar(offset, 0x32)  // costs 50 Hearts

    return data
  }

  function randomizeRelics(
    version,
    applied,
    options,
    seed,
    newNames,
    workers,
    nonce,
    url,
  ) {
    const promises = Array(workers.length)
    const running = Array(workers.length).fill(true)
    let done
    for (let i = 0; i < workers.length; i++) {
      const thread = i
      const worker = workers[i]
      loadWorker(worker, url)
      const workerId = i
      function postMessage(bootstrap) {
        const message = {
          action: constants.WORKER_ACTION.RELICS,
          nonce: nonce++
        }
        if (bootstrap) {
          Object.assign(message, {
            bootstrap: true,
            applied: applied,
            options: options,
            version: version,
            seed: seed,
            newNames: newNames,
          })
        }
        worker.postMessage(JSON.stringify(message))
      }
      promises[i] = new Promise(function(resolve, reject) {
        addEventListener.call(worker, 'message', function(result) {
          if (self) {
            result = result.data
          }
          result = JSON.parse(result)
          if (result.error && typeof(result.error) !== 'boolean') {
            const error = new Error(result.error.message)
            error.name = result.error.name
            error.stack = result.error.stack
            throw error
          } else if (done || result.done) {
            done = true
            resolve(result)
            running[thread] = false
            worker.postMessage(JSON.stringify({
              action: constants.WORKER_ACTION.RELICS,
              cancel: true,
            }))
          } else {
            postMessage()
          }
        })
        postMessage(true)
      })
    }
    return Promise.all(promises).then(function(results) {
      const result = results.reduce(function(candidate, result, index) {
        if (!candidate || 'error' in candidate) {
          return result
        }
        if ('error' in result || candidate.nonce < result.nonce) {
          return candidate
        }
        return result
      })
      if (result.error) {
        throw result.error
      }
      return result
    })
  }

  function randomizeItems(
    version,
    applied,
    options,
    seed,
    worker,
    nonce,
    items,
    newNames,
    url,
  ) {
    loadWorker(worker, url)
    return new Promise(function(resolve, reject) {
      addEventListener.call(worker, 'message', function(result) {
        if (self) {
          result = result.data
        }
        if (result.error) {
          reject(result.error)
        } else {
          resolve(result)
        }
      })
      worker.postMessage({
        action: constants.WORKER_ACTION.ITEMS,
        applied: applied,
        options: options,
        version: version,
        seed: seed,
        nonce: nonce,
        items: items,
        newNames: newNames,
        url: url,
      })
    })
  }

  function applyWrites(rng, options) {
    const data = new checked()
    const relicsForShuffle = relics                                                 // pull the entirety of the relics list from relics.js for reference
    let relicShuffleArray = []
    let hexCharShuffleArray = []
    let hexArrayShuffFlag = 0
    relicsForShuffle.forEach(function(relic) {                                      // build the list of relic addresses
      if (relic.relicId < 30) {                                                     // import all of the actual relic menu addresses into the array for shuffling
        relicShuffleArray.push(numToHex(relic.invAddress))
      }
    })
    relicShuffleArray = shuffle(rng,relicShuffleArray)                              // Shuffle that list
    if (options.writes) {
      options.writes.forEach(function(write) {
        let value
        let valueCheck
        switch (write.type) {
        case 'char':
          value = write.value
          valueCheck = String(write.value)
          if (value === 'random') {
            value = Math.floor(rng() * 0x100)
          }
          else if (value === 'random1') {
            // randomizes between 0 and 1 - eldri7ch
            let randomInt
            randomInt = Math.floor(rng() * 1)
            value = '0x0' + randomInt
          }
          else if (value === 'random3') {
            // randomizes between 0 and 3 - eldri7ch
            let randomInt
            randomInt = Math.floor(rng() * 3)
            value = '0x0' + randomInt
          }
          else if (value === 'random10') {
            // randomizes between 1 and 10 - eldri7ch
            let randomInt
            randomInt = Math.floor(rng() * 9) + 1
            value = numToHex(randomInt)
          }
          else if (value === 'random99') {
            // randomizes between 1 and 99 - eldri7ch
            let randomInt
            randomInt = Math.floor(rng() * 98) + 1
            value = numToHex(randomInt)
          }
          else if (valueCheck.includes('randomHexChar')) {
            // randomizes a shuffled array of digits between two hex values - eldri7ch
            if (hexArrayShuffFlag == 0) {                                                                   // Check if the list has been shuffled already
              let formatArray = ['<','>','-']                                                               // establish the characters required for this to be a complete command
              if (formatArray.every(char => value.includes(char))) {                                        // check that every character required exists
                let start = Number(value.substring(14, 18))                                                 // pull the starting hex address for the array
                let finish = Number(value.substring(19, 23))                                                // pull the ending address for the array
                hexArrayShuffFlag = 1                                                                       // set the flag to never re-randomize these
                hexCharShuffleArray = Array.from({length: finish - start + 1}, (_, a) => a + start)         // build the array from the starting and ending addresses
                hexCharShuffleArray = shuffle(rng,hexCharShuffleArray)                                      // Shuffle the hex array
                }
            }
            let itemNum = hexCharShuffleArray.pop()                                                         // must pop the number into a variable for numToHex to work
            value = numToHex(itemNum)                                                                       // actively assign the value to be written
          }
          data.writeChar(write.address, value)
          break
        case 'short':
          value = write.value
          if (value === 'random') {
            value = Math.floor(rng() * 0x10000)
          } 
          else if (value === 'randomRelic') {
            // "2690808163" translates to the address before the relic hex is added - eldri7ch
            // let relicHex
            // relicHex = Math.floor(rng() * 29) + 2690808164
            value = relicShuffleArray.pop()
          }
          data.writeShort(write.address, value)
          break
        case 'word':
          value = write.value
          if (value === 'random') {
            value = Math.floor(rng() * 0x100000000)
          }
          data.writeWord(write.address, value)
          break
        case 'long':
          value = write.value
          if (value === 'random') {
            value = Math.floor(rng() * 0x10000000000000000)
          }
          data.writeLong(write.address, value)
          break
        case 'string':
          data.writeString(write.address, write.value)
          break
        }
      })
    }
    return data
  }

  function finalizeData(
    seed,
    version,
    preset,
    tournament,
    file,
    data,
    worker,
    url,
  ) {
    loadWorker(worker, url)
    let objects
    if (file) {
      objects = [file]
    }
    return new Promise(function(resolve, reject) {
      addEventListener.call(worker, 'message', function(result) {
        if (self) {
          result = result.data
        }
        if (result.error) {
          reject(result.error)
        } else {
          resolve(result)
        }
      })
      worker.postMessage({
        action: constants.WORKER_ACTION.FINALIZE,
        seed: seed,
        version: version,
        preset: preset,
        tournament: tournament,
        file: file,
        data: data,
        url: url,
      }, objects)
    })
  }

  function workerCountFromCores(cores) {
    return Math.max(Math.floor(3 * cores / 4), 1)
  }

  function indent(level) {
    return Array(level).fill(' ').join('')
  }

  function hasNonCircularPath(node, visited) {
    if (!node.locks) {
      return true
    }
    return node.locks.some(function(lock) {
      if (lock.some(function(node) { return visited.has(node) })) {
        return false
      }
      return lock.every(function(node) {
        visited.add(node)
        const res = hasNonCircularPath(node, visited)
        visited.delete(node)
        return res
      })
    })
  }

  function minifySolution(visited) {
    return function(min, lock, index) {
      const requirements = lock.map(function(node) {
        if (node.locks) {
          visited.add(node)
          const solution = node.locks.filter(function(lock) {
            if (lock.some(function(node) { return visited.has(node) })) {
              return false
            }
            return lock.every(function(node) {
              visited.add(node)
              const res = hasNonCircularPath(node, visited)
              visited.delete(node)
              return res
            })
          }).reduce(minifySolution(visited), {
            depth: 0,
            weight: 0,
          })
          visited.delete(node)
          return {
            item: node.item,
            depth: 1 + solution.depth,
            solution: solution,
          }
        }
        return {
          item: node.item,
          depth: 1,
        }
      })
      const depth = requirements.slice().sort(function(a, b) {
        return a.depth - b.depth
      }).pop().depth
      const weight = requirements.reduce(function(weight, requirement) {
        return weight + requirement.depth
      }, 0)
      const avg = weight / requirements.length
      const solution = {
        depth: depth,
        weight: weight,
        avg: avg,
        requirements: requirements,
      }
      if (min.depth === 0
          || solution.depth < min.depth
          || (solution.depth === min.depth
              && solution.weight < min.weight)
          || (solution.depth === min.depth
              && solution.weight === min.weight
              && solution.avg < min.avg)) {
        return solution
      }
      return min
    }
  }

  function simplifySolution(node) {
    if (node.solution && node.solution.requirements) {
      return {
        item: node.item,
        solution: node.solution.requirements.map(simplifySolution)
      }
    }
    return {
      item: node.item,
    }
  }

  function collectAbilities(node, map) {
    if (map.has(node.item)) {
      return map.get(node.item)
    }
    const abilities = new Set([node.item])
    if (node.solution && node.solution.requirements) {
      node.solution.requirements.forEach(function(node) {
        abilities.add(node.item)
        Array.from(collectAbilities(node, map)).forEach(function(ability) {
          abilities.add(ability)
        })
      })
    }
    map.set(node.item, abilities)
    return abilities
  }

  function pruneSubsets(node, map) {
    map = map || new Map()
    if (node.solution && node.solution.requirements) {
      const nodes = node.solution.requirements
      nodes.sort(function(a, b) {
        return b.depth - a.depth
      })
      const abilities = new Set()
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        pruneSubsets(node, map)
        Array.from(collectAbilities(node, map)).forEach(function(ability) {
          abilities.add(ability)
        })
        for (let j = i + 1; j < nodes.length; j++) {
          const curr = nodes[j]
          const requirements = Array.from(collectAbilities(curr, map))
          if (requirements.every(function(ability) {
            return abilities.has(ability)
          })) {
            nodes.splice(j--, 1)
          }
        }
      }
    }
  }

  function collapseSolution(node) {
    const items = []
    let curr = node
    while (curr.solution && curr.solution.length === 1) {
      items.push(curr.item)
      curr = curr.solution[0]
    }
    items.push(curr.item)
    if (curr.solution) {
      return {
        items: items,
        solution: curr.solution.map(collapseSolution)
      }
    }
    return {
      items: items,
    }
  }

  function renderNode(indentLevel, sub, relics, newNames, thrustSword, node) {
    const lines = []
    const names = node.items.map(function(ability) {
      const relic = relics.filter(function(relic) {
        return relic.ability === ability
      })[0]
      let relicName = relic.name
      let itemId
      if (relic.itemId) {
        itemId = relic.itemId
      } else if (ability === constants.RELIC.THRUST_SWORD) {
        itemId = thrustSword.id
      }
      if (itemId) {
        let item
        item = newNames.filter(function(item) {
          return item.id === itemId
        }).pop() || itemFromTileId(items, itemId + constants.tileIdOffset)
        if (item) {
          relicName = item.name
        }
      }
      return relicName
    })
    lines.push(
      indent(indentLevel)
        + (sub ? '^ ' : '')
        + names.join(' < ')
    )
    if (node.solution) {
      if (sub) {
        indentLevel += 2
      }
      indentLevel += names.slice(0, -1).concat(['']).join('   ').length
      const nodes = node.solution.map(renderNode.bind(
        null,
        indentLevel,
        true,
        relics,
        newNames,
        thrustSword,
      ))
      Array.prototype.push.apply(lines, nodes.reduce(function(lines, node) {
        Array.prototype.push.apply(lines, node)
        return lines
      }, []))
    }
    return lines
  }

  function renderSolutions(solutions, relics, newNames, thrustSword) {
    const minified = solutions.reduce(minifySolution(new WeakSet()), {
      depth: 0,
      weight: 0,
    })
    minified.requirements.forEach(function(node) {
      pruneSubsets(node)
    })
    const simplified = minified.requirements.map(simplifySolution)
    const collapsed = simplified.map(collapseSolution)
    const render = renderNode.bind(
      null,
      0,
      false,
      relics,
      newNames,
      thrustSword,
    )
    return collapsed.map(render).reduce(function(lines, node) {
      Array.prototype.push.apply(lines, node)
      return lines
    }, [])
  }

  const exports = {
    sha256: sha256,
    assert: assert,
    shopItemType: shopItemType,
    shopTileFilter: shopTileFilter,
    dropTileFilter: dropTileFilter,
    rewardTileFilter: rewardTileFilter,
    candleTileFilter: candleTileFilter,
    tankTileFilter: tankTileFilter,
    mapTileFilter: mapTileFilter,
    nonProgressionFilter: nonProgressionFilter,
    tilesFilter: tilesFilter,
    itemTileFilter: itemTileFilter,
    tileIdOffsetFilter: tileIdOffsetFilter,
    itemFromName: itemFromName,
    itemFromTileId: itemFromTileId,
    itemSlots: itemSlots,
    tileValue: tileValue,
    getRooms: getRooms,
    tileData: tileData,
    replaceBossRelicWithItem: replaceBossRelicWithItem,
    entityData: entityData,
    romOffset: romOffset,
    bufToHex: bufToHex,
    numToHex: numToHex,
    checked: checked,
    presetFromName: presetFromName,
    optionsFromString: optionsFromString,
    optionsToString: optionsToString,
    optionsFromUrl: optionsFromUrl,
    optionsToUrl: optionsToUrl,
    toGameString: toGameString,
    setSeedText: setSeedText,
    saltSeed: saltSeed,
    restoreFile: restoreFile,
    formatObject: formatObject,
    formatInfo: formatInfo,
    newInfo: newInfo,
    mergeInfo: mergeInfo,
    sanitizeResult: sanitizeResult,
    shuffled: shuffled,
    isItem: isItem,
    isRelic: isRelic,
    isCandle: isCandle,
    isContainer: isContainer,
    containedItem: containedItem,
    relicFromName: relicFromName,
    relicFromAbility: relicFromAbility,
    enemyFromIdString: enemyFromIdString,
    Preset: Preset,
    PresetBuilder: PresetBuilder,
    applyTournamentModePatches: applyTournamentModePatches,
    randoFuncMaster: randoFuncMaster,
    applyMagicMaxPatches: applyMagicMaxPatches,
    applyAntiFreezePatches: applyAntiFreezePatches,
    applyMyPursePatches: applyMyPursePatches,
    applyiwsPatches: applyiwsPatches,
    applyfastwarpPatches: applyfastwarpPatches,
    applynoprologuePatches: applynoprologuePatches,
    applyunlockedPatches: applyunlockedPatches,
    applysurprisePatches: applysurprisePatches,
    applyenemyStatRandoPatches: applyenemyStatRandoPatches,
    applyShopPriceRandoPatches: applyShopPriceRandoPatches,
    applyStartRoomRandoPatches: applyStartRoomRandoPatches,
	  applyBountyHunterTargets: applyBountyHunterTargets,
    applyDominoPatches: applyDominoPatches,
    applyRLBCPatches: applyRLBCPatches,
	  applyResistToImmunePotionsPatches: applyResistToImmunePotionsPatches,
    applyLibraryShortcutPatches: applyLibraryShortcutPatches,
    applyElemChaosPatches: applyElemChaosPatches,
    applySimpleInputPatches: applySimpleInputPatches,
    applyDevsStashPatches: applyDevsStashPatches,
    applyMapColor: applyMapColor,
    applyNewGoals: applyNewGoals,
    applyAlucardPalette: applyAlucardPalette,
    applySplashText: applySplashText,
    applyAlucardLiner: applyAlucardLiner,
    randomizeRelics: randomizeRelics,
    randomizeItems: randomizeItems,
    applyWrites: applyWrites,
    finalizeData: finalizeData,
    hasNonCircularPath: hasNonCircularPath,
    renderSolutions: renderSolutions,
    workerCountFromCores: workerCountFromCores,
  }
  if (self) {
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      util: exports,
    })
  } else {
    module.exports = exports
  }
})(typeof(self) !== 'undefined' ? self : null)
