import { describe, it, expect, beforeEach } from "vitest";
import type { Node } from "@xyflow/react";
import type { ModelNode, SchemaField } from "@mc/okf";
import { readCanvasScene, readVisibleFields } from "./canvasScene";
import { NOTHING_HIDDEN } from "../state/objLabels";

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

  it("prefers the alias over the raw column name, unless aliases are unticked", () => {
    const host = mountNode("orders", `<div data-field="user_id"></div>`);
    const schema = [{ ...field("user_id"), alias: "Customer" }];
    const el = host.querySelector(".react-flow__node");
    expect(readVisibleFields(el, schema)[0].label).toBe("Customer");
    expect(readVisibleFields(el, schema, { ...NOTHING_HIDDEN, fieldAlias: true })[0].label).toBe("user_id");
  });

  it("carries the description line the row shows", () => {
    const host = mountNode("orders", `<div data-field="user_id"></div>`);
    const schema = [{ ...field("user_id"), description: "Who bought" }];
    expect(readVisibleFields(host.querySelector(".react-flow__node"), schema)[0].description).toBe("Who bought");
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

  it("carries position, size, title and source", () => {
    mountNode("orders", "");
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "compact" })])!;
    expect(scene.nodes).toHaveLength(1);
    expect(scene.nodes[0]).toMatchObject({
      x: 10, y: 20, width: 250, height: 160, title: "Orders", inputSource: "SQL", status: null, description: false,
    });
  });

  it("reads the badge lines as rendered, with the open one marked", () => {
    mountNode("orders",
      `<div data-badge-line=""><span data-badge="source">SQL</span><button data-badge="fields" data-expanded="1"> 2 fields</button></div>` +
      `<div data-badge-line=""><button data-badge="relationships" data-expanded="">1 relationship</button></div>`);
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "compact" })])!;
    expect(scene.nodes[0].badgeLines).toEqual([
      [{ kind: "source", label: "SQL", expanded: false }, { kind: "fields", label: "2 fields", expanded: true }],
      [{ kind: "relationships", label: "1 relationship", expanded: false }],
    ]);
  });

  it("packs the badges itself when the card is not mounted", () => {
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "compact" })])!;
    expect(scene.nodes[0].badgeLines.flat().map(b => b.label)).toEqual(["SQL", "2 fields"]);
  });

  it("reads the field rows and the expand toggle of a section", () => {
    mountNode("orders", `<div data-section="erd"><div data-field="order_id"></div><button data-more-row=""> +6 more fields </button></div>`);
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "erd" })])!;
    expect(scene.nodes[0].sections).toEqual([
      { kind: "fields", rows: [{ label: "order_id", type: "STRING", pk: true, description: null }], more: "+6 more fields" },
    ]);
  });

  it("reads an opened relationships list", () => {
    mountNode("orders",
      `<ul data-section="relationships">` +
      `<li data-rel-row="outgoing"><span data-rel-title="">Users</span><div data-rel-join="">user_id = id</div></li>` +
      `<li data-rel-row="incoming"><span data-rel-title="">Items</span><div data-rel-join="" data-rel-unset="">Join fields not set</div></li>` +
      `</ul>`);
    const scene = readCanvasScene([rfNode(mart(), { _viewMode: "compact" })])!;
    expect(scene.nodes[0].sections).toEqual([{
      kind: "relationships",
      rows: [
        { direction: "outgoing", title: "Users", joins: ["user_id = id"] },
        { direction: "incoming", title: "Items", joins: [] },
      ],
    }]);
  });

  it("shows a status pill before the push, and honours its hidden label", () => {
    mountNode("orders", "");
    const draft = readCanvasScene([rfNode(mart({ status: "pending" }))])!;
    expect(draft.nodes[0].status).toMatchObject({ label: "Draft", status: "pending" });
    const hidden = readCanvasScene([rfNode(mart({ status: "pending" }), { _objHidden: { ...NOTHING_HIDDEN, status: true } })])!;
    expect(hidden.nodes[0].status).toBeNull();
  });

  it("places the sockets mid-card in compact and on the title row in ERD", () => {
    mountNode("orders", "");
    const sides = { left: true, right: false };
    expect(readCanvasScene([rfNode(mart(), { _sides: sides })])!.nodes[0].sockets).toEqual({ ...sides, y: 80 });
    expect(readCanvasScene([rfNode(mart(), { _sides: sides, _viewMode: "erd" })])!.nodes[0].sockets).toEqual({ ...sides, y: 26 });
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

  it("reads edge labels line by line and drops empty ones", () => {
    mountNode("orders", "");
    const host = document.createElement("div");
    host.innerHTML =
      `<div data-rel-label="" data-rel-text="a = b&#10;c = d" data-rel-card="1:N" data-rel-x="5" data-rel-y="6" data-rel-selected="1"></div>` +
      `<div data-rel-label="" data-rel-text="" data-rel-card="" data-rel-x="7" data-rel-y="8"></div>`;
    document.body.append(host);
    const scene = readCanvasScene([rfNode(mart())])!;
    expect(scene.labels).toEqual([
      { x: 5, y: 6, lines: ["a = b", "c = d"], cardinality: "1:N", selected: true },
    ]);
  });
});
