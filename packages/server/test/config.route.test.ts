import { describe, it, expect, afterEach } from "vitest";
import { buildApp } from "../src/app";

const original = process.env.GEMINI_API_KEY;
afterEach(() => {
  if (original === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = original;
});

describe("GET /api/config", () => {
  it("reports questionsEnabled=true when GEMINI_API_KEY is set (no session needed)", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/api/config" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ questionsEnabled: true });
  });

  it("reports questionsEnabled=false when GEMINI_API_KEY is unset", async () => {
    delete process.env.GEMINI_API_KEY;
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/api/config" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ questionsEnabled: false });
  });
});
