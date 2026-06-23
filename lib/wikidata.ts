// Shared client-side Wikidata helpers (SPARQL). Used by the three interactive
// islands — the graph explorer, the systems related panel, and the daily
// spotlight — so the query + parse logic lives in one place.

const SPARQL = "https://query.wikidata.org/sparql";
const HEADERS = { Accept: "application/sparql-results+json" };

export type Related = { qid: string; label: string; desc?: string };
export type Fact = { prop: string; value: string; qid: string };

type Binding = Record<string, { value: string }>;

const qidFromIri = (iri: string) => iri.replace(/^.*\//, "");

async function runQuery(query: string): Promise<Binding[]> {
  const url = SPARQL + "?format=json&query=" + encodeURIComponent(query);
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  return data?.results?.bindings ?? [];
}

// Items connected to any of the given QIDs by P737 ("influenced by"), in either
// direction; the anchors themselves are excluded.
export async function relatedByInfluence(
  qids: string[],
  limit = 24,
): Promise<Related[]> {
  if (!qids.length) return [];
  const values = qids.map((q) => "wd:" + q).join(" ");
  const exclude = qids.map((q) => "wd:" + q).join(", ");
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
    "} ORDER BY ?itemLabel LIMIT " +
    limit;
  const rows = await runQuery(query);
  return rows.map((r) => ({
    qid: qidFromIri(r.item.value),
    label: r.itemLabel ? r.itemLabel.value : r.item.value,
    desc: r.itemDescription?.value,
  }));
}

// A few entity-valued statements about one QID, each paired with a readable
// property name — the grounded "From Wikidata" facts for a node.
export async function entityFacts(qid: string, limit = 12): Promise<Fact[]> {
  const query =
    "SELECT ?prop ?v ?vLabel WHERE {" +
    "  VALUES (?prop ?pred) {" +
    '    ("instance of" wdt:P31) ("subclass of" wdt:P279)' +
    '    ("movement" wdt:P135) ("part of" wdt:P361)' +
    '    ("influenced by" wdt:P737) ("field of work" wdt:P101)' +
    '    ("occupation" wdt:P106)' +
    "  }" +
    "  wd:" +
    qid +
    " ?pred ?v ." +
    '  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }' +
    "} LIMIT " +
    limit;
  const rows = await runQuery(query);
  return rows.map((r) => ({
    prop: r.prop.value,
    value: r.vLabel ? r.vLabel.value : r.v.value,
    qid: qidFromIri(r.v.value),
  }));
}
