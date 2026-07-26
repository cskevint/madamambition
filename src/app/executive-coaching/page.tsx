import Image from "next/image";
import type { Metadata } from "next";
import {
  IMG_SHADOW,
  InteriorHero,
  LetsChatSection,
  MissionValuesSection,
  ROW,
} from "@/components/divi";

export const metadata: Metadata = {
  title: "Executive Coaching - Madam Ambition",
  description:
    "An Executive Coach helping women leaders boldly embody ambition that generates value for their company without neglecting their harmonious life.",
};

export default function ExecutiveCoaching() {
  return (
    <main className="divi-type font-sans antialiased bg-white text-black">
      {/* 1. Hero */}
      <InteriorHero
        title="Executive Coaching"
        subtitle="An Executive Coach helping women leaders boldly embody ambition that generates value for their company without neglecting their harmonious life."
        image="/articles/images/SelenaTrotter-MadamAmbition-Executive-Coaching-copy.jpg"
        imageAlt="Selena Trotter - Executive Coaching"
        imageWidth={1024}
        imageHeight={681}
      />

      {/* 2. Intro — image beside copy on white */}
      <section className="bg-white pt-[6%] pb-[6%]">
        <div
          className={`${ROW} flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.56%]`}
        >
          <div className="w-full min-[981px]:w-[47.22%]">
            <Image
              src="/articles/images/SelenaTrotter-Executive-coach-1.jpg"
              alt="Selena Trotter - Executive Coach"
              width={681}
              height={1024}
              className={`w-full max-w-[500px] h-auto ${IMG_SHADOW}`}
            />
          </div>
          <div className="w-full min-[981px]:w-[47.22%] mt-[30px] min-[981px]:mt-0">
            <p className="pb-[1em]">
              Meet Selena Trotter, a savvy Executive Coach who helps women unlock their full
              potential and make great achievements in their professional lives. With a wealth of
              experience in leadership development and a unique understanding of the profound
              challenges facing women in leadership, Selena is an expert at guiding her clients
              through the coaching process, helping them to identify their strengths, set ambitious
              and thoughtful goals, and develop practical plans to achieve them.
            </p>
            <p>
              Working with an Executive Coach is a potent tool for personal and professional growth.
              By working closely with a Coach like Selena, women can gain a new perspective on their
              skills and abilities, learn to overcome limiting beliefs and behaviors, and develop
              the confidence and competence they need to reach total capacity. Whether you&apos;re
              looking to take your career to the next level, improve your relationships with
              colleagues, bring emotional intelligence to your colleagues, or become a more
              effective leader, a partnership with Selena can help you achieve your ambitions and
              unlock your best future.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Mission & Values */}
      <MissionValuesSection />

      {/* 4. Let's chat */}
      <LetsChatSection>
        Book a complimentary coaching call to explore if executive coaching is right for you now. We
        create community for women trail blazers, help leaders feel greater peace, ease and joy
        through our Executive Coaching programs.
      </LetsChatSection>
    </main>
  );
}
