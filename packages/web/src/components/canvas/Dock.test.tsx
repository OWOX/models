import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Dock } from "./Dock";
import { NOTHING_HIDDEN, ALL_HIDDEN, type ObjHidden } from "../../state/objLabels";

const base = {
  activeTool: "select" as const,
  onToolChange: () => {},
  viewMode: "compact" as const,
  onToggleView: () => {},
  onClear: () => {},
};

describe("Dock relationship-labels flyout", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("opens the flyout 0.5s after hovering Connect and lists all four modes", () => {
    render(<Dock {...base} relLabelMode="all" onRelLabelModeChange={() => {}} />);
    const connect = screen.getByRole("button", { name: /connect/i });
    fireEvent.mouseEnter(connect.parentElement!);
    expect(screen.queryByText("Show everything")).toBeNull(); // not yet — delay pending
    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.getByText("Show everything")).toBeTruthy();
    expect(screen.getByText("Defined keys only")).toBeTruthy();
    expect(screen.getByText("Undefined keys only")).toBeTruthy();
    expect(screen.getByText("Hide all labels")).toBeTruthy();
  });

  it("calls onRelLabelModeChange with the picked mode", () => {
    const onPick = vi.fn();
    render(<Dock {...base} relLabelMode="all" onRelLabelModeChange={onPick} />);
    fireEvent.mouseEnter(screen.getByRole("button", { name: /connect/i }).parentElement!);
    act(() => { vi.advanceTimersByTime(500); });
    fireEvent.click(screen.getByText("Hide all labels"));
    expect(onPick).toHaveBeenCalledWith("hidden");
  });

  it("shows the glyph of the active mode as a badge", () => {
    render(<Dock {...base} relLabelMode="undefined" onRelLabelModeChange={() => {}} />);
    expect(screen.getByTestId("rel-label-badge").textContent).toBe("?");
  });

  it("still activates the Connect tool when the button itself is clicked", () => {
    const onToolChange = vi.fn();
    render(<Dock {...base} onToolChange={onToolChange} relLabelMode="all" onRelLabelModeChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /connect/i }));
    expect(onToolChange).toHaveBeenCalledWith("connect");
  });
});

describe("Dock object-labels flyout", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const openFlyout = () => {
    fireEvent.mouseEnter(screen.getByRole("button", { name: /add object/i }).parentElement!);
    act(() => { vi.advanceTimersByTime(500); });
  };

  const hide = (...parts: (keyof ObjHidden)[]): ObjHidden =>
    ({ ...NOTHING_HIDDEN, ...Object.fromEntries(parts.map(p => [p, true])) });

  it("opens the flyout 0.5s after hovering Add with every part ticked by default", () => {
    render(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    expect(screen.queryByText("Input source")).toBeNull(); // delay pending
    openFlyout();
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes.map(b => b.getAttribute("aria-checked"))).toEqual(["true", "true", "true", "true", "true", "true"]);
    expect(screen.getByRole("group", { name: "Card content" }).textContent)
      .toBe("Card contentInput sourceFieldsRelationshipsStatus badge");
    expect(screen.getByRole("group", { name: "Field rows" }).textContent)
      .toBe("Field rowsField aliasesField descriptions");
  });

  it("offers the field rows only while the card shows its fields", () => {
    const { rerender } = render(<Dock {...base} objHidden={hide("fields")} onObjHiddenChange={() => {}} />);
    openFlyout();
    expect(screen.queryByRole("group", { name: "Field rows" })).toBeNull();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    rerender(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    expect(screen.getByRole("group", { name: "Field rows" })).toBeTruthy();
  });

  it("reflects a hidden part as an unticked box", () => {
    render(<Dock {...base} objHidden={hide("relationships")} onObjHiddenChange={() => {}} />);
    openFlyout();
    expect(screen.getByRole("checkbox", { name: "Relationships" }).getAttribute("aria-checked")).toBe("false");
    expect(screen.getByRole("checkbox", { name: "Fields" }).getAttribute("aria-checked")).toBe("true");
  });

  it("unticking a part hides it, leaving the others alone", () => {
    const onChange = vi.fn();
    render(<Dock {...base} objHidden={hide("source")} onObjHiddenChange={onChange} />);
    openFlyout();
    fireEvent.click(screen.getByRole("checkbox", { name: "Status badge" }));
    expect(onChange).toHaveBeenCalledWith(hide("source", "status"));
  });

  it("re-ticking a part brings it back", () => {
    const onChange = vi.fn();
    render(<Dock {...base} objHidden={hide("source", "fieldAlias")} onObjHiddenChange={onChange} />);
    openFlyout();
    fireEvent.click(screen.getByRole("checkbox", { name: "Field aliases" }));
    expect(onChange).toHaveBeenCalledWith(hide("source"));
  });

  it("keeps the flyout open across toggles so several parts can be picked", () => {
    render(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    openFlyout();
    fireEvent.click(screen.getByRole("checkbox", { name: "Fields" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(6);
    fireEvent.click(screen.getByRole("checkbox", { name: "Relationships" }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(6);
  });

  it("shows everything via Show all, and strips the cards via Title only", () => {
    const onChange = vi.fn();
    render(<Dock {...base} objHidden={ALL_HIDDEN} onObjHiddenChange={onChange} />);
    openFlyout();
    expect(screen.getByTestId("obj-label-hide-all").getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Show all" }));
    expect(onChange).toHaveBeenCalledWith(NOTHING_HIDDEN);
    fireEvent.click(screen.getByRole("button", { name: "Title only" }));
    expect(onChange).toHaveBeenLastCalledWith(ALL_HIDDEN);
  });

  it("marks Show all as active when nothing is hidden", () => {
    render(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    openFlyout();
    expect(screen.getByTestId("obj-label-reset").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("obj-label-hide-all").getAttribute("aria-pressed")).toBe("false");
  });

  it("summarises what's hidden in the corner badge", () => {
    const badge = () => screen.getByTestId("obj-label-badge").textContent;
    const { rerender } = render(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    expect(badge()).toBe("≡");
    rerender(<Dock {...base} objHidden={hide("fields")} onObjHiddenChange={() => {}} />);
    expect(badge()).toBe("1");
    rerender(<Dock {...base} objHidden={hide("source", "status")} onObjHiddenChange={() => {}} />);
    expect(badge()).toBe("2");
    rerender(<Dock {...base} objHidden={ALL_HIDDEN} onObjHiddenChange={() => {}} />);
    expect(badge()).toBe("⊘");
  });

  it("still activates the Add tool when the button itself is clicked", () => {
    const onToolChange = vi.fn();
    render(<Dock {...base} onToolChange={onToolChange} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /add object/i }));
    expect(onToolChange).toHaveBeenCalledWith("add");
  });
});

describe("Dock ERD toggle", () => {
  it("renders the ERD toggle and fires onToggleView when clicked", () => {
    const onToggleView = vi.fn();
    render(
      <Dock activeTool="select" onToolChange={() => {}} viewMode="compact" onToggleView={onToggleView} onClear={() => {}} />,
    );
    const toggle = screen.getByRole("button", { name: /ERD view/i });
    fireEvent.click(toggle);
    expect(onToggleView).toHaveBeenCalledTimes(1);
  });

  it("reflects the active ERD state via aria-pressed", () => {
    render(
      <Dock activeTool="select" onToolChange={() => {}} viewMode="erd" onToggleView={() => {}} onClear={() => {}} />,
    );
    expect(screen.getByRole("button", { name: /ERD view/i }).getAttribute("aria-pressed")).toBe("true");
  });

  it("fires onClear when the Clear canvas button is clicked", () => {
    const onClear = vi.fn();
    render(
      <Dock activeTool="select" onToolChange={() => {}} viewMode="compact" onToggleView={() => {}} onClear={onClear} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Clear canvas/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
