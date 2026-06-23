"use client";

/*
 * Live link into the Wikidata graph (progressive enhancement).
 *
 * The seed items below render server-side and remain the canonical layer if
 * JavaScript is off or Wikidata is unreachable. On mount we follow the anchor
 * concepts one step outward (P737, "influenced by") and replace the seed list
 * with live results.
 */
import { useEffect, useState } from "react";

type Related = { qid: string; label: string; desc?: string };

const ANCHORS = ["Q203209", "Q6041145", "Q919251", "Q1569950"];
const ENDPOINT = "https://query.wikidata.org/sparql";
const ENTITY = "https://www.wikidata.org/wiki/";

const SEED: Related[] = [
  {
    qid: "Q5912",
    label: "Marcel Duchamp",
    desc: "Designation, context, and the readymade.",
  },
  {
    qid: "Q4317200",
    label: "Neo-conceptual art",
    desc: "Art movement extending the conceptual lineage.",
  },
  {
    qid: "Q17153088",
    label: "Post-conceptual",
    desc: "Art theory after conceptual art.",
  },
];

function buildUrl(): string {
  const values = ANCHORS.map((q) => "wd:" + q).join(" ");
  const exclude = ANCHORS.map((q) => "wd:" + q).join(", ");
  const query =
    "SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {" +
    "  VALUES ?anchor { " +
    values +
    " }" +
    "  { ?anchor wdt:P737 ?item. } UNION { ?item wdt:P737 ?anchor. }" +
    "  FILTER(?item NOT IN (" +
    exclude +
    "))" +
    '  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }' +
    "}" +
    "ORDER BY ?itemLabel LIMIT 24";
  return ENDPOINT + "?format=json&query=" + encodeURIComponent(query);
}

export default function WikidataRelated() {
  const [items, setItems] = useState<Related[]>(SEED);
  const [status, setStatus] = useState(
    "Related concepts load from Wikidata in the browser.",
  );

  useEffect(() => {
    let cancelled = false;
    setStatus("Querying Wikidata…");
    fetch(buildUrl(), {
      headers: { Accept: "application/sparql-results+json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const rows: Related[] = (data?.results?.bindings ?? []).map(
          (row: Record<string, { value: string }>) => ({
            qid: row.item.value.replace(/^.*\//, ""),
            label: row.itemLabel ? row.itemLabel.value : row.item.value,
            desc: row.itemDescription?.value,
          }),
        );
        if (!rows.length) {
          setStatus("No related concepts returned.");
          return;
        }
        setItems(rows);
        setStatus("Live from Wikidata — " + rows.length + " related concepts.");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus(
          "Wikidata could not be reached. The seed concepts above remain the canonical layer.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <p
        id="wikidata-status"
        className="related-status"
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
      <ul id="wikidata-related" className="related-list">
        {items.map((it) => (
          <li key={it.qid}>
            <p className="wd-related-name">
              <a
                className="wd-link"
                href={ENTITY + it.qid}
                target="_blank"
                rel="noopener"
              >
                {it.label}
              </a>
              <span className="wd-qid">{it.qid}</span>
            </p>
            {it.desc ? <p className="wd-related-desc">{it.desc}</p> : null}
          </li>
        ))}
      </ul>
    </>
  );
}
