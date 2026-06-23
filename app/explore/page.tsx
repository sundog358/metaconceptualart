import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ErrorBoundary from "@/components/ErrorBoundary";
import GraphExplorer from "./GraphExplorer";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore the Metaconceptual Art knowledge graph: follow works, concepts, and sources through their relations and outward into Wikidata and the Getty vocabularies.",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  return (
    <>
      <SiteHeader active="explore" />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Knowledge graph</p>
          <h1 id="page-title">Explore</h1>
          <p className="definition">
            The same graph the Systems page lists, made walkable. Pick any node to
            see what it connects to, follow a relation to the next node without
            leaving the page, and step outward into the shared record of art via
            Wikidata and the Getty vocabularies.
          </p>
        </section>

        <ErrorBoundary>
          <GraphExplorer />
        </ErrorBoundary>
      </main>

      <SiteFooter
        active="explore"
        citation="Sun & Rain Works. Metaconceptual Art Graph Explorer. 2026. https://www.metaconceptualart.com/explore"
      />
    </>
  );
}
