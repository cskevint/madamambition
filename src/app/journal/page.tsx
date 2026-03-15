"use client";

import Image from "next/image";

export default function Journal() {
  return (
    <main className="font-sans antialiased bg-white text-black">
      {/* 1. Hero Section */}
      <section className="bg-brand-beige py-20 px-6 md:px-12 lg:px-24 border-b border-brand-darkbeige overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="md:w-1/2 flex flex-col items-start text-left space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-brand-brown uppercase leading-[0.9] tracking-tighter font-extrabold mb-2">
              Mindset <br /> Journal
            </h1>
            <p className="text-lg text-gray-800 font-light leading-relaxed max-w-lg">
              Are you ready to tackle your to-do list, make audacious goals and set your self up for
              success? Download this journal to help you reflect, plan and act in a meditative space
              so you build in yourself the capacity for true growth.
            </p>
          </div>
          {/* Right Column (Image) */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-end">
            <div className="w-full max-w-[600px] aspect-1024/681 relative overflow-hidden shadow-2xl border-8 border-white">
              <Image
                src="/articles/images/SelenaTrotter-MadamAmbition-Executive-Coaching-copy.jpg"
                alt="Mindset Journal"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Detail Section */}
      <section className="bg-white py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          {/* Left Column: Mockup Image */}
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-[450px] aspect-754/1024 relative shadow-xl overflow-hidden rounded-sm">
              <Image
                src="/articles/images/Journalmockup-1-scaled.jpg"
                alt="Journal Mockup"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Text and Form */}
          <div className="md:w-1/2 flex flex-col space-y-8">
            <div className="space-y-6 text-gray-800 font-light leading-relaxed text-lg">
              <p>
                This journal was written to help you work on your mindset. A person who is in space
                to reflect and grow is able to accomplish more than one who is fixed in their ways
                and not ready to admit the need to push oneself further.
              </p>
              <p>
                Using a journal to give yourself time to plan, prioritize and space to act, while
                also giving you mindfulness moments and art. This journal can be used over and over
                again as you make new goals that push yourself farther.
              </p>
            </div>

            {/* Newsletter / Download Form Placeholder */}
            <div className="bg-brand-beige p-8 md:p-10 border border-brand-darkbeige shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-serif font-extrabold text-brand-brown">
                  Download the Journal
                </h3>
                <p className="text-sm text-gray-600">
                  Join our community and get your free mindset journal.
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col space-y-1">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 bg-white border border-brand-darkbeige focus:border-brand-copper outline-none transition-colors text-sm"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-white border border-brand-darkbeige focus:border-brand-copper outline-none transition-colors text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white px-8 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all duration-300"
                >
                  Get the Journal
                </button>
              </form>
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                Powered by Madam Ambition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quote or Callout */}
      <section className="bg-brand-copper py-16 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl md:text-2xl font-serif italic text-brand-beige">
            &ldquo;A meditative space to build in yourself the capacity for true growth.&rdquo;
          </p>
        </div>
      </section>
    </main>
  );
}
