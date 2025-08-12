(function(self) {

  let stats
  let items
  let constants
  let util

  if (self) {
    stats = self.sotnRando.stats
    items = self.sotnRando.items
    constants = self.sotnRando.constants
    util = self.sotnRando.util
  } else {
    stats = require('./stats')
    items = require('./items')
    constants = require('./constants')
    util = require('./util')
  }

  const shuffled = util.shuffled

  const weaponHandTypes = [
    constants.HAND_TYPE.SHORT_SWORD,
    constants.HAND_TYPE.SWORD,
    constants.HAND_TYPE.THROWING_SWORD,
    constants.HAND_TYPE.FIST,
    constants.HAND_TYPE.CLUB,
    constants.HAND_TYPE.TWO_HANDED_SWORD,
  ]

  function shuffleStats(rng, data, stats, stat, offset, func) {
    shuffled(rng, stats).forEach(function(item, index) {
      const addr = util.romOffset(constants.exe, stats[index].offset + offset)
      func.call(data, addr, item[stat])
    })
  }

  function shuffleHandStats(rng, data, newNames, stats, handType, options) {
    // Randomize names.
    let items
    items = stats.filter(function(item) {
      if ([
        constants.HAND_TYPE.FOOD,
        constants.HAND_TYPE.PROJECTILE_CONSUMABLE,
        constants.HAND_TYPE.OTHER,
      ].indexOf(item.handType) !== -1) {
        return false
      }
      if ([
        'Firebrand',
        'Thunderbrand',
        'Icebrand',
        'Stone sword',
        'Holy sword',
        'Dark Blade',
        'Sword Familiar',
        'Harper',
        'Gram',
        'Yasutsuna',
        'Monster vial 1',
        'Monster vial 2',
        'Monster vial 3',
        'Pentagram',
        'Bat Pentagram',
        'Neutron bomb',
        'Power of Sire',
        'Jewel sword',
        'Shield rod',
        'Mace',
        'Morningstar',
        'Holy rod',
        'Star flail',
        'Moon rod',
        'Were Bane',
        'Rapier',
      ].indexOf(item.name) !== -1) {
        return false
      }
      return true
    })
    if(options.itemNameRandoMode === true) {
      shuffled(rng, items).forEach(function(item, index) {
        newNames.push({
          id: stats[index].id,
          name: item.name,
        })
        let addr = util.romOffset(constants.exe, items[index].offset + 0x00)
        addr = data.writeWord(addr, item.nameAddress)
      })
    }
    if (handType != 'SHIELD') {
      // Randomize stats.
      if (weaponHandTypes.indexOf(handType) === -1) {
        shuffled(rng, stats).forEach(function(item, index) {
          let addr
          addr = util.romOffset(constants.exe, stats[index].offset + 0x08)
          addr = data.writeShort(addr, item.attack)
          addr = data.writeShort(addr, item.defense)
        })
        shuffleStats(rng, data, stats, 'stunFrames', 0x26, data.writeShort)
        shuffleStats(rng, data, stats, 'range', 0x28, data.writeShort)
      } else {
        shuffleStats(rng, data, stats, 'range', 0x28, data.writeShort)
      }
      items = stats.filter(function(item) {
        if ([
          'Mourneblade',
          'Jewel sword',
        ].indexOf(item.name) !== -1) {
          return false
        }
      })
      shuffleStats(rng, data, items, 'extra', 0x2a, data.writeChar)
      // Randomize icons and sprite.
      items = stats.filter(function(item) {
        if ([
          constants.HAND_TYPE.FOOD,
          constants.HAND_TYPE.DAMAGE_CONSUMABLE,
          constants.HAND_TYPE.PROJECTILE_CONSUMABLE,
        ].indexOf(item.handType) !== -1) {
          return false
        }
        if ([
          'Library card',
          'Meal ticket',
          'Life apple',
          'Hammer',
        ].indexOf(item.name) !== -1) {
          return false
        }
        return true
      })
      shuffleStats(rng, data, items, 'icon', 0x2c, data.writeShort)
    }
    // Randomize palettes.
    shuffleStats(rng, data, stats.filter(function(item) {
      return [
        'Meal ticket',
        'Library card',
      ].indexOf(item.name) === -1
    }), 'palette', 0x2e, data.writeShort)
  }

  function shuffleEquipmentStats(rng, data, newNames, stats, options) {
    // Randomize names.
    if(options.itemNameRandoMode === true) {
      function randomizeNames(items) {
        shuffled(rng, items).forEach(function(item, index) {
          newNames.push({
            id: items[index].id,
            name: item.name,
          })
          let addr = util.romOffset(constants.exe, items[index].offset + 0x00)
          addr = data.writeWord(addr, item.nameAddress)
        })
      }
      randomizeNames(stats.filter(function(item) {
        return [
          'Cloth tunic',
          'Hide cuirass',
          'Bronze cuirass',
          'Iron cuirass',
          'Steel cuirass',
          'Silver plate',
          'Gold plate',
          'Platinum mail',
          'Diamond plate',
          'Fire mail',
          'Lightning mail',
          'Ice mail',
          'Mirror cuirass',
          'Spike Breaker',
          'Dark armor',
          'Holy mail',
          'Moonstone',
          'Sunstone',
          'Bloodstone',
          'Gauntlet',
          'Duplicator',
          'Secret boots',
          'Sunglasses',
          'Holy glasses',
          'Goggles',
          'Ballroom mask',
          'Stone mask',
          'Felt hat',
          'Leather hat',
          'Velvet hat',
          'Wizard hat',
          'Ring of Pales',
          'Ring of Ares',
          'Gold ring',
          'Silver ring',
          'Ring of Varda',
          'Ring of Arcana',
          'Ring of Feanor',
          'Necklace of J',
        ].indexOf(item.name) === -1
      }))
      randomizeNames(stats.filter(function(item) {
        return [
          'Sunglasses',
          'Holy glasses',
          'Goggles',
          'Ballroom mask',
          'Stone mask',
        ].indexOf(item.name) !== -1
      }))
      randomizeNames(stats.filter(function(item) {
        return [
          'Felt hat',
          'Leather hat',
          'Velvet hat',
          'Wizard hat',
        ].indexOf(item.name) !== -1
      }))
      randomizeNames(stats.filter(function(item) {
        return [
          'Ring of Pales',
          'Ring of Ares',
          'Gold ring',
          'Silver ring',
          'Ring of Varda',
          'Ring of Arcana',
          'Ring of Feanor',
        ].indexOf(item.name) !== -1
      }))
    }
    // Randomize stats.
    function randomizeStats(items) {
      shuffled(rng, items).forEach(function(item, index) {
        let addr = util.romOffset(constants.exe, items[index].offset + 0x08)
        addr = data.writeShort(addr, item.attack)
        addr = data.writeShort(addr, item.defense)
        addr = data.writeChar(addr, item.strength)
        addr = data.writeChar(addr, item.constitution)
        addr = data.writeChar(addr, item.intelligence)
        addr = data.writeChar(addr, item.luck)
      })
    }
    randomizeStats(stats.filter(function(item) {
      // Ignore Duplicator, salable gems, gold & silver rings, and items that
      // have stats in their descriptions
      return [
        'God\'s Garb',
        'Silver crown',
        'Zircon',
        'Aquamarine',
        'Turquoise',
        'Onyx',
        'Garnet',
        'Opal',
        'Diamond',
        'Lapis lazuli',
        'Ring of Ares',
        'Gold ring',
        'Silver ring',
        'Necklace of J',
        'Gauntlet',
        'Ring of Feanor',
        'Medal',
        'Duplicator',
        'King\'s stone',
        'Covenant stone',
        'Nauglamir',
        'Circlet',
        'Gold circlet',
        'Ruby circlet',
        'Opal circlet',
        'Topaz circlet',
        'Beryl circlet',
        'Cat-eye circl.',
        'Coral circlet',
      ].indexOf(item.name) === -1
    }))
    randomizeStats(stats.filter(function(item) {
      return [
        'Circlet',
        'Gold circlet',
        'Ruby circlet',
        'Opal circlet',
        'Topaz circlet',
        'Beryl circlet',
        'Cat-eye circl.',
        'Coral circlet',
      ].indexOf(item.name) !== -1
    }))
    // Randomize icons.
    function randomizeIcons(items) {
      shuffleStats(rng, data, items, 'icon', 0x18, data.writeShort)
    }
    randomizeIcons(stats.filter(function(item) {
      return [
        'Gauntlet',
        'Duplicator',
        'Secret boots',
        'Sunglasses',
        'Holy glasses',
        'Goggles',
        'Ballroom mask',
        'Stone mask',
        'Felt hat',
        'Leather hat',
        'Velvet hat',
        'Wizard hat',
        'Circlet',
        'Gold circlet',
        'Ruby circlet',
        'Opal circlet',
        'Topaz circlet',
        'Beryl circlet',
        'Cat-eye circl.',
        'Coral circlet',
        'Ring of Pales',
        'Zircon',
        'Aquamarine',
        'Turquoise',
        'Onyx',
        'Garnet',
        'Opal',
        'Diamond',
        'Lapis lazuli',
        'Ring of Ares',
        'Gold ring',
        'Silver ring',
        'Ring of Varda',
        'Ring of Arcana',
        'Ring of Feanor',
        'Necklace of J',
        'Nauglamir',
        'Mystic pendant',
      ].indexOf(item.name) === -1
    }))
    randomizeIcons(stats.filter(function(item) {
      return [
        'Sunglasses',
        'Holy glasses',
        'Goggles',
        'Ballroom mask',
        'Stone mask',
      ].indexOf(item.name) !== -1
    }))
    randomizeIcons(stats.filter(function(item) {
      return [
        'Felt hat',
        'Leather hat',
        'Velvet hat',
        'Wizard hat',
      ].indexOf(item.name) !== -1
    }))
    randomizeIcons(stats.filter(function(item) {
      return [
        'Circlet',
        'Gold circlet',
        'Ruby circlet',
        'Opal circlet',
        'Topaz circlet',
        'Beryl circlet',
        'Cat-eye circl.',
        'Coral circlet',
      ].indexOf(item.name) !== -1
    }))
    randomizeIcons(stats.filter(function(item) {
      return [
        'Zircon',
        'Aquamarine',
        'Turquoise',
        'Onyx',
        'Garnet',
        'Opal',
        'Diamond',
        'Lapis lazuli',
        'Gold ring',
        'Silver ring',
        'Ring of Varda',
        'Ring of Arcana',
        'Ring of Feanor',
      ].indexOf(item.name) !== -1
    }))
    randomizeIcons(stats.filter(function(item) {
      return [
        'Necklace of J',
        'Nauglamir',
        'Mystic pendant',
      ].indexOf(item.name) !== -1
    }))
    // Randomize palettes.
    shuffleStats(rng, data, stats, 'palette', 0x1a, data.writeShort)
  }

  function randomizeStats(rng, options) {
    const data = new util.checked()
    const newNames = []
    if (options.stats) {
      // Randomize hand item stats by type.
      Object.getOwnPropertyNames(constants.HAND_TYPE).forEach(
        function(handType) {
          const items = stats.hand.filter(function(item) {
            return item.handType === constants.HAND_TYPE[handType]
          })
          shuffleHandStats(rng, data, newNames, items, handType, options)
        }
      )
      // Randomize attack, defense, and stunFrames of all weapons.
      const weapons = stats.hand.filter(function(item) {
        return weaponHandTypes.indexOf(item.handType) !== -1
      })
      shuffled(rng, weapons).forEach(function(item, index) {
        let addr
        addr = util.romOffset(constants.exe, weapons[index].offset + 0x08)
        addr = data.writeShort(addr, item.attack)
        addr = data.writeShort(addr, item.defense)
      })
      shuffleStats(rng, data, weapons, 'stunFrames', 0x26, data.writeShort)
      // Choose random item's palette for cards.
      const rand = shuffled(rng, stats.hand).pop()
      stats.hand.filter(function(item) {
        return [
          'Meal ticket',
          'Library card',
        ].indexOf(item.name) !== -1
      }).forEach(function(item) {
        let addr = util.romOffset(constants.exe, item.offset + 0x2e)
        addr = data.writeShort(addr, rand.palette)
      })
      // Randomize equipment item stats.
      Object.getOwnPropertyNames(constants.TYPE).forEach(
        function(type) {
          const items = stats.equipment.filter(function(item) {
            return item.type === constants.TYPE[type]
          })
          shuffleEquipmentStats(rng, data, newNames, items, options)
        }
      )
    }
    return {
      newNames: newNames,
      data: data,
    }
  }

  const exports = randomizeStats
  if (self) {
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      randomizeStats: exports,
    })
  } else {
    module.exports = exports
  }
})(typeof(self) !== 'undefined' ? self : null)
