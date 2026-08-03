import { z } from "zod";

export const BLUEPRINT_ROLES = [
  "Developer",
  "Hotel Group",
  "Architect",
  "Private Residence",
  "Wellness Operator",
  "Other",
] as const;

export const PROJECT_TYPES = [
  "Private Gym / Fitness Studio",
  "Commercial Gym / Health Club",
  "Hotel Fitness Centre",
  "Residential Wellness Suite",
  "Spa & Recovery Centre",
  "Corporate Wellness Facility",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "Under QAR 500,000",
  "QAR 500,000–1,000,000",
  "QAR 1,000,000–2,500,000",
  "QAR 2,500,000–5,000,000",
  "QAR 5,000,000+",
] as const;

export const DISCOVERY_SOURCES = [
  "Referral",
  "Instagram",
  "LinkedIn",
  "Direct Search",
  "Other",
] as const;

export const blueprintSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  role: z.enum(BLUEPRINT_ROLES, "Please select your role."),
});

export const enquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number.")
    .regex(/^[+()\-\s\d]+$/, "Please enter a valid phone number."),
  company: z.string().optional(),
  projectType: z.enum(PROJECT_TYPES, "Please select a project type."),
  budget: z.enum(BUDGET_RANGES, "Please select an approximate budget."),
  source: z.enum(DISCOVERY_SOURCES, "Please tell us how you heard about VELORA."),
  vision: z
    .string()
    .min(10, "Tell us a little more about your vision."),
});

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address."),
  role: z.string().optional(),
});
