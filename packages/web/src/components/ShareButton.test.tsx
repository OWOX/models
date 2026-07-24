import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ShareButton } from "./ShareButton";

describe("ShareButton", () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it("copies the deeplink and shows the copied state, without toggling the parent", async () => {
    const onParentClick = vi.fn();
    render(
      <div onClick={onParentClick}>
        <ShareButton deeplink="https://model.owox.com/?template=saas" />
      </div>,
    );
    fireEvent.click(screen.getByRole("button", { name: /share/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://model.owox.com/?template=saas");
    expect(onParentClick).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText(/copied/i)).toBeInTheDocument());
  });
});
