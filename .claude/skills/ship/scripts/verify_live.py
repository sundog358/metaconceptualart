#!/usr/bin/env python3
"""Live-endpoint Linked Art API 1.0 conformance prober.

Unlike verify_static.py (which lints the files on disk), this probes a running
HTTP endpoint and asserts the *served* behaviour required by the protocol:

  * Extensionless canonical URIs dereference (GET -> 200 JSON-LD).
  * The profiled media type is returned
    (Content-Type: application/ld+json;profile="…").
  * CORS is open (Access-Control-Allow-Origin: *) and Vary: Accept is set.
  * The returned document's own `id` matches the requested URI.
  * Real content negotiation: a record with a human page returns 303 See Other
    to it on `Accept: text/html`; one without simply returns its JSON-LD.
  * Canonicalisation: the legacy `.json` URL 301-redirects to the extensionless
    URI, so each resource has a single identifier.
  * OPTIONS preflight returns 2xx with CORS allow-methods including GET.

Records are discovered live from the Activity-Streams collection, so the prober
needs no local checkout — point it at any deployment.

Usage:
  python verify_live.py http://127.0.0.1:8080        # CI: real Apache + .htaccess
  python verify_live.py https://www.metaconceptualart.com   # production probe

Exit code 0 when every check passes, 1 otherwise. Stdlib only.
"""

from __future__ import annotations

import http.client
import json
import sys
from urllib.parse import urlsplit

LA_PATH = "/data/linked-art"
TIMEOUT = 20
LA_PROFILE = "application/ld+json"


def request(method: str, url: str, accept: str = "*/*"):
    """Issue one request WITHOUT following redirects. Returns (status, msg, body)."""
    parts = urlsplit(url)
    host = parts.hostname
    port = parts.port
    path = parts.path or "/"
    if parts.query:
        path += "?" + parts.query
    if parts.scheme == "https":
        conn = http.client.HTTPSConnection(host, port or 443, timeout=TIMEOUT)
    else:
        conn = http.client.HTTPConnection(host, port or 80, timeout=TIMEOUT)
    try:
        conn.request(method, path, headers={"Accept": accept,
                                            "User-Agent": "linked-art-conformance/1.0"})
        resp = conn.getresponse()
        body = resp.read()
        return resp.status, resp, body
    finally:
        conn.close()


def discover(base: str, errors: list[str]) -> list[str]:
    """Return resource paths to probe, discovered from the live activity stream."""
    stream_url = f"{base}{LA_PATH}/activity-stream"
    paths: set[str] = {
        f"{LA_PATH}/collection",
        f"{LA_PATH}/activity-stream",
        f"{LA_PATH}/activity-stream-page-1",
    }
    try:
        status, resp, body = request("GET", stream_url, LA_PROFILE)
        coll = json.loads(body)
        first = (coll.get("first") or {}).get("id")
        page_path = urlsplit(first).path if first else f"{LA_PATH}/activity-stream-page-1"
        _, _, pbody = request("GET", f"{base}{page_path}", LA_PROFILE)
        page = json.loads(pbody)
        for it in page.get("orderedItems", []):
            oid = (it.get("object") or {}).get("id")
            if oid:
                paths.add(urlsplit(oid).path)
    except Exception as exc:  # noqa: BLE001
        errors.append(f"discovery: could not read activity stream at {stream_url}: {exc}")
    return sorted(paths)


def header(resp, name: str) -> str:
    return (resp.getheader(name) or "")


def check_resource(base: str, path: str, errors: list[str]) -> None:
    url = f"{base}{path}"
    name = path.rsplit("/", 1)[-1]

    # 1. GET extensionless -> 200 profiled JSON-LD + CORS + Vary, id matches.
    try:
        status, resp, body = request("GET", url, LA_PROFILE)
    except Exception as exc:  # noqa: BLE001
        errors.append(f"{name}: GET failed: {exc}")
        return
    if status != 200:
        errors.append(f"{name}: GET returned {status}, expected 200")
    ctype = header(resp, "Content-Type")
    if not ctype.startswith("application/ld+json"):
        errors.append(f"{name}: Content-Type '{ctype}' is not application/ld+json")
    if "profile=" not in ctype:
        errors.append(f"{name}: Content-Type is missing the profile parameter")
    if header(resp, "Access-Control-Allow-Origin") != "*":
        errors.append(f"{name}: missing Access-Control-Allow-Origin: *")
    if "accept" not in header(resp, "Vary").lower():
        errors.append(f"{name}: Vary header does not include Accept")
    try:
        doc = json.loads(body)
        if urlsplit(doc.get("id", "")).path != path:
            errors.append(f"{name}: document id path {urlsplit(doc.get('id','')).path} != {path}")
        has_html_alt = bool((doc.get("_links") or {}).get("alternate"))
    except Exception as exc:  # noqa: BLE001
        errors.append(f"{name}: response body is not valid JSON: {exc}")
        has_html_alt = False

    # 2. OPTIONS preflight -> 2xx + CORS allow-methods incl. GET.
    try:
        ostatus, oresp, _ = request("OPTIONS", url, LA_PROFILE)
        if not (200 <= ostatus < 300):
            errors.append(f"{name}: OPTIONS returned {ostatus}, expected 2xx")
        if header(oresp, "Access-Control-Allow-Origin") != "*":
            errors.append(f"{name}: OPTIONS missing Access-Control-Allow-Origin: *")
        if "GET" not in header(oresp, "Access-Control-Allow-Methods"):
            errors.append(f"{name}: OPTIONS allow-methods missing GET")
    except Exception as exc:  # noqa: BLE001
        errors.append(f"{name}: OPTIONS failed: {exc}")

    # 3. Canonicalisation: .json -> 301 extensionless (skip the AS pages, which
    #    are themselves named with no record alternate but still 301 cleanly).
    try:
        jstatus, jresp, _ = request("GET", f"{url}.json", LA_PROFILE)
        if jstatus != 301:
            errors.append(f"{name}.json: returned {jstatus}, expected 301 canonical redirect")
        else:
            loc = urlsplit(header(jresp, "Location")).path
            if loc != path:
                errors.append(f"{name}.json: 301 Location path {loc} != {path}")
    except Exception as exc:  # noqa: BLE001
        errors.append(f"{name}.json: canonical redirect check failed: {exc}")

    # 4. Content negotiation on Accept: text/html.
    try:
        hstatus, hresp, _ = request("GET", url, "text/html")
        if has_html_alt:
            if hstatus != 303:
                errors.append(f"{name}: Accept:text/html returned {hstatus}, expected 303")
            elif not header(hresp, "Location"):
                errors.append(f"{name}: 303 is missing a Location header")
        else:
            if hstatus != 200:
                errors.append(
                    f"{name}: Accept:text/html returned {hstatus}, expected 200 "
                    "(no human page for this resource)")
    except Exception as exc:  # noqa: BLE001
        errors.append(f"{name}: content-negotiation check failed: {exc}")


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: verify_live.py BASE_URL")
        return 2
    base = argv[1].rstrip("/")
    errors: list[str] = []

    paths = discover(base, errors)
    for path in paths:
        check_resource(base, path, errors)

    label = f"{len(paths)} resource(s) at {base}"
    if errors:
        print(f"FAIL: live conformance found {len(errors)} problem(s) ({label})")
        for e in errors:
            print(f"  - {e}")
        return 1
    print(f"PASS: live Linked Art API 1.0 conformance ({label})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
