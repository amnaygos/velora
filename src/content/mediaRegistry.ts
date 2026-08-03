import type { MediaAsset, MediaAssetStatus } from "@/types/media";
import { mediaBriefs } from "@/content/mediaBriefs";

/**
 * Final, locally saved media outputs. Every path points inside /public —
 * the finished site never contacts Higgsfield and requires no API key.
 *
 * The "video-hero-mobile" brief has no registry entry of its own: its
 * output is wired into the "video-hero" asset as mobileSrc.
 */
type Output = {
  src: string;
  mobileSrc?: string;
  webmSrc?: string;
  mobileWebmSrc?: string;
  poster?: string;
  alt: string;
  status?: MediaAssetStatus;
};

const outputs: Record<string, Output> = {
  // ——————————————————————————— Films
  "video-hero": {
    src: "/media/videos/video-hero.mp4",
    mobileSrc: "/media/videos/video-hero-mobile.mp4",
    poster: "/media/posters/video-hero.webp",
    alt: "A line of early morning light moving through a dark architectural gym in Doha, matte black equipment emerging from shadow.",
  },
  "video-materials": {
    src: "/media/videos/video-materials.mp4",
    poster: "/media/posters/video-materials.webp",
    alt: "Slow close-ups of charcoal stone, brushed steel, dark timber, and water catching a thin line of light.",
  },
  "video-hospitality": {
    src: "/media/videos/video-hospitality.mp4",
    poster: "/media/posters/video-hospitality.webp",
    alt: "One continuous camera movement through a dark hotel wellness floor, corridor flowing into spa, pool, and fitness space.",
  },
  "video-lap-pool": {
    src: "/media/videos/video-lap-pool.mp4",
    poster: "/media/posters/video-lap-pool.webp",
    alt: "A dark indoor lap pool with slow water reflections moving across honed stone walls.",
  },
  "video-design-process": {
    src: "/media/videos/video-design-process.mp4",
    poster: "/media/posters/video-design-process.webp",
    alt: "An architect's pencil drawing a precise line that becomes a real line of light inside a finished interior.",
  },
  "video-build-precision": {
    src: "/media/videos/video-build-precision.mp4",
    poster: "/media/posters/video-build-precision.webp",
    alt: "Laser alignment, exact stone placement, and quiet supervision on a refined wellness construction site.",
  },
  "video-day-1001": {
    src: "/media/videos/video-day-1001.mp4",
    poster: "/media/posters/video-day-1001.webp",
    alt: "A staff member restoring a premium wellness space to its intended state in the early morning before opening.",
  },
  "video-closing": {
    src: "/media/videos/video-closing.mp4",
    poster: "/media/posters/video-closing.webp",
    alt: "An empty wellness environment before sunrise, darkening until only one precise line of light remains.",
  },

  // ——————————————————————————— Named stills
  "still-residential": {
    src: "/media/images/still-residential.webp",
    alt: "A premium residential gym in a Doha villa, low morning light across charcoal stone and matte black equipment.",
  },
  "still-yoga": {
    src: "/media/images/still-yoga.webp",
    alt: "A quiet yoga and recovery environment with sculptural natural light and olive-sage textiles.",
  },
  "still-doha": {
    src: "/media/images/still-doha.webp",
    alt: "Abstract architectural geometry in Doha under low sun, stone and shadow.",
  },
  "still-lusail": {
    src: "/media/images/still-lusail.webp",
    alt: "Abstract architectural geometry in Lusail under a low evening sun: pale stone, dark glass, deep shadow.",
  },
  "still-environment": {
    src: "/media/images/still-environment.webp",
    alt: "A wellness hall composed as a single authored object of structure, material, and one line of light.",
  },
  "still-philosophy-movement": {
    src: "/media/images/still-philosophy-movement.webp",
    alt: "A distant athlete moving through a tall shaft of light in a dark architectural training space.",
  },
  "still-philosophy-material": {
    src: "/media/images/still-philosophy-material.webp",
    alt: "Charcoal stone, dark walnut, brushed gunmetal, and olive-sage textile in one quiet still life.",
  },
  "still-quote-bg": {
    src: "/media/images/still-quote-bg.webp",
    alt: "A nearly dark frame of faint morning light and a pool reflection on a stone ceiling.",
  },
  "still-contact-location": {
    src: "/media/images/still-contact-location.webp",
    alt: "An abstract dark aerial impression of a Doha avenue district traced by thin warm lines of light.",
  },

  // ——————————————————————————— Portfolio heroes
  "portfolio-meridian-wellness-floor": {
    src: "/media/images/portfolio-meridian-wellness-floor.webp",
    alt: "Meridian Wellness Floor: a dark hotel corridor of stone and bronze flowing toward the spa.",
  },
  "portfolio-lusail-performance-club": {
    src: "/media/images/portfolio-lusail-performance-club.webp",
    alt: "Lusail Performance Club: a double-height hall of matte black rigs under an engineered light grid.",
  },
  "portfolio-holland-park-suite": {
    src: "/media/images/portfolio-holland-park-suite.webp",
    alt: "The Holland Park Suite: matte black dumbbells on walnut racks beside a limestone wall in morning light.",
  },
  "portfolio-marylebone-recovery-atelier": {
    src: "/media/images/portfolio-marylebone-recovery-atelier.webp",
    alt: "The Marylebone Recovery Atelier: a cold plunge in honed dark stone with aged bronze fixtures.",
  },
  "portfolio-city-performance-floor": {
    src: "/media/images/portfolio-city-performance-floor.webp",
    alt: "The City Performance Floor: a dark corporate gym with the London skyline at dusk beyond the glass.",
  },
  "portfolio-katara-stone-spa": {
    src: "/media/images/portfolio-katara-stone-spa.webp",
    alt: "The Katara Stone Spa: a blade of light across dark basalt above a still stone pool.",
  },
  "portfolio-the-obsidian-room": {
    src: "/media/images/portfolio-the-obsidian-room.webp",
    alt: "The Obsidian Room: a long stone dining table under one precise line of light.",
  },

  // ——————————————————————————— Portfolio details
  "detail-grand-training-hall": {
    src: "/media/images/detail-grand-training-hall.webp",
    alt: "A matte black barbell in a machined gunmetal rack, warm light grazing the knurled steel.",
  },
  "detail-nightfall-lap-pool": {
    src: "/media/images/detail-nightfall-lap-pool.webp",
    alt: "Still black water meeting honed charcoal stone at the pool edge.",
  },
  "detail-yoga-alcove": {
    src: "/media/images/detail-yoga-alcove.webp",
    alt: "Folded olive-sage textiles on a low dark timber bench beside a rolled mat.",
  },
  "detail-meridian-wellness-floor": {
    src: "/media/images/detail-meridian-wellness-floor.webp",
    alt: "An aged bronze handle on a dark timber spa door, steam softening the background.",
  },
  "detail-lusail-performance-club": {
    src: "/media/images/detail-lusail-performance-club.webp",
    alt: "Precise rubber flooring seams meeting a limestone threshold.",
  },
  "detail-holland-park-suite": {
    src: "/media/images/detail-holland-park-suite.webp",
    alt: "Matte black dumbbells on a dark walnut wall rack in low morning light.",
  },
  "detail-marylebone-recovery-atelier": {
    src: "/media/images/detail-marylebone-recovery-atelier.webp",
    alt: "The surface of a dark stone cold plunge with an aged bronze step rail.",
  },
  "detail-city-performance-floor": {
    src: "/media/images/detail-city-performance-floor.webp",
    alt: "A brushed gunmetal cable machine against dusk window light above the city.",
  },
  "detail-katara-stone-spa": {
    src: "/media/images/detail-katara-stone-spa.webp",
    alt: "A blade of daylight across rough volcanic basalt above still water.",
  },
  "detail-msheireb-townhouse-gym": {
    src: "/media/images/detail-msheireb-townhouse-gym.webp",
    alt: "Dark oak panelling meeting a matte black steel frame with a bronze inlay.",
  },
  "detail-the-obsidian-room": {
    src: "/media/images/detail-the-obsidian-room.webp",
    alt: "The edge of a long honed stone dining table under one precise line of light.",
  },

  // ——————————————————————————— Featured extras
  "extra-grand-training-hall": {
    src: "/media/images/extra-grand-training-hall.webp",
    alt: "The full length of the training hall with a single distant silhouette mid-stride.",
  },
  "extra-nightfall-lap-pool": {
    src: "/media/images/extra-nightfall-lap-pool.webp",
    alt: "The lap pool seen along its length, one warm light line under still black water.",
  },
  "extra-yoga-alcove": {
    src: "/media/images/extra-yoga-alcove.webp",
    alt: "The yoga alcove at rest: mat, bench, and one sculptural shaft of morning light.",
  },
};

/**
 * Studio archive photography supplied by VELORA — the same-camera
 * before/after records of delivered projects. Not generated: these are
 * the client's own site and completion photographs.
 */
type ArchivePair = {
  slug: string;
  aspectRatio: string;
  beforeAlt: string;
  afterAlt: string;
};

const archivePairs: ArchivePair[] = [
  {
    slug: "grand-training-hall",
    aspectRatio: "4:3",
    beforeAlt:
      "The Grand Training Hall as found: a bare concrete shell with exposed ceiling, dust sheets, and a step ladder against the window wall.",
    afterAlt:
      "The Grand Training Hall as delivered: herringbone timber floor, a disciplined row of cardio equipment, and warm light along the full length of the hall.",
  },
  {
    slug: "nightfall-lap-pool",
    aspectRatio: "4:3",
    beforeAlt:
      "The Nightfall Lap Pool as found: an empty concrete pool basin, scaffolding, and protective sheeting across the stone.",
    afterAlt:
      "The Nightfall Lap Pool as delivered: still lit water, dark stone, loungers, and a planted courtyard beyond the glass.",
  },
  {
    slug: "the-yoga-alcove",
    aspectRatio: "4:3",
    beforeAlt:
      "The Yoga Alcove as found: raw plaster walls, unfinished arched niches, and bare window openings.",
    afterAlt:
      "The Yoga Alcove as delivered: warm blush plaster, arched niches with folded towels, lanterns, and a mat laid in soft light.",
  },
  {
    slug: "al-waab-villa-gym",
    aspectRatio: "43:24",
    beforeAlt:
      "The Al Waab villa gym as found: an empty travertine room with dust sheets, exposed sockets, and a contractor's ladder.",
    afterAlt:
      "The Al Waab villa gym as delivered: travertine walls, integrated lighting, a mirrored wall, and neatly arranged equipment.",
  },
  {
    slug: "pearl-pool-pavilion",
    aspectRatio: "11:6",
    beforeAlt:
      "The Pearl pool pavilion as found: exposed concrete structure, scaffolding, and stacked materials around an unfinished pool.",
    afterAlt:
      "The Pearl pool pavilion as delivered: a daylit training floor beside a still indoor pool under a skylight.",
  },
  {
    slug: "al-rayyan-garden-room",
    aspectRatio: "4:3",
    beforeAlt:
      "The Al Rayyan garden room as found: stripped walls, unfinished joinery, and building materials across a bare floor.",
    afterAlt:
      "The Al Rayyan garden room as delivered: deep green panelling, mirrored bays, and a full training floor facing the garden.",
  },
  {
    slug: "msheireb-townhouse-gym",
    aspectRatio: "4:3",
    beforeAlt:
      "The Msheireb townhouse gym as found: a dark stripped basement with exposed steel studwork and a ladder.",
    afterAlt:
      "The Msheireb townhouse gym as delivered: a black training room with brass detailing, mirrors, and concealed light.",
  },
];

const archiveAssets: MediaAsset[] = archivePairs.flatMap((pair) => [
  {
    id: `pair-${pair.slug}-before`,
    page: "portfolio",
    section: pair.slug,
    type: "image" as const,
    model: "archive" as const,
    prompt: "",
    aspectRatio: pair.aspectRatio,
    src: `/media/projects/${pair.slug}-before.webp`,
    alt: pair.beforeAlt,
    status: "ready" as const,
  },
  {
    id: `pair-${pair.slug}-after`,
    page: "portfolio",
    section: pair.slug,
    type: "image" as const,
    model: "archive" as const,
    prompt: "",
    aspectRatio: pair.aspectRatio,
    src: `/media/projects/${pair.slug}-after.webp`,
    alt: pair.afterAlt,
    status: "ready" as const,
  },
]);

const generatedAssets: MediaAsset[] = mediaBriefs
  .filter((brief) => brief.id !== "video-hero-mobile")
  .map((brief) => {
    const output = outputs[brief.id];
    return {
      id: brief.id,
      page: brief.page,
      section: brief.section,
      type: brief.type,
      model: brief.model,
      prompt: brief.prompt,
      aspectRatio: brief.aspectRatio,
      duration: brief.duration,
      alt: output?.alt ?? "",
      src: output?.src,
      mobileSrc: output?.mobileSrc,
      webmSrc: output?.webmSrc,
      mobileWebmSrc: output?.mobileWebmSrc,
      poster: output?.poster,
      status: output?.status ?? "ready",
    };
  });

export const mediaRegistry: Record<string, MediaAsset> = Object.fromEntries(
  [...generatedAssets, ...archiveAssets].map((asset) => [asset.id, asset]),
);
