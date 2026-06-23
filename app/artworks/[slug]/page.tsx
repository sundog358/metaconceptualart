import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ZoomableArtwork from "@/components/ZoomableArtwork";
import { getWork, workSlugs } from "@/lib/works";

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

      <main className="page-main">
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
          ". 2026. https://www.metaconceptualart.com/artworks/" +
          work.slug
        }
      />
    </>
  );
}
