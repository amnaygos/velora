import type { MediaBrief } from "@/types/media";

/**
 * Development-time generation briefs for the Higgsfield MCP.
 * Images were generated with GPT Image 2 ("gpt-2"), films with
 * Seedance 2.0 ("seedance-2"). Visitors never trigger generation;
 * the finished site reads only the saved files in /public/media.
 *
 * The seven before/after project records are NOT generated — they are
 * VELORA's own site and completion photography, registered directly in
 * mediaRegistry.ts as "archive" assets.
 */
export const STYLE_SUFFIX =
  "Premium architectural editorial photography, medium-format clarity, dark controlled interior, slightly crushed blacks, restrained highlights, subtle film grain, natural material textures, realistic imperfections, quiet luxury, deep spatial perspective, no people, no text, no logo, no watermark, no CGI look, no neon, no oversaturation.";

export const mediaBriefs: MediaBrief[] = [
  // ————————————————————————————————— Films (Seedance 2.0)
  {
    id: "video-hero",
    page: "home",
    section: "hero",
    type: "video",
    model: "seedance-2",
    aspectRatio: "16:9",
    duration: 10,
    prompt:
      "A cinematic journey through an exceptionally refined private wellness environment in Doha. Begin almost completely black. A narrow line of early morning light moves across honed charcoal stone. The camera slowly advances into a large architectural gym with matte black training equipment, brushed gunmetal details, dark natural timber, muted limestone, and restrained olive accents. No visible branding. No commercial posing. A distant athlete crosses the frame as a silhouette. Fine atmospheric dust catches the light. Medium-format realism, premium architectural editorial photography, slightly crushed blacks, subtle film grain, slow dolly movement, controlled contrast, realistic material imperfections, no CGI appearance, no neon, no text, no logo. The final frame darkens back toward near-black so the clip loops seamlessly.",
  },
  {
    id: "video-hero-mobile",
    page: "home",
    section: "hero",
    type: "video",
    model: "seedance-2",
    aspectRatio: "9:16",
    duration: 10,
    prompt:
      "A cinematic vertical journey through an exceptionally refined private wellness environment in Doha, composed for a tall portrait frame. Begin almost completely black. A narrow vertical line of early morning light moves across honed charcoal stone. The camera slowly advances into a tall architectural gym with matte black training equipment, brushed gunmetal details, dark natural timber, muted limestone, and restrained olive accents. No visible branding. A distant athlete crosses the frame as a silhouette. Fine atmospheric dust catches the light. Medium-format realism, premium architectural editorial photography, slightly crushed blacks, subtle film grain, slow dolly movement, controlled contrast, realistic material imperfections, no CGI appearance, no neon, no text, no logo. The final frame darkens back toward near-black so the clip loops seamlessly.",
    notes: "Mobile source for the video-hero asset.",
  },
  {
    id: "video-materials",
    page: "home",
    section: "manifesto",
    type: "video",
    model: "seedance-2",
    aspectRatio: "16:9",
    duration: 8,
    prompt:
      "Extreme cinematic close-ups of premium wellness architecture materials: a hand moving over honed charcoal stone, brushed steel catching a thin line of light, dark timber grain, dense rubber flooring, light moving across acoustic wall panels, condensation forming on dark glass, and water reflecting against textured stone. Extremely slow camera movement, shallow depth of field, medium-format realism, restrained contrast, subtle film grain, no logo, no text. Dark, moody, quiet luxury. The clip begins and ends on similarly dark frames so it loops seamlessly.",
  },
  {
    id: "video-hospitality",
    page: "services",
    section: "hospitality",
    type: "video",
    model: "seedance-2",
    aspectRatio: "16:9",
    duration: 8,
    prompt:
      "A continuous cinematic camera movement through a luxury hotel wellness floor, beginning in a dark architectural corridor and flowing into a recovery area, spa, indoor pool, and premium fitness space. Every area feels connected through one material and lighting language. Quiet atmosphere, subtle human presence only in distant silhouette, charcoal stone, brushed metal, dark timber, soft warm light, premium hospitality architecture, slow controlled camera, realistic materials, no text, no logos. Slightly crushed blacks, subtle film grain, medium-format realism, no CGI appearance, no neon.",
  },
  {
    id: "video-lap-pool",
    page: "home",
    section: "selected-work",
    type: "video",
    model: "seedance-2",
    aspectRatio: "16:9",
    duration: 10,
    prompt:
      "A dark, refined indoor lap pool inside a premium Qatari residence. Slow water reflections move across honed stone walls. One swimmer passes silently through the frame once. The camera remains architectural and restrained, with slow lateral movement, subtle film grain, deep shadows, muted lighting, realistic water physics, no neon, no text, no logo. Premium architectural editorial realism, slightly crushed blacks, no CGI appearance. The clip begins and ends on similarly dark frames so it loops seamlessly.",
  },
  {
    id: "video-design-process",
    page: "home",
    section: "process-film",
    type: "video",
    model: "seedance-2",
    aspectRatio: "16:9",
    duration: 8,
    prompt:
      "A cinematic sequence showing an architect's process for a premium wellness environment: pencil touching tracing paper, a precise line being drawn, material samples placed beside technical plans, a lighting plan, a hand aligning a construction detail, and a match cut from the drawn line into a real architectural line of light inside the completed interior. Slow controlled movement, natural hands, refined studio atmosphere, dark moody lighting, medium-format realism, subtle film grain, no text, no logo.",
  },
  {
    id: "video-build-precision",
    page: "home",
    section: "process-film",
    type: "video",
    model: "seedance-2",
    aspectRatio: "16:9",
    duration: 8,
    prompt:
      "A refined wellness construction project nearing completion. Show laser alignment, exact material installation, precise flooring seams, stone placement, architectural lighting tests, equipment positioning, and quiet project supervision. No chaos, no heavy demolition, no messy construction site. Focus on precision, craftsmanship, and controlled finishing. Cinematic realism, dark controlled lighting, slightly crushed blacks, subtle film grain, medium-format realism, no text, no logo.",
  },
  {
    id: "video-day-1001",
    page: "home",
    section: "process-film",
    type: "video",
    model: "seedance-2",
    aspectRatio: "16:9",
    duration: 8,
    prompt:
      "A premium wellness environment in the early morning before opening. A staff member quietly checks equipment alignment, adjusts architectural lighting, prepares folded towels, inspects materials, and restores every detail to its intended position. The atmosphere communicates long-term operational excellence. Slow restrained camera, deep shadows, realistic materials, no commercial posing, no text, no logo. Charcoal stone, dark timber, matte black equipment, premium architectural editorial realism, subtle film grain.",
  },
  {
    id: "video-closing",
    page: "home",
    section: "closing-cta",
    type: "video",
    model: "seedance-2",
    aspectRatio: "16:9",
    duration: 8,
    prompt:
      "An empty premium wellness environment before sunrise. The architecture is barely visible. Light gradually lowers rather than brightens. By the final frame, the space is almost completely dark except for one precise horizontal architectural line of light near the bottom of the frame. Slow camera movement, deep carbon shadows, subtle film grain, no people, no text, no logo. Charcoal stone, matte black equipment barely emerging from darkness, premium architectural editorial realism, no CGI appearance, no neon.",
    notes: "The final line of light aligns with the footer divider.",
  },

  // ————————————————————————————————— Named stills (GPT Image 2)
  {
    id: "still-residential",
    page: "home",
    section: "environment",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:4",
    prompt:
      "A premium residential gym inside a high-end Doha villa, designed as a complete architectural environment rather than an equipment room. Low morning light, charcoal stone, dark natural timber, integrated architectural lighting, matte black equipment, quiet atmosphere, restrained olive-sage accent, no people, realistic imperfections, medium-format architectural editorial photography, slightly crushed blacks, no CGI appearance, no text, no logo.",
  },
  {
    id: "still-yoga",
    page: "about",
    section: "philosophy",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:2",
    prompt:
      "A quiet architectural yoga and recovery environment with sculptural natural light, muted stone, warm plaster, dark timber, restrained olive-sage textiles, generous negative space, low furniture, premium material details, no posed person, medium-format interior photography, realistic imperfections, soft but controlled contrast, no text, no logo.",
  },
  {
    id: "still-doha",
    page: "about",
    section: "studios",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:4",
    prompt:
      "Abstract architectural geometry in Doha, low sun, stone, shadow, modern skyline fragments, refined and restrained, no tourist-postcard composition, no visible branding. " +
      STYLE_SUFFIX,
  },
  {
    id: "still-lusail",
    page: "about",
    section: "studios",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:4",
    prompt:
      "Abstract architectural geometry in Lusail, Qatar: low evening sun raking across pale stone and dark glass towers, deep shadow, restrained modern skyline fragments, no tourist-postcard composition, no visible branding. " +
      STYLE_SUFFIX,
  },
  {
    id: "still-environment",
    page: "home",
    section: "environment",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "A large architectural wellness hall photographed like a museum installation: one continuous composition where structure, material, light and matte black training equipment read as a single authored object; one long horizontal line of warm light, honed charcoal stone, dark timber, muted limestone. " +
      STYLE_SUFFIX,
  },
  {
    id: "still-philosophy-movement",
    page: "home",
    section: "philosophy",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:2",
    prompt:
      "A dark architectural training space with a single athlete as a distant silhouette moving through a tall shaft of light, motion slightly blurred, the architecture dominant: charcoal stone, matte black equipment, deep negative space. Premium architectural editorial photography, medium-format clarity, slightly crushed blacks, restrained highlights, subtle film grain, realistic imperfections, quiet luxury, deep spatial perspective, no direct-to-camera pose, no commercial smile, no text, no logo, no watermark, no CGI look, no neon, no oversaturation.",
  },
  {
    id: "still-philosophy-material",
    page: "home",
    section: "philosophy",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:4",
    prompt:
      "An intimate close composition of layered premium materials: honed charcoal stone, dark walnut, brushed gunmetal and a folded olive-sage textile arranged as one quiet architectural still life, single soft directional light source, deep shadow. " +
      STYLE_SUFFIX,
  },
  {
    id: "still-quote-bg",
    page: "home",
    section: "testimonial",
    type: "image",
    model: "gpt-2",
    aspectRatio: "16:9",
    prompt:
      "Almost abstract, very dark frame: faint early morning light entering a wellness space, a barely perceptible pool reflection on a stone ceiling, deep carbon shadows dominating the composition. " +
      STYLE_SUFFIX,
  },
  {
    id: "still-contact-location",
    page: "contact",
    section: "map",
    type: "image",
    model: "gpt-2",
    aspectRatio: "16:9",
    prompt:
      "A restrained abstract aerial impression of a Doha commercial avenue district at dusk rendered as dark architectural forms, deep shadows, thin warm light lines tracing streets, map-like minimalism. Premium editorial, no text, no labels, no logo, no watermark.",
  },

  // ————————————————————————————————— Project heroes (GPT Image 2)
  // Projects with a before/after record use archive photography for their
  // hero instead — see mediaRegistry.ts.
  {
    id: "portfolio-meridian-wellness-floor",
    page: "portfolio",
    section: "meridian-wellness-floor",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:2",
    prompt:
      "A luxury hotel wellness floor corridor in West Bay Doha flowing toward a spa: honed charcoal stone, aged bronze details, dark timber slats, soft pools of warm light, a glimpse of a dark still pool beyond the threshold. " +
      STYLE_SUFFIX,
  },
  {
    id: "portfolio-lusail-performance-club",
    page: "portfolio",
    section: "lusail-performance-club",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:2",
    prompt:
      "A premium commercial performance gym in Lusail: double-height architectural space, matte black rigs and lifting platforms in disciplined rows, engineered lighting grid casting warm restrained light, charcoal acoustic wall panels, brushed steel details, dense dark rubber floor. " +
      STYLE_SUFFIX,
  },
  {
    id: "portfolio-holland-park-suite",
    page: "portfolio",
    section: "holland-park-suite",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:4",
    prompt:
      "A residential wellness suite inside a Holland Park townhouse in London: private gym corner with matte black dumbbells on dark walnut wall racks, a limestone wall washed with low morning light, olive-sage upholstered bench, quiet atmosphere. " +
      STYLE_SUFFIX,
  },
  {
    id: "portfolio-marylebone-recovery-atelier",
    page: "portfolio",
    section: "marylebone-recovery-atelier",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:4",
    prompt:
      "A refined recovery atelier in Marylebone, London: cold plunge pool in honed dark stone, aged bronze fixtures, textured plaster walls, a single beam of controlled light, folded linen towels on a dark oak shelf. " +
      STYLE_SUFFIX,
  },
  {
    id: "portfolio-city-performance-floor",
    page: "portfolio",
    section: "city-performance-floor",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:2",
    prompt:
      "A corporate wellness facility high above the City of London: dark architectural gym with floor-to-ceiling windows showing a dusk skyline softly out of focus, matte black equipment, gunmetal frames, dark walnut lockers glimpsed beyond a threshold. " +
      STYLE_SUFFIX,
  },
  {
    id: "portfolio-katara-stone-spa",
    page: "portfolio",
    section: "katara-stone-spa",
    type: "image",
    model: "gpt-2",
    aspectRatio: "3:4",
    prompt:
      "A spa cut into dark stone at Katara, Doha: dark basalt walls, a narrow skylight casting one blade of light across a still stone soaking pool, deep shadows, muted warm minerality, restrained detailing. " +
      STYLE_SUFFIX,
  },
  {
    id: "portfolio-the-obsidian-room",
    page: "portfolio",
    section: "the-obsidian-room",
    type: "image",
    model: "gpt-2",
    aspectRatio: "16:9",
    prompt:
      "A dark refined private dining room adjoining a wellness club: one long honed stone table lit by a single precise line of light, charcoal plaster walls, dark walnut, aged bronze, deep shadows. " +
      STYLE_SUFFIX,
  },

  // ————————————————————————————————— Project detail shots (GPT Image 2)
  {
    id: "detail-grand-training-hall",
    page: "portfolio",
    section: "grand-training-hall",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of a matte black barbell resting in a machined gunmetal rack, a warm line of light grazing the knurled steel, charcoal stone wall softly out of focus. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-nightfall-lap-pool",
    page: "portfolio",
    section: "nightfall-lap-pool",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of still black water meeting honed charcoal stone at a pool edge, faint ripple reflections, one warm underwater light line. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-yoga-alcove",
    page: "portfolio",
    section: "the-yoga-alcove",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of folded olive-sage textiles on a low dark timber bench beside a rolled natural yoga mat, textured plaster wall, soft directional light. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-meridian-wellness-floor",
    page: "portfolio",
    section: "meridian-wellness-floor",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of an aged bronze door handle on a dark timber spa door, faint steam softening the background, one warm light source. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-lusail-performance-club",
    page: "portfolio",
    section: "lusail-performance-club",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of precise dark rubber flooring seams meeting a limestone threshold, an engineered light grid reflected faintly in brushed steel. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-holland-park-suite",
    page: "portfolio",
    section: "holland-park-suite",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of matte black dumbbells on a dark walnut wall rack, low morning light grazing the metal, limestone wall beyond. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-marylebone-recovery-atelier",
    page: "portfolio",
    section: "marylebone-recovery-atelier",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of the water surface in a dark stone cold plunge, an aged bronze step rail entering the water, a single beam of controlled light. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-city-performance-floor",
    page: "portfolio",
    section: "city-performance-floor",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of a brushed gunmetal cable machine against dusk window light, a blurred city skyline far beyond the glass. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-katara-stone-spa",
    page: "portfolio",
    section: "katara-stone-spa",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of a blade of daylight across a rough dark basalt wall above a still dark stone pool, deep shadow around it. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-msheireb-townhouse-gym",
    page: "portfolio",
    section: "msheireb-townhouse-gym",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of dark oak panelling meeting a matte black steel frame with a thin aged bronze inlay, one shaft of daylight from above. " +
      STYLE_SUFFIX,
  },
  {
    id: "detail-the-obsidian-room",
    page: "portfolio",
    section: "the-obsidian-room",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "Close detail of a long honed stone dining table edge under one precise line of light, dark plaster wall dissolving into shadow beyond. " +
      STYLE_SUFFIX,
  },

  // ————————————————————————————————— Featured project extras (GPT Image 2)
  {
    id: "extra-grand-training-hall",
    page: "portfolio",
    section: "grand-training-hall",
    type: "image",
    model: "gpt-2",
    aspectRatio: "16:9",
    prompt:
      "A wide view along the training zones of a vast dark training hall, a single athlete as a small distant silhouette mid-stride, long shafts of controlled light across matte black equipment, charcoal stone and dark timber. Premium architectural editorial photography, medium-format clarity, slightly crushed blacks, restrained highlights, subtle film grain, realistic imperfections, quiet luxury, deep spatial perspective, no direct-to-camera pose, no text, no logo, no watermark, no CGI look, no neon, no oversaturation.",
  },
  {
    id: "extra-nightfall-lap-pool",
    page: "portfolio",
    section: "nightfall-lap-pool",
    type: "image",
    model: "gpt-2",
    aspectRatio: "16:9",
    prompt:
      "A dark indoor lap pool seen along its length at night: one warm light line under still black water, honed stone walls dissolving into shadow, faint reflections on a dark ceiling. " +
      STYLE_SUFFIX,
  },
  {
    id: "extra-yoga-alcove",
    page: "portfolio",
    section: "the-yoga-alcove",
    type: "image",
    model: "gpt-2",
    aspectRatio: "4:3",
    prompt:
      "A wide view of an architectural yoga alcove with a rolled natural mat and a low dark timber bench, one sculptural shaft of morning light across textured plaster, muted limestone floor, generous negative space. " +
      STYLE_SUFFIX,
  },
];

export function getBrief(id: string): MediaBrief | undefined {
  return mediaBriefs.find((brief) => brief.id === id);
}
