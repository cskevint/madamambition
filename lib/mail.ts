import { Resend } from "resend";

/**
 * Shared Resend delivery for the site's forms (contact and journal signup).
 *
 * The client is built lazily per call: `new Resend(undefined)` throws "Missing API key", so
 * constructing it at module scope would take down any route that imports this whenever
 * RESEND_API_KEY is absent. Built here, a missing key degrades to a clear message.
 *
 * Environment variables are documented in README.md ("Environment variables"):
 * RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, SITE_URL.
 */

const DEFAULT_TO = "hello@madamambition.com";
const DEFAULT_FROM = "Madam Ambition <onboarding@resend.dev>";

export type MailResult = { success: boolean; error?: string };

/** Deliberately permissive: something@something.tld. Resend validates properly server-side. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Who owner-facing notifications go to. */
export function ownerAddress(): string {
  return process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
}

async function send(opts: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`Mail: RESEND_API_KEY is not set; cannot send "${opts.subject}".`);
    return {
      success: false,
      error: "Email is not configured yet. Please reach out directly in the meantime.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [opts.to],
      subject: opts.subject,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
      text: opts.text,
    });

    if (error) {
      console.error(`Resend error sending "${opts.subject}":`, error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error(`Mail send error for "${opts.subject}":`, err);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}

/** Sends to CONTACT_TO_EMAIL. `replyTo` lets the owner answer the sender directly. */
export function sendNotification(opts: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<MailResult> {
  return send({ to: ownerAddress(), ...opts });
}

/** Sends to an address supplied by a visitor. Validate it before calling. */
export function sendToVisitor(opts: {
  to: string;
  subject: string;
  text: string;
}): Promise<MailResult> {
  return send(opts);
}
