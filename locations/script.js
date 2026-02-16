function initializeAreaSelector() {
    const areaSelector = document.getElementById("areaSelector");
    const checksContainer = document.getElementById("checksContainer");

    Object.keys(areas).forEach(area => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        areaSelector.appendChild(option);
    });

    areaSelector.addEventListener("change", () => {
        const selected = areaSelector.value;

        if (!selected) {
            checksContainer.innerHTML = "<p>Select an area to view its checks.</p>";
            return;
        }

        const checks = areas[selected];

        // Convert area name → image filename
        const imageName = selected
            .replace(/\s+/g, '')        // remove spaces
            .replace(/[^a-zA-Z0-9]/g, '') // remove punctuation
            .replace(/^./, c => c.toLowerCase()) + ".png";

        const imagePath = `images/${imageName}`;

        // Build HTML
        let html = `
            <h3>${selected}</h3>
            <div class="logic-map">
                <img src="${imagePath}" alt="${selected} map" class="logic-map-image">
            </div>
        `;

        // Special message for Reverse Caverns
        if (selected.toLowerCase() === "reverce caverns") {
            html += `
                <p class="area-note">
                    This area name appears this way because it matches how it is written in the game's internal code.
                </p>
            `;
        }

        html += `<ol class="logic-list">`;

        checks.forEach(check => {
            html += `
                <li class="logic-check">
                    <strong>${check.name}</strong><br>
                    <span><b>Requirements:</b> ${check.requirements}</span><br>
                    <span><b>Relic Location Set:</b> ${check.set}</span>
                </li>
            `;
        });

        html += `</ol>`;

        checksContainer.innerHTML = html;
    });
}