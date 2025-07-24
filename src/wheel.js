const presetsByCategory = {
    tournament: ['Big Toss', 'Recycler', 'Hitman', 'Seeker', 'Battle Mage'],
    evergreen: [
        'Adventure', 'Bat Master', 'Boss Rush', 'Bounty Hunter', 'Casual', 'Crash Course',
        'Expedition', 'Glitch', 'Guarded Og', 'Lycanthrope', 'Nimble', 'Og', 'Safe',
        'Warlock'
    ],
    bountyHunter: [
        'Bounty Hunter', 'Target Confirmed', 'Hitman', 'Cornivus', 'Rampage', 'Chaos Lite'
    ],
    allPresets: [
        'Adventure', 'Agonize 2020', 'All Bosses', 'Any Percent', 'Aperture', 'Bat Master', 'Battle Mage',
        'Beyond', 'Big Toss', 'Boss Rush', 'Bounty Hunter', 'Brawler', 'Breach', 'Casual', 'Chaos Lite', 'Chimera',
        'Cornivus', 'Cursed Night', 'Dog Life', 'Empty Hand', 'Expedition', 'First Castle', 'Gem Farmer',
        'Glitch', 'Glitchmaster', 'Grand Tour', 'Guarded Og', 'Hitman', 'Leg Day', 'Lucky Sevens', 'Lycanthrope',
        'Magic Mirror', 'Max Rando', 'Mirror Breaker', 'Mobility', 'Nimble', 'Nimble Lite', 'Og', 'Open', 'Oracle',
        'Rat Race', 'Rampage', 'Recycler', 'Safe', 'Safe Season 2', 'Scavenger', 'Seeker', 'Sequence Breaker',
        'Sight Seer', 'Spellbound', 'Summoner', 'Target Confirmed', 'Third Castle', 'Timeline', 'Vanilla',
        'Warlock'
    ]
};
function applyCustomPresets() {
    const input = document.getElementById('customPresets').value;
    const customList = input
        .split(',')
        .map(str => str.trim())
        .filter(str => str.length > 0);

    generateCheckboxesFromList(customList);
}
function generateCheckboxes() {
    const container = document.getElementById('checkboxesContainer');
    container.innerHTML = '';

    if (activeCategories.length === 0) {
        // No categories selected — don't render any checkboxes
        return;
    }

    const mergedPresets = activeCategories
        .map(cat => presetsByCategory[cat])
        .flat();

    generateCheckboxesFromList([...new Set(mergedPresets)]); // Avoid duplicates
}


function applyCategoryFilters() {
    const select = document.getElementById('filterSelect');
    const selected = Array.from(select.selectedOptions).map(option => option.value);

    if (selected.length === 0) {
        generateCheckboxes('all'); // Show all if nothing selected
        return;
    }

    // Merge presets from selected categories
    let combinedPresets = [];
    selected.forEach(category => {
        combinedPresets = combinedPresets.concat(presetsByCategory[category]);
    });

    generateCheckboxesFromList(combinedPresets);
}

function generateCheckboxesFromList(presetList) {
    const container = document.getElementById('checkboxesContainer');
    container.innerHTML = '';

    // Remove duplicates
    const seen = new Set();
    const uniquePresets = presetList.filter(preset => {
        if (seen.has(preset)) return false;
        seen.add(preset);
        return true;
    });

    // Sort alphabetically
    uniquePresets.sort((a, b) => a.localeCompare(b));

    uniquePresets.forEach((preset, index) => {
        const div = document.createElement('div');

        const input = document.createElement('input');
        input.type = "checkbox";
        input.id = `filteredPreset${index}`;
        input.value = preset;

        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.textContent = preset;

        const savedState = localStorage.getItem(input.id);
        if (savedState === 'true') {
            input.checked = true;
        }

        input.addEventListener('change', () => {
            localStorage.setItem(input.id, input.checked);
        });

        div.appendChild(input);
        div.appendChild(label);
        container.appendChild(div);
    });
}


// Generate the wheel based on selected checkboxes
function generateWheel() {
    const checkboxesContainer = document.getElementById("checkboxesContainer");
    let choices = [];
    for (const child of checkboxesContainer.querySelectorAll('input[type="checkbox"]')) {
        if (child.checked) {
            choices.push(child.value); // Add checked options to array   
        }
    }
    const selectedOptions = choices.join(","); // Convert array to comma-separated string
    const presetWheel = document.getElementById("presetWheel");
    presetWheel.src = `https://pickerwheel.com/emb/?choices=${selectedOptions}`;
}
function clearAllCheckboxes() {
    const checkboxes = document.querySelectorAll('#checkboxesContainer input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        localStorage.setItem(checkbox.id, false); // Update localStorage if you're tracking state
    });
}

function selectAllCheckboxes() {
    const checkboxes = document.querySelectorAll('#checkboxesContainer input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
        localStorage.setItem(checkbox.id, true); // Update localStorage if you're tracking state
    });
}


// Attach event listener to the generate button
function loadHandler() {
    document.getElementById("btnGenerate").addEventListener("click", generateWheel);
}


let activeCategories = [];

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            const cat = button.getAttribute('data-category');
            if (activeCategories.includes(cat)) {
                activeCategories = activeCategories.filter(c => c !== cat);
                button.classList.remove('active');
            } else {
                activeCategories.push(cat);
                button.classList.add('active');
            }

            if (activeCategories.length === 0) {
                generateCheckboxes('all');
            } else {
                const mergedPresets = activeCategories
                    .map(cat => presetsByCategory[cat])
                    .flat();
                generateCheckboxesFromList(mergedPresets);
            }
        });
    });
});

// Load everything when the window loads
window.addEventListener("load", () => {
    generateCheckboxes(); // Generate checkboxes
    loadHandler(); // Setup generate button event
})