"use client";

import Image from "next/image";
import { useState } from "react";
import { sendEmail } from "./actions";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await sendEmail(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="font-sans antialiased bg-white text-black min-h-screen">
        <section className="bg-brand-beige py-24 px-6 md:px-12 lg:px-24 border-b border-brand-darkbeige text-center">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif text-brand-brown uppercase font-extrabold tracking-tight">
              Thank You
            </h1>
            <p className="text-xl text-gray-700 font-light">Your message has been sent successfully. I&apos;ll get back to you soon.</p>
            <div className="pt-8">
               <button 
                 onClick={() => setSubmitted(false)}
                 className="bg-black text-white px-10 py-4 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all shadow-lg"
               >
                 Send another message
               </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="font-sans antialiased bg-white text-black">
      {/* 1. Hero Section */}
      <section className="bg-brand-beige py-24 px-6 md:px-12 lg:px-24 border-b border-brand-darkbeige">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif text-brand-brown uppercase font-extrabold tracking-tight">
            Contact Madam Ambition
          </h1>
          <p className="text-xl text-gray-700 font-light italic">
            We&apos;d love to hear from you!
          </p>
          <div className="w-20 h-px bg-brand-brown/20"></div>
        </div>
      </section>

      {/* 2. Contact Content Section */}
      <section className="bg-white py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24">
           {/* Image Frame */}
           <div className="md:w-1/2 w-full flex justify-center">
              <div className="w-full max-w-[500px] aspect-665/1000 relative">
                <div className="absolute -top-6 -left-6 w-full h-full border-2 border-brand-beige z-0"></div>
                <div className="relative z-10 w-full h-full border-8 border-white shadow-2xl overflow-hidden">
                  <Image 
                    src="/articles/images/SelenaTrotter-MadamAmbition-68.jpg" 
                    alt="Contact Selena Trotter" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
           </div>
           
           {/* Form Content */}
           <div className="md:w-1/2 flex flex-col text-left space-y-8 w-full">
             <p className="text-lg text-gray-800 font-light leading-relaxed max-w-lg">
               Whether you&apos;d like to share your story with us or want to work with me, please contact me using the form on this page.
             </p>
             
             <form action={handleSubmit} className="space-y-6 w-full max-w-lg">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-brand-brown">Name *</label>
                  <input 
                    id="name"
                    name="name"
                    type="text" 
                    required
                    className="w-full px-4 py-4 bg-brand-beige/30 border border-brand-darkbeige focus:border-brand-copper outline-none transition-colors text-base font-light"
                    placeholder="Your Name"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest font-bold text-brand-brown">Email *</label>
                  <input 
                    id="email"
                    name="email"
                    type="email" 
                    required
                    className="w-full px-4 py-4 bg-brand-beige/30 border border-brand-darkbeige focus:border-brand-copper outline-none transition-colors text-base font-light"
                    placeholder="Your Email Address"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-widest font-bold text-brand-brown">Message *</label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-4 bg-brand-beige/30 border border-brand-darkbeige focus:border-brand-copper outline-none transition-colors text-base font-light resize-none"
                    placeholder="How can I help you?"
                  ></textarea>
                </div>
                
                {error && (
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                )}
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white px-12 py-5 uppercase text-xs tracking-[0.2em] font-bold hover:bg-brand-nav transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
             </form>
           </div>
        </div>
      </section>

      {/* 3. Socials Sub-section */}
      <section className="bg-brand-beige py-24 px-6 md:px-12 lg:px-24 text-center border-t border-brand-darkbeige">
        <div className="max-w-4xl mx-auto space-y-8">
          <h4 className="text-2xl font-serif text-brand-brown font-extrabold uppercase tracking-wide">Follow the Journey</h4>
          <div className="flex justify-center space-x-12">
             {["Facebook", "Instagram", "LinkedIn"].map((social) => (
               <a key={social} href="#" className="text-brand-copper hover:text-brand-brown font-bold uppercase text-[10px] tracking-[0.3em] transition-colors">
                 {social}
               </a>
             ))}
          </div>
        </div>
      </section>
    </main>
  );
}
