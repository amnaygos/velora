"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  const s = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(c.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out" });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="relative w-full h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
      <img src="/images/marble-gold.jpg" alt="Standard" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div ref={c} className="relative z-10 text-center px-6 opacity-0">
        <h1 className="text-[24px] sm:text-[32px] md:text-[44px] lg:text-[56px] font-light leading-[0.9] tracking-[0.05em]">THE VELORA<br />STANDARD</h1>
        <p className="text-[12px] md:text-[14px] font-light tracking-[0.15em] text-white/60 mt-8">Intelligence for those who refuse to compromise.</p>
      </div>
    </section>
  );
}

const cards = [
  { title: "THE VELORA BLUEPRINT", desc: "A complete guide to planning world-class wellness spaces. For developers, hoteliers, and architects.", cta: "DOWNLOAD FREE", action: "download" },
  { title: "SPACE ASSESSMENT", desc: "Discover the right wellness vision for your project in 5 minutes.", cta: "TAKE THE QUIZ", action: "quiz" },
  { title: "THE VELORA EDIT", desc: "Monthly curation of the world's finest wellness design — delivered to your inbox.", cta: "SUBSCRIBE", action: "subscribe" },
];

function HubCards() {
  const s = useRef<HTMLDivElement>(null);
  const c = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    const ctx = gsap.context(() => {
      c.current.forEach((cd, i) => {
        if (!cd) return;
        gsap.fromTo(cd, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.2, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 70%" } });
      });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={s} className="w-full bg-carbon py-[80px] md:py-[120px] px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {cards.map((cd, i) => (
          <div key={cd.title} ref={(el) => { c.current[i] = el; }} className="group bg-shadow p-8 md:p-10 flex flex-col opacity-0 hover:bg-shadow/80 transition-all duration-500 border border-white/5 hover:border-olive/20">
            <h3 className="text-[13px] md:text-[14px] font-medium tracking-[0.15em] mb-4">{cd.title}</h3>
            <p className="text-[12px] md:text-[13px] font-light leading-[1.7] tracking-[0.02em] text-white/60 flex-grow mb-8">{cd.desc}</p>
            <button
              onClick={() => scrollTo(cd.action === "download" ? "blueprint" : cd.action === "quiz" ? "quiz" : "newsletter")}
              className="self-start text-[10px] font-medium tracking-[0.15em] text-olive border-b border-olive/50 pb-1 hover:border-olive transition-colors duration-500"
            >
              {cd.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlueprintSection() {
  const s = useRef<HTMLDivElement>(null);
  const l = useRef<HTMLDivElement>(null);
  const r = useRef<HTMLDivElement>(null);
  const [blueprintSubmitted, setBlueprintSubmitted] = useState(false);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(l.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 80%" } });
      gsap.fromTo(r.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 80%" } });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section id="blueprint" ref={s} className="w-full bg-carbon flex flex-col md:flex-row min-h-[600px] md:min-h-[700px]">
      <div ref={l} className="hidden md:block w-1/2 relative opacity-0"><img src="/images/colonnade-spa.jpg" alt="Blueprint" className="absolute inset-0 w-full h-full object-cover" /></div>
      <div ref={r} className="w-full md:w-1/2 bg-shadow flex items-center justify-center px-8 md:px-16 py-16 md:py-0 opacity-0">
        <div className="max-w-[480px] w-full">
          <h2 className="text-[32px] md:text-[42px] font-light leading-[1.0] tracking-[0.04em]">THE VELORA<br />WELLNESS BLUEPRINT</h2>
          <p className="text-[12px] md:text-[13px] font-light leading-[1.8] tracking-[0.02em] text-olive mt-4">Complimentary. Confidential. Comprehensive.</p>
          <p className="text-[12px] md:text-[13px] font-light leading-[1.8] tracking-[0.02em] text-white/60 mt-6">Developed from 100+ completed projects across 50,000 SQM of elite wellness spaces, this guide provides the frameworks, standards, and spatial intelligence behind VELORA&apos;s work.</p>
          <div className="mt-8">
            <p className="text-[10px] font-medium tracking-[0.15em] text-white/70 mb-4">INSIDE THIS GUIDE:</p>
            <ul className="space-y-2">
              {["Wellness space planning principles", "Equipment selection frameworks", "Design language and material standards", "The VELORA operational model", "Hospitality wellness benchmarks"].map((item) => (
                <li key={item} className="text-[11px] md:text-[12px] font-light tracking-[0.02em] text-white/50">— {item}</li>
              ))}
            </ul>
          </div>
          <p className="text-[10px] font-medium tracking-[0.1em] text-white/40 mt-8">FOR: Developers · Hotel Groups · Architects · Private Residences · Wellness Operators</p>
          {blueprintSubmitted ? (
            <div className="mt-10 py-8 border border-white/10 px-6 text-center">
              <p className="text-[11px] tracking-[0.15em] text-olive mb-2">REQUEST RECEIVED</p>
              <p className="text-[13px] font-light text-white/70">Your Wellness Blueprint will be sent to your inbox within one business hour.</p>
            </div>
          ) : (
            <form className="mt-10 space-y-5" onSubmit={(e) => { e.preventDefault(); setBlueprintSubmitted(true); }}>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name *" className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
                <input type="text" placeholder="Last Name *" className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
              </div>
              <input type="email" placeholder="Email Address *" className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
              <input type="text" placeholder="Company or Project Name" className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
              <select className="w-full bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white/30 focus:outline-none focus:border-olive transition-colors duration-500 appearance-none cursor-pointer">
                <option value="" className="bg-shadow">I represent...</option>
                {["Developer", "Hotel Group", "Architecture Firm", "Private Residence", "Wellness Operator", "Other"].map((o) => <option key={o} value={o.toLowerCase().replace(/ /g, "-")} className="bg-shadow text-white">{o}</option>)}
              </select>
              <button type="submit" className="btn-primary mt-6">REQUEST YOUR COPY &rarr;</button>
            </form>
          )}
          <p className="text-[10px] font-light tracking-[0.05em] text-white/30 mt-6">Your details remain private. We&apos;ll email your copy within one business hour.</p>
        </div>
      </div>
    </section>
  );
}

function QuizSection() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const s = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  const questions = [
    { q: "What type of project are you planning?", options: ["A hotel or resort wellness facility", "A commercial gym or fitness studio", "A private residential space", "A corporate wellness environment", "A food, beverage, or lifestyle concept", "I'm not sure yet"] },
    { q: "How would you describe the vision?", options: ["Serene — deep calm and restoration", "Dynamic — energy, movement, performance", "Holistic — both, seamlessly integrated", "Distinctive — something no one has seen"] },
    { q: "What is your approximate project scale?", options: ["Under 500 SQM", "500 – 2,000 SQM", "2,000 – 10,000 SQM", "10,000 SQM or more", "Still being defined"] },
  ];
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(c.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 70%" } });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section id="quiz" ref={s} className="w-full bg-shadow py-[80px] md:py-[120px] px-6 md:px-16">
      <div ref={c} className="max-w-[700px] mx-auto opacity-0">
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-[32px] md:text-[42px] font-light leading-[1.0] tracking-[0.04em]">DESIGN YOUR IDEAL<br />WELLNESS SPACE</h2>
            <p className="text-[13px] md:text-[14px] font-light leading-[1.8] text-white/60 mt-6">3 questions. 2 minutes.<br />A bespoke recommendation from our team.</p>
            <button onClick={() => setStep(1)} className="btn-primary mt-10">BEGIN &rarr;</button>
          </div>
        )}
        {step > 0 && step <= questions.length && (
          <div>
            <div className="w-full h-[2px] bg-white/10 mb-12"><div className="h-full bg-olive transition-all duration-500" style={{ width: `${(step / questions.length) * 100}%` }} /></div>
            <h3 className="text-[22px] md:text-[28px] font-light leading-[1.3] tracking-[0.03em] mb-8">{questions[step - 1].q}</h3>
            <div className="space-y-3">
              {questions[step - 1].options.map((opt) => (
                <button key={opt} onClick={() => setStep(step + 1)} className="w-full text-left px-6 py-4 border border-white/10 text-[12px] md:text-[13px] font-light tracking-[0.02em] text-white/70 hover:border-olive/50 hover:text-white hover:bg-white/5 transition-all duration-300">{opt}</button>
              ))}
            </div>
            {step > 1 && <button onClick={() => setStep(step - 1)} className="mt-6 text-[10px] font-normal tracking-[0.15em] text-white/40 hover:text-white transition-colors duration-300">&larr; BACK</button>}
          </div>
        )}
        {step > questions.length && !submitted && (
          <div className="text-center">
            <h3 className="text-[22px] md:text-[28px] font-light leading-[1.3] tracking-[0.03em] mb-4">YOUR VELORA PROFILE</h3>
            <p className="text-[13px] md:text-[14px] font-light leading-[1.8] text-white/60 mb-8">Based on your responses, VELORA&apos;s comprehensive consultation and design services are directly matched to your brief. The next step is a complimentary 30-minute discovery call with one of our principals.</p>
            <Link href="/contact" className="btn-primary">BOOK YOUR DISCOVERY CALL</Link>
            <p className="text-[11px] font-light text-white/40 mt-6 mb-4">Or leave your details and we&apos;ll reach out:</p>
            <form className="flex flex-col sm:flex-row items-center gap-4 max-w-[500px] mx-auto" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <input type="text" required placeholder="Name" className="flex-grow w-full sm:w-auto bg-transparent border-b border-white/20 pb-2 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
              <input type="email" required placeholder="Email" className="flex-grow w-full sm:w-auto bg-transparent border-b border-white/20 pb-2 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
              <button type="submit" className="text-[10px] font-medium tracking-[0.15em] text-olive border-b border-olive/50 pb-1 hover:border-olive transition-colors duration-500">SEND</button>
            </form>
          </div>
        )}
        {step > questions.length && submitted && (
          <div className="text-center">
            <h3 className="text-[22px] md:text-[28px] font-light leading-[1.3] tracking-[0.03em] mb-4">PROFILE SUBMITTED</h3>
            <p className="text-[13px] md:text-[14px] font-light leading-[1.8] text-white/60">
              Thank you. Your VELORA Profile has been received. Our team will be in touch within one business day.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function NewsletterSection() {
  const s = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(c.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: s.current, start: "top 70%" } });
    }, s);
    return () => ctx.revert();
  }, []);
  return (
    <section id="newsletter" ref={s} className="w-full bg-carbon py-[120px] md:py-[200px] px-6 md:px-16">
      <div ref={c} className="max-w-[600px] mx-auto text-center opacity-0">
        <h2 className="text-[32px] md:text-[42px] font-light leading-[1.0] tracking-[0.04em]">THE VELORA EDIT</h2>
        <p className="text-[13px] md:text-[14px] font-light leading-[1.8] tracking-[0.02em] text-white/60 mt-6">
          Curated intelligence from the world&apos;s most refined wellness environments.<br /><br />
          Architecture. Design. Operational excellence. Emerging standards. Private project spotlights.<br /><br />
          Delivered monthly. Read by those who build the spaces others aspire to.
        </p>
        {newsletterSubmitted ? (
          <div className="mt-12 py-6">
            <p className="text-[11px] tracking-[0.15em] text-olive mb-2">SUBSCRIBED</p>
            <p className="text-[13px] font-light text-white/70">You&apos;re on the list. The Velora Edit arrives monthly.</p>
          </div>
        ) : (
          <form className="mt-12 flex flex-col sm:flex-row items-center gap-4" onSubmit={(e) => { e.preventDefault(); setNewsletterSubmitted(true); }}>
            <input type="email" placeholder="Email Address" className="flex-grow w-full sm:w-auto bg-transparent border-b border-white/20 pb-3 text-[12px] tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none focus:border-olive transition-colors duration-500" />
            <button type="submit" className="btn-primary text-[10px] px-6 py-3 w-full sm:w-auto">SUBSCRIBE</button>
          </form>
        )}
        <p className="text-[10px] font-light tracking-[0.05em] text-white/30 mt-6">No noise. No promotions. Only what earns a place in your inbox.</p>
      </div>
    </section>
  );
}

export default function VeloraStandard() {
  return (<><HeroSection /><HubCards /><BlueprintSection /><QuizSection /><NewsletterSection /></>);
}
