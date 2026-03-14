import type { Metadata } from "next";
import { Abril_Fatface, Marcellus } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

const abril = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://madamambition.com"),
  title: "Madam Ambition - Executive Coach for Women in Finance and Tech",
  description: "Selena Trotter, Executive Coach for Women in Finance and Tech. Building Women's Careers without Losing Women.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${marcellus.variable} ${abril.variable} font-sans antialiased text-black bg-white`}
      >
        <header className="sticky top-0 z-50 w-full bg-brand-nav border-b border-brand-greyblue/30 shadow-md">
          <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            {/* Logo area */}
            <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
              <span className="font-serif text-3xl md:text-4xl font-extrabold tracking-[0.2em] text-brand-beige">MA</span>
              <div className="w-12 h-px bg-brand-accent/50 mt-1"></div>
              <span className="text-[9px] tracking-[0.6em] text-brand-accent mt-1.5 font-bold uppercase">Madam Ambition</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-12">
              <div className="flex space-x-8 text-[11px] uppercase tracking-[0.25em] font-bold">
                <Link href="/" className="text-brand-beige hover:text-brand-accent transition-colors">Home</Link>
                <Link href="/#about" className="text-brand-beige hover:text-brand-accent transition-colors">About</Link>
                <Link href="/#executive-coaching" className="text-brand-beige hover:text-brand-accent transition-colors">Executive Coaching</Link>
                <Link href="/articles" className="text-brand-beige hover:text-brand-accent transition-colors">Articles</Link>
                <Link href="/#contact" className="text-brand-beige hover:text-brand-accent transition-colors">Contact</Link>
              </div>
              
              <Link 
                href="/#contact" 
                className="bg-brand-copper text-white px-6 py-2.5 text-[10px] uppercase tracking-widest font-extrabold hover:bg-white hover:text-brand-brown transition-all duration-300 rounded-sm"
              >
                Book a Call
              </Link>
            </div>

            {/* Mobile Menu Button - Placeholder for mobile component */}
            <div className="lg:hidden flex items-center">
               <button className="text-brand-beige p-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
                 </svg>
               </button>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
