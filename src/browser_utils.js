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

BrowserUtils.toKebabCase = function toKebabCase(str) {
    return str.replace(/[A-Z]/g, letter => '-' + letter.toLowerCase())
}

BrowserUtils.getCurrentOptions = function getCurrentOptions() {
    const keys = [
        'tournamentMode', 'colorrandoMode', 'magicmaxMode', 'antiFreezeMode',
        'mypurseMode', 'iwsMode', 'fastwarpMode', 'itemNameRandoMode',
        'noprologueMode', 'unlockedMode', 'surpriseMode', 'enemyStatRandoMode',
        'shopPriceRandoMode', 'startRoomRandoMode', 'startRoomRando2ndMode',
        'dominoMode', 'rlbcMode', 'immunityPotionMode', 'godspeedMode',
        'libraryShortcut', 'elemChaosMode', 'easyMode', 'devStashMode',
        'seasonalPhrasesMode', 'music', 'bossMusicSeparation', 'singleHitGearMode', 
        'music', 'appendSeed', 'excludeSongsOption', 'itemLocations', 'stats', 
        'prologueRewards', 'startingEquipment', 'accessibilityPatches'
    ]

    const options = {}
    keys.forEach(key => {
        const input = document.getElementById(BrowserUtils.toKebabCase(key))
        options[key] = input?.checked ?? false
    })

    options.preset = document.getElementById('preset-id')?.selectedOptions?.[0]?.text || 'Unknown'
    options.complexity = document.getElementById('complexity')?.value || 'Not selected'
    options.goal = document.getElementById('newGoals')?.selectedOptions?.[0]?.text || 'Unknown'
    options.extension = [...document.querySelectorAll('input[name="extension"]')]
        .find(r => r.checked)?.value || 'None'

    return options
}

BrowserUtils.formatOptionsLog = function formatOptionsLog(options) {
    const enabled = []
    const disabled = []

    Object.entries(options).forEach(([key, val]) => {
        if (['preset', 'complexity', 'extension', 'goal'].includes(key)) return
        ;(val ? enabled : disabled).push(key)
    })

    return [
        '=== Options Log ===',
        `Preset Selected: ${options.preset}`,
        `Complexity Target: ${options.complexity}`,
        `Relic Extension: ${options.extension}`,
        `Goal Selected: ${options.goal}`,
        '',
        `Enabled Options: ${enabled.length ? enabled.join(', ') : 'None'}`,
        `Disabled Options: ${disabled.length ? disabled.join(', ') : 'None'}`
    ].join('\n')
}

BrowserUtils.showOptionsLog = function showOptionsLog() {
    const opts = BrowserUtils.getCurrentOptions()
    localStorage.setItem('lastSeedOptions', JSON.stringify(opts))
    document.getElementById('optionsLogOutput').textContent = BrowserUtils.formatOptionsLog(opts)
}

BrowserUtils.showPreviousSeed = function showPreviousSeed() {
    const saved = localStorage.getItem('lastSeedOptions')
    if (!saved) {
        document.getElementById('optionsLogOutput').textContent = 'No previous seed data available.'
        return
    }
    const opts = JSON.parse(saved)
    document.getElementById('optionsLogOutput').textContent = BrowserUtils.formatOptionsLog(opts)
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

BrowserUtils.loadPresets = function loadPresets() {
    let sortedPresets = sotnRando.presets
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
}

BrowserUtils.cloneItems = function cloneItems(items) {                     //Saves previous selections
    return items.map(function (item) {
        const clone = Object.assign({}, item)
        delete clone.tiles
        if (item.tiles) {
            clone.tiles = item.tiles.slice()
        }
        return clone
    })
}

//#region Change Handlers
BrowserUtils.ChangeHandlers = {
    tournamentModeChange: function tournamentModeChange() {
        if (elems.tournamentMode.checked) {
            elems.showRelics.checked = false
            elems.showRelics.disabled = true
            elems.showSolutions.checked = false
            elems.showSolutions.disabled = true
            elems.easyMode.checked = false
            elems.easyMode.disabled = true
        } else {
            elems.showRelics.disabled = false
            elems.easyMode.disabled = false
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
        if (info) BrowserUtils.showSpoilers();
    },
    showSolutionsChange: function showSolutionsChange() {
        if (info) BrowserUtils.showSpoilers();
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