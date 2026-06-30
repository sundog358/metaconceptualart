import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";

const BASE = "https://www.metaconceptualart.com";

const levels = [
  {
    id: "minimal",
    title: "Minimal",
    body: "A named claim with a stable URI, a definition, at least one work on view, and provenance.",
  },
  {
    id: "citable",
    title: "Citable",
    body: "Minimal evidence plus genealogy, principles, and records that a reader or cataloguer can cite.",
  },
  {
    id: "museum-grade",
    title: "Museum-grade",
    body: "Citable evidence plus Linked Art records, rights, authorship, and publication or event provenance.",
  },
  {
    id: "interoperable",
    title: "Interoperable",
    body: "Museum-grade evidence plus authority alignment, discovery streams, dataset metadata, and validation fixtures.",
  },
];

const requirements = [
  ["genealogy", "At least three lineage links to art-historical or technical context."],
  ["principles", "At least one citable definition, theory source, proposition, or Record."],
  ["works", "At least one catalogued work on view at a stable URL."],
  ["standards", "At least three machine-readable records or standards."],
  ["externalAuthorities", "At least three public authority alignments where available."],
  ["provenance", "At least one visible revision, publication, or change-history source."],
];

const records = [
  ["JSON-LD context", "/data/profile/1.0/context.jsonld"],
  ["Profile metadata", "/data/profile/1.0/profile.jsonld"],
  ["Publication statuses", "/data/profile/1.0/publication-status.jsonld"],
  ["Portfolio staging policy", "/data/profile/1.0/portfolio-staging-policy.jsonld"],
  ["JSON Schema", "/data/profile/metaconceptual-art-claim.schema.json"],
  ["SHACL shape", "/data/profile/metaconceptual-art-claim.shacl.ttl"],
  ["Current claim", "/data/profile/metaconceptual-art-claim.json"],
  ["Compliant fixture", "/data/profile/examples/compliant-claim.json"],
  ["Forthcoming-only fixture", "/data/profile/examples/noncompliant-forthcoming-only.json"],
  ["Failing fixture", "/data/profile/examples/noncompliant-missing-provenance.json"],
  ["Starter template", "/data/profile/templates/metaconceptual-art-claim.template.json"],
  ["Forthcoming work template", "/data/profile/templates/linked-art-forthcoming-work.template.json"],
  ["VoID dataset", "/data/void.ttl"],
  ["DCAT catalog", "/data/dcat.jsonld"],
];

const stagingModes = [
  {
    id: "private",
    title: "Private For Now",
    body: "Keep unpublished portfolio works outside the public Linked Art, sitemap, Activity Stream, VoID, and DCAT surfaces until disclosure is intentional.",
  },
  {
    id: "metadata-only",
    title: "Metadata-Only Public",
    body: "Publish title, year, type, concept, creator, rights, and provenance when catalog facts can be public before media or full interpretation.",
  },
  {
    id: "forthcoming",
    title: "Staged Public Record",
    body: "Prepare stable URIs and Linked Art templates privately, then publish a Create or Update activity when the work becomes public evidence.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": `${BASE}/profile/1.0/#spec`,
  url: `${BASE}/profile/1.0/`,
  name: "Metaconceptual Art Linked Open Art Profile 1.0",
  description:
    "A reusable application profile for publishing born-digital Metaconceptual Art claims as linked open art data.",
  creator: { "@id": `${BASE}/#organization` },
  version: "1.0",
  about: `${BASE}/data/linked-art/concept-metaconceptual-art`,
  isBasedOn: [
    "https://linked.art/model/1.0/",
    "https://linked.art/api/1.0/",
    "https://iiif.io/api/presentation/3.0/",
    "https://iiif.io/api/discovery/1.0/",
  ],
};

export default function ProfileSpec({ version = "1.0" }: { version?: string }) {
  return (
    <>
      <SiteHeader active="profile" />
      <JsonLd data={jsonLd} />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="page-title"
        >
          <p className="eyebrow">Application profile {version}</p>
          <h1 id="page-title">Linked Open Art Profile</h1>
          <p className="definition">
            A reusable standard for publishing born-digital Metaconceptual Art
            claims as Linked Art, IIIF, JSON-LD, SHACL, and citable evidence.
          </p>
        </section>

        <section className="proof-section" aria-labelledby="profile-purpose">
          <div className="proof-lede">
            <p className="section-kicker">Purpose</p>
            <h2 id="profile-purpose">From Claim To Infrastructure</h2>
            <p>
              The profile turns the Movement Record into a repeatable data
              contract. A claim is valid when it can be followed through stable
              URLs, standards-based records, external authorities, and visible
              provenance.
            </p>
            <p>
              Linked Art remains the museum data standard. This profile defines
              the local evidence pattern for Metaconceptual Art on top of it.
            </p>
          </div>
          <div className="proof-grid">
            {levels.map((level, index) => (
              <article className="proof-card" id={level.id} key={level.id}>
                <span className="proof-index">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <h3>{level.title}</h3>
                <p>{level.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="collection-section" aria-labelledby="requirements">
          <div className="section-heading">
            <p className="section-kicker">Conformance</p>
            <h2 id="requirements">Required Evidence Fields</h2>
            <p className="section-intro">
              These fields are checked by the JSON Schema, the SHACL shape, the
              local CLI validator, and the browser validator.
            </p>
          </div>
          <div className="table-wrap">
            <table className="node-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map(([field, requirement]) => (
                  <tr key={field}>
                    <td>{field}</td>
                    <td>{requirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="system-section movement-system"
          aria-labelledby="assets-title"
        >
          <div>
            <p className="section-kicker">Reusable assets</p>
            <h2 id="assets-title">Copy The Standard</h2>
          </div>
          <div className="system-copy">
            <p>
              Implementers can start from the template, validate against the
              shape, and publish dataset-level metadata so their records can be
              cited, crawled, and compared.
            </p>
            <div className="proof-records" aria-label="Profile records">
              {records.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
              <Link href="/validate">Validate a claim</Link>
            </div>
          </div>
        </section>

        <section
          className="collection-section"
          aria-labelledby="staging-title"
        >
          <div className="section-heading">
            <p className="section-kicker">Portfolio staging</p>
            <h2 id="staging-title">Connect First, Publish Works Deliberately</h2>
            <p className="section-intro">
              The profile lets the site join the Linked Art and linked open data
              web now, while unpublished portfolio works stay private until
              their public records are intentionally released.
            </p>
          </div>
          <div className="proof-grid profile-staging-grid">
            {stagingModes.map((mode, index) => (
              <article className="proof-card" id={mode.id} key={mode.id}>
                <span className="proof-index">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <h3>{mode.title}</h3>
                <p>{mode.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split-section wider-graph" aria-labelledby="cli">
          <div className="prose-block">
            <p className="section-kicker">CLI</p>
            <h2 id="cli">Local Validation</h2>
            <p>
              The same profile can be checked from the command line before a
              record is published.
            </p>
            <pre className="citation-block">npm run validate:claim</pre>
            <pre className="citation-block">
              npm run validate:claim -- data/profile/examples/compliant-claim.json
            </pre>
          </div>
          <div className="related-panel">
            <p className="section-kicker">Dataset discovery</p>
            <h3>Machine Readers</h3>
            <p className="related-intro">
              The dataset advertises itself through VoID, DCAT, sitemap, bot
              index, Activity Streams, and Linked Art content negotiation.
            </p>
            <ul className="anchor-list">
              <li>
                <a className="wd-link" href="/.well-known/void">
                  /.well-known/void
                </a>
              </li>
              <li>
                <a className="wd-link" href="/data/dcat.jsonld">
                  /data/dcat.jsonld
                </a>
              </li>
              <li>
                <a className="wd-link" href="/data/linked-art/activity-stream">
                  Activity Stream
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter
        active="profile"
        citation="Sun & Rain Works. Metaconceptual Art Linked Open Art Profile 1.0. 2026. https://www.metaconceptualart.com/profile/1.0/"
      />
    </>
  );
}
