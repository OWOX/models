import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

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
  return {
    ...real,
    downloadBundle: (files: Record<string, string>, name?: string) => { h.downloads.push({ files, name }); },
    // The lazily loaded Ossie writer failed to load (offline / stale chunk).
    downloadOssie: async () => { throw new Error(real.OSSIE_LOAD_FAILED); },
  };
});

import { App } from "../../App";
import { store } from "./Canvas";
import { OSSIE_LOAD_FAILED } from "../../okf/io";

const seed = () => ({
  storageId: null,
  nodes: [{ key: "a", title: "A", inputSource: "VIEW" as const, definition: "p.d.a", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 0, y: 0 }, status: "pending" as const, owoxId: null }],
  edges: [],
});

describe("Ossie export when the Ossie writer fails to load", () => {
  beforeEach(() => {
    localStorage.clear();
    h.downloads.length = 0;
    (window as any).DOMMatrixReadOnly ??= class { m22 = 1; constructor(_t?: string) {} };
    store.set(seed());
  });

  it("the Export menu shows the error in a toast", async () => {
    render(<App />);
    fireEvent.click(await screen.findByText("Export"));
    fireEvent.click(screen.getByRole("menuitem", { name: /Ossie/ }));
    expect(await screen.findByText(OSSIE_LOAD_FAILED)).toBeTruthy();
  });

  it("Clear canvas keeps the model and the dialog open", async () => {
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "Clear canvas — delete everything" }));
    fireEvent.click(await screen.findByRole("radio", { name: /Ossie/ }));
    fireEvent.click(screen.getByRole("button", { name: /^export & delete$/i }));
    expect(await screen.findByText(OSSIE_LOAD_FAILED)).toBeTruthy();
    expect(store.get().nodes).toHaveLength(1);
    expect(screen.getByRole("button", { name: /^export & delete$/i })).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
