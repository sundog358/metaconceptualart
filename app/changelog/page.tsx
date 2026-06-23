import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Visible revision history for Metaconceptual Art.",
  alternates: { canonical: "/changelog" },
};

type Entry = { date: string; version: string; body: string };

const ENTRIES: Entry[] = [
  {
    date: "2026-06-23",
    version: "v0.8: Next.js Migration",
    body: "Migrated the hand-written static site to Next.js (App Router) with static export, while preserving every page, the semantic markup, the JSON-LD, and the Linked Art data layer. Shared header and footer became components, the Wikidata live query a client component, and the Linked Art HTTP content negotiation moved from .htaccess to vercel.json. The site now deploys from GitHub automatically instead of by manual upload. A seventh page, the Curatorial Statement, was added.",
  },
  {
    date: "2026-06-23",
    version: "v0.7: Dereferenceable URIs And Event-Driven Discovery",
    body: "Closed the last gaps to full Linked Art API 1.0 dereferencing. Each record now has a single extensionless canonical URI served with real content negotiation: Accept: text/html 303-redirects to the human page, Accept: application/ld+json returns the profiled JSON-LD, and the old .json URL 301s to the canonical one. The discovery stream became genuinely event-driven — every Create/Update activity is generated from the records' real git-commit history. A new live-endpoint prober asserts the served behaviour (status, media type, CORS, negotiation, redirects), and CI now boots real Apache with the site's .htaccess to probe it on every push, with a scheduled probe against production.",
  },
  {
    date: "2026-06-19",
    version: "v0.6: Linked Art API 1.0 Conformance Pass",
    body: "Brought the Linked Art layer to API 1.0. Corrected the CRM types — the website and image became DigitalObjects, the Eight Sentences a textual LinguisticObject — and classified every name, identifier, and statement with its AAT term. Added standalone records for the studio (Group), the concept, and a provenance activity (with a CC-BY RightAcquisition), a HAL _links block on every record, an Activity-Streams discovery collection, and an .htaccess serving everything as application/ld+json with GET/OPTIONS and CORS for full static conformance. The records are certified against the Getty cromulent reference library (which caught and fixed a real CRM error) plus a JSON-LD expansion, and that certification now runs in CI on every push.",
  },
  {
    date: "2026-06-19",
    version: "v0.5: Linked Art (CIDOC-CRM) Object Records",
    body: "Published per-artwork Linked Art JSON-LD — the museum data standard built on CIDOC-CRM — for the works on view and the website itself, bound together by a collection Set. Each record cross-walks its Getty AAT/ULAN classifications to Wikidata, so an object is legible to actual collection systems. The records live under data/linked-art/ and are linked from each work.",
  },
  {
    date: "2026-06-19",
    version: "v0.4: Getty Vocabularies / Linked Art Layer",
    body: "Extended the linked-data grounding into the art domain. Each concept and figure now carries its Getty identifier — ULAN for people, AAT for concepts — alongside its Wikidata QID, recorded in data/graph.json and surfaced in the Systems node register. The museum is now legible to the art world's own authority files, not only the general graph.",
  },
  {
    date: "2026-06-19",
    version: "v0.3: Wikidata Knowledge-Graph Layer",
    body: "Grounded the semantic layer in Wikidata. Each concept, source, and influence node now carries a stable Wikidata identifier, the node register exposes those as linked open data, and the Systems page queries Wikidata live for related concepts. Added a canonical graph data file at data/graph.json and sameAs links in the structured data.",
  },
  {
    date: "2026-05-21",
    version: "v0.2: Roadmap Implementation Pass",
    body: "Added real routes for Artworks, Theory, Systems, About, and Changelog. Published six initial works, one primary theory text, a ten-node semantic graph, citation block, colophon, and visible provenance structure.",
  },
  {
    date: "2026-05-21",
    version: "v0.1: Sentence Sequence And Landing System",
    body: "Reframed the Eight Sentences as a proposition sequence after Sol LeWitt, removed overclaiming language, added accessible glosses, visual anchor treatment, and a visible semantic graph.",
  },
];

export default function ChangelogPage() {
  return (
    <>
      <SiteHeader active="changelog" />

      <main className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Provenance</p>
          <h1 id="page-title">Changelog</h1>
          <p className="definition">
            The work changes over time. This page records visible changes so that
            revision becomes part of the artwork rather than an invisible
            maintenance act.
          </p>
        </section>

        <section className="timeline-section" aria-labelledby="timeline-title">
          <p className="section-kicker">Revision history</p>
          <h2 id="timeline-title">Records</h2>
          <ol className="timeline-list">
            {ENTRIES.map((e) => (
              <li key={e.version}>
                <time dateTime={e.date}>{e.date}</time>
                <div>
                  <h3>{e.version}</h3>
                  <p>{e.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <SiteFooter
        active="changelog"
        citation="Sun & Rain Works. Metaconceptual Art Changelog. 2026. https://www.metaconceptualart.com/changelog"
      />
    </>
  );
}
