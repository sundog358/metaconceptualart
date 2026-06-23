"use client";

/*
 * Interactive ego-graph explorer for the Metaconceptual Art knowledge graph.
 *
 * Loads data/graph.json client-side, centres the selected node, and lays its
 * direct neighbours out around it. Click a neighbour (or a list item) to
 * re-centre — exploring the graph without leaving the page. For any node grounded
 * in a Wikidata QID, a live SPARQL query follows the influence links one step
 * further out, the same progressive-enhancement pattern used on the Systems page.
 */
import { useEffect, useMemo, useRef, useState } from "react";

type GraphNode = {
  id: string;
  type: string;
  label: string;
  description?: string;
  wikidata?: string | null;
  getty?: { aat?: string; ulan?: string } | null;
  groveArt?: string | null;
  linkedArt?: string;
};
type GraphEdge = { from: string; relation: string; to: string };
type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  wikidataEntityBase: string;
  gettyVocabBase: string;
};
type Related = { qid: string; label: string; desc?: string };

const SPARQL = "https://query.wikidata.org/sparql";
const DEFAULT_ID = "work:site-as-artwork";

const TYPE_COLOR: Record<string, string> = {
  Artwork: "var(--orange)",
  Concept: "var(--blue)",
  Source: "var(--green)",
  System: "var(--deep)",
  Role: "var(--gold)",
  Revision: "var(--muted)",
  Citation: "var(--muted)",
};
const colorFor = (type: string) => TYPE_COLOR[type] ?? "var(--deep)";
const short = (s: string) => (s.length > 24 ? s.slice(0, 22) + "…" : s);

function relatedQuery(qid: string): string {
  const q =
    "SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {" +
    "  { wd:" +
    qid +
    " wdt:P737 ?item. } UNION { ?item wdt:P737 wd:" +
    qid +
    ". }" +
    '  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }' +
    "} ORDER BY ?itemLabel LIMIT 14";
  return SPARQL + "?format=json&query=" + encodeURIComponent(q);
}

export default function GraphExplorer() {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selectedId, setSelectedId] = useState(DEFAULT_ID);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [related, setRelated] = useState<Related[]>([]);
  const [relatedStatus, setRelatedStatus] = useState("");
  const liveRegion = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/data/graph.json")
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((g: Graph) => {
        if (cancelled) return;
        setGraph(g);
        // Deep link: /explore?node=<id> centres on that node (e.g. from the
        // home "Today" spotlight). Falls back to the default, then first node.
        const wanted =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("node")
            : null;
        if (wanted && g.nodes.some((n) => n.id === wanted)) {
          setSelectedId(wanted);
        } else if (!g.nodes.some((n) => n.id === DEFAULT_ID) && g.nodes[0]) {
          setSelectedId(g.nodes[0].id);
        }
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const byId = useMemo(() => {
    const m = new Map<string, GraphNode>();
    graph?.nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [graph]);

  const types = useMemo(
    () => Array.from(new Set(graph?.nodes.map((n) => n.type) ?? [])),
    [graph],
  );

  const selected = byId.get(selectedId) ?? null;

  // Edges touching the selected node, normalised to {node, relation, direction}.
  const connections = useMemo(() => {
    if (!graph || !selected) return [];
    const out: { node: GraphNode; relation: string; outgoing: boolean }[] = [];
    for (const e of graph.edges) {
      if (e.from === selected.id && byId.get(e.to)) {
        out.push({ node: byId.get(e.to)!, relation: e.relation, outgoing: true });
      } else if (e.to === selected.id && byId.get(e.from)) {
        out.push({
          node: byId.get(e.from)!,
          relation: e.relation,
          outgoing: false,
        });
      }
    }
    return out;
  }, [graph, selected, byId]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (graph?.nodes ?? []).filter(
      (n) =>
        (typeFilter === "all" || n.type === typeFilter) &&
        (!q ||
          n.label.toLowerCase().includes(q) ||
          n.id.toLowerCase().includes(q)),
    );
  }, [graph, query, typeFilter]);

  // Live Wikidata related concepts for the selected node.
  useEffect(() => {
    setRelated([]);
    if (!selected?.wikidata) {
      setRelatedStatus("");
      return;
    }
    let cancelled = false;
    setRelatedStatus("Querying Wikidata…");
    fetch(relatedQuery(selected.wikidata), {
      headers: { Accept: "application/sparql-results+json" },
    })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const rows: Related[] = (data?.results?.bindings ?? [])
          .map((row: Record<string, { value: string }>) => ({
            qid: row.item.value.replace(/^.*\//, ""),
            label: row.itemLabel ? row.itemLabel.value : row.item.value,
            desc: row.itemDescription?.value,
          }))
          .filter((r: Related) => r.qid !== selected.wikidata);
        setRelated(rows);
        setRelatedStatus(
          rows.length
            ? "Live from Wikidata — " + rows.length + " linked by influence."
            : "No influence links returned for this node.",
        );
      })
      .catch(() => {
        if (cancelled) return;
        setRelatedStatus("Wikidata could not be reached.");
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  function select(id: string) {
    setSelectedId(id);
    if (liveRegion.current) {
      liveRegion.current.textContent =
        "Centred on " + (byId.get(id)?.label ?? id);
    }
  }

  if (loadError) {
    return (
      <section className="explore" aria-live="polite">
        <p className="related-status">
          The graph could not be loaded. The full register is available on the{" "}
          <a className="inline-link" href="/systems">
            Systems
          </a>{" "}
          page.
        </p>
      </section>
    );
  }
  if (!graph || !selected) {
    return (
      <section className="explore">
        <p className="related-status">Loading the knowledge graph…</p>
      </section>
    );
  }

  // Ego-graph geometry: selected node at centre, neighbours on an ellipse.
  // Odd counts start at the top; even counts rotate a half-step so a pair fans
  // to the sides instead of stacking vertically over the centre's label.
  const cx = 410;
  const cy = 260;
  const n = connections.length;
  const base = -Math.PI / 2 + (n % 2 === 0 ? Math.PI / n : 0);
  const positioned = connections.map((c, i) => {
    const angle = base + (2 * Math.PI * i) / Math.max(n, 1);
    return {
      ...c,
      x: cx + 322 * Math.cos(angle),
      y: cy + 172 * Math.sin(angle),
    };
  });
  const wd = graph.wikidataEntityBase;
  const getty = graph.gettyVocabBase;

  return (
    <section className="explore" aria-labelledby="explore-heading">
      <h2 id="explore-heading" className="visually-hidden">
        Graph explorer
      </h2>

      <div className="explore-controls">
        <input
          type="search"
          className="explore-search"
          placeholder="Search nodes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search graph nodes"
        />
        <div className="explore-filters" role="group" aria-label="Filter by type">
          <button
            type="button"
            className={typeFilter === "all" ? "is-active" : ""}
            onClick={() => setTypeFilter("all")}
          >
            All
          </button>
          {types.map((t) => (
            <button
              type="button"
              key={t}
              className={typeFilter === t ? "is-active" : ""}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="explore-grid">
        <nav className="explore-list" aria-label="All nodes">
          <ul>
            {matches.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className={n.id === selectedId ? "is-selected" : ""}
                  onClick={() => select(n.id)}
                >
                  <span
                    className="explore-dot"
                    style={{ background: colorFor(n.type) }}
                    aria-hidden="true"
                  />
                  <span className="explore-list-label">{n.label}</span>
                  <span className="explore-list-type">{n.type}</span>
                </button>
              </li>
            ))}
            {matches.length === 0 && (
              <li className="explore-empty">No nodes match.</li>
            )}
          </ul>
        </nav>

        <div className="explore-graph">
          <svg
            viewBox="0 0 820 540"
            role="img"
            aria-label={"Relationships for " + selected.label}
          >
            {positioned.map((p) => (
              <line
                key={"edge-" + p.node.id}
                className="explore-edge"
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
              />
            ))}
            {positioned.map((p) => (
              <text
                key={"rel-" + p.node.id}
                className="explore-edge-label"
                x={cx + (p.x - cx) * 0.58}
                y={cy + (p.y - cy) * 0.58}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {p.outgoing ? p.relation + " →" : "← " + p.relation}
              </text>
            ))}
            {positioned.map((p) => (
              <g
                key={"node-" + p.node.id}
                className="explore-gnode"
                transform={"translate(" + p.x + " " + p.y + ")"}
                role="button"
                tabIndex={0}
                aria-label={"Go to " + p.node.label}
                onClick={() => select(p.node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    select(p.node.id);
                  }
                }}
              >
                <circle
                  r={34}
                  style={{ fill: colorFor(p.node.type), stroke: colorFor(p.node.type) }}
                />
                <text className="explore-gnode-label" y={54} textAnchor="middle">
                  {short(p.node.label)}
                </text>
              </g>
            ))}
            <g transform={"translate(" + cx + " " + cy + ")"}>
              <circle
                className="explore-gnode-center"
                r={48}
                style={{ fill: colorFor(selected.type), stroke: colorFor(selected.type) }}
              />
              <text className="explore-gnode-label is-center" y={70} textAnchor="middle">
                {short(selected.label)}
              </text>
            </g>
          </svg>
          {connections.length === 0 && (
            <p className="related-status">
              This node has no in-graph relations yet — try its Wikidata links
              below, or pick another node.
            </p>
          )}
        </div>
      </div>

      <article className="explore-detail">
        <p className="explore-detail-kind" style={{ color: colorFor(selected.type) }}>
          {selected.type}
        </p>
        <h3>{selected.label}</h3>
        <p className="explore-id">{selected.id}</p>
        {selected.description && <p>{selected.description}</p>}

        {connections.length > 0 && (
          <div className="explore-block">
            <h4>Connections</h4>
            <ul className="explore-connections">
              {connections.map((c, i) => (
                <li key={c.node.id + "-" + i}>
                  <span className="explore-rel">
                    {c.outgoing ? "→ " + c.relation : "← " + c.relation}
                  </span>
                  <button type="button" onClick={() => select(c.node.id)}>
                    {c.node.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="explore-block">
          <h4>Authority &amp; records</h4>
          <ul className="explore-links">
            {selected.wikidata ? (
              <li>
                <a className="wd-link" href={wd + selected.wikidata} target="_blank" rel="noopener">
                  Wikidata {selected.wikidata} ↗
                </a>
              </li>
            ) : null}
            {selected.getty?.aat ? (
              <li>
                <a className="wd-link" href={getty + "aat/" + selected.getty.aat} target="_blank" rel="noopener">
                  Getty AAT {selected.getty.aat} ↗
                </a>
              </li>
            ) : null}
            {selected.getty?.ulan ? (
              <li>
                <a className="wd-link" href={getty + "ulan/" + selected.getty.ulan} target="_blank" rel="noopener">
                  Getty ULAN {selected.getty.ulan} ↗
                </a>
              </li>
            ) : null}
            {selected.linkedArt ? (
              <li>
                <a className="wd-link" href={"/" + selected.linkedArt} target="_blank" rel="noopener">
                  Linked Art record ↗
                </a>
              </li>
            ) : null}
            {!selected.wikidata &&
            !selected.getty?.aat &&
            !selected.getty?.ulan &&
            !selected.linkedArt ? (
              <li className="explore-empty">
                A site-native node — no external authority record.
              </li>
            ) : null}
          </ul>
        </div>

        {selected.wikidata && (
          <div className="explore-block">
            <h4>Related on Wikidata</h4>
            <p className="related-status" role="status" aria-live="polite">
              {relatedStatus}
            </p>
            <ul className="related-list">
              {related.map((r) => (
                <li key={r.qid}>
                  <p className="wd-related-name">
                    <a className="wd-link" href={wd + r.qid} target="_blank" rel="noopener">
                      {r.label}
                    </a>
                    <span className="wd-qid">{r.qid}</span>
                  </p>
                  {r.desc ? <p className="wd-related-desc">{r.desc}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <p ref={liveRegion} className="visually-hidden" aria-live="polite" />
    </section>
  );
}
