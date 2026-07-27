import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Dock } from "./Dock";
import { NOTHING_HIDDEN, ALL_HIDDEN } from "../../state/objLabels";

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

  it("opens the flyout 0.5s after hovering Add and lists every hideable part", () => {
    render(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    expect(screen.queryByText("Show everything")).toBeNull(); // delay pending
    openFlyout();
    expect(screen.getByText("Show everything")).toBeTruthy();
    expect(screen.getByText("Hide all")).toBeTruthy();
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes.map(b => b.getAttribute("aria-checked"))).toEqual(["false", "false", "false"]);
    expect(screen.getByText("Input source")).toBeTruthy();
    expect(screen.getByText("Field count")).toBeTruthy();
    expect(screen.getByText("Status dot")).toBeTruthy();
  });

  it("toggles one part at a time, leaving the others alone", () => {
    const onChange = vi.fn();
    render(<Dock {...base} objHidden={{ source: true, fields: false, status: false }} onObjHiddenChange={onChange} />);
    openFlyout();
    fireEvent.click(screen.getByRole("checkbox", { name: /Status dot/ }));
    expect(onChange).toHaveBeenCalledWith({ source: true, fields: false, status: true });
  });

  it("unchecks an already-hidden part", () => {
    const onChange = vi.fn();
    render(<Dock {...base} objHidden={{ source: true, fields: false, status: true }} onObjHiddenChange={onChange} />);
    openFlyout();
    expect(screen.getByRole("checkbox", { name: /Status dot/ }).getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByRole("checkbox", { name: /Status dot/ }));
    expect(onChange).toHaveBeenCalledWith({ source: true, fields: false, status: false });
  });

  it("keeps the flyout open across toggles so several parts can be picked", () => {
    render(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    openFlyout();
    fireEvent.click(screen.getByRole("checkbox", { name: /Field count/ }));
    expect(screen.getByText("Show everything")).toBeTruthy();
    fireEvent.click(screen.getByRole("checkbox", { name: /Status dot/ }));
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("resets to nothing hidden via Show everything, and hides everything via Hide all", () => {
    const onChange = vi.fn();
    render(<Dock {...base} objHidden={ALL_HIDDEN} onObjHiddenChange={onChange} />);
    openFlyout();
    expect(screen.getByTestId("obj-label-hide-all").getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByTestId("obj-label-reset"));
    expect(onChange).toHaveBeenCalledWith(NOTHING_HIDDEN);
    fireEvent.click(screen.getByTestId("obj-label-hide-all"));
    expect(onChange).toHaveBeenLastCalledWith(ALL_HIDDEN);
  });

  it("marks Show everything as the active row when nothing is hidden", () => {
    render(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    openFlyout();
    expect(screen.getByTestId("obj-label-reset").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("obj-label-hide-all").getAttribute("aria-pressed")).toBe("false");
  });

  it("summarises what's hidden in the corner badge", () => {
    const badge = () => screen.getByTestId("obj-label-badge").textContent;
    const { rerender } = render(<Dock {...base} objHidden={NOTHING_HIDDEN} onObjHiddenChange={() => {}} />);
    expect(badge()).toBe("≡");
    rerender(<Dock {...base} objHidden={{ source: false, fields: true, status: false }} onObjHiddenChange={() => {}} />);
    expect(badge()).toBe("#");
    rerender(<Dock {...base} objHidden={{ source: true, fields: false, status: true }} onObjHiddenChange={() => {}} />);
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
