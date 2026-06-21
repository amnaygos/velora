"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "ABOUT", path: "/about" },
  { label: "SERVICES", path: "/services" },
  { label: "PORTFOLIO", path: "/portfolio" },
  { label: "THE VELORA STANDARD", path: "/the-velora-standard" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "bg-carbon/95 backdrop-blur-sm border-b border-gunmetal/50" : "bg-transparent"}`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-16 h-16 md:h-20">
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo full velora.svg"
              alt="VELORA"
              style={{ height: 30, width: "auto", filter: "brightness(0) invert(1)" }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}
                className={`text-[11px] font-normal tracking-[0.1em] relative group transition-colors duration-500 ${pathname === link.path ? "text-olive" : "text-white hover:text-olive"}`}>
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-olive transition-all duration-500 ${pathname === link.path ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </div>

          <Link href="/contact" className="hidden lg:block text-[11px] font-normal tracking-[0.1em] border-b border-white/30 pb-1 hover:border-olive hover:text-olive transition-all duration-500">
            ENQUIRE &rarr;
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
            <span className={`block w-5 h-[1px] bg-white transition-all duration-500 ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <span className={`block w-5 h-[1px] bg-white transition-all duration-500 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-[1px] bg-white transition-all duration-500 ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 bg-carbon transition-all duration-700 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-10">
          {navLinks.map((link, i) => (
            <Link key={link.path} href={link.path}
              className="text-2xl md:text-3xl font-light tracking-[0.1em] text-white hover:text-olive transition-colors duration-500"
              style={{ transitionDelay: menuOpen ? `${i * 80}ms` : "0ms", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="text-sm font-normal tracking-[0.1em] border-b border-white/30 pb-1 hover:border-olive hover:text-olive transition-all duration-500 mt-6"
            style={{ transitionDelay: menuOpen ? `${navLinks.length * 80}ms` : "0ms", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            ENQUIRE &rarr;
          </Link>
        </div>
      </div>
    </>
  );
}
