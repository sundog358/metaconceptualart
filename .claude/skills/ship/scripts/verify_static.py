#!/usr/bin/env python3
"""Static-site verify gate for the `ship` skill.

Validates the things that silently break a hand-written static site, so a broken
build never gets pushed to origin/main:

  1. JSON      — every *.json file parses.
  2. JSON-LD   — every inline <script type="application/ld+json"> block parses.
  3. HTML      — every *.html file is non-empty, has a <title>, and its
                 <html>/<head>/<body> tags are balanced (gross-breakage check).
  4. Links     — every local href/src resolves to a file or directory that
                 exists (catches typo'd paths and renamed/moved assets).

Exit code is 0 when everything passes and 1 on the first category that fails,
with a clear PASS/FAIL report. Skips .git and node_modules. No third-party deps.

Usage:  python verify_static.py [ROOT]   # ROOT defaults to the current dir
"""

from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SKIP_DIRS = {".git", "node_modules", ".claude"}
# Local references we never try to resolve on disk.
EXTERNAL_RE = re.compile(r"^(https?:|mailto:|tel:|data:|javascript:|#|//)", re.I)
LDJSON_RE = re.compile(
    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.I | re.S,
)
# href="..." or src="..." (single or double quoted).
ATTR_RE = re.compile(r'\b(?:href|src)\s*=\s*"([^"]*)"|\b(?:href|src)\s*=\s*\'([^\']*)\'', re.I)


def walk(root: Path, suffix: str):
    for path in sorted(root.rglob(f"*{suffix}")):
        if any(part in SKIP_DIRS for part in path.relative_to(root).parts):
            continue
        yield path


class TagBalance(HTMLParser):
    """Counts structural open/close tags to catch gross HTML breakage."""

    TRACKED = ("html", "head", "body")

    def __init__(self):
        super().__init__()
        self.opens = {t: 0 for t in self.TRACKED}
        self.closes = {t: 0 for t in self.TRACKED}

    def handle_starttag(self, tag, attrs):
        if tag in self.opens:
            self.opens[tag] += 1

    def handle_endtag(self, tag):
        if tag in self.closes:
            self.closes[tag] += 1


def check_json(root: Path, errors: list[str]) -> int:
    count = 0
    for path in walk(root, ".json"):
        count += 1
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError) as exc:
            errors.append(f"JSON parse error in {path}: {exc}")
    return count


def check_html(root: Path, errors: list[str]) -> tuple[int, int, int]:
    html_count = ldjson_count = link_count = 0
    for path in walk(root, ".html"):
        html_count += 1
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError as exc:
            errors.append(f"Cannot read {path} as UTF-8: {exc}")
            continue

        if not text.strip():
            errors.append(f"Empty HTML file: {path}")
            continue
        if "<title" not in text.lower():
            errors.append(f"Missing <title> in {path}")

        balance = TagBalance()
        try:
            balance.feed(text)
        except Exception as exc:  # html.parser is lenient; flag if it ever raises
            errors.append(f"HTML parse error in {path}: {exc}")
        for tag in TagBalance.TRACKED:
            if balance.opens[tag] != balance.closes[tag]:
                errors.append(
                    f"Unbalanced <{tag}> in {path}: "
                    f"{balance.opens[tag]} open vs {balance.closes[tag]} close"
                )

        # Inline JSON-LD blocks.
        for block in LDJSON_RE.findall(text):
            ldjson_count += 1
            try:
                json.loads(block)
            except json.JSONDecodeError as exc:
                errors.append(f"JSON-LD parse error in {path}: {exc}")

        # Local link / asset existence.
        for dq, sq in ATTR_RE.findall(text):
            ref = dq or sq
            if not ref or EXTERNAL_RE.match(ref):
                continue
            link_count += 1
            target = (path.parent / ref.split("#")[0].split("?")[0]).resolve()
            if not target.exists():
                errors.append(f"Broken local reference in {path}: '{ref}' -> {target}")
    return html_count, ldjson_count, link_count


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else ".").resolve()
    if not root.exists():
        print(f"FAIL: path does not exist: {root}")
        return 1

    errors: list[str] = []
    json_count = check_json(root, errors)
    html_count, ldjson_count, link_count = check_html(root, errors)

    summary = (
        f"{html_count} html, {json_count} json, {ldjson_count} json-ld block(s), "
        f"{link_count} local link(s)"
    )

    if errors:
        print(f"FAIL: static verify found {len(errors)} problem(s) ({summary})")
        for err in errors:
            print(f"  - {err}")
        return 1

    print(f"PASS: static checks passed ({summary})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
