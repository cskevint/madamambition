import Link from "next/link";
import { getAllArticles } from "../../../lib/markdown";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <main className="bg-white min-h-screen font-sans antialiased pb-24">
      {/* Header Section */}
      <section className="bg-brand-beige py-24 px-6 md:px-12 lg:px-24 border-b border-brand-darkbeige">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-brown uppercase font-extrabold tracking-tight">
            The Archive
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.5em] text-brand-copper">
            Madam Ambition Journal
          </p>
          <div className="w-24 h-px bg-brand-brown/20 mt-6"></div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {articles.map((article, index) => (
              <Link
                key={article.slug}
                href={`/${article.slug}`}
                className="group flex flex-col items-start"
              >
                {/* Image Placeholder */}
                <div className="w-full aspect-4/3 bg-gray-100 border border-gray-200 mb-8 overflow-hidden relative shadow-sm transition-all group-hover:shadow-xl group-hover:border-gray-300">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-100 z-10 group-hover:scale-105 transition-transform duration-500">
                    <span className="text-gray-400 font-serif italic text-lg leading-tight uppercase font-bold tracking-tighter opacity-10 select-none">
                      Madam Ambition
                    </span>
                    <div className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-4">
                      [IMAGE: {article.mainImage || "Default"}]
                    </div>
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-brand-brown/0 group-hover:bg-brand-brown/5 transition-colors duration-500 z-20"></div>
                </div>

                {/* Metadata */}
                <div className="flex flex-col space-y-3 px-2">
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-bold text-brand-copper uppercase tracking-widest">
                      Story No. {index + 1}
                    </span>
                    <div className="w-8 h-px bg-brand-beige"></div>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-brand-brown leading-tight tracking-tight group-hover:text-brand-copper transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3">
                    {article.content.replace(/[#*_\[\]]/g, "").substring(0, 180)}...
                  </p>
                  <div className="pt-4 flex items-center gap-2 group-hover:gap-4 transition-all text-[10px] font-extrabold uppercase tracking-widest text-brand-copper">
                    Read Full Story <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="bg-brand-brown py-24 px-6 text-center text-white">
        <h3 className="text-3xl font-serif font-extrabold mb-8 tracking-wide">Ready for more?</h3>
        <Link
          href="/#contact"
          className="inline-block bg-brand-beige text-brand-brown px-12 py-5 uppercase text-xs tracking-widest font-bold hover:bg-white transition-all shadow-xl"
        >
          Work with me
        </Link>
      </section>
    </main>
  );
}
