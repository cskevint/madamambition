import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { IMG_SHADOW, InteriorHero, ROW, SOCIAL_LINKS } from "@/components/divi";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact - Madam Ambition",
  description:
    "We'd love to hear from you. Share your story or get in touch about executive coaching.",
};

export default function Contact() {
  return (
    <main className="divi-type font-sans antialiased bg-white text-black">
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

      {/* 3. Divergence D8: not on the live page. Retained, now pointing at the real profiles
          instead of the previous href="#" placeholders. */}
      <section className="bg-brand-beige pt-[4%] pb-[4%]">
        <div className={`${ROW} text-center`}>
          <h3 className="font-serif text-[20px] text-brand-brown">Follow the Journey</h3>
          <ul className="flex justify-center gap-[8px]">
            {SOCIAL_LINKS.map(({ label, href, path }) => (
              <li key={label}>
                <Link
                  href={href}
                  aria-label={label}
                  className="w-[36px] h-[36px] rounded-full bg-brand-copper text-white flex items-center justify-center hover:bg-brand-brown transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-[16px] h-[16px]"
                  >
                    <path d={path} />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
