window.BrowserUtils = window.BrowserUtils || {};
const apiUrl = "https://api.sotn.io";
const sotnRando = window.sotnRando;

BrowserUtils.info = null;

BrowserUtils.doApiRequest = async function doApiRequest(reqPath, method, body) {
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
            console.log(`Error reaching path ${reqPath}.`)
        }
        data = await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return data;
}

BrowserUtils.elemById = function elById(id) {
    return document.getElementById(id);
}

BrowserUtils.elemTextContent = function elemTextContent(id) {
    return BrowserUtils.elemById(id).textContent;
}

BrowserUtils.elemByQuery = function elemByQuery(query) {
    return document.querySelector(`#${query}`);
}

BrowserUtils.kebabToCamel = function kebabToCamel(str) {
    return str.replace(/-./g, match => match[1].toUpperCase());
}

BrowserUtils.loadOption = function loadOption(name, changeHandler, defaultValue) {
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

BrowserUtils.loadCheckboxOption = function loadCheckboxOption(elem) {
    const value = localStorage.getItem(kebabToCamel(elem.id))
    if (elem.type === 'checkbox') {
        if (typeof (value) === 'string') {
            elem.checked = value === 'true'
        } else {
            elem.checked = elem.getAttribute('data-store-checkbox') === 'true'
        }
    }
}

BrowserUtils.saveOption = function saveOption(event) {
    localStorage.setItem(kebabToCamel(event.currentTarget.id), elems.tournamentMode.checked)
}

BrowserUtils.showSpoilers = function showSpoilers(info, startTime) {
    let verbosity
    if (elems.showSolutions.checked) {
        verbosity = 4
    } else if (elems.showRelics.checked) {
        verbosity = 3
    } else {
        verbosity = 2
    }
    const endTime = performance.now()
    console.log("Seed generated in ", endTime - startTime, "ms")
    elems.spoilers.value = sotnRando.util.formatInfo(info, verbosity)
    if (elems.showSpoilers.checked
        && elems.spoilers.value.match(/[^\s]/)) {
        elems.spoilersContainer.style.display = ''
        elems.spoilersContainer.classList.remove('hide')
    }
}
function toKebabCase(str) {
  return str.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
}

function getCurrentOptions() {
  const allOptions = [
    'tournamentMode', 'colorrandoMode', 'magicmaxMode', 'antiFreezeMode',
    'mypurseMode', 'iwsMode', 'fastwarpMode', 'itemNameRandoMode',
    'noprologueMode', 'unlockedMode', 'surpriseMode', 'enemyStatRandoMode',
    'shopPriceRandoMode', 'startRoomRandoMode', 'startRoomRando2ndMode',
    'dominoMode', 'rlbcMode', 'immunityPotionMode', 'godspeedMode',
    'libraryShortcut', 'elemChaosMode', 'simpleInputMode', 'devStashMode',
    'seasonalPhrasesMode', 'bossMusicSeparation', 'music', 'appendSeed',
    'excludeSongsOption', 'itemLocations', 'stats', 'prologueRewards',
    'startingEquipment', 'accessibilityPatches'
  ];

  const options = {};
  allOptions.forEach(key => {
    const input = document.getElementById(toKebabCase(key));
    options[key] = input?.checked ?? false;
  });

  // Preset name
  const presetSelect = document.getElementById('preset-id');
  options.preset = presetSelect?.options[presetSelect.selectedIndex]?.text || 'Unknown';

  // Complexity
  const complexitySelect = document.getElementById('complexity');
  options.complexity = complexitySelect?.value || 'Not selected';

  // Relic Extension from radio buttons in .relic-location
const extensionRadios = document.querySelectorAll('input[name="extension"]');
options.extension = 'None'; // Default fallback

extensionRadios.forEach(radio => {
  if (radio.checked) {
    options.extension = radio.value;
  }
});

  return options;
}

function formatSpoilerLog(options) {
  const enabled = [];
  const disabled = [];

  Object.entries(options).forEach(([key, value]) => {
    if (['preset', 'complexity', 'extension'].includes(key)) return;
    (value ? enabled : disabled).push(key);
  });

  return [
    '=== Options Log ===',
    `Preset Selected: ${options.preset}`,
    `Complexity Target: ${options.complexity}`,
    `Relic Extension: ${options.extension}`,
    '',
    `Enabled Options: ${enabled.length ? enabled.join(', ') : 'None'}`,
    `Disabled Options: ${disabled.length ? disabled.join(', ') : 'None'}`
  ].join('\n');
}

function showSpoilerLog() {
  const currentOptions = getCurrentOptions();
  localStorage.setItem('lastSeedOptions', JSON.stringify(currentOptions));
  const log = formatSpoilerLog(currentOptions);
  document.getElementById('spoilerLogOutput').textContent = log;
}

function showPreviousSeed() {
  const saved = localStorage.getItem('lastSeedOptions');
  if (!saved) {
    document.getElementById('spoilerLogOutput').textContent = 'No previous seed data available.';
    return;
  }
  const options = JSON.parse(saved);
  const log = formatSpoilerLog(options);
  document.getElementById('spoilerLogOutput').textContent = log;
}

BrowserUtils.randomizedFilename = function randomizedFilename(filename, seed) {
    const lastPeriodIdx = filename.lastIndexOf('.')
    const insertIdx = lastPeriodIdx === -1 ? filename.length : lastPeriodIdx
    return [
        filename.slice(0, insertIdx),
        ' (' + seed + ')',
        filename.slice(insertIdx),
    ].join('')
}

BrowserUtils.fileOutputHandler = function fileOutputHandler(ck, seed, result) {
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
            elems.download.download = BrowserUtils.randomizedFilename(fileName, seed)
        }
    } else {
        let resultName = "SotN-Randomizer"
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
}

BrowserUtils.hideSpoilers = function hideSpoilers() {
    elems.spoilersContainer.classList.add('hide')
}

//#region Change Handlers
BrowserUtils.ChangeHandlers = {
    tournamentModeChange: function tournamentModeChange() {
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
    },
    itemNameRandoModeChange: function itemNameRandoModeChange() {
        if (elems.itemNameRandoMode.checked === true) {
            elems.stats.checked = true
        }
    },
    enemyStatRandoModeChange: function enemyStatRandoModeChange() {
        if (elems.enemyStatRandoMode.checked) {
            elems.elemChaosMode.disabled = false
        } else {
            elems.elemChaosMode.checked = false
            elems.elemChaosMode.disabled = true
        }
    },
    elemChaosModeChange: function elemChaosModeChange() {
        if (elems.elemChaosMode.checked === true) {
            elems.enemyStatRandoMode.checked = true
        }
    },
    spoilersChange: function spoilersChange() {
        if (elems.showSpoilers.checked && info) {
            BrowserUtils.showSpoilers()
            if (!elems.tournamentMode.checked) {
                elems.showRelics.disabled = false
            }
        } else {
            BrowserUtils.hideSpoilers()
            elems.showRelics.checked = false
            elems.showRelics.disabled = true
            elems.showSolutions.checked = false
            elems.showSolutions.disabled = true
        }
    },
    showRelicsChange: function showRelicsChange() {
        if (elems.showRelics.checked) {
            elems.showSolutions.disabled = false
        } else {
            elems.showSolutions.checked = false
            elems.showSolutions.disabled = true
        }
        if(info) BrowserUtils.showSpoilers();
    },
    showSolutionsChange: function showSolutionsChange() {
        if(info) BrowserUtils.showSpoilers();
    },
    relicLocationsChange: function relicLocationsChange() {
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
                relicLocationsExtensionCache === sotnRando.constants.EXTENSION.GUARDED
            elems.relicLocationsExtension.guardedplus.checked =
                relicLocationsExtensionCache === sotnRando.constants.EXTENSION.GUARDEDPLUS
            elems.relicLocationsExtension.equipment.checked =
                relicLocationsExtensionCache === sotnRando.constants.EXTENSION.EQUIPMENT
            elems.relicLocationsExtension.scenic.checked =
                relicLocationsExtensionCache === sotnRando.constants.EXTENSION.SCENIC
            elems.relicLocationsExtension.extended.checked =
                relicLocationsExtensionCache === sotnRando.constants.EXTENSION.EXTENDED
            elems.relicLocationsExtension.classic.checked =
                !relicLocationsExtensionCache
        }
    },
    statsChange: function statsChange() {
        if (elems.stats.checked) {
            elems.itemNameRandoMode.disabled = false
        } else {
            elems.itemNameRandoMode.checked = false
            elems.itemNameRandoMode.disabled = true
        }
    }
}
//#endregion

Object.assign(window, BrowserUtils);