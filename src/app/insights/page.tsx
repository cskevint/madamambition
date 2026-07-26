import type { Metadata } from "next";
import { getAllArticles } from "../../../lib/markdown";
import { ArticleGrid, InteriorHero, ROW, formatListingDate } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Insights - Madam Ambition",
  description:
    "Expert insights, leadership thoughts, and professional development resources for women.",
};

export default function InsightsPage() {
  const articles = getAllArticles("insights").map((a) => ({
    slug: a.slug,
    title: a.title,
    mainImage: a.mainImage,
    date: formatListingDate(a.date),
  }));

  return (
    <main className="site-type font-sans antialiased bg-white text-black">
      <InteriorHero
        title="Insights"
        image="/articles/images/SelenaTrotter-MadamAmbition-40.jpg"
        imageAlt="Madam Ambition Insights"
        imageWidth={2048}
        imageHeight={1362}
      />

      <section className="bg-white pt-[6%] pb-[6%]">
        <div className={ROW}>
          {articles.length > 0 ? (
            <ArticleGrid articles={articles} />
          ) : (
            <p className="text-center">Exploring new insights — check back soon.</p>
          )}
        </div>
      </section>
    </main>
  );
}
