import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { SITE_SETTINGS_TAG } from "@/lib/siteSettings";
import type { Project, ProjectCategory } from "@/types/project";
import type { Testimonial } from "@/types/content";
import type { PortfolioItem, StudioDetails, TestimonialRow } from "@/types/database";

/**
 * What the public website shows, read from Supabase. Every read is cached and
 * tagged; the admin's actions expire the tag, so an edit is live on the next
 * request. A failed read throws inside the cache (so it is never cached) and
 * the exported getters fall back to "nothing to show".
 */
export const PORTFOLIO_TAG = "portfolio";
export const TESTIMONIALS_TAG = "testimonials";

/** Cookie-less anon client: published content is public, and a cached scope can't read cookies. */
function anonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  return createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** A published case study as the site's components expect it. */
function toProject(row: PortfolioItem): Project | null {
  const hero = row.hero_media || row.after_media;
  if (!hero) return null; // nothing to put on the card
  return {
    slug: row.slug,
    title: row.name,
    category: row.category as ProjectCategory,
    location: row.location ?? "",
    year: row.year ?? "",
    area: row.area ?? undefined,
    delivery: row.delivery ?? undefined,
    services: row.services ?? [],
    description: row.description ?? "",
    brief: row.brief ?? "",
    response: row.response ?? "",
    outcome: row.outcome ?? "",
    metrics: row.metrics?.length ? row.metrics : undefined,
    heroMedia: hero,
    gallery: row.gallery ?? [],
    transformation:
      row.before_media && row.after_media
        ? { before: row.before_media, after: row.after_media, condition: row.before_condition ?? "" }
        : undefined,
    featured: row.featured,
  };
}

const readProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const { data, error } = await anonClient()
      .from("portfolio_items")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error || !data) throw new Error(error?.message ?? "portfolio unavailable");
    return (data as PortfolioItem[]).map(toProject).filter((p): p is Project => p !== null);
  },
  ["portfolio"],
  { tags: [PORTFOLIO_TAG], revalidate: 300 }
);

const readTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const { data, error } = await anonClient()
      .from("testimonials")
      .select("quote, attribution")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error || !data) throw new Error(error?.message ?? "testimonials unavailable");
    return (data as Pick<TestimonialRow, "quote" | "attribution">[]).map((t) => ({
      quoteLines: t.quote.split(/\r?\n/).map((l) => l.trim()).filter(Boolean),
      attribution: t.attribution,
    }));
  },
  ["testimonials"],
  { tags: [TESTIMONIALS_TAG], revalidate: 300 }
);

const readStudio = unstable_cache(
  async (): Promise<StudioDetails> => {
    const { data, error } = await anonClient()
      .from("site_settings")
      .select("contact_email, studio_address, instagram_url, linkedin_url, figures")
      .single();
    if (error || !data) throw new Error(error?.message ?? "site_settings row missing");
    return data as StudioDetails;
  },
  ["studio-details"],
  { tags: [SITE_SETTINGS_TAG], revalidate: 300 }
);

/** Published case studies, in the order set in the admin. */
export async function getProjects(): Promise<Project[]> {
  try {
    return await readProjects();
  } catch {
    return [];
  }
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((p) => p.slug === slug);
}

/** Published testimonials; the first one is the one on the home page. */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await readTestimonials();
  } catch {
    return [];
  }
}

const NO_STUDIO: StudioDetails = { contact_email: null, studio_address: [], instagram_url: null, linkedin_url: null, figures: [] };

/** Email, address, social links and headline figures, as set in the admin. */
export async function getStudioDetails(): Promise<StudioDetails> {
  try {
    return await readStudio();
  } catch {
    return NO_STUDIO;
  }
}
