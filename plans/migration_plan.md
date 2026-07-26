# Migration Plan: Next.js app → madamambition.com parity

**Target:** the live WordPress/Divi site at `https://www.madamambition.com`.
**Measured:** 2026-07-25, Chrome at a 1440px viewport. All px values are from that width.

**Progress:** 3 of 11 steps done — ✅ `/`, `/about/`, `/executive-coaching/`, shared components,
dependencies and two parser bugs. 🔴 `/[slug]/`, `/insights/`, `/journal/`, `/contact/`,
`/journal-download/`, redirects, and cleanup. See §3 for routes and §9 for the execution log.

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

Consequence: several sections that appear only in the local app are **kept and restyled** to
the Divi design system so they read as native, rather than removed. They are all logged in §7.

---

## 1. How the target was measured (repeat this per page)

Screenshot diffing alone proved unreliable — it missed a 20px header shrink and mis-read a
section background because of Divi's fade-in animations. Read the live DOM instead:

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

- **Divi shrinks its fixed header on scroll** (114px → 94px, logo 96×91 → 79×75) and reduces
  `#page-container` padding to match, moving content up ~20px. Measure at `scrollY === 0` or
  you will encode the shrunken values.
- **The live site's `<body>` sits at `-21px`**, so absolute page coords are offset. Measure
  everything *relative to the first section's top* so it cancels.

Verify numerically, not visually: compare section/heading/image/button boxes relative to
section 0, plus total document height.

---

## 2. The Divi design system (already encoded — reuse it)

Tokens in `src/app/globals.css` `@theme`; primitives in `src/app/page.tsx`.

| Concept | Value | Where |
|---|---|---|
| Container | `w-[80%] max-w-[1152px] mx-auto` (hero rows: `w-[90%] max-w-[1296px]`) | every section |
| Heading font | Abril Fatface (`font-serif`), line-height 1.1, `padding-bottom: 10px` | `.divi-type` |
| Body font | Marcellus (`font-sans`), **fixed 27.2px leading at every size** | `.divi-type` |
| Pull-quote font | Lora italic (`font-quote`) — *not* the heading face | `layout.tsx` |
| Button | Marcellus 15px, `tracking-[1px]`, uppercase, square, `px-[40px] py-[10px]` | `BTN` |
| Image shadow | `0 2px 18px 0 rgba(0,0,0,0.3)`, no border | `IMG_SHADOW` |
| Section padding | percentages of **viewport** width (2/4/5/6/8/11%), not px | `page.tsx` |
| Brand colours | `#0b242f` nav · `#f5e5d6` beige · `#e2cec0` dark beige · `#702315` brown · `#a8623d` copper · `#5b767e` grey-blue | `@theme` |

**Apply `className="divi-type"` to every page's `<main>`.** Without it, headings and
paragraphs fall back to Tailwind defaults and nothing lines up.

---

## 3. Route status

✅ = ported and verified against live · 🔴 = still to do

| Route | Ported | On live? | Notes |
|---|---|---|---|
| `/` | ✅ | yes | `430f53d` — parity ≤1px, 4099px both. Header shrink + animations outstanding (§6.4–6.5) |
| `/executive-coaching/` | ✅ | yes | **Exact**: sections `[503,925,510,521]` = live; total 3057 vs 3058 |
| `/about/` | ✅ | yes | Sections 0/2/3 exact; §1 +196px from the two retained D4 paragraphs |
| `/[slug]/` posts | 🔴 | yes | Needs 1152px column, 26px `h1`, retuned `prose` (§6.2) |
| `/[slug]/` career stories | 🔴 | **no** — 404 | Content **kept** per §0.1; shares the post template |
| `/insights/` | 🔴 | yes, 9 posts | Hero + 3-up grid |
| `/career-stories/` | 🔴 | **no** — "No Results Found" | Listing **kept** per §0.1 |
| `/journal/` | 🔴 | yes | Hero + real ConvertKit form (currently a dead placeholder) |
| `/contact/` | 🔴 | yes | Hero variant + form chrome; Resend action already works |
| `/journal-download/` | 🔴 | yes | **No local content** — needs extraction (D2) |

---

## 4. URL parity and redirect plan

### 4.1 Articles — already exact ✅

Every markdown file records its original live URL in a `url:` comment. All **64** articles'
recorded URLs match their local route `/{slug}/` exactly. No redirects needed.

### 4.2 Live URLs with no local equivalent — need a redirect or a route

| Live URL | Count | Status | Plan |
|---|---|---|---|
| `/chrysta-wilson/` | 1 | 200 — a career story at a **shorter slug** than ours | 301 → `/chrysta-wilson-founder-dei-coach-and-consultant/`. **Divergence D1** |
| `/journal-download/` | 1 | 200, `h1` "Download your Mindset Journal" | Needs a real page; content must be extracted. **Divergence D2** |
| `/category/*` | 4 | 2 live in sitemap; 4 referenced inside article bodies | 301 → `/insights/` or `/career-stories/`. **Divergence D3** |
| `/tag/*` | 19 | 200 tag archives | 301 → `/insights/`. Tags are **not** in the markdown, so exact archives are not reproducible without new content. **Divergence D3** |

The 4 category URLs referenced in article bodies:
`/category/career-stories/`, `/category/career-stories/all-careers/`,
`/category/career-stories/careers-in-finance-and-tech/`,
`/category/thoughts-on-finance-and-executive-coaching/`.
Only the last two survive in the live sitemap; the career-story ones died with the content.

### 4.2b A prior crawl found 62 more 404s — 🔴 all still need redirects

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

Judgement calls to confirm before implementing — **not** decided here:

- **`/feed/` and `/comments/feed/`** should arguably be a *real* RSS feed rather than a
  redirect; Next.js can generate one from the markdown. Redirecting an RSS endpoint to HTML
  breaks subscribers.
- **`/author/*`** → `/about/` is the natural target, but it discards the author distinction
  (two authors: `selenawp`, `maribel`).
- **`/sign-in/`** was a WordPress login surface with no equivalent here; a 410 Gone may be
  more honest than a 301.
- **Pagination** collapses many URLs onto one target, which is acceptable for SEO but means
  deep-paged inbound links land on page 1.

`results.json` itself is **not committed** — it is regenerable crawler output pinned to one
deployment URL (now gitignored). Its findings are captured above, which is the durable form.
Re-run `scripts/web_crawler.py` to refresh, and re-check after the redirects land.

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

Per §0.3, install the plugin and retune its values to the Divi metrics (16px / 27.2px,
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

Divi fades/slides rows in on first view (`et_had_animation`). Cosmetic.

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
| D1 | Live serves a career story at `/chrysta-wilson/`; ours is `/chrysta-wilson-founder-dei-coach-and-consultant/` (matches its `url:` metadata and its 54 siblings) | Keeping our slug + 301 from the short one. **Confirm which should be canonical.** |
| D2 | `/journal-download/` exists on live; no local content for it | Needs content extraction. Placeholder route + 301 to `/journal/` until then. |
| D3 | 4 `/category/*` + 19 `/tag/*` archives exist on live; tags aren't in the markdown | 301 to the nearest listing. Reproducing archives exactly needs new taxonomy data. |
| D4 | `/about/` narrative — **corrected**: the narrative *is* on live, inside section 1's right column (5 plain 16px paragraphs beside the portrait, no blockquote). Live wording differs from ours, and live has a paragraph we lacked ("In the wake of the global pandemic…"). Two of our paragraphs ("When we look at the potential of women…", "We are dedicated to helping women…") appear nowhere on live | Live copy adopted; our 2 extra paragraphs **retained** per §0.1, which is the entire +196px difference in that section |
| D5 | `/insights/` "Accelerate your growth" CTA — not on live | Kept, restyled |
| D6 | `/insights/` cards show excerpt + "Read Article"; live shows image/title/date only | Kept |
| D7 | `/journal/` copper quote callout — not on live | Kept, restyled |
| D8 | `/contact/` "Follow the Journey" socials — not on live | Kept, links wired to real URLs |
| D9 | `/[slug]/` breadcrumb + post-footer nav — not on live | Kept, "More Projects" wording fixed |
| D10 | Career stories absent from live entirely (404 + empty listing + missing from sitemap) | Kept per §0.1. **Worth checking whether the production removal was intentional.** |
| D11 | Live nav omits "Career Stories" (footer only); home page was matched to that. If career stories stay, the nav item arguably should too | **Open question** |
| D12 | Contact form uses Resend, not Ninja Forms | Kept — functionally equivalent, better |

---

## 8. Sequence

1. ✅ Dependencies + parser fix (§6.2, §6.3) — unblocks 64 article pages.
2. ✅ Shared components (§6.7).
3. ✅ `/about/` + `/executive-coaching/`.
4. 🔴 `/[slug]/`.
5. 🔴 `/insights/`.
6. 🔴 `/journal/` (+ ConvertKit).
7. 🔴 `/contact/`.
8. 🔴 `/journal-download/` — new route, needs content extracted from live (D2).
9. 🔴 Redirects + trailing slashes + `metadata` (§4.4, §6.6).
10. 🔴 Retire the global `h1` rule (§6.1).
11. 🔴 Optional: header shrink, animations.

Steps 4–8 are independent once step 2 lands.

---

## 9. Execution log

| Step | Status |
|---|---|
| `/` home page | ✅ `430f53d` — parity ≤1px, total height 4099px on both |
| Audit + URL plan | ✅ this document |
| 1. Deps + parser fix | ✅ `@tailwindcss/typography` installed + `@plugin` directive; `lib/markdown.ts` regex fixed; `/yue-lulu-liu/` title restored; one empty `title:` backfilled |
| 2. Shared components | ✅ `src/components/divi.tsx` — `InteriorHero`, `MissionValuesSection`, `LetsChatSection` + `IMG_SHADOW`/`BTN`/`ROW`/`HERO_GRADIENT` |
| 3. `/about/` + `/executive-coaching/` | ✅ `/executive-coaching/` **exact**: sections `[503,925,510,521]` vs live `[503,925,510,521]`, total 3057 vs 3058. `/about/` sections 0/2/3 exact; §1 is +196px from the two retained D4 paragraphs |
| 4. `/[slug]/` | 🔴 next — plugin is installed but the page still needs the 1152px column, 26px `h1` and retuned `prose` values |
| 5. `/insights/` | 🔴 |
| 6. `/journal/` (+ ConvertKit) | 🔴 |
| 7. `/contact/` | 🔴 |
| 8. `/journal-download/` | 🔴 — no local content; needs extraction from live (D2) |
| 9. Redirects + trailing slashes + `metadata` | 🔴 — `metadata` added to `/about/` and `/executive-coaching/` only |
| 10. Retire global `h1` rule | 🔴 — blocked until all pages set explicit sizes |
| 11. Header shrink, animations | 🔴 |

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
   extension would not resize below 1440px; use devtools emulation. Divi's mobile breakpoint
   is **980px**, not Tailwind's `lg`; `layout.tsx` already uses `min-[981px]:`.
