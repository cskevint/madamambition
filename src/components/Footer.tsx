import Link from "next/link";

const EXPLORE_LINKS = [
  { href: "/about/", label: "About Madam Ambition" },
  { href: "/executive-coaching/", label: "Executive Coaching" },
  { href: "/career-stories/", label: "Career Stories" },
  { href: "/contact/", label: "Contact" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/Madam-Ambition-106255191438934/",
    path: "M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3.2V.5h-4.4C10.9.5 9.9 2.9 9.9 4.5v2.96H7v3.8h2.9V21h4.6v-9.74h3.4l.87-3.8z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/madamambition/",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9a3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91a5.9 5.9 0 0 0 1.38 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63C19.1.34 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
  },
  {
    label: "X",
    href: "https://twitter.com/AmbitionMadam",
    path: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.48l8.6-9.83L0 1.15h7.6l5.44 7.2 5.86-7.2zm-1.3 19.5h2.04L6.48 3.24H4.3l13.3 17.4z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/madam-ambition/",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  },
];

export default function Footer() {
  return (
    <footer className="divi-type w-full font-sans">
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
          <p className="text-[17px] text-[#4b4b4b]">
            {EXPLORE_LINKS.map(({ href, label }, i) => (
              <span key={href}>
                {i > 0 && <br />}
                <Link href={href} className="text-brand-copper hover:underline">
                  {label}
                </Link>
              </span>
            ))}
          </p>
        </div>
        {/* Social column */}
        <div className="min-[981px]:w-1/3 bg-brand-beige pt-[6%] pb-[6%] min-[981px]:pb-0 text-center">
          <h3 className="font-serif text-[20px] text-brand-brown">Social Media Follow</h3>
          <ul className="flex justify-center pt-[10px]">
            {SOCIAL_LINKS.map(({ label, href, path }, i) => (
              <li key={label} className={i === SOCIAL_LINKS.length - 1 ? "" : "mr-[8px]"}>
                <Link
                  href={href}
                  aria-label={label}
                  className="w-[36px] h-[36px] rounded-full bg-brand-copper text-white flex items-center justify-center hover:bg-brand-brown transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-[16px] h-[16px]"
                  >
                    <path d={path} />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-brand-brown pt-[17px] pb-[30px] text-white">
        <div className="w-[80%] max-w-[1152px] mx-auto pt-[15px] flex flex-col min-[981px]:flex-row min-[981px]:gap-[5.47%] gap-2">
          <p className="min-[981px]:w-[64.8%] text-[16px] text-center min-[981px]:text-left">
            © 2026 Madam Ambition&nbsp; |&nbsp; All rights reserved
          </p>
          <p className="min-[981px]:w-[29.7%] text-[16px] text-center min-[981px]:text-right">
            Website Designed and Cared for by{" "}
            <a href="https://wearecreativa.com/" className="hover:underline">
              CREATIVA
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
