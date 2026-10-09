import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { SchemaEditor } from "./SchemaEditor";

const ctx = { own: ["clicks", "ctr"], joined: [{ alias: "orders", title: "Orders", fields: ["amount"] }] };
const HINT = /Joined: orders\.\*/;
const PH = "SUM(clicks) / NULLIF(SUM(impressions), 0)";
const calc = (formula: string, name = "ctr") => ({ name, type: "NUMERIC", pk: false, formula });

describe("SchemaEditor calculated fields", () => {
  it("keeps calculated rows out of the regular table and lists them in their own section", () => {
    render(<SchemaEditor schema={[
      { name: "clicks", type: "INTEGER", pk: false },
      calc("SUM(clicks)", "total"),
      calc("clicks * 2", "double"),
    ]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.getAllByTitle("Primary key")).toHaveLength(1);          // only the regular row
    expect(screen.getAllByPlaceholderText("field name")).toHaveLength(3);
    expect(screen.getByLabelText("Metric").textContent).toBe("Σ");
    expect(screen.getByLabelText("Calculated column").textContent).toBe("fx");
    expect(screen.getByText("Calculated fields")).toBeTruthy();
  });
  it("has no PK column in the calculated section", () => {
    render(<SchemaEditor schema={[calc("SUM(clicks)")]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.queryByTitle("Primary key")).toBeNull();
  });
  it("adds a calculated field with an empty formula, also when there are none", () => {
    const onChange = vi.fn();
    render(<SchemaEditor schema={[]} onChange={onChange} formulaContext={ctx} />);
    fireEvent.click(screen.getByText("+ Add calculated field"));
    expect(onChange).toHaveBeenCalledWith([{ name: "", type: "NUMERIC", pk: false, formula: "" }]);
  });
  it("shows the reference hint only in the popover, once", () => {
    render(<SchemaEditor schema={[calc("SUM(clicks)", "a"), calc("SUM(clicks)", "b")]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.queryByText(HINT)).toBeNull();
    fireEvent.focus(screen.getAllByPlaceholderText("formula")[0]);
    expect(screen.getAllByText(HINT)).toHaveLength(1);
  });
  it("collapses whitespace in the row input but keeps newlines in the popover", () => {
    const onChange = vi.fn();
    render(<SchemaEditor schema={[calc("SUM(clicks)\n  / 2")]} onChange={onChange} formulaContext={ctx} />);
    const input = screen.getByPlaceholderText("formula") as HTMLInputElement;
    expect(input.value).toBe("SUM(clicks) / 2");
    expect(input.readOnly).toBe(true);
    fireEvent.focus(input);
    expect((screen.getByPlaceholderText(PH) as HTMLTextAreaElement).value).toBe("SUM(clicks)\n  / 2");
  });
  it("opens the popover on focus, edits the formula, closes on Escape", () => {
    const onChange = vi.fn();
    render(<SchemaEditor schema={[calc("")]} onChange={onChange} formulaContext={ctx} />);
    expect(screen.queryByPlaceholderText(PH)).toBeNull();
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    const ta = screen.getByPlaceholderText(PH);
    fireEvent.change(ta, { target: { value: "SUM(clicks)" } });
    expect(onChange).toHaveBeenCalledWith([calc("SUM(clicks)")]);
    fireEvent.keyDown(ta, { key: "Escape" });
    expect(screen.queryByPlaceholderText(PH)).toBeNull();
  });
  it("shows an amber marker with the warning, and lists it in the popover", () => {
    render(<SchemaEditor schema={[calc("SUM(click)")]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.getByTestId("formula-warning").getAttribute("title")).toContain('Unknown field "click"');
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(screen.getByText('Unknown field "click"')).toBeTruthy();
  });
  it("says so in the popover when the formula is empty", () => {
    render(<SchemaEditor schema={[calc("  ")]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.getByTestId("formula-warning").getAttribute("title")).toContain("Formula is empty");
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(within(screen.getByRole("dialog")).getByText("Formula is empty")).toBeTruthy();
  });
  it("closes when the mouse goes down outside", () => {
    render(<SchemaEditor schema={[calc("SUM(clicks)")]} onChange={() => {}} formulaContext={ctx} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("closes on window scroll and resize, but not when the textarea scrolls", () => {
    render(<SchemaEditor schema={[calc("SUM(clicks)")]} onChange={() => {}} formulaContext={ctx} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    fireEvent.scroll(screen.getByPlaceholderText(PH));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.scroll(window);
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.resize(window);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("does not reopen on another field after the schema changes under it", () => {
    const a = calc("SUM(clicks)", "a");
    const { rerender } = render(<SchemaEditor schema={[a]} onChange={() => {}} formulaContext={ctx} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    rerender(<SchemaEditor schema={[]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    rerender(<SchemaEditor schema={[calc("", "b")]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
