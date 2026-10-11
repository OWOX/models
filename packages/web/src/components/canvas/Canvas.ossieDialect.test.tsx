import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const h = vi.hoisted(() => ({
  me: null as { projectTitle?: string } | null,
  exports: [] as (string | undefined)[],
}));
vi.mock("../../lib/api", () => ({
  api: async (path: string) => {
    if (path === "/api/me" && h.me) return h.me;
    if (path === "/api/storages" && h.me) return [{ id: "s1", title: "Warehouse", type: "SNOWFLAKE" }];
    throw new Error("401");
  },
}));
vi.mock("../../okf/io", async importOriginal => ({
  ...(await importOriginal<typeof import("../../okf/io")>()),
  downloadOssie: async (_g: unknown, _name: string, dialect?: string) => { h.exports.push(dialect); return []; },
}));

import { App } from "../../App";
import { store } from "./Canvas";

const MULTI = `version: 0.2.0.dev0
name: m
datasets:
  - name: orders
    source: p.d.orders
    fields:
      - name: id
        expression: { dialects: [{ dialect: ANSI_SQL, expression: id }] }
      - name: label
        expression:
          dialects:
            - { dialect: ANSI_SQL, expression: "id || '-x'" }
            - { dialect: SNOWFLAKE, expression: "CONCAT(id, '-x')" }
`;
const seed = (storageId: string | null) => ({
  storageId,
  nodes: [{ key: "a", title: "A", inputSource: "VIEW" as const, definition: "p.d.a", schema: [{ name: "id", type: "STRING", pk: true }], position: { x: 0, y: 0 }, status: "pending" as const, owoxId: null }],
  edges: [],
});

async function exportOssie() {
  fireEvent.click(await screen.findByRole("button", { name: "Export" }));
  fireEvent.click(screen.getByRole("menuitem", { name: /Ossie/ }));
}
async function pasteImport(text: string) {
  fireEvent.click((await screen.findAllByRole("button", { name: /^import$/i }))[0]);
  await screen.findByText("Import model");
  fireEvent.click(await screen.findByRole("button", { name: /^paste$/i }));
  fireEvent.change(screen.getByPlaceholderText(/path\/to\/file\.md/i), { target: { value: text } });
  await waitFor(() => expect(screen.getByText(/Will import 1 marts/i)).toBeTruthy());
  fireEvent.click(screen.getByText(/Replace the canvas/));
  const btns = screen.getAllByRole("button", { name: /^import$/i });
  fireEvent.click(btns[btns.length - 1]);
}

describe("Ossie dialect follows the selected OWOX storage", () => {
  beforeEach(() => {
    localStorage.clear();
    h.exports.length = 0;
    (window as any).DOMMatrixReadOnly ??= class { m22 = 1; constructor(_t?: string) {} };
  });

  it("labels the export with the storage's dialect", async () => {
    h.me = { projectTitle: "Acme" };
    store.set(seed("s1"));
    render(<App />);
    await screen.findAllByText(/Warehouse/);
    await exportOssie();
    await waitFor(() => expect(h.exports).toEqual(["SNOWFLAKE"]));
  });

  it("falls back to ANSI_SQL without a storage", async () => {
    h.me = null;
    store.set(seed(null));
    render(<App />);
    await exportOssie();
    await waitFor(() => expect(h.exports).toEqual(["ANSI_SQL"]));
  });

  it("imports the storage dialect's text of a multi-dialect expression", async () => {
    h.me = { projectTitle: "Acme" };
    store.set(seed("s1"));
    render(<App />);
    await screen.findAllByText(/Warehouse/);
    await pasteImport(MULTI);
    await waitFor(() => expect(store.get().nodes[0]?.title).toBe("orders"));
    expect(store.get().nodes[0].schema.find(f => f.name === "label")?.formula).toBe("CONCAT(id, '-x')");
  });
});
