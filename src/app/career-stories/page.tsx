import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "../../../lib/markdown";

export const metadata = {
  title: "Career Stories | Madam Ambition",
  description:
    "A collection of career stories from trailblazing women in finance, tech, and beyond.",
};

export default function CareerStoriesPage() {
  const articles = getAllArticles("career-stories");

  return (
    <main className="bg-white min-h-screen font-sans antialiased">
      {/* Header Section */}
      <header className="bg-brand-beige py-24 px-6 md:px-12 lg:px-24 border-b border-brand-darkbeige">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif text-brand-brown font-extrabold tracking-tight uppercase">
            Career Stories
          </h1>
          <div className="w-24 h-1 bg-brand-copper mx-auto"></div>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto pt-4 leading-relaxed">
            Sharing the diverse paths of women to empower you to learn about different professions
            and discover the possibilities for your own journey.
          </p>
        </div>
      </header>

      {/* Grid Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {articles.map((article) => (
              <article key={article.slug} className="flex flex-col group h-full">
                {/* Image Container */}
                <Link
                  href={`/${article.slug}/`}
                  className="block aspect-video relative overflow-hidden bg-gray-100 mb-8 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                >
                  <Image
                    src={article.mainImage || "/articles/images/placeholder.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                </Link>

                {/* Content */}
                <div className="flex flex-col grow">
                  <h2 className="font-serif text-2xl font-bold text-brand-brown mb-4 leading-tight group-hover:text-brand-copper transition-colors">
                    <Link href={`/${article.slug}/`}>{article.title}</Link>
                  </h2>
                  <div className="w-12 h-px bg-brand-beige mb-6 group-hover:w-20 transition-all duration-500"></div>
                  <p className="text-gray-500 font-light text-sm leading-relaxed line-clamp-3 mb-8">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto">
                    <Link
                      href={`/${article.slug}/`}
                      className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-copper hover:text-brand-brown transition-colors inline-flex items-center gap-2"
                    >
                      Read Story <span className="text-lg leading-none">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Footer CTA */}
      <section className="bg-brand-beige/30 py-24 px-6 text-center border-t border-brand-beige">
        <div className="max-w-2xl mx-auto space-y-8">
          <h3 className="text-3xl font-serif font-bold text-brand-brown">Have a story to share?</h3>
          <p className="text-gray-600 font-light leading-relaxed">
            We are always looking to amplify the voices of women who are making an impact in their
            fields.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-black text-white px-12 py-5 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}
