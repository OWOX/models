import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Dock } from "./Dock";

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

  it("opens the flyout 0.5s after hovering Add and lists all four modes", () => {
    render(<Dock {...base} objLabelMode="all" onObjLabelModeChange={() => {}} />);
    const add = screen.getByRole("button", { name: /add object/i });
    fireEvent.mouseEnter(add.parentElement!);
    expect(screen.queryByText("Show everything")).toBeNull(); // delay pending
    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.getByText("Show everything")).toBeTruthy();
    expect(screen.getByText("Hide input source")).toBeTruthy();
    expect(screen.getByText("Hide field count")).toBeTruthy();
    expect(screen.getByText("Hide both")).toBeTruthy();
  });

  it("calls onObjLabelModeChange with the picked mode", () => {
    const onPick = vi.fn();
    render(<Dock {...base} objLabelMode="all" onObjLabelModeChange={onPick} />);
    fireEvent.mouseEnter(screen.getByRole("button", { name: /add object/i }).parentElement!);
    act(() => { vi.advanceTimersByTime(500); });
    fireEvent.click(screen.getByText("Hide both"));
    expect(onPick).toHaveBeenCalledWith("both");
  });

  it("shows the glyph of the active mode as a badge", () => {
    render(<Dock {...base} objLabelMode="noFields" onObjLabelModeChange={() => {}} />);
    expect(screen.getByTestId("obj-label-badge").textContent).toBe("#");
  });

  it("still activates the Add tool when the button itself is clicked", () => {
    const onToolChange = vi.fn();
    render(<Dock {...base} onToolChange={onToolChange} objLabelMode="all" onObjLabelModeChange={() => {}} />);
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
