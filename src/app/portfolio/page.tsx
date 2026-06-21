"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
} from "framer-motion";

/* ── Data ─────────────────────────────────────────────────────────────── */
const projects = [
  {
    slug: "grand-training-hall",
    name: "Grand Training Hall",
    category: "GYMS & FITNESS",
    location: "Doha, Qatar",
    year: "2025",
    before: "/Portfolio/BigroomGym-B.png",
    after: "/Portfolio/BigroomGym-A.png",
  },
  {
    slug: "villa-fitness-suite",
    name: "Villa Fitness Suite",
    category: "GYMS & FITNESS",
    location: "Doha, Qatar",
    year: "2024",
    before: "/Portfolio/Gym1-B.png",
    after: "/Portfolio/Gym1-A.png",
  },
  {
    slug: "obsidian-performance-studio",
    name: "Obsidian Performance Studio",
    category: "GYMS & FITNESS",
    location: "Lusail, Qatar",
    year: "2025",
    before: "/Portfolio/dark-B.png",
    after: "/Portfolio/dark-A.png",
  },
  {
    slug: "aqua-training-pavilion",
    name: "Aqua Training Pavilion",
    category: "GYMS & FITNESS",
    location: "The Pearl, Qatar",
    year: "2024",
    before: "/Portfolio/Gym2-B.png",
    after: "/Portfolio/Gym2-A.png",
  },
  {
    slug: "emerald-fitness-club",
    name: "Emerald Fitness Club",
    category: "GYMS & FITNESS",
    location: "West Bay, Qatar",
    year: "2023",
    before: "/Portfolio/gym3-B.png",
    after: "/Portfolio/gym3-A.png",
  },
  {
    slug: "nightfall-lap-pool",
    name: "Nightfall Lap Pool",
    category: "SPA & WELLNESS",
    location: "Lusail, Qatar",
    year: "2024",
    before: "/Portfolio/pool-B.png",
    after: "/Portfolio/pool-A.png",
  },
  {
    slug: "the-yoga-alcove",
    name: "The Yoga Alcove",
    category: "SPA & WELLNESS",
    location: "Al Waab, Qatar",
    year: "2023",
    before: "/Portfolio/small yoga room-B.png",
    after: "/Portfolio/small yoga room-A.png",
  },
];

type Project = (typeof projects)[number];

/* ── Word Reveal ──────────────────────────────────────────────────────── */
function WordReveal({ text, inView }: { text: string; inView: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
          className={i < words.length - 1 ? "mr-[0.22em]" : ""}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%" }}
            animate={inView ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1.0, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen bg-carbon flex flex-col items-center justify-center overflow-hidden" style={{ height: "100svh" }}>
      <motion.div
        style={{ y, opacity }}
        className="flex flex-col items-center px-6 select-none text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="text-[9px] tracking-[0.5em] text-olive mb-7"
        >
          VELORA — SELECTED WORK
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="text-[24px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-light tracking-[0.05em] leading-[0.9] mb-6"
        >
          OUR <span className="text-olive">WORK</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-[9px] tracking-[0.28em] text-white/30"
        >
          100+ SPACES. ONE STANDARD.
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.div
          className="w-px h-10 bg-white/20 origin-top"
          animate={{ scaleY: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <span className="text-[8px] tracking-[0.45em] text-white/20">SCROLL</span>
      </motion.div>
    </section>
  );
}

/* ── Parallax Project Section ──────────────────────────────────────────── */
function ParallaxProject({ project, index }: { project: Project; index: number }) {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isEven       = index % 2 === 0;
  const inView       = useInView(sectionRef, { amount: 0.15, once: false });
  const isDragging   = useRef(false);

  /*
   * Two scroll contexts:
   *  approachY – "start end" → "start start"
   *    0→1 as section scrolls up from below-fold to fully pinned.
   *    Feeds raw clipPos; a display spring smooths the visual reveal.
   *
   *  pinY – "start start" → "end start"
   *    0→1 while pinned and exiting.
   *    Drives info panel, before-image dim, line/handle visibility.
   */
  const { scrollYProgress: approachY } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const { scrollYProgress: pinY } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Smooth spring on pin for info-panel motion */
  const sPin = useSpring(pinY, { stiffness: 90, damping: 28, restDelta: 0.001 });

  /*
   * clipPos = raw source of truth (updated by scroll or drag).
   * clipPosDisplay = spring-smoothed for all visual output.
   * One spring instead of two keeps the animation crisp, not double-lagged.
   */
  const clipPos = useMotionValue(0);
  const clipPosDisplay = useSpring(clipPos, { stiffness: 100, damping: 22, restDelta: 0.001 });

  /* Approach drives raw clipPos directly (no intermediate spring) */
  useEffect(() => {
    const unsub = approachY.on("change", (v) => {
      if (isDragging.current) return;
      clipPos.set(Math.max(0, Math.min(1, v)));
    });
    return unsub;
  }, []); // eslint-disable-line

  /* Clip path — uses smoothed display value */
  const clipPath = useTransform(
    clipPosDisplay,
    (v) => `polygon(0% 0%, ${v * 100}% 0%, ${v * 100 + 8}% 100%, 0% 100%)`
  );

  /* SVG diagonal line tracks smoothed display value */
  const lineRef = useRef<SVGLineElement>(null);
  useEffect(() => {
    const update = (v: number) => {
      if (!lineRef.current) return;
      lineRef.current.setAttribute("x1", `${v * 100}%`);
      lineRef.current.setAttribute("x2", `${v * 100 + 8}%`);
    };
    update(clipPosDisplay.get());
    return clipPosDisplay.on("change", update);
  }, []); // eslint-disable-line

  /* Handle midpoint */
  const handleLeft = useTransform(clipPosDisplay, (v) => `${v * 100 + 4}%`);

  /* Line / handle visible during pin phase */
  const lineOpacity = useTransform(sPin, [0.0, 0.12, 0.82, 1.0], [0, 1, 1, 0]);

  /* Before image dims as section exits */
  const brightnessVal = useTransform(sPin, [0, 0.6], [0.65, 0.3]);
  const beforeFilter  = useTransform(
    brightnessVal,
    (b) => `grayscale(90%) brightness(${b.toFixed(3)}) contrast(1.06)`
  );

  /* BEFORE / AFTER labels driven by smoothed clip position */
  const beforeLabelOpacity = useTransform(clipPosDisplay, [0, 0.3], [1, 0]);
  const afterLabelOpacity  = useTransform(clipPosDisplay, [0.1, 0.4], [0, 1]);

  /* Info panel */
  const infoOpacity = useTransform(sPin, [0.04, 0.28, 0.86, 1.0], [0, 1, 1, 0]);
  const infoX       = useTransform(sPin, [0.04, 0.28], [isEven ? -50 : 50, 0]);

  const num   = String(index + 1).padStart(2, "0");
  const total = String(projects.length).padStart(2, "0");

  /* ── Drag handlers ──────────────────────────────────────────────────── */
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0.02, Math.min(0.98, (e.clientX - rect.left) / rect.width));
    clipPos.set(x);
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  return (
    /*
     * zIndex: index + 1 — each section stacks above the previous one.
     * As a new section scrolls up it slides OVER the outgoing one,
     * eliminating the blank carbon gap visible during the transition.
     */
    <section
      ref={sectionRef}
      className="relative bg-carbon"
      style={{ height: "200vh", zIndex: index + 1 }}
    >
      <div
        ref={containerRef}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ height: "100svh" }}
      >

        {/* BEFORE */}
        <motion.div className="absolute inset-0 w-full h-full" style={{ filter: beforeFilter }}>
          <img src={project.before} alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* AFTER */}
        <motion.div className="absolute inset-0 w-full h-full" style={{ clipPath }}>
          <img src={project.after} alt={project.name} className="w-full h-full object-cover" />
        </motion.div>

        {/* Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Diagonal divider line */}
        <motion.svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-visible"
          style={{
            opacity: lineOpacity,
            maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <line
            ref={lineRef}
            x1="0%" y1="0%" x2="8%" y2="100%"
            stroke="rgba(255,255,255,0.75)"
            strokeWidth="1"
          />
        </motion.svg>

        {/* Draggable handle */}
        <motion.div
          className="absolute top-1/2 z-20 -translate-y-1/2 -translate-x-1/2 w-11 h-11 border border-white/50 bg-black/50 flex items-center justify-center cursor-ew-resize select-none"
          style={{
            left: handleLeft,
            opacity: lineOpacity,
            touchAction: "none",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.92 }}
        >
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
            <path d="M5 1L1 5L5 9" stroke="rgba(255,255,255,0.75)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 1L17 5L13 9" stroke="rgba(255,255,255,0.75)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="9" y1="1" x2="9" y2="9" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
          </svg>
        </motion.div>

        {/* Labels */}
        <motion.span
          className="absolute top-8 left-10 md:left-16 z-10 text-[7px] tracking-[0.5em] text-white/40 pointer-events-none"
          style={{ opacity: beforeLabelOpacity }}
        >
          BEFORE
        </motion.span>
        <motion.span
          className="absolute top-8 right-10 md:right-16 z-10 text-[7px] tracking-[0.5em] text-white/40 pointer-events-none"
          style={{ opacity: afterLabelOpacity }}
        >
          AFTER
        </motion.span>

        {/* Counter */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-[8px] tracking-[0.25em] text-white/20 pointer-events-none"
          initial={{ opacity: 0, y: -6 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {num} / {total}
        </motion.div>

        {/* Project info */}
        <motion.div
          className={`absolute bottom-14 z-20 max-w-[520px] ${
            isEven ? "left-10 md:left-16" : "right-10 md:right-16"
          }`}
          style={{ opacity: infoOpacity, x: infoX }}
        >
          <motion.p
            className="text-[7px] tracking-[0.55em] text-olive mb-4"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.65, delay: 0.05 }}
          >
            {project.category}
          </motion.p>

          <Link href={`/portfolio/${project.slug}`} className="group block">
            <h2
              className={`text-[7vw] sm:text-[5vw] md:text-[3.8vw] font-light tracking-[0.02em] leading-[0.9] group-hover:text-olive transition-colors duration-500 ${
                !isEven ? "text-right" : ""
              }`}
            >
              <WordReveal text={project.name} inView={inView} />
            </h2>
          </Link>

          <motion.div
            className={`flex items-center gap-3 mt-5 ${!isEven ? "justify-end" : ""}`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="text-[8px] tracking-[0.2em] text-white/40">{project.location}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-white/20" />
            <span className="text-[8px] tracking-[0.2em] text-white/25">{project.year}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className={!isEven ? "flex justify-end" : ""}
          >
            <Link
              href={`/portfolio/${project.slug}`}
              className="inline-flex items-center gap-3 mt-7 text-[8px] tracking-[0.35em] text-white/35 hover:text-white border-b border-white/15 hover:border-white pb-1 transition-all duration-500"
            >
              VIEW PROJECT <span className="text-[10px]">→</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-olive/60 z-20 origin-left"
          style={{ scaleX: sPin }}
        />
      </div>
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function Portfolio() {
  return (
    <>
      <Hero />
      {projects.map((p, i) => (
        <ParallaxProject key={p.slug} project={p} index={i} />
      ))}
    </>
  );
}
