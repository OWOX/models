import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadObjHidden,
  persistObjHidden,
  togglePart,
  hiddenCount,
  isNothingHidden,
  isAllHidden,
  NOTHING_HIDDEN,
  ALL_HIDDEN,
  OBJ_LABEL_PARTS,
} from "./objLabels";

const KEY = "mc.objLabels.v2";
const LEGACY_KEY = "mc.objLabels.v1";

describe("objLabels persistence", () => {
  beforeEach(() => localStorage.clear());

  it("defaults to hiding nothing when storage is empty", () => {
    expect(loadObjHidden()).toEqual(NOTHING_HIDDEN);
  });

  it("round-trips an arbitrary combination", () => {
    const hidden = { source: false, fields: true, status: true };
    persistObjHidden(hidden);
    expect(loadObjHidden()).toEqual(hidden);
  });

  it("round-trips the empty set as an explicit stored value", () => {
    persistObjHidden(ALL_HIDDEN);
    persistObjHidden(NOTHING_HIDDEN);
    expect(localStorage.getItem(KEY)).toBe("");
    expect(loadObjHidden()).toEqual(NOTHING_HIDDEN);
  });

  it("ignores unknown parts in a stored value", () => {
    localStorage.setItem(KEY, "source,bogus");
    expect(loadObjHidden()).toEqual({ source: true, fields: false, status: false });
  });

  it("migrates each legacy v1 mode", () => {
    const cases: [string, ReturnType<typeof loadObjHidden>][] = [
      ["all", NOTHING_HIDDEN],
      ["noSource", { source: true, fields: false, status: false }],
      ["noFields", { source: false, fields: true, status: false }],
      ["noStatus", { source: false, fields: false, status: true }],
      ["both", { source: true, fields: true, status: false }],
      ["none", ALL_HIDDEN],
    ];
    for (const [legacy, expected] of cases) {
      localStorage.clear();
      localStorage.setItem(LEGACY_KEY, legacy);
      expect(loadObjHidden()).toEqual(expected);
    }
  });

  it("prefers the v2 value over a stale legacy one, and drops v1 on persist", () => {
    localStorage.setItem(LEGACY_KEY, "none");
    localStorage.setItem(KEY, "fields");
    expect(loadObjHidden()).toEqual({ source: false, fields: true, status: false });
    persistObjHidden({ source: false, fields: true, status: false });
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  it("falls back to hiding nothing for an unrecognised legacy mode", () => {
    localStorage.setItem(LEGACY_KEY, "bogus");
    expect(loadObjHidden()).toEqual(NOTHING_HIDDEN);
  });

  it("tolerates a throwing localStorage on persist", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => persistObjHidden(ALL_HIDDEN)).not.toThrow();
    spy.mockRestore();
  });
});

describe("objLabels helpers", () => {
  it("toggles one part without touching the others", () => {
    const once = togglePart(NOTHING_HIDDEN, "status");
    expect(once).toEqual({ source: false, fields: false, status: true });
    expect(togglePart(once, "fields")).toEqual({ source: false, fields: true, status: true });
    expect(togglePart(once, "status")).toEqual(NOTHING_HIDDEN);
  });

  it("counts hidden parts and recognises the two extremes", () => {
    expect(hiddenCount(NOTHING_HIDDEN)).toBe(0);
    expect(hiddenCount(ALL_HIDDEN)).toBe(OBJ_LABEL_PARTS.length);
    expect(isNothingHidden(NOTHING_HIDDEN)).toBe(true);
    expect(isAllHidden(ALL_HIDDEN)).toBe(true);

    const one = togglePart(NOTHING_HIDDEN, "source");
    expect(hiddenCount(one)).toBe(1);
    expect(isNothingHidden(one)).toBe(false);
    expect(isAllHidden(one)).toBe(false);
  });
});
