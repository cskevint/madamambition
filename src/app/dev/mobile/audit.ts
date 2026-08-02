/**
 * Automated mobile checks, run by the *parent* document against the preview iframe's window.
 *
 * Two hard constraints shape everything here:
 *
 * 1. CROSS-REALM. The frame's elements come from a different JavaScript realm, so
 *    `el instanceof HTMLElement` is `false` even for perfectly real elements. There is not a
 *    single `instanceof` in this file, and every computed style comes from the frame's own
 *    `win.getComputedStyle` rather than the parent's. Node type constants are written as
 *    literals (1 = ELEMENT_NODE, 4 = SHOW_TEXT) for the same reason.
 *
 * 2. TEXT-FIRST. `formatReport` renders the whole thing as plain text so findings are
 *    readable without a screenshot; the caller also console.logs the JSON.
 *
 * Every check caps its output and reports how many findings were suppressed. A page with 80
 * small tap targets has one systemic problem, not 80 — and an audit that cries wolf gets
 * ignored.
 */

// Elements and windows from the framed realm. Typing these as the parent's DOM types would
// be a lie: they are structurally identical but not the same constructors.
/* eslint-disable @typescript-eslint/no-explicit-any */
type El = any;
type Win = any;
type Doc = any;

export type Severity = "error" | "warn" | "info";

export interface Finding {
  severity: Severity;
  message: string;
  selector: string;
  detail?: string;
}

export interface CheckResult {
  check: string;
  ok: boolean;
  summary: string;
  findings: Finding[];
  suppressed: number;
}

export interface Landmark {
  text: string;
  top: number;
  selector: string;
}

export interface AuditReport {
  path: string;
  viewport: { width: number; height: number };
  metrics: {
    scrollWidth: number;
    clientWidth: number;
    scrollHeight: number;
    screens: number;
    folds: number;
  };
  checks: CheckResult[];
  structure: {
    stickyOrFixed: Finding[];
    landmarks: Landmark[];
    landmarksSuppressed: number;
  };
  totals: { error: number; warn: number; info: number };
}

/** Overlap between fold steps, so nothing is lost across a screenshot seam. */
export const FOLD_OVERLAP = 64;

const MAX_FINDINGS = 15;
const MAX_LANDMARKS = 40;

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="switch"]',
  "[onclick]",
].join(", ");

/** Input types that summon a keyboard, and therefore trigger the iOS focus-zoom. */
const KEYBOARD_INPUT_TYPES = new Set([
  "",
  "text",
  "email",
  "password",
  "search",
  "tel",
  "url",
  "number",
  "date",
  "datetime-local",
  "month",
  "week",
  "time",
]);

// ---------------------------------------------------------------------------
// small cross-realm helpers
// ---------------------------------------------------------------------------

function isElement(node: El): boolean {
  return !!node && node.nodeType === 1;
}

function all(doc: Doc, selector: string): El[] {
  return Array.prototype.slice.call(doc.querySelectorAll(selector));
}

function styleOf(win: Win, el: El): any {
  try {
    return win.getComputedStyle(el);
  } catch {
    return null;
  }
}

/** display/visibility only — an opacity-0 element is still laid out and still tappable. */
function isRendered(win: Win, el: El): boolean {
  const s = styleOf(win, el);
  if (!s) return false;
  return s.display !== "none" && s.visibility !== "hidden";
}

function rectOf(el: El): {
  top: number;
  left: number;
  right: number;
  width: number;
  height: number;
} {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, right: r.right, width: r.width, height: r.height };
}

/** A short, human-readable identifier: `button.text-brand-beige "Menu"`. */
function describe(el: El): string {
  if (!isElement(el)) return "(non-element)";
  const tag = String(el.tagName || "?").toLowerCase();
  const id = el.id ? `#${el.id}` : "";

  let cls = "";
  const raw = el.getAttribute ? el.getAttribute("class") : null;
  if (raw) {
    const parts = String(raw).trim().split(/\s+/).filter(Boolean).slice(0, 3);
    if (parts.length) cls = `.${parts.join(".")}`;
    const total = String(raw).trim().split(/\s+/).filter(Boolean).length;
    if (total > 3) cls += `…(+${total - 3})`;
  }

  let label = "";
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  if (text) label = ` "${text.length > 40 ? `${text.slice(0, 40)}…` : text}"`;
  else if (el.getAttribute && el.getAttribute("aria-label")) {
    label = ` [aria-label="${el.getAttribute("aria-label")}"]`;
  } else if (tag === "img" && el.getAttribute && el.getAttribute("src")) {
    const src = String(el.getAttribute("src"));
    label = ` [src=…${src.slice(-40)}]`;
  }

  return `${tag}${id}${cls}${label}`;
}

function result(
  check: string,
  findings: Finding[],
  okSummary: string,
  badSummary: (n: number) => string,
): CheckResult {
  const total = findings.length;
  const kept = findings.slice(0, MAX_FINDINGS);
  return {
    check,
    ok: total === 0,
    summary: total === 0 ? okSummary : badSummary(total),
    findings: kept,
    suppressed: total - kept.length,
  };
}

// ---------------------------------------------------------------------------
// 1. horizontal overflow
// ---------------------------------------------------------------------------

/**
 * Two filters keep this honest:
 *   - skip anything clipped by an ancestor whose overflow-x is not `visible`, because an
 *     intentional bleed inside a scroller is not a bug;
 *   - report only the OUTERMOST offender, because every child of an over-wide element is
 *     also over-wide and listing them all buries the actual cause.
 */
function checkHorizontalOverflow(win: Win, doc: Doc): CheckResult {
  const de = doc.documentElement;
  const viewportWidth = de.clientWidth;
  const overflow = de.scrollWidth - viewportWidth;

  if (overflow <= 1) {
    return result("Horizontal overflow", [], "No horizontal overflow.", () => "");
  }

  const isClipped = (el: El): boolean => {
    let p = el.parentElement;
    while (p && p !== de) {
      const s = styleOf(win, p);
      if (s && s.overflowX && s.overflowX !== "visible") return true;
      p = p.parentElement;
    }
    return false;
  };

  const scrollX = win.scrollX || 0;
  const offenders: El[] = [];

  for (const el of all(doc, "*")) {
    if (!isRendered(win, el)) continue;
    const r = rectOf(el);
    if (r.width === 0 && r.height === 0) continue;

    const right = r.right + scrollX;
    const left = r.left + scrollX;
    if (right <= viewportWidth + 1 && left >= -1) continue;
    if (isClipped(el)) continue;

    offenders.push(el);
  }

  // Keep only the outermost: drop any offender that has an offender as an ancestor.
  const offenderSet = new Set(offenders);
  const outermost = offenders.filter((el) => {
    let p = el.parentElement;
    while (p) {
      if (offenderSet.has(p)) return false;
      p = p.parentElement;
    }
    return true;
  });

  const findings: Finding[] = outermost.map((el) => {
    const r = rectOf(el);
    const right = r.right + scrollX;
    const past = Math.round(right - viewportWidth);
    return {
      severity: "error" as Severity,
      message:
        past > 0
          ? `extends ${past}px past the right edge (right=${Math.round(right)}, viewport=${viewportWidth})`
          : `starts ${Math.round(-(r.left + scrollX))}px left of the viewport`,
      selector: describe(el),
      detail: `width=${Math.round(r.width)}px`,
    };
  });

  // The document overflows but no unclipped element accounts for it — worth saying so
  // rather than silently reporting nothing.
  if (findings.length === 0) {
    findings.push({
      severity: "warn",
      message: `Document scrolls ${overflow}px horizontally, but every over-wide element is clipped by an ancestor. Likely a margin/negative-offset, not an element box.`,
      selector: "documentElement",
    });
  }

  return result(
    "Horizontal overflow",
    findings,
    "No horizontal overflow.",
    (n) => `Document overflows by ${overflow}px; ${n} outermost offender(s).`,
  );
}

// ---------------------------------------------------------------------------
// 2. tap targets
// ---------------------------------------------------------------------------

/**
 * Resolves an input's EFFECTIVE tap target through its <label>. A `sr-only` radio is 1×1px
 * but its label is a full-size pill — reporting the 1×1 is crying wolf.
 */
function effectiveRect(doc: Doc, el: El): { width: number; height: number } {
  let { top, left, right, width, height } = rectOf(el);
  let bottom = top + height;

  const labels: El[] = [];
  try {
    if (el.labels && el.labels.length) {
      for (const l of Array.prototype.slice.call(el.labels)) labels.push(l);
    }
  } catch {
    /* not a labelable element */
  }
  if (!labels.length && el.id) {
    try {
      const forLabel = doc.querySelector(`label[for="${CSS.escape(String(el.id))}"]`);
      if (forLabel) labels.push(forLabel);
    } catch {
      /* invalid id for a selector */
    }
  }
  if (!labels.length && el.closest) {
    const wrapping = el.closest("label");
    if (wrapping) labels.push(wrapping);
  }

  for (const l of labels) {
    const r = rectOf(l);
    if (r.width === 0 && r.height === 0) continue;
    top = Math.min(top, r.top);
    left = Math.min(left, r.left);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.top + r.height);
  }

  width = Math.max(width, right - left);
  height = Math.max(height, bottom - top);
  return { width, height };
}

/**
 * WCAG 2.2 SC 2.5.8 exempts a target that is "in a sentence or its size is otherwise
 * constrained by the line-height of non-target text" — you cannot pad a link inside running
 * prose without wrecking the paragraph.
 *
 * The test is deliberately narrow: the element must be `display: inline` AND its containing
 * block must hold text that is NOT inside a link. A `<br>`-separated list of links (the
 * site's footer Explore column) has no non-link text, so it stays checked — which is right,
 * because that one is a navigation list, not a sentence.
 */
function isInlineInProse(win: Win, el: El): boolean {
  const s = styleOf(win, el);
  if (!s || s.display !== "inline") return false;

  const parent = el.parentElement;
  if (!parent) return false;

  const strip = (v: string) => v.replace(/\s+/g, "");
  const allText = strip(parent.textContent || "");
  const linkText = all(parent, "a, button").reduce(
    (sum: string, node: El) => sum + strip(node.textContent || ""),
    "",
  );

  return allText.length > linkText.length;
}

function checkTapTargets(win: Win, doc: Doc): CheckResult {
  const findings: Finding[] = [];
  const candidates = all(doc, INTERACTIVE_SELECTOR);

  for (const el of candidates) {
    if (!isRendered(win, el)) continue;

    const tag = String(el.tagName || "").toLowerCase();
    if (tag === "input") {
      const type = String(el.getAttribute("type") || "text").toLowerCase();
      if (type === "hidden") continue;
    }

    const eff = effectiveRect(doc, el);
    // Not laid out at all (a detached or zero-box control) — not a tap-target problem.
    if (eff.width < 1 && eff.height < 1) continue;
    if (eff.width >= 44 && eff.height >= 44) continue;

    // A link inside running prose is exempt — see isInlineInProse.
    if (isInlineInProse(win, el)) continue;

    // A small control inside a large interactive ancestor is fine — the ancestor is the
    // real target.
    let covered = false;
    let p = el.parentElement;
    while (p && p !== doc.documentElement) {
      if (p.matches && p.matches(INTERACTIVE_SELECTOR)) {
        const pe = effectiveRect(doc, p);
        if (pe.width >= 44 && pe.height >= 44) {
          covered = true;
          break;
        }
      }
      p = p.parentElement;
    }
    if (covered) continue;

    const w = Math.round(eff.width);
    const h = Math.round(eff.height);
    const critical = eff.width < 24 || eff.height < 24;

    findings.push({
      severity: critical ? "error" : "warn",
      message: critical
        ? `${w}×${h}px — under the 24px WCAG 2.2 SC 2.5.8 floor`
        : `${w}×${h}px — under the 44×44px Apple HIG minimum`,
      selector: describe(el),
    });
  }

  findings.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "error" ? -1 : 1));

  return result(
    "Tap targets",
    findings,
    `All ${candidates.length} interactive elements meet 44×44px.`,
    (n) => `${n} of ${candidates.length} interactive elements are under 44×44px.`,
  );
}

// ---------------------------------------------------------------------------
// 3. input font size
// ---------------------------------------------------------------------------

function checkInputFontSize(win: Win, doc: Doc): CheckResult {
  const findings: Finding[] = [];

  for (const el of all(doc, "input, select, textarea")) {
    if (!isRendered(win, el)) continue;

    const tag = String(el.tagName || "").toLowerCase();
    if (tag === "input") {
      const type = String(el.getAttribute("type") || "text").toLowerCase();
      if (!KEYBOARD_INPUT_TYPES.has(type)) continue;
    }

    const s = styleOf(win, el);
    if (!s) continue;
    const size = parseFloat(s.fontSize);
    if (!Number.isFinite(size) || size >= 16) continue;

    findings.push({
      severity: "error",
      message: `font-size ${size}px — iOS Safari zooms the page on focus and does not zoom back`,
      selector: describe(el),
    });
  }

  return result(
    "Input font size (iOS zoom)",
    findings,
    "All text inputs are 16px or larger.",
    (n) => `${n} input(s) under 16px — iOS will zoom on focus.`,
  );
}

// ---------------------------------------------------------------------------
// 4. small text
// ---------------------------------------------------------------------------

function checkSmallText(win: Win, doc: Doc): CheckResult {
  const findings: Finding[] = [];
  const seen = new Set<El>();

  // 4 === NodeFilter.SHOW_TEXT, written as a literal to avoid reaching for the frame's
  // NodeFilter across realms.
  const walker = doc.createTreeWalker(doc.body, 4);
  let node = walker.nextNode();

  while (node) {
    const text = (node.nodeValue || "").trim();
    if (text) {
      const parent = node.parentElement;
      if (parent && !seen.has(parent)) {
        seen.add(parent);
        if (isRendered(win, parent)) {
          const r = rectOf(parent);
          // Skip sr-only / clipped boxes: they are not read visually anyway.
          if (r.width >= 1 && r.height >= 1) {
            const s = styleOf(win, parent);
            const size = s ? parseFloat(s.fontSize) : NaN;
            if (Number.isFinite(size) && size < 12) {
              findings.push({
                severity: "warn",
                message: `font-size ${size}px — under the 12px readability floor`,
                selector: describe(parent),
              });
            }
          }
        }
      }
    }
    node = walker.nextNode();
  }

  return result(
    "Small text",
    findings,
    "No visible text under 12px.",
    (n) => `${n} element(s) render text under 12px.`,
  );
}

// ---------------------------------------------------------------------------
// 5. images
// ---------------------------------------------------------------------------

function checkImages(win: Win, doc: Doc): CheckResult {
  const findings: Finding[] = [];
  const viewportWidth = doc.documentElement.clientWidth;

  for (const el of all(doc, "img")) {
    // `alt=""` is a valid decorative marker; a MISSING attribute is not.
    if (!el.hasAttribute("alt")) {
      findings.push({
        severity: "error",
        message: 'missing alt attribute (use alt="" if decorative)',
        selector: describe(el),
      });
    }

    if (!isRendered(win, el)) continue;
    const r = rectOf(el);
    if (r.width > viewportWidth + 1) {
      findings.push({
        severity: "error",
        message: `renders ${Math.round(r.width)}px wide in a ${viewportWidth}px viewport`,
        selector: describe(el),
      });
    }
  }

  return result(
    "Images",
    findings,
    "All images have an alt attribute and fit the viewport.",
    (n) => `${n} image issue(s).`,
  );
}

// ---------------------------------------------------------------------------
// 6. viewport meta
// ---------------------------------------------------------------------------

function checkViewportMeta(doc: Doc): CheckResult {
  const meta = doc.querySelector('meta[name="viewport"]');
  if (!meta) {
    return result(
      "Viewport meta",
      [
        {
          severity: "error",
          message:
            'No <meta name="viewport"> — mobile browsers will lay the page out at ~980px and scale it down.',
          selector: "head",
        },
      ],
      "",
      () => "Missing.",
    );
  }

  const content = String(meta.getAttribute("content") || "");
  const findings: Finding[] = [];
  if (/user-scalable\s*=\s*no/i.test(content) || /maximum-scale\s*=\s*1(\.0)?\b/i.test(content)) {
    findings.push({
      severity: "warn",
      message: `blocks pinch-zoom (content="${content}") — fails WCAG 1.4.4`,
      selector: 'meta[name="viewport"]',
    });
  }

  return result("Viewport meta", findings, `Present: "${content}"`, (n) => `${n} issue(s).`);
}

// ---------------------------------------------------------------------------
// 0. layout viewport vs requested width
// ---------------------------------------------------------------------------

/**
 * Desktop Chrome gives a scrolling iframe a classic (space-consuming) scrollbar, so a frame
 * element set to 393px can have a ~378px LAYOUT viewport — and media queries resolve against
 * the layout viewport. Every measurement below, and every breakpoint the page evaluates, uses
 * the smaller number. A real phone uses overlay scrollbars and loses nothing.
 *
 * Surfaced rather than corrected: silently adjusting would hide the fact that the harness is
 * reviewing a slightly narrower page than the label claims.
 */
function checkLayoutViewport(doc: Doc, requestedWidth: number): CheckResult {
  const actual = doc.documentElement.clientWidth;
  const inset = requestedWidth - actual;

  if (inset <= 0) {
    return result(
      "Layout viewport",
      [],
      `${actual}px — matches the requested ${requestedWidth}px.`,
      () => "",
    );
  }

  return result(
    "Layout viewport",
    [
      {
        severity: "info",
        message: `Frame is ${requestedWidth}px wide but the layout viewport is ${actual}px — ${inset}px lost to a desktop scrollbar. Media queries and every measurement below resolve against ${actual}px. A real phone uses overlay scrollbars and would render at the full ${requestedWidth}px.`,
        selector: "documentElement",
      },
    ],
    "",
    () => `${inset}px narrower than requested (desktop scrollbar).`,
  );
}

// ---------------------------------------------------------------------------
// structure — facts no screenshot will hand you
// ---------------------------------------------------------------------------

function collectStructure(win: Win, doc: Doc) {
  const scrollY = win.scrollY || 0;

  const stickyOrFixed: Finding[] = [];
  for (const el of all(doc, "*")) {
    const s = styleOf(win, el);
    if (!s) continue;
    if (s.position === "sticky" || s.position === "fixed") {
      if (!isRendered(win, el)) continue;
      const r = rectOf(el);
      stickyOrFixed.push({
        severity: "info",
        message: `position: ${s.position} (top: ${s.top}, height: ${Math.round(r.height)}px, z-index: ${s.zIndex})`,
        selector: describe(el),
      });
    }
  }

  const landmarksAll: Landmark[] = [];
  for (const el of all(doc, "a[href], button")) {
    if (!isRendered(win, el)) continue;
    const r = rectOf(el);
    if (r.width < 1 || r.height < 1) continue;
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    const aria = el.getAttribute ? el.getAttribute("aria-label") : null;
    const labelText = text || (aria ? `[${aria}]` : "");
    if (!labelText) continue;
    landmarksAll.push({
      text: labelText.length > 50 ? `${labelText.slice(0, 50)}…` : labelText,
      top: Math.round(r.top + scrollY),
      selector: describe(el),
    });
  }
  landmarksAll.sort((a, b) => a.top - b.top);

  return {
    stickyOrFixed: stickyOrFixed.slice(0, MAX_FINDINGS),
    landmarks: landmarksAll.slice(0, MAX_LANDMARKS),
    landmarksSuppressed: Math.max(0, landmarksAll.length - MAX_LANDMARKS),
  };
}

// ---------------------------------------------------------------------------
// entry point
// ---------------------------------------------------------------------------

export function runAudit(
  win: Win,
  path: string,
  requestedWidth: number,
  viewportHeight: number,
): AuditReport {
  const doc = win.document;
  const de = doc.documentElement;

  const checks: CheckResult[] = [
    checkLayoutViewport(doc, requestedWidth),
    checkHorizontalOverflow(win, doc),
    checkTapTargets(win, doc),
    checkInputFontSize(win, doc),
    checkSmallText(win, doc),
    checkImages(win, doc),
    checkViewportMeta(doc),
  ];

  const totals = { error: 0, warn: 0, info: 0 };
  for (const c of checks) for (const f of c.findings) totals[f.severity] += 1;

  const scrollHeight = de.scrollHeight;
  const step = Math.max(1, viewportHeight - FOLD_OVERLAP);

  return {
    path,
    viewport: { width: de.clientWidth, height: viewportHeight },
    metrics: {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      scrollHeight,
      screens: Math.round((scrollHeight / viewportHeight) * 10) / 10,
      folds: Math.max(1, Math.ceil((scrollHeight - viewportHeight) / step) + 1),
    },
    checks,
    structure: collectStructure(win, doc),
    totals,
  };
}

// ---------------------------------------------------------------------------
// text rendering
// ---------------------------------------------------------------------------

const MARK: Record<Severity, string> = { error: "✗", warn: "!", info: "·" };

export function formatReport(r: AuditReport): string {
  const lines: string[] = [];

  lines.push(`${r.path}  @ ${r.viewport.width}×${r.viewport.height}`);
  lines.push(
    `page ${r.metrics.scrollHeight}px = ${r.metrics.screens} screens · ${r.metrics.folds} folds · ` +
      `scrollWidth ${r.metrics.scrollWidth} vs client ${r.metrics.clientWidth}`,
  );
  lines.push(`${r.totals.error} error · ${r.totals.warn} warn`);
  lines.push("");

  for (const c of r.checks) {
    lines.push(`── ${c.check}${c.ok ? "  ✓" : ""}`);
    lines.push(`   ${c.summary}`);
    for (const f of c.findings) {
      lines.push(`   ${MARK[f.severity]} ${f.selector}`);
      lines.push(`     ${f.message}${f.detail ? `  (${f.detail})` : ""}`);
    }
    if (c.suppressed > 0) {
      lines.push(`   … ${c.suppressed} more suppressed (same systemic issue)`);
    }
    lines.push("");
  }

  lines.push("── Structure");
  if (r.structure.stickyOrFixed.length === 0) {
    lines.push("   No sticky or fixed elements.");
  } else {
    for (const f of r.structure.stickyOrFixed) {
      lines.push(`   · ${f.selector}`);
      lines.push(`     ${f.message}`);
    }
  }
  lines.push("");
  lines.push(`   Links & buttons by scroll offset (of ${r.metrics.scrollHeight}px):`);
  for (const l of r.structure.landmarks) {
    lines.push(`     ${String(l.top).padStart(6)}px  ${l.text}`);
  }
  if (r.structure.landmarksSuppressed > 0) {
    lines.push(`     … ${r.structure.landmarksSuppressed} more`);
  }

  return lines.join("\n");
}
