import type { Edge } from "@xyflow/react";
import { isCalculated, type ModelNode, type ModelEdge } from "@mc/okf";
import type { ViewMode } from "../../state/viewMode";
import type { RelLabelMode } from "../../state/relLabels";
import { erdAwareNodeSize } from "./layoutSize";

type Side = "left" | "right";

// Pick the horizontal side each end of an edge attaches to.
//
// A handle the user explicitly chose (stored on the edge from a manual drag)
// always wins, so their choice is preserved. Otherwise the side is derived from
// the nodes' relative position: each end exits *toward* the other node — the
// shortest route, no loop-around. The SAME rule runs in compact and ERD mode, so
// the side never jumps when toggling views (imported/template edges carry no
// stored handle, which is exactly the case that used to disagree between modes).
// A hub's edges naturally split across both sides because each one faces its own
// neighbour.
function edgeSides(
  src: ModelNode | undefined,
  tgt: ModelNode | undefined,
  e: ModelEdge,
  viewMode: ViewMode,
): { source: Side; target: Side } {
  let source: Side = "right";
  let target: Side = "left";
  if (src && tgt) {
    const sx = src.position.x + erdAwareNodeSize(src, viewMode).width / 2;
    const tx = tgt.position.x + erdAwareNodeSize(tgt, viewMode).width / 2;
    if (tx < sx) { source = "left"; target = "right"; }
    // A self-join leaves and re-enters on the right, so it draws as a loop beside the card.
    if (src.key === tgt.key) { source = "right"; target = "right"; }
  }
  const storedSource = e.sourceHandle === "left" || e.sourceHandle === "right" ? e.sourceHandle : null;
  const storedTarget = e.targetHandle === "left" || e.targetHandle === "right" ? e.targetHandle : null;
  return { source: storedSource ?? source, target: storedTarget ?? target };
}

function compactEdge(e: ModelEdge, sides: { source: Side; target: Side }, relLabelMode: RelLabelMode): Edge {
  return {
    id: e.id,
    source: e.from,
    target: e.to,
    sourceHandle: sides.source,
    targetHandle: sides.target,
    type: "rel",
    data: { keys: e.keys, bidirectional: e.bidirectional, cardinality: e.cardinality, modelEdgeId: e.id, relLabelMode } as unknown as Record<string, unknown>,
  };
}

// Reconnect (dragging an edge end to another port) is scoped to the SELECTED
// relationship only. Otherwise, when several edges share a node handle their
// reconnect anchors overlap and React Flow grabs whichever is topmost — not the
// one the user picked. ERD view is display-only, so reconnect is off there.
export function isEdgeReconnectable(
  modelEdgeId: string | undefined,
  selectedEdgeId: string | null,
  viewMode: ViewMode,
): boolean {
  return viewMode !== "erd" && modelEdgeId != null && modelEdgeId === selectedEdgeId;
}

// Several joins between the same two marts (QuickBooks: a bill payment → Accounts as
// its A/P, bank and card account) would draw on top of each other. Edges sharing both
// end anchors get a lane each, centred on 0: RelEdge bows lane n by n steps, so a lone
// edge (lane 0) draws exactly as before. A self-join is flagged so it draws as a loop.
function withLanes(out: Edge[]): Edge[] {
  const groups = new Map<string, Edge[]>();
  for (const e of out) {
    const k = [`${e.source}#${e.sourceHandle ?? ""}`, `${e.target}#${e.targetHandle ?? ""}`].sort().join("|");
    const g = groups.get(k);
    if (g) g.push(e); else groups.set(k, [e]);
  }
  for (const g of groups.values()) {
    g.forEach((e, i) => {
      const data = e.data as Record<string, unknown>;
      if (g.length > 1) { data.lane = i - (g.length - 1) / 2; data.laneIndex = i; }
      if (e.source === e.target) data.self = true;
    });
  }
  return out;
}

export function buildRfEdges(edges: ModelEdge[], nodes: ModelNode[], viewMode: ViewMode, relLabelMode: RelLabelMode = "all"): Edge[] {
  const byKey = new Map(nodes.map(n => [n.key, n]));

  if (viewMode !== "erd") {
    return withLanes(edges.map(e => compactEdge(e, edgeSides(byKey.get(e.from), byKey.get(e.to), e, viewMode), relLabelMode)));
  }

  const fieldsByKey = new Map<string, Set<string>>(
    nodes.map(n => [n.key, new Set(n.schema.filter(f => !isCalculated(f)).map(f => f.name))]),
  );

  return withLanes(edges.flatMap(e => {
    const sides = edgeSides(byKey.get(e.from), byKey.get(e.to), e, viewMode);
    const usable = e.keys.filter(k => k.left || k.right);
    if (usable.length === 0) return [compactEdge(e, sides, relLabelMode)];

    const srcFields = fieldsByKey.get(e.from);
    const tgtFields = fieldsByKey.get(e.to);
    // Move the anchor vertically onto the field row, keeping the side chosen
    // above. fr:<field> = right edge of the row, fl:<field> = left edge.
    const srcSide = sides.source === "left" ? "fl" : "fr";
    const tgtSide = sides.target === "left" ? "fl" : "fr";

    return usable.map((k, i): Edge => ({
      id: `${e.id}::${i}`,
      source: e.from,
      target: e.to,
      sourceHandle: k.left && srcFields?.has(k.left) ? `${srcSide}:${k.left}` : sides.source,
      targetHandle: k.right && tgtFields?.has(k.right) ? `${tgtSide}:${k.right}` : sides.target,
      type: "rel",
      data: { keys: [k], bidirectional: e.bidirectional, cardinality: e.cardinality, modelEdgeId: e.id, relLabelMode } as unknown as Record<string, unknown>,
    }));
  }));
}
