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
  DEFAULT_HIDDEN,
  type ObjHidden,
} from "./objLabels";

const KEY = "mc.objLabels.v3";
const V2_KEY = "mc.objLabels.v2";
const V1_KEY = "mc.objLabels.v1";

const hide = (...parts: (keyof ObjHidden)[]): ObjHidden =>
  ({ ...NOTHING_HIDDEN, ...Object.fromEntries(parts.map(p => [p, true])) });

describe("objLabels persistence", () => {
  beforeEach(() => localStorage.clear());

  it("defaults to the field count with aliases when storage is empty", () => {
    expect(loadObjHidden()).toEqual(DEFAULT_HIDDEN);
    expect(OBJ_LABEL_PARTS.filter(p => !DEFAULT_HIDDEN[p])).toEqual(["fields", "fieldAlias"]);
  });

  it("round-trips an arbitrary combination", () => {
    const hidden = hide("fields", "status", "fieldDescription");
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
    expect(loadObjHidden()).toEqual(hide("source"));
  });

  it("carries a v2 preference over, giving the parts added since their defaults", () => {
    localStorage.setItem(V2_KEY, "fields,status");
    expect(loadObjHidden()).toEqual(hide("fields", "status", "relationships", "fieldDescription"));
  });

  it("keeps a v2 'title only' preference title only", () => {
    localStorage.setItem(V2_KEY, "source,fields,status");
    expect(loadObjHidden()).toEqual(hide("source", "fields", "status", "relationships"));
  });

  it("migrates each legacy v1 mode", () => {
    const added = ["relationships", "fieldDescription"] as const;
    const cases: [string, ObjHidden][] = [
      ["all", hide(...added)],
      ["noSource", hide("source", ...added)],
      ["noFields", hide("fields", ...added)],
      ["noStatus", hide("status", ...added)],
      ["both", hide("source", "fields", ...added)],
      ["none", hide("source", "fields", "status", "relationships")],
    ];
    for (const [legacy, expected] of cases) {
      localStorage.clear();
      localStorage.setItem(V1_KEY, legacy);
      expect(loadObjHidden()).toEqual(expected);
    }
  });

  it("prefers the current value over stale legacy ones, and drops them on persist", () => {
    localStorage.setItem(V1_KEY, "none");
    localStorage.setItem(V2_KEY, "source");
    localStorage.setItem(KEY, "fields");
    expect(loadObjHidden()).toEqual(hide("fields"));
    persistObjHidden(hide("fields"));
    expect(localStorage.getItem(V1_KEY)).toBeNull();
    expect(localStorage.getItem(V2_KEY)).toBeNull();
  });

  it("falls back to the defaults for an unrecognised legacy mode", () => {
    localStorage.setItem(V1_KEY, "bogus");
    expect(loadObjHidden()).toEqual(DEFAULT_HIDDEN);
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
    expect(once).toEqual(hide("status"));
    expect(togglePart(once, "relationships")).toEqual(hide("status", "relationships"));
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
