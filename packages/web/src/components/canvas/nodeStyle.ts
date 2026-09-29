// Colours and copy a mart card is painted with. Shared so the canvas component
// and the vector SVG export can't drift apart: the exported diagram has to match
// what the user is looking at.
//
// Values are the OWOX Data Marts product tokens (packages/ui globals.css and the
// canvas constants of the Models canvas), resolved to sRGB for SVG.

import type { InputSource, NodeStatus } from "@mc/okf";

export const CARD_COLORS = {
  background: "#ffffff",
  /** --foreground */
  foreground: "#35363d",
  /** --muted */
  muted: "#f5f5f5",
  /** --muted-foreground */
  mutedForeground: "#65676f",
  /** --border */
  border: "#e5e5e5",
  /** An open badge: `bg-foreground/10` over the white card. */
  pillActive: "#ebebec",
} as const;

/** OWOX brand blue (--primary), for selection and highlighted edges. */
export const OWOX_BLUE = "#0084ff";
/** Resting edge and socket colour — the corporate dark gray (≥3:1 on white). */
export const EDGE_NEUTRAL = "#606060";
export const EDGE_STROKE_WIDTH = 1.5;
export const EDGE_SELECTED_STROKE_WIDTH = 2.5;
/** Primary-key glyph (OWOX yellow). */
export const KEY_COLOR = "#F5C344";
/** Cardinality pill on an edge label. */
export const CARDINALITY_BG = "#E6F0FA";

export const SOURCE_LABEL: Record<InputSource, string> = {
  SQL: "SQL",
  TABLE: "Table",
  VIEW: "View",
  CONNECTOR: "Connector",
};

export function sourceLabel(inputSource: string): string {
  return SOURCE_LABEL[inputSource as InputSource] ?? inputSource;
}

export type StatusBadge = {
  label: string;
  tip: string;
  /** Pill fill and text colour. */
  bg: string;
  fg: string;
};

// Pushed is the norm, so only the states before it (or a failed push) earn a
// pill next to the title — the way the product only marks a draft Data Mart.
const STATUS_BADGE: Partial<Record<NodeStatus, StatusBadge>> = {
  pending: { label: "Draft", tip: "Draft — not pushed to OWOX yet", bg: CARD_COLORS.muted, fg: CARD_COLORS.mutedForeground },
  creating: { label: "Creating…", tip: "Creating in OWOX…", bg: "#F2F7FC", fg: "#4286DE" },
  error: { label: "Error", tip: "Push failed — check details", bg: "#FAE8E6", fg: "#E15241" },
};

export function statusBadge(status: string): StatusBadge | null {
  return STATUS_BADGE[status as NodeStatus] ?? null;
}
