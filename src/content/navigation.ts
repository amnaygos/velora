import type { NavItem } from "@/types/content";

export const mainNav: NavItem[] = [
  { label: "ABOUT", href: "/about", transitionLabel: "VELORA — ABOUT" },
  { label: "SERVICES", href: "/services", transitionLabel: "VELORA — SERVICES" },
  {
    label: "CONSULTANCY",
    href: "/consultancy",
    transitionLabel: "VELORA — CONSULTANCY",
  },
  { label: "PORTFOLIO", href: "/portfolio", transitionLabel: "VELORA — PORTFOLIO" },
  {
    label: "THE VELORA STANDARD",
    href: "/the-velora-standard",
    transitionLabel: "VELORA — THE VELORA STANDARD",
  },
];

export const enquireNav: NavItem = {
  label: "ENQUIRE",
  href: "/contact",
  transitionLabel: "VELORA — CONTACT",
};

export const homeNav: NavItem = {
  label: "VELORA",
  href: "/",
  transitionLabel: "VELORA",
};

export const mobileNav: NavItem[] = [
  ...mainNav,
  { label: "CONTACT", href: "/contact", transitionLabel: "VELORA — CONTACT" },
];

export const footerNav: NavItem[] = mobileNav;
