import Link from "next/link";

const NAV = [
  { href: "/artworks/", label: "Artworks", key: "artworks" },
  { href: "/theory/", label: "Theory", key: "theory" },
  { href: "/systems/", label: "Systems", key: "systems" },
] as const;

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="site-header" aria-label="Site header">
      <Link className="brand" href="/" aria-label="Metaconceptual Art home">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="brand-logo"
          src="/images/8sprocket.jpg"
          alt=""
          aria-hidden="true"
        />
        <span>Metaconceptual Art</span>
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        {NAV.map((n) => (
          <Link
            key={n.key}
            href={n.href}
            aria-current={active === n.key ? "page" : undefined}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
