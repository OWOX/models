import { describe, it, expect, vi, afterEach } from "vitest";
import { buildApp } from "../src/app";
import * as gemini from "../src/llm/gemini";

const BODY = {
  niche: "SaaS / Subscription",
  goal: "Reduce monthly churn",
  focus: {
    marts: [{ title: "Subscriptions", fields: [{ name: "id", type: "INTEGER", pk: true }], role: "selected" }],
    joins: [],
  },
};

afterEach(() => vi.restoreAllMocks());

describe("POST /api/questions", () => {
  it("400 when niche/goal/focus are missing", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/questions", payload: { goal: "x" } });
    expect(res.statusCode).toBe(400);
  });

  it("400 when focus has no marts", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/questions", payload: { ...BODY, focus: { marts: [], joins: [] } } });
    expect(res.statusCode).toBe(400);
  });

  it("returns 5 questions from the generator (no session required)", async () => {
    const five = Array.from({ length: 5 }, (_, i) => ({ question: `Q${i}`, unlockedBy: `U${i}` }));
    vi.spyOn(gemini, "generateQuestions").mockResolvedValue(five);
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/questions", payload: BODY });
    expect(res.statusCode).toBe(200);
    expect(res.json().questions).toHaveLength(5);
  });

  it("surfaces a generator failure as a 502-class error", async () => {
    vi.spyOn(gemini, "generateQuestions").mockRejectedValue(new Error("Gemini request failed: 429"));
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/questions", payload: BODY });
    expect(res.statusCode).toBeGreaterThanOrEqual(500);
  });
});
