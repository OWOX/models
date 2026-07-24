import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LibraryDialog } from "./LibraryDialog";

const TOP_INDEX = `# OKF Bundles
- [E-Commerce](./e-commerce/index.md) — 22 concept(s)
- [SaaS](./saas/index.md) — 10 concept(s)
`;

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true, status: 200, text: () => Promise.resolve(TOP_INDEX),
  }));
});
afterEach(() => vi.restoreAllMocks());

// Detailed gallery/dedup behavior is covered by TemplateGallery.test.tsx; this
// is a thin smoke test confirming the dialog chrome mounts the shared gallery.
describe("LibraryDialog", () => {
  it("renders the dialog header and mounts the template gallery", async () => {
    render(<LibraryDialog onUse={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText("Template library")).toBeInTheDocument();
    expect(await screen.findByText(/verified templates gallery/i)).toBeInTheDocument();
  });
});
