import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WikidataRelated from "./WikidataRelated";

export const metadata: Metadata = {
  title: "Systems",
  description:
    "The Metaconceptual Art semantic system: a first knowledge graph of artworks, concepts, sources, viewers, revisions, and citations.",
  alternates: { canonical: "/systems" },
};

type Node = {
  id: string;
  type: string;
  name: string;
  relation: string;
  lod: { href: string; label: string; getty?: boolean }[];
};

const NODES: Node[] = [
  { id: "work:site-as-artwork", type: "Artwork", name: "The Website Itself", relation: "contains proposition set", lod: [] },
  { id: "work:eight-sentences", type: "Artwork", name: "Eight Sentences", relation: "cites source:lewitt", lod: [] },
  { id: "work:wtfisart", type: "Artwork", name: "www.wtfisart.com", relation: "created during source:sothebys-photographs-2009", lod: [
    { href: "/data/linked-art/wtfisart", label: "Linked Art" },
  ] },
  { id: "work:construction-museum", type: "Artwork", name: "Construction of the Museum as Concept", relation: "expresses concept:institutional-frame", lod: [] },
  { id: "work:art-market-reform", type: "Artwork", name: "Art Market Reform", relation: "frames market as artistic condition", lod: [
    { href: "/data/linked-art/art-market-reform", label: "Linked Art" },
  ] },
  { id: "work:eightfold-sprocket", type: "Artwork", name: "Eightfold Sprocket", relation: "carries work:eight-sentences", lod: [
    { href: "/data/linked-art/eightfold-sprocket", label: "Linked Art" },
  ] },
  { id: "work:movement-graph", type: "Artwork", name: "Movement Graph", relation: "activates concept:linked-open-data", lod: [
    { href: "/data/linked-art/movement-graph", label: "Linked Art" },
  ] },
  { id: "work:movement-record", type: "Artwork", name: "Proof of Movement: Metaconceptual Art", relation: "defines profile for concept:metaconceptual-art", lod: [
    { href: "/data/linked-art/movement-record", label: "Linked Art" },
  ] },
  { id: "concept:metaconceptual-art", type: "Concept", name: "Metaconceptual Art", relation: "evidenced by works, records, and provenance", lod: [
    { href: "/data/linked-art/concept-metaconceptual-art", label: "Linked Art" },
  ] },
  { id: "concept:conceptual-art", type: "Concept", name: "Conceptual art", relation: "expressed by the work", lod: [
    { href: "https://www.wikidata.org/wiki/Q203209", label: "Q203209" },
    { href: "https://vocab.getty.edu/page/aat/300264827", label: "AAT 300264827", getty: true },
  ] },
  { id: "concept:institutional-frame", type: "Concept", name: "Institutional critique", relation: "frames value", lod: [
    { href: "https://www.wikidata.org/wiki/Q6041145", label: "Q6041145" },
  ] },
  { id: "concept:systems-art", type: "Concept", name: "Systems art", relation: "informs concept:knowledge-graph", lod: [
    { href: "https://www.wikidata.org/wiki/Q919251", label: "Q919251" },
    { href: "https://vocab.getty.edu/page/aat/300047869", label: "AAT 300047869", getty: true },
  ] },
  { id: "concept:net-art", type: "Concept", name: "Internet art", relation: "sites the website", lod: [
    { href: "https://www.wikidata.org/wiki/Q1569950", label: "Q1569950" },
    { href: "https://vocab.getty.edu/page/aat/300419940", label: "AAT 300419940", getty: true },
  ] },
  { id: "concept:readymade", type: "Concept", name: "Found object / readymade", relation: "influences concept:conceptual-art", lod: [
    { href: "https://www.wikidata.org/wiki/Q572916", label: "Q572916" },
    { href: "https://vocab.getty.edu/page/aat/300047210", label: "AAT 300047210", getty: true },
  ] },
  { id: "concept:knowledge-graph", type: "Concept", name: "Knowledge graph", relation: "form of the meta-museum", lod: [
    { href: "https://www.wikidata.org/wiki/Q33002955", label: "Q33002955" },
  ] },
  { id: "concept:semantic-web", type: "Concept", name: "Semantic Web", relation: "standards practice for machine-readable legitimacy", lod: [
    { href: "https://www.wikidata.org/wiki/Q54837", label: "Q54837" },
    { href: "https://vocab.getty.edu/page/aat/300391330", label: "AAT 300391330", getty: true },
  ] },
  { id: "concept:linked-open-data", type: "Concept", name: "Linked open data", relation: "public evidence medium", lod: [
    { href: "https://www.wikidata.org/wiki/Q18692990", label: "Q18692990" },
  ] },
  { id: "concept:provenance", type: "Concept", name: "Provenance", relation: "tracked by the system", lod: [
    { href: "https://www.wikidata.org/wiki/Q1773840", label: "Q1773840" },
    { href: "https://vocab.getty.edu/page/aat/300055863", label: "AAT 300055863", getty: true },
  ] },
  { id: "source:lewitt", type: "Source", name: "Sol LeWitt", relation: "informs sentence sequence", lod: [
    { href: "https://www.wikidata.org/wiki/Q168587", label: "Q168587" },
    { href: "https://vocab.getty.edu/page/ulan/500115429", label: "ULAN 500115429", getty: true },
  ] },
  { id: "source:kosuth", type: "Source", name: "Joseph Kosuth", relation: "art as inquiry into art", lod: [
    { href: "https://www.wikidata.org/wiki/Q313113", label: "Q313113" },
    { href: "https://vocab.getty.edu/page/ulan/500115645", label: "ULAN 500115645", getty: true },
  ] },
  { id: "source:duchamp", type: "Source", name: "Marcel Duchamp", relation: "designation and the readymade", lod: [
    { href: "https://www.wikidata.org/wiki/Q5912", label: "Q5912" },
    { href: "https://vocab.getty.edu/page/ulan/500115393", label: "ULAN 500115393", getty: true },
  ] },
  { id: "source:sothebys-photographs-2009", type: "Event", name: "Sotheby's Photographs auction (sale N08533, March 2009)", relation: "context for work:wtfisart", lod: [] },
  { id: "role:viewer", type: "Role", name: "Viewer", relation: "activates meaning", lod: [] },
  { id: "record:revision-2026-06-19", type: "Revision", name: "Wikidata Layer", relation: "grounds nodes in linked data", lod: [] },
  { id: "record:citation-primary", type: "Citation", name: "Recommended Citation", relation: "makes the work referenceable", lod: [] },
];

export default function SystemsPage() {
  return (
    <>
      <SiteHeader active="systems" />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Meta-Wiki v1</p>
          <h1 id="page-title">Systems</h1>
          <p className="definition">
            The semantic layer turns the site into a small knowledge graph:
            works, concepts, sources, institutions, viewers, revisions, and
            citations linked as the first form of the meta-museum.
          </p>
        </section>

        <section
          className="system-section page-system"
          aria-labelledby="graph-title"
        >
          <div>
            <p className="section-kicker">Visible graph</p>
            <h2 id="graph-title">Movement Graph</h2>
          </div>
          <div className="system-copy">
            <p>
              This graph is deliberately compact. Its purpose is to establish a
              repeatable grammar for future works: stable IDs, node types, and
              relations that can be expanded into a fuller Meta-Wiki and a
              public Movement Record.
            </p>
            <div className="graph-panel">
              <svg
                viewBox="0 0 760 420"
                role="img"
                aria-labelledby="systems-graph-title systems-graph-description"
                focusable="false"
              >
                <title id="systems-graph-title">
                  Ten-node Metaconceptual Art knowledge graph
                </title>
                <desc id="systems-graph-description">
                  A graph connecting site, artworks, concepts, source,
                  institution, viewer, provenance, revision, and citation.
                </desc>
                <g className="graph-lines">
                  <path d="M380 70 L180 150" />
                  <path d="M380 70 L380 150" />
                  <path d="M380 70 L580 150" />
                  <path d="M180 150 L120 275" />
                  <path d="M180 150 L265 275" />
                  <path d="M380 150 L380 275" />
                  <path d="M580 150 L500 275" />
                  <path d="M580 150 L640 275" />
                  <path d="M380 275 L500 350" />
                </g>
                <g
                  className="graph-node graph-node-root"
                  transform="translate(380 70)"
                >
                  <circle r="52" />
                  <text>site</text>
                </g>
                <g className="graph-node" transform="translate(180 150)">
                  <circle r="42" />
                  <text>works</text>
                </g>
                <g className="graph-node" transform="translate(380 150)">
                  <circle r="42" />
                  <text>concept</text>
                </g>
                <g className="graph-node" transform="translate(580 150)">
                  <circle r="42" />
                  <text>system</text>
                </g>
                <g className="graph-node" transform="translate(120 275)">
                  <circle r="38" />
                  <text>source</text>
                </g>
                <g className="graph-node" transform="translate(265 275)">
                  <circle r="38" />
                  <text>museum</text>
                </g>
                <g className="graph-node" transform="translate(380 275)">
                  <circle r="38" />
                  <text>viewer</text>
                </g>
                <g className="graph-node" transform="translate(500 275)">
                  <circle r="38" />
                  <text>revision</text>
                </g>
                <g className="graph-node" transform="translate(640 275)">
                  <circle r="38" />
                  <text>citation</text>
                </g>
                <g className="graph-node" transform="translate(500 350)">
                  <circle r="38" />
                  <text>record</text>
                </g>
              </svg>
            </div>
            <a className="graph-cta" href="/explore">
              Walk this graph in the Explorer →
            </a>
          </div>
        </section>

        <section className="collection-section" aria-labelledby="nodes-title">
          <div className="section-heading">
            <p className="section-kicker">Node register</p>
            <h2 id="nodes-title">Stable IDs, Linked Open Data</h2>
            <p className="section-intro">
              Each node has a stable site ID. Where a node names a real concept,
              movement, or figure, it is grounded in a Wikidata identifier and,
              for art-domain nodes, the Getty vocabularies — ULAN for people, AAT
              for concepts — so the museum connects outward to both the general
              and the art-specific linked-data graph. The full register lives in{" "}
              <a className="inline-link" href="/data/graph.json">
                data/graph.json
              </a>{" "}
              and a compact RDF export at{" "}
              <a className="inline-link" href="/data/metaconceptual-art.ttl">
                data/metaconceptual-art.ttl
              </a>
              .
            </p>
          </div>
          <div className="table-wrap">
            <table className="node-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Relation</th>
                  <th>Linked open data</th>
                </tr>
              </thead>
              <tbody>
                {NODES.map((n) => (
                  <tr key={n.id}>
                    <td>{n.id}</td>
                    <td>{n.type}</td>
                    <td>{n.name}</td>
                    <td>{n.relation}</td>
                    <td className="lod-cell">
                      {n.lod.length === 0
                        ? "—"
                        : n.lod.map((l) => (
                            <a
                              key={l.href}
                              className={
                                l.getty ? "wd-link getty-link" : "wd-link"
                              }
                              href={l.href}
                              target="_blank"
                              rel="noopener"
                            >
                              {l.label}
                            </a>
                          ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="split-section wider-graph"
          aria-labelledby="wider-title"
        >
          <div className="prose-block">
            <p className="section-kicker">Beyond the museum walls</p>
            <h2 id="wider-title">Connected To The Wider Graph</h2>
            <p>
              The museum is not a closed building. Its anchor concepts are
              grounded in Wikidata, the same open knowledge base that art
              history, museums, and search engines draw on. From those anchors
              the graph reaches outward into the shared record of art.
            </p>
            <ul className="anchor-list" aria-label="Anchor concepts in Wikidata">
              <li>
                <a
                  className="wd-link"
                  href="https://www.wikidata.org/wiki/Q203209"
                  target="_blank"
                  rel="noopener"
                >
                  Conceptual art
                </a>
                <span className="wd-qid">Q203209</span>
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
                <span className="wd-qid">Q6041145</span>
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
                <span className="wd-qid">Q919251</span>
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
                <span className="wd-qid">Q1569950</span>
              </li>
            </ul>
          </div>
          <div className="related-panel">
            <p className="section-kicker">Live query</p>
            <h3>Related Concepts</h3>
            <p className="related-intro">
              Concepts, movements, and figures that Wikidata connects to the
              anchors above by lines of influence — fetched live when you open
              this page.
            </p>
            <WikidataRelated />
          </div>
        </section>
      </main>

      <SiteFooter
        active="systems"
        citation="Sun & Rain Works. Metaconceptual Art Semantic Layer v1. 2026. https://www.metaconceptualart.com/systems"
      />
    </>
  );
}
