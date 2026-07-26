import type { Metadata } from "next";
import { InteriorHero, JournalDetail, JournalDownloadLinks } from "@/components/primitives";

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
 * WordPress uploads directory. The original wp-content URLs 301 to these, so links already in
 * the wild keep working. Nothing here depends on the old WordPress install.
 *
 * Reachable directly, and linked from the signup email sent by /journal/.
 */
export default function JournalDownload() {
  return (
    <main className="site-type font-sans antialiased bg-white text-black">
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
        <JournalDownloadLinks />
      </JournalDetail>
    </main>
  );
}
