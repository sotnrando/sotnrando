let constants
let util
let presets
let randomizeStats
let os
let NodeWorker
let randomizeMusic
let errors
let applyAccessibilityPatches
let randomizeRelics
let version
let optionsArray

function isBrowser(){
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

function loadRequirements(preset) {
  if (isBrowser()) {
    util = window.sotnRando.util
    presets = window.sotnRando.presets
    randomizeStats = window.sotnRando.randomizeStats
    randomizeMusic = window.sotnRando.randomizeMusic
    errors = window.sotnRando.errors
    applyAccessibilityPatches = window.sotnRando.applyAccessibilityPatches
    randomizeRelics = window.sotnRando.randomizeRelics
    constants = window.sotnRando.constants
    optionsArray = window.sotnRando.optionsArray
  } else {
    util = require('./util')
    presets = require('../build/presets').loadInheritancePresets(preset)
    randomizeStats = require('./randomize_stats')
    os = require('os')
    randomizeMusic = require('./randomize_music')
    errors = require('./errors')
    applyAccessibilityPatches = require('./accessibility_patches')
    randomizeRelics = require('./randomize_relics')
    NodeWorker = require('worker_threads').Worker
    constants = require('./constants')
    optionsArray = require('./options_array')
  }
}

function generateSeedName() {
  let adjectives
  let nouns

  const month = new Date().getMonth() + 1
  constants = isBrowser() ? window.sotnRando.constants : require('./constants')
  switch (month) {
  case 10:
    adjectives = constants.adjectivesHalloween
    nouns = constants.nounsHalloween
    break
  case 12:
    adjectives = constants.adjectivesHolidays
    nouns = constants.nounsNormal
    break

  default:
    adjectives = constants.adjectivesNormal
    nouns = constants.nounsNormal
    break
  }

  const adjIdx = Math.floor(Math.random() * (adjectives.length - 1))
  const adjective = adjectives[adjIdx]
  const noun = nouns[Math.floor(Math.random() * (nouns.length - 1))]
  let number = Math.floor(Math.random() * 999)
  if (number % 100 === 69) {
    number = '69Nice'
  }

  let suffix = ''

  return adjective + noun + number + suffix
}

function getBrowserUrl(){
  const url = new URL(window.location.href)
  if (url.protocol === 'file:') {
    return 'file://'
      + window.location.pathname.split('/').slice(0, -1).join('/') + '/'
  } else {
    return window.location.protocol + '//' + window.location.host + '/'
  }
}

function isBrowserDev(url) {
  const defaultOpts = sotnRando.constants.defaultOptions
  const releaseBaseUrl = sotnRando.constants.optionsUrls[defaultOpts]
  const releaseHostname = new URL(releaseBaseUrl).hostname
  return url.hostname !== releaseHostname
}

async function loadVersionInBrowser() {
  const isDev = isBrowserDev(url)
  const response = await fetch('../package.json', { cache: 'no-store' })
  if (response.ok) {
    const json = await response.json()
    version = json.version
    if (isDev && !version.match(/-/)) {
      version += 'D'
    }
  }
}

async function getVersion() {
  version = '0.0.0D'
  if (!isBrowser()) {
    version = require('../package.json').version
  } else {
    const url = new URL(window.location.href)        
    if (url.protocol !== 'file:') {
      await loadVersionInBrowser()
    }
  }
  return version
}

function getRNG(options, seed){
  const seedrandom = isBrowser() ? Math.seedrandom : require('seedrandom')
  return new seedrandom(util.saltSeed(
    version,
    options,
    seed,
    3,
  ))
}

function browserWorkerCount() {
  // Get the number of potential workers from cores
  const cores = navigator.hardwareConcurrency
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
  if (isFirefox) {
    return Math.max(Math.floor(cores / 2), 1)
  }
  return sotnRando.util.workerCountFromCores(cores)
}

function browserWorkers(count){
  // Instantiate Workers
  const workers = Array(count)
  const url = new URL(window.location.href)
  let randomizeWorkerString
  if (url.protocol === 'file:') {
    randomizeWorkerString = randomizeWorker.toString()
    const source = '(' + randomizeWorkerString + ')()'
    for (let i = 0; i < count; i++) {
      workers[i] = new Worker(
        URL.createObjectURL(new Blob([source], {
          type: 'text/javascript',
        }))
      )
    }
  } else {
    for (let i = 0; i < count; i++) {
      workers[i] = new Worker('src/worker.js')
    }
  }
  return workers
}

function cliWorkers(){
  const cores = os.cpus().length
  const workers = Array(util.workerCountFromCores(cores))
  for (let i = 0; i < workers.length; i++) {
    workers[i] = new NodeWorker('./src/worker.js')
  }
  return workers
}

function getWorkers(){
  return isBrowser() ? browserWorkers(browserWorkerCount()) : cliWorkers()
}

function getSingleWorker(){
  return isBrowser() ? browserWorkers(1)[0] : new NodeWorker('./src/worker.js')
}

function debugMessage(debugEnabled, msg) {
  if (debugEnabled) {
    console.log(`randomize | function: randomize | ${msg}`)
  }
}

async function randomize(
  options,
  seed,
  newGoals,
  startStatMax,
  godSpeedShoes,
  mapColor,
  alucardPalette,
  alucardLiner,
  enableAccessibilityPatches,
  haveChecksum,
  expectChecksum,
  debugEnabled,
  spoilerHandler,
  helpHandler,
  urlHandler,
  fileOutputHandler,
  fileCloseHandler,
  fileToCheck,
  presetName = options.preset,
){
  try {
    let check
    let checksum
    let startTime
    let optFlag
    await getVersion()
    startTime = performance.now()
    loadRequirements(presetName)
    check = new util.checked(fileToCheck) // typeof(fd) === 'object' ? undefined : fd
    if (typeof info === 'undefined' || !info) {
      info = util.newInfo()
      info[1]['Seed'] = seed
    }
    let applied
    try {
      debugMessage(debugEnabled, 'Check for overriding preset')
      // Check for overriding preset.
      let override
      for (let preset of presets) {
        if (preset.override) {
          applied = preset.options()
          override = true
          break
        }
      }
      debugMessage(debugEnabled, 'Retrieve user-specified options')
      // Get user specified options.
      if (!override) {
        applied = util.Preset.options(options)
      }
    } catch (err) {
      if (helpHandler) {
        helpHandler() // yargs.showHelp()
      }
      console.error('\n' + err.message)
      if (!isBrowser()) {
        process.exit(1)
      }
    }
    // console.log(applied)
    try {
      let rng
      let result
      debugMessage(debugEnabled, 'Randomize item stats')
      // Randomize stats.
      rng = getRNG(options, seed)
      result = randomizeStats(rng, applied)
      const newNames = result.newNames
      check.apply(result.data)
      debugMessage(debugEnabled, 'Randomize Relics: Assemble Workers')
      // Randomize relics.
      const workers = getWorkers()
      debugMessage(debugEnabled, 'Randomize Relics: Call util function')
      result = await util.randomizeRelics(
        version,
        applied,
        options,
        seed,
        newNames,
        workers,
        4,
        isBrowser() ? getBrowserUrl() : undefined,
      )

      util.mergeInfo(info, result.info)
      debugMessage(debugEnabled, 'Randomize Relics: Write new relic map')
      // Write relics mapping.
      rng = getRNG(options, seed)
      result = randomizeRelics.writeRelics(
        rng,
        applied,
        result,
        newNames,
      )
      check.apply(result.data)
      debugMessage(debugEnabled, 'Randomize Items: Call util function')
      // Randomize items.
      result = await util.randomizeItems(
        version,
        applied,
        options,
        seed,
        getSingleWorker(),
        2,
        result.items,
        newNames,
        isBrowser() ? getBrowserUrl() : undefined,
      )
      debugMessage(debugEnabled, 'Randomize Items: Write new item map')
      check.apply(result.data)
      util.mergeInfo(info, result.info)
      debugMessage(debugEnabled, 'Randomize Music')
      // Randomize music.
      // console.log('Music Randomizer: ' + applied.music)
      if (applied.music == true && applied.music !== undefined) {
        rng = getRNG(options, seed)
        check.apply(randomizeMusic(rng, applied))
      }
      debugMessage(debugEnabled, 'Apply options / writes function master')
      // Start the function master
      // This variable lets the ASM used in the Master Function know if it needs
      // to run certain code or sets flags for the tracker to use
      let optWrite = 0x00000000
      let nGoal = newGoals !== 'default' ? newGoals : undefined
      if (nGoal === undefined || nGoal === false) {
        if (options.newGoalsSet === undefined
            && applied.newGoalsSet === undefined) {
          nGoal = false
        } else if (options.newGoalsSet === undefined) {
          nGoal = applied.newGoalsSet
        } else {
          nGoal = options.newGoalsSet
        }
      }
      debugMessage(
        debugEnabled,
        'newGoalsCheck | '
          + nGoal + ':' + options.newGoalsSet + ':' + applied.newGoalsSet)
      if (nGoal) {
        // Sets flag for the tracker to know which goals to use
        switch(nGoal) {
        // All bosses flag
        case 'b':
          optWrite = optWrite + 0x01
          break
        // All relics flag
        case 'r':
          optWrite = optWrite + 0x02
          break
        // All bosses and relics flag
        case 'a':
          optWrite = optWrite + 0x03
          break
        // All bosses and vlad relics flag
        case 'v':
        // All bosses and bounties flag
        case 'x':
        // All bosses, relics and bounties flag
        case 'y':
          optWrite = optWrite + 0x05
          break
        default:
          break
        }
        // console.log('optwrite ' + optWrite)
      }
      // Apply Godspeed Shoes Patches
      if (godSpeedShoes || options.godspeedMode || applied.godspeedMode) {
        optWrite = optWrite + 0x80000000
      }
      check.apply(util.randoFuncMaster(optWrite))
      check.apply(util.applySwordBuffPatches())
      let seasonAllowed =
        options.seasonalPhrasesMode
        || applied.seasonalPhrasesMode
      check.apply(util.applySplashText(rng,seasonAllowed))

      debugMessage(debugEnabled, 'Apply patches from options')

      // This does not encompass all options , even options listed in the array
      // it references. Anything not caught by this is completed elsewhere.
      optionsArray.forEach(function(indivOpt) {
        // Check if the option is being used
        if (options[indivOpt.longId] || applied[indivOpt.longId]) {
          // Check if the option is simple enough to be implemented en masse
          if (indivOpt.simple === true) {
            try {
              // Set the flag to show in debug mode whether the option was enabled
              optFlag = true
              // Check if RNG is needed for the option function
              // Apply the function as described in the array
              if (indivOpt.rngNeeded === true) {
                // If the function needs RNG, roll it.
                rng = getRNG(options, seed)
                check.apply(indivOpt['functionCall'](rng))
              } else {
                // If you were sent here by an error, that means that the option 
                // is not corectly handled by the options array. Check to make 
                // sure that all of the parameters are correctly declared and if
                // the option is actually simple. 
                // (Simple options don't require additional parameters, don't 
                // need to detect other option status, etc. Just "true" to turn 
                // on, maybe need RNG at most.)
                check.apply(indivOpt['functionCall']())
              }
            } catch (err) {
              console.error('Option function call incorrect for: ' + indivOpt.longId)
            }
          // If the option isn't simple enough to be applied en masse but it's
          // still in the array, run it through this cswitch to make sure it's
          // applied correctly.
          } else {
            console.log('option not simple')
            switch (indivOpt.longId) {
              case "tournamentMode":
                // Apply tournament mode patches.
                optFlag = true
                check.apply(util.applyTournamentModePatches())
                break
              case "enemyStatRandoMode":
                // Apply Enemy Stat Rando mode patches.
                optFlag = true
                rng = getRNG(options, seed)
                let chaosFlag = false
                if (options.elemChaosMode || applied.elemChaosMode) {
                  chaosFlag = true
                }
                check.apply(util.applyenemyStatRandoPatches(rng,chaosFlag))
                break
              case "startRoomRandoMode":
              case "startRoomRando2ndMode":
                // Randomizes starting room by eldri7ch & MottZilla
                // Apply starting room Rando mode patches.
                optFlag = true
                rng = getRNG(options, seed)
                let castleFlag = 0x00
                if (options.startRoomRandoMode || applied.startRoomRandoMode) {
                  castleFlag = castleFlag + 0x01
                }
                if (options.startRoomRando2ndMode || 
                      applied.startRoomRando2ndMode) {
                  castleFlag = castleFlag + 0x10
                }
                check.apply(util.applyStartRoomRandoPatches(rng,castleFlag))
                break
              case "startStatRandoMode":
                // Apply the Starting Stats randomizer. 
                optFlag = true
                rng = getRNG(options, seed)
                // Need to confirm if in applied or options.
                if (options.startStatRandoMode !== undefined) {
                  if (startStatMax !== null) {
                    // Special condition to pull from website interface
                    ssOpt = Number(startStatMax)
                  } else {
                    ssOpt = Number(options.startStatRandoMode)
                  }
                } else {
                  if (applied.startStatRandoMode !== undefined) {
                    ssOpt = Number(applied.startStatRandoMode)
                  } else {
                    ssOpt = 0
                  }
                }
                check.apply(util.applyStartStatRandoPatches(rng,ssOpt))
                break
              case "seasonalPhrasesMode":
              case "godspeedMode":
              case "bossMusicSeparation":
              case "enemyDrops":
              case "turkeyMode":
              case "itemLocations":
              case "startingEquipment":
              case "prologueRewards":
              case "colorrandoMode":
              case "stats":
              case "itemNameRandoMode":
                // Only shows that it was enabled; this is handled elsewhere
                optFlag = true
                break
              default:
                console.log('Option function call incorrect for: ' + indivOpt.longId)
            }
          }
        }
        debugMessage(debugEnabled, indivOpt.name + ' | ' + optFlag)
        optFlag = false
      })

      // Dev's stash: Extra Items or unfinished features
      if (options.devStashMode || applied.devStashMode) {
        // Apply extra items that aren't fully implement yet.
        check.apply(util.applyListOfNames())
      }
      
      // Colors the map
      if (mapColor && mapColor !== 'default') {
        // Apply map color patches.
        check.apply(util.applyMapColor(mapColor))
      }
      debugMessage(debugEnabled, 'Map colors')
      // Changes the goals
      if (options.newGoalsSet || applied.newGoalsSet) {
        // Apply new goal patches.
        if (options.newGoalsSet !== undefined){
          nGoal = options.newGoalsSet
        } else {
          nGoal = applied.newGoalsSet
        }
        const BH = constants.BHMODE
        if (nGoal === 'h') {
          check.apply(util.applyBountyHunterTargets(rng, BH.NORMAL))
        } else if (nGoal === 't') {
          check.apply(util.applyBountyHunterTargets(rng, BH.TARGET_CONFIRMED))
        } else if (nGoal === 'w') {
          check.apply(util.applyBountyHunterTargets(rng, BH.HITMAN))
        }else if (nGoal === 'x') {
          check.apply(util.applyNewGoals(nGoal))
          check.apply(util.applyBountyHunterTargets(rng, BH.TARGET_CONFIRMED))
        }else if (nGoal === 'y') {
          check.apply(util.applyNewGoals(nGoal))
          check.apply(util.applyBountyHunterTargets(rng, BH.TARGET_CONFIRMED))
        } else {
          check.apply(util.applyNewGoals(nGoal))
        }
      }
      debugMessage(debugEnabled, 'New Goals')
      if (alucardPalette) { // Changes Alucard's Palette. -Crazy4blades
        // Apply new goal patches.
        check.apply(util.applyAlucardPalette(alucardPalette))
      }
      debugMessage(debugEnabled, 'Alucard Palette')
      if (alucardLiner) { // Changes Alucard's Palette. -Crazy4blades
        // Apply new goal patches.
        check.apply(util.applyAlucardLiner(alucardLiner))
      }
      debugMessage(debugEnabled, 'Alucard Liner')
      optFlag = false
      debugMessage(debugEnabled, 'Apply Writes')
      // Apply writes.
      check.apply(util.applyWrites(rng, applied))
    } catch (err) {
      debugMessage(debugEnabled, 'Error catching')
      console.error('Seed: ' + seed)
      if (errors.isError(err)) {
        console.error('Error: ' + err.message)
      } else {
        console.error(err.stack)
      }
      if (!isBrowser()) {
        process.exit(1)
      }
    }
    debugMessage(debugEnabled, 'Set seed text in menu')
    util.setSeedText(
      check,
      seed,
      version,
      presetName,
      options.tournamentMode,
    )
    debugMessage(debugEnabled, 'Apply tracking byte for tracker data')
    check.apply(util.applyTrackingByte())
    checksum = await check.sum()
    debugMessage(debugEnabled, 'Checksum verification')
    // Verify expected checksum matches actual checksum.
    if (haveChecksum && expectChecksum !== checksum) {
      console.error('Checksum mismatch.')
      if (!isBrowser()) {
        process.exit(1)
      }
    }

    debugMessage(debugEnabled, 'Accessibility patches')
    if (enableAccessibilityPatches) {
      // Apply accessibility patches.
      check.apply(applyAccessibilityPatches())
    }
    let result
    if (isBrowser()) {
      result = await util.finalizeData(
        seed,
        version,
        options.preset,
        options.tournamentMode,
        fileToCheck,
        check,
        getSingleWorker(),
        getBrowserUrl(),
      )
    }

    debugMessage(debugEnabled, 'Show url if provided as arg')
    // Show url if not provided as arg.
    if(urlHandler) urlHandler(checksum)
    debugMessage(debugEnabled, 'Show spoilers')
    // Print spoilers.
    spoilerHandler(info, startTime)
    debugMessage(debugEnabled, 'Write File Output')
    fileOutputHandler(check, seed, result)
  } finally {
    debugMessage(debugEnabled, 'Wrap-up')
    if (fileCloseHandler) {
      fileCloseHandler()
    }
  }
}

if (isBrowser()) {
  window.CoreRandomizer = window.CoreRandomizer || {}
  CoreRandomizer.isDev = isBrowserDev
  CoreRandomizer.getVersion = getVersion
  CoreRandomizer.randomize = randomize
  CoreRandomizer.generateSeedName = generateSeedName
  window.url = new URL(window.location.href)
} else {
  module.exports = {
    randomize,
    generateSeedName,
  }
}
