import { describe, it, expect } from "vitest";
import { parseBundle } from "../src/parse";
import { loadBundle } from "./fixtures-loader";

// Fixtures are verbatim copies of Google's OKF v0.2 output (July 2026):
// `crypto_bitcoin_v02/tables` from the regenerated public bundle, and
// `acme_retail/tables/orders.md` from the spec's reference bundle.

describe("OKF v0.2 — frontmatter with sequences", () => {
  it("keeps the document's own title when sources[] carries titles of its own", () => {
    const g = parseBundle(loadBundle("crypto_bitcoin_v02"));
    const titles = Object.fromEntries(g.nodes.map(n => [n.key, n.title]));
    expect(titles).toEqual({
      blocks: "Bitcoin Blocks Table",
      inputs: "Bitcoin Transaction Inputs",
    });
  });

  it("keeps the document's own description alongside sources[] and generated", () => {
    const g = parseBundle(loadBundle("acme_retail"));
    const orders = g.nodes.find(n => n.key === "orders")!;
    expect(orders.title).toBe("Customer Orders");
    expect(orders.description).toMatch(/^One row per completed customer order/);
  });
});

describe("OKF v0.2 — schema tables", () => {
  it("reads Field Name | Type | Mode | Description without a phantom header field", () => {
    const g = parseBundle(loadBundle("crypto_bitcoin_v02"));
    const blocks = g.nodes.find(n => n.key === "blocks")!;
    expect(blocks.schema.map(f => f.name)).not.toContain("Field Name");
    const hash = blocks.schema.find(f => f.name === "hash");
    expect(hash).toBeDefined();
    expect(hash!.type).toBe("STRING");
    // The Mode column must not be mistaken for the description.
    expect(hash!.description).toBe("Unique block hash that identifies the block.");
    expect(blocks.schema.some(f => f.description === "REQUIRED" || f.description === "NULLABLE")).toBe(false);
  });

  it("strips the bold markers generators wrap field names in", () => {
    const g = parseBundle(loadBundle("crypto_bitcoin_v02"));
    for (const n of g.nodes) {
      expect(n.schema.every(f => !f.name.includes("*"))).toBe(true);
      expect(n.schema.every(f => !f.name.includes("`"))).toBe(true);
    }
  });

  it("still reads the canonical Column | Type | Description form", () => {
    const g = parseBundle(loadBundle("acme_retail"));
    const orders = g.nodes.find(n => n.key === "orders")!;
    const byName = Object.fromEntries(orders.schema.map(f => [f.name, f]));
    expect(orders.schema).toHaveLength(11);
    expect(byName.order_id.type).toBe("STRING");
    expect(byName.order_ts.type).toBe("TIMESTAMP");
    expect(byName.order_id.description).toMatch(/^Globally unique order id/);
  });
});
