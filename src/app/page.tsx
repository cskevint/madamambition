import Link from "next/link";
import { getAllArticles } from "../../lib/markdown";

export default function Home() {
  const articles = getAllArticles();
  const stories = articles.slice(0, 3);

  return (
    <main className="font-sans antialiased bg-white text-black">
      {/* 1. Hero Section */}
      <section className="bg-brand-beige py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="md:w-1/2 flex flex-col items-start text-left space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-copper uppercase tracking-wider font-extrabold mb-2">
              Madam <br /> Ambition
            </h1>
            <h2 className="text-xl md:text-2xl font-serif text-brand-copper font-bold tracking-widest uppercase mb-4">
              Selena Trotter
            </h2>
            <p className="text-base text-gray-800 font-medium">
              Executive Coach for Women in Finance and Tech
            </p>
            <p className="text-sm text-gray-700 leading-relaxed max-w-md">
              Building up Career Success for Trail-Blazing Women<br />
              Women&apos;s Life Stories through the Lens of Career
            </p>
            <Link 
              href="/#contact"
              className="mt-6 inline-block bg-black text-white px-8 py-4 uppercase text-xs tracking-widest font-semibold hover:bg-gray-800 transition"
            >
              Work with me
            </Link>
          </div>
          {/* Right Column (Image placeholder) */}
          <div className="md:w-1/2 w-full h-[400px] md:h-[500px] relative bg-gray-200">
             <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium border border-gray-300">
               Placeholder: Selena in Restaurant/Bar (SelenaTrotter-MadamAmbition-Executive-Coaching-1.jpg)
             </div>
          </div>
        </div>
      </section>

      {/* 2. Hi I'm Selena Section */}
      <section id="about" className="bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          {/* Left Column (Image Placeholder) */}
          <div className="md:w-1/2 w-full h-[450px] md:h-[600px] relative bg-gray-200">
             <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium text-center px-4 border border-gray-300">
               Placeholder: Selena leaning on desk (SelenaTrotter-MadamAmbition-97.jpg)
             </div>
          </div>
          {/* Right Column */}
          <div className="md:w-1/2 flex flex-col items-start space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-copper leading-tight">
              Hi, I&apos;m Selena Trotter,<br />
              your Executive Coach
            </h2>
            <div className="text-sm text-gray-600 font-light leading-loose space-y-4 max-w-lg">
              <p>
                Selena is the founder of Madam Ambition, a resource to help share the stories of women&apos;s careers paths. She is also an Executive Coach to Trailblazing women. Selena has a passion for helping women succeed, which she developed from her own experiences as an entrepreneur, corporate, public, and non-profit work, as well as being a mother of three daughters.
              </p>
              <p>
                Selena understands that advancing the cause of women to bring about socio-economic justice for more communities globally requires the engagement of both men and women. She is committed to working collaboratively with all genders to create inclusive environments in business and society where everyone can thrive.
              </p>
            </div>
            <Link 
              href="/#about"
              className="mt-4 inline-block bg-black text-white px-8 py-4 uppercase text-xs tracking-widest font-semibold hover:bg-gray-800 transition"
            >
              About Madam Ambition
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Executive Coaching Section */}
      <section id="executive-coaching" className="bg-brand-copper py-24 px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-16">
          {/* Quote Column */}
          <div className="lg:w-1/3 flex flex-col space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif italic text-white leading-snug">
              &ldquo;Becoming is better than<br />being&rdquo;
            </h2>
            <p className="text-sm font-light uppercase tracking-wide opacity-90 mt-2">
              — Dr. Carol S Dweck, PhD, Columbia University
            </p>
          </div>
          {/* Bullets Column */}
          <div className="lg:w-2/3 flex flex-col">
            <h3 className="text-2xl font-serif font-bold tracking-wide mb-8">Executive Coaching</h3>
            <ul className="list-disc pl-5 space-y-4 text-sm font-light leading-relaxed mb-10 max-w-3xl">
              <li>Executive coaching for individuals who want to make a change in their work lives, who seek success in their careers and to help their companies grow</li>
              <li>Coaching services that provide you with practical skills while also bespoke services to help you advance</li>
              <li>We specialize in working with executives to help overcome current problems and achieve their ambitions</li>
              <li>Our 6-month contract provides the necessary time and commitment to see real results – We work one-on-one so we can focus on your specific needs and wants</li>
              <li>We offer group support to build communities of support from different perspectives to help others develop together</li>
            </ul>
            <Link 
              href="/#executive-coaching"
              className="self-start bg-brand-beige text-black px-8 py-4 uppercase text-xs tracking-widest font-semibold hover:bg-white transition"
            >
              Executive Coaching
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Women's Career Stories Section */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-serif font-bold text-brand-copper mb-16 text-center">Women&apos;s Career Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-16">
            {stories.map((article, index) => (
              <div key={article.slug} className="flex flex-col items-center text-center space-y-4">
                <div className="w-48 h-48 rounded-full overflow-hidden relative bg-gray-200 shadow-xl border-4 border-white mb-2">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs px-4 text-center">
                    Placeholder: Portrait {index + 1}<br/>{article.title}
                  </div>
                </div>
                <h4 className="font-serif font-bold text-brand-copper text-lg px-4">{article.title}</h4>
                <p className="text-sm text-gray-600 font-light leading-relaxed max-w-sm px-4">
                  {article.content.replace(/[#*_\[\]]/g, '').substring(0, 160)}...
                </p>
              </div>
            ))}
          </div>
          
          <Link 
            href="/articles"
            className="bg-black text-white px-8 py-4 uppercase text-xs tracking-widest font-semibold hover:bg-gray-800 transition"
          >
            Read more career stories
          </Link>
        </div>
      </section>

      {/* 5. Join Facebook Section */}
      <section className="bg-brand-beige py-24 px-6 text-center">
        <h3 className="text-2xl font-serif font-bold text-brand-copper mb-4">Join me on Facebook</h3>
        <p className="text-gray-800 font-light mb-8 max-w-md mx-auto leading-relaxed">
          to learn about mentorship opportunities and hear from the leaders.
        </p>
        <button className="bg-black text-white px-8 py-4 uppercase text-xs tracking-widest font-semibold hover:bg-gray-800 transition">
          Follow Madam Ambition
        </button>
      </section>
      
      {/* 6. Let's Chat Section */}
      <section id="contact" className="bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
           <div className="md:w-1/2 w-full h-[400px] relative bg-gray-200">
             <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium text-center px-4 border border-gray-300">
               Placeholder: Someone pointing at laptop screen (SelenaTrotter-MadamAmbition-45.jpg)
             </div>
           </div>
           <div className="md:w-1/2 flex flex-col text-left space-y-6">
             <h3 className="text-4xl font-serif text-brand-copper leading-tight">Let&apos;s chat</h3>
             <p className="text-sm font-light text-gray-600 leading-relaxed max-w-md">
               Book a complimentary call to explore if Executive Coaching is right for you. We create community for women trail blazers, help leaders feel greater peace, ease and joy through our executive coaching programs.
             </p>
             <button className="bg-black text-white self-start px-8 py-4 uppercase text-xs tracking-widest font-semibold hover:bg-gray-800 transition">
               Get in touch
             </button>
           </div>
        </div>
      </section>

      {/* 7. Image Quote Section */}
      <section className="relative h-[500px] w-full bg-slate-800 flex items-center justify-center px-6">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium z-0">
          Placeholder: Background Workspace Image
        </div>
        <div className="relative z-10 max-w-3xl text-center">
          <p className="font-serif text-3xl md:text-4xl italic text-white leading-snug">
            &ldquo;Let go of who you think you&apos;re supposed to be; embrace who you are.&rdquo;
          </p>
          <p className="text-white text-sm font-medium tracking-wide mt-6">
            – Brené Brown
          </p>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="w-full font-sans">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-brand-greyblue p-12 md:p-16 text-white min-h-[350px]">
             <h4 className="font-bold tracking-widest mb-6 text-sm uppercase">About Madam Ambition</h4>
             <p className="font-light text-sm leading-relaxed max-w-xs">
               Sharing knowledge is powerful. Women tell their stories and career paths to empower you to learn about different professions. The empowerment of women and uplifting their voices to help others to learn and discover the paths available to them.
             </p>
          </div>
          <div className="md:w-2/3 bg-brand-beige p-12 md:p-16 flex flex-col md:flex-row gap-12 text-brand-brown">
             <div className="md:w-1/2">
                <h4 className="font-bold tracking-widest mb-6 text-sm uppercase text-black">Explore</h4>
                <ul className="space-y-3 text-sm font-light">
                  <li><Link href="/#about" className="hover:opacity-70 transition">About Madam Ambition</Link></li>
                  <li><Link href="/#executive-coaching" className="hover:opacity-70 transition">Executive Coaching</Link></li>
                  <li><Link href="/articles" className="hover:opacity-70 transition">Career Stories</Link></li>
                  <li><Link href="/#contact" className="hover:opacity-70 transition">Contact</Link></li>
                </ul>
             </div>
             <div className="md:w-1/2">
                <h4 className="font-bold tracking-widest mb-6 text-sm uppercase text-black">Social Media Follow</h4>
                <div className="flex space-x-3">
                  <span className="w-8 h-8 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-sm">F</span>
                  <span className="w-8 h-8 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-sm">I</span>
                  <span className="w-8 h-8 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-sm">X</span>
                  <span className="w-8 h-8 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-sm">in</span>
                </div>
             </div>
          </div>
        </div>
        <div className="bg-brand-brown py-6 text-white text-xs tracking-widest px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
           <p>© 2026 Madam Ambition  |  All rights reserved</p>
           <p>Website designed and maintained by CREATIVA</p>
        </div>
      </footer>
    </main>
  );
}
