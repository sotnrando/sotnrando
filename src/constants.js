(function(self) {

  const devBaseUrl = 'https://dev.sotn.io/'
  const defaultOptions = 'p:safe'

  const optionsUrls = {
    'p:safe': 'https://sotn.io/',
    'p:adventure': 'https://a.sotn.io/',
    'p:casual': 'https://c.sotn.io/',
    'p:sequence-breaker': 'https://s.sotn.io/',
    'p:glitch': 'https://g.sotn.io/',
    'p:scavenger': 'https://sc.sotn.io/',
    'p:empty-hand': 'https://eh.sotn.io/',
    'p:og': 'https://og.sotn.io/',
    'p:gem-farmer': 'https://gf.sotn.io/',

    // Tournament mode URLs
    'tp:safe': 'https://t.sotn.io/',
    'tp:adventure': 'https://a.t.sotn.io/',
    'tp:casual': 'https://c.t.sotn.io/',
    'tp:speedrun': 'https://s.t.sotn.io/',
    'tp:glitch': 'https://g.t.sotn.io/',
    'tp:scavenger': 'https://sc.t.sotn.io/',
    'tp:empty-hand': 'https://eh.t.sotn.io/',
    'tp:og': 'https://og.t.sotn.io/',
    'tp:gem-farmer': 'https://gf.t.sotn.io/',
  }

  const TYPE = {
    HEART: 0,
    GOLD: 1,
    SUBWEAPON: 2,
    POWERUP: 3,
    WEAPON1: 4,
    WEAPON2: 5,
    SHIELD: 6,
    HELMET: 7,
    ARMOR: 8,
    CLOAK: 9,
    ACCESSORY: 10,
    USABLE: 11,
  }

  // List of type names for logging.
  const typeNames = [
    'HEART',
    'GOLD',
    'SUBWEAPON',
    'POWERUP',
    'WEAPON1',
    'WEAPON2',
    'SHIELD',
    'HELMET',
    'ARMOR',
    'CLOAK',
    'ACCESSORY',
    'USABLE',
  ]

  const ZONE = {
    ST0:  0,  // Final Stage: Bloodlines
    ARE:  1,  // Colosseum
    CAT:  2,  // Catacombs
    CEN:  3,  // Center Cube
    CHI:  4,  // Abandoned Mine
    DAI:  5,  // Royal Chapel
    DRE:  6,  // Nightmare
    LIB:  7,  // Long Library
    NO0:  8,  // Marble Gallery
    NO1:  9,  // Outer Wall
    NO2:  10, // Olrox's Quarters
    NO3:  11, // Castle Entrance
    NP3:  12, // Castle Entrance (after visiting Alchemy Laboratory)
    NO4:  13, // Underground Caverns
    NZ0:  14, // Alchemy Laboratory
    NZ1:  15, // Clock Tower
    TOP:  16, // Castle Keep
    WRP:  17, // Warp rooms
    RARE: 18, // Reverse Colosseum
    RCAT: 19, // Floating Catacombs
    RCEN: 20, // Reverse Center Cube
    RCHI: 21, // Cave
    RDAI: 22, // Anti-Chapel
    RLIB: 23, // Forbidden Library
    RNO0: 24, // Black Marble Gallery
    RNO1: 25, // Reverse Outer Wall
    RNO2: 26, // Death Wing's Lair
    RNO3: 27, // Reverse Entrance
    RNO4: 28, // Reverse Caverns
    RNZ0: 29, // Necromancy Laboratory
    RNZ1: 30, // Reverse Clock Tower
    RTOP: 31, // Reverse Castle Keep
    RWRP: 32, // Reverse Warp rooms
    BO0:  33, // Olrox
    BO1:  34, // Legion
    BO2:  35, // Werewolf & Minotaur
    BO3:  36, // Scylla
    BO4:  37, // Doppleganger10
    BO5:  38, // Hippogryph
    BO6:  39, // Richter
    BO7:  40, // Cerberus
    RBO0: 41, // Trio
    RBO1: 42, // Beezlebub
    RBO2: 43, // Death
    RBO3: 44, // Medusa
    RBO4: 45, // Creature
    RBO5: 46, // Doppleganger40
    RBO6: 47, // Shaft/Dracula
    RBO7: 48, // Akmodan II
    RBO8: 49, // Galamoth
  }

  // List of zone strings for logging.
  const zoneNames = [
    'ST0',
    'ARE',
    'CAT',
    'CEN',
    'CHI',
    'DAI',
    'DRE',
    'LIB',
    'NO0',
    'NO1',
    'NO2',
    'NO3',
    'NP3',
    'NO4',
    'NZ0',
    'NZ1',
    'TOP',
    'WRP',
    'RARE',
    'RCAT',
    'RCEN',
    'RCHI',
    'RDAI',
    'RLIB',
    'RNO0',
    'RNO1',
    'RNO2',
    'RNO3',
    'RNO4',
    'RNZ0',
    'RNZ1',
    'RTOP',
    'RWRP',
    'BO0',
    'BO1',
    'BO2',
    'BO3',
    'BO4',
    'BO5',
    'BO6',
    'BO7',
    'RBO0',
    'RBO1',
    'RBO2',
    'RBO3',
    'RBO4',
    'RBO5',
    'RBO6',
    'RBO7',
    'RBO8',
  ]

  // Offsets in the bin of each zone file.
  const zones = [{
    id: ZONE.ST0,
    pos: 0x0533efc8,
    len: 271812,
    items: 0x0a60,
  }, {
    id: ZONE.ARE,
    pos: 0x043c2018,
    len: 352636,
    items: 0x0fe8,
  }, {
    id: ZONE.CAT,
    pos: 0x0448f938,
    len: 361920,
    items: 0x174c,
  }, {
    id: ZONE.CEN,
    pos: 0x0455bff8,
    len: 119916,
  }, {
    id: ZONE.CHI,
    pos: 0x045e8ae8,
    len: 193576,
    items: 0x09e4,
  }, {
    id: ZONE.DAI,
    pos: 0x04675f08,
    len: 373764,
    items: 0x0ec0,
  }, {
    id: ZONE.DRE,
    pos: 0x05af2478,
    len: 147456,
  }, {
    id: ZONE.LIB,
    pos: 0x047a1ae8,
    len: 348876,
    items: 0x1a90,
  }, {
    id: ZONE.NO0,
    pos: 0x048f9a38,
    len: 390540,
    items: 0x1100,
  }, {
    id: ZONE.NO1,
    pos: 0x049d18b8,
    len: 356452,
    items: 0x1a2c,
  }, {
    id: ZONE.NO2,
    pos: 0x04aa0438,
    len: 327100,
    items: 0x0fec,
  }, {
    id: ZONE.NO3,
    pos: 0x04b665e8,
    len: 359960,
    items: 0x1c8c,
  }, {
    id: ZONE.NP3,
    pos: 0x053f4708,
    len: 341044,
    items: 0x1618,
  }, {
    id: ZONE.NO4,
    pos: 0x04c307e8,
    len: 391260,
    items: 0x1928,
  }, {
    id: ZONE.NZ0,
    pos: 0x054b0c88,
    len: 309120,
    items: 0x13b0,
  }, {
    id: ZONE.NZ1,
    pos: 0x055724b8,
    len: 271168,
    items: 0x111c,
  }, {
    id: ZONE.TOP,
    pos: 0x0560e7b8,
    len: 247132,
    items: 0x0d10,
  }, {
    id: ZONE.WRP,
    pos: 0x05883408,
    len: 83968,
  }, {
    id: ZONE.RARE,
    pos: 0x057509e8,
    len: 234384,
    items: 0x0a3c,
  }, {
    id: ZONE.RCAT,
    pos: 0x04cfa0b8,
    len: 278188,
    items: 0x13c8,
  }, {
    id: ZONE.RCEN,
    pos: 0x056bd9e8,
    len: 186368,
  }, {
    id: ZONE.RCHI,
    pos: 0x04da4968,
    len: 174880,
    items: 0x07cc,
  }, {
    id: ZONE.RDAI,
    pos: 0x04e31458,
    len: 295736,
    items: 0x0d2c,
  }, {
    id: ZONE.RLIB,
    pos: 0x04ee2218,
    len: 201776,
    items: 0x0bc8,
  }, {
    id: ZONE.RNO0,
    pos: 0x04f84a28,
    len: 347020,
    items: 0x0f8c,
  }, {
    id: ZONE.RNO1,
    pos: 0x0504f558,
    len: 357020,
    items: 0x0ae4,
  }, {
    id: ZONE.RNO2,
    pos: 0x050f7948,
    len: 313816,
    items: 0x0d40,
  }, {
    id: ZONE.RNO3,
    pos: 0x051ac758,
    len: 304428,
    items: 0x0f10,
  }, {
    id: ZONE.RNO4,
    pos: 0x0526a868,
    len: 384020,
    items: 0x1620,
  }, {
    id: ZONE.RNZ0,
    pos: 0x05902278,
    len: 281512,
    items: 0x0cc8,
  }, {
    id: ZONE.RNZ1,
    pos: 0x059bb0d8,
    len: 260960,
    items: 0x0ec8,
    rewards: 0x2570,
  }, {
    id: ZONE.RTOP,
    pos: 0x057df998,
    len: 200988,
    items: 0x07c8,
  }, {
    id: ZONE.RWRP,
    pos: 0x05a6e358,
    len: 92160,
  }, {
    id: ZONE.BO0,
    pos: 0x05fa9dc8,
    len: 320948,
    rewards: 0x24d4,
  }, {
    id: ZONE.BO1,
    pos: 0x0606dab8,
    len: 205756,
    rewards: 0x1b98,
  }, {
    id: ZONE.BO2,
    pos: 0x060fca68,
    len: 223540,
    rewards: 0x181c,
  }, {
    id: ZONE.BO3,
    pos: 0x061a60b8,
    len: 210224,
    rewards: 0x1c60,
    items: 0x108c,
  }, {
    id: ZONE.BO4,
    pos: 0x06246d38,
    len: 347704,
    rewards: 0x42b0,
  }, {
    id: ZONE.BO5,
    pos: 0x06304e48,
    len: 218672,
    rewards: 0x18b8,
  }, {
    id: ZONE.BO6,
    pos: 0x063aa448,
    len: 333544,
    rewards: 0x2f90,
  }, {
    id: ZONE.BO7,
    pos: 0x066b32f8,
    len: 144480,
    rewards: 0x1440,
  }, {
    id: ZONE.RBO0,
    pos: 0x064705f8,
    len: 160988,
    rewards: 0x1988,
  }, {
    id: ZONE.RBO1,
    pos: 0x06590a18,
    len: 139104,
    rewards: 0x1550,
  }, {
    id: ZONE.RBO2,
    pos: 0x06620c28,
    len: 190792,
    rewards: 0x1788,
  }, {
    id: ZONE.RBO3,
    pos: 0x067422a8,
    len: 132656,
    rewards: 0x12a8,
  }, {
    id: ZONE.RBO4,
    pos: 0x067cfff8,
    len: 154660,
    rewards: 0x13b4,
  }, {
    id: ZONE.RBO5,
    pos: 0x06861468,
    len: 345096,
    rewards: 0x4348,
  }, {
    id: ZONE.RBO6,
    pos: 0x0692b668,
    len: 213060,
  }, {
    id: ZONE.RBO7,
    pos: 0x069d1598,
    len: 142572,
    rewards: 0x1300,
  }, {
    id: ZONE.RBO8,
    pos: 0x06a5f2e8,
    len: 161212,
    rewards: 0x2334,
  }]

  const exe = { pos: 0x0abb28, len: 703272 }
  const enemyListOff = 0xe90
  const enemyListLen = 292
  const enemyDataOff = 0x8900
  const enemyDataLen = 0x28
  const handEquipmentListOff = 0x4b04
  const handEquipmentListLen = 169
  const armorListOff = 0x7718
  const armorListLen = 26
  const helmetListOff = 0x7a58
  const helmetListLen = 22
  const cloakListOff = 0x7d18
  const cloakListLen = 9
  const accessoryListOff = 0x7e38
  const accessoryListLen = 33

  const RELIC = {
    SOUL_OF_BAT: 'B',
    FIRE_OF_BAT: 'f',
    ECHO_OF_BAT: 'E',
    FORCE_OF_ECHO: 'e',
    SOUL_OF_WOLF: 'W',
    POWER_OF_WOLF: 'p',
    SKILL_OF_WOLF: 's',
    FORM_OF_MIST: 'M',
    POWER_OF_MIST: 'P',
    GAS_CLOUD: 'c',
    CUBE_OF_ZOE: 'z',
    SPIRIT_ORB: 'o',
    GRAVITY_BOOTS: 'V',
    LEAP_STONE: 'L',
    HOLY_SYMBOL: 'y',
    FAERIE_SCROLL: 'l',
    JEWEL_OF_OPEN: 'J',
    MERMAN_STATUE: 'U',
    BAT_CARD: 'b',
    GHOST_CARD: 'g',
    FAERIE_CARD: 'a',
    DEMON_CARD: 'd',
    SWORD_CARD: 'w',
    SPRITE_CARD: 't',
    NOSEDEVIL_CARD: 'n',
    HEART_OF_VLAD: 'A',
    TOOTH_OF_VLAD: 'T',
    RIB_OF_VLAD: 'R',
    RING_OF_VLAD: 'N',
    EYE_OF_VLAD: 'I',
    GOLD_RING: 'G',
    SILVER_RING: 'S',
    SPIKE_BREAKER: 'K',
    HOLY_GLASSES: 'H',
    THRUST_SWORD: 'D',
  }

  const tileIdOffset = 0x80

  // This is applied to helmet, armor, cloak, and other ids that are sold in
  // the librarian's shop menu or are in an equipment slot.
  const equipIdOffset = -0xa9

  // This is applied to equipment ids to get the inventory slot it occupies.
  const equipmentInvIdOffset = 0x798a

  const SLOT = {
    RIGHT_HAND: 'r',
    LEFT_HAND: 'l',
    HEAD: 'h',
    BODY: 'b',
    CLOAK: 'c',
    OTHER: 'o',
    OTHER2: 'o2',
    AXEARMOR: 'a',
    LUCK_MODE: 'x',
  }

  const slots = {
    'r':  0x097c00,
    'l':  0x097c04,
    'h':  0x097c08,
    'b':  0x097c0c,
    'c':  0x097c10,
    'o':  0x097c14,
    'o2': 0x097c18,
  }

  const EXTENSION = {
    GUARDED:   'guarded',
    EQUIPMENT: 'equipment',
    GUARDEDPLUS:    'guardedplus',
    SCENIC:   'scenic',
    EXTENDED:  'extended',
  }

  const defaultExtension = EXTENSION.GUARDED

  const LOCATION = {
    CRYSTAL_CLOAK:               'Crystal cloak',
    MORMEGIL:                    'Mormegil',
    DARK_BLADE:                  'Dark Blade',
    RING_OF_ARCANA:              'Ring of Arcana',
    TRIO:                        'Trio',
    HOLY_MAIL:                   'Holy mail',
    JEWEL_SWORD:                 'Jewel sword',
    BASILARD:                    'Basilard',
    SUNGLASSES:                  'Sunglasses',
    CLOTH_CAPE:                  'Cloth cape',
    MYSTIC_PENDANT:              'Mystic pendant',
    ANKH_OF_LIFE:                'Ankh of Life',
    MORNING_STAR:                'Morningstar',
    GOGGLES:                     'Goggles',
    SILVER_PLATE:                'Silver plate',
    CUTLASS:                     'Cutlass',
    PLATINUM_MAIL:               'Platinum mail',
    FALCHION:                    'Falchion',
    GOLD_PLATE:                  'Gold plate',
    BEKATOWA:                    'Bekatowa',
    GLADIUS:                     'Gladius',
    JEWEL_KNUCKLES:              'Jewel knuckles',
    HOLY_ROD:                    'Holy rod',
    LIBRARY_ONYX:                'Library Onyx',
    BRONZE_CUIRASS:              'Bronze cuirass',
    ALUCART_SWORD:               'Alucart sword',
    BROADSWORD:                  'Broadsword',
    ESTOC:                       'Estoc',
    OLROX_GARNET:                'Olrox Garnet',
    BLOOD_CLOAK:                 'Blood cloak',
    SHIELD_ROD:                  'Shield rod',
    KNIGHT_SHIELD:               'Knight shield',
    HOLY_SWORD:                  'Holy sword',
    BANDANNA:                    'Bandanna',
    SECRET_BOOTS:                'Secret boots',
    NUNCHAKU:                    'Nunchaku',
    KNUCKLE_DUSTER:              'Knuckle duster',
    CAVERNS_ONYX:                'Caverns Onyx',
    COMBAT_KNIFE:                'Combat knife',
    RING_OF_ARES:                'Ring of Ares',
    BLOODSTONE:                  'Bloodstone',
    ICEBRAND:                    'Icebrand',
    WALK_ARMOR:                  'Walk armor',
    BERYL_CIRCLET:               'Beryl circlet',
    TALISMAN:                    'Talisman',
    KATANA:                      'Katana',
    GODDESS_SHIELD:              'Goddess shield',
    TWILIGHT_CLOAK:              'Twilight cloak',
    TALWAR:                      'Talwar',
    SWORD_OF_DAWN:               'Sword of Dawn',
    BASTARD_SWORD:               'Bastard sword',
    ROYAL_CLOAK:                 'Royal cloak',
    LIGHTNING_MAIL:              'Lightning mail',
    MOON_ROD:                    'Moon rod',
    SUNSTONE:                    'Sunstone',
    LUMINUS:                     'Luminus',
    DRAGON_HELM:                 'Dragon helm',
    SHOTEL:                      'Shotel',
    STAUROLITE:                  'Staurolite',
    BADELAIRE:                   'Badelaire',
    FORBIDDEN_LIBRARY_OPAL:      'Forbidden Library Opal',
    REVERSE_CAVERNS_DIAMOND:     'Reverse Caverns Diamond',
    REVERSE_CAVERNS_OPAL:        'Reverse Caverns Opal',
    REVERSE_CAVERNS_GARNET:      'Reverse Caverns Garnet',
    OSAFUNE_KATANA:              'Osafune katana',
    ALUCARD_SHIELD:              'Alucard shield',
    ALUCARD_SWORD:               'Alucard sword',
    NECKLACE_OF_J:               'Necklace of J',
    FLOATING_CATACOMBS_DIAMOND:  'Floating Catacombs Diamond',
    SWORD_OF_HADOR:              'Sword of Hador',
    ALUCARD_MAIL:                'Alucard mail',
    GRAM:                        'Gram',
    FURY_PLATE:                  'Fury plate',
    CONFESSIONAL:                'Confessional',
    COLOSSEUM_GREEN_TEA:         'Colosseum Green tea',
    CLOCK_TOWER_CLOAKED_KNIGHT:  'Clock Tower Cloaked knight',
    TELESCOPE:                   'Telescope',
    WATERFALL_CAVE:              'Waterfall Cave',
    FLOATING_CATACOMBS_ELIXIR:   'Floating Catacombs Elixir',
    REVERSE_ENTRANCE_ANTIVENOM:  'Reverse Entrance Antivenom',
    REVERSE_FORBIDDEN_ROUTE:     'Reverse Forbidden Route',
    CAVE_LIFE_APPLE:             'Cave Life apple',
    REVERSE_COLOSSEUM_ZIRCON:    'Reverse Colosseum Zircon',
    REVERSE_ALUCART_SWORD:       'Reverse Alucart Sword',
    BLACK_MARBLE_MEAL_TICKET:    'Black Marble Meal Ticket',
    REVERSE_KEEP_HIGH_POTION:    'Reverse Keep High Potion',
  }

  const GLOBAL_DROP = 'Global'
  const globalDropsCount = 32

  const WORKER_ACTION = {
    STATS:     1,
    RELICS:    2,
    ITEMS:     3,
    FINALIZE:  4,
  }

  const MUSIC = {
    LOST_PAINTING: 0x01,          // Lost Painting
    CURSE_ZONE: 0x03,             // Curse Zone
    REQUIEM_FOR_THE_GODS: 0x05,   // Requiem for the Gods
    RAINBOW_CEMETARY: 0x07,       // Rainbow Cemetary
    WOOD_CARVING_PARTITA: 0x09,   // Wood Carving Partita
    CRYSTAL_TEARDROPS: 0x0b,      // Crystal Teardrops
    MARBLE_GALLERY: 0x0d,         // Marble Gallery
    DRACULAS_CASTLE: 0x0f,        // Dracula's Castle
    THE_TRAGIC_PRINCE: 0x11,      // The Tragic Prince
    TOWER_OF_MIST: 0x13,          // Tower of Mist
    DOOR_OF_HOLY_SPIRITS: 0x15,   // Door of Holy Spirits
    DANCE_OF_PALES: 0x17,         // Dance of Pales
    ABANDONED_PIT: 0x19,          // Abandoned Pit
    HEAVENLY_DOORWAY: 0x1b,       // Heavenly Doorway
    FESTIVAL_OF_SERVANTS: 0x1d,   // Festival of Servants
    WANDERING_GHOSTS: 0x23,       // Wandering Ghosts
    THE_DOOR_TO_THE_ABYSS: 0x25,  // The Door to the Abyss
    DANCE_OF_GOLD: 0x2e,          // Dance of Gold
    ENCHANTED_BANQUET: 0x30,      // Enchanted Banquet
    DEATH_BALLAD: 0x34,           // Death Ballad
    FINAL_TOCCATA: 0x38,          // Final Tocatta
    // DANCE_OF_ILLUSIONS: 0x1f,  // Dance of Illusions
    // PROLOGUE: 0x21,            // Prologue
    // METAMORPHOSIS: 0x27,       // Metamorphosis
    // METAMORPHOSIS_II: 0x28,    // Metamorphosis II
    // METAMORPHOSIS_III: 0x29,   // Metamorphosis III
    // HOWLING_WIND: 0x2a,        // Howling Wind
    // PRAYER: 0x32,              // Prayer
    // BLOOD_RELATIONS: 0x36,     // Blood Relations
    // BLACK_BANQUET: 0x3a,       // Black Banquet
    // I_AM_THE_WIND: 0x3c,       // I Am the Wind
    // SILENCE: 0x3d,             // Silence
    // LAND_OF_BENEDICTION: 0x3e, // Land of Benediction
    // NOCTURNE: 0x3f,            // Nocturne
    // MOONLIGHT_NOCTURNE: 0x40,  // Moonlight Nocturne
    // SPOKEN: 0x41,
    // SPOKEN: 0x42,
  }

  const TRAVEL_MUSIC = {
    LOST_PAINTING: 0x01,          // Lost Painting
    CURSE_ZONE: 0x03,             // Curse Zone
    REQUIEM_FOR_THE_GODS: 0x05,   // Requiem for the Gods
    RAINBOW_CEMETARY: 0x07,       // Rainbow Cemetary
    WOOD_CARVING_PARTITA: 0x09,   // Wood Carving Partita
    CRYSTAL_TEARDROPS: 0x0b,      // Crystal Teardrops
    MARBLE_GALLERY: 0x0d,         // Marble Gallery
    DRACULAS_CASTLE: 0x0f,        // Dracula's Castle
    THE_TRAGIC_PRINCE: 0x11,      // The Tragic Prince
    TOWER_OF_MIST: 0x13,          // Tower of Mist
    DOOR_OF_HOLY_SPIRITS: 0x15,   // Door of Holy Spirits
    DANCE_OF_PALES: 0x17,         // Dance of Pales
    ABANDONED_PIT: 0x19,          // Abandoned Pit
    HEAVENLY_DOORWAY: 0x1b,       // Heavenly Doorway
    WANDERING_GHOSTS: 0x23,       // Wandering Ghosts
    THE_DOOR_TO_THE_ABYSS: 0x25,  // The Door to the Abyss
    DANCE_OF_GOLD: 0x2e,          // Dance of Gold
    FINAL_TOCCATA: 0x38,          // Final Tocatta
    // PROLOGUE: 0x21,            // Prologue
    // METAMORPHOSIS: 0x27,       // Metamorphosis
    // METAMORPHOSIS_II: 0x28,    // Metamorphosis II
    // METAMORPHOSIS_III: 0x29,   // Metamorphosis III
    // HOWLING_WIND: 0x2a,        // Howling Wind
    // PRAYER: 0x32,              // Prayer
    // I_AM_THE_WIND: 0x3c,       // I Am the Wind
    // SILENCE: 0x3d,             // Silence
    // LAND_OF_BENEDICTION: 0x3e, // Land of Benediction
    // NOCTURNE: 0x3f,            // Nocturne
    // MOONLIGHT_NOCTURNE: 0x40,  // Moonlight Nocturne
    // SPOKEN: 0x41,
    // SPOKEN: 0x42,
  }

  const BOSS_MUSIC = {
    FESTIVAL_OF_SERVANTS: 0x1d,   // Festival of Servants
    ENCHANTED_BANQUET: 0x30,      // Enchanted Banquet
    DEATH_BALLAD: 0x34,           // Death Ballad
    DANCE_OF_ILLUSIONS: 0x1f,  // Dance of Illusions
    BLOOD_RELATIONS: 0x36,     // Blood Relations
    // BLACK_BANQUET: 0x3a,       // Black Banquet
  }

  const HAND_TYPE = {
    SHORT_SWORD: 0x00,
    SWORD: 0x01,
    THROWING_SWORD: 0x02,
    FIST: 0x03,
    CLUB: 0x04,
    TWO_HANDED_SWORD: 0x05,
    FOOD: 0x06,
    DAMAGE_CONSUMABLE: 0x07,
    PROJECTILE_CONSUMABLE: 0x08,
    SHIELD: 0x09,
    OTHER: 0x0a,
  }

  const handTypeNames = [
    'SHORT_SWORD',
    'SWORD',
    'THROWING_SWORD',
    'FIST',
    'BLUNT_WEAPON',
    'TWO_HANDED_SWORD',
    'FOOD',
    'DAMAGE_CONSUMABLE',
    'PROJECTILE_CONSUMABLE',
    'SHIELD',
    'OTHER',
  ]

  const faerieScrollForceAddresses = [
    0x04403938,
    0x044d4948,
    0x045702c0,
    0x0460bcb8,
    0x046c70ec,
    0x047eadd4,
    0x04947e2c,
    0x04a1da54,
    0x04ae1d98,
    0x04bb25e0,
    0x04c86ae4,
    0x04d367a4,
    0x04dc4068,
    0x04e6e350,
    0x04f0ab84,
    0x04fc4c08,
    0x050800a0,
    0x051373c4,
    0x051e8da4,
    0x052c0628,
    0x0537889c,
    0x05436b40,
    0x054f34d8,
    0x055a6164,
    0x05643614,
    0x056e3670,
    0x0577dcb4,
    0x05807b68,
    0x0588d50c,
    0x05936448,
    0x059ef674,
    0x05a7a89c,
    0x05b0d6c4,
    0x05fef940,
    0x06099584,
    0x0612aac4,
    0x061d2f48,
    0x06286480,
    0x06332188,
    0x063dae48,
    0x0648f038,
    0x06518314,
    0x065a9958,
    0x06648254,
    0x066cdacc,
    0x06758d7c,
    0x067ed580,
    0x0689f884,
    0x06956f20,
    0x069eb4c8,
    0x06a7da5c,
  ]

  const characterMap = {
    ',': [ 0x81, 0x43 ],
    '.': [ 0x81, 0x44 ],
    '•': [ 0x81, 0x45 ],
    ':': [ 0x81, 0x46 ],
    ';': [ 0x81, 0x47 ],
    '?': [ 0x81, 0x48 ],
    '!': [ 0x81, 0x49 ],
    '°': [ 0x81, 0x4b ],
    '`': [ 0x81, 0x4d ],
    '"': [ 0x81, 0x4e ],
    '^': [ 0x81, 0x4f ],
    '‾': [ 0x81, 0x50 ],
    '_': [ 0x81, 0x51 ],
    '—': [ 0x81, 0x5c ],
    '/': [ 0x81, 0x5e ],
    '\\': [ 0x81, 0x5f ],
    '~': [ 0x81, 0x60 ],
    '|': [ 0x81, 0x62 ],
    '¨': [ 0x81, 0x64 ],
    '‘': [ 0x81, 0x65 ],
    '\'': [ 0x81, 0x66 ],
    '“': [ 0x81, 0x67 ],
    '”': [ 0x81, 0x68 ],
    '(': [ 0x81, 0x69 ],
    ')': [ 0x81, 0x6a ],
    '[': [ 0x81, 0x6d ],
    ']': [ 0x81, 0x6e ],
    '{': [ 0x81, 0x6f ],
    '}': [ 0x81, 0x70 ],
    '+': [ 0x81, 0x7b ],
    '-': [ 0x81, 0x7c ],
    '±': [ 0x81, 0x7d ],
    '×': [ 0x81, 0x7e ],
    '%': [ 0x81, 0x93 ],
    '0': [ 0x82, 0x4f ],
    '1': [ 0x82, 0x50 ],
    '2': [ 0x82, 0x51 ],
    '3': [ 0x82, 0x52 ],
    '4': [ 0x82, 0x53 ],
    '5': [ 0x82, 0x54 ],
    '6': [ 0x82, 0x55 ],
    '7': [ 0x82, 0x56 ],
    '8': [ 0x82, 0x57 ],
    '9': [ 0x82, 0x58 ],
  }

  const shopItemsData = [
    {
      id: 1,
      itemName: "Potion",
      itemPriceH: 0x00000320, //normally 800
      itemPriceD: 800,
      priceAddress: 0x047a30a0
    }, {
      id: 2,
      itemName: "High potion",
      itemPriceH: 0x000007d0, //normally 2000
      itemPriceD: 2000,
      priceAddress: 0x047a30a8
    }, {
      id: 3,
      itemName: "Elixir",
      itemPriceH: 0x00001f40, //normally 8000
      itemPriceD: 8000,
      priceAddress: 0x047a30b0
    }, {
      id: 4,
      itemName: "Manna prism",
      itemPriceH: 0x00000fa0, //normally 4000
      itemPriceD: 4000,
      priceAddress: 0x047a30b8
    }, {
      id: 5,
      itemName: "Antivenom",
      itemPriceH: 0x000000c8, //normally 200
      itemPriceD: 200,
      priceAddress: 0x047a30c0
    }, {
      id: 6,
      itemName: "Uncurse",
      itemPriceH: 0x000000c8, //normally 200
      itemPriceD: 200,
      priceAddress: 0x047a30c8
    }, {
      id: 7,
      itemName: "Hammer",
      itemPriceH: 0x000000c8, //normally 200
      itemPriceD: 200,
      priceAddress: 0x047a30d0
    }, {
      id: 8,
      itemName: "Magic Missile",
      itemPriceH: 0x0000012c, //normally 300
      itemPriceD: 300,
      priceAddress: 0x047a30d8
    }, {
      id: 9,
      itemName: "Bwaka knife",
      itemPriceH: 0x00000190, //normally 400
      itemPriceD: 400,
      priceAddress: 0x047a30e0
    }, {
      id: 10,
      itemName: "Boomerang",
      itemPriceH: 0x000001f4, //normally 500
      itemPriceD: 500,
      priceAddress: 0x047a30e8
    }, {
      id: 11,
      itemName: "Javelin",
      itemPriceH: 0x00000320, //normally 800
      itemPriceD: 800,
      priceAddress: 0x047a30f0
    }, {
      id: 12,
      itemName: "Fire boomerang",
      itemPriceH: 0x000003e8, //normally 1000
      itemPriceD: 1000,
      priceAddress: 0x047a30f8
    }, {
      id: 13,
      itemName: "Shuriken",
      itemPriceH: 0x00000960, //normally 2400
      itemPriceD: 2400,
      priceAddress: 0x047a3100
    }, {
      id: 14,
      itemName: "Cross shuriken",
      itemPriceH: 0x00001388, //normally 5000
      itemPriceD: 5000,
      priceAddress: 0x047a3108
    }, {
      id: 15,
      itemName: "Buffalo star",
      itemPriceH: 0x00001f40, //normally 8000
      itemPriceD: 8000,
      priceAddress: 0x047a3110
    }, {
      id: 16,
      itemName: "Flame star",
      itemPriceH: 0x00003a98, //normally 15000
      itemPriceD: 15000,
      priceAddress: 0x047a3118
    }, {
      id: 17,
      itemName: "Library card",
      itemPriceH: 0x000001f4, //normally 500
      itemPriceD: 500,
      priceAddress: 0x047a3120
    }, {
      id: 18,
      itemName: "Meal ticket",
      itemPriceH: 0x000007d0, //normally 2000
      itemPriceD: 2000,
      priceAddress: 0x047a3128
    }, {
      id: 19,
      itemName: "Saber",
      itemPriceH: 0x000005dc, //normally 1500
      itemPriceD: 1500,
      priceAddress: 0x047a3130
    }, {
      id: 20,
      itemName: "Mace",
      itemPriceH: 0x000007d0, //normally 2000
      itemPriceD: 2000,
      priceAddress: 0x047a3138
    }, {
      id: 21,
      itemName: "Damascus sword",
      itemPriceH: 0x00000fa0, //normally 4000
      itemPriceD: 4000,
      priceAddress: 0x047a3140
    }, {
      id: 22,
      itemName: "Firebrand",
      itemPriceH: 0x00002710, //normally 10000
      itemPriceD: 10000,
      priceAddress: 0x047a3148
    }, {
      id: 23,
      itemName: "Icebrand",
      itemPriceH: 0x00002710, //normally 10000
      itemPriceD: 10000,
      priceAddress: 0x047a3150
    }, {
      id: 24,
      itemName: "Thunderbrand",
      itemPriceH: 0x00002710, //normally 10000
      itemPriceD: 10000,
      priceAddress: 0x047a3158
    }, {
      id: 25,
      itemName: "Harper",
      itemPriceH: 0x00002ee0, //normally 12000
      itemPriceD: 12000,
      priceAddress: 0x047a3160
    }, {
      id: 26,
      itemName: "Leather shield",
      itemPriceH: 0x00000190, //normally 400
      itemPriceD: 400,
      priceAddress: 0x047a3168
    }, {
      id: 27,
      itemName: "Iron shield",
      itemPriceH: 0x00000fbc, //normally 3980
      itemPriceD: 3980,
      priceAddress: 0x047a3170
    }, {
      id: 28,
      itemName: "Velvet hat",
      itemPriceH: 0x00000190, //normally 400
      itemPriceD: 400,
      priceAddress: 0x047a3178
    }, {
      id: 29,
      itemName: "Leather hat",
      itemPriceH: 0x000003e8, //normally 1000
      itemPriceD: 1000,
      priceAddress: 0x047a3180
    }, {
      id: 30,
      itemName: "Circlet",
      itemPriceH: 0x00000fa0, //normally 4000
      itemPriceD: 4000,
      priceAddress: 0x047a3188
    }, {
      id: 31,
      itemName: "Silver crown",
      itemPriceH: 0x00002ee0, //normally 12000
      itemPriceD: 12000,
      priceAddress: 0x047a3190
    }, {
      id: 32,
      itemName: "Iron cuirass",
      itemPriceH: 0x000005dc, //normally 1500
      itemPriceD: 1500,
      priceAddress: 0x047a3198
    }, {
      id: 33,
      itemName: "Steel cuirass",
      itemPriceH: 0x00000fa0, //normally 4000
      itemPriceD: 4000,
      priceAddress: 0x047a31a0
    }, {
      id: 34,
      itemName: "Diamond plate",
      itemPriceH: 0x00002ee0, //normally 12000
      itemPriceD: 12000,
      priceAddress: 0x047a31a8
    }, {
      id: 35,
      itemName: "Reverse cloak",
      itemPriceH: 0x000007d0, //normally 2000
      itemPriceD: 2000,
      priceAddress: 0x047a31b0
    }, {
      id: 36,
      itemName: "Elven cloak",
      itemPriceH: 0x00000bb8, //normally 3000
      itemPriceD: 3000,
      priceAddress: 0x047a31b8
    }, {
      id: 37,
      itemName: "Joseph's cloak",
      itemPriceH: 0x00007530, //normally 30000
      itemPriceD: 30000,
      priceAddress: 0x047a31c0
    }, {
      id: 38,
      itemName: "Medal",
      itemPriceH: 0x00000bb8, //normally 3000
      itemPriceD: 3000,
      priceAddress: 0x047a31c8
    }, {
      id: 39,
      itemName: "Ring of Pales",
      itemPriceH: 0x00000fa0, //normally 4000
      itemPriceD: 4000,
      priceAddress: 0x047a31d0
    }, {
      id: 40,
      itemName: "Gauntlet",
      itemPriceH: 0x00001f40, //normally 8000
      itemPriceD: 8000,
      priceAddress: 0x047a31d8
    }, {
      id: 41,
      itemName: "Duplicator",
      itemPriceH: 0x0007a120, //normally 500000
      itemPriceD: 500000,
      priceAddress: 0x047a31e0
    }
  ]

  const startRoomData = [                                                       // Data provided for starting room randomizer (Writes are used, other fields are reference)
    {
      id: 1,
      comment: "Bottom of Forbidden Route",
      stage: 0x00,                                                                 //Marble Gallery
      room: 0,
      xPos: 48,
      yPos: 644,
      xyWrite: 0x02840030,
      roomWrite: 0x00410000,
      stageWrite: 0x0000
    }, {
      id: 2,
      comment: "Top of Spirit Orb room",
      stage: 0x00,                                                                 //Marble Gallery
      room: 2,
      xPos: 332,
      yPos: 244,
      xyWrite: 0x00F4014C,
      roomWrite: 0x00410010,
      stageWrite: 0x0000
    }, {
      id: 3,
      comment: "Middle of the long hallway",
      stage: 0x00,                                                                 //Marble Gallery
      room: 8,
      xPos: 1920,
      yPos: 164,
      xyWrite: 0x00a40780,
      roomWrite: 0x00410040,
      stageWrite: 0x0000

    }, {
      id: 4,
      comment: "Alucart room",
      stage: 0x00,                                                                 //Marble Gallery
      room: 14,
      xPos: 128,
      yPos: 164,
      xyWrite: 0x00a40080,
      roomWrite: 0x00410070,
      stageWrite: 0x0000

    }, {
      id: 5,
      comment: "Gravity Boots items",
      stage: 0x00,                                                                 //Marble Gallery
      room: 20,
      xPos: 192,
      yPos: 148,
      xyWrite: 0x009400c0,
      roomWrite: 0x004100a0,
      stageWrite: 0x0000
    }, {
      id: 6,
      comment: "Same room but across from Telescope",
      stage: 0x01,                                                                 //Outer Wall
      room: 3,
      xPos: 724,
      yPos: 164,
      xyWrite: 0x00A402D4,
      roomWrite: 0x00410018,
      stageWrite: 0x0001
    }, {
      id: 7,
      comment: "Secret elevator room",
      stage: 0x01,                                                                 //Outer Wall
      room: 6,
      xPos: 56,
      yPos: 164,
      xyWrite: 0x00a40038,
      roomWrite: 0x00410030,
      stageWrite: 0x0001
    }, {
      id: 8,
      comment: "Gladius room",
      stage: 0x01,                                                                 //Outer Wall
      room: 12,
      xPos: 128,
      yPos: 164,
      xyWrite: 0x00A40080,
      roomWrite: 0x00410060,
      stageWrite: 0x0001
    }, {
      id: 9,
      comment: "Bookshelf room",
      stage: 0x02,                                                                 //Long Library
      room: 1,
      xPos: 88,
      yPos: 148,
      xyWrite: 0x00940058,
      roomWrite: 0x00410008,
      stageWrite: 0x0002
    }, {
      id: 10,
      comment: "Shop hallway",
      stage: 0x02,                                                                 //Long Library
      room: 5,
      xPos: 16,
      yPos: 148,
      xyWrite: 0x00940010,
      roomWrite: 0x00410028,
      stageWrite: 0x0002
    }, {
      id: 11,
      comment: "Faerie Card room",
      stage: 0x02,                                                                 //Long Library
      room: 7,
      xPos: 208,
      yPos: 148,
      xyWrite: 0x009400D0,
      roomWrite: 0x00410038,
      stageWrite: 0x0002
    }, {
      id: 12,
      comment: "One-dollar room",
      stage: 0x03,                                                                 //Catacombs
      room: 5,
      xPos: 100,
      yPos: 164,
      xyWrite: 0x00A40064,
      roomWrite: 0x00410028,
      stageWrite: 0x0003
    }, {
      id: 13,
      comment: "Icebrand room",
      stage: 0x03,                                                                 //Catacombs
      room: 9,
      xPos: 56,
      yPos: 164,
      xyWrite: 0x00a40038,
      roomWrite: 0x00410048,
      stageWrite: 0x0003
    }, {
      id: 14,
      comment: "Elevator in Slime room",
      stage: 0x03,                                                                 //Catacombs
      room: 23,
      xPos: 352,
      yPos: 228,
      xyWrite: 0x00E40160,
      roomWrite: 0x004100B8,
      stageWrite: 0x0003
    }, {
      id: 15,
      comment: "Top left of Spectral Sword room",
      stage: 0x04,                                                                 //Olrox's Quarters
      room: 2,
      xPos: 48,
      yPos: 132,
      xyWrite: 0x00840030,
      roomWrite: 0x00410010,
      stageWrite: 0x0004
    }, {
      id: 16,
      comment: "Vase shaft",
      stage: 0x04,                                                                 //Olrox's Quarters
      room: 6,
      xPos: 118,
      yPos: 388,
      xyWrite: 0x01840076,
      roomWrite: 0x00410030,
      stageWrite: 0x0004
    }, {
      id: 17,
      comment: "Olrox Garnet room",
      stage: 0x04,                                                                 //Olrox's Quarters
      room: 10,
      xPos: 128,
      yPos: 164,
      xyWrite: 0x00A40080,
      roomWrite: 0x00410050,
      stageWrite: 0x0004
    }, {
      id: 18,
      comment: "Item cubby in boss hallway",
      stage: 0x04,                                                                 //Olrox's Quarters
      room: 11,
      xPos: 468,
      yPos: 208,
      xyWrite: 0x00d001d4,
      roomWrite: 0x00410058,
      stageWrite: 0x0004
    }, {
      id: 19,
      comment: "Room before Cerberus",
      stage: 0x05,                                                                 //Abandoned Mine
      room: 1,
      xPos: 254,
      yPos: 148,
      xyWrite: 0x009400FE,
      roomWrite: 0x00410008,
      stageWrite: 0x0005
    }, {
      id: 20,
      comment: "Combat Knife room",
      stage: 0x05,                                                                 //Abandoned Mine
      room: 9,
      xPos: 208,
      yPos: 148,
      xyWrite: 0x009400D0,
      roomWrite: 0x00410048,
      stageWrite: 0x0005
    }, {
      id: 21,
      comment: "Spike hallway",
      stage: 0x06,                                                                 //Royal Chapel
      room: 1,
      xPos: 1064,
      yPos: 132,
      xyWrite: 0x00840428,
      roomWrite: 0x00410008,
      stageWrite: 0x0006
    }, {
      id: 22,
      comment: "Confessional",
      stage: 0x06,                                                                 //Royal Chapel
      room: 7,
      xPos: 96,
      yPos: 164,
      xyWrite: 0x00a40060,
      roomWrite: 0x00410038,
      stageWrite: 0x0006
    }, {
      id: 23,
      comment: "Goggles location",
      stage: 0x06,                                                                 //Royal Chapel
      room: 8,
      xPos: 196,
      yPos: 276,
      xyWrite: 0x011400c4,
      roomWrite: 0x00410040,
      stageWrite: 0x0006
    }, {
      id: 24,
      comment: "Bottom of the Stairs",
      stage: 0x06,                                                                 //Royal Chapel
      room: 11,
      xPos: 208,
      yPos: 1700,
      xyWrite: 0x06A400D0,
      roomWrite: 0x00410058,
      stageWrite: 0x0006
    }, {
      id: 25,
      comment: "Top of the tower closest to Keep",
      stage: 0x06,                                                                 //Royal Chapel
      room: 17,
      xPos: 510,
      yPos: 228,
      xyWrite: 0x00E401FE,
      roomWrite: 0x00410088,
      stageWrite: 0x0006
    }, {
      id: 26,
      comment: "Power of Wolf",
      stage: 0x07,                                                                 //Castle Entrance
      room: 0,
      xPos: 220,
      yPos: 132,
      xyWrite: 0x008400dc,
      roomWrite: 0x00410000,
      stageWrite: 0x0007
    }, {
      id: 27,
      comment: "Holy Mail ledge",
      stage: 0x07,                                                                 //Castle Entrance
      room: 3,
      xPos: 110,
      yPos: 72,
      xyWrite: 0x0048006E,
      roomWrite: 0x00410018,
      stageWrite: 0x0007
    }, {
      id: 28,
      comment: "On the Teleporter shortcut switch",
      stage: 0x07,                                                                 //Castle Entrance
      room: 16,
      xPos: 104,
      yPos: 160,
      xyWrite: 0x00A00068,
      roomWrite: 0x00410080,
      stageWrite: 0x0007
    }, {
      id: 29,
      comment: "Drawer room",
      stage: 0x09,                                                                 //Underground Caverns
      room: 4,
      xPos: 224,
      yPos: 148,
      xyWrite: 0x009400E0,
      roomWrite: 0x00410020,
      stageWrite: 0x0009
    }, {
      id: 30,
      comment: "Top of Succubus stairs",
      stage: 0x09,                                                                 //Underground Caverns
      room: 6,
      xPos: 172,
      yPos: 132,
      xyWrite: 0x008400ac,
      roomWrite: 0x00410030,
      stageWrite: 0x0009
    }, {
      id: 31,
      comment: "Bottom of waterfall",
      stage: 0x09,                                                                 //Underground Caverns
      room: 26,
      xPos: 316,
      yPos: 1412,
      xyWrite: 0x0584013c,
      roomWrite: 0x004100d0,
      stageWrite: 0x0009
    }, {
      id: 32,
      comment: "Merman Statue room",
      stage: 0x09,                                                                 //Underground Caverns
      room: 21,
      xPos: 208,
      yPos: 132,
      xyWrite: 0x008400D0,
      roomWrite: 0x004100A8,
      stageWrite: 0x0009
    }, {
      id: 33,
      comment: "Opening shortcut",
      stage: 0x0a,                                                                 //Colosseum
      room: 4,
      xPos: 168,
      yPos: 156,
      xyWrite: 0x009c00a8,
      roomWrite: 0x00410020,
      stageWrite: 0x000a
    }, {
      id: 34,
      comment: "Open elevator",
      stage: 0x0a,                                                                 //Colosseum
      room: 6,
      xPos: 72,
      yPos: 128,
      xyWrite: 0x00800048,
      roomWrite: 0x00410030,
      stageWrite: 0x000a
    }, {
      id: 35,
      comment: "Blood cloak room",
      stage: 0x0a,                                                                 //Colosseum
      room: 10,
      xPos: 54,
      yPos: 164,
      xyWrite: 0x00A40036,
      roomWrite: 0x00410050,
      stageWrite: 0x000A
    }, {
      id: 36,
      comment: "Attic",
      stage: 0x0b,                                                                 //Castle Keep
      room: 0,
      xPos: 64,
      yPos: 164,
      xyWrite: 0x00a40040,
      roomWrite: 0x00410000,
      stageWrite: 0x000b
    }, {
      id: 37,
      comment: "Falchion room",
      stage: 0x0b,                                                                 //Castle Keep
      room: 5,
      xPos: 100,
      yPos: 164,
      xyWrite: 0x00A40064,
      roomWrite: 0x00410028,
      stageWrite: 0x000B
    }, {
      id: 38,
      comment: "Tyrfing room",
      stage: 0x0b,                                                                 //Castle Keep
      room: 8,
      xPos: 156,
      yPos: 164,
      xyWrite: 0x00A4009C,
      roomWrite: 0x00410040,
      stageWrite: 0x000B
    }, {
      id: 39,
      comment: "Cloth cape room",
      stage: 0x0c,                                                                 //Alchemy Laboratory
      room: 5,
      xPos: 128,
      yPos: 164,
      xyWrite: 0x00A40080,
      roomWrite: 0x00410028,
      stageWrite: 0x000C
    }, {
      id: 40,
      comment: "Sunglasses room",
      stage: 0x0c,                                                                 //Alchemy Laboratory
      room: 6,
      xPos: 128,
      yPos: 164,
      xyWrite: 0x00a40080,
      roomWrite: 0x00410030,
      stageWrite: 0x000c
    }, {
      id: 41,
      comment: "Skill of Wolf room",
      stage: 0x0c,                                                                 //Alchemy Laboratory
      room: 8,
      xPos: 208,
      yPos: 132,
      xyWrite: 0x008400D0,
      roomWrite: 0x00410040,
      stageWrite: 0x000C
    }, {
      id: 42,
      comment: "Middle of the maze room with pendulums",
      stage: 0x0d,                                                                 //Clock Tower
      room: 3,
      xPos: 1090,
      yPos: 84,
      xyWrite: 0x00540442,
      roomWrite: 0x00410018,
      stageWrite: 0x000D
    }, {
      id: 43,
      comment: "Fire of Bat ledge in large room",
      stage: 0x0d,                                                                 //Clock Tower
      room: 10,
      xPos: 1456,
      yPos: 132,
      xyWrite: 0x008405B0,
      roomWrite: 0x00410050,
      stageWrite: 0x000D
    }, {
      id: 44,
      comment: "Ledge with a column (left side of large room)",
      stage: 0x0d,                                                                 //Clock Tower
      room: 10,
      xPos: 216,
      yPos: 308,
      xyWrite: 0x013400d8,
      roomWrite: 0x00410050,
      stageWrite: 0x000d
    }, {
      id: 45,                                                                      // IMPORTANT CASTLE 2 NOTES: stage number must be correct, but stageWrite should mask off bit 0x20.
      comment: "Black Marble Gallery (Reverse Forbidden)",
      stage: 0x20,
      room: 0,
      xPos: 144,
      yPos: 540,
      xyWrite: 0x021c0090,
      roomWrite: 0x00270000,
      stageWrite: 0x0000                                                           // Castle 2 Stage Numbers should mask off the 0x20 bit.
    }, {
      id: 46,
      comment: "Black Marble Gallery (Reverse Alucart)",
      stage: 0x20,
      room: 14,
      xPos: 232,
      yPos: 128,
      xyWrite: 0x008000e8,
      roomWrite: 0x00270070,
      stageWrite: 0x0000
    }, {
      id: 47,
      comment: "Black Marble Gallery (Reverse Library Card)",
      stage: 0x20,
      room: 24,
      xPos: 80,
      yPos: 128,
      xyWrite: 0x00800050,
      roomWrite: 0x002700c0,
      stageWrite: 0x0000
    }, {
      id: 48,
      comment: "Reverse Outer Wall (Save Room)",
      stage: 0x21,
      room: 1,
      xPos: 232,
      yPos: 128,
      xyWrite: 0x008000e8,
      roomWrite: 0x00270008,
      stageWrite: 0x0001
    }, {
      id: 49,
      comment: "Reverse Outer Wall (Telescope)",
      stage: 0x21,
      room: 3,
      xPos: 537,
      yPos: 128,
      xyWrite: 0x00800219,
      roomWrite: 0x00270018,
      stageWrite: 0x0001
    }, {
      id: 50,
      comment: "Forbidden Library (Book Case)",
      stage: 0x22,
      room: 1,
      xPos: 32,
      yPos: 128,
      xyWrite: 0x00800020,
      roomWrite: 0x00270008,
      stageWrite: 0x0002
    }, {
      id: 51,
      comment: "Forbidden Library (Shop)",
      stage: 0x22,
      room: 5,
      xPos: 32,
      yPos: 128,
      xyWrite: 0x00800020,
      roomWrite: 0x00270028,
      stageWrite: 0x0002
    }, {
      id: 52,
      comment: "Floating Catacombs (Galamoth)",
      stage: 0x23,
      room: 1,
      xPos: 24,
      yPos: 128,
      xyWrite: 0x00800018,
      roomWrite: 0x00270008,
      stageWrite: 0x0003
    }, {
      id: 53,
      comment: "Floating Catacombs (Save Room)",
      stage: 0x23,
      room: 13,
      xPos: 246,
      yPos: 128,
      xyWrite: 0x008000f6,
      roomWrite: 0x00270068,
      stageWrite: 0x0003
    }, {
      id: 54,
      comment: "Deathwing's Lair (Entrance)",
      stage: 0x24,
      room: 1,
      xPos: 128,
      yPos: 128,
      xyWrite: 0x00800080,
      roomWrite: 0x00270008,
      stageWrite: 0x0004
    }, {
      id: 55,
      comment: "Deathwing's Lair (Alucard Mail)",
      stage: 0x24,
      room: 10,
      xPos: 32,
      yPos: 128,
      xyWrite: 0x00800020,
      roomWrite: 0x00270050,
      stageWrite: 0x0004
    }, {
      id: 56,
      comment: "Deathwing's Lair (Heart Refresh)",
      stage: 0x24,
      room: 14,
      xPos: 256,
      yPos: 128,
      xyWrite: 0x00800100,
      roomWrite: 0x00270070,
      stageWrite: 0x0004
    }, {
      id: 57,
      comment: "Cave (Alucard Sword)",
      stage: 0x25,
      room: 11,
      xPos: 56,
      yPos: 128,
      xyWrite: 0x00800038,
      roomWrite: 0x00270058,
      stageWrite: 0x0005
    }, {
      id: 58,comment: "Anti-Chapel (Confessional)",
      stage: 0x26,
      room: 7,
      xPos: 204,
      yPos: 128,
      xyWrite: 0x008000cc,
      roomWrite: 0x00270038,
      stageWrite: 0x0006
    }, {
      id: 59,
      comment: "Reverse Entrance (Gate)",
      stage: 0x27,
      room: 0,
      xPos: 125,
      yPos: 512,
      xyWrite: 0x0100007d,
      roomWrite: 0x00270000,
      stageWrite: 0x0007
    }, {
      id: 60,
      comment: "Reverse Entrance (Caverns Shortcut)",
      stage: 0x27,
      room: 10,
      xPos: 32,
      yPos: 128,
      xyWrite: 0x00800020,
      roomWrite: 0x00270050,
      stageWrite: 0x0007
    }, {
      id: 61,
      comment: "Reverse Entrance (Talisman)",
      stage: 0x27,
      room: 17,
      xPos: 32,
      yPos: 128,
      xyWrite: 0x00800020,
      roomWrite: 0x00270088,
      stageWrite: 0x0007
    }, {
      id: 62,
      comment: "Reverce Caverns (Peanuts)",
      stage: 0x29,
      room: 37,
      xPos: 18,
      yPos: 128,
      xyWrite: 0x00800012,
      roomWrite: 0x00270128,
      stageWrite: 0x0009
    }, {
      id: 63,
      comment: "Reverce Caverns (Imp Room)",
      stage: 0x29,
      room: 4,
      xPos: 224,
      yPos: 128,
      xyWrite: 0x008000e0,
      roomWrite: 0x00270020,
      stageWrite: 0x0009
    }, {
      id: 64,
      comment: "Reverce Caverns (Garnet)",
      stage: 0x29,
      room: 17,
      xPos: 228,
      yPos: 128,
      xyWrite: 0x008000e4,
      roomWrite: 0x00270088,
      stageWrite: 0x0009
    }, {
      id: 65,
      comment: "Reverse Colosseum (Gram)",
      stage: 0x2a,
      room: 10,
      xPos: 228,
      yPos: 128,
      xyWrite: 0x008000e4,
      roomWrite: 0x00270050,
      stageWrite: 0x000a
    }, {
      id: 66,
      comment: "Reverse Colosseum (Zircon)",
      stage: 0x2a,
      room: 12,
      xPos: 488,
      yPos: 128,
      xyWrite: 0x008001e8,
      roomWrite: 0x00270060,
      stageWrite: 0x000a
    }, {
      id: 67,
      comment: "Reverse Keep (High Potion)",
      stage: 0x2b,
      room: 3,
      xPos: 32,
      yPos: 256,
      xyWrite: 0x01000020,
      roomWrite: 0x00270018,
      stageWrite: 0x000b
    }, {
      id: 68,
      comment: "Reverse Keep (Lightning Mail)",
      stage: 0x2b,
      room: 8,
      xPos: 16,
      yPos: 128,
      xyWrite: 0x00800010,
      roomWrite: 0x00270040,
      stageWrite: 0x000b
    }, {
      id: 69,
      comment: "Necromancy Laboratory (Reverse Skill of Wolf)",
      stage: 0x2c,
      room: 8,
      xPos: 16,
      yPos: 128,
      xyWrite: 0x00800010,
      roomWrite: 0x00270040,
      stageWrite: 0x000c
    }, {
      id: 70,
      comment: "Necromancy Laboratory (Goddess Shield)",
      stage: 0x2c,
      room: 6,
      xPos: 248,
      yPos: 128,
      xyWrite: 0x008000f8,
      roomWrite: 0x00270030,
      stageWrite: 0x000c
    }, {
      id: 71,
      comment: "Necromancy Laboratory (Jewel Door Hall)",
      stage: 0x2c,
      room: 2,
      xPos: 504,
      yPos: 128,
      xyWrite: 0x008001f8,
      roomWrite: 0x00270010,
      stageWrite: 0x000c
    }, {
      id: 72,
      comment: "Reverse Clock Tower (Dragon Helm)",
      stage: 0x2d,
      room: 12,
      xPos: 32,
      yPos: 128,
      xyWrite: 0x00800020,
      roomWrite: 0x00270060,
      stageWrite: 0x000d
    }, {
      id: 73,
      comment: "Reverse Clock Tower (Maze Room)",
      stage: 0x2d,
      room: 3,
      xPos: 1728,
      yPos: 128,
      xyWrite: 0x008006c0,
      roomWrite: 0x00270018,
      stageWrite: 0x000d
    }
  ]
  
  const splashPhrases = [
    "Moving like Dracula, we get it back in blood!",
    "Diagon strats!",
    "Razzio routing!",
    "A miserable pile of secrets!",
    "What is Turkey Mode!?",
    "Fixed logic in Glitch!",
    "It worked on my machine!",
    "Randomizing since 2019!",
    "Still no room rando!",
    "Left side strong side!",
    "Modified left!",
    "Modified right!",
    "Always skip Creature!",
    "Blind Bat!",
    "Bat-ucard!",
    "Is this even randomized!?",
    "MLG skeleton!",
    "The (new) impossible challenge!",
    "Every day is Leg Day!",
    "Still better than Spellbound!",
    "Mankind ill needs a seed such as this!",
    "Skill expression!",
    "What DO you here!?",
    "Mother!",
    "What is a Meme!?",
    "Now featuring fewer calories!",
    "Heh, heh, thank you!",
    "Holy cross!",
    "Maria is only seventeen!",
    "That relic was bait!",
    "So you made it!",
    "Just guess correctly!",
    "Bait Ticket!",
    "Baited, lol!",
    "Reverse Library card!",
    "Instant LBC!",
    "0 days since a new dark room method!",
    "Out of logic!",
    "I'm interested in this!",
    "This cannot be!",
    "Behold my true form and despair!",
    "What are these!?",
    "Hydro Storm!",
    "Vial Stacks!",
    "Dark Wolf!",
    "This ain\’t nothing to me, man!",
    "This is a PlayStation black disc!",
    "Fear has an address ... it's 0x04369767!",
    "Sword of Brawn!",
    "Xorlo!",
    "Pictures of Dad!",
    "Yo, live!",
    "Hey, that's pretty good!",
    "I'm bad at the game!",
    "Complexity Vlad!",
    "Wear Clock In Tower!",
    "Twenty seven frames of walking animation!",
    "Die monster! You don't belong in this world!",
    "What is a man!?",
    "A miserable little pile of relics!",
    "Track one contains a dubstep banger!",
    "The original Metroidvania!",
    "The second best randomizer website!",
    "Patricide Simulator \'97!",
    "Now with larger statue dongs!",
    "Keep that 'Thang on ya!",
    "We patched it!",
    "Randomizer? I hardly know her!",
    "Also try Archipelago!",
    "Check out Kind and Fair!",
    "Bora, bora, bora, bora!",
    "Ay, vamos!",
    "Klasse!",
    "C\’est genial!",
    "Fifty dollar gift card!",
    "eldri7ch checks!",
    "At least it\'s better than Spellbound!",
    "There's no \'world record\' for randomizers!",
    "Rest in Peace, Scott.",
    "Now starting season 28!",
    "Really good, actually!",
    "!ahl",
    "For Shakey!",
    "Barley Teas!",
    "But DerDrach has full-cleared second castle!",
    "Spring Tournament 2022 Champion JupiterClimb",
    "Spring Tournament 2023 Champion Dr4gonBlitz!",
    "Spring Tournament 2024 Champion the__swarm!",
    "Spring Tournament 2025 Champion DerDrach!",
    "Fall Tournament 2021 Champion asdheyb!",
    "Fall Tournament 2022 Champion JupiterClimb!",
    "Fall Tournament 2023 Champion the__swarm!",
    "Fall Tournament 2024 Champion DerDrach!",
    "Fall Tournament 2025 Champion Renantrl1!"
  ]

  const prideSplashPhrases = [
    "Happy Pride!",
    "Trans rights are human rights!",
    "Gay rights are human rights!",
    "Marriage Equality!",
    "Ace homies rise up!",
    "Enby comrades!",
    "Hug your nearest Intersex friend!",
    "Bisexual pride!",
    "LGBTQIA+: You are seen and valid!",
    "We love Demis!",
    "Can't stand the Rainbow? Face the Painbow!",
    "Progress only hurts the oppressor!",
    "Love is Love!",
    "Queer is here to stay!",
    "Aromantics are welcome!",
    "Preferred pronouns!",
    "You get to decide your own identity!"
  ]

  const adjectivesNormal = [
    "Invincible",
    "Burning",
    "Preposterous",
    "Grumpy",
    "SuperDuper",
    "Boring",
    "Sorry",
    "Hot",
    "Used",
    "Afraid",
    "Tall",
    "Large",
    "Terrible",
    "Distorted",
    "Curious",
    "Pregnant",
    "Useful",
    "Decent",
    "Enhanced",
    "Asleep",
    "Cultural",
    "Indistinguishable",
    "Exciting",
    "Healthy",
    "Logical",
    "Popular",
    "Overdriven",
    "Unhappy",
    "Known",
    "Critical",
    "Ugly",
    "Legal",
    "Powerful",
    "Hungry",
    "Angry",
    "Aware",
    "Scared",
    "Tiny",
    "Wooden",
    "Informal",
    "Happy",
    "Strict",
    "Obvious",
    "Federal",
    "Nice",
    "Every",
    "Relevant",
    "Friendly",
    "Distinct",
    "Ancient",
    "Unlikely",
    "Odd",
    "Weak",
    "Suitable",
    "Severe",
    "Capable",
    "Unfair",
    "Lonely",
    "Entire",
    "Similar",
    "Obscure",
    "Redundant",
    "Intelligent",
    "Yellow",
    "Sinister",
    "Spectacular",
    "Mint",
    "Fuzzy",
    "Chipped",
    "Squishy",
    "Corrupted",
    "Predictable",
    "Super",
    "Sharp",
    "Junior",
    "Riveting",
    "Perfect",
    "EX",
    "Supreme",
    "Dark",
    "Volcanic",
    "Colorful",
    "Flimsy",
    "Silly",
    "Shin",
    "Denjin",
    "Surprising",
    "Optimal",
    "Suboptimal",
    "Ultra",
    "Counter",
    "Cowardly",
    "Hairy",
    "Rage",
    "Vegan",
    "Epic",
    "Turbo",
    "Undead",
    "Chill",
    "True",
    "Moody",
    "Frozen",
    "Flawless",
    "Pointless",
    "Shinku",
    "Mesatsu",
    "Terran",
    "Protoss",
    "Zerg",
    "Orcish",
    "Elvish",
    "Tarot",
    "Bohemian",
    "Arcane",
    "Mystic",
    "Light",
    "Red",
    "Crimson",
    "Garnet",
    "Ruby",
    "Blue",
    "Azure",
    "Lapis",
    "Cobalt",
    "Sapphire",
    "White",
    "Pearl",
    "Ivory",
    "Crystal",
    "Diamond",
    "Topaz",
    "Amber",
    "Jade",
    "Obsidian",
    "Emerald",
    "Fine",
    "Strong",
    "Grand",
    "Valiant",
    "Glorious",
    "Blessed",
    "Saintly",
    "Awesome",
    "Holy",
    "Godly",
    "Bronze",
    "Iron",
    "Steel",
    "Silver",
    "Gold",
    "Platinum",
    "Mithril",
    "Meteoric",
    "Weird",
    "Strange",
    "Jagged",
    "Deadly",
    "Heavy",
    "Vicious",
    "Brutal",
    "Massive",
    "Savage",
    "Ruthless",
    "Merciless",
    "Khajit",
    "Argonian",
    "Redguard",
    "Breton",
    "Nord",
    "Dunmer",
    "Altmer",
    "Falmer",
    "Bosmer",
    "Plentiful",
    "Bountiful",
    "Angels",
    "Arch-Angels",
    "Final",
    "Mandalorian",
    "Prototype",
    "Sith",
    "Jedi",
    "Battle",
    "Autobot",
    "Decepticon",
    "Primal",
    "Whovian",
    "Golgari",
    "Azorius",
    "Boros",
    "Simic",
    "Dimir",
    "Selesnya",
    "Gruul",
    "Orzhov",
    "Rakdos",
    "Izzet",
    "Infinite",
    "Eldritch",
    "Bucolic",
    "Serendipitous",
    "Angsty",
    "Death",
    "Chase",
    "Urzas",
    "Dank",
    "Borg",
    "Romulan",
    "Klingon",
    "Cardassian",
    "Jaffa",
    "Goauld",
    "Asgardian",
    "Vulcan",
    "Spark",
    "Armored",
    "Launch",
    "Boomer",
    "Sting",
    "Storm",
    "Flame",
    "Wheel",
    "Bubble",
    "Morph",
    "Magna",
    "Overdrive",
    "Wire",
    "Blast",
    "Blizzard",
    "Toxic",
    "Tunnel",
    "Volt",
    "Crush",
    "Neon",
    "Gravity",
    "Web",
    "Split",
    "Cyber",
    "Magma",
    "Frost",
    "Jet",
    "Slash",
    "Crescent",
    "Tidal",
    "Shining",
    "Spiral",
    "Burn",
    "Spike",
    "Ground",
    "Blaze",
    "Rainy",
    "Metal",
    "Shield",
    "Infinity",
    "Commander",
    "Soldier",
    "Tornado",
    "Splash",
    "Ride",
    "Snipe",
    "Wind",
    "Vanishing",
    "Bamboo",
    "Optic",
    "Earthrock",
    "Gigabolt",
    "Avalanche",
    "Green",
    "Bridge",
    "Jungle",
    "Labyrinth",
    "Scrap",
    "Sky",
    "Special",
    "Metropolis",
    "Chemical",
    "Aquatic",
    "Casino",
    "Hill",
    "Oil",
    "Wing",
    "Wood",
    "Genocide",
    "Rock",
    "Sand",
    "Egg",
    "Proto",
    "Boss",
    "Hidden",
    "Angel",
    "Hydrocity",
    "Marble",
    "Carnival",
    "Icecap",
    "Mushroom",
    "Flying",
    "Sandopolis",
    "Lava",
    "The",
    "Balloon",
    "Chrome",
    "Desert",
    "Endless",
    "Bob-Omb",
    "Whomps",
    "JollyRoger",
    "CoolCool",
    "BigBoos",
    "Hazy",
    "Lethal",
    "ShiftingSand",
    "DireDire",
    "Snowmans",
    "WetDry",
    "TallTall",
    "Sacred",
    "TinyHuge",
    "TickTock",
    "Rainbow",
];
  const nounsNormal = [
    "Axelord",
    "Fleaman",
    "Nutella",
    "Saiyan",
    "Turtle",
    "Ranger",
    "Whip",
    "Octopus",
    "Slayer",
    "Vampire",
    "Zombie",
    "Skeleton",
    "Zerg",
    "Terran",
    "Protoss",
    "SCP",
    "Spark",
    "Steel",
    "Rage",
    "Connection",
    "Radiator",
    "Alien",
    "Dog",
    "Cat",
    "Setup",
    "Shoryuken",
    "Fireball",
    "Fist",
    "Dolphin",
    "Force",
    "Star",
    "Bug",
    "Beard",
    "Moustache",
    "Junior",
    "Planet",
    "Mist",
    "Wolf",
    "Bat",
    "Armor",
    "Axe",
    "Sword",
    "Boss",
    "Seed",
    "Cable",
    "Soup",
    "Poem",
    "Trebuchet",
    "Cheek",
    "Girl",
    "Spawn",
    "Fortune",
    "Revolver",
    "Drawing",
    "Grocery",
    "Leader",
    "Setting",
    "Security",
    "Office",
    "Agency",
    "User",
    "Resource",
    "Policy",
    "Love",
    "Extent",
    "Week",
    "Employee",
    "Climate",
    "Unit",
    "Union",
    "Person",
    "Painting",
    "Analysis",
    "Night",
    "City",
    "Church",
    "Surgery",
    "Police",
    "Witch",
    "Finding",
    "Viper",
    "Member",
    "Patience",
    "Computer",
    "Movie",
    "Argument",
    "Virus",
    "Courage",
    "Debt",
    "Engine",
    "Tooth",
    "Wife",
    "Employer",
    "Gate",
    "Accident",
    "Warning",
    "Dinner",
    "Avocado",
    "Banana",
    "Cherry",
    "Celery",
    "Proton",
    "Neutron",
    "Apple",
    "Button",
    "Monitor",
    "Controller",
    "Potential",
    "Hadoken",
    "Justice",
    "Mew",
    "Cannon",
    "TatsumakiSenpukyaku",
    "Gohado",
    "Orc",
    "Elf",
    "Ent",
    "Spider",
    "Death",
    "Demon",
    "Goblin",
    "Wurm",
    "Spirit",
    "Horror",
    "God",
    "Devil",
    "Minotaur",
    "Blast",
    "Bus",
    "Horse",
    "Moon",
    "Executioner",
    "Assassin",
    "Druid",
    "Barbarian",
    "Sorceress",
    "Wizard",
    "Necromancer",
    "Paladin",
    "Amazon",
    "Crusader",
    "Rogue",
    "Warrior",
    "Sorcerer",
    "Angel",
    "Nephalim",
    "Evil",
    "Lunch",
    "Breakfast",
    "Artifact",
    "Enchantment",
    "Creature",
    "Planeswalker",
    "Flux",
    "Tardis",
    "Companion",
    "Hour",
    "Minute",
    "Second",
    "Day",
    "Month",
    "Year",
    "Talisman",
    "Curio",
    "Bangle",
    "Broach",
    "Spell",
    "Sorcery",
    "Mummy",
    "Werewolf",
    "Werebear",
    "Werebat",
    "Knight",
    "Soldier",
    "King",
    "Queen",
    "Rebel",
    "Mercenary",
    "Error",
    "Object",
    "Prime",
    "Sage",
    "Butcher",
    "Echo",
    "Leyline",
    "Bahamut",
    "Cactuar",
    "Tonberry",
    "Chocobo",
    "Moogle",
    "Moomba",
    "Surge",
    "Eidolon",
    "Esper",
    "Leviathan",
    "Phoenix",
    "Pikachu",
    "Charizard",
    "Xenomorph",
    "Android",
    "Jedi",
    "Sith",
    "Maverick",
    "Mandalorian",
    "Grail",
    "Card",
    "Slime",
    "Mewtwo",
    "Fireflower",
    "Mushroom",
    "Starman",
    "Mario",
    "Peach",
    "Toad",
    "Luigi",
    "Bowser",
    "Mask",
    "Ganon",
    "Materia",
    "Fairy",
    "Battletoad",
    "Kombat",
    "Portal",
    "CompanionCube",
    "Cake",
    "Dervish",
    "Kraken",
    "Meme",
    "Jaffa",
    "Goauld",
    "Stargate",
    "Zatniktel",
    "Q",
    "Cardassian",
    "Klingon",
    "Romulan",
    "Vulcan",
    "Penguin",
    "Mandrill",
    "Armadillo",
    "Kuwanger",
    "Chameleon",
    "Eagle",
    "Mammoth",
    "Gator",
    "Crab",
    "Stag",
    "Moth",
    "Centipede",
    "Snail",
    "Ostrich",
    "Sponge",
    "Mac",
    "Hornet",
    "Buffalo",
    "Seahorse",
    "Rhino",
    "Catfish",
    "Crawfish",
    "Tiger",
    "Beetle",
    "Peacock",
    "Owl",
    "Dragoon",
    "Walrus",
    "Stingray",
    "Beast",
    "Grizzly",
    "Whale",
    "Firefly",
    "Necrobat",
    "Pegasus",
    "Dinorex",
    "Rosered",
    "Yammark",
    "Scaravich",
    "Heatnix",
    "Wolfgang",
    "Turtoid",
    "SharkPlayer",
    "Sheldon",
    "Mijinion",
    "Stonekong",
    "Tonion",
    "Warfly",
    "Hyenard",
    "Boarski",
    "Anteator",
    "Crowrang",
    "Gungaroo",
    "Pandamonium",
    "Sunflower",
    "Mantis",
    "Antonion",
    "Trilobyte",
    "ManOWar",
    "Yeti",
    "Rooster",
    "Zone",
    "Hill",
    "Plant",
    "Ruin",
    "Top",
    "Cave",
    "Ocean",
    "Brain",
    "Base",
    "Chase",
    "Fortress",
    "Egg",
    "Heart",
    "World",
    "Shower",
    "Gauntlet",
    "Palace",
    "Attack",
    "Island",
    "Garden",
    "Battery",
    "Reef",
    "Sanctuary",
    "Doomsday",
    "Park",
    "Gadget",
    "Mine",
    "Land",
    "Battlefield",
    "Bay",
    "Mountain",
    "Haunt",
    "MazeCave",
    "LavaLand",
    "Docks",
    "Clock",
    "Ride",
    "Goomba",
    "KoopaTroopa",
    "CharginChuck",
    "Spike",
    "Boo",
    "Rex",
    "ChainChomp",
  ];

  const adjectivesHalloween = [
    "Scary",
    "Terrifying",
    "Spooky",
    "Eerie",
    "Horrendous",
    "Abyssal",
    "Spinechilling",
    "Bloodcurdling",
    "Chilling",
    "Horrid",
    "Horrific",
    "Horrifying",
    "Dire",
    "Dreadful",
    "Fearsome",
    "Ghastly",
    "Disturbing",
    "Unnerving",
    "Creepy",
    "Nightmarish",
    "Gruesome",
    "Grotesque",
    "Hideous",
    "Petrifying",
    "Undead",
    "Vile",
    "Evil",
    "Unsettling",
    "Incorporeal",
    "Ephemeral",
    "Haunting",
    "Frightening",
    "Graven",
    "Abhorrent",
    "Surreal",
    "Insidious",
    "Sordid",
    "Malicious",
    "Unspeakable",
    "Defiled",
    "Unscrupulous",
    "Sinister",
    "Malevolent",
    "Haunted",
    "Gory",
    "Decapitated",
    "Disemboweled",
    "Deceased",
    "Fanged",
    "Paranormal"
  ];
  const nounsHalloween = [
    "Skeleton",
    "Ghost",
    "SCP",
    "Vampire",
    "Ghoul",
    "Werewolf",
    "Zombie",
    "Phantom",
    "Monster",
    "Lich",
    "Bulette",
    "Beholder",
    "Hag",
    "Witch",
    "MindFlayer",
    "Devil",
    "Demon",
    "Fiend",
    "Alien",
    "Lich",
    "Gargoyle",
    "Abomination",
    "Construct",
    "Wendigo",
    "Wight",
    "Goblin",
    "Crone",
    "Spectre",
    "Banshee",
    "Wraith",
    "Arachnid",
    "Monstrosity",
    "Yokai",
    "Spirit",
    "Wretch",
    "Fiend",
    "Oni",
    "Kitsune",
    "Chupacabra",
    "Basilisk",
    "Horror",
    "Nightmare",
    "Cockatrice",
    "Kraken",
    "Djinn",
    "Ogre",
    "Gorgon",
    "Warlock",
    "Ooze",
    "Shedim",
    "Asura",
    "Daeva",
    "Gallas",
  ];

  const adjectivesHolidays = [
    "Snowy",
    "Merry",
    "Happy",
    "Jolly",
    "Cozy",
    "Festive",
    "Relaxing",
    "Cheery",
    "Warm",
    "Sparkly",
    "Wintry",
    "Joyful",
    "Snow",
    "Giving",
    "Celebratory",
    "Joyous",
    "Yule",
    "Frosty",
    "Jingly"
  ];

  const seasonalEvents = [
    {
      "eventName": "Pride Month",
      "startMonth": 6,
      "startDay": 1,
      "endMonth": 7,
      "endDay": 1,
      "eventLogo": "images/logopride.png",
      "toolSplashPhrases": prideSplashPhrases
    }
  ]

  let songsList = [
    "Lost Painting",
    "Curse Zone",
    "Requiem For The Gods",
    "Rainbow Cemetary",
    "Wood Carving Partita",
    "Crystal Teardrops",
    "Marble Gallery",
    "Draculas Castle",
    "The Tragic Prince",
    "Tower of Mist",
    "Door of Holy Spirits",
    "Dance of Pales",
    "Abandoned Pit",
    "Heavenly Doorway",
    "Festival of Servants",
    "Wandering Ghosts",
    "The Door to the Abyss",
    "Dance of Gold",
    "Enchanted Banquet",
    "Death Ballad",
    "Final Toccata",
    "Dance of Illusions",
    "Blood Relations"
  ]

  const digest =
        'ce01203a9df93e001b88ef4c350889c19f11ffba89d20f214bdd8dec0b2d8d7c'

  const exports = {
    devBaseUrl: devBaseUrl,
    defaultOptions: defaultOptions,
    optionsUrls: optionsUrls,
    TYPE: TYPE,
    typeNames: typeNames,
    ZONE: ZONE,
    zoneNames: zoneNames,
    zones: zones,
    exe: exe,
    enemyListOff: enemyListOff,
    enemyListLen: enemyListLen,
    enemyDataOff: enemyDataOff,
    enemyDataLen: enemyDataLen,
    handEquipmentListOff: handEquipmentListOff,
    handEquipmentListLen: handEquipmentListLen,
    armorListOff: armorListOff,
    armorListLen: armorListLen,
    helmetListOff: helmetListOff,
    helmetListLen: helmetListLen,
    cloakListOff: cloakListOff,
    cloakListLen: cloakListLen,
    accessoryListOff: accessoryListOff,
    accessoryListLen: accessoryListLen,
    RELIC: RELIC,
    tileIdOffset: tileIdOffset,
    equipIdOffset: equipIdOffset,
    equipmentInvIdOffset: equipmentInvIdOffset,
    SLOT: SLOT,
    slots: slots,
    EXTENSION: EXTENSION,
    defaultExtension: defaultExtension,
    LOCATION: LOCATION,
    GLOBAL_DROP: GLOBAL_DROP,
    globalDropsCount: globalDropsCount,
    MUSIC: MUSIC,
    TRAVEL_MUSIC: TRAVEL_MUSIC,
    BOSS_MUSIC: BOSS_MUSIC,
    HAND_TYPE: HAND_TYPE,
    handTypeNames: handTypeNames,
    WORKER_ACTION: WORKER_ACTION,
    faerieScrollForceAddresses: faerieScrollForceAddresses,
    characterMap: characterMap,
    shopItemsData: shopItemsData,
    startRoomData: startRoomData,
    splashPhrases: splashPhrases,
    prideSplashPhrases: prideSplashPhrases,
    digest: digest,
    adjectivesNormal: adjectivesNormal,
    adjectivesHalloween: adjectivesHalloween,
    adjectivesHolidays: adjectivesHolidays,
    nounsHalloween: nounsHalloween,
    nounsNormal: nounsNormal,
    seasonalEvents: seasonalEvents,
    songsList: songsList
  }

  if (self) {
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      constants: exports,
    })
  } else {
    module.exports = exports
  }
})(typeof(self) !== 'undefined' ? self : null)
