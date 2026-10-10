import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import YAML from "yaml";
import Ajv2020 from "ajv/dist/2020";
import { parseOssie, serializeOssie } from "../src/index";
import type { ModelGraph } from "../src/types";
const schema = JSON.parse(readFileSync(new URL("./fixtures/ossie/ossie-schema.json", import.meta.url), "utf8"));
const ext = (o: unknown) => [{ vendor_name: "OWOX", data: JSON.stringify(o) }];
const ex = (e: string) => ({ dialects: [{ dialect: "BIGQUERY", expression: e }] });

describe("parseOssie — extension type guards", () => {
  const bad = {
    version: "0.2.0.dev0", name: "m",
    custom_extensions: ext({ name: 5 }),
    datasets: [
      { name: "orders", source: "p.d.orders", custom_extensions: ext({ title: 5, inputSource: "NOPE", x: "1", y: 2 }),
        fields: [{ name: "id", expression: ex("id"), custom_extensions: ext({ type: { a: 1 }, alias: 7 }) }] },
      { name: "cust", source: "p.d.cust", fields: [{ name: "id", expression: ex("id") }] },
    ],
    relationships: [{ name: "r", from: "orders", to: "cust", from_columns: ["id"], to_columns: ["id"],
      custom_extensions: ext({ alias: 1, reverseAlias: {}, cardinality: "9:9", bidirectional: "yes", swapped: 1 }) }],
    metrics: [{ name: "n", expression: ex("COUNT(orders.id)"), custom_extensions: ext({ home: 3, alias: 9, type: [] }) }],
  };
  it("imports with defaults and only strings", () => {
    const r = parseOssie(JSON.stringify(bad));
    const n = r.graph.nodes[0];
    expect(n.title).toBe("orders");
    expect(n.inputSource).toBe("TABLE");
    expect(n.position).toEqual({ x: 0, y: 0 });
    expect(r.graph.edges[0]).toMatchObject({ cardinality: "N:1", bidirectional: false, from: "orders", to: "cust" });
    expect(r.graph.edges[0].alias).toBeUndefined();
    expect(r.graph.edges[0].reverseAlias).toBeUndefined();
    expect(typeof r.name).toBe("string");
    for (const nd of r.graph.nodes) {
      expect(typeof nd.title).toBe("string");
      for (const f of nd.schema) {
        expect(typeof f.type).toBe("string");
        if (f.alias !== undefined) expect(typeof f.alias).toBe("string");
      }
    }
  });
});

describe("parseOssie — metric named like a field", () => {
  it("renames the metric and warns", () => {
    const r = parseOssie(JSON.stringify({ version: "0.2.0.dev0", name: "m", datasets: [
      { name: "orders", source: "x", fields: [{ name: "revenue", expression: ex("revenue") }] }],
      metrics: [{ name: "revenue", expression: ex("SUM(orders.revenue)") }] }));
    const names = r.graph.nodes[0].schema.map(f => f.name);
    expect(names).toEqual(["revenue", "revenue_metric"]);
    expect(r.graph.nodes[0].schema[1].formula).toBe("SUM(revenue)");
    expect(r.warnings).toContain('metric "revenue" renamed to "revenue_metric" — the dataset already has a field with that name');
  });
});

describe("parseOssie — calculated column with unknown columns", () => {
  it("warns", () => {
    const r = parseOssie(JSON.stringify({ version: "0.2.0.dev0", name: "m", datasets: [
      { name: "orders", source: "x", fields: [{ name: "a", expression: ex("a") }, { name: "c", expression: ex("a + ghost") }] }] }));
    expect(r.warnings).toContain('field "orders.c": expression references unknown column(s) — push will refuse it');
  });
  it("does not warn when columns exist", () => {
    const r = parseOssie(JSON.stringify({ version: "0.2.0.dev0", name: "m", datasets: [
      { name: "orders", source: "x", fields: [{ name: "a", expression: ex("a") }, { name: "c", expression: ex("a + 1") }] }] }));
    expect(r.warnings).toEqual([]);
  });
});

describe("parseOssie — alias bomb", () => {
  it("is refused", () => {
    let y = "a0: &a0 [x]\n";
    for (let i = 1; i < 12; i++) y += `a${i}: &a${i} [${Array(10).fill(`*a${i - 1}`).join(", ")}]\n`;
    y += "datasets: *a11\n";
    expect(() => parseOssie(y)).toThrow(/Couldn't read this Ossie file/);
  });
});

describe("serializeOssie — unnamed fields", () => {
  it("skips them, stays schema-valid and warns", () => {
    const g: ModelGraph = { storageId: null, edges: [], nodes: [{
      key: "o", title: "Orders", inputSource: "VIEW", definition: "p.d.o", position: { x: 0, y: 0 }, status: "pending", owoxId: null,
      schema: [
        { name: "id", type: "STRING", pk: true },
        { name: "", type: "STRING", pk: true },
        { name: " ", type: "STRING", pk: false, formula: "CONCAT(id, 'x')" },
        { name: "", type: "NUMERIC", pk: false, formula: "SUM(id)" },
      ] }] };
    const { yaml, warnings } = serializeOssie(g, "m");
    const v = new Ajv2020({ strict: false });
    expect(v.validate(schema, YAML.parse(yaml)), JSON.stringify(v.errors)).toBe(true);
    expect(warnings.filter(w => w === 'field without a name in "Orders" — not exported').length).toBeGreaterThan(0);
    expect(YAML.parse(yaml).datasets[0].primary_key).toEqual(["id"]);
  });
});
