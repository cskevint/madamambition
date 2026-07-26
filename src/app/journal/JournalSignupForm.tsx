"use client";

import { useState } from "react";
import { BTN, JournalDownloadLinks } from "@/components/primitives";
import { subscribeToJournal } from "./actions";

/**
 * Mindset Journal signup. On success the download links are shown immediately as well as
 * emailed, so nobody has to wait on mail delivery to get what they came for.
 */
export default function JournalSignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await subscribeToJournal(formData);
      if (result.success) {
        setSubscribed(true);
      } else {
        setError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (subscribed) {
    return (
      <div aria-live="polite" className="mt-[20px]">
        <p className="pb-[1em]">
          Thank you for signing up — your journal is on its way by email. You can also download it
          right here:
        </p>
        <JournalDownloadLinks />
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="mt-[20px] max-w-[420px]">
      <label htmlFor="journal-first-name" className="sr-only">
        First name
      </label>
      <input
        id="journal-first-name"
        name="firstName"
        type="text"
        placeholder="First name"
        autoComplete="given-name"
        className="w-full px-[16px] py-[12px] mb-[10px] bg-white border border-brand-darkbeige focus:border-brand-copper outline-none text-[16px]"
      />

      <label htmlFor="journal-email" className="sr-only">
        Email address
      </label>
      <input
        id="journal-email"
        name="email"
        type="email"
        placeholder="Email address"
        autoComplete="email"
        required
        className="w-full px-[16px] py-[12px] mb-[10px] bg-white border border-brand-darkbeige focus:border-brand-copper outline-none text-[16px]"
      />

      {error ? (
        <p className="pb-[1em] text-brand-brown" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${BTN} w-full bg-black text-white px-[40px] py-[10px] hover:bg-brand-nav transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSubmitting ? "Sending…" : "Send me the journal"}
      </button>
    </form>
  );
}
