(function (self) {
    let common
    let seedrandom

    if (self) {
        common = self.sotnShuffler.common
        seedrandom = Math.seedrandom
    } else {
        common = require('./common')
        seedrandom = require('seedrandom')
    }

    const TEMPLATE = {
        authors: [
            'Sestren',
        ],
        changes: [],
        description: [
            'Randomize uncommon and rare drops from enemies',
        ],
    }

    const ITEM_IDS = {
        // prizeHeart1: 0,
        // prizeHeart5: 1,
        // prizeGold1: 2,
        // prizeGold25: 3,
        // prizeGold50: 4,
        // prizeGold100: 5,
        // prizeGold250: 6,
        // prizeGold400: 7,
        prizeGold700: 8,
        prizeGold1000: 9,
        prizeGold2000: 10,
        prizeGold5000: 11,
        // upgradeHeartMax: 12,
        // prizeFakeTurkey: 13,
        // subweaponDagger: 14,
        // subweaponAxe: 15,
        // subweaponCross: 16,
        // subweaponHolyWater: 17,
        // subweaponStopwatch: 18,
        // subweaponBible: 19,
        // subweaponReboundStone: 20,
        // subweaponVibhuti: 21,
        // subweaponAgunea: 22,
        // upgradeLifeMax: 23,
        // emptyHandSlot: 128,
        itemMonsterVial1: 129,
        itemMonsterVial2: 130,
        itemMonsterVial3: 131,
        itemShieldRod: 132,
        itemLeatherShield: 133,
        itemKnightShield: 134,
        itemIronShield: 135,
        itemAxeLordShield: 136,
        itemHeraldShield: 137,
        itemDarkShield: 138,
        itemGoddessShield: 139,
        itemShamanShield: 140,
        itemMedusaShield: 141,
        itemSkullShield: 142,
        itemFireShield: 143,
        itemAlucardShield: 144,
        itemSwordOfDawn: 145,
        itemBasilard: 146,
        itemShortSword: 147,
        itemCombatKnife: 148,
        itemNunchaku: 149,
        itemWereBane: 150,
        itemRapier: 151,
        itemKarmaCoin: 152,
        itemMagicMissile: 153,
        itemRedRust: 154,
        itemTakemitsu: 155,
        itemShotel: 156,
        itemOrange: 157,
        itemApple: 158,
        itemBanana: 159,
        itemGrapes: 160,
        itemStrawberry: 161,
        itemPineapple: 162,
        itemPeanuts: 163,
        itemToadstool: 164,
        itemShiitake: 165,
        itemCheesecake: 166,
        itemShortcake: 167,
        itemTart: 168,
        itemParfait: 169,
        itemPudding: 170,
        itemIceCream: 171,
        itemFrankfurter: 172,
        itemHamburger: 173,
        itemPizza: 174,
        itemCheese: 175,
        itemHamandEggs: 176,
        itemOmelette: 177,
        itemMorningSet: 178,
        itemLunchA: 179,
        itemLunchB: 180,
        itemCurryRice: 181,
        itemGyrosPlate: 182,
        itemSpaghetti: 183,
        itemGrapeJuice: 184,
        itemBarleyTea: 185,
        itemGreenTea: 186,
        itemNatou: 187,
        itemRamen: 188,
        itemMisoSoup: 189,
        itemSushi: 190,
        itemPorkBun: 191,
        itemRedBeanBun: 192,
        itemChineseBun: 193,
        itemDimSumSet: 194,
        itemPotRoast: 195,
        itemSirloin: 196,
        itemTurkey: 197,
        itemMealTicket: 198,
        itemNeutronBomb: 199,
        itemPowerOfSire: 200,
        itemPentagram: 201,
        itemBatPentagram: 202,
        itemShuriken: 203,
        itemCrossShuriken: 204,
        itemBuffaloStar: 205,
        itemFlameStar: 206,
        itemTNT: 207,
        itemBwakaKnife: 208,
        itemBoomerang: 209,
        itemJavelin: 210,
        itemTyrfing: 211,
        itemNamakura: 212,
        itemKnuckleDuster: 213,
        itemGladius: 214,
        itemScimitar: 215,
        itemCutlass: 216,
        itemSaber: 217,
        itemFalchion: 218,
        itemBroadsword: 219,
        itemBekatowa: 220,
        itemDamascusSword: 221,
        itemHunterSword: 222,
        itemEstoc: 223,
        itemBastardSword: 224,
        itemJewelKnuckles: 225,
        itemClaymore: 226,
        itemTalwar: 227,
        itemKatana: 228,
        itemFlamberge: 229,
        itemIronFist: 230,
        itemZweiHander: 231,
        itemSwordOfHador: 232,
        itemLuminus: 233,
        itemHarper: 234,
        itemObsidianSword: 235,
        itemGram: 236,
        itemJewelSword: 237,
        itemMormegil: 238,
        itemFirebrand: 239,
        itemThunderbrand: 240,
        itemIcebrand: 241,
        itemStoneSword: 242,
        itemHolySword: 243,
        itemTerminusEst: 244,
        itemMarsil: 245,
        itemDarkBlade: 246,
        itemHeavenSword: 247,
        itemFistOfTulkas: 248,
        itemGurthang: 249,
        itemMourneblade: 250,
        itemAlucardSword: 251,
        itemMablungSword: 252,
        itemBadelaire: 253,
        // specialSwordFamiliar: 254,
        itemGreatSword: 255,
        itemMace: 256,
        itemMorningstar: 257,
        itemHolyRod: 258,
        itemStarFlail: 259,
        itemMoonRod: 260,
        itemChakram: 261,
        itemFireBoomerang: 262,
        itemIronBall: 263,
        itemHolbeinDagger: 264,
        itemBlueKnuckles: 265,
        itemDynamite: 266,
        itemOsafuneKatana: 267,
        itemMasamune: 268,
        itemMuramasa: 269,
        itemHeartRefresh: 270,
        itemRunesword: 271,
        itemAntivenom: 272,
        itemUncurse: 273,
        itemLifeApple: 274,
        itemHammer: 275,
        itemStrengthPotion: 276,
        itemLuckPotion: 277,
        itemSmartPotion: 278,
        itemAttackPotion: 279,
        itemShieldPotion: 280,
        itemResistFire: 281,
        itemResistThunder: 282,
        itemResistIce: 283,
        itemResistStone: 284,
        itemResistHoly: 285,
        itemResistDark: 286,
        itemPotion: 287,
        itemHighPotion: 288,
        itemElixir: 289,
        itemMannaPrism: 290,
        itemVorpalBlade: 291,
        itemCrissaegrim: 292,
        itemYasutsuna: 293,
        itemLibraryCard: 294,
        itemAlucartShield: 295,
        itemAlucartSword: 296,
        // emptyArmorSlot: 297,
        itemClothTunic: 298,
        itemHideCuirass: 299,
        itemBronzeCuirass: 300,
        itemIronCuirass: 301,
        itemSteelCuirass: 302,
        itemSilverPlate: 303,
        itemGoldPlate: 304,
        itemPlatinumMail: 305,
        itemDiamondPlate: 306,
        itemFireMail: 307,
        itemLightningMail: 308,
        itemIceMail: 309,
        itemMirrorCuirass: 310,
        itemSpikeBreaker: 311,
        itemAlucardMail: 312,
        itemDarkArmor: 313,
        itemHealingMail: 314,
        itemHolyMail: 315,
        itemWalkArmor: 316,
        itemBrilliantMail: 317,
        itemMojoMail: 318,
        itemFuryPlate: 319,
        itemDraculaTunic: 320,
        itemGodsGarb: 321,
        itemAxeLordArmor: 322,
        // emptyHeadSlot: 323,
        itemSunglasses: 324,
        itemBallroomMask: 325,
        itemBandanna: 326,
        itemFeltHat: 327,
        itemVelvetHat: 328,
        itemGoggles: 329,
        itemLeatherHat: 330,
        itemHolyGlasses: 331,
        itemSteelHelm: 332,
        itemStoneMask: 333,
        itemCirclet: 334,
        itemGoldCirclet: 335,
        itemRubyCirclet: 336,
        itemOpalCirclet: 337,
        itemTopazCirclet: 338,
        itemBerylCirclet: 339,
        itemCatEyeCirclet: 340,
        itemCoralCirclet: 341,
        itemDragonHelm: 342,
        itemSilverCrown: 343,
        itemWizardHat: 344,
        // emptyCapeSlot: 345,
        itemClothCape: 346,
        itemReverseCloak: 347,
        itemElvenCloak: 348,
        itemCrystalCloak: 349,
        itemRoyalCloak: 350,
        itemBloodCloak: 351,
        itemJosephsCloak: 352,
        itemTwilightCloak: 353,
        // emptyAccessorySlot: 354,
        itemMoonstone: 355,
        itemSunstone: 356,
        itemBloodstone: 357,
        itemStaurolite: 358,
        itemRingOfPales: 359,
        itemZircon: 360,
        itemAquamarine: 361,
        itemTurquoise: 362,
        itemOnyx: 363,
        itemGarnet: 364,
        itemOpal: 365,
        itemDiamond: 366,
        itemLapisLazuli: 367,
        itemRingOfAres: 368,
        itemGoldRing: 369,
        itemSilverRing: 370,
        itemRingOfVarda: 371,
        itemRingOfArcana: 372,
        itemMysticPendant: 373,
        itemHeartBroach: 374,
        itemNecklaceOfJ: 375,
        itemGauntlet: 376,
        itemAnkhOfLife: 377,
        itemRingOfFeanor: 378,
        itemMedal: 379,
        itemTalisman: 380,
        itemDuplicator: 381,
        itemKingsStone: 382,
        itemCovenantStone: 383,
        itemNauglamir: 384,
        itemSecretBoots: 385,
        itemAlucartMail: 386,
    }

    const ENEMIES = {
        archer: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.archer',
            ],
        },
        armorLord: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.armorLord',
            ],
        },
        axeKnightA: {
            // NOTE(sestren): Uncommon drop is the Axe subweapon
            dropTypes: ['rare'],
            keys: [
                'enemyDefinitions.axeKnightA',
            ],
        },
        axeKnightB: {
            // NOTE(sestren): Uncommon drop is the Axe subweapon
            dropTypes: ['rare'],
            keys: [
                'enemyDefinitions.axeKnightB',
            ],
        },
        azaghal: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.azaghal',
            ],
        },
        bat: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.bat',
            ],
        },
        bitterfly: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.bitterfly',
            ],
        },
        blackCrow: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.blackCrow',
            ],
        },
        blackPanther: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.blackPanther',
            ],
        },
        blade: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.blade',
            ],
        },
        bladeMaster: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.bladeMaster',
            ],
        },
        bladeSoldier: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.bladeSoldier',
            ],
        },
        bloodyZombie: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.bloodyZombie',
            ],
        },
        blueRaven: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.blueRaven',
            ],
        },
        blueVenusWeed: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.blueVenusWeed',
                'enemyDefinitions.blueVenusWeedFinalForm',
            ],
        },
        bombKnight: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.bombKnight',
            ],
        },
        boneArcher: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.boneArcher',
            ],
        },
        boneArk: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.boneArk',
                'enemyDefinitions.boneArk2',
            ],
        },
        boneHalberd: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.boneHalberd',
            ],
        },
        boneMusket: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.boneMusket',
            ],
        },
        bonePillar: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.bonePillar',
            ],
        },
        boneScimitarBlue: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.boneScimitarBlue',
            ],
        },
        caveTroll: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.caveTroll',
            ],
        },
        cloakedKnight: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.cloakedKnight',
            ],
        },
        cornerGuard: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.cornerGuard',
            ],
        },
        corpseweed: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.corpseweed',
                'enemyDefinitions.corpseweed2',
            ],
        },
        ctulhu: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.ctulhu',
            ],
        },
        darkOctopus: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.darkOctopus',
            ],
        },
        dhuron: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.dhuron',
            ],
        },
        diplocephalus: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.diplocephalus',
            ],
        },
        discusLord: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.discusLord',
            ],
        },
        dodoBird: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.dodoBird',
            ],
        },
        ectoplasm: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.ectoplasm',
            ],
        },
        fireDemon: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.fireDemon',
            ],
        },
        fireWarg: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.fireWarg',
            ],
        },
        fishhead: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.fishhead',
            ],
        },
        flailGuard: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.flailGuard',
            ],
        },
        fleaArmor: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.fleaArmor',
            ],
        },
        fleaMan: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.fleaMan',
            ],
        },
        fleaRider: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.fleaRider',
            ],
        },
        flyingZombie: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.flyingZombie',
                'enemyDefinitions.flyingZombie2',
            ],
        },
        frog: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.frog',
            ],
        },
        frozenHalf: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.frozenHalf',
            ],
        },
        frozenShade: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.frozenShade',
            ],
        },
        ghost: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.ghost',
            ],
        },
        ghostDancer: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.ghostDancer',
            ],
        },
        gorgon: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.gorgon',
            ],
        },
        graveKeeper: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.graveKeeper',
            ],
        },
        gremlin: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.gremlin',
            ],
        },
        guardian: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.guardian',
            ],
        },
        gurkha: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.gurkha',
            ],
        },
        hammer: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.hammer',
            ],
        },
        harpy: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.harpy',
            ],
        },
        hellfireBeast: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.hellfireBeast',
            ],
        },
        huntingGirl: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.huntingGirl',
            ],
        },
        imp: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.imp',
            ],
        },
        jackOBones: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.jackOBones',
            ],
        },
        karasuman: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.karasuman',
            ],
        },
        killerFish: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.killerFish',
            ],
        },
        lesserDemon: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.lesserDemon',
            ],
        },
        lion: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.lion',
            ],
        },
        lossoth: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.lossoth',
            ],
        },
        magicTome: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.magicTome',
            ],
        },
        malachi: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.malachi',
            ],
        },
        marionette: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.marionette',
            ],
        },
        medusaHead: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.medusaHead',
            ],
        },
        medusaHeadGolden: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.medusaHeadGolden',
            ],
        },
        mermanTypeA: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.mermanTypeA',
            ],
        },
        mermanTypeB: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.mermanTypeB',
            ],
        },
        minotaur: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.minotaur',
            ],
        },
        novaSkeleton: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.novaSkeleton',
            ],
        },
        orobourous: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.orobourous',
            ],
        },
        ouijaTable: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.ouijaTable',
            ],
        },
        owlKnight: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.owlKnight',
            ],
        },
        paranthropus: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.paranthropus',
            ],
        },
        phantomSkull: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.phantomSkull',
            ],
        },
        plateLord: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.plateLord',
            ],
        },
        poltergeist: {
            // NOTE(sestren): Rare drop is a single heart
            dropTypes: ['uncommon'],
            keys: [
                'enemyDefinitions.poltergeist',
            ],
        },
        puppetSword: {
            // NOTE(sestren): Rare drop is a single heart
            dropTypes: ['uncommon'],
            keys: [
                'enemyDefinitions.puppetSword',
            ],
        },
        rockKnight: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.rockKnight',
            ],
        },
        salemWitch: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.salemWitch',
            ],
        },
        salome: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.salome',
            ],
        },
        scarecrow: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.scarecrow',
            ],
        },
        schmoo: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.schmoo',
            ],
        },
        shield: {
            // NOTE(sestren): Rare drop is a single heart
            dropTypes: ['uncommon'],
            keys: [
                'enemyDefinitions.shield',
            ],
        },
        skelerang: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.skelerang',
            ],
        },
        skeleton: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.skeleton',
            ],
        },
        skeletonApe: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.skeletonApe',
            ],
        },
        skull: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.skull',
            ],
        },
        skullLord: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.skullLord',
            ],
        },
        slinger: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.slinger',
            ],
        },
        sniperOfGoth: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.sniperOfGoth',
            ],
        },
        spear: {
            // NOTE(sestren): Rare drop is a single heart
            dropTypes: ['uncommon'],
            keys: [
                'enemyDefinitions.spear',
            ],
        },
        spearGuard: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.spearGuard',
            ],
        },
        spectralSwordTypeA: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.spectralSwordTypeA',
                'enemyDefinitions.spectralSwordTypeA2',
            ],
        },
        spectralSwordTypeB: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.spectralSwordTypeB',
            ],
        },
        spellbook: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.spellbook',
            ],
        },
        spikedBall: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.spikedBall',
            ],
        },
        stoneRose: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.stoneRose',
            ],
        },
        swordLord: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.swordLord',
            ],
        },
        thornweed: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.thornweed',
            ],
        },
        tinMan: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.tinMan',
            ],
        },
        toad: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.toad',
            ],
        },
        tombstone: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.tombstone',
            ],
        },
        valhallaKnight: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.valhallaKnight',
            ],
        },
        vandalSword: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.vandalSword',
            ],
        },
        venusWeed: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.venusWeed',
                'enemyDefinitions.venusWeedFinalForm',
            ],
        },
        wereskeleton: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.wereskeleton',
            ],
        },
        werewolf: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.werewolf',
            ],
        },
        wingedGuard: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.wingedGuard',
            ],
        },
        yorick: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.yorick',
            ],
        },
        zombie: {
            dropTypes: ['uncommon', 'rare'],
            keys: [
                'enemyDefinitions.zombie',
            ],
        },
    }

    function randomizeEnemyDrops(seed) {
        const rng = seedrandom(seed)
        const itemPool = Array.from(Object.keys(ITEM_IDS))
        const result = {}
        Object.entries(ENEMIES)
        .forEach(([enemyName, enemyInfo]) => {
            result[enemyName] = {}
            enemyInfo.dropTypes
            .forEach((dropTypeName) => {
                result[enemyName][dropTypeName] = common.shuffleArray(rng, itemPool).at(-1)
            })
        })
        return result
    }

    function getEnemyDropChanges(enemyDrops) {
        const enemyDropChanges = {}
        Object.entries(enemyDrops)
        .forEach(([enemyName, dropInfo]) => {
            Object.entries(dropInfo)
            .forEach(([dropKey, itemName]) => {
                ENEMIES[enemyName].keys
                .forEach((enemyKey) => {
                    enemyDropChanges[enemyKey + '.' + dropKey + 'ItemId='] = ITEM_IDS[itemName]
                })
            })
        })
        const result = Object.assign({}, TEMPLATE)
        result.changes.push({
            changeType: 'merge',
            merge: enemyDropChanges,
        })
        return result
    }

    const exports = {
        getEnemyDropChanges: getEnemyDropChanges,
        randomizeEnemyDrops: randomizeEnemyDrops,
    }
    if (self) {
        self.sotnShuffler = Object.assign(self.sotnShuffler || {}, {
            enemyDropRandomizer: exports,
        })
    } else {
        module.exports = exports
    }
})(typeof (self) !== 'undefined' ? self : null)
