import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Generated into out/robots.txt by the static export.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.metaconceptualart.com/sitemap.xml",
    host: "https://www.metaconceptualart.com",
  };
}
