import type { ModelNode, SchemaField } from "@mc/okf";
import type { ViewMode } from "../../state/viewMode";
import { NOTHING_HIDDEN, type ObjHidden } from "../../state/objLabels";
import { measureText } from "../../share/svgText";
import { sourceLabel } from "./nodeStyle";

// ---- Card geometry ------------------------------------------------------------
// The card follows the OWOX Data Marts Models canvas card: title row (icon tile
// + name), soft badges packed onto as few lines as their measured widths allow,
// then the bottom padding. Dagre lays the canvas out before render, so it sizes
// every card from these numbers; MartNode's classes and the vector SVG export
// use the same ones, so the estimate stays exact. A count of zero shows no
// badge, and a line left without badges is dropped.

export const COMPACT_NODE_WIDTH = 240;
export const ERD_NODE_WIDTH = 256;

/** Title row: `pt-3` + the 28px icon tile. */
export const CARD_TITLE_ROW_HEIGHT = 40;
/** The first badge line (`pt-2` + the 20px pill). */
export const CARD_FIRST_BADGE_ROW_HEIGHT = 28;
/** Every further badge line (`pt-1` + the 20px pill). */
export const CARD_BADGE_ROW_HEIGHT = 24;
/** Bottom padding under the last card row. */
export const CARD_BOTTOM_PADDING = 12;
/** Card row inset: `px-3` plus the card's 1px border on each side. */
export const CARD_ROW_INSET = 26;
/** A badge's width besides its text: `px-1.5` + the 12px icon + `gap-1`. */
export const CARD_BADGE_CHROME = 28;
/** Space between two badges on a line (`gap-1`). */
export const CARD_BADGE_GAP = 4;
/** Slack per badge so sub-pixel text rounding never wraps a line the estimate kept whole. */
const CARD_BADGE_SLACK = 2;
export const CARD_BADGE_FONT = { size: 11 };

/** One field row: `py-1.5` + a 14px line. */
export const ERD_ROW_HEIGHT = 26;
/** The optional description line under a field name. */
export const ERD_ROW_EXTRA_LINE_HEIGHT = 14;
/** The "+N more fields / Show less" toggle row. */
export const ERD_EXPAND_ROW_HEIGHT = 26;

// Cards show at most this many field rows by default; the rest collapse behind
// an expand toggle. Keeps dense marts from turning the canvas into a wall of
// fields. Layout always sizes to the COLLAPSED height so the default picture is
// tidy (an expanded card may overlap below until the user re-runs layout).
export const ERD_COLLAPSED_ROWS = 4;

export function nodeWidth(viewMode: ViewMode): number {
  return viewMode === "erd" ? ERD_NODE_WIDTH : COMPACT_NODE_WIDTH;
}

// ---- Badges -----------------------------------------------------------------------

export type CardBadgeKind = "source" | "fields" | "relationships";
export type CardBadge = { kind: CardBadgeKind; label: string };

/** What a card needs to know about itself besides the model node. */
export type CardContext = {
  hidden?: ObjHidden;
  /** Relationships this object takes part in, on either side. */
  relationshipCount?: number;
  /** Field names that anchor a relationship — kept visible while collapsed. */
  keyFields?: readonly string[];
};

export function pluralizeCount(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? "" : "s"}`;
}

/** The badges a card shows, in display order: source, fields, relationships. */
export function cardBadges(node: Pick<ModelNode, "inputSource" | "schema">, ctx: CardContext = {}): CardBadge[] {
  const hidden = ctx.hidden ?? NOTHING_HIDDEN;
  const fieldCount = node.schema?.length ?? 0;
  const relationshipCount = ctx.relationshipCount ?? 0;
  const list: CardBadge[] = [];
  if (!hidden.source && node.inputSource) list.push({ kind: "source", label: sourceLabel(node.inputSource) });
  if (!hidden.fields && fieldCount > 0) list.push({ kind: "fields", label: pluralizeCount(fieldCount, "field") });
  if (!hidden.relationships && relationshipCount > 0) {
    list.push({ kind: "relationships", label: pluralizeCount(relationshipCount, "relationship") });
  }
  return list;
}

export type TextMeasure = (text: string) => number;
const measureBadgeText: TextMeasure = text => measureText(text, CARD_BADGE_FONT);

/**
 * Packs the badges onto lines, in order, starting a new line only when the next
 * badge would not fit the card's width — fewer lines keep the card short. The
 * card renders these lines and the layout estimate counts them, so both agree.
 */
export function packBadges(
  badges: readonly CardBadge[],
  viewMode: ViewMode,
  measure: TextMeasure = measureBadgeText,
): CardBadge[][] {
  const available = nodeWidth(viewMode) - CARD_ROW_INSET;
  const lines: CardBadge[][] = [];
  let lineWidth = 0;
  for (const badge of badges) {
    const width = Math.ceil(measure(badge.label)) + CARD_BADGE_CHROME + CARD_BADGE_SLACK;
    const current = lines.at(-1);
    if (current && lineWidth + CARD_BADGE_GAP + width <= available) {
      current.push(badge);
      lineWidth += CARD_BADGE_GAP + width;
    } else {
      lines.push([badge]);
      lineWidth = width;
    }
  }
  return lines;
}

// ---- Field rows -------------------------------------------------------------------

/** True when the alias carries information beyond the technical name. */
export function hasDistinctAlias(field: SchemaField): boolean {
  return Boolean(field.alias?.trim()) && field.alias!.trim() !== field.name.trim();
}

/** The row's leading text: the alias when that label is on, else the technical name. */
export function fieldRowLabel(field: SchemaField, hidden: ObjHidden = NOTHING_HIDDEN): string {
  return !hidden.fieldAlias && hasDistinctAlias(field) ? field.alias! : field.name;
}

export function fieldDescriptionLine(field: SchemaField, hidden: ObjHidden = NOTHING_HIDDEN): string | null {
  return !hidden.fieldDescription && field.description?.trim() ? field.description : null;
}

export function fieldRowHeight(field: SchemaField, hidden: ObjHidden = NOTHING_HIDDEN): number {
  return ERD_ROW_HEIGHT + (fieldDescriptionLine(field, hidden) ? ERD_ROW_EXTRA_LINE_HEIGHT : 0);
}

/** Keys first (primary keys and relationship keys), then the rest — stable order. */
export function orderFields(schema: readonly SchemaField[], keyFields: readonly string[] = []): SchemaField[] {
  const keys = new Set(keyFields);
  const isKey = (f: SchemaField) => f.pk || keys.has(f.name);
  return [...schema.filter(isKey), ...schema.filter(f => !isKey(f))];
}

/**
 * How many rows a collapsed field list shows. Key fields always stay visible —
 * in the ERD view edges anchor to them — so a key-heavy mart can exceed the cap.
 */
export function collapsedRowCount(schema: readonly SchemaField[], keyFields: readonly string[] = []): number {
  const keys = new Set(keyFields);
  const keyCount = schema.filter(f => f.pk || keys.has(f.name)).length;
  return Math.min(schema.length, Math.max(ERD_COLLAPSED_ROWS, keyCount));
}

/** Collapsed height of a field list: its visible rows plus the "+N more" toggle. */
export function fieldsBodyHeight(
  schema: readonly SchemaField[],
  hidden: ObjHidden = NOTHING_HIDDEN,
  keyFields: readonly string[] = [],
): number {
  if (schema.length === 0) return 0;
  const rows = collapsedRowCount(schema, keyFields);
  const visible = orderFields(schema, keyFields).slice(0, rows);
  const rowsHeight = visible.reduce((sum, f) => sum + fieldRowHeight(f, hidden), 0);
  return rowsHeight + (schema.length > rows ? ERD_EXPAND_ROW_HEIGHT : 0);
}

// ---- Card size -----------------------------------------------------------------------

/** Height of the card header: title row, badge lines, bottom padding. */
export function cardHeaderHeight(
  node: Pick<ModelNode, "inputSource" | "schema">,
  viewMode: ViewMode,
  ctx: CardContext = {},
  measure: TextMeasure = measureBadgeText,
): number {
  const lines = packBadges(cardBadges(node, ctx), viewMode, measure).length;
  const badgesHeight = lines === 0 ? 0 : CARD_FIRST_BADGE_ROW_HEIGHT + (lines - 1) * CARD_BADGE_ROW_HEIGHT;
  return CARD_TITLE_ROW_HEIGHT + badgesHeight + CARD_BOTTOM_PADDING;
}

/**
 * Collapsed layout size of a card, used by dagre and for side picking: the
 * header rows the node's content and the preference leave, plus the field rows
 * in the ERD view. Lists opened from a badge are not counted — like an expanded
 * field list, they grow the card over its neighbours.
 */
export function erdAwareNodeSize(
  node: ModelNode,
  viewMode: ViewMode,
  ctx: CardContext = {},
  measure: TextMeasure = measureBadgeText,
): { width: number; height: number } {
  const header = cardHeaderHeight(node, viewMode, ctx, measure);
  const body = viewMode === "erd" ? fieldsBodyHeight(node.schema ?? [], ctx.hidden, ctx.keyFields) : 0;
  return { width: nodeWidth(viewMode), height: header + body };
}
