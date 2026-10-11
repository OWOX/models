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

  it("surfaces a generic generator failure as a 502-class error", async () => {
    vi.spyOn(gemini, "generateQuestions").mockRejectedValue(new Error("Gemini returned no content"));
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/questions", payload: BODY });
    expect(res.statusCode).toBeGreaterThanOrEqual(500);
  });

  it("maps a Gemini quota/spend-cap hit to 429 { error: ai_limit }", async () => {
    vi.spyOn(gemini, "generateQuestions").mockRejectedValue(new gemini.GeminiRateLimitError());
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/questions", payload: BODY });
    expect(res.statusCode).toBe(429);
    expect(res.json()).toEqual({ error: "ai_limit" });
  });
});

import { sanitizeQuestionsInput, QUESTIONS_LIMITS as L } from "../src/routes/questions";
import { buildPrompt } from "../src/llm/gemini";

describe("POST /api/questions input caps", () => {
  const field = (i: number, extra = {}) => ({ name: `f${i}`, type: "STRING", pk: false, ...extra });
  const mart = (title: string, role: string, fields: unknown[], extra = {}) => ({ title, role, fields, ...extra });

  it("passes a normal request through unchanged", () => {
    expect(sanitizeQuestionsInput(BODY)).toEqual(BODY);
  });

  it("rejects malformed bodies instead of crashing", () => {
    expect(sanitizeQuestionsInput(null)).toBeNull();
    expect(sanitizeQuestionsInput({ ...BODY, focus: { marts: [null, 5], joins: [] } })).toBeNull();
    expect(sanitizeQuestionsInput({ ...BODY, focus: { marts: BODY.focus.marts, joins: "x" } })).toBeNull();
  });

  it("truncates long text and drops malformed entries instead of failing", () => {
    const long = "x".repeat(10_000);
    const out = sanitizeQuestionsInput({
      niche: long, goal: long,
      focus: {
        marts: [mart(long, "selected", [field(1, { description: long, formula: long, alias: long }), null, { name: 5 }], { description: long })],
        joins: [{ from: "a", to: "b", on: [{ left: "x", right: "y" }, null] }, null],
      },
    })!;
    expect(out.niche).toHaveLength(L.text);
    expect(out.goal).toHaveLength(L.text);
    const m = out.focus.marts[0];
    expect(m.title).toHaveLength(L.title);
    expect(m.description).toHaveLength(L.martDescription);
    expect(m.fields).toHaveLength(1);
    expect(m.fields[0].description).toHaveLength(L.fieldDescription);
    expect(m.fields[0].formula).toHaveLength(L.formula);
    expect(m.fields[0].alias).toHaveLength(L.name);
    expect(out.focus.joins).toEqual([{ from: "a", to: "b", on: [{ left: "x", right: "y" }] }]);
  });

  it("caps marts, fields and joins, keeping the selected mart first", () => {
    const many = Array.from({ length: 300 }, (_, i) => field(i));
    const marts = [
      ...Array.from({ length: 40 }, (_, i) => mart(`N${i}`, "neighbour", many)),
      mart("Sel", "selected", many),
    ];
    const joins = Array.from({ length: 200 }, (_, i) => ({ from: "Sel", to: `N${i}`, on: Array.from({ length: 30 }, () => ({ left: "a", right: "b" })) }));
    const out = sanitizeQuestionsInput({ niche: "n", goal: "g", focus: { marts, joins } })!;
    expect(out.focus.marts[0].title).toBe("Sel");
    expect(out.focus.marts.length).toBeLessThanOrEqual(L.marts);
    expect(out.focus.marts[0].fields).toHaveLength(L.fieldsPerMart);
    expect(out.focus.joins).toHaveLength(L.joins);
    expect(out.focus.joins[0].on).toHaveLength(L.keysPerJoin);
  });

  it("bounds the whole prompt, so one call can't carry a huge paid prompt", () => {
    const fat = (i: number) => field(i, { description: "d".repeat(5000), formula: "f".repeat(5000), alias: "a".repeat(500) });
    const marts = Array.from({ length: 40 }, (_, m) => mart(`M${m}`, m === 0 ? "selected" : "neighbour", Array.from({ length: 300 }, (_, i) => fat(i)), { description: "x".repeat(5000) }));
    const out = sanitizeQuestionsInput({ niche: "n".repeat(5000), goal: "g".repeat(5000), focus: { marts, joins: [] } })!;
    expect(buildPrompt(out).length).toBeLessThan(L.promptBudget + 20_000);
    expect(out.focus.marts[0].fields.length).toBeGreaterThan(0);
  });

  it("the route sends the capped input to the generator", async () => {
    const spy = vi.spyOn(gemini, "generateQuestions").mockResolvedValue([{ question: "Q", unlockedBy: "U" }]);
    const app = buildApp();
    const res = await app.inject({ method: "POST", url: "/api/questions", payload: { ...BODY, goal: "g".repeat(10_000) } });
    expect(res.statusCode).toBe(200);
    expect(spy.mock.calls[0][0].goal).toHaveLength(L.text);
  });
});
