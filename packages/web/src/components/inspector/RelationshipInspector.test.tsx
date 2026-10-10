import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import { RelationshipInspector } from "./RelationshipInspector";
import { defaultJoinAlias, type ModelEdge, type ModelNode } from "@mc/okf";

const from: ModelNode = { key: "tx", title: "Transactions", inputSource: "TABLE", status: "pending", owoxId: null, position: { x: 0, y: 0 }, schema: [{ name: "block_hash", type: "STRING", pk: true }] };
const to: ModelNode = { key: "blocks", title: "Blocks", inputSource: "TABLE", status: "pending", owoxId: null, position: { x: 0, y: 0 }, schema: [{ name: "hash", type: "STRING", pk: true }] };
const edge: ModelEdge = { id: "e1", from: "tx", to: "blocks", keys: [{ left: "block_hash", right: "hash" }], bidirectional: false };

describe("RelationshipInspector cardinality", () => {
  it("has an Advanced section and a cardinality select that patches the edge", () => {
    const onUpdate = vi.fn();
    const { getByText, getByLabelText } = render(
      <RelationshipInspector edge={edge} fromNode={from} toNode={to} onUpdate={onUpdate} onEnsureField={() => {}} />,
    );
    expect(getByText("Advanced")).toBeTruthy();
    fireEvent.change(getByLabelText("Cardinality"), { target: { value: "N:1" } });
    expect(onUpdate).toHaveBeenCalledWith({ cardinality: "N:1" });
  });

  it("shows a side-labeled caption when set", () => {
    const { getByText } = render(
      <RelationshipInspector edge={{ ...edge, cardinality: "N:1" }} fromNode={from} toNode={to} onUpdate={() => {}} onEnsureField={() => {}} />,
    );
    expect(getByText("Transactions (N) → Blocks (1)")).toBeTruthy();
  });
});

describe("RelationshipInspector description", () => {
  it("edits the description, untrimmed, and stores undefined when blank", () => {
    const onUpdate = vi.fn();
    render(<RelationshipInspector edge={edge} fromNode={from} toNode={to} onUpdate={onUpdate} onEnsureField={() => {}} />);
    const ta = screen.getByLabelText("Description") as HTMLTextAreaElement;
    expect(ta.placeholder).toBe("What does this relationship mean?");
    fireEvent.change(ta, { target: { value: "each tx in one block " } });
    expect(onUpdate).toHaveBeenCalledWith({ description: "each tx in one block " });
    cleanup();
    render(<RelationshipInspector edge={{ ...edge, description: "x" }} fromNode={from} toNode={to} onUpdate={onUpdate} onEnsureField={() => {}} />);
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "" } });
    expect(onUpdate).toHaveBeenCalledWith({ description: undefined });
  });
});

describe("RelationshipInspector aliases and calculated keys", () => {
  it("does not offer calculated fields as join keys and warns when one is typed", () => {
    const f = { ...from, schema: [...from.schema, { name: "ctr", type: "NUMERIC", pk: false, formula: "SUM(x)" }] };
    const { container } = render(<RelationshipInspector edge={{ ...edge, keys: [{ left: "ctr", right: "hash" }] }} fromNode={f} toNode={to} onUpdate={() => {}} onEnsureField={() => {}} />);
    const options = Array.from(container.querySelectorAll(`#fields-${edge.from} option`)).map(o => o.getAttribute("value"));
    expect(options).not.toContain("ctr");
    expect(screen.getByText(/"ctr" is a calculated field/)).toBeTruthy();
  });

  it("edits the join alias, defaulting to the target title", () => {
    const onUpdate = vi.fn();
    render(<RelationshipInspector edge={edge} fromNode={from} toNode={to} onUpdate={onUpdate} onEnsureField={() => {}} />);
    const input = screen.getByLabelText("Join alias") as HTMLInputElement;
    expect(input.placeholder).toBe(defaultJoinAlias(to.title, to.key));
    fireEvent.change(input, { target: { value: "cust" } });
    expect(onUpdate).toHaveBeenCalledWith({ alias: "cust" });
    // The input is controlled: clearing only fires a change when a value is set.
    cleanup();
    render(<RelationshipInspector edge={{ ...edge, alias: "cust" }} fromNode={from} toNode={to} onUpdate={onUpdate} onEnsureField={() => {}} />);
    fireEvent.change(screen.getByLabelText("Join alias"), { target: { value: "" } });
    expect(onUpdate).toHaveBeenCalledWith({ alias: undefined });
  });

  it("shows a reverse alias only for bidirectional edges and flags invalid identifiers", () => {
    render(<RelationshipInspector edge={{ ...edge, bidirectional: true, alias: "2bad" }} fromNode={from} toNode={to} onUpdate={() => {}} onEnsureField={() => {}} />);
    expect(screen.getByLabelText("Reverse join alias")).toBeTruthy();
    expect(screen.getByText(/letters, digits and _/)).toBeTruthy();
  });
});
