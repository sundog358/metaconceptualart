#!/usr/bin/env python3
"""Build (or verify) the Linked Art change-discovery Activity Stream from git.

The discovery stream under data/linked-art/ is *event-driven*: every entry is
derived from a real commit in this repository's history. A record's first commit
becomes a `Create` activity; each later commit that modifies it becomes an
`Update`. The `endTime` of each activity is the actual author date of that
commit, so the stream is a true, machine-crawlable revision history rather than a
hand-written snapshot.

Two modes:

  build  (default)  Regenerate activity-stream.json + activity-stream-page-N.json
                    from git history. Run this after committing record changes.
  --check           Verify the committed stream WITHOUT rewriting it (for CI):
                      * structure  — totals, pagination links, startIndex, ids;
                      * authenticity — every activity maps to a real git commit
                        that touched that record (no fabricated timestamps), with
                        the right object id/type; Creates sit on the record's
                        first commit;
                      * completeness — every record has exactly one Create.
                    Pending record updates not yet folded into the stream are
                    reported as an advisory, not a failure: the commit that writes
                    the regenerated stream would itself be a new event, so exact
                    regeneration equality can never be stable. Authenticity +
                    Create-completeness are the gating guarantees.

Usage:
  python build_activity_stream.py [ROOT]            # regenerate
  python build_activity_stream.py --check [ROOT]    # verify (CI), exit 1 on fail
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

DISCOVERY_CONTEXT = "http://iiif.io/api/discovery/1/context.json"
RIGHTS = "https://creativecommons.org/licenses/by/4.0/"
COLLECTION_LABEL = "Metaconceptual Art — Collection"
PAGE_SIZE = 100  # AS pages cap; the collection is small, but pagination is real.

STREAM_PREFIX = "activity-stream"  # files that ARE the stream, not records.


def git(root: Path, *args: str) -> str:
    out = subprocess.run(
        ["git", "-C", str(root), *args],
        capture_output=True, text=True, check=True,
    )
    return out.stdout


def record_files(la_dir: Path) -> list[Path]:
    """Record JSON files (everything in the dir except the stream itself)."""
    return [
        p for p in sorted(la_dir.glob("*.json"))
        if not p.name.startswith(STREAM_PREFIX)
    ]


def commit_dates(root: Path, rel: str) -> list[str]:
    """Author dates (oldest first) of commits that added/modified `rel`."""
    raw = git(
        root, "log", "--follow", "--diff-filter=AMR", "--reverse",
        "--format=%aI", "--", rel,
    )
    return [line.strip() for line in raw.splitlines() if line.strip()]


def base_uri(la_dir: Path) -> str:
    """Derive the canonical base (…/data/linked-art) from collection.json's id."""
    coll = json.loads((la_dir / "collection.json").read_text(encoding="utf-8"))
    cid = coll["id"]  # …/data/linked-art/collection (extensionless)
    return cid.rsplit("/", 1)[0]


def build_events(root: Path, la_dir: Path, base: str) -> list[dict]:
    """One activity per (record, commit), Create on the first commit then Update."""
    events: list[dict] = []
    for path in record_files(la_dir):
        doc = json.loads(path.read_text(encoding="utf-8"))
        obj_id = doc.get("id")
        obj_type = doc.get("type")
        rel = path.relative_to(root).as_posix()
        dates = commit_dates(root, rel)
        for i, date in enumerate(dates):
            events.append({
                "type": "Create" if i == 0 else "Update",
                "object": {"id": obj_id, "type": obj_type},
                "endTime": date,
            })
    # Chronological; ties broken so the order is deterministic across machines.
    events.sort(key=lambda e: (e["endTime"], 0 if e["type"] == "Create" else 1,
                               e["object"]["id"]))
    return events


def paginate(events: list[dict]) -> list[list[dict]]:
    if not events:
        return [[]]
    return [events[i:i + PAGE_SIZE] for i in range(0, len(events), PAGE_SIZE)]


def page_id(base: str, n: int) -> str:
    return f"{base}/{STREAM_PREFIX}-page-{n}"


def collection_id(base: str) -> str:
    return f"{base}/{STREAM_PREFIX}"


def render(base: str, events: list[dict]) -> dict[str, dict]:
    """Return {filename: doc} for the collection and every page."""
    pages = paginate(events)
    npages = len(pages)
    files: dict[str, dict] = {}

    files[f"{STREAM_PREFIX}.json"] = {
        "@context": DISCOVERY_CONTEXT,
        "id": collection_id(base),
        "type": "OrderedCollection",
        "totalItems": len(events),
        "rights": RIGHTS,
        "seeAlso": [{
            "id": f"{base}/collection",
            "type": "Set",
            "label": COLLECTION_LABEL,
        }],
        "first": {"id": page_id(base, 1), "type": "OrderedCollectionPage"},
        "last": {"id": page_id(base, npages), "type": "OrderedCollectionPage"},
    }

    offset = 0
    for idx, items in enumerate(pages, start=1):
        doc = {
            "@context": DISCOVERY_CONTEXT,
            "id": page_id(base, idx),
            "type": "OrderedCollectionPage",
            "startIndex": offset,
            "partOf": {"id": collection_id(base), "type": "OrderedCollection"},
        }
        if idx > 1:
            doc["prev"] = {"id": page_id(base, idx - 1),
                           "type": "OrderedCollectionPage"}
        if idx < npages:
            doc["next"] = {"id": page_id(base, idx + 1),
                           "type": "OrderedCollectionPage"}
        doc["orderedItems"] = items
        files[f"{STREAM_PREFIX}-page-{idx}.json"] = doc
        offset += len(items)
    return files


def write_files(la_dir: Path, files: dict[str, dict]) -> None:
    # Remove stale page files from a previously longer stream.
    keep = set(files)
    for existing in la_dir.glob(f"{STREAM_PREFIX}*.json"):
        if existing.name not in keep:
            existing.unlink()
    for name, doc in files.items():
        (la_dir / name).write_text(
            json.dumps(doc, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )


# --------------------------------------------------------------------------- #
# Verification (CI)
# --------------------------------------------------------------------------- #

def _load_committed(la_dir: Path) -> tuple[dict, list[dict]]:
    coll = json.loads((la_dir / f"{STREAM_PREFIX}.json").read_text(encoding="utf-8"))
    items: list[dict] = []
    n = 1
    while (la_dir / f"{STREAM_PREFIX}-page-{n}.json").exists():
        page = json.loads(
            (la_dir / f"{STREAM_PREFIX}-page-{n}.json").read_text(encoding="utf-8"))
        items.extend(page.get("orderedItems", []))
        n += 1
    return coll, items


def check(root: Path, la_dir: Path, base: str) -> int:
    errors: list[str] = []
    advisories: list[str] = []

    # Ground truth from git: per record, its real commit dates + canonical id/type.
    truth: dict[str, dict] = {}
    for path in record_files(la_dir):
        doc = json.loads(path.read_text(encoding="utf-8"))
        rel = path.relative_to(root).as_posix()
        dates = commit_dates(root, rel)
        truth[doc.get("id")] = {
            "type": doc.get("type"),
            "dates": dates,
            "first": dates[0] if dates else None,
            "all": set(dates),
        }

    coll, items = _load_committed(la_dir)

    # 1. Structure.
    if coll.get("type") != "OrderedCollection":
        errors.append("collection: type is not OrderedCollection")
    if coll.get("@context") != DISCOVERY_CONTEXT:
        errors.append("collection: wrong @context for a discovery stream")
    if coll.get("id") != collection_id(base):
        errors.append(f"collection: id should be {collection_id(base)}")
    if coll.get("totalItems") != len(items):
        errors.append(
            f"collection: totalItems {coll.get('totalItems')} != {len(items)} items")
    n = 1
    last_seen = 0
    expected_start = 0
    while (la_dir / f"{STREAM_PREFIX}-page-{n}.json").exists():
        page = json.loads(
            (la_dir / f"{STREAM_PREFIX}-page-{n}.json").read_text(encoding="utf-8"))
        if page.get("id") != page_id(base, n):
            errors.append(f"page {n}: id should be {page_id(base, n)}")
        if page.get("startIndex") != expected_start:
            errors.append(
                f"page {n}: startIndex {page.get('startIndex')} != {expected_start}")
        partof = (page.get("partOf") or {}).get("id")
        if partof != collection_id(base):
            errors.append(f"page {n}: partOf does not point at the collection")
        expected_start += len(page.get("orderedItems", []))
        last_seen = n
        n += 1
    if last_seen:
        if (coll.get("first") or {}).get("id") != page_id(base, 1):
            errors.append("collection: first does not point at page 1")
        if (coll.get("last") or {}).get("id") != page_id(base, last_seen):
            errors.append(f"collection: last does not point at page {last_seen}")
    else:
        errors.append("no activity-stream page files found")

    # 2. Authenticity — every activity maps to a real git event.
    seen_creates: set[str] = set()
    for it in items:
        oid = (it.get("object") or {}).get("id")
        otype = (it.get("object") or {}).get("type")
        kind = it.get("type")
        when = it.get("endTime")
        rec = truth.get(oid)
        if rec is None:
            errors.append(f"activity references unknown record id: {oid}")
            continue
        if otype != rec["type"]:
            errors.append(f"{oid}: activity object type {otype} != record {rec['type']}")
        if kind not in {"Create", "Update"}:
            errors.append(f"{oid}: unexpected activity type {kind}")
        if when not in rec["all"]:
            errors.append(
                f"{oid}: endTime {when} is not a real commit date (fabricated?)")
        if kind == "Create":
            seen_creates.add(oid)
            if when != rec["first"]:
                errors.append(
                    f"{oid}: Create endTime {when} is not the first commit {rec['first']}")

    # 3. Completeness — every record has exactly one Create.
    for oid, rec in truth.items():
        if rec["first"] is None:
            advisories.append(f"{oid}: not yet committed, so absent from the stream")
            continue
        if oid not in seen_creates:
            errors.append(f"{oid}: missing a Create activity in the stream")

    # Advisory drift — committed record updates not yet in the stream.
    committed_pairs = {((it.get('object') or {}).get('id'), it.get('endTime'))
                       for it in items}
    pending = 0
    for oid, rec in truth.items():
        for d in rec["dates"]:
            if (oid, d) not in committed_pairs:
                pending += 1
    if pending:
        advisories.append(
            f"{pending} committed record event(s) not yet in the stream — "
            "run build_activity_stream.py to refresh")

    label = f"{len(items)} activit(y/ies) over {last_seen} page(s)"
    if errors:
        print(f"FAIL: activity stream verification found {len(errors)} problem(s) ({label})")
        for e in errors:
            print(f"  - {e}")
        for a in advisories:
            print(f"  ~ {a}")
        return 1
    print(f"PASS: activity stream is authentic and event-driven ({label})")
    for a in advisories:
        print(f"  ~ {a}")
    return 0


def main(argv: list[str]) -> int:
    args = [a for a in argv[1:] if a != "--check"]
    do_check = "--check" in argv[1:]
    root = Path(args[0] if args else ".").resolve()
    la_dir = root / "data" / "linked-art"
    if not la_dir.is_dir():
        print(f"FAIL: no data/linked-art under {root}")
        return 1
    base = base_uri(la_dir)

    if do_check:
        return check(root, la_dir, base)

    events = build_events(root, la_dir, base)
    files = render(base, events)
    write_files(la_dir, files)
    print(f"Wrote {len(files)} file(s): {len(events)} event(s) from git history.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
