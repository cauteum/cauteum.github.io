# SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
# SPDX-License-Identifier: Apache-2.0

"""Choose a standalone mascot scene that matches each documentation topic."""

from pathlib import PurePosixPath


_PROPS = {
    "terminal": (
        '<svg class="ws-doc-mascot__prop" viewBox="0 0 150 125" aria-hidden="true">'
        '<rect x="10" y="17" width="130" height="88" rx="10" fill="#111a29" stroke="#080e18" stroke-width="6"/>'
        '<path d="M12 39h126" stroke="#6746a0" stroke-width="16"/>'
        '<circle cx="23" cy="39" r="3" fill="#d9c7ff"/><circle cx="35" cy="39" r="3" fill="#bd8cff"/>'
        '<path d="m30 59 12 10-12 10m23 0h24" fill="none" stroke="#f4efff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
        '<rect class="ws-prop-cursor" x="83" y="74" width="4" height="8" rx="1" fill="#bd8cff"/>'
        '</svg>'
    ),
    "container": (
        '<svg class="ws-doc-mascot__prop" viewBox="0 0 150 125" aria-hidden="true">'
        '<g class="ws-prop-box" fill="#1b2638" stroke="#080e18" stroke-width="6" stroke-linejoin="round">'
        '<path d="m20 42 48-24 48 24v61l-48 20-48-20z"/><path d="m20 42 48 25 48-25M68 67v56" fill="none"/>'
        '<path d="M41 35v14m14-21v14m14-14v14m14-14v14m14-21v14" stroke="#aa7bfa" stroke-width="6"/>'
        '</g><path d="M51 89h34" stroke="#d9c7ff" stroke-width="5" stroke-linecap="round"/>'
        '</svg>'
    ),
    "remote": (
        '<svg class="ws-doc-mascot__prop" viewBox="0 0 150 125" aria-hidden="true">'
        '<g fill="#1b2638" stroke="#080e18" stroke-width="6" stroke-linejoin="round">'
        '<path d="M20 20h101a8 8 0 0 1 8 8v59H12V28a8 8 0 0 1 8-8z"/>'
        '<path d="m8 97 10-10h105l15 10-5 9H14z"/>'
        '</g><g class="ws-prop-screen" fill="none" stroke="#aa7bfa" stroke-width="5" stroke-linecap="round">'
        '<path d="M46 56a19 19 0 0 1 37-6 15 15 0 0 1 5 29H41a12 12 0 0 1 5-23z"/>'
        '</g><circle cx="72" cy="96" r="3" fill="#d9c7ff"/>'
        '</svg>'
    ),
    "fast": (
        '<svg class="ws-doc-mascot__prop" viewBox="0 0 150 125" aria-hidden="true">'
        '<g fill="none" stroke="#aa7bfa" stroke-width="8" stroke-linecap="round">'
        '<path class="ws-prop-speed" d="M19 37h53"/><path class="ws-prop-speed" d="M8 62h70"/><path class="ws-prop-speed" d="M27 87h45"/>'
        '</g><path d="M95 33v27m-13-13h26M91 78l-4 7 8-1-3 8" fill="none" stroke="#d9c7ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
        '</svg>'
    ),
    "gear": (
        '<svg class="ws-doc-mascot__prop" viewBox="0 0 150 125" aria-hidden="true">'
        '<g class="ws-prop-gear" fill="#aa7bfa" stroke="#080e18" stroke-width="6" stroke-linejoin="round">'
        '<path d="m64 14 14 0 4 13 10 4 11-7 10 10-7 11 4 10 13 4 0 14-13 4-4 10 7 11-10 10-11-7-10 4-4 13H64l-4-13-10-4-11 7-10-10 7-11-4-10-13-4V57l13-4 4-10-7-11 10-10 11 7 10-4z"/>'
        '<circle cx="71" cy="66" r="18" fill="#192235"/>'
        '</g></svg>'
    ),
    "server": (
        '<svg class="ws-doc-mascot__prop" viewBox="0 0 150 125" aria-hidden="true">'
        '<g fill="#1b2638" stroke="#080e18" stroke-width="6">'
        '<rect x="20" y="18" width="110" height="38" rx="8"/><rect x="20" y="68" width="110" height="38" rx="8"/>'
        '</g><g fill="#aa7bfa"><circle class="ws-prop-led" cx="40" cy="37" r="6"/><circle class="ws-prop-led" cx="40" cy="87" r="6"/></g>'
        '<path d="M57 37h49m-49 50h49" stroke="#c4b0e8" stroke-width="5" stroke-linecap="round"/>'
        '</svg>'
    ),
    "shield": (
        '<svg class="ws-doc-mascot__prop" viewBox="0 0 150 125" aria-hidden="true">'
        '<path class="ws-prop-shield" d="M74 13 120 29v31c0 29-19 48-46 62C47 108 28 89 28 60V29z" fill="#302253" stroke="#080e18" stroke-width="7" stroke-linejoin="round"/>'
        '<path d="m51 63 15 15 31-34" fill="none" stroke="#d9c7ff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
        '</svg>'
    ),
    "cloud": (
        '<svg class="ws-doc-mascot__prop" viewBox="0 0 150 125" aria-hidden="true">'
        '<path class="ws-prop-cloud" d="M28 87h88a20 20 0 0 0 1-40 37 37 0 0 0-71-5 24 24 0 0 0-18 45z" fill="#302253" stroke="#080e18" stroke-width="7" stroke-linejoin="round"/>'
        '<path d="M53 68h38m-19-16v33" stroke="#d9c7ff" stroke-width="6" stroke-linecap="round"/>'
        '</svg>'
    ),
}


def _variant(source: str) -> str:
    path = source.lower()
    name = PurePosixPath(path).stem

    if name in {"security", "policy", "credentials", "openshell-compatibility"}:
        return "shield"
    if "/providers/" in f"/{path}" or name in {"images", "provider-profiles", "recreate-sandbox"}:
        return "container"
    if name in {"environment", "settings", "development"}:
        return "gear"
    if name in {"gateway", "logging", "workspace", "workspaces"}:
        return "server"
    if name in {"architecture", "inference"}:
        return "cloud"
    if name in {"cursor", "first-sandbox", "remote"}:
        return "remote"
    if name in {"fast", "performance"}:
        return "fast"
    return "terminal"


def on_page_content(html, page, config, files):
    """Place a separate topic prop and clean mascot beside each page title."""
    if page is None:
        return html

    source = page.file.src_path
    parts = PurePosixPath(source).parts
    if getattr(page, "is_homepage", False) or (parts[-1:] == ("index.md",) and len(parts) <= 2):
        return html
    if (getattr(page, "meta", None) or {}).get("mascot") == "hide":
        return html

    title_end = html.find("</h1>")
    if title_end < 0:
        return html

    variant = _variant(source)
    illustration = (
        f'<div class="ws-doc-mascot ws-doc-mascot--{variant}" aria-hidden="true">'
        f'{_PROPS[variant]}'
        '<img class="ws-doc-mascot__whale" src="/assets/images/mascot-violet.svg" '
        'alt="" width="400" height="400" loading="lazy" draggable="false">'
        "</div>"
    )
    title_end += len("</h1>")
    return html[:title_end] + illustration + html[title_end:]
