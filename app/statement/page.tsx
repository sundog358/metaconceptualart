import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Curatorial Statement",
  description:
    "Curatorial statement for Metaconceptual Art: a website that exhibits the system that makes art legible.",
  alternates: { canonical: "/statement" },
};

export default function StatementPage() {
  return (
    <>
      <SiteHeader active="statement" />

      <main className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Statement</p>
          <h1 id="page-title">Curatorial Statement</h1>
          <p className="definition">
            Metaconceptual Art is an exhibition with no separate gallery. The
            website is the room, the wall, the label, and the work — a place
            where the system that makes art legible is itself put on view.
          </p>
        </section>

        <article className="essay" id="statement-body">
          <header className="essay-header">
            <p className="metadata-line">
              text:curatorial-statement / Sun &amp; Rain Works / 2026
            </p>
            <h2>On Exhibiting The System</h2>
          </header>

          <p>
            Every artwork arrives already framed. Before a viewer decides what a
            work means, a long chain of decisions has decided that it is a work
            at all: an institution accepted it, a market priced it, an archive
            recorded it, a history placed it, and a page agreed to show it.
            Metaconceptual Art takes that chain as its subject and its material.
            It does not ask you to look past the frame to find the art. It asks
            you to look at the frame as the art.
          </p>

          <p>
            This exhibition therefore refuses the usual division between the work
            and its documentation. The label, the citation, the metadata, the
            link, the revision history, and the structured data are not support
            material for some absent object. They are the object. What would
            normally be hidden in a museum&apos;s back office — accession
            numbers, provenance records, authority files — is brought to the
            front of the room and treated as something to be read.
          </p>

          <p>
            The works on view are deliberately few. The{" "}
            <Link className="inline-link" href="/artworks">
              Eight Sentences
            </Link>{" "}
            stand as a proposition set after Sol LeWitt; an image study shows the
            museum itself under construction; and the website, by declaring
            itself a work, becomes the largest object in the collection. Scarcity
            here is a curatorial choice. A small, legible museum can be checked,
            and being checkable is part of the argument.
          </p>

          <p>
            That argument is made concrete in the{" "}
            <Link className="inline-link" href="/systems">
              semantic layer
            </Link>
            . Each concept and figure is pinned to the public records that
            libraries, museums, and search engines already share — Wikidata and
            the Getty vocabularies — and each work is published as Linked Art, the
            museum data standard. The claims of this exhibition can be followed
            outward into the wider record of art, and the exhibition can be
            ingested by other collection systems as readily as it is read by a
            visitor.
          </p>

          <p>
            Nothing here is meant to dissolve art into explanation. A sentence
            can still be a drawing of thought; an image can still be an image.
            But around each work sits a second work — the system that teaches the
            viewer how to see the first. To exhibit that second work, in public,
            as it changes, is the curatorial proposition of Metaconceptual Art.
          </p>

          <p>
            Because a museum that claims to be honest about its systems must also
            be honest about its own. The exhibition changes over time, and those
            changes are recorded in the{" "}
            <Link className="inline-link" href="/changelog">
              changelog
            </Link>{" "}
            rather than quietly applied. Revision is not maintenance hidden from
            the visitor. It is part of the work on view.
          </p>
        </article>

        <section className="reference-section" aria-labelledby="reading-title">
          <p className="section-kicker">Continue</p>
          <h2 id="reading-title">Read On</h2>
          <p className="section-intro">
            The statement is one entrance. The full proposition is spread across
            the rooms of the site.
          </p>
          <ul className="reference-list">
            <li>
              <Link className="inline-link" href="/theory">
                Theory
              </Link>
              : the primary text, <em>The Artwork Is The System</em>.
            </li>
            <li>
              <Link className="inline-link" href="/artworks">
                Artworks
              </Link>
              : the works on view, each with a Linked Art record.
            </li>
            <li>
              <Link className="inline-link" href="/about">
                About
              </Link>
              : colophon, citation, and provenance of the work.
            </li>
          </ul>
        </section>
      </main>

      <SiteFooter
        active="statement"
        citation="Sun & Rain Works. Curatorial Statement for Metaconceptual Art. 2026. https://www.metaconceptualart.com/statement"
      />
    </>
  );
}
