"use client";

/*
 * "Today in the Graph" — a daily spotlight, adapted from the Artwork of the Day
 * reference (metahistorybook.com). It deterministically features one node from
 * the Metaconceptual Art graph per day (stable until midnight UTC), and — in the
 * spirit of that project's grounded-over-generated thesis — narrates a few real
 * Wikidata statements as a cited "From Wikidata" facts block rather than any
 * generated prose. Fully client-side, so it fits the static export.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { entityFacts, type Fact } from "@/lib/wikidata";

type GraphNode = {
  id: string;
  type: string;
  label: string;
  description?: string;
  wikidata?: string | null;
  linkedArt?: string;
};
type Graph = {
  nodes: GraphNode[];
  wikidataEntityBase: string;
};

const TYPE_COLOR: Record<string, string> = {
  Artwork: "var(--orange)",
  Concept: "var(--blue)",
  Source: "var(--green)",
  System: "var(--deep)",
  Role: "var(--gold)",
  Revision: "var(--muted)",
  Citation: "var(--muted)",
};
const colorFor = (t: string) => TYPE_COLOR[t] ?? "var(--deep)";

// Day-of-year in UTC, so the spotlight is the same for everyone on a given day.
function dayOfYearUTC(): number {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((today - start) / 86_400_000);
}

export default function TodaySpotlight() {
  const [nodes, setNodes] = useState<GraphNode[] | null>(null);
  const [wdBase, setWdBase] = useState("https://www.wikidata.org/wiki/");
  const [index, setIndex] = useState<number | null>(null);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [factStatus, setFactStatus] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/data/graph.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((g: Graph) => {
        if (cancelled || !g.nodes?.length) return;
        setNodes(g.nodes);
        setWdBase(g.wikidataEntityBase);
        setIndex(dayOfYearUTC() % g.nodes.length);
      })
      .catch(() => !cancelled && setNodes([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const node = useMemo(
    () => (nodes && index != null ? nodes[index] : null),
    [nodes, index],
  );

  useEffect(() => {
    setFacts([]);
    if (!node?.wikidata) {
      setFactStatus("");
      return;
    }
    let cancelled = false;
    setFactStatus("Reading Wikidata…");
    entityFacts(node.wikidata)
      .then((rows) => {
        if (cancelled) return;
        setFacts(rows);
        setFactStatus(rows.length ? "" : "No structured statements returned.");
      })
      .catch(() => !cancelled && setFactStatus("Wikidata could not be reached."));
    return () => {
      cancelled = true;
    };
  }, [node]);

  function surprise() {
    if (!nodes || nodes.length < 2 || index == null) return;
    let n = index;
    while (n === index) n = Math.floor((dayOfYearUTC() + performance.now()) % nodes.length);
    setIndex(n);
  }

  if (!nodes) {
    return (
      <section className="today" aria-labelledby="today-title">
        <div className="today-head">
          <p className="section-kicker">Daily spotlight</p>
          <h2 id="today-title">Today in the Graph</h2>
        </div>
        <p className="related-status">Loading today&apos;s node…</p>
      </section>
    );
  }
  if (!node) return null;

  return (
    <section className="today" aria-labelledby="today-title">
      <div className="today-head">
        <p className="section-kicker">Daily spotlight</p>
        <h2 id="today-title">Today in the Graph</h2>
        <button type="button" className="today-shuffle" onClick={surprise}>
          🎲 Surprise me
        </button>
      </div>

      <article className="today-card">
        <p className="today-kind" style={{ color: colorFor(node.type) }}>
          {node.type}
        </p>
        <h3>{node.label}</h3>
        {node.description && <p className="today-desc">{node.description}</p>}

        {node.wikidata ? (
          <div className="today-facts">
            <p className="today-badge">📋 From Wikidata · CC0</p>
            {factStatus && <p className="related-status">{factStatus}</p>}
            {facts.length > 0 && (
              <ul className="today-fact-list">
                {facts.map((f, i) => (
                  <li key={f.prop + f.qid + i}>
                    <span className="today-fact-prop">{f.prop}</span>
                    <a
                      className="wd-link"
                      href={wdBase + f.qid}
                      target="_blank"
                      rel="noopener"
                    >
                      {f.value}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="today-native">
            A site-native node — its meaning lives in how it connects. Follow it
            into the graph.
          </p>
        )}

        <div className="today-actions">
          <Link className="entry-link" href={"/explore?node=" + node.id}>
            Explore this node →
          </Link>
          {node.linkedArt ? (
            <a
              className="wd-link"
              href={"/" + node.linkedArt}
              target="_blank"
              rel="noopener"
            >
              Linked Art record ↗
            </a>
          ) : null}
          {node.wikidata ? (
            <a
              className="wd-link"
              href={wdBase + node.wikidata}
              target="_blank"
              rel="noopener"
            >
              Wikidata {node.wikidata} ↗
            </a>
          ) : null}
        </div>

        <p className="today-note">
          A different node each day, grounded in real records — stable until
          midnight UTC.
        </p>
      </article>
    </section>
  );
}
