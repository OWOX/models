import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("../../lib/api", () => ({ api: async () => { throw new Error("401"); } }));

import { App } from "../../App";
import { store } from "./Canvas";

// Two marts joined many-to-many: Ossie can't hold that relationship, so the export warns.
const lossy = () => ({
  storageId: null,
  nodes: ["a", "b"].map((k, i) => ({ key: k, title: k.toUpperCase(), inputSource: "VIEW" as const, definition: `p.d.${k}`, schema: [{ name: "id", type: "STRING", pk: true }], position: { x: i * 300, y: 0 }, status: "pending" as const, owoxId: null })),
  edges: [{ id: "e1", from: "a", to: "b", keys: [{ left: "id", right: "id" }], bidirectional: false, cardinality: "N:N" as const }],
});

describe("Canvas Ossie export with warnings", () => {
  beforeEach(() => {
    localStorage.clear();
    // jsdom lacks DOMMatrixReadOnly, which React Flow reads when measuring nodes.
    (window as any).DOMMatrixReadOnly ??= class { m22 = 1; constructor(_t?: string) {} };
    (URL as unknown as { createObjectURL: () => string }).createObjectURL = () => "blob:x";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    store.set(lossy());
  });

  it("menu export shows a sticky status toast with the warnings", async () => {
    render(<App />);
    fireEvent.click(await screen.findByText("Export"));
    fireEvent.click(screen.getByRole("menuitem", { name: /Apache Ossie/ }));
    const toast = await screen.findByRole("status");
    expect(toast.textContent).toContain("Exported as Apache Ossie with warnings:");
    expect(toast.textContent).toContain("many-to-many");
    expect(toast.textContent).not.toContain("Not included");
    fireEvent.click(screen.getByRole("button", { name: "Dismiss warning" }));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("Clear canvas: Ossie export with warnings keeps the dialog open; Delete anyway wipes", async () => {
    render(<App />);
    fireEvent.click(await screen.findByLabelText(/Clear canvas/));
    fireEvent.click(screen.getByRole("radio", { name: "Ossie" }));
    fireEvent.click(screen.getByRole("button", { name: "Export & delete" }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("can't hold everything");
    expect(store.get().nodes).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Delete anyway" }));
    await waitFor(() => expect(store.get().nodes).toHaveLength(0));
  });

  it("Clear canvas: Export OKF instead exports and wipes", async () => {
    render(<App />);
    fireEvent.click(await screen.findByLabelText(/Clear canvas/));
    fireEvent.click(screen.getByRole("radio", { name: "Ossie" }));
    fireEvent.click(screen.getByRole("button", { name: "Export & delete" }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Export OKF instead" }));
    await waitFor(() => expect(store.get().nodes).toHaveLength(0));
  });
});
