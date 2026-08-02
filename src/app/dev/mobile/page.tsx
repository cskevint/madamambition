import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MobilePreview from "./MobilePreview";
import { DEFAULT_PATH, sanitizePath } from "./path";
import { getPreviewRoutes } from "./routes";

/**
 * Dev-only mobile preview harness.
 *
 * Renders the real site inside a device-sized iframe. An iframe rather than a narrow
 * container because this site is styled with CSS media queries (`min-[981px]:`), and media
 * queries resolve against the VIEWPORT, not against a parent element's width. Inside a 393px
 * div every desktop branch would stay active — the desktop nav would stay visible, the
 * hamburger would stay hidden — and every screenshot would look plausible and be wrong. An
 * iframe has a viewport of its own, so at width 393 the mobile branch renders for real.
 *
 * The production guard below is what lets this live in the repo permanently: it cannot be
 * reached on a deploy, so it needs no auth.
 */

export const metadata: Metadata = {
  title: "Mobile preview (dev)",
  robots: { index: false, follow: false },
};

const DEFAULT_WIDTH = 393;
const DEFAULT_HEIGHT = 852;

function intParam(
  value: string | string[] | undefined,
  fallback: number,
  min: number,
  max: number,
) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return fallback;
  return parsed;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function MobilePreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const params = await searchParams;

  return (
    <MobilePreview
      routes={getPreviewRoutes()}
      initialPath={sanitizePath(firstParam(params.path) ?? DEFAULT_PATH)}
      initialWidth={intParam(params.w, DEFAULT_WIDTH, 200, 2560)}
      initialHeight={intParam(params.h, DEFAULT_HEIGHT, 200, 2560)}
      initialFold={intParam(params.fold, 0, 0, 500)}
    />
  );
}
