# Hardening Plan: CI, branch protection, dependency security

**Scope:** the GitHub-side and dependency-side work started 2026-07-28. Application behaviour is
out of scope — for that, see [`migration_plan.md`](migration_plan.md).

**Progress:** the substantive work is done and committed (`cf230b0`, `6006ade`). What remains is
mostly *verification of things that cannot be tested locally*, plus a small number of standing
watch items. Nothing below is blocking.

Throughout: **✅ = done and verified** · **🟡 = done but unverified** · **🔴 = still to do**

---

## 0. What is already in place

| Item | State |
| --- | --- |
| `.github/workflows/ci.yml` — typecheck, lint, build | ✅ committed, 🟡 never executed |
| `main` ruleset — `deletion` + `non_fast_forward` | ✅ active (id `19906691`), confirmed via rules API |
| Secret scanning | ✅ enabled (was already) |
| Push protection | ✅ enabled (was already) |
| Actions default token = `read` | ✅ (was already) |
| Dependabot alerts + security updates | ✅ enabled this session |
| `.github/dependabot.yml` — grouped weekly | ✅ committed, 🟡 first run not yet observed |
| Every *fixable* advisory | ✅ cleared in `6006ade` |
| `npm run typecheck` script | ✅ added, passes |

---

## 1. 🔴 Confirm CI actually runs green

The workflow passes locally on **Node 23.11.0 / macOS**. It has never run on **Node 24 /
`ubuntu-latest`**, which is what it pins. Until the first run completes, treat it as unverified.

Specifically unproven:

- `actions/checkout@v7` and `actions/setup-node@v7` — confirmed as the current major tags via the
  releases API, but never invoked.
- `npm ci` against the committed lockfile on a clean machine.
- That nothing in the build depends on a local-only file. `.env.local` is absent in CI, which
  should be fine: only the contact and journal *actions* need `RESEND_API_KEY`, and they are not
  invoked at build time.

**Done when:** one run of `verify` is green on `main` and one is green on a pull request.

## 2. 🔴 Reconcile the Node version with the real deploy platform

`node-version: 24` is an **assumption**, not a mirror. There is no `.vercel/` link, and the only
accessible Vercel scope (`codelab-institute`) has zero projects — so this app is not deployed
anywhere we can inspect. Node 24 is Vercel's current default and satisfies Next's
`engines: >=20.9.0`, which is why it was chosen.

When the site is first deployed:

1. Read the platform's actual Node version.
2. If it differs, change the CI pin to match — a green CI run must mean the same thing as a green
   deploy.
3. Record the version in `package.json` `engines` so CI and the platform cannot silently drift.
   Nothing in the repo currently states a Node version, which is why the pin had to be a guess.

## 3. 🔴 Upgrade branch protection when a second contributor arrives

The ruleset deliberately carries only `deletion` and `non_fast_forward`. Required status checks
were **omitted on purpose**: direct pushes stay allowed, so status checks would only gate pull
request merges and would never evaluate. Requiring PRs from the only contributor buys a branch, a
PR and a self-approval per one-line change.

The upgrade is one API call, and the `verify` job now exists to point it at:

```bash
gh api -X PUT repos/cskevint/madamambition/rulesets/19906691 --input - <<'JSON'
{
  "name": "main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request",
      "parameters": { "required_approving_review_count": 1,
                      "dismiss_stale_reviews_on_push": true,
                      "require_code_owner_review": false,
                      "require_last_push_approval": false,
                      "required_review_thread_resolution": false } },
    { "type": "required_status_checks",
      "parameters": { "strict_required_status_checks_policy": true,
                      "required_status_checks": [{ "context": "verify" }] } }
  ],
  "bypass_actors": []
}
JSON
```

Verify with `gh api repos/cskevint/madamambition/rules/branches/main --jq '.[].type'`.

## 4. 🔴 Standing watch: three advisories with no forward fix

These cannot be resolved from this repo. Re-check when Next.js publishes a minor, and do **not**
let them accumulate silently — the reason to track them is so the alert count stops being
mistaken for neglect.

| Chain | Why it is stuck | Unblocks when |
| --- | --- | --- |
| `next → postcss` | **Exact pin** at `8.4.31`; 8.5.x patches unreachable. Still pinned in `16.2.12`. | Next.js moves its pin |
| `next → sharp` | `^0.34.5` — a caret on `0.x` pins the minor, so `0.35.0` is out of range | Next.js widens to `^0.35` |
| `minimatch@3.x → brace-expansion@^1.1.7` | Fix landed only in `5.0.8`; advisory range `<=5.0.7` covers all of 1.x, so there is no 1.x version to move to. Dev-only, but cascades to `minimatch`, `eslint`, `eslint-config-next` and every `eslint-plugin-*` — 9 of the 12 remaining `npm audit` entries | eslint's tree moves off `minimatch@3` |

**Never run `npm audit fix --force` in this repo.** It proposes `next@9.3.3`, `eslint@4.0.0` and
`eslint-config-next@0.2.4` — years-old downgrades. A suggested *downgrade* is the signal that no
forward fix exists and audit is falling back to the newest version predating the advisory. Also
note `npm audit` claims `next@16.2.12` fixes postcss and sharp; it does not.

## 5. 🔴 Review the first Dependabot PRs, then confirm the cadence

Two things to watch on the first batch:

- **Override PRs.** Where a parent pins a vulnerable version, Dependabot may add an `overrides`
  block rather than a clean bump. That diverges from what the framework expects — an override on
  `sharp` would affect Next.js image optimization. Read what the PR changes; close it and wait for
  the framework if it is an override.
- **Volume.** The grouping targets roughly one PR a week. If the first few weeks produce more,
  tighten `.github/dependabot.yml` rather than learning to ignore the stream — noise is what makes
  the *security* PRs get lost, which is worse than not running Dependabot at all.

Note that GitHub's alert counts lag the lockfile until the fixing commit reaches `main`, so the
first reading after the push is the meaningful one. Before the push it was 43 open (35 runtime, 8
development); the fixes in `6006ade` should leave **4 runtime** (three postcss advisories against
the `8.4.31` copy, plus one sharp).

## 6. 🔴 Mail delivery is still untested end to end

Verified only that the code compiles and that `resend` imports and constructs under Node with
`emails.send` present. **No email has been sent** since the `resend` ^6.9.3 → ^6.18.1 bump, which
dropped `svix` entirely. The send path itself is unchanged, but "compiles" is not "delivers".

Needs a real `RESEND_API_KEY` and one submission each through `/contact/` and `/journal/`. The two
pre-existing traps in the README apply and are the likely failure mode, not the version bump:
`CONTACT_FROM_EMAIL` still defaults to Resend's sandbox sender, and `SITE_URL` must be set or the
emailed journal links point at the old WordPress site.

---

## 7. Smaller items

- 🔴 **`package.json` is still named `next_temp`** — the `create-next-app` scaffold name. Harmless
  today, but it is what would appear if anything ever reads the manifest name.
- 🔴 **One eslint warning is tolerated.** `postcss.config.mjs` trips
  `import/no-anonymous-default-export`. CI does not pass `--max-warnings 0`, so it stays green.
  Either fix the file and add the flag, or leave it deliberately — but decide, rather than letting
  the warning count drift upward unnoticed.
- 🔴 **Two optional secret-scanning features are off**: `secret_scanning_non_provider_patterns`
  and `secret_scanning_validity_checks`. Neither was expected to be on, and neither is needed given
  the audit found no secrets in history (the only committed env file is `.env.example`, whose sole
  value is a `re_` + 9-digit placeholder). Listed for completeness.

---

## 8. Deliberately not doing

Recording these so they are not "helpfully" added later.

- **Production-probing checks in CI.** `scripts/web_crawler.py` and anything else that sends
  requests at the live site stays manual. A burst of requests — especially to the dead WordPress
  paths `next.config.ts` redirects — reads as vulnerability scanning to Vercel's automatic DDoS
  mitigation, which then answers `403` with `x-vercel-mitigated: challenge` on *every* path for a
  sustained period, with Attack Mode off. Browsers pass the JS challenge, so the site looks fine
  while all non-JS tooling fails — easy to misdiagnose. From CI it would trip on every push, from
  runner IPs that cannot be allow-listed. There is a comment to this effect in `ci.yml`.
- **Required status checks while direct pushes are allowed.** See §3 — they would never evaluate.
  GitHub's "Protect this branch" banner suggests both, which is why this misleads on
  single-contributor repos.
- **Framework major bumps via Dependabot.** Ignored for `next`, `eslint-config-next`, `react` and
  `react-dom`. 15 → 16 renamed `middleware.ts` to `proxy.ts` and stopped running ESLint during
  `next build`; that is a reading task, not a merge task. Minors are **not** ignored — 16.1.x →
  16.2.x carried ~28 security fixes.
