// Linked Art record integrity: each record's id is extensionless and matches its
// filename, the HAL self link matches the id, and the core spine is present.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "data/linked-art";
const LA_CONTEXT = "https://linked.art/ns/v1/linked-art.json";
const SITE_ORIGIN = "https://www.metaconceptualart.com";
const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));

const files = readdirSync(DIR).filter(
  (f) => f.endsWith(".json") && !f.startsWith("activity-stream"),
);

for (const f of files) {
  const doc = JSON.parse(readFileSync(join(DIR, f), "utf8"));
  if (doc["@context"] !== LA_CONTEXT) continue;

  test(`${f}: id is an extensionless http URI matching the filename`, () => {
    assert.ok(
      typeof doc.id === "string" && doc.id.startsWith("http"),
      "id is an http URI",
    );
    assert.ok(!doc.id.endsWith(".json"), "id is extensionless");
    assert.equal(
      doc.id.split("/").pop(),
      f.replace(/\.json$/, ""),
      "id basename equals filename",
    );
  });

  test(`${f}: HAL _links.self.href matches id`, () => {
    assert.equal(doc?._links?.self?.href, doc.id);
  });

  test(`${f}: has a type and a _label`, () => {
    assert.ok(doc.type, "type present");
    assert.ok(doc._label, "_label present");
  });

  test(`${f}: advertised HTML alternate has a matching 303 redirect`, () => {
    const alternates = [doc?._links?.alternate]
      .flat()
      .filter((link) => link?.type === "text/html");
    if (alternates.length === 0) return;

    const localAlternate = alternates.find(
      (link) => new URL(link.href).origin === SITE_ORIGIN,
    );
    assert.ok(localAlternate, "at least one HTML alternate is on this site");

    const redirect = vercel.redirects.find(
      (entry) =>
        entry.source === new URL(doc.id).pathname &&
        entry.statusCode === 303 &&
        entry.has?.some(
          (condition) =>
            condition.type === "header" &&
            condition.key.toLowerCase() === "accept" &&
            condition.value.includes("text/html"),
        ),
    );
    assert.ok(redirect, "vercel.json has an Accept: text/html 303 redirect");

    const alternateUrl = new URL(localAlternate.href);
    assert.equal(
      redirect.destination,
      `${alternateUrl.pathname}${alternateUrl.hash}`,
      "redirect destination matches the first local HTML alternate",
    );
  });
}
