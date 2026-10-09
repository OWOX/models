import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import YAML from "yaml";
import Ajv2020 from "ajv/dist/2020";
import { serializeOssie, parseOssie } from "../src/index";
import type { ModelGraph } from "../src/types";
const schema = JSON.parse(readFileSync(new URL("./fixtures/ossie/ossie-schema.json", import.meta.url), "utf8"));

const node = (key: string, title: string, schema: ModelGraph["nodes"][number]["schema"], extra = {}) =>
  ({ key, title, inputSource: "VIEW" as const, definition: `p.d.${key}`, schema, position: { x: 10, y: 20 }, status: "pending" as const, owoxId: null, ...extra });
const graph: ModelGraph = {
  storageId: null,
  nodes: [
    node("orders", "Orders", [
      { name: "order_id", type: "STRING", pk: true },
      { name: "customer_id", type: "INTEGER", pk: false, alias: "Customer" },
      { name: "date", type: "DATE", pk: false },
      { name: "geo", type: "GEOGRAPHY", pk: false },
      { name: "aov", type: "NUMERIC", pk: false, description: "Avg order value", formula: "SUM(amount) / NULLIF(COUNT(DISTINCT order_id), 0)" },
      { name: "amount", type: "BIGNUMERIC", pk: false },
      { name: "spc", type: "FLOAT", pk: false, formula: "SUM(amount) / COUNT(DISTINCT cust.id)" },
      { name: "label", type: "STRING", pk: false, formula: "CONCAT(order_id, '-x')" },
    ]),
    node("customers", "Customers", [{ name: "id", type: "INTEGER", pk: true }], { position: { x: 400, y: 20 } }),
    node("c2", "customers", [{ name: "id", type: "INTEGER", pk: true }], { inputSource: "CONNECTOR", definition: null }),
  ],
  edges: [
    { id: "e1", from: "orders", to: "customers", keys: [{ left: "customer_id", right: "id" }], bidirectional: true, cardinality: "N:1", alias: "cust", reverseAlias: "ord" },
    { id: "e2", from: "customers", to: "c2", keys: [], bidirectional: false },
    { id: "e3", from: "c2", to: "orders", keys: [{ left: "id", right: "customer_id" }], bidirectional: false, cardinality: "1:N" },
  ],
};

describe("serializeOssie", () => {
  const { yaml, warnings } = serializeOssie(graph, "My first data model with OWOX");
  const doc = YAML.parse(yaml);
  it("writes a flat 0.2.0.dev0 document that passes Ossie's JSON schema", () => {
    expect(doc.version).toBe("0.2.0.dev0");
    expect(doc.name).toBe("my_first_data_model_with_owox");
    const validate = new Ajv2020({ strict: false, allErrors: true }).compile(schema);
    expect(validate(doc), JSON.stringify(validate.errors)).toBe(true);
  });
  it("names datasets uniquely and rewrites metric references to dataset.field", () => {
    expect(doc.datasets.map((d: any) => d.name)).toEqual(["orders", "customers", "customers_2"]);
    expect(doc.metrics.find((m: any) => m.name === "spc").expression.dialects[0].expression).toBe("SUM(orders.amount) / COUNT(DISTINCT customers.id)");
    expect(doc.datasets[0].fields.find((f: any) => f.name === "label").expression.dialects[0].expression).toBe("CONCAT(order_id, '-x')");
  });
  it("warns about what Ossie cannot hold", () => {
    expect(warnings).toEqual(expect.arrayContaining([
      '"customers" has no table/view/SQL source — exported with its title as source',
      "relationship customers → customers_2 has no join keys — not exported",
    ]));
  });
  it("round-trips back to the same model", () => {
    const back = parseOssie(yaml).graph;
    const strip = (g: ModelGraph) => g.nodes.map(n => ({ title: n.title, inputSource: n.inputSource, position: n.position, schema: [...n.schema].sort((a, b) => a.name.localeCompare(b.name)) }));
    expect(strip(back)).toEqual(strip({ ...graph, nodes: graph.nodes.map(n => n.key === "c2" ? { ...n, definition: "customers" } : n) }));
    const e1 = back.edges.find(e => e.alias === "cust")!;
    expect(e1).toMatchObject({ bidirectional: true, reverseAlias: "ord", cardinality: "N:1", keys: [{ left: "customer_id", right: "id" }] });
    const e3 = back.edges.find(e => e.cardinality === "1:N")!;
    expect(back.nodes.find(n => n.key === e3.from)!.title).toBe("customers");
  });
});
