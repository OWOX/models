import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TemplateGallery } from "./TemplateGallery";
import { fetchOkfBundleFromUrl } from "../okf/github";

// Keep the per-bundle fetch in flight so we can observe the abort on unmount.
vi.mock("../okf/github", () => ({
  fetchOkfBundleFromUrl: vi.fn(() => new Promise(() => {})),
}));

const TOP_INDEX = `# OKF Bundles
- [SaaS](./saas/index.md) — 10 concept(s)
`;

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true, status: 200, text: () => Promise.resolve(TOP_INDEX),
  }));
});
afterEach(() => vi.restoreAllMocks());

describe("VerifiedTemplateRow fetch cancellation", () => {
  it("passes an AbortSignal to the bundle fetch and aborts it on unmount", async () => {
    const { unmount } = render(<TemplateGallery onUse={vi.fn()} />);

    // Expand the SaaS row → triggers the lazy bundle fetch.
    fireEvent.click(await screen.findByText("SaaS"));
    await waitFor(() => expect(fetchOkfBundleFromUrl).toHaveBeenCalled());

    const opts = (fetchOkfBundleFromUrl as unknown as { mock: { calls: unknown[][] } }).mock.calls[0][1] as { signal: AbortSignal };
    expect(opts.signal).toBeInstanceOf(AbortSignal);
    expect(opts.signal.aborted).toBe(false);

    // Closing the dialog (unmount) must abort the still-in-flight request.
    unmount();
    expect(opts.signal.aborted).toBe(true);
  });
});
