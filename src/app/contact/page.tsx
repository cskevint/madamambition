import Image from "next/image";
import type { Metadata } from "next";
import { IMG_SHADOW, InteriorHero, ROW } from "@/components/primitives";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact - Madam Ambition",
  description:
    "We'd love to hear from you. Share your story or get in touch about executive coaching.",
};

export default function Contact() {
  return (
    <main className="site-type font-sans antialiased bg-white text-black">
      {/* 1. Hero — the narrow centred variant: 30px heading, no image */}
      <InteriorHero narrow title="Contact Madam Ambition" subtitle="We’d love to hear from you!" />

      {/* 2. Portrait beside the form */}
      <section className="bg-white pt-[6%] pb-[6%]">
        <div
          className={`${ROW} flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.56%]`}
        >
          <div className="w-full min-[981px]:w-[47.22%]">
            <Image
              src="/articles/images/SelenaTrotter-MadamAmbition-68.jpg"
              alt="Selena Trotter"
              width={665}
              height={1000}
              className={`w-full max-w-[500px] h-auto ${IMG_SHADOW}`}
            />
          </div>
          <div className="w-full min-[981px]:w-[47.22%] mt-[30px] min-[981px]:mt-0">
            <p className="pb-[1em]">
              Whether you&apos;d like to share your story with us or want to work with me, please
              contact me using the form on this page.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Divergence D8 (a "Follow the Journey" social row, not on the live page) was removed:
          it repeated the footer's own social row, so on mobile the same four icons appeared
          twice within about half a screen of each other. The footer's row is the survivor. */}
    </main>
  );
}
