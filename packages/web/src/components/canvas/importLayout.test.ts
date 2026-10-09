import { describe, it, expect } from "vitest";
import type { ModelGraph, ModelNode } from "@mc/okf";
import { hasStoredPositions } from "./importLayout";

const node = (key: string, x: number, y: number): ModelNode => ({
  key, title: key, inputSource: "TABLE", schema: [], position: { x, y }, status: "pending", owoxId: null,
});
const graph = (nodes: ModelNode[]): ModelGraph => ({ storageId: null, nodes, edges: [] });

describe("hasStoredPositions", () => {
  it("is true when every node has a non-origin position", () => {
    expect(hasStoredPositions(graph([node("a", 10, 20), node("b", 0, 5)]))).toBe(true);
  });
  it("is false when one node sits at the origin", () => {
    expect(hasStoredPositions(graph([node("a", 10, 20), node("b", 0, 0)]))).toBe(false);
  });
  it("is false for an empty graph", () => {
    expect(hasStoredPositions(graph([]))).toBe(false);
  });
});
