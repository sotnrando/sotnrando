let util ;
let presets ;
let randomizeStats;
let os;
let NodeWorker;
let randomizeMusic;
let errors;
let applyAccessibilityPatches;
let randomizeRelics;
let version;

function isBrowser(){
    return (typeof window !== "undefined" && typeof window.document !== "undefined")
}

function loadRequirements() {
    util = isBrowser() ? window.sotnRando.util : require("./util");
    presets = isBrowser() ? window.sotnRando.presets : require("../build/presets");
    randomizeStats = isBrowser() ? window.sotnRando.randomizeStats : require("./randomize_stats");
    os = isBrowser() ? null : require("os");
    randomizeMusic = isBrowser() ? window.sotnRando.randomizeMusic : require("./randomize_music");
    errors = isBrowser() ? window.sotnRando.errors : require("./errors");
    applyAccessibilityPatches = isBrowser() ? window.sotnRando.applyAccessibilityPatches : require("./accessibility_patches");
    randomizeRelics = isBrowser() ? window.sotnRando.randomizeRelics : require("./randomize_relics");
    NodeWorker = !isBrowser() ? require("worker_threads").Worker : null;
    constants = isBrowser() ? window.sotnRando.constants : require("./constants");
}

function generateSeedName() {
    let adjectives;
    let nouns;

    let month = new Date().getMonth() + 1;

    switch (month) {
        case 10:
            adjectives = sotnRando.constants.adjectivesHalloween;
            nouns = sotnRando.constants.nounsHalloween;
            break;
        case 12:
            adjectives = sotnRando.constants.adjectivesHolidays;
            nouns = sotnRando.constants.nounsNormal;
            break;

        default:
            adjectives = sotnRando.constants.adjectivesNormal;
            nouns = sotnRando.constants.nounsNormal;
            break;
    }

    let adjective = adjectives[Math.floor(Math.random() * Math.floor(adjectives.length - 1))];
    let noun = nouns[Math.floor(Math.random() * Math.floor(nouns.length - 1))];
    let number = Math.floor(Math.random() * 999);
    if (number % 100 === 69) {
        number = '69Nice';
    }

    let suffix = '';

    return adjective + noun + number + suffix;
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
    const releaseBaseUrl = sotnRando.constants.optionsUrls[sotnRando.constants.defaultOptions]
    const releaseHostname = new URL(releaseBaseUrl).hostname
    return url.hostname !== releaseHostname
}

function getVersion() {
    version = "0.0.0D";
    if(!isBrowser()){
        version = require('../package.json').version
    }else{
        const url = new URL(window.location.href)
        const isDev = isBrowserDev(url);
        if (url.protocol !== 'file:') {
            fetch('package.json', { cache: 'no-store' }).then(function (response) {
                if (response.ok) {
                    response.json().then(function (json) {
                        version = json.version
                        if (isDev && !version.match(/-/)) {
                            version += 'D'
                        }
                    })
                }
            })
        }
    }
    return version;
}

function getRNG(options, seed){
    const seedrandom = isBrowser() ? Math.seedrandom : require('seedrandom');
    return new seedrandom(util.saltSeed(
        version,
        options,
        seed,
        3,
    ));
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
    let randomizeWorkerString;
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
    return isBrowser() ? browserWorkers(browserWorkerCount()) : cliWorkers();
}

function getSingleWorker(){
    return isBrowser() ? browserWorkers(1)[0] : new NodeWorker('./src/worker.js');
}

function debugMessage(debugEnabled, msg) {
    if(!debugEnabled) return;
    console.log(`randomize | function: randomize | ${msg}`)
}

async function randomize(
    options,
    seed,
    newGoals,
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
    fileToCheck
){
    try {
        let check
        let checksum
        let startTime
        let optFlag
        getVersion();
        startTime = performance.now()
        loadRequirements();
        check = new util.checked(fileToCheck) // typeof(fd) === 'object' ? undefined : fd
        if(typeof info === "undefined" || !info){
            info = util.newInfo();
            info[1]['Seed'] = seed
        }
        let applied
        try {
            debugMessage(debugEnabled, "Check for overriding preset");
            // Check for overriding preset.
            let override
            for (let preset of presets) {
                if (preset.override) {
                    applied = preset.options();
                    override = true;
                    break;
                }
            }
            debugMessage(debugEnabled, 'Retrieve user-specified options');
            // Get user specified options.
            if (!override) {
                applied = util.Preset.options(options)
            }
        } catch (err) {
            if(helpHandler) helpHandler(); // yargs.showHelp()
            console.error('\n' + err.message)
            if(!isBrowser()) process.exit(1);
        }
        try {
            let rng
            let result
            debugMessage(debugEnabled, 'Randomize stats');
            // Randomize stats.
            rng = getRNG(options, seed);
            result = randomizeStats(rng, applied)
            const newNames = result.newNames
            check.apply(result.data)
            debugMessage(debugEnabled, 'Randomize Relics: Assemble Workers');
            // Randomize relics.
            const workers = getWorkers();
            debugMessage(debugEnabled, 'Randomize Relics:call util function');
            result = await util.randomizeRelics(
                version,
                applied,
                options,
                seed,
                newNames,
                workers,
                4,
                isBrowser() ? getBrowserUrl() : undefined
            )

            util.mergeInfo(info, result.info)
            debugMessage(debugEnabled, 'Randomize Relics:Write new relic map');
            // Write relics mapping.
            rng = getRNG(options, seed);
            result = randomizeRelics.writeRelics(
                rng,
                applied,
                result,
                newNames,
            )
            check.apply(result.data)
            debugMessage(debugEnabled, 'Randomize Items: call util function');
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
                isBrowser() ? getBrowserUrl() : undefined
            )
            debugMessage(debugEnabled, 'Randomize Items: Write new item map');
            check.apply(result.data)
            util.mergeInfo(info, result.info)
            debugMessage(debugEnabled, 'Randomize Music');
            // Randomize music.
            if (applied.randomizeMusic == true && applied.randomizeMusic !== undefined) {
                rng = getRNG(options, seed);
                check.apply(randomizeMusic(rng, applied))
            }
            debugMessage(debugEnabled, 'Apply options / writes function master');
            // Start the function master
            let optWrite = 0x00000000                   // This variable lets the ASM used in the Master Function know if it needs to run certain code or sets flags for the tracker to use
            let nGoal = newGoals !== "default" ? newGoals : undefined;
            // console.log(options.newGoalsSet + '|' + applied.newGoalsSet)
            if (nGoal || options.newGoalsSet || applied.newGoalsSet) {                   // Sets flag for the tracker to know which goals to use
                if (!nGoal && applied.newGoalsSet !== undefined) {
                    nGoal = applied.newGoalsSet
                } else if (!nGoal && options.newGoalsSet !== undefined) {
                    nGoal = options.newGoalsSet
                }
                switch(nGoal) {
                    case "b":                                 // all bosses flag
                        optWrite = optWrite + 0x01
                        break
                    case "r":                                 // all relics flag
                        optWrite = optWrite + 0x02
                        break
                    case "a":                                 //  all bosses and relics flag
                        optWrite = optWrite + 0x03
                        break
                    case "v":                                 //  all bosses and vlad relics flag
                    case "x":                                 //  all bosses and bounties flag
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

            let seasonAllowed = options.seasonalPhrasesMode || applied.seasonalPhrasesMode
            check.apply(util.applySplashText(rng,seasonAllowed))

            debugMessage(debugEnabled, 'Apply patches from options');
            optFlag = false
            if (options.tournamentMode) {
                // Apply tournament mode patches.
                optFlag = true
                check.apply(util.applyTournamentModePatches())
            }
            debugMessage(debugEnabled, 'Tournament Mode | ' + optFlag);
            optFlag = false
            if (options.magicmaxMode || applied.magicmaxMode) { // Adds MP Vessel to replace Heart Vessel - eldrich
                // Apply magic max mode patches. - MottZilla
                optFlag = true
                check.apply(util.applyMagicMaxPatches())
            }
            debugMessage(debugEnabled, 'Magicmax Mode | ' + optFlag)
            optFlag = false
            if (options.antiFreezeMode || applied.antiFreezeMode) { // Removes screen freezes on relic / vessel collection and level-up - eldrich
                // Apply anti-freeze mode patches. - eldri7ch
                optFlag = true
                check.apply(util.applyAntiFreezePatches())
            }
            debugMessage(debugEnabled, 'Anti-Freeze Mode | ' + optFlag)
            optFlag = false
            if (options.mypurseMode || applied.mypurseMode) { // Removes Death from Entrance - eldrich
                // Apply Death repellant patches. - eldri7ch
                optFlag = true
                check.apply(util.applyMyPursePatches())
            }
            debugMessage(debugEnabled, 'That\'s my purse! Mode | ' + optFlag);
            optFlag = false
            if (options.iwsMode || applied.iwsMode) { // Makes wing smash essentially infinite - eldrich
                // Apply infinite wing smashe mode patches. - eldri7ch
                optFlag = true
                check.apply(util.applyiwsPatches())
            }
            debugMessage(debugEnabled, 'Infinite Wing Smash Mode | ' + optFlag);
            optFlag = false
            if (options.fastwarpMode || applied.fastwarpMode) { // Quickens teleporter warp animations - eldrich
                // Apply fast warp mode patches. - eldri7ch
                optFlag = true
                check.apply(util.applyfastwarpPatches())
            }
            debugMessage(debugEnabled, 'Fast Warps Mode | ' + optFlag)
            optFlag = false
            if (options.noprologueMode || applied.noprologueMode) { // removes prologue - eldrich
                // Apply no prologue mode patches. - eldri7ch
                optFlag = false
                check.apply(util.applynoprologuePatches())
            }
            debugMessage(debugEnabled, 'No Prologue Mode | ' + optFlag)
            optFlag = false
            if (options.unlockedMode || applied.unlockedMode) { // Unlocks shortcuts - eldrich
                // Apply unlocked mode patches. - eldri7ch
                optFlag = true
                check.apply(util.applyunlockedPatches())
            }
            debugMessage(debugEnabled, 'Unlocked Mode | ' + optFlag)
            optFlag = false
            if (options.surpriseMode || applied.surpriseMode) { // Hides relics behind the same sprite - eldrich
                // Apply surprise mode patches. - eldri7ch
                optFlag = true
                check.apply(util.applysurprisePatches())
            }
            debugMessage(debugEnabled, 'Surprise Mode | ' + optFlag)
            optFlag = false
            if (options.enemyStatRandoMode || applied.enemyStatRandoMode) { // Randomizes enemy stats - eldrich
                // Apply Enemy Stat Rando mode patches. - eldri7ch
                optFlag = true
                rng = getRNG(options, seed);
                let chaosFlag = false
                if (options.elemChaosMode || applied.elemChaosMode) {
                    chaosFlag = true
                }
                check.apply(util.applyenemyStatRandoPatches(rng,chaosFlag))
            }
            debugMessage(debugEnabled, 'Enemy Stat Randomizer Mode | ' + optFlag)
            optFlag = false
            if (options.shopPriceRandoMode || applied.shopPriceRandoMode) { // Randomizes shop prices - eldrich
                // Apply shop price Rando mode patches. - eldri7ch
                optFlag = true
                rng = getRNG(options, seed);
                check.apply(util.applyShopPriceRandoPatches(rng))
            }
            debugMessage(debugEnabled, 'Shop Price Randomizer Mode | ' + optFlag)
            optFlag = false
            if (options.startRoomRandoMode || applied.startRoomRandoMode || options.startRoomRando2ndMode || applied.startRoomRando2ndMode) { // Randomizes starting room - eldrich & MottZilla
                // Apply starting room Rando mode patches. - eldri7ch
                optFlag = true
                rng = getRNG(options, seed);
                let castleFlag = 0x00
                if (options.startRoomRandoMode || applied.startRoomRandoMode) {
                    castleFlag = castleFlag + 0x01
                }
                if (options.startRoomRando2ndMode || applied.startRoomRando2ndMode) {
                    castleFlag = castleFlag + 0x10
                }
                check.apply(util.applyStartRoomRandoPatches(rng,castleFlag))
            }
            debugMessage(debugEnabled, 'Starting Room Randomizer Mode | ' + optFlag)
            optFlag = false
            if (options.dominoMode || applied.dominoMode) { // Guarantees drops - eldrich
                // Apply guaranteed drops patches. - eldri7ch
                optFlag = true
                check.apply(util.applyDominoPatches())
            }
            debugMessage(debugEnabled, 'Guaranteed Drops Mode | ' + optFlag)
            optFlag = false
            if (options.rlbcMode || applied.rlbcMode) { // reverse library cards - eldrich
                // Apply reverse library card patches. - eldri7ch
                optFlag = true
                check.apply(util.applyRLBCPatches())
            }
            debugMessage(debugEnabled, 'Reverse Library Card Mode | ' + optFlag)
            optFlag = false
            if (options.immunityPotionMode || applied.immunityPotionMode) { // todo: Change this to Resist to Immune Potions "mode" or option.
                // Apply resist to immune potion patches. - MottZilla
                optFlag = true
                check.apply(util.applyResistToImmunePotionsPatches())
            }
            debugMessage(debugEnabled, 'Immunity Potions Mode | ' + optFlag)
            optFlag = false
            if (options.godspeedMode || applied.godspeedMode) { // godspeed shoes - eldrich
                optFlag = true
            }
            debugMessage(debugEnabled, 'Godspeed Mode | ' + optFlag)
            optFlag = false
            if (options.libraryShortcut || applied.libraryShortcut) { // library shortcut - eldrich
                optFlag = true
                check.apply(util.applyLibraryShortcutPatches())
            }
            debugMessage(debugEnabled, 'Library Shortcut | ' + optFlag)
            optFlag = false
            if (options.elemChaosMode || applied.elemChaosMode) { // elemental chaos - eldrich
                optFlag = true
                rng = getRNG(options, seed);
                check.apply(util.applyElemChaosPatches(rng))
            }
            debugMessage(debugEnabled, 'Elemental Chaos | ' + optFlag)
            optFlag = false
            if (options.simpleInputMode || applied.simpleInputMode) { // Simplifies spell inputs - eldrich
                // Apply simple input patches. - eldri7ch
                optFlag = true
                check.apply(util.applySimpleInputPatches())
            }
            debugMessage(debugEnabled, 'Simplified Input Mode | ' + optFlag)
            optFlag = false
            if (options.devStashMode || applied.devStashMode) { // dev's stash - eldrich
                optFlag = true
                check.apply(util.applyDevsStashPatches())
            }
            debugMessage(debugEnabled, '| Dev\'s Stash | ' + optFlag)
            optFlag = false
            if (options.seasonalPhrasesMode || applied.seasonalPhrasesMode) { // Seasonal Phrases - eldrich
                optFlag = true
            }
            debugMessage(debugEnabled, 'Seasonal Phrases Mode | ' + optFlag)
            optFlag = false
            if (options.bossMusicSeparation || applied.bossMusicSeparation) { // separate boss music - eldrich
                // verify boss music separate. - eldri7ch
                optFlag = true
            }
            debugMessage(debugEnabled, 'Boss Music Separator | ' + optFlag)

            if (mapColor && mapColor !== "default") { // Colors the map - eldrich
                // Apply map color patches. - eldri7ch
                check.apply(util.applyMapColor(mapColor))
            }
            debugMessage(debugEnabled, 'Map colors')
            if (options.newGoalsSet || applied.newGoalsSet) { // changes the goals - eldrich
                // Apply new goal patches. - eldri7ch
                if (options.newGoalsSet !== undefined){
                    nGoal = options.newGoalsSet
                } else {
                    nGoal = applied.newGoalsSet
                }
                if (nGoal === "h") {
                    check.apply(util.applyBountyHunterTargets(rng,0))                 // 0 = normal Bounty Hunter; 1 = buffed drop rates and guaranteed relics after card obtained
                } else if (nGoal === "t") {
                    check.apply(util.applyBountyHunterTargets(rng,2))                 // 0 = normal Bounty Hunter; 1 = buffed drop rates and guaranteed relics after card obtained
                } else if (nGoal === "w") {
                    check.apply(util.applyBountyHunterTargets(rng,1))                 // 0 = normal Bounty Hunter; 1 = buffed drop rates and guaranteed relics after card obtained
                }else if (nGoal === "x") {
                    check.apply(util.applyNewGoals(nGoal))
                    check.apply(util.applyBountyHunterTargets(rng,2))                 // 0 = normal Bounty Hunter; 1 = buffed drop rates and guaranteed relics after card obtained
                } else {
                    check.apply(util.applyNewGoals(nGoal))
                }
            }
            debugMessage(debugEnabled, 'New Goals')
            if (alucardPalette) { // Changes Alucard's Palette. -Crazy4blades
                // Apply new goal patches. - eldri7ch
                check.apply(util.applyAlucardPalette(alucardPalette))
            }
            debugMessage(debugEnabled, 'Alucard Palette')
            if (alucardLiner) { // Changes Alucard's Palette. -Crazy4blades
                // Apply new goal patches. - eldri7ch
                check.apply(util.applyAlucardLiner(alucardLiner))
            }
            debugMessage(debugEnabled, 'Alucard Liner')
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
            if(!isBrowser()) process.exit(1);
        }
        debugMessage(debugEnabled, 'Set seed text in menu')
        util.setSeedText(
            check,
            seed,
            version,
            options.preset,
            options.tournamentMode,
        )
        checksum = await check.sum()
        debugMessage(debugEnabled, 'Checksum verification')
        // Verify expected checksum matches actual checksum.
        if (haveChecksum && expectChecksum !== checksum) {
            console.error('Checksum mismatch.')
            if(!isBrowser()) process.exit(1)
        }

        debugMessage(debugEnabled, 'Accessibility patches')
        if (enableAccessibilityPatches) {
            // Apply accessibility patches.
            check.apply(applyAccessibilityPatches())
        }
        let result;
        if(isBrowser()){
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
        if(urlHandler) urlHandler(checksum);
        debugMessage(debugEnabled, 'Show spoilers')
        // Print spoilers.
        spoilerHandler(info, startTime);
        debugMessage(debugEnabled, 'Write File Output')
        fileOutputHandler(check, seed, result);
    } finally {
        debugMessage(debugEnabled, 'Wrap-up')
        if(fileCloseHandler) fileCloseHandler();
    }
}

if(isBrowser()){
    window.CoreRandomizer = window.CoreRandomizer || {};
    CoreRandomizer.isDev = isBrowserDev;
    CoreRandomizer.getVersion = getVersion;
    CoreRandomizer.randomize = randomize;
    CoreRandomizer.generateSeedName = generateSeedName;
    window.url = new URL(window.location.href)
}else{
    module.exports = {randomize, generateSeedName}
}