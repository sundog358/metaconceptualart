import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ZoomableArtwork from "@/components/ZoomableArtwork";

export const metadata: Metadata = {
  title: "Artworks",
  description:
    "Works on view for Metaconceptual Art: images, propositions, diagrams, and the website as artwork.",
  alternates: { canonical: "/artworks" },
};

export default function ArtworksPage() {
  return (
    <>
      <SiteHeader active="artworks" />

      <main className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Works on view</p>
          <h1 id="page-title">Artworks</h1>
          <p className="definition">
            The works are not only images. They are propositions, interfaces,
            diagrams, metadata, and systems that make the conditions of art
            visible.
          </p>
        </section>

        <section
          className="collection-section"
          aria-labelledby="collection-title"
        >
          <div className="section-heading">
            <p className="section-kicker">Initial register</p>
            <h2 id="collection-title">Two Works</h2>
            <p className="section-intro">
              A deliberately tight first register: the canonical sentence
              sequence and the museum-as-concept image study, each with metadata
              and conceptual relations. Each work also publishes a{" "}
              <a
                className="inline-link"
                href="/data/linked-art/collection"
                target="_blank"
                rel="noopener"
              >
                Linked Art
              </a>{" "}
              (CIDOC-CRM) representation, the museum data standard, so the
              collection can be read as linked data.
            </p>
          </div>

          <div className="work-grid">
            <article className="work-card" id="work-eight-sentences">
              <div className="work-media work-media-text" aria-hidden="true">
                <span>01-08</span>
              </div>
              <div className="work-copy">
                <p className="metadata-line">
                  work:eight-sentences / 2026 / proposition sequence
                </p>
                <h3>Eight Sentences On Metaconceptual Art</h3>
                <p>
                  A sentence sequence after Sol LeWitt that frames Metaconceptual
                  Art as a field of form, institution, market, history, medium,
                  access, and life.
                </p>
                <dl className="metadata-list">
                  <div>
                    <dt>Source</dt>
                    <dd>Sol LeWitt lineage</dd>
                  </div>
                  <div>
                    <dt>Relation</dt>
                    <dd>Claim belongs to proposition set</dd>
                  </div>
                </dl>
                <a
                  className="linked-art-link"
                  href="/data/linked-art/eight-sentences"
                  target="_blank"
                  rel="noopener"
                >
                  Linked Art (JSON-LD) ↗
                </a>
              </div>
            </article>

            <article className="work-card" id="work-construction-museum">
              <ZoomableArtwork
                className="work-image"
                src="/images/constructionartaiA01.png"
                alt="An ornate gold frame surrounding a classical museum facade under construction."
                width={1024}
                height={1024}
                label="Construction of the Museum as Concept"
                manifestHref="/data/iiif/construction-museum/manifest.json"
              />
              <div className="work-copy">
                <p className="metadata-line">
                  work:construction-museum / 2026 / image study
                </p>
                <h3>Construction of the Museum as Concept</h3>
                <p>
                  The museum appears inside the artwork as something still being
                  built. Institutional authority is shown as architecture,
                  ornament, labor, scaffolding, and frame.
                </p>
                <dl className="metadata-list">
                  <div>
                    <dt>Concept</dt>
                    <dd>Institutional frame</dd>
                  </div>
                  <div>
                    <dt>Relation</dt>
                    <dd>Institution frames artwork</dd>
                  </div>
                </dl>
                <a
                  className="linked-art-link"
                  href="/data/linked-art/construction-museum"
                  target="_blank"
                  rel="noopener"
                >
                  Linked Art (JSON-LD) ↗
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter active="artworks" />
    </>
  );
}
