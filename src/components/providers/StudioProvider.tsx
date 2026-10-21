"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CredentialStat, SocialLink } from "@/types/content";

/** The studio's public details, as set in /admin/website. */
export type Studio = {
  email: string | null;
  address: string[];
  socials: SocialLink[];
  figures: CredentialStat[];
};

const StudioContext = createContext<Studio>({ email: null, address: [], socials: [], figures: [] });

/** Read once on the server by the public layout and shared with every client component. */
export function StudioProvider({ value, children }: { value: Studio; children: ReactNode }) {
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): Studio {
  return useContext(StudioContext);
}
