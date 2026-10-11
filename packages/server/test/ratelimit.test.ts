import { describe, it, expect, vi, afterEach } from "vitest";
import { buildApp, clientIp } from "../src/app";
import * as gemini from "../src/llm/gemini";

// Production sits behind Cloudflare (Render's edge), which sets CF-Connecting-IP
// to the real client and overwrites any value the client sends. X-Forwarded-For
// is client-controlled: rate limits must never key on it.
const remaining = (res: { headers: Record<string, unknown> }) => Number(res.headers["x-ratelimit-remaining"]);

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.QUESTIONS_RATE_LIMIT_MAX;
});

describe("clientIp", () => {
  const req = (headers: Record<string, string>, ip = "10.0.0.1") => ({ headers, ip }) as never;
  it("prefers a valid CF-Connecting-IP", () => {
    expect(clientIp(req({ "cf-connecting-ip": "198.51.100.7", "x-forwarded-for": "203.0.113.1" }))).toBe("198.51.100.7");
    expect(clientIp(req({ "cf-connecting-ip": "2001:db8::1" }))).toBe("2001:db8::1");
  });
  it("falls back to req.ip without a usable header", () => {
    expect(clientIp(req({}))).toBe("10.0.0.1");
    expect(clientIp(req({ "cf-connecting-ip": "not-an-ip" }))).toBe("10.0.0.1");
  });
});

describe("rate limits key on the Cloudflare client IP", () => {
  it("a spoofed X-Forwarded-For doesn't get a fresh global bucket", async () => {
    const app = buildApp();
    const hit = (xff: string) => app.inject({ method: "GET", url: "/api/config", headers: { "cf-connecting-ip": "198.51.100.7", "x-forwarded-for": xff } });
    const a = await hit("203.0.113.1");
    const b = await hit("203.0.113.2");
    expect(remaining(b)).toBe(remaining(a) - 1);
  });

  it("different real clients still get separate buckets", async () => {
    const app = buildApp();
    const hit = (ip: string) => app.inject({ method: "GET", url: "/api/config", headers: { "cf-connecting-ip": ip } });
    const a = await hit("198.51.100.7");
    const b = await hit("198.51.100.8");
    expect(remaining(b)).toBe(remaining(a));
  });

  it("/api/questions keeps its tight cap under rotating X-Forwarded-For", async () => {
    process.env.QUESTIONS_RATE_LIMIT_MAX = "2";
    vi.spyOn(gemini, "generateQuestions").mockResolvedValue([{ question: "Q", unlockedBy: "U" }]);
    const app = buildApp();
    const payload = { niche: "SaaS", goal: "Churn", focus: { marts: [{ title: "S", fields: [], role: "selected" }], joins: [] } };
    const codes: number[] = [];
    for (let i = 0; i < 3; i++) {
      const res = await app.inject({ method: "POST", url: "/api/questions", payload, headers: { "cf-connecting-ip": "198.51.100.7", "x-forwarded-for": `203.0.113.${i}` } });
      codes.push(res.statusCode);
    }
    expect(codes).toEqual([200, 200, 429]);
  });

  it("/api/auth/connect keeps its tight cap under rotating X-Forwarded-For", async () => {
    const app = buildApp();
    const codes: number[] = [];
    for (let i = 0; i < 11; i++) {
      const res = await app.inject({ method: "POST", url: "/api/auth/connect", payload: { apiKey: "bad" }, headers: { "cf-connecting-ip": "198.51.100.7", "x-forwarded-for": `203.0.113.${i}` } });
      codes.push(res.statusCode);
    }
    expect(codes.slice(0, 10).every(c => c === 400)).toBe(true);
    expect(codes[10]).toBe(429);
  });
});
