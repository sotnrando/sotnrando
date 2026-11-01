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
        musicAbandonedPit: {
            tags: [
                'anxious',
                'mysterious',
            ],
        },
        musicBlackBanquet: {
            tags: [
                'intense',
            ],
        },
        musicBloodRelations: {
            tags: [
                'intense',
            ],
        },
        musicCrystalTeardrops: {
            tags: [
                'mysterious',
            ],
        },
        musicCurseZone: {
            tags: [
                'anxious',
            ],
        },
        musicDanceOfGold: {
            tags: [
                'exalted',
            ],
        },
        musicDanceOfIllusions: {
            tags: [
                'intense',
            ],
        },
        musicDanceOfPales: {
            tags: [
                'playful',
            ],
        },
        musicDeathBallad: {
            tags: [
                'intense',
            ],
        },
        musicDoorOfHolySpirits: {
            tags: [
                'anxious',
            ],
        },
        musicDraculasCastle: {
            tags: [
                'exalted',
            ],
        },
        musicEnchantedBanquet: {
            tags: [
                'intense',
            ],
        },
        musicFestivalOfServants: {
            tags: [
                'intense',
            ],
        },
        musicFinaleToccata: {
            tags: [
                'anxious',
                'mysterious',
            ],
        },
        musicHeavenlyDoorway: {
            tags: [
                'anxious',
                'mysterious',
            ],
        },
        musicHowlingWind: {
            tags: [
                'special',
            ],
        },
        musicIAmTheWind: {
            tags: [
                'special',
            ],
        },
        musicLandOfBenediction: {
            tags: [
                'special',
            ],
        },
        musicLostPainting: {
            tags: [
                'mysterious',
                'playful',
            ],
        },
        musicMarbleGallery: {
            tags: [
                'exalted',
                'playful',
            ],
        },
        musicMetamorphosis: {
            tags: [
                'special',
            ],
        },
        musicMetamorphosisII: {
            tags: [
                'special',
            ],
        },
        musicMetamorphosisIII: {
            tags: [
                'special',
            ],
        },
        musicMoonlightNocturne: {
            tags: [
                'special',
            ],
        },
        musicNoAudio: {
            tags: [
                'special',
            ],
        },
        musicNocturne: {
            tags: [
                'special',
            ],
        },
        musicPrayer: {
            tags: [
                'special',
            ],
        },
        musicPrologue: {
            tags: [
                'special',
            ],
        },
        musicRainbowCemetary: {
            tags: [
                'mysterious',
            ],
        },
        musicRequiemForTheGods: {
            tags: [
                'anxious',
            ],
        },
        musicSilence: {
            tags: [
                'special',
            ],
        },
        musicTheDoorToTheAbyss: {
            tags: [
                'anxious',
            ],
        },
        musicTheTragicPrince: {
            tags: [
                'exalted',
            ],
        },
        musicTowerOfMist: {
            tags: [
                'anxious',
                'mysterious',
            ],
        },
        musicWanderingGhosts: {
            tags: [
                'exalted',
                'playful',
            ],
        },
        musicWoodCarvingPartita: {
            tags: [
                'exalted',
            ],
        },
    }

    const THEMES = {
        abandonedMine: {
            stage: {
                defaultValue: 'musicAbandonedPit',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.abandonedMine.musicId',
                    'stages.bossCerberus.constants.music.stage.data',
                ],
            },
            bossCerberus: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossCerberus.constants.music.boss.data',
                ],
            },
        },
        alchemyLaboratory: {
            stage: {
                defaultValue: 'musicDanceOfGold',
                tags: [
                    'exalted',
                ],
                keys: [
                    'overlays.alchemyLaboratory.musicId',
                    'stages.alchemyLaboratory.constants.music.afterSlograAndGaibon.data',
                    'stages.alchemyLaboratory.constants.music.afterSlograAndGaibon2.data',
                ],
            },
            bossSlograAndGaibon: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.alchemyLaboratory.constants.music.boss.data',
                ],
            },
        },
        antiChapel: {
            stage: {
                defaultValue: 'musicLostPainting',
                tags: [
                    'playful',
                    'mysterious',
                ],
                keys: [
                    'overlays.antiChapel.musicId',
                    'stages.bossMedusa.constants.music.stage.data',
                    'stages.bossMedusa.constants.music.stage2.data',
                ],
            },
            bossMedusa: {
                defaultValue: 'musicEnchantedBanquet',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossMedusa.constants.music.boss.data',
                ],
            },
        },
        blackMarbleGallery: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.blackMarbleGallery.musicId',
                ],
            },
        },
        castleCenter: {
            stage: {
                defaultValue: 'musicTheDoorToTheAbyss',
                tags: [
                    'anxious',
                ],
                keys: [
                    'overlays.castleCenter.musicId',
                ],
            },
        },
        castleEntrance: {
            stage: {
                defaultValue: 'musicDraculasCastle',
                tags: [
                    'exalted',
                ],
                keys: [
                    'overlays.castleEntrance.musicId',
                    'overlays.castleEntranceRevisited.musicId',
                    'stages.castleEntrance.constants.music.afterCastleAwakes.data',
                    'stages.castleEntrance.constants.music.afterMeetingDeath.data',
                ],
            },
            ambienceInForestCutscene: {
                defaultValue: 'musicHowlingWind',
                tags: [
                    'special',
                ],
                keys: [
                    'ambienceInForestCutscene.data',
                ],
            },
        },
        castleKeep: {
            stage: {
                defaultValue: 'musicHeavenlyDoorway',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.castleKeep.musicId',
                ],
            },
        },
        catacombs: {
            stage: {
                defaultValue: 'musicRainbowCemetary',
                tags: [
                    'mysterious',
                ],
                keys: [
                    'overlays.catacombs.musicId',
                    'stages.catacombs.constants.music.stage.data',
                ],
            },
            bossGranfaloon: {
                defaultValue: 'musicDeathBallad',
                tags: [
                    'intense',
                ],
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
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.cave.musicId',
                    'stages.cave.constants.music.stage.data',
                ],
            },
            bossDeath: {
                defaultValue: 'musicDeathBallad',
                tags: [
                    'intense',
                ],
                keys: [
                    'overlays.bossDeath.musicId',
                    'stages.cave.constants.music.boss.data',
                ],
            },
        },
        clockTower: {
            stage: {
                defaultValue: 'musicTheTragicPrince',
                tags: [
                    'exalted',
                ],
                keys: [
                    'overlays.clockTower.musicId',
                    'stages.clockTower.constants.music.stage.data',
                    'stages.clockTower.constants.music.stage2.data',
                ],
            },
            bossKarasuman: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.clockTower.constants.music.boss.data',
                ],
            },
        },
        colosseum: {
            stage: {
                defaultValue: 'musicWanderingGhosts',
                tags: [
                    'exalted',
                    'playful',
                ],
                keys: [
                    'overlays.colosseum.musicId',
                    'stages.bossMinotaurAndWerewolf.constants.music.stage.data',
                ],
            },
            bossMinotaurAndWerewolf: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossMinotaurAndWerewolf.constants.music.boss.data',
                ],
            },
        },
        deathWingsLair: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.deathWingsLair.musicId',
                    'stages.bossAkmodanII.constants.music.stage.data',
                    'stages.bossAkmodanII.constants.music.stage2.data',
                ],
            },
            bossAkmodanII: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossAkmodanII.constants.music.boss.data',
                ],
            },
        },
        forbiddenLibrary: {
            stage: {
                defaultValue: 'musicLostPainting',
                tags: [
                    'playful',
                    'mysterious',
                ],
                keys: [
                    'overlays.forbiddenLibrary.musicId',
                ],
            },
        },
        floatingCatacombs: {
            stage: {
                defaultValue: 'musicCurseZone',
                tags: [
                    'anxious',
                ],
                keys: [
                    'overlays.floatingCatacombs.musicId',
                    'stages.bossGalamoth.constants.music.stage.data',
                    'stages.bossGalamoth.constants.music.stage2.data',
                ],
            },
            bossGalamoth: {
                defaultValue: 'musicDeathBallad',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossGalamoth.constants.music.boss.data',
                ],
            },
        },
        longLibrary: {
            stage: {
                defaultValue: 'musicWoodCarvingPartita',
                tags: [
                    'exalted',
                ],
                keys: [
                    'overlays.longLibrary.musicId',
                    'stages.longLibrary.constants.music.stage.data',
                    'stages.longLibrary.constants.music.stage2.data',
                ],
            },
            bossLesserDemon: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.longLibrary.constants.music.boss.data',
                ],
            },
        },
        marbleGallery: {
            stage: {
                defaultValue: 'musicMarbleGallery',
                tags: [
                    'exalted',
                    'playful',
                ],
                keys: [
                    'overlays.marbleGallery.musicId',
                ],
            },
        },
        necromancyLaboratory: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.necromancyLaboratory.musicId',
                    'stages.bossBeelzebub.constants.music.stage.data',
                    'stages.bossBeelzebub.constants.music.stage2.data',
                ],
            },
            bossBeelzebub: {
                defaultValue: 'musicDeathBallad',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossBeelzebub.constants.music.boss.data',
                    'stages.bossBeelzebub.constants.music.boss2.data',
                ],
            },
        },
        outerWall: {
            stage: {
                defaultValue: 'musicTowerOfMist',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.outerWall.musicId',
                    'stages.bossDoppelganger10.constants.music.stage.data',
                ],
            },
            bossDoppelganger10: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossDoppelganger10.constants.music.boss.data',
                ],
            },
        },
        olroxsQuarters: {
            stage: {
                defaultValue: 'musicDanceOfPales',
                tags: [
                    'playful',
                ],
                keys: [
                    'overlays.olroxsQuarters.musicId',
                    'stages.bossOlrox.constants.music.stage.data',
                ],
            },
            bossOlrox: {
                defaultValue: 'musicDeathBallad',
                tags: [
                    'intense',
                ],
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
                tags: [
                    'special',
                ],
                keys: [
                    'overlays.prologue.musicId',
                ],
            },
        },
        reverseCastleCenter: {
            stage: {
                defaultValue: 'musicTheDoorToTheAbyss',
                tags: [
                    'anxious',
                ],
                keys: [
                    'overlays.reverseCastleCenter.musicId',
                ],
            },
            bossShaft: {
                defaultValue: 'musicDeathBallad',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.reverseCastleCenter.constants.music.boss.data',
                ],
            },
        },
        reverseKeep: {
            stage: {
                defaultValue: 'musicHeavenlyDoorway',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.reverseKeep.musicId',
                ],
            },
        },
        reverseCastleEntrance: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.reverseCastleEntrance.musicId',
                ],
            },
        },
        reverseCaverns: {
            stage: {
                defaultValue: 'musicLostPainting',
                tags: [
                    'playful',
                    'mysterious',
                ],
                keys: [
                    'overlays.reverseCaverns.musicId',
                ],
            },
            bossDoppelganger40: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossDoppelganger40.constants.music.boss.data',
                ],
            },
        },
        reverseClockTower: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.reverseClockTower.musicId',
                    'stages.reverseClockTower.constants.music.stage.data',
                    'stages.reverseClockTower.constants.music.stage2.data',
                ],
            },
            bossDarkwingBat: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.reverseClockTower.constants.music.boss.data',
                ],
            },
        },
        reverseColosseum: {
            stage: {
                defaultValue: 'musicDoorOfHolySpirits',
                tags: [
                    'anxious',
                ],
                keys: [
                    'overlays.reverseColosseum.musicId',
                    'stages.bossTrio.constants.music.stage.data',
                    'stages.bossTrio.constants.music.stage2.data',
                ],
            },
            bossTrio: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossTrio.constants.music.boss.data',
                ],
            },
        },
        reverseOuterWall: {
            stage: {
                defaultValue: 'musicFinaleToccata',
                tags: [
                    'anxious',
                    'mysterious',
                ],
                keys: [
                    'overlays.reverseOuterWall.musicId',
                    'stages.bossCreature.constants.music.stage.data',
                    'stages.bossCreature.constants.music.stage2.data',
                ],
            },
            bossCreature: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossCreature.constants.music.boss.data',
                ],
            },
        },
        reverseWarpRooms: {
            stage: {
                defaultValue: 'musicNoAudio',
                tags: [
                    'special',
                ],
                keys: [
                    'overlays.reverseWarpRooms.musicId',
                ],
            },
        },
        royalChapel: {
            stage: {
                defaultValue: 'musicRequiemForTheGods',
                tags: [
                    'anxious',
                ],
                keys: [
                    'overlays.royalChapel.musicId',
                ],
            },
            bossHippogryph: {
                defaultValue: 'musicDeathBallad',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossHippogryph.constants.music.boss.data',
                ],
            },
        },
        undergroundCaverns: {
            stage: {
                defaultValue: 'musicCrystalTeardrops',
                tags: [
                    'mysterious',
                ],
                keys: [
                    'overlays.undergroundCaverns.musicId',
                    'stages.bossScylla.constants.music.stage.data',
                    'stages.bossScylla.constants.music.stage2.data',
                    'stages.bossScylla.constants.music.stage3.data',
                ],
            },
            bossScylla: {
                defaultValue: 'musicFestivalOfServants',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossScylla.constants.music.boss.data',
                ],
            },
            bossSuccubus: {
                defaultValue: 'musicEnchantedBanquet',
                tags: [
                    'intense',
                ],
                keys: [
                    'stages.bossSuccubus.constants.music.boss.data',
                ],
            },
        },
        warpRooms: {
            stage: {
                defaultValue: 'musicNoAudio',
                tags: [
                    'special',
                ],
                keys: [
                    'overlays.warpRooms.musicId',
                ],
            },
        },
    }

    function randomizeSongs(seed) {
        const rng = seedrandom(seed)
        const result = {}
        Object.entries(THEMES)
        .forEach(([stageName, themesInfo]) => {
            Object.entries(themesInfo)
            .filter(([themeName, themeInfo]) => {
                return !(themeInfo.tags.includes('special'))
            })
            .forEach(([themeName, themeInfo]) => {
                if (!(stageName in result)) {
                    result[stageName] = {}
                }
                const validSongs = []
                Object.entries(SONGS)
                .filter(([songName, songInfo]) => {
                    return songInfo.tags
                    .filter((tagName) => {
                        return themeInfo.tags.indexOf(tagName) !== -1
                    }).length > 0
                })
                .forEach(([songName, songInfo]) => {
                    validSongs.push(songName)
                })
                result[stageName][themeName] = common.shuffleArray(rng, validSongs).at(-1)
            })
        })
        return result
    }

    function getSongChanges(songData) {
        const songChanges = {}
        Object.entries(songData)
        .forEach(([stageName, themesInfo]) => {
            Object.entries(themesInfo)
            .forEach(([themeName, songName]) => {
                THEMES[stageName][themeName].keys
                .forEach((keyName) => {
                    songChanges[keyName + '='] = songName
                })
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
        randomizeSongs: randomizeSongs,
    }
    if (self) {
        self.sotnShuffler = Object.assign(self.sotnShuffler || {}, {
            musicShuffler: exports,
        })
    } else {
        module.exports = exports
    }
})(typeof (self) !== 'undefined' ? self : null)
