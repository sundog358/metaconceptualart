// Build the canonical RDF dump from the Linked Art JSON-LD records.
//
// The dump IS the graph: every data/linked-art/*.json record (the ones on the
// Linked Art context) is expanded to CIDOC-CRM / Linked Art RDF and merged into
// one dataset, written as N-Quads (data/metaconceptual-art.nq) and Turtle
// (data/metaconceptual-art.ttl). This supersedes the earlier hand-written
// schema.org summary so the public dump can never drift from the records.
//
// Expansion is fully offline and deterministic: the linked.art context is
// vendored at scripts/vendor/linked-art-context.json and all type/authority IRIs
// are already embedded in the records, so no remote vocabularies are fetched.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import jsonld from "jsonld";
import N3 from "n3";

const DIR = "data/linked-art";
const CTX_URL = "https://linked.art/ns/v1/linked-art.json";
const ctx = JSON.parse(
  readFileSync("scripts/vendor/linked-art-context.json", "utf8"),
);

const documentLoader = async (url) => {
  if (url === CTX_URL || url.startsWith("https://linked.art/ns/v1/")) {
    return { contextUrl: null, documentUrl: url, document: ctx };
  }
  // Embedded IRIs are enough to build the graph; never reach out to the network.
  return { contextUrl: null, documentUrl: url, document: {} };
};

const files = readdirSync(DIR)
  .filter((f) => f.endsWith(".json") && !f.startsWith("activity-stream"))
  .sort();

let merged = "";
let recordCount = 0;
for (const f of files) {
  const doc = JSON.parse(readFileSync(join(DIR, f), "utf8"));
  if (doc["@context"] !== CTX_URL) continue;
  let nq = await jsonld.toRDF(doc, {
    format: "application/n-quads",
    documentLoader,
  });
  // Blank-node labels restart per toRDF() call; namespace them per record so
  // distinct blank nodes from different files never collapse into one.
  const tag = `r${recordCount}`;
  nq = nq.replace(/_:(b\d+)/g, `_:${tag}$1`);
  merged += nq;
  recordCount += 1;
}

const lines = [...new Set(merged.trim().split("\n").filter(Boolean))].sort();
const nquads = lines.join("\n") + "\n";
writeFileSync("data/metaconceptual-art.nq", nquads);

const quads = new N3.Parser({ format: "application/n-quads" }).parse(nquads);
const writer = new N3.Writer({
  prefixes: {
    crm: "http://www.cidoc-crm.org/cidoc-crm/",
    la: "https://linked.art/ns/terms/",
    aat: "http://vocab.getty.edu/aat/",
    ulan: "http://vocab.getty.edu/ulan/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    dcterms: "http://purl.org/dc/terms/",
    wd: "http://www.wikidata.org/entity/",
    cc: "https://creativecommons.org/licenses/",
    mca: "https://www.metaconceptualart.com/data/linked-art/",
  },
});
writer.addQuads(quads);
const ttl = await new Promise((resolve, reject) =>
  writer.end((err, result) => (err ? reject(err) : resolve(result))),
);
writeFileSync("data/metaconceptual-art.ttl", ttl);

console.log(
  `RDF dump: ${quads.length} triples from ${recordCount} records ` +
    `-> data/metaconceptual-art.nq + data/metaconceptual-art.ttl`,
);
