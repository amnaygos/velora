import type { z } from "zod";
import type {
  blueprintSchema,
  enquirySchema,
  newsletterSchema,
} from "@/lib/validation";

export type BlueprintFormValues = z.infer<typeof blueprintSchema>;
export type EnquiryFormValues = z.infer<typeof enquirySchema>;
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export type FormStatus = "idle" | "submitting" | "success" | "error";
