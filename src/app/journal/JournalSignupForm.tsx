"use client";

import { useState } from "react";
import { JournalDownloadLinks } from "@/components/primitives";
import { subscribeToJournal } from "./actions";

/**
 * The signup form keeps the live site's form styling, which is the embed's own look rather
 * than the site button style: full-column-width fields with a 4px radius and a thin #e3e3e3
 * border, 15px lower-case type, 15px gaps, and a copper submit button — no uppercase and no
 * letter-spacing. Measured from the live /journal/ at 1440px.
 */
const FIELD =
  "w-full h-[47px] px-[12px] bg-white text-[15px] text-black border border-[#e3e3e3] rounded-[4px] outline-none focus:border-brand-copper";

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
    <form action={handleSubmit} className="mt-[20px] flex flex-col gap-[15px]">
      <label htmlFor="journal-first-name" className="sr-only">
        First Name
      </label>
      <input
        id="journal-first-name"
        name="firstName"
        type="text"
        placeholder="First Name"
        autoComplete="given-name"
        className={FIELD}
      />

      <label htmlFor="journal-email" className="sr-only">
        Email Address
      </label>
      <input
        id="journal-email"
        name="email"
        type="email"
        placeholder="Email Address"
        autoComplete="email"
        required
        className={FIELD}
      />

      {error ? (
        <p className="text-brand-brown" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-[43px] bg-brand-copper text-white font-sans text-[15px] rounded-[4px] hover:bg-brand-brown transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}
