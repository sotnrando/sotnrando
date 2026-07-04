
(function (window) {
  //#region Constants & General Variables
  const url = new URL(window.location.href)
  const body = document.getElementsByTagName('body')[0]
  const items = cloneItems(sotnRando.items)
  let animationDone = true
  let currSeed
  let expectChecksum
  let haveChecksum
  let downloadReady
  let selectedFile
  let mapColorLock
  let newGoalsLock
  let alucardPaletteLock
  let alucardLinerLock
  let options
  let seed
  let applied
  let override
  let presetDataJson = [];

  async function loadPresetData() {
    const res = await fetch('./preset-data.json');
    presetDataJson = await res.json();
  }


  //#endregion

  //#region Helper Functions & UI Controllers

  function displayRandomSplashText(seasonalEvent) {
    if (!seasonalEvent.toolSplashPhrases) return;
    const splashPhrases = seasonalEvent.toolSplashPhrases;
    const randomSplashIndex = Math.floor(Math.random() * splashPhrases.length);
    document.getElementById("splashTextDisplay").textContent = splashPhrases[randomSplashIndex];
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
    window.selectedFile = selectedFile
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

  function addDefaultEventListeners() {
    // --- Window events ---
    window.addEventListener("load", () => {
      if (mapColorSelect.value) updateMapColorPreview();
      if (paletteSelect.value || linerSelect.value) updateAlucardPreview();
    });

    // --- Map color preview ---
    mapColorSelect.addEventListener("click", updateMapColorPreview);

    // --- Drag & Drop ---
    body.addEventListener("dragover", dragOverListener);
    body.addEventListener("dragleave", dragLeaveListener);
    body.addEventListener("drop", dropListener);

    // --- Output type changes ---
    [elems.output.ppf, elems.output.bin].forEach(el =>
      el.addEventListener("change", outputChange)
    );

    // --- File + form ---
    elems.file.addEventListener("change", fileChange);
    elems.form.addEventListener("submit", submitListener);

    // --- Seed + preset + complexity ---
    elems.seed.addEventListener("change", seedChange);
    elems.presetId.addEventListener("change", presetIdChange);
    elems.complexity.addEventListener("change", complexityChange);
    elems.complexity.addEventListener("input", updateCurrentComplexityValue);

    // --- Relic extension radios ---
    Object.values(elems.relicLocationsExtension).forEach(el =>
      el.addEventListener("change", relicLocationsExtensionChange)
    );

    // --- Buttons ---
    elems.clear.addEventListener("click", clearHandler);
    elems.copy.addEventListener("click", copyHandler);

    // --- Theme + map color + goals ---
    elems.theme.addEventListener("change", themeChange);
    elems.mapColor.addEventListener("change", mapColorChange);
    elems.newGoals.addEventListener("change", newGoalsChange);

    // --- Alucard palette + liner ---
    elems.alucardPalette.addEventListener("change", alucardPaletteChange);
    elems.alucardLiner.addEventListener("change", alucardLinerChange);

    // --- Alucard preview selects ---
    paletteSelect.addEventListener("change", updateAlucardPreview);
    linerSelect.addEventListener("change", updateAlucardPreview);

    // --- Exclude songs ---
    elems.excludeSongsOption.addEventListener("change", showExcludeMenu);
    elems.esMoveToRight.addEventListener("click", excludeSong);
    elems.esMoveToLeft.addEventListener("click", includeSong);
  }

  function loadPastOptions() {
    // --- Complexity ---
    loadOption("complexity", complexityChange, 7);

    // --- Relic Locations Extension ---
    const EXT = sotnRando.constants.EXTENSION;
    const savedExt = localStorage.getItem("relicLocationsExtension");

    const extensionMap = {
      [EXT.GUARDED]: "guarded",
      [EXT.GUARDEDPLUS]: "guardedplus",
      [EXT.EQUIPMENT]: "equipment",
      [EXT.EXTENDED]: "extended",
      [EXT.SCENIC]: "scenic",
    };

    if (typeof savedExt === "string") {
      const key = extensionMap[savedExt] || "classic";
      elems.relicLocationsExtension[key].checked = true;
    } else if (sotnRando.constants.defaultExtension) {
      elems.relicLocationsExtension[sotnRando.constants.defaultExtension].checked = true;
    } else {
      elems.relicLocationsExtension.classic.checked = true;
    }

    relicLocationsExtensionChange();

    // --- Preset ID ---
    let presetId = localStorage.getItem("presetId");
    if (typeof presetId !== "string") presetId = "casual";

    const index = sotnRando.presets.findIndex(p => p.id === presetId);
    elems.presetId.selectedIndex = index >= 0 ? index : 0;

    presetIdChange();

    // --- Load preset option ---
    loadOption("preset", presetChange, true);
  }

  function showDevWarning() {
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

  function loadSeedType() {
    const output = localStorage.getItem('output')
    if (output === 'ppf') {
      elems.output.ppf.checked = true
    } else {
      elems.output.bin.checked = true
    }
  }

  function loadVersion() {
    CoreRandomizer.getVersion().then(version => {
      document.getElementById('version').innerText = version;
    });
  }

  function addCheckboxesHandlers() {
  const checkboxesToStore = document.querySelectorAll('[data-store-checkbox="true"], [data-store-checkbox="false"]');
  checkboxesToStore.forEach(el => {
    el.addEventListener('change', saveOption);
    loadCheckboxOption(el);

    const customChangeFunction = el.getAttribute('data-custom-change');
    if (customChangeFunction && typeof ChangeHandlers[customChangeFunction] === 'function') {
      el.addEventListener('change', ChangeHandlers[customChangeFunction]);
      // Optional: only run once if you need initial state
      ChangeHandlers[customChangeFunction]();
    }
  });
}


  function loadMenuOptions() {
    loadOption('theme', themeChange, 'menu')
    loadOption('mapColor', mapColorChange, 'menu')
    loadOption('newGoals', newGoalsChange, 'menu')
    loadOption('alucardPalette', alucardPaletteChange, 'menu')
    loadOption('alucardLiner', alucardLinerChange, 'menu')
  }

  function showHiddenTooltips() {
    setTimeout(function () {
      const els = document.getElementsByClassName('tooltip')
      Array.prototype.forEach.call(els, function (el) {
        el.classList.remove('hidden')
      })
    })
  }

  //#endregion

  //#region Event Handlers & Listeners
  function outputChange(event) {
    const isPPF = elems.output.ppf.checked;

    // Toggle visibility
    elems.target.classList.toggle('hide', isPPF);
    if (!isPPF) elems.target.classList.remove('hidden');

    // Persist output type
    localStorage.setItem('output', isPPF ? 'ppf' : 'bin');

    // Enable/disable Randomize button
    elems.randomize.disabled = !isPPF;

    // Animate only when triggered by user interaction
    if (event) elems.target.classList.add('animate');
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
    if (!paletteSelect || !linerSelect || !alucardPaletteDisplay || !alucardLinerDisplay) return;

    const FRAME_WIDTH = 96;   // width of each palette/liner frame
    const FRAME_HEIGHT = 64;  // height of each row

    // Calculate X offsets
    const paletteX = paletteSelect.selectedIndex * FRAME_WIDTH;
    const linerX = linerSelect.selectedIndex * FRAME_WIDTH;

    // Y offsets
    const PALETTE_Y = 0;            // top row
    const LINER_Y = FRAME_HEIGHT; // bottom row

    // Apply background-position to the DIVs
    alucardPaletteDisplay.style.backgroundPosition = `-${paletteX}px -${PALETTE_Y}px`;
    alucardLinerDisplay.style.backgroundPosition = `-${linerX}px -${LINER_Y}px`;
  }

  function updateMapColorPreview() {
    // Calculate current position based on the selected options
    let mapColorIndex = mapColorSelect.selectedIndex;
    mapColorDisplay.style.backgroundPositionX = (432 - (mapColorIndex * 48)) + "px";
  }

  function presetIdChange() {

    // 1. Resolve selected preset from the ACTIVE dropdown elements, NOT the raw array
    const optionsMeta = sotnRando.optionsArray;
    let idx = elems.presetId.selectedIndex;
    if (idx < 0) idx = 0;

    // Always fallback to reading the actual string .value attribute of the sorted list option
    const id = elems.presetId.options
      ? elems.presetId.options[idx].value
      : (elems.presetId.childNodes[idx] ? elems.presetId.childNodes[idx].value : "casual");

    // Dynamically find the matching data structure via its unique ID tag
    const preset = sotnRando.presets.find(p => p.id === id) || sotnRando.presets[0];

    // 2. Update preset metadata UI 
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

    // 3. Compute complexity 
    const options = preset.options();
    let complexity = Object.keys(options.relicLocations || {}).reduce((acc, key) => {
      return /^[0-9]+(-[0-9]+)?/.test(key) ? key.split("-").shift() : acc;
    }, 1);

    adjustMaxComplexity();
    elems.complexity.value = complexity;
    elems.complexityCurrentValue.innerText = `(${complexity})`;

    // 4. GOAL LOGIC (data-driven from preset-data.json)
    const presetData = presetDataJson.find(p => p.id === preset.id);
    if (presetData) {
      const { defaultGoal, compatibleGoals } = presetData;

      // Set default goal
      elems.newGoals.value = defaultGoal || "default";
      localStorage.setItem("newGoals", elems.newGoals.value);
      newGoalsLock = elems.newGoals.value;

      // Enable only compatible goals
      const goalOptions = elems.newGoals.options;
      for (let i = 0; i < goalOptions.length; i++) {
        const opt = goalOptions[i];
        opt.disabled = !compatibleGoals.includes(opt.value);
      }
    }

    // 5. Apply preset options (data-driven) 
    function applyOptions(options) {
      optionsMeta.forEach(opt => {
        const el = elems[opt.longId];
        if (!el) return;

        const presetValue = options[opt.longId];

        // Only apply checkbox logic to checkboxes
        if (el.type === "checkbox") {

          const isStructured =
            opt.longId === "startingEquipment" ||
            opt.longId === "enemyDrops" ||
            opt.longId === "itemLocations" ||
            opt.longId === "prologueRewards";

          if (isStructured && typeof presetValue === "object") {
            el.checked = true;
            return;
          }

          if (!(opt.longId in options)) {
            el.checked = false;
            return;
          }

          el.checked = !!presetValue;
        }

        // Sliders, selects, radios, etc. should NOT be auto-checked
      });
    }


    applyOptions(options);
    relicLocationsExtensionChange();

    // 6. Enforce required/incompatible options 
    function enforceDependencies() {
      optionsMeta.forEach(opt => {
        const el = elems[opt.longId];
        if (!el) return;
        const isOn = el.checked;

        opt.requiredOptions.forEach(req => {
          const reqEl = elems[req];
          if (!reqEl || reqEl._presetLocked) return;

          if (isOn) {
            if (req === "startingStats" && !preset.options().startingStats) {
              return;
            }

            reqEl.checked = true;
            reqEl.disabled = true;
          } else {
            reqEl.disabled = false;
          }
        });

        opt.incompatibleOptions.forEach(bad => {
          const badEl = elems[bad];
          if (isOn && badEl && !badEl._presetLocked) badEl.checked = false;
        });
      });
    }

    enforceDependencies();

    // 7. Disable AND uncheck options based on preset incompatibilities 
    function applyPresetLocks() {
      optionsMeta.forEach(opt => {
        const el = elems[opt.longId];
        if (!el) return;

        const incompatible = opt.incompatiblePresets.includes(preset.id);

        if (incompatible) {
          el.checked = false;
          el.disabled = true;
          el._presetLocked = true;
        } else {
          el._presetLocked = false;
        }
      });
    }

    applyPresetLocks();

    // 8. Disable options incompatible with preset's enabled options
    function applyOptionLocks() {
      const presetOptions = preset.options();

      optionsMeta.forEach(opt => {
        const el = elems[opt.longId];
        if (!el) return;

        if (el._presetLocked) return;

        let shouldDisable = false;

        for (const enabledOptId of Object.keys(presetOptions)) {
          const enabledMeta = optionsMeta.find(o => o.longId === enabledOptId);
          if (!enabledMeta) continue;

          if (enabledMeta.incompatibleOptions.includes(opt.longId)) {
            shouldDisable = true;
            break;
          }
        }

        el.disabled = shouldDisable;
      });
    }

    applyOptionLocks();

    // 9. Tournament Mode auto-lock 
    const isTeLocked =
      /-spr[0-9]{2}te$/.test(preset.id) ||
      /-win[0-9]{2}te$/.test(preset.id) ||
      /-aut[0-9]{2}te$/.test(preset.id) ||
      /-sum[0-9]{2}te$/.test(preset.id);

    if (isTeLocked) {
      elems.tournamentMode.checked = true;

      optionsMeta.forEach(opt => {
        const el = elems[opt.longId];
        if (!el || el._presetLocked) return;
        el.disabled = true;
      });

      document.querySelectorAll("input[type='radio']").forEach(r => r.disabled = true);
    } else {
      optionsMeta.forEach(opt => {
        const el = elems[opt.longId];
        if (!el || el._presetLocked) return;
        el.disabled = false;
      });

      document.querySelectorAll("input[type='radio']").forEach(r => r.disabled = false);
    }

    ChangeHandlers.tournamentModeChange();
    // FINAL ENFORCEMENT: Elemental Chaos only allowed if Enemy Stats is ON
    if (!elems.enemyStatRandoMode.checked) {
      elems.elemChaosMode.checked = false;
      elems.elemChaosMode.disabled = true;
    } else {
      elems.elemChaosMode.disabled = false;
    }
    elems.seasonalPhrasesMode.checked = true;
    elems.bossMusicSeparation.checked = true;
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
    // EQUIPMENT and SCENIC extensions allow more complex logic paths,
    // so they raise the maximum allowed complexity from 11 to 15.
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

  function statMaxChange() {
    elems.statMaxCurrentValue.innerText = `(${elems.statMax.value})`;
  }

  function statMaxSlider() {
    const saved = localStorage.getItem('statMax') || "25";
    elems.statMax.value = saved;
    elems.statMaxCurrentValue.innerText = `(${saved})`;

    elems.statMax.addEventListener('input', statMaxChange);
  }


  document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('complexity');
    const currentValueElement = document.getElementById('complexityCurrentValue');

    if (slider && currentValueElement) {
      slider.addEventListener('input', () => {
        const value = parseInt(slider.value, 10);
        currentValueElement.textContent = value;
        if (value >= 10) {
          alert(`Warning: You are currently attempting to set minimum complexity to ${value}, which exceeds the recommended minimum. Increasing complexity does not make the seed more difficult, but rather enforces a more linear logic path. Additionally, higher minimum complexity can significantly increase seed generation time. While such settings are technically supported, they are generally discouraged.`);
        }
      });
    }
  });


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

    body.classList.remove('blue',
      'light',
      'dark')
    body.classList.add(selected)
  }

  function mapColorChange() {
    localStorage.setItem('mapColor', elems.mapColor.value)
    mapColorLock = elems.mapColor.value
  }

  function newGoalsChange() {
    const { presetId, newGoals } = elems;

    // Get preset data from preset-data.json
    const presetData = presetDataJson.find(p => p.id === presetId.value);
    if (!presetData) return;

    const { defaultGoal, compatibleGoals } = presetData;

    // If user selects a goal that is not compatible, revert to default
    if (!compatibleGoals.includes(newGoals.value)) {
      newGoals.value = defaultGoal || "default";
    }

    // Save
    localStorage.setItem("newGoals", newGoals.value);
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
      window.selectedFile = selectedFile
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
    // Some browsers expose dropped files via dataTransfer.items,
    // others via dataTransfer.files. Support both for compatibility.
    event.preventDefault()
    event.stopPropagation()
    resetState()
    if (event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const item = event.dataTransfer.items[i]
        if (item.kind === 'file') {
          selectedFile = item.getAsFile()
          window.selectedFile = selectedFile
        }
      }
    } else {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        selectedFile = event.dataTransfer.files[i]
        window.selectedFile = selectedFile
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
    const preset = sotnRando.presets[elems.presetId.selectedIndex];

    const options = {
      preset: preset.id,
      relicLocations: getFormRelicLocations()
    };

    // Read every checkbox directly from elems
    for (const [key, elem] of Object.entries(elems)) {
      if (!elem) continue;

      // Only process checkboxes
      if (elem instanceof HTMLInputElement && elem.type === "checkbox") {
        options[key] = elem.checked;
      }
    }

    return options;
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

  function clearHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    expectChecksum = undefined;

    // Reset simple text fields
    const resetFields = [
      'seed',
      'enemyDropsArg',
      'startingEquipmentArg',
      'itemLocationsArg',
      'prologueRewardsArg',
      'relicLocationsArg',
      'writes',
      'newGoals'
    ];
    resetFields.forEach(key => elems[key].value = '');

    // Reset all "opt" fields from optionsArray (enemyDrops, itemLocations, etc.)
    sotnRando.optionsArray.forEach(opt => {
      if (opt.argvFlag === "opt" && opt.htmlElement) {
        if (elems[opt.htmlElement]) {
          elems[opt.htmlElement].value = "";
        }
      }
    });

    // Re-enable all UI toggles from optionsArray
    sotnRando.optionsArray.forEach(opt => {
      const html = opt.htmlElement;
      if (!html) return; // skip options without UI elements

      if (elems[html]) {
        elems[html].disabled = false;
      }
    });

    // Seasonal phrases special case
    if (elems.seasonalPhrasesMode) {
      elems.seasonalPhrasesMode.value = true;
    }

    // Hide clear button
    elems.clear.classList.add('hidden');

    // Trigger preset refresh
    presetChange();
  }


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

  //#endregion

  //#region Randomization Step Process

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

  function loadPresetOptions(formOptions) {
    for (let preset of sotnRando.presets) {
      if (preset.override) {
        applied = preset.options()
        override = true
        break
      }
    }
    // Get user specified options.
    if (!override) {
      applied = sotnRando.util.Preset.options(formOptions)
    }
    if (elems.complexity.value) {
      deleteOriginalComplexity(applied, elems.complexity.value);
    }
  }

  function submitListener(event) {
    // This is the logic that is executed when you press the Randomize button.
    // Get seed.
    event.preventDefault()
    event.stopPropagation()
    // Disable UI.
    disableDownload()
    // Show loading bar.
    showLoader()

    // If today is april fools, force the april fools preset.
    let selectedPreset
    if (isAprilFools) {
      elems.presetId.value = "april-fools";
      presetIdChange();
    }

    selectedPreset = elems.presetId.childNodes[elems.presetId.selectedIndex].value
    self.sotnRando.selectedPreset = selectedPreset

    currSeed = generateSeedName()
    if (elems.seed.value.length) {
      currSeed = elems.seed.value
    }
    // Get options.
    let options = getFormOptions()
    const start = new Date().getTime()
    if (elems.output.ppf.checked) {
      CoreRandomizer.randomize(
        options,
        currSeed,
        elems.newGoals.value,
        elems.statMax.value,
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
    } else {
      const reader = new FileReader()
      reader.addEventListener('load', function () {
        // Verify vanilla bin.
        sotnRando.util.sha256(this.result).then(function (digest) {
          if (digest !== sotnRando.constants.digest) {
            throw new Error('Disc image is not a valid or vanilla backup')
          }
        }).then(randomize(options,
          currSeed,
          elems.newGoals.value,
          elems.statMax.value,
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
        )).catch(handleError).finally(restoreItems)
      })
      reader.readAsArrayBuffer(selectedFile)
    }
  }

  //#endregion

  //#region Initialize Process (Load Browser)

  function initializeBrowser() {
    // Initial render
    updateAlucardPreview();
    loadEvent();
    resetState();
    addDefaultEventListeners();
    // Load presets
    loadPresets();
    loadVersion();

    loadOption('excludeSongsOption', showExcludeMenu, false);
    loadSongs();
    if (url.search.length) { // If the URL includes query params, it means that it is a URL preloaded with options.
      loadOptionsFromUrl();
    } else {
      loadPastOptions();
    }
    if (CoreRandomizer.isDev(url)) {
      showDevWarning();
    }
    loadSeedType(); // Tells whether to use PPF or BIN
    outputChange();
    // Load checkboxes values and their custom change handlers.
    addCheckboxesHandlers();
    loadMenuOptions();
    showHiddenTooltips();
    presetIdChange();
    statMaxSlider();
  }
  loadPresetData().then(() => {
    // Now safe to initialize everything
    presetIdChange();
    // any other startup logic
  });


  initializeBrowser();
  //#endregion
})(typeof (window) !== 'undefined' ? window : null)
