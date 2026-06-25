import { describe, it, expect } from "vitest";
import { parseBundle } from "../src/parse";
import { loadBundle } from "./fixtures-loader";

describe("Google OKF v0.1 — marts", () => {
  it("ingests only BigQuery Table docs from GA4, mapping type to inputSource", () => {
    const g = parseBundle(loadBundle("ga4"));
    expect(g.nodes.map(n => n.key)).toEqual(["events_"]);
    expect(g.nodes[0].inputSource).toBe("TABLE");
  });

  it("ingests all four Bitcoin tables and no dataset docs", () => {
    const g = parseBundle(loadBundle("crypto_bitcoin"));
    expect(g.nodes.map(n => n.key).sort()).toEqual(["blocks", "inputs", "outputs", "transactions"]);
  });

  it("filters Stack Overflow's 32 reference lookup docs, keeping 16 tables", () => {
    const g = parseBundle(loadBundle("stackoverflow"));
    expect(g.nodes).toHaveLength(16);
    expect(g.nodes.map(n => n.key)).toContain("users");
    expect(g.nodes.map(n => n.key)).not.toContain("badge_classes");
  });
});

describe("Google OKF v0.1 — bullet schema", () => {
  const field = (g: ReturnType<typeof parseBundle>, key: string, name: string) =>
    g.nodes.find(n => n.key === key)!.schema.find(f => f.name === name);

  it("parses GA4 paren-type fields (- `name` (TYPE): desc)", () => {
    const g = parseBundle(loadBundle("ga4"));
    expect(field(g, "events_", "event_date")?.type).toBe("STRING");
    expect(field(g, "events_", "event_timestamp")?.type).toBe("INTEGER");
    expect(field(g, "events_", "event_name")?.type).toBe("STRING");
  });

  it("ignores GA4 enum-value rows that are not real fields", () => {
    const g = parseBundle(loadBundle("ga4"));
    const names = g.nodes.find(n => n.key === "events_")!.schema.map(f => f.name);
    expect(names.some(n => n.includes(" ") || n.includes("="))).toBe(false);
  });

  it("parses Bitcoin type-after-colon and bare-type-before-colon styles", () => {
    const g = parseBundle(loadBundle("crypto_bitcoin"));
    // inputs.md: "*   `transaction_hash`: STRING"
    expect(field(g, "inputs", "transaction_hash")?.type).toBe("STRING");
    expect(field(g, "inputs", "value")?.type).toBe("NUMERIC");
    // transactions.md: "- `hash` STRING REQUIRED: The hash of this transaction"
    expect(field(g, "transactions", "hash")?.type).toBe("STRING");
  });

  it("parses Stack Overflow asterisk-marker fields", () => {
    const g = parseBundle(loadBundle("stackoverflow"));
    // users.md: "*   `id` (INTEGER) - Unique identifier for the user."
    expect(field(g, "users", "id")?.type).toBe("INTEGER");
  });
});

describe("join target path normalization", () => {
  it("resolves a strict ## Joins link given a nested relative path", () => {
    const files = {
      "orders.md": [
        "---", 'type: "OWOX Data Mart"', "title: Orders", "---", "",
        "# Orders", "", "## Schema", "", "| Column | Type | Description |",
        "|--------|------|-------------|", "| `customer_id` | STRING | PK. |", "",
        "## Joins", "", "- [Customers](./sub/dir/customers.md) — `customer_id = id`", "",
      ].join("\n"),
      "customers.md": [
        "---", 'type: "OWOX Data Mart"', "title: Customers", "---", "",
        "# Customers", "", "## Schema", "", "| Column | Type | Description |",
        "|--------|------|-------------|", "| `id` | STRING | PK. |", "",
      ].join("\n"),
    };
    const g = parseBundle(files);
    expect(g.edges).toHaveLength(1);
    expect(g.edges[0].keys).toEqual([{ left: "customer_id", right: "id" }]);
  });
});

describe("Google OKF v0.1 — prose joins", () => {
  const edge = (g: ReturnType<typeof parseBundle>, a: string, b: string) =>
    g.edges.find(e => (e.from === a && e.to === b) || (e.from === b && e.to === a));

  it("recovers Bitcoin inputs→transactions with a key and inputs→outputs keyless", () => {
    const g = parseBundle(loadBundle("crypto_bitcoin"));
    const t = edge(g, "inputs", "transactions");
    expect(t).toBeDefined();
    expect(t!.keys.some(k => k.left === "transaction_hash" || k.right === "transaction_hash")).toBe(true);
    const o = edge(g, "inputs", "outputs");
    expect(o).toBeDefined();
    expect(o!.keys).toEqual([]);
  });

  it("recovers Stack Overflow badges→users on user_id and answers↔questions on parent_id", () => {
    const g = parseBundle(loadBundle("stackoverflow"));
    const bu = edge(g, "badges", "users");
    expect(bu).toBeDefined();
    expect(bu!.keys.some(k => k.left === "user_id" || k.right === "user_id")).toBe(true);
    const aq = edge(g, "posts_answers", "posts_questions");
    expect(aq).toBeDefined();
    expect(aq!.keys.some(k => k.left === "parent_id" || k.right === "parent_id")).toBe(true);
  });

  it("does not invent edges for GA4 (its join links point at a non-mart reference file)", () => {
    const g = parseBundle(loadBundle("ga4"));
    expect(g.edges).toHaveLength(0);
  });
});

describe("prose pass never fires on OWOX-format docs", () => {
  it("ignores a relative .md link in an OWOX mart description", () => {
    const files = {
      "orders.md": [
        "---", 'type: "OWOX Data Mart"', "title: Orders", "---", "",
        "# Orders", "", "This table can be joined with the [Customers](./customers.md) table.", "",
        "## Schema", "", "| Column | Type | Description |",
        "|--------|------|-------------|", "| `id` | STRING | PK. |", "",
      ].join("\n"),
      "customers.md": [
        "---", 'type: "OWOX Data Mart"', "title: Customers", "---", "",
        "# Customers", "", "## Schema", "", "| Column | Type | Description |",
        "|--------|------|-------------|", "| `id` | STRING | PK. |", "",
      ].join("\n"),
    };
    const g = parseBundle(files);
    expect(g.edges).toHaveLength(0);
  });
});

describe("Google OKF v0.1 — acceptance", () => {
  it("imports each bundle with marts + fields + no errors", () => {
    for (const name of ["ga4", "crypto_bitcoin", "stackoverflow"]) {
      const g = parseBundle(loadBundle(name));
      expect(g.nodes.length).toBeGreaterThan(0);
      // every mart has at least one parsed field
      expect(g.nodes.every(n => n.schema.length > 0)).toBe(true);
      // edges only ever connect known marts
      const keys = new Set(g.nodes.map(n => n.key));
      expect(g.edges.every(e => keys.has(e.from) && keys.has(e.to))).toBe(true);
    }
  });
});
