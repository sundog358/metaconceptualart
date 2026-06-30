// Route + asset smoke test over the static export. Runs after `npm run build`;
// skips with a note if out/ is absent so `npm test` alone never spuriously fails.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const OUT = "out";

// [exported file, a marker string unique enough to confirm the right page]
const ROUTES = [
  ["index.html", "Now on view"],
  ["artworks.html", "Works on view"],
  ["theory.html", "The Artwork Is The System"],
  ["systems.html", "Movement Graph"],
  ["statement.html", "On Exhibiting The System"],
  ["about.html", "About The Work"],
  ["changelog.html", "Revision history"],
  ["explore.html", "made walkable"],
  ["movement.html", "A Claim That Can Be Checked"],
  ["about.html", "2007 movement origin"],
  ["profile.html", "Linked Open Art Profile"],
  ["profile/1.0.html", "Required Evidence Fields"],
  ["validate.html", "Claim Validator"],
  ["artworks/eight-sentences.html", "proposition sequence"],
  ["artworks/construction-museum.html", "image study"],
];

const ASSETS = [
  "artworks/eight-sentences/opengraph-image",
  "artworks/construction-museum/opengraph-image",
  "data/linked-art/collection.json",
  "data/linked-art/movement-record.json",
  "data/profile/metaconceptual-art-profile.jsonld",
  "data/profile/1.0/context.jsonld",
  "data/profile/1.0/profile.jsonld",
  "data/profile/1.0/publication-status.jsonld",
  "data/profile/1.0/portfolio-staging-policy.jsonld",
  "data/profile/metaconceptual-art-claim.schema.json",
  "data/profile/metaconceptual-art-claim.shacl.ttl",
  "data/profile/metaconceptual-art-claim.json",
  "data/profile/metaconceptual-art-origin-provenance.json",
  "data/profile/examples/compliant-claim.json",
  "data/profile/examples/noncompliant-missing-provenance.json",
  "data/profile/examples/noncompliant-forthcoming-only.json",
  "data/profile/templates/metaconceptual-art-claim.template.json",
  "data/profile/templates/linked-art-forthcoming-work.template.json",
  "data/void.ttl",
  "data/dcat.jsonld",
  "data/releases/1.0/checksums.json",
  "data/iiif/construction-museum/manifest.json",
  "data/graph.json",
  ".well-known/void",
  "images/artmarketreform.jpg",
  "llms.txt",
  "sitemap.xml",
  "robots.txt",
];

if (!existsSync(OUT)) {
  test("route smoke (skipped — run `npm run build` first)", (t) => t.skip());
} else {
  for (const [file, marker] of ROUTES) {
    test(`route ${file} exists and contains "${marker}"`, () => {
      const p = `${OUT}/${file}`;
      assert.ok(existsSync(p), `${p} exists`);
      assert.ok(
        readFileSync(p, "utf8").includes(marker),
        `${p} contains "${marker}"`,
      );
    });
  }
  for (const a of ASSETS) {
    test(`asset ${a} is present`, () => {
      assert.ok(existsSync(`${OUT}/${a}`), `${OUT}/${a} exists`);
    });
  }
}
