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

import type { CanvasScene, SceneBadge, SceneLabel, SceneNode, SceneSection } from "./canvasScene";
import { escapeXml, measureText, truncateToWidth, MONO_FONT, UI_FONT } from "./svgText";
import { WATERMARK_MARGIN, WATERMARK_SIZE, watermarkAt } from "./watermark";
import { SVG_ICONS, type SvgIconName } from "./svgIcons";
import {
  CARD_BADGE_CHROME,
  CARD_BADGE_GAP,
  CARD_BADGE_ROW_HEIGHT,
  CARD_BOTTOM_PADDING,
  CARD_FIRST_BADGE_ROW_HEIGHT,
  CARD_TITLE_ROW_HEIGHT,
  ERD_EXPAND_ROW_HEIGHT,
  ERD_ROW_EXTRA_LINE_HEIGHT,
  ERD_ROW_HEIGHT,
} from "../components/canvas/layoutSize";
import { CALC_COLOR, CARD_COLORS, CARDINALITY_BG, EDGE_NEUTRAL, KEY_COLOR, OWOX_BLUE } from "../components/canvas/nodeStyle";

export const PADDING = 60; // px of breathing room around the model

// ── card chrome ──────────────────────────────────────────────────────────────
const CARD_RADIUS = 14;        // rounded-[14px]
const PAD_X = 12;              // px-3

// ── title row ──────────────────────────────────────────────────────────────────
const TITLE_TOP = 12;          // pt-3
const TILE = 28;               // h-7 w-7
const TILE_RADIUS = 8;         // rounded-lg
const TILE_ICON = 16;
const GAP = 8;                 // gap-2
const TITLE_SIZE = 14;         // text-sm
const INFO_BOX = 18;           // 14px glyph + p-0.5

// ── badges ───────────────────────────────────────────────────────────────────
const PILL_H = 20;             // h-5
const PILL_RADIUS = 8;         // rounded-lg
const PILL_PAD_X = 6;          // px-1.5
const PILL_ICON = 12;
const PILL_ICON_GAP = 4;       // gap-1
const PILL_SIZE = 11;

// ── lists ────────────────────────────────────────────────────────────────────
const ROW_PAD_X = 14;          // px-3.5
const ROW_PAD_Y = 6;           // py-1.5
const ROW_LINE = 14;           // leading-[14px]
const ROW_SIZE = 11.5;
const TYPE_SIZE = 10;
const DESC_SIZE = 10.5;
const ROW_ICON = 12;
const ROW_TEXT_X = ROW_PAD_X + ROW_ICON + GAP; // the text column after the glyph
const MORE_SIZE = 11;

// ── sockets ──────────────────────────────────────────────────────────────────
const SOCKET_R = 5;

const TITLE_FONT = { size: TITLE_SIZE, weight: 600 };
const PILL_FONT = { size: PILL_SIZE };
const ROW_FONT = { size: ROW_SIZE };
const TYPE_FONT = { size: TYPE_SIZE, family: MONO_FONT };
const DESC_FONT = { size: DESC_SIZE };
const JOIN_FONT = { size: TYPE_SIZE, family: MONO_FONT };

const SOURCE_ICON: Record<string, SvgIconName> = {
  SQL: "code",
  TABLE: "table",
  VIEW: "grip",
  CONNECTOR: "plug",
};
const STATUS_ICON: Record<string, SvgIconName> = {
  pending: "pencilLine",
  creating: "loaderCircle",
  error: "circleAlert",
};
const DIRECTION_ICON: Record<string, SvgIconName> = {
  outgoing: "arrowRight",
  incoming: "arrowLeft",
  both: "arrowLeftRight",
};

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
  opts: {
    size: number; weight?: number; family?: string; fill: string;
    anchor?: "start" | "middle" | "end"; spacing?: number; italic?: boolean; opacity?: number;
  },
): string {
  if (!content) return "";
  const attrs = [
    `x="${round(x)}"`,
    `y="${round(y)}"`,
    `font-family="${escapeXml(opts.family ?? UI_FONT)}"`,
    `font-size="${opts.size}"`,
    opts.weight && opts.weight !== 400 ? `font-weight="${opts.weight}"` : "",
    opts.italic ? `font-style="italic"` : "",
    `fill="${opts.fill}"`,
    opts.opacity !== undefined ? `fill-opacity="${opts.opacity}"` : "",
    opts.anchor && opts.anchor !== "start" ? `text-anchor="${opts.anchor}"` : "",
    opts.spacing ? `letter-spacing="${opts.spacing}"` : "",
  ].filter(Boolean);
  return `<text ${attrs.join(" ")}>${escapeXml(content)}</text>`;
}

/** A Lucide glyph, stroked like lucide-react draws it (`currentColor` → `color`). */
function icon(name: SvgIconName, x: number, y: number, size: number, color: string): string {
  const scale = size / 24;
  return (
    `<g transform="translate(${round(x)},${round(y)}) scale(${round(scale * 1000) / 1000})" color="${color}" ` +
    `fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SVG_ICONS[name]}</g>`
  );
}

function pillWidth(label: string): number {
  return measureText(label, PILL_FONT) + CARD_BADGE_CHROME;
}

/** A soft pill with a leading glyph — the card's badges and its status pill. */
function pill(
  label: string, glyph: SvgIconName, x: number, top: number,
  colors: { bg: string; fg: string },
): { markup: string; width: number } {
  const width = pillWidth(label);
  const markup =
    `<rect x="${round(x)}" y="${round(top)}" width="${round(width)}" height="${PILL_H}" rx="${PILL_RADIUS}" fill="${colors.bg}"/>` +
    icon(glyph, x + PILL_PAD_X, top + (PILL_H - PILL_ICON) / 2, PILL_ICON, colors.fg) +
    text(label, x + PILL_PAD_X + PILL_ICON + PILL_ICON_GAP, centredBaseline(top, PILL_H, PILL_SIZE), {
      ...PILL_FONT, fill: colors.fg,
    });
  return { markup, width };
}

function titleRow(node: SceneNode): string {
  const rowMid = TITLE_TOP + TILE / 2;
  let right = node.width - PAD_X;
  let markup = "";

  // The info glyph shows on hover only, so the resting card the export draws
  // keeps its space (the title truncates the same) but not the glyph.
  if (node.description) right -= INFO_BOX + GAP;
  if (node.status) {
    const w = pillWidth(node.status.label);
    right -= w;
    markup += pill(node.status.label, STATUS_ICON[node.status.status] ?? "pencilLine", right, rowMid - PILL_H / 2, node.status).markup;
    right -= GAP;
  }

  const tile =
    `<rect x="${PAD_X}" y="${TITLE_TOP}" width="${TILE}" height="${TILE}" rx="${TILE_RADIUS}" fill="${CARD_COLORS.muted}"/>` +
    icon("box", PAD_X + (TILE - TILE_ICON) / 2, TITLE_TOP + (TILE - TILE_ICON) / 2, TILE_ICON, CARD_COLORS.foreground);
  const titleX = PAD_X + TILE + GAP;
  const title = text(truncateToWidth(node.title, right - titleX, TITLE_FONT), titleX, centredBaseline(TITLE_TOP, TILE, TITLE_SIZE), {
    ...TITLE_FONT, fill: CARD_COLORS.foreground,
  });
  return tile + title + markup;
}

function badgeGlyph(node: SceneNode, badge: SceneBadge): SvgIconName {
  if (badge.kind === "source") return SOURCE_ICON[node.inputSource] ?? "code";
  return badge.kind === "fields" ? "columns3" : "link2";
}

function badgeLines(node: SceneNode): { markup: string; height: number } {
  let markup = "";
  node.badgeLines.forEach((line, i) => {
    const top = CARD_TITLE_ROW_HEIGHT + (CARD_FIRST_BADGE_ROW_HEIGHT - PILL_H) + i * CARD_BADGE_ROW_HEIGHT;
    let x = PAD_X;
    for (const badge of line) {
      const colors = badge.expanded
        ? { bg: CARD_COLORS.pillActive, fg: CARD_COLORS.foreground }
        : { bg: CARD_COLORS.muted, fg: CARD_COLORS.mutedForeground };
      const p = pill(badge.label, badgeGlyph(node, badge), x, top, colors);
      markup += p.markup;
      x += p.width + CARD_BADGE_GAP;
    }
  });
  const n = node.badgeLines.length;
  const height = CARD_TITLE_ROW_HEIGHT + (n === 0 ? 0 : CARD_FIRST_BADGE_ROW_HEIGHT + (n - 1) * CARD_BADGE_ROW_HEIGHT) + CARD_BOTTOM_PADDING;
  return { markup, height };
}

const rule = (width: number, y: number, faint = false) =>
  `<line x1="0" y1="${round(y)}" x2="${round(width)}" y2="${round(y)}" stroke="${CARD_COLORS.border}"${faint ? ` stroke-opacity="0.5"` : ""}/>`;

function fieldsSection(node: SceneNode, section: Extract<SceneSection, { kind: "fields" }>, top: number): { markup: string; height: number } {
  const parts = [rule(node.width, top)];
  let y = top;
  section.rows.forEach((field, i) => {
    const lineTop = y + ROW_PAD_Y;
    const baseline = centredBaseline(lineTop, ROW_LINE, ROW_SIZE);
    if (field.calc) {
      parts.push(text(field.calc === "metric" ? "Σ" : "fx", ROW_PAD_X + ROW_ICON / 2, baseline, {
        size: TYPE_SIZE, fill: CALC_COLOR, anchor: "middle", weight: 700,
      }));
    } else if (field.pk) parts.push(icon("keyRound", ROW_PAD_X, lineTop + (ROW_LINE - ROW_ICON) / 2, ROW_ICON, KEY_COLOR));
    const typeWidth = measureText(field.type, TYPE_FONT);
    parts.push(text(field.type, node.width - ROW_PAD_X, baseline, {
      ...TYPE_FONT, fill: CARD_COLORS.mutedForeground, anchor: "end",
    }));
    const nameWidth = node.width - ROW_PAD_X - ROW_TEXT_X - typeWidth - GAP;
    parts.push(text(truncateToWidth(field.label, nameWidth, ROW_FONT), ROW_TEXT_X, baseline, {
      ...ROW_FONT, fill: CARD_COLORS.foreground,
    }));
    let h = ERD_ROW_HEIGHT;
    if (field.description) {
      const descTop = lineTop + ROW_LINE;
      parts.push(text(truncateToWidth(field.description, node.width - ROW_PAD_X - ROW_TEXT_X, DESC_FONT), ROW_TEXT_X,
        centredBaseline(descTop, ROW_LINE, DESC_SIZE), { ...DESC_FONT, fill: CARD_COLORS.mutedForeground, italic: true, opacity: 0.8 }));
      h += ERD_ROW_EXTRA_LINE_HEIGHT;
    }
    y += h;
    if (i < section.rows.length - 1) parts.push(rule(node.width, y, true));
  });

  if (section.more !== null) {
    parts.push(rule(node.width, y));
    const expanded = /less/i.test(section.more);
    const label = section.more.replace(/^[^+\w]+/, "");
    const w = PILL_ICON + PILL_ICON_GAP + measureText(label, { size: MORE_SIZE, weight: 500 });
    const x = (node.width - w) / 2;
    parts.push(icon(expanded ? "chevronDown" : "chevronRight", x, y + (ERD_EXPAND_ROW_HEIGHT - PILL_ICON) / 2, PILL_ICON, CARD_COLORS.mutedForeground));
    parts.push(text(label, x + PILL_ICON + PILL_ICON_GAP, centredBaseline(y, ERD_EXPAND_ROW_HEIGHT, MORE_SIZE), {
      size: MORE_SIZE, weight: 500, fill: CARD_COLORS.mutedForeground,
    }));
    y += ERD_EXPAND_ROW_HEIGHT;
  }
  return { markup: parts.join(""), height: y - top };
}

function relationshipsSection(node: SceneNode, section: Extract<SceneSection, { kind: "relationships" }>, top: number): { markup: string; height: number } {
  const parts = [rule(node.width, top)];
  let y = top;
  const textWidth = node.width - ROW_PAD_X - ROW_TEXT_X;
  section.rows.forEach((rel, i) => {
    const lineTop = y + ROW_PAD_Y;
    parts.push(icon(DIRECTION_ICON[rel.direction] ?? "arrowRight", ROW_PAD_X, lineTop + (ROW_LINE - ROW_ICON) / 2, ROW_ICON, CARD_COLORS.mutedForeground));
    parts.push(text(truncateToWidth(rel.title, textWidth, ROW_FONT), ROW_TEXT_X, centredBaseline(lineTop, ROW_LINE, ROW_SIZE), {
      ...ROW_FONT, fill: CARD_COLORS.foreground,
    }));
    const joins = rel.joins.length > 0 ? rel.joins : [null];
    joins.forEach((join, j) => {
      const joinTop = lineTop + ROW_LINE * (j + 1);
      parts.push(join === null
        ? text("Join fields not set", ROW_TEXT_X, centredBaseline(joinTop, ROW_LINE, DESC_SIZE), {
          ...DESC_FONT, fill: CARD_COLORS.mutedForeground, italic: true, opacity: 0.8,
        })
        : text(truncateToWidth(join, textWidth, JOIN_FONT), ROW_TEXT_X, centredBaseline(joinTop, ROW_LINE, TYPE_SIZE), {
          ...JOIN_FONT, fill: CARD_COLORS.mutedForeground,
        }));
    });
    y += ROW_PAD_Y * 2 + ROW_LINE * (1 + joins.length);
    if (i < section.rows.length - 1) parts.push(rule(node.width, y, true));
  });
  return { markup: parts.join(""), height: y - top };
}

function sockets(node: SceneNode): string {
  const dot = (cx: number) =>
    `<circle cx="${round(cx)}" cy="${round(node.sockets.y)}" r="${SOCKET_R - 1}" fill="${EDGE_NEUTRAL}" stroke="#ffffff" stroke-width="2"/>`;
  return (node.sockets.left ? dot(0) : "") + (node.sockets.right ? dot(node.width) : "");
}

function nodeGroup(node: SceneNode): string {
  const card =
    `<rect x="0.5" y="0.5" width="${round(node.width - 1)}" height="${round(node.height - 1)}" rx="${CARD_RADIUS}" ` +
    `fill="${CARD_COLORS.background}" stroke="${CARD_COLORS.border}" stroke-width="1" filter="url(#card-shadow)"/>`;

  const badges = badgeLines(node);
  let top = badges.height;
  let body = "";
  for (const section of node.sections) {
    const s = section.kind === "fields" ? fieldsSection(node, section, top) : relationshipsSection(node, section, top);
    body += s.markup;
    top += s.height;
  }

  return (
    `<g transform="translate(${round(node.x)},${round(node.y)})">` +
    card + titleRow(node) + badges.markup + body + sockets(node) +
    `</g>`
  );
}

// ── edge labels ──────────────────────────────────────────────────────────────
const LABEL_PAD_X = 8;         // padding: 3px 8px
const LABEL_PAD_Y = 3;
const LABEL_SIZE = 11;
const LABEL_LINE = 16.5;       // line-height 1.5
const LABEL_GAP = 6;
const CARD_PILL_SIZE = 10;
const CARD_PILL_PAD_X = 5;
const CARD_PILL_H = 13;

const LABEL_FONT = { size: LABEL_SIZE, weight: 600 };
const CARD_PILL_FONT = { size: CARD_PILL_SIZE, weight: 700 };

function labelGroup(label: SceneLabel): string {
  const textW = label.lines.reduce((max, line) => Math.max(max, measureText(line, LABEL_FONT)), 0);
  const pillW = label.cardinality ? measureText(label.cardinality, CARD_PILL_FONT) + CARD_PILL_PAD_X * 2 : 0;
  const inner = textW + (textW && pillW ? LABEL_GAP : 0) + pillW;
  // Content box + padding + the 1px border on each side.
  const width = inner + LABEL_PAD_X * 2 + 2;
  const contentH = Math.max(label.lines.length * LABEL_LINE, label.cardinality ? CARD_PILL_H : 0);
  const height = contentH + LABEL_PAD_Y * 2 + 2;
  const x = label.x - width / 2;
  const y = label.y - height / 2;
  const border = label.selected ? OWOX_BLUE : CARD_COLORS.border;

  let cursor = x + 1 + LABEL_PAD_X;
  const contentTop = y + 1 + LABEL_PAD_Y;
  let markup =
    `<rect x="${round(x + 0.5)}" y="${round(y + 0.5)}" width="${round(width - 1)}" height="${round(height - 1)}" rx="8" ` +
    `fill="${CARD_COLORS.background}" stroke="${border}" filter="url(#label-shadow)"/>`;

  const linesTop = contentTop + (contentH - label.lines.length * LABEL_LINE) / 2;
  label.lines.forEach((line, i) => {
    markup += text(line, cursor, centredBaseline(linesTop + i * LABEL_LINE, LABEL_LINE, LABEL_SIZE), {
      ...LABEL_FONT, fill: CARD_COLORS.foreground,
    });
  });
  if (textW) cursor += textW + LABEL_GAP;
  if (label.cardinality) {
    const pillY = contentTop + (contentH - CARD_PILL_H) / 2;
    markup +=
      `<rect x="${round(cursor)}" y="${round(pillY)}" width="${round(pillW)}" height="${CARD_PILL_H}" rx="4" fill="${CARDINALITY_BG}"/>` +
      text(label.cardinality, cursor + CARD_PILL_PAD_X, centredBaseline(pillY, CARD_PILL_H, CARD_PILL_SIZE), {
        ...CARD_PILL_FONT, fill: OWOX_BLUE,
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
    `<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.1"/></filter>` +
    `<filter id="label-shadow" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.08"/></filter>` +
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
