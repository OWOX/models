import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBundle } from "../src/parse";
import { serializeBundle } from "../src/serialize";
import YAML from "yaml";
import { serializeOssie, parseOssie } from "../src/ossie";
import { edgeJoinAliases } from "../src/joins";
import type { ModelEdge, ModelGraph } from "../src/types";

// Four marts of the QuickBooks Online bundle (OWOX/models#124): Bill payments joins
// Accounts three times, Transfers twice, and Accounts joins itself (parent account).
const FIXTURE = fileURLToPath(new URL("./fixtures/quickbooks-parallel", import.meta.url));
function loadQuickBooks(): Record<string, string> {
  return Object.fromEntries(readdirSync(FIXTURE).map(f => [`quickbooks/${f}`, readFileSync(join(FIXTURE, f), "utf8")]));
}

const keyStr = (e: ModelEdge) => e.keys.map(k => `${k.left}=${k.right}`).join(",");
const between = (g: ModelGraph, from: string, to: string) => g.edges.filter(e => e.from === from && e.to === to);

const mart = (title: string, slug: string, schema: string, joins: string[]) => [`${slug}.md`, `---
type: "OWOX Data Mart"
title: "${title}"
---

# ${title}

# Schema

| Column | Type | Description |
|--------|------|-------------|
${schema}

## Joins

${joins.join("\n")}
`] as const;

const orders = (joins: string[]) => mart("Orders", "orders",
  "| `id` | STRING | PK. |\n| `customer_id` | STRING | |\n| `referrer_id` | STRING | |", joins);
const customers = (joins: string[]) => mart("Customers", "customers",
  "| `id` | STRING | PK. |\n| `last_order_id` | STRING | |", joins);

describe("parallel joins between one pair of marts", () => {
  it("keeps every QuickBooks join line as its own edge and marks none bidirectional", () => {
    const g = parseBundle(loadQuickBooks());
    // bill-payments: 3 × accounts + company info (vendors is not in the fixture);
    // accounts: company info + itself; transfers: 2 × accounts + company info.
    expect(g.edges).toHaveLength(9);
    expect(g.edges.filter(e => e.bidirectional)).toHaveLength(0);
    expect(between(g, "bill-payments", "accounts").map(keyStr)).toEqual([
      "ap_account_id=id,realm_id=realm_id",
      "check_bank_account_id=id,realm_id=realm_id",
      "credit_card_account_id=id,realm_id=realm_id",
    ]);
    expect(between(g, "transfers", "accounts").map(keyStr)).toEqual([
      "from_account_id=id,realm_id=realm_id",
      "to_account_id=id,realm_id=realm_id",
    ]);
    expect(between(g, "accounts", "accounts").map(keyStr)).toEqual(["parent_id=id,realm_id=realm_id"]);
  });

  it("merges a reverse line into ↔ only when its keys mirror the forward line", () => {
    const mirrored = parseBundle(Object.fromEntries([
      orders(["- [Customers](./customers.md) — `customer_id = id` [N:1]"]),
      customers(["- [Orders](./orders.md) — `id = customer_id` [1:N]"]),
    ]));
    expect(mirrored.edges).toHaveLength(1);
    expect(mirrored.edges[0]).toMatchObject({ from: "orders", to: "customers", bidirectional: true });

    const keyless = parseBundle(Object.fromEntries([
      orders(["- [Customers](./customers.md) — `customer_id = id` [N:1]"]),
      customers(["- [Orders](./orders.md) [1:N]"]),
    ]));
    expect(keyless.edges).toHaveLength(1);
    expect(keyless.edges[0].bidirectional).toBe(true);

    const other = parseBundle(Object.fromEntries([
      orders(["- [Customers](./customers.md) — `customer_id = id` [N:1]"]),
      customers(["- [Orders](./orders.md) — `last_order_id = id` [N:1]"]),
    ]));
    expect(other.edges).toHaveLength(2);
    expect(other.edges.some(e => e.bidirectional)).toBe(false);
  });

  it("reads a second same-direction line with other keys as a separate edge, and drops an exact duplicate", () => {
    const g = parseBundle(Object.fromEntries([
      orders([
        "- [Customers](./customers.md) — `customer_id = id` [N:1]",
        "- [Customers](./customers.md) — `referrer_id = id` [N:1]",
        "- [Customers](./customers.md) — `customer_id = id` [N:1]",
      ]),
      customers([]),
    ]));
    expect(g.edges.map(keyStr)).toEqual(["customer_id=id", "referrer_id=id"]);
    expect(g.edges.some(e => e.bidirectional)).toBe(false);
  });

  it("reads join keys only before the cardinality marker, or before the description dash", () => {
    const g = parseBundle(Object.fromEntries([
      orders([
        "- [Customers](./customers.md) — `customer_id = id` [N:1] — same as `referrer_id = id` on old rows",
        "- [Customers](./customers.md) — `referrer_id = id` — not `customer_id = id`",
      ]),
      customers([]),
    ]));
    expect(g.edges.map(keyStr)).toEqual(["customer_id=id", "referrer_id=id"]);
  });

  it("keeps a self-join through serialize and parse", () => {
    const g = parseBundle(loadQuickBooks());
    const back = parseBundle(serializeBundle(g, "QuickBooks").files);
    const self = back.edges.filter(e => e.from === e.to);
    expect(self).toHaveLength(1);
    expect(self[0].bidirectional).toBe(false);
    expect(back.edges).toHaveLength(9);
  });
});

describe("join aliases of parallel edges", () => {
  it("keeps the default alias on the first edge and derives the rest from the FK column", () => {
    const g = parseBundle(loadQuickBooks());
    const aliases = edgeJoinAliases(g.nodes, g.edges);
    const fwd = (from: string, to: string) => between(g, from, to).map(e => aliases.get(e.id)!.forward);
    expect(fwd("bill-payments", "accounts")).toEqual(["accounts", "check_bank_account", "credit_card_account"]);
    expect(fwd("transfers", "accounts")).toEqual(["accounts", "to_account"]);
    expect(fwd("bill-payments", "company-info")).toEqual(["company_info"]);
    expect(fwd("accounts", "accounts")).toEqual(["accounts"]);
  });

  it("lets an explicit alias win, and moves an implicit edge off an alias it would collide with", () => {
    const g = parseBundle(Object.fromEntries([
      orders([
        "- [Customers](./customers.md) — `customer_id = id` [N:1]",
        "- [Customers](./customers.md) as `customers` — `referrer_id = id` [N:1]",
      ]),
      customers([]),
    ]));
    const aliases = edgeJoinAliases(g.nodes, g.edges);
    expect(g.edges.map(e => aliases.get(e.id)!.forward)).toEqual(["customer", "customers"]);
  });

  it("writes derived aliases into OKF so they survive a round trip unchanged", () => {
    const g = parseBundle(loadQuickBooks());
    const files = serializeBundle(g, "QuickBooks").files;
    const bp = Object.entries(files).find(([p]) => p.endsWith("/bill-payments.md"))![1];
    expect(bp).toContain("as `check_bank_account`");
    expect(bp).toContain("as `credit_card_account`");
    expect(bp).not.toContain("as `accounts`");
    const back = parseBundle(files);
    const a1 = edgeJoinAliases(g.nodes, g.edges), a2 = edgeJoinAliases(back.nodes, back.edges);
    const sig = (gr: ModelGraph, a: typeof a1) => gr.edges.map(e => `${e.from}>${e.to}[${keyStr(e)}] ${a.get(e.id)!.forward}`).sort();
    expect(sig(back, a2)).toEqual(sig(g, a1));
  });

  it("keeps parallel edges and their aliases through an Ossie round trip", () => {
    const g = parseBundle(loadQuickBooks());
    const { yaml } = serializeOssie(g, "QuickBooks");
    const names = (YAML.parse(yaml).relationships ?? []).map((r: { name: string }) => r.name);
    expect(names).toHaveLength(9);
    expect(new Set(names).size).toBe(names.length);
    const back = parseOssie(yaml).graph;
    expect(back.edges).toHaveLength(9);
    const aliases = edgeJoinAliases(back.nodes, back.edges);
    const bp = back.nodes.find(n => n.title === "Bill payments")!.key;
    const acc = back.nodes.find(n => n.title === "Accounts")!.key;
    expect(between(back, bp, acc).map(e => aliases.get(e.id)!.forward))
      .toEqual(["accounts", "check_bank_account", "credit_card_account"]);
  });

  it("resolves a metric reading a second parallel join to that join's dataset in Ossie", () => {
    const g = parseBundle(loadQuickBooks());
    const bp = g.nodes.find(n => n.key === "bill-payments")!;
    bp.schema.push({ name: "check_bank_count", type: "INTEGER", pk: false, formula: "COUNT(DISTINCT check_bank_account.id)" });
    const doc = YAML.parse(serializeOssie(g, "QuickBooks").yaml);
    const m = (doc.metrics ?? []).find((x: { name: string }) => x.name === "check_bank_count");
    expect(m.expression.dialects[0].expression).toBe("COUNT(DISTINCT accounts.id)");
  });
});
