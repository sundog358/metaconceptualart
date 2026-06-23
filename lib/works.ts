// Source of truth for the works on view. Drives the /artworks index, the
// per-work /artworks/<slug> detail pages, and their build-time OG cards.

export type Work = {
  slug: string;
  title: string;
  year: string;
  kind: string; // medium / form, e.g. "image study"
  idLine: string; // "work:<slug> / <year> / <kind>"
  summary: string;
  body: string[]; // detail-page paragraphs
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    manifest?: string; // IIIF Presentation manifest
  };
  textMedia?: string; // label for the text-only media tile (e.g. "01–08")
  sentences?: string[]; // for the textual proposition work
  metadata: { label: string; value: string }[];
  linkedArt: string; // path to the Linked Art record
  exploreNode?: string; // graph node id to deep-link into the Explorer
};

export const WORKS: Work[] = [
  {
    slug: "eight-sentences",
    title: "Eight Sentences On Metaconceptual Art",
    year: "2026",
    kind: "proposition sequence",
    idLine: "work:eight-sentences / 2026 / proposition sequence",
    summary:
      "A sentence sequence after Sol LeWitt that frames Metaconceptual Art as a field of form, institution, market, history, medium, access, and life.",
    body: [
      "The Eight Sentences are written after Sol LeWitt's Sentences on Conceptual Art — not to imitate his propositions, but to treat the sentence itself as an artistic unit. A sentence can be a drawing of thought: an instruction, a frame, a rule, or a wall label for a work that has not yet become visible.",
      "Read together they set the field of the project: form, market, institution, history, time, medium, access, and life. Each is glossed in plain language on the landing page so the work stays legible to visitors without art-world credentials.",
    ],
    textMedia: "01–08",
    sentences: [
      "A returning of the Formless to Form (Art).",
      "An examination of the commodification of Art and its relationship to the current global economic crisis.",
      "An examination of the power structures and network of the elite 'Art World' and 'Art Institutions'.",
      "An Archaeology of the Art World, and Art History.",
      "The interplay of Time and Space.",
      "Transcendence of medium to arrive within the collective consciousness.",
      "The annihilating of the boundaries between Art World insiders and Outsiders.",
      "The annihilating of the boundaries between Art and Life.",
    ],
    metadata: [
      { label: "Source", value: "Sol LeWitt lineage" },
      { label: "Relation", value: "Claim belongs to proposition set" },
      { label: "Rights", value: "CC BY 4.0" },
    ],
    linkedArt: "/data/linked-art/eight-sentences",
  },
  {
    slug: "construction-museum",
    title: "Construction of the Museum as Concept",
    year: "2026",
    kind: "image study",
    idLine: "work:construction-museum / 2026 / image study",
    summary:
      "The museum appears inside the artwork as something still being built. Institutional authority is shown as architecture, ornament, labor, scaffolding, and frame.",
    body: [
      "An image study in which the museum is not the neutral container of art but a subject of it — depicted mid-construction, its authority still being assembled out of architecture, ornament, labor, and the gold frame.",
      "Treating the institution as material rather than backdrop is the move at the heart of institutional critique; here it is made literal, the frame and the façade shown as things that are made, and therefore things that could be made otherwise.",
    ],
    image: {
      src: "/images/constructionartaiA01.png",
      alt: "An ornate gold frame surrounding a classical museum facade under construction.",
      width: 1024,
      height: 1024,
      manifest: "/data/iiif/construction-museum/manifest.json",
    },
    metadata: [
      { label: "Concept", value: "Institutional frame" },
      { label: "Relation", value: "Institution frames artwork" },
      { label: "Rights", value: "CC BY 4.0" },
    ],
    linkedArt: "/data/linked-art/construction-museum",
    exploreNode: "concept:institutional-frame",
  },
];

export function getWork(slug: string): Work | undefined {
  return WORKS.find((w) => w.slug === slug);
}

export function workSlugs(): { slug: string }[] {
  return WORKS.map((w) => ({ slug: w.slug }));
}
