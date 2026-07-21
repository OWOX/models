import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { MartNode } from "./MartNode";

const node = {
  key: "n1", title: "Users", inputSource: "VIEW", status: "created", owoxId: "x",
  position: { x: 0, y: 0 },
  schema: [
    { name: "id", type: "INT64", pk: true },
    { name: "email", type: "STRING", pk: false },
  ],
};

function renderNode(
  viewMode: "compact" | "erd",
  objLabelMode: "all" | "noSource" | "noFields" | "both" = "all",
) {
  return render(
    <ReactFlowProvider>
      {/* @ts-expect-error minimal NodeProps for a render-only test */}
      <MartNode id="n1" data={{ ...node, _viewMode: viewMode, _objLabelMode: objLabelMode }} />
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
  it("all: shows the source chip and field count", () => {
    renderNode("compact", "all");
    expect(screen.getByText("VIEW")).toBeTruthy();
    expect(screen.getByText("2 fields")).toBeTruthy();
  });

  it("noSource: hides the source chip but keeps the field count", () => {
    renderNode("compact", "noSource");
    expect(screen.queryByText("VIEW")).toBeNull();
    expect(screen.getByText("2 fields")).toBeTruthy();
  });

  it("noFields: hides the field count but keeps the source chip", () => {
    renderNode("compact", "noFields");
    expect(screen.getByText("VIEW")).toBeTruthy();
    expect(screen.queryByText("2 fields")).toBeNull();
  });

  it("both: hides the source chip and the field count", () => {
    renderNode("compact", "both");
    expect(screen.queryByText("VIEW")).toBeNull();
    expect(screen.queryByText("2 fields")).toBeNull();
  });

  it("defaults to showing everything when _objLabelMode is absent", () => {
    render(
      <ReactFlowProvider>
        {/* @ts-expect-error minimal NodeProps for a render-only test */}
        <MartNode id="n1" data={{ ...node, _viewMode: "compact" }} />
      </ReactFlowProvider>,
    );
    expect(screen.getByText("VIEW")).toBeTruthy();
    expect(screen.getByText("2 fields")).toBeTruthy();
  });
});
