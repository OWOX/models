import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("../../lib/api", () => ({ api: async () => { throw new Error("401"); } }));

import { App } from "../../App";
import { store } from "./Canvas";

const OSSIE = "version: 0.2.0.dev0\nname: imported_name\ndescription: Imported description\ndatasets:\n  - name: orders\n    source: p.d.orders\n    fields:\n      - name: id\n        expression: { dialects: [{ dialect: BIGQUERY, expression: id }] }\n";
const seed = () => ({
  storageId: null, description: "Current description",
  nodes: [{ key: "a", title: "A", inputSource: "VIEW" as const, definition: "p.d.a", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 0, y: 0 }, status: "pending" as const, owoxId: null }],
  edges: [],
});

async function importOssie(mode: RegExp) {
  fireEvent.click(await screen.findByText("Import"));
  fireEvent.click(await screen.findByRole("button", { name: /^paste$/i }));
  fireEvent.change(screen.getByPlaceholderText(/path\/to\/file\.md/i), { target: { value: OSSIE } });
  await waitFor(() => expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy());
  fireEvent.click(screen.getByText(mode));
  const btns = screen.getAllByRole("button", { name: /^import$/i });
  fireEvent.click(btns[btns.length - 1]);
}

describe("Canvas model block and sheet", () => {
  beforeEach(() => {
    localStorage.clear();
    (window as any).DOMMatrixReadOnly ??= class { m22 = 1; constructor(_t?: string) {} };
    store.set(seed());
  });

  it("opens the Model sheet from the block and edits name and description", async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Edit model name and description" }));
    const dialog = await screen.findByRole("dialog", { name: "Model" });
    expect(dialog).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Renamed" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Edited text" } });
    expect(store.get().description).toBe("Edited text");
    expect(screen.getByRole("button", { name: "Edit model name and description" }).textContent).toContain("Renamed");
  });

  it("Replace import applies the file's name and description", async () => {
    render(<App />);
    await importOssie(/Replace the canvas/i);
    await waitFor(() => expect(store.get().description).toBe("Imported description"));
    expect(screen.getByRole("button", { name: "Edit model name and description" }).textContent).toContain("imported_name");
  });

  it("Merge import keeps the current name and description", async () => {
    render(<App />);
    const before = (await screen.findByRole("button", { name: "Edit model name and description" })).textContent;
    await importOssie(/Merge into the canvas/i);
    await waitFor(() => expect(store.get().nodes.length).toBe(2));
    expect(store.get().description).toBe("Current description");
    expect(screen.getByRole("button", { name: "Edit model name and description" }).textContent).toBe(before);
  });
});
