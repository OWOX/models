import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBundle, serializeBundle } from "../src/index";

const BUNDLES = fileURLToPath(new URL("../../../bundles", import.meta.url));
function load(folder: string): Record<string, string> {
  const dir = join(BUNDLES, folder);
  return Object.fromEntries(readdirSync(dir).filter(f => f.endsWith(".md")).map(f => [`${folder}/${f}`, readFileSync(join(dir, f), "utf8")]));
}

const mart = (title: string, cols: string[], joins = "") =>
  `---\ntype: "OWOX Data Mart"\ntitle: "${title}"\n---\n\n# ${title}\n\n# Schema\n\n| Column | Type | Description |\n|--|--|--|\n` +
  cols.map(c => `| \`${c}\` | STRING | |`).join("\n") + "\n\n" + (joins ? `## Joins\n\n${joins}\n` : "");

const pair = (joinLines: string) => ({
  "m/lines.md": mart("Lines", ["a", "b", "order_id"], joinLines),
  "m/orders.md": mart("Orders", ["a", "b", "order_id"]),
});

describe("okf join description written inline after the join", () => {
  it("reads the description of a gallery bundle's join", () => {
    const g = parseBundle(load("e-commerce"));
    const key = (title: string) => g.nodes.find(n => n.title === title)!.key;
    const edge = (a: string, b: string) => g.edges.find(e => e.from === key(a) && e.to === key(b))!;
    expect(edge("Purchases", "Products").description).toBe("The product sold on this line.");
    // Orders ↔ Purchases is written on both marts and merges into one bidirectional
    // edge, oriented by the first file read (orders.md): its line gives the description.
    const orders = edge("Orders", "Purchases");
    expect(orders.bidirectional).toBe(true);
    expect(orders.keys).toEqual([{ left: "order_id", right: "order_id" }]);
    expect(orders.description).toBe("The lines this order is made of.");
    expect(g.edges.every(e => e.description)).toBe(true);
  });

  it("keeps the description through a parse → serialize → parse round trip", () => {
    const g = parseBundle(load("e-commerce"));
    const back = parseBundle(serializeBundle(g, "Shop").files);
    const descs = (x: typeof g) => x.edges.map(e => `${e.from}>${e.to}:${e.description ?? ""}`).sort();
    expect(descs(back)).toEqual(descs(g));
    expect(back.edges.some(e => e.description === "The product sold on this line.")).toBe(true);
  });

  it("still reads a `- Description:` sub-bullet, and it wins over inline text", () => {
    const old = parseBundle(pair("- [Orders](./orders.md) — `order_id = order_id` [N:1]\n  - Description: From the sub-bullet"));
    expect(old.edges[0].description).toBe("From the sub-bullet");
    const both = parseBundle(pair("- [Orders](./orders.md) — `order_id = order_id` [N:1] — Inline text\n  - Description: From the sub-bullet"));
    expect(both.edges[0].description).toBe("From the sub-bullet");
  });

  it("keeps a description that contains a dash, `and` or a quoted key whole", () => {
    const text = "The order — not the cart — and its `x = y` totals";
    const g = parseBundle(pair(`- [Orders](./orders.md) — \`order_id = order_id\` [N:1] — ${text}`));
    expect(g.edges[0].keys).toEqual([{ left: "order_id", right: "order_id" }]);
    expect(g.edges[0].description).toBe(text);
  });

  it("splits a composite join into its keys and the description", () => {
    const g = parseBundle(pair("- [Orders](./orders.md) — `a = a`, `b = b` [N:1] — text"));
    expect(g.edges[0].keys).toEqual([{ left: "a", right: "a" }, { left: "b", right: "b" }]);
    expect(g.edges[0].description).toBe("text");
  });

  it("reads the description after the last key when there is no cardinality", () => {
    const g = parseBundle(pair("- [Orders](./orders.md) — `order_id = order_id` — The order, joined on `x = y`"));
    expect(g.edges[0].keys).toEqual([{ left: "order_id", right: "order_id" }]);
    expect(g.edges[0].description).toBe("The order, joined on `x = y`");
  });

  it("gives no description to a join line without keys or cardinality", () => {
    const g = parseBundle(pair("- [Orders](./orders.md) — The order this line belongs to."));
    expect(g.edges[0].description).toBeUndefined();
  });

  it("ignores nested join bullets under a join", () => {
    const g = parseBundle(pair(
      "- [Orders](./orders.md) — `order_id = order_id` [N:1] — The order.\n" +
      "  - [Orders Lines](./lines.md) — A transitive hop.\n" +
      "    - [Orders Lines Orders](./orders.md) — Deeper still."));
    expect(g.edges).toHaveLength(1);
    expect(g.edges[0].description).toBe("The order.");
  });

  it("writes the description inline on one line, without a sub-bullet", () => {
    const g = parseBundle(pair("- [Orders](./orders.md) — `order_id = order_id` [N:1]\n  - Description: Line one\n  "));
    g.edges[0].description = "Line one\nline two";
    const files = serializeBundle(g, "M").files;
    expect(files["m/lines.md"]).toContain("- [Orders](./orders.md) — `order_id = order_id` [N:1] — Line one line two\n");
    expect(files["m/lines.md"]).not.toContain("Description:");
    expect(parseBundle(files).edges[0].description).toBe("Line one line two");
  });

  it("round-trips the description of a join without keys or cardinality", () => {
    const g = parseBundle(pair("- [Orders](./orders.md) — `order_id = order_id`"));
    g.edges[0] = { ...g.edges[0], keys: [], description: "Modelled, keys not picked yet" };
    expect(parseBundle(serializeBundle(g, "M").files).edges[0].description).toBe("Modelled, keys not picked yet");
  });
});
