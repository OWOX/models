import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModelTitleBlock } from "./ModelTitleBlock";

describe("ModelTitleBlock", () => {
  it("shows the name and the first line of the description", () => {
    render(<ModelTitleBlock name="Acme" description={"Line one\nLine two"} onOpen={() => {}} />);
    const btn = screen.getByRole("button", { name: /Edit model name and description/ });
    expect(btn.textContent).toContain("Acme");
    expect(btn.textContent).toContain("Line one");
    expect(btn.textContent).not.toContain("Line two");
    expect(screen.getByText("Acme").getAttribute("title")).toBe("Acme");
  });
  it("shows a muted hint when the description is empty", () => {
    render(<ModelTitleBlock name="Acme" description="" onOpen={() => {}} />);
    expect(screen.getByText("Add a description")).toBeTruthy();
  });
  it("has a fixed 280px width and sits top-left", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("w-[280px]");
    expect(cls).toContain("top-[14px]");
    expect(cls).toContain("left-[15px]");
  });
  it("keeps the visible name in the accessible name and stays under modal sheets", () => {
    render(<ModelTitleBlock name="Acme" onOpen={() => {}} />);
    const btn = screen.getByRole("button", { name: "Acme. Edit model name and description" });
    expect(btn.className).toContain("z-[14]");
    expect(btn.className).toContain("max-w-[calc(100%-30px)]");
  });
  it("calls onOpen on click", () => {
    const onOpen = vi.fn();
    render(<ModelTitleBlock name="Acme" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
