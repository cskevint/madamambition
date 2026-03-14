import { getAllArticles, getArticleBySlug } from "../../../lib/markdown";
import ReactMarkdown from 'react-markdown';
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
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
    <main className="bg-white min-h-screen font-sans antialiased">
      {/* Article Header */}
      <header className="bg-brand-beige py-24 px-6 md:px-12 lg:px-24 border-b border-brand-darkbeige">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className="flex gap-4 items-center">
            <span className="text-[10px] font-bold text-brand-copper uppercase tracking-[0.4em]">Journal Entry</span>
            <div className="w-12 h-[1px] bg-brand-brown/20"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-brown font-extrabold tracking-tight leading-tight">
            {article.title}
          </h1>
          <div className="pt-4">
             <Link href="/articles" className="text-[10px] uppercase tracking-[0.2em] font-normal text-gray-500 hover:text-brand-copper transition-colors">
               ← Back to Archive
             </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row py-24 px-6 md:px-12 lg:px-24 gap-20">
        
        {/* Left: Article Body */}
        <article className="lg:w-2/3">
          {/* Main Image Placeholder */}
          <div className="w-full aspect-video bg-gray-100 border border-gray-200 mb-16 flex items-center justify-center text-center relative shadow-sm">
             <div className="text-gray-400 font-serif italic text-lg opacity-60">
               [PRINCIPAL ARTICLE IMAGE]<br/>
               <span className="text-[10px] font-sans not-italic uppercase tracking-widest mt-2 block">
                {article.mainImage || 'Default Article Image'}
               </span>
             </div>
          </div>

          <div className="prose prose-stone lg:prose-xl max-w-none text-gray-800 font-light leading-relaxed markdown-content 
            prose-headings:font-serif prose-headings:text-brand-brown prose-headings:font-extrabold 
            prose-p:mb-8 prose-strong:font-bold prose-strong:text-black prose-blockquote:border-l-brand-beige prose-blockquote:italic">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </article>

        {/* Right: Sidebar / Related Info */}
        <aside className="lg:w-1/3 space-y-16">
          <div className="bg-brand-beige/30 p-10 border border-brand-beige">
            <h4 className="font-serif text-xl font-bold text-brand-brown mb-6">About the Author</h4>
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-6 border-4 border-white shadow-sm flex items-center justify-center text-[10px] text-gray-400 uppercase tracking-tighter text-center px-4 leading-tight">
              [Selena Portrait]
            </div>
            <p className="text-sm text-gray-600 font-light leading-relaxed mb-8">
              Selena Trotter is an Executive Coach for women in Finance and Tech, helping them build careers they love without losing themselves.
            </p>
            <Link href="/#about" className="text-[10px] font-bold uppercase tracking-widest text-brand-copper border-b border-brand-copper pb-1">Learn More</Link>
          </div>

          <div>
            <h4 className="font-serif text-xl font-bold text-brand-brown mb-8">Executive Coaching</h4>
            <div className="bg-brand-nav p-8 text-white">
              <p className="text-sm font-light leading-relaxed mb-6 opacity-80">
                Ready to take the next step towards a revitalized career? 
              </p>
              <Link href="/#contact" className="block text-center bg-brand-copper text-white py-4 uppercase text-[10px] tracking-widest font-bold hover:bg-white hover:text-brand-brown transition-all">
                Let&apos;s Chat
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Navigation Footer */}
      <section className="bg-brand-beige py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
           <Link href="/articles" className="text-gray-400 hover:text-brand-copper">← Archive</Link>
           <div className="text-brand-brown opacity-20 hidden md:block">Madam Ambition Journal</div>
           <Link href="/#contact" className="text-brand-copper hover:text-brand-brown">Coaching →</Link>
        </div>
      </section>
    </main>
  );
}
