import type { NextConfig } from "next";

/**
 * 301 redirects for every live madamambition.com URL that has no direct equivalent here.
 * Inventory and rationale: plans/migration_plan.md §4.2 and §4.2b.
 *
 * All 64 article URLs already match their original live paths exactly, so nothing below
 * touches them. These cover the WordPress-generated surfaces (taxonomy, date and author
 * archives, pagination) that a static Next site does not reproduce.
 */
/**
 * Career stories are disabled by default (lib/features.ts). When they are off, anything that
 * would land on them must 404 rather than redirect to a 404 — so those rules are omitted
 * entirely and the career-story category archives fall through to /insights/.
 */
const careerStoriesEnabled = ["true", "1", "yes", "on"].includes(
  (process.env.CAREER_STORIES_ENABLED ?? "").trim().toLowerCase(),
);

const careerStoryRedirects = careerStoriesEnabled
  ? [
      // A career story that live re-published under a shorter slug. Ours keeps the original
      // long slug, matching its `url:` metadata and its 54 siblings (divergence D1).
      {
        source: "/chrysta-wilson",
        destination: "/chrysta-wilson-founder-dei-coach-and-consultant/",
        permanent: true,
      },
      {
        source: "/category/career-stories/:path*",
        destination: "/career-stories/",
        permanent: true,
      },
      { source: "/career-stories/page/:path*", destination: "/career-stories/", permanent: true },
    ]
  : [];

const redirects = async () => [
  ...careerStoryRedirects,
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

  // Listing pagination. The listing renders in full on one page, so deep pages collapse to
  // the first — inbound links land on a page that contains the content they pointed at.
  // The career-stories equivalent is in careerStoryRedirects, since it must not exist while
  // that listing 404s.
  { source: "/insights/page/:path*", destination: "/insights/", permanent: true },

  // WordPress comment feed: there are no comments here, so send it to the article feed.
  // /feed/ itself is NOT redirected — it is served as a real RSS feed at the original URL
  // (src/app/feed/route.ts), so existing subscribers keep working.
  { source: "/comments/feed", destination: "/feed/", permanent: true },

  // The old WordPress login surface has no equivalent.
  { source: "/sign-in", destination: "/", permanent: true },

  // The Mindset Journal PDFs now live in public/journal/. Keep the original WordPress
  // upload URLs working, since links to them are already out in the wild (ConvertKit emails
  // among them). trailingSlash normalisation does not apply to paths with a file extension.
  {
    source: "/wp-content/uploads/2023/08/Mindset-Journal_Col-1.pdf",
    destination: "/journal/Mindset-Journal_Col-1.pdf",
    permanent: true,
  },
  {
    source: "/wp-content/uploads/2023/08/Mindset-Journal_BLW.pdf",
    destination: "/journal/Mindset-Journal_BLW.pdf",
    permanent: true,
  },
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
