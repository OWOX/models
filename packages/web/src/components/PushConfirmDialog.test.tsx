import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PushConfirmDialog } from "./PushConfirmDialog";

const base = {
  projectTitle: "MCP Demo",
  storage: { title: "BigQuery EU", type: "GOOGLE_BIGQUERY" },
  counts: { marts: 3, relationships: 2, alreadyPushed: 0 },
};

const noop = { onConfirm: () => {}, onForcePush: () => {}, onChangeProject: () => {}, onClose: () => {} };

describe("PushConfirmDialog", () => {
  it("shows the target project, storage and counts", () => {
    render(<PushConfirmDialog {...base} {...noop} />);
    expect(screen.getByText("MCP Demo")).toBeTruthy();
    expect(screen.getByText(/BigQuery EU/)).toBeTruthy();
    expect(screen.getByText(/GOOGLE_BIGQUERY/)).toBeTruthy();
    expect(screen.getByText(/3 marts and 2 relationships will be pushed/i)).toBeTruthy();
  });

  it("wires Push, Change project and Cancel", () => {
    const onConfirm = vi.fn(), onChangeProject = vi.fn(), onClose = vi.fn();
    render(<PushConfirmDialog {...base} onConfirm={onConfirm} onForcePush={() => {}} onChangeProject={onChangeProject} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /^push$/i }));
    fireEvent.click(screen.getByRole("button", { name: /change project/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onChangeProject).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("hides the force-push escape hatch when nothing is being skipped", () => {
    render(<PushConfirmDialog {...base} {...noop} />);
    expect(screen.queryByRole("button", { name: /force push/i })).toBeNull();
  });

  it("explains the skipped marts and offers force push when some are already in OWOX", () => {
    render(<PushConfirmDialog {...base} counts={{ marts: 0, relationships: 0, alreadyPushed: 12 }} {...noop} />);
    expect(screen.getByText(/12 marts are already created in this project/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /force push to owox again/i })).toBeTruthy();
  });

  it("calls onForcePush — not onConfirm — from the force button", () => {
    const onConfirm = vi.fn(), onForcePush = vi.fn();
    render(
      <PushConfirmDialog
        {...base}
        counts={{ marts: 0, relationships: 0, alreadyPushed: 2 }}
        onConfirm={onConfirm}
        onForcePush={onForcePush}
        onChangeProject={() => {}}
        onClose={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /force push to owox again/i }));
    expect(onForcePush).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("disables Push when there is nothing left to push", () => {
    render(<PushConfirmDialog {...base} counts={{ marts: 0, relationships: 0, alreadyPushed: 4 }} {...noop} />);
    expect(screen.getByRole("button", { name: /^push$/i })).toHaveProperty("disabled", true);
  });
});
