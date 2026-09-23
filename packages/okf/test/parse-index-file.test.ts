import { describe, it, expect } from "vitest";
import { parseBundle, isBundleIndex } from "../src/parse";

const mart = (title: string, joins = "") => `---
type: "OWOX Data Mart"
title: "${title}"
---

# ${title}

# Schema

| Column | Type | Description |
|--------|------|-------------|
| \`id\` | STRING | PK. ${title} id |
${joins}`;

describe("bundle index detection", () => {
  it("parses a mart whose file name merely ends in 'index' (initiate-index.md)", () => {
    const g = parseBundle({
      "seo/index.md": "---\ntype: index\ntitle: SEO\n---\n\n# SEO\n",
      "seo/pages.md": mart("Pages", "\n## Joins\n- [Initiate Index](./initiate-index.md) — `id = id`\n"),
      "seo/initiate-index.md": mart("Initiate Index"),
    });
    expect(g.nodes.map(n => n.key).sort()).toEqual(["initiate-index", "pages"]);
    expect(g.edges).toHaveLength(1);
    expect(g.edges[0]).toMatchObject({ from: "pages", to: "initiate-index" });
  });

  it("matches only a file named exactly index.md", () => {
    expect(isBundleIndex("index.md")).toBe(true);
    expect(isBundleIndex("seo/index.md")).toBe(true);
    expect(isBundleIndex("seo/INDEX.md")).toBe(true);
    expect(isBundleIndex("seo/initiate-index.md")).toBe(false);
    expect(isBundleIndex("seo/reindex.md")).toBe(false);
    expect(isBundleIndex("seo/index.md.bak")).toBe(false);
  });
});
