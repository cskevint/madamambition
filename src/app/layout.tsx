import type { Metadata } from "next";
import { Abril_Fatface, Lora, Marcellus } from "next/font/google";
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
import SiteHeader from "@/components/SiteHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // scroll-pt offsets the sticky header so anchor jumps do not land underneath it. It has to
  // track the header's height, which changes at the 981px breakpoint.
  return (
    <html lang="en" className="scroll-smooth scroll-pt-[80px] min-[981px]:scroll-pt-[114px]">
      <body
        className={`${marcellus.variable} ${abril.variable} ${lora.variable} font-sans antialiased text-black bg-white`}
      >
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
