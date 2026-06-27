import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClearCanvasDialog } from "./ClearCanvasDialog";

const base = { counts: { marts: 3, relationships: 2 } };

describe("ClearCanvasDialog", () => {
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

  it("wires Delete, Export OKF & delete and Cancel", () => {
    const onDelete = vi.fn(), onExportAndDelete = vi.fn(), onClose = vi.fn();
    render(<ClearCanvasDialog {...base} onDelete={onDelete} onExportAndDelete={onExportAndDelete} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    fireEvent.click(screen.getByRole("button", { name: /export okf & delete/i }));
    fireEvent.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onExportAndDelete).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when clicking the backdrop", () => {
    const onClose = vi.fn();
    const { container } = render(<ClearCanvasDialog {...base} onDelete={() => {}} onExportAndDelete={() => {}} onClose={onClose} />);
    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
