"use client";

import { useMemo, useState } from "react";
import currentClaim from "@/data/profile/metaconceptual-art-claim.json";
import compliantClaim from "@/data/profile/examples/compliant-claim.json";

const REQUIRED_COUNTS = {
  genealogy: 3,
  principles: 1,
  works: 1,
  standards: 3,
  externalAuthorities: 3,
  provenance: 1,
} as const;

const PUBLIC_WORK_STATUSES = new Set([undefined, "public", "metadata-only"]);
const PUBLICATION_STATUSES = new Set([
  undefined,
  "public",
  "metadata-only",
  "forthcoming",
  "private",
]);

type Claim = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isUrl(value: unknown) {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function countArray(claim: Claim, field: keyof typeof REQUIRED_COUNTS) {
  const value = claim[field];
  return Array.isArray(value) ? value.length : 0;
}

function validate(claim: Claim) {
  const violations: string[] = [];
  const warnings: string[] = [];

  if (!isUrl(claim.id)) violations.push("id must be an absolute URI");
  if (claim.type !== "MetaconceptualArtClaim") {
    violations.push("type must be MetaconceptualArtClaim");
  }
  if (typeof claim.label !== "string" || claim.label.length < 1) {
    violations.push("label is required");
  }
  if (typeof claim.definition !== "string" || claim.definition.length < 40) {
    violations.push("definition must be at least 40 characters");
  }

  for (const [field, min] of Object.entries(REQUIRED_COUNTS)) {
    const value = claim[field];
    if (!Array.isArray(value)) {
      violations.push(`${field} must be an array`);
      continue;
    }
    if (value.length < min) {
      violations.push(`${field} must have at least ${min} item(s)`);
    }
    value.forEach((item, index) => {
      if (!isRecord(item)) {
        violations.push(`${field}[${index}] must be an object`);
        return;
      }
      if (typeof item.label !== "string" || item.label.length < 1) {
        violations.push(`${field}[${index}] must have a label`);
      }
      if (!isUrl(item.url)) {
        violations.push(`${field}[${index}] must have an absolute URL`);
      }
      if (
        !PUBLICATION_STATUSES.has(
          item.publicationStatus as string | undefined,
        )
      ) {
        violations.push(
          `${field}[${index}] publicationStatus must be public, metadata-only, forthcoming, or private`,
        );
      }
    });
  }

  const publicWorks = Array.isArray(claim.works)
    ? claim.works.filter(
        (item) =>
          isRecord(item) &&
          PUBLIC_WORK_STATUSES.has(
            item.publicationStatus as string | undefined,
          ),
      )
    : [];
  if (publicWorks.length === 0) {
    violations.push(
      "works must include at least one public or metadata-only work; private and forthcoming works do not count as public evidence",
    );
  }

  const standards = Array.isArray(claim.standards) ? claim.standards : [];
  const hasLinkedArt = standards.some(
    (item) =>
      isRecord(item) &&
      /linked art/i.test(`${item.authority ?? ""} ${item.label ?? ""}`),
  );
  const hasDiscovery = standards.some(
    (item) =>
      isRecord(item) &&
      /activity stream|iiif discovery|change discovery/i.test(
        `${item.authority ?? ""} ${item.label ?? ""} ${item.role ?? ""}`,
      ),
  );
  const hasLimitations =
    typeof claim.limitations === "string" && claim.limitations.length >= 40;

  if (!hasLinkedArt) warnings.push("Add at least one Linked Art record.");
  if (!hasDiscovery) warnings.push("Add Activity Streams discovery evidence.");
  if (!hasLimitations) warnings.push("State what the claim does not prove.");

  const level =
    violations.length > 0
      ? "Non-conformant"
      : hasLinkedArt &&
          hasDiscovery &&
          hasLimitations &&
          countArray(claim, "externalAuthorities") >= 3
        ? "Interoperable"
        : hasLinkedArt && countArray(claim, "standards") >= 3
          ? "Museum-grade"
          : countArray(claim, "genealogy") >= 3
            ? "Citable"
            : "Minimal";

  return { level, violations, warnings };
}

export default function ClaimValidator() {
  const [source, setSource] = useState(() =>
    JSON.stringify(currentClaim, null, 2),
  );
  const [touched, setTouched] = useState(false);

  const result = useMemo(() => {
    try {
      const parsed = JSON.parse(source);
      if (!isRecord(parsed)) {
        return {
          level: "Invalid JSON",
          violations: ["Top-level value must be an object."],
          warnings: [],
        };
      }
      return validate(parsed);
    } catch (error) {
      return {
        level: "Invalid JSON",
        violations: [error instanceof Error ? error.message : "Invalid JSON."],
        warnings: [],
      };
    }
  }, [source]);

  return (
    <section className="validator-shell" aria-labelledby="validator-title">
      <div className="validator-head">
        <div>
          <p className="section-kicker">Profile checker</p>
          <h2 id="validator-title">Validate A Claim</h2>
        </div>
        <div className="validator-actions">
          <button
            type="button"
            onClick={() => {
              setSource(JSON.stringify(currentClaim, null, 2));
              setTouched(false);
            }}
          >
            Current
          </button>
          <button
            type="button"
            onClick={() => {
              setSource(JSON.stringify(compliantClaim, null, 2));
              setTouched(true);
            }}
          >
            Example
          </button>
        </div>
      </div>
      <div className="validator-grid">
        <label className="validator-input">
          <span>Claim JSON</span>
          <textarea
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              setTouched(true);
            }}
            spellCheck={false}
          />
        </label>
        <div className="validator-result" aria-live="polite">
          <p className="validator-badge">{result.level}</p>
          <h3>{result.violations.length === 0 ? "Pass" : "Needs Evidence"}</h3>
          <p className="proof-note">
            {result.violations.length === 0
              ? touched
                ? "This claim satisfies the profile checks in the browser."
                : "The current Metaconceptual Art claim satisfies the profile checks."
              : "The profile found missing or malformed evidence."}
          </p>
          {result.violations.length > 0 && (
            <>
              <h4>Violations</h4>
              <ul>
                {result.violations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {result.warnings.length > 0 && (
            <>
              <h4>Warnings</h4>
              <ul>
                {result.warnings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
