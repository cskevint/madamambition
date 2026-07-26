"use server";

import { Resend } from "resend";

/**
 * Resend email delivery for the contact form.
 *
 * The client is built lazily inside the action: `new Resend(undefined)` throws
 * "Missing API key", so constructing it at module scope would take down the whole route
 * whenever RESEND_API_KEY is absent. Built here, a missing key degrades to a clear message
 * and the rest of the site is unaffected.
 *
 * Environment variables are documented in README.md ("Environment variables"):
 * RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.
 */

const DEFAULT_TO = "hello@madamambition.com";
const DEFAULT_FROM = "Madam Ambition <onboarding@resend.dev>";

export type SendEmailResult = { success: boolean; error?: string };

export async function sendEmail(formData: FormData): Promise<SendEmailResult> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }

  // Deliberately permissive: something@something.tld. Anything stricter rejects valid
  // addresses, and Resend validates properly on its side anyway.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set; cannot send.");
    return {
      success: false,
      error: "Email is not configured yet. Please reach out directly in the meantime.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO],
      subject: `New contact form submission from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Contact form submission error:", err);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
