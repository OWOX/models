import { describe, it, expect, beforeEach } from "vitest";
import type { Node } from "@xyflow/react";
import type { ModelNode, SchemaField } from "@mc/okf";
import { readCanvasScene, readVisibleFields } from "./canvasScene";

const field = (name: string, pk = false): SchemaField => ({ name, type: "STRING", pk });

const mart = (over: Partial<ModelNode> = {}): ModelNode => ({
  key: "orders",
  title: "Orders",
  inputSource: "SQL",
  schema: [field("order_id", true), field("user_id")],
  position: { x: 10, y: 20 },
  status: "created",
  owoxId: null,
  ...over,
});

const rfNode = (node: ModelNode, extra: Record<string, unknown> = {}): Node => ({
  id: node.key,
  type: "mart",
  position: node.position,
  data: { ...node, ...extra } as unknown as Record<string, unknown>,
  measured: { width: 250, height: 160 },
});

function mountNode(key: string, inner: string) {
  const host = document.createElement("div");
  host.innerHTML = `<div class="react-flow__node" data-id="${key}">${inner}</div>`;
  document.body.append(host);
  return host;
}

beforeEach(() => { document.body.innerHTML = ""; });

describe("readVisibleFields", () => {
  it("resolves rendered rows against the schema, in DOM order", () => {
    const host = mountNode("orders", `<div data-field="user_id"></div><div data-field="order_id"></div>`);
    const fields = readVisibleFields(host.querySelector(".react-flow__node"), mart().schema);
    expect(fields.map(f => f.label)).toEqual(["user_id", "order_id"]);
    expect(fields.find(f => f.label === "order_id")?.pk).toBe(true);
  });

  it("prefers the alias over the raw column name", () => {
    const host = mountNode("orders", `<div data-field="user_id"></div>`);
    const schema = [{ ...field("user_id"), alias: "Customer" }];
    expect(readVisibleFields(host.querySelector(".react-flow__node"), schema)[0].label).toBe("Customer");
  });

  it("ignores rows whose column is no longer in the schema", () => {
    const host = mountNode("orders", `<div data-field="dropped"></div>`);
    expect(readVisibleFields(host.querySelector(".react-flow__node"), mart().schema)).toEqual([]);
  });

  it("returns nothing without an element", () => {
    expect(readVisibleFields(null, mart().schema)).toEqual([]);
  });
});

describe("readCanvasScene", () => {
  it("returns null when there are no nodes", () => {
    expect(readCanvasScene([])).toBeNull();
  });

  it("skips nodes React Flow has not measured yet", () => {
    const n = rfNode(mart());
    expect(readCanvasScene([{ ...n, measured: { width: 0, height: 0 } }])).toBeNull();
  });

  it("carries position, size, title and source colour", () => {
    mountNode("orders", "");
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "compact" })])!;
    expect(scene.nodes).toHaveLength(1);
    expect(scene.nodes[0]).toMatchObject({
      x: 10, y: 20, width: 250, height: 160, title: "Orders", source: "SQL", color: "#10b981",
    });
  });

  it("shows the compact field count and no ERD rows in compact mode", () => {
    mountNode("orders", `<div data-field="order_id"></div>`);
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "compact" })])!;
    expect(scene.nodes[0].fieldCount).toBe("2 fields");
    expect(scene.nodes[0].fields).toEqual([]);
  });

  it("shows ERD rows and no field count in ERD mode", () => {
    mountNode("orders", `<div data-field="order_id"></div>`);
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "erd" })])!;
    expect(scene.nodes[0].fieldCount).toBeNull();
    expect(scene.nodes[0].fields.map(f => f.label)).toEqual(["order_id"]);
  });

  it("honours hidden label parts", () => {
    mountNode("orders", "");
    const hidden = { source: true, fields: true, status: true };
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "compact", _objHidden: hidden })])!;
    expect(scene.nodes[0].source).toBeNull();
    expect(scene.nodes[0].status).toBeNull();
    expect(scene.nodes[0].fieldCount).toBeNull();
  });

  it("picks up the expand-toggle row as rendered", () => {
    mountNode("orders", `<div data-field="order_id"></div><button data-more-row=""> +6 more fields </button>`);
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "erd" })])!;
    expect(scene.nodes[0].more).toBe("+6 more fields");
  });

  it("flags an ERD mart with no schema as empty", () => {
    mountNode("orders", "");
    const scene = readCanvasScene([rfNode(mart({ schema: [] }), { _viewMode: "erd" })])!;
    expect(scene.nodes[0].empty).toBe(true);
  });

  it("reads edge paths with their stroke, ignoring pathless edges", () => {
    mountNode("orders", "");
    const svg = document.createElement("div");
    svg.innerHTML =
      `<g class="react-flow__edge"><path class="react-flow__edge-path" d="M0,0 L10,10" style="stroke:#1e88e5;stroke-width:2.5" marker-start="url(#a)"></path></g>` +
      `<g class="react-flow__edge"><path class="react-flow__edge-path"></path></g>`;
    document.body.append(svg);
    const scene = readCanvasScene([rfNode(mart())])!;
    expect(scene.edges).toEqual([
      { d: "M0,0 L10,10", stroke: "#1e88e5", strokeWidth: 2.5, bidirectional: true },
    ]);
  });

  it("reads edge labels and drops empty ones", () => {
    mountNode("orders", "");
    const host = document.createElement("div");
    host.innerHTML =
      `<div data-rel-label="" data-rel-text="a = b" data-rel-card="1:N" data-rel-x="5" data-rel-y="6" data-rel-selected="1"></div>` +
      `<div data-rel-label="" data-rel-text="" data-rel-card="" data-rel-x="7" data-rel-y="8"></div>`;
    document.body.append(host);
    const scene = readCanvasScene([rfNode(mart())])!;
    expect(scene.labels).toEqual([
      { x: 5, y: 6, text: "a = b", cardinality: "1:N", selected: true },
    ]);
  });
});
