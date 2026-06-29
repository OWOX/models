import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadRelLabelMode,
  persistRelLabelMode,
  isKeySet,
  visibleKeys,
  showCardinality,
} from "./relLabels";

const set = { left: "id", right: "a_id" };
const partial = { left: "id", right: "" };
const unset = { left: "", right: "" };

describe("relLabels persistence", () => {
  beforeEach(() => localStorage.clear());

  it("defaults to 'all' when nothing is stored", () => {
    expect(loadRelLabelMode()).toBe("all");
  });

  it("round-trips each valid mode", () => {
    for (const m of ["all", "defined", "undefined", "hidden"] as const) {
      persistRelLabelMode(m);
      expect(loadRelLabelMode()).toBe(m);
    }
  });

  it("falls back to 'all' for an unrecognised stored value", () => {
    localStorage.setItem("mc.relLabels.v1", "bogus");
    expect(loadRelLabelMode()).toBe("all");
  });

  it("tolerates a throwing localStorage on persist", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => persistRelLabelMode("hidden")).not.toThrow();
    spy.mockRestore();
  });
});

describe("isKeySet", () => {
  it("treats a key with either side filled as set", () => {
    expect(isKeySet(set)).toBe(true);
    expect(isKeySet(partial)).toBe(true);
    expect(isKeySet(unset)).toBe(false);
  });
});

describe("visibleKeys", () => {
  const keys = [set, unset];
  it("all → every key", () => expect(visibleKeys(keys, "all")).toEqual([set, unset]));
  it("defined → only set keys", () => expect(visibleKeys(keys, "defined")).toEqual([set]));
  it("undefined → only unset keys", () => expect(visibleKeys(keys, "undefined")).toEqual([unset]));
  it("hidden → none", () => expect(visibleKeys(keys, "hidden")).toEqual([]));
});

describe("showCardinality", () => {
  it("hidden mode never shows it", () => {
    expect(showCardinality([set], "hidden")).toBe(false);
    expect(showCardinality([], "hidden")).toBe(false);
  });
  it("shows for a zero-key edge in non-hidden modes (nothing is being filtered out)", () => {
    expect(showCardinality([], "all")).toBe(true);
    expect(showCardinality([], "defined")).toBe(true);
    expect(showCardinality([], "undefined")).toBe(true);
  });
  it("shows iff at least one key survives the filter when the edge has keys", () => {
    expect(showCardinality([set], "all")).toBe(true);
    expect(showCardinality([unset], "defined")).toBe(false); // keys exist but none visible
    expect(showCardinality([set, unset], "defined")).toBe(true);
    expect(showCardinality([set], "undefined")).toBe(false);
    expect(showCardinality([unset], "undefined")).toBe(true);
  });
});
