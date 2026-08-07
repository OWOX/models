import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PushToast } from "./PushToast";
import type { PushResult } from "../sync/push";

const result = (over: Partial<PushResult> = {}): PushResult => ({
  created: 0, updated: 0, failed: 0, blocked: 0, recreated: 0,
  relationshipsCreated: 0, relationshipsFailed: 0, relationshipsWithoutKeys: 0, errors: [], ...over,
});

describe("PushToast", () => {
  it("reports a clean push", () => {
    render(<PushToast result={result({ created: 8, relationshipsCreated: 8 })} onClose={() => {}} />);
    expect(screen.getByText("Push complete")).toBeTruthy();
    expect(screen.getByText(/8 marts created, 8 links created/)).toBeTruthy();
  });

  it("says nothing was pushed when every mart is still in OWOX", () => {
    render(<PushToast result={result({ blocked: 8, errors: ['"Orders" still exists in OWOX (DRAFT)'] })} onClose={() => {}} />);
    expect(screen.queryByText("Push complete")).toBeNull();
    expect(screen.getByText(/nothing pushed/i)).toBeTruthy();
    expect(screen.getByText(/8 marts still exist in OWOX/i)).toBeTruthy();
    expect(screen.getByText(/delete them/i)).toBeTruthy();
  });

  it("reports both halves when some marts were blocked and others pushed", () => {
    render(<PushToast result={result({ created: 3, blocked: 5 })} onClose={() => {}} />);
    expect(screen.getByText(/3 marts created/)).toBeTruthy();
    expect(screen.getByText(/5 marts still exist in OWOX/i)).toBeTruthy();
  });

  it("lists the per-mart errors", () => {
    render(<PushToast result={result({ blocked: 1, errors: ['"Orders" still exists in OWOX (PUBLISHED) — delete it there first'] })} onClose={() => {}} />);
    expect(screen.getByText(/"Orders" still exists in OWOX \(PUBLISHED\)/)).toBeTruthy();
  });

  it("still flags real failures", () => {
    render(<PushToast result={result({ created: 1, failed: 2, errors: ["boom"] })} onClose={() => {}} />);
    expect(screen.getByText(/push completed with errors/i)).toBeTruthy();
    expect(screen.getByText(/2 marts failed/)).toBeTruthy();
  });

  it("counts failed marts and failed links apart", () => {
    render(<PushToast result={result({ created: 10, failed: 1, relationshipsFailed: 14, errors: ["boom"] })} onClose={() => {}} />);
    expect(screen.getByText(/1 mart failed, 14 links failed/)).toBeTruthy();
  });

  it("explains why a mart got a new OWOX id", () => {
    render(<PushToast result={result({ created: 2, recreated: 2, relationshipsCreated: 1 })} onClose={() => {}} />);
    expect(screen.getByText("Push complete")).toBeTruthy();
    expect(screen.getByText(/2 marts were marked as created here but no longer existed in OWOX/i)).toBeTruthy();
  });

  it("notes links pushed without join keys", () => {
    render(<PushToast result={result({ created: 2, relationshipsCreated: 3, relationshipsWithoutKeys: 3 })} onClose={() => {}} />);
    expect(screen.getByText("Push complete")).toBeTruthy();
    expect(screen.getByText(/3 links have no join keys yet/i)).toBeTruthy();
    expect(screen.getByText(/Join not configured/i)).toBeTruthy();
  });
});
