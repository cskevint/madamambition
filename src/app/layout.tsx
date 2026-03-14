import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
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
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <nav className="bg-brand-nav text-brand-beige px-8 py-5 flex items-center justify-between border-b border-brand-greyblue">
          <div className="flex flex-col items-center">
            <span className="font-serif text-3xl font-normal tracking-widest text-brand-accent">MA</span>
            <span className="text-[10px] tracking-widest text-[#d1ba98] mt-1">WWW</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm text-[#d1ba98] font-light">
            <Link href="/" className="text-brand-copper hover:text-brand-beige transition">Home</Link>
            <Link href="/#about" className="text-brand-copper hover:text-brand-beige transition">About</Link>
            <Link href="/#executive-coaching" className="text-brand-copper hover:text-brand-beige transition">Executive Coaching</Link>
            <Link href="/pb-type-i" className="text-brand-copper hover:text-brand-beige transition">PB Type I</Link>
            <Link href="/#contact" className="text-brand-copper hover:text-brand-beige transition">Contact</Link>
            <Link href="/articles" className="text-brand-copper hover:text-brand-beige transition">Articles</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
