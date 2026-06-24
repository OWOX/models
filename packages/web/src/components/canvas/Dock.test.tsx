import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dock } from "./Dock";

describe("Dock ERD toggle", () => {
  it("renders the ERD toggle and fires onToggleView when clicked", () => {
    const onToggleView = vi.fn();
    render(
      <Dock activeTool="select" onToolChange={() => {}} viewMode="compact" onToggleView={onToggleView} />,
    );
    const toggle = screen.getByRole("button", { name: /ERD view/i });
    fireEvent.click(toggle);
    expect(onToggleView).toHaveBeenCalledTimes(1);
  });

  it("reflects the active ERD state via aria-pressed", () => {
    render(
      <Dock activeTool="select" onToolChange={() => {}} viewMode="erd" onToggleView={() => {}} />,
    );
    expect(screen.getByRole("button", { name: /ERD view/i }).getAttribute("aria-pressed")).toBe("true");
  });
});
