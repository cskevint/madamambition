import Link from "next/link";
import Image from "next/image";
import { HERO_GRADIENT } from "@/components/primitives";

/* Every image carries the same drop shadow. */
const IMG_SHADOW = "shadow-[0_2px_18px_0_rgba(0,0,0,0.3)]";

/* Buttons: Marcellus 15px, 1px tracking, square corners. */
const BTN = "inline-block font-sans text-[15px] leading-[25.5px] tracking-[1px] uppercase";

/* The original copy indents its attributions with runs of "&nbsp; " rather than CSS. */
const NBSP = "\u00a0 ";

const COACHING_POINTS = [
  "Executive coaching for individuals who want to make a change in their work lives, who seek success in their careers and to help their companies grow",
  "Coaching services that provide you with practical skills while also bespoke services to help you advance",
  "We specialize in working with executives to help overcome current problems and achieve their ambitions",
  "Our 6-month contract provides the necessary time and commitment to see real results – We work one-on-one so we can focus on your specific needs and wants",
  "We offer group support to build communities of support from different perspectives to help others develop together",
];

export default function Home() {
  return (
    <main className="site-type font-sans antialiased bg-white text-black">
      {/* 1. Hero Section */}
      {/* Shares the interior-hero background rather than repeating the gradient inline —
          the duplicate copy is how this hero missed the mobile flat-background fix. */}
      <section className={`${HERO_GRADIENT} py-[5%]`}>
        <div className="w-[90%] max-w-[1296px] mx-auto flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.5%]">
          {/* Left Column (2/5) */}
          {/* Mobile uses a fixed 24px rather than a percentage: percentage padding resolves
              against WIDTH, so the old pt-[20%] put 67px of dead space above the headline on a
              375px phone — 13% of the viewport, and double the desktop percentage on the
              screen with the least room. The desktop ladder is the measured original. */}
          <div className="w-full pt-[24px] min-[768px]:pt-[10%] min-[981px]:w-[36.73%] min-[981px]:pt-[11.01%]">
            <h1 className="font-serif text-[48px] tracking-[2px] uppercase text-brand-brown">
              Madam Ambition
            </h1>
            <h2 className="font-serif text-[23px] text-brand-brown">Selena Trotter</h2>
            <p className="text-[20px]">
              Executive Coach for Women in Finance and Tech
              <br />
              Building up Career Success for Trail-Blazing Women
              <br />
              Women’s Life Stories through the Lens of Career
            </p>
            <div className="mt-[35.63px]">
              <Link
                href="/contact/"
                className={`${BTN} bg-black text-white px-[30px] py-[14px] hover:bg-brand-nav transition-colors`}
              >
                Work with me
              </Link>
            </div>
          </div>
          {/* Right Column (3/5) */}
          <div className="w-full min-[981px]:w-[57.77%] mt-[30px] min-[981px]:mt-0">
            <Image
              src="/articles/images/SelenaTrotter-MadamAmbition-Executive-Coaching-1.jpg"
              alt="Selena Trotter - Madam Ambition Executive Coaching"
              width={1024}
              height={664}
              className={`w-full h-auto ${IMG_SHADOW}`}
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. Hi I'm Selena Section */}
      <section id="about" className="bg-white pt-[6%] pb-[calc(61px_+_2%)]">
        <div className="w-[80%] max-w-[1152px] mx-auto flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.56%]">
          {/* Left Column (1/2) */}
          <div className="w-full min-[981px]:w-[47.22%]">
            <Image
              src="/articles/images/SelenaTrotter-MadamAmbition-97.jpg"
              alt="Selena Trotter"
              width={1300}
              height={1613}
              className={`w-full h-auto ${IMG_SHADOW}`}
            />
          </div>
          {/* Right Column (1/2) */}
          <div className="w-full min-[981px]:w-[47.22%] mt-[30px] min-[981px]:mt-0 min-[981px]:pt-[108.86px]">
            <h2 className="font-serif text-[35px] text-brand-brown">Hi, I’m Selena Trotter,</h2>
            <h2 className="font-serif text-[35px] text-brand-brown">your Executive Coach</h2>
            <p className="pb-[1em]">
              Selena is the founder of Madam Ambition, a resource to help share the stories of
              women’s careers paths. She is also an Executive Coach to Trailblazing women. Selena
              has a passion for helping women succeed, which she developed from her own experiences
              as an entrepreneur, corporate, public, and non-profit work, as well as being a mother
              of three daughters.
            </p>
            <p>
              Selena understands that advancing the cause of women to bring about socio-economic
              justice for more communities globally requires the engagement of both men and women.
              She is committed to working collaboratively with all genders to create inclusive
              environments in business and society where everyone can thrive.
            </p>
            <div className="mt-[54.42px]">
              <Link
                href="/about/"
                className={`${BTN} bg-black text-white px-[40px] py-[10px] hover:bg-brand-nav transition-colors`}
              >
                About Madam Ambition
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Executive Coaching Section */}
      <section id="executive-coaching" className="bg-brand-copper pt-[8%] pb-[6%] text-white">
        <div className="w-[80%] max-w-[1152px] mx-auto pb-[49px] border-b border-[#ebd9cb] flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.47%]">
          {/* Quote Column (1/3) */}
          <div className="w-full min-[981px]:w-[36.72%]">
            <h2 className="font-serif text-[28px] leading-[33.6px]!">
              &ldquo;Becoming&nbsp;is better than being&rdquo;
            </h2>
            <p>{`${NBSP.repeat(6)}— Dr. Carol S Dweck, PhD, Columbia University`}</p>
          </div>
          {/* Bullets Column (2/3) */}
          <div className="w-full min-[981px]:w-[57.81%] mt-[30px] min-[981px]:mt-0">
            <h2 className="font-serif text-[30px]">Executive Coaching</h2>
            <ul className="list-disc pl-[16px] pb-[16px]">
              {COACHING_POINTS.map((point) => (
                <li key={point} className="leading-[26px]!">
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-[35.28px]">
              <Link
                href="/executive-coaching/"
                className={`${BTN} bg-brand-darkbeige text-brand-brown font-semibold px-[40px] py-[10px] hover:bg-brand-beige transition-colors`}
              >
                Executive Coaching
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Join Facebook Section */}
      <section className="bg-brand-beige pt-[calc(5%_+_45px)] pb-[7%] border-b-[15px] border-brand-nav">
        <div className="w-[80%] max-w-[1152px] mx-auto">
          <div className="w-full min-[981px]:w-[47.22%] mx-auto text-center">
            <h2 className="font-serif text-[26px] text-brand-brown">Join me on Facebook</h2>
            <p>to learn about mentorship opportunities and hear from the leaders.</p>
            <div className="mt-[31.67px]">
              <Link
                href="https://www.facebook.com/madamambittion"
                // py-[9px] + 25.5px line-height lands at 43.5px — just under the 44px
                // minimum. 10px on mobile clears it; desktop keeps the measured padding.
                className={`${BTN} w-full text-center bg-black text-white px-[30px] py-[10px] min-[981px]:py-[9px] hover:bg-brand-nav transition-colors`}
              >
                Follow Madam Ambition
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Let's Chat Section */}
      <section id="contact" className="bg-white pt-[6%] pb-[calc(44px_+_2%)]">
        <div className="w-[80%] max-w-[1152px] mx-auto flex flex-col min-[981px]:flex-row items-start min-[981px]:gap-[5.56%]">
          {/* Image */}
          <div className="w-full min-[981px]:w-[47.22%]">
            <Image
              src="/articles/images/SelenaTrotter-MadamAmbition-45.jpg"
              alt="Contact Selena Trotter"
              width={1500}
              height={998}
              className={`w-full h-auto ${IMG_SHADOW}`}
            />
          </div>
          {/* Text Content */}
          <div className="w-full min-[981px]:w-[47.22%] mt-[30px] min-[981px]:mt-0 min-[981px]:pt-[65.31px]">
            <h2 className="font-serif text-[26px] text-brand-brown">Let’s chat</h2>
            <p>
              Book a complimentary call to explore if Executive Coaching is right for you. We create
              community for women trail blazers, help leaders feel greater peace, ease and joy
              through our executive coaching programs.
            </p>
            <div className="mt-[43.53px]">
              <Link
                href="/contact/"
                className={`${BTN} bg-black text-white px-[40px] py-[10px] hover:bg-brand-nav transition-colors`}
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Image Quote Section */}
      <section className="bg-brand-nav bg-[image:linear-gradient(rgba(11,36,47,0.7),rgba(11,36,47,0.7)),url('/articles/images/SelenaTrotter-MadamAmbition-40.jpg')] bg-cover bg-center pt-[13%] pb-[6%] border-b-[15px] border-[#f8f0e6]">
        <div className="w-[80%] max-w-[1152px] mx-auto flex flex-col min-[981px]:flex-row min-[981px]:gap-[2.95%]">
          <div className="hidden min-[981px]:block min-[981px]:w-[48.52%]" />
          <div className="w-full min-[981px]:w-[48.52%]">
            <blockquote className="mt-[20px] mb-[30px] border-l-[5px] border-white pl-[20px]">
              <p className="font-quote italic text-[30px] leading-[45px]! text-white">
                {`“Let go of who you think you’re supposed to be; embrace who you are.”${NBSP.repeat(16)}– Brené Brown`}
              </p>
            </blockquote>
          </div>
        </div>
      </section>
    </main>
  );
}
