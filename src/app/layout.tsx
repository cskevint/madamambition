import type { Metadata } from "next";
import { Abril_Fatface, Marcellus } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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
  description:
    "Selena Trotter, Executive Coach for Women in Finance and Tech. Building Women's Careers without Losing Women.",
};

import Footer from "@/components/Footer";

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
        <header className="sticky top-0 z-50 w-full bg-brand-nav border-b border-brand-greyblue/30 shadow-sm">
          <nav className="max-w-7xl mx-auto px-6 h-[114px] flex items-center justify-between">
            {/* Logo area - Image only as per original */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="relative h-[91px] w-[91px]">
                <Image
                  src="/articles/images/Madam-Ambition-Logo-New-Colors-1.png"
                  alt="Madam Ambition"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - Exact menu items and styling */}
            <div className="hidden lg:flex items-center">
              <div className="flex space-x-6 text-[14px] font-semibold tracking-wide">
                <Link
                  href="/"
                  className="text-brand-beige/85 hover:text-brand-beige transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-brand-beige/85 hover:text-brand-beige transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/executive-coaching"
                  className="text-brand-beige/85 hover:text-brand-beige transition-colors"
                >
                  Executive Coaching
                </Link>
                <Link
                  href="/career-stories"
                  className="text-brand-beige/85 hover:text-brand-beige transition-colors"
                >
                  Career Stories
                </Link>
                <Link
                  href="/insights"
                  className="text-brand-beige/85 hover:text-brand-beige transition-colors"
                >
                  Insights
                </Link>
                <Link
                  href="/journal"
                  className="text-brand-beige/85 hover:text-brand-beige transition-colors"
                >
                  Journal
                </Link>
                <Link
                  href="/contact"
                  className="text-brand-beige/85 hover:text-brand-beige transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button className="text-brand-beige p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </header>
        {children}
        <Footer />
      </body>
    </html>
  );
}
