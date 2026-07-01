import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ZoomableArtwork from "@/components/ZoomableArtwork";
import JsonLd from "@/components/JsonLd";
import { getWork, workSlugs, type Work } from "@/lib/works";

const BASE = "https://www.metaconceptualart.com";

function workSchema(work: Work) {
  return {
    "@context": "https://schema.org",
    "@type": work.image ? "VisualArtwork" : "CreativeWork",
    "@id": BASE + "/artworks/" + work.slug + "#work",
    name: work.title,
    url: BASE + "/artworks/" + work.slug,
    dateCreated: work.year,
    description: work.summary,
    creator: { "@type": "Organization", name: "Sun & Rain Works", url: BASE },
    copyrightHolder: { "@type": "Organization", name: "Sun & Rain Works" },
    copyrightYear: work.year,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    genre: ["Conceptual art", "Metaconceptual Art"],
    ...(work.image
      ? {
          image: BASE + work.image.src,
          thumbnailUrl: BASE + work.image.src,
          artform: "Digital image",
          artMedium: "Digital image",
        }
      : {}),
    ...(work.sentences
      ? { text: work.sentences.map((s, i) => i + 1 + ". " + s).join(" ") }
      : {}),
    isPartOf: {
      "@type": "Collection",
      "@id": BASE + "/data/linked-art/collection",
      name: "Metaconceptual Art — Collection",
    },
    subjectOf: {
      "@type": "Dataset",
      name: "Linked Art (CIDOC-CRM) record",
      url: BASE + work.linkedArt,
      encodingFormat: "application/ld+json",
    },
  };
}

export function generateStaticParams() {
  return workSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.summary,
    alternates: { canonical: "/artworks/" + work.slug },
    // The co-located opengraph-image.tsx supplies the per-work share card.
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  return (
    <>
      <SiteHeader active="artworks" />
      <JsonLd data={workSchema(work)} />

      <main id="main-content" className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="work-title"
        >
          <p className="eyebrow">
            <Link className="back-link" href="/artworks">
              ← Artworks
            </Link>
          </p>
          <p className="metadata-line">{work.idLine}</p>
          <h1 id="work-title">{work.title}</h1>
          <p className="definition">{work.summary}</p>
        </section>

        <section className="work-detail" aria-label="Work">
          <div className="work-detail-media">
            {work.image ? (
              <ZoomableArtwork
                className="work-image"
                src={work.image.src}
                alt={work.image.alt}
                width={work.image.width}
                height={work.image.height}
                label={work.title}
                manifestHref={work.image.manifest}
              />
            ) : work.textMedia ? (
              <div className="work-media work-media-text" aria-hidden="true">
                <span>{work.textMedia}</span>
              </div>
            ) : null}

            <dl className="metadata-list metadata-list-wide">
              {work.metadata.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="work-links">
              <li>
                <a
                  className="wd-link"
                  href={work.linkedArt}
                  target="_blank"
                  rel="noopener"
                >
                  Linked Art (JSON-LD) ↗
                </a>
              </li>
              {work.image?.manifest ? (
                <li>
                  <a
                    className="wd-link"
                    href={work.image.manifest}
                    target="_blank"
                    rel="noopener"
                  >
                    IIIF manifest ↗
                  </a>
                </li>
              ) : null}
              {work.webUrl ? (
                <li>
                  <a
                    className="wd-link"
                    href={work.webUrl.href}
                    target="_blank"
                    rel="noopener"
                  >
                    {work.webUrl.label} ↗
                  </a>
                </li>
              ) : null}
              {work.exploreNode ? (
                <li>
                  <Link
                    className="wd-link"
                    href={"/explore?node=" + work.exploreNode}
                  >
                    Explore in the graph →
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="work-detail-body prose-block">
            {work.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {work.sentences ? (
              <ol className="work-sentences">
                {work.sentences.map((s, i) => (
                  <li key={i} data-position={i + 1}>
                    {s}
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter
        active="artworks"
        citation={
          "Sun & Rain Works. " +
          work.title +
          ". " +
          work.year +
          ". https://www.metaconceptualart.com/artworks/" +
          work.slug
        }
      />
    </>
  );
}
