import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBundle } from "../src/parse";
import { FIELD_TYPES } from "../src/fieldType";

// The publication gate for the public gallery (bundles/AGENTS.md). Every bundle the
// root index lists is imported with the canvas's own parser and checked the way the
// canvas and OWOX Data Marts will read it. A bundle that fails here would import
// broken, or not show up in the Templates gallery at all.
const BUNDLES = fileURLToPath(new URL("../../../bundles", import.meta.url));
const ROOT_INDEX = join(BUNDLES, "index.md");

// Same row shape the canvas reads (packages/web/src/okf/bundlesIndex.ts).
const ROW = /\[([^\]]+)\]\(\s*\.\/((?:[^/)\s]+\/)*?[^/)\s]+)\/index\.md\s*\)/g;
const listed = [...readFileSync(ROOT_INDEX, "utf8").matchAll(ROW)].map(m => ({ title: m[1].trim(), folder: m[2] }));

// Bundle folders on disk: a folder with an index.md, at the top level or in sources/.
function onDisk(): string[] {
  const found: string[] = [];
  for (const base of ["", "sources"]) {
    const dir = join(BUNDLES, base);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      const folder = base ? `${base}/${name}` : name;
      if (statSync(join(BUNDLES, folder)).isDirectory() && existsSync(join(BUNDLES, folder, "index.md"))) found.push(folder);
    }
  }
  return found.sort();
}

function load(folder: string): Record<string, string> {
  const dir = join(BUNDLES, folder);
  return Object.fromEntries(readdirSync(dir).filter(f => f.endsWith(".md")).map(f => [`${folder}/${f}`, readFileSync(join(dir, f), "utf8")]));
}

describe("gallery root index", () => {
  it("lists every bundle folder, and nothing that is not one", () => {
    expect(listed.map(b => b.folder).sort()).toEqual(onDisk());
  });

  it("lists each bundle once", () => {
    const folders = listed.map(b => b.folder);
    expect(folders.filter((f, i) => folders.indexOf(f) !== i)).toEqual([]);
  });
});

describe.each(listed)("bundle $folder", ({ folder }) => {
  const files = load(folder);
  const index = files[`${folder}/index.md`];
  const martFiles = Object.keys(files).filter(p => !p.endsWith("/index.md"));
  const graph = parseBundle(files);
  const byKey = new Map(graph.nodes.map(n => [n.key, n]));

  it("imports one mart per document", () => {
    expect(graph.nodes.length).toBe(martFiles.length);
  });

  it("links every mart from its index.md", () => {
    const linked = new Set([...index.matchAll(/\]\(\.\/([^)/]+\.md)\)/g)].map(m => `${folder}/${m[1]}`));
    expect(martFiles.filter(f => !linked.has(f))).toEqual([]);
  });

  it("gives every mart a primary key", () => {
    expect(graph.nodes.filter(n => !n.schema.some(f => f.pk)).map(n => n.title)).toEqual([]);
  });

  it("uses only canonical field types", () => {
    const bad = graph.nodes.flatMap(n => n.schema.filter(f => !(FIELD_TYPES as readonly string[]).includes(f.type)).map(f => `${n.title}.${f.name}: ${f.type}`));
    expect(bad).toEqual([]);
  });

  it("joins on columns that exist on both sides", () => {
    const bad: string[] = [];
    for (const e of graph.edges) {
      const from = byKey.get(e.from)!, to = byKey.get(e.to)!;
      if (!e.keys.length) bad.push(`${from.title} -> ${to.title}: no keys`);
      for (const k of e.keys) {
        if (!from.schema.some(f => f.name === k.left)) bad.push(`${from.title}.${k.left}`);
        if (!to.schema.some(f => f.name === k.right)) bad.push(`${to.title}.${k.right} (target of ${from.title})`);
      }
    }
    expect(bad).toEqual([]);
  });

  it("has no self-joins", () => {
    expect(graph.edges.filter(e => e.from === e.to).map(e => byKey.get(e.from)!.title)).toEqual([]);
  });

  it("embeds a preview drawing that exists", () => {
    const svg = index.match(/!\[[^\]]*\]\(([^)]+\.svg)\)/);
    expect(svg, "index.md has no ![...](....svg) preview").not.toBeNull();
    const path = join(BUNDLES, folder, svg![1]);
    expect(existsSync(path), relative(dirname(BUNDLES), path)).toBe(true);
  });

  it("points its canvas link at its own folder", () => {
    const link = index.match(/model\.owox\.com\/\?okf=https:\/\/github\.com\/OWOX\/models\/tree\/main\/bundles\/([^)\s]+)/);
    if (link) expect(link[1]).toBe(folder);
  });
});
