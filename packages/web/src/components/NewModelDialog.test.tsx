import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewModelDialog } from "./NewModelDialog";

const base = { counts: { marts: 3, relationships: 2 }, savedModel: false };

describe("NewModelDialog", () => {
  afterEach(() => localStorage.clear());

  it("exports in the default format (okf)", () => {
    const onExportAndStart = vi.fn();
    render(<NewModelDialog {...base} onStart={() => {}} onExportAndStart={onExportAndStart} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Export & start" }));
    expect(onExportAndStart).toHaveBeenCalledWith("okf");
  });

  it("switches to Ossie with the toggle", () => {
    const onExportAndStart = vi.fn();
    render(<NewModelDialog {...base} onStart={() => {}} onExportAndStart={onExportAndStart} onClose={() => {}} />);
    const group = screen.getByRole("radiogroup", { name: "Export format" });
    expect(group).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "Ossie" }));
    fireEvent.click(screen.getByRole("button", { name: "Export & start" }));
    expect(onExportAndStart).toHaveBeenCalledWith("ossie");
  });

  it("honours initialFormat and uses the new copy", () => {
    const { rerender } = render(<NewModelDialog {...base} initialFormat="ossie" onStart={() => {}} onExportAndStart={() => {}} onClose={() => {}} />);
    expect(screen.getByRole("radio", { name: "Ossie" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText(/export the model first if you want to keep a copy/i)).toBeTruthy();
    rerender(<NewModelDialog {...base} savedModel initialFormat="ossie" onStart={() => {}} onExportAndStart={() => {}} onClose={() => {}} />);
    expect(screen.getByText(/Export the model to keep them\./)).toBeTruthy();
  });
});

describe("NewModelDialog — export warnings", () => {
  afterEach(() => localStorage.clear());
  const warn = ["relationship A → B is many-to-many — not exported"];

  it("stays open with the list; Start anyway starts", async () => {
    const onStart = vi.fn(), onExportAndStart = vi.fn(async () => warn); // the Ossie writer loads on demand
    render(<NewModelDialog {...base} initialFormat="ossie" onStart={onStart} onExportAndStart={onExportAndStart} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Export & start" }));
    expect((await screen.findByRole("alert")).textContent).toContain("can't hold everything");
    expect(onStart).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Start anyway" }));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("Export OKF instead exports okf", async () => {
    const onExportAndStart = vi.fn((f: string) => (f === "ossie" ? warn : []));
    render(<NewModelDialog {...base} initialFormat="ossie" onStart={() => {}} onExportAndStart={onExportAndStart} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Export & start" }));
    fireEvent.click(await screen.findByRole("button", { name: "Export OKF instead" }));
    expect(onExportAndStart).toHaveBeenLastCalledWith("okf");
  });

  it("no warnings: no alert", async () => {
    render(<NewModelDialog {...base} onStart={() => {}} onExportAndStart={() => []} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Export & start" }));
    await Promise.resolve();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
