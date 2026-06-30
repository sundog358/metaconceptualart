#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_CLAIM = "data/profile/metaconceptual-art-claim.json";
const SCHEMA_PATH = "data/profile/metaconceptual-art-claim.schema.json";
const SHACL_PATH = "data/profile/metaconceptual-art-claim.shacl.ttl";

const FIELD_LABELS = {
  label: "label",
  definition: "definition",
  genealogy: "genealogy",
  principles: "principles",
  works: "works",
  standards: "standards",
  externalAuthorities: "external authorities",
  provenance: "provenance",
};

const PUBLIC_WORK_STATUSES = new Set([undefined, "public", "metadata-only"]);
const PUBLICATION_STATUSES = new Set([
  undefined,
  "public",
  "metadata-only",
  "forthcoming",
  "private",
]);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

async function loadClaim(input) {
  if (/^https?:\/\//.test(input)) {
    const response = await fetch(input);
    if (!response.ok) {
      throw new Error(`Could not fetch ${input}: HTTP ${response.status}`);
    }
    return response.json();
  }
  return readJson(input);
}

function parseShaclMinimums(ttl) {
  const constraints = new Map();
  const propertyBlocks = ttl.match(/sh:property\s+\[[\s\S]*?\]\s*[.;]/g) ?? [];
  for (const block of propertyBlocks) {
    const path = block.match(/sh:path\s+(?:mca|schema|skos):([A-Za-z]+)\s*;/);
    if (!path) continue;
    const rawField = path[1];
    const field =
      rawField === "name"
        ? "label"
        : rawField === "definition"
          ? "definition"
          : rawField;
    const minCount = block.match(/sh:minCount\s+(\d+)\s*;/);
    const minLength = block.match(/sh:minLength\s+(\d+)\s*;/);
    constraints.set(field, {
      minCount: minCount ? Number(minCount[1]) : 0,
      minLength: minLength ? Number(minLength[1]) : 0,
    });
  }
  return constraints;
}

function isUri(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function validateEvidenceLink(item, field, index, violations) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    violations.push(`${field}[${index}] must be an object`);
    return;
  }
  if (!item.label || typeof item.label !== "string") {
    violations.push(`${field}[${index}] must have a label`);
  }
  if (!item.url || typeof item.url !== "string" || !isUri(item.url)) {
    violations.push(`${field}[${index}] must have an absolute URL`);
  }
  if (!PUBLICATION_STATUSES.has(item.publicationStatus)) {
    violations.push(
      `${field}[${index}] publicationStatus must be public, metadata-only, forthcoming, or private`,
    );
  }
}

export function validateClaim(claim, schema, shaclTtl) {
  const violations = [];
  const warnings = [];
  const allowed = new Set(Object.keys(schema.properties));
  const required = schema.required ?? [];
  const shaclMinimums = parseShaclMinimums(shaclTtl);

  for (const field of required) {
    if (claim[field] === undefined) {
      violations.push(`${field} is required by the JSON Schema`);
    }
  }

  for (const field of Object.keys(claim)) {
    if (!allowed.has(field)) {
      violations.push(`${field} is not declared by the JSON Schema`);
    }
  }

  if (claim.id && !isUri(claim.id)) {
    violations.push("id must be an absolute URI");
  }
  if (claim.type !== "MetaconceptualArtClaim") {
    violations.push("type must be MetaconceptualArtClaim");
  }

  for (const [field, constraint] of shaclMinimums) {
    const value = claim[field];
    const label = FIELD_LABELS[field] ?? field;
    if (Array.isArray(value)) {
      if (value.length < constraint.minCount) {
        violations.push(
          `${label} must have at least ${constraint.minCount} item(s)`,
        );
      }
    } else if (constraint.minCount > 0 && !value) {
      violations.push(`${label} is required by the SHACL shape`);
    }
    if (
      constraint.minLength > 0 &&
      typeof value === "string" &&
      value.length < constraint.minLength
    ) {
      violations.push(
        `${label} must be at least ${constraint.minLength} characters`,
      );
    }
  }

  for (const [field, config] of Object.entries(schema.properties)) {
    if (config.type !== "array") continue;
    const value = claim[field];
    if (!Array.isArray(value)) {
      violations.push(`${field} must be an array`);
      continue;
    }
    for (const [index, item] of value.entries()) {
      validateEvidenceLink(item, field, index, violations);
    }
  }

  const publicWorks = Array.isArray(claim.works)
    ? claim.works.filter((item) => PUBLIC_WORK_STATUSES.has(item?.publicationStatus))
    : [];
  if (publicWorks.length === 0) {
    violations.push(
      "works must include at least one public or metadata-only work; private and forthcoming works do not count as public evidence",
    );
  }

  const standards = claim.standards ?? [];
  const hasLinkedArt = standards.some((item) =>
    /linked art/i.test(`${item.authority ?? ""} ${item.label ?? ""}`),
  );
  const hasDiscovery = standards.some((item) =>
    /activity stream|iiif discovery|change discovery/i.test(
      `${item.authority ?? ""} ${item.label ?? ""} ${item.role ?? ""}`,
    ),
  );
  const hasLocalBoundary =
    typeof claim.limitations === "string" && claim.limitations.length >= 40;

  if (!hasLinkedArt) {
    warnings.push("museum-grade claims should cite at least one Linked Art record");
  }
  if (!hasDiscovery) {
    warnings.push("interoperable claims should cite Activity Streams discovery");
  }
  if (!hasLocalBoundary) {
    warnings.push("claims should state the boundary of what they do not prove");
  }

  const level = conformanceLevel(claim, violations, {
    hasLinkedArt,
    hasDiscovery,
    hasLocalBoundary,
  });

  return { ok: violations.length === 0, level, violations, warnings };
}

function hasArray(claim, field, min) {
  return Array.isArray(claim[field]) && claim[field].length >= min;
}

function conformanceLevel(claim, violations, signals) {
  if (violations.length > 0) return "Non-conformant";
  const minimal =
    claim.id &&
    claim.type === "MetaconceptualArtClaim" &&
    claim.label &&
    claim.definition &&
    hasArray(claim, "works", 1) &&
    hasArray(claim, "provenance", 1);
  if (!minimal) return "Non-conformant";

  const citable =
    hasArray(claim, "genealogy", 3) &&
    hasArray(claim, "principles", 1) &&
    hasArray(claim, "standards", 1);
  if (!citable) return "Minimal";

  const museumGrade = signals.hasLinkedArt && hasArray(claim, "standards", 3);
  if (!museumGrade) return "Citable";

  const interoperable =
    hasArray(claim, "externalAuthorities", 3) &&
    signals.hasDiscovery &&
    signals.hasLocalBoundary;
  return interoperable ? "Interoperable" : "Museum-grade";
}

async function main() {
  const input = process.argv[2] ?? DEFAULT_CLAIM;
  const schema = readJson(SCHEMA_PATH);
  const shaclTtl = readFileSync(SHACL_PATH, "utf8");
  const claim = await loadClaim(input);
  const result = validateClaim(claim, schema, shaclTtl);
  const name = /^https?:\/\//.test(input) ? input : basename(input);

  console.log(`Metaconceptual Art claim validation: ${name}`);
  console.log(`Conformance: ${result.level}`);

  if (result.violations.length) {
    console.log("\nViolations:");
    for (const item of result.violations) console.log(`- ${item}`);
  }

  if (result.warnings.length) {
    console.log("\nWarnings:");
    for (const item of result.warnings) console.log(`- ${item}`);
  }

  if (!result.ok) process.exit(1);
}

const runningAsScript = process.argv[1] === fileURLToPath(import.meta.url);
if (runningAsScript) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
