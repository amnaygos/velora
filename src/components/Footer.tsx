import Link from "next/link";

const footerLinks = [
  { label: "ABOUT", path: "/about" },
  { label: "SERVICES", path: "/services" },
  { label: "PORTFOLIO", path: "/portfolio" },
  { label: "CONTACT", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-gunmetal/50 bg-carbon">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 h-20 md:h-24 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <img
            src="/images/logo full velora.svg"
            alt="VELORA"
            style={{ height: 22, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.5 }}
          />
          <p className="text-[9px] font-normal tracking-[0.12em] text-white/30">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {footerLinks.map((link) => (
            <Link key={link.path} href={link.path} className="text-[10px] font-normal tracking-[0.15em] text-white/50 hover:text-olive transition-colors duration-500">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {["instagram", "linkedin", "whatsapp"].map((social) => (
            <a key={social} href="#" onClick={(e) => e.preventDefault()} className="text-white/50 hover:text-olive transition-colors duration-500" aria-label={social}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {social === "instagram" && (<><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>)}
                {social === "linkedin" && (<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>)}
                {social === "whatsapp" && (<><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" /><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1z" /></>)}
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
