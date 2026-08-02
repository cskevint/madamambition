import { careerStoriesEnabled } from "./features";

/**
 * The primary navigation, as rendered by the site header (src/app/layout.tsx).
 *
 * "Career Stories" appears only when the feature is enabled (lib/features.ts); it is off by
 * default, matching the live nav, which dropped it when that content was unpublished.
 * Position matches the pre-removal live nav.
 *
 * This lives here rather than inside the layout so that other surfaces can read the real
 * navigation instead of keeping a copy that drifts — currently the dev mobile-preview
 * harness (src/app/dev/mobile/routes.ts), which drives its page picker from it.
 */
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/executive-coaching/", label: "Executive Coaching" },
  ...(careerStoriesEnabled ? [{ href: "/career-stories/", label: "Career Stories" }] : []),
  { href: "/insights/", label: "Insights" },
  { href: "/journal/", label: "Journal" },
  { href: "/contact/", label: "Contact" },
];
