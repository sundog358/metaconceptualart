// Knowledge-graph integrity: nodes are well-formed, every edge connects two real
// nodes, and the anchor concepts exist.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const g = JSON.parse(readFileSync("data/graph.json", "utf8"));
const ids = new Set(g.nodes.map((n) => n.id));

test("graph: every node has id, type, and label", () => {
  for (const n of g.nodes) {
    assert.ok(n.id && n.type && n.label, `node ${n.id ?? "(no id)"} complete`);
  }
});

test("graph: node ids are unique", () => {
  assert.equal(ids.size, g.nodes.length, "no duplicate node ids");
});

test("graph: every edge connects two existing nodes and names a relation", () => {
  for (const e of g.edges) {
    assert.ok(ids.has(e.from), `edge.from ${e.from} exists`);
    assert.ok(ids.has(e.to), `edge.to ${e.to} exists`);
    assert.ok(e.relation, `edge ${e.from}->${e.to} has a relation`);
  }
});

test("graph: anchor concepts are real nodes", () => {
  for (const a of g.anchorConcepts) {
    assert.ok(ids.has(a), `anchor ${a} is a node`);
  }
});
