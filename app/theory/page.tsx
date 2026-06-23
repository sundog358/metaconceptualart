import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Theory",
  description:
    "Primary theory text for Metaconceptual Art: art about the conditions that make art legible.",
  alternates: { canonical: "/theory/" },
};

export default function TheoryPage() {
  return (
    <>
      <SiteHeader active="theory" />

      <main className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Reading room</p>
          <h1 id="page-title">Theory</h1>
          <p className="definition">
            Metaconceptual Art begins where the artwork is no longer separable
            from the conditions that make it visible, valuable, archived, and
            contested.
          </p>
        </section>

        <article className="essay" id="essay-artwork-is-the-system">
          <header className="essay-header">
            <p className="metadata-line">
              text:artwork-is-the-system / primary text / 2026
            </p>
            <h2>The Artwork Is The System</h2>
          </header>

          <p>
            Metaconceptual Art treats art as a system of relations. It does not
            begin with the object alone, because the object is never alone. The
            object arrives with conditions: a frame, a price, a wall, a website,
            a history, a platform, a caption, an institution, a viewer, and a set
            of permissions that decide whether it can appear as art.
          </p>

          <p>
            Conceptual art shifted attention from the handmade object toward the
            idea. Metaconceptual Art shifts attention again, from the idea toward
            the system that allows the idea to be named, circulated, collected,
            remembered, and believed. The idea is not abandoned. It is placed
            inside its infrastructure.
          </p>

          <p>
            This is why the website matters. The page is not merely a container
            for documentation. It is a surface where art, writing, metadata,
            authorship, revision, and navigation appear together. The title,
            link, alt text, citation, image, and structured data are all part of
            the work&apos;s field. The artwork is not hidden behind the
            interface. The interface is one of its forms.
          </p>

          <p>
            The Eight Sentences On Metaconceptual Art are written after Sol
            LeWitt, not to imitate his propositions, but to acknowledge the
            sentence as an artistic unit. A sentence can be a drawing of thought.
            It can be an instruction, a frame, a rule, or a wall label for a work
            that has not yet become visible.
          </p>

          <p>
            Metaconceptual Art also inherits the pressure of institutional
            critique. It asks who has permission to define art, who benefits from
            its scarcity, who is excluded by its language, and how value moves
            through museums, markets, archives, and networks. These structures
            are not outside the artwork. They are part of its material.
          </p>

          <p>
            The aim is not to dissolve art into explanation. The aim is to make
            explanation, provenance, relation, and context visible as artistic
            material. A painting can still be a painting. An image can still be
            an image. But around each work is a second work: the system that
            teaches the viewer how to see it.
          </p>

          <p>
            The meta-museum begins as a small set of links. Artwork points to
            concept. Concept points to source. Source points to institution.
            Viewer activates meaning. Revision alters claim. Citation makes the
            work citable. The museum becomes less a building than a readable
            structure of relations.
          </p>
        </article>

        <section className="reference-section" aria-labelledby="influence-title">
          <p className="section-kicker">Lineage</p>
          <h2 id="influence-title">Influences And Coordinates</h2>
          <p className="section-intro">
            Each coordinate links to its entry in Wikidata, the open knowledge
            base, so this lineage connects to the wider record of art.
          </p>
          <ul className="reference-list">
            <li>
              <a
                className="wd-link"
                href="https://www.wikidata.org/wiki/Q168587"
                target="_blank"
                rel="noopener"
              >
                Sol LeWitt
              </a>
              : sentence as conceptual unit and rule-based form.
            </li>
            <li>
              <a
                className="wd-link"
                href="https://www.wikidata.org/wiki/Q313113"
                target="_blank"
                rel="noopener"
              >
                Joseph Kosuth
              </a>
              : art as inquiry into the conditions of art.
            </li>
            <li>
              <a
                className="wd-link"
                href="https://www.wikidata.org/wiki/Q5912"
                target="_blank"
                rel="noopener"
              >
                Marcel Duchamp
              </a>
              : designation, context, and the readymade.
            </li>
            <li>
              <a
                className="wd-link"
                href="https://www.wikidata.org/wiki/Q6041145"
                target="_blank"
                rel="noopener"
              >
                Institutional critique
              </a>
              : the museum, market, and frame as material.
            </li>
            <li>
              <a
                className="wd-link"
                href="https://www.wikidata.org/wiki/Q919251"
                target="_blank"
                rel="noopener"
              >
                Systems art
              </a>
              : relation, process, feedback, and structure.
            </li>
            <li>
              <a
                className="wd-link"
                href="https://www.wikidata.org/wiki/Q1569950"
                target="_blank"
                rel="noopener"
              >
                Internet art
              </a>
              : website, protocol, page, and browser as artistic site.
            </li>
          </ul>
        </section>
      </main>

      <SiteFooter
        active="theory"
        citation="Sun & Rain Works. The Artwork Is The System. 2026. Primary text for Metaconceptual Art. https://www.metaconceptualart.com/theory/"
      />
    </>
  );
}
