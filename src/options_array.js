(function(self) {
  if(self) {
    util = self.sotnRando.util
  } else {
    util = require('./util')
  }

  const optionsArray = [{
	// Preset name.
	name: "Tournament Mode", 
	// The id used in preset files.
	longId: "tournamentMode", 
	// The id used in argv.
	shortId: "tournament",
	// The html element ID. 
	htmlElement: "tournament-mode",
	// The yargs argument.
	cliArg: "t",
	// The description from the website and the help file. 
	longDescript: "Prevents displaying the relic locations and solutions.", 
	// The description for internal use.
	shortDescript: "Prevents spoilers.",
	// Options which need to be turned off if this option is on.
	incompatibleOptions: [
	  "showSpoilers",
	  "easyMode"
	],
	// Options which need to be on for this option to be on
	requiredOptions: [
	],
	// Presets which should turn this option off and disable it's use.
	incompatiblePresets: [
	], 
	// The individual function this option directly or indirectly affects
	functionCall: util.applyTournamentModePatches,
	// Whether the option needs rng to apply it's patches correctly 
	rngNeeded: false, 
	// If the option is simple enough to be applied as part of a batch option application loop
	simple: false,
	// Can be enabled with a simple boolean flag
	argvFlag: "bool",
	// Should be handled iteratively instead of manually by the preset builder un util
	autoBuild: false
  }, {
	name: "Accessibility Patches", 
	longId: "enableAccessibilityPatches", 
	shortId: "enableAccessibilityPatches", 
	htmlElement: "accessibility-patches", 
	cliArg: "a", 
	longDescript: "Reduces screen flashing from use items, adjusts some relics for better visibility, and patches some soft locks.", 
	shortDescript: "Enables accessibility patches and game bug fixes", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyAccessibilityPatches, 
	rngNeeded: false, 
	simple: false,
	// Technically is but not in the same way as most other options
	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Easy Mode", 
	longId: "easyMode", 
	shortId: "easy", 
	htmlElement: "easy-mode", 
	cliArg: "ez", 
	longDescript: "Simplifies inputs so spells no longer need complex sequences to execute. L2 for Gravity Boots. R3 and any of the following: Left / Right for Hellfire, Up for Soul Steal, and 2x Down for Tetra Spirit. An additional 4 frames of invincibility is added to all damage states, spell resolutions, and potions.", 
	shortDescript: "Makes spells and damage recovery easier.", 
	incompatibleOptions: [
	  "tournamentMode"
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyEasyModePatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Show Spoilers", 
	longId: "showSpoilers", 
	shortId: "showSpoilers", 
	htmlElement: "show-spoilers", 
	cliArg: "vv", 
	longDescript: "Show spoilers for the seed.", 
	shortDescript: "Show spoilers for the seed.", 
	incompatibleOptions: [
	  "tournamentMode"
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.showSpoilers, 
	rngNeeded: false, 
	simple: false,
	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Show Relic Locations", 
	longId: "showRelics", 
	shortId: "showRelics", 
	htmlElement: "show-relics", 
	cliArg: "vvv", 
	longDescript: "Show relic locations for the seed.", 
	shortDescript: "Show relic locations for the seed.", 
	incompatibleOptions: [
	  "tournamentMode"
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: null, 
	rngNeeded: false, 
	simple: false,
	argvFlag: "char",
	autoBuild: false
  }, {
	name: "Show Solutions", 
	longId: "showSolutions", 
	shortId: "showSolutions", 
	htmlElement: "show-solutions", 
	cliArg: "vvvv", 
	longDescript: "Show solutions for the seed.", 
	shortDescript: "Show solutions for the seed.", 
	incompatibleOptions: [
	  "tournamentMode"
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: null, 
	rngNeeded: false, 
	simple: false,
	argvFlag: "char",
	autoBuild: false
  }, {
	name: "Seasonal Splash Phrases", 
	longId: "seasonalPhrasesMode", 
	shortId: "seasonalPhrases", 
	htmlElement: "seasonal-phrases", 
	cliArg: "sp", 
	longDescript: "Allow seasonal and holiday-based splash phrases on the 'Press Start' screen.", 
	shortDescript: "Allow seasonal and holiday-based splash phrases on the 'Press Start' screen.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applySplashText, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Randomize Starting Stats", 
	longId: "startStatRandoMode", 
	shortId: "startStatRando", 
	htmlElement: "startingStats", 
	cliArg: "ss", 
	longDescript: "Randomize Alucard's starting STR, INT, CON, and LCK.", 
	shortDescript: "Randomize starting stats.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyStartStatRandoPatches, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "char",
	autoBuild: false
  }, {
	name: "Enemy Drops", 
	longId: "enemyDrops", 
	shortId: "enemyDrops", 
	htmlElement: "enemy-drops", 
	cliArg: "opt d", 
	longDescript: "Randomize items dropped by enemies.", 
	shortDescript: "Randomize enemy drops.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: null, 
	rngNeeded: false, 
	simple: false,
	argvFlag: "opt",
	autoBuild: false
  }, {
	name: "Starting Equipment", 
	longId: "startingEquipment", 
	shortId: "startingEquipment", 
	htmlElement: "starting-equipment", 
	cliArg: "opt e", 
	longDescript: "Randomize starting equipment for Alucard.", 
	shortDescript: "Randomize starting equipment.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: null, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "opt",
	autoBuild: false
  }, {
	name: "Item Locations", 
	longId: "itemLocations", 
	shortId: "itemLocations", 
	htmlElement: "item-locations", 
	cliArg: "opt i", 
	longDescript: "Randomize items found on the ground, in static entities, and in the shop.", 
	shortDescript: "Randomize items not dropped by enemies.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: null, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "opt",
	autoBuild: false
  }, {
	name: "Prologue Rewards", 
	longId: "prologueRewards", 
	shortId: "prologueRewards", 
	htmlElement: "prologue-rewards", 
	cliArg: "opt b", 
	longDescript: "Randomize rewards for completing the prologue in certain ways.", 
	shortDescript: "Randomize rewards for completing the prologue.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: null, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "opt",
	autoBuild: false
  }, {
	name: "Item Stats", 
	longId: "stats", 
	shortId: "stats", 
	htmlElement: "stats", 
	cliArg: "opt s", 
	longDescript: "Randomize the item stats like Atk, Def, sprite, but NOT name.", 
	shortDescript: "Shuffle the items stats and the menu graphics.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.randomizeStats, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "opt",
	autoBuild: false
  }, {
	name: "Item Names", 
	longId: "itemNameRandoMode", 
	shortId: "itemNameRandoMode", 
	htmlElement: "itemnamerando-mode", 
	cliArg: "in", 
	longDescript: "Randomize item names when using Item Stat Rando.", 
	shortDescript: "Shuffle item names.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	  "stats"
	],
	incompatiblePresets: [
	], 
	functionCall: util.randomizeStats, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Turkey Mode", 
	longId: "turkeyMode", 
	shortId: "turkey", 
	htmlElement: "turkey-mode", 
	cliArg: "k", 
	longDescript: "Replaces the subweapons in the glass vats at Alchemy Lab and Black Marble Gallery with useless turkeys.", 
	shortDescript: "Replaces vat subweapons with turkeys.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.randomizeSubweaponTanks, 
	rngNeeded: false, 
	simple: false,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Color Randomizer", 
	longId: "colorrandoMode", 
	shortId: "colorrando", 
	htmlElement: "colorrando-mode", 
	cliArg: "l", 
	longDescript: "Randomize various color palettes. Ex: Cape colors, Gravity Boots trails, Hydro Storm.", 
	shortDescript: "Randomize various color palettes.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: null, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Magic Vessels", 
	longId: "magicmaxMode", 
	shortId: "magicmax", 
	htmlElement: "magicmax-mode", 
	cliArg: "x", 
	longDescript: "Replace Heart Max Up with Magic Max Up.", 
	shortDescript: "Replace Heart Max Up with Magic Max Up.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyMagicMaxPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Anti-Freeze", 
	longId: "antiFreezeMode", 
	shortId: "antifreeze", 
	htmlElement: "antifreeze-mode", 
	cliArg: "z", 
	longDescript: "Remove screen freezes on level-up, relic and vessel acquisition.", 
	shortDescript: "Remove screen freezes on level-up, relic and vessel acquisition.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "glitch",
	  "glitch-legacy",
	  "glitchmaster",
	  "any-percent"
	], 
	functionCall: util.applyAntiFreezePatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "That's my purse!", 
	longId: "mypurseMode", 
	shortId: "mypurse", 
	htmlElement: "mypurse-mode", 
	cliArg: "y", 
	longDescript: "Prevents Death from stealing your gear.", 
	shortDescript: "Prevents Death from stealing your gear.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyMyPursePatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Infinite Wing Smash", 
	longId: "iwsMode", 
	shortId: "iws", 
	htmlElement: "iws-mode", 
	cliArg: "b", 
	longDescript: "Enables infinite Wing Smash for one cast.", 
	shortDescript: "Enables infinite Wing Smash for one cast.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyiwsPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Fast Warps", 
	longId: "fastwarpMode", 
	shortId: "fastwarp", 
	htmlElement: "fastwarp-mode", 
	cliArg: "9", 
	longDescript: "Quickens warp animation when using teleporters by shortening the animation.", 
	shortDescript: "Quickens warp animation when using teleporters.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyfastwarpPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Remove Prologue", 
	longId: "noprologueMode", 
	shortId: "noprologue", 
	htmlElement: "noprologue-mode", 
	cliArg: "R", 
	longDescript: "Removes the Prologue from being required to play. (Will remove potential prologue rewards.)", 
	shortDescript: "Removes the Prologue from being required to play.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "any-percent"
	], 
	functionCall: util.applynoprologuePatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Unlocked Mode", 
	longId: "unlockedMode", 
	shortId: "unlocked", 
	htmlElement: "unlocked-mode", 
	cliArg: "U", 
	longDescript: "Opens all five shortcuts in first castle and one in second castle. (Will break logic for most presets.)", 
	shortDescript: "Opens all five shortcuts in first castle and one in second castle.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "boss-rush"
	], 
	functionCall: util.applyunlockedPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Relic Surprise", 
	longId: "surpriseMode", 
	shortId: "surprise", 
	htmlElement: "surprise-mode", 
	cliArg: "S", 
	longDescript: "All relics are hidden behind the same sprite and palette. The player cannot tell what the relic is until they collect it.", 
	shortDescript: "All relics are hidden behind the same sprite and palette.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	], 
	incompatiblePresets: [
	], 
	functionCall: util.applysurprisePatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Enemy Stats", 
	longId: "enemyStatRandoMode", 
	shortId: "enemyStatRando", 
	htmlElement: "enemyStatRando-mode", 
	cliArg: "E", 
	longDescript: "Enemy stats are randomized ranging from 25% to 200% of their original value and their attack and defense types are randomized to include random elements.", 
	shortDescript: "Enemy Atk, Def, and Elements are randomized.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
      "big-toss"
	], 
	functionCall: util.applyenemyStatRandoPatches, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Elemental Chaos", 
	longId: "elemChaosMode", 
	shortId: "elemChaos", 
	htmlElement: "elem-chaos", 
	cliArg: "ec", 
	longDescript: "Randomizes almost every single element in the game.", 
	shortDescript: "Randomizes almost every single element in the game.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	  "enemyStatRandoMode"
	],
	incompatiblePresets: [
	  "big-toss"
	], 
	functionCall: util.applyElemChaosPatches, 
	rngNeeded: true, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Shop Prices", 
	longId: "shopPriceRandoMode", 
	shortId: "shopPriceRando", 
	htmlElement: "shopPriceRando-mode", 
	cliArg: "sh", 
	longDescript: "Shop prices are randomized ranging from 50% to 150% of their original value and they are shuffled between each other.", 
	shortDescript: "Shop prices are shuffled and randomized.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyShopPriceRandoPatches, 
	rngNeeded: true, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Starting Zone 1st Castle", 
	longId: "startRoomRandoMode", 
	shortId: "startRoomRando", 
	htmlElement: "startRoomRando-mode", 
	cliArg: "ori", 
	longDescript: "Start in the entrance as usual but after the first Warg, you are teleported to a random zone to start the rest of your run. (Select both to have full-range starting rando)", 
	shortDescript: "Start in the entrance as usual but after the first Warg, you are teleported to a random zone to start the rest of your run.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "boss-rush",
	  "beyond",
	  "vanilla"
	], 
	functionCall: util.applyStartRoomRandoPatches, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Starting Zone 2nd Castle", 
	longId: "startRoomRando2ndMode", 
	shortId: "startRoomRando2nd", 
	htmlElement: "startRoomRando2nd-mode", 
	cliArg: "ori2", 
	longDescript: "Start in the entrance as usual but after the first Warg, you are teleported to a random zone in second castle to start the rest of your run. (Select both to have full-range starting rando)", 
	shortDescript: "Start in the entrance as usual but after the first Warg, you are teleported to a random zone in second castle to start the rest of your run.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "dog-life",
	  "magic-mirror",
	  "mobility",
	  "lookingglass",
	  "boss-rush",
	  "beyond",
	  "first-castle",
	  "vanilla"
	], 
	functionCall: util.applyStartRoomRandoPatches, 
	rngNeeded: true, 
	simple: false,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Guaranteed Drops", 
	longId: "dominoMode", 
	shortId: "domino", 
	htmlElement: "domino-mode", 
	cliArg: "gd", 
	longDescript: "Guarantees drops from every enemy that has one. Which is dropped depends on kill count odd / even.", 
	shortDescript: "Guarantees drops from every enemy that has one.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "bounty-hunter",
	  "target-confirmed",
	  "hitman",
	  "chaos-lite",
	  "rampage",
	  "rampage-25te",
	  "oracle"
	], 
	functionCall: util.applyDominoPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Reverse Library Card", 
	longId: "rlbcMode", 
	shortId: "rlbc", 
	htmlElement: "rlbc-mode", 
	cliArg: "rl", 
	longDescript: "Adds a new function to Library Cards. Hold Down while using them to take Alucard to the second castle Library after Richter is saved.", 
	shortDescript: "Library cards can take the player to 2nd castle.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "boss-rush",
	  "first-castle",
	  "beyond",
	  "seeker",
	  "recycler"
	], 
	functionCall: util.applyRLBCPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Immunity Potions", 
	longId: "immunityPotionMode", 
	shortId: "immunityPotion", 
	htmlElement: "immunity-potion-mode", 
	cliArg: "ip", 
	longDescript: "Converts Resist Fire, Resist Ice, etc. potions to grant Immunity to the element in question and allows them to grant invincibility frames.", 
	shortDescript: "Converts Resist Fire, Resist Ice, etc. potions to grant Immunity to the element in question.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyResistToImmunePotionsPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Godspeed Shoes", 
	longId: "godspeedMode", 
	shortId: "godspeed", 
	htmlElement: "godspeed-mode", 
	cliArg: "gss", 
	longDescript: "Allows Alucard to run by double-pressing in the direction you intend to move in.", 
	shortDescript: "Allows Alucard to run.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "battlemage"
	], 
	functionCall: null, 
	rngNeeded: false, 
	simple: false,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Library Shortcut", 
	longId: "libraryShortcut", 
	shortId: "libShort", 
	htmlElement: "library-shortcut", 
	cliArg: "ls", 
	longDescript: "Opens a shortcut to allow players to swiftly exit the Long Library.", 
	shortDescript: "Opens a shortcut to allow players to swiftly exit the Long Library.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyLibraryShortcutPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Single-Hit Gears", 
	longId: "singleHitGearMode", 
	shortId: "singleHitGear", 
	htmlElement: "single-hit-gear", 
	cliArg: "gp", 
	longDescript: "Makes all gear puzzles only require a single hit on one gear to open the respective door.", 
	shortDescript: "Makes all gear puzzles only require a single hit on one gear to open the respective door.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applySingleHitGearPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Reverse Teleporter", 
	longId: "revCastleTeleportRando", 
	shortId: "revCastleTeleport", 
	htmlElement: "rev-castle-teleport-rando", 
	cliArg: "c2r", 
	longDescript: "Randomize where the teleporter pad in Reverse Castle is located.", 
	shortDescript: "Randomize where the teleporter pad in Reverse Castle is located.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "boss-rush",
	  "first-castle",
	  "seeker"
	], 
	functionCall: util.applyReverseCastleTeleporterRandoPatches, 
	rngNeeded: true, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Zero-Dollar Relic", 
	longId: "zeroDollarRelicMode", 
	shortId: "zeroDollarRelic", 
	htmlElement: "zero-relic", 
	cliArg: "zr", 
	longDescript: "Library Shop Relic is free.", 
	shortDescript: "Library Shop Relic is free.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "any-percent",
	  "glitch",
	  "glitchmaster",
	  "rat-race"
	], 
	functionCall: util.applyZeroDollarRelicPatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Open Clock Statue", 
	longId: "openClockStatueMode", 
	shortId: "openClockStatue", 
	htmlElement: "open-statue", 
	cliArg: "os", 
	longDescript: "Statue in Clock Room is always open.", 
	shortDescript: "Statue in Clock Room is always open.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyOpenClockStatuepatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Spike Room", 
	longId: "spikeRoomRando", 
	shortId: "spikeRoom", 
	htmlElement: "spike-room", 
	cliArg: "srr", 
	longDescript: "Randomizes which Spike Room is used before Spike Breaker.", 
	shortDescript: "Randomizes which Spike Room is used before Spike Breaker.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "magic-mirror"
	], 
	functionCall: util.applySpikeRoomRandoPatches, 
	rngNeeded: true, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Lycanthrope Mode", 
	longId: "lycanMode", 
	shortId: "lycan", 
	htmlElement: "lycan-mode", 
	cliArg: "ly", 
	longDescript: "Allows the player to use full wolf at reduced cost.", 
	shortDescript: "Allows the player to use full wolf at reduced cost.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "dog-life",
	  "lycanthrope",
	  "big-toss",
	  "bat-master",
	  "leg-day"
	], 
	functionCall: util.applyLycanModePatches, 
	rngNeeded: false, 
	simple: true,
	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Warlock Mode", 
	longId: "warlockMode", 
	shortId: "warlock", 
	htmlElement: "warlock-mode", 
	cliArg: "w", 
	longDescript: "Enables Warlock Mode allowing the player to use Mist from the beginning for free and increasing INT to 99 while lower spell costs.", 
	shortDescript: "INT is 99, spells are cheap, and Mist for free.", 
	incompatibleOptions: [
		"startStatRandoMode"
	],
	requiredOptions: [
	],
	incompatiblePresets: [
		"warlock",
		"brawler",
		"leg-day",
		"lucky-sevens"
	], 
	functionCall: util.applyWarlockModePatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Nimble Lite Mode", 
	longId: "nimbleLiteMode", 
	shortId: "nimbleLite", 
	htmlElement: "nimble-mode", 
	cliArg: "nl", 
	longDescript: "Enables Nimble Lite Mode allowing the player to use Bat, Gravity Boots, and Leap Stone from the beginning for free.", 
	shortDescript: "Use Bat, Gravity Boots, and Leap Stone for free.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
		"warlock",
		"nimble",
		"nimble-lite",
		"big-toss",
		"brawler",
		"leg-day"
	], 
	functionCall: util.applyNimbleLiteModePatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Level 1 Mode", 
	longId: "levelOneMode", 
	shortId: "levelOne", 
	htmlElement: "level-one", 
	cliArg: "l1", 
	longDescript: "Forces Alucard to remain at level 1 the entire seed.", 
	shortDescript: "Alucard remains level 1.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyLevelOneModePatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Instant Death", 
	longId: "instantDeathMode", 
	shortId: "instantDeath", 
	htmlElement: "insta-death", 
	cliArg: "oko", 
	longDescript: "Alucard will die if he takes any damage.", 
	shortDescript: "Alucard will die if he takes any damage.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyInstantDeathModePatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Chaos Drops", 
	longId: "cornucopiaMode", 
	shortId: "cornucopia", 
	htmlElement: "cornucopia", 
	cliArg: "cd", 
	longDescript: "Enemies can drop any item in the game.", 
	shortDescript: "Enemies can drop any item in the game.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
		"bounty-hunter",
		"target-confirmed",
		"rampage",
		"hitman"
	], 
	functionCall: util.applyCornucopiaModePatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: true
  }, {
	name: "Separate Boss Music", 
	longId: "bossMusicSeparation", 
	shortId: "bossMusic", 
	htmlElement: "boss-music-separation", 
	cliArg: "bm", 
	longDescript: "Separates Boss music and Normal stage music randomization. Prevents hearing Enchanted Banquet for 10 minutes.", 
	shortDescript: "Separates Boss music and Normal stage music randomization.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	  "music"
	],
	incompatiblePresets: [
	], 
	functionCall: null, 
	rngNeeded: true, 
	simple: false,
    argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Four Beasts Spell", 
	longId: "fourBeastMode", 
	shortId: "fourBeast", 
	htmlElement: "four-beast", 
	cliArg: "4b", 
	longDescript: "Enables the use of Four Beasts spell from the Sega Saturn version.", 
	shortDescript: "Enables the use of Four Beasts spell.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "battle-mage"
	], 
	functionCall: util.applyFourBeastsPatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Forbidden Route Shortcut", 
	longId: "forbRouteShortMode", 
	shortId: "forbRouteShort", 
	htmlElement: "forbidden-shortcut", 
	cliArg: "frs", 
	longDescript: "Opens a shortcut in Marble Gallery 'Forbidden Route', the red area with Plate lord and Ctulhu.", 
	shortDescript: "Opens a shortcut in Marble Gallery 'Forbidden Route'.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyForbiddenRouteShortcutPatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Maximum Muramasa", 
	longId: "maxMasaMode", 
	shortId: "maxMasa", 
	htmlElement: "max-masa", 
	cliArg: "mm", 
	longDescript: "Maximizes the attack on the Muramasa.", 
	shortDescript: "Maximizes the attack on the Muramasa.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "boss-rush"
	], 
	functionCall: util.applyMuramasaMaxPatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Sword of Brawn", 
	longId: "brawnySwordMode", 
	shortId: "brawnySword", 
	htmlElement: "brawn-sword", 
	cliArg: "sod", 
	longDescript: "Allows the Dawn Warriors summoned by Sword of Dawn to have their strength scaled with Alucard's STR stat.", 
	shortDescript: "Dawn Warriors have their damage scaled.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applySwordOfBrawnPatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Entrance Trap Door", 
	longId: "trapDoorMode", 
	shortId: "trapDoor", 
	htmlElement: "trap-door", 
	cliArg: "td", 
	longDescript: "Allows Jewel of Open to open the trap door in the entrance of the castle.", 
	shortDescript: "Entrance trap door opens with Jewel of Open.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyEntranceTrapDoorPatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Enhanced Cross Subweapon", 
	longId: "betterCrossMode", 
	shortId: "betterCross", 
	htmlElement: "better-x", 
	cliArg: "bx", 
	longDescript: "Reduces the cost of the Cross subweapon for Alucard to 50 hearts and lets it return health.", 
	shortDescript: "Cross costs 50 and restores health.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyBetterCrossPatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "Enhanced Dark Shield Spell", 
	longId: "darkEIFMode", 
	shortId: "darkEIF", 
	htmlElement: "dark-shield", 
	cliArg: "dse", 
	longDescript: "Reduces the enemy invincibility frames granted by the Shield Rod spell with the Dark Shield from 80 to 10.", 
	shortDescript: "Reduces enemy i-frames for the Dark Shield spell.", 
	incompatibleOptions: [
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	], 
	functionCall: util.applyDarkShieldEIFPatches, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: false
  }, {
	name: "A List of Names", 
	longId: "nameListMode", 
	shortId: "nameList", 
	htmlElement: "name-list", 
	cliArg: "lon", 
	longDescript: "Updates the names of the enemies in the game to match earlier and later entries as well as translations.", 
	shortDescript: "Normalizes names from other CV games and the JP version.", 
	incompatibleOptions: [
	  "enemyStatRandoMode"
	],
	requiredOptions: [
	],
	incompatiblePresets: [
	  "bounty-hunter",
	  "target-confirmed",
	  "hitman",
	  "chaos-lite",
	  "rampage",
	  "battle-mage",
	  "max-rando"
	], 
	functionCall: util.applyListOfNames, 
	rngNeeded: false, 
	simple: true,
 	argvFlag: "bool",
	autoBuild: false
  }

//   , {
// 	name: "", 
// 	longId: "", 
// 	shortId: "", 
// 	htmlElement: "", 
// 	cliArg: "", 
// 	longDescript: "", 
// 	shortDescript: "", 
// 	incompatibleOptions: [
// 	],
// 	requiredOptions: [
// 	],
// 	incompatiblePresets: [
// 	], 
// 	functionCall: null, 
// 	rngNeeded: false, 
// 	simple: true,
//  argvFlag: "bool" "char" "opt",
//	autoBuild: false
//   }
  ]

  const exports = optionsArray

  if (self) {
    self.sotnRando = Object.assign(self.sotnRando || {}, {
      optionsArray: exports,
    })
  } else {
    module.exports = exports
  }
})(typeof(self) !== 'undefined' ? self : null)