# 🧠🎨 Metaconceptual Art

**Metaconceptual Art** is a static website, conceptual artwork, and emerging meta-museum about art as a system.

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
  see [`systems/wikidata.js`](systems/wikidata.js)).
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
  a HAL `_links` block and is served as `application/ld+json` (see the
  directory's `.htaccess`) — so an object is legible to real
  collection-management systems (Getty, Yale LUX, Europeana).
- Rights are declared as a CC-BY 4.0 `Right` on each work and established by a
  `RightAcquisition` in the provenance record. An IIIF Activity-Streams
  `OrderedCollection` (`activity-stream.json`) makes the set crawlable.
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

- 🌐 Semantic HTML
- 🎛️ Responsive CSS
- 🔎 JSON-LD structured data
- 🖼️ Static image assets
- 🧠 Concept-first information architecture

## 📌 Status

This is an evolving artwork and system. The current version includes a landing page, artwork register, primary theory text, ten-node graph, colophon, and changelog.

## 🧾 Citation

```text
Sun & Rain Works. Metaconceptual Art. 2026.
Website as conceptual artwork.
https://www.metaconceptualart.com
Accessed [date].
```
