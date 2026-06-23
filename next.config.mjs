/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export to out/ — keeps the site a static artifact (deployable to
  // Vercel or any static host). The Linked Art HTTP content negotiation lives in
  // vercel.json, since a pure static export cannot inspect request headers.
  output: "export",
  // Preserve the existing directory-style URLs (/artworks/, /theory/, …).
  trailingSlash: true,
  // No image optimization server in a static export.
  images: { unoptimized: true },
};

export default nextConfig;
