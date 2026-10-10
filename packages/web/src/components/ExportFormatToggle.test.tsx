import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExportFormatToggle } from "./ExportFormatToggle";

describe("ExportFormatToggle keyboard", () => {
  it("uses a roving tabindex", () => {
    render(<ExportFormatToggle value="okf" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: "OKF" }).getAttribute("tabindex")).toBe("0");
    expect(screen.getByRole("radio", { name: "Ossie" }).getAttribute("tabindex")).toBe("-1");
  });
  it("arrow keys move the selection", () => {
    const onChange = vi.fn();
    render(<ExportFormatToggle value="okf" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("radio", { name: "OKF" }), { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("ossie");
    fireEvent.keyDown(screen.getByRole("radio", { name: "OKF" }), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith("ossie");
    fireEvent.keyDown(screen.getByRole("radio", { name: "OKF" }), { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith("ossie");
    fireEvent.keyDown(screen.getByRole("radio", { name: "Ossie" }), { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith("okf");
  });
});
