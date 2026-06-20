"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VeloraMap = dynamic(() => import("@/components/VeloraMap"), { ssr: false });

function HeroSection() {
  const s = useRef<HTMLDivElement>(null);
  const t = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(t.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center bg-carbon">
      <h1 ref={t} className="text-[24px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-light leading-[0.9] tracking-[0.05em] text-center opacity-0">
        BEGIN YOUR<br />JOURNEY
      </h1>
    </section>
  );
}

function ContactForm() {
  const s  = useRef<HTMLDivElement>(null);
  const l  = useRef<HTMLDivElement>(null);
  const r  = useRef<HTMLDivElement>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(l.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 70%" } });
      gsap.fromTo(r.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 70%" } });
    }, s);
    return () => ctx.revert();
  }, []);

  const pTypes = [
    "Private Gym or Fitness Studio",
    "Commercial Gym or Health Club",
    "Hotel Fitness Centre",
    "Residential Wellness Suite",
    "Spa & Recovery Centre",
    "Corporate Wellness Facility",
    "Other",
  ];

  const budgets = [
    "Under QAR 500,000",
    "QAR 500,000 – 2,000,000",
    "QAR 2,000,000 – 5,000,000",
    "QAR 5,000,000 +",
    "Not yet defined",
  ];

  const toggle = (type: string) =>
    setProjectTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  return (
    <section ref={s} className="w-full bg-carbon py-[80px] md:py-[120px] px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-16 md:gap-20">

        {/* Left — contact info */}
        <div ref={l} className="w-full md:w-2/5 opacity-0">
          <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-10">ENQUIRIES</h3>
          <div className="space-y-8">
            <div>
              <p className="text-[12px] font-light tracking-[0.05em] text-white/40 mb-1">Email</p>
              <a href="mailto:hello@velora.qa" className="text-[14px] font-light tracking-[0.02em] text-white hover:text-olive transition-colors duration-500">
                hello@velora.qa
              </a>
            </div>
            <div>
              <p className="text-[12px] font-light tracking-[0.05em] text-white/40 mb-1">WhatsApp</p>
              <a href="https://wa.me/97412345678" className="text-[14px] font-light tracking-[0.02em] text-white hover:text-olive transition-colors duration-500">
                +974 1234 5678
              </a>
            </div>
            <div>
              <p className="text-[12px] font-light tracking-[0.05em] text-white/40 mb-2">Studio</p>
              <p className="text-[13px] font-light leading-[1.8] tracking-[0.02em] text-white/70">
                Safwa Building, Gate 20<br />
                Second Floor<br />
                Barwa Commercial Avenue<br />
                Doha, Qatar
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[12px] md:text-[13px] font-light leading-[1.8] tracking-[0.02em] text-white/50 mb-6">
              Every project begins with a conversation. A member of our principals team will review your message personally and respond within one business day.
            </p>
            <span className="text-[10px] font-medium tracking-[0.15em] text-olive border-b border-olive/50 pb-1 cursor-pointer hover:border-olive transition-colors duration-500">
              SCHEDULE A CALL &rarr;
            </span>
          </div>
        </div>

        {/* Right — form */}
        <div ref={r} className="w-full md:w-3/5 opacity-0">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-normal tracking-[0.15em] text-white/50 mb-2 block">Full Name *</label>
                <input type="text" required className="w-full bg-transparent border-b border-white/20 pb-3 text-[13px] tracking-[0.02em] text-white placeholder:text-white/20 focus:outline-none focus:border-olive transition-colors duration-500" placeholder="Your name" />
              </div>
              <div>
                <label className="text-[10px] font-normal tracking-[0.15em] text-white/50 mb-2 block">Email Address *</label>
                <input type="email" required className="w-full bg-transparent border-b border-white/20 pb-3 text-[13px] tracking-[0.02em] text-white placeholder:text-white/20 focus:outline-none focus:border-olive transition-colors duration-500" placeholder="your@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-normal tracking-[0.15em] text-white/50 mb-2 block">Phone Number</label>
                <input type="tel" className="w-full bg-transparent border-b border-white/20 pb-3 text-[13px] tracking-[0.02em] text-white placeholder:text-white/20 focus:outline-none focus:border-olive transition-colors duration-500" placeholder="+974" />
              </div>
              <div>
                <label className="text-[10px] font-normal tracking-[0.15em] text-white/50 mb-2 block">Company or Project Name</label>
                <input type="text" className="w-full bg-transparent border-b border-white/20 pb-3 text-[13px] tracking-[0.02em] text-white placeholder:text-white/20 focus:outline-none focus:border-olive transition-colors duration-500" placeholder="Company name" />
              </div>
            </div>

            {/* Project type */}
            <div>
              <label className="text-[10px] font-normal tracking-[0.15em] text-white/50 mb-4 block">Project Type *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pTypes.map((type) => (
                  <label
                    key={type}
                    onClick={() => toggle(type)}
                    className={`flex items-center gap-3 p-3 border cursor-pointer transition-all duration-300 ${
                      projectTypes.includes(type) ? "border-olive/50 bg-olive/5" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-3 h-3 border flex-shrink-0 transition-all duration-300 ${
                      projectTypes.includes(type) ? "bg-olive border-olive" : "border-white/30"
                    }`} />
                    <span className="text-[11px] font-light tracking-[0.02em] text-white/70">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="text-[10px] font-normal tracking-[0.15em] text-white/50 mb-3 block">Approximate Budget Range</label>
              <select className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white/50 focus:outline-none focus:border-olive transition-colors duration-500 appearance-none cursor-pointer">
                <option value="" className="bg-shadow text-white">Select budget range...</option>
                {budgets.map((b) => <option key={b} value={b} className="bg-shadow text-white">{b}</option>)}
              </select>
            </div>

            {/* Referral */}
            <div>
              <label className="text-[10px] font-normal tracking-[0.15em] text-white/50 mb-3 block">How did you hear about VELORA?</label>
              <div className="flex flex-wrap gap-4">
                {["Referral", "Instagram", "LinkedIn", "Direct Search", "Other"].map((source) => (
                  <label key={source} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="source" className="accent-olive" />
                    <span className="text-[11px] font-light tracking-[0.02em] text-white/60">{source}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vision */}
            <div>
              <label className="text-[10px] font-normal tracking-[0.15em] text-white/50 mb-2 block">Tell us about your vision *</label>
              <textarea required rows={5} className="w-full bg-transparent border border-white/10 p-4 text-[13px] tracking-[0.02em] text-white placeholder:text-white/20 focus:outline-none focus:border-olive transition-colors duration-500 resize-none" placeholder="Describe your space, your goals, and what excellence means to you." />
            </div>

            <button type="submit" className="btn-primary">SEND YOUR ENQUIRY &rarr;</button>
            <p className="text-[10px] font-light tracking-[0.05em] text-white/30">
              Your enquiry goes directly to our principals. We do not use intake teams or automated responses.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  const s = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(s.current, { opacity: 0 }, {
        opacity: 1, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: s.current, start: "top 80%" },
      });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-carbon px-6 md:px-16 pb-[80px] md:pb-[120px] opacity-0">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-5 h-px bg-olive" />
          <span className="text-[9px] tracking-[0.45em] text-white/30">FIND US</span>
        </div>
        <div className="w-full h-[380px] md:h-[460px] overflow-hidden" style={{ filter: "brightness(1.55) contrast(0.95)" }}>
          <VeloraMap />
        </div>
        <p className="text-[10px] tracking-[0.05em] text-white/25 mt-4">
          Safwa Building, Gate 20 — Second Floor — Barwa Commercial Avenue, Doha, Qatar
        </p>
      </div>
    </section>
  );
}

function AlternativeCTA() {
  const s = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(c.current, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: s.current, start: "top 80%" },
      });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-shadow py-[80px] md:py-[100px] px-6 md:px-16">
      <div ref={c} className="max-w-[1440px] mx-auto text-center opacity-0">
        <h3 className="text-[11px] font-normal tracking-[0.2em] text-white/50 mb-4">PREFER TO SPEAK FIRST?</h3>
        <p className="text-[13px] md:text-[14px] font-light leading-[1.8] text-white/60 mb-8">
          Book a complimentary 30-minute discovery call.<br />No preparation required. No obligation.
        </p>
        <span className="btn-outline cursor-pointer">SCHEDULE A CALL &rarr;</span>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <>
      <HeroSection />
      <ContactForm />
      <MapSection />
      <AlternativeCTA />
    </>
  );
}
