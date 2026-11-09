import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
  type EdgeProps,
} from "@xyflow/react";
import type { ModelEdge } from "@mc/okf";
import { visibleKeys, showCardinality, type RelLabelMode } from "../../state/relLabels";
import {
  CARD_COLORS,
  CARDINALITY_BG,
  EDGE_NEUTRAL,
  EDGE_SELECTED_STROKE_WIDTH,
  EDGE_STROKE_WIDTH,
  OWOX_BLUE,
} from "./nodeStyle";

export type RelEdgeData = Pick<ModelEdge, "keys" | "bidirectional" | "cardinality"> & {
  relLabelMode?: RelLabelMode;
  /** One end is the selected card — the edge lights up like a selected one. */
  highlighted?: boolean;
  /** Parallel edges between the same anchors: lane centred on 0 (buildRfEdges). */
  lane?: number;
  laneIndex?: number;
  /** A self-join: drawn as a loop on the card's right side. */
  self?: boolean;
};

const LANE_STEP = 56;      // control-point shift per lane; the label moves ¾ of it
const LOOP_REACH = 70;     // how far a self-join loop reaches out from the card
const LOOP_STEP = 32;      // extra reach for each further self-join of one card

/** A cubic path for a parallel edge (bowed by its lane) or a self-join loop, with its
 *  label point. A lone edge keeps React Flow's own bezier. */
export function relEdgePath(
  p: { sourceX: number; sourceY: number; targetX: number; targetY: number; sourcePosition: Position; targetPosition: Position },
  lane: number, laneIndex: number, self: boolean,
): [path: string, labelX: number, labelY: number] {
  const { sourceX: sx, sourceY: sy, targetX: tx, targetY: ty } = p;
  const point = (c1x: number, c1y: number, c2x: number, c2y: number): [string, number, number] => [
    `M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}`,
    (sx + 3 * c1x + 3 * c2x + tx) / 8,
    (sy + 3 * c1y + 3 * c2y + ty) / 8,
  ];
  const horizontal = (pos: Position) => pos === Position.Left || pos === Position.Right;
  if (self) {
    const reach = LOOP_REACH + LOOP_STEP * laneIndex;
    const dir = p.sourcePosition === Position.Left ? -1 : 1;
    // Both ends on one row: open the loop up and down so it does not collapse.
    const spread = Math.abs(ty - sy) < 8 ? reach * 0.8 : 0;
    return point(sx + dir * reach, sy - spread, tx + dir * reach, ty + spread);
  }
  if (!lane || !horizontal(p.sourcePosition) || !horizontal(p.targetPosition)) {
    const [path, lx, ly] = getBezierPath(p);
    return [path, lx, ly];
  }
  const d = Math.max(Math.abs(tx - sx) * 0.5, 50);
  const out = (pos: Position) => (pos === Position.Right ? d : -d);
  const shift = lane * LANE_STEP;
  return point(sx + out(p.sourcePosition), sy + shift, tx + out(p.targetPosition), ty + shift);
}

/** The label's join lines, one "left = right" per key, as the product shows them. */
export function joinLines(keys: ModelEdge["keys"], mode: RelLabelMode): string[] {
  return visibleKeys(keys, mode).map(k => `${k.left || "?"} = ${k.right || "?"}`);
}

function RelEdgeInner(props: EdgeProps) {
  // Custom <marker> defs are built inline below; RF's markerEnd/markerStart
  // props are intentionally not used — their fill has to follow the stroke.
  const {
    id,
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    data,
    selected,
  } = props;

  const edgeData = data as unknown as RelEdgeData | undefined;
  const keys = edgeData?.keys ?? [];
  const bidirectional = edgeData?.bidirectional ?? false;
  const cardinality = edgeData?.cardinality;
  const mode: RelLabelMode = edgeData?.relLabelMode ?? "all";
  const active = Boolean(selected || edgeData?.highlighted);

  const [edgePath, labelX, labelY] = relEdgePath(
    { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition },
    edgeData?.lane ?? 0, edgeData?.laneIndex ?? 0, edgeData?.self ?? false,
  );

  const lines = joinLines(keys, mode);
  const cardShown = Boolean(cardinality) && showCardinality(keys, mode);

  // Corporate gray at rest; blue only when the edge (or one of its cards) is selected.
  const strokeColor = active ? OWOX_BLUE : EDGE_NEUTRAL;
  const strokeWidth = active ? EDGE_SELECTED_STROKE_WIDTH : EDGE_STROKE_WIDTH;

  return (
    <>
      <defs>
        <marker
          id={`arr-end-${id}`}
          markerWidth="9"
          markerHeight="9"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L7,3 L0,6 z" fill={strokeColor} />
        </marker>
        {bidirectional && (
          <marker
            id={`arr-start-${id}`}
            markerWidth="9"
            markerHeight="9"
            refX="0"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M7,0 L0,3 L7,6 z" fill={strokeColor} />
          </marker>
        )}
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={`url(#arr-end-${id})`}
        markerStart={bidirectional ? `url(#arr-start-${id})` : undefined}
        style={{ stroke: strokeColor, strokeWidth, transition: "stroke 0.2s" }}
      />
      {(lines.length > 0 || cardShown) && (
        <EdgeLabelRenderer>
          <div
            data-rel-label=""
            data-rel-text={lines.join("\n")}
            data-rel-card={cardShown ? cardinality : ""}
            data-rel-x={labelX}
            data-rel-y={labelY}
            data-rel-selected={active ? "1" : ""}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              background: CARD_COLORS.background,
              border: `1px solid ${active ? OWOX_BLUE : CARD_COLORS.border}`,
              borderRadius: 8,
              padding: "3px 8px",
              fontSize: 11,
              fontWeight: 600,
              lineHeight: 1.5,
              color: CARD_COLORS.foreground,
              whiteSpace: "nowrap",
              boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            className="nodrag nopan"
          >
            {lines.length > 0 && (
              <span style={{ display: "flex", flexDirection: "column" }}>
                {/* Index keys: duplicate join conditions are representable. */}
                {lines.map((line, i) => <span key={`${i}-${line}`}>{line}</span>)}
              </span>
            )}
            {cardShown && (
              <span
                style={{
                  padding: "0 5px",
                  borderRadius: 4,
                  background: CARDINALITY_BG,
                  color: OWOX_BLUE,
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: "13px",
                }}
              >
                {cardinality}
              </span>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const RelEdge = memo(RelEdgeInner);
