import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OwoxImportDialog } from "./OwoxImportDialog";
import * as apiMod from "../lib/api";

const storages = [{ id: "st_1", title: "Analytics BQ", type: "GOOGLE_BIGQUERY" }];
const payload = {
  storageId: "st_1", total: 150, truncated: true,
  marts: [
    { id: "a", title: "Orders", status: "PUBLISHED", schema: [], inputSource: "SQL", definition: null },
    { id: "b", title: "Customers", status: "DRAFT", schema: [], inputSource: "SQL", definition: null },
  ],
  relationships: [{ sourceId: "a", targetId: "b", joinConditions: [] }],
};

beforeEach(() => vi.spyOn(apiMod, "api").mockResolvedValue(payload as any));

describe("OwoxImportDialog", () => {
  it("step 1 lists storages by title and type", () => {
    render(<OwoxImportDialog storages={storages} onConfirm={() => {}} onClose={() => {}} />);
    expect(screen.getByText(/Analytics BQ/)).toBeTruthy();
    expect(screen.getByText(/GOOGLE_BIGQUERY/)).toBeTruthy();
  });

  it("fetching shows the first-100 truncation notice", async () => {
    render(<OwoxImportDialog storages={storages} onConfirm={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByText(/Analytics BQ/));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() => expect(screen.getByText(/only the first 100/i)).toBeTruthy());
  });

  it("confirms with a graph and the chosen mode", async () => {
    const onConfirm = vi.fn();
    render(<OwoxImportDialog storages={storages} onConfirm={onConfirm} onClose={() => {}} />);
    fireEvent.click(screen.getByText(/Analytics BQ/));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() => screen.getByRole("button", { name: /^import$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^import$/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    const [graph, mode] = onConfirm.mock.calls[0];
    expect(graph.nodes.length).toBe(2);
    expect(mode).toBe("replace");
  });
});
