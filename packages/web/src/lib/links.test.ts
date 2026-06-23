import { describe, it, expect } from "vitest";
import { signupUrl } from "./links";

describe("signupUrl", () => {
  it("points at the OWOX free signup with campaign UTMs and the placement", () => {
    const url = new URL(signupUrl("signin_modal"));
    expect(url.origin + url.pathname).toBe("https://www.owox.com/app-signup");
    expect(url.searchParams.get("utm_source")).toBe("model-canvas");
    expect(url.searchParams.get("utm_campaign")).toBe("model_canvas_leadgen");
    expect(url.searchParams.get("utm_content")).toBe("signin_modal");
  });

  it("varies utm_content by placement for attribution", () => {
    expect(new URL(signupUrl("topbar")).searchParams.get("utm_content")).toBe("topbar");
  });
});
