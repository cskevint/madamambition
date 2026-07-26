/**
 * Feature flags.
 *
 * Career stories are DISABLED by default. The 55 articles stay in `articles/career-stories/`
 * — nothing is deleted — but nothing serves them: the listing 404s, every story slug 404s,
 * they are dropped from the RSS feed and static params, and the nav and footer links
 * disappear.
 *
 * Set `CAREER_STORIES_ENABLED=true` to turn them back on.
 *
 * Disabled is the default deliberately: if the variable is missing or misspelled in a
 * deployment, the content stays hidden rather than leaking. Enabling has to be explicit.
 */

export const CAREER_STORIES_CATEGORY = "career-stories";

function truthy(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "on";
}

export const careerStoriesEnabled = truthy(process.env.CAREER_STORIES_ENABLED);

/** True when this article must not be served under the current flags. */
export function isHiddenCategory(category: string): boolean {
  return category === CAREER_STORIES_CATEGORY && !careerStoriesEnabled;
}
