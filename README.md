# Madam Ambition

Next.js 16 (App Router) rebuild of [madamambition.com](https://www.madamambition.com), which
runs on WordPress with the Divi theme. Content lives as markdown in `articles/`; pages are
statically generated.

- **Migration status and design system:** [`plans/migration_plan.md`](plans/migration_plan.md)
- **Brand and Divi reference:** [`migration.md`](migration.md)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run format`.

A pre-commit hook runs `oxfmt`, `oxlint` and a full `next build`, so a broken build cannot be
committed.

## Environment variables

Create `.env.local` (git-ignored) with the following. Only `RESEND_API_KEY` is required, and
only for the contact form — every other page works without any configuration.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Yes, to send mail | — | API key from [resend.com](https://resend.com). Powers the `/contact/` form via a server action. Without it the form still renders and validates, but submitting returns "Email is not configured yet" and logs a warning server-side. |
| `CONTACT_TO_EMAIL` | No | `hello@madamambition.com` | Where contact submissions are delivered. |
| `CONTACT_FROM_EMAIL` | No | `Madam Ambition <onboarding@resend.dev>` | Sender address. Must be on a domain verified in Resend. |

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=hello@madamambition.com
CONTACT_FROM_EMAIL=Madam Ambition <hello@madamambition.com>
```

> **Set `CONTACT_FROM_EMAIL` before going live.** The default,
> `onboarding@resend.dev`, is Resend's sandbox sender and can only deliver to the Resend
> account owner's own address. It is fine for local testing and will silently fail to reach
> anyone else in production.

Implementation: [`src/app/contact/actions.ts`](src/app/contact/actions.ts). The Resend client
is constructed lazily inside the action — `new Resend(undefined)` throws, so building it at
module scope would take down the route whenever the key is absent.

The journal signup on `/journal/` posts directly to ConvertKit and needs no key.

## Project layout

```
articles/            Markdown content: career-stories/ and insights/
lib/markdown.ts      Frontmatter parsing, sorting (newest first), excerpts
plans/               Migration plan and audit
public/articles/     Images
public/journal/      Mindset Journal PDFs
scripts/             Python crawler + archived copies of the old site
src/app/             Routes; [slug] renders any article
src/components/divi.tsx  Shared Divi primitives — read this before styling a new page
```

## Conventions

- `trailingSlash: true`. Internal links must include the trailing slash or they take a
  redirect hop.
- Every page's `<main>` needs `className="divi-type"`, which supplies the Divi heading and
  body metrics. Without it typography falls back to Tailwind defaults.
- Divi's mobile breakpoint is **980px**, so use `min-[981px]:` rather than Tailwind's `md:`.
- Vertical spacing is expressed as percentages of viewport width, matching Divi.
- Legacy WordPress URLs (categories, tags, date and author archives, pagination) are
  redirected in `next.config.ts`. `/feed/` is a real RSS feed, not a redirect.
