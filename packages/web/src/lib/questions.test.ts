import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ModelNode, ModelEdge } from "@mc/okf";
import { buildFocus, focusCacheKey, getQuestions, AiLimitError, __clearCache } from "./questions";

const mart = (key: string, title: string): ModelNode => ({
  key, title, inputSource: "SQL", schema: [{ name: "id", type: "INTEGER", pk: true }],
  position: { x: 0, y: 0 }, status: "pending",
});
const NODES: ModelNode[] = [mart("a", "Orders"), mart("b", "Customers"), mart("c", "Faraway")];
const EDGES: ModelEdge[] = [
  { id: "e1", from: "a", to: "b", keys: [{ left: "customer_id", right: "id" }], bidirectional: false },
  { id: "e2", from: "b", to: "c", keys: [{ left: "x", right: "y" }], bidirectional: false },
];
const GOAL = { niche: "E-commerce / Retail", goal: "Increase ROAS while holding CPC" };

describe("buildFocus", () => {
  it("includes the selected mart and its 1-hop neighbours only", () => {
    const focus = buildFocus(NODES, EDGES, "a");
    const titles = focus.marts.map(m => m.title).sort();
    expect(titles).toEqual(["Customers", "Orders"]); // "Faraway" is 2 hops away
    expect(focus.marts.find(m => m.title === "Orders")?.role).toBe("selected");
    expect(focus.joins).toHaveLength(1);
    expect(focus.joins[0].on).toEqual([{ left: "customer_id", right: "id" }]);
  });

  it("passes calculated field formulas into the focus", () => {
    const n = { key: "a", title: "A", inputSource: "SQL", position: { x: 0, y: 0 }, status: "pending",
      schema: [{ name: "ctr", type: "NUMERIC", pk: false, formula: "SUM(c)/SUM(i)" }] } as any;
    expect(buildFocus([n], [], "a").marts[0].fields[0].formula).toBe("SUM(c)/SUM(i)");
  });
});

describe("focusCacheKey", () => {
  it("is stable for the same focus+goal and changes when the goal changes", () => {
    const f = buildFocus(NODES, EDGES, "a");
    expect(focusCacheKey(f, GOAL)).toBe(focusCacheKey(f, GOAL));
    expect(focusCacheKey(f, GOAL)).not.toBe(focusCacheKey(f, { ...GOAL, goal: "Other" }));
  });
});

describe("getQuestions", () => {
  beforeEach(() => {
    __clearCache();
    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve(new Response(
        JSON.stringify({ questions: [{ question: "Q", unlockedBy: "U" }] }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )),
    );
  });
  afterEach(() => vi.restoreAllMocks());

  it("calls /api/questions and caches by focus+goal", async () => {
    const f = buildFocus(NODES, EDGES, "a");
    const a = await getQuestions(f, GOAL);
    const b = await getQuestions(f, GOAL); // served from cache
    expect(a).toEqual(b);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("force re-fetches even when cached", async () => {
    const f = buildFocus(NODES, EDGES, "a");
    await getQuestions(f, GOAL);
    await getQuestions(f, GOAL, { force: true });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("throws AiLimitError when the API responds 429", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(
      JSON.stringify({ error: "ai_limit" }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    ));
    const f = buildFocus(NODES, EDGES, "a");
    await expect(getQuestions(f, GOAL)).rejects.toBeInstanceOf(AiLimitError);
  });
});
