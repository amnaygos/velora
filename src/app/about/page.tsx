"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  const s = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLDivElement>(null);
  const l2 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.9 });
      tl.fromTo(l1.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" })
        .fromTo(l2.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.6");
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="relative w-full h-[70vh] md:h-screen bg-carbon flex flex-col items-center justify-center overflow-hidden gap-10 md:gap-14">
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Animated full logo */}
      <motion.img
        src="/images/logo full velora.svg"
        alt="VELORA"
        initial={{ opacity: 0, scale: 0.88, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "clamp(200px, 32vw, 380px)",
          height: "auto",
          filter: "brightness(0) invert(1)",
        }}
      />

      {/* Divider */}
      <motion.div
        className="w-8 h-px bg-olive"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
        style={{ originX: 0 }}
      />

      {/* Title */}
      <div className="text-center px-6">
        <h1 className="text-[24px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-light leading-[0.9] tracking-[0.05em]">
          <div ref={l1} className="opacity-0">PIONEERING WELLNESS</div>
          <div ref={l2} className="opacity-0 mt-2">SINCE DAY ONE</div>
        </h1>
      </div>
    </section>
  );
}

function WhoWeAre() {
  const s = useRef<HTMLDivElement>(null);
  const t = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(t.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 70%" } });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-carbon py-[100px] md:py-[160px] px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="w-full md:w-2/5 flex items-start justify-center md:justify-start pt-4">
          <motion.svg
            viewBox="0 0 185.71 219.39"
            style={{ width: 200, height: "auto" }}
            fill="white"
            initial={{ opacity: 0, scale: 0.82, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Horizontal bar — pulses olive */}
            <motion.rect
              x="49.04" y="51.28" width="91.9" height="12.51"
              animate={{ fill: ["#ffffff", "#91928D", "#ffffff"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
            />
            {/* V chevron — breathes opacity */}
            <motion.polygon
              points="122.18 89.08 139.07 89.2 103.2 177.66 86.88 177.53 50.91 89.09 68.06 89.02 95.12 154.54 122.18 89.08"
              animate={{ opacity: [1, 0.55, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
            />
          </motion.svg>
        </div>
        <div ref={t} className="w-full md:w-3/5 opacity-0">
          <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-8">
            WELL-ESTABLISHED AND PIONEERING IN WELLNESS & LIFESTYLE
          </h3>
          <div className="space-y-6">
            <p className="text-[13px] md:text-[14px] font-light leading-[1.9] tracking-[0.02em] text-white/80">
              Welcome to VELORA, where wellness, lifestyle, and refined living come together to create a more elevated everyday experience.
            </p>
            <p className="text-[13px] md:text-[14px] font-light leading-[1.9] tracking-[0.02em] text-white/80">
              At VELORA, we are dedicated to elevating the health, wellness, and fitness experience within both commercial and residential settings. Our comprehensive approach integrates hospitality, consultation, management, architectural design, and setup — ensuring a seamless and holistic journey towards well-being and physical excellence.
            </p>
            <p className="text-[13px] md:text-[14px] font-light leading-[1.9] tracking-[0.02em] text-white/80">
              We do not bring a template to a project. We bring precision, vision, and the accumulated intelligence of over two decades designing spaces where people choose to live at their best.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { num: "01", title: "VISION", desc: "We begin with a deep understanding of what you want people to feel." },
  { num: "02", title: "DESIGN", desc: "Every spatial, material, and experiential choice is deliberate." },
  { num: "03", title: "BUILD", desc: "We supervise every stage of construction with the same care as the design phase." },
  { num: "04", title: "SUSTAIN", desc: "After delivery, we manage, refine, and elevate the facility over time." },
];

function ApproachSection() {
  const s = useRef<HTMLDivElement>(null);
  const st = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      st.current.forEach((stEl, i) => {
        if (!stEl) return;
        gsap.fromTo(stEl, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, delay: i * 0.15, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 70%" } });
      });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-shadow py-[100px] md:py-[160px] px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto">
        <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-16 md:mb-24 text-center">THE VELORA APPROACH</h3>
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-0 relative">
          {steps.map((stEl, i) => (
            <div key={stEl.num} className="flex items-center">
              <div ref={(el) => { st.current[i] = el; }} className="text-center md:px-8 lg:px-12 opacity-0">
                <div className="text-[48px] md:text-[64px] font-light text-olive/30 leading-none">{stEl.num}</div>
                <h4 className="text-[13px] md:text-[14px] font-medium tracking-[0.15em] mt-4">{stEl.title}</h4>
                <div className="w-6 h-[1px] bg-olive mx-auto mt-3" />
                <p className="text-[11px] md:text-[12px] font-light leading-[1.7] tracking-[0.02em] text-white/60 mt-4 max-w-[220px]">{stEl.desc}</p>
              </div>
              {i < steps.length - 1 && <div className="hidden md:block w-[60px] lg:w-[80px] h-[1px] bg-white/10 mt-[-40px]" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CredentialsBar() {
  const s = useRef<HTMLDivElement>(null);
  const stats = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      stats.current.forEach((st, i) => {
        if (!st) return;
        gsap.fromTo(st, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: i * 0.2, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 80%" } });
      });
    }, s);
    return () => ctx.revert();
  }, []);
  const data = [
    { num: "50,000", label: "SQM OF COMPLETED SPACES" },
    { num: "20+", label: "YEARS OF COLLECTIVE EXPERTISE" },
    { num: "100+", label: "PROJECTS AND AFFILIATE COLLABORATIONS" },
  ];
  return (
    <section ref={s} className="w-full bg-carbon py-16 md:py-24 px-6 md:px-16">
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

function PhilosophySection() {
  const s = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(r1.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: r1.current, start: "top 75%" } });
      gsap.fromTo(r2.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: r2.current, start: "top 75%" } });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-carbon py-[80px] md:py-[120px] px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto space-y-16 md:space-y-24">
        <div ref={r1} className="flex flex-col md:flex-row items-center gap-8 md:gap-16 opacity-0">
          <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden"><img src="/images/yoga-arch.jpg" alt="Yoga" className="w-full h-full object-cover" /></div>
          <div className="w-full md:w-1/2">
            <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-6">THE SPACE SHAPES THE PRACTICE</h3>
            <p className="text-[22px] md:text-[28px] font-light leading-[1.4] mb-6">Architecture is not a backdrop. It is the first instruction your body receives.</p>
            <p className="text-[13px] md:text-[14px] font-light leading-[1.8] tracking-[0.02em] text-white/60">We design environments that silently communicate what they are for — and how elevated that purpose is.</p>
          </div>
        </div>
        <div ref={r2} className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 opacity-0">
          <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden"><img src="/images/cedar-pool.jpg" alt="Pool" className="w-full h-full object-cover" /></div>
          <div className="w-full md:w-1/2">
            <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-6">LUXURY WITHOUT ANNOUNCEMENT</h3>
            <p className="text-[22px] md:text-[28px] font-light leading-[1.4] mb-6">The highest quality needs no display.</p>
            <p className="text-[13px] md:text-[14px] font-light leading-[1.8] tracking-[0.02em] text-white/60">It is felt in proportion, in material temperature, in the precise relationship between light and stillness. VELORA spaces do not perform luxury. They embody it.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  const s = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(c.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 70%" } });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-shadow py-[100px] md:py-[160px] px-6 md:px-16">
      <div ref={c} className="max-w-[1440px] mx-auto text-center opacity-0">
        <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-6">HAVE A PROJECT IN MIND?</h3>
        <Link href="/contact" className="btn-outline">BEGIN A CONVERSATION</Link>
      </div>
    </section>
  );
}

export default function About() {
  return (<><HeroSection /><WhoWeAre /><ApproachSection /><CredentialsBar /><PhilosophySection /><ContactCTA /></>);
}
