import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const h = vi.hoisted(() => ({
  createModel: vi.fn(async () => "m1"),
  updateModel: vi.fn(async () => {}),
  downloads: [] as { files: Record<string, string>; name?: string }[],
}));
vi.mock("../../lib/api", () => ({ api: async () => { throw new Error("401"); } }));
vi.mock("../../lib/supabase", () => ({ supabase: null, supabaseEnabled: true }));
vi.mock("../../lib/account", () => ({
  AccountProvider: ({ children }: { children: unknown }) => children,
  useAccount: () => ({ enabled: true, ready: true, user: { id: "u1", email: "a@b.co" }, signInWithGoogle: async () => {}, signInWithGitHub: async () => {}, signInWithEmail: async () => {}, signOut: async () => {} }),
}));
vi.mock("../../lib/models", async importOriginal => ({
  ...(await importOriginal<typeof import("../../lib/models")>()),
  createModel: h.createModel, updateModel: h.updateModel,
  createVersion: async () => {}, listModels: async () => [], listVersions: async () => [],
}));
vi.mock("../../okf/io", async importOriginal => {
  const real = await importOriginal<typeof import("../../okf/io")>();
  return { ...real, downloadBundle: (files: Record<string, string>, name?: string) => { h.downloads.push({ files, name }); } };
});

import { App } from "../../App";
import { store } from "./Canvas";
import { loadModelFiles } from "../../okf/io";

const OSSIE = "version: 0.2.0.dev0\nname: imported_name\ndatasets:\n  - name: orders\n    source: p.d.orders\n    fields:\n      - name: id\n        expression: { dialects: [{ dialect: BIGQUERY, expression: id }] }\n";
const seed = () => ({
  storageId: null,
  nodes: [{ key: "a", title: "A", inputSource: "VIEW" as const, definition: "p.d.a", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 0, y: 0 }, status: "pending" as const, owoxId: null }],
  edges: [],
});

describe("Replace and OKF export use the model name", () => {
  beforeEach(() => {
    localStorage.clear();
    h.createModel.mockClear(); h.updateModel.mockClear(); h.downloads.length = 0;
    (window as any).DOMMatrixReadOnly ??= class { m22 = 1; constructor(_t?: string) {} };
    store.set(seed());
  });

  it("a Replace import is a new model: the next Save creates a row instead of updating", async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Save" }));
    await waitFor(() => expect(h.createModel).toHaveBeenCalledTimes(1));
    fireEvent.click(await screen.findByText("Import"));
    fireEvent.click(await screen.findByRole("button", { name: /^paste$/i }));
    fireEvent.change(screen.getByPlaceholderText(/path\/to\/file\.md/i), { target: { value: OSSIE } });
    await waitFor(() => expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy());
    fireEvent.click(screen.getByText(/Replace the canvas/i));
    const btns = screen.getAllByRole("button", { name: /^import$/i });
    fireEvent.click(btns[btns.length - 1]);
    await waitFor(() => expect(store.get().nodes[0].key).toBe("orders"));
    fireEvent.click(await screen.findByRole("button", { name: "Save" }));
    await waitFor(() => expect(h.createModel).toHaveBeenCalledTimes(2));
    expect(h.updateModel).not.toHaveBeenCalled();
  });

  it("OKF export is named after the model and re-imports with the same name", async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: /Edit model name and description/ }));
    fireEvent.change(await screen.findByLabelText("Name"), { target: { value: "Shop model" } });
    fireEvent.click(await screen.findByText("Export"));
    fireEvent.click(screen.getByRole("menuitem", { name: /OKF/ }));
    expect(h.downloads).toHaveLength(1);
    expect(h.downloads[0].name).toBe("Shop model");
    expect(Object.keys(h.downloads[0].files).every(p => p.startsWith("shop-model/"))).toBe(true);
    expect(loadModelFiles(h.downloads[0].files).name).toBe("Shop model");
  });
});
