import Link from "next/link";
import Image from "next/image";

/**
 * Primitives shared by every page, matching the production Divi theme.
 * Measured from madamambition.com at a 1440px viewport — see plans/migration_plan.md §2.
 */

/** Divi image modules all carry the same drop shadow and no border. */
export const IMG_SHADOW = "shadow-[0_2px_18px_0_rgba(0,0,0,0.3)]";

/** Divi buttons: Marcellus 15px, 1px tracking, uppercase, square corners. */
export const BTN = "inline-block font-sans text-[15px] leading-[25.5px] tracking-[1px] uppercase";

/** The default black button; `px`/`py` vary per placement so they stay caller-supplied. */
export const BTN_DARK = `${BTN} bg-black text-white hover:bg-brand-nav transition-colors`;

/** The Divi row container. Section padding is applied by the section, not here. */
export const ROW = "w-[80%] max-w-[1152px] mx-auto";

/** The 270deg split background used by every interior hero. */
export const HERO_GRADIENT = "bg-[linear-gradient(270deg,#e2cec0_43%,#f5e5d6_43%)]";

/**
 * The interior-page hero: gradient split, 423+666 columns, 35px heading, right-hand image.
 * `/contact/` uses the narrow variant (centred 544px column, 30px heading, no image).
 */
export function InteriorHero({
  title,
  subtitle,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  narrow = false,
  titleOffset = 148,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  narrow?: boolean;
  /** Divi pads the text column down so the heading sits low beside the image. */
  titleOffset?: number;
}) {
  if (narrow) {
    return (
      <section className={`${HERO_GRADIENT} py-[2%]`}>
        <div className={ROW}>
          <div className="w-full min-[981px]:w-[47.22%] mx-auto text-center">
            <h1 className="font-serif text-[30px]! text-brand-brown">{title}</h1>
            {subtitle ? <p className="text-[18px] leading-[23.4px]!">{subtitle}</p> : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${HERO_GRADIENT} py-[calc(2%_+_1.44px)]`}>
      <div
        className={`${ROW} flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.47%]`}
      >
        <div
          className="w-full min-[981px]:w-[36.72%] hero-title-offset"
          style={{ "--hero-title-offset": `${titleOffset}px` } as React.CSSProperties}
        >
          <h1 className="font-serif text-[35px]! text-brand-brown">{title}</h1>
          {subtitle ? <p className="text-[18px] leading-[23.4px]!">{subtitle}</p> : null}
        </div>
        {image ? (
          <div className="w-full min-[981px]:w-[57.81%] mt-[30px] min-[981px]:mt-0">
            <Image
              src={image}
              alt={imageAlt ?? ""}
              width={imageWidth ?? 1024}
              height={imageHeight ?? 683}
              className={`w-full h-auto ${IMG_SHADOW}`}
              priority
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * "My Mission" / "My Values" — verified byte-identical between /about/ and
 * /executive-coaching/ on the live site (both render exactly 886 characters).
 */
export function MissionValuesSection() {
  return (
    // 4% section padding + 2% row padding, folded together (see plan §2).
    <section className="bg-brand-darkbeige pt-[6%] pb-[6%] border-b-[15px] border-brand-copper">
      <div
        className={`${ROW} flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.56%]`}
      >
        <div className="w-full min-[981px]:w-[47.22%]">
          <h3 className="font-serif text-[22px] text-brand-brown">My Mission</h3>
          <p className="pb-[1em]">
            Time is of the essence to see women back in equal, if not stronger numbers, in the labor
            market. Women need to see in themselves the answer to so many of the problems facing our
            society. Whatever their career, women can make an impact. When women are seen in equal
            numbers within a given institution, the institution advances at a quicker pace.
          </p>
          <p>
            It is goal of Selena to help advance the cause of women who work. Women are leaders by
            being examples to other women of what is possible when they are putting forth the effort
            to advance in their field and support younger generations alongside them.
          </p>
        </div>
        <div className="w-full min-[981px]:w-[47.22%] mt-[30px] min-[981px]:mt-0">
          <h3 className="font-serif text-[22px] text-brand-brown">My Values</h3>
          <p>
            I believe in supporting women, for in doing so all of humanity progresses. Young girls
            need direction and guidance earlier around careers, and all women need stronger support
            networks to foster mentorship and development. In supporting one, the other grows.
          </p>
          <div className="mt-[35.28px]">
            <Link href="/contact/" className={`${BTN_DARK} px-[40px] py-[10px]`}>
              Work with me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * "Let's chat" — shared by the home page (§5), /about/ (§3) and /executive-coaching/ (§3).
 * The body copy differs very slightly between them, so it stays a prop.
 */
export function LetsChatSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="contact" className="bg-white pt-[6%] pb-[calc(44px_+_2%)]">
      <div
        className={`${ROW} flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.56%]`}
      >
        <div className="w-full min-[981px]:w-[47.22%]">
          <Image
            src="/articles/images/SelenaTrotter-MadamAmbition-45.jpg"
            alt="Contact Selena Trotter"
            width={1500}
            height={998}
            className={`w-full h-auto ${IMG_SHADOW}`}
          />
        </div>
        <div className="w-full min-[981px]:w-[47.22%] mt-[30px] min-[981px]:mt-0 min-[981px]:pt-[65.31px]">
          <h2 className="font-serif text-[26px] text-brand-brown">Let&apos;s chat</h2>
          <p>{children}</p>
          <div className="mt-[43.53px]">
            <Link href="/contact/" className={`${BTN_DARK} px-[40px] py-[10px]`}>
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
