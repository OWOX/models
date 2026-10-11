import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModelTitleBlock } from "./ModelTitleBlock";

describe("ModelTitleBlock", () => {
  it("shows only the model name", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const btn = screen.getByRole("button", { name: /Edit model name and description/ });
    expect(btn.textContent).toBe("Acme");
    expect(screen.getByText("Acme").getAttribute("title")).toBe("Acme");
  });
  it("fits the name up to a 220px cap and keeps the text at the top-left inset", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("w-fit");
    // 220px of text + 2 × 7px padding; 10px offset + 7px padding = text at 17px / 14px.
    expect(cls).toContain("max-w-[min(234px,calc(100%-20px))]");
    expect(cls).toContain("top-[10px]");
    expect(cls).toContain("left-[10px]");
    expect(cls).toContain("px-[7px]");
    expect(cls).toContain("py-1");
  });
  it("keeps the visible name in the accessible name and stays under modal sheets", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const btn = screen.getByRole("button", { name: "Acme. Edit model name and description" });
    expect(btn.className).toContain("z-[14]");
  });
  it("is plain text with a dotted underline, not a card", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const btn = screen.getByRole("button");
    expect(btn.className).not.toMatch(/\bborder\b|bg-white|shadow/);
    expect(screen.getByText("Acme").className).toContain("decoration-dotted");
  });
  it("blurs whatever is behind it so the name stays readable over a card", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const cls = screen.getByRole("button").className;
    expect(cls).toMatch(/\bbackdrop-blur-/);
    // Canvas-coloured and translucent: invisible on empty canvas, frosted over cards.
    expect(cls).toContain("bg-[#f7f8fa]/75");
  });
  it("calls onOpen on click", () => {
    const onOpen = vi.fn();
    render(<ModelTitleBlock name="Acme" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
