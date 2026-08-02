/**
 * Frame-target validation, shared by the server page and the client picker.
 *
 * An iframe whose src is attacker-controlled is a phishing-shaped demo: `?path=https://evil`
 * would render someone else's page inside what looks like this site's tooling. So only
 * same-origin absolute paths are accepted, and anything else silently falls back to "/".
 */
export const DEFAULT_PATH = "/";

/** The harness itself — framing it would recurse. */
const HARNESS_PREFIX = "/dev/mobile";

/**
 * Browsers strip control characters (tab, newline, carriage return among them) while parsing
 * a URL, so a path can survive a naive startsWith("/") check and then not mean what it
 * looked like. Checked by code point rather than a regex so there are no escape sequences in
 * the source for a formatter to mangle.
 */
function hasControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

export function sanitizePath(input: unknown): string {
  if (typeof input !== "string") return DEFAULT_PATH;

  const path = input.trim();
  if (!path.startsWith("/")) return DEFAULT_PATH;

  // "//evil.com" is protocol-relative, and browsers normalise "/\evil.com" the same way.
  if (path.startsWith("//") || path.startsWith("/\\")) return DEFAULT_PATH;

  if (hasControlChars(path)) return DEFAULT_PATH;

  if (path === HARNESS_PREFIX || path.startsWith(`${HARNESS_PREFIX}/`)) return DEFAULT_PATH;

  return path;
}

/**
 * `trailingSlash: true` in next.config.ts means /about redirects to /about/. The readiness
 * check compares the frame's actual pathname against the requested one, so both sides go
 * through this first or a 308 looks like a failure to load.
 */
export function normalizePath(path: string): string {
  const clean = path.split("?")[0].split("#")[0];
  if (clean.endsWith("/")) return clean;
  // Leave file-like paths (a .pdf, an .xml) alone — Next does not add a slash to those.
  if (/\.[a-z0-9]+$/i.test(clean)) return clean;
  return `${clean}/`;
}

export function samePath(a: string, b: string): boolean {
  return normalizePath(a) === normalizePath(b);
}
