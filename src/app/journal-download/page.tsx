import type { Metadata } from "next";
import { BTN, InteriorHero, JournalDetail } from "@/components/divi";

export const metadata: Metadata = {
  title: "journal-download - Madam Ambition",
  description: "Thank you for signing up! You can download your Mindset Journal below.",
  // A thank-you page reached only after signup; keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * The post-signup thank-you page for the Mindset Journal, mirroring the live
 * /journal-download/.
 *
 * Both PDFs are served from this repo (public/journal/), copied byte-for-byte from the
 * WordPress uploads directory. The original wp-content URLs 301 to these, so links already
 * in the wild — including any sent by ConvertKit — keep working. Nothing here depends on the
 * old WordPress install any more.
 */
const PDFS = [
  {
    label: "Download Colored Version",
    href: "/journal/Mindset-Journal_Col-1.pdf",
  },
  {
    label: "Download Black & White Version",
    href: "/journal/Mindset-Journal_BLW.pdf",
  },
];

export default function JournalDownload() {
  return (
    <main className="divi-type font-sans antialiased bg-white text-black">
      <InteriorHero
        title={
          <>
            Download your
            <br />
            Mindset Journal
          </>
        }
        subtitle="Thank you for signing up! You can download your journal below."
        image="/articles/images/SelenaTrotter-MadamAmbition-Executive-Coaching-copy.jpg"
        imageAlt="Mindset Journal"
        imageWidth={1024}
        imageHeight={681}
      />

      <JournalDetail>
        <div className="flex flex-col items-start gap-[10px] mt-[20px]">
          {PDFS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`${BTN} bg-black text-white px-[40px] py-[10px] hover:bg-brand-nav transition-colors`}
            >
              {label}
            </a>
          ))}
        </div>
      </JournalDetail>
    </main>
  );
}
