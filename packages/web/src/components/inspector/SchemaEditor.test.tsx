import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { SchemaEditor } from "./SchemaEditor";
import { CALC_GLYPH } from "../canvas/calcGlyph";

const ctx = { own: ["clicks", "ctr"], joined: [{ alias: "orders", title: "Orders", fields: ["amount"] }] };
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
  it("explains the glyph on hover for both levels", () => {
    render(<SchemaEditor schema={[calc("SUM(clicks)", "total"), calc("clicks * 2", "double")]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.getByLabelText("Metric").getAttribute("title")).toBe(CALC_GLYPH.metric.tip);
    expect(screen.getByLabelText("Calculated column").getAttribute("title")).toBe(CALC_GLYPH.column.tip);
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
  it("focuses the textarea right after opening", () => {
    render(<SchemaEditor schema={[calc("SUM(clicks)")]} onChange={() => {}} formulaContext={ctx} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(document.activeElement).toBe(screen.getByPlaceholderText(PH));
  });
  it("never renders the old Fields: hint", () => {
    render(<SchemaEditor schema={[calc("SUM(clicks)")]} onChange={() => {}} formulaContext={ctx} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(screen.queryByText(/Fields:/)).toBeNull();
    expect(screen.queryByText(/Joined:/)).toBeNull();
  });
  it("shows INSERT FIELD chips: own (minus the edited field) and a joined group", () => {
    render(<SchemaEditor schema={[calc("SUM(clicks)")]} onChange={() => {}} formulaContext={ctx} />);
    expect(screen.queryByText("Insert field")).toBeNull();
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    const dlg = within(screen.getByRole("dialog"));
    expect(dlg.getByText("Insert field")).toBeTruthy();
    expect(dlg.getByRole("button", { name: "clicks" })).toBeTruthy();
    expect(dlg.queryByRole("button", { name: "ctr" })).toBeNull();
    expect(dlg.getByText("orders ›").getAttribute("title")).toBe("Orders");
    expect(dlg.getByRole("button", { name: "amount" })).toBeTruthy();
  });
  it("has no INSERT FIELD block without fields or context", () => {
    const { unmount } = render(<SchemaEditor schema={[calc("x")]} onChange={() => {}} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(screen.queryByText("Insert field")).toBeNull();
    unmount();
    render(<SchemaEditor schema={[calc("x")]} onChange={() => {}} formulaContext={{ own: ["ctr", " "], joined: [] }} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    expect(screen.queryByText("Insert field")).toBeNull();
  });
  it("inserts an own chip at the caret end, replaces a selection, and stays open", () => {
    const onChange = vi.fn();
    render(<SchemaEditor schema={[calc("SUM(")]} onChange={onChange} formulaContext={ctx} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    const dlg = within(screen.getByRole("dialog"));
    fireEvent.click(dlg.getByRole("button", { name: "clicks" }));
    expect(onChange).toHaveBeenLastCalledWith([calc("SUM(clicks")]);
    expect(screen.getByRole("dialog")).toBeTruthy();
    const ta = screen.getByPlaceholderText(PH) as HTMLTextAreaElement;
    ta.setSelectionRange(0, 3);
    fireEvent.click(dlg.getByRole("button", { name: "clicks" }));
    expect(onChange).toHaveBeenLastCalledWith([calc("clicks(")]);
  });
  it("inserts a joined chip as alias.field and keeps focus on the textarea", () => {
    const onChange = vi.fn();
    render(<SchemaEditor schema={[calc("1+")]} onChange={onChange} formulaContext={ctx} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "amount" }));
    expect(onChange).toHaveBeenLastCalledWith([calc("1+orders.amount")]);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByPlaceholderText(PH));
  });
  it("collapses long chip lists to 8 with a +N more toggle", () => {
    const own = Array.from({ length: 12 }, (_, i) => `f${i}`);
    render(<SchemaEditor schema={[calc("x")]} onChange={() => {}} formulaContext={{ own, joined: [] }} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    const dlg = within(screen.getByRole("dialog"));
    expect(dlg.queryByRole("button", { name: "f8" })).toBeNull();
    fireEvent.click(dlg.getByRole("button", { name: "+4 more" }));
    expect(dlg.getByRole("button", { name: "f11" })).toBeTruthy();
    fireEvent.click(dlg.getByRole("button", { name: "Show less" }));
    expect(dlg.queryByRole("button", { name: "f8" })).toBeNull();
  });
  it("hides the unplaced popover with opacity and pointer-events, never visibility", () => {
    // The placement layout effect reads scrollHeight before it sets the position, so
    // the style seen there is the unplaced one (focus must still be possible).
    const seen: string[] = [];
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute("role") === "dialog") seen.push(this.getAttribute("style") ?? "");
      return 100;
    });
    render(<SchemaEditor schema={[calc("x")]} onChange={() => {}} formulaContext={ctx} />);
    fireEvent.focus(screen.getByPlaceholderText("formula"));
    vi.restoreAllMocks();
    expect(seen.length).toBeGreaterThan(0);
    expect(seen[0]).toContain("opacity: 0");
    expect(seen[0]).toContain("pointer-events: none");
    expect(seen[0]).not.toContain("visibility");
  });
  describe("placement", () => {
    const rect = (top: number, bottom: number) => ({ top, bottom, left: 100, right: 600, width: 500, height: bottom - top, x: 100, y: top, toJSON() {} }) as DOMRect;
    const open = (top: number, bottom: number) => {
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect(top, bottom));
      vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(300);
      Object.defineProperty(window, "innerHeight", { configurable: true, value: 600 });
      render(<SchemaEditor schema={[calc("x")]} onChange={() => {}} formulaContext={ctx} />);
      fireEvent.focus(screen.getByPlaceholderText("formula"));
      return screen.getByRole("dialog");
    };
    afterEach(() => vi.restoreAllMocks());
    it("flips above near the bottom and caps maxHeight", () => {
      const dlg = open(540, 560);
      expect(dlg.style.top).toBe("");
      expect(parseFloat(dlg.style.bottom)).toBe(600 - 540 + 4);
      expect(dlg.style.maxHeight).not.toBe("");
      expect(dlg.className).toContain("overflow-y-auto");
    });
    it("opens below near the top", () => {
      const dlg = open(20, 40);
      expect(parseFloat(dlg.style.top)).toBeGreaterThan(40);
      expect(dlg.style.maxHeight).not.toBe("");
    });
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
