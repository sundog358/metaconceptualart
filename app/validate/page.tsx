import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ClaimValidator from "./ClaimValidator";

export const metadata: Metadata = {
  title: "Claim Validator",
  description:
    "Validate Metaconceptual Art claims against the Linked Open Art Profile.",
  alternates: { canonical: "/validate" },
};

export default function ValidatePage() {
  return (
    <>
      <SiteHeader active="validate" />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Validation</p>
          <h1 id="page-title">Claim Validator</h1>
          <p className="definition">
            Paste or edit a Metaconceptual Art claim and check whether it
            carries the evidence required by the Linked Open Art Profile.
          </p>
        </section>

        <ClaimValidator />

        <section className="split-section wider-graph" aria-labelledby="cli">
          <div className="prose-block">
            <p className="section-kicker">Command line</p>
            <h2 id="cli">Use The Same Gate Locally</h2>
            <p>
              The browser checker mirrors the repository validator. The CLI
              reads the JSON Schema and the SHACL shape before reporting a
              conformance level.
            </p>
            <p>
              Works marked `private` or `forthcoming` may be prepared in staging
              data, but they do not count as public evidence until released as
              `public` or `metadata-only`.
            </p>
            <pre className="citation-block">npm run validate:claim</pre>
          </div>
          <div className="related-panel">
            <p className="section-kicker">Profile files</p>
            <h3>Validation Sources</h3>
            <ul className="anchor-list">
              <li>
                <Link className="wd-link" href="/profile/1.0/">
                  Profile 1.0
                </Link>
              </li>
              <li>
                <Link
                  className="wd-link"
                  href="/data/profile/metaconceptual-art-claim.schema.json"
                >
                  JSON Schema
                </Link>
              </li>
              <li>
                <Link
                  className="wd-link"
                  href="/data/profile/metaconceptual-art-claim.shacl.ttl"
                >
                  SHACL shape
                </Link>
              </li>
              <li>
                <Link
                  className="wd-link"
                  href="/data/profile/1.0/publication-status.jsonld"
                >
                  Publication statuses
                </Link>
              </li>
              <li>
                <Link
                  className="wd-link"
                  href="/data/profile/1.0/portfolio-staging-policy.jsonld"
                >
                  Staging policy
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter
        active="validate"
        citation="Sun & Rain Works. Metaconceptual Art Claim Validator. 2026. https://www.metaconceptualart.com/validate"
      />
    </>
  );
}
