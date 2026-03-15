import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "../../../lib/markdown";

export const metadata = {
  title: "Insights | Madam Ambition",
  description:
    "Expert insights, leadership thoughts, and professional development resources for women.",
};

export default function InsightsPage() {
  const articles = getAllArticles("insights");

  return (
    <main className="bg-white min-h-screen font-sans antialiased">
      {/* Header Section */}
      <header className="bg-brand-nav py-24 px-6 md:px-12 lg:px-24 border-b border-brand-greyblue/20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-beige font-extrabold tracking-tight uppercase">
            Insights
          </h1>
          <div className="w-24 h-1 bg-brand-copper mx-auto"></div>
          <p className="text-lg text-brand-beige/80 font-light max-w-2xl mx-auto pt-4 leading-relaxed">
            Resources, reflections, and strategies to help you navigate your leadership journey with
            confidence and clarity.
          </p>
        </div>
      </header>

      {/* Grid Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {articles.map((article) => (
                <article key={article.slug} className="flex flex-col group h-full">
                  {/* Image Container */}
                  <Link
                    href={`/${article.slug}`}
                    className="block aspect-video relative overflow-hidden bg-gray-100 mb-8 border border-gray-100 group-hover:border-brand-copper/30 transition-colors duration-300"
                  >
                    <Image
                      src={article.mainImage || "/articles/images/placeholder.jpg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col flex-grow">
                    <h2 className="font-serif text-2xl font-bold text-brand-brown mb-4 leading-tight group-hover:text-brand-copper transition-colors">
                      <Link href={`/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <p className="text-gray-500 font-light text-sm leading-relaxed line-clamp-3 mb-8">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <Link
                        href={`/${article.slug}`}
                        className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-brown hover:text-brand-copper transition-colors"
                      >
                        Read Article
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
              <p className="text-gray-400 italic">Exploring new insights... check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Coaching CTA */}
      <section className="bg-brand-copper py-32 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto space-y-8">
          <h3 className="text-3xl font-serif font-bold text-brand-beige">Accelerate your growth</h3>
          <p className="text-white/80 font-light leading-relaxed text-lg">
            Personalized coaching programs designed to help you overcome roadblocks and achieve your
            professional ambitions.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-brand-brown px-12 py-5 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-beige transition-all"
          >
            Explore Executive Coaching
          </Link>
        </div>
      </section>
    </main>
  );
}
