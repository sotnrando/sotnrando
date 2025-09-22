
(function (window) {
  //#region Constants & General Variables
  const url = new URL(window.location.href)
  let currSeed
  let expectChecksum
  let haveChecksum
  let downloadReady
  let selectedFile
  window.selectedFile = selectedFile
  let mapColorLock
  let newGoalsLock
  let alucardPaletteLock
  let alucardLinerLock
  let isAprilFools

  //#endregion

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");

      // Remove active class from all tabs and contents
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      // Activate selected tab and content
      tab.classList.add("active");
      document.getElementById(targetId).classList.add("active");
    });
  });

  function displayRandomSplashText(seasonalEvent) {
    if (!seasonalEvent.toolSplashPhrases) return;
    const splashPhrases = seasonalEvent.toolSplashPhrases;
    const randomSplashIndex = Math.floor(Math.random() * splashPhrases.length);
    document.getElementById("splashTextDisplay").textContent = splashPhrases[randomSplashIndex];
  }

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

  const items = cloneItems(sotnRando.items)

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
    elems.copy.disabled = !(elems.seed.value.length || (currSeed && currSeed.length));
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
    // Ensure required elements exist
    if (!paletteSelect || !linerSelect || !paletteDisplay || !linerDisplay) return;

    // Fix liner Y position
    linerDisplay.style.backgroundPositionY = "64px";

    // Calculate background X positions based on selected indices
    const paletteIndex = paletteSelect.selectedIndex;
    const linerIndex = linerSelect.selectedIndex;

    paletteDisplay.style.backgroundPositionX = (864 - paletteIndex * 96) + "px";
    linerDisplay.style.backgroundPositionX = (768 - linerIndex * 96) + "px";
  }

  // Initial render
  updateAlucardPreview();

  // Update preview on selection change
  paletteSelect.addEventListener("change", updateAlucardPreview);
  linerSelect.addEventListener("change", updateAlucardPreview);

  // Re-render on page load if values are present
  window.addEventListener("load", function () {
    if (paletteSelect.value || linerSelect.value) {
      updateAlucardPreview();
    }
  });

  function updateMapColorPreview() {
    // Calculate current position based on the selected options
    let mapColorIndex = mapColorSelect.selectedIndex;
    mapColorDisplay.style.backgroundPositionX = (432 - (mapColorIndex * 48)) + "px";
  }

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
      { ids: ["dog-life", "magic-mirror", "mobility", "lookingglass", "boss-rush", "beyond", "first-castle", "vanilla"], elems: ["startRoomRando2ndMode"] },
      { ids: ["boss-rush", "first-castle", "seeker"], elems: ["relicLocations", "relicLocationsSet"] },
      { ids: ["boss-rush", "beyond", "vanilla"], elems: ["startRoomRandoMode"] },
      { ids: ["boss-rush"], elems: ["unlockedMode"] },
      { ids: ["big-toss"], elems: ["enemyStatRandoMode", "elemChaosMode"] },
      { ids: ["boss-rush", "first-castle", "beyond", "seeker", "recycler"], elems: ["rlbcMode"] },
      { ids: ["battle-mage"], elems: ["godspeedMode"] },
      { ids: ["bounty-hunter", "target-confirmed", "hitman", "chaos-lite", "rampage", "oracle"], elems: ["dominoMode"] }
    ];

    const BH_GOAL_PRESETS = {
      h: new Set(["bounty-hunter", "chaos-lite"]),
      t: new Set(["target-confirmed"]),
      w: new Set(["hitman"]),
      x: new Set(["rampage"])
    };
    const GOAL_PRESETS = {
      b: new Set(["all-bosses", "mirror-breaker"]),
      v: new Set(["boss-reflector", "cornivus"])
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
      const isBossGoal = goal === "b" || goal === "a" || goal === "v";
      const isRelicGoal = goal === "r" || goal === "a";
      const isBhGoal = goal === "h" || goal === "t" || goal === "w" || goal === "x";

      if (isBossGoal && !BOSS_COMPAT.has(presetId)) return "default";
      if (isRelicGoal && !RELIC_COMPAT.has(presetId)) return "default";
      if (isBhGoal && !BH_COMPAT.has(presetId)) return "default";
      return goal;
    };

    let idx = elems.presetId.selectedIndex;
    if (idx < 0) idx = 0;

    const id = elems.presetId.options ? elems.presetId.options[idx].value : elems.presetId.childNodes[idx].value;
    const preset = sotnRando.presets.find(p => p.id === id) || sotnRando.presets[0];

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

    let relicLocationsExtensionCache = options.relicLocations && options.relicLocations.extension;
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
        extSet.guarded.checked = ext === sotnRando.constants.EXTENSION.GUARDED;
        extSet.guardedplus.checked = ext === sotnRando.constants.EXTENSION.GUARDEDPLUS;
        extSet.equipment.checked = ext === sotnRando.constants.EXTENSION.EQUIPMENT;
        extSet.scenic.checked = ext === sotnRando.constants.EXTENSION.SCENIC;
        extSet.extended.checked = ext === sotnRando.constants.EXTENSION.EXTENDED;
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
    relicLocationsExtensionChange()  //added to adjust max complexity slider when preset is changed -Crazy4Blades
  }

  function complexityChange() {
    localStorage.setItem('complexity', elems.complexity.value);
    elems.complexityCurrentValue.innerText = `(${elems.complexity.value})`;
  }

  function updateCurrentComplexityValue() {
    elems.complexityCurrentValue.innerText = `(${elems.complexity.value})`;
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
    const EXT = sotnRando.constants.EXTENSION
    const highCap = [EXT.EQUIPMENT, EXT.SCENIC].includes(relicLocationsExtensionCache)
    const max = highCap ? 15 : 11

    elems.complexity.max = max
    generateComplexityDataListItems(max)
    elems.complexityMaxValue.innerText = max

    if (+elems.complexity.value > max) {
      elems.complexity.value = max
    }
  }
  function relicLocationsExtensionChange() {
    const ext = elems.relicLocationsExtension
    const EXT = sotnRando.constants.EXTENSION

    const map = {
      guarded: EXT.GUARDED,
      guardedplus: EXT.GUARDEDPLUS,
      equipment: EXT.EQUIPMENT,
      scenic: EXT.SCENIC,
      extended: EXT.EXTENDED
    }

    let value = false
    for (const [key, constant] of Object.entries(map)) {
      if (ext[key]?.checked) {
        value = constant
        break
      }
    }

    relicLocationsExtensionCache = value
    adjustMaxComplexity()
    complexityChange()
    localStorage.setItem('relicLocationsExtension', value)
  }

  function themeChange() {
    const selected = elems.theme.value
    localStorage.setItem('theme', selected)

    body.classList.remove('menu', 'light', 'dark')
    body.classList.add(selected)
  }

  function mapColorChange() {
    localStorage.setItem('mapColor', elems.mapColor.value)
    mapColorLock = elems.mapColor.value
  }

  function newGoalsChange() {
    const { presetId, newGoals } = elems;
    const preset = presetId.value;
    const goal = newGoals.value;

    const bhCompatible = ["bounty-hunter", "target-confirmed", "hitman", "chaos-lite", "rampage"];
    const bossCompatible = [
      "casual", "safe", "adventure", "og", "guarded-og", "sequence-breaker", "lycanthrope", "warlock", "nimble",
      "expedition", "bat-master", "glitch", "scavenger", "empty-hand", "third-castle", "magic-mirror", "leg-day",
      "big-toss", "grand-tour", "crash-course", "any-percent", "lookingglass", "skinwalker", "summoner", "safe-stwo",
      "open", "brawler", "lucky-sevens", "sight-seer", "cursed-night", "spellbound", "mobility", "glitchmaster",
      "dog-life", "battle-mage", "timeline", "chimera", "vanilla", "all-bosses", "rampage", "nimble-lite", "oracle",
      "boss-reflector", "cornivus", "mirror-breaker"
    ];
    const relicCompatible = [
      "casual", "safe", "adventure", "og", "guarded-og", "sequence-breaker", "lycanthrope", "warlock", "nimble",
      "expedition", "bat-master", "scavenger", "empty-hand", "gem-farmer", "third-castle", "rat-race", "magic-mirror",
      "bountyhunter", "bountyhuntertc", "hitman", "beyond", "grand-tour", "crash-course", "lookingglass", "skinwalker",
      "summoner", "agonize-twtw", "safe-stwo", "open", "lucky-sevens", "sight-seer", "cursed-night", "spellbound",
      "mobility", "timeline", "chimera", "vanilla", "nimble-lite", "all-bosses", "cornivus", "mirror-breaker"
    ];

    const isCompatible = {
      abrsr: bossCompatible.includes(preset) && relicCompatible.includes(preset),
      vladBoss: !["oracle", "glitch", "glitchmaster", "any-percent"].includes(preset),
      allBoss: bossCompatible.includes(preset),
      allRelic: relicCompatible.includes(preset),
      bhNorm: bhCompatible.includes(preset),
      bhAdvanced: ["target-confirmed"].includes(preset),
      bhHitman: ["hitman"].includes(preset),
      bhBoss: ["rampage"].includes(preset)

    };

    if (goal in isCompatible && !isCompatible[goal]) {
      newGoals.value = "default";
    }

    const autoAssign = [
      { goal: "bhNorm", presets: ["chaos-lite", "bounty-hunter"] },
      { goal: "bhAdvanced", presets: ["target-confirmed"] },
      { goal: "bhHitman", presets: ["hitman"] },
      { goal: "bhBoss", presets: ["rampage"] },
      { goal: "allBoss", presets: ["all-bosses", "mirror-breaker"], exclude: ["abrsr", "vladBoss"] },
      { goal: "vladBoss", presets: ["boss-reflector", "cornivus"] }
    ];

    for (const { goal, presets, exclude = [] } of autoAssign) {
      if (newGoals.value !== goal && presets.includes(preset) && !exclude.includes(newGoals.value)) {
        newGoals.value = goal;
      }
    }

    localStorage.setItem('newGoals', newGoals.value);
    newGoalsLock = newGoals.value;
  }

  function alucardPaletteChange() {
    localStorage.setItem('alucardPalette', elems.alucardPalette.value)
    alucardPaletteLock = elems.alucardPalette.value
  }

  function alucardLinerChange() {
    localStorage.setItem('alucardLiner', elems.alucardLiner.value)
    alucardLinerLock = elems.alucardLiner.value
  }


  function fileChange(event) {
    if (elems.file.files[0]) {
      resetState()
      selectedFile = elems.file.files[0]
      resetTarget()
      elems.target.classList.add('active')
    }
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
          selectedFile = item.getAsFile()
        }
      }
    } else {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        selectedFile = event.dataTransfer.files[i]
      }
    }
    resetTarget(true)
    elems.file.style.display = 'none'
  }

  function getFormRelicLocations() {
    if (!elems.relicLocations.checked) {
      return false
    }
    const selectedPreset = elems.presetId.childNodes[elems.presetId.selectedIndex].value
    let presetData = sotnRando.presets.filter(function (preset) {
      return preset.id === selectedPreset
    }).pop()
    const relicLocations = presetData.options().relicLocations;

    if (relicLocations) {
      // Add extension from form.
      if (elems.relicLocationsExtension.guarded.checked) {
        relicLocations.extension = sotnRando.constants.EXTENSION.GUARDED
      } else if (elems.relicLocationsExtension.guardedplus.checked) {
        relicLocations.extension = sotnRando.constants.EXTENSION.GUARDEDPLUS
      } else if (elems.relicLocationsExtension.equipment.checked) {
        relicLocations.extension = sotnRando.constants.EXTENSION.EQUIPMENT
      } else if (elems.relicLocationsExtension.scenic.checked) {
        relicLocations.extension = sotnRando.constants.EXTENSION.SCENIC
      } else if (elems.relicLocationsExtension.extended.checked) {
        relicLocations.extension = sotnRando.constants.EXTENSION.EXTENDED
      } else {
        delete relicLocations.extension
      }
      const extensions = []
      switch (relicLocations.extension) {
        case sotnRando.constants.EXTENSION.EXTENDED:
          extensions.push(sotnRando.constants.EXTENSION.EXTENDED)
          break
        case sotnRando.constants.EXTENSION.SCENIC:
          extensions.push(sotnRando.constants.EXTENSION.SCENIC)
        case sotnRando.constants.EXTENSION.EQUIPMENT:
          extensions.push(sotnRando.constants.EXTENSION.EQUIPMENT)
        case sotnRando.constants.EXTENSION.GUARDEDPLUS:
          extensions.push(sotnRando.constants.EXTENSION.GUARDEDPLUS)
        case sotnRando.constants.EXTENSION.GUARDED:
          extensions.push(sotnRando.constants.EXTENSION.GUARDED)
      }
      // Delete default complexity target.
      let goals
      Object.getOwnPropertyNames(relicLocations).forEach(function (key) {
        if (/^[0-9]+(-[0-9]+)?/.test(key)) {
          goals = relicLocations[key]
          delete relicLocations[key]
        } else {
          sotnRando.extension.filter(function (location) {
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
      preset: sotnRando.presets[elems.presetId.selectedIndex].id,
      relicLocations: getFormRelicLocations()
    }

    const formOptions = [
      'tournamentMode', 'colorrandoMode', 'magicmaxMode', 'antiFreezeMode',
      'mypurseMode', 'iwsMode', 'fastwarpMode', 'itemNameRandoMode',
      'noprologueMode', 'unlockedMode', 'surpriseMode', 'enemyStatRandoMode',
      'shopPriceRandoMode', 'startRoomRandoMode', 'startRoomRando2ndMode',
      'dominoMode', 'rlbcMode', 'immunityPotionMode', 'godspeedMode',
      'libraryShortcut', 'elemChaosMode', 'simpleInputMode', 'devStashMode',
      'seasonalPhrasesMode', 'bossMusicSeparation'
    ]

    formOptions.forEach(key => {
      if (elems[key]?.checked) {
        options[key] = true
      }
    })

    return options
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
    let selectedPreset
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

    let seed = generateSeedName()
    if (elems.seed.value.length) {
      seed = elems.seed.value
    }
    currSeed = seed
    // Get options.
    const options = getFormOptions()
    // Check for overriding preset.
    let applied
    let override
    for (let preset of sotnRando.presets) {
      if (preset.override) {
        applied = preset.options()
        override = true
        break
      }
    }
    // Get user specified options.
    if (!override) {
      applied = sotnRando.util.Preset.options(options)
    }
    if (elems.complexity.value) {
      deleteOriginalComplexity(applied, elems.complexity.value);
    }
    function handleError(err) {
      if (!sotnRando.errors.isError(err)) {
        console.error(err)
      }
      elems.target.classList.remove('active')
      elems.target.classList.add('error')
      elems.status.innerText = err.message
    }
    function restoreItems() {
      sotnRando.items = cloneItems(items)
    }
    const start = new Date().getTime()
    CoreRandomizer.randomize(
      options,
      seed,
      elems.newGoals.value,
      elems.godspeedMode.checked,
      elems.mapColor.value,
      elems.alucardPalette.value,
      elems.alucardLiner.value,
      elems.accessibilityPatches.checked,
      haveChecksum,
      expectChecksum,
      CoreRandomizer.isDev(url),
      showSpoilers,
      null,
      null,
      fileOutputHandler,
      null,
      this.result
    ).then(function () {
      resetCopy();
      hideLoader();
      if (getVersion() === "0.0.0D") return; // Do not log local tests into the API.
      const duration = new Date().getTime() - start
      doApiRequest("/data/presets", "POST", {
        "preset": selectedPreset,
        "generation_time": duration,
        "app": CoreRandomizer.isDev(url) ? "dev-web" : "web",
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
    }).catch(handleError).finally(restoreItems)

    if (!elems.output.ppf.checked) {
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        // Verify vanilla bin.
        sotnRando.util.sha256(this.result).then(function (digest) {
          if (digest !== sotnRando.constants.digest) {
            throw new Error('Disc image is not a valid or vanilla backup')
          }
        }).then(randomize.bind(this)).catch(handleError).finally(restoreItems)
      })
      reader.readAsArrayBuffer(selectedFile)
    }
  }

  function clearHandler(event) {
    event.preventDefault()
    event.stopPropagation()
    expectChecksum = undefined

    // Reset values
    const resetFields = [
      'seed', 'enemyDropsArg', 'startingEquipmentArg', 'itemLocationsArg',
      'prologueRewardsArg', 'relicLocationsArg', 'writes', 'newGoals'
    ]
    resetFields.forEach(key => elems[key].value = '')

    // Enable toggles
    const clearFields = [
      'seed', 'presetId', 'enemyDrops', 'startingEquipment', 'itemLocations',
      'prologueRewards', 'relicLocations', 'relicLocationsSet', 'turkeyMode',
      'magicmaxMode', 'colorrandoMode', 'antiFreezeMode', 'mypurseMode',
      'iwsMode', 'fastwarpMode', 'noprologueMode', 'unlockedMode',
      'surpriseMode', 'enemyStatRandoMode', 'shopPriceRandoMode',
      'startRoomRandoMode', 'startRoomRando2ndMode', 'dominoMode', 'rlbcMode',
      'immunityPotionMode', 'godspeedMode', 'libraryShortcut', 'elemChaosMode',
      'simpleInputMode', 'devStashMode', 'seasonalPhrasesMode',
      'bossMusicSeparation', 'tournamentMode'
    ]
    clearFields.forEach(key => elems[key].disabled = false)

    // Special case
    elems.seasonalPhrasesMode.value = true
    elems.clear.classList.add('hidden')

    presetChange()
  }

  let animationDone = true

  function copyHandler(event) {
    event.preventDefault()
    event.stopPropagation()

    navigator.clipboard.writeText(spoilers.value)

    if (!animationDone) return

    animationDone = false
    elems.notification.classList.add('success')
    elems.notification.classList.remove('hide')

    setTimeout(() => elems.notification.classList.add('hide'), 2000)
    setTimeout(() => {
      elems.notification.classList.remove('success')
      animationDone = true
    }, 4000)
  }

  function showOlderHandler(event) {
    elems.showOlder.classList.add('hidden')
    elems.older.classList.remove('hidden')
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
    sotnRando.constants.songsList.forEach(song => {
      const option = document.createElement('option');
      option.value = song.toUpperCase().replace(/ /g, "_");
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
    }
  }

  function loadEvent() {
    for (const seasonalEvent of sotnRando.constants.seasonalEvents) {
      // Months are - 1 because JS months start from 0.
      if (isTodayBetweenDates(seasonalEvent.startMonth - 1, seasonalEvent.startDay, seasonalEvent.endMonth - 1, seasonalEvent.endDay)) {
        loadEventLogo(seasonalEvent);
        displayRandomSplashText(seasonalEvent);
        return;
      }
    }
  }

  //#region Initialize Browser

  const body = document.getElementsByTagName('body')[0]
  body.addEventListener('dragover', dragOverListener)
  body.addEventListener('dragleave', dragLeaveListener)
  body.addEventListener('drop', dropListener)

  loadEvent();
  resetState();
  elems.output.ppf.addEventListener('change', outputChange)
  elems.output.bin.addEventListener('change', outputChange)
  elems.file.addEventListener('change', fileChange)
  elems.form.addEventListener('submit', submitListener)
  elems.seed.addEventListener('change', seedChange)
  elems.presetId.addEventListener('change', presetIdChange)
  elems.complexity.addEventListener('change', complexityChange)
  elems.complexity.addEventListener('input', updateCurrentComplexityValue);
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

  elems.clear.addEventListener('click', clearHandler)
  elems.theme.addEventListener('change', themeChange)
  elems.mapColor.addEventListener('change', mapColorChange)
  elems.newGoals.addEventListener('change', newGoalsChange)
  elems.alucardPalette.addEventListener('change', alucardPaletteChange)
  elems.alucardLiner.addEventListener('change', alucardLinerChange)
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
  sortedPresets = sotnRando.presets
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

  document.getElementById('version').innerText = CoreRandomizer.getVersion();
  let options
  let seed
  loadOption('excludeSongsOption', showExcludeMenu, false);
  loadSongs();
  if (url.search.length) {
    const rs = sotnRando.util.optionsFromUrl(window.location.href)
    options = rs.options
    const applied = sotnRando.util.Preset.options(options)
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
      for (let i = 0; i < sotnRando.presets.length; i++) {
        if (sotnRando.presets[i].id === options.preset) {
          elems.presetId.selectedIndex = index
          break
        }
        if (!sotnRando.presets.hidden) {
          index++
        }
      }
      presetIdChange()

    } else {
      elems.presetId.selectedIndex = 0
    }
    presetChange()
    elems.tournamentMode.checked = options.tournamentMode;
    ChangeHandlers.tournamentModeChange()
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
    let enemyDropsArg = ''
    if (typeof (options.enemyDrops) === 'object') {
      enemyDropsArg = sotnRando.util.optionsToString({
        enemyDrops: options.enemyDrops,
      })
    }
    elems.enemyDropsArg.value = enemyDropsArg
    elems.startingEquipment.checked = applied.startingEquipment
    let startingEquipmentArg = ''
    if (typeof (options.startingEquipment) === 'object') {
      startingEquipmentArg = sotnRando.util.optionsToString({
        startingEquipment: options.startingEquipment,
      })
    }
    elems.startingEquipmentArg.value = startingEquipmentArg
    elems.itemLocations.checked = applied.itemLocations
    let itemLocationsArg = ''
    if (typeof (options.itemLocations) === 'object') {
      itemLocationsArg = sotnRando.util.optionsToString({
        itemLocations: options.itemLocations,
      })
    }
    elems.itemLocationsArg.value = itemLocationsArg
    elems.prologueRewards.checked = applied.prologueRewards
    let prologueRewardsArg = ''
    if (typeof (options.prologueRewards) === 'object') {
      prologueRewardsArg = sotnRando.util.optionsToString({
        prologueRewards: options.prologueRewards,
      })
    }
    elems.prologueRewardsArg.value = prologueRewardsArg
    elems.relicLocations.checked = !!applied.relicLocations
    let relicLocationsArg = ''
    if (typeof (options.relicLocations) === 'object') {
      // This is a hacky way to get all possible relic location locks
      // serialized, without including the relic locations extension.
      const relicOptions = sotnRando.util.optionsFromString(sotnRando.util.optionsToString({
        relicLocations: Object.assign({}, applied.relicLocations, {
          extension: sotnRando.constants.EXTENSION.SCENIC,
        }),
      }).replace(new RegExp(':?' + sotnRando.util.optionsToString({
        relicLocations: {
          extension: sotnRando.constants.EXTENSION.SCENIC,
        },
      }).slice(2)), ''))
      // Restore original extension from URL.
      if ('extension' in options.relicLocations) {
        relicOptions.relicLocations.extension
          = options.relicLocations.extension
      }
      relicLocationsArg = sotnRando.util.optionsToString(relicOptions)
    }
    elems.relicLocationsArg.value = relicLocationsArg
    elems.relicLocationsExtension.extended.checked =
      applied.relicLocations
      && applied.relicLocations.extension === sotnRando.constants.EXTENSION.EXTENDED
    elems.relicLocationsExtension.scenic.checked =
      applied.relicLocations
      && applied.relicLocations.extension === sotnRando.constants.EXTENSION.SCENIC
    elems.relicLocationsExtension.guarded.checked =
      applied.relicLocations
      && applied.relicLocations.extension === sotnRando.constants.EXTENSION.GUARDED
    elems.relicLocationsExtension.guardedplus.checked =
      applied.relicLocations
      && applied.relicLocations.extension === sotnRando.constants.EXTENSION.GUARDEDPLUS
    elems.relicLocationsExtension.equipment.checked =
      applied.relicLocations
      && applied.relicLocations.extension === sotnRando.constants.EXTENSION.EQUIPMENT
    elems.relicLocationsExtension.classic.checked =
      applied.relicLocations
      && !applied.relicLocations.extension
    relicLocationsExtensionChange()
    let writes = ''
    if (options.writes) {
      writes = sotnRando.util.optionsToString({ writes: options.writes })
    }
    elems.writes.value = writes
    elems.stats.checked = applied.stats
    ChangeHandlers.statsChange();
    elems.music.checked = applied.music
    elems.turkeyMode.checked = applied.turkeyMode
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

    let relicLocationsExtension =
      localStorage.getItem('relicLocationsExtension')
    if (typeof (relicLocationsExtension) === 'string') {
      switch (relicLocationsExtension) {
        case sotnRando.constants.EXTENSION.GUARDED:
          elems.relicLocationsExtension.guarded.checked = true
          break
        case sotnRando.constants.EXTENSION.GUARDEDPLUS:
          elems.relicLocationsExtension.guardedplus.checked = true
          break
        case sotnRando.constants.EXTENSION.EQUIPMENT:
          elems.relicLocationsExtension.equipment.checked = true
          break
        case sotnRando.constants.EXTENSION.EXTENDED:
          elems.relicLocationsExtension.extended.checked = true
          break
        case sotnRando.constants.EXTENSION.SCENIC:
          elems.relicLocationsExtension.scenic.checked = true
          break
        default:
          elems.relicLocationsExtension.classic.checked = true
          break
      }
    } else if (sotnRando.constants.defaultExtension) {
      elems.relicLocationsExtension[sotnRando.constants.defaultExtension].checked = true
    } else {
      elems.relicLocationsExtension.classic.checked = true
    }
    relicLocationsExtensionChange()
    let presetId = localStorage.getItem('presetId')
    if (typeof (presetId) !== 'string') {
      presetId = 'casual'
    }
    let index = 0
    for (let i = 0; i < sotnRando.presets.length; i++) {
      if (sotnRando.presets[i].id === presetId) {
        elems.presetId.selectedIndex = index
        break
      }
      if (!sotnRando.presets.hidden) {
        index++
      }
    }
    presetIdChange()
    loadOption('preset', presetChange, true)
  }
  if (CoreRandomizer.isDev(url)) {
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
  // Load checkboxes values and their custom change handlers.
  const checkboxesToStore = document.querySelectorAll('[data-store-checkbox="true"], [data-store-checkbox="false"]');
  checkboxesToStore.forEach(el => {
    el.addEventListener('change', saveOption);
    loadCheckboxOption(el);
    let customChangeFunction = el.getAttribute('data-custom-change');
    if (customChangeFunction) {
      el.addEventListener('change', ChangeHandlers[customChangeFunction]);
      ChangeHandlers[customChangeFunction]();
    }
  });
  loadOption('theme', themeChange, 'menu')
  loadOption('mapColor', mapColorChange, 'menu')
  loadOption('newGoals', newGoalsChange, 'menu')
  loadOption('alucardPalette', alucardPaletteChange, 'menu')
  loadOption('alucardLiner', alucardLinerChange, 'menu')
  setTimeout(function () {
    const els = document.getElementsByClassName('tooltip')
    Array.prototype.forEach.call(els, function (el) {
      el.classList.remove('hidden')
    })
  })
  presetIdChange()

  //#endregion
})(typeof (window) !== 'undefined' ? window : null)
