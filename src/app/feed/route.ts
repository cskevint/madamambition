import { getAllArticles } from "../../../lib/markdown";

/**
 * RSS 2.0 feed served at the original WordPress URL, /feed/.
 *
 * Kept as a real feed rather than a 301 to HTML: redirecting an RSS endpoint to a web page
 * breaks every existing subscriber. See plans/migration_plan.md §4.2b.
 */

const SITE = "https://madamambition.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-static";

export async function GET() {
  const articles = getAllArticles();

  const items = articles
    .map((article) => {
      const link = `${SITE}/${article.slug}/`;
      const parsed = article.date ? new Date(article.date) : null;
      const pubDate =
        parsed && !Number.isNaN(parsed.getTime())
          ? `<pubDate>${parsed.toUTCString()}</pubDate>`
          : "";
      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <description>${escapeXml(article.excerpt)}</description>`,
        pubDate ? `      ${pubDate}` : "",
        `      <category>${escapeXml(article.category)}</category>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Madam Ambition</title>
    <link>${SITE}/</link>
    <description>Women's life stories through the lens of career, and insights on executive coaching.</description>
    <language>en-US</language>
    <atom:link href="${SITE}/feed/" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
