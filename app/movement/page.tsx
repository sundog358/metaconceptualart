import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import graph from "@/data/graph.json";
import { WORKS } from "@/lib/works";

export const metadata: Metadata = {
  title: "Movement Dossier",
  description:
    "A linked-open-data dossier arguing for Metaconceptual Art as a natural, credible, and valid movement.",
  alternates: { canonical: "/movement" },
  openGraph: {
    title: "Movement Dossier",
    description:
      "A linked-open-data dossier for Metaconceptual Art: genealogy, principles, works, standards, external alignment, and provenance.",
    url: "https://www.metaconceptualart.com/movement",
    type: "article",
  },
};

const BASE = "https://www.metaconceptualart.com";

const evidence = [
  {
    title: "Genealogy",
    claim:
      "Metaconceptual Art descends naturally from conceptual art, institutional critique, systems art, internet art, provenance, and semantic web practice.",
    proof: "The local graph links the concept outward to established Wikidata and Getty authority records rather than asking the site to be its own authority.",
    links: [
      ["Conceptual art", "https://www.wikidata.org/wiki/Q203209"],
      ["Institutional critique", "https://www.wikidata.org/wiki/Q6041145"],
      ["Systems art", "https://www.wikidata.org/wiki/Q919251"],
      ["Internet art", "https://www.wikidata.org/wiki/Q1569950"],
      ["Semantic Web", "https://www.wikidata.org/wiki/Q54837"],
    ],
  },
  {
    title: "Defined Principles",
    claim:
      "The movement has a name, thesis, sentence sequence, theory text, and repeatable criteria.",
    proof: "The home page publishes the canonical definition and Eight Sentences; the Theory page gives the primary text; the graph records the concept as a stable local node.",
    links: [
      ["Eight Sentences", "/artworks/eight-sentences"],
      ["Theory", "/theory"],
      ["Graph data", "/data/graph.json"],
    ],
  },
  {
    title: "Works On View",
    claim:
      "It is not only a manifesto; it has catalogued works with stable URLs, metadata, media, and records.",
    proof: `${WORKS.length} catalogued works are published from a shared source of truth and tied to Linked Art records.`,
    links: [
      ["Works index", "/artworks"],
      ["Collection record", "/data/linked-art/collection"],
    ],
  },
  {
    title: "Machine-Readable Legitimacy",
    claim:
      "The project speaks established museum and web languages: Linked Art, CIDOC-CRM, IIIF, JSON-LD, Wikidata, Getty vocabularies, and schema.org.",
    proof: "Linked Art records dereference through content negotiation, IIIF manifests expose image works, and pages include structured data.",
    links: [
      ["Linked Art record", "/data/linked-art/concept-metaconceptual-art"],
      ["IIIF manifest", "/data/iiif/construction-museum/manifest.json"],
      ["Linked Art model", "https://linked.art/model/1.0/"],
    ],
  },
  {
    title: "External Alignment",
    claim:
      "It points outward to recognized art-historical entities instead of inventing all authority internally.",
    proof: "The graph separates local IDs from external IDs, preserving a clear difference between this movement's claims and recognized public authorities.",
    links: [
      ["Systems register", "/systems"],
      ["Explore graph", "/explore?node=concept:metaconceptual-art"],
    ],
  },
  {
    title: "Provenance Over Time",
    claim:
      "Git history, changelog entries, Activity Streams, versioned records, and dereferenceable URIs show the movement evolving.",
    proof: "The provenance layer is visible to visitors and machine-readable through the Linked Art discovery stream.",
    links: [
      ["Changelog", "/changelog"],
      ["Activity Stream", "/data/linked-art/activity-stream"],
      ["Provenance record", "/data/linked-art/provenance-publication"],
    ],
  },
];

const movementNode = graph.nodes.find(
  (node) => node.id === "concept:metaconceptual-art",
);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${BASE}/movement#webpage`,
      url: `${BASE}/movement`,
      name: "Movement Dossier",
      description:
        "A linked-open-data dossier arguing for Metaconceptual Art as a natural, credible, and valid movement.",
      mainEntity: { "@id": `${BASE}/movement#dossier` },
      inLanguage: "en-US",
    },
    {
      "@type": "CreativeWork",
      "@id": `${BASE}/movement#dossier`,
      name: "Proof of Movement: Metaconceptual Art",
      creator: { "@id": `${BASE}/#organization` },
      about: { "@id": `${BASE}/movement#metaconceptual-art` },
      hasPart: evidence.map((item, index) => ({
        "@type": "CreativeWork",
        position: index + 1,
        name: item.title,
        description: item.claim,
      })),
      isBasedOn: [
        `${BASE}/data/graph.json`,
        `${BASE}/data/profile/metaconceptual-art-profile.jsonld`,
        `${BASE}/data/profile/metaconceptual-art-claim.schema.json`,
        `${BASE}/data/profile/metaconceptual-art-claim.json`,
        `${BASE}/data/linked-art/concept-metaconceptual-art`,
        `${BASE}/data/linked-art/movement-dossier`,
        `${BASE}/data/linked-art/activity-stream`,
      ],
    },
    {
      "@type": "DefinedTerm",
      "@id": `${BASE}/movement#metaconceptual-art`,
      name: "Metaconceptual Art",
      description: movementNode?.description,
      subjectOf: `${BASE}/data/linked-art/concept-metaconceptual-art`,
      broader: [
        "https://www.wikidata.org/wiki/Q203209",
        "https://www.wikidata.org/wiki/Q6041145",
        "https://www.wikidata.org/wiki/Q919251",
        "https://www.wikidata.org/wiki/Q1569950",
        "https://www.wikidata.org/wiki/Q54837",
      ],
    },
  ],
};

export default function MovementPage() {
  return (
    <>
      <SiteHeader active="movement" />
      <JsonLd data={jsonLd} />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Proof of movement</p>
          <h1 id="page-title">Movement Dossier</h1>
          <p className="definition">
            Metaconceptual Art is argued here as a natural, credible, and valid
            movement through linked open data: genealogy, principles, works,
            standards, external alignment, and provenance.
          </p>
        </section>

        <section className="proof-section" aria-labelledby="argument-title">
          <div className="proof-lede">
            <p className="section-kicker">Argument</p>
            <h2 id="argument-title">A Claim That Can Be Checked</h2>
            <p>
              This page does not ask linked open data to canonize
              Metaconceptual Art by decree. It uses linked open data to show the
              movement's lineage, evidence, standards, and revisions in a form a
              curator, scholar, crawler, or collection system can inspect.
            </p>
          </div>
          <div className="proof-grid">
            {evidence.map((item, index) => (
              <article className="proof-card" key={item.title}>
                <span className="proof-index">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p>{item.claim}</p>
                <p className="proof-note">{item.proof}</p>
                <ul>
                  {item.links.map(([label, href]) => (
                    <li key={href}>
                      <a
                        className="wd-link"
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener" : undefined}
                      >
                        {label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          className="system-section movement-system"
          aria-labelledby="lod-title"
        >
          <div>
            <p className="section-kicker">Linked Art shape</p>
            <h2 id="lod-title">Local Concept, External Lineage</h2>
          </div>
          <div className="system-copy">
            <p>
              The movement is modeled as a local Linked Art `Type`: named here,
              described here, and connected outward through `broader` and
              `created_by.influenced_by` rather than pretending an external
              authority has already assigned it a public ID.
            </p>
            <div className="proof-records" aria-label="Machine-readable records">
              <Link href="/data/linked-art/movement-dossier">
                Dossier Linked Art record
              </Link>
              <Link href="/data/linked-art/concept-metaconceptual-art">
                Concept Linked Art record
              </Link>
              <Link href="/data/profile/metaconceptual-art-profile.jsonld">
                Metaconceptual Art profile
              </Link>
              <Link href="/data/profile/metaconceptual-art-claim.schema.json">
                Validation schema
              </Link>
              <Link href="/data/profile/metaconceptual-art-claim.json">
                Current claim
              </Link>
              <Link href="/data/linked-art/collection">
                Collection Set
              </Link>
              <Link href="/data/linked-art/activity-stream">
                Activity Stream
              </Link>
              <Link href="/explore?node=concept:metaconceptual-art">
                Graph Explorer
              </Link>
            </div>
          </div>
        </section>

        <section className="collection-section" aria-labelledby="limits-title">
          <div className="section-heading">
            <p className="section-kicker">Credibility boundary</p>
            <h2 id="limits-title">What This Proves, And What It Does Not</h2>
            <p className="section-intro">
              The dossier proves internal coherence, public evidence, external
              alignment, and standards-based legibility. It does not claim that
              museums, scholars, or Wikidata have already recognized
              Metaconceptual Art as an established historical movement. That
              recognition would require independent sources over time.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter
        active="movement"
        citation="Sun & Rain Works. Proof of Movement: Metaconceptual Art. 2026. https://www.metaconceptualart.com/movement"
      />
    </>
  );
}
