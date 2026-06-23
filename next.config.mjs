/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export to out/ — keeps the site a static artifact (deployable to
  // Vercel or any static host). The Linked Art HTTP content negotiation lives in
  // vercel.json, since a pure static export cannot inspect request headers.
  output: "export",
  // Fully extensionless URLs (/artworks, /theory, …). No trailingSlash, so the
  // extensionless Linked Art record URIs under /data/linked-art are never
  // 308-redirected to a trailing slash before vercel.json can negotiate them.
  // No image optimization server in a static export.
  images: { unoptimized: true },
};

export default nextConfig;
