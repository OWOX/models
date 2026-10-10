import { describe, it, expect, afterEach, vi } from "vitest";
import { loadExportFormat, persistExportFormat } from "./exportFormat";

describe("exportFormat", () => {
  afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

  it("defaults to okf", () => {
    expect(loadExportFormat()).toBe("okf");
  });

  it("round-trips ossie under mc.exportFormat.v1", () => {
    persistExportFormat("ossie");
    expect(localStorage.getItem("mc.exportFormat.v1")).toBe("ossie");
    expect(loadExportFormat()).toBe("ossie");
  });

  it("falls back to okf for an unknown stored value", () => {
    localStorage.setItem("mc.exportFormat.v1", "xml");
    expect(loadExportFormat()).toBe("okf");
  });

  it("does not throw when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("denied"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("denied"); });
    expect(loadExportFormat()).toBe("okf");
    expect(() => persistExportFormat("ossie")).not.toThrow();
  });
});
