import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getWork, workSlugs } from "@/lib/works";

// Build-time branded 1200×630 share card, one per work. Generated as a static
// PNG during `next build` (output: export). A work with an image puts the
// painting itself on the card, so a shared /artworks/<slug> link previews the
// actual work on Facebook, LinkedIn, Slack, iMessage and X; a text-only work
// gets a title card.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Metaconceptual Art";

export function generateStaticParams() {
  return workSlugs();
}

// The painting sits in a matted panel on the left, fitted inside PANEL minus MAT.
const PANEL = 620;
const MAT = 36;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

// The card renders at build time with no server to fetch from, so the image is
// read from public/ and inlined as a data URL, scaled to fit the matted panel.
async function painting(image: { src: string; width: number; height: number }) {
  const mime = MIME[image.src.split(".").pop()!.toLowerCase()];
  if (!mime) return null; // formats the card renderer cannot decode
  const bytes = await readFile(join(process.cwd(), "public", image.src));
  const scale = Math.min(
    (PANEL - 2 * MAT) / image.width,
    (size.height - 2 * MAT) / image.height,
  );
  return {
    src: `data:${mime};base64,${bytes.toString("base64")}`,
    width: Math.round(image.width * scale),
    height: Math.round(image.height * scale),
  };
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
  const art = work?.image ? await painting(work.image) : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "#fffdf5",
          fontFamily: "sans-serif",
        }}
      >
        {art ? (
          <div
            style={{
              width: PANEL,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f1ecdd",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={art.src} width={art.width} height={art.height} alt="" />
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flex: 1,
            padding: art ? "56px 56px 56px 44px" : "64px 72px",
          }}
        >
          <div
            style={{
              width: 14,
              background: "#e8590c",
              marginRight: art ? 36 : 56,
            }}
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
                  fontSize: art ? 22 : 26,
                  letterSpacing: art ? 5 : 6,
                  color: "#1971c2",
                  marginBottom: 30,
                }}
              >
                METACONCEPTUAL ART
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: art ? 54 : 72,
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
                // The narrow text column beside a painting stacks these.
                flexDirection: art ? "column" : "row",
                justifyContent: "space-between",
                alignItems: art ? "flex-start" : "flex-end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: art ? 24 : 30,
                  color: "#2f6398",
                  marginBottom: art ? 12 : 0,
                }}
              >
                {meta}
              </div>
              <div style={{ display: "flex", fontSize: art ? 22 : 26, color: "#11437e" }}>
                metaconceptualart.com
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
