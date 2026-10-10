import YAML from "yaml";
import { describe, it, expect } from "vitest";
import { serializeBundle, parseBundle, serializeOssie, parseOssie } from "../src/index";
import type { ModelGraph } from "../src/types";

const graph: ModelGraph = {
  storageId: null,
  nodes: [
    { key: "fb", title: "Facebook Ads", inputSource: "CONNECTOR", description: "ads",
      schema: [{ name: "campaign_id", type: "STRING", pk: false }], position: { x: 10, y: 20 }, status: "pending", owoxId: null },
    { key: "camp", title: "Campaigns", inputSource: "VIEW", schema: [{ name: "id", type: "STRING", pk: true }],
      position: { x: 200, y: 20 }, status: "pending", owoxId: null },
  ],
  edges: [{ id: "e1", from: "fb", to: "camp", keys: [{ left: "campaign_id", right: "id" }], bidirectional: false, description: "Each ad belongs to a campaign" }],
};

describe("OKF with CRLF line endings", () => {
  it("parses the same nodes and edges as the LF version", () => {
    const lf = serializeBundle(graph, "Demo").files;
    const crlf = Object.fromEntries(Object.entries(lf).map(([k, v]) => [k, v.replace(/\n/g, "\r\n")]));
    const a = parseBundle(lf), b = parseBundle(crlf);
    expect(a.edges).toHaveLength(1);
    expect(a.edges[0].description).toBe("Each ad belongs to a campaign");
    expect(b.nodes).toEqual(a.nodes);
    expect(b.edges).toEqual(a.edges);
  });
});

describe("Ossie relationship ai_context round trip", () => {
  it("keeps a plain-string ai_context as written, with no prefix, across repeated imports", () => {
    let g: ModelGraph = graph;
    for (let i = 0; i < 2; i++) {
      const text = serializeOssie(g, "m").yaml;
      const doc = YAML.parse(text);
      for (const r of doc.relationships) delete r.custom_extensions; // strip the OWOX extension
      for (const d of doc.datasets) delete d.custom_extensions;
      delete doc.custom_extensions;
      g = parseOssie(JSON.stringify(doc)).graph;
      expect(g.edges[0].description).toBe("Each ad belongs to a campaign");
    }
  });
});
