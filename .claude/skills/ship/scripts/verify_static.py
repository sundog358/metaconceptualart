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
  5. Linked Art — any *.json that declares the Linked Art @context is linted for
                 CRM conformance (id/type/_label, HAL self == id, typed
                 references, classified Names/Identifiers). When the Getty
                 `cromulent` reference library is installed the doc is validated
                 against it (gating — a rejection is a real conformance failure),
                 and when `pyld` is installed it is expanded as JSON-LD
                 (advisory). IIIF Activity-Streams discovery docs are
                 sanity-checked too.

Exit code is 0 when everything passes and 1 on the first category that fails,
with a clear PASS/FAIL report. Skips .git and node_modules. The core checks need
no third-party deps; reference validation (`cromulent`) and JSON-LD expansion
(`pyld`) run only if those packages are installed.

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

# --- Linked Art conformance ---
LA_CONTEXT = "https://linked.art/ns/v1/linked-art.json"
IIIF_DISCOVERY_CONTEXT = "http://iiif.io/api/discovery/1/context.json"
# CRM classes that can appear as a top-level Linked Art record.
LA_TOP_TYPES = {
    "HumanMadeObject", "DigitalObject", "LinguisticObject", "VisualItem",
    "Set", "Group", "Person", "Place", "Type", "Activity", "Event", "Period",
    "PropositionalObject", "InformationObject", "Currency", "MeasurementUnit",
}
AS_TYPES = {"OrderedCollection", "OrderedCollectionPage", "Collection", "CollectionPage"}


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
            ref_path = ref.split("#")[0].split("?")[0]
            if not ref_path:
                continue
            # Root-absolute refs (/images/…, /statement/, /_next/…) resolve against
            # the scanned site root, not the filesystem root; relative refs resolve
            # against the file's directory.
            if ref_path.startswith("/"):
                target = (root / ref_path.lstrip("/")).resolve()
            else:
                target = (path.parent / ref_path).resolve()
            # A reference is satisfied by the file itself, a directory index, or —
            # for extensionless content-negotiated resources like Linked Art
            # records served from a .json — the <ref>.json file.
            if (
                not target.exists()
                and not (target / "index.html").exists()
                and not target.with_name(target.name + ".html").exists()
                and not target.with_name(target.name + ".json").exists()
            ):
                errors.append(f"Broken local reference in {path}: '{ref}' -> {target}")
    return html_count, ldjson_count, link_count


def _iter_nodes(obj):
    """Yield every dict node in a nested JSON structure."""
    if isinstance(obj, dict):
        yield obj
        for value in obj.values():
            yield from _iter_nodes(value)
    elif isinstance(obj, list):
        for value in obj:
            yield from _iter_nodes(value)


def _lint_linked_art_doc(path: Path, doc: dict, errors: list[str]) -> None:
    name = path.name
    doc_id = doc.get("id")
    doc_type = doc.get("type")

    if not isinstance(doc_id, str) or not doc_id.startswith("http"):
        errors.append(f"Linked Art {name}: missing or non-HTTP top-level id")
    if doc_type not in LA_TOP_TYPES:
        errors.append(f"Linked Art {name}: top-level type '{doc_type}' is not a recognised CRM class")
    if "_label" not in doc:
        errors.append(f"Linked Art {name}: missing _label")

    links = doc.get("_links")
    if isinstance(links, dict):
        self_link = links.get("self")
        self_href = self_link.get("href") if isinstance(self_link, dict) else None
        if self_href != doc_id:
            errors.append(f"Linked Art {name}: HAL _links.self.href does not match id")

    # Any referenced entity (a node with an http id) must declare its type.
    for node in _iter_nodes(doc):
        if node is doc:
            continue
        node_id = node.get("id")
        if isinstance(node_id, str) and node_id.startswith("http") and "type" not in node:
            errors.append(f"Linked Art {name}: referenced id {node_id} is missing a type")

    for ident in doc.get("identified_by", []) or []:
        if ident.get("type") not in {"Name", "Identifier"}:
            errors.append(f"Linked Art {name}: identified_by entry has unexpected type {ident.get('type')}")
        if "content" not in ident:
            errors.append(f"Linked Art {name}: identified_by entry is missing content")
    for clue in doc.get("classified_as", []) or []:
        if "id" not in clue or "type" not in clue:
            errors.append(f"Linked Art {name}: classified_as entry is missing id or type")


def _lint_activity_stream_doc(path: Path, doc: dict, errors: list[str]) -> None:
    name = path.name
    if doc.get("type") not in AS_TYPES:
        errors.append(f"Activity Stream {name}: type '{doc.get('type')}' is not an AS collection type")
    if not isinstance(doc.get("id"), str):
        errors.append(f"Activity Stream {name}: missing id")
    if doc.get("type") in {"OrderedCollectionPage", "CollectionPage"}:
        if not (doc.get("orderedItems") or doc.get("items")):
            errors.append(f"Activity Stream {name}: page has no orderedItems")


def _strip_api_keys(obj):
    """Deep-copy a doc with the non-semantic HAL _links block removed."""
    if isinstance(obj, dict):
        return {k: _strip_api_keys(v) for k, v in obj.items() if k != "_links"}
    if isinstance(obj, list):
        return [_strip_api_keys(v) for v in obj]
    return obj


def _try_cromulent_validate(docs, errors: list[str], advisories: list[str]) -> None:
    """Validate against the Getty cromulent reference library when installed.

    cromulent is the authoritative Linked Art implementation, so a rejection is a
    real conformance failure (gating). The non-semantic _links block is stripped
    first. When cromulent is absent the check is advisory, so offline ships and
    other projects are never blocked by a missing optional dependency.
    """
    try:
        from cromulent import reader
    except Exception:
        advisories.append("cromulent reference validation skipped (cromulent not installed)")
        return
    rdr = reader.Reader()
    ok = 0
    for path, doc in docs:
        try:
            rdr.read(json.dumps(_strip_api_keys(doc)))
            ok += 1
        except Exception as exc:
            errors.append(f"Linked Art {path.name}: cromulent reference validation failed: {repr(exc)[:160]}")
    advisories.append(f"cromulent reference validation OK for {ok}/{len(docs)} Linked Art doc(s)")


def _try_jsonld_expand(docs, advisories: list[str]) -> None:
    """Expand Linked Art docs with pyld if available. Advisory, never gating."""
    try:
        from pyld import jsonld
    except Exception:
        advisories.append("JSON-LD expansion skipped (pyld not installed)")
        return
    ok = 0
    for path, doc in docs:
        try:
            jsonld.expand(doc)
            ok += 1
        except Exception as exc:  # network/context errors stay advisory
            advisories.append(f"JSON-LD expansion issue in {path.name}: {exc}")
    advisories.append(f"JSON-LD expansion OK for {ok}/{len(docs)} Linked Art doc(s)")


def check_linked_art(root: Path, errors: list[str], advisories: list[str]) -> int:
    la_docs = []
    for path in walk(root, ".json"):
        try:
            doc = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue  # already reported by check_json
        if not isinstance(doc, dict):
            continue
        ctx = doc.get("@context")
        if ctx == LA_CONTEXT:
            la_docs.append((path, doc))
            _lint_linked_art_doc(path, doc, errors)
        elif ctx == IIIF_DISCOVERY_CONTEXT:
            _lint_activity_stream_doc(path, doc, errors)
    if la_docs:
        _try_cromulent_validate(la_docs, errors, advisories)
        _try_jsonld_expand(la_docs, advisories)
    return len(la_docs)


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else ".").resolve()
    if not root.exists():
        print(f"FAIL: path does not exist: {root}")
        return 1

    errors: list[str] = []
    advisories: list[str] = []
    json_count = check_json(root, errors)
    html_count, ldjson_count, link_count = check_html(root, errors)
    la_count = check_linked_art(root, errors, advisories)

    summary = (
        f"{html_count} html, {json_count} json, {ldjson_count} json-ld block(s), "
        f"{link_count} local link(s), {la_count} linked-art doc(s)"
    )

    if errors:
        print(f"FAIL: static verify found {len(errors)} problem(s) ({summary})")
        for err in errors:
            print(f"  - {err}")
        for note in advisories:
            print(f"  ~ {note}")
        return 1

    print(f"PASS: static checks passed ({summary})")
    for note in advisories:
        print(f"  ~ {note}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
