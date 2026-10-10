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
  it("fits the name up to a 220px cap and sits top-left", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("w-fit");
    expect(cls).toContain("max-w-[min(220px,calc(100%-30px))]");
    expect(cls).toContain("top-[14px]");
    expect(cls).toContain("left-[15px]");
  });
  it("keeps the visible name in the accessible name and stays under modal sheets", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const btn = screen.getByRole("button", { name: "Acme. Edit model name and description" });
    expect(btn.className).toContain("z-[14]");
  });
  it("calls onOpen on click", () => {
    const onOpen = vi.fn();
    render(<ModelTitleBlock name="Acme" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
