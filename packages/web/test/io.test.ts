import { describe, it, expect } from "vitest";
import { graphToBundleFiles, filesToGraph } from "../src/okf/io";
import { createModelStore } from "../src/state/model";
describe("okf io", () => {
  it("exports a populated model to markdown files and re-imports it", () => {
    const s = createModelStore({ storageId: "stor_1" });
    const a = s.addNode({ x: 0, y: 0 }); s.updateNode(a.key, { title: "Orders" });
    const b = s.addNode({ x: 1, y: 1 }); s.updateNode(b.key, { title: "Customers" });
    s.addEdge(a.key, b.key);
    const files = graphToBundleFiles(s.get(), "Demo");
    const g = filesToGraph(files);
    expect(g.nodes.map(n => n.title).sort()).toEqual(["Customers", "Orders"]);
    expect(g.edges).toHaveLength(1);
  });

  it("re-imports a downloaded single-file bundle (concatenated docs)", () => {
    const s = createModelStore({ storageId: "stor_1" });
    const a = s.addNode({ x: 0, y: 0 }); s.updateNode(a.key, { title: "Orders" });
    const b = s.addNode({ x: 1, y: 1 }); s.updateNode(b.key, { title: "Customers" });
    s.addEdge(a.key, b.key);
    const files = graphToBundleFiles(s.get(), "Demo");
    // Simulate downloadBundle(): all docs concatenated into one .md the user uploads.
    const concatenated = Object.entries(files).map(([p, c]) => `<!-- ${p} -->\n${c}`).join("\n\n");
    const g = filesToGraph({ "Demo.md": concatenated });
    expect(g.nodes.map(n => n.title).sort()).toEqual(["Customers", "Orders"]);
    expect(g.edges).toHaveLength(1);
  });
});
