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
  webUrl?: { href: string; label: string }; // external or work-native web surface
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
    slug: "wtfisart",
    title: "www.wtfisart.com",
    year: "2009",
    kind: "born-digital conceptual work",
    idLine: "work:wtfisart / 2009 / born-digital conceptual work",
    summary:
      "A born-digital Metaconceptual Art work: a website built and owned by Sun & Rain Works around 2009, in connection with its Sotheby's Photographs auction engagement (sale N08533), and designated by the artist as part of the conceptual work The Auction as Artwork.",
    body: [
      "www.wtfisart.com is a website Sun & Rain Works built and owns, made around 2009 in connection with its engagement with Sotheby's Photographs (sale N08533), where the studio consigned an Ansel Adams photograph, 'San Francisco from Twin Peaks' (lot 16). Sun & Rain Works designates the website as an associated part of the conceptual work The Auction as Artwork.",
      "The record separates the website, the artist's conceptual designation, the public auction, and the evidence archive. Reported documentation — domain and hosting receipts, 2008 Sotheby's correspondence, the public catalogue lot, photographs, and metadata — is held by Sun & Rain Works; selected public evidence can be added as redaction and rights review are completed.",
      "The publication here is intentionally careful and qualified: it presents the artist's designation and cites the public sources, makes no adjudicated historical-priority claim, and notes that the Sotheby's catalogue does not name Sun & Rain Works.",
    ],
    textMedia: "www",
    metadata: [
      { label: "Event", value: "Sotheby's Photographs auction (sale N08533), 2009" },
      { label: "Concept", value: "Conceptual designation of an auction engagement" },
      { label: "Evidence", value: "Studio archive; public lot N08533 independently verifiable" },
    ],
    linkedArt: "/data/linked-art/wtfisart",
    exploreNode: "work:wtfisart",
    webUrl: { href: "https://www.wtfisart.com/", label: "Open www.wtfisart.com" },
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
  {
    slug: "art-market-reform",
    title: "Art Market Reform",
    year: "2013",
    kind: "image study",
    idLine: "work:art-market-reform / 2013 / image study",
    summary:
      "A visual anchor for the project: art, price, reform, and institutional display held together as one unstable field.",
    body: [
      "Art Market Reform is treated here as an early image study for the project's central pressure: art is never only an object, and value is never only aesthetic. The image becomes a surface where market language, display logic, and institutional authority press against one another.",
      "In the linked-data layer it functions as public evidence for the economic and institutional strand of Metaconceptual Art. The work makes the market visible as a form-giving condition rather than a background fact.",
    ],
    image: {
      src: "/images/artmarketreform.jpg",
      alt: "Art Market Reform image study.",
      width: 2048,
      height: 1454,
    },
    metadata: [
      { label: "Concept", value: "Commodification of art" },
      { label: "Relation", value: "Market frames artwork" },
      { label: "Rights", value: "CC BY 4.0" },
    ],
    linkedArt: "/data/linked-art/art-market-reform",
    exploreNode: "concept:linked-open-data",
  },
  {
    slug: "eightfold-sprocket",
    title: "Eightfold Sprocket",
    year: "2026",
    kind: "diagrammatic emblem",
    idLine: "work:eightfold-sprocket / 2026 / diagrammatic emblem",
    summary:
      "An emblem for the eight-sentence proposition set: a small mechanical sign for repetition, rotation, and system.",
    body: [
      "Eightfold Sprocket acts as a diagrammatic emblem for the project. Its circular structure echoes the eight propositions while refusing to become a fixed logo; it is closer to a thinking part, a rotating index of relations.",
      "The work gives the site a repeatable visual signal: a wheel, gear, seal, or stamp through which the proposition sequence can circulate as an institutional mark.",
    ],
    image: {
      src: "/images/8sprocket.jpg",
      alt: "Eightfold sprocket emblem.",
      width: 1024,
      height: 1024,
    },
    metadata: [
      { label: "Concept", value: "Eight-part proposition structure" },
      { label: "Relation", value: "Emblem carries sentence system" },
      { label: "Rights", value: "CC BY 4.0" },
    ],
    linkedArt: "/data/linked-art/eightfold-sprocket",
    exploreNode: "work:eight-sentences",
  },
  {
    slug: "movement-graph",
    title: "Movement Graph",
    year: "2026",
    kind: "site-native system work",
    idLine: "work:movement-graph / 2026 / site-native system work",
    summary:
      "The knowledge graph treated as an artwork: relations, authorities, claims, and viewers arranged as a walkable system.",
    body: [
      "Movement Graph is the project becoming visibly relational. It is not an illustration added after the theory; it is one of the theory's forms, a way of letting works, sources, concepts, claims, and viewers touch one another.",
      "As a site-native work, it treats graph structure as medium. Its material is the connection: what counts as evidence, what points outward to an authority, what remains local, and how a viewer activates the path through it.",
    ],
    textMedia: "graph",
    metadata: [
      { label: "Concept", value: "Knowledge graph" },
      { label: "Relation", value: "Viewer activates system" },
      { label: "Rights", value: "CC BY 4.0" },
    ],
    linkedArt: "/data/linked-art/movement-graph",
    exploreNode: "concept:metaconceptual-art",
  },
];

export function getWork(slug: string): Work | undefined {
  return WORKS.find((w) => w.slug === slug);
}

export function workSlugs(): { slug: string }[] {
  return WORKS.map((w) => ({ slug: w.slug }));
}
