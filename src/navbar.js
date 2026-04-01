// navbar.js
function loadNavbar() {
    const navbarHTML = `
        <nav class="navbar">
        <input type="checkbox" id="checkbox-toggle">
        <label for="checkbox-toggle" class="menu-btn"></label>
        <ul class="menu">
            <li><a href="/index.html">Randomizer</a></li>
            <li><a href="/faq/index.html">FAQ</a></li>
            <li><a href="https://ppf.sotn.io">PPF Patcher</a></li>
            <li><a href="/community.html">Leaderboards</a></li>
            <li><a href="/wheel.html">Wheel of Fun</a></li>

            <li>
            <a href="#">Tips and Tricks<small></small></a>
            <ul class="submenu">
                <li><a href="/tips&tricks/generalRando.html">General Randomizer</a></li>
                <li><a href="/tips&tricks/presetSpecific.html">Preset Specific</a></li>
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
                <li><a href="/mapcompare.html">Map Tool</a></li>
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