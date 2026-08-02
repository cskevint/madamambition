import Link from "next/link";
import { SocialRow } from "@/components/primitives";
import { careerStoriesEnabled } from "../../lib/features";

const EXPLORE_LINKS = [
  { href: "/about/", label: "About Madam Ambition" },
  { href: "/executive-coaching/", label: "Executive Coaching" },
  // Hidden unless the feature is enabled — see lib/features.ts.
  ...(careerStoriesEnabled ? [{ href: "/career-stories/", label: "Career Stories" }] : []),
  { href: "/contact/", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="site-type w-full font-sans">
      <div className="flex flex-col min-[981px]:flex-row bg-brand-beige">
        {/* About column */}
        <div className="min-[981px]:w-1/3 bg-brand-greyblue text-white px-[7%] py-[6%]">
          <h3 className="font-serif text-[20px]">About Madam Ambition</h3>
          <p className="text-[15px]">
            Sharing knowledge is powerful. Women tell their stories and career paths to empower you
            to learn about different professions. The empowerment of women and uplifting their
            voices to help others to learn and discover the paths available to them.
          </p>
        </div>
        {/* Explore column */}
        <div className="min-[981px]:w-1/3 bg-brand-beige pt-[6%] pb-[6%] min-[981px]:pb-0 text-center">
          <h2 className="font-serif text-[19px] text-brand-brown">Explore</h2>
          {/* inline-block + vertical padding lifts these from 22px to 44px tall, clearing the
              24px WCAG 2.2 SC 2.5.8 floor. Reset above 981px so the desktop footer keeps its
              original spacing. */}
          <p className="text-[17px] text-[#4b4b4b]">
            {EXPLORE_LINKS.map(({ href, label }, i) => (
              <span key={href}>
                {i > 0 && <br />}
                <Link
                  href={href}
                  className="text-brand-copper hover:underline inline-block py-[11px] min-[981px]:py-0"
                >
                  {label}
                </Link>
              </span>
            ))}
          </p>
        </div>
        {/* Social column */}
        <div className="min-[981px]:w-1/3 bg-brand-beige pt-[6%] pb-[6%] min-[981px]:pb-0 text-center">
          <h3 className="font-serif text-[20px] text-brand-brown">Social Media Follow</h3>
          <div className="pt-[10px]">
            <SocialRow />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-brand-brown pt-[17px] pb-[30px] text-white">
        <div className="w-[80%] max-w-[1152px] mx-auto pt-[15px]">
          <p className="text-[16px] text-center min-[981px]:text-left">
            {/* Built as one string: as separate JSX children the space between the year
                expression and the text is dropped, rendering "© 2026Madam Ambition". */}
            {`© ${new Date().getFullYear()} Madam Ambition`}
            &nbsp; |&nbsp; All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
