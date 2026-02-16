function initializeTrickPage(data) {
    const selector = document.getElementById("trickSelector");
    const title = document.getElementById("trickTitle");
    const difficulty = document.getElementById("difficulty");
    const utility = document.getElementById("utility");
    const content = document.getElementById("trickContent");
    const videoContainer = document.getElementById("videoContainer");

    // Populate dropdown
    data.tricks.forEach(trick => {
        const option = document.createElement("option");
        option.value = trick.id;
        option.textContent = trick.title;
        selector.appendChild(option);
    });

    function renderTrick(id) {
        const trick = data.tricks.find(t => t.id === id);
        if (!trick) return;

        title.textContent = trick.title;

        difficulty.innerHTML =
            "Difficulty " +
            "<gold>" + "&#9733;".repeat(trick.difficulty) + "</gold>" +
            "&#9733;".repeat(5 - trick.difficulty);

        utility.innerHTML =
            "Utility/Commonly Used " +
            "<gold>" + "&#9733;".repeat(trick.utility) + "</gold>" +
            "&#9733;".repeat(5 - trick.utility);

        content.innerHTML = trick.content;

        videoContainer.innerHTML = "";

        if (trick.video) {
            const iframe = document.createElement("iframe");
            iframe.width = "640";
            iframe.height = "360";
            iframe.src = trick.video;
            iframe.title = trick.title + " Video";
            iframe.frameBorder = "0";
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            iframe.allowFullscreen = true;

            const wrapper = document.createElement("div");
            wrapper.className = "iframe-container";
            wrapper.appendChild(iframe);

            videoContainer.appendChild(wrapper);
        } else {
            const msg = document.createElement("h3");
            msg.textContent = "Video currently in Development.";
            videoContainer.appendChild(msg);
        }
    }

    // Default to first trick
    renderTrick(data.tricks[0].id);

    selector.addEventListener("change", e => {
        renderTrick(e.target.value);
    });
}