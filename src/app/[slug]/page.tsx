import { getAllArticles, getArticleBySlug } from "../../../lib/markdown";
import ReactMarkdown from 'react-markdown';
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = getArticleBySlug(slug);
  
  if (!article) return { title: 'Not Found' };
  
  return {
    title: `${article.title} | Madam Ambition`,
    description: article.content.substring(0, 160).replace(/[#*_\[\]]/g, ''),
    openGraph: {
      images: [article.mainImage || '/default-image.jpg'],
      url: `https://madamambition.com/${slug}`,
      type: 'article',
    },
  }
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

  return (
    <main className="bg-brand-beige min-h-screen pb-24">
      <article className="max-w-4xl mx-auto px-6 pt-24 pb-12 bg-white font-sans shadow-lg mb-12 relative top-12 z-10">
        {article.mainImage && (
          <div className="w-full h-[400px] mb-12 overflow-hidden shadow-xl rounded-sm relative">
            <Image src={article.mainImage} alt={article.title} fill className="object-cover" />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-serif text-brand-brown mb-8 leading-tight">
          {article.title}
        </h1>
        <div className="prose prose-stone lg:prose-lg max-w-none text-gray-800 font-light leading-relaxed markdown-content">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
      
      {/* Footer Contact Form */}
      <section id="contact" className="py-24 bg-brand-beige border-t border-brand-darkbeige bg-linear-to-b from-brand-beige to-brand-darkbeige">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row bg-white shadow-xl">
           <div className="md:w-1/2 min-h-[300px] bg-gray-200"></div>
           <div className="md:w-1/2 p-12 flex flex-col justify-center">
             <h3 className="text-3xl font-serif text-brand-copper mb-4">Let&apos;s chat</h3>
             <p className="text-sm font-light text-gray-600 mb-8 leading-relaxed">
               Ready to take the next step towards a revitalized career? Connect with me to see if my services are right for you.
             </p>
             <button className="bg-black text-white px-8 py-3 tracking-widest text-xs font-semibold self-start hover:bg-gray-800 transition">
               GET IN TOUCH
             </button>
           </div>
        </div>
      </section>

      <footer className="bg-brand-brown text-center pt-24 text-white">
        <div className="bg-black text-white py-12 px-6 flex flex-col items-center">
          <p className="font-serif text-3xl italic max-w-2xl leading-normal mb-4">
            &quot;Let go of who you think you&apos;re supposed to be; embrace who you are.&quot;
          </p>
          <p className="font-sans font-bold text-sm tracking-widest">— Brené Brown</p>
        </div>
        
        <div className="bg-brand-greyblue py-16 px-6 relative flex justify-center text-sm font-light">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left text-white">
            <div>
              <h4 className="font-bold tracking-wider mb-4 uppercase text-[#d1ba98]">About Madam Ambition</h4>
              <p className="leading-relaxed">Madam Ambition is an executive coaching and career platform dedicated to elevating women in Tech and Finance.</p>
            </div>
            <div>
              <h4 className="font-bold tracking-wider mb-4 uppercase text-[#d1ba98]">Explore</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-brand-beige transition">Home</Link></li>
                <li><Link href="/articles" className="hover:text-brand-beige transition">All Articles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold tracking-wider mb-4 uppercase text-[#d1ba98]">Social Media Links</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <span className="w-8 h-8 rounded-full bg-brand-brown flex items-center justify-center">F</span>
                <span className="w-8 h-8 rounded-full bg-brand-brown flex items-center justify-center">I</span>
                <span className="w-8 h-8 rounded-full bg-brand-brown flex items-center justify-center">L</span>
                <span className="w-8 h-8 rounded-full bg-brand-brown flex items-center justify-center">T</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-brand-nav text-[#d1ba98] py-4 text-xs tracking-widest">
           <p>© 2026 Madam Ambition. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
