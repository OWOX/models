import { describe, it, expect, vi } from "vitest";
import type { ModelEdge, ModelNode } from "@mc/okf";
import { pushModel } from "./push";
import { payloadToGraph, mergeGraphs, type ImportPayload } from "./owoxImport";
import { createModelStore } from "../state/model";
import { buildFormulaContext } from "../lib/formulaContext";

// Bill payments → Accounts three times (QuickBooks Online, OWOX/models#124).
const node = (key: string, title: string, id: string, fields: string[]): ModelNode => ({
  key, title, inputSource: "TABLE", status: "created", owoxId: id, owoxStorageId: "st",
  position: { x: 0, y: 0 }, schema: fields.map((name, i) => ({ name, type: "STRING", pk: i === 0 })),
});
const bp = node("bp", "Bill payments", "id_bp", ["id", "ap_account_id", "check_bank_account_id", "credit_card_account_id"]);
const acc = node("acc", "Accounts", "id_acc", ["id", "parent_id", "name"]);
const edge = (id: string, from: string, to: string, left: string, right = "id", over: Partial<ModelEdge> = {}): ModelEdge =>
  ({ id, from, to, keys: [{ left, right }], bidirectional: false, cardinality: "N:1", ...over });
const parallel = [
  edge("e1", "bp", "acc", "ap_account_id"),
  edge("e2", "bp", "acc", "check_bank_account_id"),
  edge("e3", "bp", "acc", "credit_card_account_id"),
];

async function pushRelationships(edges: ModelEdge[]) {
  const store = createModelStore({ storageId: "st", nodes: [bp, acc], edges });
  const calls: { url: string; body: any }[] = [];
  const api = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === "/api/data-marts" && !init) return [{ id: "id_bp" }, { id: "id_acc" }];
    if (url.endsWith("/relationships")) calls.push({ url, body: JSON.parse(String(init?.body)) });
    return {};
  });
  const res = await pushModel(store, api as any, "GOOGLE_BIGQUERY", {});
  return { calls, res };
}

describe("push: parallel joins", () => {
  it("sends each parallel edge once, one way, under its own alias", async () => {
    const { calls } = await pushRelationships(parallel);
    expect(calls.map(c => c.url)).toEqual(Array(3).fill("/api/data-marts/id_bp/relationships"));
    expect(calls.map(c => c.body.targetAlias)).toEqual(["accounts", "check_bank_account", "credit_card_account"]);
    expect(calls.map(c => c.body.joinConditions[0].sourceFieldName))
      .toEqual(["ap_account_id", "check_bank_account_id", "credit_card_account_id"]);
  });

  it("does not send a self-join — OWOX refuses a relationship from a mart to itself", async () => {
    const { calls, res } = await pushRelationships([edge("e1", "acc", "acc", "parent_id")]);
    expect(calls).toHaveLength(0);
    expect(res.relationshipsFailed).toBe(1);
    expect(res.errors.join("\n")).toMatch(/itself/);
  });
});

describe("formula context: parallel joins", () => {
  it("lists each parallel join under its own alias", () => {
    const ctx = buildFormulaContext(bp, [bp, acc], parallel);
    expect(ctx.joined.map(j => j.alias)).toEqual(["accounts", "check_bank_account", "credit_card_account"]);
  });
});

describe("OWOX import: parallel relationships", () => {
  const mart = (id: string) => ({ id, title: id, status: "PUBLISHED", schema: [], inputSource: "SQL" as const, definition: null });
  const rel = (s: string, t: string, left: string, right: string, targetAlias: string) =>
    ({ sourceId: s, targetId: t, targetAlias, joinConditions: [{ sourceFieldName: left, targetFieldName: right }] });
  const payload = (relationships: ImportPayload["relationships"]): ImportPayload =>
    ({ storageId: "st", total: 2, truncated: false, marts: [mart("a"), mart("b")], relationships });

  it("keeps two A→B relationships with different keys as two edges", () => {
    const g = payloadToGraph(payload([rel("a", "b", "x_id", "id", "b"), rel("a", "b", "y_id", "id", "b_y")]), "all");
    expect(g.edges).toHaveLength(2);
    expect(g.edges.map(e => e.alias)).toEqual(["b", "b_y"]);
    expect(g.edges.some(e => e.bidirectional)).toBe(false);
  });

  it("pairs B→A into ↔ only when its keys mirror A→B", () => {
    const mirrored = payloadToGraph(payload([rel("a", "b", "x_id", "id", "b"), rel("b", "a", "id", "x_id", "a")]), "all");
    expect(mirrored.edges).toHaveLength(1);
    expect(mirrored.edges[0]).toMatchObject({ bidirectional: true, alias: "b", reverseAlias: "a" });

    const other = payloadToGraph(payload([rel("a", "b", "x_id", "id", "b"), rel("b", "a", "last_a_id", "id", "a")]), "all");
    expect(other.edges).toHaveLength(2);
    expect(other.edges.some(e => e.bidirectional)).toBe(false);
  });

  it("merges a re-import onto the matching parallel edge, not onto the first edge of the pair", () => {
    const first = payloadToGraph(payload([rel("a", "b", "x_id", "id", "b"), rel("a", "b", "y_id", "id", "b_y")]), "all");
    const again = payloadToGraph(payload([rel("a", "b", "x_id", "id", "b2"), rel("a", "b", "y_id", "id", "b_y2")]), "all");
    const merged = mergeGraphs(first, again).graph;
    expect(merged.edges).toHaveLength(2);
    expect(merged.edges.map(e => `${e.keys[0].left}:${e.alias}`)).toEqual(["x_id:b2", "y_id:b_y2"]);
  });
});
