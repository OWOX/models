import { describe, it, expect } from "vitest";
import { serializeBundle, parseBundle } from "../src/index";
import type { ModelGraph } from "../src/types";

const node = (key: string, title: string, schema: ModelGraph["nodes"][number]["schema"]) =>
  ({ key, title, inputSource: "TABLE" as const, schema, position: { x: 0, y: 0 }, status: "pending" as const, owoxId: null });

const graph: ModelGraph = {
  storageId: null,
  nodes: [
    node("orders", "Orders", [
      { name: "order_id", type: "INTEGER", pk: true },
      { name: "customer_id", type: "INTEGER", pk: false },
      { name: "amount", type: "NUMERIC", pk: false },
      { name: "aov", type: "NUMERIC", pk: false, alias: "Average order value",
        description: "Average order value.\n\nUse for basket-size questions.",
        formula: "SUM(amount) / NULLIF(COUNT(DISTINCT order_id), 0)" },
      { name: "label", type: "STRING", pk: false, formula: "first_name || ' ' || `last name`\n-- trailing comment" },
      { name: "revenue_per_customer", type: "NUMERIC", pk: false, formula: "SUM(amount) / COUNT(DISTINCT cust.id)" },
    ]),
    node("customers", "Customers", [{ name: "id", type: "INTEGER", pk: true }]),
  ],
  edges: [{ id: "e1", from: "orders", to: "customers", keys: [{ left: "customer_id", right: "id" }], bidirectional: true, alias: "cust", reverseAlias: "ord" }],
};

describe("OKF calculated fields", () => {
  const files = serializeBundle(graph, "Shop").files;
  const orders = files["shop/orders.md"];

  it("writes them in their own section, not in the schema table", () => {
    expect(orders).toContain("## Calculated fields");
    expect(orders).toContain("### `aov` · NUMERIC · Metric");
    expect(orders).toContain("### `label` · STRING · Column");
    const table = orders.slice(orders.indexOf("# Schema"), orders.indexOf("## Calculated fields"));
    expect(table).not.toContain("`aov`");
    expect(orders.indexOf("## Calculated fields")).toBeLessThan(orders.indexOf("## Joins"));
  });

  it("round-trips name, type, alias, multi-line description and formula", () => {
    const back = parseBundle(files);
    const o = back.nodes.find(n => n.key === "orders")!;
    expect(o.schema.map(f => f.name)).toEqual(["order_id", "customer_id", "amount", "aov", "label", "revenue_per_customer"]);
    expect(o.schema.find(f => f.name === "aov")).toEqual(graph.nodes[0].schema[3]);
    expect(o.schema.find(f => f.name === "label")!.formula).toBe("first_name || ' ' || `last name`\n-- trailing comment");
    expect(o.schema.find(f => f.name === "order_id")!.formula).toBeUndefined();
  });

  it("escapes a formula line that would close the fence", () => {
    const g: ModelGraph = { storageId: null, edges: [], nodes: [node("a", "A", [
      { name: "x", type: "STRING", pk: false, formula: "CONCAT(a,\n```\n)" },
    ])] };
    const back = parseBundle(serializeBundle(g, "T").files);
    expect(back.nodes[0].schema[0].formula).toBe("CONCAT(a,\n ```\n)");
  });

  it("keeps a mart whose schema is only calculated fields", () => {
    const g: ModelGraph = { storageId: null, edges: [], nodes: [node("a", "A", [
      { name: "total", type: "NUMERIC", pk: false, formula: "SUM(x)" },
    ])] };
    const md = serializeBundle(g, "T").files["t/a.md"];
    expect(md).not.toContain("# Schema");
    expect(parseBundle({ "t/a.md": md }).nodes[0].schema).toEqual(g.nodes[0].schema);
  });

  it("round-trips join aliases in both directions", () => {
    expect(orders).toContain("- [Customers](./customers.md) as `cust` — `customer_id = id`");
    expect(files["shop/customers.md"]).toContain("- [Orders](./orders.md) as `ord` — `id = customer_id`");
    const e = parseBundle(files).edges[0];
    expect(e).toMatchObject({ from: "orders", to: "customers", bidirectional: true, alias: "cust", reverseAlias: "ord", keys: [{ left: "customer_id", right: "id" }] });
  });

  it("leaves alias unset for join lines without `as`", () => {
    const g: ModelGraph = { ...graph, edges: [{ id: "e1", from: "orders", to: "customers", keys: [{ left: "customer_id", right: "id" }], bidirectional: false }] };
    const e = parseBundle(serializeBundle(g, "Shop").files).edges[0];
    expect(e.alias).toBeUndefined();
    expect(e.reverseAlias).toBeUndefined();
  });
});
