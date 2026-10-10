import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { formulaLevel } from "@mc/okf";
import { parseOssie } from "@mc/okf/ossie";

// The worked example from public/ossie-format.md. If the parser or the page
// drift apart, this fails.
const page = readFileSync(resolve(__dirname, "../../public/ossie-format.md"), "utf8");
const block = /```yaml\n([\s\S]*?)```/.exec(page)?.[1] ?? "";

describe("ossie-format.md — worked example imports", () => {
  const res = block ? parseOssie(block) : null;

  it("has a yaml example", () => {
    expect(block.length).toBeGreaterThan(0);
  });

  it("parses 2 datasets and 1 relationship", () => {
    expect(res!.graph.nodes).toHaveLength(2);
    expect(res!.graph.edges).toHaveLength(1);
  });

  it("parses 1 metric and 1 computed field", () => {
    const fields = res!.graph.nodes.flatMap(n => n.schema).filter(f => f.formula);
    expect(fields.filter(f => formulaLevel(f.formula!) === "metric")).toHaveLength(1);
    expect(fields.filter(f => formulaLevel(f.formula!) === "column")).toHaveLength(1);
  });

  it("imports without warnings", () => {
    expect(res!.warnings).toEqual([]);
  });
});
