import Link from "next/link";
import Image from "next/image";

export default function ExecutiveCoaching() {
  return (
    <main className="font-sans antialiased bg-white text-black">
      {/* 1. Hero Section */}
      <section className="bg-brand-beige py-20 px-6 md:px-12 lg:px-24 border-b border-brand-darkbeige overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="md:w-1/2 flex flex-col items-start text-left space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-brand-brown uppercase leading-[0.9] tracking-tighter font-extrabold mb-2">
              Executive <br /> Coaching
            </h1>
          </div>
          {/* Right Column (Image) */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <div className="w-full max-w-[600px] aspect-1500/1000 relative overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src="/articles/images/SelenaTrotter-Executive-coach-1.jpg" 
                alt="Selena Trotter - Executive Coaching" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Intro Section */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto space-y-8 text-lg text-gray-800 font-light leading-relaxed">
          <p>
            Meet Selena Trotter, a savvy Executive Coach who helps women unlock their full potential and make great achievements in their professional lives. With a wealth of experience in leadership development and a unique understanding of the profound challenges facing women in leadership, Selena is an expert at guiding her clients through the coaching process, helping them to identify their strengths, set ambitious and thoughtful goals, and develop practical plans to achieve them.
          </p>
          <p>
            Working with an Executive Coach is a potent tool for personal and professional growth. By working closely with a Coach like Selena, women can gain a new perspective on their skills and abilities, learn to overcome limiting beliefs and behaviors, and develop the confidence and competence they need to reach total capacity. Whether you&apos;re looking to take your career to the next level, improve your relationships with colleagues, bring emotional intelligence to your colleagues, or become a more effective leader, a partnership with Selena can help you achieve your ambitions and unlock your best future.
          </p>
        </div>
      </section>

      {/* 3. Mission & Values Section */}
      <section className="bg-brand-beige py-24 px-6 md:px-12 lg:px-24 border-y border-brand-darkbeige">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {/* Mission */}
          <div className="space-y-6">
            <h3 className="text-3xl font-serif font-extrabold text-brand-brown border-b border-brand-darkbeige pb-4">My Mission</h3>
            <p className="text-gray-700 font-light leading-relaxed">
              Time is of the essence to see women back in equal, if not stronger numbers, in the labor market. Women need to see in themselves the answer to so many of the problems facing our society. Whatever their career, women can make an impact. When women are seen in equal numbers within a given institution, the institution advances at a quicker pace.
            </p>
            <p className="text-gray-700 font-light leading-relaxed">
              It is goal of Selena to help advance the cause of women who work. Women are leaders by being examples to other women of what is possible when they are putting forth the effort to advance in their field and support younger generations alongside them.
            </p>
          </div>
          
          {/* Values */}
          <div className="space-y-6 flex flex-col">
            <h3 className="text-3xl font-serif font-extrabold text-brand-brown border-b border-brand-darkbeige pb-4">My Values</h3>
            <p className="text-gray-700 font-light leading-relaxed">
              I believe in supporting women, for in doing so all of humanity progresses. Young girls need direction and guidance earlier around careers, and all women need stronger support networks to foster mentorship and development. In supporting one, the other grows.
            </p>
            <Link 
              href="/contact"
              className="mt-8 self-start bg-black text-white px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all duration-300 shadow-sm"
            >
              Work with me
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Let's Chat Section */}
      <section className="bg-white py-32 px-6 md:px-12 lg:px-24">
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
               Book a complimentary coaching call to explore if executive coaching is right for you now. We create community for women trail blazers, help leaders feel greater peace, ease and joy through our Executive Coaching programs.
             </p>
             <Link 
               href="/contact"
               className="bg-black text-white self-start px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all shadow-lg text-center"
             >
               Get in touch
             </Link>
           </div>
        </div>
      </section>
    </main>
  );
}
