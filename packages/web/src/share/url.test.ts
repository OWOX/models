import { describe, it, expect } from "vitest";
import { encodeModel, decodeModel } from "./url";
import type { ModelGraph } from "@mc/okf";

const graph: ModelGraph = {
  storageId: "s1",
  nodes: [
    { key: "orders", title: "Orders", inputSource: "VIEW", schema: [
      { name: "order_id", type: "STRING", pk: true },
      { name: "customer_id", type: "STRING", pk: false },
    ], position: { x: 10, y: 20 }, status: "created", owoxId: "abc" },
    { key: "customers", title: "Customers", inputSource: "VIEW", schema: [
      { name: "customer_id", type: "STRING", pk: true },
    ], position: { x: 300, y: 40 }, status: "pending", owoxId: null },
  ],
  edges: [
    { id: "e1", from: "orders", to: "customers", keys: [{ left: "customer_id", right: "customer_id" }], bidirectional: false, cardinality: "N:1" },
  ],
};

describe("share url", () => {
  it("round-trips a model through encode/decode (URL-safe)", () => {
    const payload = encodeModel(graph);
    expect(payload).toMatch(/^[A-Za-z0-9_-]+$/); // url-safe, no +/=
    const back = decodeModel(payload)!;
    expect(back.nodes.map(n => n.key)).toEqual(["orders", "customers"]);
    expect(back.edges).toEqual(graph.edges);
    expect(back.nodes[0].position).toEqual({ x: 10, y: 20 }); // layout preserved
    expect(back.nodes[0].schema).toEqual(graph.nodes[0].schema);
  });

  it("strips OWOX-specific ids so a public link can't leak them", () => {
    const back = decodeModel(encodeModel(graph))!;
    expect(back.storageId).toBeNull();
    expect(back.nodes[0].owoxId).toBeNull();
    expect(back.nodes[0].status).toBe("pending");
  });

  it("returns null for a corrupt payload", () => {
    expect(decodeModel("not-a-real-payload")).toBeNull();
    expect(decodeModel("")).toBeNull();
  });
});
