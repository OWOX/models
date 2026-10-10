import { describe, it, expect, beforeEach } from "vitest";
import { DEFAULT_MODEL_NAME, templateModelName, loadModelName, migrateModelName } from "./modelName";

describe("model names", () => {
  beforeEach(() => localStorage.clear());
  it("uses the data model wording", () => {
    expect(DEFAULT_MODEL_NAME).toBe("My awesome data model");
    expect(templateModelName("SaaS")).toBe("My SaaS data model with OWOX");
  });
  it("falls back to the default for empty storage", () => {
    expect(loadModelName()).toBe("My awesome data model");
  });
  it("migrates both old default names", () => {
    for (const old of ["My first OKF with OWOX", "My first data model with OWOX"]) {
      localStorage.setItem("mc.modelName.v1", old);
      expect(loadModelName()).toBe(DEFAULT_MODEL_NAME);
    }
  });
  it("migrates old template names to the data model wording", () => {
    localStorage.setItem("mc.modelName.v1", "My Healthcare OKF with OWOX");
    expect(loadModelName()).toBe("My Healthcare data model with OWOX");
    expect(migrateModelName("My SaaS / Subscription OKF with OWOX")).toBe("My SaaS / Subscription data model with OWOX");
  });
  it("leaves custom names untouched", () => {
    localStorage.setItem("mc.modelName.v1", "Acme sales");
    expect(loadModelName()).toBe("Acme sales");
    expect(migrateModelName("My first OKF with OWOX!")).toBe("My first OKF with OWOX!");
  });
});
