import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";

const BASE = "https://www.metaconceptualart.com";

export const metadata: Metadata = {
  title: "Modeling Note",
  description:
    "A technical note on modeling born-digital conceptual art with Linked Art, JSON-LD, provenance, and local authority records.",
  alternates: { canonical: "/modeling" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": `${BASE}/modeling#note`,
  url: `${BASE}/modeling`,
  headline: "Modeling Born-Digital Conceptual Art With Linked Art",
  author: { "@id": `${BASE}/#organization` },
  publisher: { "@id": `${BASE}/#organization` },
  about: [
    "https://linked.art/model/1.0/",
    `${BASE}/data/linked-art/site-as-artwork`,
    `${BASE}/data/linked-art/concept-metaconceptual-art`,
  ],
  isPartOf: { "@id": `${BASE}/#website` },
};

const decisions = [
  {
    title: "The Website Is A DigitalObject",
    body:
      "The public site is not a container for the artwork. It is one form of the artwork, so the Linked Art layer models it as a DigitalObject with an HTML access point and a human page alternate.",
    link: "/data/linked-art/site-as-artwork",
  },
  {
    title: "The Movement Is A Local Type",
    body:
      "Metaconceptual Art is not represented as if Wikidata or Getty had already canonized it. It is modeled as a local Linked Art Type, then connected outward to broader public authorities.",
    link: "/data/linked-art/concept-metaconceptual-art",
  },
  {
    title: "Origin And Publication Are Separate",
    body:
      "The records distinguish studio formation, movement origin, early evidence, and the 2026 public linked-data layer. Publication metadata does not overwrite origin chronology.",
    link: "/data/profile/metaconceptual-art-origin-provenance.json",
  },
  {
    title: "The Profile Makes Claims Checkable",
    body:
      "The project publishes a reusable profile, schema, SHACL shape, fixtures, and validator so future claims can be evaluated rather than merely believed.",
    link: "/profile/1.0/",
  },
];

export default function ModelingPage() {
  return (
    <>
      <SiteHeader active="modeling" />
      <JsonLd data={jsonLd} />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Technical note</p>
          <h1 id="page-title">Modeling Born-Digital Conceptual Art</h1>
          <p className="definition">
            A short note on why this project models the website, movement,
            provenance, collection, and evidence profile the way it does.
          </p>
        </section>

        <section className="collection-section" aria-labelledby="decisions-title">
          <div className="section-heading">
            <p className="section-kicker">Modeling decisions</p>
            <h2 id="decisions-title">Data As Artistic Form</h2>
            <p className="section-intro">
              The technical layer is not backstage infrastructure. It is part of
              the work&apos;s claim: art can be made from the conditions that
              make art visible, referenceable, collectible, and machine-readable.
            </p>
          </div>

          <div className="proof-grid">
            {decisions.map((item) => (
              <article className="proof-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <Link className="wd-link" href={item.link}>
                  Inspect record →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="split-section" aria-labelledby="pattern-title">
          <div className="prose-block">
            <p className="section-kicker">Pattern</p>
            <h2 id="pattern-title">Local Claim, External Alignment</h2>
            <p>
              The project uses local identifiers for its own works and claims,
              then links outward to Wikidata, Getty vocabularies, IIIF, DCAT,
              VoID, and Linked Art. This keeps the boundary clear: external
              authorities are lineage and context, not borrowed certification.
            </p>
            <p>
              That boundary is especially important for living art. The record
              can grow as new works, citations, exhibitions, or reception appear
              without rewriting the past or overstating the present.
            </p>
          </div>
          <div className="prose-block">
            <p className="section-kicker">Exports</p>
            <h2>Machine Readers</h2>
            <p>
              The same modeling logic appears in multiple forms: Linked Art
              records for cultural heritage systems, schema.org for web agents,
              VoID/DCAT for dataset discovery, and a small Turtle dump for RDF
              readers.
            </p>
            <Link className="graph-cta" href="/data/metaconceptual-art.ttl">
              Open RDF dump →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter
        active="modeling"
        citation="Sun & Rain Works. Modeling Born-Digital Conceptual Art With Linked Art. 2026. https://www.metaconceptualart.com/modeling"
      />
    </>
  );
}
