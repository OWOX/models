// Text helpers for the vector SVG export.
//
// The exported <text> has to be clipped the way the DOM clips it (Tailwind's
// `truncate` and `line-clamp-2`), so widths are measured with a 2D canvas using
// the same font stack the node renders with. Without a canvas (jsdom, or a
// browser that refuses the context) we fall back to an average glyph width —
// the export still comes out, just with slightly conservative truncation.

export const UI_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif";
export const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export type Font = { size: number; weight?: number; family?: string };

const AVG_GLYPH = 0.55; // fraction of the font size, used only without a canvas

let cached: CanvasRenderingContext2D | null | undefined;
function measureCtx(): CanvasRenderingContext2D | null {
  if (cached === undefined) {
    cached = typeof document === "undefined"
      ? null
      : document.createElement("canvas").getContext("2d");
  }
  return cached;
}

export function fontShorthand({ size, weight = 400, family = UI_FONT }: Font): string {
  return `${weight} ${size}px ${family}`;
}

export function measureText(text: string, font: Font): number {
  const ctx = measureCtx();
  if (!ctx) return text.length * font.size * AVG_GLYPH;
  ctx.font = fontShorthand(font);
  return ctx.measureText(text).width;
}

/** Clip `text` to `maxWidth`, ending in an ellipsis when anything was dropped. */
export function truncateToWidth(text: string, maxWidth: number, font: Font): string {
  if (maxWidth <= 0 || text === "") return "";
  if (measureText(text, font) <= maxWidth) return text;
  // Binary search the longest prefix that still fits with the ellipsis.
  let lo = 0, hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measureText(`${text.slice(0, mid)}…`, font) <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return lo === 0 ? "…" : `${text.slice(0, lo)}…`;
}

/**
 * Break `text` into at most `maxLines` lines no wider than `maxWidth`,
 * ellipsising the last one — the SVG equivalent of `line-clamp-N`.
 */
export function wrapToLines(text: string, maxWidth: number, maxLines: number, font: Font): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let line = "";
  let i = 0;
  for (; i < words.length; i++) {
    const candidate = line ? `${line} ${words[i]}` : words[i];
    // An over-wide single word still has to start a line; it gets clipped below.
    if (line === "" || measureText(candidate, font) <= maxWidth) { line = candidate; continue; }
    if (lines.length === maxLines - 1) break; // no room left — the rest overflows
    lines.push(line);
    line = words[i];
  }
  lines.push(line);
  const overflowed = i < words.length;
  const last = lines.length - 1;
  if (overflowed) lines[last] += "…";
  return lines.map(l => truncateToWidth(l, maxWidth, font));
}

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
};

/** Escape a string for use as SVG text content or an attribute value. */
export function escapeXml(text: string): string {
  return text.replace(/[&<>"']/g, ch => XML_ESCAPES[ch]);
}
