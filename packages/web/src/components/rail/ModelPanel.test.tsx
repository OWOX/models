import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModelPanel } from "./ModelPanel";

describe("ModelPanel", () => {
  const base = { name: "Acme", description: "About", martCount: 3, relCount: 2, onNameChange: () => {}, onDescriptionChange: () => {} };
  it("shows both fields and the counts line", () => {
    render(<ModelPanel {...base} />);
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Acme");
    expect((screen.getByLabelText("Description") as HTMLTextAreaElement).value).toBe("About");
    expect(screen.getByText("3 marts · 2 relationships")).toBeTruthy();
  });
  it("reports edits", () => {
    const n = vi.fn(), d = vi.fn();
    render(<ModelPanel {...base} onNameChange={n} onDescriptionChange={d} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Beta" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "New text" } });
    expect(n).toHaveBeenCalledWith("Beta");
    expect(d).toHaveBeenCalledWith("New text");
  });
  it("explains the description in an info tip", () => {
    render(<ModelPanel {...base} />);
    expect(screen.getByLabelText("What this model is for. Included in exports (OKF index / Ossie model) and shared with AI tools.")).toBeTruthy();
  });
});
