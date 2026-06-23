import { describe, it, expect, beforeEach } from "vitest";
import { NICHE_PRESETS, loadGoal, persistGoal } from "./goal";

beforeEach(() => localStorage.clear());

describe("goal state", () => {
  it("ships 5 niches, each with 5 goals", () => {
    expect(NICHE_PRESETS).toHaveLength(5);
    for (const n of NICHE_PRESETS) {
      expect(n.id).toBeTruthy();
      expect(n.label).toBeTruthy();
      expect(n.goals).toHaveLength(5);
    }
  });

  it("round-trips a goal through localStorage", () => {
    expect(loadGoal()).toBeNull();
    persistGoal({ niche: "E-commerce / Retail", goal: "Increase ROAS while holding CPC" });
    expect(loadGoal()).toEqual({ niche: "E-commerce / Retail", goal: "Increase ROAS while holding CPC" });
  });

  it("persist(null) clears the stored goal", () => {
    persistGoal({ niche: "SaaS", goal: "Reduce churn" });
    persistGoal(null);
    expect(loadGoal()).toBeNull();
  });

  it("returns null on malformed stored JSON", () => {
    localStorage.setItem("mc.goal.v1", "{not json");
    expect(loadGoal()).toBeNull();
  });
});
