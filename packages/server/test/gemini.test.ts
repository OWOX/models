import { describe, it, expect, vi, afterEach } from "vitest";
import { buildPrompt, generateQuestions, GeminiRateLimitError } from "../src/llm/gemini";

const INPUT = {
  niche: "E-commerce / Retail",
  goal: "Increase ROAS while holding CPC",
  focus: {
    marts: [
      { title: "Orders", description: "Shop orders", fields: [{ name: "id", type: "INTEGER", pk: true }, { name: "customer_id", type: "INTEGER", pk: false }], role: "selected" as const },
      { title: "Customers", fields: [{ name: "id", type: "INTEGER", pk: true }], role: "neighbour" as const },
    ],
    joins: [{ from: "Orders", to: "Customers", on: [{ left: "customer_id", right: "id" }] }],
  },
};

afterEach(() => { vi.restoreAllMocks(); delete process.env.GEMINI_API_KEY; });

describe("buildPrompt", () => {
  it("includes the niche, goal, mart titles and join keys", () => {
    const p = buildPrompt(INPUT);
    expect(p).toContain("E-commerce / Retail");
    expect(p).toContain("Increase ROAS while holding CPC");
    expect(p).toContain("Orders");
    expect(p).toContain("Customers");
    expect(p).toContain("customer_id");
  });

  it("prints a calculated field's formula in the prompt", () => {
    const prompt = buildPrompt({
      ...INPUT,
      focus: { ...INPUT.focus, marts: [{ title: "Ads", role: "selected" as const,
        fields: [{ name: "ctr", type: "NUMERIC", pk: false, formula: "SUM(c)/SUM(i)" }] }] },
    });
    expect(prompt).toContain("ctr:NUMERIC [calculated: SUM(c)/SUM(i)]");
  });
});

describe("generateQuestions", () => {
  it("throws a clear error when the key is missing", async () => {
    await expect(generateQuestions(INPUT)).rejects.toThrow(/GEMINI_API_KEY/);
  });

  it("parses 5 questions from a Gemini JSON response", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    const five = Array.from({ length: 5 }, (_, i) => ({ question: `Q${i}`, unlockedBy: `J${i}` }));
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: JSON.stringify(five) }] } }],
    }), { status: 200 }));
    const out = await generateQuestions(INPUT);
    expect(out).toHaveLength(5);
    expect(out[0]).toEqual({ question: "Q0", unlockedBy: "J0" });
  });

  it("throws when the model returns malformed JSON", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({
      candidates: [{ content: { parts: [{ text: "not json at all" }] } }],
    }), { status: 200 }));
    await expect(generateQuestions(INPUT)).rejects.toThrow();
  });

  it("throws GeminiRateLimitError on a 429 (quota / spend cap)", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("quota", { status: 429 }));
    await expect(generateQuestions(INPUT)).rejects.toBeInstanceOf(GeminiRateLimitError);
  });

  it("throws a generic error on a non-429 non-OK status", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("boom", { status: 500 }));
    await expect(generateQuestions(INPUT)).rejects.toThrow(/Gemini request failed: 500/);
  });
});
