"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { NAV_ITEMS } from "../../lib/nav";

/**
 * The site header, including the mobile navigation drawer.
 *
 * This is a client component because the drawer needs state. Below 981px the desktop menu is
 * hidden, so the drawer is the ONLY navigation a phone has — without it, /insights/ and
 * /journal/ have no inbound link anywhere on the site.
 *
 * Both menus render from the same NAV_ITEMS (lib/nav.ts), so they cannot drift apart.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on navigation. Done during render rather than in an effect: this is derived state
  // ("the drawer is never open for a page you have already navigated to"), and the
  // render-phase reset avoids a second render pass. Covers back/forward too, which an
  // onClick on the links alone would miss.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Escape closes and returns focus to the toggle, so keyboard users are not stranded
  // inside a drawer they cannot dismiss.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-nav shadow-[0_0_7px_0_rgba(0,0,0,0.1)]">
      {/* The live site swaps to its mobile header at 980px, so the desktop breakpoint is 981px
          rather than Tailwind's lg (1024px). */}
      <nav className="w-[80%] max-w-[1152px] mx-auto h-[80px] min-[981px]:h-[114px] flex items-center justify-between">
        {/* Logo area - Image only as per original. min-h-[44px] gives the link a compliant
            tap height on mobile without moving the 46x43 image. */}
        <Link
          href="/"
          className="flex items-center min-h-[44px] ml-[5px] hover:opacity-80 transition-opacity"
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
                aria-current={pathname === href ? "page" : undefined}
                className={
                  pathname === href
                    ? "text-brand-beige"
                    : "text-[rgba(245,229,214,0.84)] hover:text-brand-beige transition-colors"
                }
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button. The negative margin keeps the icon visually where it was
            while the padding lifts the tap target to 44x44. */}
        <div className="min-[981px]:hidden flex items-center">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Menu"}
            className="text-brand-beige p-[6px] -m-[6px] cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 6l12 12M18 6L6 18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer. Kept out of the DOM entirely when closed so its links cannot be
          reached by keyboard or read by a screen reader while hidden. */}
      {open ? (
        <div
          id="mobile-nav"
          className="min-[981px]:hidden bg-brand-nav border-t border-[rgba(245,229,214,0.18)]"
        >
          <ul className="w-[80%] max-w-[1152px] mx-auto py-[8px] text-[16px] font-semibold">
            {NAV_ITEMS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`block py-[13px] ${
                    pathname === href
                      ? "text-brand-beige"
                      : "text-[rgba(245,229,214,0.84)] hover:text-brand-beige transition-colors"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
