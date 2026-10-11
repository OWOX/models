import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import YAML from "yaml";
import { parseOssie, serializeOssie } from "../src/ossie";
import { ossieDialectForStorage, pickExpression } from "../src/index";
import type { ModelGraph } from "../src/types";

const tpcds = readFileSync(new URL("./fixtures/ossie/tpcds_semantic_model.yaml", import.meta.url), "utf8");

// Every expression of a document, keyed by where it lives.
function expressions(doc: any): Map<string, unknown> {
  const out = new Map<string, unknown>();
  const root = Array.isArray(doc.semantic_model) ? doc.semantic_model[0] : doc;
  for (const ds of root.datasets ?? []) for (const f of ds.fields ?? []) out.set(`${ds.name}.${f.name}`, f.expression.dialects);
  for (const m of root.metrics ?? []) out.set(`metric ${m.name}`, m.expression.dialects);
  return out;
}

const multi = `version: 0.2.0.dev0
name: m
datasets:
  - name: orders
    source: p.d.orders
    fields:
      - name: id
        expression: { dialects: [{ dialect: ANSI_SQL, expression: id }] }
      - name: amount
        expression: { dialects: [{ dialect: ANSI_SQL, expression: amount }] }
      - name: full
        expression:
          dialects:
            - { dialect: BIGQUERY, expression: "CONCAT(id, '-', amount)" }
            - { dialect: ANSI_SQL, expression: "id || '-' || amount" }
            - { dialect: SNOWFLAKE, expression: "id || '-' || amount" }
metrics:
  - name: revenue
    expression:
      dialects:
        - { dialect: ANSI_SQL, expression: "SUM(orders.amount)" }
        - { dialect: DAX, expression: "SUM(orders[amount])" }
`;

describe("ossieDialectForStorage", () => {
  it("maps OWOX storage types to Ossie dialects, ANSI_SQL otherwise", () => {
    expect(ossieDialectForStorage("GOOGLE_BIGQUERY")).toBe("BIGQUERY");
    expect(ossieDialectForStorage("LEGACY_GOOGLE_BIGQUERY")).toBe("BIGQUERY");
    expect(ossieDialectForStorage("SNOWFLAKE")).toBe("SNOWFLAKE");
    expect(ossieDialectForStorage("DATABRICKS")).toBe("DATABRICKS");
    expect(ossieDialectForStorage("AWS_REDSHIFT")).toBe("ANSI_SQL");
    expect(ossieDialectForStorage("AWS_ATHENA")).toBe("ANSI_SQL");
    expect(ossieDialectForStorage(undefined)).toBe("ANSI_SQL");
  });
});

describe("pickExpression dialect preference", () => {
  const e = { dialects: [{ dialect: "BIGQUERY", expression: "b" }, { dialect: "ANSI_SQL", expression: "a" }, { dialect: "SNOWFLAKE", expression: "s" }] };
  it("takes the storage dialect, then ANSI_SQL, then the first entry", () => {
    expect(pickExpression(e, "SNOWFLAKE")).toBe("s");
    expect(pickExpression(e, "DATABRICKS")).toBe("a");
    expect(pickExpression(e)).toBe("a");
    expect(pickExpression({ dialects: [{ dialect: "DAX", expression: "d" }, { dialect: "MDX", expression: "m" }] })).toBe("d");
  });
});

describe("Ossie dialects survive a round trip", () => {
  it("TPC-DS keeps every ANSI_SQL label and expression", () => {
    const before = expressions(YAML.parse(tpcds));
    const after = expressions(YAML.parse(serializeOssie(parseOssie(tpcds).graph, "tpcds").yaml));
    expect(before.size).toBeGreaterThan(20);
    for (const [where, dialects] of before) expect(after.get(where), where).toEqual(dialects);
  });
  it("keeps every dialect of a multi-dialect field and metric, whatever the storage", () => {
    const g = parseOssie(multi).graph;
    for (const dialect of [undefined, "BIGQUERY", "SNOWFLAKE"]) {
      const { yaml, warnings } = serializeOssie(g, "m", { dialect });
      const out = expressions(YAML.parse(yaml));
      const src = expressions(YAML.parse(multi));
      expect(out.get("orders.full")).toEqual(src.get("orders.full"));
      expect(out.get("metric revenue")).toEqual(src.get("metric revenue"));
      expect(warnings.filter(w => /dropped/.test(w))).toEqual([]);
    }
  });
  it("shows and pushes the storage dialect's text", () => {
    const full = (d?: string) => parseOssie(multi, { dialect: d }).graph.nodes[0].schema.find(f => f.name === "full")!.formula;
    expect(full("BIGQUERY")).toBe("CONCAT(id, '-', amount)");
    expect(full("SNOWFLAKE")).toBe("id || '-' || amount");
    expect(full()).toBe("id || '-' || amount");
  });
});

describe("Ossie dialect labels for new and edited expressions", () => {
  const edit = (g: ModelGraph, field: string, formula: string): ModelGraph => ({
    ...g,
    nodes: g.nodes.map(n => ({ ...n, schema: n.schema.map(f => (f.name === field ? { ...f, formula } : f)) })),
  });
  it("labels an edited formula with the storage dialect and says which dialects were dropped", () => {
    const g = edit(parseOssie(multi).graph, "full", "id || '/' || amount");
    const { yaml, warnings } = serializeOssie(g, "m", { dialect: "SNOWFLAKE" });
    expect(expressions(YAML.parse(yaml)).get("orders.full")).toEqual([{ dialect: "SNOWFLAKE", expression: "id || '/' || amount" }]);
    expect(warnings).toContain('"orders.full": the formula changed since import — its BIGQUERY, ANSI_SQL expressions were dropped');
  });
  it("labels a new canvas formula ANSI_SQL without a storage, else the storage dialect", () => {
    const g: ModelGraph = { storageId: null, nodes: [{ key: "t", title: "t", inputSource: "TABLE", definition: "p.d.t", schema: [{ name: "a", type: "STRING", pk: false }, { name: "b", type: "STRING", pk: false, formula: "UPPER(a)" }], position: { x: 0, y: 0 }, status: "pending", owoxId: null }], edges: [] };
    const label = (dialect?: string) => expressions(YAML.parse(serializeOssie(g, "m", { dialect }).yaml)).get("t.b");
    expect(label()).toEqual([{ dialect: "ANSI_SQL", expression: "UPPER(a)" }]);
    expect(label("BIGQUERY")).toEqual([{ dialect: "BIGQUERY", expression: "UPPER(a)" }]);
    expect(serializeOssie(g, "m").warnings.filter(w => /dropped/.test(w))).toEqual([]);
  });
  it("drops stale dialects after a mart rename instead of writing the old dataset name", () => {
    const g = parseOssie(multi).graph;
    const renamed: ModelGraph = { ...g, nodes: g.nodes.map(n => ({ ...n, title: "Sales" })) };
    const { yaml } = serializeOssie(renamed, "m");
    expect(expressions(YAML.parse(yaml)).get("metric revenue")).toEqual([{ dialect: "ANSI_SQL", expression: "SUM(sales.amount)" }]);
  });
  it("keeps the original dialects of a plain column until it is renamed", () => {
    const g = parseOssie(multi).graph;
    const renamed: ModelGraph = { ...g, nodes: g.nodes.map(n => ({ ...n, schema: n.schema.map(f => (f.name === "id" ? { ...f, name: "order_id" } : f)) })) };
    const out = expressions(YAML.parse(serializeOssie(renamed, "m", { dialect: "BIGQUERY" }).yaml));
    expect(out.get("orders.amount")).toEqual([{ dialect: "ANSI_SQL", expression: "amount" }]);
    expect(out.get("orders.order_id")).toEqual([{ dialect: "BIGQUERY", expression: "order_id" }]);
  });
});
