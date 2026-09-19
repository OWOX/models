import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SharePanel } from "./SharePanel";

describe("SharePanel", () => {
  const defaultProps = {
    shareUrl: "https://model.owox.com/#m=abc123",
    onCopy: vi.fn(),
    onExportImage: vi.fn(),
  };

  it("renders the perk description header with Share2 icon label, title and description", () => {
    render(<SharePanel {...defaultProps} />);
    expect(screen.getByText("Named sharing")).toBeTruthy();
    expect(screen.getByText("Share a model by name with a link")).toBeTruthy();
  });

  it("shows the shareUrl in a read-only input", () => {
    render(<SharePanel {...defaultProps} />);
    const input = screen.getByDisplayValue("https://model.owox.com/#m=abc123");
    expect(input).toBeTruthy();
    expect((input as HTMLInputElement).readOnly).toBe(true);
  });

  it("calls onCopy when Copy button is clicked", () => {
    const onCopy = vi.fn();
    render(<SharePanel {...defaultProps} onCopy={onCopy} />);
    fireEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it("offers all three image formats", () => {
    render(<SharePanel {...defaultProps} />);
    expect(screen.getByRole("button", { name: "PNG image" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "SVG · vector" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "SVG · exact snapshot" })).toBeTruthy();
  });

  it.each([
    ["PNG image", "png"],
    ["SVG · vector", "vector"],
    ["SVG · exact snapshot", "snapshot"],
  ])("exports %s as the %s format", (label, format) => {
    const onExportImage = vi.fn();
    render(<SharePanel {...defaultProps} onExportImage={onExportImage} />);
    fireEvent.click(screen.getByRole("button", { name: label }));
    expect(onExportImage).toHaveBeenCalledWith(format);
  });

  it("leaves the background choice to the dialog that follows", () => {
    render(<SharePanel {...defaultProps} />);
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("explains each format on hover", () => {
    render(<SharePanel {...defaultProps} />);
    expect(screen.queryByRole("tooltip")).toBeNull();
    fireEvent.mouseEnter(screen.getByRole("button", { name: "About SVG · vector" }));
    expect(screen.getByRole("tooltip").textContent).toMatch(/Figma/);
    fireEvent.mouseLeave(screen.getByRole("button", { name: "About SVG · vector" }));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("warns that the snapshot format is the compromised one", () => {
    render(<SharePanel {...defaultProps} />);
    fireEvent.mouseEnter(screen.getByRole("button", { name: "About SVG · exact snapshot" }));
    expect(screen.getByRole("tooltip").textContent).toMatch(/Safari renders it wrong/);
  });

  it("renders without gating — no sign-in prompt visible", () => {
    render(<SharePanel {...defaultProps} />);
    expect(screen.queryByText(/sign in/i)).toBeNull();
    expect(screen.queryByText(/create.*account/i)).toBeNull();
  });
});
