import { NAV_ITEMS } from "../../../../lib/nav";
import { getAllArticles } from "../../../../lib/markdown";

export interface PreviewRoute {
  /** Same-origin absolute path, always with a trailing slash (next.config.ts sets trailingSlash). */
  path: string;
  label: string;
  group: string;
}

/**
 * The harness page picker, composed from the same sources the site itself renders from:
 * `NAV_ITEMS` (lib/nav.ts) and `getAllArticles()` (lib/markdown.ts). Nothing here is
 * hand-maintained, so the picker cannot drift from the real route list — add a nav item or
 * an article and it shows up here on the next request.
 *
 * Deliberately excluded:
 *   - /feed/         — an RSS route handler, not an HTML page; framing it shows raw XML.
 *   - /career-stories/ and its articles when the feature flag is off, because they 404.
 *     `getAllArticles()` already filters those out, and NAV_ITEMS already omits the link.
 *
 * Server-only: getAllArticles reads the filesystem.
 */
export function getPreviewRoutes(): PreviewRoute[] {
  const pages: PreviewRoute[] = NAV_ITEMS.map((item) => ({
    path: item.href,
    label: item.label,
    group: "Pages",
  }));

  // Not in the nav: reachable only after a journal signup, but it is a real page that needs
  // reviewing like any other.
  pages.push({
    path: "/journal-download/",
    label: "Journal Download (thank-you)",
    group: "Pages",
  });

  const articles: PreviewRoute[] = getAllArticles().map((article) => ({
    // Trailing slash matters: without it Next 308-redirects and the harness's readiness
    // check would be comparing against the pre-redirect path.
    path: `/${article.slug}/`,
    label: article.title || article.slug,
    group: `Articles — ${article.category}`,
  }));

  return [...pages, ...articles];
}
