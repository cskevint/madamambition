import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles } from "../../../lib/markdown";
import { careerStoriesEnabled } from "../../../lib/features";
import { ArticleGrid, InteriorHero, ROW, formatListingDate } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Career Stories - Madam Ambition",
  description:
    "A collection of career stories from trailblazing women in finance, tech, and beyond.",
};

export default function CareerStoriesPage() {
  // Disabled by default — see lib/features.ts. Renders the 404 page, not an empty listing.
  if (!careerStoriesEnabled) {
    notFound();
  }

  const articles = getAllArticles("career-stories").map((a) => ({
    slug: a.slug,
    title: a.title,
    mainImage: a.mainImage,
    date: formatListingDate(a.date),
  }));

  return (
    <main className="site-type font-sans antialiased bg-white text-black">
      {/* Heading matches the live page, which splits the title across two h1 lines. Where
          live renders "No Results Found" (its posts were unpublished), we list all 55. */}
      <InteriorHero
        title={
          <>
            Women&rsquo;s Life
            <br />
            &amp; Career Stories
          </>
        }
        image="/articles/images/SelenaTrotter-MadamAmbition-40.jpg"
        imageAlt="Women's Life & Career Stories"
        imageWidth={2048}
        imageHeight={1362}
      />

      <section className="bg-white pt-[6%] pb-[6%]">
        <div className={ROW}>
          <ArticleGrid articles={articles} />
        </div>
      </section>
    </main>
  );
}
