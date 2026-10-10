import { describe, it, expect } from "vitest";
import { encodeModel, decodeModel, buildShareUrl, readSharedName } from "./url";
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

  it("keeps join aliases through encode/decode", () => {
    const g: ModelGraph = { ...graph, edges: [{ ...graph.edges[0], alias: "cust", reverseAlias: "ord" }] };
    const back = decodeModel(encodeModel(g))!;
    expect(back.edges[0]).toMatchObject({ alias: "cust", reverseAlias: "ord" });
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

  it("carries the model name in the link and reads it back", () => {
    const url = buildShareUrl(graph, "My SaaS / Subscription OKF with OWOX");
    expect(url).toContain("&n=");
    // Load the hash as if the recipient opened the link.
    history.replaceState(null, "", url.slice(url.indexOf("#")));
    expect(readSharedName()).toBe("My SaaS / Subscription data model with OWOX"); // old wording is migrated
  });

  it("omits the name param when no name is given, and reads null", () => {
    const url = buildShareUrl(graph);
    expect(url).not.toContain("&n=");
    history.replaceState(null, "", url.slice(url.indexOf("#")));
    expect(readSharedName()).toBeNull();
  });
});

describe("share url relationship description", () => {
  it("keeps the edge description through encode/decode", () => {
    const g = { ...graph, edges: [{ ...graph.edges[0], description: "Each order belongs to one customer" }] };
    expect(decodeModel(encodeModel(g))!.edges[0].description).toBe("Each order belongs to one customer");
  });
});

describe("share url model description", () => {
  it("keeps the model description through encode/decode", () => {
    expect(decodeModel(encodeModel({ ...graph, description: "Retail model" }))!.description).toBe("Retail model");
    expect(decodeModel(encodeModel(graph))!.description).toBeUndefined();
  });
});
