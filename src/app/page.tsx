"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* ─── Hero ─── */
function HeroSection() {
  const s = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLDivElement>(null);
  const l2 = useRef<HTMLDivElement>(null);
  const si = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 1.1 });
      tl.fromTo(l1.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" })
        .fromTo(l2.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.6")
        .fromTo(si.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.2");
    }, s);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const play = () => video.play().catch(() => {});
    if (video.readyState >= 2) {
      play();
    } else {
      video.addEventListener("loadeddata", play, { once: true });
      return () => video.removeEventListener("loadeddata", play);
    }
  }, []);

  return (
    <section ref={s} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src="/Video/hero.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        onEnded={(e) => e.currentTarget.pause()}
      />
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          className="mb-8 md:mb-12 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01, delay: 0.4 }}
        >
          <motion.img
            src="/images/logo full velora.svg"
            alt="VELORA"
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.9 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "clamp(90px, 13vw, 160px)", height: "auto", filter: "brightness(0) invert(1)", display: "block" }}
          />
        </motion.div>
        <h1 className="text-[24px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-light leading-[0.9] tracking-[0.05em]">
          <div ref={l1} className="opacity-0">WHERE WELLNESS</div>
          <div ref={l2} className="opacity-0">MEETS WONDER</div>
        </h1>
        <div ref={si} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0">
          <div className="w-[1px] h-10 bg-white/30" />
          <span className="text-[9px] tracking-[0.3em] text-white/40">SCROLL</span>
        </div>
      </div>
    </section>
  );
}

/* ─── Manifesto ─── */
function ManifestoSection() {
  const s = useRef<HTMLDivElement>(null);
  const t = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(t.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: s.current, start: "top 70%", toggleActions: "play none none none" }
      });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-shadow py-[120px] md:py-[200px] px-6 md:px-16">
      <div className="max-w-[680px] mx-auto text-center">
        <p ref={t} className="text-[18px] sm:text-[22px] md:text-[26px] font-light leading-[1.6] tracking-[0.04em] opacity-0">
          VELORA exists because most wellness spaces feel like afterthoughts. We replace the generic with the intentional — environments where every material, proportion, and sightline has been considered before the first wall is drawn.
          <br /><br />
          We do not build gyms. We craft environments that change how people feel about where they live and how they move.
        </p>
      </div>
    </section>
  );
}

/* ─── Services Grid ─── */
const services = [
  { title: "CONSULTATION", desc: "We identify your vision and map every path to it.", image: "/images/yoga-studio.jpg" },
  { title: "ARCHITECTURAL DESIGN", desc: "Form and function as a single language.", image: "/images/glass-tower.jpg" },
  { title: "COMMERCIAL & RESIDENTIAL", desc: "Bespoke wellness, built for how you live and work.", image: "/images/dark-gym.jpg" },
  { title: "HOSPITALITY WELLNESS", desc: "Redefining what guests expect from a space.", image: "/images/spa-lounge.jpg" },
  { title: "EQUIPMENT & SUPPLY", desc: "Exclusive. Crafted. Delivered with precision.", image: "/images/eq.png" },
  { title: "OPERATIONS & MANAGEMENT", desc: "Your facility. Held to the highest standard.", image: "/images/colonnade-spa.jpg" },
];

function ServicesGrid() {
  const s = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      tiles.current.forEach((tile, i) => {
        if (!tile) return;
        gsap.fromTo(tile, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 0.7, delay: i * 0.06, ease: "power2.out",
          scrollTrigger: { trigger: s.current, start: "top 85%", toggleActions: "play none none none" }
        });
      });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-carbon py-[80px] md:py-[120px] px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((svc, i) => (
            <Link key={svc.title} href="/services" aria-label={svc.title}>
              <div ref={(el) => { tiles.current[i] = el; }} className="group relative aspect-[4/5] overflow-hidden cursor-pointer opacity-0">
                <img src={svc.image} alt={svc.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-[13px] md:text-[14px] font-medium tracking-[0.15em]">{svc.title}</h3>
                  <div className="h-[1px] w-0 bg-olive mt-3 transition-all duration-500 group-hover:w-16" />
                  <p className="text-[11px] md:text-[12px] font-light tracking-[0.05em] text-white/70 mt-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {svc.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Credentials ─── */
function CredentialsBar() {
  const s = useRef<HTMLDivElement>(null);
  const stats = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      stats.current.forEach((st, i) => {
        if (!st) return;
        gsap.fromTo(st, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.8, delay: i * 0.2, ease: "power2.out",
          scrollTrigger: { trigger: s.current, start: "top 80%", toggleActions: "play none none none" }
        });
      });
    }, s);
    return () => ctx.revert();
  }, []);
  const data = [
    { num: "50,000", label: "SQM OF COMPLETED SPACES" },
    { num: "20+", label: "YEARS OF DELIVERING EXCELLENCE" },
    { num: "100+", label: "PROJECTS DELIVERED" },
  ];
  return (
    <section ref={s} className="w-full bg-shadow py-16 md:py-24 px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-10 md:gap-0">
            <div ref={(el) => { stats.current[i] = el; }} className="text-center md:px-12 lg:px-20 opacity-0">
              <div className="text-[36px] md:text-[48px] lg:text-[56px] font-light tracking-[0.04em] text-olive">{d.num}</div>
              <div className="text-[9px] md:text-[10px] font-normal tracking-[0.2em] text-white/50 mt-2">{d.label}</div>
            </div>
            {i < data.length - 1 && <div className="hidden md:block w-[1px] h-16 bg-white/10" />}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Featured Portfolio ─── */
const portfolioGrid = [
  { src: "/Portfolio/BigroomGym-A.png", name: "GRAND TRAINING HALL", cat: "GYMS & FITNESS", num: "01", slug: "grand-training-hall" },
  { src: "/Portfolio/pool-A.png",       name: "NIGHTFALL LAP POOL",  cat: "SPA & WELLNESS", num: "02", slug: "nightfall-lap-pool" },
  { src: "/Portfolio/small yoga room-A.png", name: "THE YOGA ALCOVE", cat: "SPA & WELLNESS", num: "03", slug: "the-yoga-alcove" },
];

function FeaturedPortfolio() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const gridInView   = useInView(gridRef,   { once: true, amount: 0.05 });
  const ctaInView    = useInView(ctaRef,    { once: true, amount: 0.5 });

  return (
    <section className="w-full bg-carbon">

      {/* Header */}
      <motion.div
        ref={headerRef}
        className="px-6 md:px-16 pt-[80px] md:pt-[110px] pb-10 md:pb-14"
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-3">SELECTED WORK</h3>
        <div className="w-8 h-[1px] bg-olive" />
        <p className="text-[16px] md:text-[20px] font-light leading-[1.6] text-white/70 mt-6 max-w-[500px]">
          Clarity of vision. Certainty of execution.
        </p>
      </motion.div>

      {/* Full-width 3-column grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3">
        {portfolioGrid.map((item, i) => (
          <Link
            key={item.name}
            href={"/portfolio/" + item.slug}
            className="group relative overflow-hidden block"
            style={{ height: "68vh" }}
          >
            {/* Image: clip-reveal from bottom + simultaneous zoom-out */}
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={gridInView
                ? { clipPath: "inset(0 0 0% 0)" }
                : { clipPath: "inset(0 0 100% 0)" }
              }
              transition={{ duration: 1.25, delay: i * 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="w-full h-full"
                initial={{ scale: 1.16 }}
                animate={gridInView ? { scale: 1.0 } : { scale: 1.16 }}
                transition={{ duration: 2.0, delay: i * 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
                    i > 0 ? "grayscale group-hover:grayscale-0 transition-[filter,transform]" : ""
                  }`}
                />
              </motion.div>
            </motion.div>

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />

            {/* Top-right index */}
            <motion.div
              className="absolute top-5 right-5 md:top-7 md:right-7 text-[9px] tracking-[0.25em] text-white/20 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={gridInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + i * 0.22 }}
            >
              {item.num}
            </motion.div>

            {/* Bottom label */}
            <motion.div
              className="absolute bottom-0 left-0 p-6 md:p-8 z-10"
              initial={{ opacity: 0, y: 28 }}
              animate={gridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.75, delay: 0.75 + i * 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[8px] tracking-[0.45em] text-olive mb-2">{item.cat}</p>
              <h4 className="text-[14px] md:text-[18px] font-light tracking-[0.04em] leading-tight">
                {item.name}
              </h4>
            </motion.div>

            {/* Hover border line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-olive scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
          </Link>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        ref={ctaRef}
        className="px-6 md:px-16 py-10 md:py-14 text-center"
        initial={{ opacity: 0 }}
        animate={ctaInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/portfolio"
          className="text-[11px] font-normal tracking-[0.15em] text-white/70 hover:text-olive transition-colors duration-500 border-b border-white/20 pb-1 hover:border-olive"
        >
          VIEW ALL WORK &rarr;
        </Link>
      </motion.div>
    </section>
  );
}

/* ─── Lead Magnet ─── */
function LeadMagnetSection() {
  const s = useRef<HTMLDivElement>(null);
  const l = useRef<HTMLDivElement>(null);
  const r = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(l.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 80%" } });
      gsap.fromTo(r.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 80%" } });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-carbon flex flex-col md:flex-row min-h-[600px] md:min-h-[700px]">
      <div ref={l} className="hidden md:block w-1/2 relative opacity-0">
        <img src="/images/yoga.png" alt="Blueprint" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div ref={r} className="w-full md:w-1/2 bg-shadow flex items-center justify-center px-8 md:px-16 py-16 md:py-0 opacity-0">
        <div className="max-w-[440px] w-full">
          <h2 className="text-[32px] md:text-[42px] font-light leading-[1.0] tracking-[0.04em]">
            REDEFINE<br />YOUR SPACE
          </h2>
          <p className="text-[13px] md:text-[14px] font-light leading-[1.8] tracking-[0.02em] text-white/70 mt-6">
            Download The Velora Wellness Blueprint — our complimentary guide for developers, hoteliers, and visionaries planning world-class wellness environments.
          </p>
          <p className="text-[12px] font-light leading-[1.8] text-white/50 mt-4">
            Inside: space planning principles, equipment standards, design language frameworks, and the operational model behind 100+ elite projects.
          </p>
          <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="First Name" className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
            <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
            <select className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white/30 focus:outline-none focus:border-olive transition-colors duration-500 appearance-none cursor-pointer">
              <option value="" className="bg-shadow">I am a...</option>
              <option value="developer" className="bg-shadow text-white">Developer</option>
              <option value="hotel" className="bg-shadow text-white">Hotel Group</option>
              <option value="architect" className="bg-shadow text-white">Architect</option>
              <option value="private" className="bg-shadow text-white">Private Residence</option>
              <option value="other" className="bg-shadow text-white">Other</option>
            </select>
            <button type="submit" className="btn-primary mt-6">REQUEST YOUR COPY &rarr;</button>
          </form>
          <p className="text-[10px] font-light tracking-[0.05em] text-white/30 mt-6">
            Your details remain private. We will send a download link and may follow up with one personal email from our team.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Divider Quote ─── */
function DividerQuote() {
  const s = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      lines.current.forEach((ln, i) => {
        if (!ln) return;
        gsap.fromTo(ln, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, delay: i * 0.2, ease: "power2.out",
          scrollTrigger: { trigger: s.current, start: "top 60%", toggleActions: "play none none none" }
        });
      });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-carbon py-[80px] md:py-[120px] lg:py-[160px] px-6 md:px-16 flex items-center justify-center">
      <div className="text-center">
        <div ref={(el) => { lines.current[0] = el; }} className="text-[28px] sm:text-[44px] md:text-[72px] lg:text-[96px] font-light leading-[1.0] tracking-[0.06em] opacity-0">
          &ldquo;THEY DIDN&apos;T DESIGN A GYM.
        </div>
        <div ref={(el) => { lines.current[1] = el; }} className="text-[28px] sm:text-[44px] md:text-[72px] lg:text-[96px] font-light leading-[1.0] tracking-[0.06em] text-olive mt-2 md:mt-4 opacity-0">
          THEY DESIGNED THE REASON I WAKE UP AT 5:30.&rdquo;
        </div>
        <div ref={(el) => { lines.current[2] = el; }} className="text-[11px] font-normal tracking-[0.3em] text-white/40 mt-8 md:mt-12 opacity-0">
          — PRIVATE CLIENT, DOHA
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function ConsultationCTA() {
  const s = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(c.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
        scrollTrigger: { trigger: s.current, start: "top 70%", toggleActions: "play none none none" }
      });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-shadow py-[100px] md:py-[160px] px-6 md:px-16">
      <div ref={c} className="max-w-[1440px] mx-auto text-center opacity-0">
        <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-6">READY TO BEGIN?</h3>
        <p className="text-[16px] md:text-[22px] font-light leading-[1.6] text-white/70 max-w-[500px] mx-auto mb-12">
          Your vision deserves an environment equal to it.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link href="/contact" className="btn-outline">REQUEST A CONSULTATION</Link>
          <Link href="/portfolio" className="text-[11px] font-medium tracking-[0.15em] border-b border-white/20 pb-1 hover:border-olive hover:text-olive transition-all duration-500">
            VIEW OUR WORK
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <>
      <HeroSection />
      <ManifestoSection />
      <ServicesGrid />
      <CredentialsBar />
      <FeaturedPortfolio />
      <LeadMagnetSection />
      <DividerQuote />
      <ConsultationCTA />
    </>
  );
}
