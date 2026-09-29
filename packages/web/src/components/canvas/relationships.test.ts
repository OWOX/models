import { describe, it, expect } from "vitest";
import type { ModelEdge, ModelNode } from "@mc/okf";
import { relationshipsByNode } from "./relationships";

const n = (key: string): ModelNode => ({
  key, title: key.toUpperCase(), inputSource: "TABLE", schema: [], position: { x: 0, y: 0 }, status: "pending",
});
const e = (over: Partial<ModelEdge>): ModelEdge => ({ id: "e1", from: "a", to: "b", keys: [], bidirectional: false, ...over });

describe("relationshipsByNode", () => {
  it("lists a relationship on both cards, each from its own side", () => {
    const m = relationshipsByNode([n("a"), n("b")], [e({ keys: [{ left: "b_id", right: "id" }] })]);
    expect(m.get("a")).toEqual([{ id: "e1", direction: "outgoing", otherTitle: "B", joinFields: [{ field: "b_id", otherField: "id" }] }]);
    expect(m.get("b")).toEqual([{ id: "e1", direction: "incoming", otherTitle: "A", joinFields: [{ field: "id", otherField: "b_id" }] }]);
  });

  it("reads a bidirectional relationship as both ways from either side", () => {
    const m = relationshipsByNode([n("a"), n("b")], [e({ bidirectional: true })]);
    expect(m.get("a")![0].direction).toBe("both");
    expect(m.get("b")![0].direction).toBe("both");
  });

  it("drops blank keys and marks a half-set key with ?", () => {
    const m = relationshipsByNode([n("a"), n("b")], [e({ keys: [{ left: "", right: "" }, { left: "x", right: "" }] })]);
    expect(m.get("a")![0].joinFields).toEqual([{ field: "x", otherField: "?" }]);
  });

  it("lists a self-join once", () => {
    const m = relationshipsByNode([n("a")], [e({ to: "a" })]);
    expect(m.get("a")).toHaveLength(1);
  });
});
