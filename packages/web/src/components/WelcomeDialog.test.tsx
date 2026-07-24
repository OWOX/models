import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { WelcomeDialog } from "./WelcomeDialog";
import { TEMPLATES } from "../templates";

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

describe("WelcomeDialog", () => {
  const props = () => ({ onUseTemplate: vi.fn(), onStartBlank: vi.fn(), onImport: vi.fn() });

  it("reuses the shared template gallery, deduped against verified bundles", async () => {
    render(<WelcomeDialog {...props()} />);
    expect(await screen.findByText(/verified templates gallery/i)).toBeInTheDocument();
    const others = await screen.findByTestId("others-section");
    expect(within(others).getByText("Mobile / Gaming")).toBeInTheDocument();
    expect(within(others).queryByText("SaaS / Subscription")).not.toBeInTheDocument();
  });

  it("rolls out a template (deep-cloned, not the shared instance)", async () => {
    const p = props();
    render(<WelcomeDialog {...p} />);
    const others = await screen.findByTestId("others-section");
    fireEvent.click(within(others).getAllByText("Use")[0]);
    expect(p.onUseTemplate).toHaveBeenCalledTimes(1);
    const graph = p.onUseTemplate.mock.calls[0][0];
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph).not.toBe(TEMPLATES[0].graph); // a clone, safe to mutate
  });

  it("offers Start blank and Import paths", async () => {
    const p = props();
    render(<WelcomeDialog {...p} />);
    await screen.findByText(/verified templates gallery/i);
    fireEvent.click(screen.getByText("Start blank"));
    expect(p.onStartBlank).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("Import OKF"));
    expect(p.onImport).toHaveBeenCalledTimes(1);
  });

  it("links to an import guide", async () => {
    render(<WelcomeDialog {...props()} />);
    await screen.findByText(/verified templates gallery/i);
    const link = screen.getByText(/Import guide/).closest("a") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/ai-instructions.html");
    expect(link.target).toBe("_blank");
  });
});
