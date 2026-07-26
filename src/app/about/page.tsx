import Image from "next/image";
import type { Metadata } from "next";
import {
  IMG_SHADOW,
  InteriorHero,
  LetsChatSection,
  MissionValuesSection,
  ROW,
} from "@/components/primitives";

export const metadata: Metadata = {
  title: "About - Madam Ambition",
  description:
    "Executive Coach helping women leaders boldly embody ambition that generates value for their company without neglecting their harmonious life.",
};

export default function About() {
  return (
    <main className="site-type font-sans antialiased bg-white text-black">
      {/* 1. Hero */}
      <InteriorHero
        title="About Madam Ambition"
        subtitle="Executive Coach helping women leaders boldly embody ambition that generates value for their company without neglecting their harmonious life."
        image="/articles/images/SelenaTrotter-About-MadamAmbition-8-1.jpg"
        imageAlt="Selena Trotter - About Madam Ambition"
        imageWidth={1000}
        imageHeight={665}
      />

      {/* 2. Quote + narrative. On the live site this is one two-column section: portrait on
          the left, and the quote plus the narrative as plain 16px paragraphs on the right
          (no blockquote styling). */}
      <section className="bg-white pt-[6%] pb-[6%]">
        <div
          className={`${ROW} flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.56%]`}
        >
          <div className="w-full min-[981px]:w-[47.22%]">
            <Image
              src="/articles/images/SelenaTrotter-MadamAmbition-58.jpg"
              alt="Selena Trotter"
              width={665}
              height={1000}
              className={`w-full max-w-[500px] h-auto ${IMG_SHADOW}`}
            />
          </div>
          <div className="w-full min-[981px]:w-[47.22%] mt-[30px] min-[981px]:mt-0 min-[981px]:pt-[39px]">
            <p className="pb-[1em]">
              &ldquo;The world of humanity is possessed of two wings — the male and the female. So
              long as these two wings are not equivalent in strength the bird will not fly. Until
              womankind reaches the same degree as man, until she enjoys the same arena of activity,
              extraordinary attainment for humanity will not be realized; humanity cannot wing its
              way to heights of real attainment.&rdquo;
            </p>
            <p className="pb-[1em]">
              Each field of study, every endeavor, in all businesses and occupations, without
              exception, the presence of women is demanded. The social fabric of our institutions
              and society require the advancement of all.
            </p>
            <p className="pb-[1em]">
              In the wake of the global pandemic and the cratering of so many forces that supported
              family structures, it was women who bore the brunt of the suffering. Whether due to
              stress from family obligations, or the loss of their careers, women paid the price in
              these instances. And what has happened since is a backtracking in our society in the
              rights of women.
            </p>
            <p className="pb-[1em]">
              Time is of the essence to see women back in equal, if not stronger numbers, in the
              labor market. Women need to see in themselves the answer to so many of the problems
              facing our society. Whatever their career, women can make an impact. When women are
              seen in equal numbers within a given institution, the institutions advances at a
              quicker pace.
            </p>
            <p className="pb-[1em]">
              It is the goal of Selena to help advance the cause of women who work. Women who are
              leaders by being examples to other women of what is possible when they are putting
              forth effort to advance in their field, and be support to younger generations after
              them.
            </p>
            {/* Divergence D4: these two paragraphs exist only in this app, not on the live
                site. Retained per the no-deletion rule; see plans/migration_plan.md §7. */}
            <p className="pb-[1em]">
              When we look at the potential of women, we see a vast reservoir of hidden talent. Our
              goal is to help unlock that talent and allow it to manifest in the world. This is not
              only for the benefit of women, but for the entire world.
            </p>
            <p>
              We are dedicated to helping women achieve their professional goals and career
              aspirations. We believe that by empowering women, we can create a more just and
              equitable society for all.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Mission & Values */}
      <MissionValuesSection />

      {/* 4. Let's chat */}
      <LetsChatSection>
        Book a complimentary coaching call to explore if our executive coaching is right for you. We
        create community for women trail blazers, help leaders feel greater peace, ease and joy
        through our executive coaching programs.
      </LetsChatSection>
    </main>
  );
}
