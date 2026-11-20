
# Command line

```sh
node shuffler/main make \
  --bin "PATH_TO_YOUR_BIN" \
  --patcher.on \
  --patcher.list=enableDebugMode \
  --musicShuffler.on \
  --out=sample.ppf
```

Assuming you supply a valid path for `PATH_TO_YOUR_BIN`, the above command will generate a PPF file called `sample.ppf`, where debug mode is turned on and the music is shuffled.

A more complicated example, including map randomization and a fixed seed, is as follows (please note, this PPF file may take a minute or so to generate):

```sh
node shuffler/main make \
  --bin "PATH_TO_YOUR_BIN" \
  --seed=TallArea74784 \
  --hinter.seedName \
  --hinter.options \
  --hinter.stageLinks \
  --patcher.on \
  --patcher.list=assignUniqueIdToRelicAfterDrawbridge \
  --patcher.list=showMinutesAndSecondsInClockRoom \
  --patcher.list=useCustomColorsOnTheMap \
  --patcher.list=enableDebugMode \
  --patcher.list=preventSoftlocksAfterDefeatingScylla \
  --patcher.list=normalizeAbandonedMine \
  --patcher.list=normalizeAlchemyLaboratory \
  --patcher.list=normalizeCastleEntrance \
  --patcher.list=normalizeClockTower \
  --patcher.list=normalizeLongLibrary \
  --patcher.list=normalizeMarbleGallery \
  --patcher.list=normalizeOlroxsQuarters \
  --patcher.list=normalizeUndergroundCaverns \
  --patcher.list=simplifyGearPuzzle \
  --musicShuffler.on \
  --rewardShuffler.on \
  --rewardShuffler.method=chained \
  --roomShuffler.on \
  --stageShuffler.on \
  --out=debug.ppf
```

## Acknowledgements

Most of the knowledge present in the map rando portion of this project is only possible due to the immense efforts of the SOTN and rom-hacking community:

- Forat Negre, for their research into room layouts, which helped demystify a lot of how stages and rooms worked in this game
- [TalicZealot](https://github.com/taliczealot), for furthering knowledge about the game and making available tons of SOTN-related resources
- [MainMemory](https://github.com/MainMemory), for their [CastleEditor](https://github.com/MainMemory/SotNCastleEditor) project, which provided key insight into a few addresses as well as extremely helpful visualizations of the castle stages
- [Mottzilla](https://github.com/MottZilla), for their _StartAnywhere_ and _TileMapFind_ scripts, which dramatically improved turnaround time during playtesting
- [meunierd](https://github.com/meunierd), for the PPF file format
- [Fatalis](https://github.com/fatalis), for their Drop Calculator
- Contributors and maintainers of the [SOTN-Decomp](https://github.com/Xeeynamo/sotn-decomp) project, including:
  - [Xeeynamo](https://github.com/Xeeynamo)
  - [Bismurphy](https://github.com/bismurphy)
  - [Sozud](https://github.com/sozud)
  - [Sonic Dreamcaster](https://github.com/sonicdcer)
- Contributors and maintainers of the [SOTN-Randomizer](https://github.com/3snowp7im/SotN-Randomizer) project, including:
  - [3snowp7im](https://github.com/3snowp7im) (Wild Mouse)
  - [Mottzilla](https://github.com/MottZilla)
  - [eldri7ch](https://github.com/eldri7ch2)
  - [LuciaRolon](https://github.com/LuciaRolon)
  - [Crazy4Blades](https://github.com/crazy4blades)
- ToiletPain, Chrisaegrimm, Dark Falz Joker, 一隻綿羊, Jasper, GamshyDrusky, and everyone else in the Long Library Discord for their extensive help during beta testing
- Dr4gonBlitz, for being a huge inspiration for SOTN speedrunning, and for their continued help and patience during the alpha testing phase of this project
- The entire SOTN community, for their generosity and kindness