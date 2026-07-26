import type { NextConfig } from "next";

/**
 * 301 redirects for every live madamambition.com URL that has no direct equivalent here.
 * Inventory and rationale: plans/migration_plan.md §4.2 and §4.2b.
 *
 * All 64 article URLs already match their original live paths exactly, so nothing below
 * touches them. These cover the WordPress-generated surfaces (taxonomy, date and author
 * archives, pagination) that a static Next site does not reproduce.
 */
const redirects = async () => [
  // A career story that live re-published under a shorter slug. Ours keeps the original
  // long slug, matching its `url:` metadata and its 54 siblings (divergence D1).
  {
    source: "/chrysta-wilson",
    destination: "/chrysta-wilson-founder-dei-coach-and-consultant/",
    permanent: true,
  },

  // Category archives. The career-stories ones were unpublished upstream; point them at the
  // listing that now carries that content.
  {
    source: "/category/career-stories/:path*",
    destination: "/career-stories/",
    permanent: true,
  },
  {
    source: "/category/thoughts-on-finance-and-executive-coaching/:path*",
    destination: "/insights/",
    permanent: true,
  },
  // Catch-all for any remaining category path, including /category/uncategorized/.
  { source: "/category/:path*", destination: "/insights/", permanent: true },

  // Tag archives (19 of them). Tags are not modelled in the markdown, so these cannot be
  // reproduced exactly without new taxonomy data (divergence D3).
  { source: "/tag/:path*", destination: "/insights/", permanent: true },

  // Date archives: /2021/01/ … /2024/08/ and anything nested beneath them.
  {
    source: "/:year(\\d{4})/:month(\\d{2})/:path*",
    destination: "/insights/",
    permanent: true,
  },

  // Author archives. Collapses the two WordPress authors (selenawp, maribel) onto the about
  // page — the distinction is not modelled here (divergence D3).
  { source: "/author/:path*", destination: "/about/", permanent: true },

  // Listing pagination. Both listings render in full on one page, so deep pages collapse to
  // the first — inbound links land on a page that contains the content they pointed at.
  { source: "/career-stories/page/:path*", destination: "/career-stories/", permanent: true },
  { source: "/insights/page/:path*", destination: "/insights/", permanent: true },

  // WordPress comment feed: there are no comments here, so send it to the article feed.
  // /feed/ itself is NOT redirected — it is served as a real RSS feed at the original URL
  // (src/app/feed/route.ts), so existing subscribers keep working.
  { source: "/comments/feed", destination: "/feed/", permanent: true },

  // The old WordPress login surface has no equivalent.
  { source: "/sign-in", destination: "/", permanent: true },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  redirects,
  /* No remote patterns allowed for madamambition.com */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },
};

export default nextConfig;
