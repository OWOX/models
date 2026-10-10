import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as main from "../src/index";
import * as ossie from "../src/ossie";

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), "../src");

// Every module reachable from an entry through relative imports.
function reachable(entry: string): Map<string, string[]> {
  const seen = new Map<string, string[]>();
  const walk = (file: string) => {
    if (seen.has(file)) return;
    const text = readFileSync(file, "utf8");
    const specs = [...text.matchAll(/^\s*(?:import|export)\s[^;]*?from\s+"([^"]+)"/gm)].map(m => m[1]);
    seen.set(file, specs);
    for (const s of specs) if (s.startsWith(".")) walk(resolve(dirname(file), s) + (s.endsWith(".ts") ? "" : ".ts"));
  };
  walk(entry);
  return seen;
}

describe("entry split", () => {
  it("the main entry never reaches the yaml package", () => {
    expect(reachable(resolve(SRC, "ossie/index.ts")).get(resolve(SRC, "ossie/sniff.ts"))).toContain("yaml"); // the walker sees it
    const offenders = [...reachable(resolve(SRC, "index.ts"))].filter(([, specs]) => specs.includes("yaml")).map(([f]) => f);
    expect(offenders).toEqual([]);
  });
  it("the Ossie functions are only in the ossie entry", () => {
    expect("parseOssie" in main).toBe(false);
    expect("serializeOssie" in main).toBe(false);
    expect("isOssieModelText" in main).toBe(false);
    expect(typeof ossie.parseOssie).toBe("function");
    expect(typeof ossie.serializeOssie).toBe("function");
    expect(typeof ossie.isOssieModelText).toBe("function");
    expect(typeof main.detectModelFormat).toBe("function");
  });
});
