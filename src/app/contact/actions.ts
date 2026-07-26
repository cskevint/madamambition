"use server";

import { isValidEmail, sendNotification } from "../../../lib/mail";

/**
 * Contact form delivery. Transport lives in lib/mail.ts, shared with the journal signup.
 * Environment variables are documented in README.md ("Environment variables").
 */

export type SendEmailResult = { success: boolean; error?: string };

export async function sendEmail(formData: FormData): Promise<SendEmailResult> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

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
