const test = require('node:test')
const assert = require('node:assert')

const stageShuffler = require('../stage-shuffler.js')
const wordGenerator = require('../word-generator.js')

const testLinks = [
    {
        testDescription: 'Test generating a sample configuration of stages',
        input: {
            seed: 'asdf',
        },
        expected: {
            linkedStages: {
                abandonedMine: [
                    'marbleGallery',
                    'outerWall',
                    'royalChapel',
                ],
                alchemyLaboratory: [
                    'castleEntrance',
                    'castleKeep',
                    'colosseum',
                ],
                castleEntrance: [
                    'alchemyLaboratory',
                    'marbleGallery',
                    'royalChapel',
                    'undergroundCaverns',
                ],
                castleKeep: [
                    'alchemyLaboratory',
                    'clockTower',
                    'warpRooms',
                ],
                catacombs: [
                    'olroxsQuarters',
                ],
                clockTower: [
                    'castleKeep',
                    'olroxsQuarters',
                ],
                colosseum: [
                    'alchemyLaboratory',
                    'marbleGallery',
                ],
                longLibrary: [
                    'marbleGallery',
                ],
                marbleGallery: [
                    'abandonedMine',
                    'castleEntrance',
                    'colosseum',
                    'longLibrary',
                    'undergroundCaverns',
                ],
                olroxsQuarters: [
                    'catacombs',
                    'clockTower',
                    'outerWall',
                    'warpRooms',
                ],
                outerWall: [
                    'abandonedMine',
                    'olroxsQuarters',
                    'royalChapel',
                    'warpRooms',
                ],
                royalChapel: [
                    'abandonedMine',
                    'castleEntrance',
                    'outerWall',
                    'warpRooms',
                ],
                undergroundCaverns: [
                    'castleEntrance',
                    'marbleGallery',
                    'warpRooms',
                ],
                warpRooms: [
                    'castleKeep',
                    'olroxsQuarters',
                    'outerWall',
                    'royalChapel',
                    'undergroundCaverns',
                ],
            },
            links: {
                fromAbandonedMineToCatacombs: 'fromRoyalChapelToCastleKeep',
                fromAbandonedMineToUndergroundCaverns: 'fromOuterWallToMarbleGallery',
                fromAbandonedMineToWarpRooms: 'fromMarbleGalleryToUndergroundCaverns',
                fromAlchemyLaboratoryToCastleEntrance: 'fromCastleEntranceToWarpRooms',
                fromAlchemyLaboratoryToMarbleGallery: 'fromCastleKeepToRoyalChapel',
                fromAlchemyLaboratoryToRoyalChapel: 'fromColosseumToOlroxsQuarters',
                fromCastleEntranceToAlchemyLaboratory: 'fromRoyalChapelToAlchemyLaboratory',
                fromCastleEntranceToMarbleGallery: 'fromMarbleGalleryToOlroxsQuarters',
                fromCastleEntranceToUndergroundCaverns: 'fromUndergroundCavernsToCastleEntrance',
                fromCastleEntranceToWarpRooms: 'fromAlchemyLaboratoryToCastleEntrance',
                fromCastleKeepToClockTower: 'fromClockTowerToCastleKeep',
                fromCastleKeepToRoyalChapel: 'fromAlchemyLaboratoryToMarbleGallery',
                fromCastleKeepToWarpRooms: 'fromWarpRoomsToAbandonedMine',
                fromCatacombsToAbandonedMine: 'fromOlroxsQuartersToRoyalChapel',
                fromClockTowerToCastleKeep: 'fromCastleKeepToClockTower',
                fromClockTowerToOuterWall: 'fromOlroxsQuartersToColosseum',
                fromColosseumToOlroxsQuarters: 'fromAlchemyLaboratoryToRoyalChapel',
                fromColosseumToRoyalChapel: 'fromMarbleGalleryToOuterWall',
                fromLongLibraryToOuterWall: 'fromMarbleGalleryToAlchemyLaboratory',
                fromMarbleGalleryToAlchemyLaboratory: 'fromLongLibraryToOuterWall',
                fromMarbleGalleryToCastleEntrance: 'fromUndergroundCavernsToMarbleGallery',
                fromMarbleGalleryToOlroxsQuarters: 'fromCastleEntranceToMarbleGallery',
                fromMarbleGalleryToOuterWall: 'fromColosseumToRoyalChapel',
                fromMarbleGalleryToUndergroundCaverns: 'fromAbandonedMineToWarpRooms',
                fromOlroxsQuartersToColosseum: 'fromClockTowerToOuterWall',
                fromOlroxsQuartersToMarbleGallery: 'fromOuterWallToClockTower',
                fromOlroxsQuartersToRoyalChapel: 'fromCatacombsToAbandonedMine',
                fromOlroxsQuartersToWarpRooms: 'fromWarpRoomsToOlroxsQuarters',
                fromOuterWallToClockTower: 'fromOlroxsQuartersToMarbleGallery',
                fromOuterWallToLongLibrary: 'fromWarpRoomsToCastleEntrance',
                fromOuterWallToMarbleGallery: 'fromAbandonedMineToUndergroundCaverns',
                fromOuterWallToWarpRooms: 'fromRoyalChapelToOlroxsQuarters',
                fromRoyalChapelToAlchemyLaboratory: 'fromCastleEntranceToAlchemyLaboratory',
                fromRoyalChapelToCastleKeep: 'fromAbandonedMineToCatacombs',
                fromRoyalChapelToColosseum: 'fromWarpRoomsToCastleKeep',
                fromRoyalChapelToOlroxsQuarters: 'fromOuterWallToWarpRooms',
                fromUndergroundCavernsToAbandonedMine: 'fromWarpRoomsToOuterWall',
                fromUndergroundCavernsToCastleEntrance: 'fromCastleEntranceToUndergroundCaverns',
                fromUndergroundCavernsToMarbleGallery: 'fromMarbleGalleryToCastleEntrance',
                fromWarpRoomsToAbandonedMine: 'fromCastleKeepToWarpRooms',
                fromWarpRoomsToCastleEntrance: 'fromOuterWallToLongLibrary',
                fromWarpRoomsToCastleKeep: 'fromRoyalChapelToColosseum',
                fromWarpRoomsToOlroxsQuarters: 'fromOlroxsQuartersToWarpRooms',
                fromWarpRoomsToOuterWall: 'fromUndergroundCavernsToAbandonedMine',
            },
        },
    },
]

testLinks
.forEach((testData) => {
    test.test(`shuffleStages - ${testData.testDescription}`, () => {
        assert.deepStrictEqual(stageShuffler.shuffleStages(testData.input.seed), testData.expected)
    })
})
