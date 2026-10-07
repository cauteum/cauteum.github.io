# SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
# SPDX-License-Identifier: Apache-2.0

"""Place a topic-matched mascot vignette beside each documentation title."""

from pathlib import Path, PurePosixPath


_MASCOT_TEMPLATE = (Path(__file__).resolve().parents[1] / "docs/assets/images/mascot-violet.svg").read_text(encoding="utf-8")

_CONTEXT_MARKS = {
    "terminal": '<rect x="311" y="83" width="44" height="34" rx="5"/><path d="m319 94 6 5-6 5m11 0h10"/>',
    "container": '<path d="m333 79 19 11v21l-19 11-19-11V90z"/><path d="M314 90l19 11 19-11m-19 11v21"/>',
    "gear": '<circle cx="333" cy="100" r="11"/><circle cx="333" cy="100" r="4"/><path d="M333 78v6m0 32v6m22-22h-6m-32 0h-6m38-16-5 5m-22 22-5 5m32 0-5-5m-22-22-5-5"/>',
    "server": '<rect x="316" y="81" width="34" height="13" rx="3"/><rect x="316" y="101" width="34" height="13" rx="3"/><path d="M322 87h2m-2 20h2m6-20h15m-15 20h15"/>',
    "cloud": '<path d="M319 108h28a9 9 0 0 0 1-18 15 15 0 0 0-29-2 10 10 0 0 0 0 20z"/>',
    "shield": '<path d="M333 79 350 86v12c0 12-7 20-17 25-10-5-17-13-17-25V86z"/><path d="m325 100 6 6 12-13"/>',
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
    return "terminal"


def on_page_content(html, page, config, files):
    """Insert a decorative sprite after the title; leave landing pages alone."""
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
    context = (
        '<g class="mascot-context" fill="#f4efff" stroke="#6544a8" '
        'stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'
        '<circle cx="333" cy="100" r="37" fill="#f4efff" stroke="#d8c8f8" stroke-width="3"/>'
        f'<g fill="none">{_CONTEXT_MARKS[variant]}</g></g>'
    )
    illustration = _MASCOT_TEMPLATE.replace("<!-- CONTEXT_ICON -->", context)
    sprite = f'<div class="ws-doc-mascot ws-doc-mascot--{variant}" aria-hidden="true">{illustration}</div>'
    title_end += len("</h1>")
    return html[:title_end] + sprite + html[title_end:]
