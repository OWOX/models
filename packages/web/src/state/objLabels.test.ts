import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadObjLabelMode,
  persistObjLabelMode,
  showInputSource,
  showFieldCount,
  type ObjLabelMode,
} from "./objLabels";

const MODES: ObjLabelMode[] = ["all", "noSource", "noFields", "both"];

describe("objLabels persistence", () => {
  beforeEach(() => localStorage.clear());

  it("defaults to 'all' when nothing is stored", () => {
    expect(loadObjLabelMode()).toBe("all");
  });

  it("round-trips each valid mode", () => {
    for (const m of MODES) {
      persistObjLabelMode(m);
      expect(loadObjLabelMode()).toBe(m);
    }
  });

  it("falls back to 'all' for an unrecognised stored value", () => {
    localStorage.setItem("mc.objLabels.v1", "bogus");
    expect(loadObjLabelMode()).toBe("all");
  });

  it("tolerates a throwing localStorage on persist", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => persistObjLabelMode("both")).not.toThrow();
    spy.mockRestore();
  });
});

describe("showInputSource", () => {
  it("shows the source chip+stripe only in all / noFields", () => {
    expect(showInputSource("all")).toBe(true);
    expect(showInputSource("noFields")).toBe(true);
    expect(showInputSource("noSource")).toBe(false);
    expect(showInputSource("both")).toBe(false);
  });
});

describe("showFieldCount", () => {
  it("shows the field count only in all / noSource", () => {
    expect(showFieldCount("all")).toBe(true);
    expect(showFieldCount("noSource")).toBe(true);
    expect(showFieldCount("noFields")).toBe(false);
    expect(showFieldCount("both")).toBe(false);
  });
});
