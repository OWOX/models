import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SchemaEditor } from "./SchemaEditor";

const ctx = { own: ["clicks", "ctr"], joined: [{ alias: "orders", title: "Orders", fields: ["amount"] }] };

describe("SchemaEditor calculated fields", () => {
  it("adds a calculated field with an empty formula", () => {
    const onChange = vi.fn();
    render(<SchemaEditor schema={[]} onChange={onChange} formulaContext={ctx} />);
    fireEvent.click(screen.getByText("+ Add calculated field"));
    expect(onChange).toHaveBeenCalledWith([{ name: "", type: "NUMERIC", pk: false, formula: "" }]);
  });
  it("shows the derived level and the available references", () => {
    render(<SchemaEditor schema={[{ name: "ctr", type: "NUMERIC", pk: false, formula: "SUM(clicks)" }]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.getByText("Metric")).toBeTruthy();
    expect(screen.getByText(/orders\.\*/)).toBeTruthy();
    expect((screen.getByTitle("Primary key") as HTMLInputElement).disabled).toBe(true);
  });
  it("warns about a reference that no longer exists", () => {
    render(<SchemaEditor schema={[{ name: "ctr", type: "NUMERIC", pk: false, formula: "SUM(click)" }]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.getByText('Unknown field "click"')).toBeTruthy();
  });
  it("warns when the formula is empty", () => {
    render(<SchemaEditor schema={[{ name: "ctr", type: "NUMERIC", pk: false, formula: "  " }]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.getByText("Formula is empty")).toBeTruthy();
  });
  it("edits the formula", () => {
    const onChange = vi.fn();
    render(<SchemaEditor schema={[{ name: "ctr", type: "NUMERIC", pk: false, formula: "" }]} onChange={onChange} formulaContext={ctx} />);
    fireEvent.change(screen.getByPlaceholderText("SUM(clicks) / NULLIF(SUM(impressions), 0)"), { target: { value: "SUM(clicks)" } });
    expect(onChange).toHaveBeenCalledWith([{ name: "ctr", type: "NUMERIC", pk: false, formula: "SUM(clicks)" }]);
  });
});
