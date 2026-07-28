# Hardening Plan: CI, branch protection, dependency security

**Scope:** the GitHub-side and dependency-side work started 2026-07-28. Application behaviour is
out of scope — for that, see [`migration_plan.md`](migration_plan.md).

**Progress:** the substantive work is done and pushed. CI is fully exercised — push, pull_request
and concurrency cancellation all verified — and the first Dependabot backlog is cleared, with one
PR (#9) green and awaiting merge. What remains is the Vercel Node reconciliation (§2, now
actionable), standing watch items, and untested mail (§6). Nothing below is blocking.

Throughout: **✅ = done and verified** · **🟡 = done but unverified** · **🔴 = still to do**

---

## 0. What is already in place

| Item | State |
| --- | --- |
| `.github/workflows/ci.yml` — typecheck, lint, build | ✅ green on first run (40s, Node 24 / `ubuntu-latest`) |
| `main` ruleset — `deletion` + `non_fast_forward` | ✅ active (id `19906691`), confirmed via rules API |
| Secret scanning | ✅ enabled (was already) |
| Push protection | ✅ enabled (was already) |
| Actions default token = `read` | ✅ (was already) |
| Dependabot alerts + security updates | ✅ enabled this session |
| `.github/dependabot.yml` — grouped weekly | ✅ ran, first backlog triaged (§5) |
| Every *fixable* advisory | ✅ cleared in `6006ade` — open alerts went 43 → 4 |
| `npm run typecheck` script | ✅ added, passes locally and in CI |
| Vercel project | ✅ linked mid-session, production build green — but see §2 |

---

## 1. ✅ CI is fully exercised

**Verified:** run [`30374669794`](https://github.com/cskevint/madamambition/actions/runs/30374669794)
on the `main` push, green in 40s. `actions/checkout@v7` and `actions/setup-node@v7` both resolved,
`npm ci` succeeded against the committed lockfile on a clean machine, and Node 24 /
`ubuntu-latest` built the site with no `.env.local` present — confirming nothing needs
`RESEND_API_KEY` at build time.

CI surfaced the one tolerated eslint warning as a run annotation (`postcss.config.mjs#1`), which
is a nicer way to see it than local output. See §7.

✅ **The `pull_request` trigger is verified too**, and sooner than expected — Dependabot's own PRs
exercised it within minutes. Four runs, three green and one red, and **the red one was correct**:
see §5. CI earned its keep on day one.

✅ **`cancel-in-progress` is verified too**, also incidentally: merging five Dependabot PRs in
quick succession cancelled four in-flight `main` runs and let only the last complete. That is the
intended behaviour — the superseded runs were wasted work — and it means a green tick on `main`
after a burst of merges belongs to the *final* state, not to each intermediate commit.

## 2. 🔴 Reconcile the Node version with Vercel — now actionable

`node-version: 24` was chosen as an **assumption**: Vercel's default at the time, and it satisfies
Next's `engines: >=20.9.0`. When this was written there was no deploy platform to compare against.

**That changed mid-session — the repo is now linked to Vercel.** Production and Preview deployments
appear from `vercel[bot]`, and the production build is **green** (`● Ready`), so whatever Node
Vercel selected does build this app. A `Vercel Preview Comments` check now runs on PRs alongside
`verify`.

Still to do, because the local Vercel CLI (54.4.1, outdated) does not list the project and the
MCP endpoint returned `401` for its build logs:

1. Read the Node version from the Vercel project settings or a build log — **this has not been
   verified**, only inferred to be compatible from the fact that the build succeeded.
2. If it differs from 24, change the CI pin to match. A green CI run must mean the same thing as a
   green deploy.
3. Record it in `package.json` `engines` so the two cannot silently drift. Nothing in the repo
   states a Node version, which is why the pin had to be a guess in the first place.
4. Upgrade the CLI (`npm i -g vercel@latest`) — 54.4.1 could not see the project at all, which is
   what blocked steps 1–3.

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
| `next → postcss` | **Exact pin** at `8.4.31`; the 8.5.x patches are unreachable. Still pinned in `16.2.12`. Accounts for **3 of the 4** open alerts | Next.js moves its pin |
| `next → sharp` | `^0.34.5` — a caret on `0.x` pins the minor, so `0.35.0` is out of range. The **4th** alert | Next.js widens to `^0.35` |
| `minimatch@3.x → brace-expansion@^1.1.7` | Fix landed only in `5.0.8`; `1.1.16` is the highest 1.x ever published, so there is no 1.x version to move to. Dev-only, and it cascades to `minimatch`, `eslint`, `eslint-config-next` and every `eslint-plugin-*` — 9 of the 12 `npm audit` entries | eslint's tree moves off `minimatch@3` |

**Dependabot confirmed the first two itself.** Its security-update runs for `postcss` and `sharp`
both *errored* rather than opening a PR, with: `The latest possible version that can be installed
is 0.34.5 because of the following conflicting dependencies`. Two consequences worth knowing:

- Recurring failed Dependabot runs on these two packages are **expected**, not a
  misconfiguration. Don't go debugging them.
- The feared `overrides` PR **did not materialise**. Dependabot errored instead of diverging from
  the framework's pin. Keep the review habit anyway, but this is evidence it is unlikely here.

**`brace-expansion` is the reverse case: `npm audit` flags it and Dependabot does not.** Dependabot
reports one version per package per manifest and sees the patched `5.0.8` copy, so the nested
`1.1.16` never becomes an alert. Checked GitHub's own advisory (`GHSA-mh99-v99m-4gvg`) via the
API: range `<= 5.0.7`, first patched `5.0.8` — which does cover `1.1.16`. So `npm audit` is right
and the alert count is quietly understating this one. **Read both sources**; neither alone is
complete.

**Never run `npm audit fix --force` in this repo.** It proposes `next@9.3.3`, `eslint@4.0.0` and
`eslint-config-next@0.2.4` — years-old downgrades. A suggested *downgrade* is the signal that no
forward fix exists and audit is falling back to the newest version predating the advisory. Also
note `npm audit` claims `next@16.2.12` fixes postcss and sharp; it does not.

## 5. ✅ The first PR backlog is cleared

| PR | Bump | Outcome |
| --- | --- | --- |
| #1 | `flatted` 3.4.1 → 3.4.3 | merged — rebased to a lockfile no-op, already patched by `npm audit fix` |
| #2 | `uuid` and `resend` | merged — also a no-op; `resend@6.18.1` had already removed `uuid` |
| #3 | `next` 16.1.6 → 16.2.**11** | **closed** — `main` is on 16.2.**12**, so this was a downgrade, and it conflicted |
| #4 | minor-and-patch group, 8 updates | closed by Dependabot, superseded by #9 |
| #5 | `lint-staged` 16 → 17 | merged, CI green |
| #6 | `@types/node` 20 → 26 | merged, CI green |
| #7 | `eslint` 9 → 10 | **closed** by the new ignore rule — see §5b |
| #8 | `lucide-react` 0.577 → 1.27 | merged, CI green |
| #9 | minor-and-patch group, 9 updates | rebased, CI green, **awaiting merge** |

`main` at `2f60f3c` is verified green in CI, and re-verified locally after `npm ci` — typecheck,
lint and build all pass with the three merged majors (`lucide-react` 1.x, `@types/node` 26,
`lint-staged` 17) in place. Open alerts remain **4**, all from §4.

**#9 is ready.** `date-fns` 4.1→4.4, `react`/`react-dom` 19.2.3→19.2.8, `@types/react`
19.2.14→19.2.17, `@tailwindcss/postcss` 4.2.1→4.3.3, `eslint` 9.39.4→9.39.5, `oxfmt` 0.40→0.61,
`oxlint` 1.55→1.76. `verify` and the Vercel preview check both pass; verified locally too.

One thing CI cannot see was checked by hand, because `oxfmt` and `oxlint` run **only in the
pre-commit hook**, never in CI: `oxfmt@0.61` reformats 6 files, but all of them are `.md`, `.html`
or `.json`, and `lint-staged` is scoped to `*.{js,jsx,ts,tsx}` — so the hook will not sweep-reformat
anything. All 24 JS/TS files are already correctly formatted under the new version, and
`oxlint@1.76` reports zero issues. **Worth repeating this check on future `oxfmt`/`oxlint` bumps**:
a formatter jump is exactly the kind of change that silently turns the next commit into a
whole-tree diff, and CI would never tell you.

## 5b. 🔴 Decide whether major bumps need their own group

The first `dependabot.yml` run opened **five** PRs, not the one intended:

| PR | Bump | CI |
| --- | --- | --- |
| [#4](https://github.com/cskevint/madamambition/pull/4) | the `npm-minor-and-patch` group, 8 updates | — |
| [#5](https://github.com/cskevint/madamambition/pull/5) | `lint-staged` 16 → 17 | ✅ |
| [#6](https://github.com/cskevint/madamambition/pull/6) | `@types/node` 20 → 26 | ✅ |
| [#7](https://github.com/cskevint/madamambition/pull/7) | `eslint` 9 → 10 | ❌ |
| [#8](https://github.com/cskevint/madamambition/pull/8) | `lucide-react` 0.577 → 1.27 | ✅ |

**This is the config working as written, not a bug.** The group covers `minor` and `patch` only, so
every **major** gets its own PR. Majors were only ignored for `next`, `eslint-config-next`, `react`
and `react-dom`, and everything else was overdue at once.

Read this as a **one-time backlog flush** — Dependabot had never run here. Steady state should be
close to the intended one PR a week, since majors are rare. So the recommendation is to leave the
config alone and re-measure in a few weeks. If majors do prove noisy, add a second group keyed to
`update-types: ["major"]`, accepting the trade-off that one unmergeable major then blocks the
others in its PR.

**`eslint` 9 → 10 has since been added to the ignore list.** CI caught it: `Error while loading
rule 'react/display-name': contextOrFilename.getFilename is not a function`. `eslint-config-next`
bundles `eslint-plugin-react@^7.37.0`, which is not eslint-10 compatible — its `eslint: >=9.0.0`
peer range is optimistic. Blocked upstream, not by anything here, which is the same reasoning
already applied to the framework majors. Revisit when `eslint-config-next` ships a compatible
plugin; Dependabot should close #7 on its next run.

The `github-actions` entry ran clean and opened nothing, since both actions are already on their
current major.

Alert counts lag the lockfile until the fixing commit reaches `main`. Post-push reading, which is
the meaningful one: **4 open, all runtime, 0 development** — down from 43 (35 runtime, 8
development). Every remaining one is in §4.

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
  `import/no-anonymous-default-export`. CI does not pass `--max-warnings 0`, so it stays green and
  the warning shows up as a run annotation. Either fix the file and add the flag, or leave it
  deliberately — but decide, rather than letting the warning count drift upward unnoticed.
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
