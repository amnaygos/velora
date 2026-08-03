import type { Project } from "@/types/project";

/**
 * Every VELORA project is in Qatar. Seven of them carry a same-camera
 * transformation record — the room as found, and the room as delivered,
 * photographed from an identical position.
 */
export const projects: Project[] = [
  {
    slug: "grand-training-hall",
    title: "GRAND TRAINING HALL",
    category: "Gyms & Fitness",
    location: "WEST BAY, DOHA",
    year: "2024",
    area: "420 SQM",
    delivery: "DELIVERED IN FIVE MONTHS",
    services: [
      "ARCHITECTURAL DESIGN",
      "EQUIPMENT & SUPPLY",
      "PROJECT SUPERVISION",
    ],
    description:
      "A 420 SQM training hall for a West Bay residential tower, composed as one continuous environment for elite athletes and everyday residents alike.",
    brief:
      "A residential tower handed over its amenity floor as a bare concrete shell. The brief was to create a training environment capable of supporting serious athletes and everyday residents without dividing the space into separate visual identities.",
    response:
      "Raw materials, engineered lighting, controlled circulation, and clearly defined training zones were composed as one continuous environment. Herringbone timber was laid the length of the hall to draw the eye through it. Lighting was treated as a performance tool rather than a decorative layer.",
    outcome:
      "420 SQM delivered in five months. The hall does not simply accommodate training — it changed how the building's residents talk about the tower.",
    metrics: [
      { label: "AREA", value: "420 SQM" },
      { label: "DELIVERY", value: "5 MONTHS" },
      { label: "TRAINING ZONES", value: "5" },
    ],
    heroMedia: "pair-grand-training-hall-after",
    gallery: ["extra-grand-training-hall", "detail-grand-training-hall"],
    transformation: {
      before: "pair-grand-training-hall-before",
      after: "pair-grand-training-hall-after",
      condition:
        "A bare concrete shell: unfinished ceiling, exposed services, dust sheets across the slab.",
    },
    featured: true,
  },
  {
    slug: "nightfall-lap-pool",
    title: "NIGHTFALL LAP POOL",
    category: "Residential",
    location: "THE PEARL, DOHA",
    year: "2024",
    area: "260 SQM",
    delivery: "DELIVERED IN SEVEN MONTHS",
    services: [
      "ARCHITECTURAL DESIGN",
      "PROJECT SUPERVISION",
      "OPERATIONS & MANAGEMENT",
    ],
    description:
      "A private indoor lap pool on The Pearl, designed for one ritual: swimming alone, at night, in complete stillness.",
    brief:
      "The client swims at night, alone, as the last act of the day. The pool hall existed only as a poured concrete basin. It had to serve that single ritual — without echo, glare, or any sensation of a leisure facility.",
    response:
      "The hall was treated as a dark instrument: honed stone absorbs sound and light, a continuous underwater line guides the swimmer, and the water arrives flush with the deck so the room reads as a single black plane. Plant and filtration were exiled beyond an acoustic threshold, and the courtyard was planted and lit so the glass gives back a garden rather than a reflection.",
    outcome:
      "A 25-metre rhythm in total quiet. The client reports the pool has replaced the study as the place where the day resolves.",
    metrics: [
      { label: "LENGTH", value: "25 M" },
      { label: "AREA", value: "260 SQM" },
      { label: "ACOUSTIC LEVEL", value: "< 30 DB" },
    ],
    heroMedia: "pair-nightfall-lap-pool-after",
    gallery: [
      "extra-nightfall-lap-pool",
      "video-lap-pool",
      "detail-nightfall-lap-pool",
    ],
    transformation: {
      before: "pair-nightfall-lap-pool-before",
      after: "pair-nightfall-lap-pool-after",
      condition:
        "An empty concrete basin: scaffolding at the far wall, protective sheeting, stone yet to be set.",
    },
    featured: true,
  },
  {
    slug: "the-yoga-alcove",
    title: "THE YOGA ALCOVE",
    category: "Spa & Wellness",
    location: "AL WAAB, DOHA",
    year: "2023",
    area: "34 SQM",
    delivery: "DELIVERED IN NINE WEEKS",
    services: ["ARCHITECTURAL DESIGN", "EQUIPMENT & SUPPLY"],
    description:
      "A spare bedroom in an Al Waab family villa, turned into the room the household's practice could not be imagined without.",
    brief:
      "A family villa with one unused bedroom and a modest budget. The mother of the house practised yoga in the living room, around the furniture, whenever it was free. She asked for somewhere that belonged to the practice alone.",
    response:
      "The arched niches already roughed into the plasterwork were kept and completed rather than demolished — the room's own geometry became its ornament. Warm lime plaster, a single blush tone, hidden storage for props, and lanterns instead of downlights. Nothing in the room asks for attention.",
    outcome:
      "Nine weeks, one room, no structural work. The practice moved from occasional to daily within the first month — and the family's two daughters now use it more than the mother does.",
    metrics: [
      { label: "AREA", value: "34 SQM" },
      { label: "DELIVERY", value: "9 WEEKS" },
      { label: "STRUCTURAL WORK", value: "NONE" },
    ],
    heroMedia: "pair-the-yoga-alcove-after",
    gallery: ["extra-yoga-alcove", "detail-yoga-alcove"],
    transformation: {
      before: "pair-the-yoga-alcove-before",
      after: "pair-the-yoga-alcove-after",
      condition:
        "A raw plaster room: unfinished niches, bare window openings, a bucket on the floor.",
    },
    featured: true,
  },
  {
    slug: "al-waab-villa-gym",
    title: "THE AL WAAB VILLA GYM",
    category: "Residential",
    location: "AL WAAB, DOHA",
    year: "2024",
    area: "48 SQM",
    delivery: "DELIVERED IN TEN WEEKS",
    services: ["ARCHITECTURAL DESIGN", "EQUIPMENT & SUPPLY"],
    description:
      "An ordinary family villa's ground-floor majlis, converted into a home gym that looks out onto the courtyard.",
    brief:
      "A working family in Al Waab — two parents, three children, one formal majlis used perhaps four times a year. They wanted to train at home without turning the room into a garage full of equipment.",
    response:
      "The room was kept as a room. The existing travertine was cleaned and carried up the walls; a single mirrored plane replaced one wall to double the courtyard light; a cove of warm light traces the ceiling. Equipment was chosen for silence and for how it looks when nobody is using it — because for most of the week, nobody is.",
    outcome:
      "48 SQM, ten weeks, delivered while the family remained in the house. The majlis is now used every day rather than four times a year.",
    metrics: [
      { label: "AREA", value: "48 SQM" },
      { label: "DELIVERY", value: "10 WEEKS" },
      { label: "FAMILY IN RESIDENCE", value: "THROUGHOUT" },
    ],
    heroMedia: "pair-al-waab-villa-gym-after",
    gallery: [],
    transformation: {
      before: "pair-al-waab-villa-gym-before",
      after: "pair-al-waab-villa-gym-after",
      condition:
        "An emptied majlis: dust sheets, exposed sockets, a contractor's ladder and tool case.",
    },
  },
  {
    slug: "msheireb-townhouse-gym",
    title: "THE MSHEIREB TOWNHOUSE GYM",
    category: "Residential",
    location: "MSHEIREB, DOHA",
    year: "2025",
    area: "38 SQM",
    delivery: "DELIVERED IN ELEVEN WEEKS",
    services: [
      "ARCHITECTURAL DESIGN",
      "EQUIPMENT & SUPPLY",
      "PROJECT SUPERVISION",
    ],
    description:
      "A townhouse lower ground floor — damp, dark, and used for storage — rebuilt as the room its owner trains in before sunrise.",
    brief:
      "A Msheireb townhouse with a lower ground floor nobody entered: stud walls, storage, no daylight. The owner trains at 5:00 AM and wanted a room that would meet him at that hour rather than remind him of a basement.",
    response:
      "Rather than fight the absence of daylight, the room was taken further into darkness. Black micro-cement, brass detailing, mirrors placed to lengthen rather than to watch, and light concealed entirely in the ceiling recess. The only bright surface in the room is the one the owner faces while he works.",
    outcome:
      "A basement that clients now assume is a wine room until the door opens. Eleven weeks, no structural intervention, no daylight required.",
    metrics: [
      { label: "AREA", value: "38 SQM" },
      { label: "DELIVERY", value: "11 WEEKS" },
      { label: "NATURAL LIGHT", value: "NONE" },
    ],
    heroMedia: "pair-msheireb-townhouse-gym-after",
    gallery: ["detail-msheireb-townhouse-gym"],
    transformation: {
      before: "pair-msheireb-townhouse-gym-before",
      after: "pair-msheireb-townhouse-gym-after",
      condition:
        "A stripped basement: exposed steel studwork, bare slab, a single work lamp and a ladder.",
    },
  },
  {
    slug: "al-rayyan-garden-room",
    title: "THE AL RAYYAN GARDEN ROOM",
    category: "Residential",
    location: "AL RAYYAN, QATAR",
    year: "2024",
    area: "165 SQM",
    delivery: "DELIVERED IN SIX MONTHS",
    services: [
      "ARCHITECTURAL DESIGN",
      "EQUIPMENT & SUPPLY",
      "PROJECT SUPERVISION",
    ],
    description:
      "A garden wing of an Al Rayyan family compound, rebuilt as a training room that reads as part of the house, not an annexe to it.",
    brief:
      "A multi-generational compound in Al Rayyan. The garden wing had been half-finished for years — stud walls, a dropped ceiling, a floor nobody had laid. Three generations wanted to use one room, at different hours, for very different things.",
    response:
      "Deep green panelling and mirrored bays give the room the manners of the house rather than of a gym. Equipment is arranged in a loose circuit rather than in ranks, so a grandmother walking and a son rowing do not share a sightline. The garden was brought to the glass so the room always has somewhere to look.",
    outcome:
      "165 SQM in six months. All three generations use it daily — which was the brief, and is harder than it sounds.",
    metrics: [
      { label: "AREA", value: "165 SQM" },
      { label: "DELIVERY", value: "6 MONTHS" },
      { label: "GENERATIONS SERVED", value: "3" },
    ],
    heroMedia: "pair-al-rayyan-garden-room-after",
    gallery: [],
    transformation: {
      before: "pair-al-rayyan-garden-room-before",
      after: "pair-al-rayyan-garden-room-after",
      condition:
        "An unfinished wing: stud partitions, an open ceiling void, timber and plasterboard stacked on a bare screed.",
    },
  },
  {
    slug: "pearl-pool-pavilion",
    title: "THE PEARL POOL PAVILION",
    category: "Residential",
    location: "THE PEARL, DOHA",
    year: "2023",
    area: "210 SQM",
    delivery: "DELIVERED IN EIGHT MONTHS",
    services: [
      "ARCHITECTURAL DESIGN",
      "EQUIPMENT & SUPPLY",
      "PROJECT SUPERVISION",
    ],
    description:
      "A daylit pool and training pavilion on The Pearl, where the swim and the session belong to one room.",
    brief:
      "A villa with a pool shell poured but never finished, and a training room planned as a separate box beside it. The client asked why they were two rooms.",
    response:
      "The dividing wall was never built. A skylight was cut above the threshold so the pool and the floor share the same daylight, and the stone deck runs continuously beneath both. Equipment sits on the dry side in a single quiet row; a lacquered column marks the pivot between water and work.",
    outcome:
      "One room instead of two, and 40 SQM of circulation recovered. The pool is used more in the morning than the equipment is.",
    metrics: [
      { label: "AREA", value: "210 SQM" },
      { label: "DELIVERY", value: "8 MONTHS" },
      { label: "SPACE RECOVERED", value: "40 SQM" },
    ],
    heroMedia: "pair-pearl-pool-pavilion-after",
    gallery: [],
    transformation: {
      before: "pair-pearl-pool-pavilion-before",
      after: "pair-pearl-pool-pavilion-after",
      condition:
        "Exposed structure: an unlined concrete frame, scaffolding, blockwork, and an unfinished pool basin.",
    },
  },
  {
    slug: "meridian-wellness-floor",
    title: "MERIDIAN WELLNESS FLOOR",
    category: "Hospitality",
    location: "WEST BAY, DOHA",
    year: "2025",
    area: "2,400 SQM",
    delivery: "PHASED AROUND A LIVE HOTEL",
    services: [
      "HOSPITALITY WELLNESS",
      "ARCHITECTURAL DESIGN",
      "OPERATIONS & MANAGEMENT",
    ],
    description:
      "A complete hotel wellness floor in West Bay — spa, pool, recovery, and fitness — unified under one material language.",
    brief:
      "Replace a fragmented amenity floor — separate gym, spa, and pool with three different identities — with one continuous wellness journey worthy of the hotel's positioning, without closing the hotel.",
    response:
      "A single palette of charcoal stone, dark timber, and bronze now carries the guest from corridor to pool without a visual seam. Service routes were redrawn so staff presence is felt as readiness, never as traffic. The floor was delivered in four phases, each handed back before the next began.",
    outcome:
      "Guest dwell time on the floor doubled in the first quarter after reopening, and the spa moved from cost centre to the hotel's most requested amenity.",
    heroMedia: "portfolio-meridian-wellness-floor",
    gallery: ["detail-meridian-wellness-floor", "video-hospitality"],
  },
  {
    slug: "lusail-performance-club",
    title: "LUSAIL PERFORMANCE CLUB",
    category: "Gyms & Fitness",
    location: "LUSAIL, QATAR",
    year: "2023",
    area: "1,800 SQM",
    delivery: "DELIVERED IN NINE MONTHS",
    services: [
      "COMMERCIAL & RESIDENTIAL WELLNESS",
      "EQUIPMENT & SUPPLY",
      "BUSINESS CONSULTING",
    ],
    description:
      "A commercial performance club in Lusail, built to hold serious training culture at membership scale.",
    brief:
      "Create a commercial club that serious athletes would claim as their own, without alienating the broader membership that makes the business viable.",
    response:
      "Training disciplines were arranged as districts within one hall rather than rooms behind doors, so ambition is always visible but never imposed. Acoustic zoning and lighting temperature shift by district; the material language never does.",
    outcome:
      "The club reached its two-year membership target in eight months, with retention highest among the everyday members the brief feared losing.",
    heroMedia: "portfolio-lusail-performance-club",
    gallery: ["detail-lusail-performance-club", "still-lusail"],
  },
  {
    slug: "holland-park-suite",
    title: "THE HOLLAND PARK SUITE",
    category: "Residential",
    location: "HOLLAND PARK, LONDON",
    year: "2022",
    area: "190 SQM",
    delivery: "DELIVERED IN FIVE MONTHS",
    services: [
      "ARCHITECTURAL DESIGN",
      "EQUIPMENT & SUPPLY",
      "PROJECT SUPERVISION",
    ],
    description:
      "A residential wellness suite folded into the lower floors of a Holland Park house — gym, steam, and cold plunge in 190 SQM.",
    brief:
      "Fit a complete wellness programme — strength, cardio, steam, cold plunge — into the lower two floors of a London townhouse without the result feeling compressed, and without touching the listed façade.",
    response:
      "Rather than dividing the floors into small rooms, functions were arranged along one lit limestone wall, borrowing scale from each other. Equipment was specified at residential acoustics; in a terrace, what the neighbours hear is part of the brief. The loudest object in the suite is the water.",
    outcome:
      "A complete daily circuit in under 200 SQM, delivered within conservation constraints. The suite is used by three generations of one family, each at a different hour.",
    heroMedia: "portfolio-holland-park-suite",
    gallery: ["detail-holland-park-suite", "still-residential"],
  },
  {
    slug: "marylebone-recovery-atelier",
    title: "THE MARYLEBONE RECOVERY ATELIER",
    category: "Spa & Wellness",
    location: "MARYLEBONE, LONDON",
    year: "2024",
    area: "340 SQM",
    delivery: "DELIVERED IN SEVEN MONTHS",
    services: [
      "ARCHITECTURAL DESIGN",
      "EQUIPMENT & SUPPLY",
      "OPERATIONS & MANAGEMENT",
    ],
    description:
      "A members' recovery atelier off Marylebone High Street — contrast therapy treated with the gravity of craft.",
    brief:
      "Bring the discipline of craft to a recovery club: contrast therapy, breathwork, and bodywork for a members' clientele that measures everything against the standards of the houses around it.",
    response:
      "The atelier was composed like a workshop: dark stone basins, aged bronze, a strict choreography from heat to cold to rest. Every fixture was drawn, not selected. The plunge pools are lit only from within the water.",
    outcome:
      "Membership filled from the waiting list before opening. The atelier now anchors its building's identity — the address is quoted by the club, not the reverse.",
    heroMedia: "portfolio-marylebone-recovery-atelier",
    gallery: ["detail-marylebone-recovery-atelier"],
  },
  {
    slug: "city-performance-floor",
    title: "THE CITY PERFORMANCE FLOOR",
    category: "Gyms & Fitness",
    location: "CITY OF LONDON",
    year: "2022",
    area: "1,100 SQM",
    delivery: "DELIVERED FLOOR-BY-FLOOR IN A LIVE TOWER",
    services: [
      "COMMERCIAL & RESIDENTIAL WELLNESS",
      "ARCHITECTURAL DESIGN",
      "OPERATIONS & MANAGEMENT",
    ],
    description:
      "A corporate wellness facility above the City of London, built to make training the calmest hour of the working day.",
    brief:
      "Give a City financial group's people a reason to stay in the building: a wellness floor that answers the intensity of the trading floor with equal and opposite calm.",
    response:
      "The floor was stripped to structure and rebuilt in a dark, quiet palette against the skyline — matte black equipment, gunmetal, walnut. Lighting follows the working day: cooler at 6 AM, warm through a London winter afternoon. No screens face the glass.",
    outcome:
      "Daily utilisation stabilised above 60% of headcount. The group reports the floor now appears in recruiting conversations unprompted.",
    heroMedia: "portfolio-city-performance-floor",
    gallery: ["detail-city-performance-floor"],
  },
  {
    slug: "katara-stone-spa",
    title: "THE KATARA STONE SPA",
    category: "Spa & Wellness",
    location: "KATARA, DOHA",
    year: "2023",
    area: "520 SQM",
    delivery: "DELIVERED ACROSS TWO PHASES",
    services: [
      "HOSPITALITY WELLNESS",
      "ARCHITECTURAL DESIGN",
      "PROJECT SUPERVISION",
    ],
    description:
      "A spa cut into dark stone at Katara, where controlled darkness is the treatment.",
    brief:
      "Create a spa for a cultural-district hotel that would resist the region's default vocabulary — no gold, no gloss, no lobby-scale gesture competing with the treatment itself.",
    response:
      "The spa descends into dark stone. Daylight enters through narrow cuts, arriving as blades across rock and water. Treatment rooms hold the temperature of the stone. The city is heard, faintly, and never seen.",
    outcome:
      "The spa books independently of hotel occupancy — guests travel across Doha for the darkness itself. Average treatment spend runs well above the district benchmark.",
    heroMedia: "portfolio-katara-stone-spa",
    gallery: ["detail-katara-stone-spa", "video-materials"],
  },
  {
    slug: "the-obsidian-room",
    title: "THE OBSIDIAN ROOM",
    category: "Dining & Lifestyle",
    location: "AL SADD, DOHA",
    year: "2025",
    area: "220 SQM",
    delivery: "DELIVERED IN FOUR MONTHS",
    services: ["ARCHITECTURAL DESIGN", "PROJECT SUPERVISION"],
    description:
      "A private dining room for an Al Sadd wellness club — the evening counterpart to the morning's discipline.",
    brief:
      "Give a members' wellness club a dining room that carries the same authorship as its training floors — a room where the evening meal belongs to the same life as the 6 AM session.",
    response:
      "One long honed-stone table sits under a single precise line of light. Charcoal plaster, dark walnut, aged bronze; the acoustics tuned for conversation at one table, not turnover. The kitchen is heard faintly, like weather.",
    outcome:
      "The room rebalanced the club's day — evening attendance now matches morning. Members describe dinner there as part of the practice, not a reward for it.",
    heroMedia: "portfolio-the-obsidian-room",
    gallery: ["detail-the-obsidian-room"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

/** Projects photographed before and after, from an identical camera position. */
export const transformedProjects = projects.filter((p) => p.transformation);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
