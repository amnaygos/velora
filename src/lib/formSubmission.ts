/** A mailto link to the studio, with the subject (and body) pre-filled. */
export function buildMailtoHref(email: string, subject: string, body?: string): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  if (body) params.set("body", body);
  return `mailto:${email}?${params.toString().replace(/\+/g, "%20")}`;
}
