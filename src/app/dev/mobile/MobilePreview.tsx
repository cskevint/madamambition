"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FOLD_OVERLAP, formatReport, runAudit, type AuditReport } from "./audit";
import { samePath, sanitizePath } from "./path";
import type { PreviewRoute } from "./routes";

interface Device {
  name: string;
  w: number;
  h: number;
}

/**
 * The desktop entry is not a device — it is the control. This site's mobile branch is
 * `min-[981px]:`, so 1280 and 393 sit safely on either side of it, and flipping between them
 * is what proves the iframe has a real viewport of its own rather than just being a narrow
 * box. If the nav does not collapse, the harness is lying and every finding is worthless.
 */
const DEVICES: Device[] = [
  { name: "iPhone SE", w: 375, h: 667 },
  { name: "iPhone 15", w: 393, h: 852 },
  { name: "iPhone 15 Pro Max", w: 430, h: 932 },
  { name: "Pixel 8", w: 412, h: 915 },
  { name: "iPad mini", w: 744, h: 1133 },
  { name: "Desktop (control)", w: 1280, h: 800 },
];

/** Fonts and images reflow after readyState hits "complete"; the first numbers lie. */
const SETTLE_MS = 700;
const READY_TIMEOUT_MS = 4000;
const POLL_MS = 50;

type Status = "waiting" | "settling" | "ready" | "timeout" | "error";

interface Props {
  routes: PreviewRoute[];
  initialPath: string;
  initialWidth: number;
  initialHeight: number;
  initialFold: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Polls `readyState` instead of listening for the iframe's `load` event.
 *
 * On a server-rendered page the browser starts fetching the frame from the initial HTML and
 * frequently finishes BEFORE React hydrates and attaches `onLoad`. That handler then never
 * fires and the harness sits on "waiting" forever. Polling cannot miss the edge.
 *
 * Also requires the frame's pathname to match what was asked for, or a path change measures
 * the previous document. Gives up after ~4s so a redirect loop cannot wedge the harness.
 */
async function waitForFrame(
  frame: HTMLIFrameElement,
  expectedPath: string,
): Promise<Window | null> {
  const deadline = Date.now() + READY_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const win = frame.contentWindow;
      if (
        win &&
        win.document &&
        win.document.readyState === "complete" &&
        samePath(win.location.pathname, expectedPath)
      ) {
        return win;
      }
    } catch {
      // Cross-origin for an instant mid-navigation, or the document was swapped out from
      // under us. Keep polling.
    }
    await sleep(POLL_MS);
  }

  return null;
}

export default function MobilePreview({
  routes,
  initialPath,
  initialWidth,
  initialHeight,
  initialFold,
}: Props) {
  const [path, setPath] = useState(initialPath);
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [fold, setFold] = useState(initialFold);
  const [pathDraft, setPathDraft] = useState(initialPath);

  const [status, setStatus] = useState<Status>("waiting");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const frameRef = useRef<HTMLIFrameElement>(null);
  // Guards against an in-flight measurement landing after the inputs already moved on.
  const runIdRef = useRef(0);

  const grouped = useMemo(() => {
    const map = new Map<string, PreviewRoute[]>();
    for (const route of routes) {
      const list = map.get(route.group) ?? [];
      list.push(route);
      map.set(route.group, list);
    }
    return Array.from(map.entries());
  }, [routes]);

  /**
   * Resetting derived state DURING RENDER when the inputs change, rather than in an effect.
   * This is React's sanctioned pattern for "state that depends on props/state so far", and it
   * keeps the measurement effect free of any synchronous setState — the effect below becomes
   * a pure driver of the external system (the iframe) with all its updates landing after an
   * await.
   */
  const inputKey = `${path}::${width}::${height}::${reloadNonce}`;
  const [measuredKey, setMeasuredKey] = useState(inputKey);
  if (measuredKey !== inputKey) {
    setMeasuredKey(inputKey);
    setStatus("waiting");
    setReport(null);
  }

  /** Returns the fresh report so automation can read it synchronously off one call. */
  const audit = useCallback(
    (win: Window): AuditReport | null => {
      try {
        const next = runAudit(win, path, width, height);
        setReport(next);
        setErrorText(null);
        setStatus("ready");
        // Text first, so findings are readable without a screenshot; JSON alongside it.
        console.log(formatReport(next));
        console.log("[mobile-preview] report", next);
        return next;
      } catch (err) {
        setErrorText(err instanceof Error ? err.message : String(err));
        setStatus("error");
        return null;
      }
    },
    [path, width, height],
  );

  const measure = useCallback(async () => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    const frame = frameRef.current;
    if (!frame) return;

    // Deliberately no setState before this await: the "waiting" reset happens during render
    // (see the inputKey block above), which keeps this effect a pure external-system driver.
    const win = await waitForFrame(frame, path);
    if (runId !== runIdRef.current) return;

    if (!win) {
      setStatus("timeout");
      return;
    }

    setStatus("settling");
    await sleep(SETTLE_MS);
    if (runId !== runIdRef.current) return;

    audit(win);
  }, [path, audit]);

  /*
   * The rule below flags any effect that transitively reaches a setState. That is
   * unsatisfiable for this effect by construction: its whole job is to drive an external
   * system (the iframe), wait for it, and publish what it measured — the results cannot
   * exist until after an await. The synchronous resets it would otherwise cause were moved
   * into the render-phase inputKey block above, so what remains is only post-await
   * publication, which is the sanctioned use of an effect.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void measure();
  }, [measure]);

  const folds = report?.metrics.folds ?? 1;
  const step = Math.max(1, height - FOLD_OVERLAP);
  // Derived, not clamped in state: a shorter page arriving after a fold was chosen must not
  // trigger a second render pass just to pull the number back into range.
  const currentFold = Math.min(Math.max(0, fold), Math.max(0, folds - 1));

  /**
   * All state lives in the URL, synced with replaceState rather than the router.
   *
   * This is the single most important decision in the harness: it means a screenshot is one
   * navigation instead of a click sequence. Going through the router would re-render the
   * server component, reload the frame, and throw away the scroll position just set.
   *
   * Syncs the DERIVED fold, so the URL always names a fold that actually exists.
   */
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("path", path);
    url.searchParams.set("w", String(width));
    url.searchParams.set("h", String(height));
    url.searchParams.set("fold", String(currentFold));
    window.history.replaceState(null, "", url.toString());
  }, [path, width, height, currentFold]);

  // Scroll the frame whenever the fold changes. Runs after a report exists so `folds` is
  // known and the frame is definitely live.
  useEffect(() => {
    if (!report) return;
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.scrollTo({ top: currentFold * step, behavior: "instant" as ScrollBehavior });
  }, [currentFold, step, report]);

  /**
   * Escape hatch for driving the harness from an automation tool: one call to re-audit after
   * clicking something inside the frame, without hunting for the button in the DOM.
   */
  useEffect(() => {
    const api = {
      frame: () => frameRef.current,
      win: () => frameRef.current?.contentWindow ?? null,
      doc: () => frameRef.current?.contentDocument ?? null,
      /** Re-measure the frame as it stands right now, and hand back the result. */
      audit: () => {
        const win = frameRef.current?.contentWindow;
        return win ? audit(win) : null;
      },
      report: () => report,
      text: () => (report ? formatReport(report) : null),
    };
    (window as unknown as Record<string, unknown>).__preview = api;
  }, [audit, report]);

  const applyDevice = (device: Device) => {
    setWidth(device.w);
    setHeight(device.h);
    setFold(0);
  };

  const applyPath = (next: string) => {
    const clean = sanitizePath(next);
    setPath(clean);
    setPathDraft(clean);
    setFold(0);
  };

  const statusLabel: Record<Status, string> = {
    waiting: "waiting for frame…",
    settling: "settling (fonts/images)…",
    ready: "ready",
    timeout: `no load within ${READY_TIMEOUT_MS}ms — redirect, 404, or wrong path?`,
    error: `audit threw: ${errorText ?? "unknown"}`,
  };

  const statusColor =
    status === "ready"
      ? "#137333"
      : status === "timeout" || status === "error"
        ? "#c5221f"
        : "#8a6d1f";

  return (
    <>
      {/*
        The harness inherits the root layout, which wraps every page in the site header and
        footer. Hidden here rather than by editing the layout — the harness must not require
        production code to know about it.
      */}
      <style>{`
        body > header, body > footer { display: none !important; }
        body { background: #f5f5f4 !important; }
      `}</style>

      <div style={S.page}>
        <div style={S.controls}>
          <div style={S.row}>
            <strong style={S.brand}>Mobile preview</strong>
            <span style={{ ...S.status, color: statusColor }}>● {statusLabel[status]}</span>
          </div>

          <div style={S.row}>
            <label style={S.label}>Page</label>
            <select
              value={routes.some((r) => r.path === path) ? path : ""}
              onChange={(event) => applyPath(event.target.value)}
              style={{ ...S.input, minWidth: 280 }}
            >
              <option value="" disabled>
                — custom: {path} —
              </option>
              {grouped.map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((route) => (
                    <option key={route.path} value={route.path}>
                      {route.label} — {route.path}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                applyPath(pathDraft);
              }}
              style={S.inlineForm}
            >
              <input
                value={pathDraft}
                onChange={(event) => setPathDraft(event.target.value)}
                placeholder="/any/path/"
                style={{ ...S.input, width: 170 }}
              />
              <button type="submit" style={S.button}>
                Go
              </button>
            </form>

            <button type="button" style={S.button} onClick={() => setReloadNonce((n) => n + 1)}>
              Reload
            </button>
          </div>

          <div style={S.row}>
            <label style={S.label}>Device</label>
            {DEVICES.map((device) => {
              const active = device.w === width && device.h === height;
              return (
                <button
                  key={device.name}
                  type="button"
                  onClick={() => applyDevice(device)}
                  style={active ? S.buttonActive : S.button}
                >
                  {device.name} {device.w}×{device.h}
                </button>
              );
            })}
          </div>

          <div style={S.row}>
            <label style={S.label}>Size</label>
            <input
              type="number"
              value={width}
              min={200}
              max={2560}
              onChange={(event) => setWidth(Number(event.target.value) || width)}
              style={{ ...S.input, width: 80 }}
            />
            <span style={S.dim}>×</span>
            <input
              type="number"
              value={height}
              min={200}
              max={2560}
              onChange={(event) => setHeight(Number(event.target.value) || height)}
              style={{ ...S.input, width: 80 }}
            />

            <span style={S.divider} />

            <label style={S.label}>Fold</label>
            <button
              type="button"
              style={S.button}
              onClick={() => setFold(Math.max(0, currentFold - 1))}
              disabled={currentFold <= 0}
            >
              ‹ prev
            </button>
            <span style={S.foldCount}>
              {currentFold + 1} / {folds}
            </span>
            <button
              type="button"
              style={S.button}
              onClick={() => setFold(Math.min(folds - 1, currentFold + 1))}
              disabled={currentFold >= folds - 1}
            >
              next ›
            </button>
            <span style={S.dim}>
              step {step}px ({FOLD_OVERLAP}px overlap)
            </span>

            <span style={S.divider} />

            <button
              type="button"
              style={S.button}
              onClick={() => {
                const win = frameRef.current?.contentWindow;
                if (win) audit(win);
              }}
            >
              Re-audit
            </button>
          </div>
        </div>

        <div style={S.stage}>
          <div style={S.frameColumn}>
            <div style={S.frameMeta}>
              {path} · {width}×{height}
            </div>
            {/*
              Exactly w×h with no CSS transform, so a screenshot is pixel-true. Keyed on path
              and the reload nonce so a change swaps in a fresh document rather than pushing
              a history entry onto the frame.
            */}
            <iframe
              key={`${path}::${reloadNonce}`}
              ref={frameRef}
              src={path}
              title={`Preview of ${path}`}
              width={width}
              height={height}
              style={{
                width,
                height,
                border: "1px solid #d6d3d1",
                background: "#fff",
                display: "block",
              }}
            />
          </div>

          <div style={S.reportColumn}>
            <pre style={S.pre}>
              {report
                ? formatReport(report)
                : status === "timeout"
                  ? statusLabel.timeout
                  : status === "error"
                    ? statusLabel.error
                    : "measuring…"}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Inline styles rather than Tailwind classes: the harness must not inherit the site's design
 * tokens or global CSS, and its own chrome must never show up in the site's audit.
 */
const S: Record<string, React.CSSProperties> = {
  page: {
    font: "13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace",
    color: "#1c1917",
    padding: 16,
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 12,
    background: "#fff",
    border: "1px solid #e7e5e4",
    borderRadius: 6,
    marginBottom: 16,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  row: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  brand: { fontSize: 14 },
  status: { marginLeft: "auto", fontSize: 12 },
  label: { width: 52, color: "#78716c", fontSize: 12 },
  input: {
    font: "inherit",
    padding: "4px 6px",
    border: "1px solid #d6d3d1",
    borderRadius: 4,
    background: "#fff",
  },
  inlineForm: { display: "flex", gap: 4 },
  button: {
    font: "inherit",
    padding: "4px 8px",
    border: "1px solid #d6d3d1",
    borderRadius: 4,
    background: "#fafaf9",
    cursor: "pointer",
  },
  buttonActive: {
    font: "inherit",
    padding: "4px 8px",
    border: "1px solid #1c1917",
    borderRadius: 4,
    background: "#1c1917",
    color: "#fff",
    cursor: "pointer",
  },
  dim: { color: "#a8a29e", fontSize: 12 },
  divider: { width: 1, height: 18, background: "#e7e5e4", margin: "0 4px" },
  foldCount: { minWidth: 52, textAlign: "center" },
  stage: { display: "flex", gap: 16, alignItems: "flex-start" },
  frameColumn: { flex: "0 0 auto" },
  frameMeta: { color: "#78716c", fontSize: 12, marginBottom: 4 },
  reportColumn: { flex: "1 1 auto", minWidth: 0 },
  pre: {
    margin: 0,
    padding: 12,
    background: "#fff",
    border: "1px solid #e7e5e4",
    borderRadius: 6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: "80vh",
    overflow: "auto",
    font: "12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace",
  },
};
