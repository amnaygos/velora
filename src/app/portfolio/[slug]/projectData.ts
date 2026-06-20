export const projectData: Record<string, { name: string; type: string; location: string; services: string[]; description: string; narrative: string[]; heroImage: string; galleryImages: string[] }> = {
  "private-residential-gym": { name: "Private Residential Gym", type: "RESIDENTIAL", location: "Dubai, UAE", services: ["Architectural Design", "Equipment & Supply", "Operations & Management"], description: "A sanctuary of movement designed for a private residence, where every detail serves the rhythm of daily wellness.", narrative: ["The brief was clear: create a space that feels less like a gym and more like a private wellness sanctuary. We approached this by studying the client's daily rituals — how they move, when they exercise, what inspires them to push further.", "Warm wood tones and a neutral palette ground the space in calm. Custom equipment is integrated into millwork that reads as furniture. The result is a gym that disappears into the architecture of the home — present when needed, invisible when not."], heroImage: "/images/home-gym.jpg", galleryImages: ["/images/equipment-overhead.jpg", "/images/yoga-studio.jpg"] },
  "the-cedar-pool": { name: "The Cedar Pool", type: "SPA & WELLNESS", location: "Aspen, Colorado", services: ["Architectural Design", "Equipment Supply"], description: "An indoor lap pool where timber, stone, and water converge to create a space of profound stillness.", narrative: ["Set within a mountain retreat, this indoor lap pool was designed as a meditative counterpoint to the dramatic landscape outside. The cedar ceiling brings warmth and an organic rhythm that softens the long geometry of the pool.", "Natural stone walls absorb and reflect light differently throughout the day, giving the space a living quality. Every swim becomes a journey through changing atmosphere."], heroImage: "/images/cedar-pool.jpg", galleryImages: ["/images/spa-lounge.jpg", "/images/cave-spa.jpg"] },
  "sky-gym": { name: "Sky Gym", type: "GYMS & FITNESS", location: "Manhattan, New York", services: ["Architectural Design", "Equipment & Supply", "Operations & Management"], description: "A luxury fitness club perched above the city skyline, where dramatic lighting and panoramic views redefine the workout experience.", narrative: ["Located on the 50th floor of a landmark tower, Sky Gym demanded a design that could compete with the view. Our response was to embrace the drama — circular ring lights echo the geometry of the city below, while dark finishes absorb light and focus attention outward.", "The result is a gym that feels like a private observation deck. Members don't just work out here — they ascend."], heroImage: "/images/dark-gym.jpg", galleryImages: ["/images/equipment-overhead.jpg", "/images/home-gym.jpg"] },
  "yoga-sanctuary": { name: "Yoga Sanctuary", type: "SPA & WELLNESS", location: "Bali, Indonesia", services: ["Architectural Design"], description: "A stone sanctuary where ancient architectural forms create the perfect conditions for modern mindfulness practice.", narrative: ["Inspired by the island's temple architecture, this yoga studio uses dramatic stone archways to create a sense of procession and reverence. Natural light filters through tall windows, casting moving patterns across the herringbone parquet floor.", "The space is designed to slow the mind before practice even begins. Every material was chosen for its tactile warmth and acoustic properties."], heroImage: "/images/yoga-studio.jpg", galleryImages: ["/images/yoga-arch.jpg", "/images/colonnade-spa.jpg"] },
  "marble-spa-retreat": { name: "Marble Spa Retreat", type: "HOSPITALITY", location: "Santorini, Greece", services: ["Architectural Design", "Equipment Supply", "Operations & Management"], description: "A cave-carved spa where alabaster and stone create an otherworldly environment for deep restoration.", narrative: ["Carved into the volcanic rock of Santorini's caldera edge, this spa retreat channels the island's geological history into a space of profound calm. Alabaster fixtures glow with internal warmth against the rough stone walls.", "The design respects the cave's natural acoustics, creating an environment so quiet you can hear your own breath. It's a space designed not just for relaxation, but for recalibration."], heroImage: "/images/cave-spa.jpg", galleryImages: ["/images/spa-lounge.jpg", "/images/colonnade-spa.jpg"] },
  "the-colonnade-pool": { name: "The Colonnade Pool", type: "HOSPITALITY", location: "Milan, Italy", services: ["Architectural Design", "Equipment Supply"], description: "A white stone colonnade pool that merges classical architectural language with contemporary wellness programming.", narrative: ["For a historic hotel in Milan's fashion district, we created a pool that speaks the language of the city's architectural heritage. White stone colonnades create rhythm and structure, while a sculptural wall relief provides a focal point for meditative swimming.", "The reflective water surface doubles the colonnade, creating an infinite architectural perspective. It's a space that honours its context while defining a new standard for hotel wellness."], heroImage: "/images/colonnade-spa.jpg", galleryImages: ["/images/spa-lounge.jpg", "/images/cave-spa.jpg"] },
  "executive-lounge": { name: "Executive Lounge", type: "RESIDENTIAL", location: "London, UK", services: ["Architectural Design", "Operations & Management"], description: "A private members' lounge where dark timber and brass create an atmosphere of refined masculinity and quiet power.", narrative: ["Designed for a private club in Mayfair, this executive lounge draws on the tradition of the British gentlemen's club while speaking a contemporary design language. Dark timber panelling is punctuated by brass-lit shelving that displays curated objects.", "The space is designed for conversation — intimate enough for private deals, grand enough to impress. Every seat has been positioned for both comfort and sightlines."], heroImage: "/images/executive-lounge.jpg", galleryImages: ["/images/hotel-restaurant.jpg", "/images/honeycomb-facade.jpg"] },
  "fb-concept": { name: "F&B Concept", type: "DINING & LIFESTYLE", location: "Singapore", services: ["Architectural Design", "Business Consulting"], description: "A dining concept where tropical gardens, marble surfaces, and woven light fixtures create an immersive culinary environment.", narrative: ["This farm-to-table concept was designed around the idea of dining within a garden. A tropical courtyard is visible from every seat, creating a sense of being immersed in nature while enjoying refined cuisine.", "Marble countertops provide a cool, elegant surface for food presentation, while woven rattan pendants cast intricate shadow patterns. The design bridges indoor and outdoor, casual and refined."], heroImage: "/images/fnb-concept.jpg", galleryImages: ["/images/boutique-retail.jpg", "/images/hotel-restaurant.jpg"] },
  "hotel-restaurant": { name: "Hotel Restaurant", type: "DINING & LIFESTYLE", location: "Paris, France", services: ["Architectural Design", "Operations & Management"], description: "A candlelit dining room where dark velvet, stone art, and marble surfaces create an atmosphere of timeless luxury.", narrative: ["For a boutique hotel in the Marais, we designed a restaurant that channels Parisian romance through a contemporary lens. Dark velvet seating absorbs sound and creates intimacy, while a dramatic stone wall art installation anchors the room.", "Candlelit marble tables reflect warm light, creating a golden glow that makes every guest look their best. The design ensures that whether it's a Tuesday dinner or a Saturday celebration, the atmosphere is always exactly right."], heroImage: "/images/hotel-restaurant.jpg", galleryImages: ["/images/executive-lounge.jpg", "/images/fnb-concept.jpg"] },
  "w5-boutique-retail": { name: "W5 Boutique Retail", type: "DINING & LIFESTYLE", location: "Tokyo, Japan", services: ["Architectural Design", "Business Consulting"], description: "A retail gallery where liquid metal ceilings and raw cement walls create a space worthy of the objects it displays.", narrative: ["This concept store in Tokyo's Aoyama district was designed as a gallery first, retail space second. A liquid metal ceiling installation captures and distorts light, creating an ever-changing atmosphere.", "Raw cement walls provide a neutral backdrop that lets products command attention. The design philosophy is restraint — every element earns its place, nothing competes with the merchandise."], heroImage: "/images/boutique-retail.jpg", galleryImages: ["/images/fnb-concept.jpg", "/images/honeycomb-facade.jpg"] },
  "grand-training-hall": {
    name: "Grand Training Hall",
    type: "GYMS & FITNESS",
    location: "Doha, Qatar",
    services: ["Architectural Design", "Equipment & Supply", "Operations & Management"],
    description: "A large-format performance gym in the heart of Doha, designed to set a new benchmark for commercial fitness in Qatar.",
    narrative: [
      "The brief called for a space that could accommodate elite athletes and serious fitness enthusiasts in equal measure. We responded with a design language built on raw materials and refined proportion — exposed structural steel paired with acoustic panels, polished concrete floors grounded by rubber training zones.",
      "Lighting was engineered as a performance tool: bright, focused task zones for lifting, warmer ambient light for recovery areas. The result is a training hall that feels both industrial in its ambition and considered in every detail.",
      "More than 400 SQM of functional training space, designed and delivered in under six months. A space that already shapes how its members think about performance."
    ],
    heroImage: "/Portfolio/BigroomGym-A.png",
    galleryImages: ["/Portfolio/BigroomGym-B.png", "/Portfolio/BigroomGym-A.png"]
  },
  "villa-fitness-suite": {
    name: "Villa Fitness Suite",
    type: "GYMS & FITNESS",
    location: "Doha, Qatar",
    services: ["Consultation", "Architectural Design", "Equipment & Supply"],
    description: "A private fitness suite within a luxury villa, where bespoke cabinetry and custom equipment create a sanctuary of personal performance.",
    narrative: [
      "Private clients demand more than function — they require a space that feels native to their home. For this villa commission, we began with the owner's daily rituals and built outward, letting routine determine layout and material choices follow.",
      "Custom joinery integrates storage and equipment into a single architectural gesture. The equipment is concealed when not in use, transforming the suite into a serene extension of the villa's living spaces. Every surface was selected for its tactile quality as much as its durability.",
      "The result is a gym that never announces itself as a gym. It simply elevates the experience of moving well, every day."
    ],
    heroImage: "/Portfolio/Gym1-A.png",
    galleryImages: ["/Portfolio/Gym1-B.png", "/Portfolio/Gym1-A.png"]
  },
  "obsidian-performance-studio": {
    name: "Obsidian Performance Studio",
    type: "GYMS & FITNESS",
    location: "Lusail, Qatar",
    services: ["Architectural Design", "Equipment & Supply", "Project Supervision"],
    description: "A dark-palette performance studio where dramatic lighting and precision-engineered equipment redefine what a training environment can be.",
    narrative: [
      "Obsidian was conceived as a provocation — a deliberate rejection of the bright, mirrored aesthetic that dominates commercial fitness. We asked: what if a gym felt more like a performance stage?",
      "Deep charcoal walls, matte black equipment, and strategic accent lighting create an environment where focus comes naturally. The space eliminates distraction by eliminating excess. Every element serves performance — acoustics, ventilation, sight lines, and surface texture were all considered as a single system.",
      "The studio has become a destination in its own right, attracting athletes who understand that the environment shapes the outcome."
    ],
    heroImage: "/Portfolio/dark-A.png",
    galleryImages: ["/Portfolio/dark-B.png", "/Portfolio/dark-A.png"]
  },
  "aqua-training-pavilion": {
    name: "Aqua Training Pavilion",
    type: "GYMS & FITNESS",
    location: "The Pearl, Qatar",
    services: ["Architectural Design", "Equipment & Supply", "Operations & Management"],
    description: "A waterfront training pavilion at The Pearl, where views of the marina become an intrinsic part of the wellness experience.",
    narrative: [
      "Positioned at the edge of The Pearl's marina, this training pavilion was designed around its location. Floor-to-ceiling glazing dissolves the boundary between interior and water, allowing natural light and open horizons to become part of the training experience.",
      "The programming combines functional strength training with aquatic recovery — two disciplines usually housed separately, here unified under a single architectural identity. Materials were specified for the coastal environment: marine-grade steel, UV-resistant composites, and sealed concrete.",
      "Members don't simply visit this space — they seek it out. The pavilion has redefined what proximity to water can mean for physical performance."
    ],
    heroImage: "/Portfolio/Gym2-A.png",
    galleryImages: ["/Portfolio/Gym2-B.png", "/Portfolio/Gym2-A.png"]
  },
  "emerald-fitness-club": {
    name: "Emerald Fitness Club",
    type: "GYMS & FITNESS",
    location: "West Bay, Qatar",
    services: ["Consultation", "Architectural Design", "Commercial & Residential Wellness", "Equipment & Supply"],
    description: "A full-service fitness club in West Bay's commercial core, where sophisticated design elevates the everyday workout into a luxury experience.",
    narrative: [
      "West Bay demanded a fitness offering that could stand alongside the district's premium hospitality and retail. We designed a club that draws on the language of five-star hotel lobbies — generous volumes, considered lighting, a curated material palette — and applies them to a serious training environment.",
      "The club spans multiple zones: cardio, strength, functional, and group fitness, each with its own identity but connected by a coherent design narrative. Member journeys were choreographed from entry to exit, with amenities positioned to reward and encourage return visits.",
      "Six months after opening, membership targets were exceeded. The design continues to be cited by members as the primary reason they joined."
    ],
    heroImage: "/Portfolio/gym3-A.png",
    galleryImages: ["/Portfolio/gym3-B.png", "/Portfolio/gym3-A.png"]
  },
  "nightfall-lap-pool": {
    name: "Nightfall Lap Pool",
    type: "SPA & WELLNESS",
    location: "Lusail, Qatar",
    services: ["Architectural Design", "Project Supervision"],
    description: "An indoor lap pool designed for nocturnal serenity — dark surfaces, controlled light, and still water create conditions for deep focus and recovery.",
    narrative: [
      "The client's vision was precise: a pool that felt different at every hour, but most alive after sunset. We designed around that idea, specifying materials and lighting that respond to and enhance artificial light rather than compete with natural daylight.",
      "Dark mosaic tiles absorb and reflect light in ways that white pools cannot, creating a water surface that seems to glow from within. The surrounding deck is deliberately minimal — no unnecessary furniture, no visual clutter — directing all attention toward the water.",
      "What emerged is a space that has changed how its users relate to swimming. It is not exercise infrastructure — it is a ritual environment."
    ],
    heroImage: "/Portfolio/pool-A.png",
    galleryImages: ["/Portfolio/pool-B.png", "/Portfolio/pool-A.png"]
  },
  "the-yoga-alcove": {
    name: "The Yoga Alcove",
    type: "SPA & WELLNESS",
    location: "Al Waab, Qatar",
    services: ["Consultation", "Architectural Design"],
    description: "A contemplative yoga studio carved from a residential space, where natural materials and considered acoustics create the conditions for transformative practice.",
    narrative: [
      "The Yoga Alcove began as a question: how small can a wellness space be and still feel complete? Working within a compact footprint, we designed a studio that uses proportion, material warmth, and acoustic control to create a sense of expansiveness far beyond its dimensions.",
      "Pale timber wall panels modulate sound and add organic warmth. A mirrored wall is positioned to extend the perceived depth of the space rather than simply reflect its contents. The flooring — a natural cork composite — offers both thermal comfort and the precise amount of give required for safe practice.",
      "The studio accommodates eight practitioners in conditions typically reserved for spaces three times the size. It is proof that the quality of an environment is not a function of its area."
    ],
    heroImage: "/Portfolio/small yoga room-A.png",
    galleryImages: ["/Portfolio/small yoga room-B.png", "/Portfolio/small yoga room-A.png"]
  },
};
