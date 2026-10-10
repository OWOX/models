import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const h = vi.hoisted(() => ({ me: { projectTitle: "Acme project" } as { projectTitle?: string } }));
vi.mock("../../lib/api", () => ({
  api: async (path: string) => {
    if (path === "/api/me") return h.me;
    if (path === "/api/storages") return [{ id: "s1", title: "Storage 1", type: "GOOGLE_BIGQUERY" }];
    if (path.startsWith("/api/owox-import")) return {
      storageId: "s1", total: 1, truncated: false, relationships: [],
      marts: [{ id: "m1", title: "Orders", status: "PUBLISHED", schema: [], inputSource: "SQL", definition: null }],
    };
    throw new Error("401");
  },
}));

import { App } from "../../App";
import { store } from "./Canvas";

const OSSIE_NO_NAME = "version: 0.2.0.dev0\ndatasets:\n  - name: orders\n    source: p.d.orders\n    fields:\n      - name: id\n        expression: { dialects: [{ dialect: BIGQUERY, expression: id }] }\n";
const seed = () => ({
  storageId: null, description: "Current description",
  nodes: [{ key: "a", title: "A", inputSource: "VIEW" as const, definition: "p.d.a", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 0, y: 0 }, status: "pending" as const, owoxId: null }],
  edges: [],
});
const blockText = async () => (await screen.findByRole("button", { name: /Edit model name and description/ })).textContent ?? "";

async function owoxImport(mode: RegExp) {
  fireEvent.click(await screen.findByRole("button", { name: "More OWOX actions" }));
  fireEvent.click(screen.getByRole("menuitem", { name: /Import from OWOX project/ }));
  fireEvent.click(await screen.findByText("Continue"));
  await screen.findByText(/Will import 1 marts/);
  fireEvent.click(screen.getByText(mode));
  const btns = screen.getAllByRole("button", { name: /^import$/i });
  fireEvent.click(btns[btns.length - 1]);
}
async function fileImport(mode: RegExp) {
  fireEvent.click((await screen.findAllByRole("button", { name: /^import$/i }))[0]);
  await screen.findByText("Import model");
  fireEvent.click(await screen.findByRole("button", { name: /^paste$/i }));
  fireEvent.change(screen.getByPlaceholderText(/path\/to\/file\.md/i), { target: { value: OSSIE_NO_NAME } });
  await waitFor(() => expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy());
  fireEvent.click(screen.getByText(mode));
  const btns = screen.getAllByRole("button", { name: /^import$/i });
  fireEvent.click(btns[btns.length - 1]);
}

describe("model name on Replace / Merge imports", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("mc.modelName.v1", "Old name");
    h.me = { projectTitle: "Acme project" };
    (window as any).DOMMatrixReadOnly ??= class { m22 = 1; constructor(_t?: string) {} };
    store.set(seed());
  });

  it("OWOX Replace names the model after the project", async () => {
    render(<App />);
    await owoxImport(/Replace the canvas/);
    await waitFor(() => expect(store.get().nodes[0].title).toBe("Orders"));
    expect(await blockText()).toContain("Acme project");
    expect(store.get().description).toBeUndefined();
  });

  it("OWOX Replace without a project title falls back to the default name", async () => {
    h.me = {};
    render(<App />);
    await owoxImport(/Replace the canvas/);
    await waitFor(() => expect(store.get().nodes[0].title).toBe("Orders"));
    expect(await blockText()).toContain("My awesome data model");
  });

  it("OWOX Merge keeps the current name", async () => {
    render(<App />);
    await owoxImport(/Merge into the canvas/);
    await waitFor(() => expect(store.get().nodes.length).toBe(2));
    expect(await blockText()).toContain("Old name");
  });

  it("file Replace without a name resets to the default name", async () => {
    render(<App />);
    await fileImport(/Replace the canvas/i);
    await waitFor(() => expect(store.get().nodes[0].title).toBe("orders"));
    expect(await blockText()).toContain("My awesome data model");
  });

  it("file Merge keeps the current name", async () => {
    render(<App />);
    await fileImport(/Merge into the canvas/i);
    await waitFor(() => expect(store.get().nodes.length).toBe(2));
    expect(await blockText()).toContain("Old name");
  });
});
