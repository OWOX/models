import { describe, it, expect } from "vitest";
import { slugify, parseFrontmatter, renderFrontmatter } from "../src/slug";

describe("slugify", () => {
  it("kebab-cases titles", () => expect(slugify("Facebook Ads Insights")).toBe("facebook-ads-insights"));
  it("falls back when empty", () => expect(slugify("", "n1")).toBe("n1"));
});
describe("frontmatter", () => {
  it("round-trips scalars, lists and nested owox block", () => {
    const fm = { type: "OWOX Data Mart", title: "A", tags: ["owox", "sql"],
      owox: { key: "a", inputSource: "SQL", position: { x: 1, y: 2 } } };
    const text = renderFrontmatter(fm);
    expect(parseFrontmatter("---\n" + text + "\n---\nbody").data).toEqual(fm);
  });
});
describe("block scalars", () => {
  it("parses a literal (|) block, preserving newlines and stripping base indent", () => {
    const src = [
      "description: |",
      "  Line one.",
      "  Line two.",
      'tags: ["owox"]',
    ].join("\n");
    const { data } = parseFrontmatter("---\n" + src + "\n---\nbody");
    expect(data.description).toBe("Line one.\nLine two.");
    expect(data.tags).toEqual(["owox"]);
  });

  it("parses a folded (>) block, joining lines with a single space", () => {
    const src = [
      "description: >",
      "  Line one.",
      "  Line two.",
    ].join("\n");
    const { data } = parseFrontmatter("---\n" + src + "\n---\nbody");
    expect(data.description).toBe("Line one. Line two.");
  });

  it("preserves a colon inside block-scalar content instead of parsing it as a key", () => {
    const src = [
      "description: |",
      "  Status: active",
      "  more text",
      "tags: [1]",
    ].join("\n");
    const { data } = parseFrontmatter("---\n" + src + "\n---\nbody");
    expect(data.description).toBe("Status: active\nmore text");
    expect(data.tags).toEqual([1]);
  });

  it("supports the strip chomping indicator (|-)", () => {
    const src = [
      "description: |-",
      "  Line one.",
      "  Line two.",
    ].join("\n");
    const { data } = parseFrontmatter("---\n" + src + "\n---\nbody");
    expect(data.description).toBe("Line one.\nLine two.");
  });

  it("still parses an existing single-line quoted description", () => {
    const { data } = parseFrontmatter('---\ndescription: "hello"\n---\nbody');
    expect(data.description).toBe("hello");
  });

  it("preserves extra indentation beyond the base indent", () => {
    const src = [
      "description: |",
      "  Line one.",
      "    Extra indented.",
      "  Line two.",
      'tags: ["owox"]',
    ].join("\n");
    const { data } = parseFrontmatter("---\n" + src + "\n---\nbody");
    expect(data.description).toBe("Line one.\n  Extra indented.\nLine two.");
    expect(data.tags).toEqual(["owox"]);
  });

  it("preserves an interior blank line inside the block", () => {
    const src = [
      "description: |",
      "  Line one.",
      "",
      "  Line three.",
      'tags: ["owox"]',
    ].join("\n");
    const { data } = parseFrontmatter("---\n" + src + "\n---\nbody");
    expect(data.description).toBe("Line one.\n\nLine three.");
  });
});

describe("block scalar serialization", () => {
  it("renders a multi-line string as a literal block scalar", () => {
    const text = renderFrontmatter({ description: "Line one.\nLine two." });
    expect(text).toBe("description: |\n  Line one.\n  Line two.");
  });

  it("round-trips an object containing a multi-line description", () => {
    const original = {
      type: "OWOX Data Mart",
      title: "A",
      description: "Line one.\nLine two.",
      tags: ["owox"],
    };
    const text = renderFrontmatter(original);
    const { data } = parseFrontmatter("---\n" + text + "\n---\nbody");
    expect(data).toEqual(original);
  });

  it("still quotes a single-line description (unchanged regression)", () => {
    const text = renderFrontmatter({ description: "single line" });
    expect(text).toBe('description: "single line"');
  });
});
