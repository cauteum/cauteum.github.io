# SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
# SPDX-License-Identifier: Apache-2.0

"""Place a topic-matched mascot vignette beside each documentation title."""

from pathlib import PurePosixPath


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
    sprite = f'<div class="ws-doc-mascot ws-doc-mascot--{variant}" aria-hidden="true"></div>'
    title_end += len("</h1>")
    return html[:title_end] + sprite + html[title_end:]
