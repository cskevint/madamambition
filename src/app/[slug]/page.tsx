import { getAllArticles, getArticleBySlug } from "../../../lib/markdown";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = getArticleBySlug(slug);

  if (!article) return { title: "Not Found" };

  return {
    title: `${article.title} | Madam Ambition`,
    description: article.content.substring(0, 160).replace(/[#*_\[\]]/g, ""),
    openGraph: {
      images: [article.mainImage || "/default-image.jpg"],
      url: `https://madamambition.com/${slug}`,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const categoryLabel = article.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main className="bg-white min-h-screen font-sans antialiased text-black">
      {/* Hero Section - Following the Divi-like format */}
      <section
        className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16"
        style={{
          backgroundImage: "linear-gradient(270deg, #e2cec0 43%, #f5e5d6 43%)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 text-left">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-0">
            {/* Left Column (2/5 in Divi) */}
            <div className="lg:w-[40%] flex flex-col space-y-6">
              <div className="flex items-center text-[13px] tracking-wide text-brand-copper/90 font-medium">
                <Link href={`/${article.category}`} className="hover:underline">
                  {categoryLabel}
                </Link>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-gray-500">Madam Ambition Journal</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif text-brand-brown font-normal leading-[1.1em] tracking-tight">
                {article.title}
              </h1>

              {article.date && <div className="text-base text-gray-700 italic">{article.date}</div>}
            </div>

            {/* Right Column (3/5 in Divi) */}
            <div className="lg:w-[60%] w-full flex justify-end">
              <div className="relative w-full aspect-1024/724 border border-brand-darkbeige shadow-sm overflow-hidden rounded-sm">
                {article.mainImage ? (
                  <Image
                    src={article.mainImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-brand-beige flex items-center justify-center text-brand-brown/30 font-serif italic">
                    [Article Featured Image]
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - Refined Single Column */}
      <section className="max-w-[800px] mx-auto py-16 px-6 md:py-24">
        <div
          className="prose prose-stone prose-lg md:prose-xl max-w-none text-black font-normal leading-relaxed markdown-content 
          prose-headings:font-serif prose-headings:text-brand-brown prose-headings:font-normal prose-headings:mt-12 prose-headings:mb-6
          prose-h2:text-3xl prose-p:mb-8 prose-strong:font-bold prose-strong:text-black 
          prose-blockquote:border-l-[5px] prose-blockquote:border-brand-brown prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-10"
        >
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </section>

      {/* Post-Article Navigation */}
      <footer className="border-t border-brand-beige mt-12 py-12 px-6">
        <div className="max-w-[800px] mx-auto flex justify-between items-center text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400">
          <Link href={`/${article.category}`} className="hover:text-brand-copper transition-colors">
            ← More Projects
          </Link>
          <Link href="/contact" className="hover:text-brand-copper transition-colors">
            Get in Touch →
          </Link>
        </div>
      </footer>
    </main>
  );
}
