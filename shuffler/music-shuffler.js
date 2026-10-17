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
            'Shuffle music',
        ],
    }

    const SONGS = {
        abandonedMine: {
            stage: {
                defaultValue: 'musicAbandonedPit',
                keys: [
                    'overlays.abandonedMine.musicId',
                    'stages.bossCerberus.constants.music.stage.data',
                ],
            },
            bossCerberus: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.bossCerberus.constants.music.boss.data',
                ],
            },
        },
        alchemyLaboratory: {
            stage: {
                defaultValue: 'musicDanceOfGold',
                keys: [
                    'overlays.alchemyLaboratory.musicId',
                    'stages.alchemyLaboratory.constants.music.afterSlograAndGaibon.data',
                    'stages.alchemyLaboratory.constants.music.afterSlograAndGaibon2.data',
                ],
            },
            bossSlograAndGaibon: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.alchemyLaboratory.constants.music.boss.data',
                ],
            },
        },
        antiChapel: {
            stage: {
                defaultValue: 'musicLostPainting',
                keys: [
                    'overlays.antiChapel.musicId',
                    'stages.bossMedusa.constants.music.stage.data',
                    'stages.bossMedusa.constants.music.stage2.data',
                ],
            },
            bossMedusa: {
                defaultValue: 'musicEnchantedBanquet',
                keys: [
                    'stages.bossMedusa.constants.music.boss.data',
                ],
            },
        },
        blackMarbleGallery: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                keys: [
                    'overlays.blackMarbleGallery.musicId',
                ],
            },
        },
        castleCenter: {
            stage: {
                defaultValue: 'musicTheDoorToTheAbyss',
                keys: [
                    'overlays.castleCenter.musicId',
                ],
            },
        },
        castleEntrance: {
            stage: {
                defaultValue: 'musicDraculasCastle',
                keys: [
                    'overlays.castleEntrance.musicId',
                    'overlays.castleEntranceRevisited.musicId',
                    'stages.castleEntrance.constants.music.afterCastleAwakes.data',
                    'stages.castleEntrance.constants.music.afterMeetingDeath.data',
                ],
            },
            ambienceInForestCutscene: {
                defaultValue: 'musicHowlingWind',
                keys: [
                    'ambienceInForestCutscene.data',
                ],
            },
        },
        castleKeep: {
            stage: {
                defaultValue: 'musicHeavenlyDoorway',
                keys: [
                    'overlays.castleKeep.musicId',
                ],
            },
        },
        catacombs: {
            stage: {
                defaultValue: 'musicRainbowCemetary',
                keys: [
                    'overlays.catacombs.musicId',
                    'stages.catacombs.constants.music.stage.data',
                ],
            },
            bossGranfaloon: {
                defaultValue: 'musicDeathBallad',
                keys: [
                    'overlays.bossGranfaloon.musicId',
                    'stages.catacombs.constants.music.boss.data',
                    'stages.catacombs.constants.music.boss2.data',
                ],
            },
        },
        cave: {
            stage: {
                defaultValue: 'musicAbandonedPit',
                keys: [
                    'overlays.cave.musicId',
                    'stages.cave.constants.music.stage.data',
                ],
            },
            bossDeath: {
                defaultValue: 'musicDeathBallad',
                keys: [
                    'overlays.bossDeath.musicId',
                    'stages.cave.constants.music.boss.data',
                ],
            },
        },
        clockTower: {
            stage: {
                defaultValue: 'musicTheTragicPrince',
                keys: [
                    'overlays.clockTower.musicId',
                    'stages.clockTower.constants.music.stage.data',
                    'stages.clockTower.constants.music.stage2.data',
                ],
            },
            bossKarasuman: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.clockTower.constants.music.boss.data',
                ],
            },
        },
        colosseum: {
            stage: {
                defaultValue: 'musicWanderingGhosts',
                keys: [
                    'overlays.colosseum.musicId',
                    'stages.bossMinotaurAndWerewolf.constants.music.stage.data',
                ],
            },
            bossMinotaurAndWerewolf: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.bossMinotaurAndWerewolf.constants.music.boss.data',
                ],
            },
        },
        deathWingsLair: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                keys: [
                    'overlays.deathWingsLair.musicId',
                    'stages.bossAkmodanII.constants.music.stage.data',
                    'stages.bossAkmodanII.constants.music.stage2.data',
                ],
            },
            bossAkmodanII: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.bossAkmodanII.constants.music.boss.data',
                ],
            },
        },
        forbiddenLibrary: {
            stage: {
                defaultValue: 'musicLostPainting',
                keys: [
                    'overlays.forbiddenLibrary.musicId',
                ],
            },
        },
        floatingCatacombs: {
            stage: {
                defaultValue: 'musicCurseZone',
                keys: [
                    'overlays.floatingCatacombs.musicId',
                    'stages.bossGalamoth.constants.music.stage.data',
                    'stages.bossGalamoth.constants.music.stage2.data',
                ],
            },
            bossGalamoth: {
                defaultValue: 'musicDeathBallad',
                keys: [
                    'stages.bossGalamoth.constants.music.boss.data',
                ],
            },
        },
        longLibrary: {
            stage: {
                defaultValue: 'musicWoodCarvingPartita',
                keys: [
                    'overlays.longLibrary.musicId',
                    'stages.longLibrary.constants.music.stage.data',
                    'stages.longLibrary.constants.music.stage2.data',
                ],
            },
            bossLesserDemon: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.longLibrary.constants.music.boss.data',
                ],
            },
        },
        marbleGallery: {
            stage: {
                defaultValue: 'musicMarbleGallery',
                keys: [
                    'overlays.marbleGallery.musicId',
                ],
            },
        },
        necromancyLaboratory: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                keys: [
                    'overlays.necromancyLaboratory.musicId',
                    'stages.bossBeelzebub.constants.music.stage.data',
                    'stages.bossBeelzebub.constants.music.stage2.data',
                ],
            },
            bossBeelzebub: {
                defaultValue: 'musicDeathBallad',
                keys: [
                    'stages.bossBeelzebub.constants.music.boss.data',
                    'stages.bossBeelzebub.constants.music.boss2.data',
                ],
            },
        },
        outerWall: {
            stage: {
                defaultValue: 'musicTowerOfMist',
                keys: [
                    'overlays.outerWall.musicId',
                    'stages.bossDoppelganger10.constants.music.stage.data',
                ],
            },
            bossDoppelganger10: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.bossDoppelganger10.constants.music.boss.data',
                ],
            },
        },
        olroxsQuarters: {
            stage: {
                defaultValue: 'musicDanceOfPales',
                keys: [
                    'overlays.olroxsQuarters.musicId',
                    'stages.bossOlrox.constants.music.stage.data',
                ],
            },
            bossOlrox: {
                defaultValue: 'musicDeathBallad',
                keys: [
                    'stages.bossOlrox.constants.music.boss.data',
                    'stages.bossOlrox.constants.music.boss2.data',
                    'stages.bossOlrox.constants.music.boss3.data',
                    'stages.bossOlrox.constants.music.boss4.data',
                ],
            },
        },
        prologue: {
            bossDracula: {
                defaultValue: 'musicPrologue',
                keys: [
                    'overlays.prologue.musicId',
                ],
            },
        },
        reverseCastleCenter: {
            stage: {
                defaultValue: 'musicTheDoorToTheAbyss',
                keys: [
                    'overlays.reverseCastleCenter.musicId',
                ],
            },
            bossShaft: {
                defaultValue: 'musicDeathBallad',
                keys: [
                    'stages.reverseCastleCenter.constants.music.boss.data',
                ],
            },
        },
        reverseKeep: {
            stage: {
                defaultValue: 'musicHeavenlyDoorway',
                keys: [
                    'overlays.reverseKeep.musicId',
                ],
            },
        },
        reverseCastleEntrance: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                keys: [
                    'overlays.reverseCastleEntrance.musicId',
                ],
            },
        },
        reverseCaverns: {
            stage: {
                defaultValue: 'musicLostPainting',
                keys: [
                    'overlays.reverseCaverns.musicId',
                ],
            },
            bossDoppelganger40: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.bossDoppelganger40.constants.music.boss.data',
                ],
            },
        },
        reverseClockTower: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                keys: [
                    'overlays.reverseClockTower.musicId',
                    'stages.reverseClockTower.constants.music.stage.data',
                    'stages.reverseClockTower.constants.music.stage2.data',
                ],
            },
            bossDarkwingBat: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.reverseClockTower.constants.music.boss.data',
                ],
            },
        },
        reverseColosseum: {
            stage: {
                defaultValue: 'musicDoorOfHolySpirits',
                keys: [
                    'overlays.reverseColosseum.musicId',
                    'stages.bossTrio.constants.music.stage.data',
                    'stages.bossTrio.constants.music.stage2.data',
                ],
            },
            bossTrio: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.bossTrio.constants.music.boss.data',
                ],
            },
        },
        reverseOuterWall: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                keys: [
                    'overlays.reverseOuterWall.musicId',
                    'stages.bossCreature.constants.music.stage.data',
                    'stages.bossCreature.constants.music.stage2.data',
                ],
            },
            bossCreature: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.bossCreature.constants.music.boss.data',
                ],
            },
        },
        reverseWarpRooms: {
            stage: {
                defaultValue: 'musicNoAudio',
                keys: [
                    'overlays.reverseWarpRooms.musicId',
                ],
            },
        },
        royalChapel: {
            stage: {
                defaultValue: 'musicRequiemForTheGods',
                keys: [
                    'overlays.royalChapel.musicId',
                ],
            },
            bossHippogryph: {
                defaultValue: 'musicDeathBallad',
                keys: [
                    'stages.bossHippogryph.constants.music.boss.data',
                ],
            },
        },
        undergroundCaverns: {
            stage: {
                defaultValue: 'musicCrystalTeardrops',
                keys: [
                    'overlays.undergroundCaverns.musicId',
                    'stages.bossScylla.constants.music.stage.data',
                    'stages.bossScylla.constants.music.stage2.data',
                    'stages.bossScylla.constants.music.stage3.data',
                ],
            },
            bossScylla: {
                defaultValue: 'musicFestivalOfServants',
                keys: [
                    'stages.bossScylla.constants.music.boss.data',
                ],
            },
            bossSuccubus: {
                defaultValue: 'musicEnchantedBanquet',
                keys: [
                    'stages.bossSuccubus.constants.music.boss.data',
                ],
            },
        },
        warpRooms: {
            stage: {
                defaultValue: 'musicNoAudio',
                keys: [
                    'overlays.warpRooms.musicId',
                ],
            },
        },
    }

    function shuffleSongs(seed) {
        const rng = seedrandom(seed)
        const stageMusic = {}
        const stageSongs = []
        const songPools = {
            stage: [],
            boss: [],
        }
        const bossMusic = {}
        Object.entries(SONGS)
        .forEach(([stageName, songsInfo]) => {
            // Add stage music to its own pool
            Object.entries(songsInfo)
            .filter(([songName, songInfo]) => {
                return songName.startsWith('stage')
            })
            .filter(([songName, songInfo]) => {
                return songInfo.defaultValue !== 'noAudio'
            })
            .forEach(([songName, songInfo]) => {
                stageMusic[stageName] = songInfo.defaultValue
                if (!songPools.stage.includes(songInfo.defaultValue)) {
                    songPools.stage.push(songInfo.defaultValue)
                }
            })
            // Add boss music to its own pool, do nothing with it for now ...
            Object.entries(songsInfo)
            .filter(([songName, songInfo]) => {
                return songName.startsWith('boss')
            })
            .forEach(([songName, songInfo]) => {
                bossMusic[songName] = songInfo.defaultValue
            })
        })
        const songsNeeded = Object.keys(stageMusic).length - songPools.stage.length
        const duplicateSongPool = common.shuffleArray(rng, songPools.stage).slice(0, songsNeeded)
        const fullSongPool = common.shuffleArray(rng, songPools.stage.concat(duplicateSongPool))
        Object.keys(stageMusic).toSorted()
        .forEach((stageName) => {
            stageMusic[stageName] = fullSongPool.pop()
        })
        const result = {}
        result.stage = stageMusic
        return result
    }

    function getSongChanges(songData) {
        const songChanges = {}
        Object.entries(songData.stage)
        .forEach(([stageName, songName]) => {
            SONGS[stageName].stage.keys.forEach((keyName) => {
                songChanges[keyName + '='] = songName
            })
        })
        const result = Object.assign({}, TEMPLATE)
        result.changes.push({
            changeType: 'merge',
            merge: songChanges,
        })
        return result
    }

    const exports = {
        SONGS: SONGS,
        getSongChanges: getSongChanges,
        shuffleSongs: shuffleSongs,
    }
    if (self) {
        self.sotnShuffler = Object.assign(self.sotnShuffler || {}, {
            musicShuffler: exports,
        })
    } else {
        module.exports = exports
    }
})(typeof (self) !== 'undefined' ? self : null)
