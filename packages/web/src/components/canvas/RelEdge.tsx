import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import type { ModelEdge } from "@mc/okf";

export type RelEdgeData = Pick<ModelEdge, "keys" | "bidirectional" | "cardinality">;

function RelEdgeInner(props: EdgeProps) {
  // Custom <marker> defs are built inline below; RF's markerEnd/markerStart
  // props are intentionally not used.
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

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const label = keys.length > 0
    ? keys.map(k => `${k.left || "?"} = ${k.right || "?"}`).join(", ")
    : "";

  const strokeColor = selected ? "#1e88e5" : "#94a3b8";
  const strokeWidth = selected ? 2.5 : 2;

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
        style={{ stroke: strokeColor, strokeWidth }}
      />
      {(label || cardinality) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
              background: "#fff",
              border: `1px solid ${selected ? "#1e88e5" : "#d8dee8"}`,
              borderRadius: 6,
              padding: "2px 8px",
              fontSize: 11,
              fontWeight: 550,
              color: "#0f172a",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            className="nodrag nopan"
          >
            {label}
            {cardinality && (
              <span
                style={{
                  padding: "0 5px",
                  borderRadius: 4,
                  background: "#e6f1fb",
                  color: "#1e88e5",
                  fontSize: 10,
                  fontWeight: 700,
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
