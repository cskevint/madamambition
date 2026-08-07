"use server";

import { isValidEmail, sendNotification } from "../../../lib/mail";
import { isBotSubmission } from "../../../lib/spam";

/**
 * Contact form delivery. Transport lives in lib/mail.ts, shared with the journal signup.
 * Environment variables are documented in README.md ("Environment variables").
 *
 * A honeypot field guards the send, the same one the journal signup uses — see lib/spam.ts.
 */

export type SendEmailResult = { success: boolean; error?: string };

export async function sendEmail(formData: FormData): Promise<SendEmailResult> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  /**
   * Reported as a success so the bot learns nothing, but nothing is sent. Unlike the journal
   * signup there is no second send to worry about here — the one thing at stake is the owner's
   * inbox, which is exactly what a contact form attracts.
   */
  if (isBotSubmission(formData)) {
    console.warn("Contact form: honeypot triggered, dropping submission.");
    return { success: true };
  }

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  return sendNotification({
    subject: `New contact form submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    replyTo: email,
  });
}
