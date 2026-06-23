import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Not found",
  description: "That page is not part of the work.",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="page-main">
        <section
          className="page-hero page-hero-compact"
          aria-labelledby="nf-title"
        >
          <p className="eyebrow">404</p>
          <h1 id="nf-title">Not in the collection</h1>
          <p className="definition">
            That page is not part of the work. Try the{" "}
            <Link className="inline-link" href="/">
              entrance
            </Link>
            , the{" "}
            <Link className="inline-link" href="/artworks">
              artworks
            </Link>
            , or{" "}
            <Link className="inline-link" href="/explore">
              explore the graph
            </Link>
            .
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
