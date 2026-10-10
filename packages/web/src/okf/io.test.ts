import { describe, it, expect } from "vitest";
import { bundleToZip, zipToFiles, graphToBundleFiles } from "./io";
import { isBundleIndex, type ModelGraph } from "@mc/okf";

describe("zip round-trip", () => {
  it("zips and unzips bundle files losslessly", () => {
    const files = { "demo/index.md": "# Demo\n", "demo/orders.md": "# Orders\n" };
    const buf = bundleToZip(files);
    expect(buf).toBeInstanceOf(Uint8Array);
    expect(zipToFiles(buf)).toEqual(files);
  });
});

describe("graphToBundleFiles", () => {
  const graph: ModelGraph = {
    storageId: null,
    nodes: [{ key: "orders", title: "Orders", inputSource: "VIEW", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 0, y: 0 }, status: "pending", owoxId: null }],
    edges: [],
  };

  it("appends an OWOX attribution footer to the bundle index only", () => {
    const files = graphToBundleFiles(graph, "Demo");
    const indexKey = Object.keys(files).find(isBundleIndex)!;
    expect(files[indexKey]).toContain("Generated with");
    expect(files[indexKey]).toContain("OWOX Data Marts");
    expect(files[indexKey]).toContain("github.com/OWOX/models");
    const martKey = Object.keys(files).find(k => k.endsWith("orders.md"))!;
    expect(files[martKey]).not.toContain("Generated with"); // per-mart docs stay clean
  });
});

import { loadModelFiles, loadModelText } from "./io";
const OSSIE = "version: 0.2.0.dev0\nname: shop\ndatasets:\n  - name: orders\n    source: p.d.o\n";
describe("loadModel*", () => {
  it("routes Ossie files and text to the Ossie parser", async () => {
    expect(await loadModelFiles({ "m.yaml": OSSIE })).toMatchObject({ format: "ossie", name: "shop" });
    expect((await loadModelText(OSSIE)).format).toBe("ossie");
  });
  it("loads OKF files with the index title as name", async () => {
    const r = await loadModelFiles({ "index.md": "---\ntitle: Shop\n---\n# Shop", "a.md": "---\ntitle: A\n---\n# A" });
    expect(r).toMatchObject({ format: "okf", name: "Shop", notImported: [], warnings: [] });
    expect((await loadModelText("---\ntitle: A\n---\n# A")).format).toBe("okf");
  });
  it("refuses mixed formats and several Ossie files", async () => {
    await expect(loadModelFiles({ "m.yaml": OSSIE, "a.md": "---\ntitle: A\n---" })).rejects.toThrow("Import one format at a time");
    await expect(loadModelFiles({ "a.yaml": OSSIE, "b.yml": OSSIE })).rejects.toThrow("Import one Ossie file at a time");
  });
  it("ignores stray data files next to OKF docs", async () => {
    const r = await loadModelFiles({ "a.md": "---\ntitle: A\n---\n# A", "package.json": '{"name":"x"}', "c.yml": "a: 1" });
    expect(r.format).toBe("okf");
  });
  it("refuses .md docs next to a real Ossie model, and non-Ossie lone json", async () => {
    await expect(loadModelFiles({ "m.yaml": OSSIE, "a.md": "---\ntitle: A\n---" })).rejects.toThrow("Import one format at a time");
    await expect(loadModelFiles({ "a.json": '{"a":1}' })).rejects.toThrow("This file isn't an Ossie model");
  });
});

describe("size cap", () => {
  const big = "a".repeat(5 * 1024 * 1024 + 1);
  it("rejects oversized pasted text and files before parsing", async () => {
    await expect(loadModelText(big)).rejects.toThrow("This file is too large (max 5 MB).");
    await expect(loadModelFiles({ "m.yaml": big })).rejects.toThrow("This file is too large (max 5 MB).");
  });
});

describe("OKF index description", () => {
  const idx = (d: string) => `---\ntitle: Shop\ndescription: ${d}\n---\n# Shop`;
  it("reads the index description into the graph", async () => {
    const r = await loadModelFiles({ "index.md": idx("Our retail model"), "a.md": "---\ntitle: A\n---\n# A" });
    expect(r.graph.description).toBe("Our retail model");
  });
  it("ignores the exporter's default description text", async () => {
    const r = await loadModelFiles({ "index.md": idx("Index of exported OWOX data marts."), "a.md": "---\ntitle: A\n---\n# A" });
    expect(r.graph.description).toBeUndefined();
  });
});
