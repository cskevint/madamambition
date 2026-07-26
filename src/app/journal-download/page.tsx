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
 * NOTE: the two PDFs still point at the WordPress uploads directory on madamambition.com
 * (Mindset-Journal_Col-1.pdf, 4.8 MB and Mindset-Journal_BLW.pdf, 5.2 MB). They work today,
 * but they are the last hard dependency on the old site staying online — they should be
 * copied into `public/` and these hrefs made relative before the WordPress install is
 * retired. See plans/migration_plan.md §7, D2.
 */
const PDFS = [
  {
    label: "Download Colored Version",
    href: "https://madamambition.com/wp-content/uploads/2023/08/Mindset-Journal_Col-1.pdf",
  },
  {
    label: "Download Black & White Version",
    href: "https://madamambition.com/wp-content/uploads/2023/08/Mindset-Journal_BLW.pdf",
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
