import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ErrorBoundary from "@/components/ErrorBoundary";
import SparqlConsole from "./SparqlConsole";

export const metadata: Metadata = {
  title: "Query",
  description:
    "Run SPARQL against the complete Metaconceptual Art graph in your browser. Every Linked Art record, expanded to CIDOC-CRM and merged into one queryable RDF dump.",
  alternates: { canonical: "/query" },
};

export default function QueryPage() {
  return (
    <>
      <SiteHeader active="query" />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">SPARQL endpoint</p>
          <h1 id="page-title">Query</h1>
          <p className="definition">
            The collection is not only published as linked data — it is
            queryable. The complete graph (every Linked Art record, expanded to
            CIDOC-CRM and merged) loads into your browser and answers SPARQL
            directly, with no server in between. Pick an example or write your
            own.
          </p>
        </section>

        <section className="reference-section" aria-label="SPARQL console">
          <ErrorBoundary>
            <SparqlConsole />
          </ErrorBoundary>
        </section>

        <section className="reference-section" aria-label="Dataset">
          <div className="prose-block">
            <h2>The dataset</h2>
            <p>
              The query runs over the same public dump you can download and load
              into any triplestore:
            </p>
            <ul>
              <li>
                <a href="/data/metaconceptual-art.nq">metaconceptual-art.nq</a> —
                complete graph, N-Quads
              </li>
              <li>
                <a href="/data/metaconceptual-art.ttl">metaconceptual-art.ttl</a>{" "}
                — complete graph, Turtle
              </li>
              <li>
                <a href="/data/void.ttl">void.ttl</a> and{" "}
                <a href="/data/dcat.jsonld">dcat.jsonld</a> — dataset descriptors
              </li>
            </ul>
            <p>
              Vocabulary: CIDOC-CRM (<code>crm:</code>), Linked Art (
              <code>la:</code>), with Getty AAT/ULAN and Wikidata alignments via{" "}
              <code>la:equivalent</code>.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
