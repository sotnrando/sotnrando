(function (window) {
  const constants = sotnRando.constants
  const errors = sotnRando.errors
  const extension = sotnRando.extension
  const util = sotnRando.util
  const presets = sotnRando.presets
  const randomizeStats = sotnRando.randomizeStats
  const randomizeItems = sotnRando.randomizeItems
  const randomizeRelics = sotnRando.randomizeRelics
  const randomizeMusic = sotnRando.randomizeMusic
  const applyAccessibilityPatches = sotnRando.applyAccessibilityPatches
  const relics = sotnRando.relics
  const apiUrl = "https://sotnrandoapi.duckdns.org";
  const seasonalEvents = [
    {
      "eventName": "Pride Month",
      "startMonth": 6,
      "startDay": 1,
      "endMonth": 7,
      "endDay": 1,
      "eventLogo": "images/logopride.png",
      "toolSplashPhrases": constants.prideSplashPhrases
    }
  ]


  let info
  let currSeed
  let checksum
  let expectChecksum
  let haveChecksum
  let downloadReady
  let selectedFile
  let version
  let mapColorLock
  let newGoalsLock
  let alucardPaletteLock
  let alucardLinerLock
  let isAprilFools
  let songsList = [
    "Lost Painting",
    "Curse Zone",
    "Requiem For The Gods",
    "Rainbow Cemetary",
    "Wood Carving Partita",
    "Crystal Teardrops",
    "Marble Gallery",
    "Draculas Castle",
    "The Tragic Prince",
    "Tower of Mist",
    "Door of Holy Spirits",
    "Dance of Pales",
    "Abandoned Pit",
    "Heavenly Doorway",
    "Festival of Servants",
    "Wandering Ghosts",
    "The Door to the Abyss",
    "Dance of Gold",
    "Enchanted Banquet",
    "Death Ballad",
    "Final Toccata",
    "Dance of Illusions",
    "Blood Relations"
  ]

  function displayRandomSplashText(seasonalEvent) {
    if (!seasonalEvent.toolSplashPhrases) return;
    const splashPhrases = seasonalEvent.toolSplashPhrases;
    const randomSplashIndex = Math.floor(Math.random() * splashPhrases.length);
    const randomText = splashPhrases[randomSplashIndex];
    document.getElementById("splashTextDisplay").textContent = randomText;
  }

  var paletteSelect = document.querySelector('#alucardPalette');
  var linerSelect = document.querySelector('#alucardLiner');
  var paletteDisplay = document.querySelector('#alucardPaletteDisplay');
  var linerDisplay = document.querySelector('#alucardLinerDisplay');
  var mapColorSelect = document.querySelector('#mapColor')
  var mapColorDisplay = document.querySelector('#mapColorDisplay')

  const safe = presets.filter(function (preset) {
    return preset.id === 'safe'
  }).pop()

  function cloneItems(items) {                                                              //Saves previous selections
    return items.map(function (item) {
      const clone = Object.assign({}, item)
      delete clone.tiles
      if (item.tiles) {
        clone.tiles = item.tiles.slice()
      }
      return clone
    })
  }

  async function doApiRequest(reqPath, method, body) {
    let data = null;
    try {
      const response = await fetch(`${apiUrl}${reqPath}`, {
        method: method,
        headers: {
          "Content-Type": "application/json" // Specify that you're sending JSON data
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        console.log(`Error reaching path ${path}.`)
      }
      data = await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return data;
  }

  const items = cloneItems(sotnRando.items)

  function workerCount() {
    const cores = navigator.hardwareConcurrency
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    if (isFirefox) {
      return Math.max(Math.floor(cores / 2), 1)
    }
    return util.workerCountFromCores(cores)
  }

  function createWorkers(count) {
    const workers = Array(count)
    const url = new URL(window.location.href)
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

  function getUrl() {
    const url = new URL(window.location.href)
    if (url.protocol === 'file:') {
      return 'file://'
        + window.location.pathname.split('/').slice(0, -1).join('/') + '/'
    } else {
      return window.location.protocol + '//' + window.location.host + '/'
    }
  }

  function disableDownload() {
    downloadReady = false
    delete elems.download.download
    delete elems.download.href
  }

  function hideLoader() {
    elems.loader.classList.add('hide')
  }

  function showLoader() {
    elems.loader.classList.remove('hide')
  }

  function resetState() {
    sotnRando.items = cloneItems(items)
    selectedFile = undefined
    resetTarget()
    elems.randomize.disabled = true
    disableDownload()
    hideLoader()
  }

  function resetTarget(showFileName) {
    if (selectedFile) {
      let status = 'Ready to randomize'
      if (showFileName) {
        status += ' ' + selectedFile.name
      }
      elems.target.classList.add('active')
      elems.status.innerText = status
      elems.randomize.disabled = false
    } else {
      elems.target.classList.remove('active')
      elems.status.innerText = 'Drop .bin file here or'
    }
  }

  function resetCopy() {
    if (elems.seed.value.length || (currSeed && currSeed.length)) {
      elems.copy.disabled = false
    } else {
      elems.copy.disabled = true
    }
  }

  function outputChange(event) {
    if (elems.output.ppf.checked) {
      elems.target.classList.add('hide')
      localStorage.setItem('output', 'ppf')
      elems.randomize.disabled = false
    } else {
      elems.target.classList.remove('hide')
      elems.target.classList.remove('hidden')
      localStorage.setItem('output', 'bin')
      elems.randomize.disabled = true
    }
    if (event) {
      elems.target.classList.add('animate')
    }
  }

  function seedChange() {
    disableDownload()
    elems.copy.disabled = true
    haveChecksum = false
  }

  function presetChange(event) {                                                    //Disables options if presets is checked.
    elems.presetSelect.classList.remove('hide')
    elems.presetDetails.classList.remove('hide')
    presetIdChange()

    if (event) {
      elems.options.classList.add('animate')
    }
  }

  function updateAlucardPreview() {
    // Fix liner Y position
    linerDisplay.style.backgroundPositionY = "64px";
    // Calculate current position based on the selected options
    var paletteIndex = paletteSelect.selectedIndex;
    var linerIndex = linerSelect.selectedIndex;
    paletteDisplay.style.backgroundPositionX = (864 - (paletteIndex * 96)) + "px";
    linerDisplay.style.backgroundPositionX = (768 - (linerIndex * 96)) + "px";
  };

  updateAlucardPreview();

  paletteSelect.onchange = updateAlucardPreview;
  linerSelect.onchange = updateAlucardPreview;

  window.onload = function () {
    if (paletteSelect.value || linerSelect.value) {
      updateAlucardPreview();
    }
  };



  function updateMapColorPreview() {
    // Calculate current position based on the selected options
    var mapColorIndex = mapColorSelect.selectedIndex;
    mapColorDisplay.style.backgroundPositionX = (432 - (mapColorIndex * 48)) + "px";
  };

  mapColorSelect.onclick = function () {
    updateMapColorPreview();
  }

  window.onload = function () {
    if (mapColorSelect.value) {
      updateMapColorPreview();
    }
  }
  
  function presetIdChange() {
    // Refactored for ease of alteration and maintainability -crazy4blades
    const BH_COMPAT = new Set([
      "bounty-hunter", "target-confirmed", "hitman", "chaos-lite", "rampage"
    ]);
    const BOSS_COMPAT = new Set([
      "casual", "safe", "adventure", "og", "guarded-og", "sequence-breaker", "lycanthrope", "warlock", "nimble",
      "expedition", "bat-master", "glitch", "scavenger", "empty-hand", "third-castle", "magic-mirror", "leg-day",
      "big-toss", "grand-tour", "crash-course", "any-percent", "lookingglass", "skinwalker", "summoner", "safe-stwo",
      "open", "brawler", "lucky-sevens", "sight-seer", "cursed-night", "spellbound", "mobility", "glitchmaster",
      "dog-life", "battle-mage", "timeline", "chimera", "vanilla", "all-bosses", "rampage", "nimble-lite", "oracle",
      "boss-reflector", "cornivus", "mirror-breaker"
    ]);
    const RELIC_COMPAT = new Set([
      "casual", "safe", "adventure", "og", "guarded-og", "sequence-breaker", "lycanthrope", "warlock", "nimble",
      "expedition", "bat-master", "scavenger", "empty-hand", "gem-farmer", "third-castle", "rat-race", "magic-mirror",
      "bounty-hunter", "target-confirmed", "hitman", "beyond", "grand-tour", "crash-course", "lookingglass", "skinwalker",
      "summoner", "agonize-twtw", "safe-stwo", "open", "lucky-sevens", "sight-seer", "cursed-night", "spellbound",
      "mobility", "timeline", "chimera", "vanilla", "nimble-lite", "all-bosses", "cornivus", "mirror-breaker"
    ]);

    const ALL_TOGGLES = [
      "antiFreezeMode", "startRoomRando2ndMode", "relicLocations", "relicLocationsSet", "startRoomRandoMode",
      "unlockedMode", "enemyStatRandoMode", "elemChaosMode", "rlbcMode", "godspeedMode", "dominoMode"
    ];

    const DISABLE_RULES = [
      { ids: ["glitch", "glitchmaster", "any-percent"], elems: ["antiFreezeMode"] },
      { ids: ["dog-life", "magic-mirror", "mobility", "lookingglass", "boss-rush", "beyond", "first-castle"], elems: ["startRoomRando2ndMode"] },
      { ids: ["boss-rush", "first-castle"], elems: ["relicLocations", "relicLocationsSet"] },
      { ids: ["boss-rush", "beyond"], elems: ["startRoomRandoMode"] },
      { ids: ["boss-rush"], elems: ["unlockedMode"] },
      { ids: ["big-toss"], elems: ["enemyStatRandoMode", "elemChaosMode"] },
      { ids: ["boss-rush", "first-castle", "beyond", "seeker", "recycler"], elems: ["rlbcMode"] },
      { ids: ["battle-mage"], elems: ["godspeedMode"] },
      { ids: ["bounty-hunter", "target-confirmed", "hitman", "chaos-lite", "rampage", "oracle"], elems: ["dominoMode"] }
    ];

    const BH_GOAL_PRESETS = {
      bhNorm: new Set(["bounty-hunter", "chaos-lite"]),
      bhAdvanced: new Set(["target-confirmed"]),
      bhHitman: new Set(["hitman"]),
      bhBoss: new Set(["rampage"])
    };
    const GOAL_PRESETS = {
      allBoss: new Set(["all-bosses", "mirror-breaker"]),
      vladBoss: new Set(["boss-reflector", "cornivus"])
    };

    const enableAll = () => {
      for (const key of ALL_TOGGLES) {
        const el = elems[key];
        if (!el) continue;
        el.disabled = false;
      }
    };

    const computeGoal = (presetId) => {
      for (const [goal, set] of Object.entries(BH_GOAL_PRESETS)) {
        if (set.has(presetId)) return goal;
      }
      for (const [goal, set] of Object.entries(GOAL_PRESETS)) {
        if (set.has(presetId)) return goal;
      }
      return "default";
    };

    const validateGoal = (presetId, goal) => {
      const isBossGoal = goal === "allBoss" || goal === "abrsr" || goal === "vladBoss";
      const isRelicGoal = goal === "allRelic" || goal === "abrsr";
      const isBhGoal = goal === "bhNorm" || goal === "bhAdvanced" || goal === "bhBoss" || goal === "bhHitman";

      if (isBossGoal && !BOSS_COMPAT.has(presetId)) return "default";
      if (isRelicGoal && !RELIC_COMPAT.has(presetId)) return "default";
      if (isBhGoal && !BH_COMPAT.has(presetId)) return "default";
      return goal;
    };

    let idx = elems.presetId.selectedIndex;
    if (idx < 0) idx = 0;

    const id = elems.presetId.options ? elems.presetId.options[idx].value : elems.presetId.childNodes[idx].value;
    const preset = presets.find(p => p.id === id) || presets[0];

    // Metadata
    elems.presetDescription.innerText = preset.description;
    elems.presetAuthor.innerText = preset.author;
    elems.presetKnowledgeCheck.innerText = preset.knowledgeCheck;
    elems.presetExtension.innerText = preset.metaExtension;
    elems.presetComplexity.innerText = preset.metaComplexity;
    elems.presetItemStats.innerText = preset.itemStats;
    elems.presetTimeFrame.innerText = preset.timeFrame;
    elems.presetModdedLevel.innerText = preset.moddedLevel;
    elems.presetCastleType.innerText = preset.castleType;
    elems.presetTransformEarly.innerText = preset.transformEarly;
    elems.presetTransformFocus.innerText = preset.transformFocus;
    elems.presetWinCondition.innerText = preset.winCondition;

    localStorage.setItem("presetId", preset.id);

    enableAll();

    let goal = computeGoal(preset.id);
    goal = validateGoal(preset.id, goal);
    elems.newGoals.value = goal;

    localStorage.setItem("newGoals", elems.newGoals.value);
    newGoalsLock = elems.newGoals.value;

    const options = preset.options();
    let complexity = Object.keys(options.relicLocations || {}).reduce((acc, key) => {
      return /^[0-9]+(-[0-9]+)?/.test(key) ? key.split("-").shift() : acc;
    }, 1);

    relicLocationsExtensionCache = options.relicLocations && options.relicLocations.extension;
    adjustMaxComplexity();

    // Unified logic with disable options merged -crazy4blades
    const applyOptions = (options = {}, presetId) => {
      elems.complexity.value = complexity;
      elems.complexityCurrentValue.innerText = `(${complexity})`;

      const setCheckDisable = (key, condition) => {
        const el = elems[key];
        if (!el) return;
        el.checked = !!condition;
        el.disabled = condition != null && typeof condition === "object";
      };

      setCheckDisable("enemyDrops", options.enemyDrops);
      setCheckDisable("startingEquipment", options.startingEquipment);
      setCheckDisable("itemLocations", options.itemLocations);
      setCheckDisable("prologueRewards", options.prologueRewards);

      elems.relicLocations.checked = !!options.relicLocations;

      const ext = options.relicLocations?.extension;
      const extSet = elems.relicLocationsExtension;
      if (extSet) {
        extSet.guarded.checked = ext === constants.EXTENSION.GUARDED;
        extSet.guardedplus.checked = ext === constants.EXTENSION.GUARDEDPLUS;
        extSet.equipment.checked = ext === constants.EXTENSION.EQUIPMENT;
        extSet.scenic.checked = ext === constants.EXTENSION.SCENIC;
        extSet.extended.checked = ext === constants.EXTENSION.EXTENDED;
        extSet.classic.checked = !ext;
      }

      const allKeys = [
        "stats", "music", "turkeyMode", "magicmaxMode", "colorrandoMode",
        "antiFreezeMode", "mypurseMode", "iwsMode", "fastwarpMode",
        "itemNameRandoMode", "noprologueMode", "unlockedMode", "surpriseMode",
        "enemyStatRandoMode", "shopPriceRandoMode", "startRoomRandoMode",
        "startRoomRando2ndMode", "dominoMode", "rlbcMode", "immunityPotionMode",
        "godspeedMode", "libraryShortcut", "elemChaosMode", "simpleInputMode",
        "devStashMode", "bossMusicSeparation"
      ];
      // Options you don't want to get disabled -crazy4blades
      const keysToRemove = ["music", "bossMusicSeparation"];
      // Array of the options that will get disabled if checked -crazy4blades
      const filteredKeys = allKeys.filter(key => !keysToRemove.includes(key));

      filteredKeys.forEach(key => {
        const el = elems[key];
        if (!el) return;
        el.checked = !!options[key];
        if (key === "itemNameRandoMode" && elems.stats?.checked) {
          el.disabled = false;
        } else {
          el.disabled = !!options[key];
        }
      });

      // Disables the options based on compatability -crazy4blades
      DISABLE_RULES.forEach(rule => {
        if (rule.ids.includes(presetId)) {
          rule.elems.forEach(key => {
            const el = elems[key];
            if (!el) {
              console.warn(`Element not found for key '${key}'`);
            } else {
              // Preserve checked state if already checked
              const wasChecked = el.checked;
              el.disabled = true;
              el.checked = wasChecked;
            }
          });
        }
      });
    };

    // Apply the unified logic
    applyOptions(options, preset.id);
  }

  function complexityChange() {
    localStorage.setItem('complexity', elems.complexity.value);
    elems.complexityCurrentValue.innerText = `(${elems.complexity.value})`;
  }

  function updateCurrentComplexityValue() {
    elems.complexityCurrentValue.innerText = `(${elems.complexity.value})`;
  }

  function startingEquipmentChange() {
    localStorage.setItem('startingEquipment', elems.startingEquipment.checked)
  }

  function itemLocationsChange() {
    localStorage.setItem('itemLocations', elems.itemLocations.checked)
  }

  function enemyDropsChange() {
    localStorage.setItem('enemyDrops', elems.enemyDrops.checked)
  }

  function prologueRewardsChange() {
    localStorage.setItem('prologueRewards', elems.prologueRewards.checked)
  }

  let relicLocationsExtensionCache

  function relicLocationsChange() {
    localStorage.setItem('relicLocations', elems.relicLocations.checked)
    if (!elems.relicLocations.checked) {
      elems.relicLocationsSet.disabled = true
      elems.relicLocationsExtension.guarded.checked = false
      elems.relicLocationsExtension.guardedplus.checked = false
      elems.relicLocationsExtension.equipment.checked = false
      elems.relicLocationsExtension.scenic.checked = false
      elems.relicLocationsExtension.extended.checked = false
      elems.relicLocationsExtension.classic.checked = false
    } else {
      elems.relicLocationsSet.disabled = false
      elems.relicLocationsExtension.guarded.checked =
        relicLocationsExtensionCache === constants.EXTENSION.GUARDED
      elems.relicLocationsExtension.guardedplus.checked =
        relicLocationsExtensionCache === constants.EXTENSION.GUARDEDPLUS
      elems.relicLocationsExtension.equipment.checked =
        relicLocationsExtensionCache === constants.EXTENSION.EQUIPMENT
      elems.relicLocationsExtension.scenic.checked =
        relicLocationsExtensionCache === constants.EXTENSION.SCENIC
      elems.relicLocationsExtension.extended.checked =
        relicLocationsExtensionCache === constants.EXTENSION.EXTENDED
      elems.relicLocationsExtension.classic.checked =
        !relicLocationsExtensionCache
    }
  }

  function generateComplexityDataListItems(maxValue) {
    for (let i = 2; i <= maxValue; i++) {
      const node = document.createElement('option');
      node.value = i;
      node.label = i;
      elems.complexityDataList.append(node);
    }
  }

  function adjustMaxComplexity() {
    switch (relicLocationsExtensionCache) {
      case constants.EXTENSION.EQUIPMENT:
      case constants.EXTENSION.SCENIC:
        elems.complexity.max = 15
        generateComplexityDataListItems(15);
        elems.complexityMaxValue.innerText = 15;
        break
      case constants.EXTENSION.GUARDED:
      case constants.EXTENSION.GUARDEDPLUS:
      case constants.EXTENSION.EXTENDED:
      default:
        elems.complexity.max = 11;
        generateComplexityDataListItems(11);
        elems.complexityMaxValue.innerText = 11;
        break
    }
    if (parseInt(elems.complexity.value) > parseInt(elems.complexity.max)) {
      elems.complexity.value = elems.complexity.max
    }
  }

  function relicLocationsExtensionChange() {
    let value
    if (elems.relicLocationsExtension.guarded.checked) {
      value = constants.EXTENSION.GUARDED
    } else if (elems.relicLocationsExtension.guardedplus.checked) {
      value = constants.EXTENSION.GUARDEDPLUS
    } else if (elems.relicLocationsExtension.equipment.checked) {
      value = constants.EXTENSION.EQUIPMENT
    } else if (elems.relicLocationsExtension.scenic.checked) {
      value = constants.EXTENSION.SCENIC
    } else if (elems.relicLocationsExtension.extended.checked) {
      value = constants.EXTENSION.EXTENDED
    } else {
      value = false
    }
    relicLocationsExtensionCache = value
    adjustMaxComplexity()
    complexityChange();
    localStorage.setItem('relicLocationsExtension', value)
  }

  function statsChange() {
    if (elems.stats.checked) {
      elems.itemNameRandoMode.disabled = false
    } else {
      elems.itemNameRandoMode.checked = false
      elems.itemNameRandoMode.disabled = true
    }
    localStorage.setItem('stats', elems.stats.checked)
  }

  function musicChange() {
    localStorage.setItem('music', elems.music.checked)
  }

  function turkeyModeChange() {
    localStorage.setItem('turkeyMode', elems.turkeyMode.checked)
  }

  function themeChange() {
    localStorage.setItem('theme', elems.theme.value)
    {
      ['menu', 'light', 'dark'].forEach(function (theme) {
        if (theme === elems.theme.value) {
          body.classList.add(theme)
        } else {
          body.classList.remove(theme)
        }
      })
    }
  }

  function mapColorChange() {
    localStorage.setItem('mapColor', elems.mapColor.value)
    mapColorLock = elems.mapColor.value
  }

  function newGoalsChange() {
    let bhCompatible = [
      "bounty-hunter",
      "target-confirmed",
      "hitman",
      "chaos-lite",
      "rampage"
    ]
    let bossCompatible = [
      "casual",
      "safe",
      "adventure",
      "og",
      "guarded-og",
      "sequence-breaker",
      "lycanthrope",
      "warlock",
      "nimble",
      "expedition",
      "bat-master",
      "glitch",
      "scavenger",
      "empty-hand",
      "third-castle",
      "magic-mirror",
      "leg-day",
      "big-toss",
      "grand-tour",
      "crash-course",
      "any-percent",
      "lookingglass",
      "skinwalker",
      "summoner",
      "safe-stwo",
      "open",
      "brawler",
      "lucky-sevens",
      "sight-seer",
      "cursed-night",
      "spellbound",
      "mobility",
      "glitchmaster",
      "dog-life",
      "battle-mage",
      "timeline",
      "chimera",
      "vanilla",
      "all-bosses",
      "rampage",
      "nimble-lite",
      "oracle",
      "boss-reflector",
      "cornivus",
      "mirror-breaker"
    ]
    let relicCompatible = [
      "casual",
      "safe",
      "adventure",
      "og",
      "guarded-og",
      "sequence-breaker",
      "lycanthrope",
      "warlock",
      "nimble",
      "expedition",
      "bat-master",
      "scavenger",
      "empty-hand",
      "gem-farmer",
      "third-castle",
      "rat-race",
      "magic-mirror",
      "bountyhunter",
      "bountyhuntertc",
      "hitman",
      "beyond",
      "grand-tour",
      "crash-course",
      "lookingglass",
      "skinwalker",
      "summoner",
      "agonize-twtw",
      "safe-stwo",
      "open",
      "lucky-sevens",
      "sight-seer",
      "cursed-night",
      "spellbound",
      "mobility",
      "timeline",
      "chimera",
      "vanilla",
      "nimble-lite",
      "all-bosses",
      "cornivus",
      "mirror-breaker"
    ]
    switch (elems.newGoals.value) {                                             // Adjusting newGoals drop-down based on selections - eldri7ch
      case "abrsr":                                                             // ABRSR (All Bosses and Relics) can't exist if not compatible with All Boss AND All Relics - eldri7ch
        if (!bossCompatible.includes(elems.presetId.value) || !relicCompatible.includes(elems.presetId.value)) {
          elems.newGoals.value = "default"
        }
        break
      case "vladBoss":                                                          // Very few presets remove Vlads as possibilities. No 'break' here because it also needs to check All Bosses - eldri7ch
        if (["oracle", "glitch", "glitchmaster", "any-percent"].includes(elems.presetId.value)) {
          elems.newGoals.value = "default"
        }
      case "allBoss":                                                           // Check against all bosses compatibility - eldri7ch
        if (!bossCompatible.includes(elems.presetId.value)) {
          elems.newGoals.value = "default"
        }
        break
      case "allRelic":                                                          // Check against all relics compatibility - eldri7ch
        if (!relicCompatible.includes(elems.presetId.value)) {
          elems.newGoals.value = "default"
        }
        break
      case "bhNorm":
      case "bhAdvanced":
      case "bhHitman":
      case "bhBoss":                                                            // Check against BH compatibility - eldri7ch
        if (!bhCompatible.includes(elems.presetId.value)) {
          elems.newGoals.value = "default"
        }
        break
      default:
    }
    // All BH presets need to match their respective coding. This is to prevent arbitrary additions of BH code to presets where vlads can spawn. - eldri7ch
    if (elems.newGoals.value !== "bhNorm") {                                    // Check against BH compatibility - eldri7ch
      if (["chaos-lite", "bounty-hunter"].includes(elems.presetId.value)) {
        elems.newGoals.value = "bhNorm"
      }
    }
    if (elems.newGoals.value !== "bhAdvanced") {                                // Check against Target Confirmed compatibility - eldri7ch
      if (["target-confirmed"].includes(elems.presetId.value)) {
        elems.newGoals.value = "bhAdvanced"
      }
    }
    if (elems.newGoals.value !== "bhHitman") {                                  // Check against Hitman compatibility - eldri7ch
      if (["hitman"].includes(elems.presetId.value)) {
        elems.newGoals.value = "bhHitman"
      }
    }
    if (elems.newGoals.value !== "bhBoss") {                                    // Check against BH + All Bosses compatibility - eldri7ch
      if (["rampage"].includes(elems.presetId.value)) {
        elems.newGoals.value = "bhBoss"
      }
    }
    if (elems.newGoals.value !== "allBoss") {                                   // Check against all Bosses compatibility (Right now this only checks All-Bosses Preset) - eldri7ch
      if (["all-bosses", "mirror-breaker"].includes(elems.presetId.value) && !["abrsr", "vladBoss"].includes(elems.newGoals.value)) {
        elems.newGoals.value = "allBoss"
      }
    }
    // if (elems.newGoals.value !== "abrsr") {                                  // Check against abrsr compatibility (No presets currently use this) - eldri7ch
    //   if (["rampage"].includes(elems.presetId.value)) {
    //     elems.newGoals.value = "abrsr"
    //   }
    // }
    if (elems.newGoals.value !== "vladBoss") {                                  // Check against all Bosses + all vlads compatibility - eldri7ch
      if (["boss-reflector", "cornivus"].includes(elems.presetId.value)) {
        elems.newGoals.value = "vladBoss"
      }
    }
    localStorage.setItem('newGoals', elems.newGoals.value)                      // Set local storage and the newGoalsLock - eldri7ch
    newGoalsLock = elems.newGoals.value
    // console.log(elems.presetId.value)
    // console.log('set new goals: ' + newGoalsLock)
  }

  function alucardPaletteChange() {
    localStorage.setItem('alucardPalette', elems.alucardPalette.value)
    alucardPaletteLock = elems.alucardPalette.value
  }

  function alucardLinerChange() {
    localStorage.setItem('alucardLiner', elems.alucardLiner.value)
    alucardLinerLock = elems.alucardLiner.value
  }

  function appendSeedChange() {
    localStorage.setItem('appendSeed', elems.appendSeed.checked)
  }

  function fileChange(event) {
    if (elems.file.files[0]) {
      resetState()
      selectedFile = elems.file.files[0]
      resetTarget()
      elems.target.classList.add('active')
    }
  }

  function tournamentModeChange() {
    if (elems.tournamentMode.checked) {
      elems.showRelics.checked = false
      elems.showRelics.disabled = true
      elems.showSolutions.checked = false
      elems.showSolutions.disabled = true
      elems.simpleInputMode.checked = false
      elems.simpleInputMode.disabled = true
    } else {
      elems.showRelics.disabled = false
      elems.simpleInputMode.disabled = false
    }
    localStorage.setItem('tournamentMode', elems.tournamentMode.checked)
  }

  function colorrandoModeChange() {
    localStorage.setItem('colorrandoMode', elems.colorrandoMode.checked)
  }

  function magicmaxModeChange() {
    localStorage.setItem('magicmaxMode', elems.magicmaxMode.checked)
  }

  function antiFreezeModeChange() {
    localStorage.setItem('antiFreezeMode', elems.antiFreezeMode.checked)
  }

  function mypurseModeChange() {
    localStorage.setItem('mypurseMode', elems.mypurseMode.checked)
  }

  function iwsModeChange() {
    localStorage.setItem('iwsMode', elems.iwsMode.checked)
  }

  function fastwarpModeChange() {
    localStorage.setItem('fastwarpMode', elems.fastwarpMode.checked)
  }

  function itemNameRandoModeChange() {
    if (elems.itemNameRandoMode.checked === true) {
      elems.stats.checked = true
    }
    localStorage.setItem('itemNameRandoMode', elems.itemNameRandoMode.checked)
  }

  function noprologueModeChange() {
    localStorage.setItem('noprologueMode', elems.noprologueMode.checked)
  }

  function unlockedModeChange() {
    localStorage.setItem('unlockedMode', elems.unlockedMode.checked)
  }

  function surpriseModeChange() {
    localStorage.setItem('surpriseMode', elems.surpriseMode.checked)
  }

  function enemyStatRandoModeChange() {
    if (elems.enemyStatRandoMode.checked) {
      elems.elemChaosMode.disabled = false
    } else {
      elems.elemChaosMode.checked = false
      elems.elemChaosMode.disabled = true
    }
    localStorage.setItem('enemyStatRandoMode', elems.enemyStatRandoMode.checked)
  }

  function shopPriceRandoModeChange() {
    localStorage.setItem('shopPriceRandoMode', elems.shopPriceRandoMode.checked)
  }

  function startRoomRandoModeChange() {
    localStorage.setItem('startRoomRandoMode', elems.startRoomRandoMode.checked)
  }

  function startRoomRando2ndModeChange() {
    localStorage.setItem('startRoomRando2ndMode', elems.startRoomRando2ndMode.checked)
  }

  function dominoModeChange() {
    localStorage.setItem('dominoMode', elems.dominoMode.checked)
  }

  function rlbcModeChange() {
    localStorage.setItem('rlbcMode', elems.rlbcMode.checked)
  }

  function immunityPotionModeChange() {
    localStorage.setItem('immunityPotionMode', elems.immunityPotionMode.checked)
  }

  function godspeedModeChange() {
    localStorage.setItem('godspeedMode', elems.godspeedMode.checked)
  }

  function libraryShortcutChange() {
    localStorage.setItem('libraryShortcut', elems.libraryShortcut.checked)
  }

  function elemChaosModeChange() {
    if (elems.elemChaosMode.checked === true) {
      elems.enemyStatRandoMode.checked = true
    }
    localStorage.setItem('elemChaosMode', elems.elemChaosMode.checked)
  }

  function simpleInputModeChange() {
    localStorage.setItem('simpleInputMode', elems.simpleInputMode.checked)
  }

  function devStashModeChange() {
    localStorage.setItem('devStashMode', elems.devStashMode.checked)
  }

  function seasonalPhrasesModeChange() {
    localStorage.setItem('seasonalPhrasesMode', elems.seasonalPhrasesMode.checked)
  }

  function bossMusicSeparationChange() {
    localStorage.setItem('bossMusicSeparation', elems.bossMusicSeparation.checked)
  }

  function accessibilityPatchesChange() {
    localStorage.setItem('accessibilityPatches', elems.accessibilityPatches.checked)
  }

  function spoilersChange() {
    if (elems.showSpoilers.checked) {
      showSpoilers()
      if (!elems.tournamentMode.checked) {
        elems.showRelics.disabled = false
      }
    } else {
      hideSpoilers()
      elems.showRelics.checked = false
      elems.showRelics.disabled = true
      elems.showSolutions.checked = false
      elems.showSolutions.disabled = true

    }
    localStorage.setItem('showSpoilers', elems.showSpoilers.checked)
  }

  function showRelicsChange() {
    if (elems.showRelics.checked) {
      elems.showSolutions.disabled = false
    } else {
      elems.showSolutions.checked = false
      elems.showSolutions.disabled = true
    }
    showSpoilers()
    localStorage.setItem('showRelics', elems.showRelics.checked)
  }

  function showSolutionsChange() {
    showSpoilers()
    localStorage.setItem('showSolutions', elems.showSolutions.checked)
  }

  function dragLeaveListener(event) {
    elems.target.classList.remove('active')
  }

  function dragOverListener(event) {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'copy'
    elems.target.classList.add('active')
  }

  function dropListener(event) {
    event.preventDefault()
    event.stopPropagation()
    resetState()
    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const item = event.dataTransfer.items[i]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          selectedFile = file
        }
      }
    } else {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i]
        selectedFile = file
      }
    }
    resetTarget(true)
    elems.file.style.display = 'none'
  }

  function randomizedFilename(filename, seed) {
    const lastPeriodIdx = filename.lastIndexOf('.')
    const insertIdx = lastPeriodIdx === -1 ? filename.length : lastPeriodIdx
    return [
      filename.slice(0, insertIdx),
      ' (' + seed + ')',
      filename.slice(insertIdx),
    ].join('')
  }

  function getFormRelicLocations() {
    if (!elems.relicLocations.checked) {
      return false
    }
    const selectedPreset = elems.presetId.childNodes[elems.presetId.selectedIndex].value
    let presetData = presets.filter(function (preset) {
      return preset.id === selectedPreset
    }).pop()
    const relicLocations = presetData.options().relicLocations;

    if (relicLocations) {
      // Add extension from form.
      if (elems.relicLocationsExtension.guarded.checked) {
        relicLocations.extension = constants.EXTENSION.GUARDED
      } else if (elems.relicLocationsExtension.guardedplus.checked) {
        relicLocations.extension = constants.EXTENSION.GUARDEDPLUS
      } else if (elems.relicLocationsExtension.equipment.checked) {
        relicLocations.extension = constants.EXTENSION.EQUIPMENT
      } else if (elems.relicLocationsExtension.scenic.checked) {
        relicLocations.extension = constants.EXTENSION.SCENIC
      } else if (elems.relicLocationsExtension.extended.checked) {
        relicLocations.extension = constants.EXTENSION.EXTENDED
      } else {
        delete relicLocations.extension
      }
      const extensions = []
      switch (relicLocations.extension) {
        case constants.EXTENSION.EXTENDED:
          extensions.push(constants.EXTENSION.EXTENDED)
          break
        case constants.EXTENSION.SCENIC:
          extensions.push(constants.EXTENSION.SCENIC)
        case constants.EXTENSION.EQUIPMENT:
          extensions.push(constants.EXTENSION.EQUIPMENT)
        case constants.EXTENSION.GUARDEDPLUS:
          extensions.push(constants.EXTENSION.GUARDEDPLUS)
        case constants.EXTENSION.GUARDED:
          extensions.push(constants.EXTENSION.GUARDED)
      }
      // Delete default complexity target.
      let goals
      Object.getOwnPropertyNames(relicLocations).forEach(function (key) {
        if (/^[0-9]+(-[0-9]+)?/.test(key)) {
          goals = relicLocations[key]
          delete relicLocations[key]
        } else {
          const location = extension.filter(function (location) {
            if (location.name === key) {
              if (extensions.indexOf(location.extension) === -1) {
                delete relicLocations[key]
              }
            }
          })
        }
      })
      // Add complexity target from form.
      relicLocations[elems.complexity.value] = goals
    }
    return relicLocations
  }

  function getFormOptions() {
    const options = {
      preset: presets[elems.presetId.selectedIndex].id
    }
    if (elems.tournamentMode.checked) {
      options.tournamentMode = true
    }
    if (elems.colorrandoMode.checked) {
      options.colorrandoMode = true
    }
    if (elems.magicmaxMode.checked) {
      options.magicmaxMode = true
    }
    if (elems.antiFreezeMode.checked) {
      options.antiFreezeMode = true
    }
    if (elems.mypurseMode.checked) {
      options.mypurseMode = true
    }
    if (elems.iwsMode.checked) {
      options.iwsMode = true
    }
    if (elems.fastwarpMode.checked) {
      options.fastwarpMode = true
    }
    if (elems.itemNameRandoMode.checked) {
      options.itemNameRandoMode = true
    }
    if (elems.noprologueMode.checked) {
      options.noprologueMode = true
    }
    if (elems.unlockedMode.checked) {
      options.unlockedMode = true
    }
    if (elems.surpriseMode.checked) {
      options.surpriseMode = true
    }
    if (elems.enemyStatRandoMode.checked) {
      options.enemyStatRandoMode = true
    }
    if (elems.shopPriceRandoMode.checked) {
      options.shopPriceRandoMode = true
    }
    if (elems.startRoomRandoMode.checked) {
      options.startRoomRandoMode = true
    }
    if (elems.startRoomRando2ndMode.checked) {
      options.startRoomRando2ndMode = true
    }
    if (elems.dominoMode.checked) {
      options.dominoMode = true
    }
    if (elems.rlbcMode.checked) {
      options.rlbcMode = true
    }
    if (elems.immunityPotionMode.checked) {
      options.immunityPotionMode = true
    }
    if (elems.godspeedMode.checked) {
      options.godspeedMode = true
    }
    if (elems.libraryShortcut.checked) {
      options.libraryShortcut = true
    }
    if (elems.elemChaosMode.checked) {
      options.elemChaosMode = true
    }
    if (elems.simpleInputMode.checked) {
      options.simpleInputMode = true
    }
    if (elems.devStashMode.checked) {
      options.devStashMode = true
    }
    if (elems.seasonalPhrasesMode.checked) {
      options.seasonalPhrasesMode = true
    }
    if (elems.bossMusicSeparation.checked) {
      options.bossMusicSeparation = true
    }
    if (elems.mapColor != 'normal') {
      switch (elems.mapColor.value) {
        case 'normal':
          break
        case 'blue':
          mapColorTheme = 'u'
          break
        case 'green':
          mapColorTheme = 'g'
          break
        case 'red':
          mapColorTheme = 'r'
          break
        case 'brown':
          mapColorTheme = 'n'
          break
        case 'purple':
          mapColorTheme = 'p'
          break
        case 'grey':
          mapColorTheme = 'y'
          break
        case 'pink':
          mapColorTheme = 'k'
          break
        case 'black':
          mapColorTheme = 'b'
          break
        case 'invis':
          mapColorTheme = 'i'
          break
        default:
          break
      }
    }
    if (elems.newGoals.value != 'default') {
      switch (elems.newGoals.value) {
        case 'allBoss':
          newGoalsSet = 'b'
          break
        case 'allRelic':
          newGoalsSet = 'r'
          break
        case 'abrsr':
          newGoalsSet = 'a'
          break
        case 'vladBoss':
          newGoalsSet = 'v'
          break
        case 'bhNorm':
          newGoalsSet = 'h'
          break
        case 'bhAdvanced':
          newGoalsSet = 't'
          break
        case 'bhHitman':
          newGoalsSet = 'w'
          break
        case 'bhBoss':
          newGoalsSet = 'x'
          break
        default:
          break
      }
    }
    if (elems.alucardPalette != 'default') {
      switch (elems.alucardPalette.value) {
        case 'default':
          break
        case 'bloodytears':
          alucardPaletteSet = 'r'
          break
        case 'bluedanube':
          alucardPaletteSet = 'b'
          break
        case 'mint':
          alucardPaletteSet = 'm'
          break
        case 'swampthing':
          alucardPaletteSet = 'g'
          break
        case 'whiteknight':
          alucardPaletteSet = 'w'
          break
        case 'royalpurple':
          alucardPaletteSet = 'l'
          break
        case 'pinkpassion':
          alucardPaletteSet = 'p'
          break
        case 'shadowp':
          alucardPaletteSet = 's'
          break

      }

    }
    if (elems.alucardLiner != 'default') {
      switch (elems.alucardLiner.value) {
        case 'gold':
          alucardLinerSet = 'z'
          break
        case 'bronze':
          alucardLinerSet = 'x'
          break
        case 'silver':
          alucardLinerSet = 'y'
          break
        case 'onyx':
          alucardLinerSet = 'w'
          break
        case 'coral':
          alucardLinerSet = 'v'
          break
      }
    }
    options.relicLocations = getFormRelicLocations();
    return options
  }

  function generateSeedName() {
    let adjectives = [];
    let nouns = [];

    let month = new Date().getMonth() + 1;

    switch (month) {
      case 10:
        adjectives = constants.adjectivesHalloween;
        nouns = constants.nounsHalloween;
        break;
      case 12:
        adjectives = constants.adjectivesHolidays;
        nouns = constants.nounsNormal;
        break;

      default:
        adjectives = constants.adjectivesNormal;
        nouns = constants.nounsNormal;
        break;
    }

    let adjective = adjectives[Math.floor(Math.random() * Math.floor(adjectives.length - 1))];
    let noun = nouns[Math.floor(Math.random() * Math.floor(nouns.length - 1))];
    let number = Math.floor(Math.random() * 999);
    if (number % 100 === 69) {
      number = '69Nice';
    }

    let suffix = '';

    let seedName = adjective + noun + number + suffix;

    return seedName;
  }

  function deleteOriginalComplexity(options, newComplexity) {
    let relicLocations = options.relicLocations;
    Object.getOwnPropertyNames(relicLocations).forEach(function (key) {
      if (/^[0-9]+(-[0-9]+)?/.test(key)) {
        if (key !== newComplexity) {
          goals = relicLocations[key]
          delete relicLocations[key]
        }
      }
    })
  }

  function submitListener(event) {
    // Get seed.
    let selectedPreset = null
    if (isAprilFools) {
      elems.presetId.value = "april-fools";
      presetIdChange();
    }

    selectedPreset = elems.presetId.childNodes[elems.presetId.selectedIndex].value
    self.sotnRando.selectedPreset = selectedPreset


    event.preventDefault()
    event.stopPropagation()
    // Disable UI.
    disableDownload()
    // Show loading bar.
    showLoader()
    // Create new info collection.
    info = util.newInfo()

    let seed = generateSeedName()
    if (elems.seed.value.length) {
      seed = elems.seed.value
    }
    currSeed = seed
    info[1]['Seed'] = seed
    // Get options.
    const options = getFormOptions()
    // Check for overriding preset.
    let applied
    let override
    for (let preset of presets) {
      if (preset.override) {
        applied = preset.options()
        override = true
        break
      }
    }
    // Get user specified options.
    if (!override) {
      applied = util.Preset.options(options)
    }
    if (elems.complexity.value) {
      deleteOriginalComplexity(applied, elems.complexity.value);
    }
    function handleError(err) {
      if (!errors.isError(err)) {
        console.error(err)
      }
      elems.target.classList.remove('active')
      elems.target.classList.add('error')
      elems.status.innerText = err.message
    }
    function restoreItems() {
      sotnRando.items = cloneItems(items)
    }
    function randomize() {                                                                        // This is the main function of the randomizer website
      const check = new util.checked(this.result)
      // Save handle to file data.
      const file = this.result
      const threads = workerCount()
      const start = new Date().getTime()
      // Randomize stats.
      const rng = new Math.seedrandom(util.saltSeed(
        version,
        options,
        seed,
        0,
      ))
      applied.stats = elems.stats.checked

      if (applied.startingEquipment == null || typeof (applied.startingEquipment) != 'object') {
        applied.startingEquipment = elems.startingEquipment.checked
      }
      if (applied.prologueRewards == null || typeof (applied.prologueRewards) != 'object') {
        applied.prologueRewards = elems.prologueRewards.checked
      }
      if (applied.itemLocations == null || typeof (applied.itemLocations) != 'object') {
        applied.itemLocations = elems.itemLocations.checked
      }
      if (applied.enemyDrops == null || typeof (applied.enemyDrops) != 'object') {
        applied.enemyDrops = elems.enemyDrops.checked
      }
      applied.music = elems.music.checked
      applied.turkeyMode = elems.turkeyMode.checked
      const result = randomizeStats(rng, applied)
      const newNames = result.newNames
      check.apply(result.data)
      // Randomize relics.
      let selectedPreset = null
      selectedPreset = elems.presetId.childNodes[elems.presetId.selectedIndex].value
      util.selectedPreset = selectedPreset

      return util.randomizeRelics(
        version,
        applied,
        options,
        seed,
        newNames,
        createWorkers(threads),
        4,
        getUrl(),
      ).then(function (result) {
        util.mergeInfo(info, result.info)
        const rng = new Math.seedrandom(util.saltSeed(
          version,
          options,
          seed,
          1,
        ))
        result = randomizeRelics.writeRelics(
          rng,
          applied,
          result,
          newNames,
        )
        check.apply(result.data)
        return util.randomizeItems(
          version,
          applied,
          options,
          seed,
          createWorkers(1)[0],
          2,
          result.items,
          newNames,
          getUrl(),
        )
      }).then(function (result) {
        check.apply(result.data)
        util.mergeInfo(info, result.info)
        const rng = new Math.seedrandom(util.saltSeed(
          version,
          options,
          seed,
          3,
        ))
        if (elems.excludeSongsOption.checked) {
          applied.excludesongs = Array.from(elems.excludeList.options).map(option => option.value);
        }
        check.apply(randomizeMusic(rng, applied))
        // Initiate the write options function master
        let optWrite = 0x00000000                   // This variable lets the ASM used in the Master Function know if it needs to run certain code or sets flags for the tracker to use
        let nGoal                                                                           //begin the newGoals flag setting for the function master
        let elementSet = elems.newGoals.value
        // console.log('elem set ' + elementSet + '; opt ' + options.newGoals + '; appl ' + applied.newGoals)
        if (elementSet !== "default" || options.newGoals || applied.newGoals) {   // Sets flag for the tracker to know which goals to use
          if (elementSet !== "default") {
            switch (elementSet) {
              case "allBoss":                         // all bosses flag
                nGoal = "b"
                break
              case "allRelic":                        // all relics flag
                nGoal = "r"
                break
              case "abrsr":                           //  all bosses and relics flag
                nGoal = "a"
                break
              case "vladBoss":                        //  all bosses and vlads flag
                nGoal = "v"
                break
              case "bhNorm":                          //  Bounty Hunter flag
                nGoal = "h"
                break
              case "bhAdvanced":                      //  Target Confirmed flag
                nGoal = "t"
                break
              case "bhHitman":                        //  Hitman flag
                nGoal = "w"
                break
              case "bhBoss":                          //  all bosses and BH flag
                nGoal = "x"
                break
            }
          } else if (options.newGoals !== undefined) {
            nGoal = options.newGoals
          } else if (applied.newGoals !== undefined) {
            nGoal = applied.newGoals
          }
          switch (nGoal) {
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
              optWrite = optWrite + 0x00
          }
        }
        // Apply godspeed shoes patches.
        // console.log('godspeed option: ' + options.godspeedMode + '; godspeed applied: ' + applied.godspeedMode)
        if (options.godspeedMode || applied.godspeedMode) {
          // console.log('godspeed enabled')
          optWrite = optWrite + 0x80000000
        }
        check.apply(util.randoFuncMaster(optWrite))

        // console.log('Seasonal mode ' + elems.seasonalPhrasesMode.checked)
        check.apply(util.applySplashText(rng, elems.seasonalPhrasesMode.checked))

        // Apply tournament mode patches.
        if (options.tournamentMode) {
          check.apply(util.applyTournamentModePatches())
        }
        // Apply magic max patches.
        if (options.magicmaxMode || applied.magicmaxMode) {
          check.apply(util.applyMagicMaxPatches())
        }
        // Apply anti-freeze patches.
        if (options.antiFreezeMode || applied.antiFreezeMode) {
          check.apply(util.applyAntiFreezePatches())
        }
        // Apply my purse patches.
        if (options.mypurseMode || applied.mypurseMode) {
          check.apply(util.applyMyPursePatches())
        }
        // Apply iws patches.
        if (options.iwsMode || applied.iwsMode) {
          check.apply(util.applyiwsPatches())
        }
        // Apply fast warp patches.
        if (options.fastwarpMode || applied.fastwarpMode) {
          check.apply(util.applyfastwarpPatches())
        }
        // Apply no prologue patches.
        if (options.noprologueMode || applied.noprologueMode) {
          check.apply(util.applynoprologuePatches())
        }
        // Apply unlocked patches.
        if (options.unlockedMode || applied.unlockedMode) {
          check.apply(util.applyunlockedPatches())
        }
        // Apply surprise patches.
        if (options.surpriseMode || applied.surpriseMode) {
          check.apply(util.applysurprisePatches())
        }
        // Apply enemy stat rando patches.
        if (options.enemyStatRandoMode || applied.enemyStatRandoMode) {
          let chaosFlag = false
          if (options.elemChaosMode || applied.elemChaosMode) {
            chaosFlag = true
          }
          check.apply(util.applyenemyStatRandoPatches(rng, chaosFlag))
        }
        // Apply shop price rando patches.
        if (options.shopPriceRandoMode || applied.shopPriceRandoMode) {
          check.apply(util.applyShopPriceRandoPatches(rng))
        }
        // Apply starting room rando patches.
        if (options.startRoomRandoMode || applied.startRoomRandoMode || options.startRoomRando2ndMode || applied.startRoomRando2ndMode) {
          let castleFlag = 0x00
          if (options.startRoomRandoMode || applied.startRoomRandoMode) {
            castleFlag = castleFlag + 0x01
          }
          if (options.startRoomRando2ndMode || applied.startRoomRando2ndMode) {
            castleFlag = castleFlag + 0x10
          }
          check.apply(util.applyStartRoomRandoPatches(rng, castleFlag))
        }
        // Apply guaranteed drop patches.
        if (options.dominoMode || applied.dominoMode) {
          check.apply(util.applyDominoPatches(rng))
        }
        // Apply reverse library card patches.
        if (options.rlbcMode || applied.rlbcMode) {
          check.apply(util.applyRLBCPatches())
        }
        // Apply Resist potion patches. todo: Give own toggle option.
        if (options.immunityPotionMode || applied.immunityPotionMode) {
          check.apply(util.applyResistToImmunePotionsPatches())
        }
        // Apply library shortcut patches.
        if (options.libraryShortcut || applied.libraryShortcut) {
          check.apply(util.applyLibraryShortcutPatches())
        }
        // Apply elemental chaos patches.
        if (options.elemChaosMode || applied.elemChaosMode) {
          check.apply(util.applyElemChaosPatches(rng))
        }
        // Apply simple input patches.
        if (options.simpleInputMode || applied.simpleInputMode) {
          check.apply(util.applySimpleInputPatches())
        }
        // Apply dev stash patches.
        if (options.devStashMode || applied.devStashMode) {
          check.apply(util.applyDevsStashPatches())
        }
        // No patches to apply for Boss Music Separator
        if (options.bossMusicSeparation || applied.bossMusicSeparation) {
        }
        // Apply map color patches.
        if (mapColorLock != 'normal') {
          switch (mapColorLock) {
            case 'normal':
              break
            case 'blue':
              mapcol = 'u'
              check.apply(util.applyMapColor(mapcol))
              break
            case 'green':
              mapcol = 'g'
              check.apply(util.applyMapColor(mapcol))
              break
            case 'red':
              mapcol = 'r'
              check.apply(util.applyMapColor(mapcol))
              break
            case 'brown':
              mapcol = 'n'
              check.apply(util.applyMapColor(mapcol))
              break
            case 'purple':
              mapcol = 'p'
              check.apply(util.applyMapColor(mapcol))
              break
            case 'grey':
              mapcol = 'y'
              check.apply(util.applyMapColor(mapcol))
              break
            case 'pink':
              mapcol = 'k'
              check.apply(util.applyMapColor(mapcol))
              break
            case 'black':
              mapcol = 'b'
              check.apply(util.applyMapColor(mapcol))
              break
            case 'invis':
              mapcol = 'i'
              check.apply(util.applyMapColor(mapcol))
              break
            default:
              break
          }
        }
        // Apply new goals patches.
        if (newGoalsLock != 'default') {
          switch (newGoalsLock) {
            case 'default':
              break
            case 'allBoss':
              nGoal = 'b'
              check.apply(util.applyNewGoals(nGoal))
              break
            case 'allRelic':
              nGoal = 'r'
              check.apply(util.applyNewGoals(nGoal))
              break
            case 'abrsr':
              nGoal = 'a'
              check.apply(util.applyNewGoals(nGoal))
              break
            case 'vladBoss':
              nGoal = 'v'
              check.apply(util.applyNewGoals(nGoal))
              break
            case 'bhNorm':
              check.apply(util.applyBountyHunterTargets(rng, 0))                 // 0 = normal Bounty Hunter; 1 = buffed drop rates and guaranteed relics after card obtained
              break
            case 'bhAdvanced':
              check.apply(util.applyBountyHunterTargets(rng, 2))                 // 0 = normal Bounty Hunter; 1 = buffed drop rates and guaranteed relics after card obtained
              break
            case "bhHitman":
              check.apply(util.applyBountyHunterTargets(rng, 1))                 // 0 = normal Bounty Hunter; 1 = buffed drop rates and guaranteed relics after card obtained
              break
            case 'bhBoss':
              nGoal = 'v'
              check.apply(util.applyNewGoals(nGoal))
              check.apply(util.applyBountyHunterTargets(rng, 2))                 // 0 = normal Bounty Hunter; 1 = buffed drop rates and guaranteed relics after card obtained
              break
            default:
              break
          }
        }
        // Apply Alucard's palette.
        if (alucardPaletteLock != 'default') {
          switch (alucardPaletteLock) {
            case 'default':
              break
            case 'bloodytears':
              alColP = 'r'
              check.apply(util.applyAlucardPalette(alColP))
              break
            case 'bluedanube':
              alColP = 'b'
              check.apply(util.applyAlucardPalette(alColP))
              break
            case 'mint':
              alColP = 'm'
              check.apply(util.applyAlucardPalette(alColP))
              break
            case 'swampthing':
              alColP = 'g'
              check.apply(util.applyAlucardPalette(alColP))
              break
            case 'whiteknight':
              alColP = 'w'
              check.apply(util.applyAlucardPalette(alColP))
              break
            case 'royalpurple':
              alColP = 'l'
              check.apply(util.applyAlucardPalette(alColP))
              break
            case 'pinkpassion':
              alColP = 'p'
              check.apply(util.applyAlucardPalette(alColP))
              break
            case 'shadowp':
              alColP = 's'
              check.apply(util.applyAlucardPalette(alColP))
              break
          }
        }

        //Apply Alucard's Liner
        if (alucardLinerLock != 'default') {
          switch (alucardLinerLock) {
            case 'gold':
              alColL = 'z'
              check.apply(util.applyAlucardLiner(alColL))
              break
            case 'bronze':
              alColL = 'x'
              check.apply(util.applyAlucardLiner(alColL))
              break
            case 'silver':
              alColL = 'y'
              check.apply(util.applyAlucardLiner(alColL))
              break
            case 'onyx':
              alColL = 'w'
              check.apply(util.applyAlucardLiner(alColL))
              break
            case 'coral':
              alColL = "v"
              check.apply(util.applyAlucardLiner(alColL))
              break
          }
        }
        // Apply writes.
        check.apply(util.applyWrites(rng, applied))
        util.setSeedText(
          check,
          seed,
          version,
          options.preset,
          options.tournamentMode,
        )
        return check.sum()
      }).then(function (result) {
        checksum = result
        if (expectChecksum && expectChecksum !== checksum) {
          throw new errors.VersionError()
        }
        // Apply accessibility patches.
        if (elems.accessibilityPatches.checked) {
          check.apply(applyAccessibilityPatches())
        }
        return util.finalizeData(
          seed,
          version,
          options.preset,
          options.tournamentMode,
          file,
          check,
          createWorkers(1)[0],
          getUrl(),
        )
      }).then(function (result) {
        const duration = new Date().getTime() - start
        // console.log('Seed generation took ' + (duration / 1000) + 's')
        if (selectedPreset !== null) {
          doApiRequest("/data/presets", "POST", {
            "preset": selectedPreset,
            "generation_time": duration,
            "app": isDev ? "dev-web" : "web",
            "settings": {
              "tournament": elems.tournamentMode.checked,
              "color_rando": elems.colorrandoMode.checked,
              "magic_max": elems.magicmaxMode.checked,
              "anti_freeze": elems.antiFreezeMode.checked,
              "purse_mode": elems.mypurseMode.checked,
              "infinite_wing_smash": elems.iwsMode.checked,
              "fast_warp": elems.fastwarpMode.checked,
              "no_prologue": elems.noprologueMode.checked,
              "unlocked": elems.unlockedMode.checked,
              "surprise": elems.surpriseMode.checked,
              "enemy_stat": elems.enemyStatRandoMode.checked,
              "relic_extension": null
            }
          })
        }

        showSpoilers()
        const url = URL.createObjectURL(new Blob([result.file], {
          type: 'application/octet-binary',
        }))
        let fileName
        if (elems.output.ppf.checked) {
          fileName = seed + ".ppf"
          if (selectedPreset !== null) fileName = selectedPreset + "-" + fileName
        } else {
          fileName = selectedFile.name
        }
        if (elems.appendSeed.checked) {
          if (elems.output.ppf.checked) {
            elems.download.download = fileName
          } else {
            elems.download.download = randomizedFilename(fileName, seed)
          }
        } else {
          resultName = "SotN-Randomizer"
          if (selectedPreset !== null) resultName = resultName + "-" + selectedPreset
          if (elems.output.ppf.checked) {
            elems.download.download = resultName + ".ppf"
          } else {
            elems.download.download = fileName
          }

        }
        elems.download.href = url
        elems.download.click()
        URL.revokeObjectURL(url)
        resetCopy()
        hideLoader();
      })
    }
    if (elems.output.ppf.checked) {
      randomize().catch(handleError).finally(restoreItems)
    } else {
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        // Verify vanilla bin.
        util.sha256(this.result).then(function (digest) {
          if (digest !== constants.digest) {
            throw new Error('Disc image is not a valid or vanilla backup')
          }
        }).then(randomize.bind(this)).catch(handleError).finally(restoreItems)
      })
      reader.readAsArrayBuffer(selectedFile)
    }
  }

  function clearHandler(event) {
    expectChecksum = undefined
    event.preventDefault()
    event.stopPropagation()
    elems.seed.value = ''
    elems.seed.disabled = false
    elems.presetId.disabled = false
    elems.enemyDrops.disabled = false
    elems.enemyDropsArg.value = ''
    elems.startingEquipment.disabled = false
    elems.startingEquipmentArg.value = ''
    elems.itemLocations.disabled = false
    elems.itemLocationsArg.value = ''
    elems.prologueRewards.disabled = false
    elems.prologueRewardsArg.value = ''
    elems.relicLocations.disabled = false
    elems.relicLocationsSet.disabled = false
    elems.relicLocationsArg.value = ''
    elems.writes.value = ''
    elems.turkeyMode.disabled = false
    elems.magicmaxMode.disabled = false
    elems.colorrandoMode.disabled = false
    elems.antiFreezeMode.disabled = false
    elems.mypurseMode.disabled = false
    elems.iwsMode.disabled = false
    elems.fastwarpMode.disabled = false
    elems.noprologueMode.disabled = false
    elems.unlockedMode.disabled = false
    elems.surpriseMode.disabled = false
    elems.enemyStatRandoMode.disabled = false
    elems.shopPriceRandoMode.disabled = false
    elems.startRoomRandoMode.disabled = false
    elems.startRoomRando2ndMode.disabled = false
    elems.dominoMode.disabled = false
    elems.rlbcMode.disabled = false
    elems.newGoals.value = ''
    elems.immunityPotionMode.disabled = false
    elems.godspeedMode.disabled = false
    elems.libraryShortcut.disabled = false
    elems.elemChaosMode.disabled = false
    elems.simpleInputMode.disabled = false
    elems.devStashMode.disabled = false
    elems.seasonalPhrasesMode.disabled = false
    elems.seasonalPhrasesMode.value = true
    elems.bossMusicSeparation.disabled = false
    elems.tournamentMode.disabled = false
    elems.clear.classList.add('hidden')
    presetChange()
  }

  let animationDone = true

  function copyHandler(event) {
    event.preventDefault()
    event.stopPropagation()
    //elems.seed.value = elems.seed.value || currSeed || ''
    // const url = util.optionsToUrl(                                     Removed to change the copy seed button to a Copy Spoilers button
    //   version,
    //   getFormOptions(),
    //   checksum,
    //   elems.seed.value,
    //   window.location.href,
    // )
    // const input = document.createElement('input')
    // document.body.appendChild(input)
    // input.type = 'text'
    // input.value = url.toString()
    // input.select()
    // document.execCommand('copy')
    // document.body.removeChild(input)
    navigator.clipboard.writeText(spoilers.value);
    if (animationDone) {
      animationDone = false
      elems.notification.classList.add('success')
      elems.notification.classList.remove('hide')
      setTimeout(function () {
        elems.notification.classList.add('hide')
      }, 2000)
      setTimeout(function () {
        elems.notification.classList.remove('success')
        animationDone = true
      }, 4000)
    }
  }

  function showOlderHandler(event) {
    elems.showOlder.classList.add('hidden')
    elems.older.classList.remove('hidden')
  }

  function loadOption(name, changeHandler, defaultValue) {
    const value = localStorage.getItem(name)
    if (!elems[name]) return;
    if (elems[name].type === 'checkbox') {
      if (typeof (value) === 'string') {
        elems[name].checked = value === 'true'
      } else {
        elems[name].checked = defaultValue
      }
    } else if (typeof (value) === 'string') {
      elems[name].value = value
    } else {
      elems[name].value = defaultValue
    }
    changeHandler()
  }

  function showSpoilers() {
    let verbosity
    if (elems.showSolutions.checked) {
      verbosity = 4
    } else if (elems.showRelics.checked) {
      verbosity = 3
    } else {
      verbosity = 2
    }
    elems.spoilers.value = util.formatInfo(info, verbosity)
    if (elems.showSpoilers.checked
      && elems.spoilers.value.match(/[^\s]/)) {
      elems.spoilersContainer.style.display = ''
      elems.spoilersContainer.classList.remove('hide')
    }
  }

  function hideSpoilers() {
    elems.spoilersContainer.classList.add('hide')
  }

  function showExcludeMenu() {
    elems.excludeSongsMenu.hidden = !elems.excludeSongsOption.checked;
    localStorage.setItem('excludeSongsOption', elems.excludeSongsOption.checked)
  }

  function moveItemBetweenExclusionLists(from, to) {
    const fromList = document.getElementById(from + 'List');
    const toList = document.getElementById(to + 'List');

    Array.from(fromList.selectedOptions).forEach(option => {
      toList.appendChild(option);
    });
  }

  function saveStoredSongs() {
    const excludeList = document.getElementById('excludeList');
    const excludedItems = Array.from(excludeList.options).map(option => option.text);
    localStorage.setItem('excludedSongsList', excludedItems);
  }

  function loadStoredSongs() {
    const storedExcludedSongs = localStorage.getItem('excludedSongsList');
    if (storedExcludedSongs) {
      const includeList = document.getElementById("includeList");
      const excludeList = document.getElementById('excludeList');
      for (const option of includeList.options) {
        option.selected = storedExcludedSongs.includes(option.text);
      }
      excludeSong();
    }
  }

  function excludeSong() {
    moveItemBetweenExclusionLists("include", "exclude");
    saveStoredSongs();
  }

  function includeSong() {
    moveItemBetweenExclusionLists("exclude", "include");
    saveStoredSongs();
  }

  function loadSongs() {
    songsList.forEach(song => {
      const option = document.createElement('option');
      option.value = song.toUpperCase().replace(/ /g, "_");;
      option.textContent = song;
      elems.includeList.appendChild(option);
    })
    loadStoredSongs();
  }

  function isTodayBetweenDates(startMonth, startDay, endMonth, endDay) {
    const today = new Date();
    const year = today.getFullYear();

    const startDate = new Date(year, startMonth, startDay);
    const endDate = new Date(year, endMonth, endDay);

    return today >= startDate && today < endDate;
  }

  function loadEventLogo(seasonalEvent) {
    if (seasonalEvent.eventLogo) {
      elems.logo.src = seasonalEvent.eventLogo;
      return;
    }
  }

  function loadEvent() {
    for (const seasonalEvent of seasonalEvents) {
      // Months are - 1 because JS months start from 0.
      if (isTodayBetweenDates(seasonalEvent.startMonth - 1, seasonalEvent.startDay, seasonalEvent.endMonth - 1, seasonalEvent.endDay)) {
        loadEventLogo(seasonalEvent);
        displayRandomSplashText(seasonalEvent);
        return;
      }
    }
  }

  const body = document.getElementsByTagName('body')[0]
  body.addEventListener('dragover', dragOverListener)
  body.addEventListener('dragleave', dragLeaveListener)
  body.addEventListener('drop', dropListener)
  const elems = {
    output: {
      ppf: document.getElementById('output-ppf'),
      bin: document.getElementById('output-bin'),
    },
    target: document.getElementById('target'),
    status: document.getElementById('status'),
    file: document.getElementById('file'),
    form: document.getElementById('form'),
    randomize: document.getElementById('randomize'),
    seed: document.getElementById('seed'),
    preset: document.getElementById('preset'),
    presetSelect: document.getElementById('preset-select'),
    presetDetails: document.querySelector('#preset-details'),
    presetId: document.getElementById('preset-id'),
    presetDescription: document.getElementById('preset-description'),
    presetAuthor: document.getElementById('preset-author'),
    presetKnowledgeCheck: document.getElementById('preset-knowledgeCheck'),
    presetExtension: document.getElementById('preset-metaExtension'),
    presetComplexity: document.getElementById('preset-metaComplexity'),
    presetItemStats: document.getElementById('preset-itemStats'),
    presetTimeFrame: document.getElementById('preset-timeFrame'),
    presetModdedLevel: document.getElementById('preset-moddedLevel'),
    presetCastleType: document.getElementById('preset-castleType'),
    presetTransformEarly: document.getElementById('preset-transformEarly'),
    presetTransformFocus: document.getElementById('preset-transformFocus'),
    presetWinCondition: document.getElementById('preset-winCondition'),
    options: document.getElementById('options'),
    complexity: document.getElementById('complexity'),
    complexityCurrentValue: document.querySelector('#complexityCurrentValue'),
    complexityDataList: document.querySelector('#complexityValues'),
    complexityMaxValue: document.querySelector('#complexityMaxValue'),
    enemyDrops: document.getElementById('enemy-drops'),
    enemyDropsArg: document.getElementById('enemy-drops-arg'),
    startingEquipment: document.getElementById('starting-equipment'),
    startingEquipmentArg: document.getElementById('starting-equipment-arg'),
    relicLocationsSet: document.getElementById('relic-locations-set'),
    relicLocations: document.getElementById('relic-locations'),
    relicLocationsExtension: {
      guarded: document.getElementById('extension-guarded'),
      guardedplus: document.getElementById('extension-guardedplus'),
      equipment: document.getElementById('extension-equipment'),
      scenic: document.getElementById('extension-scenic'),
      extended: document.getElementById('extension-extended'),
      classic: document.getElementById('extension-classic'),
    },
    relicLocationsArg: document.getElementById('relic-locations-arg'),
    writes: document.getElementById('writes'),
    itemLocations: document.getElementById('item-locations'),
    itemLocationsArg: document.getElementById('item-locations-arg'),
    prologueRewards: document.getElementById('prologue-rewards'),
    prologueRewardsArg: document.getElementById('prologue-rewards-arg'),
    stats: document.getElementById('stats'),
    music: document.getElementById('music'),
    turkeyMode: document.getElementById('turkey-mode'),
    clear: document.getElementById('clear'),
    theme: document.getElementById('theme'),
    mapColor: document.getElementById('mapColor'),
    newGoals: document.getElementById('newGoals'),
    alucardPalette: document.getElementById('alucardPalette'),
    alucardLiner: document.getElementById('alucardLiner'),
    appendSeed: document.getElementById('append-seed'),
    tournamentMode: document.getElementById('tournament-mode'),
    colorrandoMode: document.getElementById('colorrando-mode'),
    magicmaxMode: document.getElementById('magicmax-mode'),
    antiFreezeMode: document.getElementById('antifreeze-mode'),
    mypurseMode: document.getElementById('mypurse-mode'),
    iwsMode: document.getElementById('iws-mode'),
    fastwarpMode: document.getElementById('fastwarp-mode'),
    itemNameRandoMode: document.getElementById('itemnamerando-mode'),
    noprologueMode: document.getElementById('noprologue-mode'),
    unlockedMode: document.getElementById('unlocked-mode'),
    surpriseMode: document.getElementById('surprise-mode'),
    enemyStatRandoMode: document.getElementById('enemyStatRando-mode'),
    shopPriceRandoMode: document.getElementById('shopPriceRando-mode'),
    startRoomRandoMode: document.getElementById('startRoomRando-mode'),
    startRoomRando2ndMode: document.getElementById('startRoomRando2nd-mode'),
    dominoMode: document.getElementById('domino-mode'),
    rlbcMode: document.getElementById('rlbc-mode'),
    immunityPotionMode: document.getElementById('immunity-potion-mode'),
    godspeedMode: document.getElementById('godspeed-mode'),
    libraryShortcut: document.getElementById('library-shortcut'),
    elemChaosMode: document.getElementById('elem-chaos'),
    simpleInputMode: document.getElementById('simple-input'),
    devStashMode: document.getElementById('dev-stash'),
    seasonalPhrasesMode: document.getElementById('seasonal-phrases'),
    bossMusicSeparation: document.getElementById('boss-music-separation'),
    accessibilityPatches: document.getElementById('accessibility-patches'),
    showSpoilers: document.getElementById('show-spoilers'),
    showRelics: document.getElementById('show-relics'),
    showSolutions: document.getElementById('show-solutions'),
    spoilers: document.getElementById('spoilers'),
    spoilersContainer: document.getElementById('spoilers-container'),
    download: document.getElementById('download'),
    loader: document.getElementById('loader'),
    copy: document.getElementById('copy'),
    notification: document.getElementById('notification'),
    seedUrl: document.getElementById('seed-url'),
    showOlder: document.getElementById('show-older'),
    older: document.getElementById('older'),
    esMoveToLeft: document.getElementById('esMoveToLeft'),
    esMoveToRight: document.getElementById('esMoveToRight'),
    excludeSongsMenu: document.getElementById('excludeSongsMenu'),
    excludeSongsOption: document.getElementById('excludeSongsOption'),
    includeList: document.getElementById('includeList'),
    excludeList: document.getElementById('excludeList'),
    logo: document.getElementById('pageLogo')
  }
  loadEvent();
  resetState()
  elems.output.ppf.addEventListener('change', outputChange)
  elems.output.bin.addEventListener('change', outputChange)
  elems.file.addEventListener('change', fileChange)
  elems.form.addEventListener('submit', submitListener)
  elems.seed.addEventListener('change', seedChange)
  elems.presetId.addEventListener('change', presetIdChange)
  elems.complexity.addEventListener('change', complexityChange)
  elems.complexity.addEventListener('input', updateCurrentComplexityValue);
  elems.enemyDrops.addEventListener('change', enemyDropsChange)
  elems.startingEquipment.addEventListener('change', startingEquipmentChange)
  elems.relicLocations.addEventListener('change', relicLocationsChange)
  elems.relicLocationsExtension.guarded.addEventListener(
    'change',
    relicLocationsExtensionChange,
  )
  elems.relicLocationsExtension.guardedplus.addEventListener(
    'change',
    relicLocationsExtensionChange,
  )
  elems.relicLocationsExtension.equipment.addEventListener(
    'change',
    relicLocationsExtensionChange,
  )
  elems.relicLocationsExtension.scenic.addEventListener(
    'change',
    relicLocationsExtensionChange,
  )
  elems.relicLocationsExtension.extended.addEventListener(
    'change',
    relicLocationsExtensionChange,
  )
  elems.relicLocationsExtension.classic.addEventListener(
    'change',
    relicLocationsExtensionChange,
  )
  elems.itemLocations.addEventListener('change', itemLocationsChange)
  elems.prologueRewards.addEventListener('change', prologueRewardsChange)
  elems.stats.addEventListener('change', statsChange)
  elems.music.addEventListener('change', musicChange)
  elems.turkeyMode.addEventListener('change', turkeyModeChange)
  elems.clear.addEventListener('click', clearHandler)
  elems.theme.addEventListener('change', themeChange)
  elems.mapColor.addEventListener('change', mapColorChange)
  elems.newGoals.addEventListener('change', newGoalsChange)
  elems.alucardPalette.addEventListener('change', alucardPaletteChange)
  elems.alucardLiner.addEventListener('change', alucardLinerChange)
  elems.appendSeed.addEventListener('change', appendSeedChange)
  elems.tournamentMode.addEventListener('change', tournamentModeChange)
  elems.colorrandoMode.addEventListener('change', colorrandoModeChange)
  elems.magicmaxMode.addEventListener('change', magicmaxModeChange)
  elems.antiFreezeMode.addEventListener('change', antiFreezeModeChange)
  elems.mypurseMode.addEventListener('change', mypurseModeChange)
  elems.iwsMode.addEventListener('change', iwsModeChange)
  elems.fastwarpMode.addEventListener('change', fastwarpModeChange)
  elems.itemNameRandoMode.addEventListener('change', itemNameRandoModeChange)
  elems.noprologueMode.addEventListener('change', noprologueModeChange)
  elems.unlockedMode.addEventListener('change', unlockedModeChange)
  elems.surpriseMode.addEventListener('change', surpriseModeChange)
  elems.enemyStatRandoMode.addEventListener('change', enemyStatRandoModeChange)
  elems.shopPriceRandoMode.addEventListener('change', shopPriceRandoModeChange)
  elems.startRoomRandoMode.addEventListener('change', startRoomRandoModeChange)
  elems.startRoomRando2ndMode.addEventListener('change', startRoomRando2ndModeChange)
  elems.dominoMode.addEventListener('change', dominoModeChange)
  elems.rlbcMode.addEventListener('change', rlbcModeChange)
  elems.immunityPotionMode.addEventListener('change', immunityPotionModeChange)
  elems.godspeedMode.addEventListener('change', godspeedModeChange)
  elems.libraryShortcut.addEventListener('change', libraryShortcutChange)
  elems.elemChaosMode.addEventListener('change', elemChaosModeChange)
  elems.simpleInputMode.addEventListener('change', simpleInputModeChange)
  elems.devStashMode.addEventListener('change', devStashModeChange)
  elems.seasonalPhrasesMode.addEventListener('change', seasonalPhrasesModeChange)
  elems.bossMusicSeparation.addEventListener('change', bossMusicSeparationChange)
  elems.accessibilityPatches.addEventListener('change', accessibilityPatchesChange)
  elems.showSpoilers.addEventListener('change', spoilersChange)
  elems.showRelics.addEventListener('change', showRelicsChange)
  elems.showSolutions.addEventListener('change', showSolutionsChange)
  elems.copy.addEventListener('click', copyHandler)
  elems.showOlder.addEventListener('click', showOlderHandler)
  elems.excludeSongsOption.addEventListener('change', showExcludeMenu)
  elems.esMoveToRight.addEventListener('click', excludeSong)
  elems.esMoveToLeft.addEventListener('click', includeSong)
  // Set April Fools flag
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  isAprilFools = month === 4 && day === 1;
  // Load presets
  sortedPresets = presets
  sortedPresets.sort(function (a, b) {
    if (!('weight' in a && 'id' in a)) {
      if (!('weight' in b && 'id' in b)) {
        return 0
      }
      return 1
    } else if (!('weight' in b && 'id' in b)) {
      return -1
    }
    const weight = a.weight - b.weight
    if (weight === 0) {
      if (a.id < b.id) {
        return -1
      } else if (a.id > b.id) {
        return 1
      }
    }
    return weight
  });

  sortedPresets.forEach(function (preset) {
    if (!preset.hidden) {
      if (preset.id === "april-fools" && !isAprilFools) return;
      const option = document.createElement('option')
      option.value = preset.id
      option.innerText = preset.name
      if (preset.id === "april-fools") option.innerText = "April Fools";
      elems.presetId.appendChild(option)
    }
  })
  const url = new URL(window.location.href)
  const releaseBaseUrl = constants.optionsUrls[constants.defaultOptions]
  const releaseHostname = new URL(releaseBaseUrl).hostname
  const isDev = url.hostname !== releaseHostname
  const fakeVersion = '0.0.0D'
  if (url.protocol !== 'file:') {
    fetch('package.json', { cache: 'no-store' }).then(function (response) {
      if (response.ok) {
        response.json().then(function (json) {
          version = json.version
          if (isDev && !version.match(/-/)) {
            version += 'D'
          }
          document.getElementById('version').innerText = version
        })
      }
    }).catch(function () {
      version = fakeVersion
    })
  } else {
    version = fakeVersion
  }
  let options
  let seed
  loadOption('excludeSongsOption', showExcludeMenu, false);
  loadSongs();
  if (url.search.length) {
    const rs = util.optionsFromUrl(window.location.href)
    options = rs.options
    const applied = util.Preset.options(options)
    seed = rs.seed
    if (!Number.isNaN(rs.checksum)) {
      expectChecksum = rs.checksum
    }
    if (typeof (seed) === 'string') {
      elems.seed.value = seed
      seedChange()
      haveChecksum = true
    }
    if (seed.length) {
      elems.seed.disabled = true
    }
    if (options.preset) {
      let index = 0
      for (let i = 0; i < presets.length; i++) {
        if (presets[i].id === options.preset) {
          elems.presetId.selectedIndex = index
          break
        }
        if (!presets.hidden) {
          index++
        }
      }
      presetIdChange()
    } else {
      elems.presetId.selectedIndex = 0
    }
    presetChange()
    if (options.tournamentMode) {
      elems.tournamentMode.checked = true
    } else {
      elems.tournamentMode.checked = false
    }
    tournamentModeChange()
    elems.tournamentMode.disabled = true
    let locations
    if (typeof (applied.relicLocations) === 'object') {
      locations = applied.relicLocations
    } else {
      locations = safe.options().relicLocations
    }
    Object.getOwnPropertyNames(locations).forEach(
      function (key) {
        if (/^[0-9]+(-[0-9]+)?$/.test(key)) {
          elems.complexity.value = key.split('-').shift()
        }
      }
    )
    elems.enemyDrops.checked = applied.enemyDrops
    enemyDropsChange()
    let enemyDropsArg = ''
    if (typeof (options.enemyDrops) === 'object') {
      enemyDropsArg = util.optionsToString({
        enemyDrops: options.enemyDrops,
      })
    }
    elems.enemyDropsArg.value = enemyDropsArg
    elems.startingEquipment.checked = applied.startingEquipment
    startingEquipmentChange()
    let startingEquipmentArg = ''
    if (typeof (options.startingEquipment) === 'object') {
      startingEquipmentArg = util.optionsToString({
        startingEquipment: options.startingEquipment,
      })
    }
    elems.startingEquipmentArg.value = startingEquipmentArg
    elems.itemLocations.checked = applied.itemLocations
    itemLocationsChange()
    let itemLocationsArg = ''
    if (typeof (options.itemLocations) === 'object') {
      itemLocationsArg = util.optionsToString({
        itemLocations: options.itemLocations,
      })
    }
    elems.itemLocationsArg.value = itemLocationsArg
    elems.prologueRewards.checked = applied.prologueRewards
    prologueRewardsChange()
    let prologueRewardsArg = ''
    if (typeof (options.prologueRewards) === 'object') {
      prologueRewardsArg = util.optionsToString({
        prologueRewards: options.prologueRewards,
      })
    }
    elems.prologueRewardsArg.value = prologueRewardsArg
    elems.relicLocations.checked = !!applied.relicLocations
    relicLocationsChange()
    let relicLocationsArg = ''
    if (typeof (options.relicLocations) === 'object') {
      // This is a hacky way to get all possible relic location locks
      // serialized, without including the relic locations extension.
      const relicOptions = util.optionsFromString(util.optionsToString({
        relicLocations: Object.assign({}, applied.relicLocations, {
          extension: constants.EXTENSION.SCENIC,
        }),
      }).replace(new RegExp(':?' + util.optionsToString({
        relicLocations: {
          extension: constants.EXTENSION.SCENIC,
        },
      }).slice(2)), ''))
      // Restore original extension from URL.
      if ('extension' in options.relicLocations) {
        relicOptions.relicLocations.extension
          = options.relicLocations.extension
      }
      relicLocationsArg = util.optionsToString(relicOptions)
    }
    elems.relicLocationsArg.value = relicLocationsArg
    elems.relicLocationsExtension.extended.checked =
      applied.relicLocations
      && applied.relicLocations.extension === constants.EXTENSION.EXTENDED
    elems.relicLocationsExtension.scenic.checked =
      applied.relicLocations
      && applied.relicLocations.extension === constants.EXTENSION.SCENIC
    elems.relicLocationsExtension.guarded.checked =
      applied.relicLocations
      && applied.relicLocations.extension === constants.EXTENSION.GUARDED
    elems.relicLocationsExtension.guardedplus.checked =
      applied.relicLocations
      && applied.relicLocations.extension === constants.EXTENSION.GUARDEDPLUS
    elems.relicLocationsExtension.equipment.checked =
      applied.relicLocations
      && applied.relicLocations.extension === constants.EXTENSION.EQUIPMENT
    elems.relicLocationsExtension.classic.checked =
      applied.relicLocations
      && !applied.relicLocations.extension
    relicLocationsExtensionChange()
    let writes = ''
    if (options.writes) {
      writes = util.optionsToString({ writes: options.writes })
    }
    elems.writes.value = writes
    elems.stats.checked = applied.stats
    statsChange()
    elems.music.checked = applied.music
    musicChange()
    elems.turkeyMode.checked = applied.turkeyMode
    turkeyModeChange()
    elems.presetId.disabled = true
    elems.complexity.disabled = true
    elems.enemyDrops.disabled = true
    elems.startingEquipment.disabled = true
    elems.itemLocations.disabled = true
    elems.prologueRewards.disabled = true
    elems.relicLocations.disabled = false
    elems.relicLocationsSet.disabled = false
    elems.stats.disabled = true
    elems.music.disabled = true
    elems.turkeyMode.disabled = true
    elems.clear.classList.remove('hidden')
    const baseUrl = url.origin + url.pathname
    window.history.replaceState({}, document.title, baseUrl)
  } else {
    loadOption('complexity', complexityChange, 7)
    loadOption('enemyDrops', enemyDropsChange, true)
    loadOption('startingEquipment', startingEquipmentChange, true)
    loadOption('itemLocations', itemLocationsChange, true)
    loadOption('prologueRewards', prologueRewardsChange, true)
    loadOption('relicLocations', relicLocationsChange, true)
    loadOption('stats', statsChange, true)
    loadOption('music', musicChange, true)
    loadOption('turkeyMode', turkeyModeChange, true)
    loadOption('seasonalPhrasesMode', seasonalPhrasesModeChange, true)
    let relicLocationsExtension =
      localStorage.getItem('relicLocationsExtension')
    if (typeof (relicLocationsExtension) === 'string') {
      switch (relicLocationsExtension) {
        case constants.EXTENSION.GUARDED:
          elems.relicLocationsExtension.guarded.checked = true
          break
        case constants.EXTENSION.GUARDEDPLUS:
          elems.relicLocationsExtension.guardedplus.checked = true
          break
        case constants.EXTENSION.EQUIPMENT:
          elems.relicLocationsExtension.equipment.checked = true
          break
        case constants.EXTENSION.EXTENDED:
          elems.relicLocationsExtension.extended.checked = true
          break
        case constants.EXTENSION.SCENIC:
          elems.relicLocationsExtension.scenic.checked = true
          break
        default:
          elems.relicLocationsExtension.classic.checked = true
          break
      }
    } else if (constants.defaultExtension) {
      elems.relicLocationsExtension[constants.defaultExtension].checked = true
    } else {
      elems.relicLocationsExtension.classic.checked = true
    }
    relicLocationsExtensionChange()
    let presetId = localStorage.getItem('presetId')
    if (typeof (presetId) !== 'string') {
      presetId = 'casual'
    }
    let index = 0
    for (let i = 0; i < presets.length; i++) {
      if (presets[i].id === presetId) {
        elems.presetId.selectedIndex = index
        break
      }
      if (!presets.hidden) {
        index++
      }
    }
    presetIdChange()
    loadOption('preset', presetChange, true)
  }
  let path = url.pathname
  if (path.match(/index\.html$/)) {
    path = path.slice(0, path.length - 10)
  }
  if (isDev) {
    document.body.classList.add('dev')
    document.getElementById('dev-border').classList.add('dev')
    document.writeln([
      '<div id="warning">WARNING: This is the development version of the',
      'randomizer. Do not use this unless you know what you\'re doing.',
      'Bugs and softlocks are to be expected.<br>',
      'Go to <a href="https://sotn.io">sotn.io</a> for the stable release.',
      '</div>',
    ].join(' '))
    setTimeout(function () {
      document.getElementById('content').prepend(
        document.getElementById('warning'),
      )
    })
  }
  const output = localStorage.getItem('output')
  if (output === 'ppf') {
    elems.output.ppf.checked = true
  } else {
    elems.output.bin.checked = true
  }
  outputChange()
  loadOption('theme', themeChange, 'menu')
  loadOption('mapColor', mapColorChange, 'menu')
  loadOption('newGoals', newGoalsChange, 'menu')
  loadOption('alucardPalette', alucardPaletteChange, 'menu')
  loadOption('alucardLiner', alucardLinerChange, 'menu')
  loadOption('appendSeed', appendSeedChange, true)
  loadOption('showSolutions', showSolutionsChange, false)
  loadOption('showRelics', showRelicsChange, false)
  loadOption('tournamentMode', tournamentModeChange, false)
  loadOption('colorrandoMode', colorrandoModeChange, false)
  loadOption('magicmaxMode', magicmaxModeChange, false)
  loadOption('antiFreezeMode', antiFreezeModeChange, false)
  loadOption('mypurseMode', mypurseModeChange, false)
  loadOption('iwsMode', iwsModeChange, false)
  loadOption('fastwarpMode', fastwarpModeChange, false)
  loadOption('itemNameRandoMode', itemNameRandoModeChange, false)
  loadOption('noprologueMode', noprologueModeChange, false)
  loadOption('unlockedMode', unlockedModeChange, false)
  loadOption('surpriseMode', surpriseModeChange, false)
  loadOption('enemyStatRandoMode', enemyStatRandoModeChange, false)
  loadOption('shopPriceRandoMode', shopPriceRandoModeChange, false)
  loadOption('startRoomRandoMode', startRoomRandoModeChange, false)
  loadOption('startRoomRando2ndMode', startRoomRando2ndModeChange, false)
  loadOption('dominoMode', dominoModeChange, false)
  loadOption('rlbcMode', rlbcModeChange, false)
  loadOption('immunityPotionMode', immunityPotionModeChange, false)
  loadOption('godspeedMode', godspeedModeChange, false)
  loadOption('libraryShortcut', libraryShortcutChange, false)
  loadOption('elemChaosMode', elemChaosModeChange, false)
  loadOption('simpleInputMode', simpleInputModeChange, false)
  loadOption('devStashMode', devStashModeChange, false)
  loadOption('seasonalPhrasesMode', seasonalPhrasesModeChange, true)
  loadOption('bossMusicSeparation', bossMusicSeparationChange, true)
  loadOption('accessibilityPatches', accessibilityPatchesChange, true)
  loadOption('showSpoilers', spoilersChange, true)
  setTimeout(function () {
    const els = document.getElementsByClassName('tooltip')
    Array.prototype.forEach.call(els, function (el) {
      el.classList.remove('hidden')
    })
  })
  presetIdChange()

})(typeof (window) !== 'undefined' ? window : null)
