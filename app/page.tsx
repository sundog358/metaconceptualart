import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import TodaySpotlight from "./TodaySpotlight";

export const metadata: Metadata = {
  title: { absolute: "Metaconceptual Art" },
  description:
    "Metaconceptual Art is Art. Art about Art. A living proposition set, museum system, and conceptual archive.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Metaconceptual Art",
    title: "Metaconceptual Art",
    description:
      "A living proposition set, museum system, and conceptual archive.",
    url: "https://www.metaconceptualart.com",
    images: [
      {
        url: "/images/artmarketreform.jpg",
        width: 2048,
        height: 1454,
        alt: "Art Market Reform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metaconceptual Art",
    description:
      "A living proposition set, museum system, and conceptual archive.",
    images: ["/images/artmarketreform.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.metaconceptualart.com/#organization",
      name: "Sun & Rain Works",
      url: "https://www.metaconceptualart.com",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.metaconceptualart.com/#website",
      name: "Metaconceptual Art",
      url: "https://www.metaconceptualart.com",
      publisher: { "@id": "https://www.metaconceptualart.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": "https://www.metaconceptualart.com/#webpage",
      url: "https://www.metaconceptualart.com",
      name: "Metaconceptual Art",
      isPartOf: { "@id": "https://www.metaconceptualart.com/#website" },
      mainEntity: { "@id": "https://www.metaconceptualart.com/#work" },
      hasPart: [
        { "@id": "https://www.metaconceptualart.com/#sentences-data" },
        { "@id": "https://www.metaconceptualart.com/#entry-points" },
        { "@id": "https://www.metaconceptualart.com/#semantic-layer" },
      ],
      inLanguage: "en-US",
    },
    {
      "@type": "CreativeWork",
      "@id": "https://www.metaconceptualart.com/#work",
      name: "Metaconceptual Art",
      alternateName: "Art about Art",
      url: "https://www.metaconceptualart.com",
      genre: ["Conceptual Art", "Institutional Critique", "Systems Art"],
      artform: "Website as conceptual artwork",
      description:
        "Metaconceptual Art is Art. Art about Art. A living proposition set, museum system, and conceptual archive.",
      creator: { "@id": "https://www.metaconceptualart.com/#organization" },
      copyrightHolder: {
        "@id": "https://www.metaconceptualart.com/#organization",
      },
      copyrightYear: "2026",
      copyrightNotice: "Copyright Sun & Rain Works 2026",
      isAccessibleForFree: true,
      keywords: [
        "metaconceptual art",
        "conceptual art",
        "art about art",
        "knowledge graph",
        "meta-museum",
        "art theory",
      ],
      about: [
        { "@id": "https://www.metaconceptualart.com/#concept-art-about-art" },
        {
          "@id":
            "https://www.metaconceptualart.com/#concept-art-world-as-system",
        },
        { "@id": "https://www.metaconceptualart.com/#concept-provenance" },
      ],
      hasPart: { "@id": "https://www.metaconceptualart.com/#sentences-data" },
    },
    {
      "@type": "ItemList",
      "@id": "https://www.metaconceptualart.com/#sentences-data",
      name: "Eight Sentences On Metaconceptual Art",
      description:
        "A canonical eight-sentence proposition set for Metaconceptual Art, inspired by Sol LeWitt's Sentences on Conceptual Art.",
      numberOfItems: 8,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "A returning of the Formless to Form (Art).",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "An examination of the commodification of Art and its relationship to the current global economic crisis.",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "An examination of the power structures and network of the elite 'Art World' and 'Art Institutions'.",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "An Archaeology of the Art World, and Art History.",
        },
        {
          "@type": "ListItem",
          position: 5,
          name: "The interplay of Time and Space.",
        },
        {
          "@type": "ListItem",
          position: 6,
          name: "Transcendence of medium to arrive within the collective consciousness.",
        },
        {
          "@type": "ListItem",
          position: 7,
          name: "The annihilating of the boundaries between Art World insiders and Outsiders.",
        },
        {
          "@type": "ListItem",
          position: 8,
          name: "The annihilating of the boundaries between Art and Life.",
        },
      ],
    },
    {
      "@type": "DefinedTermSet",
      "@id": "https://www.metaconceptualart.com/#concepts",
      name: "Metaconceptual Art Concepts",
      hasDefinedTerm: [
        { "@id": "https://www.metaconceptualart.com/#concept-art-about-art" },
        {
          "@id":
            "https://www.metaconceptualart.com/#concept-art-world-as-system",
        },
        { "@id": "https://www.metaconceptualart.com/#concept-provenance" },
      ],
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://www.metaconceptualart.com/#concept-art-about-art",
      name: "Art about art",
      description:
        "Art that treats art, its language, and its conditions of legibility as material.",
      sameAs: "https://www.wikidata.org/wiki/Q203209",
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://www.metaconceptualart.com/#concept-art-world-as-system",
      name: "The art world as system",
      description:
        "The institutions, markets, histories, networks, and permissions that frame artistic value.",
      sameAs: "https://www.wikidata.org/wiki/Q6041145",
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://www.metaconceptualart.com/#concept-provenance",
      name: "Provenance of concepts",
      description:
        "The traceable lineage of ideas, artworks, claims, sources, and interpretations.",
      sameAs: "https://www.wikidata.org/wiki/Q1773840",
    },
    {
      "@type": "ItemList",
      "@id": "https://www.metaconceptualart.com/#entry-points",
      name: "Metaconceptual Art Entry Points",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Artworks",
          url: "https://www.metaconceptualart.com/artworks",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Theory",
          url: "https://www.metaconceptualart.com/theory",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Systems",
          url: "https://www.metaconceptualart.com/systems",
        },
      ],
    },
    {
      "@type": "CreativeWork",
      "@id": "https://www.metaconceptualart.com/#semantic-layer",
      name: "Semantic Layer",
      description:
        "A future knowledge graph connecting artworks, concepts, sources, institutions, visitors, value, authorship, and provenance.",
      isPartOf: { "@id": "https://www.metaconceptualart.com/#work" },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <SiteHeader active="home" />
      <JsonLd data={jsonLd} />

      <main id="top" data-entity="metaconceptual-art" data-type="CreativeWork">
        <section
          className="hero"
          aria-labelledby="hero-title"
          data-section="hero"
          data-concept="art-about-art"
        >
          <div className="hero-copy">
            <p className="eyebrow">Now on view</p>
            <h1 id="hero-title">Metaconceptual Art</h1>
            <p className="definition">
              Metaconceptual Art studies art as a system: artwork, institution,
              market, archive, viewer, and meaning folded into one living form.
            </p>
            <p className="proposition">
              The artwork is not only the object. It is the condition that
              permits the object to be seen. It is the institution that frames
              it, the market that prices it, the archive that remembers it, and
              the viewer who activates it.
            </p>
            <div className="hero-actions" aria-label="Primary sections">
              <Link href="/artworks">Artworks</Link>
              <Link href="/theory">Theory</Link>
              <Link href="/systems">Systems</Link>
            </div>
          </div>
          <figure className="hero-artwork">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/artmarketreform.jpg"
              alt="Art Market Reform"
            />
            <figcaption>
              <span>Visual anchor</span>
              <cite>Art Market Reform</cite>
              <span>Image study, 2013</span>
            </figcaption>
          </figure>
        </section>

        <TodaySpotlight />

        <section
          id="sentences"
          className="sentences"
          aria-labelledby="sentences-title"
          data-section="sentence-sequence"
          data-type="ItemList"
        >
          <p className="section-kicker">After Sol LeWitt</p>
          <h2 id="sentences-title">Eight Sentences On Metaconceptual Art</h2>

          <ol className="sentence-list">
            <li data-position="1">
              <span className="sentence-text">
                A returning of the Formless to Form (Art).
              </span>
              <span className="sentence-gloss">
                The work gives shape to what normally remains invisible: systems,
                permissions, histories, and relations.
              </span>
            </li>
            <li data-position="2">
              <span className="sentence-text">
                An examination of the commodification of Art and its relationship
                to the current global economic crisis.
              </span>
              <span className="sentence-gloss">
                Art is considered alongside price, scarcity, speculation, labor,
                and the pressures of global capital.
              </span>
            </li>
            <li data-position="3">
              <span className="sentence-text">
                An examination of the power structures and network of the elite
                &apos;Art World&apos; and &apos;Art Institutions&apos;.
              </span>
              <span className="sentence-gloss">
                The museum, gallery, collector, curator, critic, and platform are
                treated as part of the artwork&apos;s material field.
              </span>
            </li>
            <li data-position="4">
              <span className="sentence-text">
                An Archaeology of the Art World, and Art History.
              </span>
              <span className="sentence-gloss">
                The project excavates how artistic value is inherited, archived,
                narrated, revised, and canonized.
              </span>
            </li>
            <li data-position="5">
              <span className="sentence-text">
                The interplay of Time and Space.
              </span>
              <span className="sentence-gloss">
                Meaning shifts across exhibition, memory, revision, location,
                interface, and encounter.
              </span>
            </li>
            <li data-position="6">
              <span className="sentence-text">
                Transcendence of medium to arrive within the collective
                consciousness.
              </span>
              <span className="sentence-gloss">
                The work can appear as image, text, metadata, page, network, or
                shared interpretation.
              </span>
            </li>
            <li data-position="7">
              <span className="sentence-text">
                The annihilating of the boundaries between Art World insiders and
                Outsiders.
              </span>
              <span className="sentence-gloss">
                The site should remain legible to visitors without art-world
                credentials while preserving theoretical rigor.
              </span>
            </li>
            <li data-position="8">
              <span className="sentence-text">
                The annihilating of the boundaries between Art and Life.
              </span>
              <span className="sentence-gloss">
                The visitor, the page, the edit, the source, and the revision all
                become part of the work&apos;s living conditions.
              </span>
            </li>
          </ol>
        </section>

        <section
          id="menu"
          className="triad"
          aria-labelledby="triad-title"
          data-section="entry-points"
          data-type="SiteNavigationElement"
        >
          <div className="section-heading">
            <p className="section-kicker">Menu Of Entry Points</p>
            <h2 id="triad-title">A Museum, A Cafe, A System</h2>
            <p className="section-intro">
              The landing page can stay spare while still offering a clear path:
              view the works, read the theory, enter the meta-system.
            </p>
          </div>
          <div className="triad-grid">
            <article id="artworks" className="entry" data-node="artworks">
              <span className="entry-index">01</span>
              <h3>Artworks</h3>
              <p>
                Works, gestures, diagrams, prompts, and happenings placed on view
                as evidence of the concept in motion.
              </p>
              <Link className="entry-link" href="/artworks">
                Enter artworks
              </Link>
            </article>
            <article id="theory" className="entry" data-node="theory">
              <span className="entry-index">02</span>
              <h3>Theory</h3>
              <p>
                A reading room for definitions, propositions, notes, and essays
                on art about art.
              </p>
              <Link className="entry-link" href="/theory">
                Enter theory
              </Link>
            </article>
            <article className="entry" data-node="systems">
              <span className="entry-index">03</span>
              <h3>Systems</h3>
              <p>
                A future Meta-Wiki where artworks, concepts, sources, authorship,
                and provenance become linked.
              </p>
              <Link className="entry-link" href="/systems">
                Enter systems
              </Link>
            </article>
          </div>
        </section>

        <section
          id="systems"
          className="system-section"
          aria-labelledby="system-title"
          data-section="semantic-layer"
          data-type="KnowledgeGraph"
        >
          <div>
            <p className="section-kicker">Linked open data</p>
            <h2 id="system-title">Built To Be Checked</h2>
          </div>
          <div className="system-copy">
            <p>
              Most writing about art asks you to take its claims on trust. This
              site is built to be checked. Every concept and figure in it is
              pinned to the public records that museums, libraries, and Wikipedia
              already rely on — Wikidata, and the Getty vocabularies that
              catalogue the art world. Follow any identifier below and you step
              out of this page into the shared record of art.
            </p>
            <div className="lod-records">
              <article className="lod-record">
                <p className="lod-record-kind">Concept</p>
                <h3>Conceptual art</h3>
                <dl>
                  <div>
                    <dt>This site</dt>
                    <dd>concept:conceptual-art</dd>
                  </div>
                  <div>
                    <dt>Wikidata</dt>
                    <dd>
                      <a
                        className="wd-link"
                        href="https://www.wikidata.org/wiki/Q203209"
                        target="_blank"
                        rel="noopener"
                      >
                        Q203209 ↗
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Getty AAT</dt>
                    <dd>
                      <a
                        className="wd-link"
                        href="https://vocab.getty.edu/page/aat/300264827"
                        target="_blank"
                        rel="noopener"
                      >
                        300264827 ↗
                      </a>
                    </dd>
                  </div>
                </dl>
              </article>
              <article className="lod-record">
                <p className="lod-record-kind">Person</p>
                <h3>Marcel Duchamp</h3>
                <dl>
                  <div>
                    <dt>This site</dt>
                    <dd>source:duchamp</dd>
                  </div>
                  <div>
                    <dt>Wikidata</dt>
                    <dd>
                      <a
                        className="wd-link"
                        href="https://www.wikidata.org/wiki/Q5912"
                        target="_blank"
                        rel="noopener"
                      >
                        Q5912 ↗
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Getty ULAN</dt>
                    <dd>
                      <a
                        className="wd-link"
                        href="https://vocab.getty.edu/page/ulan/500115393"
                        target="_blank"
                        rel="noopener"
                      >
                        500115393 ↗
                      </a>
                    </dd>
                  </div>
                </dl>
              </article>
            </div>
            <Link className="graph-cta" href="/systems">
              See the full register →
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter active="home" />
    </>
  );
}
