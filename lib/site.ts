/**
 * The site's public origin, used to build absolute URLs for things that leave the browser —
 * currently the journal download links in outbound email, where a relative path is useless.
 *
 * Resolution order:
 *   1. `SITE_URL` — explicit override, always wins. Set this if you are unsure.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` on production deployments — the stable custom domain,
 *      preferred over the per-deployment URL so emailed links do not rot.
 *   3. `VERCEL_URL` on preview deployments, so preview signups link to the preview build.
 *   4. `https://madamambition.com`.
 *
 * IMPORTANT: until DNS for madamambition.com points at this app, that final fallback resolves
 * to the old WordPress site, which does not serve /journal/*.pdf — it keeps those files under
 * /wp-content/uploads/. Set SITE_URL explicitly before enabling journal signups anywhere the
 * Vercel variables are absent, or subscribers will receive a link that 404s.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (process.env.VERCEL_ENV === "production" && prod) {
    return `https://${prod.replace(/\/+$/, "")}`;
  }

  const deployment = process.env.VERCEL_URL?.trim();
  if (deployment) return `https://${deployment.replace(/\/+$/, "")}`;

  return "https://madamambition.com";
}

export const siteUrl = resolveSiteUrl();

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
