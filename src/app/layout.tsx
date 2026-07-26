import type { Metadata } from "next";
import { Abril_Fatface, Lora, Marcellus } from "next/font/google";
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

// The pull-quote is set in Lora italic rather than the heading face.
const lora = Lora({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-quote",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://madamambition.com"),
  title: "Madam Ambition - Executive Coach for Women in Finance and Tech",
  description:
    "Selena Trotter, Executive Coach for Women in Finance and Tech. Building Women's Careers without Losing Women.",
};

import Footer from "@/components/Footer";
import { careerStoriesEnabled } from "../../lib/features";

// "Career Stories" appears only when the feature is enabled (lib/features.ts); it is off by
// default, matching the live nav, which dropped it when that content was unpublished.
// Position matches the pre-removal live nav.
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/executive-coaching/", label: "Executive Coaching" },
  ...(careerStoriesEnabled ? [{ href: "/career-stories/", label: "Career Stories" }] : []),
  { href: "/insights/", label: "Insights" },
  { href: "/journal/", label: "Journal" },
  { href: "/contact/", label: "Contact" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${marcellus.variable} ${abril.variable} ${lora.variable} font-sans antialiased text-black bg-white`}
      >
        <header className="sticky top-0 z-50 w-full bg-brand-nav shadow-[0_0_7px_0_rgba(0,0,0,0.1)]">
          {/* The live site swaps to its mobile header at 980px, so the desktop breakpoint is 981px
              rather than Tailwind's lg (1024px). */}
          <nav className="w-[80%] max-w-[1152px] mx-auto h-[80px] min-[981px]:h-[114px] flex items-center justify-between">
            {/* Logo area - Image only as per original */}
            <Link
              href="/"
              className="flex items-center ml-[5px] hover:opacity-80 transition-opacity"
            >
              <Image
                src="/articles/images/Madam-Ambition-Logo-New-Colors-1.png"
                alt="Madam Ambition"
                // Declared at 2x the 96x91 display box so Next serves a
                // retina-sharp variant; the original is scaled by the browser.
                width={192}
                height={182}
                className="w-[46px] h-[43px] min-[981px]:w-[96px] min-[981px]:h-[91px] object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation - Exact menu items and styling. The 26.6px item gap is
                the original 22px li padding plus the ~4.6px inline-block whitespace gap the
                original markup produces between menu items. */}
            <ul className="hidden min-[981px]:flex items-center text-[14px] font-semibold">
              {NAV_ITEMS.map(({ href, label }, i) => (
                <li key={href} className={i === NAV_ITEMS.length - 1 ? "" : "pr-[26.6px]"}>
                  <Link
                    href={href}
                    className={
                      href === "/"
                        ? "text-brand-beige"
                        : "text-[rgba(245,229,214,0.84)] hover:text-brand-beige transition-colors"
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Button */}
            <div className="min-[981px]:hidden flex items-center">
              <button className="text-brand-beige" aria-label="Menu">
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
