"use client";

import { useState } from "react";
import { BTN } from "@/components/primitives";
import { sendEmail } from "./actions";

/**
 * Split out of page.tsx so the page itself can stay a server component and export
 * `metadata`. Delivery goes through Resend — see actions.ts.
 */
export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await sendEmail(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div aria-live="polite">
        <h2 className="font-serif text-[26px] text-brand-brown">Thank you</h2>
        <p className="pb-[1em]">Your message has been sent. I&apos;ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className={`${BTN} bg-black text-white px-[40px] py-[10px] hover:bg-brand-nav transition-colors cursor-pointer`}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="font-serif text-[26px] text-brand-brown">Contact Me</h2>
      <p className="pb-[1em]">Fields marked with an * are required</p>

      <form action={handleSubmit} className="max-w-[520px]">
        <label htmlFor="name" className="block text-[16px]">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full px-[16px] py-[12px] mb-[16px] bg-white border border-brand-darkbeige focus:border-brand-copper outline-none text-[16px]"
        />

        <label htmlFor="email" className="block text-[16px]">
          Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-[16px] py-[12px] mb-[16px] bg-white border border-brand-darkbeige focus:border-brand-copper outline-none text-[16px]"
        />

        <label htmlFor="message" className="block text-[16px]">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full px-[16px] py-[12px] mb-[16px] bg-white border border-brand-darkbeige focus:border-brand-copper outline-none text-[16px] resize-y"
        />

        {error ? (
          <p className="pb-[1em] text-brand-brown" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${BTN} bg-black text-white px-[40px] py-[10px] hover:bg-brand-nav transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "Sending…" : "Submit"}
        </button>
      </form>
    </>
  );
}
