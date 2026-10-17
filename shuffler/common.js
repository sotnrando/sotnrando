(function (self) {

    // NOTE(sestren): self.sotnShuffler can't be assigned at the start

    // The following costs are referenced in LOGIC and ROOMS_INFO and denote how long a particular action takes (in seconds)
    // TODO(sestren): Replace each reference to COST_UNKNOWN with its own value that is more accurate to real gameplay
    const COST_PICKUP_ITEM = 1.0
    const COST_PICKUP_RELIC = 3.0
    const COST_QUICKGRAB_RELIC = 2.5
    const COST_UNKNOWN = 2.0
    const DISTANCE_TILE = 16
    // NOTE(sestren): Travelling through vertical screen transitions has to account for the top and bottom "gutters" and a small shift
    const DISTANCE_VERTICAL_SCREEN_TRANSITION = 44
    const DISTANCE_JUMP_FULL = 72
    const DISTANCE_JUMP = 4 * DISTANCE_TILE // Rounded down to account for suboptimal player inputs
    const DISTANCE_SECOND_JUMP = 55
    const DISTANCE_DOUBLE_JUMP = DISTANCE_JUMP + DISTANCE_SECOND_JUMP
    const DISTANCE_DOUBLE_JUMP_PRECISE = DISTANCE_JUMP_FULL + DISTANCE_SECOND_JUMP
    const DISTANCE_GRAVITY_JUMP = 24 * DISTANCE_TILE // Rounded down to 384 from 387
    // NOTE(sestren): Hitting the top of the camera as it scrolls upward during a gravity jump results in a much shorter height gain
    const DISTANCE_GRAVITY_JUMP_HINDERED = 18 * DISTANCE_TILE // Rounded down to 288 from 291

    const LOGIC = {
        locations: {
            locationBatCard: {
                outcome: {
                    positionX: 120,
                    positionY: 147,
                    locationBatCard: true,
                },
                requirements: [
                    {
                        stage: 'alchemyLaboratory',
                        room: 'batCardRoom',
                        locationBatCard: false,
                    },
                ],
            },
            locationCubeOfZoe: {
                outcome: {
                    positionX: 272,
                    positionY: 114,
                    locationCubeOfZoe: true,
                },
                requirements: [
                    {
                        stage: 'castleEntrance',
                        room: 'cubeOfZoeRoom',
                        locationCubeOfZoe: false,
                    },
                ],
            },
            locationDemonCard: {
                outcome: {
                    positionX: 88,
                    positionY: 185,
                    locationDemonCard: true,
                },
                requirements: [
                    {
                        stage: 'abandonedMine',
                        room: 'demonCard',
                        locationDemonCard: false,
                    },
                ],
            },
            locationEchoOfBat: {
                outcome: {
                    positionX: 128,
                    positionY: 148,
                    locationEchoOfBat: true,
                },
                requirements: [
                    {
                        stage: 'olroxsQuarters',
                        room: 'echoOfBatRoom',
                        locationEchoOfBat: false,
                    },
                ],
            },
            locationFaerieCard: {
                outcome: {
                    positionX: 48,
                    positionY: 177,
                    locationFaerieCard: true,
                },
                requirements: [
                    {
                        stage: 'longLibrary',
                        room: 'faerieCardRoom',
                        locationFaerieCard: false,
                    },
                ],
            },
            locationFaerieScroll: {
                outcome: {
                    positionX: 1680,
                    positionY: 176,
                    locationFaerieScroll: true,
                },
                requirements: [
                    {
                        stage: 'longLibrary',
                        room: 'spellbookArea',
                        locationFaerieScroll: false,
                    },
                ],
            },
            locationFireOfBat: {
                outcome: {
                    positionX: 200,
                    positionY: 196,
                    locationFireOfBat: true,
                },
                requirements: [
                    {
                        stage: 'clockTower',
                        room: 'fireOfBatRoom',
                        locationFireOfBat: false,
                    },
                ],
            },
            locationForceOfEcho: {
                outcome: {
                    positionX: 112,
                    positionY: 128,
                    locationForceOfEcho: true,
                },
                requirements: [
                    {
                        stage: 'reverseCaverns',
                        room: 'holySymbolRoom',
                        locationForceOfEcho: false,
                    },
                ],
            },
            locationFormOfMist: {
                outcome: {
                    positionX: 232,
                    positionY: 144,
                    locationFormOfMist: true,
                },
                requirements: [
                    {
                        stage: 'colosseum',
                        room: 'topOfElevatorShaft',
                        locationFormOfMist: false,
                    },
                ],
            },
            locationGasCloud: {
                outcome: {
                    positionX: 32,
                    positionY: 128,
                    locationGasCloud: true,
                },
                requirements: [
                    {
                        stage: 'floatingCatacombs',
                        room: 'mormegilRoom',
                        locationGasCloud: false,
                    },
                ],
            },
            locationGhostCard: {
                outcome: {
                    positionX: 352,
                    positionY: 672,
                    locationGhostCard: true,
                },
                requirements: [
                    {
                        stage: 'castleKeep',
                        room: 'ghostCardRoom',
                        locationGhostCard: false,
                    },
                ],
            },
            locationGoldRing: {
                outcome: {
                    positionX: 128,
                    positionY: 128,
                    locationGoldRing: true,
                },
                requirements: [
                    {
                        stage: 'undergroundCaverns',
                        room: 'falseSaveRoom',
                        locationGoldRing: false,
                        statusSuccubusDefeated: true,
                    },
                ],
            },
            locationGravityBoots: {
                outcome: {
                    positionX: 1168,
                    positionY: 176,
                    locationGravityBoots: true,
                },
                requirements: [
                    {
                        stage: 'marbleGallery',
                        room: 'gravityBootsRoom',
                        locationGravityBoots: false,
                    },
                ],
            },
            locationHolySymbol: {
                outcome: {
                    positionX: 144,
                    positionY: 180,
                    locationHolySymbol: true,
                },
                requirements: [
                    {
                        stage: 'undergroundCaverns',
                        room: 'holySymbolRoom',
                        locationHolySymbol: false,
                    },
                ],
            },
            locationJewelOfOpen: {
                outcome: {
                    positionX: 128,
                    positionY: 128,
                    locationJewelOfOpen: true,
                },
                requirements: [
                    {
                        stage: 'longLibrary',
                        room: 'shop',
                        locationJewelOfOpen: false,
                        progressionItemMaterialization: true,
                    },
                ],
            },
            locationLeapStone: {
                outcome: {
                    positionX: 416,
                    positionY: 1824,
                    locationLeapStone: true,
                },
                requirements: [
                    {
                        stage: 'castleKeep',
                        room: 'keepArea',
                        locationLeapStone: false,
                    },
                ],
            },
            locationMermanStatue: {
                outcome: {
                    positionX: 96,
                    positionY: 176,
                    locationMermanStatue: true,
                },
                requirements: [
                    {
                        stage: 'undergroundCaverns',
                        room: 'mermanStatueRoom',
                        locationMermanStatue: false,
                    },
                ],
            },
            locationPowerOfMist: {
                outcome: {
                    positionX: 412,
                    positionY: 1220,
                    locationPowerOfMist: true,
                },
                requirements: [
                    {
                        stage: 'castleKeep',
                        room: 'keepArea',
                        locationPowerOfMist: false,
                    },
                ],
            },
            locationPowerOfWolf: {
                outcome: {
                    positionX: 272,
                    positionY: 192,
                    locationPowerOfWolf: true,
                },
                requirements: [
                    {
                        stage: 'castleEntrance',
                        room: 'afterDrawbridge',
                        locationPowerOfWolf: false,
                    },
                ],
            },
            locationSilverRing: {
                outcome: {
                    positionX: 180,
                    positionY: 164,
                    locationSilverRing: true,
                },
                requirements: [
                    {
                        stage: 'royalChapel',
                        room: 'silverRingRoom',
                        locationSilverRing: false,
                    },
                ],
            },
            locationSkillOfWolf: {
                outcome: {
                    positionX: 128,
                    positionY: 128,
                    locationSkillOfWolf: true,
                },
                requirements: [
                    {
                        stage: 'alchemyLaboratory',
                        room: 'skillOfWolfRoom',
                        locationSkillOfWolf: false,
                    },
                ],
            },
            locationSoulOfBat: {
                outcome: {
                    positionX: 1056,
                    positionY: 928,
                    locationSoulOfBat: true,
                },
                requirements: [
                    {
                        stage: 'longLibrary',
                        room: 'lesserDemonArea',
                        locationSoulOfBat: false,
                    },
                ],
            },
            locationSoulOfWolf: {
                outcome: {
                    positionX: 392,
                    positionY: 808,
                    locationSoulOfWolf: true,
                },
                requirements: [
                    {
                        stage: 'outerWall',
                        room: 'elevatorShaftRoom',
                        locationSoulOfWolf: false,
                    },
                ],
            },
            locationSpikeBreaker: {
                outcome: {
                    positionX: 47,
                    positionY: 153,
                    locationSpikeBreaker: true,
                },
                requirements: [
                    {
                        stage: 'catacombs',
                        room: 'spikeBreakerRoom',
                        locationSpikeBreaker: false,
                    },
                ],
            },
            locationSpiritOrb: {
                outcome: {
                    positionX: 128,
                    positionY: 1008,
                    locationSpiritOrb: true,
                },
                requirements: [
                    {
                        stage: 'marbleGallery',
                        room: 'spiritOrbRoom',
                        locationSpiritOrb: false,
                    },
                ],
            },
            locationSwordCard: {
                outcome: {
                    positionX: 368,
                    positionY: 148,
                    locationSwordCard: true,
                },
                requirements: [
                    {
                        stage: 'olroxsQuarters',
                        room: 'swordCardRoom',
                        locationSwordCard: false,
                    },
                ],
            },
        },
        rewards: {
            relicSoulOfBat: {
                outcome: {
                    relicSoulOfBat: true,
                    progressionBatTransformation: true,
                    progressionMidAirReset: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicSoulOfBat: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicSoulOfBat: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicFireOfBat: {
                outcome: {
                    relicFireOfBat: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicFireOfBat: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicFireOfBat: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicEchoOfBat: {
                outcome: {
                    relicEchoOfBat: true,
                    progressionEcholocation: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicEchoOfBat: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicEchoOfBat: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicForceOfEcho: {
                outcome: {
                    relicForceOfEcho: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicForceOfEcho: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicForceOfEcho: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicSoulOfWolf: {
                outcome: {
                    relicSoulOfWolf: true,
                    progressionMidAirReset: true,
                    progressionWolfTransformation: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicSoulOfWolf: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicSoulOfWolf: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicPowerOfWolf: {
                outcome: {
                    progressionFasterWolfRunSpeed: true,
                    relicPowerOfWolf: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicPowerOfWolf: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicPowerOfWolf: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicSkillOfWolf: {
                outcome: {
                    relicSkillOfWolf: true,
                    progressionWolfChargeAttack: true,
                    progressionWolfSwimMovement: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicSkillOfWolf: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicSkillOfWolf: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicFormOfMist: {
                outcome: {
                    relicFormOfMist: true,
                    progressionMidAirReset: true,
                    progressionMistTransformation: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicFormOfMist: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicFormOfMist: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicPowerOfMist: {
                outcome: {
                    relicPowerOfMist: true,
                    progressionLongerMistDuration: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicPowerOfMist: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicPowerOfMist: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicGasCloud: {
                outcome: {
                    relicGasCloud: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicGasCloud: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicGasCloud: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicCubeOfZoe: {
                outcome: {
                    progressionItemMaterialization: true,
                    relicCubeOfZoe: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicCubeOfZoe: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicCubeOfZoe: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicSpiritOrb: {
                outcome: {
                    relicSpiritOrb: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicSpiritOrb: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicSpiritOrb: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicGravityBoots: {
                outcome: {
                    relicGravityBoots: true,
                    progressionGravityJump: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicGravityBoots: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicGravityBoots: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicLeapStone: {
                outcome: {
                    relicLeapStone: true,
                    progressionDoubleJump: true,
                    progressionMidAirReset: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicLeapStone: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicLeapStone: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicHolySymbol: {
                outcome: {
                    relicHolySymbol: true,
                    progressionProtectionFromWater: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicHolySymbol: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicHolySymbol: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicFaerieScroll: {
                outcome: {
                    relicFaerieScroll: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicFaerieScroll: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicFaerieScroll: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicJewelOfOpen: {
                outcome: {
                    relicJewelOfOpen: true,
                    progressionUnlockBlueDoors: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicJewelOfOpen: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicJewelOfOpen: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicMermanStatue: {
                outcome: {
                    relicMermanStatue: true,
                    progressionSummonFerryman: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicMermanStatue: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicMermanStatue: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicBatCard: {
                outcome: {
                    relicBatCard: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicBatCard: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicBatCard: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicGhostCard: {
                outcome: {
                    relicGhostCard: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicGhostCard: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicGhostCard: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicFaerieCard: {
                outcome: {
                    relicFaerieCard: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicFaerieCard: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicFaerieCard: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicDemonCard: {
                outcome: {
                    relicDemonCard: true,
                    progressionSummonDemonFamiliar: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicDemonCard: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicDemonCard: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicSwordCard: {
                outcome: {
                    relicSwordCard: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicSwordCard: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicSwordCard: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicSpriteCard: {
                outcome: {
                    relicSpriteCard: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicSpriteCard: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicSpriteCard: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicNosedevilCard: {
                outcome: {
                    relicNosedevilCard: true,
                    progressionSummonDemonFamiliar: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicNosedevilCard: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicNosedevilCard: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicHeartOfVlad: {
                outcome: {
                    relicHeartOfVlad: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicHeartOfVlad: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicHeartOfVlad: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicToothOfVlad: {
                outcome: {
                    relicToothOfVlad: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicToothOfVlad: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicToothOfVlad: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicRibOfVlad: {
                outcome: {
                    relicRibOfVlad: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicRibOfVlad: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicRibOfVlad: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicRingOfVlad: {
                outcome: {
                    relicRingOfVlad: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicRingOfVlad: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicRingOfVlad: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            relicEyeOfVlad: {
                outcome: {
                    relicEyeOfVlad: true,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        relicEyeOfVlad: false,
                        costs: {
                            time: COST_PICKUP_RELIC,
                        },
                    },
                    {
                        progressionRewardTracking: true,
                        relicEyeOfVlad: false,
                        techniqueQuickGrab: true,
                        costs: {
                            time: COST_QUICKGRAB_RELIC,
                        },
                    },
                ],
            },
            itemSpikeBreaker: {
                outcome: {
                    itemSpikeBreaker: 1,
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        costs: {
                            time: COST_PICKUP_ITEM,
                        },
                    },
                ],
            },
            itemGoldRing: {
                outcome: {
                    itemInscribedRing: {
                        operation: 'add',
                        value: 1,
                    },
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        costs: {
                            time: COST_PICKUP_ITEM,
                        },
                    },
                ],
            },
            itemSilverRing: {
                outcome: {
                    itemInscribedRing: {
                        operation: 'add',
                        value: 1,
                    },
                },
                requirements: [
                    {
                        progressionRewardTracking: true,
                        costs: {
                            time: COST_PICKUP_ITEM,
                        },
                    },
                ],
            },
        },
    }

    const NODES = {
        abandonedMine: {
            locationDemonCard: {
                nodeType: 'check',
                requirement: {
                    locationDemonCard: true,
                },
            },
            loadingRoomToCatacombs: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToCatacombs',
                    section: 'main',
                },
            },
            loadingRoomToWarpRooms: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToWarpRooms',
                    section: 'main',
                },
            },
            loadingRoomToUndergroundCaverns: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToUndergroundCaverns',
                    section: 'main',
                },
            },
        },
        alchemyLaboratory: {
            statusCannonActivated: {
                nodeType: 'action',
                requirement: {
                    statusCannonActivated: true,
                },
            },
            locationBatCard: {
                nodeType: 'check',
                requirement: {
                    locationBatCard: true,
                },
            },
            locationSkillOfWolf: {
                nodeType: 'check',
                requirement: {
                    locationSkillOfWolf: true,
                },
            },
            loadingRoomToMarbleGallery: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToMarbleGallery',
                    section: 'main',
                },
            },
            loadingRoomToRoyalChapel: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToRoyalChapel',
                    section: 'main',
                },
            },
            loadingRoomToCastleEntrance: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToCastleEntrance',
                    section: 'main',
                },
            },
        },
        castleEntrance: {
            // start: {
            //     nodeType: 'UNKNOWN',
            //     requirement: {
            //         room: 'afterDrawbridge',
            //         section: 'main',
            //     },
            // },
            statusSecretWallInMermanRoomOpened: {
                nodeType: 'action',
                requirement: {
                    statusSecretWallInMermanRoomOpened: true,
                },
            },
            statusPassageFromCastleEntranceToMarbleGalleryOpened: {
                nodeType: 'action',
                requirement: {
                    statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                },
            },
            statusPassageFromCastleEntranceToUndergroundCavernsOpened: {
                nodeType: 'action',
                requirement: {
                    statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                },
            },
            statusPassageFromCastleEntranceToWarpRoomsOpened: {
                nodeType: 'action',
                requirement: {
                    statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                },
            },
            locationPowerOfWolf: {
                nodeType: 'check',
                requirement: {
                    locationPowerOfWolf: true,
                },
            },
            locationCubeOfZoe: {
                nodeType: 'check',
                requirement: {
                    locationCubeOfZoe: true,
                },
            },
            loadingRoomToMarbleGallery: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToMarbleGallery',
                    section: 'main',
                },
            },
            loadingRoomToWarpRooms: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToWarpRooms',
                    section: 'main',
                },
            },
            loadingRoomToAlchemyLaboratory: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToAlchemyLaboratory',
                    section: 'main',
                },
            },
            loadingRoomToUndergroundCaverns: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToUndergroundCaverns',
                    section: 'main',
                },
            },
        },
        castleKeep: {
            // {
            //     name: 'badEnding',
            //     nodeType: 'UNKNOWN',
            //     requirement: {
            //         room: 'keepArea',
            //         section: 'anteroom',
            //     },
            // },
            locationLeapStone: {
                nodeType: 'check',
                requirement: {
                    locationLeapStone: true,
                },
            },
            locationPowerOfMist: {
                nodeType: 'check',
                requirement: {
                    locationPowerOfMist: true,
                },
            },
            locationGhostCard: {
                nodeType: 'check',
                requirement: {
                    locationGhostCard: true,
                },
            },
            loadingRoomToClockTower: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToClockTower',
                    section: 'main',
                },
            },
            loadingRoomToWarpRooms: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToWarpRooms',
                    section: 'main',
                },
            },
            loadingRoomToRoyalChapel: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToRoyalChapel',
                    section: 'main',
                },
            },
        },
        catacombs: {
            locationSpikeBreaker: {
                nodeType: 'check',
                requirement: {
                    locationSpikeBreaker: true,
                },
            },
            loadingRoomToAbandonedMine: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToAbandonedMine',
                    section: 'main',
                },
            },
        },
        clockTower: {
            locationFireOfBat: {
                nodeType: 'check',
                requirement: {
                    locationFireOfBat: true,
                },
            },
            loadingRoomToCastleKeep: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToCastleKeep',
                    section: 'main',
                },
            },
            loadingRoomToOuterWall: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToOuterWall',
                    section: 'main',
                },
            },
        },
        colosseum: {
            statusBarrierInColosseumOpened: {
                nodeType: 'action',
                requirement: {
                    statusBarrierInColosseumOpened: true,
                },
            },
            locationFormOfMist: {
                nodeType: 'check',
                requirement: {
                    locationFormOfMist: true,
                },
            },
            loadingRoomToRoyalChapel: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToRoyalChapel',
                    section: 'main',
                },
            },
            loadingRoomToOlroxsQuarters: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToOlroxsQuarters',
                    section: 'main',
                },
            },
        },
        longLibrary: {
            locationSoulOfBat: {
                nodeType: 'check',
                requirement: {
                    locationSoulOfBat: true,
                },
            },
            locationJewelOfOpen: {
                nodeType: 'check',
                requirement: {
                    locationJewelOfOpen: true,
                },
            },
            locationFaerieCard: {
                nodeType: 'check',
                requirement: {
                    locationFaerieCard: true,
                },
            },
            locationFaerieScroll: {
                nodeType: 'check',
                requirement: {
                    locationFaerieScroll: true,
                },
            },
            loadingRoomToOuterWall: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToOuterWall',
                    section: 'main',
                },
            },
        },
        marbleGallery: {
            // {
            //     name: 'locationMarbleGalleryStopwatch',
            //     nodeType: 'UNKNOWN',
            //     requirement: {
            //         locationMarbleGalleryStopwatch: true,
            //     },
            // },
            // {
            //     name: 'clockRoom',
            //     nodeType: 'UNKNOWN',
            //     requirement: {
            //         room: 'clockRoom',
            //         section: 'main',
            //     },
            // },
            statusPressurePlateInMarbleGalleryActivated: {
                nodeType: 'action',
                requirement: {
                    statusPressurePlateInMarbleGalleryActivated: true,
                },
            },
            locationSpiritOrb: {
                nodeType: 'check',
                requirement: {
                    locationSpiritOrb: true,
                },
            },
            locationGravityBoots: {
                nodeType: 'check',
                requirement: {
                    locationGravityBoots: true,
                },
            },
            loadingRoomToOuterWall: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToOuterWall',
                    section: 'main',
                },
            },
            loadingRoomToUndergroundCaverns: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToUndergroundCaverns',
                    section: 'main',
                },
            },
            loadingRoomToAlchemyLaboratory: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToAlchemyLaboratory',
                    section: 'main',
                },
            },
            loadingRoomToOlroxsQuarters: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToOlroxsQuarters',
                    section: 'main',
                },
            },
            loadingRoomToCastleEntrance: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToCastleEntrance',
                    section: 'main',
                },
            },
        },
        olroxsQuarters: {
            locationEchoOfBat: {
                nodeType: 'check',
                requirement: {
                    locationEchoOfBat: true,
                },
            },
            locationSwordCard: {
                nodeType: 'check',
                requirement: {
                    locationSwordCard: true,
                },
            },
            loadingRoomToMarbleGallery: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToMarbleGallery',
                    section: 'main',
                },
            },
            loadingRoomToColosseum: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToColosseum',
                    section: 'main',
                },
            },
            loadingRoomToWarpRooms: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToWarpRooms',
                    section: 'main',
                },
            },
            loadingRoomToRoyalChapel: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToRoyalChapel',
                    section: 'main',
                },
            },
        },
        outerWall: {
            locationSoulOfWolf: {
                nodeType: 'check',
                requirement: {
                    locationSoulOfWolf: true,
                },
            },
            loadingRoomToWarpRooms: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToWarpRooms',
                    section: 'main',
                },
            },
            loadingRoomToClockTower: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToClockTower',
                    section: 'main',
                },
            },
            loadingRoomToLongLibrary: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToLongLibrary',
                    section: 'main',
                },
            },
            loadingRoomToMarbleGallery: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToMarbleGallery',
                    section: 'main',
                },
            },
        },
        royalChapel: {
            statusStatueInRoyalChapelMoved: {
                nodeType: 'action',
                requirement: {
                    statusStatueInRoyalChapelMoved: true,
                },
            },
            locationSilverRing: {
                nodeType: 'check',
                requirement: {
                    locationSilverRing: true,
                },
            },
            loadingRoomToCastleKeep: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToCastleKeep',
                    section: 'main',
                },
            },
            loadingRoomToAlchemyLaboratory: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToAlchemyLaboratory',
                    section: 'main',
                },
            },
            loadingRoomToColosseum: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToColosseum',
                    section: 'main',
                },
            },
            loadingRoomToOlroxsQuarters: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToOlroxsQuarters',
                    section: 'main',
                },
            },
        },
        undergroundCaverns: {
            statusButtonInUndergroundCavernsActivated: {
                nodeType: 'action',
                requirement: {
                    statusButtonInUndergroundCavernsActivated: true,
                },
            },
            statusBridgeInUndergroundCavernsBroken: {
                nodeType: 'action',
                requirement: {
                    statusBridgeInUndergroundCavernsBroken: true,
                },
            },
            locationHolySymbol: {
                nodeType: 'check',
                requirement: {
                    locationHolySymbol: true,
                },
            },
            locationMermanStatue: {
                nodeType: 'check',
                requirement: {
                    locationMermanStatue: true,
                },
            },
            locationGoldRing: {
                nodeType: 'check',
                requirement: {
                    locationGoldRing: true,
                },
            },
            loadingRoomToCastleEntrance: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToCastleEntrance',
                    section: 'main',
                },
            },
            loadingRoomToMarbleGallery: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToMarbleGallery',
                    section: 'main',
                },
            },
            loadingRoomToAbandonedMine: {
                nodeType: 'exit',
                requirement: {
                    room: 'loadingRoomToAbandonedMine',
                    section: 'main',
                },
            },
        },
        warpRooms: {
            loadingRoomToAbandonedMine: {
                nodeType: 'warp',
                requirement: {
                    room: 'loadingRoomToAbandonedMine',
                    section: 'main',
                },
                outcome: {
                    statusWarpRoomToAbandonedMineUnlocked: true,
                },
            },
            loadingRoomToCastleEntrance: {
                nodeType: 'warp',
                requirement: {
                    room: 'loadingRoomToCastleEntrance',
                    section: 'main',
                },
                outcome: {},
            },
            loadingRoomToOlroxsQuarters: {
                nodeType: 'warp',
                requirement: {
                    room: 'loadingRoomToOlroxsQuarters',
                    section: 'main',
                },
                outcome: {
                    statusWarpRoomToOlroxsQuartersUnlocked: true,
                },
            },
            loadingRoomToOuterWall: {
                nodeType: 'warp',
                requirement: {
                    room: 'loadingRoomToOuterWall',
                    section: 'main',
                },
                outcome: {
                    statusWarpRoomToOuterWallUnlocked: true,
                },
            },
            loadingRoomToCastleKeep: {
                nodeType: 'warp',
                requirement: {
                    room: 'loadingRoomToCastleKeep',
                    section: 'main',
                },
                outcome: {
                    statusWarpRoomToCastleKeepUnlocked: true,
                },
            },
        },
    }

    // In SOTN, it is possible when leaving a room that the player will overlap with more than one other room.
    // Of the rooms that the player overlaps, the first one that shows up in the priority list is the one they will be sent to.
    const ROOM_PRIORITY = {
        abandonedMine: [
            'wolfsHeadColumn',
            'wellLitSkullRoom',
            'cerberusRoom',
            'demonSwitch',
            'venusWeedRoom',
            'snakeColumn',
            'peanutsRoom',
            'fourWayIntersection',
            'lowerStairwell',
            'karmaCoinRoom',
            'bend',
            'demonCard',
            'loadingRoomToCatacombs',
            'loadingRoomToWarpRooms',
            'loadingRoomToUndergroundCaverns',
            'saveRoom',
            'triggerTeleporterToUndergroundCaverns',
            'triggerTeleporterToWarpRooms',
            'triggerTeleporterToCatacombs',
        ],
        alchemyLaboratory: [
            'batCardRoom',
            'exitToRoyalChapel',
            'blueDoorHallway',
            'bloodyZombieHallway',
            'cannonRoom',
            'clothCapeRoom',
            'sunglassesRoom',
            'glassVats',
            'skillOfWolfRoom',
            'heartMaxUpRoom',
            'entryway',
            'tallSpittleboneRoom',
            'emptyZigZagRoom',
            'shortZigZagRoom',
            'tallZigZagRoom',
            'secretLifeMaxUpRoom',
            'slograAndGaibonRoom',
            'boxPuzzleRoom',
            'redSkeletonLiftRoom',
            'tetrominoRoom',
            'exitToMarbleGallery',
            'corridorToElevator',
            'elevatorShaft',
            'saveRoomA',
            'saveRoomB',
            'saveRoomC',
            'loadingRoomToMarbleGallery',
            'loadingRoomToRoyalChapel',
            'loadingRoomToCastleEntrance',
            'triggerTeleporterToMarbleGallery',
            'triggerTeleporterToRoyalChapel',
            'triggerTeleporterToCastleEntrance',
        ],
        castleEntrance: [
            'afterDrawbridge',
            'dropUnderPortcullis',
            'zombieHallway',
            'holyMailRoom',
            'atticStaircase',
            'atticHallway',
            'atticEntrance',
            'mermanRoom',
            'jewelSwordRoom',
            'wargHallway',
            'shortcutToUndergroundCaverns',
            'meetingRoomWithDeath',
            'stairwellAfterDeath',
            'gargoyleRoom',
            'heartMaxUpRoom',
            'cubeOfZoeRoom',
            'shortcutToWarpRooms',
            'lifeMaxUpRoom',
            'loadingRoomToMarbleGallery',
            'loadingRoomToWarpRooms',
            'loadingRoomToAlchemyLaboratory',
            'loadingRoomToUndergroundCaverns',
            'saveRoomA',
            'saveRoomB',
            'saveRoomC',
            'triggerTeleporterToAlchemyLaboratory',
            'triggerTeleporterToMarbleGallery',
            'triggerTeleporterToWarpRooms',
            'triggerTeleporterToUndergroundCaverns',
        ],
        castleKeep: [
            'upperAttic',
            'lowerAttic',
            'keepArea',
            'ghostCardRoom',
            'bend',
            'falchionRoom',
            'lionTorchPlatform',
            'dualPlatforms',
            'tyrfingRoom',
            'saveRoomA',
            'loadingRoomToClockTower',
            'loadingRoomToWarpRooms',
            'loadingRoomToRoyalChapel',
            'triggerTeleporterToClockTower',
            'triggerTeleporterToRoyalChapel',
            'triggerTeleporterToWarpRooms',
        ],
        catacombs: [
            'roomId00',
            'mormegilRoom',
            'roomId02',
            'granfaloonsLair',
            'roomId04',
            'roomId05',
            'smallGremlinRoom',
            'saveRoomA',
            'walkArmorRoom',
            'icebrandRoom',
            'leftLavaPath',
            'ballroomMaskRoom',
            'rightLavaPath',
            'catEyeCircletRoom',
            'roomId14',
            'saveRoomB',
            'hellfireBeastRoom',
            'exitToAbandonedMine',
            'boneArkRoom',
            'roomId19',
            'roomId20',
            'roomId21',
            'roomId22',
            'roomId23',
            'pitchBlackSpikeMaze',
            'roomId25',
            'roomId26',
            'spikeBreakerRoom',
            'loadingRoomToAbandonedMine',
            'triggerTeleporterToAbandonedMine',
        ],
        clockTower: [
            'karasumansRoom',
            'pathToKarasuman',
            'healingMailRoom',
            'pendulumRoom',
            'spire',
            'hiddenArmory',
            'leftGearRoom',
            'rightGearRoom',
            'exitToCourtyard',
            'belfry',
            'openCourtyard',
            'stairwellToOuterWall',
            'fireOfBatRoom',
            'loadingRoomToOuterWall',
            'loadingRoomToCastleKeep',
            'triggerTeleporterToCastleKeep',
            'triggerTeleporterToOuterWall',
        ],
        colosseum: [
            'holySwordRoom',
            'topOfLeftSpiralStaircase',
            'bladeMasterRoom',
            'topOfRightSpiralStaircase',
            'passagewayBetweenArenaAndRoyalChapel',
            'arena',
            'topOfElevatorShaft',
            'spiralStaircases',
            'valhallaKnightRoom',
            'fountainRoom',
            'bloodCloakRoom',
            'bottomOfElevatorShaft',
            'leftSideArmory',
            'rightSideArmory',
            'loadingRoomToRoyalChapel',
            'loadingRoomToOlroxsQuarters',
            'saveRoomA',
            'saveRoomB',
            'triggerTeleporterToRoyalChapel',
            'triggerTeleporterToOlroxsQuarters',
        ],
        longLibrary: [
            'lesserDemonArea',
            'secretBookcaseRoom',
            'holyRodRoom',
            'dhuronAndFleaArmorRoom',
            'shop',
            'outsideShop',
            'fleaManRoom',
            'faerieCardRoom',
            'threeLayerRoom',
            'spellbookArea',
            'dhuronAndFleaManRoom',
            'footOfStaircase',
            'exitToOuterWall',
            'loadingRoomToOuterWall',
            'saveRoomA',
            'triggerTeleporterToOuterWall',
        ],
        marbleGallery: [
            'sShapedHallways',
            'tallStainedGlassWindows',
            'spiritOrbRoom',
            'stainedGlassCorner',
            'beneathDropoff',
            'dropoff',
            'entrance',
            'stopwatchRoom',
            'longHallway',
            'clockRoom',
            'leftOfClockRoom',
            'emptyRoom',
            'blueDoorRoom',
            'pathwayAfterLeftStatue',
            'pathwayAfterRightStatue',
            'ouijaTableStairway',
            'threePaths',
            'stairwellToUndergroundCaverns',
            'slingerStaircase',
            'rightOfClockRoom',
            'gravityBootsRoom',
            'elevatorRoom',
            'powerUpRoom',
            'beneathLeftTrapdoor',
            'beneathRightTrapdoor',
            'alucartRoom',
            'loadingRoomToOuterWall',
            'loadingRoomToUndergroundCaverns',
            'loadingRoomToAlchemyLaboratory',
            'loadingRoomToOlroxsQuarters',
            'loadingRoomToCastleEntrance',
            'saveRoomA',
            'saveRoomB',
            'triggerTeleporterToOlroxsQuarters',
            'triggerTeleporterToOuterWall',
            'triggerTeleporterToAlchemyLaboratory',
            'triggerTeleporterToUndergroundCaverns',
            'triggerTeleporterToCastleCenter',
            'triggerTeleporterToCastleEntrance',
        ],
        olroxsQuarters: [
            'skelerangRoom',
            'bottomOfStairwell',
            'grandStaircase',
            'secretOnyxRoom',
            'hammerAndBladeRoom',
            'emptyRoom',
            'tallShaft',
            'prison',
            'openCourtyard',
            'emptyCells',
            'garnetRoom',
            'narrowHallwayToOlrox',
            'olroxsRoom',
            'echoOfBatRoom',
            'swordCardRoom',
            'catwalkCrypt',
            'saveRoomA',
            'loadingRoomToMarbleGallery',
            'loadingRoomToColosseum',
            'loadingRoomToWarpRooms',
            'loadingRoomToRoyalChapel',
            'triggerTeleporterToRoyalChapel',
            'triggerTeleporterToWarpRooms',
            'triggerTeleporterToColosseum',
            'triggerTeleporterToMarbleGallery',
        ],
        outerWall: [
            'loadingRoomToWarpRooms',
            'topOfOuterWall',
            'exitToClockTower',
            'telescopeRoom',
            'lowerMedusaRoom',
            'jewelKnucklesRoom',
            'secretPlatformRoom',
            'exitToMarbleGallery',
            'garnetVaseRoom',
            'blueAxeKnightRoom',
            'garlicRoom',
            'doppelgangerRoom',
            'gladiusRoom',
            'elevatorShaftRoom',
            'saveRoomA',
            'loadingRoomToClockTower',
            'loadingRoomToLongLibrary',
            'saveRoomB',
            'loadingRoomToMarbleGallery',
            'triggerTeleporterToClockTower',
            'triggerTeleporterToWarpRooms',
            'triggerTeleporterToLongLibrary',
            'triggerTeleporterToMarbleGallery',
        ],
        royalChapel: [
            'silverRingRoom',
            'spikeHallway',
            'walkwayBetweenTowers',
            'walkwayLeftOfHippogryph',
            'hippogryphRoom',
            'walkwayRightOfHippogryph',
            'pushingStatueShortcut',
            'confessionalBooth',
            'gogglesRoom',
            'nave',
            'emptyRoom',
            'chapelStaircase',
            'statueLedge',
            'leftTower',
            'middleTower',
            'loadingRoomToCastleKeep',
            'saveRoomB',
            'rightTower',
            'saveRoomA',
            'loadingRoomToAlchemyLaboratory',
            'loadingRoomToColosseum',
            'loadingRoomToOlroxsQuarters',
            'triggerTeleporterToCastleKeep',
            'triggerTeleporterToOlroxsQuarters',
            'triggerTeleporterToColosseum',
            'triggerTeleporterToAlchemyLaboratory',
        ],
        undergroundCaverns: [
            'longDrop',
            'hiddenCrystalEntrance',
            'crystalBend',
            'tallStairwell',
            'plaqueRoomWithLifeMaxUp',
            'smallStairwell',
            'claymoreStairwell',
            'mealTicketsAndMoonstoneRoom',
            'plaqueRoomWithBreakableWall',
            'roomId09',
            'roomId10',
            'roomId11',
            'roomId12',
            'holySymbolRoom',
            'pentagramRoom',
            'dKBridge',
            'exitToAbandonedMine',
            'dKButton',
            'roomId18',
            'roomId19',
            'exitToCastleEntrance',
            'mermanStatueRoom',
            'iceFloeRoom',
            'rightFerrymanRoute',
            'crystalCloakRoom',
            'leftFerrymanRoute',
            'waterfall',
            'scyllaRoom',
            'scyllaWyrmRoom',
            'risingWaterRoom',
            'bandannaRoom',
            'loadingRoomToCastleEntrance',
            'loadingRoomToMarbleGallery',
            'loadingRoomToAbandonedMine',
            'saveRoomA',
            'saveRoomB',
            'saveRoomC',
            'falseSaveRoom',
            'triggerTeleporterToMarbleGallery',
            'triggerTeleporterToBossSuccubus',
            'triggerTeleporterToAbandonedMine',
            'triggerTeleporterToCastleEntrance',
        ],
        warpRooms: [
            'warpRoomToCastleKeep',
            'warpRoomToOlroxsQuarters',
            'warpRoomToOuterWall',
            'warpRoomToCastleEntrance',
            'warpRoomToAbandonedMine',
            'loadingRoomToAbandonedMine',
            'loadingRoomToCastleEntrance',
            'loadingRoomToOlroxsQuarters',
            'loadingRoomToOuterWall',
            'loadingRoomToCastleKeep',
            'triggerTeleporterToCastleKeep',
            'triggerTeleporterToOuterWall',
            'triggerTeleporterToOlroxsQuarters',
            'triggerTeleporterToCastleEntrance',
            'triggerTeleporterToAbandonedMine',
        ],
    }

    const ROOMS_INFO = {
        abandonedMine: {
            bend: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            cerberusRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            demonSwitch: {
                roomInfo: {
                    width: 256,
                    height: 1024,
                },
                regions: [
                    getRegion('behindDemonBlock', 240, 96, 16, 64),
                    getRegion('demonBlock', 208, 96, 32, 64),
                    getRegion('upperLeftLedge', 0, 64, 208, 144),
                    getRegion('zigZagLedges', 16, 208, 224, 336),
                    getRegion('crumblingStairwell', 16, 544, 208, 160),
                    getRegion('tinyLedges', 16, 704, 208, 144),
                    getRegion('main', 16, 848, 208, 176),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'upperLeftLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'behindDemonBlock', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 1024 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                        ],
                    },
                    toBehindDemonBlock: {
                        outcome: {
                            positionX: 248,
                            positionY: 128,
                            // section: behindDemonBlock,
                        },
                        requirements: [
                            getMovement('basic', 'demonBlock', COST_UNKNOWN),
                        ],
                    },
                    toDemonBlock: {
                        outcome: {
                            positionX: 224,
                            positionY: 128,
                            statusDemonSwitchActivated: true,
                            // section: demonBlock,
                        },
                        requirements: [
                            {
                                section: 'upperLeftLedge',
                                progressionSummonDemonFamiliar: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'behindDemonBlock',
                                progressionSummonDemonFamiliar: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'upperLeftLedge',
                                statusDemonSwitchActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'behindDemonBlock',
                                statusDemonSwitchActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toUpperLeftLedge: {
                        outcome: {
                            positionX: 24,
                            positionY: 128,
                            // section: upperLeftLedge,
                        },
                        requirements: [
                            getMovement('basic', 'demonBlock', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('batForm', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('doubleJump', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'zigZagLedges', COST_UNKNOWN),
                        ],
                    },
                    toZigZagLedges: {
                        outcome: {
                            positionX: 216,
                            positionY: 256,
                            // section: zigZagLedges,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            // getMovement('basicRisky', 'upperLeftLedge', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('doubleJump', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('poweredMist', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'upperLeftLedge', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('batForm', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('doubleJump', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('poweredMist', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'crumblingStairwell', COST_UNKNOWN),
                        ],
                    },
                    toCrumblingStairwell: {
                        outcome: {
                            positionX: 96,
                            positionY: 656,
                            statusStairwellInAbandonedMineDislodged: true,
                            // section: crumblingStairwell,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            // getMovement('basicRisky', 'zigZagLedges', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('batForm', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('doubleJump', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'zigZagLedges', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'zigZagLedges', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'tinyLedges', COST_UNKNOWN),
                            {
                                section: 'tinyLedges',
                                progressionDoubleJump: true,
                                statusStairwellInAbandonedMineDislodged: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            getMovement('batForm', 'tinyLedges', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'tinyLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'tinyLedges', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'tinyLedges', COST_UNKNOWN),
                        ],
                    },
                    toTinyLedges: {
                        outcome: {
                            positionX: 128,
                            positionY: 800,
                            // section: tinyLedges,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            // getMovement('basicRisky', 'crumblingStairwell', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('batForm', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('doubleJump', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('poweredMist', 'crumblingStairwell', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'crumblingStairwell', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 192,
                            positionY: 944,
                            // section: main,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            // getMovement('basicRisky', 'tinyLedges', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'tinyLedges', COST_UNKNOWN),
                            getMovement('batForm', 'tinyLedges', COST_UNKNOWN),
                            getMovement('doubleJump', 'tinyLedges', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'tinyLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'tinyLedges', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'tinyLedges', COST_UNKNOWN),
                        ],
                    },
                },
            },
            demonCard: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            fourWayIntersection: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 384,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 384,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            karmaCoinRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToCatacombs: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToUndergroundCaverns: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            lowerStairwell: {
                roomInfo: {
                    width: 256,
                    height: 1024,
                },
                regions: [
                    getRegion('layer0', 96, 0, 64, 96),
                    getRegion('layer1', 16, 96, 224, 240),
                    getRegion('layer2', 32, 336, 208, 176),
                    getRegion('layer3', 0, 512, 256, 224),
                    getRegion('main', 0, 736, 256, 288),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'layer0', COST_UNKNOWN),
                        ],
                    },
                    toLayer0: {
                        outcome: {
                            positionX: 128,
                            positionY: 48,
                            // section: layer0,
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'layer1', COST_UNKNOWN),
                            getMovement('batForm', 'layer1', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer1', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer1', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer1', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer1', COST_UNKNOWN),
                        ],
                    },
                    toLayer1: {
                        outcome: {
                            positionX: 32,
                            positionY: 144,
                            // section: layer1,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            getMovement('basicRisky', 'layer0', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'layer0', COST_UNKNOWN),
                            getMovement('batForm', 'layer0', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer0', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer0', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer0', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer0', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'layer2', COST_UNKNOWN),
                            getMovement('batForm', 'layer2', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer2', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer2', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer2', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer2', COST_UNKNOWN),
                        ],
                    },
                    toLayer2: {
                        outcome: {
                            positionX: 48,
                            positionY: 384,
                            // section: layer2,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            getMovement('basicRisky', 'layer1', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'layer1', COST_UNKNOWN),
                            getMovement('batForm', 'layer1', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer1', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer1', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer1', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer1', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'layer3', COST_UNKNOWN),
                            getMovement('batForm', 'layer3', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer3', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer3', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer3', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer3', COST_UNKNOWN),
                        ],
                    },
                    toLayer3: {
                        outcome: {
                            positionX: 24,
                            positionY: 640,
                            // section: layer3,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            getMovement('basicRisky', 'layer2', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'layer2', COST_UNKNOWN),
                            getMovement('batForm', 'layer2', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer2', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer2', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer2', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer2', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 16,
                            positionY: 896,
                            // section: main,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            getMovement('basicRisky', 'layer3', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'layer3', COST_UNKNOWN),
                            getMovement('batForm', 'layer3', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer3', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer3', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer3', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer3', COST_UNKNOWN),
                        ],
                    },
                },
            },
            peanutsRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            snakeColumn: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToCatacombs: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToUndergroundCaverns: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            venusWeedRoom: {
                roomInfo: {
                    width: 1024,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            wellLitSkullRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            wolfsHeadColumn: {
                roomInfo: {
                    width: 256,
                    height: 1024,
                },
                regions: [
                    getRegion('layer0', 176, 96, 80, 64),
                    getRegion('layer1', 16, 160, 208, 304),
                    getRegion('layer2', 32, 464, 96, 160),
                    getRegion('layer2', 32, 464, 208, 96),
                    getRegion('layer3', 16, 608, 240, 240),
                    getRegion('main', 32, 848, 224, 112),
                ],
                commands: {
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'layer0', COST_UNKNOWN),
                        ],
                    },
                    exitRightMiddle: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'layer3', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLayer0: {
                        outcome: {
                            positionX: 216,
                            positionY: 128,
                            // section: layer0,
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'layer1', COST_UNKNOWN),
                            getMovement('batForm', 'layer1', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer1', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer1', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer1', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer1', COST_UNKNOWN),
                        ],
                    },
                    toLayer1: {
                        outcome: {
                            positionX: 128,
                            positionY: 240,
                            // section: layer1,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            // getMovement('basicRisky', 'layer0', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'layer0', COST_UNKNOWN),
                            getMovement('batForm', 'layer0', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer0', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer0', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer0', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer0', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'layer2', COST_UNKNOWN),
                            getMovement('batForm', 'layer2', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer2', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer2', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer2', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer2', COST_UNKNOWN),
                        ],
                    },
                    toLayer2: {
                        outcome: {
                            positionX: 56,
                            positionY: 592,
                            // section: layer2,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            // getMovement('basicRisky', 'layer1', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'layer1', COST_UNKNOWN),
                            getMovement('batForm', 'layer1', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer1', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer1', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer1', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer1', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'layer3', COST_UNKNOWN),
                            getMovement('batForm', 'layer3', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer3', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer3', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer3', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer3', COST_UNKNOWN),
                        ],
                    },
                    toLayer3: {
                        outcome: {
                            positionX: 240,
                            positionY: 640,
                            // section: layer3,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            // getMovement('basicRisky', 'layer2', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'layer2', COST_UNKNOWN),
                            getMovement('batForm', 'layer2', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer2', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer2', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer2', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer2', COST_UNKNOWN),
                            // Moving upward
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 240,
                            positionY: 896,
                            // section: main,
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            // getMovement('basicRisky', 'layer3', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'layer3', COST_UNKNOWN),
                            getMovement('batForm', 'layer3', COST_UNKNOWN),
                            getMovement('doubleJump', 'layer3', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'layer3', COST_UNKNOWN),
                            getMovement('poweredMist', 'layer3', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'layer3', COST_UNKNOWN),
                        ],
                    },
                },
            },
        },
        alchemyLaboratory: {
            batCardRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            bloodyZombieHallway: {
                roomInfo: {
                    width: 1024,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            blueDoorHallway: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 240, 256),
                    getRegion('rightSide', 256, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'rightSide', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 24,
                            positionY: 128,
                            // section: main,
                        },
                        requirements: [
                            { // Jewel of Open
                                section: 'rightSide',
                                progressionUnlockBlueDoors: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toRightSide: {
                        outcome: {
                            positionX: 488,
                            positionY: 128,
                            // section: rightSide,
                        },
                        requirements: [
                            { // Jewel of Open
                                section: 'main',
                                progressionUnlockBlueDoors: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            boxPuzzleRoom: {
                roomInfo: {
                    width: 512,
                    height: 512,
                },
                regions: [
                    getRegion('upperRightLedge', 240, 0, 272, 336),
                    getRegion('main', 0, 0, 512, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toUpperRightLedge: {
                        outcome: {
                            positionX: 488,
                            positionY: 128,
                            // section: upperRightLedge,
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                            { // Solve Box Puzzle
                                section: 'main',
                                techniqueSolveBoxPuzzle: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 488,
                            positionY: 384,
                            // section: main,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                },
            },
            cannonRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 96, 256),
                    getRegion('rightSide', 112, 0, 144, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'rightSide', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 24,
                            positionY: 128,
                            statusCannonActivated: true,
                            // section: main,
                        },
                        requirements: [
                            { // Jewel of Open
                                section: 'rightSide',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toRightSide: {
                        outcome: {
                            positionX: 248,
                            positionY: 128,
                            // section: rightSide,
                        },
                        requirements: [
                            { // Cannon Activated
                                section: 'main',
                                statusCannonActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            clothCapeRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            corridorToElevator: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            elevatorShaft: {
                roomInfo: {
                    width: 256,
                    height: 1792,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 1792),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftMiddle: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 1664,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            emptyZigZagRoom: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            entryway: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 384,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            exitToMarbleGallery: {
                roomInfo: {
                    width: 512,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 768),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            exitToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            glassVats: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            heartMaxUpRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            redSkeletonLiftRoom: {
                roomInfo: {
                    width: 768,
                    height: 512,
                },
                regions: [
                    getRegion('upperRightLedge', 640, 96, 128, 64),
                    getRegion('main', 0, 0, 768, 512),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 640,
                            positionY: 512 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                    toUpperRightLedge: {
                        outcome: {
                            positionX: 736,
                            positionY: 128,
                            // section: upperRightLedge,
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                            { // Solve Red Skeleton Lift Puzzle
                                section: 'main',
                                techniqueSolveRedSkeletonLiftPuzzle: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 488,
                            positionY: 384,
                            // section: main,
                        },
                        requirements: [
                            getMovement('basic', 'holeInCeiling', COST_UNKNOWN),
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    toHoleInCeiling: {
                        outcome: {
                            positionX: 128,
                            positionY: 24,
                            // section: holeInCeiling,
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomB: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomC: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            secretLifeMaxUpRoom: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            shortZigZagRoom: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            skillOfWolfRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            slograAndGaibonRoom: {
                roomInfo: {
                    width: 1024,
                    height: 512,
                },
                regions: [
                    getRegion('alcove', 800, 0, 224, 160),
                    getRegion('main', 0, 0, 1024, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'alcove', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toAlcove: {
                        outcome: {
                            positionX: 1008,
                            positionY: 128,
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 784,
                            positionY: 416,
                        },
                        requirements: [
                            getMovement('fall', 'alcove', COST_UNKNOWN),
                        ],
                    },
                },
            },
            sunglassesRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            tallSpittleboneRoom: {
                roomInfo: {
                    width: 256,
                    height: 1280,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 1280),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            tallZigZagRoom: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 768),
                ],
                commands: {
                    // TODO(sestren): Add breakable wall
                    // TODO(sestren): Add breakable floor
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 768 + 24,
                        },
                        requirements: [
                            getMovement('fall', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            tetrominoRoom: {
                roomInfo: {
                    width: 512,
                    height: 768,
                },
                regions: [
                    getRegion('batCardRoomDuplicate', 0, 0, 288, 512),
                    getRegion('main', 0, 0, 512, 768),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'batCardRoomDuplicate', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightMiddle: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
        },
        castleEntrance: {
            afterDrawbridge: {
                roomInfo: {
                    width: 512,
                    height: 768,
                },
                regions: [
                    getRegion('beneathTrapdoor', 112, 688, 32, 64),
                    getRegion('main', 96, 608, 416, 64),
                    getRegion('parapet', 192, 112, 192, 96),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', 4.999),
                        ],
                    },
                    // exitRightWithReverseShiftLine: {
                    //     outcome: {
                    //         positionX: 512 + 256 + 8,
                    //         positionY: 640,
                    //     },
                    //     requirements: [
                    //         { // Reverse Shift Line using Heart Refresh
                    //             section: 'main',
                    //             techniqueReverseShiftLineUsingHeartRefresh: true,
                    //             costs: {
                    //                 time: 9.999,
                    //                 itemHeartRefresh: 1
                    //             },
                    //         },
                    //         { // Reverse Shift Line using Heart Refresh and Duplicator
                    //             section: 'main',
                    //             techniqueReverseShiftLineUsingHeartRefresh: true,
                    //             costs: {
                    //                 time: 9.999,
                    //             },
                    //             itemHeartRefresh: {
                    //                 minimum: 1,
                    //             },
                    //             itemDuplicator: {
                    //                 minimum: 1,
                    //             },
                    //         },
                    //     ],
                    // },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 768 + 24,
                        },
                        requirements: [
                            getMovement('fall', 'beneathTrapdoor', COST_UNKNOWN),
                        ],
                    },
                    fromBeneathTrapdoorToMain: {
                        outcome: {
                            positionX: 160,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('doubleJump', 'beneathTrapdoor', 0.7),
                        ],
                    },
                    toParapet: {
                        outcome: {
                            positionX: 288,
                            positionY: 160,
                        },
                        requirements: [
                            getMovement('batForm', 'main', 7.5),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', 10.5),
                        ],
                    },
                    toBeneathTrapdoor: {
                        outcome: {
                            positionX: 128,
                            positionY: 720,
                        },
                        requirements: [
                            { // Normal Movement with Trapdoor opened
                                section: 'main',
                                statusTrapdoorAfterDrawbridgeOpened: true,
                                costs: {
                                    time: 0.5,
                                },
                            },
                        ],
                    },
                    fromParapetToMain: {
                        outcome: {
                            positionX: 304,
                            positionY: 640,
                            // section: main,
                        },
                        requirements: [
                            getMovement('fall', 'parapet', 1.7),
                        ],
                    },
                },
            },
            dropUnderPortcullis: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('top', 112, 16, 32, 48),
                    getRegion('main', 208, 352, 48, 64),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 56, // TODO(sestren): Add velocityY
                        },
                        requirements: [
                            getMovement('jump', 'upperLedge', 0.7),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 240,
                            positionY: 384,
                            // section: main,
                        },
                        requirements: [
                            getMovement('fall', 'upperLedge', COST_UNKNOWN),
                        ],
                    },
                    toUpperLedge: {
                        outcome: {
                            positionX: 128,
                            positionY: 32,
                            // section: upperLedge,
                        },
                        requirements: [
                            getMovement('doubleJump', 'beneathTrapdoor', COST_UNKNOWN),
                        ],
                    },
                },
            },
            zombieHallway: {
                roomInfo: {
                    width: 1792,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1792, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1792 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            holyMailRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('ledge', 48, 48, 64, 48),
                    getRegion('main', 48, 96, 208, 112),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLedge: {
                        outcome: {
                            positionX: 80,
                            positionY: 72,
                            // section: ledge,
                        },
                        requirements: [
                            getMovement('bladeDash', 'main', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                            { // Precise Corner Mist
                                section: 'main',
                                progressionMistTransformation: true,
                                techniquePreciseCornerMist: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 232,
                            positionY: 128,
                            // section: main,
                        },
                        requirements: [
                            getMovement('fall', 'ledge', COST_UNKNOWN),
                        ],
                    },
                },
            },
            atticStaircase: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            atticHallway: {
                roomInfo: {
                    width: 1024,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            atticEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: -8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                            // statusTookLogicalRisk: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            mermanRoom: {
                roomInfo: {
                    width: 768,
                    height: 512,
                },
                regions: [
                    getRegion('holeInCeiling', 96, 16, 64, 32),
                    getRegion('secretPassage', 0, 352, 16, 64),
                    getRegion('main', 0, 48, 768, 368),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 56, // TODO(sestren): Add velocityY
                        },
                        requirements: [
                            getMovement('batForm', 'holeInCeiling', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'holeInCeiling', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'holeInCeiling', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'holeInCeiling', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'secretPassage', COST_UNKNOWN),
                        ],
                    },
                    openSecretPassage: {
                        outcome: {
                            statusSecretWallInMermanRoomOpened: true,
                        },
                        requirements: [
                            {
                                section: 'main',
                                progressionBatTransformation: true,
                                progressionWolfTransformation: true,
                                // statusSecretWallInMermanRoomOpened: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    fromMainToSecretPassage: {
                        outcome: {
                            positionX: 8,
                            positionY: 384,
                            // section: secretPassage,
                        },
                        requirements: [
                            { // After Opening Secret Passage
                                section: 'main',
                                statusSecretWallInMermanRoomOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    fromSecretPassageToMain: {
                        outcome: {
                            positionX: 64,
                            positionY: 384,
                            // section: main,
                        },
                        requirements: [
                            { // After Opening Secret Passage
                                section: 'secretPassage',
                                statusSecretWallInMermanRoomOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    fromMainToHoleInCeiling: {
                        outcome: {
                            positionX: 112,
                            positionY: 176,
                            // section: holeInCeiling,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    fromHoleInCeilingToMain: {
                        outcome: {
                            positionX: 112,
                            positionY: 176,
                            // section: main,
                        },
                        requirements: [
                            getMovement('fall', 'holeInCeiling', COST_UNKNOWN),
                        ],
                    },
                },
            },
            jewelSwordRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 32, 64, 224, 160),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            wargHallway: {
                roomInfo: {
                    width: 1536,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 48, 1536, 176),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1536 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            shortcutToUndergroundCaverns: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 96, 96, 64),
                    getRegion('rightSide', 112, 64, 144, 144),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'rightSide', COST_UNKNOWN),
                        ],
                    },
                    toRightSide: {
                        outcome: {
                            positionX: 80,
                            positionY: 128,
                            // section: rightSide,
                        },
                        requirements: [
                            { // After Opening Path
                                section: 'main',
                                statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 224,
                            positionY: 128,
                            statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                            // section: main,
                        },
                        requirements: [
                            { // Opening Path
                                section: 'rightSide',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            meetingRoomWithDeath: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('highInTheAir', 32, 16, 192, 64),
                    getRegion('upperLeftLedge', 0, 96, 64, 64),
                    getRegion('main', 0, 352, 256, 128),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 56, // TODO(sestren): Add velocityY
                        },
                        requirements: [
                            getMovement('batForm', 'highIntheAir', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'highIntheAir', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'highIntheAir', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'highIntheAir', COST_UNKNOWN),
                        ],
                    },
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                            statusMetDeathInCastleEntrance: true,
                        },
                        requirements: [
                            getMovement('basic', 'upperLeftLedge', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                            statusMetDeathInCastleEntrance: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                            statusMetDeathInCastleEntrance: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toHighInTheAir: {
                        outcome: {
                            positionX: 128,
                            positionY: 48,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('chainedRisingUppercuts', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('chainedRisingUppercuts', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseLong', 'upperLeftLedge', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 128,
                            positionY: 448,
                        },
                        requirements: [
                            getMovement('basic', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('basic', 'highInTheAir', COST_UNKNOWN),
                        ],
                    },
                    toUpperLeftLedge: {
                        outcome: {
                            positionX: 32,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('fall', 'highInTheAir', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('chainedRisingUppercuts', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseLong', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            stairwellAfterDeath: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 768),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            gargoyleRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 96, 256, 64),
                    getRegion('pit', 32, 176, 192, 64),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('fall', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toPit: {
                        outcome: {
                            positionX: 128,
                            positionY: 224,
                        },
                        requirements: [
                            getMovement('fall', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 128,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('chainedRisingUppercuts', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'pit', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'pit', COST_UNKNOWN),
                        ],
                    },
                },
            },
            heartMaxUpRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            cubeOfZoeRoom: {
                roomInfo: {
                    width: 512,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 304, 672),
                    getRegion('main', 304, 544, 208, 144),
                    getRegion('upperRightLedge', 432, 96, 80, 64),
                    getRegion('middleRightLedge', 464, 352, 48, 64),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitLeftMiddle: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightMiddle: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'middleRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toUpperRightLedge: {
                        outcome: {
                            positionX: 480,
                            positionY: 128,
                            // section: upperRightLedge,
                        },
                        requirements: [
                            getMovement('chainedRisingUppercuts', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                            { // Main - Using Shortcut
                                section: 'main',
                                statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMiddleRightLedge: {
                        outcome: {
                            positionX: 488,
                            positionY: 384,
                            // section: middleRightLedge,
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                            { // Main - Candle Dive Kick (Forgiving)
                                section: 'main',
                                progressionDoubleJump: true,
                                techniqueForgivingCandleDiveKick: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            { // Upper Right Ledge - Fall and Well-Timed Double Jump
                                section: 'upperRightLedge',
                                progressionDoubleJump: true,
                                statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            { // Upper Right Ledge - Precise Fall and Precise Jump Using Shortcut
                                section: 'upperRightLedge',
                                techniquePreciseJump: true,
                                statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 480,
                            positionY: 640,
                            // section: main,
                        },
                        requirements: [
                            getMovement('fall', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('fall', 'middleRightLedge', COST_UNKNOWN),
                        ],
                    },
                    openShortcut: {
                        outcome: {
                            statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                        },
                        requirements: [
                            {
                                section: 'upperRightLedge',
                                // statusPassageFromCastleEntranceToMarbleGalleryOpened: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            shortcutToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 128, 256),
                    getRegion('rightSide', 144, 0, 112, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toRightSide: {
                        outcome: {
                            positionX: 224,
                            positionY: 128,
                            // section: rightSide,
                        },
                        requirements: [
                            { // Opening Path
                                section: 'main',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 80,
                            positionY: 128,
                            // section: main,
                        },
                        requirements: [
                            { // After Opening Path
                                section: 'rightSide',
                                statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    openShortcut: {
                        outcome: {
                            statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                        },
                        requirements: [
                            { // After Opening Path
                                section: 'main',
                                // statusPassageFromCastleEntranceToWarpRoomsOpened: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            lifeMaxUpRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToAlchemyLaboratory: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToUndergroundCaverns: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomB: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomC: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToAlchemyLaboratory: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToUndergroundCaverns: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
        },
        castleKeep: {
            bend: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 176,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            dualPlatforms: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('holeInCeiling', 16, 0, 64, 64),
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 48,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'holeInCeiling', COST_UNKNOWN),
                        ],
                    },
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toHoleInCeiling: {
                        outcome: {
                            positionX: 48,
                            positionY: 32,
                            // section: holeInCeiling,
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 48,
                            positionY: 32,
                            // section: main,
                        },
                        requirements: [
                            getMovement('basic', 'holeInCeiling', COST_UNKNOWN),
                        ],
                    },
                },
            },
            falchionRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            ghostCardRoom: {
                roomInfo: {
                    width: 512,
                    height: 768,
                },
                regions: [
                    getRegion('upperLedges', 128, 352, 160, 96),
                    getRegion('rightWindow', 368, 352, 64, 64),
                    getRegion('leftPassage', 0, 352, 48, 64),
                    getRegion('lowerLedges', 48, 448, 320, 160),
                    getRegion('main', 48, 608, 320, 80),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toUpperLedges: {
                        outcome: {
                            positionX: 144,
                            positionY: 384,
                            // section: upperLedges,
                        },
                        requirements: [
                            getMovement('batForm', 'leftPassage', COST_UNKNOWN),
                            getMovement('doubleJump', 'leftPassage', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'leftPassage', COST_UNKNOWN),
                            getMovement('poweredMist', 'leftPassage', COST_UNKNOWN),
                            getMovement('batForm', 'rightWindow', COST_UNKNOWN),
                            getMovement('doubleJump', 'rightWindow', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'rightWindow', COST_UNKNOWN),
                            getMovement('poweredMist', 'rightWindow', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'lowerLedges', COST_UNKNOWN),
                            getMovement('batForm', 'lowerLedges', COST_UNKNOWN),
                            getMovement('doubleJump', 'lowerLedges', COST_UNKNOWN),
                            getMovement('gravityJump', 'lowerLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'lowerLedges', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'lowerLedges', COST_UNKNOWN),
                        ],
                    },
                    toRightWindow: {
                        outcome: {
                            positionX: 400,
                            positionY: 384,
                            // section: rightWindow,
                        },
                        requirements: [
                            getMovement('batForm', 'upperLedges', COST_UNKNOWN),
                            getMovement('doubleJump', 'upperLedges', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'upperLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'upperLedges', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'lowerLedges', COST_UNKNOWN),
                            getMovement('batForm', 'lowerLedges', COST_UNKNOWN),
                            getMovement('doubleJump', 'lowerLedges', COST_UNKNOWN),
                            getMovement('gravityJump', 'lowerLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'lowerLedges', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'lowerLedges', COST_UNKNOWN),
                        ],
                    },
                    toLeftPassage: {
                        outcome: {
                            positionX: 24,
                            positionY: 384,
                            // section: leftPassage,
                        },
                        requirements: [
                            getMovement('batForm', 'upperLedges', COST_UNKNOWN),
                            getMovement('doubleJump', 'upperLedges', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'upperLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'upperLedges', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'lowerLedges', COST_UNKNOWN),
                            getMovement('batForm', 'lowerLedges', COST_UNKNOWN),
                            getMovement('doubleJump', 'lowerLedges', COST_UNKNOWN),
                            getMovement('gravityJump', 'lowerLedges', COST_UNKNOWN),
                            getMovement('poweredMist', 'lowerLedges', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'lowerLedges', COST_UNKNOWN),
                        ],
                    },
                    toLowerLedges: {
                        outcome: {
                            positionX: 256,
                            positionY: 512,
                            // section: lowerLedges,
                        },
                        requirements: [
                            getMovement('basic', 'leftPassage', COST_UNKNOWN),
                            getMovement('basic', 'upperLedges', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 64,
                            positionY: 640,
                            // section: main,
                        },
                        requirements: [
                            getMovement('basic', 'leftPassage', COST_UNKNOWN),
                            getMovement('basic', 'rightWindow', COST_UNKNOWN),
                            getMovement('basic', 'upperLedges', COST_UNKNOWN),
                            getMovement('basic', 'lowerLedges', COST_UNKNOWN),
                        ],
                    },
                },
            },
            keepArea: {
                roomInfo: {
                    width: 2048,
                    height: 2048,
                },
                regions: [
                    getRegion('upperRightLedge', 1984, 352, 64, 64),
                    getRegion('teleporter', 272, 704, 96, 176),
                    getRegion('throneRoom', 768, 800, 256, 176),
                    getRegion('anteroom', 1040, 768, 560, 208),
                    getRegion('topOfStairs', 1632, 768, 64, 192),
                    getRegion('bottomOfStairs', 1840, 1056, 208, 128),
                    getRegion('powerOfMistLedge', 368, 1152, 320, 128),
                    getRegion('leapStoneLedge', 368, 1680, 64, 64),
                    getRegion('main', 400, 1744, 1648, 112),
                    getRegion('main', 1392, 1632, 656, 112),
                    getRegion('hallway', 0, 1888, 2048, 80),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 1432,
                            positionY: 784 - 24,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'topOfStairs', COST_UNKNOWN),
                            {
                                section: 'anteroom',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 1920,
                        },
                        requirements: [
                            getMovement('basic', 'hallway', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 2048 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRightMiddle: {
                        outcome: {
                            positionX: 2048 + 8,
                            positionY: 1152,
                        },
                        requirements: [
                            getMovement('basic', 'bottomOfStairs', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 2048 + 8,
                            positionY: 1664,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightHallway: {
                        outcome: {
                            positionX: 2048 + 8,
                            positionY: 1920,
                        },
                        requirements: [
                            getMovement('basic', 'hallway', COST_UNKNOWN),
                        ],
                    },
                    toUpperRightLedge: {
                        outcome: {
                            positionX: 2016,
                            positionY: 384,
                            // section: upperRightLedge,
                        },
                        requirements: [
                            getMovement('batForm', 'topOfStairs', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'topOfStairs', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'topOfStairs', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'topOfStairs', COST_UNKNOWN),
                            getMovement('batForm', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'bottomOfStairs', COST_UNKNOWN),
                        ],
                    },
                    toTeleporter: {
                        outcome: {
                            positionX: 320,
                            positionY: 848,
                            // section: teleporter,
                        },
                        requirements: [
                            {
                                section: 'throneRoom',
                                statusRichterSaved: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toThroneRoom: {
                        outcome: {
                            positionX: 896,
                            positionY: 944,
                            // section: throneRoom,
                        },
                        requirements: [
                            getMovement('basic', 'anteroom', COST_UNKNOWN),
                            {
                                section: 'teleporter',
                                statusRichterSaved: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toAnteroom: {
                        outcome: {
                            positionX: 1568,
                            positionY: 896,
                            // section: anteroom,
                        },
                        requirements: [
                            getMovement('basic', 'topOfStairs', COST_UNKNOWN),
                            {
                                section: 'throneRoom',
                                statusRichterSaved: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toTopOfStairs: {
                        outcome: {
                            positionX: 1648,
                            positionY: 896,
                            // section: topOfStairs,
                        },
                        requirements: [
                            getMovement('basic', 'anteroom', COST_UNKNOWN),
                            getMovement('batForm', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('batForm', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('batForm', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'bottomOfStairs', COST_UNKNOWN),
                        ],
                    },
                    toBottomOfStairs: {
                        outcome: {
                            positionX: 2032,
                            positionY: 1152,
                            // section: bottomOfStairs,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('batForm', 'topOfStairs', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'topOfStairs', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'topOfStairs', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'topOfStairs', COST_UNKNOWN),
                            getMovement('batForm', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    toPowerOfMistLedge: {
                        outcome: {
                            positionX: 416,
                            positionY: 1200,
                            // section: powerOfMistLedge,
                        },
                        requirements: [
                            getMovement('batForm', 'topOfStairs', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'topOfStairs', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'topOfStairs', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'topOfStairs', COST_UNKNOWN),
                            getMovement('batForm', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLeapStoneLedge: {
                        outcome: {
                            positionX: 400,
                            positionY: 1712,
                            // section: leapStoneLedge,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 2032,
                            positionY: 1664,
                            // section: main,
                        },
                        requirements: [
                            getMovement('basic', 'bottomOfStairs', COST_UNKNOWN),
                            getMovement('basic', 'leapStoneLedge', COST_UNKNOWN),
                            getMovement('basic', 'powerOfMistLedge', COST_UNKNOWN),
                            getMovement('basic', 'topOfStairs', COST_UNKNOWN),
                        ],
                    },
                },
            },
            lionTorchPlatform: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('holeInCeiling', 144, 0, 64, 80),
                    getRegion('main', 0, 80, 256, 368),
                    getRegion('holeInFloor', 32, 448, 32, 64),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 176,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'holeInCeiling', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 48,
                            positionY: 512 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'holeInFloor', COST_UNKNOWN),
                            getMovement('batForm', 'holeInFloor', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'holeInFloor', COST_UNKNOWN),
                        ],
                    },
                    toHoleInCeiling: {
                        outcome: {
                            positionX: 176,
                            positionY: 32,
                            // section: holeInCeiling,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 16,
                            positionY: 128,
                            // section: main,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'holeInFloor', COST_UNKNOWN),
                            getMovement('doubleJump', 'holeInFloor', COST_UNKNOWN),
                            getMovement('gravityJump', 'holeInFloor', COST_UNKNOWN),
                            getMovement('poweredMist', 'holeInFloor', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'holeInFloor', COST_UNKNOWN),
                        ],
                    },
                    toHoleInFloor: {
                        outcome: {
                            positionX: 48,
                            positionY: 480,
                            // section: holeInFloor,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToClockTower: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            lowerAttic: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 112,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 400,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToClockTower: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            tyrfingRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            upperAttic: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitBottom: {
                        outcome: {
                            positionX: 392,
                            positionY: 256,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
        },
        catacombs: {
            ballroomMaskRoom: {
                roomInfo: {
                    width: 512,
                    height: 512,
                },
                regions: [
                    getRegion('upperLedges', 0, 0, 512, 256),
                    getRegion('main', 0, 256, 512, 256),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'upperLedges', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 496,
                            positionY: 384,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('basicRisky', 'upperLedges', COST_UNKNOWN),
                            getMovement('batForm', 'upperLedges', COST_UNKNOWN),
                            getMovement('gravityJump', 'upperLedges', COST_UNKNOWN),
                        ],
                    },
                    toUpperLedges: {
                        outcome: {
                            positionX: 32,
                            positionY: 128,
                            // section: 'upperLedges',
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            boneArkRoom: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            catEyeCircletRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            exitToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            granfaloonsLair: {
                roomInfo: {
                    width: 512,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            hellfireBeastRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            icebrandRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            leftLavaPath: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            mormegilRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            pitchBlackSpikeMaze: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('leftSide', 0, 96, 48, 64),
                    getRegion('main', 48, 0, 592, 256),
                    getRegion('rightSide', 640, 80, 128, 80),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLeftSide: {
                        outcome: {
                            positionX: 24,
                            positionY: 128,
                            // section: leftSide,
                        },
                        requirements: [
                            {
                                section: 'main',
                                progressionBatTransformation: true,
                                progressionEcholocation: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionBatTransformation: true,
                                statusLightInSpikeMazeActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionDoubleJump: true,
                                itemSpikeBreaker: {
                                    minimum: 1,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionMistTransformation: true,
                                progressionLongerMistDuration: true,
                                itemSpikeBreaker: {
                                    minimum: 1,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionMistTransformation: true,
                                progressionLongerMistDuration: true,
                                statusLightInSpikeMazeActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMainFromRightSide: {
                        outcome: {
                            positionX: 384,
                            positionY: 176,
                            statusLightInSpikeMazeActivated: true,
                            // section: main,
                        },
                        requirements: [
                            {
                                section: 'rightSide',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMainFromLeftSide: {
                        outcome: {
                            positionX: 384,
                            positionY: 176,
                            // section: main,
                        },
                        requirements: [
                            {
                                section: 'leftSide',
                                progressionBatTransformation: true,
                                progressionEcholocation: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'leftSide',
                                progressionBatTransformation: true,
                                statusLightInSpikeMazeActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'leftSide',
                                progressionDoubleJump: true,
                                itemSpikeBreaker: {
                                    minimum: 1,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'leftSide',
                                progressionMistTransformation: true,
                                progressionLongerMistDuration: true,
                                itemSpikeBreaker: {
                                    minimum: 1,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'leftSide',
                                progressionMistTransformation: true,
                                progressionLongerMistDuration: true,
                                statusLightInSpikeMazeActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toRightSide: {
                        outcome: {
                            positionX: 752,
                            positionY: 128,
                            // section: rightSide,
                        },
                        requirements: [
                            {
                                section: 'main',
                                progressionBatTransformation: true,
                                progressionEcholocation: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionBatTransformation: true,
                                statusLightInSpikeMazeActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionDoubleJump: true,
                                itemSpikeBreaker: {
                                    minimum: 1,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionMistTransformation: true,
                                progressionLongerMistDuration: true,
                                itemSpikeBreaker: {
                                    minimum: 1,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionMistTransformation: true,
                                progressionLongerMistDuration: true,
                                statusLightInSpikeMazeActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            rightLavaPath: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId00: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId02: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId04: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId05: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId14: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId19: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId20: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId21: {
                roomInfo: {
                    width: 512,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId22: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId23: {
                roomInfo: {
                    width: 768,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId25: {
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1280, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 1072,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId26: {
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1280, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTop: { // TODO(sestren): Put logic here
                        outcome: {
                            positionX: 1072,
                            positionY: 0 - 24, // TODO(sestren): Add velocityY
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomB: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            smallGremlinRoom: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            spikeBreakerRoom: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            walkArmorRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
        },
        clockTower: {
            belfry: {
                roomInfo: {
                    width: 768,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 512),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 384,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 256 - 8,
                            positionY: 384,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            exitToCourtyard: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 768),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            fireOfBatRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            healingMailRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            hiddenArmory: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            karasumansRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            leftGearRoom: {
                // TODO(sestren): Add breakable wall to logic
                roomInfo: {
                    width: 256,
                    height: 1024,
                },
                regions: [
                    // getRegion('brokenWall', 224, 96, 32, 64),
                    getRegion('secretPassage', 0, 864, 32, 64),
                    getRegion('main', 0, 0, 256, 1024),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'secretPassage', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    // toBrokenWall: {},
                    toSecretPassage: {
                        outcome: {
                            positionX: 16,
                            positionY: 896,
                        },
                        requirements: [
                            {
                                section: 'main',
                                // statusLeftGearRoomSolved: true,
                                // statusRightGearRoomSolved: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 144,
                            positionY: 896,
                        },
                        requirements: [
                            {
                                section: 'secretPassage',
                                // statusLeftGearRoomSolved: true,
                                // statusRightGearRoomSolved: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    // solveLeftGear: {
                    //     outcome: {
                    //         statusLeftGearRoomSolved: true,
                    //     },
                    //     requirements: [
                    //         {
                    //             section: 'main',
                    //             // statusLeftGearRoomSolved: false,
                    //             costs: {
                    //                 time: COST_UNKNOWN,
                    //             },
                    //         },
                    //     ],
                    // },
                },
            },
            loadingRoomToCastleKeep: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            openCourtyard: {
                roomInfo: {
                    width: 1536,
                    height: 1280,
                },
                regions: [
                    getRegion('centerArea', 480, 0, 592, 848),
                    getRegion('upperLeftLedge', 0, 304, 208, 112),
                    getRegion('upperRightLedge', 1408, 48, 128, 112),
                    getRegion('middleRightLedge', 1280, 816, 256, 112),
                    getRegion('lowerLeftLedge', 0, 816, 128, 112),
                    getRegion('main', 0, 1104, 1536, 176),
                ],
                commands: {
                    // TODO(sestren): Add return logic - Flight
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'upperLeftLedge', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'lowerLeftLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 1536 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRightMiddle: {
                        outcome: {
                            positionX: 1536 + 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'middleRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 1536 + 8,
                            positionY: 1152,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toCenterArea: {
                        outcome: {
                            positionX: 528,
                            positionY: 816,
                            // section: 'centerArea',
                        },
                        requirements: [
                            getMovement('batForm', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('doubleJump', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('poweredMist', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('doubleJump', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('poweredMist', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('doubleJump', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('poweredMist', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('batForm', 'middleRightLedge', COST_UNKNOWN),
                            getMovement('doubleJump', 'middleRightLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'middleRightLedge', COST_UNKNOWN),
                            getMovement('poweredMist', 'middleRightLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'middleRightLedge', COST_UNKNOWN),
                        ],
                    },
                    toUpperLeftLedge: {
                        outcome: {
                            positionX: 32,
                            positionY: 384,
                            // section: 'upperLeftLedge',
                        },
                        requirements: [
                            getMovement('batForm', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'centerArea', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'centerArea', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'centerArea', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'centerArea', COST_UNKNOWN),
                        ],
                    },
                    toUpperRightLedge: {
                        outcome: {
                            positionX: 1504,
                            positionY: 128,
                            // section: 'upperRightLedge',
                        },
                        requirements: [
                            getMovement('batForm', 'middleRightLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'middleRightLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'middleRightLedge', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'middleRightLedge', COST_UNKNOWN),
                            getMovement('batForm', 'centerArea', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'centerArea', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'centerArea', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'centerArea', COST_UNKNOWN),
                        ],
                    },
                    toLowerLeftLedge: {
                        outcome: {
                            positionX: 16,
                            positionY: 896,
                            // section: 'lowerLeftLedge',
                        },
                        requirements: [
                            getMovement('basic', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'centerArea', COST_UNKNOWN),
                            getMovement('doubleJump', 'centerArea', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'centerArea', COST_UNKNOWN),
                            getMovement('poweredMist', 'centerArea', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'centerArea', COST_UNKNOWN),
                        ],
                    },
                    toMiddleRightLedge: {
                        outcome: {
                            positionX: 1520,
                            positionY: 896,
                            // section: 'middleRightLedge',
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'centerArea', COST_UNKNOWN),
                            getMovement('doubleJump', 'centerArea', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'centerArea', COST_UNKNOWN),
                            getMovement('poweredMist', 'centerArea', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'centerArea', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 1520,
                            positionY: 1152,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('basic', 'lowerLeftLedge', COST_UNKNOWN),
                            getMovement('basic', 'main', COST_UNKNOWN),
                            getMovement('basic', 'middleRightLedge', COST_UNKNOWN),
                        ],
                    },
                },
            },
            pathToKarasuman: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            pendulumRoom: {
                roomInfo: {
                    width: 1792,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 1792, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 256 - 8,
                            positionY: 128,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                            // TODO(sestren): Handle breakable wall
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1792 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            rightGearRoom: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 768),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    // solveRightGear: {
                    //     outcome: {
                    //         statusRightGearRoomSolved: true,
                    //     },
                    //     requirements: [
                    //         {
                    //             section: 'main',
                    //             // statusRightGearRoomSolved: false,
                    //             costs: {
                    //                 time: COST_UNKNOWN,
                    //             },
                    //         },
                    //     ],
                    // },
                },
            },
            spire: {
                roomInfo: {
                    width: 1280,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 1280, 512),
                ],
                commands: {
                    exitBottom: {
                        outcome: {
                            positionX: 640,
                            positionY: 512 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            stairwellToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToCastleKeep: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                    // {
                    //     requirements: [
                    //         {
                    //             positionX: {
                    //                 minimum: 0,
                    //                 maximum: 256 - 1,
                    //             },
                    //             positionY: {
                    //                 minimum: 0,
                    //                 maximum: 256 - 1,
                    //             },
                    //         }
                    //     ],
                    //     outcome: {
                    //         section: 'main',
                    //         // NOTE(sestren): Leaving Clock Tower resets the Gear Puzzle
                    //         statusLeftGearRoomSolved: false,
                    //         statusRightGearRoomSolved: false,
                    //     },
                    // },
                ],
                commands: {},
            },
            triggerTeleporterToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                    // {
                    //     requirements: [
                    //         {
                    //             positionX: {
                    //                 minimum: 0,
                    //                 maximum: 256 - 1,
                    //             },
                    //             positionY: {
                    //                 minimum: 0,
                    //                 maximum: 256 - 1,
                    //             },
                    //         }
                    //     ],
                    //     outcome: {
                    //         section: 'main',
                    //         // NOTE(sestren): Leaving Clock Tower resets the Gear Puzzle
                    //         statusLeftGearRoomSolved: false,
                    //         statusRightGearRoomSolved: false,
                    //     },
                    // },
                ],
                commands: {},
            },
        },
        colosseum: {
            arena: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            bladeMasterRoom: {
                roomInfo: {
                    width: 1024,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 672,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            bloodCloakRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            bottomOfElevatorShaft: {
                // TODO(sestren): Handle logic for elevator
                roomInfo: {
                    width: 1024,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 512),
                ],
                commands: {
                    // exitTopLeft: {
                    //     outcome: {
                    //         positionX: 128,
                    //         positionY: 0 - 24,
                    //     },
                    //     requirements: [
                    //         getMovement('basic', 'main', COST_UNKNOWN),
                    //     ],
                    // },
                    exitTopRight: {
                        outcome: {
                            positionX: 896,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            fountainRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            holySwordRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitBottom: {
                        outcome: {
                            positionX: 416,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            leftSideArmory: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            passagewayBetweenArenaAndRoyalChapel: {
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('leftOfBarrier', 0, 0, 128, 256),
                    getRegion('main', 144, 0, 1136, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 880,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'leftOfBarrier', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1280 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 384,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLeftOfBarrier: {
                        outcome: {
                            positionX: 96,
                            positionY: 160,
                            statusBarrierInColosseumOpened: true,
                        },
                        requirements: [
                            {
                                section: 'main',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 176,
                            positionY: 160,
                        },
                        requirements: [
                            {
                                section: 'leftOfBarrier',
                                statusBarrierInColosseumOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            rightSideArmory: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomB: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            spiralStaircases: {
                roomInfo: {
                    width: 1024,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 512),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            topOfElevatorShaft: {
                // TODO(sestren): Handle logic for the elevator
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('behindMistGate', 0, 96, 256, 64),
                    getRegion('main', 272, 0, 1008, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 400,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'behindMistGate', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1280 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    // exitBottomLeft: {
                    //     outcome: {
                    //         positionX: 144,
                    //         positionY: 256 + 24,
                    //     },
                    //     requirements: [
                    //         getMovement('basic', 'pit', COST_UNKNOWN),
                    //     ],
                    // },
                    exitBottomRight: {
                        outcome: {
                            positionX: 896,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 304,
                            positionY: 160,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('mistForm', 'behindMistGate', COST_UNKNOWN),
                        ],
                    },
                    toBehindMistGate: {
                        outcome: {
                            positionX: 232,
                            positionY: 128,
                            // section: 'behindMistGate',
                        },
                        requirements: [
                            getMovement('mistForm', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            topOfLeftSpiralStaircase: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            topOfRightSpiralStaircase: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 144,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            valhallaKnightRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
        },
        longLibrary: {
            dhuronAndFleaArmorRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            dhuronAndFleaManRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            exitToOuterWall: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            faerieCardRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            fleaManRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            footOfStaircase: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 224,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            holyRodRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            lesserDemonArea: {
                roomInfo: {
                    width: 1280,
                    height: 1024,
                },
                regions: [
                    getRegion('topRightLedge', 976, 0, 304, 176),
                    getRegion('upperLevel', 288, 0, 800, 336),
                    getRegion('middleLevel', 400, 336, 880, 208),
                    getRegion('middleLevel', 1024, 336, 112, 288),
                    getRegion('lowerLevel', 16, 544, 1264, 192),
                    getRegion('lowerLevel', 16, 544, 192, 352),
                    getRegion('behindMistGate', 784, 816, 352, 128),
                    getRegion('main', 144, 816, 624, 144),
                ],
                commands: {
                    exitRightUpper: {
                        outcome: {
                            positionX: 1280 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'topRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 1280 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'middleLevel', COST_UNKNOWN),
                        ],
                    },
                    toTopRightLedge: {
                        outcome: {
                            positionX: 1248,
                            positionY: 128,
                            // section: 'topRightLedge',
                        },
                        requirements: [
                            getMovement('preciseJump', 'upperLevel', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'upperLevel', COST_UNKNOWN),
                            getMovement('batForm', 'upperLevel', COST_UNKNOWN),
                            getMovement('doubleJump', 'upperLevel', COST_UNKNOWN),
                            getMovement('gravityJump', 'upperLevel', COST_UNKNOWN),
                            getMovement('poweredMist', 'upperLevel', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'upperLevel', COST_UNKNOWN),
                        ],
                    },
                    toUpperLevel: {
                        outcome: {
                            positionX: 1248,
                            positionY: 128,
                            // section: 'upperLevel',
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            getMovement('basicRisky', 'topRightLedge', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'topRightLedge', COST_UNKNOWN),
                            getMovement('batForm', 'topRightLedge', COST_UNKNOWN),
                            getMovement('doubleJump', 'topRightLedge', COST_UNKNOWN),
                            getMovement('gravityJump', 'topRightLedge', COST_UNKNOWN),
                            getMovement('poweredMist', 'topRightLedge', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'topRightLedge', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'middleLevel', COST_UNKNOWN),
                            getMovement('batForm', 'middleLevel', COST_UNKNOWN),
                            getMovement('doubleJump', 'middleLevel', COST_UNKNOWN),
                            getMovement('gravityJump', 'middleLevel', COST_UNKNOWN),
                            getMovement('poweredMist', 'middleLevel', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'middleLevel', COST_UNKNOWN),
                        ],
                    },
                    toMiddleLevel: {
                        outcome: {
                            positionX: 1264,
                            positionY: 384,
                            // section: 'middleLevel',
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            getMovement('basicRisky', 'upperLevel', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'upperLevel', COST_UNKNOWN),
                            getMovement('batForm', 'upperLevel', COST_UNKNOWN),
                            getMovement('doubleJump', 'upperLevel', COST_UNKNOWN),
                            getMovement('gravityJump', 'upperLevel', COST_UNKNOWN),
                            getMovement('poweredMist', 'upperLevel', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'upperLevel', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'lowerLevel', COST_UNKNOWN),
                            getMovement('batForm', 'lowerLevel', COST_UNKNOWN),
                            getMovement('doubleJump', 'lowerLevel', COST_UNKNOWN),
                            getMovement('gravityJump', 'lowerLevel', COST_UNKNOWN),
                            getMovement('poweredMist', 'lowerLevel', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'lowerLevel', COST_UNKNOWN),
                        ],
                    },
                    toLowerLevel: {
                        outcome: {
                            positionX: 1216,
                            positionY: 672,
                            // section: 'lowerLevel',
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            getMovement('basicRisky', 'middleLevel', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'middleLevel', COST_UNKNOWN),
                            getMovement('batForm', 'middleLevel', COST_UNKNOWN),
                            getMovement('doubleJump', 'middleLevel', COST_UNKNOWN),
                            getMovement('gravityJump', 'middleLevel', COST_UNKNOWN),
                            getMovement('poweredMist', 'middleLevel', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'middleLevel', COST_UNKNOWN),
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 256,
                            positionY: 928,
                            // section: 'main',
                        },
                        requirements: [
                            // Moving downward, chance of return not guaranteed
                            getMovement('basicRisky', 'lowerLevel', COST_UNKNOWN),
                            // Moving downward, chance of return guaranteed
                            // getMovement('risingUppercut', 'lowerLevel', COST_UNKNOWN),
                            getMovement('batForm', 'lowerLevel', COST_UNKNOWN),
                            getMovement('doubleJump', 'lowerLevel', COST_UNKNOWN),
                            getMovement('gravityJump', 'lowerLevel', COST_UNKNOWN),
                            getMovement('poweredMist', 'lowerLevel', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'lowerLevel', COST_UNKNOWN),
                            getMovement('mistForm', 'behindMistGate', COST_UNKNOWN),
                        ],
                    },
                    toBehindMistGate: {
                        outcome: {
                            positionX: 816,
                            positionY: 864,
                            // section: 'behindMistGate',
                        },
                        requirements: [
                            getMovement('mistForm', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            outsideShop: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            secretBookcaseRoom: {
                // TODO(sestren): Handle logic for secret bookcase
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            shop: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                    getRegion('beneathShop', 0, 256, 256, 256),
                ],
                commands: {
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'beneathShop', COST_UNKNOWN),
                        ],
                    },
                },
            },
            spellbookArea: {
                roomInfo: {
                    width: 1792,
                    height: 768,
                },
                regions: [
                    getRegion('upperLeftLedge', 0, 48, 400, 240),
                    getRegion('middleLeftLedge', 0, 304, 304, 176),
                    getRegion('main', 0, 0, 1792, 768),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'upperLeftLedge', COST_UNKNOWN),
                        ],
                    },
                    exitLeftMiddle: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'middleLeftLedge', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 640,
                            positionY: 768 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toUpperLeftLedge: {
                        // TODO(sestren): Add logic for Book Jump
                        outcome: {
                            positionX: 24,
                            positionY: 128,
                            // section: 'upperLeftLedge',
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMiddleLeftLedge: {
                        outcome: {
                            positionX: 24,
                            positionY: 324,
                            // section: 'middleLeftLedge',
                        },
                        requirements: [
                            // getMovement('risingUppercut', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 16,
                            positionY: 640,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('basicRisky', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('gravityJump', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('basicRisky', 'middleLeftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'middleLeftLedge', COST_UNKNOWN),
                            getMovement('gravityJump', 'middleLeftLedge', COST_UNKNOWN),
                            getMovement('doubleJump', 'middleLeftLedge', COST_UNKNOWN),
                            getMovement('poweredMist', 'middleLeftLedge', COST_UNKNOWN),
                        ],
                    },
                },
            },
            threeLayerRoom: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('topLayer', 0, 0, 256, 256),
                    getRegion('main', 0, 256, 256, 256),
                    getRegion('bottomLayer', 0, 512, 256, 256),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'topLayer', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'topLayer', COST_UNKNOWN),
                        ],
                    },
                    exitLeftMiddle: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightMiddle: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'bottomLayer', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'bottomLayer', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
        },
        marbleGallery: {
            alucartRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            beneathDropoff: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitTopLeft: {
                        // TODO(sestren): Handle candle dive-kick double jump
                        outcome: {
                            positionX: 40,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTopRight: {
                        outcome: {
                            positionX: 272,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            beneathLeftTrapdoor: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTopWithJump: getUpwardMovement('jump', 'main', COST_UNKNOWN, 128, 80),
                    exitTopWithDoubleJump: getUpwardMovement('doubleJump', 'main', COST_UNKNOWN, 128, 80),
                    exitTopWithPoweredMist: getUpwardMovement('poweredMist', 'main', COST_UNKNOWN, 128, 80),
                    exitTopWithGravityJump: getUpwardMovement('gravityJump', 'main', COST_UNKNOWN, 128, 80),
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            beneathRightTrapdoor: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTopWithJump: getUpwardMovement('jump', 'main', COST_UNKNOWN, 128, 80),
                    exitTopWithDoubleJump: getUpwardMovement('doubleJump', 'main', COST_UNKNOWN, 128, 80),
                    exitTopWithPoweredMist: getUpwardMovement('poweredMist', 'main', COST_UNKNOWN, 128, 80),
                    exitTopWithGravityJump: getUpwardMovement('gravityJump', 'main', COST_UNKNOWN, 128, 80),
                },
            },
            blueDoorRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 240, 256),
                    getRegion('rightSide', 272, 0, 240, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLeftSide: {
                        outcome: {
                            positionX: 224,
                            positionY: 160,
                        },
                        requirements: [
                            { // Jewel of Open
                                section: 'rightSide',
                                progressionUnlockBlueDoors: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toRightSide: {
                        outcome: {
                            positionX: 304,
                            positionY: 160,
                            statusPressurePlateInMarbleGalleryActivated: true,
                        },
                        requirements: [
                            { // Jewel of Open
                                section: 'main',
                                progressionUnlockBlueDoors: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            clockRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('upperLeftLedge', 0, 0, 32, 80),
                    getRegion('upperRightLedge', 224, 0, 32, 80),
                    getRegion('pit', 64, 192, 128, 64),
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTopLeft: {
                        outcome: {
                            positionX: 24,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'upperLeftLedge', COST_UNKNOWN),
                        ],
                    },
                    exitTopMiddle: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 200,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTopRight: {
                        outcome: {
                            positionX: 232,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toUpperLeftLedge: {
                        outcome: {
                            positionX: 24,
                            positionY: 32,
                            // section: 'upperLeftLedge',
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('doubleJump', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMist', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRise', 'main', COST_UNKNOWN),
                        ],
                    },
                    toUpperRightLedge: {
                        outcome: {
                            positionX: 232,
                            positionY: 32,
                            // section: 'upperRightLedge',
                        },
                        requirements: [
                            {
                                section: 'main',
                                progressionBatTransformation: true,
                                progressionItemMaterialization: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionDoubleJump: true,
                                progressionItemMaterialization: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionGravityJump: true,
                                progressionItemMaterialization: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionMistTransformation: true,
                                progressionLongerMistDuration: true,
                                progressionItemMaterialization: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            {
                                section: 'main',
                                progressionMistTransformation: true,
                                progressionWolfTransformation: true,
                                progressionItemMaterialization: true,
                                techniqueWolfMistRise: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toPit: {
                        outcome: {
                            positionX: 128,
                            positionY: 224,
                            // section: 'pit',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusSecretFloorInClockRoomOpened: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('basic', 'pit', COST_UNKNOWN),
                            getMovement('basic', 'upperLeftLedge', COST_UNKNOWN),
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    openSecretFloor: {
                        outcome: {
                            statusSecretFloorInClockRoomOpened: true,
                        },
                        requirements: [
                            {
                                section: 'main',
                                // statusSecretFloorInClockRoomOpened: false,
                                itemInscribedRing: {
                                    minimum: 2,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            dropoff: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('leftLedge', 0, 0, 304, 192),
                    getRegion('pit', 288, 0, 208, 256),
                    getRegion('main', 496, 0, 272, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'leftLedge', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 512,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('pit', 'fall', COST_UNKNOWN),
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLeftLedge: {
                        outcome: {
                            positionX: 16,
                            positionY: 128,
                            // section: 'leftLedge',
                        },
                        requirements: [
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'pit', COST_UNKNOWN),
                            getMovement('wolfMistRiseLong', 'pit', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 752,
                            positionY: 128,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'pit', COST_UNKNOWN),
                            getMovement('wolfMistRiseLong', 'pit', COST_UNKNOWN),
                            getMovement('basic', 'leftLedge', COST_UNKNOWN),
                        ],
                    },
                    toPit: {
                        outcome: {
                            positionX: 384,
                            positionY: 224,
                            // section: 'pit',
                        },
                        requirements: [
                            getMovement('fall', 'main', COST_UNKNOWN),
                            getMovement('basic', 'leftLedge', COST_UNKNOWN),
                        ],
                    },
                },
            },
            elevatorRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTopWithJump: getUpwardMovement('jump', 'main', COST_UNKNOWN, 128, 48),
                    exitTopWithDoubleJump: getUpwardMovement('doubleJump', 'main', COST_UNKNOWN, 128, 48),
                    exitTopWithPoweredMist: getUpwardMovement('poweredMist', 'main', COST_UNKNOWN, 128, 48),
                    exitTopWithGravityJump: getUpwardMovement('gravityJump', 'main', COST_UNKNOWN, 128, 48),
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            emptyRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            entrance: {
                roomInfo: {
                    width: 1024,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            gravityBootsRoom: {
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('pit', 608, 208, 64, 48),
                    getRegion('main', 0, 0, 1280, 256),
                ],
                commands: {
                    exitBottom: {
                        outcome: {
                            positionX: 640,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 688,
                            positionY: 176,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toPit: {
                        outcome: {
                            positionX: 640,
                            positionY: 224,
                            // section: 'pit',
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            leftOfClockRoom: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToAlchemyLaboratory: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToUndergroundCaverns: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            longHallway: {
                roomInfo: {
                    width: 3840,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 3840, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 3840 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            ouijaTableStairway: {
                roomInfo: {
                    width: 512,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 768),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            pathwayAfterLeftStatue: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            pathwayAfterRightStatue: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            powerUpRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            rightOfClockRoom: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            sShapedHallways: {
                roomInfo: {
                    width: 1536,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 1536, 768),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1536 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomB: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            slingerStaircase: {
                roomInfo: {
                    width: 768,
                    height: 512,
                },
                regions: [
                    getRegion('pit', 576, 480, 96, 32),
                    getRegion('main', 0, 0, 768, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 608,
                            positionY: 512 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'pit', COST_UNKNOWN),
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 752,
                            positionY: 384,
                            verticalClimb: 0,
                            // section: 'main',
                        },
                        requirements: [
                            {
                                section: 'pit',
                                statusPressurePlateInMarbleGalleryActivated: true,
                                verticalClimb: {
                                    minimum: 64 - 24,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toPit: {
                        outcome: {
                            positionX: 608,
                            positionY: 496,
                            // section: 'pit',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusPressurePlateInMarbleGalleryActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            spiritOrbRoom: {
                roomInfo: {
                    width: 512,
                    height: 1280,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 1280),
                ],
                commands: {
                    exitRightUpper: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 1152,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            stainedGlassCorner: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 160,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            stairwellToUndergroundCaverns: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            stopwatchRoom: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('pit', 352, 224, 64, 32),
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 384,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'pit', COST_UNKNOWN),
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 320,
                            positionY: 160,
                            verticalClimb: 0,
                            // section: 'main',
                        },
                        requirements: [
                            {
                                section: 'pit',
                                statusPressurePlateInMarbleGalleryActivated: true,
                                verticalClimb: {
                                    minimum: 64 - 24,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toPit: {
                        outcome: {
                            positionX: 384,
                            positionY: 240,
                            // section: 'pit',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusPressurePlateInMarbleGalleryActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            tallStainedGlassWindows: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 768),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            threePaths: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('leftPath', 0, 352, 80, 160),
                    getRegion('middlePath', 96, 0, 64, 336),
                    getRegion('main', 80, 336, 96, 176),
                    getRegion('rightPath', 176, 352, 80, 160),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'middlePath', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'leftPath', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'rightPath', COST_UNKNOWN),
                        ],
                    },
                    exitBottomLeft: {
                        outcome: {
                            positionX: 40,
                            positionY: 512 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'leftPath', COST_UNKNOWN),
                        ],
                    },
                    exitBottomMiddle: {
                        outcome: {
                            positionX: 128,
                            positionY: 512 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottomRight: {
                        outcome: {
                            positionX: 216,
                            positionY: 512 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'rightPath', COST_UNKNOWN),
                        ],
                    },
                    toMiddlePath: {
                        outcome: {
                            positionX: 152,
                            positionY: 304,
                            // section: 'middlePath',
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfMistRiseVeryLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 216,
                            positionY: 512 + 24,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('fall', 'middlePath', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToAlchemyLaboratory: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToCastleCenter: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToUndergroundCaverns: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
        },
        olroxsQuarters: {
            bottomOfStairwell: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            catwalkCrypt: {
                // TODO(sestren): Add more regions and logic?
                roomInfo: {
                    width: 1792,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1792, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 384,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1792 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            echoOfBatRoom: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            emptyCells: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            emptyRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            garnetRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            grandStaircase: {
                roomInfo: {
                    width: 768,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: { // TODO(sestren): Handle logic for breakable wall
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            hammerAndBladeRoom: {
                roomInfo: {
                    width: 1024,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToColosseum: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            narrowHallwayToOlrox: {
                roomInfo: {
                    width: 1024,
                    height: 256,
                },
                regions: [
                    getRegion('leftOfTunnel', 0, 0, 400, 256),
                    getRegion('main', 432, 0, 592, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'leftOfTunnel', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLeftOfTunnel: {
                        outcome: {
                            positionX: 80,
                            positionY: 128,
                            // section: 'leftOfTunnel',
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                            getMovement('wolfForm', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 1000,
                            positionY: 128,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('batForm', 'leftOfTunnel', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'leftOfTunnel', COST_UNKNOWN),
                            getMovement('wolfForm', 'leftOfTunnel', COST_UNKNOWN),
                        ],
                    },
                },
            },
            olroxsRoom: {
                roomInfo: {
                    width: 512,
                    height: 512,
                },
                regions: [
                    getRegion('leftLedge', 0, 96, 48, 64),
                    getRegion('rightLedge', 464, 96, 48, 64),
                    getRegion('main', 0, 0, 512, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 256,
                            positionY: 432,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('basic', 'leftLedge', COST_UNKNOWN),
                            getMovement('basic', 'rightLedge', COST_UNKNOWN),
                        ],
                    },
                    toLeftLedge: {
                        outcome: {
                            positionX: 32,
                            positionY: 128,
                            // section: 'leftLedge',
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    toRightLedge: {
                        outcome: {
                            positionX: 480,
                            positionY: 128,
                            // section: 'rightLedge',
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            openCourtyard: {
                roomInfo: {
                    width: 1536,
                    height: 1024,
                },
                regions: [
                    // TODO(sestren): Add other regions and handle logic for the ledges
                    getRegion('main', 0, 0, 1536, 1024),
                ],
                commands: {
                    // TODO(sestren): Add return logic - Flight
                    exitTop: {
                        outcome: {
                            positionX: 1392,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 1536 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 1536 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            prison: {
                roomInfo: {
                    width: 1536,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1536, 256),
                ],
                commands: {
                    // TODO(sestren): Add return logic - Flight
                    exitBottomLeft: {
                        outcome: {
                            positionX: 112,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottomRight: {
                        outcome: {
                            positionX: 1424,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            secretOnyxRoom: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            skelerangRoom: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 768),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            swordCardRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            tallShaft: {
                // TODO(sestren): Handle logic for regions in the tall shaft
                roomInfo: {
                    width: 256,
                    height: 1536,
                },
                regions: [
                    getRegion('holeInCeiling', 64, 0, 128, 64),
                    getRegion('main', 0, 1376, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 1408,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 1408,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toHoleInCeiling: {
                        outcome: {
                            positionX: 128,
                            positionY: 32,
                            // section: 'holeInCeiling',
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 224,
                            positionY: 1408,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('basic', 'holeInCeiling', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToColosseum: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToRoyalChapel: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
        },
        outerWall: {
            blueAxeKnightRoom: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            doppelgangerRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            elevatorShaftRoom: {
                roomInfo: {
                    width: 768,
                    height: 2304,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 2304),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 416,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftUpper: {
                        outcome: {
                            positionX: 256 - 8,
                            positionY: 640,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftMiddle: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 1664,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 2176,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 224,
                            positionY: 2304 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('mistForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            exitToClockTower: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            exitToMarbleGallery: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 96,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 176,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            garlicRoom: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            garnetVaseRoom: {
                // TODO(sestren): Add logic for Garnet Vase
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 304,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 400,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            gladiusRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            jewelKnucklesRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 32,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusSecretPlatformInOuterWallActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToClockTower: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                            statusSecretPlatformInOuterWallActivated: false,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToLongLibrary: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                            statusSecretPlatformInOuterWallActivated: false,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                            statusSecretPlatformInOuterWallActivated: false,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                            statusSecretPlatformInOuterWallActivated: false,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            lowerMedusaRoom: {
                roomInfo: {
                    width: 768,
                    height: 768,
                },
                regions: [
                    getRegion('behindMistGate', 0, 352, 32, 64),
                    getRegion('main', 0, 0, 512, 768),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 384,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'behindMistGate', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 224,
                            positionY: 768 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toBehindMistGate: {
                        outcome: {
                            positionX: 16,
                            positionY: 384,
                            // section: 'behindMistGate',
                        },
                        requirements: [
                            getMovement('mistForm', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 80,
                            positionY: 384,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('mistForm', 'behindMistGate', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomB: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            secretPlatformRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 32,
                            positionY: 256 + 24,
                            statusSecretPlatformInOuterWallActivated: true,
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusSecretPlatformInOuterWallActivated: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            telescopeRoom: {
                roomInfo: {
                    width: 1024,
                    height: 512,
                },
                regions: [
                    getRegion('main', 336, 0, 400, 240),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 480,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            topOfOuterWall: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 176,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToClockTower: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToLongLibrary: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToWarpRooms: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
        },
        royalChapel: {
            // NOTE(sestren): Royal Chapel has unusual overlapping room transitions
            chapelStaircase: {
                roomInfo: {
                    width: 2048,
                    height: 1792,
                },
                regions: [
                    getRegion('main', 0, 0, 2048, 1792),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 2048 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 384,
                            positionY: 1792 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            confessionalBooth: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            emptyRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            gogglesRoom: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('upperRightLedge', 144, 352, 112, 64),
                    getRegion('main', 0, 0, 256, 768),
                ],
                commands: {
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 16,
                            positionY: 640,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('basic', 'upperRightLedge', COST_UNKNOWN),
                        ],
                    },
                    toUpperRightLedge: {
                        outcome: {
                            positionX: 224,
                            positionY: 384,
                            // section: 'upperRightLedge',
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            hippogryphRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            leftTower: {
                roomInfo: {
                    width: 1024,
                    height: 2560,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 2560),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8 + 384,
                            positionY: 896,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 1024 + 8 - 384,
                            positionY: 640,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightMiddle: {
                        outcome: {
                            positionX: 1024 + 8 - 256,
                            positionY: 1920,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8 + 256,
                            positionY: 2432,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 1024 + 8 - 256,
                            positionY: 2432,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToAlchemyLaboratory: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToCastleKeep: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToColosseum: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            middleTower: {
                roomInfo: {
                    width: 1024,
                    height: 1024,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 1024),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8 + 384,
                            positionY: 896,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8 - 384,
                            positionY: 640,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            nave: {
                roomInfo: {
                    width: 512,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            pushingStatueShortcut: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('leftOfStatue', 0, 96, 32, 64),
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'leftOfStatue', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLeftOfStatue: {
                        outcome: {
                            positionX: 16,
                            positionY: 128,
                            statusStatueInRoyalChapelMoved: true,
                            // section: 'leftOfStatue',
                        },
                        requirements: [
                            {
                                section: 'main',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                            // section: 'main',
                        },
                        requirements: [
                            {
                                section: 'leftOfStatue',
                                statusStatueInRoyalChapelMoved: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            rightTower: {
                roomInfo: {
                    width: 1024,
                    height: 1024,
                },
                regions: [
                    getRegion('main', 0, 0, 1024, 1024),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8 + 384,
                            positionY: 896,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 1024 + 8 - 256,
                            positionY: 640,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 1024 + 8 - 256,
                            positionY: 896,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomB: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            silverRingRoom: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            spikeHallway: {
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('leftOfSpikeHallway', 0, 0, 112, 256),
                    getRegion('main', 1040, 0, 240, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'leftOfSpikeHallway', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1280 + 8 - 128,
                            positionY: 128,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    toLeftOfSpikeHallway: {
                        outcome: {
                            positionX: 32,
                            positionY: 128,
                            // section: 'leftOfSpikeHallway',
                        },
                        requirements: [
                            {
                                section: 'main',
                                progressionMistTransformation: true,
                                progressionUnlockBlueDoors: true,
                                itemSpikeBreaker: {
                                    minimum: 1,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 1072,
                            positionY: 128,
                            // section: 'main',
                        },
                        requirements: [
                            {
                                section: 'leftOfSpikeHallway',
                                progressionMistTransformation: true,
                                progressionUnlockBlueDoors: true,
                                itemSpikeBreaker: {
                                    minimum: 1,
                                },
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            statueLedge: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToAlchemyLaboratory: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToCastleKeep: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToColosseum: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            walkwayBetweenTowers: {
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1280, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8 + 128,
                            positionY: 128,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1280 + 8 - 128,
                            positionY: 128,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            walkwayLeftOfHippogryph: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8 + 128,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            walkwayRightOfHippogryph: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8 - 128,
                            positionY: 128,
                            staleLocation: true,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
        },
        undergroundCaverns: {
            bandannaRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            claymoreStairwell: {
                roomInfo: {
                    width: 256,
                    height: 1024,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 1024),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            crystalBend: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 80,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            crystalCloakRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            dKBridge: {
                roomInfo: {
                    width: 1024,
                    height: 256,
                },
                regions: [
                    getRegion('beneathBridge', 816, 176, 160, 80),
                    getRegion('main', 0, 0, 1024, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 1024 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 896,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'beneathBridge', COST_UNKNOWN),
                            getMovement('batForm', 'beneathBridge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'beneathBridge', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 24,
                            positionY: 128,
                            // section: main,
                        },
                        requirements: [
                            { // Bridge Broken
                                section: 'beneathBridge',
                                statusBridgeInUndergroundCavernsBroken: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toBeneathBridge: {
                        outcome: {
                            positionX: 960,
                            positionY: 192,
                            statusBridgeInUndergroundCavernsBroken: true,
                            // section: beneathBridge,
                        },
                        requirements: [
                            { // DK Button
                                section: 'main',
                                statusButtonInUndergroundCavernsActivated: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            dKButton: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    pressButton: {
                        outcome: {
                            statusButtonInUndergroundCavernsActivated: true,
                        },
                        requirements: [
                            {
                                section: 'main',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            exitToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            exitToCastleEntrance: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 384,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            falseSaveRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    useSaveRoom: {
                        outcome: {
                            positionX: 256 + 128,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            hiddenCrystalEntrance: {
                roomInfo: {
                    width: 256,
                    height: 768,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 768),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 136,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('gravityJump', 'main', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 640,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        // TODO(sestren): Handle logic for breakable floor
                        outcome: {
                            positionX: 104,
                            positionY: 768 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            holySymbolRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            iceFloeRoom: {
                roomInfo: {
                    width: 2304,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 2304, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTop: {
                        outcome: {
                            positionX: 2176,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 2304 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            leftFerrymanRoute: {
                roomInfo: {
                    width: 3328,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 3328, 512),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 2144,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 3328 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            longDrop: {
                roomInfo: {
                    width: 256,
                    height: 2816,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 800),
                    getRegion('leftLedge', 16, 864, 32, 64),
                    getRegion('rightLedge', 208, 864, 48, 64),
                    getRegion('pit', 80, 2768, 112, 48),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightMiddle: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 896,
                        },
                        requirements: [
                            getMovement('basic', 'rightLedge', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 2816 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'pit', COST_UNKNOWN),
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 240,
                            positionY: 128,
                            // section: 'main',
                        },
                        requirements: [
                            getMovement('batForm', 'leftLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'leftLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'leftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'rightLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'rightLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'rightLedge', COST_UNKNOWN),
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toLeftLedge: {
                        outcome: {
                            positionX: 32,
                            positionY: 896,
                            // section: 'leftLedge',
                        },
                        requirements: [
                            getMovement('fall', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'rightLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'rightLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'rightLedge', COST_UNKNOWN),
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toRightLedge: {
                        outcome: {
                            positionX: 232,
                            positionY: 896,
                            // section: 'rightLedge',
                        },
                        requirements: [
                            getMovement('batForm', 'leftLedge', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'leftLedge', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'leftLedge', COST_UNKNOWN),
                            getMovement('batForm', 'pit', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'pit', COST_UNKNOWN),
                            getMovement('poweredMistLong', 'pit', COST_UNKNOWN),
                        ],
                    },
                    toPit: {
                        outcome: {
                            positionX: 136,
                            positionY: 2792,
                            // section: 'pit',
                        },
                        requirements: [
                            getMovement('fall', 'main', COST_UNKNOWN),
                            getMovement('fall', 'leftLedge', COST_UNKNOWN),
                            getMovement('fall', 'rightLedge', COST_UNKNOWN),
                        ],
                    },
                },
            },
            mealTicketsAndMoonstoneRoom: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            mermanStatueRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            pentagramRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            plaqueRoomWithBreakableWall: {
                // TODO(sestren): Add logic for breakable wall
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            plaqueRoomWithLifeMaxUp: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('fall', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            rightFerrymanRoute: {
                roomInfo: {
                    width: 3328,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 2896, 512),
                    getRegion('rightSide', 2928, 0, 400, 512),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 3328 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'rightSide', COST_UNKNOWN),
                        ],
                    },
                    toMain: {
                        outcome: {
                            positionX: 24,
                            positionY: 128,
                            // section: main,
                        },
                        requirements: [
                            { // Merman Statue
                                section: 'rightSide',
                                progressionSummonFerryman: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                    toRightSide: {
                        outcome: {
                            positionX: 3328,
                            positionY: 128,
                            // section: rightSide,
                        },
                        requirements: [
                            { // Merman Statue
                                section: 'main',
                                progressionSummonFerryman: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            risingWaterRoom: {
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1280, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitTop: {
                        outcome: {
                            positionX: 896,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId09: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId10: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId11: {
                roomInfo: {
                    width: 768,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 768, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 768 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId12: {
                roomInfo: {
                    width: 512,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 512, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId18: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            roomId19: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomA: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomB: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            saveRoomC: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            scyllaRoom: {
                roomInfo: {
                    width: 1280,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 1280, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 896,
                            positionY: 256 + 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            scyllaWyrmRoom: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            smallStairwell: {
                roomInfo: {
                    width: 256,
                    height: 512,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 512),
                ],
                commands: {
                    exitTop: {
                        outcome: {
                            positionX: 128,
                            positionY: 0 - 24,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 384,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            tallStairwell: {
                roomInfo: {
                    width: 256,
                    height: 2304,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 2304),
                ],
                commands: {
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 1664,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitBottom: {
                        outcome: {
                            positionX: 128,
                            positionY: 2304 + 24,
                        },
                        requirements: [
                            getMovement('basicRisky', 'main', COST_UNKNOWN),
                            getMovement('batForm', 'main', COST_UNKNOWN),
                            getMovement('multipleGravityJumps', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToBossSuccubus: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    defeatSuccubus: {
                        outcome: {
                            positionX: 0 - 128,
                            positionY: 128,
                            statusSuccubusDefeated: true,
                        },
                        requirements: [
                            { // Fight Succubus without jump or flight
                                section: 'main',
                                techniqueDefeatSuccubusAtZeroProgression: true,
                                statusSuccubusDefeated: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            { // Fight Succubus using Double Jump
                                section: 'main',
                                progressionDoubleJump: true,
                                statusSuccubusDefeated: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            { // Fight Succubus using Bat Transformation
                                section: 'main',
                                progressionBatTransformation: true,
                                statusSuccubusDefeated: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            { // Fight Succubus using Gravity Jump
                                section: 'main',
                                progressionGravityJump: true,
                                statusSuccubusDefeated: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                            { // Fight Succubus using Powered Mist
                                section: 'main',
                                progressionMistTransformation: true,
                                progressionLongerMistDuration: true,
                                statusSuccubusDefeated: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            },
                        ],
                    },
                },
            },
            triggerTeleporterToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToMarbleGallery: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            waterfall: {
                roomInfo: {
                    width: 512,
                    height: 1536,
                },
                regions: [
                    // TODO(sestren): Add more regions and logic?
                    getRegion('main', 0, 0, 512, 1536),
                ],
                commands: {
                    // TODO(sestren): Add return logic - Flight
                    exitLeftUpper: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightUpper: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitLeftLower: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 1408,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRightLower: {
                        outcome: {
                            positionX: 512 + 8,
                            positionY: 1408,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
        },
        warpRooms: {
            loadingRoomToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToCastleKeep: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            loadingRoomToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                },
            },
            triggerTeleporterToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToCastleKeep: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            triggerTeleporterToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {},
            },
            warpRoomToAbandonedMine: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    {
                        requirements: [
                            {
                                positionX: {
                                    minimum: 0,
                                    maximum: 0 + 256 - 1,
                                },
                                positionY: {
                                    minimum: 0,
                                    maximum: 0 + 256 - 1,
                                },
                            }
                        ],
                        outcome: {
                            section: 'main',
                            statusWarpRoomToAbandonedMineUnlocked: true,
                        },
                    }
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    teleportToOuterWall: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToOuterWall',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToOuterWallUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToCastleKeep: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToCastleKeep',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToOuterWallUnlocked: false,
                                statusWarpRoomToCastleKeepUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToOlroxsQuarters: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToOlroxsQuarters',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToOuterWallUnlocked: false,
                                statusWarpRoomToCastleKeepUnlocked: false,
                                statusWarpRoomToOlroxsQuartersUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToCastleEntrance: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToCastleEntrance',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToOuterWallUnlocked: false,
                                statusWarpRoomToCastleKeepUnlocked: false,
                                statusWarpRoomToOlroxsQuartersUnlocked: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                },
            },
            warpRoomToCastleEntrance: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    getRegion('main', 0, 0, 256, 256),
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    teleportToAbandonedMine: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToAbandonedMine',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToAbandonedMineUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToOuterWall: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToOuterWall',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToAbandonedMineUnlocked: false,
                                statusWarpRoomToOuterWallUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToCastleKeep: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToCastleKeep',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToAbandonedMineUnlocked: false,
                                statusWarpRoomToOuterWallUnlocked: false,
                                statusWarpRoomToCastleKeepUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToOlroxsQuarters: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToOlroxsQuarters',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToAbandonedMineUnlocked: false,
                                statusWarpRoomToOuterWallUnlocked: false,
                                statusWarpRoomToCastleKeepUnlocked: false,
                                statusWarpRoomToOlroxsQuartersUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToCastleEntrance: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToCastleEntrance',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToAbandonedMineUnlocked: false,
                                statusWarpRoomToOuterWallUnlocked: false,
                                statusWarpRoomToCastleKeepUnlocked: false,
                                statusWarpRoomToOlroxsQuartersUnlocked: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                },
            },
            warpRoomToCastleKeep: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    {
                        requirements: [
                            {
                                positionX: {
                                    minimum: 0,
                                    maximum: 0 + 256 - 1,
                                },
                                positionY: {
                                    minimum: 0,
                                    maximum: 0 + 256 - 1,
                                },
                            }
                        ],
                        outcome: {
                            section: 'main',
                            statusWarpRoomToCastleKeepUnlocked: true,
                        },
                    }
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    teleportToOlroxsQuarters: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToOlroxsQuarters',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToOlroxsQuartersUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToCastleEntrance: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToCastleEntrance',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToOlroxsQuartersUnlocked: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                },
            },
            warpRoomToOlroxsQuarters: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    {
                        requirements: [
                            {
                                positionX: {
                                    minimum: 0,
                                    maximum: 0 + 256 - 1,
                                },
                                positionY: {
                                    minimum: 0,
                                    maximum: 0 + 256 - 1,
                                },
                            }
                        ],
                        outcome: {
                            section: 'main',
                            statusWarpRoomToOlroxsQuartersUnlocked: true,
                        },
                    }
                ],
                commands: {
                    exitLeft: {
                        outcome: {
                            positionX: 0 - 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    teleportToCastleEntrance: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToCastleEntrance',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                },
            },
            warpRoomToOuterWall: {
                roomInfo: {
                    width: 256,
                    height: 256,
                },
                regions: [
                    {
                        requirements: [
                            {
                                positionX: {
                                    minimum: 0,
                                    maximum: 0 + 256 - 1,
                                },
                                positionY: {
                                    minimum: 0,
                                    maximum: 0 + 256 - 1,
                                },
                            }
                        ],
                        outcome: {
                            section: 'main',
                            statusWarpRoomToOuterWallUnlocked: true,
                        },
                    }
                ],
                commands: {
                    exitRight: {
                        outcome: {
                            positionX: 256 + 8,
                            positionY: 128,
                        },
                        requirements: [
                            getMovement('basic', 'main', COST_UNKNOWN),
                        ],
                    },
                    teleportToCastleKeep: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToCastleKeep',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToCastleKeepUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToOlroxsQuarters: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToOlroxsQuarters',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToCastleKeepUnlocked: false,
                                statusWarpRoomToOlroxsQuartersUnlocked: true,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                    teleportToCastleEntrance: {
                        outcome: {
                            positionX: 128,
                            positionY: 160,
                            room: 'warpRoomToCastleEntrance',
                            section: 'main',
                        },
                        requirements: [
                            {
                                section: 'main',
                                statusWarpRoomToCastleKeepUnlocked: false,
                                statusWarpRoomToOlroxsQuartersUnlocked: false,
                                costs: {
                                    time: COST_UNKNOWN,
                                },
                            }
                        ],
                    },
                },
            },
        },
    }

    const TELEPORTERS = {
        fromAbandonedMineToCatacombs: { // fromCatacombsToAbandonedMine
            sourceStage: 'abandonedMine',
            targetStage: 'catacombs',
            room: 'bend',
            positionX: 16,
            positionY: 388,
        },
        fromAbandonedMineToUndergroundCaverns: { // fromUndergroundCavernsToAbandonedMine
            sourceStage: 'abandonedMine',
            targetStage: 'undergroundCaverns',
            room: 'wolfsHeadColumn',
            positionX: 240,
            positionY: 132,
        },
        fromAbandonedMineToWarpRooms: { // fromWarpRoomsToAbandonedMine
            sourceStage: 'abandonedMine',
            targetStage: 'warpRooms',
            room: 'fourWayIntersection',
            positionX: 752,
            positionY: 132,
        },
        fromAlchemyLaboratoryToCastleEntrance: { // fromCastleEntranceToAlchemyLaboratory
            sourceStage: 'alchemyLaboratory',
            targetStage: 'castleEntrance',
            room: 'entryway',
            positionX: 752,
            positionY: 132,
        },
        fromAlchemyLaboratoryToMarbleGallery: { // fromMarbleGalleryToAlchemyLaboratory
            sourceStage: 'alchemyLaboratory',
            targetStage: 'marbleGallery',
            room: 'exitToMarbleGallery',
            positionX: 496,
            positionY: 392,
        },
        fromAlchemyLaboratoryToRoyalChapel: { // fromRoyalChapelToAlchemyLaboratory
            sourceStage: 'alchemyLaboratory',
            targetStage: 'royalChapel',
            room: 'exitToRoyalChapel',
            positionX: 16,
            positionY: 132,
        },
        fromCastleEntranceToAlchemyLaboratory: { // fromAlchemyLaboratoryToCastleEntrance
            sourceStage: 'castleEntrance',
            targetStage: 'alchemyLaboratory',
            room: 'cubeOfZoeRoom',
            positionX: 16,
            positionY: 132,
        },
        fromCastleEntranceToMarbleGallery: { // fromMarbleGalleryToCastleEntrance
            sourceStage: 'castleEntrance',
            targetStage: 'marbleGallery',
            room: 'cubeOfZoeRoom',
            positionX: 496,
            positionY: 132,
        },
        fromCastleEntranceToUndergroundCaverns: { // fromUndergroundCavernsToCastleEntrance
            sourceStage: 'castleEntrance',
            targetStage: 'undergroundCaverns',
            room: 'shortcutToUndergroundCaverns',
            positionX: 240,
            positionY: 132,
        },
        fromCastleEntranceToWarpRooms: { // fromWarpRoomsToCastleEntrance
            sourceStage: 'castleEntrance',
            targetStage: 'warpRooms',
            room: 'shortcutToWarpRooms',
            positionX: 16,
            positionY: 132,
        },
        fromCastleKeepToClockTower: { // fromClockTowerToCastleKeep
            sourceStage: 'castleKeep',
            targetStage: 'clockTower',
            room: 'lionTorchPlatform',
            positionX: 240,
            positionY: 388,
        },
        fromCastleKeepToRoyalChapel: { // fromRoyalChapelToCastleKeep
            sourceStage: 'castleKeep',
            targetStage: 'royalChapel',
            room: 'keepArea',
            positionX: 16,
            positionY: 1924,
        },
        fromCastleKeepToWarpRooms: { // fromWarpRoomsToCastleKeep
            sourceStage: 'castleKeep',
            targetStage: 'warpRooms',
            room: 'dualPlatforms',
            positionX: 240,
            positionY: 388,
        },
        fromCatacombsToAbandonedMine: { // fromAbandonedMineToCatacombs
            sourceStage: 'catacombs',
            targetStage: 'abandonedMine',
            room: 'exitToAbandonedMine',
            positionX: 240,
            positionY: 132,
        },
        fromClockTowerToCastleKeep: { // fromCastleKeepToClockTower
            sourceStage: 'clockTower',
            targetStage: 'castleKeep',
            room: 'karasumansRoom',
            positionX: 16,
            positionY: 132,
        },
        fromClockTowerToOuterWall: { // fromOuterWallToClockTower
            sourceStage: 'clockTower',
            targetStage: 'outerWall',
            room: 'stairwellToOuterWall',
            positionX: 240,
            positionY: 132,
        },
        fromColosseumToOlroxsQuarters: { // fromOlroxsQuartersToColosseum
            sourceStage: 'colosseum',
            targetStage: 'olroxsQuarters',
            room: 'topOfElevatorShaft',
            positionX: 1264,
            positionY: 132,
        },
        fromColosseumToRoyalChapel: { // fromRoyalChapelToColosseum
            sourceStage: 'colosseum',
            targetStage: 'royalChapel',
            room: 'passagewayBetweenArenaAndRoyalChapel',
            positionX: 16,
            positionY: 132,
        },
        fromLongLibraryToOuterWall: { // fromOuterWallToLongLibrary
            sourceStage: 'longLibrary',
            targetStage: 'outerWall',
            room: 'exitToOuterWall',
            positionX: 752,
            positionY: 132,
        },
        fromMarbleGalleryToAlchemyLaboratory: { // fromAlchemyLaboratoryToMarbleGallery
            sourceStage: 'marbleGallery',
            targetStage: 'alchemyLaboratory',
            room: 'entrance',
            positionX: 16,
            positionY: 132,
        },
        fromMarbleGalleryToCastleEntrance: { // fromCastleEntranceToMarbleGallery
            sourceStage: 'marbleGallery',
            targetStage: 'castleEntrance',
            room: 'sShapedHallways',
            positionX: 16,
            positionY: 644,
        },
        fromMarbleGalleryToOlroxsQuarters: { // fromOlroxsQuartersToMarbleGallery
            sourceStage: 'marbleGallery',
            targetStage: 'olroxsQuarters',
            room: 'pathwayAfterLeftStatue',
            positionX: 16,
            positionY: 132,
        },
        fromMarbleGalleryToOuterWall: { // fromOuterWallToMarbleGallery
            sourceStage: 'marbleGallery',
            targetStage: 'outerWall',
            room: 'longHallway',
            positionX: 3824,
            positionY: 132,
        },
        fromMarbleGalleryToUndergroundCaverns: { // fromUndergroundCavernsToMarbleGallery
            sourceStage: 'marbleGallery',
            targetStage: 'undergroundCaverns',
            room: 'stairwellToUndergroundCaverns',
            positionX: 16,
            positionY: 388,
        },
        fromOlroxsQuartersToColosseum: { // fromColosseumToOlroxsQuarters
            sourceStage: 'olroxsQuarters',
            targetStage: 'colosseum',
            room: 'grandStaircase',
            positionX: 16,
            positionY: 388,
        },
        fromOlroxsQuartersToMarbleGallery: { // fromMarbleGalleryToOlroxsQuarters
            sourceStage: 'olroxsQuarters',
            targetStage: 'marbleGallery',
            room: 'skelerangRoom',
            positionX: 240,
            positionY: 648,
        },
        fromOlroxsQuartersToRoyalChapel: { // fromRoyalChapelToOlroxsQuarters
            sourceStage: 'olroxsQuarters',
            targetStage: 'royalChapel',
            room: 'catwalkCrypt',
            positionX: 16,
            positionY: 132,
        },
        fromOlroxsQuartersToWarpRooms: { // fromWarpRoomsToOlroxsQuarters
            sourceStage: 'olroxsQuarters',
            targetStage: 'warpRooms',
            room: 'tallShaft',
            positionX: 240,
            positionY: 1412,
        },
        fromOuterWallToClockTower: { // fromClockTowerToOuterWall
            sourceStage: 'outerWall',
            targetStage: 'clockTower',
            room: 'exitToClockTower',
            positionX: 16,
            positionY: 132,
        },
        fromOuterWallToLongLibrary: { // fromLongLibraryToOuterWall
            sourceStage: 'outerWall',
            targetStage: 'longLibrary',
            room: 'elevatorShaftRoom',
            positionX: 16,
            positionY: 1672,
        },
        fromOuterWallToMarbleGallery: { // fromMarbleGalleryToOuterWall
            sourceStage: 'outerWall',
            targetStage: 'marbleGallery',
            room: 'exitToMarbleGallery',
            positionX: 16,
            positionY: 132,
        },
        fromOuterWallToWarpRooms: { // fromWarpRoomsToOuterWall
            sourceStage: 'outerWall',
            targetStage: 'warpRooms',
            room: 'elevatorShaftRoom',
            positionX: 272,
            positionY: 644,
        },
        fromRoyalChapelToAlchemyLaboratory: { // fromAlchemyLaboratoryToRoyalChapel
            sourceStage: 'royalChapel',
            targetStage: 'alchemyLaboratory',
            room: 'statueLedge',
            positionX: 240,
            positionY: 132,
        },
        fromRoyalChapelToCastleKeep: { // fromCastleKeepToRoyalChapel
            sourceStage: 'royalChapel',
            targetStage: 'castleKeep',
            room: 'rightTower',
            positionX: 752,
            positionY: 648,
        },
        fromRoyalChapelToColosseum: { // fromColosseumToRoyalChapel
            sourceStage: 'royalChapel',
            targetStage: 'colosseum',
            room: 'nave',
            positionX: 496,
            positionY: 388,
        },
        fromRoyalChapelToOlroxsQuarters: { // fromOlroxsQuartersToRoyalChapel
            sourceStage: 'royalChapel',
            targetStage: 'olroxsQuarters',
            room: 'pushingStatueShortcut',
            positionX: 240,
            positionY: 132,
        },
        fromUndergroundCavernsToAbandonedMine: { // fromAbandonedMineToUndergroundCaverns
            sourceStage: 'undergroundCaverns',
            targetStage: 'abandonedMine',
            room: 'exitToAbandonedMine',
            positionX: 16,
            positionY: 132,
        },
        fromUndergroundCavernsToCastleEntrance: { // fromCastleEntranceToUndergroundCaverns
            sourceStage: 'undergroundCaverns',
            targetStage: 'castleEntrance',
            room: 'exitToCastleEntrance',
            positionX: 16,
            positionY: 132,
        },
        fromUndergroundCavernsToMarbleGallery: { // fromMarbleGalleryToUndergroundCaverns
            sourceStage: 'undergroundCaverns',
            targetStage: 'marbleGallery',
            room: 'longDrop',
            positionX: 240,
            positionY: 132,
        },
        fromWarpRoomsToAbandonedMine: { // fromAbandonedMineToWarpRooms
            sourceStage: 'warpRooms',
            targetStage: 'abandonedMine',
            room: 'warpRoomToAbandonedMine',
            positionX: 16,
            positionY: 132,
        },
        fromWarpRoomsToCastleEntrance: { // fromCastleEntranceToWarpRooms
            sourceStage: 'warpRooms',
            targetStage: 'castleEntrance',
            room: 'warpRoomToCastleEntrance',
            positionX: 240,
            positionY: 132,
        },
        fromWarpRoomsToCastleKeep: { // fromCastleKeepToWarpRooms
            sourceStage: 'warpRooms',
            targetStage: 'castleKeep',
            room: 'warpRoomToCastleKeep',
            positionX: 16,
            positionY: 132,
        },
        fromWarpRoomsToOlroxsQuarters: { // fromOlroxsQuartersToWarpRooms
            sourceStage: 'warpRooms',
            targetStage: 'olroxsQuarters',
            room: 'warpRoomToOlroxsQuarters',
            positionX: 16,
            positionY: 132,
        },
        fromWarpRoomsToOuterWall: { // fromOuterWallToWarpRooms
            sourceStage: 'warpRooms',
            targetStage: 'outerWall',
            room: 'warpRoomToOuterWall',
            positionX: 240,
            positionY: 132,
        },
    }

    function getEdges(logic, startingState) {
        // NOTE(sestren): Starting state is assumed to be in Castle Entrance for now, and will probably not work for other stages yet
        const TIME_BUDGET = startingState.time
        // Calculate edges between nodes that are traversable from the starting node
        const visits = new Map()
        const work = [
            {
                stageName: 'castleEntrance',
                nodeName: 'locationCubeOfZoe',
                state: findGoal(logic, startingState, NODES.castleEntrance.locationCubeOfZoe.requirement, true),
            },
        ]
        visits.set([work.at(-1).stageName, work.at(-1).nodeName].join('.'), work.at(-1))
        const result = {
            'castleEntrance.start': {
                'castleEntrance.locationCubeOfZoe': TIME_BUDGET - work.at(-1).state.time,
            },
        }
        while (work.length > 0) {
            const prevVisitInfo = work.pop()
            const prevVisitId = [prevVisitInfo.stageName, prevVisitInfo.nodeName].join('.')
            // traverse from previous node to every other node (current) in the stage
            Object.entries(NODES[prevVisitInfo.stageName])
            .filter(([currentNodeName, currentNode]) => {
                return (prevVisitInfo.nodeName !== currentNodeName)
            })
            .forEach(([currentNodeName, currentNode]) => {
                const currentVisitId = [prevVisitInfo.stageName, currentNodeName].join('.')
                prevVisitInfo.state.time = TIME_BUDGET
                const currentState = findGoal(logic, prevVisitInfo.state, currentNode.requirement, true)
                if (currentState !== null) {
                    const currentVisitInfo = {
                        stageName: currentState.stage,
                        nodeName: currentNodeName,
                        state: currentState,
                    }
                    if (!(visits.has(currentVisitId))) {
                        work.push(currentVisitInfo)
                        visits.set(currentVisitId, currentVisitInfo)
                    }
                    if (!(prevVisitId in result)) {
                        result[prevVisitId] = {}
                    }
                    result[prevVisitId][currentVisitId] = TIME_BUDGET - currentState.time
                }
            })
            // if previous node is an exit, push the node paired with it to the work stack
            const prevNode = NODES[prevVisitInfo.stageName][prevVisitInfo.nodeName]
            if (['exit', 'warp'].includes(prevNode.nodeType)) {
                const prevState = prevVisitInfo.state
                const currentState = Object.assign({}, prevState)
                currentState.time = TIME_BUDGET
                logic[prevState.stage][prevState.room]
                .filter((command) => {
                    return (
                        command.outcome.room.startsWith('triggerTeleporterTo') &&
                        isValidRequirement(prevState, command.requirement)
                    )
                })
                .find((command) => {
                    // Exit the loading room toward the paired room
                    updateStateWithOutcome(currentState, command.outcome)
                    // Trigger the teleporter
                    const triggerCommand = logic[currentState.stage][currentState.room].at(0)
                    updateStateWithOutcome(currentState, triggerCommand.outcome)
                    return true
                })
                const nextState = Object.assign({}, currentState)
                logic[currentState.stage][currentState.room]
                .filter((command) => {
                    return (
                        'room' in command.outcome &&
                        command.outcome.room.startsWith('loadingRoomTo') &&
                        isValidRequirement(currentState, command.requirement)
                    )
                })
                .find((command) => {
                    // Exit the paired room toward the loading room
                    updateStateWithOutcome(nextState, command.outcome)
                    return true
                })
                const nextVisitInfo = {
                    stageName: nextState.stage,
                    nodeName: nextState.room,
                    state: nextState,
                }
                const nextVisitId = [nextVisitInfo.stageName, nextVisitInfo.nodeName].join('.')
                if (!(visits.has(nextVisitId))) {
                    work.push(nextVisitInfo)
                    visits.set(nextVisitId, nextVisitInfo)
                }
                if (!(prevVisitId in result)) {
                    result[prevVisitId] = {}
                }
                result[prevVisitId][nextVisitId] = TIME_BUDGET - nextState.time
            }
        }
        return result
    }

    function getLocationRewardCommands(settings) {
        const result = []
        Object.entries(LOGIC.locations ?? {})
        .forEach(([locationName, locationInfo]) => {
            // Process every location requirement (Only certain stages for now)
            locationInfo.requirements
            .filter((locationRequirementInfo) => {
                return locationRequirementInfo.stage in ROOM_PRIORITY
            })
            .forEach((locationRequirementInfo) => {
                const stageName = locationRequirementInfo.stage
                const roomName = locationRequirementInfo.room
                const location = {
                    stage: stageName,
                    room: roomName,
                    section: 'NONE',
                    positionX: locationInfo.outcome.positionX,
                    positionY: locationInfo.outcome.positionY,
                }
                updateLocation(location, settings)
                // Process every reward requirement
                const command = {
                    outcome: Object.assign({}, locationInfo.outcome),
                    requirement: Object.assign({}, locationRequirementInfo),
                }
                command.requirement.section = location.section
                result.push(command)
                if (locationName in settings.locationRewards) {
                    const rewardName = settings.locationRewards[locationName]
                    LOGIC.rewards[rewardName].requirements
                    .forEach((rewardRequirementInfo) => {
                        const command = {
                            outcome: {},
                            requirement: {},
                        }
                        Object.assign(command.outcome, locationInfo.outcome)
                        Object.assign(command.outcome, LOGIC.rewards[rewardName].outcome)
                        Object.assign(command.requirement, locationRequirementInfo)
                        Object.entries(rewardRequirementInfo)
                        .forEach(([propertyKey, propertyInfo]) => {
                            if (propertyKey == 'costs') {
                                Object.entries(propertyInfo)
                                .forEach(([costKey, costValue]) => {
                                    switch (typeof costValue) {
                                        case 'number':
                                            command.requirement[costKey] = {
                                                minimum: costValue,
                                            }
                                            command.outcome[costKey] = {
                                                operation: 'add',
                                                value: -1 * costValue,
                                            }
                                            break
                                        default:
                                            command.outcome[costKey] = costValue
                                            break
                                    }
                                })
                            }
                            else {
                                command.requirement[propertyKey] = propertyInfo
                            }
                        })
                        command.requirement.section = location.section
                        result.push(command)
                    })
                }
            })
        })
        return result
    }

    function getLogic(settings, enableElsewhere=false) {
        const result = {}
        const roomPositions = settings.roomPositions ?? []
        // Process every location-reward combination
        roomPositions
        .forEach((roomPosition) => {
            if (!(roomPosition.stage in result)) {
                result[roomPosition.stage] = {}
            }
            if (!(roomPosition.room in result[roomPosition.stage])) {
                result[roomPosition.stage][roomPosition.room] = []
            }
            if (
                !(roomPosition.stage in ROOMS_INFO) ||
                !(roomPosition.room in ROOMS_INFO[roomPosition.stage]) ||
                !('commands' in ROOMS_INFO[roomPosition.stage][roomPosition.room])
            ) {
                // console.log('***', roomPosition.stage, roomPosition.room)
                return
            }
            Object.entries(ROOMS_INFO[roomPosition.stage][roomPosition.room].commands)
            .forEach(([commandName, commandInfo]) => {
                commandInfo.requirements
                .forEach((requirementInfo) => {
                    const command = {
                        outcome: JSON.parse(JSON.stringify(commandInfo.outcome)),
                        requirement: {},
                    }
                    Object.entries(requirementInfo)
                    .forEach(([propertyKey, propertyInfo]) => {
                        if (propertyKey == 'costs') {
                            Object.entries(propertyInfo)
                            .forEach(([costKey, costValue]) => {
                                switch (typeof costValue) {
                                    case 'number':
                                        command.requirement[costKey] = {
                                            minimum: costValue,
                                        }
                                        command.outcome[costKey] = {
                                            operation: 'add',
                                            value: -1 * costValue,
                                        }
                                        break
                                    default:
                                        command.outcome[costKey] = costValue
                                        break
                                }
                            })
                        }
                        else {
                            command.requirement[propertyKey] = propertyInfo
                        }
                    })
                    // NOTE(sestren): Location is the only "weird" set of properties
                    if (
                        'stage' in command.outcome ||
                        'room' in command.outcome ||
                        'section' in command.outcome ||
                        'positionX' in command.outcome ||
                        'positionY' in command.outcome ||
                        'staleLocation' in command.outcome
                    ) {
                        const location = {
                            stage: command.outcome.stage ?? roomPosition.stage ?? 'NONE',
                            room: command.outcome.room ?? roomPosition.room ?? 'NONE',
                            section: command.outcome.section ?? command.requirement.section ?? 'NONE',
                            positionX: command.outcome.positionX ?? 0,
                            positionY: command.outcome.positionY ?? 0,
                            staleLocation: command.outcome.staleLocation ?? false,
                        }
                        updateLocation(location, settings, false)
                        Object.entries(location)
                        .forEach(([propertyKey, propertyValue]) => {
                            command.outcome[propertyKey] = propertyValue
                        })
                    }
                    result[roomPosition.stage][roomPosition.room].push(command)
                })
            })
        })
        // Process every location-reward combination
        if ('locationRewards' in settings) {
            getLocationRewardCommands(settings)
            .forEach((command) => {
                const reducedCommand = Object.assign({}, command)
                const stageName = reducedCommand.requirement.stage
                const roomName = reducedCommand.requirement.room
                delete reducedCommand.requirement.stage
                delete reducedCommand.requirement.room
                if (!(stageName in result)) {
                    result[stageName] = {}
                }
                if (!(roomName in result[stageName])) {
                    result[stageName][roomName] = []
                }
                result[stageName][roomName].push(reducedCommand)
            })
        }
        // Process every stage link
        Object.entries(settings.stageLinks ?? {})
        .filter(([sourceTeleporterName, targetTeleporterName]) => {
            return (
                (
                    sourceTeleporterName.startsWith('fromAbandonedMine') ||
                    sourceTeleporterName.startsWith('fromAlchemyLaboratory') ||
                    sourceTeleporterName.startsWith('fromCastleEntrance') ||
                    sourceTeleporterName.startsWith('fromCastleKeep') ||
                    sourceTeleporterName.startsWith('fromCatacombs') ||
                    sourceTeleporterName.startsWith('fromClockTower') ||
                    sourceTeleporterName.startsWith('fromColosseum') ||
                    sourceTeleporterName.startsWith('fromLongLibrary') ||
                    sourceTeleporterName.startsWith('fromMarbleGallery') ||
                    sourceTeleporterName.startsWith('fromOlroxsQuarters') ||
                    sourceTeleporterName.startsWith('fromOuterWall') ||
                    sourceTeleporterName.startsWith('fromRoyalChapel') ||
                    sourceTeleporterName.startsWith('fromUndergroundCaverns') ||
                    sourceTeleporterName.startsWith('fromWarpRooms')
                ) && (
                    targetTeleporterName.startsWith('fromAbandonedMine') ||
                    targetTeleporterName.startsWith('fromAlchemyLaboratory') ||
                    targetTeleporterName.startsWith('fromCastleEntrance') ||
                    targetTeleporterName.startsWith('fromCastleKeep') ||
                    targetTeleporterName.startsWith('fromCatacombs') ||
                    targetTeleporterName.startsWith('fromClockTower') ||
                    targetTeleporterName.startsWith('fromColosseum') ||
                    targetTeleporterName.startsWith('fromLongLibrary') ||
                    targetTeleporterName.startsWith('fromMarbleGallery') ||
                    targetTeleporterName.startsWith('fromOlroxsQuarters') ||
                    targetTeleporterName.startsWith('fromOuterWall') ||
                    targetTeleporterName.startsWith('fromRoyalChapel') ||
                    targetTeleporterName.startsWith('fromUndergroundCaverns') ||
                    targetTeleporterName.startsWith('fromWarpRooms')
                )
            )
        })
        .forEach(([sourceTeleporterName, targetTeleporterName]) => {
            const location = {
                stage: TELEPORTERS[targetTeleporterName].sourceStage,
                room: TELEPORTERS[targetTeleporterName].room,
                section: 'NONE',
                positionX: TELEPORTERS[targetTeleporterName].positionX,
                positionY: TELEPORTERS[targetTeleporterName].positionY,
            }
            updateLocation(location, settings)
            const command = {
                outcome: location,
                requirement: {},
            }
            const sourceStageName = TELEPORTERS[sourceTeleporterName].sourceStage
            const otherStageName = TELEPORTERS[sourceTeleporterName].targetStage
            const sourceRoomName = 'triggerTeleporterTo' + otherStageName.at(0).toUpperCase() + otherStageName.slice(1)
            result[sourceStageName][sourceRoomName].push(command)
        })
        // Link any unlinked stages to a universal hub for testing purposes
        if (enableElsewhere) {
            result.elsewhere = {
                hub: [],
            }
            Object.entries(ROOM_PRIORITY)
            .filter(([stageName, roomNames]) => {
                return stageName in result
            })
            .forEach(([stageName, roomNames]) => {
                roomNames
                .filter((roomName) => {
                    return roomName.startsWith('loadingRoomTo') && roomName in result[stageName]
                })
                .filter((roomName) => {
                    let linkCount = -1
                    result[stageName][roomName]
                    .find((command) => {
                        if (command.outcome.room.startsWith('triggerTeleporterTo')) {
                            linkCount = result[stageName][command.outcome.room].length
                            // console.log(command.outcome.room, ':', result[stageName][command.outcome.room])
                        }
                    })
                    return linkCount === 0
                })
                .forEach((roomName) => {
                    // console.log(`Add link to universal hub for (${stageName}.${roomName})`)
                    result.elsewhere.hub.push({
                        outcome: {
                            stage: stageName,
                            room: roomName,
                            section: 'main',
                        },
                        requirement: {
                            stage: 'elsewhere',
                            room: 'hub',
                            debugEnableElsewhere: true,
                        },
                    })
                    result[stageName][roomName].push({
                        outcome: {
                            stage: 'elsewhere',
                            room: 'hub',
                            section: 'main',
                        },
                        requirement: {
                            stage: stageName,
                            room: roomName,
                            section: 'main',
                            debugEnableElsewhere: true,
                        },
                    })
                })
            })
        }
        return result
    }

    function getMovement(requirementName, section, time) {
        const result = {
            section: section,
            costs: {
                time: time,
            },
        }
        switch (requirementName) {
            case 'basic':
            case 'fall':
            case 'jump':
                break
            case 'basicRisky':
                result.techniqueLogicalRisks = true
                break
            case 'preciseJump':
                result.techniquePreciseJump = true
                break
            case 'batForm':
                result.progressionBatTransformation = true
                break
            case 'bladeDash':
                result.progressionBladeDash = true
                result.techniqueBladeDash = true
                break
            case 'chainedRisingUppercuts':
                result.progressionRisingUppercut = true
                result.techniqueRisingUppercut = true
                result.techniqueChainedRisingUppercuts = true
                break
            case 'doubleJump':
                result.progressionDoubleJump = true
                break
            case 'gravityJump':
                result.progressionGravityJump = true
                break
            case 'mistForm':
                result.progressionMistTransformation = true
                break
            case 'multipleGravityJumps':
            case 'multipleGravityJumpsWithDoubleJump':
                result.progressionDoubleJump = true
                result.progressionGravityJump = true
                break
            case 'poweredMist':
            case 'poweredMistForm':
                result.progressionMistTransformation = true
                result.progressionLongerMistDuration = true
                break
            case 'poweredMistLong':
            case 'poweredMistFormLong':
                result.progressionMistTransformation = true
                result.progressionLongerMistDuration = true
                result.techniqueLongPoweredMistTravel = true
                break
            case 'risingUppercut':
                result.progressionRisingUppercut = true
                result.techniqueRisingUppercut = true
                break
            case 'wolfForm':
                result.progressionWolfTransformation = true
                break
            case 'wolfMistRise':
            case 'wolfMistRiseShort':
                result.progressionWolfTransformation = true
                result.progressionMistTransformation = true
                result.techniqueWolfMistRise = true
                break
            case 'wolfMistRiseLong':
                result.progressionWolfTransformation = true
                result.progressionMistTransformation = true
                result.techniqueWolfMistRise = true
                result.techniqueLongWolfMistRise = true
                break
            case 'wolfMistRiseVeryLong':
                result.progressionWolfTransformation = true
                result.progressionMistTransformation = true
                result.techniqueWolfMistRise = true
                result.techniqueLongWolfMistRise = true
                result.techniqueVeryLongWolfMistRise = true
                break
            default:
                result.UNKNOWN_MOVEMENT_REQUIREMENT = true
                break
        }
        return result
    }

    function getUpwardMovement(requirementName, section, time, positionX, positionY) {
        let currentPositionY = positionY
        let deltaY = 0
        switch (requirementName) {
            // case 'bladeDash':
            case 'jump':
                deltaY = DISTANCE_JUMP_FULL
                break
            case 'doubleJump':
                deltaY = DISTANCE_DOUBLE_JUMP
                break
            case 'gravityJump':
                deltaY = DISTANCE_GRAVITY_JUMP
                break
            case 'poweredMistForm':
                deltaY = DISTANCE_DOUBLE_JUMP
                break
            default:
                break
        }
        currentPositionY -= deltaY
        if (currentPositionY < DISTANCE_TILE) {
            currentPositionY -= DISTANCE_VERTICAL_SCREEN_TRANSITION
        }
        const result = {
            outcome: {
                positionX: positionX,
                positionY: 0 - 24,
                verticalClimb: Math.max(currentPositionY - 24, 0),
            },
            requirements: [
                getMovement(requirementName, section, time),
            ],
        }
        return result
    }

    function getRegion(section, left, top, width, height) {
        const result = {
            requirements: [
                {
                    positionX: {
                        minimum: left,
                        maximum: left + width - 1,
                    },
                    positionY: {
                        minimum: top,
                        maximum: top + height - 1,
                    },
                }
            ],
            outcome: {
                section: section,
            },
        }
        return result
    }

    function getRoomDimensions(roomPositions) {
        const result = {}
        Object.entries(ROOMS_INFO)
        .forEach(([stageName, stageInfo]) => {
            if (!(stageName in result)) {
                result[stageName] = {}
            }
            Object.entries(stageInfo)
            .forEach(([roomName, roomInfo]) => {
                if (!(roomName in result[stageName])) {
                    result[stageName][roomName] = {
                        width: roomInfo.roomInfo.width,
                        height: roomInfo.roomInfo.height,
                    }
                }
            })
        })
        roomPositions
        .filter((roomPosition) => {
            const validInd = (
                roomPosition.stage in result && 
                roomPosition.room in result[roomPosition.stage]
            )
            return validInd
        })
        .forEach((roomPosition) => {
            const roomInfo = result[roomPosition.stage][roomPosition.room]
            roomInfo.left = 256 * roomPosition.column
            roomInfo.top = 256 * roomPosition.row
            roomInfo.right = roomInfo.left + roomInfo.width
            roomInfo.bottom = roomInfo.top + roomInfo.height
        })
        return result
    }

    function findGoal(logic, startingState, goalState, sameStage=false) {
        // console.log('findGoal')
        let result = null
        const map = new Map()
        const subWork = [
            Object.assign({}, startingState),
        ]
        // map.set(hashedState(startingState), startingState)
        while (subWork.length > 0) {
            // console.log('subWork.length:', subWork.length, 'map.size:', map.size)
            const currentState = subWork.pop()
            if (sameStage && (currentState.stage !== startingState.stage)) {
                continue
            }
            // console.log('currentState:', currentState)
            logic[currentState.stage][currentState.room]
            .find((command) => {
                if (isValidRequirement(currentState, command.requirement)) {
                    const nextState = Object.assign({}, currentState)
                    updateStateWithOutcome(nextState, command.outcome)
                    if (nextState.section === 'NONE') {
                        // console.log('currentState:', currentState)
                        // console.log('nextState:', nextState)
                        throw Error('')
                    }
                    const nextStateHash = hashedState(nextState)
                    if (
                        !map.has(nextStateHash) ||
                        map.get(nextStateHash).time < nextState.time
                    ) {
                        map.set(nextStateHash, nextState)
                        if (isValidRequirement(nextState, goalState)) {
                            result = nextState
                            return true
                        } else {
                            subWork.push(nextState)
                        }
                    }
                    return false
                }
                return false
            })
            if (result !== null) {
                break
            }
        }
        return result
    }

    function validate(logic, validation) {
        if (validation.debug ?? false) {
            console.log('logic:', JSON.stringify(logic, null, 4))
        }
        let goalFound = findGoal(logic, validation.startingState, validation.goalState)
        let result = true
        switch (validation.goalType) {
            case 'required':
                result = (goalFound !== null)
                break
            case 'forbidden':
                result = (goalFound === null)
                break
        }
        return result
    }

    function hashedState(state, simple=false) {
        // Example: abandonedMine.bend.main.b8e6fb7c
        const elements = []
        elements.push(state.stage ?? 'NONE')
        elements.push(state.room ?? 'NONE')
        elements.push(state.section ?? 'NONE')
        if (!simple) {
            elements.push(hashedObject(state, ['stage', 'room', 'section', 'time', 'positionX', 'positionY']))
        }
        const result = elements.join('.')
        return result
    }

    function hashedObject(object, ignoredProperties=[]) {
        const elements = []
        Object.keys(object)
        .filter((key) => {
            return !(ignoredProperties.includes(key))
        })
        .sort()
        .forEach((key) => {
            switch (typeof object[key]) {
                case 'boolean':
                case 'number':
                case 'string':
                    elements.push([key, object[key]].join('='))
                    break
                case 'object':
                    elements.push([key, hashedObject(object[key])].join('='))
                    break
                default:
                    console.log('Unhandled key-value pair: ' + JSON.stringify(key) + ', ' + JSON.stringify(object[key]))
                    break
            }
        })
        const result = hashedText(elements.join('|'))
        return result
    }

    // Javascript implementation of DJBX33A as defined at https://stackoverflow.com/questions/10696223/reason-for-the-number-5381-in-the-djb-hash-function
    function hashedText(text) {
        const MOD = Math.pow(2, 32)
        let value = 5381
        for (let i = 0; i < text.length; i++) {
            value = ((33 * value) + text.charCodeAt(i)) % MOD
        }
        let result = ''
        for (let i = 0; i < 8; i++) {
            result += '0123456789abcdef'.at(value % 16)
            value = Math.floor(value / 16)
        }
        return result
    }

    function isValidRequirement(state, requirement) {
        const result = Object.entries(requirement)
        .every(([propertyKey, propertyInfo]) => {
            let stateValue
            switch (typeof propertyInfo) {
                case 'boolean':
                    if ((state[propertyKey] ?? false) !== propertyInfo) {
                        return false
                    }
                    break
                case 'string':
                    if ((state[propertyKey] ?? 'NONE') !== propertyInfo) {
                        return false
                    }
                    break
                case 'object':
                    stateValue = state[propertyKey] ?? 0
                    if ('minimum' in propertyInfo) {
                        if (stateValue < propertyInfo.minimum) {
                            return false
                        }
                    }
                    if ('maximum' in propertyInfo) {
                        if (stateValue > propertyInfo.maximum) {
                            return false
                        }
                    }
                    break
                default:
                    console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                    break
            }
            return true
        })
        return result
    }

    function shuffleArray(rng, array) {
        // Use Fisher-Yates to shuffle an array in-place
        for (let i = array.length - 1; i >= 1; i--) {
            const j = Math.floor(rng() * (i + 1))
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array
    }

    function simplify(state) {
        Object.entries(state)
        .filter(([propertyKey, propertyInfo]) => {
            return !(['stage', 'room', 'section', 'time', 'positionX', 'positionY', 'debugEnableElsewhere'].includes(propertyKey))
        })
        .forEach(([propertyKey, propertyInfo]) => {
            switch (typeof propertyInfo) {
                case 'boolean':
                    if (state[propertyKey] === false) {
                        delete state[propertyKey]
                    }
                    break
                case 'number':
                    if (state[propertyKey] === 0) {
                        delete state[propertyKey]
                    }
                    break
                case 'string':
                    if (state[propertyKey] === 'NONE') {
                        delete state[propertyKey]
                    }
                    break
            }
        })
    }

    function updateLocation(location, settings, simplifyState=true) {
        // console.log(location)
        // Determine which room the player is in
        if (
            location.positionX >= 0 &&
            location.positionX < ROOMS_INFO[location.stage][location.room].roomInfo.width &&
            location.positionY >= 0 &&
            location.positionY < ROOMS_INFO[location.stage][location.room].roomInfo.height &&
            !(location.staleLocation ?? false)
        ) {
            // Player is inside the bounds of the current room, so current room stays the same
            // TODO(sestren): This assumption might not work for the secret staircase in Castle Keep
        }
        else {
            // Calculate global position
            const globalPosition = {
                x: 0,
                y: 0,
            }
            settings.roomPositions
            .find((roomPosition) => {
                if (
                    roomPosition.stage === location.stage &&
                    roomPosition.room === location.room
                ) {
                    globalPosition.x = 256 * roomPosition.column + location.positionX
                    globalPosition.y = 256 * roomPosition.row + location.positionY
                    return true
                }
                return false
            })
            const roomDimensions = getRoomDimensions(settings.roomPositions)
            // Find first room in the priority list that overlaps the global position
            ROOM_PRIORITY[location.stage]
            .find((roomName) => {
                const roomDimension = roomDimensions[location.stage][roomName]
                if (
                    globalPosition.x >= roomDimension.left &&
                    globalPosition.x < roomDimension.right &&
                    globalPosition.y >= roomDimension.top &&
                    globalPosition.y < roomDimension.bottom &&
                    // Stale location processing must result in a different room
                    !(
                        (location.staleLocation ?? false) &&
                        (roomName === location.room)
                    )
                ) {
                    location.room = roomName
                    location.positionX = globalPosition.x - roomDimension.left
                    location.positionY = globalPosition.y - roomDimension.top
                    location.staleLocation = false
                    return true
                }
                return false
            })
        }
        // Find first section that satisfies requirements for the room-relative position
        ROOMS_INFO[location.stage][location.room].regions
        .find((regionInfo) => {
            location.section = 'NONE'
            let validRegion = false
            regionInfo.requirements
            .find((requirementInfo) => {
                const validRequirement = isValidRequirement(location, requirementInfo)
                if (validRequirement) {
                    updateStateWithOutcome(location, regionInfo.outcome, simplifyState)
                    validRegion = true
                }
                return validRequirement
            })
            return validRegion
        })
    }

    function updateStateWithOutcome(state, outcome, simplifyState=true) {
        Object.entries(outcome)
        .forEach(([propertyKey, propertyInfo]) => {
            switch (typeof propertyInfo) {
                case 'boolean':
                case 'number':
                case 'string':
                    state[propertyKey] = propertyInfo
                    break
                case 'object':
                    // Objects are assumed to modify numbers
                    switch (propertyInfo.operation) {
                        case 'replace':
                            state[propertyKey] = propertyInfo.value
                            break
                        case 'add':
                            if (!(propertyKey in state)) {
                                state[propertyKey] = 0
                            }
                            state[propertyKey] += propertyInfo.value
                            break
                        default:
                            console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                            break
                    }
                    break
                default:
                    console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                    break
            }
        })
        if (simplifyState) {
            simplify(state)
        }
    }

    const exports = {
        LOGIC: LOGIC,
        NODES: NODES,
        TELEPORTERS: TELEPORTERS,
        getEdges: getEdges,
        getLogic: getLogic,
        hashedObject: hashedObject,
        hashedText: hashedText,
        shuffleArray: shuffleArray,
        updateStateWithOutcome: updateStateWithOutcome,
        validate: validate,
    }
    if (self) {
        self.sotnShuffler = Object.assign(self.sotnShuffler || {}, {
            common: exports,
        })
    } else {
        module.exports = exports
    }
})(typeof (self) !== 'undefined' ? self : null)
