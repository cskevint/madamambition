import Image from "next/image";
import Link from "next/link";
import { getAllArticles } from "../../lib/markdown";

export default function Home() {
  const articles = getAllArticles();
  
  // Pick a couple of articles for the stories section
  const stories = articles.slice(0, 3);

  return (
    <main className="min-h-screen font-sans bg-brand-beige">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10 flex flex-col items-start pr-12 pb-12 md:pb-0">
          <h1 className="text-5xl md:text-7xl font-serif text-brand-copper leading-tight tracking-wide uppercase mb-4">
            Madam <br /> Ambition
          </h1>
          <h2 className="text-xl font-bold text-brand-brown mb-2 tracking-widest font-serif mt-2">
            Selena Trotter
          </h2>
          <p className="text-base text-gray-800 mb-2 leading-relaxed font-light">
            Executive Coach for Women in Finance and Tech
          </p>
          <p className="text-base text-gray-800 mb-8 leading-relaxed font-light">
            Building Women&apos;s Careers without Losing Women.<br/>
            Women&apos;s Life Stories through the lens of Career.
          </p>
          <button className="bg-black text-white px-8 py-3 tracking-widest text-xs font-semibold hover:bg-gray-800 transition">
            WORK WITH ME
          </button>
        </div>
        <div className="md:w-1/2 relative flex justify-end">
          <div className="absolute -inset-6 bg-brand-darkbeige -z-10 shadow-lg top-16 right-0 w-4/5 h-full"></div>
          <div className="relative w-full h-[450px] overflow-hidden shadow-xl">
             <div className="bg-brand-brown w-full h-full flex items-center justify-center text-white text-xl">Hero Image Placeholder</div>
          </div>
        </div>
      </section>

      {/* Hi I'm Selena Section */}
      <section id="about" className="bg-white py-24 flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-6">
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          <div className="relative w-4/5 h-[400px] overflow-hidden shadow-lg mx-auto">
             <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-600">Selena Image Placeholder</div>
          </div>
        </div>
        <div className="md:w-1/2 md:pl-16 flex flex-col items-start">
          <h2 className="text-4xl text-brand-copper font-serif leading-snug mb-6">
            <span className="bg-brand-beige px-1">Hi. I&apos;m Selena Trotter,</span>
            <br />
            <span className="bg-brand-beige px-1 mt-1 inline-block">your Executive Coach</span>
          </h2>
          <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
            Before my ten-year tenure in the corporate world, I attended University...
          </p>
          <p className="text-sm text-gray-600 font-light leading-relaxed mb-8">
            <strong className="font-bold">Madam Ambition is a boutique executive coaching practice</strong> dedicated to encouraging and elevating women&apos;s narratives...
          </p>
          <button className="bg-black text-white px-8 py-3 tracking-widest text-xs font-semibold hover:bg-gray-800 transition">
            REGISTER FOR COACHING
          </button>
        </div>
      </section>

      {/* Executive Coaching Section */}
      <section id="executive-coaching" className="bg-brand-brown text-white py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start space-y-12 md:space-y-0">
          <div className="md:w-1/3">
            <h2 className="text-4xl font-serif leading-snug italic font-normal">
              &ldquo;Becoming is better than<br/>being&rdquo;
            </h2>
            <p className="mt-4 text-sm font-light text-brand-beige italic">- Carol Dweck, Mindset: The New Psychology of Success</p>
          </div>
          <div className="md:w-2/3 md:pl-24">
            <h3 className="text-3xl font-serif mb-6 text-white ">Executive Coaching</h3>
            <ul className="space-y-4 text-sm font-light list-disc list-inside leading-relaxed mb-8 text-[#fff4e6]">
              <li>Are you seeking a leadership role and unsure how to navigate the internal politics?</li>
              <li>Has your manager mentioned you lack &quot;executive presence&quot;?</li>
              <li>Are you navigating a career transition and feeling overwhelmed?</li>
            </ul>
            <button className="bg-brand-darkbeige text-black px-8 py-3 tracking-widest text-xs font-bold hover:bg-white transition">
              REGISTER FOR COACHING
            </button>
          </div>
        </div>
      </section>

      {/* Career Stories Section */}
      <section className="bg-white py-24 px-6 flex flex-col items-center text-center">
        <h2 className="text-3xl font-serif text-brand-copper mb-16">Women&apos;s Career Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-16">
          {stories.map(article => (
            <div key={article.slug} className="flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg relative">
                {article.mainImage ? (
                  <Image src={article.mainImage} alt={article.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
              </div>
              <h4 className="font-serif font-bold text-brand-brown text-lg">{article.title}</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
                {article.content.replace(/[#*_\[\]]/g, '').substring(0, 150)}...
              </p>
              <Link href={`/${article.slug}`} className="text-xs tracking-widest text-brand-copper underline mt-2 hover:text-black transition">
                READ MORE
              </Link>
            </div>
          ))}
        </div>
        <button className="bg-black text-white px-8 py-3 tracking-widest text-xs font-semibold hover:bg-gray-800 transition">
          WORK WITH ME IN COACHING
        </button>
      </section>
      
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
