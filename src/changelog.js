// Load JSON and initialize UI
fetch("/changelog.json")
    .then(res => res.json())
    .then(data => {
        window.fullChangelog = data.changelog; // store globally
        renderChangelog(window.fullChangelog);
        populateDropdown(window.fullChangelog);
        document.getElementById("load-more").style.display = "block";
    });

// Render all changelog entries
function renderChangelog(entries) {
    const container = document.getElementById("changelog-container");
    container.innerHTML = "";

    entries.forEach(entry => {
        const block = document.createElement("div");
        block.className = "date-block";

        block.innerHTML = `
            <h3>${entry.date}</h3>
            ${Object.keys(entry.sections).map(sectionName => `
                <h4>${sectionName}</h4>
                <ul>
                    ${entry.sections[sectionName].map(item => `<li>${item}</li>`).join("")}
                </ul>
            `).join("")}
        `;

        container.appendChild(block);
    });
}

// Populate dropdown with all dates
function populateDropdown(entries) {
    const dropdown = document.createElement("select");
    dropdown.id = "changelog-select";

    dropdown.innerHTML = `
        <option value="all">Show All</option>
        ${entries.map(e => `<option value="${e.date}">${e.date}</option>`).join("")}
    `;

    dropdown.addEventListener("change", () => {
        const selected = dropdown.value;

        if (selected === "all") {
            renderChangelog(window.fullChangelog);
        } else {
            const filtered = window.fullChangelog.filter(e => e.date === selected);
            renderChangelog(filtered);
        }
    });

    // Insert dropdown above the changelog
    const container = document.getElementById("changelog-container");
    container.parentNode.insertBefore(dropdown, container);
}

// Show ALL older changes
document.getElementById("load-more").addEventListener("click", () => {
    renderChangelog(window.fullChangelog);
    document.getElementById("load-more").style.display = "none";
});
