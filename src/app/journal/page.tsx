import type { Metadata } from "next";
import { InteriorHero, JournalDetail, ROW } from "@/components/primitives";
import JournalSignupForm from "./JournalSignupForm";

export const metadata: Metadata = {
  title: "Journal - Madam Ambition",
  description:
    "Download the Mindset Journal to help you reflect, plan and act in a meditative space so you build in yourself the capacity for true growth.",
};

export default function Journal() {
  return (
    <main className="site-type font-sans antialiased bg-white text-black">
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
        <JournalSignupForm />
      </JournalDetail>

      {/* 3. Divergence D7: this callout is not on the live page. Retained, restyled to match the rest of the site. */}
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
