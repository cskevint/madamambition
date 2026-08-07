/**
 * Honeypot spam filtering for the site's forms.
 *
 * A decoy field is rendered in the markup but hidden from people. Real visitors never see it,
 * so anything arriving in it came from a script that filled every input it found. That is the
 * whole test — no third-party service, no CAPTCHA, nothing for a visitor to solve.
 *
 * Two things matter for it to work:
 *   1. the field must not be `type="hidden"` or `display: none` — the crudest scrapers do skip
 *      those, so it is positioned off-screen instead (see HONEYPOT_CLASS);
 *   2. a caught submission must look exactly like a successful one to the caller, so a bot gets
 *      no signal telling it which field gave it away.
 */

/**
 * Named to read like a real optional field to a script scanning the form, while staying
 * something browser autofill has no profile for — Chrome and Safari fill names, emails,
 * phones and addresses, not this.
 */
export const HONEYPOT_FIELD = "website";

/**
 * Off-screen rather than `display: none`, per the note above. `aria-hidden` and `tabIndex={-1}`
 * on the wrapper keep it out of the way of screen readers and tab order, so hiding it from
 * sighted visitors does not hand it to anyone else.
 */
export const HONEYPOT_CLASS = "absolute -left-[9999px] w-px h-px overflow-hidden";

/**
 * True when the decoy field came back with anything in it. Whitespace does not count: a
 * browser quirk or an extension nudging the field should not cost a real visitor their signup.
 */
export function isBotSubmission(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim().length > 0;
}
