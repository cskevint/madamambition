# Madam Ambition

Next.js 16 (App Router) rebuild of [madamambition.com](https://www.madamambition.com).
Content lives as markdown in `articles/`; pages are statically generated.

- **Migration status and design system:** [`plans/migration_plan.md`](plans/migration_plan.md)
- **Legacy source reference:** [`legacy-source.md`](legacy-source.md) — describes the WordPress site
  this replaced, kept for provenance. Its vocabulary is the old stack's, not this app's.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run typecheck`, `npm run lint`,
`npm run format`.

A pre-commit hook runs `oxfmt`, `oxlint` and a full `next build`, so a broken build cannot be
committed.

**There are two linters and they do not overlap.** The pre-commit hook runs `oxlint` via
`lint-staged`, on staged `*.{js,jsx,ts,tsx}` files only. `npm run lint` runs **eslint** with
`eslint-config-next` (`core-web-vitals` + `typescript`) across the whole tree, and Next 16 no
longer runs ESLint during `next build` — so eslint rules are enforced by CI and nowhere else.
A commit can pass the hook and still fail `npm run lint`.

## Environment variables

Create `.env.local` (git-ignored) with the following. Only `RESEND_API_KEY` is required, and
only for the contact form — every other page works without any configuration.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Yes, to send mail | — | API key from [resend.com](https://resend.com). Powers the `/contact/` form via a server action. Without it the form still renders and validates, but submitting returns "Email is not configured yet" and logs a warning server-side. |
| `CONTACT_TO_EMAIL` | No | `hello@madamambition.com` | Where contact submissions are delivered. |
| `CONTACT_FROM_EMAIL` | No | `Madam Ambition <onboarding@resend.dev>` | Sender address. Must be on a domain verified in Resend. |
| `CAREER_STORIES_ENABLED` | No | unset (**disabled**) | Set to `true` to publish the career stories. See below. |
| `SITE_URL` | Recommended | Vercel's URL, else `https://madamambition.com` | Public origin used to build the **absolute** journal download links in outbound email. See the warning below. |

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

### Career stories

The 55 articles in `articles/career-stories/` are **switched off by default**. While disabled:

- `/career-stories/` and every career-story slug return a 404 (not an empty listing).
- They are excluded from the RSS feed and from `generateStaticParams`, so they are never built.
- The header nav and footer "Explore" links to them disappear.
- Legacy `/category/career-stories/*` URLs fall through to `/insights/`, and the
  `/chrysta-wilson/` redirect is dropped so it 404s like any unknown URL.

Nothing is deleted — the markdown stays in the repo. Set `CAREER_STORIES_ENABLED=true` to
bring it all back.

Disabled is the default deliberately: if the variable is missing or misspelled in a
deployment, the content stays hidden rather than leaking. Enabling has to be explicit.
Implemented in [`lib/features.ts`](lib/features.ts); `next.config.ts` reads the same variable
so the redirects stay consistent.

Implementation: [`src/app/contact/actions.ts`](src/app/contact/actions.ts). The Resend client
is constructed lazily inside the action — `new Resend(undefined)` throws, so building it at
module scope would take down the route whenever the key is absent.

### Journal signup

`/journal/` no longer posts to ConvertKit. A server action ([`src/app/journal/actions.ts`](src/app/journal/actions.ts))
sends two emails through Resend per signup:

1. **To the subscriber** — a short message with absolute links to the PDFs in `public/journal/`.
2. **To `CONTACT_TO_EMAIL`** — a notification that someone signed up, with reply-to set to them.

The subscriber email is the one the visitor cares about, so its failure fails the request; the
owner notification is best-effort, so a failure there never shows the visitor an error when
they have already received their journal. On success the download links are also shown inline,
so nobody has to wait on mail delivery.

> **`SITE_URL` matters here.** The emailed links must be absolute. The fallback is
> `https://madamambition.com`, which today resolves to the **old WordPress site** — it keeps
> the PDFs under `/wp-content/uploads/`, not `/journal/`, so an emailed link would 404. Set
> `SITE_URL` explicitly until DNS points at this app. On Vercel it is inferred from
> `VERCEL_PROJECT_PRODUCTION_URL` / `VERCEL_URL`, so previews link to themselves.

> **`CONTACT_FROM_EMAIL` is now load-bearing.** The default sandbox sender can only deliver to
> the Resend account owner, so the *subscriber* email will not arrive until this is set to a
> verified domain. The contact form tolerated this; journal signup does not.

## Project layout

```
articles/            Markdown content: career-stories/ and insights/
lib/markdown.ts      Frontmatter parsing, sorting (newest first), excerpts
plans/               Migration plan, audit, and the repo hardening plan
public/articles/     Images
public/journal/      Mindset Journal PDFs
scripts/             Python crawler + archived copies of the old site
src/app/             Routes; [slug] renders any article
src/components/primitives.tsx  Shared design primitives — read before styling a new page
```

## Conventions

- `trailingSlash: true`. Internal links must include the trailing slash or they take a
  redirect hop.
- Every page's `<main>` needs `className="site-type"`, which supplies the heading and body
  type metrics. Without it typography falls back to Tailwind defaults.
- The design's mobile breakpoint is **980px**, so use `min-[981px]:` rather than Tailwind's
  `md:`.
- Vertical spacing is expressed as percentages of viewport width, matching the original.
- Legacy WordPress URLs (categories, tags, date and author archives, pagination) are
  redirected in `next.config.ts`. `/feed/` is a real RSS feed, not a redirect.

## CI and dependency security

Remaining work, standing watch items and the decisions taken deliberately:
[`plans/hardening_plan.md`](plans/hardening_plan.md).

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs typecheck, lint and build on pushes
to `main` and on every pull request. `main` also has a ruleset blocking branch deletion and
non-fast-forward pushes — the two unrecoverable operations. Direct pushes stay allowed, so
required status checks are deliberately **not** configured: they only gate pull request merges
and would never evaluate. When a second contributor arrives, the upgrade is one API call adding
`pull_request` and `required_status_checks` pointed at the `verify` job.

CI pins `node-version: 24`, matching Vercel's current default. **This app is not linked to a
Vercel project yet**, so that pin is an assumption rather than a mirror of a real build — check
it against the platform's Node version when the site is first deployed, or record the version in
an `engines` field so the two cannot drift.

### Never point automated jobs at the live site

`scripts/web_crawler.py` and its archived output in `scripts/oldsite/` exist for one-off
migration work. Keep them manual. Vercel's automatic DDoS mitigation reads a burst of requests
— especially to dead WordPress paths, of which `next.config.ts` redirects many — as
vulnerability scanning, and responds with `403` and `x-vercel-mitigated: challenge` on *every*
path for a sustained period, with Attack Mode off. Real browsers pass the JS challenge so
visitors are unaffected, which makes this easy to misdiagnose: the site looks fine while all
non-JS tooling fails. From CI it would trip on every push, from rotating runner IPs that cannot
be allow-listed.

### Three alerts cannot be fixed here — and `npm audit fix --force` will lie to you

Dependabot alerts and security updates are enabled, and
[`.github/dependabot.yml`](.github/dependabot.yml) groups minor/patch bumps into roughly one PR
a week. Framework **major** bumps (`next`, `react`, `react-dom`) are ignored on purpose; minors
are not, since 16.1.x → 16.2.x carried a large batch of security fixes.

Three remaining advisories have **no forward fix**, because a parent pins the vulnerable version:

- `next → postcss` is an **exact pin** at `8.4.31`, so the 8.5.x patches are unreachable.
  A *second* postcss lives under `@tailwindcss/postcss` (`^8.5.6`) and tracks the latest — so
  postcss alerts need reading carefully: one copy is fixable and the other is not.
- `next → sharp` is `^0.34.5`, and a caret on a `0.x` version pins the minor, so the `0.35.0`
  patch is outside the range.
- `minimatch@3.x → brace-expansion@^1.1.7`, deep in the eslint tree. The fix for the unbounded
  expansion advisory landed only in `5.0.8`; there is **no 1.x patch**, and the advisory range
  (`<=5.0.7`) matches every 1.x release. Dev-only, but it cascades — `minimatch` reports as
  vulnerable, and with it `eslint`, `eslint-config-next`, and every `eslint-plugin-*`.

Upgrading Next.js clears none of these; `next@16.2.12` still carries both of its pins.

**The tell is the suggested fix.** `npm audit fix --force` proposes `next@9.3.3`, `eslint@4.0.0`
and `eslint-config-next@0.2.4` — years-old downgrades. When `audit` suggests going *backwards*,
it means no forward fix exists and it is picking the newest version predating the advisory. Never
run it here. Dependabot's equivalent move is a PR adding an `overrides` block, which diverges
from what the framework expects; an override on `sharp` would affect Next.js image
optimization. Read what such PRs actually change, and close them and wait for the framework.
