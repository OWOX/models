import { describe, it, expect } from "vitest";
import { buildFormulaContext } from "./formulaContext";
import type { ModelNode, ModelEdge } from "@mc/okf";

const n = (key: string, title: string, fields: string[], calc: string[] = []): ModelNode => ({
  key, title, inputSource: "TABLE", position: { x: 0, y: 0 }, status: "pending",
  schema: [...fields.map(name => ({ name, type: "STRING", pk: false })), ...calc.map(name => ({ name, type: "NUMERIC", pk: false, formula: "SUM(x)" }))],
} as ModelNode);
const nodes = [n("o", "Orders", ["id", "cid", "amount"], ["aov"]), n("c", "Customers", ["id", "email"], ["ltv"]), n("p", "Products", ["id"])];

describe("buildFormulaContext", () => {
  it("lists own fields (calculated included) and outgoing joins under their alias", () => {
    const edges: ModelEdge[] = [
      { id: "e1", from: "o", to: "c", keys: [], bidirectional: false },
      { id: "e2", from: "o", to: "p", keys: [], bidirectional: false, alias: "prod" },
    ] as ModelEdge[];
    expect(buildFormulaContext(nodes[0], nodes, edges)).toEqual({
      own: ["id", "cid", "amount", "aov"],
      joined: [
        { alias: "customers", title: "Customers", fields: ["id", "email"] },
        { alias: "prod", title: "Products", fields: ["id"] },
      ],
    });
  });
  it("uses reverseAlias for the far end of a bidirectional edge, and ignores incoming one-way edges", () => {
    const edges: ModelEdge[] = [
      { id: "e1", from: "o", to: "c", keys: [], bidirectional: true, reverseAlias: "ord" },
      { id: "e2", from: "p", to: "c", keys: [], bidirectional: false },
    ] as ModelEdge[];
    expect(buildFormulaContext(nodes[1], nodes, edges).joined).toEqual([{ alias: "ord", title: "Orders", fields: ["id", "cid", "amount"] }]);
  });
});
