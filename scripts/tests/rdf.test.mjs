// RDF dump integrity: the merged graph parses, is substantial, and is not stale
// — every Linked Art record must appear as a subject (run `npm run build:rdf`
// after adding or renaming records).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import N3 from "n3";

const DUMP = "data/metaconceptual-art.nq";
const DIR = "data/linked-art";
const LA_CONTEXT = "https://linked.art/ns/v1/linked-art.json";

const quads = new N3.Parser({ format: "application/n-quads" }).parse(
  readFileSync(DUMP, "utf8"),
);
const subjects = new Set(quads.map((q) => q.subject.value));

test("rdf dump: parses with a substantial triple count", () => {
  assert.ok(quads.length > 500, `expected >500 triples, got ${quads.length}`);
});

const records = readdirSync(DIR).filter(
  (f) => f.endsWith(".json") && !f.startsWith("activity-stream"),
);

for (const f of records) {
  const doc = JSON.parse(readFileSync(join(DIR, f), "utf8"));
  if (doc["@context"] !== LA_CONTEXT) continue;
  test(`rdf dump: contains ${f} as a subject (dump not stale)`, () => {
    assert.ok(
      subjects.has(doc.id),
      `${doc.id} missing from dump — run \`npm run build:rdf\``,
    );
  });
}
