import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Generated into out/manifest.webmanifest; Next auto-links it from <head>.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Metaconceptual Art",
    short_name: "Metaconceptual",
    description:
      "Art about art: a living proposition set, museum system, and conceptual archive.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf5",
    theme_color: "#11437e",
    icons: [{ src: "/images/8sprocket.jpg", sizes: "any", type: "image/jpeg" }],
  };
}
