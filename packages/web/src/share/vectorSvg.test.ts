import { describe, it, expect } from "vitest";
import type { CanvasScene, SceneNode } from "./canvasScene";
import { buildVectorSvg, PADDING } from "./vectorSvg";

const node = (over: Partial<SceneNode> = {}): SceneNode => ({
  x: 0, y: 0, width: 250, height: 160,
  title: "Orders",
  color: "#10b981",
  source: "SQL",
  status: "#10b981",
  fieldCount: null,
  fields: [
    { label: "order_id", type: "STRING", pk: true },
    { label: "revenue", type: "NUMERIC", pk: false },
  ],
  more: null,
  empty: false,
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

  it("paints the source chip in the node's accent colour", () => {
    expect(buildVectorSvg(scene()).svg).toContain('fill="#10b981"');
    expect(buildVectorSvg(scene()).svg).toContain(">SQL<");
  });

  it("omits the chip, dot and count when the canvas hides them", () => {
    const svg = buildVectorSvg(scene({
      nodes: [node({ source: null, status: null, fieldCount: null })],
    })).svg;
    expect(svg).not.toContain(">SQL<");
    expect(svg).not.toContain('r="4.5"'); // the status dot; the PK key icon has its own circle
  });

  it("renders the compact field count instead of rows", () => {
    const svg = buildVectorSvg(scene({
      nodes: [node({ fields: [], fieldCount: "7 fields" })],
    })).svg;
    expect(svg).toContain(">7 fields<");
    expect(svg).not.toContain(">order_id<");
  });

  it("renders the expand-toggle row when the canvas shows one", () => {
    const svg = buildVectorSvg(scene({ nodes: [node({ more: "+6 more fields" })] })).svg;
    expect(svg).toContain(">+6 more fields<");
  });

  it("renders the empty-schema placeholder", () => {
    const svg = buildVectorSvg(scene({ nodes: [node({ fields: [], empty: true })] })).svg;
    expect(svg).toContain(">no fields<");
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
      labels: [{ x: 100, y: 50, text: "a = b", cardinality: "1:N", selected: false }],
    })).svg;
    expect(svg).toContain(">a = b<");
    expect(svg).toContain(">1:N<");
  });

  it("escapes markup-breaking characters in model text", () => {
    const svg = buildVectorSvg(scene({
      nodes: [node({ title: 'Sales & <Ops> "2024"', fields: [] })],
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
