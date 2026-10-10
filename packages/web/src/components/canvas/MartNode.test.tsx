import { describe, it, expect } from "vitest";
import { CALC_GLYPH } from "./calcGlyph";
import { fireEvent, render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { MartNode } from "./MartNode";
import { NOTHING_HIDDEN, ALL_HIDDEN, type ObjHidden } from "../../state/objLabels";
import type { CardRelationship } from "./relationships";

const node = {
  key: "n1", title: "Users", inputSource: "VIEW", status: "created", owoxId: "x",
  position: { x: 0, y: 0 },
  schema: [
    { name: "id", type: "INT64", pk: true },
    { name: "email", type: "STRING", pk: false, alias: "Email address", description: "Where we write" },
  ],
};

const relationships: CardRelationship[] = [
  { id: "e1", direction: "outgoing", otherTitle: "Orders", joinFields: [{ field: "id", otherField: "user_id" }], description: "Each order has one user" },
  { id: "e2", direction: "incoming", otherTitle: "Sessions", joinFields: [] },
];

function renderNode(viewMode: "compact" | "erd", hidden: Partial<ObjHidden> = {}, extra: Record<string, unknown> = {}) {
  return render(
    <ReactFlowProvider>
      {/* @ts-expect-error minimal NodeProps for a render-only test */}
      <MartNode id="n1" data={{ ...node, _viewMode: viewMode, _objHidden: { ...NOTHING_HIDDEN, ...hidden }, _relationships: relationships, ...extra }} />
    </ReactFlowProvider>,
  );
}

describe("MartNode card", () => {
  it("shows the source, field and relationship badges in compact mode, without rows", () => {
    renderNode("compact");
    expect(screen.getByText("View")).toBeTruthy();
    expect(screen.getByText("2 fields")).toBeTruthy();
    expect(screen.getByText("2 relationships")).toBeTruthy();
    expect(screen.queryByText("INT64")).toBeNull();
  });

  it("shows no badge for a zero count", () => {
    renderNode("compact", {}, { _relationships: [], schema: [] });
    expect(screen.queryByText(/field/)).toBeNull();
    expect(screen.queryByText(/relationship/)).toBeNull();
  });

  it("shows each field and type in ERD mode, alias first", () => {
    renderNode("erd");
    expect(screen.getByText("id")).toBeTruthy();
    expect(screen.getByText("INT64")).toBeTruthy();
    expect(screen.getByText("Email address")).toBeTruthy();
    expect(screen.getByText("Where we write")).toBeTruthy();
  });

  it("drops aliases and descriptions from the rows when they are unticked", () => {
    renderNode("erd", { fieldAlias: true, fieldDescription: true });
    expect(screen.getByText("email")).toBeTruthy();
    expect(screen.queryByText("Email address")).toBeNull();
    expect(screen.queryByText("Where we write")).toBeNull();
  });
});

describe("MartNode badges open lists", () => {
  it("lists the fields under the card when the fields badge is clicked, and hides them again", () => {
    renderNode("compact");
    const badge = screen.getByRole("button", { name: "Show fields of Users" });
    fireEvent.click(badge);
    expect(screen.getByText("INT64")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hide fields of Users" }).getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Hide fields of Users" }));
    expect(screen.queryByText("INT64")).toBeNull();
  });

  it("lists the relationships with direction and join fields", () => {
    renderNode("compact");
    fireEvent.click(screen.getByRole("button", { name: "Show relationships of Users" }));
    const list = screen.getByRole("list", { name: "Relationships of Users" });
    expect(list.textContent).toContain("Orders");
    expect(list.textContent).toContain("id = user_id");
    expect(screen.getByText("Each order has one user")).toBeTruthy();
    expect(list.querySelectorAll("[data-rel-description]")).toHaveLength(1);
    expect(list.querySelector("[data-rel-row]")!.getAttribute("title")).toBe("Each order has one user");
    expect(list.textContent).toContain("Sessions");
    expect(list.textContent).toContain("Join fields not set");
    expect(screen.getByLabelText("Joins")).toBeTruthy();
    expect(screen.getByLabelText("Joined by")).toBeTruthy();
  });

  it("opens one list at a time", () => {
    renderNode("compact");
    fireEvent.click(screen.getByRole("button", { name: "Show fields of Users" }));
    fireEvent.click(screen.getByRole("button", { name: "Show relationships of Users" }));
    expect(screen.queryByText("INT64")).toBeNull();
    expect(screen.getByRole("list", { name: "Relationships of Users" })).toBeTruthy();
  });

  it("keeps the field count a plain badge in ERD, where the rows are already listed", () => {
    renderNode("erd");
    expect(screen.queryByRole("button", { name: /fields of Users/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Show relationships of Users" })).toBeTruthy();
  });
});

describe("MartNode object-labels", () => {
  it("hides the source badge on its own", () => {
    renderNode("compact", { source: true });
    expect(screen.queryByText("View")).toBeNull();
    expect(screen.getByText("2 fields")).toBeTruthy();
  });

  it("hides the relationships badge, and with it the list", () => {
    renderNode("compact", { relationships: true });
    expect(screen.queryByText("2 relationships")).toBeNull();
    expect(screen.getByText("2 fields")).toBeTruthy();
  });

  it("marks a draft with a status pill, and nothing once pushed", () => {
    const { unmount } = renderNode("compact", {}, { status: "pending" });
    expect(screen.getByText("Draft")).toBeTruthy();
    unmount();
    renderNode("compact");
    expect(screen.queryByText("Draft")).toBeNull();
  });

  it("hides the status pill when its label is unticked", () => {
    renderNode("compact", { status: true }, { status: "error" });
    expect(screen.queryByText("Error")).toBeNull();
  });

  it("all hidden: leaves just the title", () => {
    renderNode("compact", ALL_HIDDEN, { status: "pending" });
    expect(screen.queryByText("View")).toBeNull();
    expect(screen.queryByText("2 fields")).toBeNull();
    expect(screen.queryByText("2 relationships")).toBeNull();
    expect(screen.queryByText("Draft")).toBeNull();
    expect(screen.getByText("Users")).toBeTruthy();
  });

  it("defaults to showing everything when _objHidden is absent", () => {
    render(
      <ReactFlowProvider>
        {/* @ts-expect-error minimal NodeProps for a render-only test */}
        <MartNode id="n1" data={{ ...node, status: "pending", _viewMode: "compact" }} />
      </ReactFlowProvider>,
    );
    expect(screen.getByText("View")).toBeTruthy();
    expect(screen.getByText("2 fields")).toBeTruthy();
    expect(screen.getByText("Draft")).toBeTruthy();
  });
});

describe("calculated fields", () => {
  const schema = [
    { name: "id", type: "INT64", pk: true },
    { name: "ctr", type: "NUMERIC", pk: false, formula: "SUM(clicks) / SUM(impressions)" },
    { name: "user_key", type: "STRING", pk: false, formula: "CONCAT(a, b)" },
  ];
  it("marks metric and column rows with their glyph and the formula tooltip", () => {
    const { container } = renderNode("erd", {}, { schema });
    const metric = container.querySelector('[data-field="ctr"]')!;
    expect(metric.getAttribute("data-calculated")).toBe("metric");
    expect(metric.textContent).toContain("Σ");
    expect(metric.getAttribute("title")).toContain("SUM(clicks) / SUM(impressions)");
    expect(container.querySelector('[data-field="user_key"]')!.getAttribute("data-calculated")).toBe("column");
    expect(container.querySelector('[data-field="user_key"]')!.textContent).toContain("fx");
  });
  it("explains the glyph on hover, winning over the row's formula tooltip", () => {
    const { container } = renderNode("erd", {}, { schema });
    expect(container.querySelector('[data-field="ctr"] [aria-label="Metric"]')!.getAttribute("title")).toBe(CALC_GLYPH.metric.tip);
    expect(container.querySelector('[data-field="user_key"] [aria-label="Calculated column"]')!.getAttribute("title")).toBe(CALC_GLYPH.column.tip);
  });
  it("gives calculated rows no edge anchors", () => {
    const { container } = renderNode("erd", {}, { schema });
    expect(container.querySelector('[data-handleid="fl:ctr"]')).toBeNull();
    expect(container.querySelector('[data-handleid="fl:id"]')).not.toBeNull();
  });
  it("separates regular and calculated rows with exactly one dashed border", () => {
    const { container } = renderNode("erd", {}, { schema });
    const prev = container.querySelector('[data-field="id"]')!;
    expect(prev.hasAttribute("data-calc-divider")).toBe(true);
    expect(prev.className).toContain("border-dashed");
    expect(prev.className).not.toContain("border-[#e5e5e5]");
    const first = container.querySelector('[data-field="ctr"]')!;
    expect(first.className).not.toMatch(/border-t|border-dashed/);
    expect(container.querySelectorAll("[data-calc-divider]")).toHaveLength(1);
  });
});
