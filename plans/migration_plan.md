# Migration Plan: Next.js app → madamambition.com parity

**Target:** the live WordPress site at `https://www.madamambition.com`.

Terminology: this repo does not use the old theme's vocabulary. Its page-builder markup
(`.et_pb_*`) still appears in the measurement snippets below, because that is what the live
DOM emits and those selectors are how you read it.
**Measured:** 2026-07-25, Chrome at a 1440px viewport. All px values are from that width.

**Progress:** 10 of 11 steps done. Every route is ported and verified; all 14 redirect
families resolve; the site no longer depends on the WordPress install for any asset.
🔴 Remaining: step 11 (header shrink-on-scroll and entrance animations, both cosmetic) and
one flagged item needing your input — D1 (`/chrysta-wilson/` canonical slug).
See §3 for routes and §9 for the log.

Throughout this document: **✅ = done and verified** · **🔴 = still to do**.

---

## 0. Confirmed direction (from the owner, 2026-07-25)

These override the "strict parity" reading of the original audit:

1. **No deletions.** The site must be fully functional with *all* content. Where the local app
   has content the live site lacks, the local content **stays**.
2. **URLs must match live exactly, or have a 301 redirect.** No silently orphaned URLs.
3. **Dependencies may be added** where they genuinely help.
4. **Divergences get flagged, never destructively resolved.** Anything that differs from live
   and isn't covered above goes in the divergence register (§7) for a human decision.
5. **Career stories are disabled** (added 2026-07-26). The listing, all 55 slugs, and every
   link to them must behave as 404 — gated by `CAREER_STORIES_ENABLED`, off by default. The
   markdown stays on disk; this is a publishing switch, not a deletion, so §0.1 still holds.

Consequence: several sections that appear only in the local app are **kept and restyled** to
the site's design system so they read as native, rather than removed. All logged in §7.

---

## 1. How the target was measured (repeat this per page)

Screenshot diffing alone proved unreliable — it missed a 20px header shrink and mis-read a
section background because of the live site's fade-in animations. Read the live DOM instead:

```js
// Section skeleton: order, height, background, column split
[...document.querySelectorAll('.et_pb_section')].map((s,i) => {
  const c = getComputedStyle(s), r = s.getBoundingClientRect();
  return { i, h: Math.round(r.height), bg: c.backgroundColor,
    pad: c.paddingTop + ' ' + c.paddingBottom, bb: c.borderBottomWidth,
    cols: [...s.querySelectorAll('.et_pb_row')].map(rw =>
      [...rw.children].filter(x => x.className.includes('column'))
        .map(x => Math.round(x.getBoundingClientRect().width)).join('+')).join('|') };
});
```

Two gotchas that will recur:

- **The live site shrinks its fixed header on scroll** (114px → 94px, logo 96×91 → 79×75) and reduces
  `#page-container` padding to match, moving content up ~20px. Measure at `scrollY === 0` or
  you will encode the shrunken values.
- **The live site's `<body>` sits at `-21px`**, so absolute page coords are offset. Measure
  everything *relative to the first section's top* so it cancels.

Verify numerically, not visually: compare section/heading/image/button boxes relative to
section 0, plus total document height.

---

## 2. The design system (already encoded — reuse it)

Tokens in `src/app/globals.css` `@theme`; primitives in `src/app/page.tsx`.

| Concept | Value | Where |
|---|---|---|
| Container | `w-[80%] max-w-[1152px] mx-auto` (hero rows: `w-[90%] max-w-[1296px]`) | every section |
| Heading font | Abril Fatface (`font-serif`), line-height 1.1, `padding-bottom: 10px` | `.site-type` |
| Body font | Marcellus (`font-sans`), **fixed 27.2px leading at every size** | `.site-type` |
| Pull-quote font | Lora italic (`font-quote`) — *not* the heading face | `layout.tsx` |
| Button | Marcellus 15px, `tracking-[1px]`, uppercase, square, `px-[40px] py-[10px]` | `BTN` |
| Image shadow | `0 2px 18px 0 rgba(0,0,0,0.3)`, no border | `IMG_SHADOW` |
| Section padding | percentages of **viewport** width (2/4/5/6/8/11%), not px | `page.tsx` |
| Brand colours | `#0b242f` nav · `#f5e5d6` beige · `#e2cec0` dark beige · `#702315` brown · `#a8623d` copper · `#5b767e` grey-blue | `@theme` |

**Apply `className="site-type"` to every page's `<main>`.** Without it, headings and
paragraphs fall back to Tailwind defaults and nothing lines up.

---

## 3. Route status

✅ = ported and verified against live · 🔴 = still to do

| Route | Ported | On live? | Notes |
|---|---|---|---|
| `/` | ✅ | yes | Parity ≤1px, 4099px both. Header shrink + animations outstanding (§6.4–6.5) |
| `/about/` | ✅ | yes | Sections 0/2/3 exact `[503,·,510,521]`; §1 +196px from the two retained D4 paragraphs |
| `/executive-coaching/` | ✅ | yes | **Exact** `[503,925,510,521]`; total 3057 vs 3058 |
| `/insights/` | ✅ | yes, 9 posts | Hero exact (503); grid 3-up, newest-first, matches live's first card |
| `/career-stories/` | ✅ | **no** — "No Results Found" | Built, then **disabled** by default (§0.5). Returns 404; `CAREER_STORIES_ENABLED=true` restores it |
| `/journal/` | ✅ | yes | **Exact** `[503,852]`; real ConvertKit form replaces the dead placeholder |
| `/contact/` | ✅ | yes | **Exact** `[272,925]`; Resend hardened; form split out so the page exports `metadata` |
| `/journal-download/` | ✅ | yes | **Exact** `[503,852]`. PDFs still remote — see D2 |
| `/[slug]/` posts | ✅ | yes | Hero exact (528), image exact, body 16px/27.2px in the full 1152px column |
| `/[slug]/` career stories | ✅ | **no** — 404 | Same template; **disabled** by default (§0.5), so all 55 slugs 404. Content kept on disk |
| `/feed/` | ✅ | yes | Real RSS at the original URL (64 items) rather than a redirect |

---

## 4. URL parity and redirect plan

### 4.1 Articles — already exact ✅

Every markdown file records its original live URL in a `url:` comment. All **64** articles'
recorded URLs match their local route `/{slug}/` exactly. No redirects needed.

### 4.2 Live URLs with no local equivalent — need a redirect or a route

| Live URL | Count | Status | Plan |
|---|---|---|---|
| `/chrysta-wilson/` | 1 | 200 — a career story at a **shorter slug** than ours | ✅ 301 → `/chrysta-wilson-founder-dei-coach-and-consultant/`. **Divergence D1** |
| `/journal-download/` | 1 | 200, `h1` "Download your Mindset Journal" | ✅ Real page built, exact match. PDFs still remote — **Divergence D2** |
| `/category/*` | 4 | 2 live in sitemap; 4 referenced inside article bodies | ✅ 301 → `/career-stories/` or `/insights/` by category. **Divergence D3** |
| `/tag/*` | 19 | 200 tag archives | ✅ 301 → `/insights/`. Tags are **not** in the markdown, so exact archives are not reproducible without new content. **Divergence D3** |

The 4 category URLs referenced in article bodies:
`/category/career-stories/`, `/category/career-stories/all-careers/`,
`/category/career-stories/careers-in-finance-and-tech/`,
`/category/thoughts-on-finance-and-executive-coaching/`.
Only the last two survive in the live sitemap; the career-story ones died with the content.

### 4.2b A prior crawl found 62 more 404s — ✅ all now redirected

`scripts/results.json` (output of `scripts/web_crawler.py`, run against
`madamambition.vercel.app`) recorded **70 URLs returning 200 and 62 returning 404**. The 404s
are URL families the Yoast sitemap does *not* list, so the sitemap-based audit above missed
them entirely — mostly **paginated** archives:

| Family | Count | Examples | Proposed 301 target |
|---|---|---|---|
| `/category/**` incl. pagination | 19 | `/category/career-stories/page/2/` … `/page/10/`, `/category/career-stories/all-careers/page/2/`, `/category/uncategorized/` | `/career-stories/` or `/insights/` by category |
| `/YYYY/MM/` date archives | 25 | `/2021/01/` … `/2024/08/` | `/insights/` |
| WordPress internals | 18 | `/author/selenawp/` (+ pages 2–8), `/author/maribel/` (+ pages 2–6), `/feed/`, `/comments/feed/`, `/sign-in/` | see below |
| Listing pagination | 1 | `/career-stories/page/2/` | `/career-stories/` |

How the judgement calls were resolved:

- **`/feed/` is NOT redirected.** It is served as a real RSS 2.0 feed at the original URL
  (`src/app/feed/route.ts`, 64 items, `application/rss+xml`), because redirecting an RSS
  endpoint to HTML breaks every existing subscriber. `/comments/feed/` → `/feed/`.
- **`/author/*`** → `/about/`, collapsing the two WordPress authors (`selenawp`, `maribel`).
  The author distinction is not modelled here.
- **`/sign-in/`** → `/`. A 410 Gone would be more honest but needs middleware; revisit if the
  crawl noise matters.
- **Pagination** collapses onto page 1. Acceptable for SEO, and since both listings render in
  full on one page, deep-paged inbound links still land on the content they pointed at.

Implemented in `next.config.ts` as 14 `permanent: true` rules (12 URL families plus the two
relocated journal PDFs). All verified returning 308
to the right target, with article, page and listing URLs confirmed *not* caught by the
patterns (notably that `/:year(\\d{4})/:month(\\d{2})/` does not swallow article slugs).

`scripts/results.json` is **committed** as the evidence behind this table — it is the only
record of the paginated URLs, which no sitemap lists. Note it is a point-in-time crawl pinned
to `madamambition.vercel.app`, so its 404s are now stale: every family above has since been
redirected. Re-run `scripts/web_crawler.py` after deploying to confirm the list comes back
clean.

### 4.3 Local URLs not on live

The 55 career-story routes plus `/career-stories/`. These were live as of the
2026-03-15 archive (58 story links) and are absent from the current sitemap. Per §0.1 they
**stay**. Their slugs match the historical live URLs, so old inbound links keep working.

### 4.4 Implementation

`trailingSlash: true` is already set. Add the redirects to `next.config.ts` as
`permanent: true` (308/301). Also fix 7 internal links that omit the trailing slash
(§6.6) so they stop taking a client-side redirect hop.

---

## 5. Page-by-page audit

### `/about/` — live: 4 sections, 3061px

| # | Live | Local (`src/app/about/page.tsx`) | Action |
|---|---|---|---|
| 0 | Hero, gradient, `423+666`, `h1` 35px, image `SelenaTrotter-About-MadamAmbition-8-1.jpg` 666×443 | `h1` renders 30px (§6.1), two-line uppercase; beige bg; 8px white border | Use shared `InteriorHero` |
| — | — | — | **Copy differs.** Live subtitle: *"Executive Coach helping women leaders boldly embody ambition that generates value for their company without neglecting their harmonious life."* Local: *"Advancing the cause of women who work"* → adopt live wording |
| 1 | **White**, `544+544`, portrait `SelenaTrotter-MadamAmbition-58.jpg` 500×752 beside the Abdu'l-Bahá quote | Full-bleed **dark** section, same image as background + `bg-brand-brown/60 mix-blend-multiply`, centred quote | Rebuild as two-column white |
| — | — | — | **Quote text differs.** Live: *"…So long as these two wings are not equivalent in strength the bird will not fly. Until womankind reaches the same degree as man, until she enjoys the same arena of activity, extraordinary attainment for humanity will not be realized…"* Local uses a different translation → adopt live wording |
| 2 | `#e2cec0`, `544+544`, `h3` "My Mission"/"My Values" **22px**, `Work with me`, `border-bottom: 15px solid #a8623d` | `bg-brand-beige` (wrong shade), `text-3xl`, hairline border | Shared `MissionValuesSection` |
| 3 | Let's chat — white, `544+544`, `SelenaTrotter-MadamAmbition-45.jpg` | Present but decorative offset border, `aspect-4/3`, copper `h3` | Shared `LetsChatSection` (= home §5) |
| — | — | Extra narrative section (`about/page.tsx:60-81`) | **Keep & restyle** — divergence **D4** |

### `/executive-coaching/` — live: 4 sections, 3058px

Same four-section template as `/about/`.

| # | Live |
|---|---|
| 0 | `h1` "Executive Coaching" 35px, image `SelenaTrotter-MadamAmbition-Executive-*`; subtitle *"An Executive Coach helping women leaders boldly embody ambition…"* |
| 1 | White, `544+544`, `SelenaTrotter-Executive-coach-1.jpg`; copy opens *"Meet Selena Trotter, a savvy Executive Coach who helps women unlock their full potential…"* |
| 2 | **Verified identical to `/about/` §2** — both render exactly 886 characters of identical text. Share one component |
| 3 | Let's chat (shared) |

### `/insights/` — live: 2 content sections, 2537px

| Property | Live | Local |
|---|---|---|
| Hero | `InteriorHero`, `h1` "Insights" 35px | Dark `bg-brand-nav` block, beige uppercase `h1`, copper rule, invented subtitle |
| Grid | single 1152px column, **3-up**, card 361px. Card is *only* image + `h2` **23px** + date `Jul 24, 2023` — **no excerpt, no read-more** (card text = 53 chars). Thumbs are `-400x250.jpg` crops, which already exist in `public/articles/images/` | 1/2/3-up grid, `text-2xl`, **plus excerpt + "Read Article"**, `aspect-video` |
| Extra | — | "Accelerate your growth" copper CTA | **Keep & restyle** — divergence **D5** |
| Count | 9 | 9 ✅ |

Local excerpt/read-more are extra UI, not content — kept, logged as **D6**.

### `/journal/` — live: 2 content sections, 1954px

| Property | Live | Local |
|---|---|---|
| Hero | Gradient, `h1` **"Mindset Journal"** 35px one line, image `SelenaTrotter-MadamAmbition-Executive-Coaching…` 666×443 (confirm which local `-Coaching-*.jpg` variant) | Two-line uppercase `h1`, beige bg |
| Body | White, `544+544`, `Journalmockup-1-scaled.jpg` 500×679 + copy + **real ConvertKit form** → `https://app.convertkit.com/forms/4837251/subscriptions` | Same image/copy, but form is a **dead placeholder** — `onSubmit={(e) => e.preventDefault()}` (`journal/page.tsx:78`) |
| Extra | — | Copper quote callout | **Keep & restyle** — divergence **D7** |

Wiring the real endpoint also removes the only reason this page is `"use client"`,
unblocking its `metadata` export.

### `/contact/` — live: 2 content sections, 1796px

| Property | Live | Local |
|---|---|---|
| Hero | Gradient, **`240+544+240` centred**, `h1` **30px**, h272; *"Contact Madam Ambition / We'd love to hear from you!"* | Beige bg, huge uppercase `h1`, italic subtitle, rule |
| Body | White, `544+544`, `SelenaTrotter-MadamAmbition-68.jpg` **500×752**; "Contact Me", *"Fields marked with an * are required"*, Ninja Forms Name/Email/Message + `Submit` | Same image file but `aspect-665/1000` + offset border; labelled fields, `Send Message` |
| Form | Ninja Forms → WordPress | **Resend server action** — keep (better); align visible chrome only |
| Extra | — | "Follow the Journey" socials with `href="#"` | **Keep**, but wire to the real URLs in `Footer.tsx` `SOCIAL_LINKS` — divergence **D8** |

### `/[slug]/` — posts — live: 2 content sections, 1969px

| Property | Live | Local |
|---|---|---|
| Hero | `423+666`, h528, `h1` **26px** `#702315` at x=144 w=423, date *"July 24, 2023"* | `h1` renders **30px** (§6.1); image `aspect-1024/724` with beige border instead of `IMG_SHADOW` |
| Body | Single **1152px** column, 16px / **27.2px** | **752px** centred (`max-w-[800px]`), 16px / 26px, all `prose-*` dead (§6.2) |
| Extra | — | Category/"Madam Ambition Journal" breadcrumb; "← More Projects" / "Get in Touch →" footer nav | **Keep**, fix the wrong "Projects" wording — divergence **D9** |

### `/[slug]/` — career stories

Live 404s. Only reference is `scripts/oldsite/career-story-example.html` (*Azucena Ramos –
MD PhD*): 4 sections, `h1` = person's name, body carries `h2` subheads matching the
markdown. The post template above serves both.

---

## 6. Cross-cutting items

### 6.1 `h1 { font-size: 30px }` overrides every page's heading utility — **high**

`globals.css` declares it **unlayered**. Tailwind v4 puts utilities in `@layer utilities`,
and unlayered CSS beats *any* layered rule regardless of specificity. So every interior
page's `<h1 className="text-5xl md:text-7xl lg:text-8xl">` renders at **30px**.

Moving it to `@layer base` was tried and reverted deliberately — it resizes `h1` on seven
pages at once, untested. Correct fix: set real per-page sizes as each page is converted,
then delete the global rule. Live sizes:

| Page | Live `h1` |
|---|---|
| `/about/`, `/executive-coaching/`, `/insights/`, `/journal/`, `/career-stories/` | **35px** |
| `/contact/` | **30px** |
| `/[slug]/` posts | **26px** |

### 6.2 `@tailwindcss/typography` not installed — article body unstyled — **high**

`[slug]/page.tsx:104-107` applies `prose prose-stone prose-lg md:prose-xl`,
`prose-headings:*`, `prose-h2:text-3xl`, `prose-p:mb-8`, `prose-blockquote:*`. The plugin is
absent and there is no `@plugin` directive. Verified at runtime: no stylesheet contains a
`prose` selector, so **every one of those classes emits nothing**.

Per §0.3, install the plugin and retune its values to the site type metrics (16px / 27.2px,
`#000`, full 1152px column).

### 6.3 Markdown parser drops paren-style metadata — **high, functional**

`lib/markdown.ts` `commentRegex` is
`/^\[\/\/\]: # ["\(]?(.*?):\s*(.*?)["]\)?$/` — it requires a closing `"`, so
`[//]: # (title: …)` never matches. `articles/career-stories/yue-lulu-liu.md` uses that
form, and **renders with an empty `<title>` and empty `<h1>`**. Confirmed:
`<title> | Madam Ambition</title>`.

Fix the regex to accept both delimiters.

### 6.4 Header does not shrink on scroll — **medium**

Live: 114px → 94px, logo 96×91 → 79×75, content up ~20px. At-rest geometry already matches;
only the scrolled state differs. Needs a client component with a scroll listener.

### 6.5 No entrance animations — **low**

The live site fades/slides rows in on first view (`et_had_animation`). Cosmetic.

### 6.6 Smaller items

| Item | Detail |
|---|---|
| Missing `metadata` | `about`, `executive-coaching`, `journal`, `contact`. The latter two are `"use client"` — extract the interactive part to a child component. Live titles use `" - "`: `About - Madam Ambition`, … Local `insights`/`career-stories` use `" \| "` — align. |
| Trailing slashes | 7 links use `href="/contact"`: `insights:87`, `about:117,154`, `career-stories:83`, `executive-coaching:88,125`, `[slug]:122`. Each costs a redirect hop. |
| Dead social links | `contact/page.tsx:167-177` uses `href="#"`. Real URLs exist in `Footer.tsx` `SOCIAL_LINKS`. |
| `RESEND_API_KEY` | Contact form needs it at runtime; only `.env.example` documents it. Confirm it is set where this deploys or the form fails in production. |

### 6.7 Shared components to extract first

| Component | Used by |
|---|---|
| `InteriorHero` | `/about/`, `/executive-coaching/`, `/insights/`, `/journal/`, `/career-stories/`, `/contact/` (narrow variant) |
| `MissionValuesSection` | `/about/` §2, `/executive-coaching/` §2 (verified identical) |
| `LetsChatSection` | `/` §5, `/about/` §3, `/executive-coaching/` §3 |

`InteriorHero` spec: h503 (272 for contact) · gradient
`linear-gradient(270deg,#e2cec0 43%,#f5e5d6 43%)` · padding 2%/2% · cols `423+666`
(contact `240+544+240`, centred, no image) · `h1` 35px `#702315` (contact 30px) · one
subtitle paragraph · image 666×443 with `IMG_SHADOW`.

---

## 7. Divergence register (flagged, not resolved)

| ID | Divergence | Disposition |
|---|---|---|
| D1 | Live serves a career story at `/chrysta-wilson/`; ours is `/chrysta-wilson-founder-dei-coach-and-consultant/` (matches its `url:` metadata and its 54 siblings) | Moot while career stories are disabled — the redirect is omitted so `/chrysta-wilson/` 404s. Revisit only if the feature is re-enabled. |
| D2 | `/journal-download/` exists on live; no local content for it | ✅ **Closed.** Page built from the live content, exact match `[503,852]`. Both PDFs copied byte-for-byte into `public/journal/` (21 pages each; 4,795,275 and 5,247,557 bytes, verified against the source `Content-Length`). The original `wp-content` upload URLs 301 to the local copies, so links already in the wild keep working. **No remaining dependency on the WordPress install.** |
| D3 | 4 `/category/*` + 19 `/tag/*` archives exist on live; tags aren't in the markdown | 301 to the nearest listing. Reproducing archives exactly needs new taxonomy data. |
| D4 | `/about/` narrative — **corrected**: the narrative *is* on live, inside section 1's right column (5 plain 16px paragraphs beside the portrait, no blockquote). Live wording differs from ours, and live has a paragraph we lacked ("In the wake of the global pandemic…"). Two of our paragraphs ("When we look at the potential of women…", "We are dedicated to helping women…") appear nowhere on live | Live copy adopted; our 2 extra paragraphs **retained** per §0.1, which is the entire +196px difference in that section |
| D5 | `/insights/` "Accelerate your growth" CTA — not on live | Kept, restyled |
| D6 | `/insights/` cards show excerpt + "Read Article"; live shows image/title/date only | Kept |
| D7 | `/journal/` copper quote callout — not on live | Kept, restyled |
| D8 | `/contact/` "Follow the Journey" socials — not on live | Kept, links wired to real URLs |
| D9 | `/[slug]/` breadcrumb + post-footer nav — not on live | Kept, "More Projects" wording fixed |
| D10 | Career stories absent from live entirely (404 + empty listing + missing from sitemap) | ✅ Resolved: the upstream removal *was* intentional, so career stories are now disabled here too (§0.5). Content retained on disk. |
| D11 | Live nav omits "Career Stories" (footer only) because that content was unpublished there | ✅ Superseded by §0.5: the nav item is now conditional on `CAREER_STORIES_ENABLED` and hidden by default, which matches the live nav |
| D12 | Contact form uses Resend, not Ninja Forms | Kept — functionally equivalent, better |

---

## 8. Sequence

1. ✅ Dependencies + parser fix (§6.2, §6.3) — unblocks 64 article pages.
2. ✅ Shared components (§6.7).
3. ✅ `/about/` + `/executive-coaching/`.
4. ✅ `/[slug]/`.
5. ✅ `/insights/` (and `/career-stories/`).
6. ✅ `/journal/` (+ ConvertKit).
7. ✅ `/contact/` (+ Resend hardening).
8. ✅ `/journal-download/` — built; PDFs still remote (D2).
9. ✅ Redirects + trailing slashes + `metadata` + real `/feed/` (§4.4, §6.6).
10. ✅ Retire the global `h1` rule (§6.1).
11. 🔴 Optional: header shrink, animations — **the only work left**.

Steps 4–8 are independent once step 2 lands.

---

## 9. Execution log

| Step | Status |
|---|---|
| `/` home page | ✅ `430f53d` — parity ≤1px, total height 4099px on both |
| Audit + URL plan | ✅ this document |
| 1. Deps + parser fix | ✅ `@tailwindcss/typography` installed + `@plugin` directive; `lib/markdown.ts` regex fixed; `/yue-lulu-liu/` title restored; one empty `title:` backfilled |
| 2. Shared components | ✅ `src/components/primitives.tsx` — `InteriorHero`, `MissionValuesSection`, `LetsChatSection` + `IMG_SHADOW`/`BTN`/`ROW`/`HERO_GRADIENT` |
| 3. `/about/` + `/executive-coaching/` | ✅ `/executive-coaching/` **exact**: sections `[503,925,510,521]` vs live `[503,925,510,521]`, total 3057 vs 3058. `/about/` sections 0/2/3 exact; §1 is +196px from the two retained D4 paragraphs |
| 4. `/[slug]/` | ✅ Hero 528 exact, image `666x410` exact, body 16px/27.2px in the full 1152px column. Typography plugin needed a dev-server restart to emit; also removed the unlayered `.markdown-content` rules that were beating every utility |
| 5. `/insights/` + `/career-stories/` | ✅ Shared `ArticleGrid` (3-up, 35px gutters, 19px card, full-bleed 1.6 thumb, 23px title, `Jul 24, 2023` date). `getAllArticles` now sorts newest-first, matching live's ordering |
| 6. `/journal/` | ✅ **Exact** `[503,852]`. Real ConvertKit post to form 4837251; page is a server component again so it exports `metadata` |
| 7. `/contact/` | ✅ **Exact** `[272,925]`. Narrow hero has its own padding (4%/2% + 4% row) and a 16px subtitle. Form extracted to `ContactForm.tsx` |
| 8. `/journal-download/` | ✅ **Exact** `[503,852]`. Content extracted from live; shares `JournalDetail` with `/journal/` |
| 9. Redirects + `metadata` + feed | ✅ 12 redirect families in `next.config.ts`, all 12 verified 308→correct target; every page exports `metadata`; real RSS at `/feed/` |
| 10. Retire global `h1` rule | ✅ Removed, plus the `!` overrides it had forced. Verified 48/35/30/26px hold |
| 11. Header shrink, animations | 🔴 Not started — the only remaining work |

### Measurements captured for the remaining pages

- **Interior hero** (verified): section padding 2%, **row padding 1.4375px**, text column
  padding-top **148px**, `h1` 35px, subtitle **18px / 23.4px leading** (not the 27.2px body
  default), image 666×443 at x=630, columns `423 + 63 + 666`.
- **Two-column body sections**: section 4% + row 2% → fold to **6%**; columns
  `544 + 64 + 544`; portrait images render **500px wide**, not full column width.
- **Image intrinsics** (`sips`-verified — several were wrong in the code):
  `SelenaTrotter-Executive-coach-1.jpg` is **681×1024 portrait**;
  `SelenaTrotter-MadamAmbition-58.jpg` 665×1000; `-About-MadamAmbition-8-1.jpg` 1000×665;
  the exec-coaching hero uses **`-Executive-Coaching-copy.jpg`** (1024×681), not `-1.jpg`.

---

## 10. Verification

Per page, at 1440px, app on `localhost:3000`:

1. Extract the section skeleton (§1) from live and local.
2. Compare boxes for sections, `h1`/`h2`/`h3`, images, buttons **relative to section 0's
   top**, plus total document height. Home came out ≤1px on every element.
3. Measure at `scrollY === 0` — the header shrink invalidates scrolled comparisons.
4. `npx tsc --noEmit` and `npm run lint`. The pre-commit hook also runs `oxfmt`, `oxlint`
   and a full `next build`, so a broken build cannot be committed.
5. Check every redirect in §4.2 actually resolves.
6. Spot-check a narrow viewport. Mobile was **not** verified for the home page — the Chrome
   extension would not resize below 1440px; use devtools emulation. The mobile breakpoint
   is **980px**, not Tailwind's `lg`; `layout.tsx` already uses `min-[981px]:`.
