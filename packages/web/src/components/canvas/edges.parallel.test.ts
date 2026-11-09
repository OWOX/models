import { describe, it, expect } from "vitest";
import type { ModelNode, ModelEdge } from "@mc/okf";
import { Position, getBezierPath } from "@xyflow/react";
import { buildRfEdges } from "./edges";
import { relEdgePath } from "./RelEdge";

const node = (key: string, x: number, fields: string[]): ModelNode => ({
  key, title: key, inputSource: "VIEW", schema: fields.map(name => ({ name, type: "STRING", pk: false })),
  position: { x, y: 0 }, status: "created", owoxId: null,
});
const nodes = [node("bp", 0, ["ap_id", "check_id", "realm_id"]), node("acc", 600, ["id", "parent_id", "realm_id"])];
const edge = (id: string, from: string, to: string, keys: [string, string][]): ModelEdge =>
  ({ id, from, to, keys: keys.map(([left, right]) => ({ left, right })), bidirectional: false });
const lane = (e: { data?: Record<string, unknown> }) => (e.data as { lane?: number }).lane ?? 0;

describe("buildRfEdges: parallel edges and self-joins", () => {
  it("compact: spreads parallel edges of one pair onto separate lanes", () => {
    const out = buildRfEdges([
      edge("e1", "bp", "acc", [["ap_id", "id"]]),
      edge("e2", "bp", "acc", [["check_id", "id"]]),
      edge("e3", "acc", "bp", [["id", "ap_id"]]),
    ], nodes, "compact");
    expect(out.map(lane)).toEqual([-1, 0, 1]);
  });

  it("compact: a lone edge keeps lane 0", () => {
    const out = buildRfEdges([edge("e1", "bp", "acc", [["ap_id", "id"]])], nodes, "compact");
    expect(out.map(lane)).toEqual([0]);
  });

  it("erd: shared key rows of parallel edges get separate lanes; distinct rows do not", () => {
    const out = buildRfEdges([
      edge("e1", "bp", "acc", [["ap_id", "id"], ["realm_id", "realm_id"]]),
      edge("e2", "bp", "acc", [["check_id", "id"], ["realm_id", "realm_id"]]),
    ], nodes, "erd");
    const byId = Object.fromEntries(out.map(e => [e.id, lane(e)]));
    expect(byId["e1::1"]).not.toBe(byId["e2::1"]);   // both realm_id → realm_id
    expect(byId["e1::0"]).toBe(0);                     // ap_id → id: its own row
    expect(byId["e2::0"]).toBe(0);
  });

  it("flags a self-join so it can be drawn as a loop", () => {
    const out = buildRfEdges([edge("e1", "acc", "acc", [["parent_id", "id"]])], nodes, "compact");
    expect(out).toHaveLength(1);
    expect((out[0].data as { self?: boolean }).self).toBe(true);
    expect([out[0].sourceHandle, out[0].targetHandle]).toEqual(["right", "right"]);
  });
});

describe("relEdgePath", () => {
  const p = { sourceX: 0, sourceY: 100, targetX: 400, targetY: 100, sourcePosition: Position.Right, targetPosition: Position.Left };

  it("draws a lone edge exactly as React Flow's bezier", () => {
    expect(relEdgePath(p, 0, 0, false)).toEqual(getBezierPath(p).slice(0, 3));
  });

  it("puts the labels of parallel edges apart", () => {
    const ys = [-1, 0, 1].map((lane, i) => relEdgePath(p, lane, i, false)[2]);
    expect(ys[0]).toBeLessThan(ys[1] - 30);
    expect(ys[2]).toBeGreaterThan(ys[1] + 30);
  });

  it("loops a self-join out to the right of the card, further for each extra one", () => {
    const self = { ...p, targetX: 0, targetPosition: Position.Right };
    const [path1, x1] = relEdgePath(self, 0, 0, true);
    const [, x2] = relEdgePath(self, 0, 1, true);
    expect(path1.startsWith("M0,100 C")).toBe(true);
    expect(x1).toBeGreaterThan(40);
    expect(x2).toBeGreaterThan(x1);
  });
});
