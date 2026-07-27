import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { MartNode } from "./MartNode";
import { NOTHING_HIDDEN, ALL_HIDDEN, type ObjHidden } from "../../state/objLabels";

const node = {
  key: "n1", title: "Users", inputSource: "VIEW", status: "created", owoxId: "x",
  position: { x: 0, y: 0 },
  schema: [
    { name: "id", type: "INT64", pk: true },
    { name: "email", type: "STRING", pk: false },
  ],
};

function renderNode(viewMode: "compact" | "erd", hidden: Partial<ObjHidden> = {}) {
  return render(
    <ReactFlowProvider>
      {/* @ts-expect-error minimal NodeProps for a render-only test */}
      <MartNode id="n1" data={{ ...node, _viewMode: viewMode, _objHidden: { ...NOTHING_HIDDEN, ...hidden } }} />
    </ReactFlowProvider>,
  );
}

describe("MartNode ERD rendering", () => {
  it("shows the field count (not rows) in compact mode", () => {
    renderNode("compact");
    expect(screen.getByText("2 fields")).toBeTruthy();
    expect(screen.queryByText("INT64")).toBeNull();
  });

  it("shows each field name and type in ERD mode", () => {
    renderNode("erd");
    expect(screen.getByText("id")).toBeTruthy();
    expect(screen.getByText("INT64")).toBeTruthy();
    expect(screen.getByText("email")).toBeTruthy();
    expect(screen.getByText("STRING")).toBeTruthy();
  });
});

describe("MartNode object-labels", () => {
  it("nothing hidden: shows the source chip, field count and status dot", () => {
    renderNode("compact");
    expect(screen.getByText("VIEW")).toBeTruthy();
    expect(screen.getByText("2 fields")).toBeTruthy();
    expect(screen.getByTestId("status-dot")).toBeTruthy();
  });

  it("hides the source chip on its own", () => {
    renderNode("compact", { source: true });
    expect(screen.queryByText("VIEW")).toBeNull();
    expect(screen.getByText("2 fields")).toBeTruthy();
    expect(screen.getByTestId("status-dot")).toBeTruthy();
  });

  it("hides the field count on its own", () => {
    renderNode("compact", { fields: true });
    expect(screen.getByText("VIEW")).toBeTruthy();
    expect(screen.queryByText("2 fields")).toBeNull();
    expect(screen.getByTestId("status-dot")).toBeTruthy();
  });

  it("hides the status dot on its own — the combination the enum couldn't express", () => {
    renderNode("compact", { status: true });
    expect(screen.queryByTestId("status-dot")).toBeNull();
    expect(screen.getByText("VIEW")).toBeTruthy();
    expect(screen.getByText("2 fields")).toBeTruthy();
  });

  it("hides the source chip and the status dot while keeping the field count", () => {
    renderNode("compact", { source: true, status: true });
    expect(screen.queryByText("VIEW")).toBeNull();
    expect(screen.queryByTestId("status-dot")).toBeNull();
    expect(screen.getByText("2 fields")).toBeTruthy();
  });

  it("all hidden: leaves just the title", () => {
    renderNode("compact", ALL_HIDDEN);
    expect(screen.queryByText("VIEW")).toBeNull();
    expect(screen.queryByText("2 fields")).toBeNull();
    expect(screen.queryByTestId("status-dot")).toBeNull();
    expect(screen.getByText("Users")).toBeTruthy();
  });

  it("defaults to showing everything when _objHidden is absent", () => {
    render(
      <ReactFlowProvider>
        {/* @ts-expect-error minimal NodeProps for a render-only test */}
        <MartNode id="n1" data={{ ...node, _viewMode: "compact" }} />
      </ReactFlowProvider>,
    );
    expect(screen.getByText("VIEW")).toBeTruthy();
    expect(screen.getByText("2 fields")).toBeTruthy();
    expect(screen.getByTestId("status-dot")).toBeTruthy();
  });
});
