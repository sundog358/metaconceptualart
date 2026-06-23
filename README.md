# 🧠🎨 Metaconceptual Art

**Metaconceptual Art** is a website, conceptual artwork, and emerging meta-museum about art as a system — built with Next.js (static export) and deployed from GitHub via Vercel.

It treats the artwork, institution, market, archive, viewer, citation, revision, and web page as one connected field.

## ✨ What This Is

- 🖼️ A conceptual art website
- 📚 A theory and reading room
- 🧬 A semantic knowledge-graph experiment
- 🏛️ A small meta-museum in progress
- 🛠️ A portfolio piece for museum-grade web design and information architecture

## 🧭 Main Sections

- **Artworks**: works, image studies, propositions, diagrams, and site-native pieces
- **Theory**: primary text and conceptual framing
- **Systems**: stable IDs, semantic relations, and graph structure
- **Statement**: the curatorial statement for the work
- **About**: colophon, citation, provenance, and curatorial context
- **Changelog**: visible revision history

## 🧩 Core Idea

Metaconceptual Art studies art as a system:

> artwork, institution, market, archive, viewer, and meaning folded into one living form.

## 🕸️ Semantic Layer

The project is structured around relations such as:

```text
Artwork expresses Concept
Concept cites Source
Institution frames Value
Viewer activates Meaning
Revision modifies Claim
Citation makes the work referenceable
```

## 🔗 Wikidata / Linked Open Data

The knowledge graph is grounded in [Wikidata](https://www.wikidata.org). Each
concept, source, and influence node carries a stable Wikidata QID, so the
museum connects outward to the wider linked-data record of art.

- Canonical graph data: [`data/graph.json`](data/graph.json) — nodes, edges,
  and Wikidata identifiers.
- The **Systems** page exposes the QIDs as linked open data and queries the
  Wikidata SPARQL endpoint live for related concepts (progressive enhancement,
  see [`app/systems/WikidataRelated.tsx`](app/systems/WikidataRelated.tsx)).
- The homepage `JSON-LD` adds `sameAs` links from defined terms to Wikidata.
- Art-domain nodes also carry their **Getty** authority IDs — ULAN for people,
  AAT for concepts — linking to the open `vocab.getty.edu` URIs, so the museum is
  legible to the art world's own linked-data vocabularies.
- The works are published as CIDOC-CRM-correct **[Linked Art](https://linked.art)
  (API 1.0)** records under [`data/linked-art/`](data/linked-art/): two
  `DigitalObject`s (the website, the image), a `LinguisticObject` (the Eight
  Sentences), a collection `Set`, a `Group` (Sun & Rain Works), a `Concept`, and
  a `ProvenanceActivity`. Names, identifiers, and statements are AAT-classified;
  every classification cross-walks Getty AAT/ULAN to Wikidata; each record carries
  a HAL `_links` block — so an object is legible to real collection-management
  systems (Getty, Yale LUX, Europeana). Each record has a single **extensionless
  canonical URI** served with **content negotiation**: `Accept: text/html`
  303-redirects to the human page, `Accept: application/ld+json` returns the
  profiled JSON-LD, and the legacy `.json` URL 301s to the canonical one. On
  Vercel this is configured in [`vercel.json`](vercel.json); the legacy Apache
  equivalent is [`data/linked-art/.htaccess`](data/linked-art/.htaccess).
- Rights are declared as a CC-BY 4.0 `Right` on each work and established by a
  `RightAcquisition` in the provenance record. An IIIF Activity-Streams
  `OrderedCollection` (`activity-stream.json`) makes the set crawlable, and it is
  **event-driven** — every `Create`/`Update` activity is generated from the
  records' real git-commit history by
  [`build_activity_stream.py`](.claude/skills/ship/scripts/build_activity_stream.py).
- The records are **certified against the Getty `cromulent` reference library**
  (7/7) plus a `pyld` JSON-LD expansion, run in the verify gate and in **CI**
  (GitHub Actions) on every push. The `data/linked-art/.htaccess` meets the API's
  minimal static-file conformance (`application/ld+json` + profile, GET/OPTIONS,
  CORS).

Anchor concepts: conceptual art (`Q203209` / AAT `300264827`), institutional
critique (`Q6041145`), systems art (`Q919251` / AAT `300047869`), internet art
(`Q1569950` / AAT `300419940`). Figures: LeWitt (ULAN `500115429`), Kosuth (ULAN
`500115645`), Duchamp (ULAN `500115393`).

## 🏗️ Built With

- ⚛️ Next.js 16 (App Router) with static export (`output: 'export'`)
- 🌐 Semantic HTML, React components
- 🎛️ Responsive CSS (one global stylesheet)
- 🔎 JSON-LD structured data + Linked Art (CIDOC-CRM) records
- 🧠 Concept-first information architecture

## 🛠️ Develop & Deploy

```bash
npm install      # one-time
npm run dev      # local dev server (mirrors images/ and data/ into public/)
npm run build    # static export to out/
```

`images/` and `data/` are the canonical source; `npm run build` mirrors them into
`public/` via [`scripts/prepublic.mjs`](scripts/prepublic.mjs) (the copies are
git-ignored).

**Deploy**: connect the repo on [Vercel](https://vercel.com) once — it detects
Next.js, runs `npm run build`, serves the static export, and applies
[`vercel.json`](vercel.json) (the Linked Art content negotiation). Every push to
`main` then deploys automatically, and pull requests get preview deploys. CI
([`.github/workflows/verify.yml`](.github/workflows/verify.yml)) builds and
validates the export plus the Linked Art records on every push; a scheduled
[conformance probe](.github/workflows/conformance.yml) checks the live endpoint.

## 📌 Status

This is an evolving artwork and system. The current version (v0.8) is a Next.js
static export with seven pages — landing, artworks, theory, systems, statement,
about, and changelog — plus a ten-node graph and certified Linked Art records.

## 🧾 Citation

```text
Sun & Rain Works. Metaconceptual Art. 2026.
Website as conceptual artwork.
https://www.metaconceptualart.com
Accessed [date].
```
