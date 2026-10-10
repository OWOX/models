import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import type { LoadedModel } from "../okf/io";

// Parsing is async (the Ossie reader loads on demand), so an older paste can
// finish after a newer one. Each paste resolves when the test says so.
const h = vi.hoisted(() => ({ pending: new Map<string, (m: LoadedModel) => void>() }));
vi.mock("../okf/io", async importOriginal => ({
  ...(await importOriginal<typeof import("../okf/io")>()),
  loadModelText: (text: string) => new Promise<LoadedModel>(res => h.pending.set(text, res)),
}));

import { ImportDialog } from "./ImportDialog";

const model = (title: string): LoadedModel => ({
  format: "okf", name: null, notImported: [], warnings: [],
  graph: { storageId: null, edges: [], nodes: [{ key: title, title, inputSource: "SQL", schema: [], position: { x: 0, y: 0 }, status: "pending", owoxId: null }] },
});

describe("ImportDialog — out-of-order parses", () => {
  it("shows the latest paste even when an older one finishes last", async () => {
    render(<ImportDialog onConfirm={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /^paste$/i }));
    const box = screen.getByPlaceholderText(/path\/to\/file\.md/i);
    fireEvent.change(box, { target: { value: "old" } });
    fireEvent.change(box, { target: { value: "new" } });
    await act(async () => { h.pending.get("new")!(model("newest_mart")); });
    await act(async () => { h.pending.get("old")!(model("stale_mart")); });
    expect(screen.getByText("newest_mart")).toBeTruthy();
    expect(screen.queryByText("stale_mart")).toBeNull();
  });
});
