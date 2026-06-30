import Link from "next/link";
import type { ReactNode } from "react";

const LINKS = [
  { href: "/about", label: "About", key: "about" },
  { href: "/statement", label: "Statement", key: "statement" },
  { href: "/movement", label: "Dossier", key: "movement" },
  { href: "/changelog", label: "Changelog", key: "changelog" },
] as const;

const DEFAULT_CITATION =
  "Sun & Rain Works. Metaconceptual Art. 2026. Website as conceptual artwork. https://www.metaconceptualart.com";

export default function SiteFooter({
  active,
  citation,
}: {
  active?: string;
  citation?: ReactNode;
}) {
  return (
    <footer className="site-footer">
      <div>
        <p>Website as Meta Artwork.</p>
        <p>© Sun &amp; Rain Works 2026.</p>
      </div>
      <cite className="citation">{citation ?? DEFAULT_CITATION}</cite>
      <nav className="footer-links" aria-label="Project context">
        {LINKS.map((l) => (
          <Link
            key={l.key}
            href={l.href}
            aria-current={active === l.key ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <a
        className="footer-badge"
        href="https://www.wikidata.org"
        target="_blank"
        rel="noopener"
        aria-label="Powered by Wikidata"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Wikidata_stamp.png"
          alt="Powered by Wikidata"
          width={106}
          height={88}
          style={{ height: "88px", width: "auto", maxWidth: "130px" }}
        />
      </a>
    </footer>
  );
}
