"use server";

import { JOURNAL_PDFS } from "@/components/primitives";
import { isValidEmail, sendNotification, sendToVisitor } from "../../../lib/mail";
import { absoluteUrl } from "../../../lib/site";

/**
 * Mindset Journal signup.
 *
 * Replaces the previous ConvertKit form post. Two emails go out per signup:
 *   1. a notification to CONTACT_TO_EMAIL, so the owner sees the subscription;
 *   2. the journal itself to the subscriber, as absolute links to the PDFs in public/journal/.
 *
 * The subscriber email is the one that matters to the visitor, so its failure fails the
 * request. The owner notification is best-effort: if only that one fails, the visitor has
 * still received their journal and should not be shown an error.
 */

export type SubscribeResult = { success: boolean; error?: string };

export async function subscribeToJournal(formData: FormData): Promise<SubscribeResult> {
  const firstName = (formData.get("firstName") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";

  if (!email) {
    return { success: false, error: "Please enter your email address." };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const links = JOURNAL_PDFS.map(({ label, path }) => `${label}: ${absoluteUrl(path)}`).join("\n");
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";

  const toSubscriber = await sendToVisitor({
    to: email,
    subject: "Your Mindset Journal",
    text: `${greeting}

Thank you for signing up. You can download your Mindset Journal here:

${links}

Both versions contain the same 21 pages — pick whichever suits how you like to print.

Warmly,
Selena Trotter
Madam Ambition
`,
  });

  if (!toSubscriber.success) {
    return toSubscriber;
  }

  // Best-effort: already logged inside the mailer if it fails.
  await sendNotification({
    subject: "New Mindset Journal signup",
    text: `Name: ${firstName || "(not given)"}\nEmail: ${email}\n\nThe journal download links were emailed to them automatically.`,
    replyTo: email,
  });

  return { success: true };
}
