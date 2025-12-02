(function(self) {

  let constants
  if (self) {
    constants = self.sotnRando.constants
  } else {
    constants = require('./constants')
  }
  const EXTENSION = constants.EXTENSION
  const RELIC = constants.RELIC
  const TYPE = constants.TYPE
  const ZONE = constants.ZONE
  const SLOT = constants.SLOT
  const slots = constants.slots
  const equipIdOffset = constants.equipIdOffset
  const invOffset = constants.equipmentInvIdOffset
  const tileIdOffset = constants.tileIdOffset

  function items() {
    let items
    if (self) {
      items = self.sotnRando.items
    } else {
      items = require('./items')
    }
    return items
  }

  function util() {
    let util
    if (self) {
      util = self.sotnRando.util
    } else {
      util = require('./util')
    }
    return util
  }

  function replaceShopRelicWithRelic(data, jewelOfOpen, relic) {
    const shopRelicNameAddress = 0x047d5650
    const shopRelicIdAddress = 0x047dbde0
    const shopRelicIdOffset = 0x64
    // Write relic id.
    const address = jewelOfOpen.ids[0].addresses[0]
    data.writeChar(address, relic.relicId)
    // Fix shop menu check.
    data.writeChar(shopRelicIdAddress, relic.relicId + shopRelicIdOffset)
    // Change shop menu name.
    const string = Array(16)
    let i = 0
    while (i < string.length) {
      if (i < relic.name.length) {
        if (relic.name.charCodeAt(i) === ' ') {
          string[i] = ' '.charCodeAt()
        } else {
          string[i] = relic.name.charCodeAt(i) - 0x20
        }
      } else if (i === relic.name.length) {
        string[i] = 0xff
      } else {
        string[i] = 0x00
      }
      i++
    }
    string[relic.name.length + 0] = 0xff
    string[relic.name.length + 1] = 0x00
    data.writeString(shopRelicNameAddress, string)
  }

  function replaceShopRelicWithItem(data, jewelOfOpen, item) {
    let offset
    const id = item.id
    const zone = constants.zones[constants.ZONE.LIB]
    const slots = util().itemSlots(item)
    // Write item type.
    const type = util().shopItemType(item)
    data.writeChar(util().romOffset(zone, 0x134c), type)
    // Write item id.
    const tileValue = util().tileValue(item, {shop: true})
    data.writeShort(util().romOffset(zone, 0x134e), tileValue)
    data.writeShort(util().romOffset(zone, 0x14d4), tileValue)
    // Write short item type.
    offset = util().romOffset(zone, 0x032b80)
    offset = data.writeWord(offset, 0x96220000) // lhu v0, 0x0000 (s1)
    // Load byte item type.
    offset = util().romOffset(zone, 0x033050)
    offset = data.writeWord(offset, 0x90a30000) // lbu v1, 0x0000 (a1)
    offset = util().romOffset(zone, 0x033638)
    offset = data.writeWord(offset, 0x90234364) // lbu v1, 0x4364 (at)
    offset = util().romOffset(zone, 0x03369c)
    offset = data.writeWord(offset, 0x90224364) // lbu v0, 0x4364 (at)
    offset = util().romOffset(zone, 0x033730)
    offset = data.writeWord(offset, 0x90234364) // lbu v1, 0x4364 (at)
    offset = util().romOffset(zone, 0x03431c)
    offset = data.writeWord(offset, 0x92620000) // lbu v0, 0x0000 (s3)
    offset = util().romOffset(zone, 0x0343c0)
    offset = data.writeWord(offset, 0x92630000) // lbu v1, 0x0000 (s3)
    offset = util().romOffset(zone, 0x034f10)
    offset = data.writeWord(offset, 0x90430000) // lbu v1, 0x0000 (v0)
    offset = util().romOffset(zone, 0x0359f4)
    offset = data.writeWord(offset, 0x92a30000) // lbu v1, 0x0000 (s5)
    // Load relic icon.
    offset = util().romOffset(zone, 0x034fb4)
    offset = data.writeWord(offset, 0x00801021) // addu v0, a0, r0
    // Load relic id for purchase.
    offset = util().romOffset(zone, 0x033750)
    offset = data.writeWord(offset, 0x00402021) // addu a0, v0, r0
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x00000000) // nop
    // Entry point.
    offset = util().romOffset(zone, 0x032b08)
    offset = data.writeWord(offset, 0x08075180) // j 0x801d4600
    offset = data.writeWord(offset, 0x00000000) // nop
    // Equipped check.
    offset = util().romOffset(zone, 0x054600)
    //                                          // ori v1, r0, id
    offset = data.writeWord(offset, 0x34030000 + id + equipIdOffset)
    slots.forEach(function(slot, index) {
      //                                          // lui v0, 0x8009
      offset = data.writeWord(offset, 0x3c028000 + (slot >>> 16))
      //                                          // lbu v0, slot (v0)
      offset = data.writeWord(offset, 0x90420000 + (slot & 0xffff))
      offset = data.writeWord(offset, 0x00000000) // nop
      const next = 4 + 5 * (slots.length - index - 1)
      //                                          // beq v0, v1, pc + next
      offset = data.writeWord(offset, 0x10430000 + next)
      offset = data.writeWord(offset, 0x00000000) // nop
    })
    // Inventory check.
    offset = data.writeWord(offset, 0x3c028009) // lui v0, 0x8009
    //                                          // lbu v0, 0x798a + id (v0)
    offset = data.writeWord(offset, 0x90420000 + id + invOffset)
    offset = data.writeWord(offset, 0x00000000) // nop
    // Return.
    offset = data.writeWord(offset, 0x0806cac7) // j 0x801b2b1c
    offset = data.writeWord(offset, 0x00000000) // nop
    // Entry point.
    offset = util().romOffset(zone, 0x033050)
    offset = data.writeWord(offset, 0x08075190) // j 0x801d4640
    // Load base address.
    offset = util().romOffset(zone, 0x054640)
    offset = data.writeWord(offset, 0x90a20001) // lbu v0, 0x0001 (a1)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x2c4200ff) // sltiu v0, v0, 0x00ff
    offset = data.writeWord(offset, 0x14400003) // bne v0, r0, pc + 0x10
    offset = data.writeWord(offset, 0x90a30000) // lbu v1, 0x0000 (a1)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x34030005) // ori v1, r0, 0x0005
    offset = data.writeWord(offset, 0x0806cc16) // j 0x801b3058
    offset = data.writeWord(offset, 0x00000000) // nop
    // Patch checker.
    offset = util().romOffset(zone, 0x03317c)
    offset = data.writeWord(offset, 0x080751a0) // j 0x801d4680
    offset = data.writeWord(offset, 0x00000000) // nop
    // Injection.
    offset = util().romOffset(zone, 0x054680)
    slots.forEach(function(slot, index) {
      //                                          // lui v0, 0x8009
      offset = data.writeWord(offset, 0x3c028000 + (slot >>> 16))
      //                                          // lbu v0, slot (v0)
      offset = data.writeWord(offset, 0x90420000 + (slot & 0xffff))
      offset = data.writeWord(offset, 0x00000000) // nop
      const next = 5 + 5 * (slots.length - index - 1)
      //                                          // beq v0, s3, pc + next
      offset = data.writeWord(offset, 0x10530000 + next)
      offset = data.writeWord(offset, 0x00000000) // nop
    })
    // Inventory check.
    offset = data.writeWord(offset, 0x3c028009) // lui v0, 0x8009
    //                                          // lbu v0, 0x798a + id (v0)
    offset = data.writeWord(offset, 0x90420000 + id + invOffset)
    offset = data.writeWord(offset, 0x00000000) // nop
    // Return.
    offset = data.writeWord(offset, 0x10400003) // beq v0, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x0806cc1f) // j 0x801b307c
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x0806cc69) // j 0x801b31a4
    offset = data.writeWord(offset, 0x00000000) // nop
    // Entry point.
    offset = util().romOffset(zone, 0x03431c)
    offset = data.writeWord(offset, 0x080751c0) // j 0x801d4700
    offset = data.writeWord(offset, 0x00000000) // nop
    // Quantity check.
    offset = util().romOffset(zone, 0x054700)
    offset = data.writeWord(offset, 0x92620001) // lbu v0, 0x0001 (s3)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x2c4200ff) // sltiu v0, v0, 0x00ff
    offset = data.writeWord(offset, 0x14400003) // bne v0, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x0806d0d9) // j 0x801b4364
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x92620000) // lbu v0, 0x0000 (s3)
    offset = data.writeWord(offset, 0x0806d0c9) // j 0x801b4324
    offset = data.writeWord(offset, 0x00000000) // nop
  }

  function replaceRingOfVladWithItem(
    data,
    relic,
    item,
    index,
  ) {
    let offset
    const id = item.id
    const zone = constants.zones[ZONE.RNZ1]
    const slots = util().itemSlots(item)
    // Patch instructions that load a relic.
    data.writeWord(
      relic.erase.instructions[0].addresses[0],
      relic.erase.instructions[0].instruction,
    )
    data.writeWord(0x059ee2c8, 0x3402000c)
    data.writeWord(0x059ee2d4, 0x24423a54)
    data.writeShort(0x059ee2e4, index)
    offset = util().romOffset(zone, 0x2dd6)
    data.writeShort(offset, index)
    // Replace item in rewards table.
    offset = util().romOffset(zone, zone.rewards)
    data.writeShort(offset, id + tileIdOffset)
    // Replace item in items table.
    offset = util().romOffset(zone, zone.items + 0x02 * index)
    data.writeShort(offset, id + tileIdOffset)
    // Injection point.
    offset = util().romOffset(zone, 0x02c860)
    data.writeWord(offset, 0x0806fbb4)          // j 0x801beed0
    offset = util().romOffset(zone, 0x02c868)
    data.writeWord(offset, 0x00000000)          // nop
    // Get Bat defeat time.
    offset = util().romOffset(zone, 0x3eed0)
    offset = data.writeWord(offset, 0x3c020003) // lui v0, 0x0003
    offset = data.writeWord(offset, 0x3442ca78) // ori v0, v0, 0xca78
    offset = data.writeWord(offset, 0x8c420000) // lw v0, 0x0000 (v0)
    offset = data.writeWord(offset, 0x00000000) // nop
    // Branch if zero.
    offset = data.writeWord(offset, 0x10400005) // beq v0, r0, pc + 0x18
    offset = data.writeWord(offset, 0x00000000) // nop
    // Change entity's position and slot.
    offset = data.writeWord(offset, 0x3c088018) // lui t0, 0x8018
    //                                          // ori t1, r0, y
    offset = data.writeWord(offset, 0x34090000 + relic.asItem.y)
    relic.entity.entities.forEach(function(addr) {
      //                                        // sh t1, entity + 0x02 (t0)
      offset = data.writeWord(offset, 0xa5090000 + addr + 0x02)
    })
    // Zero out tile function pointer if item is in inventory.
    //                                          // ori v0, r0, id
    offset = data.writeWord(offset, 0x34020000 + id + equipIdOffset)
    slots.forEach(function(slot, index) {
      //                                          // lui s0, 0x8009
      offset = data.writeWord(offset, 0x3c108000 + (slot >>> 16))
      //                                          // lbu s0, slot (s0)
      offset = data.writeWord(offset, 0x92100000 + (slot & 0xffff))
      offset = data.writeWord(offset, 0x00000000) // nop
      const next = 5 + 5 * (slots.length - index - 1)
      //                                          // beq s0, v0, pc + next
      offset = data.writeWord(offset, 0x12020000 + next)
      offset = data.writeWord(offset, 0x00000000) // nop
    })
    offset = data.writeWord(offset, 0x3c108009) // lui s0, 0x8009
    //                                          // lbu s0, 0x798a + id (s0)
    offset = data.writeWord(offset, 0x92100000 + id + invOffset)
    offset = data.writeWord(offset, 0x00000000) // nop
    offset = data.writeWord(offset, 0x12000002) // beq s0, r0, pc + 0x0c
    offset = data.writeWord(offset, 0x3c108007) // lui s0, 0x8007
    offset = data.writeWord(offset, 0xae0065f0) // sw r0, 0x65f0 (s0)
    // Return.
    offset = data.writeWord(offset, 0x0806b21a) // j 0x801ac868
    offset = data.writeWord(offset, 0x00000000) // nop
  }

  function replaceGoldRingWithRelic(data, item, relic) {
    let offset
    const zone = constants.zones[constants.ZONE.NO4]
    // Put relic in entity table.
    const itemId = item.itemId + constants.tileIdOffset
    const goldRing = util().itemFromTileId(items(), itemId)
    const entity = goldRing.tiles[0]
    entity.entities.forEach(function(addr) {
      data.writeShort(util().romOffset(zone, addr + 8), relic.relicId)
    })
    // Injection point.
    offset = util().romOffset(zone, 0x04c590)
    offset = data.writeWord(offset, 0x08077aed) // j 0x801debb4
    // Branch.
    offset = util().romOffset(zone, 0x05ebb4)
    offset = data.writeWord(offset, 0x10400003) // beq v0, r0, pc + 0x10
    offset = data.writeWord(offset, 0x00000000) // nop
    // Return.
    offset = data.writeWord(offset, 0x08073166) // j 0x801cc598
    offset = data.writeWord(offset, 0x00000000) // nop
    // Get Succubus defeat time.
    offset = data.writeWord(offset, 0x3c020003) // lui v0, 0x0003
    offset = data.writeWord(offset, 0x3442ca4c) // ori v0, v0, 0xca4c
    offset = data.writeWord(offset, 0x8c420000) // lw v0, 0x0000 (v0)
    offset = data.writeWord(offset, 0x00000000) // nop
    // Branch if zero.
    offset = data.writeWord(offset, 0x10400006) // beq v0, r0, pc + 0x1c
    offset = data.writeWord(offset, 0x00000000) // nop
    // Patch entity type.
    offset = data.writeWord(offset, 0x3403000b) // ori v1, r0, 0x000b
    offset = data.writeWord(offset, 0x3c028018) // lui v0, 0x8018
    entity.entities.forEach(function(addr) {
      //                                        // sh v1, addr + 4 (v0)
      offset = data.writeWord(offset, 0xa4430000 + addr + 4)
    })
    offset = data.writeWord(offset, 0x34020000) // ori v0, r0, 0x0000
    // Return.
    offset = data.writeWord(offset, 0x0807316f) // j 0x801cc5bc
    offset = data.writeWord(offset, 0x00000000) // nop
  }

  function replaceHolyGlassesWithRelic(data, item, relic) {
    let offset
    const zone = constants.zones[constants.ZONE.CEN]
    // Erase Holy Glasses.
    data.writeWord(
      item.erase.instructions[0].addresses[0],
      item.erase.instructions[0].instruction,
    )
    // Replace entity with relic.
    const entity = [ 0x1328, 0x13be ]
    entity.forEach(function(addr) {
      offset = util().romOffset(zone, addr + 0x00)
      data.writeShort(offset, 0x0180)
      offset = util().romOffset(zone, addr + 0x02)
      data.writeShort(offset, 0x022c)
      offset = util().romOffset(zone, addr + 0x04)
      data.writeShort(offset, 0x000b)
      offset = util().romOffset(zone, addr + 0x06)
      data.writeShort(offset, 0x0000)
      offset = util().romOffset(zone, addr + 0x08)
      data.writeShort(offset, relic.relicId)
    })
  }

  function replaceBossRelicWithItem(opts) {
    return function(data, relic, item, index) {
      util().replaceBossRelicWithItem(opts)(
        data,
        relic,
        item,
        index
      )
    }
  }

  const relics = [{
    name: 'Soul of Bat',
    ability: RELIC.SOUL_OF_BAT,
    relicId: 0,
    entity: {
      zones: [ ZONE.LIB ],
      entities: [ 0x3826, 0x3f06 ],
    },
    invAddress: 0x7964,
  }, {
    name: 'Fire of Bat',
    ability: RELIC.FIRE_OF_BAT,
    relicId: 1,
    entity: {
      zones: [ ZONE.NZ1 ],
      entities: [ 0x28ae, 0x32ba ],
    },
    asItem: {
      y: 0x00c9,
    },
    invAddress: 0x7965,
  }, {
    name: 'Echo of Bat',
    ability: RELIC.ECHO_OF_BAT,
    relicId: 2,
    entity: {
      zones: [ ZONE.NO2 ],
      entities: [ 0x35f6, 0x3d1e ],
    },
    asItem: {
      y: 0x009d,
    },
    invAddress: 0x7966,
  }, {
    name: 'Force of Echo',
    ability: RELIC.FORCE_OF_ECHO,
    relicId: 3,
    entity: {
      zones: [ ZONE.RNO4 ],
      entities: [ 0x3718, 0x4686 ],
    },
    asItem: {
      y: 0x00b9,
    },
    invAddress: 0x7967,
  }, {
    name: 'Soul of Wolf',
    ability: RELIC.SOUL_OF_WOLF,
    relicId: 4,
    entity: {
      zones: [ ZONE.NO1 ],
      entities: [ 0x3c2e, 0x4356 ],
    },
    asItem: {
      y: 0x0331,
    },
    invAddress: 0x7968,
  }, {
    name: 'Power of Wolf',
    ability: RELIC.POWER_OF_WOLF,
    relicId: 5,
    entity: {
      zones: [ ZONE.NO3, ZONE.NP3 ],
      entities: [ 0x41e2, 0x4914, 0x3fbe, 0x468c ],
    },
    asItem: {
      y: 0x00c8,
    },
    invAddress: 0x7969,
  }, {
    name: 'Skill of Wolf',
    ability: RELIC.SKILL_OF_WOLF,
    relicId: 6,
    entity: {
      zones: [ ZONE.NZ0 ],
      entities: [ 0x3054, 0x3998 ],
      replaceWithRelic: false,
    },
    ids: [{
      zone: ZONE.NZ0,
      addresses: [ 0x054b1d5a ],
    }],
    asItem: {
      x: 0x007e,
      y: 0x00b9,
    },
    invAddress: 0x796a,
  }, {
    name: 'Form of Mist',
    ability: RELIC.FORM_OF_MIST,
    relicId: 7,
    entity: {
      zones: [ ZONE.ARE ],
      entities: [ 0x304a, 0x36c8 ],
    },
    asItem: {
      y: 0x0099,
    },
    invAddress: 0x796b,
  }, {
    name: 'Power of Mist',
    ability: RELIC.POWER_OF_MIST,
    relicId: 8,
    entity: {
      zones: [ ZONE.TOP ],
      entities: [ 0x2138, 0x27ac ],
    },
    asItem: {
      y: 0x04c8,
    },
    invAddress: 0x796c,
  }, {
    name: 'Gas Cloud',
    ability: RELIC.GAS_CLOUD,
    relicId: 9,
    entity: {
      zones: [ ZONE.RCAT ],
      entities: [ 0x2596, 0x30ba ],
    },
    asItem: {
      x: 0x0016,
      y: 0x00b1,
    },
    invAddress: 0x796d,
  }, {
    name: 'Cube of Zoe',
    ability: RELIC.CUBE_OF_ZOE,
    relicId: 10,
    entity: {
      zones: [ ZONE.NO3, ZONE.NP3 ],
      entities: [ 0x411a, 0x48a6, 0x3ece, 0x460a ],
    },
    asItem: {
      y: 0x007b,
    },
    invAddress: 0x796e,
  }, {
    name: 'Spirit Orb',
    ability: RELIC.SPIRIT_ORB,
    relicId: 11,
    entity: {
      zones: [ ZONE.NO0 ],
      entities: [ 0x309e, 0x3ff0 ],
    },
    asItem: {
      x: 0x0043,
    },
    invAddress: 0x796f,
  }, {
    name: 'Gravity Boots',
    ability: RELIC.GRAVITY_BOOTS,
    relicId: 12,
    entity: {
      zones: [ ZONE.NO0 ],
      entities: [ 0x298a, 0x37ec ],
    },
    asItem: {
      y: 0x00b9,
    },
    invAddress: 0x7970,
  }, {
    name: 'Leap Stone',
    ability: RELIC.LEAP_STONE,
    relicId: 13,
    entity: {
      zones: [ ZONE.TOP ],
      entities: [ 0x2142, 0x286a ],
    },
    asItem: {
      y: 0x0729,
    },
    invAddress: 0x7971,
  }, {
    name: 'Holy Symbol',
    ability: RELIC.HOLY_SYMBOL,
    relicId: 14,
    entity: {
      zones: [ ZONE.NO4 ],
      entities: [ 0x3ea6, 0x4f38 ],
    },
    asItem: {
      y: 0x00b9,
    },
    invAddress: 0x7972,
  }, {
    name: 'Faerie Scroll',
    ability: RELIC.FAERIE_SCROLL,
    relicId: 15,
    entity: {
      zones: [ ZONE.LIB ],
      entities: [ 0x3510, 0x3a92 ],
    },
    asItem: {
      y: 0x00b9,
    },
    invAddress: 0x7973,
  }, {
    name: 'Jewel of Open',
    ability: RELIC.JEWEL_OF_OPEN,
    relicId: 16,
    ids: [{
      zone: ZONE.LIB,
      addresses: [ 0x047a321c ],
    }],
    erase: {
      instructions: [{
        addresses: [ 0x047dbde0 ],
        instruction: 0x34020001,
      }],
    },
    replaceWithRelic: replaceShopRelicWithRelic,
    replaceWithItem: replaceShopRelicWithItem,
    consumesItem: false,
    invAddress: 0x7974,
  }, {
    name: 'Merman Statue',
    ability: RELIC.MERMAN_STATUE,
    relicId: 17,
    entity: {
      zones: [ ZONE.NO4 ],
      entities: [ 0x4004, 0x50aa ],
    },
    asItem: {
      y: 0x00b9,
    },
    invAddress: 0x7975,
  }, {
    name: 'Bat Card',
    ability: RELIC.BAT_CARD,
    relicId: 18,
    entity: {
      zones: [ ZONE.NZ0, ZONE.NZ0 ],
      entities: [ 0x2a8c, 0x33d0, 0x2ad2, 0x343e ],
      replaceWithRelic: false,
    },
    ids: [{
      zone: ZONE.NZ0,
      addresses: [ 0x054b1d58 ],
    }],
    asItem: {
      x: 0x007e,
      y: 0x00b9,
    },
    invAddress: 0x7976,
  }, {
    name: 'Ghost Card',
    ability: RELIC.GHOST_CARD,
    relicId: 19,
    entity: {
      zones: [ ZONE.TOP ],
      entities: [ 0x25fc, 0x2ba8 ],
    },
    asItem: {
      y: 0x02a8,
    },
    invAddress: 0x7977,
  }, {
    name: 'Faerie Card',
    ability: RELIC.FAERIE_CARD,
    relicId: 20,
    entity: {
      zones: [ ZONE.LIB ],
      entities: [ 0x3574, 0x3c2c ],
    },
    asItem: {
      y: 0x00b9,
    },
    invAddress: 0x7978,
  }, {
    name: 'Demon Card',
    ability: RELIC.DEMON_CARD,
    relicId: 21,
    entity: {
      zones: [ ZONE.CHI ],
      entities: [ 0x1ade, 0x1e62 ],
    },
    asItem: {
      y: 0x00b8,
    },
    invAddress: 0x7979,
  }, {
    name: 'Sword Card',
    ability: RELIC.SWORD_CARD,
    relicId: 22,
    entity: {
      zones: [ ZONE.NO2 ],
      entities: [ 0x3416, 0x3b3e ],
    },
    asItem: {
      y: 0x009c,
    },
    invAddress: 0x797a,
  }, {
    name: 'Sprite Card',
    ability: RELIC.SPRITE_CARD,
    relicId: 23,
    extension: EXTENSION.GUARDED,
    invAddress: 0x797b,
  }, {
    name: 'Nosedevil Card',
    ability: RELIC.NOSEDEVIL_CARD,
    relicId: 24,
    extension: EXTENSION.GUARDED,
    invAddress: 0x797c,
  }, {
    name: 'Heart of Vlad',
    ability: RELIC.HEART_OF_VLAD,
    relicId: 25,
    entity: {
      zones: [ ZONE.RDAI ],
      entities: [ 0x1dc4, 0x2730 ],
    },
    reward: {
      zone: ZONE.RBO3,
      index: 0x11,
    },
    erase: {
      instructions: [{
        addresses: [ 0x06757b54 ],
        instruction: 0x34020000,
      }],
    },
    replaceWithItem: replaceBossRelicWithItem({
      boss:   ZONE.RBO3,
      entry:  0x034950,
      inj:    0x047900,
    }),
    asItem: {
      y: 0x00c9,
    },
    invAddress: 0x797d,
  }, {
    name: 'Tooth of Vlad',
    ability: RELIC.TOOTH_OF_VLAD,
    relicId: 26,
    entity: {
      zones: [ ZONE.RNO1 ],
      entities: [ 0x2332, 0x2a1e ],
    },
    reward: {
      zone: ZONE.RBO4,
      index: 0x12,
    },
    erase: {
      instructions: [{
        addresses: [ 0x067ec398 ],
        instruction: 0x34020000,
      }],
    },
    replaceWithItem: replaceBossRelicWithItem({
      boss:   ZONE.RBO4,
      entry:  0x029fc0,
      inj:    0x037500,
    }),
    asItem: {
      y: 0x00b9,
    },
    invAddress: 0x797e,
  }, {
    name: 'Rib of Vlad',
    ability: RELIC.RIB_OF_VLAD,
    relicId: 27,
    entity: {
      zones: [ ZONE.RNO2 ],
      entities: [ 0x29d4, 0x31b8 ],
    },
    reward: {
      zone: ZONE.RBO7,
      index: 0x13,
    },
    erase: {
      instructions: [{
        addresses: [ 0x069e8524 ],
        instruction: 0x34020000,
      }],
    },
    replaceWithItem: replaceBossRelicWithItem({
      boss:   ZONE.RBO7,
      entry:  0x037014,
      inj:    0x04bf00,
    }),
    asItem: {
      y: 0x01b9,
    },
    invAddress: 0x797f,
  }, {
    name: 'Ring of Vlad',
    ability: RELIC.RING_OF_VLAD,
    relicId: 28,
    entity: {
      zones: [ ZONE.RNZ1 ],
      entities: [ 0x2dce, 0x3640 ],
      erase: false,
    },
    ids: [{
      zone: ZONE.RNZ1,
      addresses: [ 0x059e8074, 0x059ee2e4, 0x059bdb30 ]
    }],
    erase: {
      instructions: [{
        addresses: [ 0x059ee594 ],
        instruction: 0x34020000,
      }, {
        addresses: [ 0x059ee2d0 ],
        instruction: 0x34020000,
      }, {
        addresses: [ 0x059ee2d4 ],
        instruction: 0x00000000,
      }],
    },
    replaceWithItem: replaceRingOfVladWithItem,
    asItem: {
      y: 0x00c9,
    },
    invAddress: 0x7980,
  }, {
    name: 'Eye of Vlad',
    ability: RELIC.EYE_OF_VLAD,
    relicId: 29,
    entity: {
      zones: [ ZONE.RCHI ],
      entities: [ 0x18f2, 0x1d52 ],
    },
    reward: {
      zone: ZONE.RBO2,
      index: 0x15,
    },
    erase: {
      instructions: [{
        addresses: [ 0x06644cf0 ],
        instruction: 0x34020000,
      }],
    },
    replaceWithItem: replaceBossRelicWithItem({
      boss:   ZONE.RBO2,
      entry:  0x01af18,
      inj:    0x02a000,
    }),
    asItem: {
      y: 0x0079,
    },
    invAddress: 0x7981,
  }, {
    name: 'Spike Breaker',
    ability: RELIC.SPIKE_BREAKER,
    itemId: 183,
    tileIndex: 0,
    asRelic: {
      y: 0x0094,
    },
  }, {
    name: 'Gold ring',
    ability: RELIC.GOLD_RING,
    itemId: 241,
    entity: {
      zones: [ ZONE.NO4 ],
      entities: [ 0x4270, 0x52ee ],
    },
    ids: [{
      zone: ZONE.NO4,
      addresses: [ 0x04c324b4 ],
      tileId: true,
    }],
    replaceWithRelic: replaceGoldRingWithRelic,
  }, {
    name: 'Silver ring',
    ability: RELIC.SILVER_RING,
    itemId: 242,
    tileIndex: 0,
    asRelic: {
      y: 0x009a,
    },
  }, {
    name: 'Holy glasses',
    ability: RELIC.HOLY_GLASSES,
    itemId: 203,
    ids: [{
      zone: ZONE.CEN,
      addresses: [ 0x0456e368 ],
    }],
    erase: {
      instructions: [{
        addresses: [ 0x0456e360 ],
        instruction: 0x08063ff6,
      }],
    },
    replaceWithRelic: replaceHolyGlassesWithRelic,
  }, {
    name: 'Thrust sword',
    ability: RELIC.THRUST_SWORD,
    consumesItem: false,
  }]

  const exports = relics
  if (self) {
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      relics: exports,
    })
  } else {
    module.exports = exports
  }
})(typeof(self) !== 'undefined' ? self : null)
