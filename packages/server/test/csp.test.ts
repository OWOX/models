import { describe, it, expect } from "vitest";
import { buildApp } from "../src/app";

describe("Content-Security-Policy", () => {
  it("allows the Google Fonts stylesheet and font files linked from index.html", async () => {
    const res = await buildApp().inject({ method: "GET", url: "/api/config" });
    const csp = String(res.headers["content-security-policy"]);
    expect(csp).toMatch(/style-src [^;]*https:\/\/fonts\.googleapis\.com/);
    expect(csp).toMatch(/font-src [^;]*https:\/\/fonts\.gstatic\.com/);
  });
});
