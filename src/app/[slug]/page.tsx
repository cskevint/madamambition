import { getAllArticles, getArticleBySlug } from "../../../lib/markdown";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HERO_GRADIENT, IMG_SHADOW, ROW } from "@/components/primitives";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = getArticleBySlug(slug);

  if (!article) return { title: "Not Found" };

  return {
    title: `${article.title} - Madam Ambition`,
    description: article.excerpt.substring(0, 160),
    openGraph: {
      images: [article.mainImage || "/default-image.jpg"],
      url: `https://madamambition.com/${slug}/`,
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
    <main className="site-type font-sans antialiased bg-white text-black">
      {/* 1. Hero — gradient split, 423 + 666 columns, 26px heading beside the featured image */}
      <section className={`${HERO_GRADIENT} py-[calc(4%_+_1.44px)]`}>
        <div
          className={`${ROW} flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.47%]`}
        >
          <div className="w-full min-[981px]:w-[36.72%] min-[981px]:pt-[59px]">
            {/* Divergence D9: the category breadcrumb is not on the live site. Retained. */}
            <div className="text-[13px] tracking-wide text-brand-copper">
              <Link href={`/${article.category}/`} className="hover:underline">
                {categoryLabel}
              </Link>
            </div>
            <h1 className="font-serif text-[26px] text-brand-brown">{article.title}</h1>
            {article.date && <div className="text-[16px]">{article.date}</div>}
          </div>
          <div className="w-full min-[981px]:w-[57.81%] mt-[30px] min-[981px]:mt-0">
            {article.mainImage ? (
              <Image
                src={article.mainImage}
                alt={article.title}
                width={1023}
                height={630}
                className={`w-full h-auto ${IMG_SHADOW}`}
                priority
              />
            ) : (
              <div className="w-full aspect-[1023/630] bg-brand-beige flex items-center justify-center font-serif italic text-brand-brown/30">
                [Article Featured Image]
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Body — a single full-width 1152px column, 16px/27.2px, paragraphs 16px apart.
          `prose` supplies the list/table/heading rhythm markdown needs; the metrics
          below override its defaults, and .site-type fixes the line-heights. */}
      <section className="bg-white pt-[6%] pb-[6%]">
        <div className={ROW}>
          <div
            className="prose max-w-none text-black
              prose-p:text-[16px] prose-p:mt-0 prose-p:mb-0 prose-p:pb-[16px]
              prose-headings:font-serif prose-headings:text-brand-brown prose-headings:font-normal
              prose-headings:mt-[1em] prose-headings:mb-0
              prose-h2:text-[26px] prose-h3:text-[22px] prose-h4:text-[20px]
              prose-li:text-[16px] prose-li:my-0
              prose-strong:text-black prose-strong:font-bold
              prose-a:text-brand-copper prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-[5px] prose-blockquote:border-brand-copper
              prose-blockquote:pl-[20px] prose-blockquote:not-italic prose-blockquote:font-normal
              prose-img:shadow-[0_2px_18px_0_rgba(0,0,0,0.3)]"
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </div>
      </section>

      {/* 3. Post nav — divergence D9: not on the live site. Retained, wording corrected. */}
      <section className="bg-white pb-[6%]">
        <div
          className={`${ROW} flex justify-between items-center border-t border-brand-beige pt-[30px] text-[13px] tracking-wide`}
        >
          <Link href={`/${article.category}/`} className="text-brand-copper hover:underline">
            ← More {categoryLabel}
          </Link>
          <Link href="/contact/" className="text-brand-copper hover:underline">
            Get in touch →
          </Link>
        </div>
      </section>
    </main>
  );
}
