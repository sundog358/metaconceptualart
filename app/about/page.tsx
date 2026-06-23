import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About",
  description:
    "Colophon, citation, provenance, and curatorial statement for Metaconceptual Art.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader active="about" />

      <main className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Colophon</p>
          <h1 id="page-title">About The Work</h1>
          <p className="definition">
            Metaconceptual Art is a website, proposition set, image register,
            semantic system, and evolving artwork by Sun &amp; Rain Works.
          </p>
        </section>

        <section className="split-section" aria-labelledby="statement-title">
          <div>
            <p className="section-kicker">Curatorial statement</p>
            <h2 id="statement-title">The Site As Meta-Museum</h2>
          </div>
          <div className="prose-block">
            <p>
              Metaconceptual Art proposes that the artwork includes the system
              that makes it legible. The page, archive, citation, image,
              institution, and viewer are not secondary to the work. They are
              part of its active form.
            </p>
            <p>
              The project begins as a deliberately small meta-museum: a landing
              page, six works, a primary theory text, and a first semantic graph.
              Its growth should remain visible through provenance, changelog
              records, and stable identifiers.
            </p>
          </div>
        </section>

        <section
          className="collection-section"
          aria-labelledby="colophon-title"
        >
          <div className="section-heading">
            <p className="section-kicker">Making as meaning</p>
            <h2 id="colophon-title">Colophon</h2>
          </div>
          <dl className="metadata-list metadata-list-wide">
            <div>
              <dt>Creator</dt>
              <dd>Sun &amp; Rain Works</dd>
            </div>
            <div>
              <dt>Medium</dt>
              <dd>Website, HTML, CSS, images, metadata, and text</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>2026</dd>
            </div>
            <div>
              <dt>Current version</dt>
              <dd>v0.8, Next.js migration</dd>
            </div>
            <div>
              <dt>Technical frame</dt>
              <dd>Next.js static export, React, JSON-LD, Linked Art</dd>
            </div>
            <div>
              <dt>Conceptual frame</dt>
              <dd>Conceptual art, institutional critique, systems art, net art</dd>
            </div>
          </dl>
        </section>

        <section className="reference-section" aria-labelledby="citation-title">
          <p className="section-kicker">Citation</p>
          <h2 id="citation-title">Recommended Citation</h2>
          <pre className="citation-block">{`Sun & Rain Works. Metaconceptual Art. 2026.
Website as conceptual artwork.
https://www.metaconceptualart.com
Accessed [date].`}</pre>
        </section>
      </main>

      <SiteFooter active="about" />
    </>
  );
}
