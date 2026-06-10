// navbar.js
function loadNavbar() {
    const navbarHTML = `
    <nav class="sotn-navbar navbar">

    <input type="checkbox" id="checkbox-toggle">
    <label for="checkbox-toggle" class="menu-btn"></label>
    <ul class="menu">
        <li>
        <a href="/randomizer.html">Randomizer<small></small></a>
            <ul class="submenu">
                <li><a href="/randomizer.html">Randomizer</a></li>
                <li><a href="/changelog.html">Changelog</a></li>
            </ul>
        </li>

        <li>
        <a href="/faq/index.html">FAQ<small></small></a>
            <ul class="submenu">
                <li><a href="/faq/index.html">General</a></li>
                <li><a href="/development.html">Development</a></li>
            </ul>
        </li>

        <li><a href="https://ppf.sotn.io">PPF Patcher</a></li>
        <li><a href="/community.html">Leaderboards</a></li>
        <li><a href="/wheel.html">Wheel of Fun</a></li>

        <li>
        <a href="#">Player Guides<small></small></a>
        <ul class="submenu">
            <li><a href="/player-guides/generalRando.html">General Randomizer Tech</a></li>
            <li><a href="/player-guides/presetSpecific.html">Preset Specific Tech</a></li>
            <li><a href="/locations/locations.html">Relic Locations</a></li>
        </ul>
        </li>

        <li>
        <a href="#">Community & News<small></small></a>
        <ul class="submenu">
            <li><a href="https://discord.com/invite/dzbKhQDjrs">Long Library Discord</a></li>
            <li><a href="https://www.symphonyrando.fun">Knowledge Database (sr.f)</a></li>
            <li><a href="https://www.speedrun.com/sotn">Speedrun Leaderboards</a></li>
        </ul>
        </li>

        <li>
        <a href="#">Tools<small></small></a>
        <ul class="submenu">
            <li><a href="https://github.com/LuciaRolon/SotNRandomizerLauncher/releases">Randomizer Launcher</a></li>
            <li><a href="https://github.com/sotnrando/SotnRandoTools/releases">Rando Tools</a></li>
            <li><a href="/mapcompare.html">200.6% Map Tool</a></li>
            <li><a href="https://wec-codes.forumotion.com/h8-sotn-map">Relic Map</a></li>
        </ul>
        </li>
    </ul>
    </nav>
`;

    document.getElementById("navbar-container").innerHTML = navbarHTML;

    highlightCurrentPage();
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname.replace(/\/+$/, ""); // remove trailing slash
    const links = document.querySelectorAll(".menu-list a");

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("http")) return;

        // Resolve the link to an absolute path
        const linkPath = new URL(href, window.location.origin).pathname.replace(/\/+$/, "");

        // Exact match on full path
        if (linkPath === currentPath) {
            link.classList.add("current");
        }
    });
}

document.addEventListener("DOMContentLoaded", loadNavbar);  