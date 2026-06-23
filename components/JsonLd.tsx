// Inline JSON-LD structured data. Rendered as a script tag; the content is
// trusted (authored in-repo), so dangerouslySetInnerHTML is appropriate here.
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
