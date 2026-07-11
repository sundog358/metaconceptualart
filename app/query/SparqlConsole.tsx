"use client";

/*
 * In-browser SPARQL 1.1 console (progressive enhancement).
 *
 * The static site ships a complete RDF dump at /data/metaconceptual-art.nq
 * (every Linked Art record, expanded to CIDOC-CRM and merged). This console
 * loads that dump into an N3 store and runs SPARQL against it with Comunica —
 * entirely client-side, so the dataset is genuinely queryable without a server.
 * If JavaScript is off or a dependency fails to load, the preset queries and the
 * dump link below remain the canonical, copy-pastable layer.
 */
import { useCallback, useRef, useState } from "react";

const DUMP_URL = "/data/metaconceptual-art.nq";

const PREFIXES = `PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX la: <https://linked.art/ns/terms/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX aat: <http://vocab.getty.edu/aat/>
PREFIX mca: <https://www.metaconceptualart.com/data/linked-art/>`;

type Preset = { label: string; query: string };

const PRESETS: Preset[] = [
  {
    label: "Works in the collection",
    query: `${PREFIXES}

SELECT ?item ?label WHERE {
  mca:collection la:members_exemplified_by ?item .
  ?item rdfs:label ?label .
} ORDER BY ?label`,
  },
  {
    label: "The Auction as Artwork — all statements",
    query: `${PREFIXES}

SELECT ?predicate ?object WHERE {
  mca:auction-as-artwork ?predicate ?object .
} ORDER BY ?predicate`,
  },
  {
    label: "External alignments (Getty ⇄ Wikidata)",
    query: `${PREFIXES}

SELECT ?concept ?label ?external WHERE {
  ?concept la:equivalent ?external ;
           rdfs:label ?label .
} ORDER BY ?label`,
  },
  {
    label: "Every Getty vocabulary type used",
    query: `${PREFIXES}

SELECT DISTINCT ?type ?label WHERE {
  ?subject crm:P2_has_type ?type .
  ?type a crm:E55_Type ; rdfs:label ?label .
} ORDER BY ?label`,
  },
  {
    label: "What Sun & Rain Works carried out",
    query: `${PREFIXES}

SELECT ?activity ?label WHERE {
  ?activity crm:P14_carried_out_by mca:sun-and-rain-works .
  OPTIONAL { ?activity rdfs:label ?label . }
}`,
  },
];

const NS: [string, string][] = [
  ["http://www.cidoc-crm.org/cidoc-crm/", "crm:"],
  ["https://linked.art/ns/terms/", "la:"],
  ["http://www.w3.org/2000/01/rdf-schema#", "rdfs:"],
  ["http://www.w3.org/1999/02/22-rdf-syntax-ns#", "rdf:"],
  ["http://vocab.getty.edu/aat/", "aat:"],
  ["http://vocab.getty.edu/ulan/", "ulan:"],
  ["http://www.wikidata.org/entity/", "wd:"],
  ["https://www.metaconceptualart.com/data/linked-art/", "mca:"],
];

function abbreviate(value: string): string {
  for (const [full, pfx] of NS) {
    if (value.startsWith(full)) return pfx + value.slice(full.length);
  }
  return value;
}

type Cell = { text: string; href?: string };

export default function SparqlConsole() {
  const [query, setQuery] = useState(PRESETS[0].query);
  const [status, setStatus] = useState(
    "Runs entirely in your browser over the full RDF dump.",
  );
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Cell[][]>([]);
  const [busy, setBusy] = useState(false);

  // Loaded once, then reused across queries.
  const storeRef = useRef<unknown>(null);
  const engineRef = useRef<unknown>(null);

  const ensureReady = useCallback(async () => {
    if (storeRef.current && engineRef.current) return;
    setStatus("Loading the RDF dump and query engine…");
    const [{ Parser, Store }, { QueryEngine }] = await Promise.all([
      import("n3"),
      import("@comunica/query-sparql-rdfjs"),
    ]);
    const res = await fetch(DUMP_URL);
    if (!res.ok) throw new Error(`could not fetch dump (${res.status})`);
    const text = await res.text();
    const store = new Store(new Parser({ format: "application/n-quads" }).parse(text));
    storeRef.current = store;
    engineRef.current = new QueryEngine();
  }, []);

  const run = useCallback(async () => {
    setBusy(true);
    setStatus("Querying…");
    setColumns([]);
    setRows([]);
    try {
      await ensureReady();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const engine = engineRef.current as any;
      const stream = await engine.queryBindings(query, {
        sources: [storeRef.current],
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bindings: any[] = await stream.toArray();

      const cols: string[] = [];
      for (const b of bindings) {
        for (const key of b.keys()) {
          if (!cols.includes(key.value)) cols.push(key.value);
        }
      }
      const table: Cell[][] = bindings.map((b) =>
        cols.map((c) => {
          const term = b.get(c);
          if (!term) return { text: "" };
          const isIri = term.termType === "NamedNode";
          return {
            text: isIri ? abbreviate(term.value) : term.value,
            href: isIri ? term.value : undefined,
          };
        }),
      );
      setColumns(cols);
      setRows(table);
      setStatus(
        table.length === 0
          ? "No results. The query is valid but matched nothing."
          : `${table.length} row${table.length === 1 ? "" : "s"} · queried in your browser.`,
      );
    } catch (err) {
      setStatus(
        `Query failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setBusy(false);
    }
  }, [ensureReady, query]);

  return (
    <div className="sparql-console">
      <div className="sparql-presets" role="group" aria-label="Example queries">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className="sparql-preset"
            onClick={() => setQuery(p.query)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <label className="sparql-label" htmlFor="sparql-input">
        SPARQL query
      </label>
      <textarea
        id="sparql-input"
        className="sparql-input"
        value={query}
        spellCheck={false}
        rows={12}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="sparql-actions">
        <button
          type="button"
          className="sparql-run"
          onClick={run}
          disabled={busy}
        >
          {busy ? "Running…" : "Run query"}
        </button>
        <p className="sparql-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>

      {columns.length > 0 ? (
        <div className="sparql-results" role="region" aria-label="Query results">
          <table className="sparql-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      {cell.href ? (
                        <a href={cell.href} target="_blank" rel="noopener">
                          {cell.text}
                        </a>
                      ) : (
                        cell.text
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
