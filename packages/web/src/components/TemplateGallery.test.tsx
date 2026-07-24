import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { TemplateGallery } from "./TemplateGallery";

const TOP_INDEX = `# OKF Bundles
- [E-Commerce](./e-commerce/index.md) — 22 concept(s)
- [SaaS](./saas/index.md) — 10 concept(s)
- [Finance](./finance/index.md) — 8 concept(s)
- [Healthcare](./healthcare/index.md) — 8 concept(s)
- [Marketing Leadgen](./marketing-leadgen/index.md) — 8 concept(s)
- [Marketplace](./marketplace/index.md) — 8 concept(s)
`;

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true, status: 200, text: () => Promise.resolve(TOP_INDEX),
  }));
});
afterEach(() => vi.restoreAllMocks());

describe("TemplateGallery", () => {
  it("renders the Verified section heading and the fetched bundle titles", async () => {
    render(<TemplateGallery onUse={vi.fn()} />);
    expect(await screen.findByText(/verified templates gallery/i)).toBeInTheDocument();
    expect(await screen.findByText("E-Commerce")).toBeInTheDocument();
    expect(await screen.findByText("Marketplace")).toBeInTheDocument();
  });

  it("excludes all verified bundles (including newly added ones) from Others", async () => {
    render(<TemplateGallery onUse={vi.fn()} />);
    const others = await screen.findByTestId("others-section");
    expect(within(others).queryByText("SaaS / Subscription")).not.toBeInTheDocument();
    expect(within(others).queryByText("E-commerce / Retail")).not.toBeInTheDocument();
    expect(within(others).queryByText("Finance / Fintech")).not.toBeInTheDocument();
    expect(within(others).queryByText("Healthcare")).not.toBeInTheDocument();
    expect(within(others).queryByText("Marketing / Lead-gen")).not.toBeInTheDocument();
    expect(within(others).queryByText("Marketplace")).not.toBeInTheDocument();
    // A non-deduped built-in still appears.
    expect(within(others).getByText("Mobile / Gaming")).toBeInTheDocument();
  });
});
