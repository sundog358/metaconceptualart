// Copy the canonical static assets into public/ before a Next build.
//
// images/ and data/ remain the single source of truth at the repo root (the
// Linked Art records, the activity-stream generator, and the Python verify
// tooling all operate on data/). This step mirrors them into public/ so the
// static export serves them at /images/* and /data/*. public/images and
// public/data are generated and git-ignored.
import { cpSync, rmSync, existsSync } from "node:fs";

for (const dir of ["public/images", "public/data"]) {
  rmSync(dir, { recursive: true, force: true });
}
cpSync("images", "public/images", { recursive: true });
cpSync("data", "public/data", { recursive: true });

if (!existsSync("public/data/linked-art/collection.json")) {
  console.error("prepublic: expected Linked Art records were not copied");
  process.exit(1);
}
console.log("prepublic: mirrored images/ and data/ into public/");
