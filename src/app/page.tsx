import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "../../lib/markdown";

export default function Home() {
  const articles = getAllArticles();
  const stories = articles.slice(0, 3);

  return (
    <main className="font-sans antialiased bg-white text-black">
      {/* 1. Hero Section */}
      <section className="bg-brand-beige py-20 px-6 md:px-12 lg:px-24 border-b border-brand-darkbeige">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="md:w-1/2 flex flex-col items-start text-left space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-brand-brown uppercase leading-[0.9] tracking-tighter font-extrabold mb-2">
              Madam <br /> Ambition
            </h1>
            <h2 className="text-xl md:text-2xl font-serif text-brand-brown font-bold tracking-[0.2em] uppercase">
              Selena Trotter
            </h2>
            <div className="space-y-2">
              <p className="text-lg text-gray-900 font-semibold tracking-wide">
                Executive Coach for Women in Finance and Tech
              </p>
              <p className="text-base text-gray-700 leading-relaxed max-w-md font-light">
                Building up Career Success for Trail-Blazing Women<br />
                Women&apos;s Life Stories through the Lens of Career
              </p>
            </div>
            <Link 
              href="/#contact"
              className="mt-8 inline-block bg-black text-white px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all duration-300 shadow-sm"
            >
              Work with me
            </Link>
          </div>
          {/* Right Column (Image placeholder) */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <div className="w-full max-w-[600px] aspect-4/3 relative overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src="/articles/images/SelenaTrotter-MadamAmbition-Executive-Coaching-1.jpg" 
                alt="Selena Trotter - Madam Ambition Executive Coaching" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hi I'm Selena Section */}
      <section id="about" className="bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          {/* Left Column (Image Placeholder) */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-start">
             <div className="w-full max-w-[500px] aspect-5/6 relative bg-white shadow-xl border-8 border-brand-beige">
                <Image 
                  src="/articles/images/SelenaTrotter-MadamAmbition-97.jpg" 
                  alt="Selena Trotter" 
                  fill
                  className="object-cover"
                />
             </div>
          </div>
          {/* Right Column */}
          <div className="md:w-1/2 flex flex-col items-start space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-copper leading-tight tracking-tight">
              Hi, I&apos;m Selena Trotter,<br />
              <span className="text-brand-brown">your Executive Coach</span>
            </h2>
            <div className="text-base text-gray-600 font-light leading-relaxed space-y-6 max-w-xl">
              <p>
                Selena is the founder of Madam Ambition, a resource to help share the stories of women&apos;s careers paths. She is also an Executive Coach to Trailblazing women. Selena has a passion for helping women succeed, which she developed from her own experiences as an entrepreneur, corporate, public, and non-profit work, as well as being a mother of three daughters.
              </p>
              <p>
                Selena understands that advancing the cause of women to bring about socio-economic justice for more communities globally requires the engagement of both men and women. She is committed to working collaboratively with all genders to create inclusive environments in business and society where everyone can thrive.
              </p>
            </div>
            <Link 
              href="/#about"
              className="inline-block bg-black text-white px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all"
            >
              About Madam Ambition
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Executive Coaching Section */}
      <section id="executive-coaching" className="bg-brand-copper py-24 px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-20">
          {/* Quote Column */}
          <div className="lg:w-1/3 flex flex-col space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif italic text-brand-beige leading-tight">
              &ldquo;Becoming is better than<br />being&rdquo;
            </h2>
            <p className="text-xs font-sans uppercase tracking-[0.3em] font-bold opacity-80 border-t border-white/20 pt-4 self-start">
              — Dr. Carol S Dweck, PhD
            </p>
          </div>
          {/* Bullets Column */}
          <div className="lg:w-2/3 flex flex-col">
            <h3 className="text-3xl font-serif font-extrabold tracking-wide mb-10 text-brand-beige border-b border-white/10 pb-4">Executive Coaching</h3>
            <ul className="space-y-6 text-sm md:text-base font-light leading-relaxed mb-12 max-w-2xl">
              <li className="flex gap-4 items-start"><span className="text-brand-beige text-xl mt-[-4px]">/</span> <span>Executive coaching for individuals who want to make a change in their work lives, who seek success in their careers and to help their companies grow</span></li>
              <li className="flex gap-4 items-start"><span className="text-brand-beige text-xl mt-[-4px]">/</span> <span>Coaching services that provide you with practical skills while also bespoke services to help you advance</span></li>
              <li className="flex gap-4 items-start"><span className="text-brand-beige text-xl mt-[-4px]">/</span> <span>We specialize in working with executives to help overcome current problems and achieve their ambitions</span></li>
              <li className="flex gap-4 items-start"><span className="text-brand-beige text-xl mt-[-4px]">/</span> <span>Our 6-month contract provides the necessary time and commitment to see real results – We work one-on-one so we can focus on your specific needs and wants</span></li>
              <li className="flex gap-4 items-start"><span className="text-brand-beige text-xl mt-[-4px]">/</span> <span>We offer group support to build communities of support from different perspectives to help others develop together</span></li>
            </ul>
            <Link 
              href="/#executive-coaching"
              className="self-start bg-brand-beige text-brand-brown px-12 py-5 uppercase text-xs tracking-[0.2em] font-bold hover:bg-white transition-all shadow-md"
            >
              Register for Coaching
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Women's Career Stories Section */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl font-serif font-extrabold text-brand-brown mb-20 text-center tracking-tight uppercase">Women&apos;s Career Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full mb-20">
            {stories.map((article) => (
              <div key={article.slug} className="flex flex-col items-center text-center group">
                <div className="w-56 h-56 rounded-full overflow-hidden relative bg-gray-100 shadow-md border-[6px] border-white group-hover:scale-105 transition-transform duration-500 mb-8">
                  <Image 
                    src={article.mainImage || "/articles/images/placeholder.jpg"} 
                    alt={article.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                  />
                </div>
                <h4 className="font-serif font-bold text-brand-copper text-xl mb-4 leading-tight group-hover:text-brand-brown transition-colors">{article.title}</h4>
                <div className="w-10 h-px bg-brand-beige mb-6 group-hover:w-24 transition-all duration-500"></div>
                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-[280px] line-clamp-4">
                  {article.content.replace(/[#*_\[\]]/g, '').substring(0, 200)}...
                </p>
                <Link href={`/${article.slug}`} className="mt-6 text-[10px] uppercase tracking-[0.3em] font-bold text-brand-copper border-b border-transparent hover:border-brand-copper transition-all pb-1">
                  Read More
                </Link>
              </div>
            ))}
          </div>
          
          <Link 
            href="/articles"
            className="bg-black text-white px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all"
          >
            All Career Stories
          </Link>
        </div>
      </section>

      {/* 5. Join Facebook Section */}
      <section className="bg-brand-beige py-32 px-6 text-center border-b border-brand-darkbeige overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-white opacity-40"></div>
        <div className="max-w-2xl mx-auto relative z-10">
          <h3 className="text-3xl font-serif font-extrabold text-brand-brown mb-6 tracking-wide">Join me on Facebook</h3>
          <p className="text-gray-700 font-light mb-10 text-lg leading-relaxed italic">
            &ldquo;to learn about mentorship opportunities and hear from the leaders.&rdquo;
          </p>
          <button className="bg-black text-white px-12 py-5 uppercase text-xs tracking-[0.3em] font-bold hover:bg-brand-nav transition-all shadow-md">
            Follow Madam Ambition
          </button>
        </div>
      </section>
      
      {/* 6. Let's Chat Section */}
      <section id="contact" className="bg-white py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24">
           {/* Image Frame */}
           <div className="md:w-1/2 w-full flex justify-center">
              <div className="w-full max-w-[500px] aspect-4/3 relative">
                <div className="absolute -top-6 -left-6 w-full h-full border-2 border-brand-beige z-0"></div>
                <div className="relative z-10 w-full h-full border-8 border-white shadow-2xl overflow-hidden">
                  <Image 
                    src="/articles/images/SelenaTrotter-MadamAmbition-45.jpg" 
                    alt="Contact Selena Trotter" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
           </div>
           {/* Text Content */}
           <div className="md:w-1/2 flex flex-col text-left space-y-8">
             <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-copper leading-tight tracking-tight">Let&apos;s chat</h3>
             <p className="text-lg text-gray-600 font-light leading-relaxed max-w-lg">
               Book a complimentary call to explore if Executive Coaching is right for you. We create community for women trail blazers, help leaders feel greater peace, ease and joy through our executive coaching programs.
             </p>
             <button className="bg-black text-white self-start px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all shadow-lg">
               Get in touch
             </button>
           </div>
        </div>
      </section>

      {/* 7. Image Quote Section */}
       <section className="relative h-[600px] w-full bg-slate-900 flex items-center justify-center px-10 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/articles/images/SelenaTrotter-MadamAmbition-58.jpg" 
            alt="Background Quote" 
            fill
            className="object-cover opacity-30 grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 z-5"></div>
        
        <div className="relative z-10 max-w-4xl text-center">
          <p className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-white leading-tight font-extrabold mb-10 drop-shadow-2xl">
            &ldquo;Let go of who you think you&apos;re supposed to be; embrace who you are.&rdquo;
          </p>
          <div className="inline-block px-12 py-0.5 bg-brand-beige/30 backdrop-blur-xs mb-4"></div>
          <p className="text-brand-beige text-lg font-bold tracking-[0.4em] uppercase">
            – Brené Brown
          </p>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="w-full font-sans">
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Brand Column */}
          <div className="md:w-1/3 bg-brand-nav p-16 md:p-20 text-white flex flex-col">
             <h4 className="font-serif text-2xl font-bold tracking-widest mb-10 text-brand-beige uppercase">About Madam Ambition</h4>
             <p className="font-light text-base leading-relaxed max-w-sm opacity-80">
               Sharing knowledge is powerful. Women tell their stories and career paths to empower you to learn about different professions. The empowerment of women and uplifting their voices to help others to learn and discover the paths available to them.
             </p>
             <div className="mt-auto pt-12 flex flex-col gap-2">
                <span className="text-brand-accent font-serif text-3xl font-extrabold tracking-widest">MA</span>
                <span className="text-[10px] tracking-[0.5em] opacity-40">EST. 2023</span>
             </div>
          </div>
          {/* Navigation and Social Columns */}
          <div className="md:w-2/3 bg-brand-beige p-16 md:p-20 flex flex-col md:flex-row gap-20 text-brand-brown">
             <div className="flex-1">
                <h4 className="font-bold tracking-[0.2em] mb-10 text-xs uppercase text-black border-b border-brand-brown/10 pb-4">Explore</h4>
                <ul className="space-y-6 text-sm font-bold uppercase tracking-widest">
                  <li><Link href="/#about" className="hover:text-brand-copper transition-all inline-block hover:translate-x-2 duration-300">About Madam Ambition</Link></li>
                  <li><Link href="/#executive-coaching" className="hover:text-brand-copper transition-all inline-block hover:translate-x-2 duration-300">Executive Coaching</Link></li>
                  <li><Link href="/articles" className="hover:text-brand-copper transition-all inline-block hover:translate-x-2 duration-300">Career Stories</Link></li>
                  <li><Link href="/#contact" className="hover:text-brand-copper transition-all inline-block hover:translate-x-2 duration-300">Contact</Link></li>
                </ul>
             </div>
             <div className="flex-1">
                <h4 className="font-bold tracking-[0.2em] mb-10 text-xs uppercase text-black border-b border-brand-brown/10 pb-4">Social Media Follow</h4>
                <div className="flex gap-4">
                  <span className="w-12 h-12 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-lg hover:bg-brand-brown hover:scale-110 transition-all cursor-pointer shadow-sm">F</span>
                  <span className="w-12 h-12 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-lg hover:bg-brand-brown hover:scale-110 transition-all cursor-pointer shadow-sm">I</span>
                  <span className="w-12 h-12 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-lg hover:bg-brand-brown hover:scale-110 transition-all cursor-pointer shadow-sm">X</span>
                  <span className="w-12 h-12 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-lg hover:bg-brand-brown hover:scale-110 transition-all cursor-pointer shadow-sm">in</span>
                </div>
                <p className="mt-12 text-xs font-light max-w-[200px] leading-relaxed italic opacity-70">
                  Connect with our community of trailblazing professional women.
                </p>
             </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="bg-brand-brown py-8 text-brand-beige text-[10px] tracking-[0.35em] px-10 md:px-20 border-t border-white/5 uppercase">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex gap-8">
               <p>© 2026 Madam Ambition</p>
               <p className="opacity-50 hidden sm:block">All rights reserved</p>
             </div>
             <p className="text-center font-bold">Website designed and maintained by CREATIVA</p>
           </div>
        </div>
      </footer>
    </main>
  );
}
