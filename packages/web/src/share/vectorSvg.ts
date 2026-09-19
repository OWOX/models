// Draws a CanvasScene as a real SVG — <rect>, <text>, <path>, nothing else.
//
// This is the difference that matters. html-to-image's toSvg() wraps a copy of
// the live HTML in a <foreignObject>, which only a browser can read: Safari
// mis-scales it, design tools open it blank, and it can't be rasterised to PNG
// because it taints the canvas. The output here is ordinary vector geometry, so
// it renders anywhere, opens in Figma, and doubles as the source for the PNG
// export.
//
// The numbers below mirror MartNode's Tailwind classes. Card rects use the
// measured height straight from React Flow, so the frame is always exact even
// if a content row is a pixel off.

import type { CanvasScene, SceneLabel, SceneNode } from "./canvasScene";
import { escapeXml, measureText, truncateToWidth, wrapToLines, MONO_FONT, UI_FONT } from "./svgText";
import { WATERMARK_MARGIN, WATERMARK_SIZE, watermarkAt } from "./watermark";

export const PADDING = 60; // px of breathing room around the model

// ── card chrome ──────────────────────────────────────────────────────────────
const CARD_RADIUS = 12;        // rounded-xl
const CARD_BORDER = "#d8dee8";
const CARD_BORDER_W = 1.5;
const PAD_X = 12;              // px-3

// ── header ───────────────────────────────────────────────────────────────────
const HEAD_TOP = 11;           // pt-[11px]
const HEAD_BOTTOM = 8;         // pb-2
const GAP = 8;                 // gap-2
const STRIPE_W = 4;            // w-1
const STRIPE_MIN_H = 18;       // min-h-[18px]
const ICON = 15;
const TITLE_SIZE = 13.5;
const TITLE_LINE = 17;         // leading-tight at 13.5px
const TITLE_LINES = 2;         // line-clamp-2
const TITLE_PAD_R = 12;        // pr-3

// ── meta row ─────────────────────────────────────────────────────────────────
const CHIP_SIZE = 10.5;
const CHIP_PAD_X = 7;
const CHIP_H = 17;
const META_BOTTOM = 10;        // pb-[10px]
const COUNT_SIZE = 11;

// ── ERD body ─────────────────────────────────────────────────────────────────
const ROW_H = 24;
const ROW_SIZE = 11.5;
const TYPE_SIZE = 10.5;
const KEY_ICON = 11;
const MORE_H = 26;
const MORE_SIZE = 11;

// ── status dot ───────────────────────────────────────────────────────────────
const DOT_R = 4.5;
const DOT_INSET = 10;          // top/right-[10px]

// ── colours ──────────────────────────────────────────────────────────────────
const TEXT_STRONG = "#0f172a"; // slate-900
const TEXT_BODY = "#1e293b";   // slate-800
const TEXT_MUTED = "#64748b";  // slate-500
const TEXT_FAINT = "#94a3b8";  // slate-400
const RULE_BODY = "#eef1f5";
const RULE_ROW = "#f3f5f8";
const ACCENT = "#1e88e5";
const KEY_COLOR = "#f59e0b";   // amber-500

// Lucide icon paths (24-unit box), drawn as strokes like the components do.
const BOX_ICON = [
  "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
  "m3.3 7 8.7 5 8.7-5",
  "M12 22V12",
];
const KEY_ICON_PATH =
  "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z";

const TITLE_FONT = { size: TITLE_SIZE, weight: 600 };
const CHIP_FONT = { size: CHIP_SIZE, weight: 650 };
const ROW_FONT = { size: ROW_SIZE };
const TYPE_FONT = { size: TYPE_SIZE, family: MONO_FONT };

export type VectorSvgOptions = {
  /** Paint a solid background behind the diagram (PNG defaults to white). */
  background?: string | null;
  padding?: number;
};

export type VectorSvg = { svg: string; width: number; height: number };

const round = (n: number) => Math.round(n * 100) / 100;

/** A <text> baseline that visually centres `size` inside a `height` box. */
function centredBaseline(top: number, height: number, size: number): number {
  return top + height / 2 + size * 0.35;
}

function text(
  content: string,
  x: number,
  y: number,
  opts: { size: number; weight?: number; family?: string; fill: string; anchor?: "start" | "middle" | "end"; spacing?: number },
): string {
  if (!content) return "";
  const attrs = [
    `x="${round(x)}"`,
    `y="${round(y)}"`,
    `font-family="${escapeXml(opts.family ?? UI_FONT)}"`,
    `font-size="${opts.size}"`,
    opts.weight && opts.weight !== 400 ? `font-weight="${opts.weight}"` : "",
    `fill="${opts.fill}"`,
    opts.anchor && opts.anchor !== "start" ? `text-anchor="${opts.anchor}"` : "",
    opts.spacing ? `letter-spacing="${opts.spacing}"` : "",
  ].filter(Boolean);
  return `<text ${attrs.join(" ")}>${escapeXml(content)}</text>`;
}

function icon(paths: string[], x: number, y: number, size: number, color: string): string {
  const scale = size / 24;
  const body = paths.map(d => `<path d="${d}"/>`).join("");
  return (
    `<g transform="translate(${round(x)},${round(y)}) scale(${round(scale)})" ` +
    `fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g>`
  );
}

function keyIcon(x: number, y: number, size: number): string {
  const scale = size / 24;
  return (
    `<g transform="translate(${round(x)},${round(y)}) scale(${round(scale)})" ` +
    `fill="none" stroke="${KEY_COLOR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="${KEY_ICON_PATH}"/><circle cx="16.5" cy="7.5" r="0.5" fill="${KEY_COLOR}"/></g>`
  );
}

function headerBlock(node: SceneNode): { markup: string; height: number } {
  const hasStripe = node.source !== null;
  const titleX = PAD_X + (hasStripe ? STRIPE_W + GAP : 0) + ICON + GAP;
  const titleWidth = node.width - PAD_X - titleX - TITLE_PAD_R;
  const lines = wrapToLines(node.title, titleWidth, TITLE_LINES, TITLE_FONT);
  const contentH = Math.max(STRIPE_MIN_H, Math.max(lines.length, 1) * TITLE_LINE);
  const top = HEAD_TOP;

  const stripe = hasStripe
    ? `<rect x="${PAD_X}" y="${round(top)}" width="${STRIPE_W}" height="${round(contentH)}" rx="2" fill="${node.color}"/>`
    : "";
  const iconY = top + (contentH - ICON) / 2;
  const glyph = icon(BOX_ICON, PAD_X + (hasStripe ? STRIPE_W + GAP : 0), iconY, ICON, TEXT_FAINT);
  const firstBaseline = top + (contentH - lines.length * TITLE_LINE) / 2 + TITLE_LINE / 2 + TITLE_SIZE * 0.35;
  const title = lines
    .map((line, i) => text(line, titleX, firstBaseline + i * TITLE_LINE, { ...TITLE_FONT, fill: TEXT_STRONG }))
    .join("");

  return { markup: stripe + glyph + title, height: top + contentH + HEAD_BOTTOM };
}

function metaBlock(node: SceneNode, top: number): { markup: string; height: number } {
  if (node.source === null && node.fieldCount === null) return { markup: "", height: 0 };
  let x = PAD_X;
  let markup = "";

  if (node.source !== null) {
    const label = node.source.toUpperCase();
    const w = measureText(label, CHIP_FONT) + label.length * 0.3 + CHIP_PAD_X * 2;
    markup +=
      `<rect x="${round(x)}" y="${round(top)}" width="${round(w)}" height="${CHIP_H}" ` +
      `rx="${CHIP_H / 2}" fill="${node.color}"/>` +
      text(label, x + CHIP_PAD_X, centredBaseline(top, CHIP_H, CHIP_SIZE), {
        ...CHIP_FONT, fill: "#ffffff", spacing: 0.3,
      });
    x += w + GAP;
  }

  if (node.fieldCount !== null) {
    markup += text(node.fieldCount, x, centredBaseline(top, CHIP_H, COUNT_SIZE), {
      size: COUNT_SIZE, fill: TEXT_MUTED,
    });
  }

  return { markup, height: CHIP_H + META_BOTTOM };
}

function erdBlock(node: SceneNode, top: number): string {
  if (node.empty) {
    return text("no fields", PAD_X, top + COUNT_SIZE, { size: COUNT_SIZE, fill: TEXT_FAINT });
  }
  if (node.fields.length === 0 && node.more === null) return "";

  const parts = [`<line x1="0" y1="${round(top)}" x2="${node.width}" y2="${round(top)}" stroke="${RULE_BODY}"/>`];
  let y = top;

  node.fields.forEach((field, i) => {
    const baseline = centredBaseline(y, ROW_H, ROW_SIZE);
    if (field.pk) parts.push(keyIcon(PAD_X, y + (ROW_H - KEY_ICON) / 2, KEY_ICON));
    const typeWidth = measureText(field.type, TYPE_FONT);
    parts.push(text(field.type, node.width - PAD_X, baseline, {
      ...TYPE_FONT, fill: TEXT_FAINT, anchor: "end",
    }));
    const nameX = PAD_X + KEY_ICON + GAP;
    const nameWidth = node.width - PAD_X - nameX - typeWidth - GAP;
    parts.push(text(truncateToWidth(field.label, nameWidth, ROW_FONT), nameX, baseline, {
      ...ROW_FONT, fill: TEXT_BODY,
    }));
    y += ROW_H;
    if (i < node.fields.length - 1 || node.more !== null) {
      parts.push(`<line x1="0" y1="${round(y)}" x2="${node.width}" y2="${round(y)}" stroke="${RULE_ROW}"/>`);
    }
  });

  if (node.more !== null) {
    parts.push(text(node.more, node.width / 2, centredBaseline(y, MORE_H, MORE_SIZE), {
      size: MORE_SIZE, weight: 500, fill: ACCENT, anchor: "middle",
    }));
  }

  return parts.join("");
}

function nodeGroup(node: SceneNode): string {
  const card =
    `<rect x="0" y="0" width="${round(node.width)}" height="${round(node.height)}" rx="${CARD_RADIUS}" ` +
    `fill="#ffffff" stroke="${CARD_BORDER}" stroke-width="${CARD_BORDER_W}" filter="url(#card-shadow)"/>`;

  const header = headerBlock(node);
  const meta = metaBlock(node, header.height);
  const body = erdBlock(node, header.height + meta.height);
  const dot = node.status
    ? `<circle cx="${round(node.width - DOT_INSET - DOT_R)}" cy="${DOT_INSET + DOT_R}" r="${DOT_R}" fill="${node.status}"/>`
    : "";

  return (
    `<g transform="translate(${round(node.x)},${round(node.y)})">` +
    card + header.markup + meta.markup + body + dot +
    `</g>`
  );
}

// ── edge labels ──────────────────────────────────────────────────────────────
const LABEL_H = 20;
const LABEL_PAD_X = 8;
const LABEL_SIZE = 11;
const LABEL_GAP = 6;
const PILL_SIZE = 10;
const PILL_PAD_X = 5;
const PILL_H = 13;

const LABEL_FONT = { size: LABEL_SIZE, weight: 550 };
const PILL_FONT = { size: PILL_SIZE, weight: 700 };

function labelGroup(label: SceneLabel): string {
  const textW = label.text ? measureText(label.text, LABEL_FONT) : 0;
  const pillW = label.cardinality ? measureText(label.cardinality, PILL_FONT) + PILL_PAD_X * 2 : 0;
  const inner = textW + (textW && pillW ? LABEL_GAP : 0) + pillW;
  const width = inner + LABEL_PAD_X * 2;
  const x = label.x - width / 2;
  const y = label.y - LABEL_H / 2;
  const border = label.selected ? ACCENT : CARD_BORDER;

  let cursor = x + LABEL_PAD_X;
  let markup =
    `<rect x="${round(x)}" y="${round(y)}" width="${round(width)}" height="${LABEL_H}" rx="6" ` +
    `fill="#ffffff" stroke="${border}" filter="url(#label-shadow)"/>`;

  if (label.text) {
    markup += text(label.text, cursor, centredBaseline(y, LABEL_H, LABEL_SIZE), {
      ...LABEL_FONT, fill: TEXT_STRONG,
    });
    cursor += textW + LABEL_GAP;
  }
  if (label.cardinality) {
    const pillY = y + (LABEL_H - PILL_H) / 2;
    markup +=
      `<rect x="${round(cursor)}" y="${round(pillY)}" width="${round(pillW)}" height="${PILL_H}" rx="4" fill="#e6f1fb"/>` +
      text(label.cardinality, cursor + PILL_PAD_X, centredBaseline(pillY, PILL_H, PILL_SIZE), {
        ...PILL_FONT, fill: ACCENT,
      });
  }
  return markup;
}

// ── edges ────────────────────────────────────────────────────────────────────
// One marker pair per distinct stroke colour; RelEdge's geometry, verbatim.
function markerDefs(colors: string[]): string {
  return colors
    .map((color, i) =>
      `<marker id="arr-end-${i}" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">` +
      `<path d="M0,0 L7,3 L0,6 z" fill="${color}"/></marker>` +
      `<marker id="arr-start-${i}" markerWidth="9" markerHeight="9" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">` +
      `<path d="M7,0 L0,3 L7,6 z" fill="${color}"/></marker>`,
    )
    .join("");
}

function sceneBounds(scene: CanvasScene) {
  const xs = scene.nodes.map(n => n.x);
  const ys = scene.nodes.map(n => n.y);
  const rights = scene.nodes.map(n => n.x + n.width);
  const bottoms = scene.nodes.map(n => n.y + n.height);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...rights) - Math.min(...xs),
    height: Math.max(...bottoms) - Math.min(...ys),
  };
}

/** Render the scene as a standalone, foreignObject-free SVG document. */
export function buildVectorSvg(scene: CanvasScene, opts: VectorSvgOptions = {}): VectorSvg {
  const pad = opts.padding ?? PADDING;
  const bounds = sceneBounds(scene);
  const width = Math.ceil(bounds.width) + pad * 2;
  // Keep room for the watermark even when the model itself is tiny.
  const height = Math.max(
    Math.ceil(bounds.height) + pad * 2,
    WATERMARK_SIZE + WATERMARK_MARGIN * 2,
  );

  const colors = [...new Set(scene.edges.map(e => e.stroke))];
  const edges = scene.edges
    .map(e => {
      const i = colors.indexOf(e.stroke);
      const start = e.bidirectional ? ` marker-start="url(#arr-start-${i})"` : "";
      return (
        `<path d="${escapeXml(e.d)}" fill="none" stroke="${e.stroke}" stroke-width="${e.strokeWidth}" ` +
        `marker-end="url(#arr-end-${i})"${start}/>`
      );
    })
    .join("");

  const defs =
    `<defs>` +
    `<filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.05"/></filter>` +
    `<filter id="label-shadow" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.06"/></filter>` +
    markerDefs(colors) +
    `</defs>`;

  const background = opts.background
    ? `<rect width="${width}" height="${height}" fill="${opts.background}"/>`
    : "";

  // Edges sit under the cards, labels over them — the canvas' own stacking.
  const content =
    `<g transform="translate(${round(pad - bounds.x)},${round(pad - bounds.y)})">` +
    edges +
    scene.nodes.map(nodeGroup).join("") +
    scene.labels.map(labelGroup).join("") +
    `</g>`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">` +
    defs + background + content + watermarkAt(width, height) +
    `</svg>`;

  return { svg, width, height };
}
