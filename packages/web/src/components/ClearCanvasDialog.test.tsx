import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClearCanvasDialog } from "./ClearCanvasDialog";

const base = { counts: { marts: 3, relationships: 2 } };

describe("ClearCanvasDialog", () => {
  afterEach(() => localStorage.clear());

  it("warns it's permanent and shows the counts", () => {
    render(<ClearCanvasDialog {...base} onDelete={() => {}} onExportAndDelete={() => {}} onClose={() => {}} />);
    expect(screen.getByText(/permanently deletes everything/i)).toBeTruthy();
    expect(screen.getByText(/can't be undone/i)).toBeTruthy();
    expect(screen.getByText("3 marts")).toBeTruthy();
    expect(screen.getByText("2 relationships")).toBeTruthy();
  });

  it("singularises the counts", () => {
    render(<ClearCanvasDialog counts={{ marts: 1, relationships: 1 }} onDelete={() => {}} onExportAndDelete={() => {}} onClose={() => {}} />);
    expect(screen.getByText("1 mart")).toBeTruthy();
    expect(screen.getByText("1 relationship")).toBeTruthy();
  });

  it("wires Delete, Export & delete and Cancel", () => {
    const onDelete = vi.fn(), onExportAndDelete = vi.fn(), onClose = vi.fn();
    render(<ClearCanvasDialog {...base} onDelete={onDelete} onExportAndDelete={onExportAndDelete} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^export & delete$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onExportAndDelete).toHaveBeenCalledTimes(1);
    expect(onExportAndDelete).toHaveBeenCalledWith("okf");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when clicking the backdrop", () => {
    const onClose = vi.fn();
    const { container } = render(<ClearCanvasDialog {...base} onDelete={() => {}} onExportAndDelete={() => {}} onClose={onClose} />);
    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("toggles to Ossie and exports in that format", () => {
    const onExportAndDelete = vi.fn();
    render(<ClearCanvasDialog {...base} onDelete={() => {}} onExportAndDelete={onExportAndDelete} onClose={() => {}} />);
    expect(screen.getByRole("radiogroup", { name: "Export format" })).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Ossie" }));
    fireEvent.click(screen.getByRole("button", { name: /^export & delete$/i }));
    expect(onExportAndDelete).toHaveBeenCalledWith("ossie");
  });

  it("honours initialFormat and shows the new copy", () => {
    render(<ClearCanvasDialog {...base} initialFormat="ossie" onDelete={() => {}} onExportAndDelete={() => {}} onClose={() => {}} />);
    expect(screen.getByRole("radio", { name: "Ossie" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText(/exporting the model \(OKF or Ossie\) to your computer first/)).toBeTruthy();
  });
});
