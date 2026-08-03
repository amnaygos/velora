export type FormSubmissionMode = "mailto" | "external-endpoint" | "demo";

export type FormSubmissionResult = {
  ok: boolean;
  mode: FormSubmissionMode;
  error?: string;
};

/**
 * Optional external endpoints. None are implemented by this project —
 * when unset, forms run in presentation-safe demo mode: they validate,
 * play the designed interaction, and store nothing anywhere.
 */
export const FORM_ENDPOINTS = {
  contact: process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT,
  blueprint: process.env.NEXT_PUBLIC_BLUEPRINT_FORM_ENDPOINT,
  newsletter: process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ENDPOINT,
} as const;

export const CONTACT_EMAIL = "hello@velora.qa";

export function resolveFormMode(endpoint?: string): FormSubmissionMode {
  return endpoint ? "external-endpoint" : "demo";
}

export async function submitForm(
  values: Record<string, unknown>,
  endpoint?: string,
): Promise<FormSubmissionResult> {
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        return {
          ok: false,
          mode: "external-endpoint",
          error: `The submission service responded with status ${res.status}.`,
        };
      }
      return { ok: true, mode: "external-endpoint" };
    } catch {
      return {
        ok: false,
        mode: "external-endpoint",
        error: "The submission service could not be reached.",
      };
    }
  }

  // DEMO MODE — presentation only. Personal information is intentionally
  // never persisted: no database, no localStorage, no hidden files.
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ok: true, mode: "demo" };
}

export function buildMailtoHref(subject: string, body?: string): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  if (body) params.set("body", body);
  return `mailto:${CONTACT_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}
