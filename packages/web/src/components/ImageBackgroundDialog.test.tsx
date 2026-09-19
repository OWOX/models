import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageBackgroundDialog } from "./ImageBackgroundDialog";

const props = { format: "png" as const, onConfirm: vi.fn(), onClose: vi.fn() };

describe("ImageBackgroundDialog", () => {
  it("names the format being exported", () => {
    render(<ImageBackgroundDialog {...props} format="vector" />);
    expect(screen.getByText(/Exporting SVG · vector/)).toBeTruthy();
  });

  it("offers white and transparent, defaulting to white", () => {
    render(<ImageBackgroundDialog {...props} />);
    expect((screen.getByRole("radio", { name: /white/i }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: /transparent/i }) as HTMLInputElement).checked).toBe(false);
  });

  it("starts from the caller's remembered choice", () => {
    render(<ImageBackgroundDialog {...props} initial="transparent" />);
    expect((screen.getByRole("radio", { name: /transparent/i }) as HTMLInputElement).checked).toBe(true);
  });

  it("confirms the selected background", () => {
    const onConfirm = vi.fn();
    render(<ImageBackgroundDialog {...props} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("radio", { name: /transparent/i }));
    fireEvent.click(screen.getByRole("button", { name: /download/i }));
    expect(onConfirm).toHaveBeenCalledWith("transparent");
  });

  it("cancels without exporting", () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(<ImageBackgroundDialog {...props} onConfirm={onConfirm} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
