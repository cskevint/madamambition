import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full font-sans">
      <div className="flex flex-col md:flex-row min-h-[400px]">
        {/* Brand Column */}
        <div className="md:w-1/3 bg-brand-nav p-16 md:p-20 text-white flex flex-col">
          <h4 className="font-serif text-2xl font-bold tracking-widest mb-10 text-brand-beige uppercase">
            About Madam Ambition
          </h4>
          <p className="font-light text-base leading-relaxed max-w-sm opacity-80 text-brand-beige/80">
            Sharing knowledge is powerful. Women tell their stories and career paths to empower you
            to learn about different professions. The empowerment of women and uplifting their
            voices to help others to learn and discover the paths available to them.
          </p>
          <div className="mt-auto pt-12 flex flex-col gap-2">
            <span className="text-brand-accent font-serif text-3xl font-extrabold tracking-widest">
              MA
            </span>
            <span className="text-[10px] tracking-[0.5em] opacity-40">EST. 2023</span>
          </div>
        </div>
        {/* Navigation and Social Columns */}
        <div className="md:w-2/3 bg-brand-beige p-16 md:p-20 flex flex-col md:flex-row gap-20 text-brand-brown">
          <div className="flex-1">
            <h4 className="font-bold tracking-[0.2em] mb-10 text-xs uppercase text-black border-b border-brand-brown/10 pb-4">
              Explore
            </h4>
            <ul className="space-y-6 text-sm font-bold uppercase tracking-widest">
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-copper transition-all inline-block hover:translate-x-2 duration-300"
                >
                  About Madam Ambition
                </Link>
              </li>
              <li>
                <Link
                  href="/executive-coaching"
                  className="hover:text-brand-copper transition-all inline-block hover:translate-x-2 duration-300"
                >
                  Executive Coaching
                </Link>
              </li>
              <li>
                <Link
                  href="/career-stories"
                  className="hover:text-brand-copper transition-all inline-block hover:translate-x-2 duration-300"
                >
                  Career Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-brand-copper transition-all inline-block hover:translate-x-2 duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h4 className="font-bold tracking-[0.2em] mb-10 text-xs uppercase text-black border-b border-brand-brown/10 pb-4">
              Social Media Follow
            </h4>
            <div className="flex gap-4">
              <span className="w-12 h-12 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-lg hover:bg-brand-brown hover:scale-110 transition-all cursor-pointer shadow-sm">
                F
              </span>
              <span className="w-12 h-12 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-lg hover:bg-brand-brown hover:scale-110 transition-all cursor-pointer shadow-sm">
                I
              </span>
              <span className="w-12 h-12 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-lg hover:bg-brand-brown hover:scale-110 transition-all cursor-pointer shadow-sm">
                X
              </span>
              <span className="w-12 h-12 rounded-full bg-brand-copper text-white flex items-center justify-center font-bold text-lg hover:bg-brand-brown hover:scale-110 transition-all cursor-pointer shadow-sm">
                in
              </span>
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
  );
}
