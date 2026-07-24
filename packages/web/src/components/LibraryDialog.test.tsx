import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

describe("LibraryDialog", () => {
  it("renders a Verified Templates Gallery section from the fetched index", async () => {
    render(<LibraryDialog onUse={vi.fn()} onClose={vi.fn()} />);
    expect(await screen.findByText(/verified templates gallery/i)).toBeInTheDocument();
    expect(await screen.findByText("E-Commerce")).toBeInTheDocument();
    expect(await screen.findByText("SaaS")).toBeInTheDocument();
  });

  it("shows an Others section that excludes the deduped built-in templates", async () => {
    render(<LibraryDialog onUse={vi.fn()} onClose={vi.fn()} />);
    const others = await screen.findByTestId("others-section");
    // Deduped built-ins must NOT appear in Others.
    expect(within(others).queryByText("SaaS / Subscription")).not.toBeInTheDocument();
    expect(within(others).queryByText("E-commerce / Retail")).not.toBeInTheDocument();
    expect(within(others).queryByText("Finance / Fintech")).not.toBeInTheDocument();
    // A non-deduped built-in still appears.
    expect(within(others).getByText("Marketplace")).toBeInTheDocument();
  });
});
