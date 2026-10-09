import { describe, it, expect } from "vitest";
import { DEFAULT_MODEL_NAME, templateModelName } from "./modelName";

describe("model names", () => {
  it("uses the data model wording", () => {
    expect(DEFAULT_MODEL_NAME).toBe("My first data model with OWOX");
    expect(templateModelName("SaaS")).toBe("My SaaS data model with OWOX");
  });
});
