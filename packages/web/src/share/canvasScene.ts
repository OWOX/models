// Reads the live canvas into a plain, serialisable description of what is on
// screen — the input the vector SVG renderer draws from.
//
// Why read the DOM at all: things the model alone can't tell us. Which badge a
// card has opened, which field rows are visible (the "+N more" toggle) and how
// the badges wrapped are component-local state inside MartNode, and the edge
// curves are geometry React Flow computes from mounted handle positions. All of
// it is published as stable `data-` attributes by MartNode/RelEdge; everything
// else (titles, types, colours) comes from the model, so the two renderers
// can't disagree about content.
//
// Coordinates are React Flow's flow space: node positions, edge paths and edge
// label positions all share it, independent of the user's current pan/zoom.

import type { Node } from "@xyflow/react";
import type { ModelNode, SchemaField } from "@mc/okf";
import { NOTHING_HIDDEN, type ObjHidden } from "../state/objLabels";
import type { ViewMode } from "../state/viewMode";
import { statusBadge, type StatusBadge } from "../components/canvas/nodeStyle";
import {
  cardBadges,
  fieldDescriptionLine,
  fieldRowLabel,
  packBadges,
  type CardBadgeKind,
} from "../components/canvas/layoutSize";
import type { CardRelationship } from "../components/canvas/relationships";

export type SceneField = { label: string; type: string; pk: boolean; description?: string | null };

export type SceneBadge = { kind: CardBadgeKind; label: string; expanded: boolean };

export type SceneRelationship = {
  direction: CardRelationship["direction"];
  title: string;
  /** "field = field" lines; empty when the join fields are not set. */
  joins: string[];
};

export type SceneSection =
  | { kind: "fields"; rows: SceneField[]; more: string | null }
  | { kind: "relationships"; rows: SceneRelationship[] };

export type SceneNode = {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  /** The input source — picks the source badge's glyph. */
  inputSource: string;
  /** Status pill next to the title, or null when there is none or it is hidden. */
  status: (StatusBadge & { status: string }) | null;
  /** The card has a description, so its title row keeps room for the hover-only info glyph. */
  description: boolean;
  /** Badge lines as rendered, top to bottom. */
  badgeLines: SceneBadge[][];
  /** Lists under the header, in render order: an opened list and/or the ERD rows. */
  sections: SceneSection[];
  /** Sides whose socket dot is on screen, and the dot's y inside the card. */
  sockets: { left: boolean; right: boolean; y: number };
};

export type SceneEdge = {
  d: string;
  stroke: string;
  strokeWidth: number;
  bidirectional: boolean;
};

export type SceneLabel = {
  x: number;
  y: number;
  /** One line per join key. */
  lines: string[];
  cardinality: string | null;
  selected: boolean;
};

export type CanvasScene = {
  nodes: SceneNode[];
  edges: SceneEdge[];
  labels: SceneLabel[];
};

type MartData = ModelNode & {
  _viewMode?: ViewMode;
  _objHidden?: ObjHidden;
  _relationships?: CardRelationship[];
  _sides?: { left: boolean; right: boolean };
};

const DEFAULT_STROKE = "#606060";
const DEFAULT_STROKE_WIDTH = 1.5;
/** Socket y on an ERD card: the middle of its title row. */
const ERD_SOCKET_Y = 26;

/** The rendered field rows under `el`, resolved against the mart's schema. */
export function readVisibleFields(el: Element | null, schema: SchemaField[], hidden: ObjHidden = NOTHING_HIDDEN): SceneField[] {
  if (!el) return [];
  const byName = new Map(schema.map(f => [f.name, f]));
  return Array.from(el.querySelectorAll("[data-field]")).flatMap(row => {
    const f = byName.get(row.getAttribute("data-field") ?? "");
    return f
      ? [{ label: fieldRowLabel(f, hidden), type: f.type, pk: Boolean(f.pk), description: fieldDescriptionLine(f, hidden) }]
      : [];
  });
}

function readBadgeLines(el: Element | null, data: MartData, hidden: ObjHidden, viewMode: ViewMode): SceneBadge[][] {
  const lines = el ? Array.from(el.querySelectorAll("[data-badge-line]")) : [];
  if (lines.length > 0) {
    return lines.map(line =>
      Array.from(line.querySelectorAll("[data-badge]")).map(b => ({
        kind: b.getAttribute("data-badge") as CardBadgeKind,
        label: b.textContent?.trim() ?? "",
        expanded: b.getAttribute("data-expanded") === "1",
      })),
    );
  }
  // Not mounted (or not yet rendered): pack the badges the way the card does.
  const badges = cardBadges(data, { hidden, relationshipCount: data._relationships?.length ?? 0 });
  return packBadges(badges, viewMode).map(line => line.map(b => ({ ...b, expanded: false })));
}

function readSections(el: Element | null, data: MartData, hidden: ObjHidden): SceneSection[] {
  if (!el) return [];
  return Array.from(el.querySelectorAll("[data-section]")).map((section): SceneSection => {
    if (section.getAttribute("data-section") === "relationships") {
      const rows = Array.from(section.querySelectorAll("[data-rel-row]")).map(row => ({
        direction: (row.getAttribute("data-rel-row") ?? "outgoing") as CardRelationship["direction"],
        title: row.querySelector("[data-rel-title]")?.textContent?.trim() ?? "",
        joins: Array.from(row.querySelectorAll("[data-rel-join]:not([data-rel-unset])")).map(j => j.textContent?.trim() ?? ""),
      }));
      return { kind: "relationships", rows };
    }
    return {
      kind: "fields",
      rows: readVisibleFields(section, data.schema ?? [], hidden),
      more: section.querySelector("[data-more-row]")?.textContent?.trim() || null,
    };
  });
}

function readNode(rf: Node, root: ParentNode): SceneNode | null {
  const data = rf.data as unknown as MartData | undefined;
  if (!data) return null;
  const el = root.querySelector(`.react-flow__node[data-id="${CSS.escape(rf.id)}"]`);
  const width = rf.measured?.width ?? (el as HTMLElement | null)?.offsetWidth ?? 0;
  const height = rf.measured?.height ?? (el as HTMLElement | null)?.offsetHeight ?? 0;
  if (width === 0 || height === 0) return null;

  // Mirrors MartNode's own visibility rules — same inputs, same outcome.
  const hidden = data._objHidden ?? NOTHING_HIDDEN;
  const viewMode = data._viewMode ?? "compact";
  const badge = hidden.status ? null : statusBadge(data.status);
  const sides = data._sides ?? { left: false, right: false };

  return {
    x: rf.position.x,
    y: rf.position.y,
    width,
    height,
    title: data.title,
    inputSource: data.inputSource,
    status: badge ? { ...badge, status: data.status } : null,
    description: Boolean(data.description),
    badgeLines: readBadgeLines(el, data, hidden, viewMode),
    sections: readSections(el, data, hidden),
    sockets: { ...sides, y: viewMode === "erd" ? ERD_SOCKET_Y : height / 2 },
  };
}

function readEdges(root: ParentNode): SceneEdge[] {
  return Array.from(root.querySelectorAll(".react-flow__edge")).flatMap(edge => {
    const path = edge.querySelector<SVGPathElement>("path.react-flow__edge-path");
    const d = path?.getAttribute("d");
    if (!path || !d) return [];
    const width = Number.parseFloat(path.style.strokeWidth);
    return [{
      d,
      stroke: path.style.stroke || DEFAULT_STROKE,
      strokeWidth: Number.isFinite(width) && width > 0 ? width : DEFAULT_STROKE_WIDTH,
      bidirectional: path.hasAttribute("marker-start"),
    }];
  });
}

function readLabels(root: ParentNode): SceneLabel[] {
  return Array.from(root.querySelectorAll("[data-rel-label]")).flatMap(el => {
    const x = Number.parseFloat(el.getAttribute("data-rel-x") ?? "");
    const y = Number.parseFloat(el.getAttribute("data-rel-y") ?? "");
    if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
    const text = el.getAttribute("data-rel-text") ?? "";
    const lines = text ? text.split("\n") : [];
    const cardinality = el.getAttribute("data-rel-card") || null;
    if (lines.length === 0 && !cardinality) return [];
    return [{ x, y, lines, cardinality, selected: el.getAttribute("data-rel-selected") === "1" }];
  });
}

/**
 * Snapshot the mounted canvas. Returns null when there is nothing to export —
 * no nodes, or the canvas isn't mounted.
 */
export function readCanvasScene(rfNodes: Node[], root: ParentNode = document): CanvasScene | null {
  const nodes = rfNodes.flatMap(n => readNode(n, root) ?? []);
  if (nodes.length === 0) return null;
  return { nodes, edges: readEdges(root), labels: readLabels(root) };
}
