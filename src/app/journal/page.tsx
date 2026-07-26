import type { Metadata } from "next";
import { BTN, InteriorHero, JournalDetail, ROW } from "@/components/divi";

export const metadata: Metadata = {
  title: "Journal - Madam Ambition",
  description:
    "Download the Mindset Journal to help you reflect, plan and act in a meditative space so you build in yourself the capacity for true growth.",
};

/** The live page posts to Selena's ConvertKit form; keep the same destination. */
const CONVERTKIT_ACTION = "https://app.convertkit.com/forms/4837251/subscriptions";

export default function Journal() {
  return (
    <main className="divi-type font-sans antialiased bg-white text-black">
      {/* 1. Hero */}
      <InteriorHero
        title="Mindset Journal"
        subtitle="Are you ready to tackle your to-do list, make audacious goals and set your self up for success? Download this journal to help you reflect, plan and act in a meditative space so you build in yourself the capacity for true growth."
        image="/articles/images/SelenaTrotter-MadamAmbition-Executive-Coaching-copy.jpg"
        imageAlt="Mindset Journal"
        imageWidth={1024}
        imageHeight={681}
      />

      {/* 2. Journal detail + subscribe form */}
      <JournalDetail>
        {/* A real ConvertKit subscription, replacing the previous placeholder whose onSubmit
            called preventDefault and did nothing. Plain form post, so this page stays a
            server component and can export metadata. */}
        <form action={CONVERTKIT_ACTION} method="post" className="mt-[20px] max-w-[420px]">
          <label htmlFor="ck-first-name" className="sr-only">
            First name
          </label>
          <input
            id="ck-first-name"
            type="text"
            name="fields[first_name]"
            placeholder="First name"
            autoComplete="given-name"
            className="w-full px-[16px] py-[12px] mb-[10px] bg-white border border-brand-darkbeige focus:border-brand-copper outline-none text-[16px]"
          />
          <label htmlFor="ck-email" className="sr-only">
            Email address
          </label>
          <input
            id="ck-email"
            type="email"
            name="email_address"
            placeholder="Email address"
            autoComplete="email"
            required
            className="w-full px-[16px] py-[12px] mb-[10px] bg-white border border-brand-darkbeige focus:border-brand-copper outline-none text-[16px]"
          />
          <button
            type="submit"
            className={`${BTN} w-full bg-black text-white px-[40px] py-[10px] hover:bg-brand-nav transition-colors cursor-pointer`}
          >
            Subscribe
          </button>
        </form>
      </JournalDetail>

      {/* 3. Divergence D7: this callout is not on the live page. Retained, restyled to Divi. */}
      <section className="bg-brand-copper pt-[4%] pb-[4%] text-white">
        <div className={`${ROW} text-center`}>
          <p className="font-quote italic text-[22px] leading-[33px]! text-brand-beige">
            &ldquo;A meditative space to build in yourself the capacity for true growth.&rdquo;
          </p>
        </div>
      </section>
    </main>
  );
}
