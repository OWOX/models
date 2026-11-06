import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBundle, slugify, FIELD_TYPES } from "../src/index";

// Every bundle under bundles/sources/<key>/ (written by scripts/okf-source) must
// import cleanly: the canvas fetches index.md, follows its relative .md links and
// hands the files to parseBundle, so that is what is checked here.
const ROOT = fileURLToPath(new URL("../../../bundles/sources", import.meta.url));
const keys = existsSync(ROOT) ? readdirSync(ROOT, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name) : [];

function load(key: string): Record<string, string> {
  const base = join(ROOT, key);
  const out: Record<string, string> = {};
  for (const e of readdirSync(base, { withFileTypes: true })) {
    if (e.isFile() && e.name.endsWith(".md")) out[relative(base, join(base, e.name))] = readFileSync(join(base, e.name), "utf8");
  }
  return out;
}

describe.each(keys)("source bundle %s", key => {
  const files = load(key);
  const graph = parseBundle(files);
  const index = files["index.md"];
  const linked = [...new Set([...index.matchAll(/\]\(\.\/([^)]+\.md)\)/g)].map(m => m[1]).filter(f => f !== "index.md"))];

  it("index.md links every mart document, and only those", () => {
    expect(new Set(linked)).toEqual(new Set(Object.keys(files).filter(f => f !== "index.md")));
  });

  it("every document is read as one mart whose file name is its title's slug", () => {
    expect(graph.nodes).toHaveLength(linked.length);
    for (const n of graph.nodes) expect(files[`${slugify(n.title)}.md`], n.title).toBeDefined();
  });

  it("marks a primary key on every mart, with canonical field types only", () => {
    for (const n of graph.nodes) {
      expect(n.schema.length, n.title).toBeGreaterThan(0);
      expect(n.schema.some(f => f.pk), `${n.title} has no PK`).toBe(true);
      for (const f of n.schema) expect(FIELD_TYPES as readonly string[], `${n.title}.${f.name}`).toContain(f.type);
    }
  });

  it("every join lands on a mart in the bundle and uses fields both sides have", () => {
    expect(graph.edges.length).toBeGreaterThan(0);
    const byKey = new Map(graph.nodes.map(n => [n.key, n]));
    for (const e of graph.edges) {
      const from = byKey.get(e.from)!, to = byKey.get(e.to)!;
      expect(from, e.from).toBeDefined();
      expect(to, e.to).toBeDefined();
      expect(e.keys.length).toBeGreaterThan(0);
      for (const k of e.keys) {
        expect(from.schema.some(f => f.name === k.left), `${from.title}.${k.left}`).toBe(true);
        expect(to.schema.some(f => f.name === k.right), `${to.title}.${k.right}`).toBe(true);
      }
    }
  });

  it("reads every key pair of every join line, composite keys included", () => {
    const written = Object.entries(files).filter(([f]) => f !== "index.md")
      .flatMap(([, t]) => (t.split("\n## Joins")[1] ?? "").split("\n").filter(l => l.startsWith("- [")))
      .map(l => [...l.matchAll(/`([^`=]+) = ([^`]+)`/g)].length);
    expect(graph.edges.map(e => e.keys.length).sort()).toEqual(written.sort());
  });

  it("the preview drawing is of this model: its title counts the same marts and relationships", () => {
    const svg = index.match(/!\[[^\]]*\]\(([^)\s]+\.svg)\)/)?.[1];
    const title = readFileSync(join(ROOT, key, svg!), "utf8").match(/<title[^>]*>([^<]*)<\/title>/)?.[1];
    expect(title).toContain(`${graph.nodes.length} data marts, ${graph.edges.length} relationships`);
  });

  it("carries each join's note where the canvas reads it", () => {
    expect(graph.edges.length).toBeGreaterThan(0);
    for (const e of graph.edges) expect(e.description, `${e.from} -> ${e.to}`).toBeTruthy();
  });

  it("the index shows a preview drawing that exists in the repo", () => {
    const svg = index.match(/!\[[^\]]*\]\(([^)\s]+\.svg)\)/)?.[1];
    expect(svg).toBeDefined();
    expect(existsSync(join(ROOT, key, svg!))).toBe(true);
  });
});
