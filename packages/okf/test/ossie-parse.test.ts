import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseOssie } from "../src/index";
const tpcds = readFileSync(new URL("./fixtures/ossie/tpcds_semantic_model.yaml", import.meta.url), "utf8");

describe("parseOssie — TPC-DS", () => {
  const r = parseOssie(tpcds);
  const node = (k: string) => r.graph.nodes.find(n => n.key === k)!;
  it("reads datasets, fields, PKs and relationships", () => {
    expect(r.graph.nodes.map(n => n.key)).toEqual(["store_sales", "date_dim", "customer", "item", "store"]);
    expect(node("store_sales").schema.filter(f => f.pk).map(f => f.name)).toEqual(["ss_item_sk", "ss_ticket_number"]);
    expect(r.graph.edges).toHaveLength(4);
    expect(r.graph.edges[0]).toMatchObject({ from: "store_sales", to: "date_dim", keys: [{ left: "ss_sold_date_sk", right: "d_date_sk" }], cardinality: "N:1" });
  });
  it("imports relationship ai_context as the edge description", () => {
    expect(r.graph.edges).toHaveLength(4);
    for (const e of r.graph.edges) expect(e.description).toMatch(/^Synonyms:/);
  });
  it("turns the computed field into a calculated column", () => {
    expect(node("customer").schema.find(f => f.name === "customer_full_name")).toMatchObject({ formula: expect.stringContaining("c_first_name"), pk: false });
  });
  it("puts metrics on the fact table with canvas references", () => {
    const calc = node("store_sales").schema.filter(f => f.formula !== undefined);
    expect(calc.map(f => f.name)).toEqual(["total_sales", "total_profit", "customer_lifetime_value", "sales_by_brand", "store_productivity", "cumulative_sales", "brand_rank_in_store", "monthly_sales_change"]);
    expect(calc.find(f => f.name === "customer_lifetime_value")!.formula).toBe("SUM(ss_ext_sales_price) / COUNT(DISTINCT customer.c_customer_sk)");
    expect(calc.find(f => f.name === "total_sales")!.description).toContain("Synonyms: total revenue");
  });
  it("lists what it could not import and warns about window functions", () => {
    expect(r.notImported).toEqual(expect.arrayContaining([
      "model description / AI context",
      "custom extensions: SALESFORCE, DBT",
    ]));
    expect(r.notImported.filter(x => x.startsWith("relationship"))).toEqual([]);
    expect(r.warnings.filter(w => w.includes("window functions"))).toHaveLength(3);
    expect(r.name).toBe("tpcds_retail_model");
  });
});

describe("parseOssie — shapes and edge cases", () => {
  const flat = `version: 0.2.0.dev0\nname: m\ndatasets:\n  - name: orders\n    source: p.d.orders\n    fields:\n      - name: id\n        expression: { dialects: [{ dialect: ANSI_SQL, expression: id }] }\nmetrics:\n  - name: n\n    expression: { dialects: [{ dialect: ANSI_SQL, expression: "COUNT(*)" }] }\n`;
  it("accepts the legacy semantic_model wrapper and JSON", () => {
    const legacy = `semantic_model:\n  - name: a\n    datasets: [{ name: t, source: x }]\n  - name: b\n    datasets: [{ name: u, source: y }]\n`;
    const r = parseOssie(legacy);
    expect(r.graph.nodes.map(n => n.key)).toEqual(["t"]);
    expect(r.notImported).toContain("1 more model in this file wasn't imported");
    expect(parseOssie(JSON.stringify({ version: "0.2.0.dev0", name: "j", datasets: [{ name: "t", source: "x" }] })).graph.nodes).toHaveLength(1);
  });
  it("skips a metric that reads no dataset instead of crashing", () => {
    const r = parseOssie(flat);
    expect(r.notImported).toContain('metric "n": reads no dataset');
    expect(r.graph.nodes[0].schema.map(f => f.name)).toEqual(["id"]);
  });
  it("detects SQL sources and errors on non-Ossie input", () => {
    expect(parseOssie(`version: x\nname: m\ndatasets: [{ name: q, source: "SELECT 1" }]`).graph.nodes[0].inputSource).toBe("SQL");
    expect(() => parseOssie("foo: bar")).toThrow("This file isn't an Ossie model");
    expect(() => parseOssie("datasets: [")).toThrow(/Couldn't read this Ossie file/);
  });
});

describe("parseOssie — malformed but parseable input", () => {
  const ok = (o: unknown) => parseOssie(JSON.stringify(o));
  const ds = { name: "t", source: "x" };
  it("skips non-object and unnamed entries", () => {
    expect(ok({ datasets: [null, ds, { source: "y" }] }).graph.nodes.map(n => n.key)).toEqual(["t"]);
    expect(ok({ datasets: [null, { source: "y" }] }).notImported).toContain("dataset without a name");
    expect(ok({ datasets: [{ ...ds, fields: [null, { expression: 5 }] }] }).graph.nodes[0].schema).toEqual([]);
    expect(ok({ datasets: [ds], metrics: [null, { expression: {} }] }).notImported).toContain("metric without a name");
    expect(ok({ datasets: [ds], relationships: [null, { from: "t" }] }).notImported).toContain("relationship without a name");
    expect(() => ok({ semantic_model: [null] })).toThrow("This file isn't an Ossie model");
  });
  it("treats non-array collections as empty", () => {
    const r = ok({ datasets: [{ ...ds, fields: { a: 1 }, unique_keys: "k", custom_extensions: "foo" }], relationships: { a: 1 }, metrics: "m", custom_extensions: 3 });
    expect(r.graph.nodes[0].schema).toEqual([]);
    expect(r.graph.edges).toEqual([]);
  });
  it("ignores non-string expressions and bad ai_context", () => {
    const f = { name: "a", expression: { dialects: [{ dialect: "X", expression: 5 }] }, ai_context: { synonyms: "foo", instructions: 3 }, description: "d" };
    const r = ok({ datasets: [{ ...ds, fields: [f] }] });
    expect(r.graph.nodes[0].schema[0]).toMatchObject({ name: "a", description: "d" });
    expect(r.graph.nodes[0].schema[0].formula).toBeUndefined();
    expect(r.notImported).toContain('field "t.a": no expression');
  });
  it("does not split a string primary_key into characters", () => {
    const r = ok({ datasets: [{ ...ds, primary_key: "id" }] });
    expect(r.graph.nodes[0].schema).toEqual([]);
  });
  it("drops the extra key of unequal relationship columns", () => {
    const r = ok({ datasets: [ds, { name: "u", source: "y" }], relationships: [{ name: "r", from: "t", to: "u", from_columns: ["a", "b"], to_columns: ["c"] }] });
    expect(r.graph.edges[0].keys).toEqual([{ left: "a", right: "c" }]);
  });
});
