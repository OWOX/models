// Reads the live canvas into a plain, serialisable description of what is on
// screen — the input the vector SVG renderer draws from.
//
// Why read the DOM at all: two things the model alone can't tell us. Which ERD
// field rows are visible is component-local state inside MartNode (the "+N more"
// toggle), and the edge curves are geometry React Flow computes from mounted
// handle positions. Both are published as stable `data-` attributes by
// MartNode/RelEdge; everything else (titles, types, colours) comes from the
// model, so the two renderers can't disagree about content.
//
// Coordinates are React Flow's flow space: node positions, edge paths and edge
// label positions all share it, independent of the user's current pan/zoom.

import type { Node } from "@xyflow/react";
import type { ModelNode, SchemaField } from "@mc/okf";
import { NOTHING_HIDDEN, type ObjHidden } from "../state/objLabels";
import type { ViewMode } from "../state/viewMode";
import { sourceColor, statusColor } from "../components/canvas/nodeStyle";

export type SceneField = { label: string; type: string; pk: boolean };

export type SceneNode = {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  /** Accent stripe + chip colour. */
  color: string;
  /** Chip text, or null when the source label is hidden. */
  source: string | null;
  /** Status dot colour, or null when the dot is hidden. */
  status: string | null;
  /** Compact-mode "N fields" text, or null when hidden or in ERD mode. */
  fieldCount: string | null;
  /** The ERD rows actually on screen, in the order they are rendered. */
  fields: SceneField[];
  /** "+3 more fields" / "Show less" row text, or null when there is no toggle. */
  more: string | null;
  /** True for an ERD node whose mart has no schema at all. */
  empty: boolean;
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
  text: string;
  cardinality: string | null;
  selected: boolean;
};

export type CanvasScene = {
  nodes: SceneNode[];
  edges: SceneEdge[];
  labels: SceneLabel[];
};

type MartData = ModelNode & { _viewMode?: ViewMode; _objHidden?: ObjHidden };

const DEFAULT_STROKE = "#94a3b8";
const DEFAULT_STROKE_WIDTH = 2;

function fieldCountText(schema: SchemaField[]): string {
  const n = schema.length;
  return n > 0 ? `${n} field${n > 1 ? "s" : ""}` : "no fields";
}

/** The rendered field rows of one node, resolved against the mart's schema. */
export function readVisibleFields(el: Element | null, schema: SchemaField[]): SceneField[] {
  if (!el) return [];
  const byName = new Map(schema.map(f => [f.name, f]));
  return Array.from(el.querySelectorAll("[data-field]")).flatMap(row => {
    const f = byName.get(row.getAttribute("data-field") ?? "");
    return f ? [{ label: f.alias || f.name, type: f.type, pk: Boolean(f.pk) }] : [];
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
  const isErd = (data._viewMode ?? "compact") === "erd";
  const schema = data.schema ?? [];

  return {
    x: rf.position.x,
    y: rf.position.y,
    width,
    height,
    title: data.title,
    color: sourceColor(data.inputSource),
    source: hidden.source ? null : data.inputSource,
    status: hidden.status ? null : statusColor(data.status),
    fieldCount: isErd || hidden.fields ? null : fieldCountText(schema),
    fields: isErd ? readVisibleFields(el, schema) : [],
    more: isErd ? (el?.querySelector("[data-more-row]")?.textContent?.trim() || null) : null,
    empty: isErd && schema.length === 0,
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
    const cardinality = el.getAttribute("data-rel-card") || null;
    if (!text && !cardinality) return [];
    return [{ x, y, text, cardinality, selected: el.getAttribute("data-rel-selected") === "1" }];
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
