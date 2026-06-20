"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    cat: "STRATEGY",
    title: "CONSULTATION",
    desc: "Our experts work alongside you to identify wellness goals, develop fitness programming, guide equipment selection, and determine integration strategies for your space or organisation.",
    image: "/images/dark-gym.jpg",
  },
  {
    num: "02",
    cat: "DESIGN",
    title: "ARCHITECTURAL DESIGN",
    desc: "The elegance of form and function. We blend aesthetic vision with structural reality — site analysis, material specification, spatial flow, and construction oversight, all handled as one continuous act of authorship.",
    image: "/images/glass-tower.jpg",
  },
  {
    num: "03",
    cat: "DEVELOPMENT",
    title: "COMMERCIAL & RESIDENTIAL WELLNESS",
    desc: "Bespoke health and fitness solutions tailored to commercial enterprises and private residences. Spaces that do not just meet your specifications — they inspire continuous engagement with well-being.",
    image: "/images/equipment-overhead.jpg",
  },
  {
    num: "04",
    cat: "HOSPITALITY",
    title: "HOSPITALITY WELLNESS",
    desc: "VELORA redefines fitness hospitality by merging luxury with functionality. Every interaction, every material, every moment of stillness in a VELORA hospitality space reflects our commitment to standards that have no equal.",
    image: "/images/cedar-pool.jpg",
  },
  {
    num: "05",
    cat: "PRODUCT",
    title: "EQUIPMENT & SUPPLY",
    desc: "From designing and manufacturing bespoke fitness equipment to exclusive supply of VIP product lines — we ensure every piece is worthy of the environment it enters.",
    image: "/images/home-gym.jpg",
  },
  {
    num: "06",
    cat: "CONTINUITY",
    title: "OPERATIONS & MANAGEMENT",
    desc: "A space is only as exceptional as how it runs on day 1,001. Comprehensive management of fitness and wellness facilities: operational oversight, staff training, program development, and quality governance.",
    image: "/images/colonnade-spa.jpg",
  },
  {
    num: "07",
    cat: "PRECISION",
    title: "PROJECT SUPERVISION",
    desc: "Our project managers work alongside architects, contractors, and stakeholders to ensure every milestone lands on time, within budget, and without compromise to the original vision.",
    image: "/images/spa-lounge.jpg",
  },
  {
    num: "08",
    cat: "GROWTH",
    title: "BUSINESS CONSULTING",
    desc: "For operators seeking to elevate performance, we evaluate existing processes, create strategic roadmaps, and provide sustained advisory support to keep your wellness business at its ceiling.",
    image: "/images/honeycomb-facade.jpg",
  },
];

/* ── Hero ─────────────────────────────────────────────────────────────── */
function HeroSection() {
  const s = useRef<HTMLDivElement>(null);
  const t = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(t.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="relative w-full h-[55vh] md:h-[65vh] flex items-end overflow-hidden">
      <img src="/images/marble-gold.jpg" alt="Services" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />
      <div ref={t} className="relative z-10 px-6 md:px-16 pb-12 md:pb-20 opacity-0">
        <p className="text-[9px] tracking-[0.5em] text-olive mb-4">VELORA — SERVICES</p>
        <h1 className="text-[24px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-light leading-[0.9] tracking-[0.05em]">
          EVERY DISCIPLINE.<br />ONE STANDARD.
        </h1>
      </div>
    </section>
  );
}

/* ── Services Explorer ────────────────────────────────────────────────── */
function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const [open, setOpen]     = useState<number | null>(0);

  return (
    <>
      {/* ── Desktop: list + sticky image panel ── */}
      <section className="hidden md:flex w-full bg-carbon">

        {/* Left — numbered list */}
        <div className="w-[40%] border-r border-white/5 flex flex-col py-14 px-10 lg:px-16">
          <p className="text-[8px] tracking-[0.4em] text-white/20 mb-8">08 DISCIPLINES</p>

          {services.map((svc, i) => (
            <button
              key={svc.num}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className={`group w-full text-left py-[18px] border-b border-white/5 transition-all duration-300 ${
                active === i ? "opacity-100" : "opacity-30 hover:opacity-60"
              }`}
            >
              <div className="flex items-center gap-5">
                <span className={`text-[8px] tracking-[0.3em] w-5 flex-shrink-0 transition-colors duration-300 ${
                  active === i ? "text-olive" : "text-white/20"
                }`}>
                  {svc.num}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[7px] tracking-[0.38em] text-white/25 mb-[5px]">{svc.cat}</p>
                  <h3 className={`text-[13px] lg:text-[15px] font-light tracking-[0.03em] leading-tight transition-colors duration-300 ${
                    active === i ? "text-white" : "text-white/60"
                  }`}>
                    {svc.title}
                  </h3>
                </div>
                <motion.span
                  className="text-olive text-[11px] flex-shrink-0"
                  animate={{ opacity: active === i ? 1 : 0, x: active === i ? 0 : -8 }}
                  transition={{ duration: 0.25 }}
                >
                  →
                </motion.span>
              </div>
            </button>
          ))}

          <div className="mt-10 pt-8 border-t border-white/5">
            <Link
              href="/contact"
              className="text-[10px] tracking-[0.2em] text-white/35 hover:text-olive transition-colors duration-500 border-b border-white/10 pb-1 hover:border-olive"
            >
              BEGIN A PROJECT →
            </Link>
          </div>
        </div>

        {/* Right — sticky preview */}
        <div className="w-[60%] sticky top-0 h-screen">
          <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <img
                src={services[active].image}
                alt={services[active].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Base dark overlay */}
              <div className="absolute inset-0 bg-black/55" />
              {/* Gradient for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-10 lg:p-16">
                <motion.p
                  key={`cat-${active}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="text-[8px] tracking-[0.5em] text-olive mb-3"
                >
                  {services[active].cat}
                </motion.p>
                <motion.h2
                  key={`title-${active}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.16 }}
                  className="text-[26px] lg:text-[34px] font-light tracking-[0.04em] leading-[1.1] mb-5"
                >
                  {services[active].title}
                </motion.h2>
                <motion.p
                  key={`desc-${active}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.24 }}
                  className="text-[12px] lg:text-[13px] font-light leading-[1.85] text-white/60 max-w-[500px]"
                >
                  {services[active].desc}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Mobile: accordion ── */}
      <section className="md:hidden w-full bg-carbon py-10 px-6">
        <p className="text-[8px] tracking-[0.4em] text-white/20 mb-6">08 DISCIPLINES</p>
        <div className="divide-y divide-white/5">
          {services.map((svc, i) => (
            <div key={svc.num}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-5 flex items-center gap-4"
              >
                <span className="text-[8px] tracking-[0.3em] text-olive/50 w-5 flex-shrink-0">{svc.num}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[7px] tracking-[0.35em] text-white/25 mb-1">{svc.cat}</p>
                  <h3 className="text-[14px] font-light tracking-[0.02em] leading-tight">{svc.title}</h3>
                </div>
                <span className={`text-[14px] text-white/30 flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-7 pl-9">
                      <div className="w-full aspect-[16/9] overflow-hidden mb-5">
                        <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[12px] font-light leading-[1.85] text-white/55">{svc.desc}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-white/5">
          <Link href="/contact" className="text-[10px] tracking-[0.2em] text-white/40 hover:text-olive transition-colors duration-500 border-b border-white/10 pb-1 hover:border-olive">
            BEGIN A PROJECT →
          </Link>
        </div>
      </section>
    </>
  );
}

export default function Services() {
  return (
    <>
      <HeroSection />
      <ServicesExplorer />
    </>
  );
}
