import { describe, it, expect } from "vitest";
import { serializeBundle } from "../src/serialize";
import type { ModelGraph } from "../src/types";

const graph: ModelGraph = {
  storageId: null,
  nodes: [
    { key: "orders", title: "Orders", inputSource: "VIEW", status: "pending", owoxId: null,
      position: { x: 0, y: 0 },
      schema: [
        { name: "order_id", type: "STRING", pk: true, description: "Unique order id" },
        { name: "customer_id", type: "INTEGER", pk: false },
      ] },
    { key: "customers", title: "Customers", inputSource: "VIEW", status: "pending", owoxId: null,
      position: { x: 0, y: 0 },
      schema: [{ name: "id", type: "INTEGER", pk: true }] },
  ],
  edges: [{ id: "e1", from: "orders", to: "customers", keys: [{ left: "customer_id", right: "id" }], bidirectional: false }],
};

describe("serializeBundle (OWOX superset)", () => {
  const { files } = serializeBundle(graph, "Demo");
  const index = files["demo/index.md"];
  const orders = files["demo/orders.md"];

  it("writes a folder bundle with index + per-mart files", () => {
    expect(Object.keys(files).sort()).toEqual(["demo/customers.md", "demo/index.md", "demo/orders.md"]);
  });

  it("index uses the OWOX columns", () => {
    expect(index).toContain("| Data Mart | Type | Storage |");
    expect(index).toContain("[Orders](./orders.md) | VIEW |");
  });

  it("mart frontmatter is OWOX-shaped with no owox block", () => {
    expect(orders).toContain(`type: "OWOX Data Mart"`);
    expect(orders).not.toContain("owox:");
    expect(orders).toContain(`tags: ["owox", "view"]`);
  });

  it("has an Overview section", () => {
    expect(orders).toContain("## Overview");
    expect(orders).toContain("- **Definition type:** VIEW");
  });

  it("schema is 3-column with PK token and FK note", () => {
    expect(orders).toContain("# Schema\n\n| Column | Type | Description |");
    expect(orders).toContain("| `order_id` | STRING | PK. Unique order id |");
    expect(orders).toContain("FK to [Customers](./customers.md)");
  });

  it("joins carry the superset key suffix", () => {
    expect(orders).toContain("## Joins");
    expect(orders).toContain("- [Customers](./customers.md) — `customer_id = id`");
  });
});

import { describe as describeCard, it as itCard, expect as expectCard } from "vitest";
import { serializeBundle as serializeCard } from "../src/serialize";
import type { ModelGraph as ModelGraphCard } from "../src/types";

describeCard("serialize cardinality suffix", () => {
  const base = (cardinality: any, bidirectional = false): ModelGraphCard => ({
    storageId: null,
    nodes: [
      { key: "tx", title: "Transactions", inputSource: "TABLE", status: "pending", owoxId: null, position: { x: 0, y: 0 },
        schema: [{ name: "block_hash", type: "STRING", pk: true }] },
      { key: "blocks", title: "Blocks", inputSource: "TABLE", status: "pending", owoxId: null, position: { x: 0, y: 0 },
        schema: [{ name: "hash", type: "STRING", pk: true }] },
    ],
    edges: [{ id: "e1", from: "tx", to: "blocks", keys: [{ left: "block_hash", right: "hash" }], bidirectional, cardinality }],
  });

  itCard("appends [N:1] on the source line", () => {
    const tx = serializeCard(base("N:1"), "Demo").files["demo/transactions.md"];
    expectCard(tx).toContain("- [Blocks](./blocks.md) — `block_hash = hash` [N:1]");
  });

  itCard("flips on the bidirectional mirror line", () => {
    const files = serializeCard(base("N:1", true), "Demo").files;
    expectCard(files["demo/transactions.md"]).toContain("`block_hash = hash` [N:1]");
    // mirror line rendered from Blocks → Transactions carries the flipped value
    expectCard(files["demo/blocks.md"]).toContain("`hash = block_hash` [1:N]");
  });

  itCard("omits the suffix when unspecified", () => {
    const tx = serializeCard(base(undefined), "Demo").files["demo/transactions.md"];
    expectCard(tx).toContain("- [Blocks](./blocks.md) — `block_hash = hash`");
    expectCard(tx).not.toContain("— `block_hash = hash` [");
  });
});
