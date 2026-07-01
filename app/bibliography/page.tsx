import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";

const BASE = "https://www.metaconceptualart.com";

export const metadata: Metadata = {
  title: "Bibliography & Reception",
  description:
    "External references, standards, and reception boundaries for Metaconceptual Art.",
  alternates: { canonical: "/bibliography" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE}/bibliography#page`,
  url: `${BASE}/bibliography`,
  name: "Bibliography & Reception",
  about: `${BASE}/data/linked-art/concept-metaconceptual-art`,
  isPartOf: { "@id": `${BASE}/#website` },
};

const sources = [
  {
    kind: "Standard",
    title: "Linked Art Model 1.0",
    href: "https://linked.art/model/1.0/",
    note: "Primary modeling frame for the cultural heritage records.",
  },
  {
    kind: "Standard",
    title: "IIIF Presentation and Change Discovery",
    href: "https://iiif.io/api/",
    note: "Image and discovery context for machine-crawlable art records.",
  },
  {
    kind: "Authority",
    title: "Getty Art & Architecture Thesaurus",
    href: "https://vocab.getty.edu/",
    note: "Art-domain vocabulary alignment for concepts and classifications.",
  },
  {
    kind: "Authority",
    title: "Wikidata",
    href: "https://www.wikidata.org/",
    note: "Open external authority graph for figures, movements, and concepts.",
  },
  {
    kind: "Lineage",
    title: "Sol LeWitt",
    href: "https://www.wikidata.org/wiki/Q168587",
    note: "Lineage anchor for the sentence as conceptual unit.",
  },
  {
    kind: "Lineage",
    title: "Marcel Duchamp",
    href: "https://www.wikidata.org/wiki/Q5912",
    note: "Lineage anchor for designation, readymade, and context.",
  },
];

export default function BibliographyPage() {
  return (
    <>
      <SiteHeader active="bibliography" />
      <JsonLd data={jsonLd} />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">References</p>
          <h1 id="page-title">External Sources And Reception</h1>
          <p className="definition">
            A clear boundary between external standards, art-historical lineage,
            self-authored evidence, and public reception.
          </p>
        </section>

        <section className="collection-section" aria-labelledby="sources-title">
          <div className="section-heading">
            <p className="section-kicker">External references</p>
            <h2 id="sources-title">Standards And Lineage</h2>
            <p className="section-intro">
              These sources support the project&apos;s modeling, vocabulary, and
              art-historical alignment. They do not, by themselves, constitute
              third-party recognition of Metaconceptual Art as an established
              movement.
            </p>
          </div>

          <div className="reference-grid">
            {sources.map((source) => (
              <article className="reference-card" key={source.title}>
                <p className="reference-kind">{source.kind}</p>
                <h3>{source.title}</h3>
                <p>{source.note}</p>
                <a
                  className="wd-link"
                  href={source.href}
                  target="_blank"
                  rel="noopener"
                >
                  Open source ↗
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="split-section" aria-labelledby="reception-title">
          <div className="prose-block">
            <p className="section-kicker">Reception boundary</p>
            <h2 id="reception-title">What Is Claimed</h2>
            <p>
              The site claims internal coherence, public evidence, standards
              alignment, and a documented origin chronology. It does not claim
              that museums, journals, Wikidata, Getty, or scholars have already
              canonized Metaconceptual Art as a historical movement.
            </p>
          </div>
          <div className="prose-block">
            <p className="section-kicker">Future reception</p>
            <h2>What Will Be Added</h2>
            <p>
              Independent articles, exhibitions, catalog entries, citations, or
              authority records can be added here when they exist. Until then,
              this page keeps external lineage separate from external reception.
            </p>
            <Link className="graph-cta" href="/movement">
              Read the movement record →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter
        active="bibliography"
        citation="Sun & Rain Works. Bibliography & Reception. 2026. https://www.metaconceptualart.com/bibliography"
      />
    </>
  );
}
