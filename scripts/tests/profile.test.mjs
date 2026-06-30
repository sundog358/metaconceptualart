// Metaconceptual Art profile integrity: the live claim instance should satisfy
// the lightweight schema's required categories without adding undeclared fields.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const schema = JSON.parse(
  readFileSync("data/profile/metaconceptual-art-claim.schema.json", "utf8"),
);
const claim = JSON.parse(
  readFileSync("data/profile/metaconceptual-art-claim.json", "utf8"),
);

const required = schema.required;
const allowed = new Set(Object.keys(schema.properties));

test("profile claim: required fields are present", () => {
  for (const key of required) {
    assert.ok(claim[key] !== undefined, `${key} present`);
  }
});

test("profile claim: no undeclared top-level fields", () => {
  for (const key of Object.keys(claim)) {
    assert.ok(allowed.has(key), `${key} is declared by the schema`);
  }
});

test("profile claim: evidence categories meet minimum counts", () => {
  for (const [key, config] of Object.entries(schema.properties)) {
    if (config.type !== "array") continue;
    assert.ok(Array.isArray(claim[key]), `${key} is an array`);
    assert.ok(
      claim[key].length >= config.minItems,
      `${key} has at least ${config.minItems} item(s)`,
    );
  }
});

test("profile claim: evidence links are absolute URLs", () => {
  for (const [key, value] of Object.entries(claim)) {
    if (!Array.isArray(value)) continue;
    for (const item of value) {
      assert.ok(item.label, `${key} item has a label`);
      assert.match(item.url, /^https:\/\//, `${key} item URL is absolute HTTPS`);
    }
  }
});
