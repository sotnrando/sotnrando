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
            'Shuffle rooms within each stage',
        ],
    }

    const VALIDATIONS = {
        abandonedMine: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionDoubleJump: true,
                    progressionSummonDemonFamiliar: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusDemonSwitchActivated: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionDoubleJump: true,
                    progressionSummonDemonFamiliar: true,
                    statusDemonSwitchActivated: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationDemonCard: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionDoubleJump: true,
                    progressionSummonDemonFamiliar: true,
                    statusDemonSwitchActivated: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'abandonedMine',
                    room: 'cerberusRoom',
                    section: 'main',
                },
                goalType: 'required',
            },
        ],
        alchemyLaboratory: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionUnlockBlueDoors: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusCannonActivated: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionUnlockBlueDoors: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationBatCard: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionUnlockBlueDoors: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationSkillOfWolf: true,
                },
                goalType: 'required',
            },
        ],
        castleEntrance: [
            {
                startingState: {
                    stage: 'castleEntrance',
                    room: 'afterDrawbridge',
                    section: 'main',
                    debugEnableElsewhere: true,
                    time: 360.0,
                },
                goalState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    statusMetDeathInCastleEntrance: false,
                },
                goalType: 'forbidden',
            },
            {
                startingState: {
                    stage: 'castleEntrance',
                    room: 'afterDrawbridge',
                    section: 'main',
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionWolfTransformation: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionWolfTransformation: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionWolfTransformation: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionWolfTransformation: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusSecretWallInMermanRoomOpened: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionWolfTransformation: true,
                    statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                    statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                    statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                    statusSecretWallInMermanRoomOpened: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationCubeOfZoe: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionWolfTransformation: true,
                    statusPassageFromCastleEntranceToMarbleGalleryOpened: true,
                    statusPassageFromCastleEntranceToUndergroundCavernsOpened: true,
                    statusPassageFromCastleEntranceToWarpRoomsOpened: true,
                    statusSecretWallInMermanRoomOpened: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationPowerOfWolf: true,
                },
                goalType: 'required',
            },
        ],
        castleKeep: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationGhostCard: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationLeapStone: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationPowerOfMist: true,
                },
                goalType: 'required',
            },
        ],
        catacombs: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    itemSpikeBreaker: 1,
                    progressionBatTransformation: true,
                    progressionEcholocation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationSpikeBreaker: true,
                },
                goalType: 'required',
            },
        ],
        clockTower: [
            // {
            //     startingState: {
            //         stage: 'elsewhere',
            //         room: 'hub',
            //         section: 'main',
            //         progressionBatTransformation: true,
            //         debugEnableElsewhere: true,
            //         time: 120.0,
            //     },
            //     goalState: {
            //         statusLeftGearRoomSolved: true,
            //     },
            //     goalType: 'required',
            // },
            // {
            //     startingState: {
            //         stage: 'elsewhere',
            //         room: 'hub',
            //         section: 'main',
            //         progressionBatTransformation: true,
            //         debugEnableElsewhere: true,
            //         time: 120.0,
            //     },
            //     goalState: {
            //         statusRightGearRoomSolved: true,
            //     },
            //     goalType: 'required',
            // },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    statusLeftGearRoomSolved: true,
                    statusRightGearRoomSolved: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationFireOfBat: true,
                },
                goalType: 'required',
            },
            // NOTE(sestren): It should be possible to traverse the stage both ways without solving the Gear Puzzle
            {
                startingState: {
                    stage: 'clockTower',
                    room: 'loadingRoomToOuterWall',
                    section: 'main',
                    progressionBatTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'clockTower',
                    room: 'loadingRoomToCastleKeep',
                    section: 'main',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'clockTower',
                    room: 'loadingRoomToCastleKeep',
                    section: 'main',
                    progressionBatTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'clockTower',
                    room: 'loadingRoomToOuterWall',
                    section: 'main',
                },
                goalType: 'required',
            },
        ],
        colosseum: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationFormOfMist: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusBarrierInColosseumOpened: true,
                },
                goalType: 'required',
            },
        ],
        longLibrary: [
            {
                startingState: {
                    stage: 'longLibrary',
                    room: 'outsideShop',
                    section: 'main',
                    progressionDoubleJump: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'longLibrary',
                    room: 'outsideShop',
                    section: 'main',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'longLibrary',
                    room: 'threeLayerRoom',
                    section: 'topLayer',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'longLibrary',
                    room: 'threeLayerRoom',
                    section: 'main',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'longLibrary',
                    room: 'threeLayerRoom',
                    section: 'bottomLayer',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'longLibrary',
                    room: 'shop',
                    section: 'beneathShop',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationFaerieCard: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationFaerieScroll: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    progressionItemMaterialization: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationJewelOfOpen: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationSoulOfBat: true,
                },
                goalType: 'required',
            },
        ],
        marbleGallery: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionItemMaterialization: true,
                    progressionUnlockBlueDoors: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusPressurePlateInMarbleGalleryActivated: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionItemMaterialization: true,
                    progressionUnlockBlueDoors: true,
                    statusPressurePlateInMarbleGalleryActivated: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationGravityBoots: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionItemMaterialization: true,
                    progressionUnlockBlueDoors: true,
                    statusPressurePlateInMarbleGalleryActivated: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationSpiritOrb: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionItemMaterialization: true,
                    progressionUnlockBlueDoors: true,
                    statusPressurePlateInMarbleGalleryActivated: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'marbleGallery',
                    room: 'clockRoom',
                    section: 'main',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'marbleGallery',
                    room: 'clockRoom',
                    section: 'main',
                },
                goalType: 'required',
            },
        ],
        olroxsQuarters: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationEchoOfBat: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationSwordCard: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'olroxsQuarters',
                    room: 'olroxsRoom',
                    section: 'main',
                },
                goalType: 'required',
            },
        ],
        outerWall: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'outerWall',
                    room: 'doppelgangerRoom',
                    section: 'main',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationSoulOfWolf: true,
                },
                goalType: 'required',
            },
        ],
        royalChapel: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    itemSpikeBreaker: 1,
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    progressionUnlockBlueDoors: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusStatueInRoyalChapelMoved: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    itemSpikeBreaker: 1,
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    progressionUnlockBlueDoors: true,
                    statusStatueInRoyalChapelMoved: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    stage: 'royalChapel',
                    room: 'hippogryphRoom',
                    section: 'main',
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    itemSpikeBreaker: 1,
                    progressionBatTransformation: true,
                    progressionMistTransformation: true,
                    progressionUnlockBlueDoors: true,
                    statusStatueInRoyalChapelMoved: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationSilverRing: true,
                },
                goalType: 'required',
            },
        ],
        undergroundCaverns: [
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionProtectionFromWater: true,
                    progressionSummonFerryman: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationGoldRing: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionProtectionFromWater: true,
                    progressionSummonFerryman: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationHolySymbol: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionProtectionFromWater: true,
                    progressionSummonFerryman: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    locationMermanStatue: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionProtectionFromWater: true,
                    progressionSummonFerryman: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusButtonInUndergroundCavernsActivated: true,
                },
                goalType: 'required',
            },
            {
                startingState: {
                    stage: 'elsewhere',
                    room: 'hub',
                    section: 'main',
                    progressionBatTransformation: true,
                    progressionProtectionFromWater: true,
                    progressionSummonFerryman: true,
                    statusButtonInUndergroundCavernsActivated: true,
                    techniqueLogicalRisks: true,
                    debugEnableElsewhere: true,
                    time: 120.0,
                },
                goalState: {
                    statusBridgeInUndergroundCavernsBroken: true,
                },
                goalType: 'required',
            },
        ],
    }

    const COLLISIONS = {
        'alchemyLaboratory.entryway.top': '######....######',
        'alchemyLaboratory.glassVats.bottom': '######....######',
        'alchemyLaboratory.redSkeletonLiftRoom.top': '######....######',
        'alchemyLaboratory.redSkeletonLiftRoom.bottom': '######....######',
        'alchemyLaboratory.secretLifeMaxUpRoom.top': '######....######',
        'alchemyLaboratory.tallZigZagRoom.bottom': '######....######',
        // 'marbleGallery.beneathLeftTrapdoor.top': '######....######',
        // 'marbleGallery.stopwatchRoom.bottom': '######....######',
        'marbleGallery.beneathRightTrapdoor.top': '######....######',
        'marbleGallery.clockRoom.top': '######....######',
        'marbleGallery.gravityBootsRoom.bottom': '######....######',
        'marbleGallery.slingerStaircase.bottom': '######....######',
        'olroxsQuarters.catwalkCrypt.top': '######....######',
        'olroxsQuarters.tallShaft.top': '######....######',
        'olroxsQuarters.openCourtyard.top': '######....######',
        'olroxsQuarters.prison.bottomLeft': '######....######',
        'olroxsQuarters.prison.bottomRight': '######....######',
        'olroxsQuarters.swordCardRoom.bottom': '######....######',
    }

    function fillRect(colorIndex, top, left, rows = 1, columns = 1) {
        const result = {
            command: 'fillRect',
            parameters: {
                colorIndex: colorIndex,
                top: top,
                left: left,
                rows: rows,
                columns: columns,
            },
        }
        return result
    }

    const GLYPHS = {
        'C': [
            '###',
            '#..',
            '###',
        ],
        'D': [
            '##.',
            '#.#',
            '##.',
        ],
        'H': [
            '#.#',
            '###',
            '#.#',
        ],
        'I': [
            '###',
            '.#.',
            '###',
        ],
        'J': [
            '###',
            '.#.',
            '##.',
        ],
        'K': [
            '#.#',
            '##.',
            '#.#',
        ],
        'L': [
            '#..',
            '#..',
            '###',
        ],
        'N': [
            '###',
            '#.#',
            '#.#',
        ],
        'S': [
            '.##',
            '.#.',
            '##.',
        ],
        'T': [
            '###',
            '.#.',
            '.#.',
        ],
        'U': [
            '#.#',
            '#.#',
            '###',
        ],
        'V': [
            '#.#',
            '#.#',
            '.#.',
        ],
        'X': [
            '#.#',
            '.#.',
            '#.#',
        ],
        'Y': [
            '#.#',
            '.#.',
            '.#.',
        ],
        'Z': [
            '##.',
            '.#.',
            '.##',
        ],
        '1': [
            '.#.',
            '.#.',
            '.#.',
        ],
        '4': [
            '#.#',
            '###',
            '..#',
        ],
        '7': [
            '###',
            '..#',
            '..#',
        ],
        '+': [
            '.#.',
            '###',
            '.#.',
        ],
        '-': [
            '...',
            '###',
            '...',
        ],
        '#': [
            '###',
            '###',
            '###',
        ],
    }

    function drawGlyph(colorIndex, glyphName = 'C', top = 1, left = 1) {
        const result = {
            command: 'drawGlyph',
            parameters: {
                colorIndex: colorIndex,
                glyph: GLYPHS[glyphName],
                top: top,
                left: left,
            },
        }
        return result
    }

    const COLORS = {
        loadingRoom: '0',
        obstacle: '0',
        redDoor: '4',
        saveRoom: '4',
        wall: '0',
        // Stage colors
        abandonedMine: '1',
        alchemyLaboratory: '6',
        castleCenter: 'a',
        castleKeep: 'f',
        castleEntrance: '7',
        catacombs: '8',
        clockTower: '5',
        colosseum: '9',
        longLibrary: '5',
        marbleGallery: 'a',
        royalChapel: 'c',
        olroxsQuarters: 'b',
        outerWall: 'f',
        undergroundCaverns: '1',
        warpRooms: '5',
    }

    const NODE_GROUPS = {
        abandonedMine: {
            bend: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "triggerTeleporterToCatacombs",
                        row: 1,
                        column: 0,
                    },
                    {
                        stage: "abandonedMine",
                        room: "loadingRoomToCatacombs",
                        row: 1,
                        column: 1,
                    },
                    {
                        stage: "abandonedMine",
                        room: "bend",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "..0",
                    "#=0",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "bend",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            cerberusRoom: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "wellLitSkullRoom",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "abandonedMine",
                        room: "cerberusRoom",
                        row: 0,
                        column: 2,
                    },
                    {
                        stage: "abandonedMine",
                        room: "demonSwitch",
                        row: 0,
                        column: 4,
                    },
                ],
                cells: [
                    "11223",
                    "....3",
                    "....3",
                    "....3",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "wellLitSkullRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "demonSwitch",
                        collision: "######....######",
                        row: 0.5,
                        column: 5,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "demonSwitch",
                        collision: "######....######",
                        row: 4,
                        column: 4.5,
                    },
                ],
            },
            demonCard: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "demonCard",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "44",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "demonCard",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            fourWayIntersection: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "fourWayIntersection",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "abandonedMine",
                        room: "loadingRoomToWarpRooms",
                        row: 0,
                        column: 3,
                    },
                    {
                        stage: "abandonedMine",
                        room: "triggerTeleporterToWarpRooms",
                        row: 0,
                        column: 4,
                    },
                ],
                cells: [
                    "555=#",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "fourWayIntersection",
                        collision: "######....######",
                        row: 0,
                        column: 1.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "fourWayIntersection",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "fourWayIntersection",
                        collision: "######....######",
                        row: 1,
                        column: 1.5,
                    },
                ],
            },
            karmaCoinRoom: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "karmaCoinRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "6",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "karmaCoinRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            lowerStairwell: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "lowerStairwell",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "7",
                    "7",
                    "7",
                    "7",
                ],
                edges: [
                    {
                        edgeName: "leftLower",
                        roomName: "lowerStairwell",
                        collision: "######....######",
                        row: 3.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "lowerStairwell",
                        collision: "######....######",
                        row: 3.5,
                        column: 1,
                    },
                    {
                        edgeName: "top",
                        roomName: "lowerStairwell",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                ],
            },
            peanutsRoom: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "peanutsRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "8",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "peanutsRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            saveRoom: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "saveRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "9",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            snakeColumn: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "snakeColumn",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "a",
                    "a",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "snakeColumn",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "snakeColumn",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                ],
            },
            venusWeedRoom: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "venusWeedRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "bbbb",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "venusWeedRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "venusWeedRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
            wolfsHeadColumn: {
                rooms: [
                    {
                        stage: "abandonedMine",
                        room: "wolfsHeadColumn",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "abandonedMine",
                        room: "loadingRoomToUndergroundCaverns",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "abandonedMine",
                        room: "triggerTeleporterToUndergroundCaverns",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "c=#",
                    "c..",
                    "c..",
                    "c..",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "wolfsHeadColumn",
                        collision: "######....######",
                        row: 2.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "wolfsHeadColumn",
                        collision: "######....######",
                        row: 3.5,
                        column: 1,
                    },
                ],
            },
        },
        alchemyLaboratory: {
            entryway: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "entryway",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "loadingRoomToCastleEntrance",
                        row: 0,
                        column: 3,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "triggerTeleporterToCastleEntrance",
                        row: 0,
                        column: 4,
                    },
                ],
                cells: [
                    "000=#",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "entryway",
                        collision: "######...#######",
                        row: 0,
                        column: 1.5,
                    },
                ],
            },
            exitToRoyalChapel: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "triggerTeleporterToRoyalChapel",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "loadingRoomToRoyalChapel",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "exitToRoyalChapel",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=1",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "exitToRoyalChapel",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            exitToMarbleGallery: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "exitToMarbleGallery",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "loadingRoomToMarbleGallery",
                        row: 1,
                        column: 2,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "triggerTeleporterToMarbleGallery",
                        row: 1,
                        column: 3,
                    },
                ],
                cells: [
                    "22..",
                    "22=#",
                    "22..",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "exitToMarbleGallery",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                ],
            },
            slograAndGaibonRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "tallSpittleboneRoom",
                        row: 1,
                        column: 0,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "slograAndGaibonRoom",
                        row: 1,
                        column: 1,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "tetrominoRoom",
                        row: 0,
                        column: 5,
                    },
                    {
                        stage: "alchemyLaboratory",
                        room: "batCardRoom",
                        row: 1,
                        column: 5,
                    },
                ],
                cells: [
                    ".....x3",
                    "4555533",
                    "4555533",
                    "4......",
                    "4......",
                    "4......",
                ],
                edges: [
                    {
                        edgeName: "leftUpperOnTheLeft",
                        roomName: "tallSpittleboneRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLowerOnTheLeft",
                        roomName: "tallSpittleboneRoom",
                        collision: "######....######",
                        row: 4.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightLowerOnTheLeft",
                        roomName: "tallSpittleboneRoom",
                        collision: "######....######",
                        row: 4.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightUpperOnTheRight",
                        roomName: "tetrominoRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 7,
                    },
                    {
                        edgeName: "rightOnTheRight",
                        roomName: "tetrominoRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 7,
                    },
                    {
                        edgeName: "rightLowerOnTheRight",
                        roomName: "tetrominoRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 7,
                    },
                ],
            },
            bloodyZombieHallway: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "bloodyZombieHallway",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "6666",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "bloodyZombieHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "bloodyZombieHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
            blueDoorHallway: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "blueDoorHallway",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "77",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "blueDoorHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "blueDoorHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            boxPuzzleRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "boxPuzzleRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "88",
                    "88",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "boxPuzzleRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "boxPuzzleRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "boxPuzzleRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 2,
                    },
                ],
            },
            cannonRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "cannonRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "9",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "cannonRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "cannonRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            clothCapeRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "clothCapeRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "a",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "clothCapeRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            corridorToElevator: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "corridorToElevator",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "bb",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "corridorToElevator",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "corridorToElevator",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            elevatorShaft: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "elevatorShaft",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "c",
                    "c",
                    "c",
                    "c",
                    "c",
                    "c",
                    "c",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "elevatorShaft",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "left",
                        roomName: "elevatorShaft",
                        collision: "######....######",
                        row: 3.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "elevatorShaft",
                        collision: "######....######",
                        row: 6.5,
                        column: 0,
                    },
                ],
            },
            emptyZigZagRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "emptyZigZagRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "d",
                    "d",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "emptyZigZagRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "emptyZigZagRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                ],
            },
            glassVats: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "glassVats",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ee",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "glassVats",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "glassVats",
                        collision: "#####..#########",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
            heartMaxUpRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "heartMaxUpRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "f",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "heartMaxUpRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            redSkeletonLiftRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "redSkeletonLiftRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ggg",
                    "ggg",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "redSkeletonLiftRoom",
                        collision: "#####..#########",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "redSkeletonLiftRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "redSkeletonLiftRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "redSkeletonLiftRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 3,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "redSkeletonLiftRoom",
                        collision: "######...#######",
                        row: 2,
                        column: 2.5,
                    },
                ],
            },
            saveRoomA: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "h",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            saveRoomB: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "saveRoomB",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "i",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomB",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            saveRoomC: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "saveRoomC",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "j",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomC",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            secretLifeMaxUpRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "secretLifeMaxUpRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "k",
                    "k",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "secretLifeMaxUpRoom",
                        collision: "#######..#######",
                        row: 0,
                        column: 0.5,
                    },
                ],
            },
            shortZigZagRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "shortZigZagRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "l",
                    "l",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "shortZigZagRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "shortZigZagRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            skillOfWolfRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "skillOfWolfRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "m",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "skillOfWolfRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            sunglassesRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "sunglassesRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "n",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "sunglassesRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            tallZigZagRoom: {
                rooms: [
                    {
                        stage: "alchemyLaboratory",
                        room: "tallZigZagRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "o",
                    "o",
                    "o",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "tallZigZagRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "tallZigZagRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "tallZigZagRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 1,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "tallZigZagRoom",
                        collision: "#######..#######",
                        row: 3,
                        column: 0.5,
                    },
                ],
            },
        },
        castleEntrance: {
            afterDrawbridge: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "afterDrawbridge",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "castleEntrance",
                        room: "unknownRoom20",
                        row: 2,
                        column: 0,
                    },
                    {
                        stage: "castleEntrance",
                        room: "dropUnderPortcullis",
                        row: 3,
                        column: 1,
                    },
                    {
                        stage: "castleEntrance",
                        room: "saveRoomA",
                        row: 4,
                        column: 2,
                    },
                ],
                cells: [
                    ".00",
                    ".00",
                    "#00",
                    ".1.",
                    ".12",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "afterDrawbridge",
                        collision: "######....######",
                        row: 2.5,
                        column: 3,
                    },
                ],
            },
            cubeOfZoeRoom: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "triggerTeleporterToAlchemyLaboratory",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "castleEntrance",
                        room: "loadingRoomToAlchemyLaboratory",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "castleEntrance",
                        room: "cubeOfZoeRoom",
                        row: 0,
                        column: 2,
                    },
                    {
                        stage: "castleEntrance",
                        room: "loadingRoomToMarbleGallery",
                        row: 0,
                        column: 4,
                    },
                    {
                        stage: "castleEntrance",
                        room: "triggerTeleporterToMarbleGallery",
                        row: 0,
                        column: 5,
                    },
                ],
                cells: [
                    "#=33=#",
                    "..33..",
                    "..33..",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "cubeOfZoeRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 2,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "cubeOfZoeRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 4,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "cubeOfZoeRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 2,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "cubeOfZoeRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 4,
                    },
                ],
            },
            shortcutToWarpRooms: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "triggerTeleporterToWarpRooms",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "castleEntrance",
                        room: "loadingRoomToWarpRooms",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "castleEntrance",
                        room: "shortcutToWarpRooms",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=4",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "shortcutToWarpRooms",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            shortcutToUndergroundCaverns: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "shortcutToUndergroundCaverns",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "castleEntrance",
                        room: "loadingRoomToUndergroundCaverns",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "castleEntrance",
                        room: "triggerTeleporterToUndergroundCaverns",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "5=#",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "shortcutToUndergroundCaverns",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            meetingRoomWithDeath: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "gargoyleRoom",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "castleEntrance",
                        room: "meetingRoomWithDeath",
                        row: 1,
                        column: 0,
                    },
                ],
                cells: [
                    "6",
                    "7",
                    "7",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "gargoyleRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "gargoyleRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "left",
                        roomName: "meetingRoomWithDeath",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "meetingRoomWithDeath",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "meetingRoomWithDeath",
                        collision: "######....######",
                        row: 2.5,
                        column: 1,
                    },
                ],
            },
            atticEntrance: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "atticEntrance",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "8",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "atticEntrance",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "atticEntrance",
                        collision: "######....######",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
            atticHallway: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "atticHallway",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "9999",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "atticHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "atticHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
            atticStaircase: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "atticStaircase",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "a",
                    "a",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "atticStaircase",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "atticStaircase",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "atticStaircase",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            heartMaxUpRoom: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "heartMaxUpRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "b",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "heartMaxUpRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            holyMailRoom: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "holyMailRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "c",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "holyMailRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            jewelSwordRoom: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "jewelSwordRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "d",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "jewelSwordRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            lifeMaxUpRoom: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "lifeMaxUpRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "e",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "lifeMaxUpRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            mermanRoom: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "mermanRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "fff",
                    "fff",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "mermanRoom",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "leftUpper",
                        roomName: "mermanRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "mermanRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "mermanRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "mermanRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 3,
                    },
                ],
            },
            saveRoomB: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "saveRoomB",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "g",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "saveRoomB",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            saveRoomC: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "saveRoomC",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "h",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "saveRoomC",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            stairwellAfterDeath: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "stairwellAfterDeath",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "i",
                    "i",
                    "i",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "stairwellAfterDeath",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "stairwellAfterDeath",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                ],
            },
            wargHallway: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "wargHallway",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "jjjjjj",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "wargHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "wargHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 6,
                    },
                ],
            },
            zombieHallway: {
                rooms: [
                    {
                        stage: "castleEntrance",
                        room: "zombieHallway",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "kkkkkkk",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "zombieHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "zombieHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 7,
                    },
                ],
            },
        },
        castleKeep: {
            keepArea: {
                rooms: [
                    {
                        stage: "castleKeep",
                        room: "keepArea",
                        row: 0,
                        column: 2,
                    },
                    {
                        stage: "castleKeep",
                        room: "upperAttic",
                        row: 1,
                        column: 5,
                    },
                    {
                        stage: "castleKeep",
                        room: "lowerAttic",
                        row: 2,
                        column: 6,
                    },
                    {
                        stage: "castleKeep",
                        room: "triggerTeleporterToRoyalChapel",
                        row: 7,
                        column: 0,
                    },
                    {
                        stage: "castleKeep",
                        room: "loadingRoomToRoyalChapel",
                        row: 7,
                        column: 1,
                    },
                ],
                cells: [
                    "..,,,,,,,,",
                    "..,,,00011",
                    "..,1,12211",
                    "..,1111111",
                    "..,1111111",
                    "..,1111111",
                    "..,1111111",
                    "#=11111111",
                ],
                edges: [
                    {
                        edgeName: "rightUpper",
                        roomName: "keepArea",
                        collision: "######....######",
                        row: 1.5,
                        column: 10,
                    },
                    {
                        edgeName: "right",
                        roomName: "keepArea",
                        collision: "######....######",
                        row: 4.5,
                        column: 10,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "keepArea",
                        collision: "######....######",
                        row: 6.5,
                        column: 10,
                    },
                    {
                        edgeName: "rightLowest",
                        roomName: "keepArea",
                        collision: "######....######",
                        row: 7.5,
                        column: 10,
                    },
                ],
            },
            lionTorchPlatform: {
                rooms: [
                    {
                        stage: "castleKeep",
                        room: "lionTorchPlatform",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "castleKeep",
                        room: "loadingRoomToClockTower",
                        row: 1,
                        column: 1,
                    },
                    {
                        stage: "castleKeep",
                        room: "triggerTeleporterToClockTower",
                        row: 1,
                        column: 2,
                    },
                ],
                cells: [
                    "3..",
                    "3=#",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "lionTorchPlatform",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "lionTorchPlatform",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "lionTorchPlatform",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "lionTorchPlatform",
                        collision: "######....######",
                        row: 2,
                        column: 0.5,
                    },
                ],
            },
            dualPlatforms: {
                rooms: [
                    {
                        stage: "castleKeep",
                        room: "dualPlatforms",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "castleKeep",
                        room: "loadingRoomToWarpRooms",
                        row: 1,
                        column: 1,
                    },
                    {
                        stage: "castleKeep",
                        room: "triggerTeleporterToWarpRooms",
                        row: 1,
                        column: 2,
                    },
                ],
                cells: [
                    "4..",
                    "4=#",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "dualPlatforms",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "leftUpper",
                        roomName: "dualPlatforms",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "dualPlatforms",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "dualPlatforms",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                ],
            },
            bend: {
                rooms: [
                    {
                        stage: "castleKeep",
                        room: "bend",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "5",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "bend",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "bend",
                        collision: "######....######",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
            falchionRoom: {
                rooms: [
                    {
                        stage: "castleKeep",
                        room: "falchionRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "6",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "falchionRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            ghostCardRoom: {
                rooms: [
                    {
                        stage: "castleKeep",
                        room: "ghostCardRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "77",
                    "77",
                    "77",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "ghostCardRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                ],
            },
            saveRoomA: {
                rooms: [
                    {
                        stage: "castleKeep",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "8",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            tyrfingRoom: {
                rooms: [
                    {
                        stage: "castleKeep",
                        room: "tyrfingRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "9",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "tyrfingRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
        },
        catacombs: {
            exitToAbandonedMine: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "exitToAbandonedMine",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "catacombs",
                        room: "loadingRoomToAbandonedMine",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "catacombs",
                        room: "triggerTeleporterToAbandonedMine",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "0=#",
                    "0..",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "exitToAbandonedMine",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "exitToAbandonedMine",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            granfaloonsLair: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "granfaloonsLair",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "catacombs",
                        room: "roomId04",
                        row: 0,
                        column: 3,
                    },
                    {
                        stage: "catacombs",
                        room: "roomId02",
                        row: 1,
                        column: 0,
                    },
                ],
                cells: [
                    ".112",
                    "311.",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId02",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId04",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
            roomId00: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId00",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "4",
                    "4",
                ],
                edges: [
                    {
                        edgeName: "rightUpper",
                        roomName: "roomId00",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "roomId00",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            mormegilRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "mormegilRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "5",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "mormegilRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            roomId05: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId05",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "6",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "roomId05",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            smallGremlinRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "smallGremlinRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "7",
                    "7",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "smallGremlinRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "smallGremlinRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "smallGremlinRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "smallGremlinRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            saveRoomA: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            walkArmorRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "walkArmorRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "8",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "walkArmorRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            icebrandRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "icebrandRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "9",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "icebrandRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            leftLavaPath: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "leftLavaPath",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "aaa",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "leftLavaPath",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "leftLavaPath",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            ballroomMaskRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "ballroomMaskRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "bb",
                    "bb",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "ballroomMaskRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "ballroomMaskRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "ballroomMaskRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 2,
                    },
                ],
            },
            rightLavaPath: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "rightLavaPath",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ccc",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "rightLavaPath",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "rightLavaPath",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            catEyeCircletRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "catEyeCircletRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "d",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "catEyeCircletRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            roomId14: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId14",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "e",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId14",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId14",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            saveRoomB: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "saveRoomB",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomB",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "saveRoomB",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            hellfireBeastRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "hellfireBeastRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ff",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "hellfireBeastRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "hellfireBeastRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            boneArkRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "boneArkRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ggg",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "boneArkRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "boneArkRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            roomId19: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId19",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "h",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId19",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId19",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            roomId20: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId20",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ii",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId20",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId20",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            roomId21: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId21",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "jj",
                    "jj",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "roomId21",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "roomId21",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId21",
                        collision: "######....######",
                        row: 1.5,
                        column: 2,
                    },
                ],
            },
            roomId22: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId22",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "k",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId22",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId22",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            roomId23: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId23",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "lll",
                    "lll",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId23",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId23",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            pitchBlackSpikeMaze: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "pitchBlackSpikeMaze",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "mmm",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "pitchBlackSpikeMaze",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "pitchBlackSpikeMaze",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            roomId25: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId25",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "nnnnn",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId25",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "roomId25",
                        collision: "######....######",
                        row: 1,
                        column: 4.5,
                    },
                ],
            },
            roomId26: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "roomId26",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ooooo",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "roomId26",
                        collision: "######....######",
                        row: 0,
                        column: 4.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "roomId26",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            spikeBreakerRoom: {
                rooms: [
                    {
                        stage: "catacombs",
                        room: "spikeBreakerRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ppp",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "spikeBreakerRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
        },
        clockTower: {
            karasumansRoom: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "triggerTeleporterToCastleKeep",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "clockTower",
                        room: "loadingRoomToCastleKeep",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "clockTower",
                        room: "karasumansRoom",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=0",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "karasumansRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            stairwellToOuterWall: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "stairwellToOuterWall",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "clockTower",
                        room: "loadingRoomToOuterWall",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "clockTower",
                        room: "triggerTeleporterToOuterWall",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "1=#",
                    "1..",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "stairwellToOuterWall",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "stairwellToOuterWall",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                ],
            },
            leftGearRoom: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "spire",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "clockTower",
                        room: "belfry",
                        row: 2,
                        column: 1,
                    },
                    {
                        stage: "clockTower",
                        room: "leftGearRoom",
                        row: 3,
                        column: 1,
                    },
                    {
                        stage: "clockTower",
                        room: "hiddenArmory",
                        row: 6,
                        column: 0,
                    },
                ],
                cells: [
                    ",,2,,",
                    ",222,",
                    ".333.",
                    ".433.",
                    ".4...",
                    ".4...",
                    "54...",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "leftGearRoom",
                        collision: "######....######",
                        row: 3.5,
                        column: 1,
                    },
                    {
                        edgeName: "right",
                        roomName: "leftGearRoom",
                        collision: "######....######",
                        row: 6.5,
                        column: 2,
                    },
                ],
            },
            pendulumRoom: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "pathToKarasuman",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "clockTower",
                        room: "pendulumRoom",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "666777777",
                    "..7777777",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "pathToKarasuman",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "pendulumRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 2,
                    },
                    {
                        edgeName: "right",
                        roomName: "pendulumRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 9,
                    },
                ],
            },
            healingMailRoom: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "healingMailRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "8",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "healingMailRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            rightGearRoom: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "rightGearRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "9",
                    "9",
                    "9",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "rightGearRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "left",
                        roomName: "rightGearRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                ],
            },
            exitToCourtyard: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "exitToCourtyard",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "a",
                    "a",
                    "a",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "exitToCourtyard",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "exitToCourtyard",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "exitToCourtyard",
                        collision: "######....######",
                        row: 2.5,
                        column: 1,
                    },
                ],
            },
            openCourtyard: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "openCourtyard",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "bbbbbb",
                    "bbbbbb",
                    "bbbbbb",
                    "bbbbbb",
                    "bbbbbb",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 3.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 0.5,
                        column: 6,
                    },
                    {
                        edgeName: "right",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 3.5,
                        column: 6,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 4.5,
                        column: 6,
                    },
                ],
            },
            fireOfBatRoom: {
                rooms: [
                    {
                        stage: "clockTower",
                        room: "fireOfBatRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "c",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "fireOfBatRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
        },
        colosseum: {
            arena: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "triggerTeleporterToRoyalChapel",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "colosseum",
                        room: "loadingRoomToRoyalChapel",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "colosseum",
                        room: "passagewayBetweenArenaAndRoyalChapel",
                        row: 0,
                        column: 2,
                    },
                    {
                        stage: "colosseum",
                        room: "arena",
                        row: 0,
                        column: 7,
                    },
                    {
                        stage: "colosseum",
                        room: "topOfElevatorShaft",
                        row: 0,
                        column: 9,
                    },
                    {
                        stage: "colosseum",
                        room: "loadingRoomToOlroxsQuarters",
                        row: 0,
                        column: 14,
                    },
                    {
                        stage: "colosseum",
                        room: "triggerTeleporterToOlroxsQuarters",
                        row: 0,
                        column: 15,
                    },
                    {
                        stage: "colosseum",
                        room: "bottomOfElevatorShaft",
                        row: 1,
                        column: 9,
                    },
                ],
                cells: [
                    "#=000001122222=#",
                    ".........3333...",
                    ".........3333....",
                ],
                edges: [
                    {
                        edgeName: "topLeft",
                        roomName: "passagewayBetweenArenaAndRoyalChapel",
                        collision: "###........#####",
                        row: 0,
                        column: 5.5,
                    },
                    {
                        edgeName: "topRight",
                        roomName: "topOfElevatorShaft",
                        collision: "#####........###",
                        row: 0,
                        column: 10.5,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "passagewayBetweenArenaAndRoyalChapel",
                        collision: "####........####",
                        row: 1,
                        column: 3.5,
                    },
                    {
                        edgeName: "leftUpper",
                        roomName: "bottomOfElevatorShaft",
                        collision: "######....######",
                        row: 1.5,
                        column: 9,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "bottomOfElevatorShaft",
                        collision: "######....######",
                        row: 2.5,
                        column: 9,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "bottomOfElevatorShaft",
                        collision: "######....######",
                        row: 1.5,
                        column: 13,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "bottomOfElevatorShaft",
                        collision: "######....######",
                        row: 2.5,
                        column: 13,
                    },
                ],
            },
            bladeMasterRoom: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "bladeMasterRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "4444",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "bladeMasterRoom",
                        collision: "######....######",
                        row: 0,
                        column: 2.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "bladeMasterRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "bladeMasterRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
            bloodCloakRoom: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "bloodCloakRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "5",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "bloodCloakRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            fountainRoom: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "fountainRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "6",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "fountainRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            holySwordRoom: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "holySwordRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "77",
                ],
                edges: [
                    {
                        edgeName: "bottom",
                        roomName: "holySwordRoom",
                        collision: "######....######",
                        row: 1,
                        column: 1.5,
                    },
                ],
            },
            leftSideArmory: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "leftSideArmory",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "88",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "leftSideArmory",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            rightSideArmory: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "rightSideArmory",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "99",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "rightSideArmory",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            saveRoomA: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            saveRoomB: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "saveRoomB",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomB",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            spiralStaircases: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "spiralStaircases",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "aaaa",
                    "aaaa",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "spiralStaircases",
                        collision: "####........####",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "leftUpper",
                        roomName: "spiralStaircases",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "spiralStaircases",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "spiralStaircases",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "spiralStaircases",
                        collision: "######....######",
                        row: 1.5,
                        column: 4,
                    },
                ],
            },
            topOfLeftSpiralStaircase: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "topOfLeftSpiralStaircase",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "b",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "topOfLeftSpiralStaircase",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "topOfLeftSpiralStaircase",
                        collision: "###........#####",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
            topOfRightSpiralStaircase: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "topOfRightSpiralStaircase",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "c",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "topOfRightSpiralStaircase",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "topOfRightSpiralStaircase",
                        collision: "#####........###",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
            valhallaKnightRoom: {
                rooms: [
                    {
                        stage: "colosseum",
                        room: "valhallaKnightRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "dd",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "valhallaKnightRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "valhallaKnightRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
        },
        longLibrary: {
            exitToOuterWall: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "exitToOuterWall",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "longLibrary",
                        room: "loadingRoomToOuterWall",
                        row: 0,
                        column: 3,
                    },
                    {
                        stage: "longLibrary",
                        room: "triggerTeleporterToOuterWall",
                        row: 0,
                        column: 4,
                    },
                ],
                cells: [
                    "000=#",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "exitToOuterWall",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            spellbookArea: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "spellbookArea",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "longLibrary",
                        room: "footOfStaircase",
                        row: 3,
                        column: 2,
                    },
                ],
                cells: [
                    "1111111",
                    "1111111",
                    "1111111",
                    "..2....",
                ],
                edges: [
                    {
                        edgeName: "leftUpperA",
                        roomName: "spellbookArea",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftUpperB",
                        roomName: "spellbookArea",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLowerA",
                        roomName: "spellbookArea",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLowerB",
                        roomName: "footOfStaircase",
                        collision: "######....######",
                        row: 3.5,
                        column: 2,
                    },
                    {
                        edgeName: "right",
                        roomName: "footOfStaircase",
                        collision: "######....######",
                        row: 3.5,
                        column: 3,
                    },
                ],
            },
            lesserDemonArea: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "lesserDemonArea",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    ",3333",
                    ",3333",
                    "33333",
                    "33333",
                ],
                edges: [
                    {
                        edgeName: "rightUpper",
                        roomName: "lesserDemonArea",
                        collision: "######....######",
                        row: 0.5,
                        column: 5,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "lesserDemonArea",
                        collision: "######....######",
                        row: 1.5,
                        column: 5,
                    },
                ],
            },
            secretBookcaseRoom: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "secretBookcaseRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "4",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "secretBookcaseRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "secretBookcaseRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            holyRodRoom: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "holyRodRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "5",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "holyRodRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            dhuronAndFleaArmorRoom: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "dhuronAndFleaArmorRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "66",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "dhuronAndFleaArmorRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "dhuronAndFleaArmorRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            shop: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "shop",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "7",
                    "7",
                ],
                edges: [
                    {
                        edgeName: "rightUpper",
                        roomName: "shop",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "shop",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            outsideShop: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "outsideShop",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "88",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "outsideShop",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "outsideShop",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            fleaManRoom: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "fleaManRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "99",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "fleaManRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "fleaManRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            faerieCardRoom: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "faerieCardRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "a",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "faerieCardRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            threeLayerRoom: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "threeLayerRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "b",
                    "b",
                    "b",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "threeLayerRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "threeLayerRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "left",
                        roomName: "threeLayerRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "threeLayerRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "threeLayerRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "threeLayerRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 1,
                    },
                ],
            },
            dhuronAndFleaManRoom: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "dhuronAndFleaManRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "cc",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "dhuronAndFleaManRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "dhuronAndFleaManRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            saveRoomA: {
                rooms: [
                    {
                        stage: "longLibrary",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
        },
        marbleGallery: {
            clockRoom: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "threePaths",
                        row: 0,
                        column: 3,
                    },
                    {
                        stage: "marbleGallery",
                        room: "leftOfClockRoom",
                        row: 2,
                        column: 0,
                    },
                    {
                        stage: "marbleGallery",
                        room: "clockRoom",
                        row: 2,
                        column: 3,
                    },
                    {
                        stage: "marbleGallery",
                        room: "rightOfClockRoom",
                        row: 2,
                        column: 4,
                    },
                    {
                        stage: "marbleGallery",
                        room: "saveRoomA",
                        row: 3,
                        column: 2,
                    },
                    {
                        stage: "marbleGallery",
                        room: "elevatorRoom",
                        row: 3,
                        column: 3,
                    },
                    {
                        stage: "castleCenter",
                        room: "triggerTeleporterToMarbleGallery",
                        row: 3,
                        column: 3,
                    },
                    {
                        stage: "marbleGallery",
                        room: "powerUpRoom",
                        row: 3,
                        column: 4,
                    },
                    {
                        stage: "marbleGallery",
                        room: "triggerTeleporterToCastleCenter",
                        row: 4,
                        column: 3,
                    },
                    {
                        stage: "castleCenter",
                        room: "elevatorShaft",
                        row: 4,
                        column: 3,
                    },
                    {
                        stage: "castleCenter",
                        room: "centerCube",
                        row: 6,
                        column: 2,
                    },
                    {
                        stage: "castleCenter",
                        room: "triggerTeleporterToBO6",
                        row: 7,
                        column: 5,
                    },
                    {
                        stage: "castleCenter",
                        room: "unknownRoomId02",
                        row: 9,
                        column: 3,
                    },
                ],
                cells: [
                    "...0...",
                    "...0...",
                    "1112333",
                    "..456..",
                    "...7...",
                    "...7...",
                    "..888..",
                    "..888..",
                    "..888..",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "threePaths",
                        collision: "#######..#######",
                        row: 0,
                        column: 3.5,
                    },
                    {
                        edgeName: "leftUpper",
                        roomName: "threePaths",
                        collision: "######....######",
                        row: 1.5,
                        column: 3,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "threePaths",
                        collision: "######....######",
                        row: 1.5,
                        column: 4,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "leftOfClockRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "rightOfClockRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 7,
                    },
                ],
            },
            longHallway: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "longHallway",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "marbleGallery",
                        room: "loadingRoomToOuterWall",
                        row: 0,
                        column: 15,
                    },
                    {
                        stage: "marbleGallery",
                        room: "triggerTeleporterToOuterWall",
                        row: 0,
                        column: 16,
                    },
                ],
                cells: [
                    "999999999999999=#",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "longHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            sShapedHallways: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "triggerTeleporterToCastleEntrance",
                        row: 2,
                        column: 0,
                    },
                    {
                        stage: "marbleGallery",
                        room: "loadingRoomToCastleEntrance",
                        row: 2,
                        column: 1,
                    },
                    {
                        stage: "marbleGallery",
                        room: "sShapedHallways",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "..aaaaaa",
                    "..aaaaaa",
                    "#=aaaaaa",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "sShapedHallways",
                        collision: "######....######",
                        row: 0.5,
                        column: 8,
                    },
                ],
            },
            entrance: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "triggerTeleporterToAlchemyLaboratory",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "marbleGallery",
                        room: "loadingRoomToAlchemyLaboratory",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "marbleGallery",
                        room: "entrance",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=bbbb",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "entrance",
                        collision: "######....######",
                        row: 0.5,
                        column: 6,
                    },
                ],
            },
            pathwayAfterLeftStatue: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "triggerTeleporterToOlroxsQuarters",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "marbleGallery",
                        room: "loadingRoomToOlroxsQuarters",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "marbleGallery",
                        room: "pathwayAfterLeftStatue",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=c",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "pathwayAfterLeftStatue",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            stairwellToUndergroundCaverns: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "triggerTeleporterToUndergroundCaverns",
                        row: 1,
                        column: 0,
                    },
                    {
                        stage: "marbleGallery",
                        room: "loadingRoomToUndergroundCaverns",
                        row: 1,
                        column: 1,
                    },
                    {
                        stage: "marbleGallery",
                        room: "stairwellToUndergroundCaverns",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "..d",
                    "#=d",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "stairwellToUndergroundCaverns",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            dropoff: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "dropoff",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "marbleGallery",
                        room: "beneathDropoff",
                        row: 1,
                        column: 1,
                    },
                    {
                        stage: "marbleGallery",
                        room: "stainedGlassCorner",
                        row: 2,
                        column: 1,
                    },
                ],
                cells: [
                    "eee",
                    ".ff",
                    ".g.",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "dropoff",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "dropoff",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "beneathDropoff",
                        collision: "######....######",
                        row: 1.5,
                        column: 3,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "stainedGlassCorner",
                        collision: "######....######",
                        row: 2.5,
                        column: 1,
                    },
                ],
            },
            alucartRoom: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "alucartRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "h",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "alucartRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            gravityBootsRoom: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "gravityBootsRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "iiiii",
                ],
                edges: [
                    {
                        edgeName: "bottom",
                        roomName: "gravityBootsRoom",
                        collision: "#######..#######",
                        row: 1,
                        column: 2.5,
                    },
                ],
            },
            beneathRightTrapdoor: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "beneathRightTrapdoor",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "j",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "beneathRightTrapdoor",
                        collision: "####....########",
                        row: 0,
                        column: 0.5,
                    },
                ],
            },
            tallStainedGlassWindows: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "tallStainedGlassWindows",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "k",
                    "k",
                    "k",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "tallStainedGlassWindows",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "tallStainedGlassWindows",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                ],
            },
            spiritOrbRoom: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "spiritOrbRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ll",
                    "ll",
                    "ll",
                    "ll",
                    "ll",
                ],
                edges: [
                    {
                        edgeName: "rightUpper",
                        roomName: "spiritOrbRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "spiritOrbRoom",
                        collision: "######....######",
                        row: 4.5,
                        column: 2,
                    },
                ],
            },
            stopwatchRoom: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "stopwatchRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "mmm",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "stopwatchRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "stopwatchRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "stopwatchRoom",
                        collision: "######....######",
                        row: 1,
                        column: 1.5,
                    },
                ],
            },
            emptyRoom: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "emptyRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "n",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "emptyRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "emptyRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            blueDoorRoom: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "blueDoorRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "oo",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "blueDoorRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            pathwayAfterRightStatue: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "pathwayAfterRightStatue",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "p",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "pathwayAfterRightStatue",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "pathwayAfterRightStatue",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            ouijaTableStairway: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "ouijaTableStairway",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "qq",
                    "qq",
                    "qq",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "ouijaTableStairway",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "ouijaTableStairway",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            slingerStaircase: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "slingerStaircase",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "rrr",
                    "rrr",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "slingerStaircase",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "slingerStaircase",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "slingerStaircase",
                        collision: "######....######",
                        row: 1.5,
                        column: 3,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "slingerStaircase",
                        collision: "####....########",
                        row: 2,
                        column: 2.5,
                    },
                ],
            },
            beneathLeftTrapdoor: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "beneathLeftTrapdoor",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "s",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "beneathLeftTrapdoor",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "right",
                        roomName: "beneathLeftTrapdoor",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            saveRoomB: {
                rooms: [
                    {
                        stage: "marbleGallery",
                        room: "saveRoomB",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "t",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomB",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
        },
        olroxsQuarters: {
            skelerangRoom: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "skelerangRoom",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "loadingRoomToMarbleGallery",
                        row: 2,
                        column: 1,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "triggerTeleporterToMarbleGallery",
                        row: 2,
                        column: 2,
                    },
                ],
                cells: [
                    "0..",
                    "0..",
                    "0=#",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "skelerangRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            catwalkCrypt: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "triggerTeleporterToRoyalChapel",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "loadingRoomToRoyalChapel",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "catwalkCrypt",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=4444444",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "catwalkCrypt",
                        collision: "#######..#######",
                        row: 0,
                        column: 3.5,
                    },
                    {
                        edgeName: "right",
                        roomName: "catwalkCrypt",
                        collision: "######....######",
                        row: 0.5,
                        column: 9,
                    },
                ],
            },
            grandStaircase: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "triggerTeleporterToColosseum",
                        row: 1,
                        column: 0,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "loadingRoomToColosseum",
                        row: 1,
                        column: 1,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "grandStaircase",
                        row: 0,
                        column: 2,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "bottomOfStairwell",
                        row: 2,
                        column: 3,
                    },
                ],
                cells: [
                    "..111",
                    "#=111",
                    "...2.",
                ],
                edges: [
                    {
                        edgeName: "rightUpper",
                        roomName: "grandStaircase",
                        collision: "######....######",
                        row: 0.5,
                        column: 5,
                    },
                    {
                        edgeName: "right",
                        roomName: "grandStaircase",
                        collision: "######....######",
                        row: 1.5,
                        column: 5,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "bottomOfStairwell",
                        collision: "######....######",
                        row: 2.5,
                        column: 4,
                    },
                ],
            },
            tallShaft: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "tallShaft",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "loadingRoomToWarpRooms",
                        row: 5,
                        column: 1,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "triggerTeleporterToWarpRooms",
                        row: 5,
                        column: 2,
                    },
                ],
                cells: [
                    "3..",
                    "3..",
                    "3..",
                    "3..",
                    "3..",
                    "3=#",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "tallShaft",
                        collision: "#########..#####",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "tallShaft",
                        collision: "######....######",
                        row: 5.5,
                        column: 0,
                    },
                ],
            },
            olroxsRoom: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "echoOfBatRoom",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "olroxsRoom",
                        row: 0,
                        column: 3,
                    },
                    {
                        stage: "olroxsQuarters",
                        room: "narrowHallwayToOlrox",
                        row: 0,
                        column: 5,
                    },
                ],
                cells: [
                    "555667777",
                    "...66....",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "narrowHallwayToOlrox",
                        collision: "######....######",
                        row: 0.5,
                        column: 9,
                    },
                ],
            },
            emptyRoom: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "emptyRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "9",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "emptyRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "emptyRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            hammerAndBladeRoom: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "hammerAndBladeRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "bbbb",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "hammerAndBladeRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "hammerAndBladeRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
            emptyCells: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "emptyCells",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "88",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "emptyCells",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "emptyCells",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            garnetRoom: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "garnetRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "a",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "garnetRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            prison: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "prison",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "dddddd",
                ],
                edges: [
                    {
                        edgeName: "bottomLeft",
                        roomName: "prison",
                        collision: "#####..#########",
                        row: 1,
                        column: 0.5,
                    },
                    {
                        edgeName: "bottomRight",
                        roomName: "prison",
                        collision: "#########..#####",
                        row: 1,
                        column: 5.5,
                    },
                ],
            },
            openCourtyard: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "openCourtyard",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "cccccc",
                    "cccccc",
                    "cccccc",
                    "cccccc",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "openCourtyard",
                        collision: "#####..#########",
                        row: 0,
                        column: 5.5,
                    },
                    {
                        edgeName: "leftUpper",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 3.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 1.5,
                        column: 6,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "openCourtyard",
                        collision: "######....######",
                        row: 2.5,
                        column: 6,
                    },
                ],
            },
            saveRoomA: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            secretOnyxRoom: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "secretOnyxRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "eee",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "secretOnyxRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            swordCardRoom: {
                rooms: [
                    {
                        stage: "olroxsQuarters",
                        room: "swordCardRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ff",
                ],
                edges: [
                    {
                        edgeName: "bottom",
                        roomName: "swordCardRoom",
                        collision: "#######..#######",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
        },
        outerWall: {
            elevatorShaftRoom: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "elevatorShaftRoom",
                        row: 0,
                        column: 2,
                    },
                    {
                        stage: "outerWall",
                        room: "triggerTeleporterToWarpRooms",
                        row: 2,
                        column: 1,
                    },
                    {
                        stage: "outerWall",
                        room: "loadingRoomToWarpRooms",
                        row: 2,
                        column: 2,
                    },
                    {
                        stage: "outerWall",
                        room: "triggerTeleporterToLongLibrary",
                        row: 6,
                        column: 0,
                    },
                    {
                        stage: "outerWall",
                        room: "loadingRoomToLongLibrary",
                        row: 6,
                        column: 1,
                    },
                ],
                cells: [
                    "..00",
                    "..00",
                    ".#=0",
                    "..00",
                    "..00",
                    "..00",
                    "#=00",
                    "..00",
                    "..00",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "elevatorShaftRoom",
                        collision: "###......../####",
                        row: 0,
                        column: 3.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "elevatorShaftRoom",
                        collision: "######....######",
                        row: 8.5,
                        column: 2,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "elevatorShaftRoom",
                        collision: "##...###########",
                        row: 9,
                        column: 3.5,
                    },
                ],
            },
            exitToClockTower: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "triggerTeleporterToClockTower",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "outerWall",
                        room: "loadingRoomToClockTower",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "outerWall",
                        room: "exitToClockTower",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=1",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "exitToClockTower",
                        collision: "#######\\........",
                        row: 0,
                        column: 2.5,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "exitToClockTower",
                        collision: "###......../####",
                        row: 1,
                        column: 2.5,
                    },
                ],
            },
            exitToMarbleGallery: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "triggerTeleporterToMarbleGallery",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "outerWall",
                        room: "loadingRoomToMarbleGallery",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "outerWall",
                        room: "exitToMarbleGallery",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=2",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "exitToMarbleGallery",
                        collision: "#####\\..........",
                        row: 0,
                        column: 2.5,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "exitToMarbleGallery",
                        collision: "#######\\........",
                        row: 1,
                        column: 2.5,
                    },
                ],
            },
            telescopeRoom: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "lowerMedusaRoom",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "outerWall",
                        room: "telescopeRoom",
                        row: 3,
                        column: 0,
                    },
                ],
                cells: [
                    ".33.",
                    ".33.",
                    ".33.",
                    ",44,",
                    ",,,,",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "lowerMedusaRoom",
                        collision: "#######\\........",
                        row: 0,
                        column: 2.5,
                    },
                    {
                        edgeName: "leftUpper",
                        roomName: "lowerMedusaRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "lowerMedusaRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            doppelgangerRoom: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "garlicRoom",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "outerWall",
                        room: "doppelgangerRoom",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "outerWall",
                        room: "gladiusRoom",
                        row: 0,
                        column: 3,
                    },
                ],
                cells: [
                    "5667",
                    "5...",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "garlicRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "gladiusRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "garlicRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            secretPlatformRoom: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "secretPlatformRoom",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "outerWall",
                        room: "jewelKnucklesRoom",
                        row: 1,
                        column: 0,
                    },
                ],
                cells: [
                    "8",
                    "9",
                ],
                edges: [
                    {
                        edgeName: "rightUpper",
                        roomName: "secretPlatformRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "jewelKnucklesRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            blueAxeKnightRoom: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "blueAxeKnightRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "aaa",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "blueAxeKnightRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "blueAxeKnightRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            garnetVaseRoom: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "garnetVaseRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "bb",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "garnetVaseRoom",
                        collision: "##...###########",
                        row: 0,
                        column: 1.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "garnetVaseRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "garnetVaseRoom",
                        collision: "#####\\..........",
                        row: 1,
                        column: 1.5,
                    },
                ],
            },
            saveRoomA: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            saveRoomB: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "saveRoomB",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "saveRoomB",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            topOfOuterWall: {
                rooms: [
                    {
                        stage: "outerWall",
                        room: "topOfOuterWall",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "c",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "topOfOuterWall",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "topOfOuterWall",
                        collision: "#######\\........",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
        },
        royalChapel: {
            hippogryphRoom: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "walkwayLeftOfHippogryph",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "royalChapel",
                        room: "hippogryphRoom",
                        row: 0,
                        column: 3,
                    },
                    {
                        stage: "royalChapel",
                        room: "walkwayRightOfHippogryph",
                        row: 0,
                        column: 5,
                    },
                ],
                cells: [
                    ".001122.",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "walkwayLeftOfHippogryph",
                        collision: "######<<<<######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "right",
                        roomName: "walkwayRightOfHippogryph",
                        collision: "######>>>>######",
                        row: 0.5,
                        column: 7,
                    },
                ],
            },
            rightTower: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "rightTower",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "royalChapel",
                        room: "loadingRoomToCastleKeep",
                        row: 2,
                        column: 3,
                    },
                    {
                        stage: "royalChapel",
                        room: "triggerTeleporterToCastleKeep",
                        row: 2,
                        column: 4,
                    },
                    {
                        stage: "royalChapel",
                        room: "saveRoomB",
                        row: 3,
                        column: 3,
                    },
                ],
                cells: [
                    ".33..",
                    ".33..",
                    ".33=#",
                    ".334.",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "rightTower",
                        collision: "######>>>>######",
                        row: 3.5,
                        column: 1,
                    },
                ],
            },
            pushingStatueShortcut: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "pushingStatueShortcut",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "royalChapel",
                        room: "loadingRoomToOlroxsQuarters",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "royalChapel",
                        room: "triggerTeleporterToOlroxsQuarters",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "5=#",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "pushingStatueShortcut",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            nave: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "nave",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "royalChapel",
                        room: "loadingRoomToColosseum",
                        row: 1,
                        column: 2,
                    },
                    {
                        stage: "royalChapel",
                        room: "triggerTeleporterToColosseum",
                        row: 1,
                        column: 3,
                    },
                ],
                cells: [
                    "66..",
                    "66=#",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "nave",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "nave",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "nave",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                ],
            },
            statueLedge: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "royalChapel",
                        room: "statueLedge",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "royalChapel",
                        room: "loadingRoomToAlchemyLaboratory",
                        row: 0,
                        column: 2,
                    },
                    {
                        stage: "royalChapel",
                        room: "triggerTeleporterToAlchemyLaboratory",
                        row: 0,
                        column: 3,
                    },
                ],
                cells: [
                    "@7=#",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "statueLedge",
                        collision: "######....######",
                        row: 0,
                        column: 1.5,
                    },
                ],
            },
            chapelStaircase: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "chapelStaircase",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    ",,,,,,88",
                    ",,,,,888",
                    ",,,,8888",
                    ",,,888,,",
                    ",,888,,,",
                    ",888,,,,",
                    "888,,,,,",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "chapelStaircase",
                        collision: "######....######",
                        row: 1.5,
                        column: 8,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "chapelStaircase",
                        collision: "######....######",
                        row: 7,
                        column: 1.5,
                    },
                ],
            },
            confessionalBooth: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "confessionalBooth",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "9",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "confessionalBooth",
                        collision: "######ssss######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            emptyRoom: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "emptyRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "a",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "emptyRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "emptyRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            gogglesRoom: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "gogglesRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "b",
                    "b",
                    "b",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "gogglesRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "gogglesRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "gogglesRoom",
                        collision: "######....######",
                        row: 2.5,
                        column: 1,
                    },
                ],
            },
            leftTower: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "leftTower",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    ".cc.",
                    ".cc.",
                    ".cc.",
                    ".cc.",
                    ".cc.",
                    ".cc.",
                    ".cc.",
                    ".cc.",
                    ".cc.",
                    ".cc.",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "leftTower",
                        collision: "######>>>>######",
                        row: 3.5,
                        column: 1,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "leftTower",
                        collision: "######....######",
                        row: 9.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "leftTower",
                        collision: "######<<<<######",
                        row: 2.5,
                        column: 3,
                    },
                    {
                        edgeName: "right",
                        roomName: "leftTower",
                        collision: "######....######",
                        row: 7.5,
                        column: 3,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "leftTower",
                        collision: "######ssss######",
                        row: 9.5,
                        column: 3,
                    },
                ],
            },
            middleTower: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "middleTower",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    ".dd.",
                    ".dd.",
                    ".dd.",
                    ".dd.",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "middleTower",
                        collision: "######>>>>######",
                        row: 3.5,
                        column: 1,
                    },
                    {
                        edgeName: "right",
                        roomName: "middleTower",
                        collision: "######<<<<######",
                        row: 2.5,
                        column: 3,
                    },
                ],
            },
            silverRingRoom: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "silverRingRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ee",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "silverRingRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            spikeHallway: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "spikeHallway",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ffff.",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "spikeHallway",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "spikeHallway",
                        collision: "######>>>>######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
            walkwayBetweenTowers: {
                rooms: [
                    {
                        stage: "royalChapel",
                        room: "walkwayBetweenTowers",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    ".ggg.",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "walkwayBetweenTowers",
                        collision: "######<<<<######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "right",
                        roomName: "walkwayBetweenTowers",
                        collision: "######>>>>######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
        },
        undergroundCaverns: {
            falseSaveRoom: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "falseSaveRoom",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "triggerTeleporterToBossSuccubus",
                        row: 0,
                        column: 1,
                    },
                ],
                cells: [
                    "@#",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "falseSaveRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            exitToCastleEntrance: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "triggerTeleporterToCastleEntrance",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "loadingRoomToCastleEntrance",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "exitToCastleEntrance",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=00",
                ],
                edges: [
                    {
                        edgeName: "bottom",
                        roomName: "exitToCastleEntrance",
                        collision: "######....######",
                        row: 1,
                        column: 3.5,
                    },
                ],
            },
            longDrop: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "longDrop",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "loadingRoomToMarbleGallery",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "triggerTeleporterToMarbleGallery",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "1=#",
                    "1..",
                    "1..",
                    "1..",
                    "1..",
                    "1..",
                    "1..",
                    "1..",
                    "1..",
                    "1..",
                    "1..",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "longDrop",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "rightUpper",
                        roomName: "longDrop",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                    {
                        edgeName: "rightLower",
                        roomName: "longDrop",
                        collision: "######....######",
                        row: 3.5,
                        column: 1,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "longDrop",
                        collision: "######....######",
                        row: 11,
                        column: 0.5,
                    },
                ],
            },
            exitToAbandonedMine: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "triggerTeleporterToAbandonedMine",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "loadingRoomToAbandonedMine",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "exitToAbandonedMine",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "#=2",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "exitToAbandonedMine",
                        collision: "######....######",
                        row: 0,
                        column: 2.5,
                    },
                ],
            },
            scyllaRoom: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "hiddenCrystalEntrance",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "crystalCloakRoom",
                        row: 1,
                        column: 1,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "scyllaRoom",
                        row: 1,
                        column: 2,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "scyllaWyrmRoom",
                        row: 2,
                        column: 1,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "risingWaterRoom",
                        row: 2,
                        column: 2,
                    },
                ],
                cells: [
                    "3......",
                    "3455555",
                    "3677777",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "hiddenCrystalEntrance",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "hiddenCrystalEntrance",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "hiddenCrystalEntrance",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "hiddenCrystalEntrance",
                        collision: "######....######",
                        row: 3,
                        column: 0.5,
                    },
                ],
            },
            waterfall: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "dKButton",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "waterfall",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "pentagramRoom",
                        row: 0,
                        column: 3,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "roomId19",
                        row: 5,
                        column: 0,
                    },
                    {
                        stage: "undergroundCaverns",
                        room: "roomId18",
                        row: 5,
                        column: 3,
                    },
                ],
                cells: [
                    "899a",
                    ".99.",
                    ".99.",
                    ".99.",
                    ".99.",
                    "b99c",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId19",
                        collision: "######....######",
                        row: 5.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "pentagramRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                ],
            },
            saveRoomA: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "saveRoomA",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "saveRoomA",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            saveRoomB: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "saveRoomB",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomB",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            saveRoomC: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "saveRoomC",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "@",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "saveRoomC",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            crystalBend: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "crystalBend",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "d",
                    "d",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "crystalBend",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "right",
                        roomName: "crystalBend",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            tallStairwell: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "tallStairwell",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "e",
                    "e",
                    "e",
                    "e",
                    "e",
                    "e",
                    "e",
                    "e",
                    "e",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "tallStairwell",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "tallStairwell",
                        collision: "######....######",
                        row: 6.5,
                        column: 0,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "tallStairwell",
                        collision: "######....######",
                        row: 9,
                        column: 0.5,
                    },
                ],
            },
            plaqueRoomWithLifeMaxUp: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "plaqueRoomWithLifeMaxUp",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "f",
                ],
                edges: [
                    {
                        edgeName: "bottom",
                        roomName: "plaqueRoomWithLifeMaxUp",
                        collision: "######....######",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
            smallStairwell: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "smallStairwell",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "g",
                    "g",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "smallStairwell",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "right",
                        roomName: "smallStairwell",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            claymoreStairwell: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "claymoreStairwell",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "h",
                    "h",
                    "h",
                    "h",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "claymoreStairwell",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "claymoreStairwell",
                        collision: "######....######",
                        row: 3.5,
                        column: 1,
                    },
                ],
            },
            mealTicketsAndMoonstoneRoom: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "mealTicketsAndMoonstoneRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "i",
                    "i",
                ],
                edges: [
                    {
                        edgeName: "leftUpper",
                        roomName: "mealTicketsAndMoonstoneRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "leftLower",
                        roomName: "mealTicketsAndMoonstoneRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "mealTicketsAndMoonstoneRoom",
                        collision: "######....######",
                        row: 1.5,
                        column: 1,
                    },
                ],
            },
            plaqueRoomWithBreakableWall: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "plaqueRoomWithBreakableWall",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "j",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "plaqueRoomWithBreakableWall",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "plaqueRoomWithBreakableWall",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            roomId09: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "roomId09",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "kk",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId09",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId09",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "roomId09",
                        collision: "######....######",
                        row: 1,
                        column: 0.5,
                    },
                ],
            },
            roomId10: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "roomId10",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "l",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "roomId10",
                        collision: "######....######",
                        row: 0,
                        column: 0.5,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "roomId10",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            roomId11: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "roomId11",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "mmm",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId11",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId11",
                        collision: "######....######",
                        row: 0.5,
                        column: 3,
                    },
                ],
            },
            roomId12: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "roomId12",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "nn",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "roomId12",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "roomId12",
                        collision: "######....######",
                        row: 0.5,
                        column: 2,
                    },
                ],
            },
            holySymbolRoom: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "holySymbolRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "o",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "holySymbolRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                ],
            },
            dKBridge: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "dKBridge",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "pppp",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "dKBridge",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "dKBridge",
                        collision: "######....######",
                        row: 0.5,
                        column: 4,
                    },
                    {
                        edgeName: "bottom",
                        roomName: "dKBridge",
                        collision: "######....######",
                        row: 1,
                        column: 3.5,
                    },
                ],
            },
            mermanStatueRoom: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "mermanStatueRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "q",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "mermanStatueRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
            iceFloeRoom: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "iceFloeRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "rrrrrrrrr",
                    "rr,rrrrrr",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "iceFloeRoom",
                        collision: "######....######",
                        row: 0,
                        column: 8.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "iceFloeRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "iceFloeRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 9,
                    },
                ],
            },
            rightFerrymanRoute: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "rightFerrymanRoute",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "sssssssssssss",
                    "sss,,,ss,ssss",
                ],
                edges: [
                    {
                        edgeName: "left",
                        roomName: "rightFerrymanRoute",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "rightFerrymanRoute",
                        collision: "######....######",
                        row: 0.5,
                        column: 13,
                    },
                ],
            },
            leftFerrymanRoute: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "leftFerrymanRoute",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "ttttttttttttt",
                    "ttttt,,,,,,,,",
                ],
                edges: [
                    {
                        edgeName: "top",
                        roomName: "leftFerrymanRoute",
                        collision: "######....######",
                        row: 0,
                        column: 8.5,
                    },
                    {
                        edgeName: "left",
                        roomName: "leftFerrymanRoute",
                        collision: "######....######",
                        row: 0.5,
                        column: 0,
                    },
                    {
                        edgeName: "right",
                        roomName: "leftFerrymanRoute",
                        collision: "######....######",
                        row: 0.5,
                        column: 13,
                    },
                ],
            },
            bandannaRoom: {
                rooms: [
                    {
                        stage: "undergroundCaverns",
                        room: "bandannaRoom",
                        row: 0,
                        column: 0,
                    },
                ],
                cells: [
                    "u",
                ],
                edges: [
                    {
                        edgeName: "right",
                        roomName: "bandannaRoom",
                        collision: "######....######",
                        row: 0.5,
                        column: 1,
                    },
                ],
            },
        },
        warpRooms: {
            warpRoomToCastleEntrance: {
                rooms: [
                    {
                        stage: "warpRooms",
                        room: "warpRoomToCastleEntrance",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "warpRooms",
                        room: "loadingRoomToCastleEntrance",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "warpRooms",
                        room: "triggerTeleporterToCastleEntrance",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "W..",
                ],
                edges: [
                ],
            },
            warpRoomToCastleKeep: {
                rooms: [
                    {
                        stage: "warpRooms",
                        room: "triggerTeleporterToCastleKeep",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "warpRooms",
                        room: "loadingRoomToCastleKeep",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "warpRooms",
                        room: "warpRoomToCastleKeep",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "..W",
                ],
                edges: [
                ],
            },
            warpRoomToOlroxsQuarters: {
                rooms: [
                    {
                        stage: "warpRooms",
                        room: "triggerTeleporterToOlroxsQuarters",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "warpRooms",
                        room: "loadingRoomToOlroxsQuarters",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "warpRooms",
                        room: "warpRoomToOlroxsQuarters",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "..W",
                ],
                edges: [
                ],
            },
            warpRoomToOuterWall: {
                rooms: [
                    {
                        stage: "warpRooms",
                        room: "warpRoomToOuterWall",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "warpRooms",
                        room: "loadingRoomToOuterWall",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "warpRooms",
                        room: "triggerTeleporterToOuterWall",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "W..",
                ],
                edges: [
                ],
            },
            warpRoomToAbandonedMine: {
                rooms: [
                    {
                        stage: "warpRooms",
                        room: "triggerTeleporterToAbandonedMine",
                        row: 0,
                        column: 0,
                    },
                    {
                        stage: "warpRooms",
                        room: "loadingRoomToAbandonedMine",
                        row: 0,
                        column: 1,
                    },
                    {
                        stage: "warpRooms",
                        room: "warpRoomToAbandonedMine",
                        row: 0,
                        column: 2,
                    },
                ],
                cells: [
                    "..W",
                ],
                edges: [
                ],
            },
        },
    }

    const MAP_PIXELS = {
        abandonedMine: {
            bend: [
                fillRect(COLORS.abandonedMine, 1, 1, 7, 3),
                fillRect(COLORS.abandonedMine, 2, 0),
                fillRect(COLORS.redDoor, 6, 0),
            ],
            cerberusRoom: [
                fillRect(COLORS.abandonedMine, 1, 1, 3, 7),
                fillRect(COLORS.abandonedMine, 2, 0),
                fillRect(COLORS.abandonedMine, 2, 8),
            ],
            demonSwitch: [
                fillRect(COLORS.abandonedMine, 1, 1, 15, 3),
                fillRect(COLORS.abandonedMine, 2, 0),
                fillRect(COLORS.abandonedMine, 2, 4),
                fillRect(COLORS.abandonedMine, 16, 2),
            ],
            fourWayIntersection: [
                fillRect(COLORS.abandonedMine, 1, 1, 3, 11),
                fillRect(COLORS.abandonedMine, 0, 6),
                fillRect(COLORS.abandonedMine, 2, 0),
                fillRect(COLORS.redDoor, 2, 12),
                fillRect(COLORS.abandonedMine, 4, 6),
            ],
            loadingRoomToCatacombs: [
                fillRect(COLORS.abandonedMine, 1, 1, 3, 3),
            ],
            loadingRoomToUndergroundCaverns: [
                fillRect(COLORS.abandonedMine, 1, 1, 3, 3),
            ],
            loadingRoomToWarpRooms: [
                fillRect(COLORS.abandonedMine, 1, 1, 3, 3),
            ],
            wellLitSkullRoom: [
                fillRect(COLORS.abandonedMine, 1, 1, 3, 7),
                fillRect(COLORS.abandonedMine, 2, 0),
                fillRect(COLORS.abandonedMine, 2, 6),
            ],
            wolfsHeadColumn: [
                fillRect(COLORS.abandonedMine, 1, 1, 15, 3),
                fillRect(COLORS.redDoor, 2, 4),
                fillRect(COLORS.abandonedMine, 10, 4),
                fillRect(COLORS.abandonedMine, 14, 4),
            ],
        },
        alchemyLaboratory: {
            batCardRoom: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 3, 3),
                fillRect(COLORS.alchemyLaboratory, 2, 0),
            ],
            blueDoorHallway: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 3, 7),
                fillRect(COLORS.alchemyLaboratory, 2, 0),
                fillRect(COLORS.alchemyLaboratory, 2, 8),
                fillRect(COLORS.obstacle, 2, 4), // Blue Door
            ],
            cannonRoom: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 3, 3),
                fillRect(COLORS.alchemyLaboratory, 2, 0),
                fillRect(COLORS.alchemyLaboratory, 2, 4),
                fillRect(COLORS.obstacle, 2, 2), // Breakable Wall
            ],
            entryway: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 3, 11),
                fillRect(COLORS.alchemyLaboratory, 0, 6),
                fillRect(COLORS.redDoor, 2, 12),
            ],
            exitToMarbleGallery: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 11, 7),
                fillRect(COLORS.alchemyLaboratory, 6, 0),
                fillRect(COLORS.redDoor, 6, 8),
            ],
            exitToRoyalChapel: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.alchemyLaboratory, 2, 4),
            ],
            loadingRoomToCastleEntrance: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 3, 3),
            ],
            loadingRoomToMarbleGallery: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 3, 3),
            ],
            loadingRoomToRoyalChapel: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 3, 3),
            ],
            slograAndGaibonRoom: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 7, 15),
                fillRect(COLORS.alchemyLaboratory, 2, 0),
                fillRect(COLORS.alchemyLaboratory, 2, 16),
                fillRect(COLORS.alchemyLaboratory, 6, 16),
            ],
            tallSpittleboneRoom: [
                fillRect(COLORS.alchemyLaboratory, 1, 1, 19, 3),
                fillRect(COLORS.alchemyLaboratory, 2, 4),
                fillRect(COLORS.alchemyLaboratory, 6, 0),
                fillRect(COLORS.alchemyLaboratory, 14, 0),
                fillRect(COLORS.alchemyLaboratory, 14, 4),
            ],
            tetrominoRoom: [
                fillRect(COLORS.alchemyLaboratory, 1, 5, 11, 3),
                fillRect(COLORS.alchemyLaboratory, 9, 1, 3, 7),
                fillRect(COLORS.alchemyLaboratory, 2, 8),
                fillRect(COLORS.alchemyLaboratory, 6, 8),
                fillRect(COLORS.alchemyLaboratory, 10, 0),
                fillRect(COLORS.alchemyLaboratory, 10, 8),
            ],
        },
        castleEntrance: {
            afterDrawbridge: [
                fillRect(COLORS.castleEntrance, 1, 1, 11, 7),
                fillRect(COLORS.castleEntrance, 10, 8),
            ],
            dropUnderPortcullis: [
                fillRect(COLORS.castleEntrance, 1, 1, 7, 3),
                fillRect(COLORS.castleEntrance, 6, 4),
            ],
            saveRoomA: [
                fillRect(COLORS.saveRoom, 1, 1, 3, 3),
                fillRect(COLORS.castleEntrance, 2, 0),
            ],
            loadingRoomToAlchemyLaboratory: [
                fillRect(COLORS.castleEntrance, 1, 1, 3, 3),
            ],
            cubeOfZoeRoom: [
                fillRect(COLORS.castleEntrance, 1, 1, 11, 7),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.redDoor, 2, 8),
                fillRect(COLORS.castleEntrance, 6, 0),
                fillRect(COLORS.castleEntrance, 6, 8),
                fillRect(COLORS.castleEntrance, 10, 0),
                fillRect(COLORS.castleEntrance, 10, 8),
            ],
            loadingRoomToMarbleGallery: [
                fillRect(COLORS.castleEntrance, 1, 1, 3, 3),
            ],
            loadingRoomToWarpRooms: [
                fillRect(COLORS.castleEntrance, 1, 1, 3, 3),
            ],
            shortcutToWarpRooms: [
                fillRect(COLORS.castleEntrance, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.castleEntrance, 2, 4),
                fillRect(COLORS.obstacle, 2, 2), // Obstacle
            ],
            loadingRoomToUndergroundCaverns: [
                fillRect(COLORS.castleEntrance, 1, 1, 3, 3),
            ],
            shortcutToUndergroundCaverns: [
                fillRect(COLORS.castleEntrance, 1, 1, 3, 3),
                fillRect(COLORS.castleEntrance, 2, 0),
                fillRect(COLORS.redDoor, 2, 4),
                fillRect(COLORS.obstacle, 2, 2), // Obstacle
            ],
            gargoyleRoom: [
                fillRect(COLORS.castleEntrance, 1, 1, 3, 3),
                fillRect(COLORS.castleEntrance, 2, 0),
                fillRect(COLORS.castleEntrance, 2, 4),
                fillRect(COLORS.castleEntrance, 4, 2),
            ],
            meetingRoomWithDeath: [
                fillRect(COLORS.castleEntrance, 1, 1, 7, 3),
                fillRect(COLORS.castleEntrance, 0, 2),
                fillRect(COLORS.castleEntrance, 2, 0),
                fillRect(COLORS.castleEntrance, 6, 0),
                fillRect(COLORS.castleEntrance, 6, 4),
            ],
        },
        castleKeep: {
            keepArea: [
                fillRect(COLORS.castleKeep, 9, 5, 7, 3),
                fillRect(COLORS.castleKeep, 13, 5, 3, 7),
                fillRect(COLORS.castleKeep, 13, 13, 3, 3),
                fillRect(COLORS.castleKeep, 13, 17, 3, 7),
                fillRect(COLORS.castleKeep, 5, 25, 23, 7),
                fillRect(COLORS.castleKeep, 17, 5, 11, 27),
                fillRect(COLORS.castleKeep, 29, 1, 3, 31),
                fillRect(COLORS.castleKeep, 6, 32),
                fillRect(COLORS.castleKeep, 14, 12),
                fillRect(COLORS.castleKeep, 14, 16),
                fillRect(COLORS.castleKeep, 14, 24),
                fillRect(COLORS.castleKeep, 18, 32),
                fillRect(COLORS.castleKeep, 26, 32),
                fillRect(COLORS.redDoor, 30, 0),
                fillRect(COLORS.castleKeep, 30, 32),
            ],
            upperAttic: [
                fillRect(COLORS.castleKeep, 1, 1, 3, 11),
                fillRect(COLORS.castleKeep, 4, 6),
            ],
            lowerAttic: [
                fillRect(COLORS.castleKeep, 1, 1, 3, 7),
                fillRect(COLORS.castleKeep, 0, 2),
                fillRect(COLORS.castleKeep, 4, 6),
            ],
            loadingRoomToRoyalChapel: [
                fillRect(COLORS.castleKeep, 1, 1, 3, 3),
            ],
            lionTorchPlatform: [
                fillRect(COLORS.castleKeep, 1, 1, 7, 3),
                fillRect(COLORS.castleKeep, 0, 2),
                fillRect(COLORS.castleKeep, 2, 0),
                fillRect(COLORS.castleKeep, 2, 4),
                fillRect(COLORS.redDoor, 6, 4),
                fillRect(COLORS.castleKeep, 8, 2),
            ],
            loadingRoomToClockTower: [
                fillRect(COLORS.castleKeep, 1, 1, 3, 3),
            ],
            dualPlatforms: [
                fillRect(COLORS.castleKeep, 1, 1, 7, 3),
                fillRect(COLORS.castleKeep, 0, 2),
                fillRect(COLORS.castleKeep, 2, 0),
                fillRect(COLORS.castleKeep, 2, 4),
                fillRect(COLORS.castleKeep, 6, 0),
                fillRect(COLORS.redDoor, 6, 4),
            ],
            loadingRoomToWarpRooms: [
                fillRect(COLORS.castleKeep, 1, 1, 3, 3),
            ],
        },
        castleCenter: {
            elevatorShaft: [
                fillRect(COLORS.castleCenter, 1, 1, 7, 3),
                fillRect(COLORS.castleCenter, 0, 2),
                fillRect(COLORS.castleCenter, 8, 2),
            ],
            centerCube: [
                fillRect(COLORS.castleCenter, 1, 1, 11, 11),
                fillRect(COLORS.castleCenter, 0, 6),
                fillRect(COLORS.wall, 4, 4, 5, 5),
                fillRect(COLORS.castleCenter, 5, 5, 3, 3),
                fillRect(COLORS.castleCenter, 8, 6),
            ],
        },
        catacombs: {
            exitToAbandonedMine: [
                fillRect(COLORS.catacombs, 1, 1, 7, 3),
                fillRect(COLORS.redDoor, 2, 4),
                fillRect(COLORS.catacombs, 6, 0),
                fillRect(COLORS.catacombs, 6, 4),
            ],
            loadingRoomToAbandonedMine: [
                fillRect(COLORS.catacombs, 1, 1, 3, 3),
            ],
            granfaloonsLair: [
                fillRect(COLORS.catacombs, 1, 1, 7, 7),
                fillRect(COLORS.catacombs, 2, 8),
                fillRect(COLORS.catacombs, 6, 0),
            ],
            roomId04: [
                fillRect(COLORS.catacombs, 1, 1, 3, 3),
                fillRect(COLORS.catacombs, 2, 0),
                fillRect(COLORS.catacombs, 2, 4),
            ],
            roomId02: [
                fillRect(COLORS.catacombs, 1, 1, 3, 3),
                fillRect(COLORS.catacombs, 2, 0),
                fillRect(COLORS.catacombs, 2, 4),
            ],
        },
        clockTower: {
            loadingRoomToCastleKeep: [
                fillRect(COLORS.clockTower, 1, 1, 3, 3),
            ],
            karasumansRoom: [
                fillRect(COLORS.clockTower, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.clockTower, 2, 4),
            ],
            stairwellToOuterWall: [
                fillRect(COLORS.clockTower, 1, 1, 7, 3),
                fillRect(COLORS.clockTower, 2, 0),
                fillRect(COLORS.redDoor, 2, 4),
                fillRect(COLORS.clockTower, 6, 0),
            ],
            loadingRoomToOuterWall: [
                fillRect(COLORS.clockTower, 1, 1, 3, 3),
            ],
            spire: [
                fillRect(COLORS.clockTower, 1, 9, 7, 3),
                fillRect(COLORS.clockTower, 5, 5, 3, 11),
                fillRect(COLORS.clockTower, 8, 10),
            ],
            belfry: [
                fillRect(COLORS.clockTower, 1, 1, 3, 11),
                fillRect(COLORS.clockTower, 1, 5, 7, 7),
                fillRect(COLORS.clockTower, 0, 6),
                fillRect(COLORS.clockTower, 6, 4),
            ],
            leftGearRoom: [
                fillRect(COLORS.clockTower, 1, 1, 15, 3),
                fillRect(COLORS.clockTower, 2, 0),
                fillRect(COLORS.clockTower, 2, 4),
                fillRect(COLORS.clockTower, 14, 0),
                fillRect(COLORS.clockTower, 14, 4),
            ],
            hiddenArmory: [
                fillRect(COLORS.clockTower, 1, 1, 3, 3),
                fillRect(COLORS.clockTower, 2, 4),
            ],
            pathToKarasuman: [
                fillRect(COLORS.clockTower, 1, 1, 3, 11),
                fillRect(COLORS.clockTower, 2, 0),
                fillRect(COLORS.clockTower, 2, 12),
            ],
            pendulumRoom: [
                fillRect(COLORS.clockTower, 1, 5, 7, 23),
                fillRect(COLORS.clockTower, 5, 1, 3, 27),
                fillRect(COLORS.clockTower, 2, 4),
                fillRect(COLORS.clockTower, 6, 0),
                fillRect(COLORS.clockTower, 6, 28),
            ],
        },
        colosseum: {
            loadingRoomToRoyalChapel: [
                fillRect(COLORS.colosseum, 1, 1, 3, 3),
            ],
            passagewayBetweenArenaAndRoyalChapel: [
                fillRect(COLORS.colosseum, 1, 1, 3, 19),
                fillRect(COLORS.colosseum, 0, 14),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.obstacle, 2, 4),
                fillRect(COLORS.colosseum, 2, 19),
                fillRect(COLORS.colosseum, 4, 6),
            ],
            arena: [
                fillRect(COLORS.colosseum, 1, 1, 3, 7),
                fillRect(COLORS.colosseum, 2, 0),
                fillRect(COLORS.colosseum, 2, 8),
            ],
            topOfElevatorShaft: [
                fillRect(COLORS.colosseum, 1, 1, 3, 19),
                fillRect(COLORS.colosseum, 0, 6),
                fillRect(COLORS.colosseum, 2, 0),
                fillRect(COLORS.obstacle, 2, 4),
                fillRect(COLORS.redDoor, 2, 20),
                fillRect(COLORS.colosseum, 4, 2),
                fillRect(COLORS.colosseum, 4, 14),
            ],
            loadingRoomToOlroxsQuarters: [
                fillRect(COLORS.colosseum, 1, 1, 3, 3),
            ],
            bottomOfElevatorShaft: [
                fillRect(COLORS.colosseum, 1, 1, 7, 15),
                fillRect(COLORS.colosseum, 0, 2),
                fillRect(COLORS.colosseum, 0, 14),
                fillRect(COLORS.colosseum, 2, 0),
                fillRect(COLORS.colosseum, 2, 16),
                fillRect(COLORS.colosseum, 6, 0),
                fillRect(COLORS.colosseum, 6, 16),
            ],
        },
        longLibrary: {
            exitToOuterWall: [
                fillRect(COLORS.longLibrary, 1, 1, 3, 11),
                fillRect(COLORS.longLibrary, 2, 0),
                fillRect(COLORS.redDoor, 2, 12),
            ],
            loadingRoomToOuterWall: [
                fillRect(COLORS.longLibrary, 1, 1, 3, 3),
            ],
            spellbookArea: [
                fillRect(COLORS.longLibrary, 1, 1, 11, 27),
                fillRect(COLORS.wall, 0, 24, 5, 5),
                fillRect(COLORS.longLibrary, 1, 25, 3, 3),
                fillRect(COLORS.longLibrary, 2, 0),
                fillRect(COLORS.longLibrary, 2, 24),
                fillRect(COLORS.longLibrary, 6, 0),
                fillRect(COLORS.longLibrary, 10, 0),
                fillRect(COLORS.longLibrary, 12, 10),
            ],
            footOfStaircase: [
                fillRect(COLORS.longLibrary, 1, 1, 3, 3),
                fillRect(COLORS.longLibrary, 0, 2),
                fillRect(COLORS.longLibrary, 2, 0),
                fillRect(COLORS.longLibrary, 2, 4),
            ],
            lesserDemonArea: [
                fillRect(COLORS.longLibrary, 1, 5, 15, 15),
                fillRect(COLORS.longLibrary, 9, 1, 7, 19),
                fillRect(COLORS.wall, 8, 4, 5, 9),
                fillRect(COLORS.wall, 12, 12, 5, 9),
                fillRect(COLORS.longLibrary, 9, 5, 3, 7),
                fillRect(COLORS.longLibrary, 13, 13, 3, 7),
                fillRect(COLORS.longLibrary, 2, 20),
                fillRect(COLORS.longLibrary, 6, 20),
                fillRect(COLORS.longLibrary, 10, 4),
                fillRect(COLORS.longLibrary, 10, 12),
                fillRect(COLORS.longLibrary, 14, 12),
            ],
            threeLayerRoom: [
                fillRect(COLORS.longLibrary, 1, 1, 3, 3),
                fillRect(COLORS.longLibrary, 2, 0),
                fillRect(COLORS.longLibrary, 2, 4),
                fillRect(COLORS.longLibrary, 5, 1, 3, 3),
                fillRect(COLORS.longLibrary, 6, 0),
                fillRect(COLORS.longLibrary, 6, 4),
                fillRect(COLORS.longLibrary, 9, 1, 3, 3),
                fillRect(COLORS.longLibrary, 10, 0),
                fillRect(COLORS.longLibrary, 10, 4),
            ],
        },
        marbleGallery: {
            threePaths: [
                fillRect(COLORS.marbleGallery, 1, 1, 7, 3),
                fillRect(COLORS.marbleGallery, 0, 2),
                fillRect(COLORS.marbleGallery, 6, 0),
                fillRect(COLORS.marbleGallery, 6, 4),
                fillRect(COLORS.marbleGallery, 8, 2),
            ],
            leftOfClockRoom: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 11),
                fillRect(COLORS.marbleGallery, 2, 0),
                fillRect(COLORS.marbleGallery, 2, 12),
            ],
            clockRoom: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 3),
                fillRect(COLORS.marbleGallery, 0, 2),
                fillRect(COLORS.marbleGallery, 2, 0),
                fillRect(COLORS.marbleGallery, 2, 4),
            ],
            rightOfClockRoom: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 11),
                fillRect(COLORS.marbleGallery, 2, 0),
                fillRect(COLORS.marbleGallery, 2, 12),
            ],
            saveRoomA: [
                fillRect(COLORS.saveRoom, 1, 1, 3, 3),
                fillRect(COLORS.marbleGallery, 2, 4),
            ],
            elevatorRoom: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 3),
                fillRect(COLORS.marbleGallery, 2, 0),
                fillRect(COLORS.marbleGallery, 2, 4),
                fillRect(COLORS.marbleGallery, 4, 2),
            ],
            powerUpRoom: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 3),
                fillRect(COLORS.marbleGallery, 2, 0),
            ],
            longHallway: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 59),
                fillRect(COLORS.marbleGallery, 2, 0),
                fillRect(COLORS.redDoor, 2, 60),
            ],
            loadingRoomToOuterWall: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 3),
            ],
            loadingRoomToCastleEntrance: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 3),
            ],
            sShapedHallways: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 23),
                fillRect(COLORS.marbleGallery, 1, 1, 7, 3),
                fillRect(COLORS.marbleGallery, 5, 1, 3, 23),
                fillRect(COLORS.marbleGallery, 5, 21, 7, 3),
                fillRect(COLORS.marbleGallery, 9, 1, 3, 23),
                fillRect(COLORS.marbleGallery, 2, 24),
                fillRect(COLORS.redDoor, 10, 0),
            ],
            loadingRoomToAlchemyLaboratory: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 3),
            ],
            entrance: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 15),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.marbleGallery, 2, 16),
            ],
            loadingRoomToOlroxsQuarters: [
                fillRect(COLORS.loadingRoom, 1, 1, 3, 3),
            ],
            pathwayAfterLeftStatue: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.marbleGallery, 2, 4),
            ],
            loadingRoomToUndergroundCaverns: [
                fillRect(COLORS.loadingRoom, 1, 1, 3, 3),
            ],
            stairwellToUndergroundCaverns: [
                fillRect(COLORS.marbleGallery, 1, 1, 7, 3),
                fillRect(COLORS.marbleGallery, 2, 0),
                fillRect(COLORS.redDoor, 6, 0),
            ],
            dropoff: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 11),
                fillRect(COLORS.marbleGallery, 2, 0),
                fillRect(COLORS.marbleGallery, 2, 12),
                fillRect(COLORS.marbleGallery, 4, 6),
                fillRect(COLORS.marbleGallery, 4, 10),
            ],
            beneathDropoff: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 7),
                fillRect(COLORS.marbleGallery, 0, 2),
                fillRect(COLORS.marbleGallery, 0, 6),
                fillRect(COLORS.marbleGallery, 2, 8),
                fillRect(COLORS.marbleGallery, 4, 2),
            ],
            stainedGlassCorner: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 3),
                fillRect(COLORS.marbleGallery, 0, 2),
                fillRect(COLORS.marbleGallery, 2, 0),
            ],
            blueDoorRoom: [
                fillRect(COLORS.marbleGallery, 1, 1, 3, 7),
                fillRect(COLORS.marbleGallery, 2, 0),
                fillRect(COLORS.obstacle, 2, 4),
            ],
        },
        olroxsQuarters: {
            skelerangRoom: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 11, 3),
                fillRect(COLORS.olroxsQuarters, 2, 0),
                fillRect(COLORS.redDoor, 10, 4),
            ],
            loadingRoomToMarbleGallery: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 3, 3),
            ],
            loadingRoomToRoyalChapel: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 3, 3),
            ],
            catwalkCrypt: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 3, 27),
                fillRect(COLORS.olroxsQuarters, 0, 6),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.olroxsQuarters, 2, 28),
            ],
            loadingRoomToColosseum: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 3, 3),
            ],
            grandStaircase: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 7, 11),
                fillRect(COLORS.olroxsQuarters, 2, 12),
                fillRect(COLORS.redDoor, 6, 0),
                fillRect(COLORS.olroxsQuarters, 6, 12),
            ],
            bottomOfStairwell: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 3, 3),
                fillRect(COLORS.olroxsQuarters, 0, 2),
                fillRect(COLORS.olroxsQuarters, 2, 4),
            ],
            tallShaft: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 23, 3),
                fillRect(COLORS.olroxsQuarters, 0, 2),
                fillRect(COLORS.redDoor, 22, 4),
            ],
            loadingRoomToWarpRooms: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 3, 3),
            ],
            echoOfBatRoom: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 3, 11),
                fillRect(COLORS.olroxsQuarters, 2, 12),
            ],
            olroxsRoom: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 7, 7),
                fillRect(COLORS.olroxsQuarters, 2, 0),
                fillRect(COLORS.olroxsQuarters, 2, 8),
            ],
            narrowHallwayToOlrox: [
                fillRect(COLORS.olroxsQuarters, 1, 1, 3, 15),
                fillRect(COLORS.olroxsQuarters, 2, 0),
                fillRect(COLORS.olroxsQuarters, 2, 16),
            ],
        },
        outerWall: {
            elevatorShaftRoom: [
                fillRect(COLORS.outerWall, 1, 1, 7, 7),
                fillRect(COLORS.outerWall, 13, 1, 23, 7),
                fillRect(COLORS.outerWall, 1, 5, 35, 3),
                fillRect(COLORS.outerWall, 0, 6),
                fillRect(COLORS.redDoor, 10, 4),
                fillRect(COLORS.redDoor, 26, 0),
                fillRect(COLORS.outerWall, 34, 0),
            ],
            loadingRoomToWarpRooms: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
            ],
            loadingRoomToLongLibrary: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
            ],
            loadingRoomToClockTower: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
            ],
            exitToClockTower: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
                fillRect(COLORS.outerWall, 0, 2),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.outerWall, 4, 2),
            ],
            loadingRoomToMarbleGallery: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
            ],
            exitToMarbleGallery: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
                fillRect(COLORS.outerWall, 0, 2),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.outerWall, 4, 2),
            ],
            lowerMedusaRoom: [
                fillRect(COLORS.outerWall, 1, 1, 11, 7),
                fillRect(COLORS.outerWall, 0, 6),
                fillRect(COLORS.outerWall, 2, 0),
                fillRect(COLORS.outerWall, 6, 0),
                fillRect(COLORS.outerWall, 12, 2),
                fillRect(COLORS.outerWall, 12, 6),
            ],
            telescopeRoom: [
                fillRect(COLORS.outerWall, 1, 5, 3, 7),
                fillRect(COLORS.outerWall, 0, 6),
                fillRect(COLORS.outerWall, 0, 10),
            ],
            garlicRoom: [
                fillRect(COLORS.outerWall, 1, 1, 7, 3),
                fillRect(COLORS.outerWall, 2, 4),
                fillRect(COLORS.outerWall, 6, 0),
                fillRect(COLORS.outerWall, 6, 4),
            ],
            doppelgangerRoom: [
                fillRect(COLORS.outerWall, 1, 1, 3, 7),
                fillRect(COLORS.outerWall, 2, 0),
                fillRect(COLORS.outerWall, 2, 8),
            ],
            gladiusRoom: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
                fillRect(COLORS.outerWall, 2, 0),
                fillRect(COLORS.outerWall, 2, 4),
            ],
            secretPlatformRoom: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
                fillRect(COLORS.outerWall, 2, 4),
                fillRect(COLORS.outerWall, 4, 2),
            ],
            jewelKnucklesRoom: [
                fillRect(COLORS.outerWall, 1, 1, 3, 3),
                fillRect(COLORS.outerWall, 0, 2),
                fillRect(COLORS.outerWall, 2, 4),
            ],
        },
        royalChapel: {
            walkwayLeftOfHippogryph: [
                fillRect(COLORS.royalChapel, 1, 5, 3, 7),
                fillRect(COLORS.royalChapel, 2, 4),
                fillRect(COLORS.royalChapel, 2, 12),
            ],
            hippogryphRoom: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 7),
                fillRect(COLORS.royalChapel, 2, 0),
                fillRect(COLORS.royalChapel, 2, 8),
            ],
            walkwayRightOfHippogryph: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 7),
                fillRect(COLORS.royalChapel, 2, 0),
                fillRect(COLORS.royalChapel, 2, 8),
            ],
            rightTower: [
                fillRect(COLORS.royalChapel, 1, 5, 15, 7),
                fillRect(COLORS.redDoor, 10, 12),
                fillRect(COLORS.royalChapel, 14, 4),
                fillRect(COLORS.royalChapel, 14, 12),
            ],
            loadingRoomToCastleKeep: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 3),
            ],
            saveRoomB: [
                fillRect(COLORS.saveRoom, 1, 1, 3, 3),
                fillRect(COLORS.royalChapel, 2, 0),
            ],
            pushingStatueShortcut: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 3),
                fillRect(COLORS.royalChapel, 2, 0),
                fillRect(COLORS.obstacle, 2, 2),
                fillRect(COLORS.redDoor, 2, 4),
            ],
            loadingRoomToOlroxsQuarters: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 3),
            ],
            nave: [
                fillRect(COLORS.royalChapel, 1, 1, 7, 7),
                fillRect(COLORS.royalChapel, 2, 0),
                fillRect(COLORS.royalChapel, 2, 8),
                fillRect(COLORS.royalChapel, 6, 0),
                fillRect(COLORS.redDoor, 6, 8),
            ],
            loadingRoomToColosseum: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 3),
            ],
            saveRoomA: [
                fillRect(COLORS.saveRoom, 1, 1, 3, 3),
                fillRect(COLORS.royalChapel, 2, 4),
            ],
            statueLedge: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 3),
                fillRect(COLORS.royalChapel, 0, 2),
                fillRect(COLORS.royalChapel, 2, 0),
                fillRect(COLORS.redDoor, 2, 4),
            ],
            loadingRoomToAlchemyLaboratory: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 3),
            ],
            chapelStaircase: [
                fillRect(COLORS.royalChapel, 1, 25, 11, 7),
                fillRect(COLORS.royalChapel, 5, 21, 11, 7),
                fillRect(COLORS.royalChapel, 9, 17, 7, 7),
                fillRect(COLORS.royalChapel, 13, 13, 7, 7),
                fillRect(COLORS.royalChapel, 17, 9, 7, 7),
                fillRect(COLORS.royalChapel, 21, 5, 7, 7),
                fillRect(COLORS.royalChapel, 25, 1, 3, 11),
                fillRect(COLORS.royalChapel, 6, 32),
                fillRect(COLORS.royalChapel, 28, 6),
            ],
            leftTower: [
                fillRect(COLORS.royalChapel, 1, 5, 39, 7),
                fillRect(COLORS.royalChapel, 10, 12),
                fillRect(COLORS.royalChapel, 14, 4),
                fillRect(COLORS.royalChapel, 30, 12),
                fillRect(COLORS.royalChapel, 38, 4),
                fillRect(COLORS.royalChapel, 38, 12),
            ],
            middleTower: [
                fillRect(COLORS.royalChapel, 1, 5, 15, 7),
                fillRect(COLORS.royalChapel, 10, 12),
                fillRect(COLORS.royalChapel, 14, 4),
            ],
            spikeHallway: [
                fillRect(COLORS.royalChapel, 1, 1, 3, 15),
                fillRect(COLORS.royalChapel, 2, 0),
                fillRect(COLORS.obstacle, 2, 4),
                fillRect(COLORS.obstacle, 2, 12),
                fillRect(COLORS.royalChapel, 2, 16),
            ],
            walkwayBetweenTowers: [
                fillRect(COLORS.royalChapel, 1, 5, 3, 11),
                fillRect(COLORS.royalChapel, 2, 4),
                fillRect(COLORS.royalChapel, 2, 16),
            ],
        },
        undergroundCaverns: {
            falseSaveRoom: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
                fillRect(COLORS.undergroundCaverns, 2, 0),
            ],
            loadingRoomToCastleEntrance: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
            ],
            exitToCastleEntrance: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 7),
                fillRect(COLORS.redDoor, 2, 0),
                fillRect(COLORS.undergroundCaverns, 4, 6),
            ],
            longDrop: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 43, 3),
                fillRect(COLORS.redDoor, 2, 4),
                fillRect(COLORS.undergroundCaverns, 6, 0),
                fillRect(COLORS.undergroundCaverns, 6, 4),
                fillRect(COLORS.undergroundCaverns, 14, 4),
                fillRect(COLORS.undergroundCaverns, 44, 2),
            ],
            loadingRoomToMarbleGallery: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
            ],
            loadingRoomToAbandonedMine: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
            ],
            exitToAbandonedMine: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
                fillRect(COLORS.undergroundCaverns, 0, 2),
                fillRect(COLORS.redDoor, 2, 0),
            ],
            hiddenCrystalEntrance: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 11, 3),
                fillRect(COLORS.undergroundCaverns, 0, 2),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 2, 4),
                fillRect(COLORS.undergroundCaverns, 10, 4),
                fillRect(COLORS.undergroundCaverns, 12, 2),
            ],
            crystalCloakRoom: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
                fillRect(COLORS.undergroundCaverns, 2, 4),
            ],
            scyllaRoom: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 19),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 4, 14),
            ],
            scyllaWyrmRoom: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 2, 4),
            ],
            risingWaterRoom: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 19),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 0, 14),
            ],
            dKButton: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
                fillRect(COLORS.undergroundCaverns, 2, 4),
            ],
            waterfall: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 23, 7),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 2, 8),
                fillRect(COLORS.undergroundCaverns, 22, 0),
                fillRect(COLORS.undergroundCaverns, 22, 8),
            ],
            pentagramRoom: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 2, 4),
            ],
            roomId19: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 2, 4),
            ],
            roomId18: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 3),
                fillRect(COLORS.undergroundCaverns, 2, 0),
            ],
            iceFloeRoom: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 7, 7),
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 35),
                fillRect(COLORS.undergroundCaverns, 1, 13, 7, 23),
                fillRect(COLORS.undergroundCaverns, 0, 34),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 2, 36),
            ],
            rightFerrymanRoute: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 51),
                fillRect(COLORS.undergroundCaverns, 1, 1, 7, 11),
                fillRect(COLORS.undergroundCaverns, 1, 25, 7, 7),
                fillRect(COLORS.undergroundCaverns, 1, 37, 7, 15),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.obstacle, 2, 34),
                fillRect(COLORS.undergroundCaverns, 2, 52),
            ],
            leftFerrymanRoute: [
                fillRect(COLORS.undergroundCaverns, 1, 1, 3, 51),
                fillRect(COLORS.undergroundCaverns, 1, 1, 7, 19),
                fillRect(COLORS.undergroundCaverns, 0, 34),
                fillRect(COLORS.undergroundCaverns, 2, 0),
                fillRect(COLORS.undergroundCaverns, 2, 52),
            ],
        },
        warpRooms: {
            warpRoomToCastleEntrance: [
                fillRect(COLORS.warpRooms, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 4),
            ],
            warpRoomToCastleKeep: [
                fillRect(COLORS.warpRooms, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 0),
            ],
            warpRoomToOlroxsQuarters: [
                fillRect(COLORS.warpRooms, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 0),
            ],
            warpRoomToOuterWall: [
                fillRect(COLORS.warpRooms, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 4),
            ],
            warpRoomToAbandonedMine: [
                fillRect(COLORS.warpRooms, 1, 1, 3, 3),
                fillRect(COLORS.redDoor, 2, 0),
            ],
        },
    }

    // Find any unspecified map pixels and fill them in with a default that should work for most simple rooms
    Object.entries(NODE_GROUPS)
    .forEach(([stageName, nodeGroup]) => {
        Object.entries(nodeGroup)
        .filter(([nodeGroupName, nodeGroupInfo]) => {
            if (stageName in MAP_PIXELS && nodeGroupName in MAP_PIXELS[stageName]) {
                return false
            }
            // NOTE(sestren): Node groups with multiple rooms have empty space and internal passageways, so they won't make good templates for drawing simple rooms
            if (nodeGroupInfo.rooms.length > 1) {
                return false
            }
            const cellData = nodeGroupInfo.cells.at(0).at(0)
            for (let row = 0; row < nodeGroupInfo.cells.length; row++) {
                const rowData = nodeGroupInfo.cells.at(row)
                if (rowData !== cellData.repeat(rowData.length)) {
                    return false
                }
            }
            return true
        })
        .forEach(([nodeGroupName, nodeGroupInfo]) => {
            // console.log('stageName:', stageName, 'roomName:', nodeGroupName)
            if (!(stageName in MAP_PIXELS)) {
                MAP_PIXELS[stageName] = {}
            }
            if (!(nodeGroupName in MAP_PIXELS[stageName])) {
                MAP_PIXELS[stageName][nodeGroupName] = []
            }
            let colorIndex = COLORS[stageName]
            if (nodeGroupName.startsWith('saveRoom')) {
                colorIndex = COLORS.saveRoom
            }
            const rows = nodeGroupInfo.cells.length
            const columns = nodeGroupInfo.cells.at(0).length
            MAP_PIXELS[stageName][nodeGroupName].push(
                fillRect(colorIndex, 1, 1, 4 * rows - 1, 4 * columns - 1)
            )
            // NOTE(sestren): Entrances to save rooms should match the stage color
            if (nodeGroupName.startsWith('saveRoom')) {
                colorIndex = COLORS[stageName]
            }
            nodeGroupInfo.edges
            .forEach((edgeInfo) => {
                MAP_PIXELS[stageName][nodeGroupName].push(
                    fillRect(colorIndex, Math.floor(4 * edgeInfo.row), Math.floor(4 * edgeInfo.column))
                )
            })
        })
    })

    function getMapPixels(stageLinks, roomPositions) {
        const chars = 'CDHIJKLNSTUVXYZ147+-####'
        const assignments = new Map()
        const result = structuredClone(MAP_PIXELS)
        Object.entries(stageLinks)
        .filter(([sourceTeleporterName, targetTeleporterName]) => {
            // TODO(sestren): Don't draw labels if the loading rooms overlap (not just for Warp Rooms, will need roomPositions)
            return ![
                TELEPORTERS[sourceTeleporterName].sourceStage,
                TELEPORTERS[targetTeleporterName].sourceStage,
            ].includes('warpRooms')
        })
        .forEach(([sourceTeleporterName, targetTeleporterName]) => {
            const charIndex = Math.floor(assignments.size / 2)
            const glyphName = chars.at(charIndex)
            if (!assignments.has(sourceTeleporterName)) {
                const sourceStage = TELEPORTERS[sourceTeleporterName].sourceStage
                const targetStage = TELEPORTERS[sourceTeleporterName].targetStage
                const joinedStage = TELEPORTERS[targetTeleporterName].sourceStage
                const targetRoom = 'loadingRoomTo' + targetStage.at(0).toUpperCase() + targetStage.slice(1)
                result[sourceStage][targetRoom].push(fillRect(COLORS.loadingRoom, 1, 1, 3, 3))
                result[sourceStage][targetRoom].push(drawGlyph(COLORS[joinedStage], glyphName, 1, 1))
                assignments.set(sourceTeleporterName, glyphName)
            }
            if (!assignments.has(targetTeleporterName)) {
                const sourceStage = TELEPORTERS[targetTeleporterName].sourceStage
                const targetStage = TELEPORTERS[targetTeleporterName].targetStage
                const joinedStage = TELEPORTERS[sourceTeleporterName].sourceStage
                const targetRoom = 'loadingRoomTo' + targetStage.at(0).toUpperCase() + targetStage.slice(1)
                result[sourceStage][targetRoom].push(fillRect(COLORS.loadingRoom, 1, 1, 3, 3))
                result[sourceStage][targetRoom].push(drawGlyph(COLORS[joinedStage], glyphName, 1, 1))
                assignments.set(targetTeleporterName, glyphName)
            }
        })
        return result
    }

    // Arrange the stages on the map so they fit together as much as possible
    // TODO(sestren): Allow overlapping load rooms if linked via teleporters
    // TODO(sestren): Come up with several possible arrangements, and choose the one that maximizes the number of overlapping load rooms
    function arrangeStages(seed, startingNodeGroups) {
        const rng = seedrandom(seed)
        let validInd = false
        let result
        while (!validInd) {
            validInd = true
            const nodeGroups = JSON.parse(JSON.stringify(Object.values(startingNodeGroups)))
            const groupIndexes = Array.from(Array(nodeGroups.length).keys())
            common.shuffleArray(rng, groupIndexes)
            let groupIndex = groupIndexes.pop()
            result = nodeGroups.at(groupIndex)
            while (groupIndexes.length > 0) {
                let minEncumbrance = Number.POSITIVE_INFINITY
                let candidates = []
                groupIndex = groupIndexes.pop()
                const nodeGroup = nodeGroups.at(groupIndex)
                const minRows = -1 * nodeGroup.cells.length
                const maxRows = result.cells.length + nodeGroup.cells.length
                const minColumns = -1 * nodeGroup.cells.at(0).length
                const maxColumns = result.cells.at(0).length + nodeGroup.cells.at(0).length
                // console.log('dimensions:', minRows, maxRows, minColumns, maxColumns)
                for (let rowOffset = minRows; rowOffset <= maxRows; rowOffset++) {
                    for (let columnOffset = minColumns; columnOffset <= maxColumns; columnOffset++) {
                        const candidate = combineNodeGroups(result, nodeGroup, rowOffset, columnOffset)
                        if (candidate ) {
                            const encumbrance = candidate.cells.length * candidate.cells.at(0).length
                            if (encumbrance < minEncumbrance) {
                                minEncumbrance = encumbrance
                                candidates = []
                            }
                            if (encumbrance === minEncumbrance) {
                                // console.log(`rowOffset: ${rowOffset}, columnOffset: ${columnOffset}, minEncumbrance: ${minEncumbrance}, encumbrance: ${encumbrance}`)
                                candidates.push(candidate)
                            }
                        }
                    }
                }
                if (candidates.length < 1) {
                    validInd = false
                    continue
                }
                result = candidates.at(Math.floor(rng() * candidates.length))
            }
        }
        return result
    }

    function combineNodeGroups(baseNodeGroup, nodeGroup, rowOffset, columnOffset, options = {}) {
        const MAX_MAP_COL = 63
        const MAX_MAP_ROW = 51
        const result = {
            rooms: [],
            cells: [],
            edges: [],
        }
        baseNodeGroup.rooms
        .forEach((roomInfo) => {
            result.rooms.push({
                stage: roomInfo.stage,
                room: roomInfo.room,
                row: roomInfo.row + Math.max(0, -rowOffset),
                column: roomInfo.column + Math.max(0, -columnOffset),
            })
        })
        nodeGroup.rooms
        .forEach((roomInfo) => {
            result.rooms.push({
                stage: roomInfo.stage,
                room: roomInfo.room,
                row: roomInfo.row + Math.max(0, rowOffset),
                column: roomInfo.column + Math.max(0, columnOffset),
            })
        })
        const rows = Math.max(baseNodeGroup.cells.length, nodeGroup.cells.length + rowOffset) - Math.min(0, rowOffset)
        const columns = Math.max(baseNodeGroup.cells.at(0).length, nodeGroup.cells.at(0).length + columnOffset) - Math.min(0, columnOffset)
        if (rows >= MAX_MAP_ROW || columns >= MAX_MAP_COL) {
            return null
        }
        result.cells = []
        for (let row = 0; row < rows; row++) {
            const rowData = []
            for (let column = 0; column < columns; column++) {
                const rowA = row - Math.max(0, -rowOffset)
                const columnA = column - Math.max(0, -columnOffset)
                let charA = null
                if (
                    (rowA >= 0) &&
                    (rowA < baseNodeGroup.cells.length) &&
                    (columnA >= 0) &&
                    (columnA < baseNodeGroup.cells.at(rowA).length) &&
                    (baseNodeGroup.cells.at(rowA).at(columnA)) !== '.'
                ) {
                    charA = baseNodeGroup.cells.at(rowA).at(columnA)
                }
                const rowB = row - Math.max(0, rowOffset)
                const columnB = column - Math.max(0, columnOffset)
                let charB = null
                if (
                    (rowB >= 0) &&
                    (rowB < nodeGroup.cells.length) &&
                    (columnB >= 0) &&
                    (columnB < nodeGroup.cells.at(rowB).length) &&
                    (nodeGroup.cells.at(rowB).at(columnB)) !== '.'
                ) {
                    charB = nodeGroup.cells.at(rowB).at(columnB)
                }
                if (charA !== null && charB !== null) {
                    if (!(options.allowOverlaps ?? false)) {
                        return null
                    }
                }
                rowData.push(charA ?? charB ?? '.')
            }
            result.cells.push(rowData.join(''))
        }
        let validInd = true
        baseNodeGroup.edges
        .filter((baseEdgeInfo) => {
            // This is O(M * N), but N is assumed to be very small
            const baseRow = baseEdgeInfo.row + Math.max(0, -rowOffset)
            const baseColumn = baseEdgeInfo.column + Math.max(0, -columnOffset)
            const matchingEdgesFound = nodeGroup.edges
            .filter((edgeInfo) => {
                const row = edgeInfo.row + Math.max(0, rowOffset)
                const column = edgeInfo.column + Math.max(0, columnOffset)
                return baseRow == row && baseColumn == column
            })
            const mismatchedEdges = matchingEdgesFound
            .filter((edgeInfo) => {
                return baseEdgeInfo.collision != edgeInfo.collision
            })
            if (mismatchedEdges.length > 0) {
                if (!(options.allowMismatchedEdges ?? false)) {
                    validInd = false
                }
            }
            return matchingEdgesFound.length < 1
        })
        .forEach((baseEdgeInfo) => {
            const baseRow = baseEdgeInfo.row + Math.max(0, -rowOffset)
            const baseColumn = baseEdgeInfo.column + Math.max(0, -columnOffset)
            result.edges.push({
                roomName: baseEdgeInfo.roomName,
                edgeName: baseEdgeInfo.edgeName,
                collision: baseEdgeInfo.collision,
                row: baseRow,
                column: baseColumn,
            })
        })
        if (!validInd) {
            return null
        }
        const nodeEdges = Array.isArray(nodeGroup.edges) ? nodeGroup.edges : []
        nodeEdges
        .filter((edgeInfo) => {
            // This is O(M * N), but M is assumed to be very small
            const row = edgeInfo.row + Math.max(0, rowOffset)
            const column = edgeInfo.column + Math.max(0, columnOffset)
            const matchingEdgesFound = baseNodeGroup.edges
            .filter((baseEdgeInfo) => {
                const baseRow = baseEdgeInfo.row + Math.max(0, -rowOffset)
                const baseColumn = baseEdgeInfo.column + Math.max(0, -columnOffset)
                return row == baseRow && column == baseColumn
            })
            const mismatchedEdges = matchingEdgesFound
            .filter((baseEdgeInfo) => {
                return edgeInfo.collisions != baseEdgeInfo.collisions
            })
            if (mismatchedEdges.length > 0) {
                if (!(options.allowMismatchedEdges ?? false)) {
                    validInd = false
                }
            }
            return matchingEdgesFound.length < 1
        })
        .forEach((edgeInfo) => {
            const row = edgeInfo.row + Math.max(0, rowOffset)
            const column = edgeInfo.column + Math.max(0, columnOffset)
            result.edges.push({
                roomName: edgeInfo.roomName,
                collision: edgeInfo.collision,
                row: row,
                column: column,
            })
        })
        if (!validInd) {
            return null
        }
        // Verify that all open edges do not face a filled-in square
        const blockedEdges = result.edges
        .filter((edgeInfo) => {
            let rowA = edgeInfo.row
            let rowB = edgeInfo.row
            let columnA = edgeInfo.column
            let columnB = edgeInfo.column
            if (Number.isInteger(edgeInfo.row)) {
                columnA -= 0.5
                columnB -= 0.5
                rowA -= 1
            }
            else if (Number.isInteger(edgeInfo.column)) {
                rowA -= 0.5
                rowB -= 0.5
                columnA -= 1
            }
            else {
                throw Error('Either row or column of edge must be non-integer')
            }
            if (
                (0 <= rowA && rowA < result.cells.length) &&
                (0 <= rowB && rowB < result.cells.length) &&
                (0 <= columnA && columnA < result.cells.at(0).length) &&
                (0 <= columnB && columnB < result.cells.at(0).length)
            ) {
                const cellA = result.cells.at(rowA).at(columnA)
                const cellB = result.cells.at(rowB).at(columnB)
                return (cellA !== '.') && (cellB !== '.')
            }
            else {
                return false
            }
        })
        if (blockedEdges.length > 0) {
            return null
        }
        // NOTE(sestren): Sort rooms and edges before returning so that hashing can be consistent
        result.edges = result.edges.sort((a, b) => {
            if (a.roomName < b.roomName) {
                return -1
            }
            else if (a.roomName > b.roomName) {
                return 1
            }
            else if (a.edgeName < b.edgeName) {
                return -1
            }
            else if (a.edgeName > b.edgeName) {
                return 1
            }
            else {
                return 0
            }
        })
        result.rooms = result.rooms.sort((a, b) => {
            if (a.stage < b.stage) {
                return -1
            }
            else if (a.stage > b.stage) {
                return 1
            }
            else if (a.room < b.room) {
                return -1
            }
            else if (a.room > b.room) {
                return 1
            }
            else {
                return 0
            }
        })
        // console.log('result:', result)
        return result
    }

    function getVanillaRoomPositions(extraction) {
        const result = []
        Object.entries(extraction.stages)
        .forEach(([stageName, stageInfo]) => {
            Object.entries(stageInfo.rooms.aliases)
            .forEach(([roomName, roomIndex]) => {
                const roomInfo = extraction.stages[stageName].rooms.data[roomIndex]
                const roomPosition = {
                    stage: stageName,
                    room: roomName,
                    row: roomInfo.top,
                    column: roomInfo.left,
                }
                result.push(roomPosition)
            })
        })
        return result
    }

    function getVanillaNodeGroupForStage(extraction, stageName) {
        let result = {
            rooms: [],
            cells: [
                '.',
            ],
            edges: [],
        }
        let stageTop = 63
        let stageLeft = 63
        Object.entries(extraction.stages[stageName].rooms.aliases)
        .forEach(([roomName, roomIndex]) => {
            const roomInfo = extraction.stages[stageName].rooms.data[roomIndex]
            stageTop = Math.min(stageTop, roomInfo.top)
            stageLeft = Math.min(stageLeft, roomInfo.left)
        })
        Object.entries(NODE_GROUPS[stageName])
        .forEach(([nodeGroupName, nodeGroupInfo]) => {
            // NOTE(sestren): Node groups are assumed to be named after one of the rooms in the group
            const roomIndex = extraction.stages[stageName].rooms.aliases[nodeGroupName]
            const roomInfo = extraction.stages[stageName].rooms.data[roomIndex]
            const nodeRoomIndex = nodeGroupInfo.rooms
            .map((nodeRoomInfo) => {
                return nodeRoomInfo.room
            })
            .indexOf(nodeGroupName)
            const nodeRoomInfo = nodeGroupInfo.rooms[nodeRoomIndex]
            const offsetRow = roomInfo.top - stageTop - nodeRoomInfo.row
            const offsetColumn = roomInfo.left - stageLeft - nodeRoomInfo.column
            result = combineNodeGroups(
                result, nodeGroupInfo, offsetRow, offsetColumn, {
                allowMismatchedEdges: true,
                // allowOverlaps: true,
            }
            )
        })
        return result
    }

    function shuffleRooms(seed, stageName, applyNormalization) {
        if (applyNormalization) {
            Object.entries(COLLISIONS)
            .forEach(([collisionKey, collisionValue]) => {
                const properties = collisionKey.split('.')
                const stageName = properties.at(0)
                const nodeGroupName = properties.at(1)
                const edgeName = properties.at(2)
                const edgeIndex = NODE_GROUPS[stageName][nodeGroupName].edges
                .map((edgeInfo) => {
                    return edgeInfo.edgeName
                }).indexOf(edgeName)
                NODE_GROUPS[stageName][nodeGroupName].edges[edgeIndex].collision = collisionValue
            })
        }
        const stageNodeGroups = JSON.parse(JSON.stringify(Object.values(NODE_GROUPS[stageName]).sort()))
        stageNodeGroups
        .forEach((stageNodeGroup) => {
            stageNodeGroup.edges = Object.values(stageNodeGroup.edges).sort()
        })
        const rng = seedrandom(seed)
        let attemptCount = 0
        let validInd = false
        let result
        while (!validInd) {
            validInd = true
            attemptCount += 1
            const groupIndexes = Array.from(Array(stageNodeGroups.length).keys())
            common.shuffleArray(rng, groupIndexes)
            const groupIndex = groupIndexes.pop()
            result = stageNodeGroups.at(groupIndex)
            while (groupIndexes.length > 0) {
                if (result.edges.length < 1) {
                    validInd = false
                    // console.log('ERROR result.edges.length < 1:', result.edges.length)
                    break
                }
                const edgeIndex = Math.floor(rng() * result.edges.length)
                const baseEdge = result.edges.at(edgeIndex)
                const candidatePlacements = []
                for (let i = 0; i < groupIndexes.length; i++) {
                    const groupIndex = groupIndexes.at(i)
                    const nodeGroup = stageNodeGroups.at(groupIndex)
                    for (let j = 0; j < nodeGroup.edges.length; j++) {
                        const edge = nodeGroup.edges.at(j)
                        const rowOffset = baseEdge.row - edge.row
                        const columnOffset = baseEdge.column - edge.column
                        // A non-integer offset implies a horizontal edge being matched with a vertical edge
                        if (Number.isInteger(rowOffset) && Number.isInteger(columnOffset)) {
                            candidatePlacements.push({
                                groupIndex: groupIndex,
                                rowOffset: rowOffset,
                                columnOffset: columnOffset,
                            })
                            // const nextResult = combineNodeGroups(result, nodeGroup, rowOffset, columnOffset)
                        }
                    }
                }
                if (candidatePlacements.length < 1) {
                    // console.log('ERROR nextResults.length < 1:', nextResults.length)
                    validInd = false
                    break
                }
                common.shuffleArray(rng, candidatePlacements)
                validInd = false
                for (let i = 0; i < candidatePlacements.length; i++) {
                    const placement = candidatePlacements.at(i)
                    const nodeGroup = stageNodeGroups.at(placement.groupIndex)
                    const nextResult = combineNodeGroups(result, nodeGroup, placement.rowOffset, placement.columnOffset)
                    if (nextResult !== null) {
                        const spliceIndex = groupIndexes.indexOf(placement.groupIndex)
                        groupIndexes.splice(spliceIndex, 1)
                        result = nextResult
                        validInd = true
                        break
                    }
                }
                if (!validInd) {
                    break
                }
            }
            if (groupIndexes.length > 0 || result.edges.length > 0) {
                // console.log('ERROR groupIndexes.length > 0 || result.edges.length > 0:', groupIndexes.length, result.edges.length)
                validInd = false
            }
        }
        // console.log('attemptCount:', attemptCount)
        // console.log('result.cells:', result.cells)
        // console.log('shuffleRooms:', result)
        return result
    }

    function getRoomChanges(rooms, rowOffset, columnOffset) {
        const roomData = {}
        rooms
        .forEach((roomInfo) => {
            const rowProperty = `stages.${roomInfo.stage}.rooms.${roomInfo.room}.top=`
            roomData[rowProperty] = rowOffset + roomInfo.row
            const columnProperty = `stages.${roomInfo.stage}.rooms.${roomInfo.room}.left=`
            roomData[columnProperty] = columnOffset + roomInfo.column
        })
        const result = Object.assign({}, TEMPLATE)
        result.changes.push({
            changeType: 'merge',
            merge: roomData,
        })
        return result
    }

    const exports = {
        MAP_PIXELS: MAP_PIXELS,
        NODE_GROUPS: NODE_GROUPS,
        VALIDATIONS: VALIDATIONS,
        arrangeStages: arrangeStages,
        combineNodeGroups: combineNodeGroups,
        getMapPixels: getMapPixels,
        getRoomChanges: getRoomChanges,
        getVanillaNodeGroupForStage: getVanillaNodeGroupForStage,
        getVanillaRoomPositions: getVanillaRoomPositions,
        shuffleRooms: shuffleRooms,
    }
    if (self) {
        self.sotnShuffler = Object.assign(self.sotnShuffler || {}, {
            roomShuffler: exports,
        })
    } else {
        module.exports = exports
    }
})(typeof (self) !== 'undefined' ? self : null)
