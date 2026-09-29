import { describe, it, expect } from "vitest";
import type { CanvasScene, SceneNode } from "./canvasScene";
import { buildVectorSvg, PADDING } from "./vectorSvg";

const node = (over: Partial<SceneNode> = {}): SceneNode => ({
  x: 0, y: 0, width: 250, height: 160,
  title: "Orders",
  inputSource: "SQL",
  status: null,
  description: false,
  badgeLines: [[
    { kind: "source", label: "SQL", expanded: false },
    { kind: "fields", label: "2 fields", expanded: false },
  ]],
  sections: [{
    kind: "fields",
    rows: [
      { label: "order_id", type: "STRING", pk: true },
      { label: "revenue", type: "NUMERIC", pk: false, description: "Net of refunds" },
    ],
    more: null,
  }],
  sockets: { left: false, right: false, y: 26 },
  ...over,
});

const scene = (over: Partial<CanvasScene> = {}): CanvasScene => ({
  nodes: [node()], edges: [], labels: [], ...over,
});

describe("buildVectorSvg", () => {
  it("emits no foreignObject — that is the whole point", () => {
    expect(buildVectorSvg(scene()).svg).not.toContain("foreignObject");
  });

  it("frames the model with padding on every side", () => {
    const { svg, width, height } = buildVectorSvg(scene());
    expect(width).toBe(250 + PADDING * 2);
    expect(height).toBe(160 + PADDING * 2);
    expect(svg).toContain(`viewBox="0 0 ${width} ${height}"`);
  });

  it("spans every node, not just the first", () => {
    const { width } = buildVectorSvg(scene({
      nodes: [node(), node({ x: 400, width: 200 })],
    }));
    expect(width).toBe(600 + PADDING * 2);
  });

  it("shifts a model at negative coordinates back into view", () => {
    const { svg } = buildVectorSvg(scene({ nodes: [node({ x: -300, y: -120 })] }));
    expect(svg).toContain(`translate(${PADDING + 300},${PADDING + 120})`);
  });

  it("keeps room for the watermark on a tiny model", () => {
    const { height } = buildVectorSvg(scene({ nodes: [node({ height: 1 })] }), { padding: 0 });
    expect(height).toBeGreaterThanOrEqual(24 + 14 * 2);
  });

  it("writes the title and field rows as real text", () => {
    const svg = buildVectorSvg(scene()).svg;
    expect(svg).toContain(">Orders<");
    expect(svg).toContain(">order_id<");
    expect(svg).toContain(">NUMERIC<");
  });

  it("draws the badges as soft pills with their text", () => {
    const svg = buildVectorSvg(scene()).svg;
    expect(svg).toContain(">SQL<");
    expect(svg).toContain(">2 fields<");
    expect(svg).toContain('fill="#f5f5f5"');
  });

  it("fills an opened badge darker, as the card does", () => {
    const svg = buildVectorSvg(scene({
      nodes: [node({ badgeLines: [[{ kind: "relationships", label: "3 relationships", expanded: true }]] })],
    })).svg;
    expect(svg).toContain('fill="#ebebec"');
  });

  it("omits badges, status and sections the canvas does not show", () => {
    const svg = buildVectorSvg(scene({ nodes: [node({ badgeLines: [], sections: [] })] })).svg;
    expect(svg).not.toContain(">SQL<");
    expect(svg).not.toContain(">order_id<");
    expect(svg).not.toContain(">Draft<");
  });

  it("draws the status pill next to the title", () => {
    const svg = buildVectorSvg(scene({
      nodes: [node({ status: { label: "Draft", tip: "", bg: "#f5f5f5", fg: "#65676f", status: "pending" } })],
    })).svg;
    expect(svg).toContain(">Draft<");
  });

  it("writes a shown field description under its row", () => {
    expect(buildVectorSvg(scene()).svg).toContain(">Net of refunds<");
  });

  it("renders the expand-toggle row when the canvas shows one", () => {
    const svg = buildVectorSvg(scene({
      nodes: [node({ sections: [{ kind: "fields", rows: [], more: "+6 more fields" }] })],
    })).svg;
    expect(svg).toContain(">+6 more fields<");
  });

  it("renders an opened relationships list", () => {
    const svg = buildVectorSvg(scene({
      nodes: [node({ sections: [{ kind: "relationships", rows: [
        { direction: "outgoing", title: "Users", joins: ["user_id = id"] },
        { direction: "incoming", title: "Items", joins: [] },
      ] }] })],
    })).svg;
    expect(svg).toContain(">Users<");
    expect(svg).toContain(">user_id = id<");
    expect(svg).toContain(">Join fields not set<");
  });

  it("draws a socket dot only on a side an edge attaches to", () => {
    const none = buildVectorSvg(scene()).svg;
    const left = buildVectorSvg(scene({ nodes: [node({ sockets: { left: true, right: false, y: 26 } })] })).svg;
    expect(none).not.toContain('fill="#606060"');
    expect(left.match(/fill="#606060"/g)).toHaveLength(1);
  });

  it("carries edge paths through with their stroke and an arrowhead", () => {
    const svg = buildVectorSvg(scene({
      edges: [{ d: "M0,0 C5,5 10,10 20,20", stroke: "#94a3b8", strokeWidth: 2, bidirectional: false }],
    })).svg;
    expect(svg).toContain('d="M0,0 C5,5 10,10 20,20"');
    expect(svg).toContain('stroke="#94a3b8"');
    expect(svg).toContain("marker-end=");
    expect(svg).not.toContain("marker-start=");
  });

  it("adds a tail arrow only for bidirectional edges", () => {
    const svg = buildVectorSvg(scene({
      edges: [{ d: "M0,0 L1,1", stroke: "#94a3b8", strokeWidth: 2, bidirectional: true }],
    })).svg;
    expect(svg).toContain("marker-start=");
  });

  it("defines one marker pair per distinct stroke colour", () => {
    const svg = buildVectorSvg(scene({
      edges: [
        { d: "M0,0 L1,1", stroke: "#94a3b8", strokeWidth: 2, bidirectional: false },
        { d: "M2,2 L3,3", stroke: "#94a3b8", strokeWidth: 2, bidirectional: false },
        { d: "M4,4 L5,5", stroke: "#1e88e5", strokeWidth: 2.5, bidirectional: false },
      ],
    })).svg;
    expect(svg.match(/<marker id="arr-end-/g)).toHaveLength(2);
  });

  it("draws an edge label with its cardinality pill", () => {
    const svg = buildVectorSvg(scene({
      labels: [{ x: 100, y: 50, lines: ["a = b", "c = d"], cardinality: "1:N", selected: false }],
    })).svg;
    expect(svg).toContain(">a = b<");
    expect(svg).toContain(">c = d<");
    expect(svg).toContain(">1:N<");
  });

  it("escapes markup-breaking characters in model text", () => {
    const svg = buildVectorSvg(scene({
      nodes: [node({ title: 'Sales & <Ops> "2024"', sections: [] })],
    })).svg;
    expect(svg).toContain("&amp;");
    expect(svg).not.toContain("<Ops>");
  });

  it("leaves the background transparent by default and fills it on request", () => {
    expect(buildVectorSvg(scene()).svg).not.toContain('<rect width="370"');
    expect(buildVectorSvg(scene(), { background: "#ffffff" }).svg)
      .toContain('<rect width="370" height="280" fill="#ffffff"/>');
  });

  it("stamps the watermark in the bottom-right corner", () => {
    const { svg, width, height } = buildVectorSvg(scene());
    expect(svg).toContain(`translate(${width - 24 - 14},${height - 24 - 14})`);
  });
});
