import type { MetadataRoute } from "next";
import { WORKS } from "@/lib/works";

const BASE = "https://www.metaconceptualart.com";

export const dynamic = "force-static";

// Generated into out/sitemap.xml by the static export.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/artworks", priority: 0.8 },
    { path: "/theory", priority: 0.8 },
    { path: "/systems", priority: 0.8 },
    { path: "/explore", priority: 0.8 },
    { path: "/movement", priority: 0.8 },
    { path: "/statement", priority: 0.7 },
    { path: "/about", priority: 0.6 },
    { path: "/changelog", priority: 0.6 },
  ].map((p) => ({
    url: BASE + p.path,
    changeFrequency: "monthly" as const,
    priority: p.priority,
  }));

  const works = WORKS.map((w) => ({
    url: BASE + "/artworks/" + w.slug,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...works];
}
