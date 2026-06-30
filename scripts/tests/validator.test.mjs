import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

function runValidator(path) {
  return spawnSync(process.execPath, ["scripts/validate-claim.mjs", path], {
    encoding: "utf8",
  });
}

test("validator: current claim reaches interoperable conformance", () => {
  const result = runValidator("data/profile/metaconceptual-art-claim.json");
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Conformance: Interoperable/);
});

test("validator: compliant fixture passes", () => {
  const result = runValidator("data/profile/examples/compliant-claim.json");
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Conformance:/);
});

test("validator: noncompliant fixture fails with profile violations", () => {
  const result = runValidator(
    "data/profile/examples/noncompliant-missing-provenance.json",
  );
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Violations:/);
  assert.match(result.stdout, /provenance must have at least 1 item/);
});

test("validator: forthcoming-only works do not count as public evidence", () => {
  const result = runValidator(
    "data/profile/examples/noncompliant-forthcoming-only.json",
  );
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /private and forthcoming works do not count/);
});
