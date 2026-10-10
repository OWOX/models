import { describe, it, expect } from "vitest";
import { ossieToCanvasType, canvasToOssieType, readOwoxExt, owoxExt, pickExpression, aiContextText } from "../src/ossie/types";
describe("ossie types", () => {
  it("maps datatypes both ways", () => {
    expect(ossieToCanvasType("Decimal")).toBe("NUMERIC");
    expect(ossieToCanvasType("DateTimeTz")).toBe("TIMESTAMP");
    expect(ossieToCanvasType(undefined)).toBe("STRING");
    expect(canvasToOssieType("BIGNUMERIC")).toBe("Decimal");
    expect(canvasToOssieType("GEOGRAPHY")).toBe("Opaque");
    expect(canvasToOssieType("TIMESTAMP")).toBe("DateTimeTz");
  });
  it("reads and writes the OWOX vendor extension", () => {
    expect(owoxExt({ a: undefined })).toBeUndefined();
    const ext = owoxExt({ alias: "cust", x: 1 })!;
    expect(ext).toEqual([{ vendor_name: "OWOX", data: '{"alias":"cust","x":1}' }]);
    expect(readOwoxExt([{ vendor_name: "DBT", data: "{}" }, ...ext])).toEqual({ alias: "cust", x: 1 });
    expect(readOwoxExt([{ vendor_name: "OWOX", data: "not json" }])).toEqual({});
  });
  it("picks the BigQuery dialect, else the first", () => {
    expect(pickExpression({ dialects: [{ dialect: "ANSI_SQL", expression: " a " }, { dialect: "BIGQUERY", expression: "b" }] })).toBe("b");
    expect(pickExpression({ dialects: [{ dialect: "SNOWFLAKE", expression: "c" }] })).toBe("c");
    expect(pickExpression(undefined)).toBe("");
  });
  it("renders ai_context as text", () => {
    expect(aiContextText("orders, sales")).toBe("AI context: orders, sales");
    expect(aiContextText({ instructions: "Use for X", synonyms: ["a", "b"], examples: ["q1", "q2"] }))
      .toBe("AI instructions: Use for X\nSynonyms: a, b\nExample questions: q1; q2");
    expect(aiContextText(undefined)).toBe("");
  });
});

import { readOwoxExt as _r, pickExpression as _p, aiContextText as _a } from "../src/index";
describe("Ossie guards against malformed values", () => {
  it("readOwoxExt ignores non-arrays and JSON arrays", () => {
    expect(_r("foo" as never)).toEqual({});
    expect(_r([{ vendor_name: "OWOX", data: "[1]" }])).toEqual({});
    expect(_r([null, { vendor_name: "OWOX", data: '{"a":1}' }] as never)).toEqual({ a: 1 });
  });
  it("pickExpression ignores non-string expressions", () => {
    expect(_p({ dialects: [{ dialect: "X", expression: 5 }, { dialect: "Y", expression: " a " }] } as never)).toBe("a");
  });
  it("aiContextText keeps only strings", () => {
    expect(_a({ synonyms: "foo", examples: ["q", 1], instructions: 2 })).toBe("Example questions: q");
  });
});
