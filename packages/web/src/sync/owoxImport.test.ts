import { describe, it, expect } from "vitest";
import { selectMartIds, payloadToGraph, mergeGraphs, type ImportPayload } from "./owoxImport";
import type { ModelGraph } from "@mc/okf";

const mart = (id: string, status: string) => ({ id, title: id, status, schema: [], inputSource: "SQL" as const, definition: null });
const base: ImportPayload = {
  storageId: "st_1", total: 3, truncated: false,
  marts: [mart("a", "PUBLISHED"), mart("b", "DRAFT"), mart("c", "DRAFT")],
  relationships: [
    { sourceId: "a", targetId: "b", joinConditions: [{ sourceFieldName: "bid", targetFieldName: "id" }] },
    { sourceId: "b", targetId: "a", joinConditions: [{ sourceFieldName: "id", targetFieldName: "bid" }] },
  ],
};

describe("selectMartIds", () => {
  it("all → every mart", () => expect(selectMartIds(base, "all")).toEqual(new Set(["a", "b", "c"])));
  it("published → only published, then pulls related partners", () =>
    // "a" is published; it relates to "b", so pull-partner adds "b". "c" stays out.
    expect(selectMartIds(base, "published")).toEqual(new Set(["a", "b"])));
  it("with-relationships → only marts that have a relationship", () =>
    expect(selectMartIds(base, "with-relationships")).toEqual(new Set(["a", "b"])));
});

describe("payloadToGraph description", () => {
  it("takes the first relationship's description, falling back to the reverse one", () => {
    const rel = (s: string, t: string, description?: string) => ({ sourceId: s, targetId: t, joinConditions: [{ sourceFieldName: "x", targetFieldName: "y" }], ...(description ? { description } : {}) });
    const p = (rels: ImportPayload["relationships"]): ImportPayload => ({ ...base, relationships: rels });
    expect(payloadToGraph(p([rel("a", "b", "first"), rel("b", "a", "second")]), "all").edges[0].description).toBe("first");
    expect(payloadToGraph(p([rel("a", "b"), rel("b", "a", "second")]), "all").edges[0].description).toBe("second");
    expect(payloadToGraph(p([rel("a", "b")]), "all").edges[0].description).toBeUndefined();
  });
});

describe("payloadToGraph", () => {
  it("marts become created nodes with owoxId + owoxStorageId", () => {
    const g = payloadToGraph(base, "all");
    const a = g.nodes.find(n => n.owoxId === "a")!;
    expect(a.status).toBe("created");
    expect(a.owoxStorageId).toBe("st_1"); // tagged so push can detect a project/storage switch
    expect(g.storageId).toBe("st_1");
  });
  it("carries the mart description onto the node", () => {
    const withDesc: ImportPayload = {
      storageId: "st_1", total: 1, truncated: false,
      marts: [{ ...mart("a", "PUBLISHED"), description: "A gold-layer mart" }],
      relationships: [],
    };
    const g = payloadToGraph(withDesc, "all");
    expect(g.nodes[0].description).toBe("A gold-layer mart");
  });
  it("collapses A→B and B→A into one bidirectional edge", () => {
    const g = payloadToGraph(base, "all");
    expect(g.edges).toHaveLength(1);
    expect(g.edges[0].bidirectional).toBe(true);
  });
  it("marks every imported edge as existing (already in OWOX — push must skip it)", () => {
    const g = payloadToGraph(base, "all");
    expect(g.edges).toHaveLength(1);
    expect(g.edges[0].existing).toBe(true);
  });
  it("drops edges to marts outside the selection", () => {
    const g = payloadToGraph(base, "published"); // a,b selected; both rel ends in set → 1 edge
    expect(g.nodes.map(n => n.owoxId).sort()).toEqual(["a", "b"]);
    expect(g.edges).toHaveLength(1);
  });
  it("drops a relationship whose target mart is excluded from the payload (dangling endpoint)", () => {
    // "c" is referenced by a relationship but never appears in payload.marts, so
    // pull-partner (gated on `present.has(...)`) cannot re-include it — the edge
    // lookup in payloadToGraph finds no key for "c" and must hit `if (!from || !to) continue`.
    const danglingPayload: ImportPayload = {
      storageId: "st_2", total: 1, truncated: false,
      marts: [mart("a", "PUBLISHED")],
      relationships: [
        { sourceId: "a", targetId: "c", joinConditions: [{ sourceFieldName: "cid", targetFieldName: "id" }] },
      ],
    };
    const g = payloadToGraph(danglingPayload, "all");
    expect(g.nodes).toHaveLength(1);
    expect(g.nodes.some(n => n.owoxId === "c")).toBe(false);
    expect(g.edges).toHaveLength(0);
  });
});

describe("mergeGraphs", () => {
  it("updates a node with a matching owoxId in place (keeps position) and adds new ones", () => {
    const current: ModelGraph = { storageId: "st_1", nodes: [
      { key: "n1", title: "old", inputSource: "SQL", schema: [], position: { x: 50, y: 60 }, status: "created", owoxId: "a" },
    ], edges: [] };
    const incoming = payloadToGraph(base, "all");
    const { graph, newKeys } = mergeGraphs(current, incoming);
    const a = graph.nodes.find(n => n.owoxId === "a")!;
    expect(a.key).toBe("n1");                 // kept the existing node
    expect(a.position).toEqual({ x: 50, y: 60 }); // kept its position
    expect(graph.nodes.some(n => n.owoxId === "b")).toBe(true); // new node added
    expect(newKeys.has(a.key)).toBe(false);
    const b = graph.nodes.find(n => n.owoxId === "b")!;
    expect(newKeys.has(b.key)).toBe(true); // genuinely new node's key is reported
  });

  it("merges edges: skips a duplicate node-pair and appends a genuinely new one", () => {
    const current: ModelGraph = { storageId: "st_1", nodes: [
      { key: "n1", title: "old-a", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "a" },
      { key: "n2", title: "old-b", inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "created", owoxId: "b" },
    ], edges: [
      { id: "e1", from: "n1", to: "n2", keys: [{ left: "bid", right: "id" }], bidirectional: false },
    ] };
    // Incoming payload: a→b duplicates the existing pair (must be skipped, not duplicated);
    // a→c is a new pair (c is a brand-new node) and must be appended with a fresh eN id.
    const incomingPayload: ImportPayload = {
      storageId: "st_1", total: 3, truncated: false,
      marts: [mart("a", "PUBLISHED"), mart("b", "DRAFT"), mart("c", "DRAFT")],
      relationships: [
        { sourceId: "a", targetId: "b", joinConditions: [{ sourceFieldName: "bid", targetFieldName: "id" }] },
        { sourceId: "a", targetId: "c", joinConditions: [{ sourceFieldName: "cid", targetFieldName: "id" }] },
      ],
    };
    const incoming = payloadToGraph(incomingPayload, "all");
    const { graph } = mergeGraphs(current, incoming);

    expect(graph.edges).toHaveLength(2); // duplicate a-b skipped, a-c appended
    const c = graph.nodes.find(n => n.owoxId === "c")!;
    const newEdge = graph.edges.find(e => e.id !== "e1")!;
    expect(newEdge.id).toBe("e2");
    expect([newEdge.from, newEdge.to].sort()).toEqual(["n1", c.key].sort());
  });
});

describe("payloadToGraph formulas and aliases", () => {
  it("keeps formulas and maps aliases, incl. the reverse alias of a collapsed pair", () => {
    const payload = {
      storageId: "st", total: 2, truncated: false,
      marts: [
        { id: "a", title: "Orders", inputSource: "TABLE" as const, definition: null,
          schema: [{ name: "id", type: "INTEGER", pk: true }, { name: "aov", type: "NUMERIC", pk: false, formula: "SUM(x)" }] },
        { id: "b", title: "Customers", inputSource: "TABLE" as const, definition: null, schema: [{ name: "id", type: "INTEGER", pk: true }] },
      ],
      relationships: [
        { sourceId: "a", targetId: "b", targetAlias: "cust", joinConditions: [{ sourceFieldName: "id", targetFieldName: "id" }] },
        { sourceId: "b", targetId: "a", targetAlias: "ord", joinConditions: [{ sourceFieldName: "id", targetFieldName: "id" }] },
      ],
    };
    const g = payloadToGraph(payload, "all");
    expect(g.nodes[0].schema[1]).toEqual({ name: "aov", type: "NUMERIC", pk: false, formula: "SUM(x)" });
    expect(g.edges).toHaveLength(1);
    expect(g.edges[0]).toMatchObject({ bidirectional: true, alias: "cust", reverseAlias: "ord" });
  });
});

describe("mergeGraphs description", () => {
  it("fills a missing description on a paired existing edge, never overwrites one", () => {
    const n = (key: string, id: string) => ({ key, title: id, inputSource: "SQL" as const, schema: [], position: { x: 0, y: 0 }, status: "created" as const, owoxId: id });
    const mk = (description?: string): ModelGraph => ({ storageId: "st_1", nodes: [n("n1", "a"), n("n2", "b")],
      edges: [{ id: "e1", from: "n1", to: "n2", keys: [{ left: "x", right: "y" }], bidirectional: false, ...(description ? { description } : {}) }] });
    const incoming = payloadToGraph({ ...base, relationships: [{ sourceId: "a", targetId: "b", description: "new", joinConditions: [{ sourceFieldName: "x", targetFieldName: "y" }] }] }, "all");
    expect(mergeGraphs(mk(), incoming).graph.edges[0].description).toBe("new");
    expect(mergeGraphs(mk("mine"), incoming).graph.edges[0].description).toBe("mine");
  });
});

describe("mergeGraphs model description", () => {
  it("keeps the current model description", () => {
    const cur: ModelGraph = { storageId: "s", nodes: [], edges: [], description: "mine" };
    const inc: ModelGraph = { storageId: "s", nodes: [], edges: [], description: "theirs" };
    expect(mergeGraphs(cur, inc).graph.description).toBe("mine");
  });
});
