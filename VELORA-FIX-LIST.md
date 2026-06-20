# VELORA — Complete Fix List
## Compiled by Amine, Creative Director | 21 June 2026

---

## 🔴 CRITICAL — SITE-BREAKING BUGS (Fix First)

### 1. Portfolio Listing → Detail Links Are All Broken
**File:** `src/app/portfolio/page.tsx` + `src/app/portfolio/[slug]/projectData.ts`

**Problem:** The portfolio listing page hardcodes 7 Qatar projects with slugs like `grand-training-hall`, `nightfall-lap-pool`, `the-yoga-alcove`. But `projectData.ts` defines 10 completely different international projects. Every "VIEW PROJECT →" button leads to a 404.

**Fix:**
- Add the 7 Qatar portfolio projects to `projectData.ts` with proper content (narratives, gallery images, hero images, services, project type, location).
- Reference the existing listing data for: project name, category, location, year, before/after image paths.
- Ensure slugs match between the listing `projects` array and `projectData.ts` entries.

**Prompt for agent:**
> "Add the 7 Qatar projects from `page.tsx` (Grand Training Hall, Villa Fitness Suite, Obsidian Performance Studio, Aqua Training Pavilion, Emerald Fitness Club, Nightfall Lap Pool, The Yoga Alcove) into `projectData.ts`. Use the existing data model structure (name, slug, projectType, location, services, description, narrative, heroImage, galleryImages). Use their before/after images as gallery images. Write 2-3 narrative paragraphs for each describing the transformation. Then verify that every 'VIEW PROJECT →' link on the portfolio listing resolves to a valid detail page."

---

### 2. "SCHEDULE A CALL" CTAs Are Non-Functional (Contact Page)
**File:** `src/app/contact/page.tsx`

**Problem:** Two `<span>` elements styled as CTAs with text "SCHEDULE A CALL →" — one in the left info column, one in the `AlternativeCTA` section. Neither has an `onClick` handler, `href`, or any functionality.

**Fix:**
- Convert both `<span>` elements to `<Link>` components pointing to a scheduling URL (Calendly, Cal.com, etc.), or
- If no scheduling tool exists yet, convert them to `<button>` elements that scroll to the enquiry form with a note in the message, or
- Implement a `handleScheduleCall` function that triggers a modal or redirects.

**Prompt for agent:**
> "In `src/app/contact/page.tsx`, find both 'SCHEDULE A CALL →' `<span>` elements (one in the contact info left column, one in the `AlternativeCTA` section). Replace them with a functional `<a>` tag pointing to a Calendly URL placeholder: `https://calendly.com/velora/discovery-call`. If the environment variable `NEXT_PUBLIC_CALENDLY_URL` exists, use that; otherwise fall back to the placeholder. Add `target='_blank'` and `rel='noopener noreferrer'`."

---

### 3. Fake WhatsApp Number on Contact Page
**File:** `src/app/contact/page.tsx`

**Problem:** WhatsApp number `+974 1234 5678` is clearly a placeholder. Premium clients will recognise it as fake instantly.

**Fix:**
- If a real WhatsApp Business number exists, substitute it.
- If not, remove the WhatsApp section entirely until a real number is available.
- Better to have fewer contact methods that work than more that don't.

**Prompt for agent:**
> "In `src/app/contact/page.tsx`, locate the WhatsApp contact section with `+974 1234 5678`. Check if there's a real WhatsApp number in environment variables (`NEXT_PUBLIC_WHATSAPP_NUMBER`). If yes, use it. If no, comment out or hide the entire WhatsApp section with a TODO comment: `// TODO: Add real WhatsApp Business number`. Do not display the placeholder number."

---

### 4. HubCards + All Forms Dead on Velora Standard Page
**File:** `src/app/the-velora-standard/page.tsx`

**Problem:** Every interactive element on the page is non-functional:
- Three HubCard CTAs ("DOWNLOAD FREE", "TAKE THE QUIZ", "SUBSCRIBE") are `<button>` elements with no handlers
- Blueprint form submission is `e.preventDefault()` only
- Quiz completion form (Name + Email) is `e.preventDefault()` only
- Newsletter form is `e.preventDefault()` only
- Quiz says "5 questions" but only 3 exist

**Fix:**
- Add `id="blueprint"`, `id="quiz"`, `id="newsletter"` section IDs.
- Make HubCard buttons scroll to their sections: `onClick={() => document.getElementById('quiz')?.scrollIntoView({behavior:'smooth'})}`
- Add form submission logic to all forms (POST to `/api/chat` or show a success state).
- Fix quiz question count: either add 2 more questions or change "5 questions" to "3 questions".
- Add quiz completion confirmation state.

**Prompt for agent:**
> "In `src/app/the-velora-standard/page.tsx`:
> 1. Add `id='blueprint'`, `id='quiz'`, `id='newsletter'` to the respective section wrapper divs.
> 2. Make the three HubCard buttons functional: 'DOWNLOAD FREE' scrolls to `#blueprint`, 'TAKE THE QUIZ' scrolls to `#quiz`, 'SUBSCRIBE' scrolls to `#newsletter`. Use `onClick` handlers with `scrollIntoView({behavior:'smooth'})`.
> 3. Change the quiz intro copy from '5 questions. 3 minutes.' to '3 questions. 2 minutes.'
> 4. Add a confirmation state after quiz form submission: replace the form with a thank-you message saying 'Thank you. Your VELORA Profile has been received. Our team will be in touch within one business day.' Title it 'PROFILE SUBMITTED'.
> 5. For the Blueprint download form and Newsletter form, add a success state that replaces the form with a confirmation message on submit.
> 6. Make the 'BOOK YOUR DISCOVERY CALL' button at quiz end link to `/contact`."

---

## 🟡 HIGH PRIORITY — CONVERSION & CONTENT

### 5. Home Services Grid Tiles Are Dead Ends
**File:** `src/app/page.tsx`

**Problem:** Six service grid tiles have `cursor-pointer` and hover effects but no `<Link>` wrapper. Users click expecting to learn more — nothing happens.

**Fix:** Wrap each tile in `<Link href="/services">` with `aria-label`.

**Prompt for agent:**
> "In `src/app/page.tsx`, find the `ServicesGrid` component (the 3-column grid with 6 service tiles: CONSULTATION, ARCHITECTURAL DESIGN, COMMERCIAL & RESIDENTIAL, HOSPITALITY WELLNESS, EQUIPMENT & SUPPLY, OPERATIONS & MANAGEMENT). Wrap each tile's outer `<div>` in a `<Link href='/services'>` from `next/link`. Preserve all existing hover effects and styling. Add an `aria-label` matching the service name to each link."

---

### 6. Home Manifesto First Paragraph Is Corporate Filler
**File:** `src/app/page.tsx`

**Problem:** The manifesto opens with vague corporate prose: *"VELORA is a refined wellness and leisure concept designed to elevate everyday living through thoughtful spaces, premium experiences, and a holistic approach to wellbeing."* The second paragraph — *"We do not build gyms. We craft environments that change how people feel about where they live and how they move."* — is the strongest line on the entire site.

**Fix:** Swap them. Lead with the founder-voice manifesto. Make the corporate intro a supporting subhead or cut it.

**Prompt for agent:**
> "In `src/app/page.tsx`, find the `ManifestoSection`. The manifesto has two `<p>` elements. Replace the first paragraph (starting 'VELORA is a refined wellness and leisure concept...') with: 'VELORA exists because most wellness spaces feel like afterthoughts. We replace the generic with the intentional — environments where every material, proportion, and sightline has been considered before the first wall is drawn.' Keep the second paragraph ('We do not build gyms. We craft environments that change how people feel about where they live and how they move.') as-is. Add `font-light` and `leading-relaxed` classes to both paragraphs if not already present."

---

### 7. Divider Quote Weakness
**File:** `src/app/page.tsx`

**Problem:** `"MORE THAN FITNESS, IT'S A WAY OF LIFE." — VELORA` — Three issues: (a) quotes itself (pompous), (b) contradicts the manifesto's "we do not build gyms" by reducing everything to "fitness", (c) is generic.

**Fix:** Replace with a client testimonial or a brand-prophetic line. Reduce vertical padding from `py-[250px]` to `py-[120px] lg:py-[160px]`.

**Prompt for agent:**
> "In `src/app/page.tsx`, find the `DividerQuote` section. Replace the text 'MORE THAN FITNESS, IT'S A WAY OF LIFE.' with: 'THEY DIDN'T DESIGN A GYM. THEY DESIGNED THE REASON I WAKE UP AT 5:30.' Change the attribution from '— VELORA' to '— Private Client, Doha'. Reduce the section's vertical padding from `py-[250px]` to `py-[120px] lg:py-[160px]`."

---

### 8. Credentials Wording Self-Sabotages
**File:** `src/app/page.tsx` (and duplicated in `src/app/about/page.tsx`)

**Problem:** 
- `"20+ YEARS OF COLLECTIVE EXPERTISE"` — "collective" signals no single person has 20 years.
- `"100+ PROJECTS AND AFFILIATE COLLABORATIONS"` — "affiliate" implies a secondary role.

**Fix:** 
- `"20+ YEARS OF DELIVERING EXCELLENCE"` (if substantiated)
- `"100+ PROJECTS DELIVERED"`

**Prompt for agent:**
> "In both `src/app/page.tsx` and `src/app/about/page.tsx`, find the `CredentialsBar` component data array. Change '20+ YEARS OF COLLECTIVE EXPERTISE' to '20+ YEARS OF DELIVERING EXCELLENCE'. Change '100+ PROJECTS AND AFFILIATE COLLABORATIONS' to '100+ PROJECTS DELIVERED'. If the CredentialsBar has a reusable data array, update it in one place if possible."

---

### 9. About Page: "SINCE DAY ONE" Is Evasive
**File:** `src/app/about/page.tsx`

**Problem:** `"PIONEERING WELLNESS SINCE DAY ONE"` — "SINCE DAY ONE" sounds like a company avoiding revealing it was founded last year.

**Fix:** If the founding year is known and credible, add it. Otherwise replace with a different tagline.

**Prompt for agent:**
> "In `src/app/about/page.tsx`, find the hero section. Replace the line 'PIONEERING WELLNESS SINCE DAY ONE' with 'PIONEERING WELLNESS. PROVEN RESULTS.' If a founding year is available in an environment variable `NEXT_PUBLIC_FOUNDING_YEAR`, use 'PIONEERING WELLNESS SINCE [YEAR]' instead."

---

### 10. About Page: WhoWeAre Section Too Long and Repetitive
**File:** `src/app/about/page.tsx`

**Problem:** Three paragraphs say essentially the same thing. The Philosophy section later says it better. The body copy dilutes the strongest line.

**Fix:** Collapse into one tight opening paragraph using the best lines.

**Prompt for agent:**
> "In `src/app/about/page.tsx`, find the `WhoWeAre` section. Replace the three body paragraphs with: 'We do not bring a template to a project. We bring precision, vision, and the accumulated intelligence of over two decades designing spaces where people choose to live at their best. Every VELORA environment begins with a single question: what do you want people to feel? From that answer, we design, build, and sustain spaces that do not just meet a brief — they redefine what the brief should have been.' Keep the section label 'WELL-ESTABLISHED AND PIONEERING IN WELLNESS & LIFESTYLE' or change it to 'WHO WE ARE' if preferred."

---

### 11. Services Page: Grammar Error in Service 04
**File:** `src/app/services/page.tsx`

**Problem:** Service 04 (Hospitality Wellness) description ends with: *"commitment to the unparalleled."* — "unparalleled" is an adjective, not a noun. Reads as a translation error.

**Fix:** Replace with *"commitment to standards that have no equal."*

**Prompt for agent:**
> "In `src/app/services/page.tsx`, find the description for Service 04 (HOSPITALITY WELLNESS). Locate the phrase 'commitment to the unparalleled' and replace it with 'commitment to standards that have no equal'."

---

## 🟢 MEDIUM PRIORITY — QUALITY & CONSISTENCY

### 12. Portfolio Detail: "RELATED PROJECTS" Section Is Bogus
**File:** `src/app/portfolio/[slug]/PortfolioDetailClient.tsx`

**Problem:** The "RELATED PROJECTS" section reuses `project.galleryImages` from the current project as links to `/portfolio` — it's showing the same project's images again. Communicates "we have nothing else."

**Fix:** Either implement actual cross-linking (query other projects by matching type/services) or remove the section until real data exists.

**Prompt for agent:**
> "In `src/app/portfolio/[slug]/PortfolioDetailClient.tsx`, find the 'RELATED PROJECTS' section. For now, hide the section with a comment `{/* TODO: Implement real related projects from projectData */}` and the condition `{false && (...)}` to prevent it rendering. Keep the code intact for future implementation."

---

### 13. Portfolio Detail: No Previous/Next Navigation
**File:** `src/app/portfolio/[slug]/page.tsx` + `PortfolioDetailClient.tsx`

**Problem:** After reading a project detail, there's no "Next Project →" link. Every case study is a dead end. Users must return to the listing.

**Fix:** Add previous/next project navigation at the bottom of each detail page, cycling through `projectData` entries.

**Prompt for agent:**
> "In `PortfolioDetailClient.tsx`, add a previous/next navigation section below the project content. Import `allProjects` from `projectData.ts`. Find the current project's index, then render '← Previous Project' and 'Next Project →' links using the adjacent projects' slugs. Style as small olive-label links: `text-[10px] tracking-[0.2em] text-olive hover:text-white/80 transition-colors`. Center between previous and next. If first project, only show Next. If last, only show Previous."

---

### 14. Home Featured Portfolio Links Go to Listing, Not Detail
**File:** `src/app/page.tsx`

**Problem:** The 3 featured projects (Grand Training Hall, Nightfall Lap Pool, The Yoga Alcove) all link to `/portfolio` instead of their individual detail pages.

**Fix:** Link each to its detail page: `/portfolio/grand-training-hall`, `/portfolio/nightfall-lap-pool`, `/portfolio/the-yoga-alcove`.

**Prompt for agent:**
> "In `src/app/page.tsx`, find the `FeaturedPortfolio` or portfolio grid section (3-column grid with Grand Training Hall, Nightfall Lap Pool, The Yoga Alcove). Change each project's `<Link href='/portfolio'>` to point to its specific detail page: `/portfolio/grand-training-hall`, `/portfolio/nightfall-lap-pool`, `/portfolio/the-yoga-alcove`."

---

### 15. Contact Page: Hero Has No Image
**File:** `src/app/contact/page.tsx`

**Problem:** Contact page opens with a text-on-carbon-void hero. Every page with a carbon-void hero diminishes the impact. Contact pages benefit from warmth.

**Fix:** Add a warm, human image — a VELORA workspace, a principal with a client, or a material detail shot.

**Prompt for agent:**
> "In `src/app/contact/page.tsx`, add a background image to the hero section. Use `bg-[url('/images/yoga-arch.jpg')]` (or any warm, human-centric image from `/public/images/`). Apply `bg-cover bg-center` and add a subtle dark overlay: a div with `absolute inset-0 bg-carbon/60`. Ensure text remains readable (white on dark overlay). The image should feel warm and welcoming, not cold and architectural."

---

### 16. Contact Page: Form Vision Textarea Prompt
**File:** `src/app/contact/page.tsx`

**Problem:** *"Describe your space, your goals, and what excellence means to you."* — fine but generic.

**Fix:** Make it signal that the answer will be read carefully.

**Prompt for agent:**
> "In `src/app/contact/page.tsx`, find the vision textarea label text 'Describe your space, your goals, and what excellence means to you.' Replace it with: 'Tell us about your project — the space, the ambition, the constraints. The more we understand now, the more precise our first conversation will be.'"

---

### 17. Footer Expansion
**File:** `src/components/Footer.tsx`

**Problem:** Footer has only 4 links and 3 social icons. No address, no phone, no email, no tagline. Too thin for a luxury brand.

**Fix:** Add: studio address, contact email, a 1-line brand tagline, and a link to "The Velora Standard."

**Prompt for agent:**
> "In `src/components/Footer.tsx`, expand the footer to include: 
> 1. A brand tagline below the logo: 'Where wellness meets wonder.' in `text-[9px] tracking-[0.15em] text-white/20`
> 2. Studio address: 'Doha · London' on one line in `text-[10px] text-white/40`
> 3. Contact email: `enquire@velora.com` as a `mailto:` link in `text-[10px] text-white/40 hover:text-white/70`
> 4. A link to 'The Velora Standard' in the navigation links row
> Keep the existing 4 links (About, Services, Portfolio, Contact). Add 'The Standard' as a 5th. Preserve the compact height — keep it under 120px total."

---

### 18. Services Page: Hero Heading Is Underselling
**File:** `src/app/services/page.tsx`

**Problem:** `"WHAT WE / DO"` — flat and functional. The Services page's capabilities deserve a stronger opening.

**Fix:** Replace with `"EVERY DISCIPLINE. / ONE STANDARD."` or `"EIGHT WAYS WE / ELEVATE SPACE."`

**Prompt for agent:**
> "In `src/app/services/page.tsx`, find the hero heading text 'WHAT WE / DO' (split across two lines). Replace it with 'EVERY DISCIPLINE. / ONE STANDARD.' preserving the same line-break structure and all existing animation/GSAP logic."

---

### 19. Home Featured Portfolio Section Heading
**File:** `src/app/page.tsx`

**Problem:** If the portfolio section heading says *"Each project begins where vision ends and precision begins"* — this is contradictory ("where vision ends" implies vision stops).

**Fix:** Replace with *"Clarity of vision. Certainty of execution."*

**Prompt for agent:**
> "In `src/app/page.tsx`, find the portfolio section heading. If it contains the phrase 'where vision ends and precision begins' or similar, replace it with: 'Clarity of vision. Certainty of execution.' If the heading is different, leave it and report what the current heading is."

---

### 20. ProjectData Service Tag Standardization
**File:** `src/app/portfolio/[slug]/projectData.ts`

**Problem:** Service tags are inconsistently named: `"Equipment"` vs `"Equipment Supply"`.

**Fix:** Standardize all service arrays to match the Services page names: CONSULTATION, ARCHITECTURAL DESIGN, COMMERCIAL & RESIDENTIAL WELLNESS, HOSPITALITY WELLNESS, EQUIPMENT & SUPPLY, OPERATIONS & MANAGEMENT, PROJECT SUPERVISION, BUSINESS CONSULTING.

**Prompt for agent:**
> "In `src/app/portfolio/[slug]/projectData.ts`, review all `services` arrays across all project entries. Standardize any inconsistent service names to match these exact strings: 'Consultation', 'Architectural Design', 'Commercial & Residential Wellness', 'Hospitality Wellness', 'Equipment & Supply', 'Operations & Management', 'Project Supervision', 'Business Consulting'. Use Title Case for display consistency. Run a search for 'Equipment' without '& Supply' — if found, update it."

---

## 🔵 LOWER PRIORITY — NICE-TO-HAVE

### 21. Three Different Form Schemas for Same Lead Pipeline
**Files:** `src/app/page.tsx`, `src/app/the-velora-standard/page.tsx`, `src/app/contact/page.tsx`

**Problem:** Home asks for First Name + Email + Role. Velora Standard asks for First Name + Last Name + Email + Company + Role. Contact asks for Full Name + Email + Phone + Company + Project Type + Budget + Source + Vision. Three different schemas for one pipeline.

**Fix:** Consider a phased approach: Home gets the quick-capture (current 3 fields). Velora Standard gets the mid-funnel (5-6 fields). Contact gets the full qualification (current 8 fields). Make the progression clear — each form asks for more because the prospect is deeper in.

**Prompt for agent:**
> "Audit the three lead capture forms across the site:
> - Home page LeadMagnetSection form
> - Velora Standard BlueprintSection form
> - Contact page enquiry form
> 
> Document the fields each collects. Propose a consistent progressive data collection strategy where each subsequent form asks for incrementally more information. Do NOT modify any form yet — return a comparison table and recommendation only."

---

### 22. Add Individual Service Detail Pages
**File:** New: `src/app/services/[slug]/page.tsx`

**Problem:** All 8 services are confined to a single interactive explorer page. No SEO landing pages, no deep-linking, no way to link tiles from Home.

**Fix:** Create individual service detail pages. Start with a template that can be reused for all 8.

**Prompt for agent:**
> "Create a new file `src/app/services/[slug]/page.tsx` as a service detail page template. It should:
> 1. Use the `serviceData` pattern similar to `projectData.ts` (create a `src/app/services/serviceData.ts` with all 8 services).
> 2. Each service entry: slug, name, category, description (expanded), heroImage, approach (3-4 step process), related projects (optional).
> 3. The page should have: hero with image + title, expanded description, approach section, gallery (if images exist), CTA to `/contact`.
> 4. Include '← All Services' back link at the top.
> 5. Style consistently with the dark aesthetic (bg-carbon, Montserrat, uppercase labels, olive accents).
> 6. For now, create the template and populate serviceData with the first 2 services (Consultation + Architectural Design) with expanded content. Leave the remaining 6 as skeletons with TODO comments.
> 7. Add `export const dynamicParams = false` and `generateStaticParams` for static export compatibility."

---

### 23. Portfolio Category Filter
**File:** `src/app/portfolio/page.tsx`

**Problem:** All 7+ projects shown in one scroll with no filtering. With growth, this becomes unusable.

**Fix:** Add filter pills at the top: ALL / GYMS & FITNESS / SPA & WELLNESS / OTHER.

**Prompt for agent:**
> "In `src/app/portfolio/page.tsx`, add a category filter row below the hero and above the project list. Use small pill buttons styled as: `text-[9px] tracking-[0.15em] px-4 py-1.5 border border-white/10 rounded-none text-white/40 hover:text-white hover:border-white/30 transition-colors`. Active state: `border-olive text-olive`. Categories: 'ALL', 'GYMS & FITNESS', 'SPA & WELLNESS'. Add state management with `useState` to filter the projects array by category. Use `AnimatePresence` to fade filtered items in/out."

---

### 24. About Page: Add Hero Image
**File:** `src/app/about/page.tsx`

**Problem:** About hero is a carbon-black void with only text and an animated logo. No human presence, no workspace shot. For a brand selling "spaces that change how people feel," showing no space is a missed opportunity.

**Prompt for agent:**
> "In `src/app/about/page.tsx`, add a full-width image or subtle background treatment to the hero section. Options:
> - A material detail image (stone, timber, craft) behind a dark overlay
> - A team/workspace shot for human warmth
> - A subtle geometric pattern or grain texture
> 
> Use `bg-[url('/images/arch.png')]` with `bg-cover bg-center` and a `bg-carbon/70` overlay. Ensure the animated logo and text remain clearly visible on top."

---

### 25. Remove or Differentiate Duplicated Credentials Bar on About
**File:** `src/app/about/page.tsx`

**Problem:** The CredentialsBar on About is an exact copy-paste from Home. On a multi-page site, this dilutes authority rather than reinforcing it.

**Prompt for agent:**
> "In `src/app/about/page.tsx`, if the `CredentialsBar` is using the same component/data as the Home page, either: (a) Change it to a single narrative line: '50,000 SQM completed. 100+ projects delivered. Over 20 years of excellence.' styled as a centered statement with olive accents, OR (b) Remove it entirely and let the Philosophy section carry the credibility. If removing, move the approach section up to fill the space."

---

## 📊 SUMMARY: FIX PRIORITY ORDER

```
PHASE 1 — Site-Breaking (Today)
  1. Fix portfolio listing → detail links
  2. Fix "SCHEDULE A CALL" CTAs on Contact
  3. Remove fake WhatsApp number
  4. Wire up HubCards + forms on Velora Standard

PHASE 2 — Conversion & Content (This Week)
  5. Link home services grid tiles
  6. Rewrite home manifesto
  7. Replace divider quote + reduce padding
  8. Fix credentials wording (both pages)
  9. Fix About "SINCE DAY ONE"
  10. Cut About WhoWeAre copy
  11. Fix Service 04 grammar

PHASE 3 — Quality & Polish (Next Sprint)
  12-20. Portfolio detail fixes, footer, hero images, CTA text, service tags

PHASE 4 — Nice-to-Have (Backlog)
  21-25. Form consolidation, service detail pages, portfolio filter, hero images
```

---

**Total: 25 action items | 4 site-breaking | 7 high-priority | 9 medium | 5 nice-to-have**
