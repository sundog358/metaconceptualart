import { ImageResponse } from "next/og";
import { getWork, workSlugs } from "@/lib/works";

// Build-time branded 1200×630 share card, one per work. Generated as a static
// PNG during `next build` (output: export), so a shared /artworks/<slug> link
// previews the actual work on Facebook, LinkedIn, Slack, iMessage and X.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Metaconceptual Art";

export function generateStaticParams() {
  return workSlugs();
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWork(slug);
  const title = work?.title ?? "Metaconceptual Art";
  const meta = work
    ? work.kind + " · " + work.year
    : "Website as conceptual artwork";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "#fffdf5",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{ width: 14, background: "#e8590c", marginRight: 56 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                letterSpacing: 6,
                color: "#1971c2",
                marginBottom: 30,
              }}
            >
              METACONCEPTUAL ART
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 72,
                lineHeight: 1.05,
                fontWeight: 700,
                color: "#08203f",
                maxWidth: 1000,
              }}
            >
              {title}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", fontSize: 30, color: "#2f6398" }}>
              {meta}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#11437e" }}>
              metaconceptualart.com
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
