"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Navbar";
import Footer from "./Footer";
import VeloraChat from "./VeloraChat";

gsap.registerPlugin(ScrollTrigger);

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-carbon text-white overflow-x-hidden">
      <Navbar />
      <main ref={mainRef}>{children}</main>
      <Footer />
      <VeloraChat />
    </div>
  );
}
