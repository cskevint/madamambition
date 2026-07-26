import Link from "next/link";
import Image from "next/image";

/**
 * Primitives shared by every page, matching the production site's design.
 * Measured from madamambition.com at a 1440px viewport — see plans/migration_plan.md §2.
 */

/** Every image on the live site carries the same drop shadow and no border. */
export const IMG_SHADOW = "shadow-[0_2px_18px_0_rgba(0,0,0,0.3)]";

/** Buttons: Marcellus 15px, 1px tracking, uppercase, square corners. */
export const BTN = "inline-block font-sans text-[15px] leading-[25.5px] tracking-[1px] uppercase";

/** The default black button; `px`/`py` vary per placement so they stay caller-supplied. */
export const BTN_DARK = `${BTN} bg-black text-white hover:bg-brand-nav transition-colors`;

/** The standard row container. Section padding is applied by the section, not here. */
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
  /** The text column is padded down so the heading sits low beside the image. */
  titleOffset?: number;
}) {
  if (narrow) {
    // 4% section + 4% row padding on top; 2% section + 4% row at the bottom. The narrow
    // variant's subtitle is 16px on the default body leading, unlike the 18px wide one.
    return (
      <section className={`${HERO_GRADIENT} pt-[8%] pb-[6%]`}>
        <div className={ROW}>
          <div className="w-full min-[981px]:w-[47.22%] mx-auto text-center">
            <h1 className="font-serif text-[30px] text-brand-brown">{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
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
          <h1 className="font-serif text-[35px] text-brand-brown">{title}</h1>
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
 * The Mindset Journal PDFs, served from public/journal/. Shared by /journal-download/ and the
 * journal signup email, so the paths cannot drift apart.
 */
export const JOURNAL_PDFS = [
  {
    label: "Download Colored Version",
    path: "/journal/Mindset-Journal_Col-1.pdf",
    // Each button carries its own colour on the live site rather than the usual black:
    // copper for the colour edition, muted grey-blue for the black & white one.
    className: "bg-brand-copper",
  },
  {
    label: "Download Black & White Version",
    path: "/journal/Mindset-Journal_BLW.pdf",
    className: "bg-brand-greyblue",
  },
];

/** The two download buttons, stacked. Wider padding (50px) than the standard button. */
export function JournalDownloadLinks() {
  return (
    <div className="flex flex-col items-start gap-[10px] mt-[20px]">
      {JOURNAL_PDFS.map(({ label, path, className }) => (
        <a
          key={path}
          href={path}
          className={`${BTN} ${className} text-white px-[50px] py-[10px] hover:bg-brand-nav transition-colors`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

/**
 * The journal detail section — mockup image beside the description. Shared by /journal/
 * (which follows it with the ConvertKit signup) and /journal-download/ (the post-signup
 * thank-you page, which follows it with the PDF links). `children` is that action slot.
 */
export function JournalDetail({ children }: { children?: React.ReactNode }) {
  return (
    <section className="bg-white pt-[6%] pb-[6%]">
      <div
        className={`${ROW} flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.56%]`}
      >
        <div className="w-full min-[981px]:w-[47.22%]">
          <Image
            src="/articles/images/Journalmockup-1-scaled.jpg"
            alt="Mindset Journal mockup"
            width={754}
            height={1024}
            className={`w-full max-w-[500px] h-auto ${IMG_SHADOW}`}
          />
        </div>
        <div className="w-full min-[981px]:w-[47.22%] mt-[30px] min-[981px]:mt-0">
          <p className="pb-[1em]">
            This journal was written to help you work on your mindset. A person who is in space to
            reflect and grow is able to accomplish more than one who is fixed in their ways and not
            ready to admit the need to push oneself further.
          </p>
          <p className="pb-[1em]">
            Using a journal to give yourself time to plan, prioritize and space to act, while also
            giving you mindfulness moments and art. This journal can be used over and over again as
            you make new goals that push yourself farther.
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Social profiles, shared by the footer and the contact page. */
export const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/Madam-Ambition-106255191438934/",
    path: "M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3.2V.5h-4.4C10.9.5 9.9 2.9 9.9 4.5v2.96H7v3.8h2.9V21h4.6v-9.74h3.4l.87-3.8z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/madamambition/",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9a3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.9 5.9 0 0 0 1.38 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63C19.1.34 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
  },
  {
    label: "X",
    href: "https://twitter.com/AmbitionMadam",
    path: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.48l8.6-9.83L0 1.15h7.6l5.44 7.2 5.86-7.2zm-1.3 19.5h2.04L6.48 3.24H4.3l13.3 17.4z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/madam-ambition/",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  },
];

/**
 * The article grid used by /insights/ and /career-stories/: three columns, 35px gutters,
 * and a white card of full-bleed thumbnail + 23px title + date. The live cards carry no
 * excerpt or read-more link (see plan §7, D6).
 *
 * The thumbnail is cropped to the live 1.6 aspect via object-cover so that source images of
 * differing shapes still line up — WordPress did this with a `-400x250` crop.
 */
export function ArticleGrid({
  articles,
}: {
  articles: { slug: string; title: string; mainImage: string; date?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[981px]:grid-cols-3 gap-[35px]">
      {articles.map((article) => (
        <article key={article.slug} className="bg-white p-[19px] group">
          <Link href={`/${article.slug}/`} className="block">
            <div className="relative aspect-[363/227] -mx-[19px] -mt-[19px] overflow-hidden bg-brand-beige">
              <Image
                src={article.mainImage || "/articles/images/placeholder.jpg"}
                alt={article.title}
                fill
                sizes="(min-width: 981px) 361px, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Link>
          <h2 className="font-serif text-[23px] leading-[29.9px]! text-brand-brown mt-[30px] group-hover:text-brand-copper transition-colors">
            <Link href={`/${article.slug}/`}>{article.title}</Link>
          </h2>
          {article.date ? (
            <div className="text-[16px] leading-[27.2px] text-[#666666]">{article.date}</div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

/** Listings render dates as "Jul 24, 2023"; the markdown stores "July 24, 2023". */
export function formatListingDate(date?: string): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
