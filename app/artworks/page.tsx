import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ZoomableArtwork from "@/components/ZoomableArtwork";
import { WORKS } from "@/lib/works";

export const metadata: Metadata = {
  title: "Artworks",
  description:
    "Works on view for Metaconceptual Art: live web work, images, propositions, diagrams, and the website as artwork.",
  alternates: { canonical: "/artworks" },
};

export default function ArtworksPage() {
  return (
    <>
      <SiteHeader active="artworks" />

      <main id="main-content" className="page-main">
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
            <h2 id="collection-title">Six Works</h2>
            <p className="section-intro">
              A compact public register: the canonical sentence sequence, a
              2009 live web auction work, image studies, an emblem, and the
              graph as a site-native work, each with its own page, metadata,
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
            {WORKS.map((w) => (
              <article className="work-card" id={"work-" + w.slug} key={w.slug}>
                {w.image ? (
                  <ZoomableArtwork
                    className="work-image"
                    src={w.image.src}
                    alt={w.image.alt}
                    width={w.image.width}
                    height={w.image.height}
                    label={w.title}
                    manifestHref={w.image.manifest}
                  />
                ) : w.textMedia ? (
                  <div className="work-media work-media-text" aria-hidden="true">
                    <span>{w.textMedia}</span>
                  </div>
                ) : null}

                <div className="work-copy">
                  <p className="metadata-line">{w.idLine}</p>
                  <h3>
                    <Link href={"/artworks/" + w.slug}>{w.title}</Link>
                  </h3>
                  <p>{w.summary}</p>
                  <dl className="metadata-list">
                    {w.metadata.slice(0, 2).map((m) => (
                      <div key={m.label}>
                        <dt>{m.label}</dt>
                        <dd>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="work-card-links">
                    <Link className="entry-link" href={"/artworks/" + w.slug}>
                      View work →
                    </Link>
                    <a
                      className="linked-art-link"
                      href={w.linkedArt}
                      target="_blank"
                      rel="noopener"
                    >
                      Linked Art (JSON-LD) ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter active="artworks" />
    </>
  );
}
